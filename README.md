## 開発環境のセットアップ

1. リポジトリをクローン

```bash
git clone [repository-url]
cd todo-app-backend-with-hono
```

2. 依存関係のインストール

```bash
npm install
```

3. Wrangler の設定

```bash
cp wrangler.example.jsonc wrangler.jsonc
```

4. `wrangler.jsonc`を編集し、必要な設定値を追加

   - `database_id`：D1 データベースの ID
   - その他必要な環境固有の設定

5. 開発サーバーの起動

```bash
npm run dev
```

```
npm run deploy
```
