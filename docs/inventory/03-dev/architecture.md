# 系統層面交互架構(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 實機只讀查驗(登入流程、選單來源、API 呼叫已對照)。後端內部架構看不到,圖中標「外部 / 推定」的部分只根據前端呼叫的端點推斷,需後端確認。

## 1. 系統全景

```mermaid
flowchart LR
  U["後台管理員<br>瀏覽器"] --> FE["OKADA 後台前端<br>Nuxt 3 + Vuetify SPA<br>okada-dev-bo-2.scms2u.lol"]
  FE -->|"REST / JSON、FormData<br>Authorization: Bearer"| API["Backoffice API<br>okada-dev-api-2.scms2u.lol/backoffice"]
  FE -->|iframe| OP["OkadaPlay 管理後台<br>dev-admin.playcard.zone"]
  API --> DB[("後端資料庫<br>外部 / 推定")]
  API --> GP["遊戲供應商<br>Playtech、Pragmatic Play、Omniplay<br>iSlot、RPS(圖片同步)<br>外部 / 推定"]
  API --> PSP["支付服務商 PSP<br>外部 / 推定"]
  API --> JOB["報表匯出工作<br>下載中心非同步產生<br>外部 / 推定"]
  API --> FRONT["前台網站內容<br>Banner、公告、通知、條款<br>外部 / 推定"]
```

| 元件 | 說明 |
|---|---|
| 前端 | Nuxt 3(SPA 模式,`/_nuxt/` 打包)+ Vuetify 3 + vue-i18n + CASL 權限;版本 `appVersion: 2.8.2`,環境 `environment: dev` |
| API | 單一 base URL `https://okada-dev-api-2.scms2u.lol/backoffice`,前端共呼叫約 200 個端點(見 [api.md](api.md)) |
| OkadaPlay | `/okadaplay` 頁以 iframe 開啟 `okadaPlayIframeUrl`,資料不經過本後台 API |
| 多語系 | 內建 en(2,097 個字串)、zh(465)、ph(454);未翻譯的字串回退英文,預設語言 en |

## 2. 登入與權限

```mermaid
sequenceDiagram
  autonumber
  actor A as 管理員
  participant FE as 後台前端
  participant API as Backoffice API
  A->>FE: 輸入 Email/Username + Password
  FE->>API: POST /login {email, password}
  API-->>FE: {access_token, user, menu}
  FE->>FE: menu 轉成 CASL 權限規則
  FE->>FE: Cookie dev_accessToken、dev_userData、userData_role<br>localStorage dev_userAbilityRules
  FE->>API: GET /get_role_menu(依角色組側欄選單)
  API-->>FE: 選單
  A->>FE: 進入任一頁面
  FE->>FE: 路由守衛比對 meta {action, subject}
  alt 沒有權限
    FE-->>A: 導向 /not-authorized
  else 有權限
    FE->>API: 頁面 API(帶 Bearer token)
    alt 回應 403 / AUTH-403
      FE->>FE: 清除 token 與權限
      FE-->>A: 導回 /login
    end
  end
```

- 登入錯誤碼 `AUT-5001` 顯示「Invalid credentials」。
- 另有 `/login-pagcor` 登入頁(PAGCOR 監管單位入口,推定)。
- 權限主體(subject)共 43 個,每個頁面一個 `action:subject`,例如 `create:promotions-settings`;完整對照見 [../01-pm-modules.md](../01-pm-modules.md)。
- 角色權限由「系統設定 → 角色」勾選:`GET /menus`、`GET /menu_permissions` 取得可勾選項目,`PUT /roles/:id/permissions` 儲存。

## 3. 請求管線

```mermaid
flowchart TD
  P["頁面元件"] --> M["API 模組函式<br>例:getPromotionSettings()"]
  M --> W["共用 $fetch 包裝<br>baseURL = apiBaseUrl<br>加上 Authorization: Bearer"]
  W --> API["Backoffice API"]
  P --> DL["下載 CSV<br>直接 fetch,回傳 blob"]
  DL --> API
  P --> UP["含檔案的表單<br>FormData"]
  UP -->|"編輯:POST + _method=PUT"| API
  P --> RT["富文本 Tiptap 內容<br>送出前 Base64 編碼"]
  RT --> API
```

