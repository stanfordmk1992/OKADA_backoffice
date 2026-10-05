# M15 獎金(免費旋轉) — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M15-P01 bonus / omniplay / freespin(新增)`/bonus/omniplay/freespin/create`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID(s) | VAutocomplete | `player_id` | 否 | 自訂:Please select at least one Member ID or Player Tier;長度限制 .length>0 | [] | multiple="" disabled=l(P) clearable="" chips="" item-title="member_id" item-value="id" closable-chips="" | 頁面 |
| 2 | Player Tier | AppSelect | `player_rank_ids` | 否 |  | API 動態載入 | multiple="" disabled=l(le) clearable="" chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |
| 3 | Game ID(s) | AppSelect | `game_id` | 否 | 自訂:Please select at least one Game ID | [] | clearable="" item-title="game_name" item-value="game_id" | 頁面 |
| 4 | Denom | AppSelect | `bet_size` | 否 | 自訂:Please select a Denom | [] | disabled=l(te) clearable="" item-title="title" item-value="value" | 頁面 |
| 5 | Max Win Amount | AppTextField | `max_win_amount` | 是 | 自訂:Max Win Amount is required;自訂:Max Win Amount must be at least 1;自訂:Max Win Amount must not exceed {max} |  | type="number" min="1" max=l(m) | 頁面 |
| 6 | Free Spin Count | AppTextField | `game_count` | 是 | 自訂:Free Spin Count is required;自訂:Free Spin Count must be at least 1;自訂:Free Spin Count must not exceed {max} |  | type="number" min="1" max=l(m) | 頁面 |
| 7 | Expiration Time | AppDateTimePicker | `expiration_time` | 是 | 自訂:Expiration Time is required |  |  | 頁面 |

**API**:`GET /lookup/players`、`GET /setting/player_rank`、`GET /{vendor}/freespin/config`、`POST /{vendor}/freespin/give`、`POST /{vendor}/freespin/massGive`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/setting/player_rank` | Prime、Elite、Premium、Supreme、Maharlika、Okada Club、Okada VIP - Prime、Okada VIP - Premium、Okada VIP - Supreme、Okada VIP - Maharlika、Slot VVIP、All Member、Okada VIP - Elite、Bronze、Silver、Gold、Platinum、Ruby、Diamond、Chairman、Okada Club Emerald、Okada Club Diamond |

## M15-P02 bonus / omniplay / freespin(列表)`/bonus/omniplay/freespin/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID | AppTextField | `member_id` | 否 |  |  | clearable="" | 頁面 |
| 2 | Batch ID | AppTextField | `batch_id` | 否 |  |  | clearable="" | 頁面 |
| 3 | Free Card ID | AppTextField | `free_card_id` | 否 |  |  | clearable="" | 頁面 |
| 4 | Status | AppSelect | `status` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 5 | Usage Status | AppSelect | `item_status` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 6 | Created Start Date ~ Created End Date | DateRangePicker | `created_start_date ~ created_end_date` | 否 |  |  |  | 頁面 |
| 7 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Batch ID | `batch_id` | 否 |
| 2 | Member ID | `member_id` | 否 |
| 3 | Free Card ID | `free_card_id` | 否 |
| 4 | Game Code | `game_code` | 否 |
| 5 | Game Name | `game_name` | 否 |
| 6 | Denom | `bet_size` | 否 |
| 7 | Max Win Amount | `max_win_amount` | 否 |
| 8 | Free Spin Count | `game_count` | 否 |
| 9 | Amount | `amount` | 否 |
| 10 | Usage Status | `item_status_label` | 否 |
| 11 | Expiration Time | `expiration_time` | 否 |
| 12 | Status | `status` | 否 |
| 13 | Created By | `issued_by_name` | 否 |
| 14 | Created Date | `created_at` | 否 |
| 15 | Actions | `actions` | 否 |

**API**:`GET /{vendor}/freespin/list`、`POST /{vendor}/freespin/remove`

