# 後台盤點工具

從後台前端的公開靜態檔(`/_nuxt/*.js`,不需登入)靜態分析出模塊、頁面、欄位、驗證規則、API,產生 `docs/inventory/`。

## 重新產生(後台改版後)

```
cd tools/inventory
node fetch.mjs       # 下載入口、路由表、全部 chunk(約 270 個檔)
node loadi18n.cjs    # 載入 en / zh / ph 語系字串
node extract.cjs     # 逐頁分析 → pages.json
node gen.cjs ../../docs/inventory
```

## 檔案

| 檔案 | 用途 | 誰維護 |
|---|---|---|
| `modules.cjs` | 功能模塊分類與說明 | 項管 |
| `overrides.cjs` | 靜態分析抓不到、由人工閱讀程式補全的欄位資訊 | 開發 |
| `gen.cjs` | 文件產生器(含測試的靜態一致性檢查) | 開發 |
| `fetch.mjs`、`loadi18n.cjs`、`extract.cjs` | 下載與分析 | 開發 |

下載的 bundle 與中間檔(`all/`、`entry.js`、`*.json` 等)不進 git。

**`docs/inventory/` 由工具產生,不要手改。** 要更正內容就改 `modules.cjs` 或 `overrides.cjs`,再重新產生。架構圖 `03-dev/architecture.md` 例外,它是手寫的。
