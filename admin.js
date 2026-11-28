'use strict';

const login = document.querySelector('#login');
const tokenInput = document.querySelector('#token');
const status = document.querySelector('#admin-status');
const list = document.querySelector('#admin-list');
let token = '';
try { token = sessionStorage.getItem('reviewToken') || ''; } catch {}

async function api(method, body) {
  const response = await fetch('/api/admin/reviews', {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Error ${response.status}`);
  return data;
}

function button(label, action, id) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'button';
  b.textContent = label;
  b.addEventListener('click', async () => {
    if (action === 'delete' && !window.confirm('Delete this review for good?')) return;
    try { await api('POST', { id, action }); await load(); } catch (e) { status.textContent = e.message; }
  });
  return b;
}

async function load() {
  status.textContent = 'Loading…';
  try {
    const { reviews } = await api('GET');
    try { sessionStorage.setItem('reviewToken', token); } catch {}
    list.replaceChildren();
    if (!reviews.length) status.textContent = 'No reviews yet.';
    else status.textContent = `${reviews.filter((r) => r.status === 'pending').length} waiting for approval.`;
    for (const r of reviews) {
      const card = document.createElement('article');
      card.className = 'review-card';
      const head = document.createElement('p');
      head.className = 'review-by';
      head.textContent = `${r.status === 'approved' ? 'LIVE' : 'WAITING'} · ${'★'.repeat(r.rating)} · ${new Date(r.createdAt).toLocaleString()}`;
      const text = document.createElement('blockquote');
      text.textContent = r.text;
      const by = document.createElement('p');
      by.textContent = [r.name, r.about].filter(Boolean).join(' · ') || '(no name)';
      const actions = document.createElement('p');
      actions.className = 'admin-actions';
      actions.append(
        r.status === 'approved' ? button('Hide', 'hide', r.id) : button('Approve', 'approve', r.id),
        button('Delete', 'delete', r.id),
      );
      card.append(head, text, by, actions);
      list.append(card);
    }
  } catch (e) {
    status.textContent = e.message;
  }
}

login.addEventListener('submit', (event) => {
  event.preventDefault();
  token = tokenInput.value;
  load();
});

if (token) load();
