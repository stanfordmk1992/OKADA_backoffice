# M12 報表(Reports)— 模塊內容與操作流程(產品)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

## 模塊說明

財務與營運報表:無現金負債、資金交易、遊戲投注紀錄、營收、玩家帳戶交易(含舊版無現金負債與舊版營收),以及非同步匯出的下載中心。

## 頁面一覽

| 頁面 | 名稱 | 類型 | 路由 | 主要操作 |
|---|---|---|---|---|
| M12-P01 | cashless-liability-old | 列表 | `/reports/cashless-liability-old/list` | Download CSV、Search、View |
| M12-P02 | Player Cashless Liability | 詳情 | `/reports/cashless-liability-old/view/:id` | Clear、Download CSV、Search、Edit |
| M12-P03 | Cashless Liability Report | 列表 | `/reports/cashless-liability/list` | Download CSV、Search、View |
| M12-P04 | Player Cashless Liability | 詳情 | `/reports/cashless-liability/view/:id` | Clear、Download CSV、Search、Edit |
| M12-P05 | Download Center | 列表 | `/reports/download-center/list` | Clear、Search |
| M12-P06 | Fund Transactions Report | 列表 | `/reports/fund-transaction/list` | Clear、Download CSV、Search |
| M12-P07 | Game Report | 列表 | `/reports/game-report/list` | Clear、Download CSV、Search |
| M12-P08 | Player Account Transaction Report | 列表 | `/reports/player-account-transaction/list` | Clear、Download CSV、Search、View |
| M12-P09 | Player Cashless Liability | 詳情 | `/reports/player-account-transaction/view/:id` | Clear、Download CSV、Search、Edit |
| M12-P10 | revenue-old | 列表 | `/reports/revenue-old/list` | Clear、Download CSV、Search |
| M12-P11 | Revenue Report | 列表 | `/reports/revenue/list` | Clear、Download CSV、Search |

## 頁面流程圖

```mermaid
flowchart LR
  subgraph G1["cashless-liability-old"]
    M12_P01["M12-P01 列表"]
    M12_P02["M12-P02 詳情"]
  end
  M12_P01 -->|檢視| M12_P02
  subgraph G2["Cashless Liability Report"]
    M12_P03["M12-P03 列表"]
    M12_P04["M12-P04 詳情"]
  end
  M12_P03 -->|檢視| M12_P04
  subgraph G3["Download Center"]
    M12_P05["M12-P05 列表"]
  end
  M12_P05 -.-> M12_P05_9871(["查看產出紀錄"])
  M12_P05 -.-> M12_P05_2967(["重新產生報表檔"])
  subgraph G4["Fund Transactions Report"]
    M12_P06["M12-P06 列表"]
  end
  subgraph G5["Game Report"]
    M12_P07["M12-P07 列表"]
  end
  subgraph G6["Player Account Transaction Report"]
    M12_P08["M12-P08 列表"]
    M12_P09["M12-P09 詳情"]
  end
  M12_P08 -->|檢視| M12_P09
  subgraph G7["revenue-old"]
    M12_P10["M12-P10 列表"]
  end
  subgraph G8["Revenue Report"]
    M12_P11["M12-P11 列表"]
  end
```

## 頁面內容與操作說明

### M12-P01 cashless-liability-old(列表)

- 路由:`/reports/cashless-liability-old/list`  權限:`view:cashless-liability-report`
- 功能點:M12-F01 查詢列表、M12-F02 欄位排序、M12-F03 分頁、M12-F04 匯出
- 表格欄位:Gaming Date、Total Wallets、iGaming Wallet、iGaming Bonus Wallet、Total Provider Wallet、Actions
- 篩選條件:Cashless Liability Report - Old、Items per page(欄位規則見 03 開發欄位控制)
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_cashless-liability-old_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/report/cashless/list)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 按「Download CSV / Download」匯出目前查詢結果

### M12-P02 Player Cashless Liability(詳情)

- 路由:`/reports/cashless-liability-old/view/:id`  權限:`view:cashless-liability-report`
- 功能點:M12-F05 檢視詳情
- 表格欄位:Player ID、iGaming Wallet、iGaming Bonus Wallet、Total Provider Wallet、Gaming Date
- 表單欄位:Search Player ID、Items per page(欄位規則見 03 開發欄位控制)
- 選單位置:由列表進入;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_cashless-liability-old_view_id.png`

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/report/cashless/player/list)
2. 按「Edit」進入編輯頁

### M12-P03 Cashless Liability Report(列表)

- 路由:`/reports/cashless-liability/list`  權限:`view:cashless-liability-report`
- 功能點:M12-F06 查詢列表、M12-F07 欄位排序、M12-F08 分頁、M12-F09 匯出
- 表格欄位:Gaming Date、Total Wallets、iGaming Wallet、iGaming Bonus Wallet、Total Provider Wallet、Actions
- 篩選條件:Cashless Liability Report、Items per page(欄位規則見 03 開發欄位控制)
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_cashless-liability_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/report/cashless/list)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 按「Download CSV / Download」匯出目前查詢結果

### M12-P04 Player Cashless Liability(詳情)

- 路由:`/reports/cashless-liability/view/:id`  權限:`view:cashless-liability-report`
- 功能點:M12-F10 檢視詳情
- 表格欄位:Player ID、iGaming Wallet、iGaming Bonus Wallet、Total Provider Wallet、Gaming Date
- 表單欄位:Search Player ID、Items per page(欄位規則見 03 開發欄位控制)
- 選單位置:由列表進入;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_cashless-liability_view_id.png`

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/report/cashless/player/list)
2. 按「Edit」進入編輯頁

