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

## 實機只讀查驗(需人工登入)

```
cd tools/inventory
npm install                      # 第一次:安裝 playwright-core(使用本機 Chrome)
node live.mjs                    # 開出 Chrome 視窗 → 人工登入 → 自動逐頁查驗
node live.mjs --only-skipped     # 只重跑上次略過的頁面(例如 dev 有資料後)
node compare.cjs                 # 實機結果 vs 靜態盤點 → live/compare.json
node gen.cjs ../../docs/inventory
```

- 安全:登入完成後,所有送往 API 的 POST/PUT/PATCH/DELETE 都會被攔截,`live/blocked.json` 記錄攔截次數。
- 登入狀態存在 `C:\Users\Stanf\.okada-playwright-profile`,過期時重新登入即可。
- 截圖存在 `.playwright-output/live/`,`live/` 內含實機資料片段,兩者都不進 git。
- 比對有差異時:對照截圖,把顯示條件、正確名稱寫進 `overrides.cjs`(開發),再重跑 `compare.cjs` 與 `gen.cjs`。

## 檔案

| 檔案 | 用途 | 誰維護 |
|---|---|---|
| `modules.cjs` | 功能模塊分類與說明 | 項管 |
| `overrides.cjs` | 靜態分析抓不到、由人工閱讀程式補全的欄位資訊 | 開發 |
| `gen.cjs` | 文件產生器(含測試的靜態一致性檢查) | 開發 |
| `fetch.mjs`、`loadi18n.cjs`、`extract.cjs` | 下載與分析 | 開發 |

下載的 bundle 與中間檔(`all/`、`entry.js`、`*.json` 等)不進 git。

**`docs/inventory/` 由工具產生,不要手改。** 要更正內容就改 `modules.cjs` 或 `overrides.cjs`,再重新產生。架構圖 `03-dev/architecture.md` 例外,它是手寫的。
