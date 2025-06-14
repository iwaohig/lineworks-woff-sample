# LINE WORKS WOFF Sample

LINE WORKS Web Office Function Framework (WOFF) のサンプルアプリケーションです。来訪者登録機能を実装した実用的なサンプルとして利用できます。

## 機能概要

- **ユーザー認証**: LINE WORKS ユーザーの認証とプロフィール取得
- **来訪者登録**: 来訪者情報の入力と外部APIへの送信
- **フォームバリデーション**: 入力データの検証
- **レスポンシブデザイン**: モバイルデバイス対応
- **デバッグ機能**: 開発時のデバッグ情報表示

## ファイル構成

```
lineworks-woff-sample/
├── index.html          # メインのHTMLファイル
├── styles.css          # スタイルシート
├── app.js              # JavaScriptアプリケーション
└── README.md           # このファイル
```

## GitHub Pages デモ

このサンプルアプリは GitHub Pages で公開されています：

**デモURL**: https://iwaoh.github.io/lineworks-woff-sample/

### GitHub Pagesでの公開方法

1. **リポジトリのフォーク**
   ```bash
   # このリポジトリをフォークまたはクローン
   git clone https://github.com/iwaoh/lineworks-woff-sample.git
   cd lineworks-woff-sample
   ```

2. **GitHub リポジトリの作成**
   - GitHubで新しいリポジトリを作成
   - ローカルのコードをプッシュ

3. **GitHub Pages の有効化**
   - リポジトリの Settings > Pages
   - Source を "GitHub Actions" に設定
   - 自動デプロイが開始されます

4. **カスタムドメインの設定 (オプション)**
   - `CNAME` ファイルを編集
   - Settings > Pages でカスタムドメインを設定

### 自動デプロイ

- `main` ブランチへのプッシュで自動デプロイ
- GitHub Actions ワークフローが自動実行
- デプロイ完了後に GitHub Pages URL でアクセス可能

## セットアップ

### 1. WOFF IDの設定

`app.js` ファイルの `CONFIG` オブジェクトで WOFF ID を設定してください：

```javascript
const CONFIG = {
    WOFF_ID: "YOUR_WOFF_ID_HERE", // 実際のWOFF IDに置き換え
    API_ENDPOINT: "YOUR_API_ENDPOINT_HERE", // APIエンドポイントのURL
    DEBUG_MODE: true
};
```

### 2. APIエンドポイントの設定

フォームデータを送信する先のAPIエンドポイントを設定してください。

### 3. LINE WORKS管理画面での設定

1. LINE WORKS管理画面にログイン
2. 開発者コンソール > WOFF アプリ
3. 新しいWOFFアプリを作成
4. 作成したアプリのWOFF IDを取得
5. HTMLファイルをホスティング環境にアップロード
6. WOFFアプリの設定でHTMLファイルのURLを指定

## 使用方法

### 基本的な流れ

1. LINE WORKSアプリ内からWOFFアプリを起動
2. ユーザー認証が自動的に実行される
3. プロフィール情報が自動取得される
4. 来訪者情報を入力
5. 「登録」ボタンで外部APIに送信

### フォーム項目

- **来訪者名** (必須): 来訪者の氏名
- **会社名**: 来訪者の所属会社
- **訪問日時** (必須): 来訪予定日時
- **訪問目的**: 来訪の目的や詳細（255文字以内）
- **担当者**: 社内の担当者名

## API仕様

### 送信データ形式

```json
{
  "timestamp": "2024-06-10T12:00:00.000Z",
  "userInfo": {
    "displayName": "田中太郎",
    "userId": "user001"
  },
  "visitorName": "山田花子",
  "company": "株式会社サンプル",
  "visitDateTime": "2024-06-10T14:00",
  "visitDetails": "新規プロジェクトの打ち合わせ",
  "contactPerson": "佐藤次郎"
}
```

### HTTPヘッダー

- `Content-Type`: `application/json`
- `Authorization`: `Bearer {アクセストークン}` (取得できた場合)

## カスタマイズ

### スタイルのカスタマイズ

`styles.css` を編集してデザインをカスタマイズできます：

- LINE WORKSブランドカラー (`#00b900`) の変更
- レスポンシブデザインの調整
- アニメーション効果の追加/削除

### 機能の拡張

`app.js` を編集して機能を拡張できます：

- フォーム項目の追加
- バリデーションルールの変更
- API送信形式の変更
- エラーハンドリングの改善

### HTMLの構造変更

`index.html` を編集してUIを変更できます：

- フォーム項目の追加/削除
- レイアウトの変更
- 新しいセクションの追加

## トラブルシューティング

### よくある問題

1. **WOFF SDKの初期化エラー**
   - WOFF IDが正しく設定されているか確認
   - LINE WORKS管理画面でアプリが正しく設定されているか確認

2. **プロフィール取得エラー**
   - ユーザーがLINE WORKSにログインしているか確認
   - 適切な権限が設定されているか確認

3. **API送信エラー**
   - APIエンドポイントのURLが正しいか確認
   - CORSの設定が適切か確認
   - APIサーバーが正常に動作しているか確認

### デバッグ機能

開発者ツールのコンソールでデバッグ情報を確認できます：

```javascript
// デバッグモードの有効/無効
CONFIG.DEBUG_MODE = true;  // または false
```

## セキュリティ考慮事項

- アクセストークンは適切に管理してください
- APIエンドポイントにはHTTPSを使用してください
- 入力データのサニタイゼーションを実装してください
- CORS設定を適切に行ってください

## ライセンス

このサンプルコードはMITライセンスの下で提供されています。

## サポート

問題が発生した場合は、LINE WORKS開発者ドキュメントを参照するか、開発者コミュニティにお問い合わせください。

---

**注意**: このサンプルは教育目的で作成されています。本番環境で使用する場合は、適切なセキュリティ対策とエラーハンドリングを実装してください。