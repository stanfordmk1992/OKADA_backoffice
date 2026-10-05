# M05 錢包管理 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M05-P01 Deposit Report(列表)`/reports/deposit/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Deposit Reportⁱ | DateRangePicker | `date_from ~ date_to` | 否 |  |  |  | 頁面 |
| 2 | Player ID | AppTextField | `name` | 否 |  |  | clearable="" | 頁面 |
| 3 | Transaction ID | AppTextField | `transaction_id` | 否 |  |  | clearable="" | 頁面 |
| 4 | Reference ID | AppTextField | `reference_id` | 否 |  |  | clearable="" | 頁面 |
| 5 | Bank Name | VAutocomplete | `bank_id` | 否 |  | [] | clearable="" item-title="label" item-value="value" | 頁面 |
| 6 | Status | VAutocomplete | `status` | 否 |  | API 動態載入 | clearable="" item-title="label" item-value="value" | 頁面 |
| 7 | Request UUID | AppTextField |  | 否 |  |  | clearable="" | 頁面 |
| 8 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Player ID | `user_name` | 是 |
| 2 | Bank Name | `bank_name` | 是 |
| 3 | Request UUID | `request_uuid` | 是 |
| 4 | Transaction ID | `transaction_id` | 是 |
| 5 | Reference ID | `reference_id` | 是 |
| 6 | Amount | `amount` | 是 |
| 7 | Status | `status` | 是 |
| 8 | Remarks | `remarks` | 是 |
| 9 | Created At | `created_at` | 是 |
| 10 | Actions | `actions` | 否 |

**API**:`GET /report/deposit/list`、`GET /report/bank/list`

## M05-P02 Deposit Log(詳情)`/reports/deposit/view/:id`

**API**:`GET /report/deposit/:id`

## M05-P03 Withdrawal Report(列表)`/reports/withdrawal/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Withdrawal Reportⁱ | DateRangePicker | `date_from ~ date_to` | 否 |  |  |  | 頁面 |
| 2 | Player ID | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 3 | Transaction ID | AppTextField | `transaction_id` | 否 |  |  |  | 頁面 |
| 4 | Reference ID | AppTextField | `reference_id` | 否 |  |  |  | 頁面 |
| 5 | Bank Name | VAutocomplete | `bank_id` | 否 |  | [] | item-title="label" item-value="value" | 頁面 |
| 6 | Status | VAutocomplete | `status` | 否 |  | API 動態載入 | item-title="label" item-value="value" | 頁面 |
| 7 | Request UUID | AppTextField |  | 否 |  |  | clearable="" | 頁面 |
| 8 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Player ID | `user_name` | 是 |
| 2 | Bank Name | `bank_name` | 是 |
| 3 | Request UUID | `request_uuid` | 是 |
| 4 | Transaction ID | `transaction_id` | 是 |
| 5 | Reference ID | `reference_id` | 是 |
| 6 | Amount | `amount` | 是 |
| 7 | Status | `status` | 是 |
| 8 | Remarks | `remarks` | 是 |
| 9 | Created At | `created_at` | 是 |
| 10 | Actions | `actions` | 否 |

**API**:`GET /report/withdraw/list`、`GET /report/bank/list`

## M05-P04 Withdrawal Log(詳情)`/reports/withdrawal/view/:id`

**API**:`GET /report/withdraw/:id`

## M05-P05 wallets / adjustment(新增)`/wallets/adjustment/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Adjustment Reason | AppTextField | `adjust_reason` | 是 | 必填 |  |  | 頁面 |
| 2 | Player ID | VAutocomplete | `player_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="id" persistent-hint="" return-object="" | 頁面 |
| 3 | Wallet Type | VAutocomplete | `wallet_type_id` | 是 | 必填 | [] | item-title="name" item-value="id" | 頁面 |
| 4 | Current Balance | AppTextField | `before_balance` | 否 |  |  | disabled="" | 頁面 |
| 5 | Amount Debit (+) | AppTextField | `adjust_debit_amount` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 6 | Amount Credit (-) | AppTextField | `adjust_credit_amount` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 7 | New Balance | AppTextField | 未確定 | 否 |  |  | disabled="" | 頁面 |

**API**:`GET /players`、`GET /players/:id/wallets/:id`、`POST /wallet_adjustment`、`GET /lookup/wallet_types`

## M05-P06 Wallet Adjustment(列表)`/wallets/adjustment/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Player ID | AppTextField | `member_id` | 否 |  |  |  | 頁面 |
| 2 | Wallet Type | VAutocomplete | `wallet_type_id` | 否 |  | [] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Wallet Typeⁱ | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 4 | Wallet Typeⁱ | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `wallet_adjustment_id` | 是 |
| 2 | Player ID | `member_id` | 是 |
| 3 | Wallet | `wallet_type_name` | 是 |
| 4 | Balance Before | `before_balance` | 是 |
| 5 | Balance After | `after_balance` | 是 |
| 6 | Amount Debit (+) | `adjust_debit_amount` | 是 |
| 7 | Amount Credit (-) | `adjust_credit_amount` | 是 |
| 8 | Adjusted By | `adjust_by` | 是 |
| 9 | Created At | `created_at` | 是 |
| 10 | Action | `actions` | 否 |

**API**:`GET /lookup/wallet_types`、`GET /wallet_adjustment`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/lookup/wallet_types` | iGaming Bonus Wallet、iSlot Wallet、iTable Wallet、Live Slot Bonus Wallet、Live Table Bonus Wallet、OKash Balance、OKASH Wallet、Provider Wallet、Safekeeping Wallet、Temp Wallet |

## M05-P07 wallets / adjustment(詳情)`/wallets/adjustment/view/:id`

**API**:`GET /wallet_adjustment/:id`

## M05-P08 Credit Reversal(列表)`/wallets/refund/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Search Player ID | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 2 | Search Transaction Ref ID | AppTextField | `transaction_ref_id` | 否 |  |  |  | 頁面 |
| 3 | Search Status | VAutocomplete | `status` | 否 |  | [{id:0,name:"Pending Approval"},{id:1,name:"Pending"},{id:2,name:"Approved"},{id:3,name:"Rejected"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | per_page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `id` | 是 |
| 2 | Player ID | `member_id` | 是 |
| 3 | Transaction Ref ID | `transaction_ref_id` | 否 |
| 4 | Amount | `credit_amount` | 是 |
| 5 | Status | `status` | 否 |
| 6 | Created At | `created_at` | 是 |
| 7 | Action | `actions` | 否 |

**API**:`PUT /wallets/refund/:id`