### M12-P05 Download Center(列表)

- 路由:`/reports/download-center/list`  權限:`view:download-center`
- 功能點:M12-F11 查詢列表、M12-F12 分頁、M12-F13 查看產出紀錄、M12-F14 重新產生報表檔
- 表格欄位:Report Name、Filters、Status、File Size、Requested By、Requested At、Expires At、Downloads、Actions
- 篩選條件:Report Name、Status、Requested From ~ Requested To、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「This export is not ready for download」、「Regenerate requested — this export will process again shortly」、「Downloading… {percent}%」、「Downloading…」
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_download-center_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/report/downloads、/report/downloads/:id/logs)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 重新產生報表檔(POST /report/downloads/:id/regenerate)

### M12-P06 Fund Transactions Report(列表)

- 路由:`/reports/fund-transaction/list`  權限:`view:fund-transaction-report`
- 功能點:M12-F15 查詢列表、M12-F16 欄位排序、M12-F17 分頁、M12-F18 匯出
- 表格欄位:Player ID、Transaction Type、Wallet From、Wallet To、Ref ID、Transaction Date、Status、Before Balance、Transaction Amount、After Balance、Remarks
- 篩選條件:Fund Transactions Report、Player ID、Transaction Type、Status、Ref ID、Items per page(欄位規則見 03 開發欄位控制)
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_fund-transaction_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/report/fund_transaction/list、/report/fund_transaction/trasaction_type_list)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 按「Download CSV / Download」匯出目前查詢結果

### M12-P07 Game Report(列表)

- 路由:`/reports/game-report/list`  權限:`view:games-report`
- 功能點:M12-F19 查詢列表、M12-F20 分頁、M12-F21 匯出
- 條件顯示的欄位:Settlement Start Date & Time ~ Settlement End Date & Time(Date Filter Type 選 Settlement 時顯示(預設為 Transaction))
- 篩選條件:Provider、Game、Game Offering、Player ID、Options、Date Filter Type、Transaction Start Date & Time ~ Transaction End Date & Time、Settlement Start Date & Time ~ Settlement End Date & Time、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「fetching providers」、「fetching games」、「fetching game reports」、「Filters cleared successfully」、「No data available to download」、「Your export is processing — track it in Download Center」、「CSV downloaded successfully」、「downloading game report CSV」
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_game-report_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/report/game_records/:id、/get_e_provider_list、/game_offerings_dropdown、/get_game_list)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 按「Download CSV / Download」匯出目前查詢結果

### M12-P08 Player Account Transaction Report(列表)

- 路由:`/reports/player-account-transaction/list`  權限:`view:player-account-transaction-report`
- 功能點:M12-F22 查詢列表、M12-F23 欄位排序、M12-F24 分頁、M12-F25 匯出
- 表格欄位:ID、Player ID、Provider Name、Turnover、Actual Win、Ref ID、Transaction Date Time
- 篩選條件:Player Account Transaction Report、Player ID、Items per page(欄位規則見 03 開發欄位控制)
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_player-account-transaction_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/lookup/players、/report/player-account-transaction/:id)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 按「Download CSV / Download」匯出目前查詢結果

### M12-P09 Player Cashless Liability(詳情)

- 路由:`/reports/player-account-transaction/view/:id`  權限:`view:cashless-liability-report`
- 功能點:M12-F26 檢視詳情
- 表格欄位:Player ID、iGaming Wallet、iGaming Bonus Wallet、Total Provider Wallet、Gaming Date
- 表單欄位:Search Player ID、Items per page(欄位規則見 03 開發欄位控制)
- 選單位置:由列表進入;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_player-account-transaction_view_id.png`

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/report/cashless/player/list)
2. 按「Edit」進入編輯頁

### M12-P10 revenue-old(列表)

- 路由:`/reports/revenue-old/list`  權限:`view:revenue-report`
- 功能點:M12-F27 查詢列表、M12-F28 分頁、M12-F29 匯出
- 表格欄位:
- 篩選條件:Provider、Game Category、Game Offering、Game、End Date、Most Recent、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「An unexpected error occurred」、「Filters cleared successfully」、「CSV downloaded successfully」
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_revenue-old_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/get_e_provider_list、/game_offerings_dropdown、/report/revenue、/get_game_list)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 按「Download CSV / Download」匯出目前查詢結果

### M12-P11 Revenue Report(列表)

- 路由:`/reports/revenue/list`  權限:`view:revenue-report`
- 功能點:M12-F30 查詢列表、M12-F31 分頁、M12-F32 匯出
- 表格欄位:
- 篩選條件:Provider、Game Category、Game Offering、Game、End Date、Most Recent、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「An unexpected error occurred」、「Filters cleared successfully」、「CSV downloaded successfully」
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/reports_revenue_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/get_e_provider_list、/game_offerings_dropdown、/report/revenue、/get_game_list)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 按「Download CSV / Download」匯出目前查詢結果

