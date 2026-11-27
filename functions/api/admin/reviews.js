import { json, listReviews } from '../../_lib/reviews.js';

async function authorised(request, env) {
  const token = env.ADMIN_TOKEN;
  const given = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token || !given) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(token)),
    crypto.subtle.digest('SHA-256', enc.encode(given)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

// GET /api/admin/reviews: every review, pending and approved.
export async function onRequestGet({ request, env }) {
  if (!(await authorised(request, env))) return json({ error: 'Wrong password.' }, 401);
  if (!env.REVIEWS) return json({ error: 'The REVIEWS storage is not connected.' }, 503);
  return json({ reviews: await listReviews(env.REVIEWS) });
}

// POST /api/admin/reviews {id, action: "approve" | "hide" | "delete"}
export async function onRequestPost({ request, env }) {
  if (!(await authorised(request, env))) return json({ error: 'Wrong password.' }, 401);
  if (!env.REVIEWS) return json({ error: 'The REVIEWS storage is not connected.' }, 503);
  const { id, action } = await request.json().catch(() => ({}));
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'Unknown review.' }, 400);
  const key = 'review:' + id;
  const review = await env.REVIEWS.get(key, 'json');
  if (!review) return json({ error: 'Unknown review.' }, 404);
  if (action === 'delete') {
    await env.REVIEWS.delete(key);
  } else if (action === 'approve' || action === 'hide') {
    review.status = action === 'approve' ? 'approved' : 'pending';
    await env.REVIEWS.put(key, JSON.stringify(review));
  } else {
    return json({ error: 'Unknown action.' }, 400);
  }
  return json({ ok: true });
}
