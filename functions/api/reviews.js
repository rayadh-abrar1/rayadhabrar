import { json, listReviews, publicView } from '../_lib/reviews.js';

// GET /api/reviews: approved reviews only.
export async function onRequestGet({ env }) {
  if (!env.REVIEWS) return json({ reviews: [] });
  const reviews = (await listReviews(env.REVIEWS)).filter((r) => r.status === 'approved').map(publicView);
  return json({ reviews });
}

const clean = (value, max) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

// POST /api/reviews: store a new review as pending until it is approved.
export async function onRequestPost({ request, env }) {
  if (!env.REVIEWS) return json({ error: 'Reviews are not set up yet. Please email your review instead.' }, 503);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  // Bots fill the hidden field; accept silently and drop it.
  if (body.website) return json({ ok: true });

  const rating = Number(body.rating);
  const text = clean(body.text, 600);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: 'Please choose a star rating.' }, 400);
  if (text.length < 10) return json({ error: 'Please write a little more feedback.' }, 400);

  // Allow a few reviews per visitor per hour.
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const limitKey = 'limit:' + [...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
  const count = Number((await env.REVIEWS.get(limitKey)) || 0);
  if (count >= 3) return json({ error: 'Thanks! You have already sent a few reviews. Please try again later.' }, 429);
  await env.REVIEWS.put(limitKey, String(count + 1), { expirationTtl: 3600 });

  const id = crypto.randomUUID();
  const review = {
    id,
    rating,
    text,
    name: clean(body.name, 40),
    about: clean(body.about, 80),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  await env.REVIEWS.put('review:' + id, JSON.stringify(review));
  return json({ ok: true }, 201);
}
