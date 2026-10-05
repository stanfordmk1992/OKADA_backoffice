# M09 遊戲中心(Games Hub)— 模塊內容與操作流程(產品)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

## 模塊說明

管理遊戲大廳:遊戲、遊戲類型、遊戲分類、遊戲供應商、遊戲產品線(Game Offering)、精選遊戲、快捷入口,以及遊戲投注紀錄報表。

## 頁面一覽

| 頁面 | 名稱 | 類型 | 路由 | 主要操作 |
|---|---|---|---|---|
| M09-P01 | Featured eGames | 列表 | `/featured-games/list` | Clear、Search、Cancel、Save |
| M09-P02 | game-category | 新增 | `/game-category/add` | Cancel、Save |
| M09-P03 | Game Category | 列表 | `/game-category/list` | Clear、Search、View、Edit |
| M09-P04 | game-category | 編輯 | `/game-category/update/:id` | Cancel、Update |
| M09-P05 | game-category | 詳情 | `/game-category/view/:id` | Edit |
| M09-P06 | game-offering | 新增 | `/game-offering/add` | Cancel、Save |
| M09-P07 | Game Offerings | 列表 | `/game-offering/list` | Clear、Search、View、Edit |
| M09-P08 | game-offering | 編輯 | `/game-offering/update/:id` | Cancel、Update |
| M09-P09 | game-offering | 詳情 | `/game-offering/view/:id` | Edit |
| M09-P10 | Game Providers | 列表 | `/game-provider/list` | Clear、Search |
| M09-P11 | game-provider | 詳情 | `/game-provider/view/:id` |  |
| M09-P12 | Game Type | 列表 | `/game-type/list` | Clear、Search、View、Edit |
| M09-P13 | game-type | 編輯 | `/game-type/update/:id` | Cancel、Update |
| M09-P14 | game-type | 詳情 | `/game-type/view/:id` | Edit |
| M09-P15 | games | 新增 | `/games/add` | Cancel、Save |
| M09-P16 | Games | 列表 | `/games/list` | Clear、Search、View、Edit |
| M09-P17 | games | 編輯 | `/games/update/:id` | Cancel、Update |
| M09-P18 | games | 詳情 | `/games/view/:id` | Edit |
| M09-P19 | quickAccess | 新增 | `/quickAccess/add` | Cancel、Save、Upload |
| M09-P20 | Quick Access | 列表 | `/quickAccess/list` | Clear、Search、View、Edit |
| M09-P21 | quickAccess | 編輯 | `/quickAccess/update/:id` | Cancel、Save、Upload |
| M09-P22 | Quick Access Management | 詳情 | `/quickAccess/view/:id` | Edit |
| M09-P23 | Game Report | 列表 | `/reports/game-report/list` | Clear、Download CSV、Search |

## 頁面流程圖

