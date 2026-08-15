const BASE_URL = '/api/todos';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: () => fetch(BASE_URL).then(handle),
  create: (title) =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then(handle),
  update: (id, changes) =>
    fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    }).then(handle),
  remove: (id) => fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handle),
};
