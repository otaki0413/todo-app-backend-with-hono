import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './bindings';

/**
 * Honoインスタンスの作成
 * Bindingsを型パラメータとして渡し、環境変数の型安全性を確保
 */
const api = new Hono<{ Bindings: Bindings }>();

// CORSミドルウェアの設定 - クロスオリジンリクエストを許可
api.use('/todos/*', cors());

// ヘルスチェック用のエンドポイント
api.get('/', (c) => c.json({ message: 'Hello World' }));

/**
 * Todo一覧を取得するエンドポイント
 * @returns {Array} すべてのTodoアイテム
 */
api.get('/todos', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM todos').all();
    return c.json(results);
  } catch (e) {
    // エラーが発生した場合は500エラーとメッセージを返す
    return c.json({ err: (e as Error).message }, 500);
  }
});

/**
 * 新しいTodoを作成するエンドポイント
 * @param {Object} request.body - リクエストボディ
 * @param {string} request.body.title - Todoのタイトル
 * @returns {Object} 処理結果
 */
api.post('/todos', async (c) => {
  const { title } = await c.req.json();
  // プリペアドステートメントを使用してSQLインジェクションを防止
  await c.env.DB.prepare('INSERT INTO todos (title) VALUES (?)')
    .bind(title)
    .run();
  return c.json({ ok: true });
});

/**
 * 既存のTodoを更新するエンドポイント
 * @param {string} id - 更新対象のTodoのID
 * @param {Object} request.body - リクエストボディ
 * @param {string} request.body.title - 更新後のタイトル
 * @returns {Object} 処理結果
 */
api.put('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const { title } = await c.req.json();
  await c.env.DB.prepare('UPDATE todos SET title = ? WHERE id = ?')
    .bind(title, id)
    .run();
  return c.json({ ok: true });
});

/**
 * Todoを削除するエンドポイント
 * @param {string} id - 削除対象のTodoのID
 * @returns {Object} 処理結果
 */
api.delete('/todos/:id', async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('DELETE FROM todos WHERE id = ?').bind(id).run();
  return c.json({ ok: true });
});

export default api;
