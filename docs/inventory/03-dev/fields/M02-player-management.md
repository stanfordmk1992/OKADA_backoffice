# M02 玩家管理 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M02-P01 Player Profile Update Requests(列表)`/player-profile-update-requests/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Player ID | AppTextField | `player_id` | 否 |  |  | clearable="" | 頁面 |
| 2 | Request Type | VAutocomplete | `request_type` | 否 |  |  | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Status | VAutocomplete | `status` | 否 |  |  | clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 5 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |
| 6 | Admin Password | AppTextField |  | 是 | 自訂:This field is required |  | 顯示條件:核准/駁回確認對話框內,需輸入管理員密碼 type=o(A) | 人工補全 |
| 7 | Rejection Reason | VTextarea |  | 是 | 自訂:This field is required |  | 顯示條件:駁回對話框內 rows="3" | 人工補全 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Request No. | `request_no` | 是 |
| 2 | Player ID | `player_id` | 是 |
| 3 | Player Name | `player_name` | 否 |
| 4 | Request Type | `request_type` | 是 |
| 5 | Status | `status` | 是 |
| 6 | Submitted At | `created_at` | 是 |
| 7 | Actions | `actions` | 否 |

**API**:`GET /player/profile-update-request`、`POST /player/profile-update-request/:id/approve`、`POST /player/profile-update-request/:id/reject`

## M02-P02 Player Profile Update Requests(詳情)`/player-profile-update-requests/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Admin Password | AppTextField |  | 是 | 自訂:This field is required |  | 顯示條件:核准/駁回確認對話框內,需輸入管理員密碼 type=l(U) | 人工補全 |
| 2 | Rejection Reason | VTextarea |  | 是 | 自訂:This field is required |  | 顯示條件:駁回對話框內 rows="3" | 人工補全 |

**唯讀顯示欄位(實機畫面)**:Request No.、Player ID、Player Name、Request Type、Status、Submitted At、Reason、Current Value、New Value

**API**:`GET /player/profile-update-request/:id`、`POST /player/profile-update-request/:id/approve`、`POST /player/profile-update-request/:id/reject`

## M02-P03 Player List(列表)`/players/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Player ID | AppTextField | `name` | 否 |  |  | clearable="" | 頁面 |
| 2 | Email | AppTextField | `email` | 否 |  |  | clearable="" | 頁面 |
| 3 | Status | VAutocomplete | `active_status` | 否 |  | [{id:m.ACTIVE,name:"Active"},{id:m.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `player_id` | 是 |
| 2 | Player ID | `name` | 是 |
| 3 | Email | `email` | 是 |
| 4 | Status | `player_status.active_status` | 是 |
| 5 | Referral Code | `referral_code` | 否 |
| 6 | Upline | `player_upline` | 否 |
| 7 | Actions | `actions` | 否 |

**API**:`GET /players`、`PUT /players/status/:id`

## M02-P04 players(詳情)`/players/view/:id`

> 頁面說明:分 Player Details、Wallet Details 兩個頁籤;錢包表格在 Wallet Details 頁籤

**唯讀顯示欄位(實機畫面)**:ID、Player ID、Status、Email、Referral Code、Upline

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Wallet Id | `player_wallet_id` | 是 |
| 2 | Wallet Name | `wallet_type.wallet_type_name` | 是 |
| 3 | Balance | `wallet_balance` | 是 |
| 4 | Created At | `created_at` | 是 |
| 5 | Updated At | `updated_at` | 是 |
| 6 | Actions | `actions` | 否 |

**API**:`POST /players/:id/wallets/refresh`、`GET /players/:id/wallets`、`GET /players/:id`、`GET /players/:id/wallets/transfer_back`

