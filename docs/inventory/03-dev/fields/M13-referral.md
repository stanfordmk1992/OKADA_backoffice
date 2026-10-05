# M13 推薦獎勵 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M13-P01 referral-setting(新增)`/referral-setting/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Title * | AppTextField | `bonus_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Payout/Earning Frequency * | VAutocomplete | `payout_frequency` | 是 | 必填 | [] | clearable="" item-title="frequency_name" item-value="frequency_code" | 頁面 |
| 3 | Status * | AppSelect | `active_status` | 是(標示) |  | [] | item-title="title" item-value="value" | 頁面 |
| 4 | Period From * | AppDateTimePicker | `date_from` | 是(標示) |  |  |  | 頁面 |
| 5 | Period To * | AppDateTimePicker | `date_to` | 是(標示) |  |  |  | 頁面 |
| 6 | Payout Type * | VAutocomplete | `payout_type` | 是 | 必填 | [] | clearable="" item-title="name" item-value="value" | 頁面 |
| 7 | Payout Percentage / Payout Amount | AppTextField | `total_max_payout_percent` | 否 |  |  | 說明:標籤依 Payout Type 切換:percentage_by_deposit 顯示 %,fixed_amount 顯示金額 type="number" step="0.01" suffix=a(i) | 人工補全 |
| 8 | Max Cap Amount * | AppTextField | `max_cap_amount` | 是(標示) |  |  | 顯示條件:Payout Type 選 percentage_by_deposit 時顯示 說明:選填,轉成數字送出 type="number" step="0.01" | 人工補全 |
| 9 | Pool Amount * | AppTextField | `max_pool_amount` | 是(標示) |  |  | type="number" step="0.01" | 頁面 |
| 10 | Min Turnover * | AppTextField | `min_turnover_amount` | 是 | 必填 |  | type="number" step="0.01" | 頁面 |
| 11 | Payout Option * | VAutocomplete | `payout_option_id` | 是 | 必填 | [] | clearable="" item-title="payout_option_name" item-value="payout_option_id" | 頁面 |
| 12 | Deposit Option * | VAutocomplete | `deposit_option_code` | 是 | 必填 | [] | clearable="" item-title="dep_option_name" item-value="dep_option_code" | 頁面 |
| 13 | Minimum Deposit Amount * | AppTextField | `min_deposit_amount` | 是 | 必填 |  | type="number" step="0.01" | 頁面 |
| 14 | Terms and Conditions * | TiptapEditor | `term_and_condition` | 是 | 自訂:is required |  |  | 頁面 |

**API**:`GET /settings/referral_payout_frequency`、`GET /settings/referral_payout_type`、`GET /setting/deposit/option/referral`、`GET /setting/payout/option/referral`、`GET /settings/referral_payout_status`、`POST /referral_setting`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/settings/referral_payout_frequency` | every_5_minutes、hourly、daily |
| `/settings/referral_payout_status` | active、ended |
| `/settings/referral_payout_type` | fixed_amount、percentage_by_deposit |
| `/setting/payout/option/referral` | OKash Balance、Free Play (HaLo) |
| `/setting/deposit/option/referral` | first_deposit |

## M13-P02 Referral Setting(列表)`/referral-setting/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Title | AppTextField | `bonus_name` | 否 |  |  |  | 頁面 |
| 2 | Status | AppSelect | `active_status` | 否 |  | API 動態載入 | clearable="" item-title="title" item-value="value" | 頁面 |
| 3 | Start Date (FROM) ~ Start Date (TO) | DateRangePicker | `start_date_from ~ start_date_to` | 否 |  |  |  | 頁面 |
| 4 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `referral_setting_id` | 是 |
| 2 | Title | `bonus_name` | 是 |
| 3 | Frequency | `payout_frequency.frequency_name` | 是 |
| 4 | Period From | `date_from` | 否 |
| 5 | Period To | `date_to` | 否 |
| 6 | Status | `active_status` | 否 |
| 7 | Actions | `actions` | 否 |

**API**:`GET /referral_setting`、`PUT /referral_setting/:id`

