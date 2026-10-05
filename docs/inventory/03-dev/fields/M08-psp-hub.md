# M08 支付通道 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M08-P01 psp(新增)`/psp/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Supported formats: PNG, JPG, SVG, WebP. Maximum size: 5MB | VFileInput | `icon` | 否 |  |  | accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" | 頁面 |
| 2 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 3 | Code | AppTextField | `—(不送出)` | 否 |  |  | 說明:唯讀,由 Name 自動產生:轉小寫、空白改底線 disabled="" hint=e(t) persistent-hint="" | 人工補全 |
| 4 | External Code | AppTextField | `ext_code` | 否 |  |  |  | 頁面 |
| 5 | Type | AppSelect | `type` | 是 | 必填 | [{value:"local",title:"local"},{value:"ub",title:"ub"}] |  | 頁面 |
| 6 | Category | AppSelect | `category` | 是 | 必填 | [{value:"bank",title:"bank"},{value:"ewallet",title:"ewallet"}] |  | 頁面 |
| 7 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |
| 8 | Deposit Capabilityⁱ | VSwitch | `is_deposit` | 否 |  |  |  | 頁面 |
| 9 | Withdrawal Capabilityⁱ | VSwitch | `is_withdrawal` | 否 |  |  |  | 頁面 |
| 10 | Service Fee | AppTextField | `deposit_service_fee` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 11 | Maximum Limit | AppTextField | `deposit_max_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 12 | Minimum Limit | AppTextField | `deposit_min_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 13 | Service Fee | AppTextField | `withdrawal_service_fee` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 14 | Maximum Limit | AppTextField | `withdrawal_max_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 15 | Minimum Limit | AppTextField | `withdrawal_min_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |

**API**:`POST /psp`

## M08-P02 PSP Listing(列表)`/psp/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 2 | Code | AppTextField | `code` | 否 |  |  |  | 頁面 |
| 3 | External Code | AppTextField | `ext_code` | 否 |  |  |  | 頁面 |
| 4 | Type | VAutocomplete | `type` | 否 |  | [{id:"local",name:"local"},{id:"ub",name:"ub"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 5 | Category | VAutocomplete | `category` | 否 |  | [{id:"bank",name:"bank"},{id:"ewallet",name:"ewallet"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 6 | Status | VAutocomplete | `status` | 否 |  | [{id:1,name:"Active"},{id:0,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 7 | Deposit Capability | VAutocomplete | `is_deposit` | 否 |  | [{id:1,name:"Yes"},{id:0,name:"No"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 8 | Withdrawal Capability | VAutocomplete | `is_withdrawal` | 否 |  | [{id:1,name:"Yes"},{id:0,name:"No"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 9 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Icon | `icon` | 否 |
| 2 | Name | `name` | 是 |
| 3 | Code | `code` | 是 |
| 4 | Type | `type` | 是 |
| 5 | Category | `category` | 是 |
| 6 | Deposit Capability | `is_deposit` | 是 |
| 7 | Withdrawal Capability | `is_withdrawal` | 是 |
| 8 | Status | `status` | 是 |
| 9 | Created At | `created_at` | 是 |
| 10 | Updated At | `updated_at` | 是 |
| 11 | Actions | `actions` | 否 |

**API**:`GET /psp`、`PUT /psp/:id`

## M08-P03 psp(編輯)`/psp/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Icon | VFileInput | `icon` | 否 |  |  | 顯示條件:圖示上傳區(標籤在圖片預覽旁) 說明:PNG、JPG、SVG、WebP,≤ 5MB;有選新圖才送出(改用 FormData + _method=PUT) accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" | 人工補全 |
| 2 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 3 | Statusⁱ | VSwitch | `status` | 否 |  |  |  | 頁面 |
| 4 | Deposit Capabilityⁱ | VSwitch | `is_deposit` | 否 |  |  |  | 頁面 |
| 5 | Withdrawal Capabilityⁱ | VSwitch | `is_withdrawal` | 否 |  |  |  | 頁面 |
| 6 | Service Fee | AppTextField | `deposit_service_fee` | 是 | 必填 |  | type="number" min="0" step="0.01" | 頁面 |
| 7 | Maximum Limit | AppTextField | `deposit_max_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 8 | Minimum Limit | AppTextField | `deposit_min_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 9 | Service Fee | AppTextField | `withdrawal_service_fee` | 是 | 必填 |  | type="number" min="0" step="0.01" | 頁面 |
| 10 | Maximum Limit | AppTextField | `withdrawal_max_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |
| 11 | Minimum Limit | AppTextField | `withdrawal_min_limit` | 否 |  |  | type="number" min="0" step="0.01" | 頁面 |

> 頁面說明:編輯頁 Code、External Code、Type、Category 只顯示不可改

**API**:`GET /psp/:id`、`PUT /psp/:id`

## M08-P04 psp(詳情)`/psp/view/:id`

**唯讀顯示欄位(實機畫面)**:Icon、Name、Code、External Code、Type、Category、Status、Deposit Capability、Withdrawal Capability、Created At、Updated At、Service Fee、Maximum Limit、Minimum Limit

**API**:`GET /psp/:id`

