# M04 促銷活動 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M04-P01 Promotion Opt-In List(列表)`/promotions/opt-in/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | navigation.submenu.promotionOptInListⁱ | AppTextField | `player_id` | 否 |  |  | clearable="" | 頁面 |
| 2 | features.promotions.placeholders.searchPlayerIdⁱ | AppTextField | `bonus_name` | 否 |  |  | clearable="" | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `promotion_opt_in_id` | 是 |
| 2 | Player ID | `player.player_name` | 是 |
| 3 | Promotion Name | `bonus_name` | 是 |
| 4 | Game Provider | `vendors` | 否 |
| 5 | Min/Max Deposit | `min_and_max_deposit` | 是 |
| 6 | Deposit Information | `deposit_info` | 是 |
| 7 | Turnover Information | `turnover_info` | 是 |
| 8 | Tier Points Information | `tier_points_info` | 是 |
| 9 | Join Date | `join_date` | 是 |
| 10 | Payment Method | `payout_method.payout_option_name` | 是 |
| 11 | Created At | `created_at` | 是 |
| 12 | Updated At | `updated_at` | 是 |

**API**:`GET /promotion_opt_in`

## M04-P02 Promotion Payout(列表)`/promotions/payout/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | navigation.submenu.promotionPayoutⁱ | AppTextField | `name` | 否 |  |  | clearable="" | 頁面 |
| 2 | features.promotions.placeholders.searchPlayerIdⁱ | AppTextField | `bonus_name` | 否 |  |  | clearable="" | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `promotion_payout_id` | 是 |
| 2 | Player ID | `player.name` | 是 |
| 3 | Promotion Name | `promotion_opt_in.bonus_name` | 是 |
| 4 | Payout Amount | `payout_amount` | 是 |
| 5 | Payout Method | `payout_option.payout_option_name` | 是 |
| 6 | Payout Date | `payout_date` | 是 |
| 7 | Status | `payout_status` | 是 |

**API**:`GET /promotion_payout`

## M04-P03 promotions / settings(新增)`/promotions/settings/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Promotion Name | AppTextField | `bonus_name` | 是 | 必填;自訂:Promotion name must be between 4 and 100 characters;長度限制 .length>=4;長度限制 .length<=100 |  |  | 頁面 |
| 2 | Start Date ~ End Date | DateRangePicker | `period_from ~ period_to` | 否 |  |  |  | 頁面 |
| 3 | Player Ranking | AppSelect | `player_rank_id` | 是 | 必填 | API 動態載入 | multiple="" clearable="" chips="" item-title="player_rank_name" item-value="player_rank_id" closable-chips="" | 頁面 |
| 4 | Deposit Option | AppSelect | `dep_option_code` | 是 | 必填 | API 動態載入 | clearable="" item-title="dep_option_name" item-value="dep_option_code" | 頁面 |
| 5 | Minimum Deposit | AppTextField | `min_amount` | 是 | 必填;自訂:Minimum deposit cannot be greater than maximum deposit |  |  | 頁面 |
| 6 | Maximum Deposit | AppTextField | `max_amount` | 是 | 必填;自訂:Maximum deposit cannot be less than minimum deposit |  |  | 頁面 |
| 7 | Payout Frequency | VAutocomplete | `frequency_code` | 是 | 必填 | API 動態載入 | clearable="" item-title="frequency_name" item-value="frequency_code" | 頁面 |
| 8 | Vendors | VAutocomplete | `vendor_id` | 是 | 必填 | [] | multiple="" clearable="" chips="" item-title="game_provider_name" item-value="game_provider_id" closable-chips="" | 頁面 |
| 9 | Terms and Conditionsⁱ | TiptapEditor | `term_and_condition` | 否 |  |  | rows="5" | 頁面 |
| 10 | Payout Method | VAutocomplete | `payout_option_code` | 是 | 必填 | [{payout_name:"OKash Balance",payout_code:"igaming_credit"},{payout_name:"Free Play (HALO)",payout_code:"free_play_halo"}] | clearable="" item-title="payout_name" item-value="payout_code" | 頁面 |
| 11 | Percentage | AppTextField | `percentage` | 是 | 必填;自訂:Percentage must be between 0.0001 and 100 |  | type="number" min="0.0001" max="100" step="0.0001" | 頁面 |
| 12 | Max Campaign Amount | AppTextField | `max_campaign_amount` | 是 | 必填 |  |  | 頁面 |
| 13 | Turnover Amount | AppTextField | `turnover_amount` | 是 | 必填 |  |  | 頁面 |
| 14 | Earn Points(Tier Points) | AppTextField | `tier_points` | 否 |  |  |  | 頁面 |
| 15 | Upload Banner | VFileInput | `banner_image` | 否 |  |  | accept="image/png,image/jpeg,image/jpg" | 頁面 |

**API**:`GET /setting/player_rank`、`GET /setting/deposit_option`、`GET /game_providers`、`POST /promotion_setting`

## M04-P04 Promotion Settings(列表)`/promotions/settings/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Search Promotion Name | AppTextField | `name` | 否 |  |  | clearable="" | 頁面 |
| 2 | Search Payout Frequency | VAutocomplete | `payout_frequency` | 否 |  | [{id:H.PAYOUT_END_OF_PROMOTION,name:"End of Promotion"},{id:H.PAYOUT_INSTANT,name:"Instant"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Start Date (FROM) ~ Start Date (TO) | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 4 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `promotion_setting_id` | 是 |
| 2 | Promotion Name | `bonus_name` | 是 |
| 3 | Start Date | `period_from` | 是 |
| 4 | End Date | `period_to` | 是 |
| 5 | Payout Frequency | `payout_frequency.frequency_name` | 是 |
| 6 | Created At | `created_at` | 是 |
| 7 | Updated At | `updated_at` | 是 |
| 8 | Actions | `actions` | 否 |

**API**:`GET /promotion_setting`

## M04-P05 promotions / settings(詳情)`/promotions/settings/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Email | AppTextField | `email` | 否 |  |  | type="email" | 頁面 |
| 2 | Password | AppTextField | `password` | 否 |  |  | type="password" | 頁面 |

**API**:`POST /promotion_setting/status/:id`、`GET /promotion_setting/:id`

