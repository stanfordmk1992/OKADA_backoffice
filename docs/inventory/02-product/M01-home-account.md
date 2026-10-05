# M01 首頁與帳號(Home / Account)— 模塊內容與操作流程(產品)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

## 模塊說明

後台登入後的首頁,以及管理員修改自己的密碼。

## 頁面一覽

| 頁面 | 名稱 | 類型 | 路由 | 主要操作 |
|---|---|---|---|---|
| M01-P01 | Home | 頁面 | `/` |  |
| M01-P02 | My Profile | 頁面 | `/profile` |  |
| M01-P03 | second-page | 頁面 | `/second-page` |  |

## 頁面流程圖

```mermaid
flowchart LR
  subgraph G1["Home"]
    M01_P01["M01-P01 頁面"]
  end
  subgraph G2["My Profile"]
    M01_P02["M01-P02 頁面"]
  end
  subgraph G3["second-page"]
    M01_P03["M01-P03 頁面"]
  end
```

## 頁面內容與操作說明

### M01-P01 Home(頁面)

- 路由:`/`  權限:`登入即可`
- 功能點:M01-F01 頁面
- 實機狀態:待實機查驗

### M01-P02 My Profile(頁面)

- 路由:`/profile`  權限:`登入即可`
- 功能點:M01-F02 頁面
- 表單欄位:Current Password、New Password、Confirm New Password(欄位規則見 03 開發欄位控制)
- 系統提示:「Profile not found」、「Password Changed successfully」、「Error changing password: {error}」
- 實機狀態:待實機查驗

### M01-P03 second-page(頁面)

- 路由:`/second-page`  權限:`view:users`
- 功能點:M01-F03 頁面
- 實機狀態:待實機查驗

