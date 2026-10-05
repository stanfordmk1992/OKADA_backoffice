# M11 維護排程 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M11-P01 maintenance(新增)`/maintenance/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Reason | AppTextField | `reason` | 是 | 必填 |  |  | 頁面 |
| 2 | Type | VAutocomplete | `maintenance_type_id` | 是 | 必填 | [] | clearable="" item-value="maintenance_type_id" | 頁面 |
| 3 | Target | VAutocomplete | `maintenance_target_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="maintenance_target_id" | 頁面 |
| 4 | Schedule Start DateTime ~ Schedule End DateTime | DateRangePicker | `schedule_start_dateTime ~ schedule_end_dateTime` | 否 |  |  | 說明:選填,有值才送出 | 人工補全 |

**API**:`POST /maintenance_record`、`GET /maintenance_type`、`GET /maintenance_status`、`GET /maintenance_target`

## M11-P02 Maintenance Listing(列表)`/maintenance/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Type | VAutocomplete | `maintenance_type_name` | 否 |  | [] | clearable="" item-title="maintenance_type_name" item-value="maintenance_type_name" | 頁面 |
| 2 | Status | VAutocomplete | `maintenance_status_name` | 否 |  | [] | clearable="" item-title="maintenance_status_name" item-value="maintenance_status_name" | 頁面 |
| 3 | Target | VAutocomplete | `maintenance_target_name` | 否 |  | [] | clearable="" item-title="name" item-value="name" | 頁面 |
| 4 | Schedule Start Date (FROM) ~ Schedule Start Date (TO) | DateRangePicker |  | 否 |  |  |  | 頁面 |
| 5 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Schedule Start DateTime | `schedule_start_dateTime` | 是 |
| 2 | Schedule End DateTime | `schedule_end_dateTime` | 是 |
| 3 | Reason | `reason` | 否 |
| 4 | Type | `maintenance_type_name` | 是 |
| 5 | Target | `maintenance_target_name` | 是 |
| 6 | Status | `maintenance_status_name` | 否 |
| 7 | Actual Start DateTime | `actual_start_dateTime` | 是 |
| 8 | Actual End DateTime | `actual_end_dateTime` | 是 |
| 9 | Created At | `created_at` | 是 |
| 10 | Actions | `actions` | 否 |

**API**:`GET /maintenance_record`、`GET /maintenance_type`、`GET /maintenance_status`、`GET /maintenance_target`

## M11-P03 maintenance(編輯)`/maintenance/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Reason | AppTextField | `reason` | 是 | 必填 |  |  | 頁面 |
| 2 | Status | VAutocomplete | `maintenance_status_id` | 是 | 必填 | API 動態載入 | disabled=e(O) clearable="" item-title="maintenance_status_name" item-value="maintenance_status_id" | 頁面 |

**API**:`GET /maintenance_record/:id`、`PUT /maintenance_record/:id`、`GET /maintenance_status`

## M11-P04 maintenance(詳情)`/maintenance/view/:id`

**API**:`GET /maintenance_record/:id`