## M15-P03 bonus / omniplay / freespin(報表)`/bonus/omniplay/freespin/reports`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 人工補全 |
| 2 | Member ID | AppTextField | `member_id` | 否 |  |  | 顯示條件:切換到 Game Records / Bonus Transaction 頁籤後顯示 clearable="" | 人工補全 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50] |  | 頁面 |

**表格欄位(實機畫面)**:No、Member ID、Active Cards、Cards Cancelled、Cards Given、Total Game Count Given

**API**:`GET /{vendor}/freespin/report/overview`、`GET /{vendor}/freespin/report/game-records`、`GET /{vendor}/freespin/report/bonus-transaction`

## M15-P04 bonus / playtech / freespin(新增)`/bonus/playtech/freespin/create`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID(s) | VAutocomplete | `member_ids` | 否 | 自訂:Please select at least one Member ID or Player Tier;長度限制 .length>0 | [] | multiple="" disabled=s(q) chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |
| 2 | Player Tier | AppSelect | `player_rank_ids` | 否 |  | API 動態載入 | multiple="" disabled=s(E) chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |
| 3 | Bonus ID | AppSelect | `bonus_id` | 是 | 自訂:Bonus ID is required | [] |  | 頁面 |
| 4 | Free Spin Count | AppTextField | `amount` | 是 | 自訂:Amount is required;自訂:Amount must be at least 1 |  | type="number" min="1" | 頁面 |
| 5 | Game | VAutocomplete | `game_list` | 否 |  | [] | multiple="" chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |

**API**:`GET /freespin/config`、`POST /freespin/massGive`、`GET /freespin/games`、`GET /lookup/players`、`GET /setting/player_rank`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/setting/player_rank` | Prime、Elite、Premium、Supreme、Maharlika、Okada Club、Okada VIP - Prime、Okada VIP - Premium、Okada VIP - Supreme、Okada VIP - Maharlika、Slot VVIP、All Member、Okada VIP - Elite、Bronze、Silver、Gold、Platinum、Ruby、Diamond、Chairman、Okada Club Emerald、Okada Club Diamond |

## M15-P05 bonus / playtech / freespin(列表)`/bonus/playtech/freespin/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID | AppTextField | `member_id` | 否 |  |  | clearable="" | 頁面 |
| 2 | Ref ID | AppTextField | `external_bonus_id` | 否 |  |  | clearable="" | 頁面 |
| 3 | Status | AppSelect | `status` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 4 | Created Start Date ~ Created End Date | DateRangePicker | `created_start_date ~ created_end_date` | 否 |  |  |  | 頁面 |
| 5 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Ref ID | `external_bonus_id` | 否 |
| 2 | Member ID | `player_name` | 否 |
| 3 | Bonus ID | `bonus_id` | 否 |
| 4 | Free Spin Count | `amount` | 否 |
| 5 | Free Spin Used | `freespins_used` | 否 |
| 6 | Status | `status` | 否 |
| 7 | Created By | `issued_by_name` | 否 |
| 8 | Created Date | `created_at` | 否 |
| 9 | Actions | `actions` | 否 |

**API**:`GET /freespin/list`

## M15-P06 bonus / playtech / freespin(報表)`/bonus/playtech/freespin/reports`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 人工補全 |
| 2 | Member ID | AppTextField | `member_id` | 否 |  |  | 顯示條件:切換到 Game Records / Bonus Transaction 頁籤後顯示 clearable="" | 人工補全 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50] |  | 頁面 |

**表格欄位(實機畫面)**:No、Member ID、Total Spins Given、Total Spins Revoked、Total Spins Used、Total Spins Remaining

**API**:`GET /freespin/report/overview`、`GET /freespin/report/game-records`、`GET /freespin/report/bonus-transaction`

## M15-P07 bonus / playtech / freespin(詳情)`/bonus/playtech/freespin/view/:id`

**表格欄位(實機畫面)**:Ref ID、Bonus ID、Free Spin Count、Free Spin Used、Status、Created Date、Created By、Revoked Date、Revoked By、Actions

