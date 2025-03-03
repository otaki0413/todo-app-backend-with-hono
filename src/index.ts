import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { prettyJSON } from 'hono/pretty-json';
import api from './api';
import { Bindings } from './bindings';

/**
 * メインのアプリケーションインスタンスを作成
 */
const app = new Hono();

// ルートパスへのアクセス用エンドポイント
app.get('/', (c) => c.text('Pretty Todo App API'));

// 404エラーハンドリング - 存在しないエンドポイントへのアクセス時の処理
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

/**
 * ミドルウェアの設定
 * - JSONレスポンスの整形
 * - Basic認証の実装
 */
const middleware = new Hono<{ Bindings: Bindings }>();

// レスポンスJSONを見やすく整形するミドルウェアを全エンドポイントに適用
middleware.use('*', prettyJSON());

/**
 * Basic認証ミドルウェアの設定
 * - GETリクエスト以外のすべてのTodo操作に認証を要求
 * - username: test
 * - password: test123
 */
middleware.use('/todos/*', async (c, next) => {
  if (c.req.method !== 'GET') {
    const auth = basicAuth({ username: 'test', password: 'test123' });
    return auth(c, next);
  } else {
    await next();
  }
});

// ミドルウェアとAPIルートの設定
app.route('/api', middleware);
app.route('/api', api);

export default app;