## M13-P03 Title(編輯)`/referral-setting/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Title | AppTextField | —(只顯示,不送出;資料來自 `bonus_name`) | 否 |  |  | readonly="" disabled="" | 頁面 |
| 2 | Status | AppSelect | `active_status` | 否 |  | [{value:1,title:"Active"},{value:2,title:"Ended"}] | item-title="title" item-value="value" | 頁面 |
| 3 | Period From | AppDateTimePicker | —(只顯示,不送出;資料來自 `date_from`) | 否 |  |  | readonly="" disabled="" | 頁面 |
| 4 | Period To | AppDateTimePicker | —(只顯示,不送出;資料來自 `date_to`) | 否 |  |  | readonly="" disabled="" | 頁面 |
| 5 | Payout Frequency | VAutocomplete | —(只顯示,不送出;資料來自 `payout_frequency.frequency_code`) | 否 |  | [{frequency_code:"every_5_minutes",frequency_name:"Every 5 minutes"},{frequency_code:"hourly",frequency_name:"Hourly"},{frequency_code:"daily",frequency_name:"Daily"},{frequency_code:"weekly",frequency_name:"Weekly"},{frequency_code:"monthly",frequency_name:"Monthly"}] | readonly="" disabled="" item-title="frequency_name" item-value="frequency_code" | 頁面 |
| 6 | Payout Frequencyⁱ | AppTextField | —(只顯示,不送出;資料來自 `total_max_payout_percent`) | 否 |  |  | readonly="" disabled="" type="number" step="0.01" suffix=e(_) | 頁面 |
| 7 | Payout Type | VAutocomplete | —(只顯示,不送出;資料來自 `payout_type`) | 否 |  | [{value:"percentage_by_deposit",name:"Percentage by Deposit"},{value:"fixed_amount",name:"Fixed Amount"}] | readonly="" disabled="" item-title="name" item-value="value" | 頁面 |
| 8 | Payout Option | AppTextField | —(只顯示,不送出;資料來自 `payout_option.payout_option_name`) | 否 |  |  | readonly="" disabled="" | 頁面 |
| 9 | Deposit Option | VAutocomplete | —(只顯示,不送出;資料來自 `deposit_option`) | 否 |  | [{dep_option_code:"first_deposit",dep_option_name:"First Deposit"},{dep_option_code:"any_deposit",dep_option_name:"Any Deposit"}] | readonly="" disabled="" item-title="dep_option_name" item-value="dep_option_code" | 頁面 |
| 10 | Min Deposit Amount | AppTextField | `—(不送出)` | 否 |  |  | 說明:只顯示;此頁送出內容只有 active_status readonly="" disabled="" | 人工補全 |
| 11 | Max Cap Amount | AppTextField | `—(不送出)` | 否 |  |  | 說明:只顯示;此頁送出內容只有 active_status readonly="" disabled="" | 人工補全 |
| 12 | Min Turnover Amount | AppTextField | `—(不送出)` | 否 |  |  | 說明:只顯示;此頁送出內容只有 active_status readonly="" disabled="" | 人工補全 |
| 13 | Pool Amount | AppTextField | `—(不送出)` | 否 |  |  | 說明:只顯示;此頁送出內容只有 active_status readonly="" disabled="" | 人工補全 |
| 14 | Terms and Conditions | TiptapEditor | —(只顯示,不送出;資料來自 `term_and_condition`) | 否 |  |  |  | 人工補全 |

**API**:`GET /referral_setting/:id`、`PUT /referral_setting/:id`

## M13-P04 Title(詳情)`/referral-setting/view/:id`

**唯讀顯示欄位(實機畫面)**:Title、Payout Frequency、Status、Period From、Period To、Payout Type、Max Cap Amount、Payout Amount、Pool Amount、Min Turnover Amount、Payout Option、Deposit Option、Min Deposit Amount、Created By、Created At、Updated By、Updated At、Terms and Conditions

**API**:`GET /referral_setting/:id`

## M13-P05 Player Referral Batch Report(列表)`/reports/referral-report/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Title | AppTextField | `title` | 否 |  |  |  | 頁面 |
| 2 | Date From ~ Date To | DateRangePicker | `from_date ~ to_date` | 否 |  |  |  | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `id` | 否 |
| 2 | Title | `title` | 否 |
| 3 | Date | `bonus_date` | 否 |
| 4 | Frequency | `payout_frequency` | 否 |
| 5 | Option | `payout_wallet` | 是 |
| 6 | Pool Amount | `pool_amount` | 否 |
| 7 | Total Payout | `total_payout` | 否 |
| 8 | Status | `is_paid` | 否 |
| 9 | Actions | `actions` | 否 |

**API**:`GET /referral_report`

## M13-P06 referral-report(詳情)`/reports/referral-report/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Referral | `to_name` | 否 |
| 2 | Referee | `from_name` | 否 |
| 3 | Transaction Date | `trans_date` | 否 |
| 4 | Deposit Amount | `deposit_combined` | 否 |
| 5 | Turnover Amount | `turnover_combined` | 否 |
| 6 | Payout Amount | `payout_amount` | 否 |
| 7 | Status | `status` | 否 |

**API**:`GET /referral_report/:id`