**API**:`GET /freespin/player-detail/:id`、`POST /freespin/remove`、`POST /freespin/remove-all`

## M15-P08 bonus / pragmatic-play / freespin(新增)`/bonus/pragmatic-play/freespin/create`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID(s) | VAutocomplete | `member_ids` | 否 | 自訂:Please select at least one Member ID or Player Tier;長度限制 .length>0 | [] | multiple="" disabled=l(q) chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |
| 2 | Player Tier | AppSelect | `player_rank_ids` | 否 |  | API 動態載入 | multiple="" disabled=l(N) chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |
| 3 | Bonus ID | AppSelect | `bonus_id` | 是 | 自訂:Bonus ID is required | [] |  | 頁面 |
| 4 | Free Spin Count | AppTextField | `amount` | 是 | 自訂:Amount is required;自訂:Amount must be at least 1 |  | type="number" min="1" | 頁面 |

**API**:`GET /lookup/players`、`GET /setting/player_rank`、`GET /pragmatic-play/freespin/config`、`POST /pragmatic-play/freespin/massGive`、`GET /pragmatic-play/freespin/games`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/setting/player_rank` | Prime、Elite、Premium、Supreme、Maharlika、Okada Club、Okada VIP - Prime、Okada VIP - Premium、Okada VIP - Supreme、Okada VIP - Maharlika、Slot VVIP、All Member、Okada VIP - Elite、Bronze、Silver、Gold、Platinum、Ruby、Diamond、Chairman、Okada Club Emerald、Okada Club Diamond |

## M15-P09 bonus / pragmatic-play / freespin(列表)`/bonus/pragmatic-play/freespin/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID | AppTextField | `member_id` | 否 |  |  | clearable="" | 頁面 |
| 2 | Ref ID | AppTextField | `external_bonus_id` | 否 |  |  | clearable="" | 頁面 |
| 3 | Status | AppSelect | `status` | 否 |  | API 動態載入 | clearable="" | 頁面 |
| 4 | Created Start Date ~ Created End Date | DateRangePicker | `created_start_date ~ created_end_date` | 否 |  |  |  | 頁面 |
| 5 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Ref ID | `id` | 否 |
| 2 | Member ID | `player_name` | 否 |
| 3 | Bonus ID | `bonus_code` | 否 |
| 4 | Free Spin Count | `rounds` | 否 |
| 5 | Free Spin Used | `rounds_used` | 否 |
| 6 | Status | `status` | 否 |
| 7 | Created By | `issued_by_name` | 否 |
| 8 | Created Date | `created_at` | 否 |
| 9 | Actions | `actions` | 否 |

**API**:`GET /pragmatic-play/freespin/list`

## M15-P10 bonus / pragmatic-play / freespin(報表)`/bonus/pragmatic-play/freespin/reports`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 人工補全 |
| 2 | Member ID | AppTextField | `member_id` | 否 |  |  | 顯示條件:切換到 Game Records / Bonus Transaction 頁籤後顯示 clearable="" | 人工補全 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50] |  | 頁面 |

**表格欄位(實機畫面)**:No、Member ID、Total Spins Given、Total Spins Revoked、Total Spins Used、Total Spins Remaining

**API**:`GET /pragmatic-play/freespin/report/overview`、`GET /pragmatic-play/freespin/report/game-records`、`GET /pragmatic-play/freespin/report/bonus-transaction`

## M15-P11 bonus / pragmatic-play / freespin(詳情)`/bonus/pragmatic-play/freespin/view/:id`

**表格欄位(實機畫面)**:Ref ID、Bonus ID、Free Spin Count、Free Spin Used、Status、Created Date、Created By、Revoked Date、Revoked By、Actions

**API**:`GET /pragmatic-play/freespin/player-detail/:id`、`POST /pragmatic-play/freespin/remove`、`POST /pragmatic-play/freespin/remove-all`