| 機制 | 做法 | 例子 |
|---|---|---|
| 列表查詢 | GET + query:`page`、`per_page`、`sort_by`、`order_by` + 篩選欄位 | `GET /promotion_setting?name=&payout_frequency=&start_date=` |
| 新增 | POST;有檔案時用 FormData,否則 JSON | `POST /promotion_setting`、`POST /games` |
| 編輯 | PUT;有檔案時改用 POST + `_method=PUT` | `PUT /psp/:id` |
| 狀態切換 | PUT `.../status/:id` | `PUT /players/status/:id`、`PUT /games/status/:id` |
| 拖曳排序 | PUT `.../sequence/update` | Banner、公告、遊戲分類、精選遊戲、快捷入口 |
| 富文本 | Tiptap 編輯器,HTML 以 Base64 送出 | 公告、通知內容 |
| 匯出 | 直接 `fetch` 下載 blob;部分報表走 `POST /report/export_report` 建立非同步工作,到下載中心取檔 | `GET /{vendor}/freespin/list/download`、`/report/downloads` |
| 錯誤處理 | 顯示後端 `response._data.message`,沒有時顯示預設訊息;失敗不離開頁面 | 各新增/編輯頁 |
| 成功處理 | Snackbar 提示,約 1.5 秒後返回列表 | 各新增/編輯頁 |

## 4. 前端程式結構

```mermaid
flowchart LR
  subgraph Pages["頁面 112 個"]
    L["列表 list"] --- V["詳情 view/:id"] --- A["新增 add/create"] --- E["編輯 update/:id"] --- R["報表 reports"]
  end
  subgraph Shared["共用"]
    TH["tableHeaders 定義<br>46 個"]
    APIM["API 模組"]
    C["表單元件<br>AppTextField、AppSelect、VAutocomplete<br>DateRangePicker、AppDateTimePicker<br>VFileInput、TiptapEditor、VSwitch"]
    VAL["驗證器<br>必填、Email、密碼強度、URL、圖片"]
    I18N["i18n en / zh / ph"]
  end
  Pages --> TH & APIM & C & VAL & I18N
```

驗證器(前端共用):

| 驗證 | 規則 |
|---|---|
| 必填 | 空值、空陣列、false、只有空白 → 錯誤 |
| Email | 標準 Email 格式 |
| 密碼強度 | 至少 8 碼,含大寫、小寫、數字、特殊字元 `!@#$%&*()` |
| 確認密碼 | 必須與密碼相同 |
| URL | `http://` 或 `https://` 開頭 |
| 圖片 | 必填;jpeg / png / webp;≤ 5MB |

## 5. 模塊與 API 網域對應

```mermaid
flowchart LR
  M02["M02 玩家管理"] --> A2["/players、/player/profile-update-request"]
  M03["M03 通知"] --> A7["/notification"]
  M04["M04 促銷活動"] --> A3["/promotion_setting、/promotion_opt_in、/promotion_payout"]
  M05["M05 錢包管理"] --> A1["/wallet_adjustment、/wallets/refund<br>/report/deposit、/report/withdraw"]
  M06["M06 內容中心"] --> A6["/advertisement、/announcement<br>/term_and_condition、/responsible_gaming"]
  M07["M07 遊戲中心"] --> A8["/games、/game_type、/provider/game_category<br>/game_provider、/game_offerings、/featured_games<br>/quick_access"]
  M08["M08 支付通道"] --> A9["/psp"]
  M09["M09 維護"] --> A10["/maintenance_record"]
  M10["M10 合規"] --> A11["/audits"]
  M11["M11 系統設定"] --> A13["/users、/roles、/menus、/menu_permissions"]
  M12["M12 報表"] --> A12["/report/cashless、/report/fund_transaction、/report/game_records<br>/report/player-account-transaction、/report/downloads"]
  M13["M13 推薦獎勵"] --> A5["/referral_setting、/referral_report"]
  M15["M15 免費旋轉"] --> A4["Playtech /freespin<br>Pragmatic Play /pragmatic-play/freespin<br>Omniplay /jumbo-v2/freespin"]
  M16["M16 責任博彩報表"] --> A14["/report/betting_limit、/report/self_exclusion"]
```

- Omniplay 的 `{vendor}` 實機為 `jumbo-v2`(`GET /jumbo-v2/freespin/list`)。
- M14 OkadaPlay 是 iframe,不呼叫本後台 API。

## 6. 選單來源(已實機確認)

側欄選單由 `GET /get_role_menu` 回傳 `{menu: [...]}`,每個項目包含 `title`(i18n 鍵)、`icon`、`action`、`subject`、`sequence`、`to`(前端路由名稱)、`children`。前端依此畫出選單;登入帳號的角色決定回傳哪些項目。實機選單結構見 [../01-pm-modules.md](../01-pm-modules.md)。

## 7. 待確認(需後端)

- 後端內部服務、資料庫、與供應商、PSP 的串接方式
- 下載中心的非同步工作流程(排隊、產出、失效時間)