```mermaid
flowchart LR
  subgraph G1["Featured eGames"]
    M09_P01["M09-P01 列表"]
  end
  M09_P01 -.-> M09_P01_3915(["啟用/停用切換"])
  M09_P01 -.-> M09_P01_115(["拖曳調整顯示順序"])
  subgraph G2["Game Category"]
    M09_P02["M09-P02 新增"]
    M09_P03["M09-P03 列表"]
    M09_P04["M09-P04 編輯"]
    M09_P05["M09-P05 詳情"]
  end
  M09_P03 -->|新增| M09_P02
  M09_P02 -->|儲存成功| M09_P03
  M09_P03 -->|檢視| M09_P05
  M09_P03 -->|編輯| M09_P04
  M09_P05 -->|編輯| M09_P04
  M09_P04 -->|更新成功| M09_P03
  M09_P03 -.-> M09_P03_464(["啟用/停用切換"])
  M09_P03 -.-> M09_P03_5110(["拖曳調整顯示順序"])
  subgraph G3["Game Offerings"]
    M09_P06["M09-P06 新增"]
    M09_P07["M09-P07 列表"]
    M09_P08["M09-P08 編輯"]
    M09_P09["M09-P09 詳情"]
  end
  M09_P07 -->|新增| M09_P06
  M09_P06 -->|儲存成功| M09_P07
  M09_P07 -->|檢視| M09_P09
  M09_P07 -->|編輯| M09_P08
  M09_P09 -->|編輯| M09_P08
  M09_P08 -->|更新成功| M09_P07
  M09_P07 -.-> M09_P07_678(["啟用/停用切換"])
  M09_P07 -.-> M09_P07_6100(["拖曳調整顯示順序"])
  subgraph G4["Game Providers"]
    M09_P10["M09-P10 列表"]
    M09_P11["M09-P11 詳情"]
  end
  M09_P10 -->|檢視| M09_P11
  M09_P10 -.-> M09_P10_2431(["啟用/停用切換"])
  M09_P10 -.-> M09_P10_6029(["拖曳調整顯示順序"])
  subgraph G5["Game Type"]
    M09_P12["M09-P12 列表"]
    M09_P13["M09-P13 編輯"]
    M09_P14["M09-P14 詳情"]
  end
  M09_P12 -->|檢視| M09_P14
  M09_P12 -->|編輯| M09_P13
  M09_P14 -->|編輯| M09_P13
  M09_P13 -->|更新成功| M09_P12
  M09_P12 -.-> M09_P12_1852(["啟用/停用切換"])
  M09_P12 -.-> M09_P12_49(["拖曳調整顯示順序"])
  subgraph G6["Games"]
    M09_P15["M09-P15 新增"]
    M09_P16["M09-P16 列表"]
    M09_P17["M09-P17 編輯"]
    M09_P18["M09-P18 詳情"]
  end
  M09_P16 -->|新增| M09_P15
  M09_P15 -->|儲存成功| M09_P16
  M09_P16 -->|檢視| M09_P18
  M09_P16 -->|編輯| M09_P17
  M09_P18 -->|編輯| M09_P17
  M09_P17 -->|更新成功| M09_P16
  M09_P16 -.-> M09_P16_114(["同步供應商遊戲圖片 islot"])
  M09_P16 -.-> M09_P16_3020(["同步供應商遊戲圖片 rps"])
  M09_P16 -.-> M09_P16_3769(["啟用/停用切換"])
  subgraph G7["Quick Access"]
    M09_P19["M09-P19 新增"]
    M09_P20["M09-P20 列表"]
    M09_P21["M09-P21 編輯"]
    M09_P22["M09-P22 詳情"]
  end
  M09_P20 -->|新增| M09_P19
  M09_P19 -->|儲存成功| M09_P20
  M09_P20 -->|檢視| M09_P22
  M09_P20 -->|編輯| M09_P21
  M09_P22 -->|編輯| M09_P21
  M09_P21 -->|更新成功| M09_P20
  M09_P20 -.-> M09_P20_4975(["拖曳調整顯示順序"])
  subgraph G8["Game Report"]
    M09_P23["M09-P23 列表"]
  end
```

## 頁面內容與操作說明

### M09-P01 Featured eGames(列表)

- 路由:`/featured-games/list`  權限:`view:featured-games`
- 功能點:M09-F01 查詢列表、M09-F02 欄位排序、M09-F03 分頁、M09-F04 啟用/停用切換、M09-F05 拖曳調整顯示順序
- 表格欄位:Game Name、Status、Sequence Number、Created At、Actions
- 篩選條件:Game Name、Status、Items per page、Select Games(欄位規則見 03 開發欄位控制)
- 系統提示:「Please select at least one game」、「Featured Games added successfully」、「Featured Game removed successfully」、「Featured Game sequence updated successfully」、「Drag disabled while searching. Clear filters to reorder」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/featured_games、/game_list_dropdown)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 啟用/停用切換(POST /featured_games/status/:id)
5. 拖曳調整顯示順序(POST /featured_games/sequence/update)

### M09-P02 game-category(新增)

- 路由:`/game-category/add`  權限:`create:game-category`
- 功能點:M09-F06 新增
- 表單欄位:Category Name、Game Type、Category Image、Status(欄位規則見 03 開發欄位控制)
- 系統提示:「Category created successfully」、「Error creating category: {error}」、「File size must be less than 5MB」、「Invalid file type. Supported formats: JPEG, PNG, JPG, GIF, SVG」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟新增頁,系統載入下拉選項(/provider/game_types)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Save」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /provider/game_category
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟新增頁"] --> B["載入選項 /provider/game_types"]
  B --> C["填寫 4 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /provider/game_category"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P03 Game Category(列表)

- 路由:`/game-category/list`  權限:`view:game-category`
- 功能點:M09-F07 查詢列表、M09-F08 欄位排序、M09-F09 分頁、M09-F10 啟用/停用切換、M09-F11 拖曳調整顯示順序
- 表格欄位:Category Name、Sequence No.、Game Type、Created At、Updated At、Status、Actions
- 篩選條件:Game Type、Status、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「Game category status changed successfully」、「Game Category sequence updated successfully」、「Drag disabled while searching. Clear filters to reorder」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/provider/game_category、/provider/game_types)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 啟用/停用切換(PUT /provider/game_category/status/:id)
5. 拖曳調整顯示順序(POST /provider/game_category/sequence/update)

