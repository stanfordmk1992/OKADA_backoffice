# M14 系統設定 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M14-P01 roles(新增)`/roles/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 2 | Code | AppTextField | `code` | 是 | 必填 |  |  | 頁面 |
| 3 | Description | AppTextField | `description` | 否 |  |  | type="textarea" rows="3" | 頁面 |
| 4 | Statusⁱ | VSwitch | `is_active` | 否 |  |  | color="success" | 頁面 |
| 5 | Select All | VCheckbox | 未確定 | 否 |  |  | color="primary" | 頁面 |
| 6 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 7 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 8 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 9 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 10 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 11 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 12 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 13 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 14 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 15 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 16 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 17 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |

**API**:`GET /menus`、`GET /menu_permissions`、`POST /roles`、`POST /roles/:id/permissions`

## M14-P02 Role Management(列表)`/roles/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 2 | Code | AppTextField | `code` | 否 |  |  |  | 頁面 |
| 3 | Status | VAutocomplete | `is_active` | 否 |  | [{id:d.ACTIVE,name:"Active"},{id:d.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Name | `name` | 是 |
| 2 | Code | `code` | 是 |
| 3 | Description | `description` | 是 |
| 4 | Status | `is_active` | 是 |
| 5 | Created At | `created_at` | 是 |
| 6 | Updated At | `updated_at` | 是 |
| 7 | Actions | `actions` | 否 |

**API**:`GET /roles`、`DELETE /roles/:id`、`PUT /roles/:id`

## M14-P03 roles(編輯)`/roles/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 2 | Code | AppTextField | `code` | 是 | 必填 |  |  | 頁面 |
| 3 | Description | AppTextField | `description` | 否 |  |  | type="textarea" rows="3" | 頁面 |
| 4 | Statusⁱ | VSwitch | `is_active` | 否 |  |  | color="success" | 頁面 |
| 5 | Select All | VCheckbox | 未確定 | 否 |  |  | color="primary" | 頁面 |
| 6 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 7 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 8 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 9 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 10 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 11 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 12 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 13 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 14 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 15 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 16 | Select Allⁱ | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |
| 17 | VCheckbox | VCheckbox | 未確定 | 否 |  |  |  | 頁面 |

**API**:`GET /roles/:id`、`GET /menus`、`GET /roles/:id/permissions`、`PUT /roles/:id`、`PUT /roles/:id/permissions`

## M14-P04 roles(詳情)`/roles/view/:id`

**API**:`GET /roles/:id`、`GET /menus`、`GET /roles/:id/permissions`

## M14-P05 users(新增)`/users/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 2 | Email | AppTextField | `email` | 是 | 必填;Email 格式 |  |  | 頁面 |
| 3 | Password | AppTextField | `password` | 是 | 必填 |  | type=e(U) | 頁面 |
| 4 | Confirm Password | AppTextField | `confirm_password` | 是 | 必填 |  | type=e($) | 頁面 |
| 5 | Role | VAutocomplete | `role_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="id" | 頁面 |
| 6 | Active Statusⁱ | VSwitch | `is_active` | 否 |  |  |  | 頁面 |

**API**:`GET /roles-look-up`、`POST /users`

## M14-P06 User Management(列表)`/users/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 2 | Email | AppTextField | `email` | 否 |  |  |  | 頁面 |
| 3 | Role | VAutocomplete | `role_id` | 否 |  | [] | multiple="" clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | Status | VAutocomplete | `is_active` | 否 |  | [{id:V.ACTIVE,name:"Active"},{id:V.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 5 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Name | `name` | 是 |
| 2 | Email | `email` | 是 |
| 3 | Role | `role` | 否 |
| 4 | Status | `is_active` | 是 |
| 5 | Created At | `created_at` | 是 |
| 6 | Updated At | `updated_at` | 是 |
| 7 | Actions | `actions` | 否 |

**API**:`GET /roles-look-up`、`GET /users`、`DELETE /users/:id`、`PUT /users/:id`

## M14-P07 users(編輯)`/users/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 2 | Email | AppTextField | `email` | 是 | 必填;Email 格式 |  |  | 頁面 |
| 3 | Role | VAutocomplete | `role_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="id" | 頁面 |

**API**:`GET /roles-look-up`、`GET /users/:id`、`PUT /users/:id`

## M14-P08 users(詳情)`/users/view/:id`

**API**:`GET /users/:id`

