# M13 報表 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M13-P01 cashless-liability-old(列表)`/reports/cashless-liability-old/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Cashless Liability Report - Oldⁱ | DateRangePicker | `date_from ~ date_to` | 否 |  |  |  | 頁面 |
| 2 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Gaming Date | `summary_date` | 是 |
| 2 | Total Wallets | `total_all_wallets` | 是 |
| 3 | iGaming Wallet | `total_gaming_wallet` | 是 |
| 4 | iGaming Bonus Wallet | `total_gaming_bonus_wallet` | 是 |
| 5 | Total Provider Wallet | `total_provider_wallet` | 是 |
| 6 | Actions | `actions` | 否 |

**API**:`GET /report/cashless/list`

## M13-P02 Player Cashless Liability(詳情)`/reports/cashless-liability-old/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | navigation.submenu.playerCashlessLiabilityⁱ | AppTextField | `member_id` | 否 |  |  |  | 頁面 |
| 2 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Player ID | `player_name` | 是 |
| 2 | iGaming Wallet | `igaming_credit` | 是 |
| 3 | iGaming Bonus Wallet | `igaming_bonus_credit` | 是 |
| 4 | Total Provider Wallet | `total_provider_credit` | 是 |
| 5 | Gaming Date | `summary_date` | 否 |

**API**:`GET /report/cashless/player/list`

## M13-P03 Cashless Liability Report(列表)`/reports/cashless-liability/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Cashless Liability Reportⁱ | DateRangePicker | `date_from ~ date_to` | 否 |  |  |  | 頁面 |
| 2 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Gaming Date | `summary_date` | 是 |
| 2 | Total Wallets | `total_all_wallets` | 是 |
| 3 | iGaming Wallet | `total_gaming_wallet` | 是 |
| 4 | iGaming Bonus Wallet | `total_gaming_bonus_wallet` | 是 |
| 5 | Total Provider Wallet | `total_provider_wallet` | 是 |
| 6 | Actions | `actions` | 否 |

**API**:`GET /report/cashless/list`

## M13-P04 Player Cashless Liability(詳情)`/reports/cashless-liability/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | navigation.submenu.playerCashlessLiabilityⁱ | AppTextField | `member_id` | 否 |  |  |  | 頁面 |
| 2 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Player ID | `player_name` | 是 |
| 2 | iGaming Wallet | `igaming_credit` | 是 |
| 3 | iGaming Bonus Wallet | `igaming_bonus_credit` | 是 |
| 4 | Total Provider Wallet | `total_provider_credit` | 是 |
| 5 | Gaming Date | `summary_date` | 否 |

**API**:`GET /report/cashless/player/list`

## M13-P05 Download Center(列表)`/reports/download-center/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Report Name | AppTextField | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 2 | Status | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 3 | Requested From ~ Requested To | DateRangePicker | `from_date ~ to_date` | 否 |  |  |  | 頁面 |
| 4 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Report Name | `label` | 否 |
| 2 | Filters | `filters` | 否 |
| 3 | Status | `status` | 否 |
| 4 | File Size | `file_size` | 否 |
| 5 | Requested By | `requested_by` | 否 |
| 6 | Requested At | `created_at` | 否 |
| 7 | Expires At | `expires_at` | 否 |
| 8 | Downloads | `download_count` | 否 |
| 9 | Actions | `actions` | 否 |

**API**:`GET /report/downloads`、`GET /report/downloads/:id/logs`、`POST /report/downloads/:id/regenerate`

