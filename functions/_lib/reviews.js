// Shared helpers for the review API. Reviews live in the REVIEWS KV namespace
// under keys "review:<id>"; each value is JSON with a status of pending or approved.

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export async function listReviews(kv) {
  const reviews = [];
  let cursor;
  do {
    const page = await kv.list({ prefix: 'review:', cursor });
    for (const key of page.keys) {
      const value = await kv.get(key.name, 'json');
      if (value) reviews.push(value);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const publicView = ({ id, rating, text, name, about, createdAt }) => ({ id, rating, text, name, about, createdAt });
