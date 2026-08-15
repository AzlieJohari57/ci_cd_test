import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

describe('todo API', () => {
  test('GET /api/health returns ok', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  test('GET /api/todos returns seeded todo', async () => {
    const app = createApp();
    const res = await request(app).get('/api/todos');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
  });

  test('POST /api/todos creates a todo', async () => {
    const app = createApp();
    const res = await request(app).post('/api/todos').send({ title: 'Write tests' });
    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'Write tests');
    assert.equal(res.body.done, false);

    const list = await request(app).get('/api/todos');
    assert.equal(list.body.length, 2);
  });

  test('POST /api/todos rejects empty title', async () => {
    const app = createApp();
    const res = await request(app).post('/api/todos').send({ title: '   ' });
    assert.equal(res.status, 400);
  });

  test('PUT /api/todos/:id updates a todo', async () => {
    const app = createApp();
    const created = await request(app).post('/api/todos').send({ title: 'Toggle me' });
    const res = await request(app)
      .put(`/api/todos/${created.body.id}`)
      .send({ done: true });
    assert.equal(res.status, 200);
    assert.equal(res.body.done, true);
  });

  test('PUT /api/todos/:id 404s for missing todo', async () => {
    const app = createApp();
    const res = await request(app).put('/api/todos/9999').send({ done: true });
    assert.equal(res.status, 404);
  });

  test('DELETE /api/todos/:id removes a todo', async () => {
    const app = createApp();
    const created = await request(app).post('/api/todos').send({ title: 'Delete me' });
    const res = await request(app).delete(`/api/todos/${created.body.id}`);
    assert.equal(res.status, 204);

    const list = await request(app).get('/api/todos');
    assert.equal(list.body.find((t) => t.id === created.body.id), undefined);
  });
});
