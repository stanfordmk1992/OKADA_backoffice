# M12 報表 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M12-P01 cashless-liability-old(列表)`/reports/cashless-liability-old/list`

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

## M12-P02 Player Cashless Liability(詳情)`/reports/cashless-liability-old/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Search Player ID | AppTextField | `member_id` | 否 |  |  |  | 頁面 |
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

## M12-P03 Cashless Liability Report(列表)`/reports/cashless-liability/list`

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

## M12-P04 Player Cashless Liability(詳情)`/reports/cashless-liability/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Search Player ID | AppTextField | `member_id` | 否 |  |  |  | 頁面 |
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

## M12-P05 Download Center(列表)`/reports/download-center/list`

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

## M12-P06 Fund Transactions Report(列表)`/reports/fund-transaction/list`

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

## M12-P07 Game Report(列表)`/reports/game-report/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Provider | AppSelect | `provider_code` | 否 |  | API 動態載入 | clearable="" required="" | 頁面 |
| 2 | Game | VCombobox | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 3 | Game Offering | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 4 | Player ID | VCombobox | `modelValue` | 否 |  | [] | clearable="" | 頁面 |
| 5 | Options | AppSelect | `modelValue` | 否 |  | API 動態載入 |  | 頁面 |
| 6 | Date Filter Type | AppSelect | `modelValue` | 否 |  | API 動態載入 |  | 頁面 |
| 7 | Transaction Start Date & Time ~ Transaction End Date & Time | DateRangePicker | `from_date ~ to_date` | 否 |  |  |  | 頁面 |
| 8 | Settlement Start Date & Time ~ Settlement End Date & Time | DateRangePicker | `settled_from ~ settled_to` | 否 |  |  | 顯示條件:Date Filter Type 選 Settlement 時顯示(預設為 Transaction) | 人工補全 |
| 9 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**API**:`GET /report/game_records/:id`、`GET /get_e_provider_list`、`GET /game_offerings_dropdown`、`GET /get_game_list`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/get_e_provider_list` | YellowBat、ETG、Zitro、Jili、Fachai、Skivot、Omniplay、JDB、Playtech、Light & Wonder、Habanero、Pragmatic Play、Inferno Play、Nsoft |

## M12-P08 Player Account Transaction Report(列表)`/reports/player-account-transaction/list`

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

## M12-P09 Player Cashless Liability(詳情)`/reports/player-account-transaction/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Search Player ID | AppTextField | `member_id` | 否 |  |  |  | 頁面 |
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

## M12-P10 revenue-old(列表)`/reports/revenue-old/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Provider | AppSelect | —(只顯示,不送出;資料來自 `game_provider_code`) | 否 |  | API 動態載入 | multiple="" clearable="" chips="" closable-chips="" | 頁面 |
| 2 | Game Category | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 3 | Game Offering | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 4 | Game | VCombobox | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 5 | End Dateⁱ | DateRangePicker |  | 否 |  |  |  | 頁面 |
| 6 | Most Recent | VCheckbox | `modelValue` | 否 |  |  |  | 頁面 |
| 7 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|

**API**:`GET /get_e_provider_list`、`GET /game_offerings_dropdown`、`GET /report/revenue`、`GET /get_game_list`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/get_e_provider_list` | YellowBat、ETG、Zitro、Jili、Fachai、Skivot、Omniplay、JDB、Playtech、Light & Wonder、Habanero、Pragmatic Play、Inferno Play、Nsoft |
| `/game_category/dropdown` | Live Casino、Bingo、Arcade、Slots、Fishing、E-Sport、Table Game、Sportbook、RNG、Other、Baccarat、Roulette、Multi Table、Standalone、Coin Combo、Jin Ji Bao Xi Grand、Duo Fu Duo Cai、Duo Fu Duo Cai、Standalone、Dragon & Tiger、SicBo、NiuNiu、Test、Bao Zhu Zhao Fu、test gif icon、test slot jackpot gif banner、Phoenix Fever Jackpot、test2、test create category 11、test create category 22、pagination、test001、retest create cat 1111、test pagination、retest pagi、Test、Phoenix Fever Jackpot、Testingg、Coin Combo、Jin Ji Bao Xi Grand …共 44 項 |
| `/game_offerings_dropdown` | eCasino、Sports Betting – Live Sports、Specialty Games – RNG Based、eBingo、Traditional Bingo、Sports Betting – Virtual Sports、Specialty Games – Live Streamed、Numeric Games – Live Streamed、Numeric Games – RNG Based、Online Poker、test1 |

## M12-P11 Revenue Report(列表)`/reports/revenue/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Provider | AppSelect | —(只顯示,不送出;資料來自 `game_provider_code`) | 否 |  | API 動態載入 | multiple="" clearable="" chips="" closable-chips="" | 頁面 |
| 2 | Game Category | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 3 | Game Offering | AppSelect | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 4 | Game | VCombobox | `modelValue` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 5 | End Dateⁱ | DateRangePicker |  | 否 |  |  |  | 頁面 |
| 6 | Most Recent | VCheckbox | `modelValue` | 否 |  |  |  | 頁面 |
| 7 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|

**API**:`GET /get_e_provider_list`、`GET /game_offerings_dropdown`、`GET /report/revenue`、`GET /get_game_list`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/get_e_provider_list` | YellowBat、ETG、Zitro、Jili、Fachai、Skivot、Omniplay、JDB、Playtech、Light & Wonder、Habanero、Pragmatic Play、Inferno Play、Nsoft |
| `/game_category/dropdown` | Live Casino、Bingo、Arcade、Slots、Fishing、E-Sport、Table Game、Sportbook、RNG、Other、Baccarat、Roulette、Multi Table、Standalone、Coin Combo、Jin Ji Bao Xi Grand、Duo Fu Duo Cai、Duo Fu Duo Cai、Standalone、Dragon & Tiger、SicBo、NiuNiu、Test、Bao Zhu Zhao Fu、test gif icon、test slot jackpot gif banner、Phoenix Fever Jackpot、test2、test create category 11、test create category 22、pagination、test001、retest create cat 1111、test pagination、retest pagi、Test、Phoenix Fever Jackpot、Testingg、Coin Combo、Jin Ji Bao Xi Grand …共 44 項 |
| `/game_offerings_dropdown` | eCasino、Sports Betting – Live Sports、Specialty Games – RNG Based、eBingo、Traditional Bingo、Sports Betting – Virtual Sports、Specialty Games – Live Streamed、Numeric Games – Live Streamed、Numeric Games – RNG Based、Online Poker、test1 |

