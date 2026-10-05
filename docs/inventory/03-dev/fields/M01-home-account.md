# M01 首頁與帳號 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M01-P02 My Profile(頁面)`/profile`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Current Password | AppTextField | `current_password` | 是 | 必填 |  | type=m.value | 頁面 |
| 2 | New Password | AppTextField | `password` | 是 | 必填 |  | type=m.value | 頁面 |
| 3 | Confirm New Password | AppTextField | `confirm_password` | 是 | 必填 |  | type=S.value | 頁面 |

> 頁面說明:上方顯示自己的 Name、Email、Role(唯讀),下方修改密碼

**API**:`GET /my_profile`

