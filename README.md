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

```bash
npm run deploy
```

## データベース

### テーブル作成

SQL ファイルは `sql/` ディレクトリに保存されています。

#### 本番環境（リモート）

```bash
# リモートのD1データベースにテーブルを作成
wrangler d1 execute todo-app-db --remote --file=./sql/schema.sql

# リモートのテーブル構造を確認
wrangler d1 execute todo-app-db --remote --command="SELECT * FROM sqlite_master WHERE type='table';"
```

#### 開発環境（ローカル）

```bash
# ローカルのD1データベースにテーブルを作成
wrangler d1 execute todo-app-db --local --file=./sql/schema.sql

# ローカルのテーブル構造を確認
wrangler d1 execute todo-app-db --local --command="SELECT * FROM sqlite_master WHERE type='table';"
```

注意:

1. ローカル環境で開発・テストを行う際は必ず`--local`フラグを使用
2. 本番環境（リモート）に反映する際は`--remote`フラグを使用
3. フラグを指定しない場合、デフォルトでリモートに対して実行されます