### M09-P04 game-category(編輯)

- 路由:`/game-category/update/:id`  權限:`edit:game-category`
- 功能點:M09-F12 編輯
- 表單欄位:Category Name、Game Type、Status、Category Image(欄位規則見 03 開發欄位控制)
- 系統提示:「Game category not found」、「Category updated successfully」、「Error updating category: {error}」、「File size must be less than 5MB」、「Invalid file type. Supported formats: JPEG, PNG, JPG, GIF, SVG」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟編輯頁,系統載入下拉選項(/provider/game_category/:id、/provider/game_types)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Update」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /provider/game_category/:id
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟編輯頁"] --> B["載入選項 /provider/game_category/:id /provider/game_types"]
  B --> C["填寫 4 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /provider/game_category/:id"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P05 game-category(詳情)

- 路由:`/game-category/view/:id`  權限:`view:game-category`
- 功能點:M09-F13 檢視詳情
- 系統提示:「Game category not found」
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/provider/game_category/:id)
2. 按「Edit」進入編輯頁

### M09-P06 game-offering(新增)

- 路由:`/game-offering/add`  權限:`create:game-offering`
- 功能點:M09-F14 新增
- 表單欄位:Game Offering Name、Status(欄位規則見 03 開發欄位控制)
- 系統提示:「Game Offering created successfully」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟新增頁,系統載入下拉選項
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Save」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /game_offerings
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟新增頁"] --> B["載入選項 無"]
  B --> C["填寫 2 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /game_offerings"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P07 Game Offerings(列表)

- 路由:`/game-offering/list`  權限:`view:game-offering`
- 功能點:M09-F15 查詢列表、M09-F16 欄位排序、M09-F17 分頁、M09-F18 啟用/停用切換、M09-F19 拖曳調整顯示順序
- 表格欄位:Game Offering Name、Sequence Number、Created At、Updated At、Status、Actions
- 篩選條件:Status、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「Game Offering status changed successfully」、「Sequence updated successfully」、「Drag and drop is disabled while searching」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/game_offerings)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 啟用/停用切換(PUT /game_offerings/status/:id)
5. 拖曳調整顯示順序(POST /game_offerings/sequence/update)

### M09-P08 game-offering(編輯)

- 路由:`/game-offering/update/:id`  權限:`edit:game-offering`
- 功能點:M09-F20 編輯
- 表單欄位:Game Offering Name、Status(欄位規則見 03 開發欄位控制)
- 系統提示:「Game Offering details not found」、「Game Offering updated successfully」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟編輯頁,系統載入下拉選項(/game_offerings/:id)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Update」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /game_offerings/:id
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟編輯頁"] --> B["載入選項 /game_offerings/:id"]
  B --> C["填寫 2 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /game_offerings/:id"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P09 game-offering(詳情)

- 路由:`/game-offering/view/:id`  權限:`view:game-offering`
- 功能點:M09-F21 檢視詳情
- 系統提示:「Game Offering details not found」
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/game_offerings/:id)
2. 按「Edit」進入編輯頁

### M09-P10 Game Providers(列表)

- 路由:`/game-provider/list`  權限:`view:game-provider`
- 功能點:M09-F22 查詢列表、M09-F23 欄位排序、M09-F24 分頁、M09-F25 啟用/停用切換、M09-F26 拖曳調整顯示順序
- 表格欄位:Provider Name、Sequence Number、Display Name、Status、Actions
- 篩選條件:Provider Name、Status、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「Game Provider status changed successfully」、「Game Provider sequence updated successfully」、「Drag disabled while searching. Clear filters to reorder」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/game_provider)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 啟用/停用切換(PUT /game_provider/status/:id)
5. 拖曳調整顯示順序(POST /game_provider/sequence/update)

### M09-P11 game-provider(詳情)

