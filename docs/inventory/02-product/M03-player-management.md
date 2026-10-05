# M03 玩家管理(Player Management)— 模塊內容與操作流程(產品)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

## 模塊說明

查詢玩家清單與詳情(含各錢包餘額、轉回主錢包),停用/啟用玩家,審核玩家提出的個人資料修改申請。

## 頁面一覽

| 頁面 | 名稱 | 類型 | 路由 | 主要操作 |
|---|---|---|---|---|
| M03-P01 | Player Profile Update Requests | 列表 | `/player-profile-update-requests/list` | Clear、Search、View、Cancel、Confirm |
| M03-P02 | Player Profile Update Requests | 詳情 | `/player-profile-update-requests/view/:id` | Back、Cancel、Confirm |
| M03-P03 | Player List | 列表 | `/players/list` | Clear、Search、View |
| M03-P04 | players | 詳情 | `/players/view/:id` | Refresh、Transfer |

## 頁面流程圖

```mermaid
flowchart LR
  subgraph G1["Player Profile Update Requests"]
    M03_P01["M03-P01 列表"]
    M03_P02["M03-P02 詳情"]
  end
  M03_P01 -->|檢視| M03_P02
  M03_P01 -.-> M03_P01_2016(["核准申請"])
  M03_P01 -.-> M03_P01_163(["駁回申請"])
  M03_P02 -.-> M03_P02_2016(["核准申請"])
  M03_P02 -.-> M03_P02_163(["駁回申請"])
  subgraph G2["Player List"]
    M03_P03["M03-P03 列表"]
    M03_P04["M03-P04 詳情"]
  end
  M03_P03 -->|檢視| M03_P04
  M03_P03 -.-> M03_P03_8060(["啟用/停用切換"])
  M03_P04 -.-> M03_P04_4820(["重新整理錢包餘額"])
  M03_P04 -.-> M03_P04_1079(["將子錢包餘額轉回"])
```

## 頁面內容與操作說明

### M03-P01 Player Profile Update Requests(列表)

- 路由:`/player-profile-update-requests/list`  權限:`view:player-profile-update-requests`
- 功能點:M03-F01 查詢列表、M03-F02 欄位排序、M03-F03 分頁、M03-F04 核准申請、M03-F05 駁回申請
- 表格欄位:Request No.、Player ID、Player Name、Request Type、Status、Submitted At、Actions
- 篩選條件:Player ID、Request Type、Status、Start Date ~ End Date、Items per page、Admin Password、Rejection Reason(欄位規則見 03 開發欄位控制)
- 系統提示:「Request approved successfully」、「Failed to approve request」、「Request rejected successfully」、「Failed to reject request」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/player/profile-update-request)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 核准申請(POST /player/profile-update-request/:id/approve)
5. 駁回申請(POST /player/profile-update-request/:id/reject)

### M03-P02 Player Profile Update Requests(詳情)

- 路由:`/player-profile-update-requests/view/:id`  權限:`view:player-profile-update-requests`
- 功能點:M03-F06 檢視詳情、M03-F07 核准申請、M03-F08 駁回申請
- 表單欄位:Admin Password、Rejection Reason(欄位規則見 03 開發欄位控制)
- 系統提示:「Request approved successfully」、「Failed to approve request」、「Request rejected successfully」、「Failed to reject request」
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/player/profile-update-request/:id)
2. 核准申請(POST /player/profile-update-request/:id/approve)
3. 駁回申請(POST /player/profile-update-request/:id/reject)

### M03-P03 Player List(列表)

- 路由:`/players/list`  權限:`view:players`
- 功能點:M03-F09 查詢列表、M03-F10 欄位排序、M03-F11 分頁、M03-F12 啟用/停用切換
- 表格欄位:ID、Player ID、Email、Status、Referral Code、Upline、Actions
- 篩選條件:Player ID、Email、Status、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「Player status changed successfully」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/players)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 啟用/停用切換(PUT /players/status/:id)

### M03-P04 players(詳情)

- 路由:`/players/view/:id`  權限:`view:players`
- 功能點:M03-F13 檢視詳情、M03-F14 重新整理錢包餘額、M03-F15 將子錢包餘額轉回
- 表格欄位:Wallet Id、Wallet Name、Balance、Created At、Updated At、Actions
- 系統提示:「Wallet transferred back successfully」
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/players/:id/wallets、/players/:id、/players/:id/wallets/transfer_back)
2. 重新整理錢包餘額(POST /players/:id/wallets/refresh)

