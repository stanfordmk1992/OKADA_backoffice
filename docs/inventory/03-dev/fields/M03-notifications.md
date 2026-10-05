# M03 通知 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M03-P01 notifications(新增)`/notifications/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Notification Name | AppTextField | `notification_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Frequency | VAutocomplete | `notification_frequency` | 是 | 必填 | [{name:"Upon Login",notification_frequency_code:"upon_login"},{name:"Once",notification_frequency_code:"once"}] | clearable="" item-title="name" item-value="notification_frequency_code" | 頁面 |
| 3 | Start Date ~ End Date | DateRangePicker | `notification_start_date ~ notification_end_date` | 否 |  |  |  | 頁面 |
| 4 | Pop Upⁱ | VSwitch | `notification_pop_up` | 否 |  |  |  | 頁面 |
| 5 | Statusⁱ | VSwitch | `notification_status` | 否 |  |  |  | 頁面 |
| 6 | All Playersⁱ | VSwitch | `notification_all_patron` | 否 |  |  |  | 頁面 |
| 7 | Player ID | VAutocomplete | `notification_patron_id_array` | 否 |  | [] | 顯示條件:未勾選全部玩家(notification_all_patron)時顯示 multiple="" clearable="" chips="" item-title="title" item-value="value" closable-chips="" | 人工補全 |
| 8 | Content | TiptapEditor | `notification_content` | 是 | 自訂:is required |  | 說明:送出前以 Base64 編碼 HTML | 人工補全 |

**API**:`GET /lookup/players`、`POST /notification`

## M03-P02 Notifications List(列表)`/notifications/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Notification Name | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 2 | Start Date (FROM) ~ Start Date (TO) | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 3 | Pop Up | VAutocomplete | `pop_up` | 否 |  | [{id:oe.TRUE,name:"Yes"},{id:oe.FALSE,name:"No"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | Frequency | VAutocomplete | `notification_frequency` | 否 |  | [{id:le.UPON_LOGIN,name:"Upon Login"},{id:le.ONCE,name:"Once"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 5 | Status | VAutocomplete | `status` | 否 |  | [{id:w.ACTIVE,name:"Active"},{id:w.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 6 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | ID | `notification_id` | 是 |
| 2 | Notification Name | `name` | 是 |
| 3 | Start Date | `start_date` | 是 |
| 4 | End Date | `end_date` | 是 |
| 5 | Pop Up | `pop_up` | 是 |
| 6 | Frequency | `frequency` | 是 |
| 7 | Status | `status` | 是 |
| 8 | Actions | `actions` | 否 |

**API**:`GET /notification`、`PUT /notification/status/:id`

## M03-P03 notifications(編輯)`/notifications/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Notification Name | AppTextField | `notification_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Frequency | VAutocomplete | `notification_frequency` | 是 | 必填 | [{name:"Upon Login",notification_frequency_code:"upon_login"},{name:"Once",notification_frequency_code:"once"}] | clearable="" item-title="name" item-value="notification_frequency_code" | 頁面 |
| 3 | Start Date ~ End Date | DateRangePicker | `notification_start_date ~ notification_end_date` | 否 |  |  |  | 頁面 |
| 4 | Statusⁱ | VSwitch | `notification_status` | 否 |  |  |  | 頁面 |
| 5 | Pop Upⁱ | VSwitch | `notification_pop_up` | 否 |  |  |  | 頁面 |
| 6 | All Playersⁱ | VSwitch | `notification_all_patron` | 否 |  |  |  | 頁面 |
| 7 | Player ID | VAutocomplete | `notification_patron_id_array` | 否 |  | [] | 顯示條件:未勾選全部玩家(notification_all_patron)時顯示 multiple="" clearable="" chips="" item-title="member_id" item-value="id" closable-chips="" | 人工補全 |
| 8 | Content | TiptapEditor | `notification_content` | 是 | 自訂:is required |  | 說明:送出前以 Base64 編碼 HTML;建議內文圖片總大小 ≤ 4MB | 人工補全 |

**API**:`GET /lookup/players`、`GET /notification/:id`、`POST /notification/:id`

## M03-P04 notifications(詳情)`/notifications/view/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Search Name | AppTextField | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 2 | Start Date (FROM) ~ Start Date (TO) | DateRangePicker |  | 否 |  |  |  | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**唯讀顯示欄位(實機畫面)**:Notification Name、Frequency、Pop Up、Status、Created At、Updated At

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Player ID | `player.name` | 是 |
| 2 | Sent Date | `created_at` | 是 |

**API**:`GET /notification/:id`、`GET /notification/:id/player_list`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/notification/1028/player_list` |  |