- 路由:`/game-provider/view/:id`  權限:`view:game-provider`
- 功能點:M09-F27 檢視詳情
- 系統提示:「Game Provider not found」
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/game_provider/:id)

### M09-P12 Game Type(列表)

- 路由:`/game-type/list`  權限:`view:game-type`
- 功能點:M09-F28 查詢列表、M09-F29 分頁、M09-F30 啟用/停用切換、M09-F31 拖曳調整顯示順序
- 表格欄位:Game Type Name、Sequence No.、Created At、Updated At、Status、Actions
- 篩選條件:Game Type Name、Status、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「Game type status changed successfully」、「Game type sequence updated successfully」、「Drag disabled while searching. Clear filters to reorder」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/game_type)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 啟用/停用切換(PUT /game_type/status/:id)
4. 拖曳調整顯示順序(POST /game_type/sequence/update)

### M09-P13 game-type(編輯)

- 路由:`/game-type/update/:id`  權限:`edit:game-type`
- 功能點:M09-F32 編輯
- 表單欄位:Game Type Code、Status、Game Type Image(欄位規則見 03 開發欄位控制)
- 系統提示:「Game type not found」、「Game type updated successfully」、「Error updating game type」、「File size must be less than 5MB」、「Invalid file type. Supported formats: JPEG, PNG, JPG, GIF, WEBP, SVG」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟編輯頁,系統載入下拉選項(/game_type/:id)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Update」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /game_type/:id
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟編輯頁"] --> B["載入選項 /game_type/:id"]
  B --> C["填寫 3 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /game_type/:id"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P14 game-type(詳情)

- 路由:`/game-type/view/:id`  權限:`view:game-type`
- 功能點:M09-F33 檢視詳情
- 系統提示:「Game type not found」
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/game_type/:id)
2. 按「Edit」進入編輯頁

### M09-P15 games(新增)

- 路由:`/games/add`  權限:`create:games`
- 功能點:M09-F34 新增
- 表單欄位:Game Name、Game Code、Game Offering、Game Provider、Rating ID、Game Type、Game Category、Seq No.、RTP、Game Description、Status、Featured、Hot、New、Demo、Recommended (250x250)(欄位規則見 03 開發欄位控制)
- 系統提示:「Game created successfully」、「Error creating game」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟新增頁,系統載入下拉選項(/game_offerings_dropdown、/game_providers、/game_types、/games_category_dropdown)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Save」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /games
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟新增頁"] --> B["載入選項 /game_offerings_dropdown /game_providers /game_types /games_category_dropdown"]
  B --> C["填寫 16 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /games"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P16 Games(列表)

- 路由:`/games/list`  權限:`view:games`
- 功能點:M09-F35 查詢列表、M09-F36 欄位排序、M09-F37 分頁、M09-F38 同步供應商遊戲圖片(islot)、M09-F39 同步供應商遊戲圖片(rps)、M09-F40 啟用/停用切換
- 表格欄位:ID、Game Image、Game Name、Provider、Game Type、Game Category、Status、Featured、Demo、Hot、New、Seq No.、Rating ID、Updated At、Actions
- 篩選條件:Search Game Name、Search Provider、Search Game Type、Search Game Category、Search Status、Search Featured、Search Hot、Search New、Search Demo、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「Game status changed successfully」、「iSlot and RPS machine icons resynced successfully」、「Icons resynced for {succeeded}; failed for {failed}」、「Failed to resync {failed} icons」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/game_providers、/game_types、/games_category_dropdown、/games)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 同步供應商遊戲圖片(islot)(POST /games/sync-islot-image)
5. 同步供應商遊戲圖片(rps)(POST /games/sync-rps-image)
6. 啟用/停用切換(PUT /games/status/:id)

### M09-P17 games(編輯)

- 路由:`/games/update/:id`  權限:`edit:games`
- 功能點:M09-F41 編輯
- 表單欄位:ID、Game Name、Game Code、Game Offering、Game Provider、Game Type、Rating ID、Game Category、Seq No.、RTP、Game Description、Status、Featured、Hot、New、Demo、Recommended (250x250)(欄位規則見 03 開發欄位控制)
- 系統提示:「Game updated successfully」、「Error updating game: {error}」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟編輯頁,系統載入下拉選項(/game_offerings_dropdown、/game_providers、/game_types、/games_category_dropdown、/games/:id)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Update」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /games/:id
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟編輯頁"] --> B["載入選項 /game_offerings_dropdown /game_providers /game_types /games_category_dropdown /games/:id"]
  B --> C["填寫 17 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /games/:id"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P18 games(詳情)

- 路由:`/games/view/:id`  權限:`view:games`
- 功能點:M09-F42 檢視詳情
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/games/:id)
2. 按「Edit」進入編輯頁

