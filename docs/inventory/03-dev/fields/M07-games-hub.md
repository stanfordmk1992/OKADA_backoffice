# M07 遊戲中心 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M07-P01 Featured eGames(列表)`/featured-games/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Game Name | AppTextField | `game_name` | 否 |  |  |  | 頁面 |
| 2 | Status | VAutocomplete | `status` | 否 |  | [{id:R.ACTIVE,name:"Active"},{id:R.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Items per page | AppSelect | `value` | 否 |  | [5,10,20,25,50,{title:e."All",value:"all"}] |  | 頁面 |
| 4 | Select Games | VAutocomplete | `game_ids` | 否 |  | [] | 顯示條件:按「Add Featured eGames」後的對話框內 multiple="" clearable="" chips="" item-title="title" item-value="value" closable-chips="" | 人工補全 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Game Name | `game_name` | 是 |
| 2 | Status | `status` | 是 |
| 3 | Sequence Number | `feature_game_sequence` | 是 |
| 4 | Created At | `created_at` | 是 |
| 5 | Actions | `actions` | 否 |

**API**:`GET /featured_games`、`POST /featured_games`、`POST /featured_games/status/:id`、`POST /featured_games/sequence/update`、`GET /game_list_dropdown`

## M07-P02 game-category(新增)`/game-category/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Category Name | AppTextField | `game_category_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Game Type | VAutocomplete | `game_type_id` | 是 | 必填 | [] | clearable="" item-title="game_type_name" item-value="game_type_id" | 頁面 |
| 3 | Game Category Image | VFileInput | `game_category_image` | 否 |  |  | 說明:選填;JPEG、PNG、JPG、GIF、WEBP、SVG,≤ 5MB accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml" | 人工補全 |
| 4 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |

**API**:`POST /provider/game_category`、`GET /provider/game_types`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/provider/game_types` | Live Slots、Live Tables、eGaming、Live Slots  - New、Sportsbook |

## M07-P03 Game Category(列表)`/game-category/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Game Type | VAutocomplete | `game_type_id` | 否 |  | [] | clearable="" item-title="game_type_name" item-value="game_type_id" | 頁面 |
| 2 | Status | VAutocomplete | `status` | 否 |  | [{id:y.ACTIVE,name:"Active"},{id:y.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Items per page | AppSelect | `value` | 否 |  | [5,10,20,25,50,{title:e."All",value:"all"}] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Category Name | `game_category_name` | 是 |
| 2 | Sequence No. | `seq_no` | 是 |
| 3 | Game Type | `game_type_name` | 是 |
| 4 | Created At | `created_at` | 是 |
| 5 | Updated At | `updated_at` | 是 |
| 6 | Status | `status` | 是 |
| 7 | Actions | `actions` | 否 |

**API**:`GET /provider/game_category`、`PUT /provider/game_category/status/:id`、`GET /provider/game_types`、`POST /provider/game_category/sequence/update`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/provider/game_category` | Live Casino、Bingo、Arcade、Slots、Fishing、E-Sport、Table Game、Sportbook、RNG、Other |
| `/provider/game_types` | Live Slots、Live Tables、eGaming、Live Slots  - New、Sportsbook |

## M07-P04 game-category(編輯)`/game-category/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Category Name | AppTextField | `game_category_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Game Type | VAutocomplete | `game_type_id` | 是 | 必填 | [] | clearable="" item-title="game_type_name" item-value="game_type_id" | 頁面 |
| 3 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |
| 4 | Game Category Image | VFileInput | `game_category_image` | 否 |  |  | 說明:選填,有選新圖才送出 accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml" | 人工補全 |

**唯讀顯示欄位(實機畫面)**:ID、Created At、Updated At

**API**:`GET /provider/game_category/:id`、`POST /provider/game_category/:id`、`GET /provider/game_types`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/provider/game_types` | Live Slots、Live Tables、eGaming、Live Slots  - New、Sportsbook |

## M07-P05 game-category(詳情)`/game-category/view/:id`

**唯讀顯示欄位(實機畫面)**:ID、Category Name、Game Type、Status、Game Category Image、Created At、Updated At

**API**:`GET /provider/game_category/:id`

## M07-P06 game-offering(新增)`/game-offering/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Game Offering Name | AppTextField | `game_offering_name` | 是 | 自訂:+e(s)(;自訂:Game Offering Name;自訂:is required |  |  | 頁面 |
| 2 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |

**API**:`POST /game_offerings`

## M07-P07 Game Offerings(列表)`/game-offering/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Status | VAutocomplete | `status` | 否 |  | [{id:v.ACTIVE,name:"Active"},{id:v.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 2 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Game Offering Name | `game_offering_name` | 是 |
| 2 | Sequence Number | `seq_no` | 是 |
| 3 | Created At | `created_at` | 否 |
| 4 | Updated At | `updated_at` | 否 |
| 5 | Status | `status` | 是 |
| 6 | Actions | `actions` | 否 |

**API**:`GET /game_offerings`、`PUT /game_offerings/status/:id`、`POST /game_offerings/sequence/update`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/game_offerings` | eCasino、Sports Betting – Live Sports、Specialty Games – RNG Based、eBingo、Traditional Bingo、Sports Betting – Virtual Sports、Specialty Games – Live Streamed、Numeric Games – Live Streamed、Numeric Games – RNG Based、Online Poker |

## M07-P08 game-offering(編輯)`/game-offering/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Game Offering Name | AppTextField | `game_offering_name` | 是 | 自訂:+e(s)(;自訂:Game Offering Name;自訂:is required |  |  | 頁面 |
| 2 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |

**唯讀顯示欄位(實機畫面)**:Game Offering ID、Created At、Updated At

**API**:`GET /game_offerings/:id`、`POST /game_offerings/:id`

## M07-P09 game-offering(詳情)`/game-offering/view/:id`

**唯讀顯示欄位(實機畫面)**:Game Offering ID、Game Offering Name、Game Offering Code、Created At、Updated At、Updated By、Status

**API**:`GET /game_offerings/:id`

## M07-P10 Game Providers(列表)`/game-provider/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Provider Name | AppTextField | `game_provider_name` | 否 |  |  |  | 頁面 |
| 2 | Status | VAutocomplete | `status` | 否 |  | [{id:p.ACTIVE,name:"Active"},{id:p.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Items per page | AppSelect | `value` | 否 |  | [5,10,20,25,50,{title:e."All",value:"all"}] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Provider Name | `game_provider_name` | 是 |
| 2 | Sequence Number | `seq_no` | 是 |
| 3 | Display Name | `display_name` | 是 |
| 4 | Status | `status` | 是 |
| 5 | Actions | `actions` | 否 |

**API**:`GET /game_provider`、`PUT /game_provider/status/:id`、`POST /game_provider/sequence/update`

## M07-P11 game-provider(詳情)`/game-provider/view/:id`

**唯讀顯示欄位(實機畫面)**:ID、Provider Name、Display Name、Code、Status、Created At、Updated At

**API**:`GET /game_provider/:id`

## M07-P12 Game Type(列表)`/game-type/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Game Type Name | AppTextField | `game_type_name` | 否 |  |  | clearable="" | 頁面 |
| 2 | Status | VAutocomplete | `status` | 否 |  | [{id:M.ACTIVE,name:"Active"},{id:M.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Game Type Name | `game_type_name` | 否 |
| 2 | Sequence No. | `seq_no` | 否 |
| 3 | Created At | `created_at` | 否 |
| 4 | Updated At | `updated_at` | 否 |
| 5 | Status | `status` | 否 |
| 6 | Actions | `actions` | 否 |

**API**:`GET /game_type`、`PUT /game_type/status/:id`、`POST /game_type/sequence/update`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/game_type` | Live Slots、Live Slots  - New、Live Tables、eGaming、Sportsbook |

## M07-P13 game-type(編輯)`/game-type/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Game Type Name | AppTextField | `game_type_name` | 是 | 必填 |  |  | 人工補全 |
| 2 | Statusⁱ | VSwitch | `status` | 否 |  |  | hint=e(A) persistent-hint=e(A) | 頁面 |
| 3 | Game Type Image | VFileInput | `game_type_image` | 否 |  |  | 說明:選填,有選新圖才送出 accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml" | 人工補全 |

> 頁面說明:Game Type Code 只顯示不可改

**唯讀顯示欄位(實機畫面)**:ID、Created At、Updated At

**API**:`GET /game_type/:id`、`POST /game_type/:id`

## M07-P14 game-type(詳情)`/game-type/view/:id`

**唯讀顯示欄位(實機畫面)**:ID、Game Type Name、Game Type Code、Sequence No.、Status、Game Type Image、Created By、Created At、Updated By、Updated At

**API**:`GET /game_type/:id`

## M07-P15 games(新增)`/games/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Game Name | AppTextField | `game_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Game Code | AppTextField | `game_code` | 是 | 必填 |  |  | 頁面 |
| 3 | Game Offering | VAutocomplete | `game_offering_id` | 是 | 必填 | [] | clearable="" item-title="game_offering_name" item-value="game_offering_id" | 頁面 |
| 4 | Game Provider | VAutocomplete | `game_provider_id` | 是 | 必填 | [] | clearable="" item-title="game_provider_name" item-value="game_provider_id" | 頁面 |
| 5 | Rating ID | AppTextField | —(只顯示,不送出;資料來自 `slice`) | 否 |  |  | counter=e(k) maxlength=e(k) prefix=e(E) hint=e(o) persistent-hint="" | 頁面 |
| 6 | Game Type | VAutocomplete | `game_type_id` | 是 | 必填 | [] | clearable="" item-title="game_type_name" item-value="game_type_id" | 頁面 |
| 7 | Game Category | VAutocomplete | `game_category_id` | 是 | 必填 | [] | clearable="" item-title="game_category_name" item-value="game_category_id" | 頁面 |
| 8 | Seq No. | AppTextField | `seq_no` | 否 |  |  | type="number" step="1" | 頁面 |
| 9 | RTP (%) | AppTextField | `rtp` | 否 |  |  | type="number" min=0 max=100 step="0.0000001" | 人工補全 |
| 10 | Game Description | VTextarea | `game_description` | 否 |  |  |  | 頁面 |
| 11 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |
| 12 | Featuredⁱ | VSwitch | `is_featured` | 否 |  |  |  | 頁面 |
| 13 | Hotⁱ | VSwitch | `is_hot` | 否 |  |  |  | 頁面 |
| 14 | Newⁱ | VSwitch | `is_new` | 否 |  |  |  | 頁面 |
| 15 | Demoⁱ | VSwitch | `is_demo` | 否 |  |  |  | 頁面 |
| 16 | Game Image | VFileInput | `game_image` | 是 | 圖片(jpeg/png/webp,≤5MB,必填) |  | accept="image/*" | 人工補全 |

**API**:`GET /game_offerings_dropdown`、`GET /game_providers`、`GET /game_types`、`GET /games_category_dropdown`、`POST /games`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/game_providers` | YellowBat、ETG、Zitro、Nsoft、Jili、Fachai、iTable、iSLot、Skivot、Omniplay、JDB、Playtech、Rps、Light & Wonder、Habanero、Pragmatic Play、Inferno Play |
| `/games_category_dropdown` | Slots、Live Casino、RNG、Sportbook、Table Game、E-Sport、Fishing、Bingo、Arcade、Other、Baccarat、Roulette、Jin Ji Bao Xi Grand、Coin Combo、Standalone、Multi Table、test2、Duo Fu Duo Cai、Standalone、Duo Fu Duo Cai |
| `/game_offerings_dropdown` | eCasino、Sports Betting – Live Sports、Specialty Games – RNG Based、eBingo、Traditional Bingo、Sports Betting – Virtual Sports、Specialty Games – Live Streamed、Numeric Games – Live Streamed、Numeric Games – RNG Based、Online Poker、test1 |
| `/game_types` | Live Slots、Live Tables、eGaming、Live Slots  - New、Sportsbook |

## M07-P16 Games(列表)`/games/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Search Game Name | AppTextField | `game_name` | 否 |  |  | clearable="" | 頁面 |
| 2 | Search Provider | VAutocomplete | `game_provider_id` | 否 |  | [] | clearable="" item-title="game_provider_name" item-value="game_provider_id" | 頁面 |
| 3 | Search Game Type | VAutocomplete | `game_type_id` | 否 |  | [] | clearable="" item-title="game_type_name" item-value="game_type_id" | 頁面 |
| 4 | Search Game Category | VAutocomplete | `game_category_id` | 否 |  | [] | clearable="" item-title="game_category_name" item-value="game_category_id" | 頁面 |
| 5 | Search Status | VAutocomplete | `status` | 否 |  | [{id:y.ACTIVE,name:"Active"},{id:y.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 6 | Search Featured | VAutocomplete | `is_featured` | 否 |  | [{value:1,name:"Yes"},{value:0,name:"No"}] | clearable="" item-title="name" item-value="value" | 頁面 |
| 7 | Search Hot | VAutocomplete | `is_hot` | 否 |  | [{value:1,name:"Yes"},{value:0,name:"No"}] | clearable="" item-title="name" item-value="value" | 頁面 |
| 8 | Search New | VAutocomplete | `is_new` | 否 |  | [{value:1,name:"Yes"},{value:0,name:"No"}] | clearable="" item-title="name" item-value="value" | 頁面 |
| 9 | Search Demo | VAutocomplete | `is_demo` | 否 |  | [{value:1,name:"Yes"},{value:0,name:"No"}] | clearable="" item-title="name" item-value="value" | 頁面 |
| 10 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `game_id` | 是 |
| 2 | Game Image | `game_image` | 否 |
| 3 | Game Name | `game_name` | 是 |
| 4 | Provider | `game_provider.game_provider_name` | 是 |
| 5 | Game Type | `game_type.game_type_name` | 是 |
| 6 | Game Category | `game_category.game_category_name` | 是 |
| 7 | Status | `status` | 是 |
| 8 | Featured | `is_featured` | 是 |
| 9 | Demo | `is_demo` | 是 |
| 10 | Hot | `is_hot` | 是 |
| 11 | New | `is_new` | 是 |
| 12 | Seq No. | `seq_no` | 是 |
| 13 | Rating ID | `halo_game_id` | 否 |
| 14 | Updated At | `updated_at` | 是 |
| 15 | Actions | `actions` | 否 |

**API**:`POST /games/sync-islot-image`、`POST /games/sync-rps-image`、`GET /game_providers`、`GET /game_types`、`GET /games_category_dropdown`、`GET /games`、`PUT /games/status/:id`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/game_providers` | YellowBat、ETG、Zitro、Nsoft、Jili、Fachai、iTable、iSLot、Skivot、Omniplay、JDB、Playtech、Rps、Light & Wonder、Habanero、Pragmatic Play、Inferno Play |
| `/game_types` | Live Slots、Live Tables、eGaming、Live Slots  - New、Sportsbook |
| `/games_category_dropdown` | Slots、Live Casino、RNG、Sportbook、Table Game、E-Sport、Fishing、Bingo、Arcade、Other、Baccarat、Roulette、Jin Ji Bao Xi Grand、Coin Combo、Standalone、Multi Table、test2、Duo Fu Duo Cai、Standalone、Duo Fu Duo Cai |

## M07-P17 games(編輯)`/games/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | ID | AppTextField | —(只顯示,不送出;資料來自 `required`) | 是 | 必填 |  | disabled="" | 頁面 |
| 2 | Game Name | AppTextField | `game_name` | 是 | 必填 |  |  | 頁面 |
| 3 | Game Code | AppTextField | `game_code` | 是 | 必填 |  | disabled="" | 頁面 |
| 4 | Game Offering | VAutocomplete | `game_offering_id` | 是 | 必填 | [] | clearable="" item-title="game_offering_name" item-value="game_offering_id" | 頁面 |
| 5 | Game Provider | VAutocomplete | `game_provider_id` | 是 | 必填 | [] | disabled="" item-title="game_provider_name" item-value="game_provider_id" | 頁面 |
| 6 | Game Type | VAutocomplete | `game_type_id` | 是 | 必填 | [] | disabled="" item-title="game_type_name" item-value="game_type_id" | 頁面 |
| 7 | Rating ID | AppTextField | —(只顯示,不送出;資料來自 `halo_game_id`) | 否 |  |  | counter=e(K) maxlength=e(K) prefix=e(J) hint=e(o) persistent-hint="" | 頁面 |
| 8 | Game Category | VAutocomplete | `game_category_id` | 是 | 必填 | [] | clearable="" item-title="game_category_name" item-value="game_category_id" | 頁面 |
| 9 | Seq No. | AppTextField | `seq_no` | 否 |  |  | type="number" step="1" | 頁面 |
| 10 | RTP (%) | AppTextField | `rtp` | 否 |  |  | type="number" min=0 max=100 step="0.0000001" | 人工補全 |
| 11 | Game Description | VTextarea | `game_description` | 否 |  |  |  | 頁面 |
| 12 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |
| 13 | Featuredⁱ | VSwitch | `is_featured` | 否 |  |  |  | 頁面 |
| 14 | Hotⁱ | VSwitch | `is_hot` | 否 |  |  |  | 頁面 |
| 15 | Newⁱ | VSwitch | `is_new` | 否 |  |  |  | 頁面 |
| 16 | Demoⁱ | VSwitch | `is_demo` | 否 |  |  |  | 頁面 |
| 17 | Game Image | VFileInput | `game_image` | 否 |  |  | accept="image/*" | 人工補全 |

**API**:`GET /game_offerings_dropdown`、`GET /game_providers`、`GET /game_types`、`GET /games_category_dropdown`、`GET /games/:id`、`POST /games/:id`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/game_providers` | YellowBat、ETG、Zitro、Nsoft、Jili、Fachai、iTable、iSLot、Skivot、Omniplay、JDB、Playtech、Rps、Light & Wonder、Habanero、Pragmatic Play、Inferno Play |
| `/games_category_dropdown` | Slots、Live Casino、RNG、Sportbook、Table Game、E-Sport、Fishing、Bingo、Arcade、Other、Baccarat、Roulette、Jin Ji Bao Xi Grand、Coin Combo、Standalone、Multi Table、test2、Duo Fu Duo Cai、Standalone、Duo Fu Duo Cai |
| `/game_offerings_dropdown` | eCasino、Sports Betting – Live Sports、Specialty Games – RNG Based、eBingo、Traditional Bingo、Sports Betting – Virtual Sports、Specialty Games – Live Streamed、Numeric Games – Live Streamed、Numeric Games – RNG Based、Online Poker、test1 |
| `/game_types` | Live Slots、Live Tables、eGaming、Live Slots  - New、Sportsbook |

## M07-P18 games(詳情)`/games/view/:id`

**唯讀顯示欄位(實機畫面)**:ID、Game Name、Game Code、Rating ID、Game Offering、Game Provider、Game Type、Game Category、Seq No.、RTP、Game Description、Status、Featured、Hot、New、Demo、Created By、Created At、Updated By、Updated At、Game Image

**API**:`GET /games/:id`

## M07-P19 quickAccess(新增)`/quickAccess/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 自訂:)}),e=>e&&e.length<=100\|\|a(;自訂:,{field:a(;自訂:),max:100}),e=>/^[A-Z0-9 ]+$/i.test(e\|\|;自訂:{field} is required;自訂:Name;自訂:{field} must not exceed {max} characters;自訂:{field} may only contain letters, numbers, and spaces;長度限制 .length<=100 |  | required="" | 頁面 |
| 2 | Status | VSwitch | `status` | 否 |  |  | 說明:開關顯示 Active / Inactive color="success" | 人工補全 |
| 3 | Icon |  | `icon` | 否 |  |  | 說明:選填 accept="image/png,image/svg+xml" type="file" | 人工補全 |
| 4 | Games | VAutocomplete | `game_list` | 否 |  | [] | multiple="" clearable="" chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |

**API**:`GET /quick_access/get_game_list`、`POST /quick_access`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/quick_access/get_game_list` | Racing Legend Jackpot Link、Muay Thai Legend Jackpot Link、Golden Aztec、Royal Ace、Magic Lamp Jackpot Link、Gladiator Jackpot Link、Golden Aztec Mega、Super Egypt、Sugar Crush、Ocean Phoenix、Open Sesame、Bingo Bingo、Atlantis、Money Bingo、Heat Bingo、Crazy Color、Diamond Mines、Money Blast、Baccarat Comm 1、Baccarat Comm 2、Baccarat Comm 3、Baccarat Comm 4、Baccarat Non-Comm 1、Baccarat Non-Comm 2、Baccarat Non-Comm 3、Baccarat Non-Comm 4、Baccarat Super 6 1、Baccarat Super 6 2、Baccarat Super 6 3、Baccarat Super 6 4、American Blackjack 1、American Blackjack 2、American Blackjack 3、American Blackjack 4、European Blackjack 1、European Blackjack 2、European Blackjack 3、European Blackjack 4、Dragon tiger 1、Dragon tiger 2 …共 60 項 |

## M07-P20 Quick Access(列表)`/quickAccess/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 2 | Status | VAutocomplete | `status` | 否 |  | [{id:1,name:"Active"},{id:0,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Items per page | AppSelect | `value` | 否 |  | [5,10,20,25,50,{title:e."All",value:"all"}] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Name | `name` | 是 |
| 2 | Status | `status` | 是 |
| 3 | Sequence Number | `seq_no` | 是 |
| 4 | No. of Games | `no_of_games` | 是 |
| 5 | Created At | `created_at` | 是 |
| 6 | Actions | `actions` | 否 |

**API**:`GET /quick_access`、`POST /quick_access/sequence/update`

## M07-P21 quickAccess(編輯)`/quickAccess/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 自訂:)}),e=>e&&e.length<=100\|\|l(;自訂:,{field:l(;自訂:),max:100}),e=>/^[A-Z0-9 ]+$/i.test(e\|\|;自訂:{field} is required;自訂:Name;自訂:{field} must not exceed {max} characters;自訂:{field} may only contain letters, numbers, and spaces;長度限制 .length<=100 |  | required="" | 頁面 |
| 2 | Status | VSwitch | `status` | 否 |  |  | 說明:開關顯示 Active / Inactive color="success" | 人工補全 |
| 3 | Games | VAutocomplete | `game_list` | 否 |  | [] | multiple="" clearable="" chips="" item-title="title" item-value="value" closable-chips="" | 頁面 |
| 4 | Icon |  | `icon` | 否 |  |  | 說明:選填 accept="image/png,image/svg+xml" type="file" | 人工補全 |

**API**:`GET /quick_access/get_game_list`、`GET /quick_access/:id`、`GET /quick_access_game/:id`、`POST /quick_access/:id`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/quick_access/get_game_list` | Racing Legend Jackpot Link、Muay Thai Legend Jackpot Link、Golden Aztec、Royal Ace、Magic Lamp Jackpot Link、Gladiator Jackpot Link、Golden Aztec Mega、Super Egypt、Sugar Crush、Ocean Phoenix、Open Sesame、Bingo Bingo、Atlantis、Money Bingo、Heat Bingo、Crazy Color、Diamond Mines、Money Blast、Baccarat Comm 1、Baccarat Comm 2、Baccarat Comm 3、Baccarat Comm 4、Baccarat Non-Comm 1、Baccarat Non-Comm 2、Baccarat Non-Comm 3、Baccarat Non-Comm 4、Baccarat Super 6 1、Baccarat Super 6 2、Baccarat Super 6 3、Baccarat Super 6 4、American Blackjack 1、American Blackjack 2、American Blackjack 3、American Blackjack 4、European Blackjack 1、European Blackjack 2、European Blackjack 3、European Blackjack 4、Dragon tiger 1、Dragon tiger 2 …共 60 項 |

## M07-P22 Quick Access Management(詳情)`/quickAccess/view/:id`

**表格欄位(實機畫面)**:Provider's Name、Game Name、Created At

**API**:`GET /quick_access/:id`、`GET /quick_access_game/:id`

