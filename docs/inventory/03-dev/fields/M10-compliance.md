# M10 合規 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M10-P01 Audit Logs(列表)`/audits/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | User Name | AppTextField | `user_name` | 否 |  |  |  | 頁面 |
| 2 | Type | AppTextField | `auditable_type` | 否 |  |  |  | 頁面 |
| 3 | Event | AppTextField | `event` | 否 |  |  |  | 頁面 |
| 4 | IP Address | AppTextField | `ip_address` | 否 |  |  |  | 頁面 |
| 5 | IP Addressⁱ | DateRangePicker | `date_from ~ date_to` | 否 |  |  |  | 頁面 |
| 6 | Items per page | AppSelect | `per_page` | 否 |  | [10,20,25,50,100] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | User Name | `user_name` | 是 |
| 2 | Type | `auditable_type` | 是 |
| 3 | Event | `event` | 是 |
| 4 | Description | `description` | 否 |
| 5 | IP Address | `ip_address` | 是 |
| 6 | User Agent | `user_agent` | 否 |
| 7 | Created At | `created_at` | 是 |

**API**:`GET /audits`

