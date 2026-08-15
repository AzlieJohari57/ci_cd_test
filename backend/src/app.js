import express from 'express';
import cors from 'cors';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // In-memory store. Resets whenever the process restarts.
  let todos = [
    { id: 1, title: 'Learn how CI/CD pipelines work', done: false },
  ];
  let nextId = 2;

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/todos', (req, res) => {
    res.json(todos);
  });

  app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    const todo = { id: nextId++, title: title.trim(), done: false };
    todos.push(todo);
    res.status(201).json(todo);
  });

  app.put('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).json({ error: 'todo not found' });
    }
    const { title, done } = req.body;
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'title must be a non-empty string' });
      }
      todo.title = title.trim();
    }
    if (done !== undefined) {
      todo.done = Boolean(done);
    }
    res.json(todo);
  });

  app.delete('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'todo not found' });
    }
    todos.splice(index, 1);
    res.status(204).end();
  });

  return app;
}
