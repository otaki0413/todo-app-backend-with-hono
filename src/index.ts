import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Get all todos
app.get('/todos', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM todos').all();
    console.log(results);
    return c.json(results);
  } catch (e) {
    return c.json({ err: (e as Error).message }, 500);
  }
});

// Create a todo
app.post('/todos', async (c) => {
  const { title } = await c.req.json();
  const { results } = await c.env.DB.prepare(
    'INSERT INTO todos (title) VALUES (?)'
  )
    .bind(title)
    .run();

  return c.json(results);
});

// Update a todo
app.put('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const { title } = await c.req.json();
  const { results } = await c.env.DB.prepare(
    'UPDATE todos SET title = ? WHERE id = ?'
  )
    .bind(title, id)
    .run();
  return c.json(results);
});

// Delete a todo
app.delete('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const { results } = await c.env.DB.prepare('DELETE FROM todos WHERE id = ?')
    .bind(id)
    .run();
  return c.json(results);
});

export default app;
