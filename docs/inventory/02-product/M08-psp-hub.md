# M08 支付通道(PSP Hub)— 模塊內容與操作流程(產品)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

## 模塊說明

管理支付服務商(PSP)通道:是否支援存款/提款、手續費、單筆上下限、圖示。

## 頁面一覽

| 頁面 | 名稱 | 類型 | 路由 | 主要操作 |
|---|---|---|---|---|
| M08-P01 | psp | 新增 | `/psp/add` | Cancel、Save |
| M08-P02 | PSP Listing | 列表 | `/psp/list` | Clear、Search、View、Edit |
| M08-P03 | psp | 編輯 | `/psp/update/:id` | Cancel、Update |
| M08-P04 | psp | 詳情 | `/psp/view/:id` | Edit |

## 頁面流程圖

```mermaid
flowchart LR
  subgraph G1["PSP Listing"]
    M08_P01["M08-P01 新增"]
    M08_P02["M08-P02 列表"]
    M08_P03["M08-P03 編輯"]
    M08_P04["M08-P04 詳情"]
  end
  M08_P02 -->|新增| M08_P01
  M08_P01 -->|儲存成功| M08_P02
  M08_P02 -->|檢視| M08_P04
  M08_P02 -->|編輯| M08_P03
  M08_P04 -->|編輯| M08_P03
  M08_P03 -->|更新成功| M08_P02
```

## 頁面內容與操作說明

### M08-P01 psp(新增)

- 路由:`/psp/add`  權限:`create:psp`
- 功能點:M08-F01 新增
- 表單欄位:Supported formats: PNG, JPG, SVG, WebP. Maximum size: 5MB、Name、Code、External Code、Type、Category、Status、Deposit Capability、Withdrawal Capability、Service Fee、Maximum Limit、Minimum Limit、Service Fee、Maximum Limit、Minimum Limit(欄位規則見 03 開發欄位控制)
- 系統提示:「PSP created successfully」、「Error creating PSP: {error}」
- 選單位置:由列表進入;實機狀態:無權限(目前登入帳號沒有此頁權限)

**操作步驟**

1. 開啟新增頁,系統載入下拉選項
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Save」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /psp
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟新增頁"] --> B["載入選項 無"]
  B --> C["填寫 15 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /psp"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M08-P02 PSP Listing(列表)

- 路由:`/psp/list`  權限:`view:psp`
- 功能點:M08-F02 查詢列表、M08-F03 欄位排序、M08-F04 分頁
- 表格欄位:Icon、Name、Code、Type、Category、Deposit Capability、Withdrawal Capability、Status、Created At、Updated At、Actions
- 篩選條件:Name、Code、External Code、Type、Category、Status、Deposit Capability、Withdrawal Capability、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「PSP status changed successfully」
- 選單位置:✅ 選單;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/psp_list.png`

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/psp)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序

### M08-P03 psp(編輯)

- 路由:`/psp/update/:id`  權限:`edit:psp`
- 功能點:M08-F05 編輯
- 頁面說明:編輯頁 Code、External Code、Type、Category 只顯示不可改
- 條件顯示的欄位:Icon(圖示上傳區(標籤在圖片預覽旁))
- 表單欄位:Icon、Name、Status、Deposit Capability、Withdrawal Capability、Service Fee、Maximum Limit、Minimum Limit、Service Fee、Maximum Limit、Minimum Limit(欄位規則見 03 開發欄位控制)
- 系統提示:「PSP not found」、「Error fetching PSP details: {error}」、「PSP updated successfully」、「Error updating PSP: {error}」
- 選單位置:由列表進入;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/psp_update_id.png`

**操作步驟**

1. 開啟編輯頁,系統載入下拉選項(/psp/:id)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Update」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 PUT /psp/:id
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟編輯頁"] --> B["載入選項 /psp/:id"]
  B --> C["填寫 11 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["PUT /psp/:id"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M08-P04 psp(詳情)

- 路由:`/psp/view/:id`  權限:`view:psp`
- 功能點:M08-F06 檢視詳情
- 顯示內容(實機):Icon、Name、Code、External Code、Type、Category、Status、Deposit Capability、Withdrawal Capability、Created At、Updated At、Service Fee、Maximum Limit、Minimum Limit
- 系統提示:「PSP not found」
- 選單位置:由列表進入;實機狀態:✅ 一致;截圖(本機,不進 git):`.playwright-output/live/psp_view_id.png`

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/psp/:id)
2. 按「Edit」進入編輯頁

