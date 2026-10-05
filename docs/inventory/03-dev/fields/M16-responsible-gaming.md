# M16 責任博彩報表 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M16-P01 betting-limit(列表)`/reports/betting-limit/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID | AppTextField | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 2 | Status | AppSelect | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 3 | Limit Period | AppSelect | `modelValue` | 否 |  |  | 顯示條件:Limit Change Report 頁籤 clearable="" | 人工補全 |
| 4 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50] |  | 頁面 |

**表格欄位(實機畫面)**:Player ID、Limit Period、limit、Usage、Status

**API**:`GET /report/betting_limit/player`、`GET /report/betting_limit/limit_change`、`GET /report/betting_limit/high_usage`

## M16-P02 self-exclusion(列表)`/reports/self-exclusion/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Member ID | AppTextField | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 2 | Status | AppSelect | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |
| 4 | 狀態切換(列表每列) | VSwitch | `—(列表列內操作)` | 否 |  |  | 顯示條件:列表每一列的狀態開關 color="success" | 人工補全 |

> 頁面說明:表頭部分寫在頁面內,以實機為準

**表格欄位(實機畫面)**:Player ID、Self-Exclusion Start Date、Self-Exclusion End Date、Status、Actions

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Status | `status` | 是 |
| 2 | Actions | `actions` | 是 |

**API**:`GET /report/self_exclusion/list`、`POST /report/self_exclusion/toggle_status`

## M16-P03 responsible-gaming-report / betting-limit(列表)`/responsible-gaming-report/betting-limit/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Player ID | AppTextField | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 2 | Status | AppSelect | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 3 | Limit Period | AppSelect | `modelValue` | 否 |  |  | 顯示條件:Limit Change Report 頁籤 clearable="" | 人工補全 |
| 4 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |

**表格欄位(實機畫面)**:Player ID、Limit Period、limit、Usage、Status

**API**:`GET /report/betting_limit/player`、`GET /report/betting_limit/limit_change`、`GET /report/betting_limit/high_usage`

## M16-P04 responsible-gaming-report / self-exclusion(列表)`/responsible-gaming-report/self-exclusion/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Player ID | AppTextField | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 2 | Status | AppSelect | `modelValue` | 否 |  |  | clearable="" | 頁面 |
| 3 | Items per page | AppSelect | `per_page` | 否 |  | [5,10,20,25,50] |  | 頁面 |
| 4 | 狀態切換(列表每列) | VSwitch | `—(列表列內操作)` | 否 |  |  | 顯示條件:列表每一列的狀態開關 color="success" | 人工補全 |

> 頁面說明:表頭部分寫在頁面內,以實機為準

**表格欄位(實機畫面)**:Player ID、Self-Exclusion Start Date、Self-Exclusion End Date、Status、Actions

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Status | `status` | 是 |
| 2 | Actions | `actions` | 是 |

**API**:`GET /report/self_exclusion/list`、`POST /report/self_exclusion/toggle_status`