### M09-P19 quickAccess(新增)

- 路由:`/quickAccess/add`  權限:`create:quick-access`
- 功能點:M09-F43 新增
- 表單欄位:Name、Status、Icon、Games(欄位規則見 03 開發欄位控制)
- 系統提示:「Quick Access created successfully」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟新增頁,系統載入下拉選項(/quick_access/get_game_list)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Save」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /quick_access
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟新增頁"] --> B["載入選項 /quick_access/get_game_list"]
  B --> C["填寫 4 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /quick_access"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P20 Quick Access(列表)

- 路由:`/quickAccess/list`  權限:`view:quick-access`
- 功能點:M09-F44 查詢列表、M09-F45 欄位排序、M09-F46 分頁、M09-F47 拖曳調整顯示順序
- 表格欄位:Name、Status、Sequence Number、No. of Games、Created At、Actions
- 篩選條件:Name、Status、Items per page(欄位規則見 03 開發欄位控制)
- 系統提示:「Sequence updated successfully」、「Drag disabled while searching. Clear filters to reorder」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/quick_access)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 點欄位標題排序
4. 拖曳調整顯示順序(POST /quick_access/sequence/update)

### M09-P21 quickAccess(編輯)

- 路由:`/quickAccess/update/:id`  權限:`edit:quick-access`
- 功能點:M09-F48 編輯
- 表單欄位:Name、Status、Games、Icon(欄位規則見 03 開發欄位控制)
- 系統提示:「Quick Access not found」、「Quick Access updated successfully」
- 實機狀態:待實機查驗

**操作步驟**

1. 開啟編輯頁,系統載入下拉選項(/quick_access/get_game_list、/quick_access/:id、/quick_access_game/:id)
2. 依序填寫欄位(必填欄位標示 *)
3. 按「Save」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息
4. 驗證通過後送出 POST /quick_access/:id
5. 成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁
6. 按「Cancel」放棄並返回上一頁

```mermaid
flowchart TD
  A["開啟編輯頁"] --> B["載入選項 /quick_access/get_game_list /quick_access/:id /quick_access_game/:id"]
  B --> C["填寫 4 個欄位"]
  C --> D{"前端驗證"}
  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C
  D -->|通過| F["POST /quick_access/:id"]
  F --> G{"後端回應"}
  G -->|成功| H["成功提示 → 返回列表"]
  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C
```

### M09-P22 Quick Access Management(詳情)

- 路由:`/quickAccess/view/:id`  權限:`view:quick-access`
- 功能點:M09-F49 檢視詳情
- 系統提示:「Failed to fetch data」、「Failed to fetch games data」、「Quick Access not found」
- 實機狀態:待實機查驗

**操作步驟**

1. 由列表按「View」進入,系統載入單筆資料(/quick_access/:id、/quick_access_game/:id)
2. 按「Edit」進入編輯頁

### M09-P23 Game Report(列表)

- 路由:`/reports/game-report/list`  權限:`view:games-report`
- 功能點:M09-F50 查詢列表、M09-F51 分頁、M09-F52 匯出
- 篩選條件:Provider、Game、Game Offering、Player ID、Options、Date Filter Type、Transaction Start Date & Time ~ Transaction End Date & Time、Settlement Start Date & Time ~ Settlement End Date & Time、Settlement End Date & Time(欄位規則見 03 開發欄位控制)
- 系統提示:「fetching providers」、「fetching games」、「fetching game reports」、「Filters cleared successfully」、「No data available to download」、「Your export is processing — track it in Download Center」、「CSV downloaded successfully」、「downloading game report CSV」
- 實機狀態:待實機查驗

**操作步驟**

1. 從側欄選單進入本頁,系統載入第一頁資料(/report/game_records/:id、/get_e_provider_list、/game_offerings_dropdown、/get_game_list)
2. 輸入篩選條件後按「Search」查詢;按「Clear」清除條件
3. 按「Download CSV / Download」匯出目前查詢結果