## M13-P06 Fund Transactions Report(列表)`/reports/fund-transaction/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Fund Transactions Reportⁱ | DateRangePicker | `date_from ~ date_to` | 否 |  |  |  | 頁面 |
| 2 | Player ID | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 3 | Transaction Type | VAutocomplete | `transaction_type` | 否 |  | [] | clearable="" item-title="wallet_journal_type_name" item-value="wallet_journal_type_id" | 頁面 |
| 4 | Status | VAutocomplete | `status` | 否 |  | API 動態載入 | clearable="" item-title="label" item-value="value" | 頁面 |
| 5 | Ref ID | AppTextField | `ref_id` | 否 |  |  |  | 頁面 |
| 6 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Player ID | `player_name` | 是 |
| 2 | Transaction Type | `wallet_journal_type_name` | 是 |
| 3 | Wallet From | `wallet_from` | 是 |
| 4 | Wallet To | `wallet_to` | 是 |
| 5 | Ref ID | `transaction_ref_id` | 是 |
| 6 | Transaction Date | `journal_datetime` | 是 |
| 7 | Status | `status` | 是 |
| 8 | Before Balance | `before_balance` | 否 |
| 9 | Transaction Amount | `transaction_amount` | 否 |
| 10 | After Balance | `after_balance` | 否 |
| 11 | Remarks | `remarks` | 否 |

**API**:`GET /report/fund_transaction/list`、`GET /report/fund_transaction/trasaction_type_list`

## M13-P07 Player Account Transaction Report(列表)`/reports/player-account-transaction/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Player Account Transaction Reportⁱ | DateRangePicker | `date_from ~ date_to` | 否 |  |  |  | 頁面 |
| 2 | Player ID | VAutocomplete | `player_id` | 否 |  | [] | clearable="" item-title="member_id" item-value="id" | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `player_summary_id` | 是 |
| 2 | Player ID | `player_name` | 是 |
| 3 | Provider Name | `game_provider_name` | 是 |
| 4 | Turnover | `table_turnover` | 是 |
| 5 | Actual Win | `table_actual_win` | 是 |
| 6 | Ref ID | `session_id` | 是 |
| 7 | Transaction Date Time | `summary_start_datetime` | 是 |

**API**:`GET /lookup/players`、`GET /report/player-account-transaction/:id`

## M13-P08 Player Cashless Liability(詳情)`/reports/player-account-transaction/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | navigation.submenu.playerCashlessLiabilityⁱ | AppTextField | `member_id` | 否 |  |  |  | 頁面 |
| 2 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Player ID | `player_name` | 是 |
| 2 | iGaming Wallet | `igaming_credit` | 是 |
| 3 | iGaming Bonus Wallet | `igaming_bonus_credit` | 是 |
| 4 | Total Provider Wallet | `total_provider_credit` | 是 |
| 5 | Gaming Date | `summary_date` | 否 |

**API**:`GET /report/cashless/player/list`

## M13-P09 revenue-old(列表)`/reports/revenue-old/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Provider | AppSelect | —(只顯示,不送出;資料來自 `game_provider_code`) | 否 |  | API 動態載入 | multiple="" clearable="" chips="" closable-chips="" | 頁面 |
| 2 | Game Category | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 3 | Game Offering | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 4 | Game | VCombobox | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 5 | End Dateⁱ | DateRangePicker |  | 否 |  |  |  | 頁面 |
| 6 | Most Recent | VCheckbox | `modelValue` | 否 |  |  |  | 頁面 |
| 7 | Most Recentⁱ | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|

**API**:`GET /get_e_provider_list`、`GET /game_offerings_dropdown`、`GET /report/revenue`、`GET /get_game_list`

## M13-P10 Revenue Report(列表)`/reports/revenue/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Provider | AppSelect | —(只顯示,不送出;資料來自 `game_provider_code`) | 否 |  | API 動態載入 | multiple="" clearable="" chips="" closable-chips="" | 頁面 |
| 2 | Game Category | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 3 | Game Offering | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 4 | Game | VCombobox | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 5 | End Dateⁱ | DateRangePicker |  | 否 |  |  |  | 頁面 |
| 6 | Most Recent | VCheckbox | `modelValue` | 否 |  |  |  | 頁面 |
| 7 | Most Recentⁱ | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|

**API**:`GET /get_e_provider_list`、`GET /game_offerings_dropdown`、`GET /report/revenue`、`GET /get_game_list`

