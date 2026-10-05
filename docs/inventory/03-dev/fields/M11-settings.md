# M11 系統設定 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,並於 2026-10-05 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M11-P01 roles(新增)`/roles/add`

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

> 頁面說明:權限勾選區上方有搜尋框可篩選選單

**表格欄位(實機畫面)**:Module、View、Edit、Create、Approve、Select All

**API**:`GET /menus`、`GET /menu_permissions`、`POST /roles`、`POST /roles/:id/permissions`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/menus` | promotions、bonus-omniplay-freespin、cashless-liability-report、bonus-omniplay、psp、player-management、players、games、referral-setting、notifications、dashboard、promotions-settings、promotions-opt-in、promotions-payout、featured-games、bonus-pragmatic-freespin、bonus-pragmatic、bonus-playtech、playtech-freespin、banners、users、credit-adjustment、maintenance-listing、wallets-refund、audits、quick-access、player-profile-update-requests、wallets、wallet-adjustment、notifications-listing、deposit-report、referral-report、announcements、pragmatic-freespin-reports、bonus-omniplay-freespin-reports、roles、fund-transaction-report、playtech-freespin-reports、game-category、contents-hub …共 60 項 |
| `/menu_permissions` |  |

## M11-P02 Role Management(列表)`/roles/list`

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

## M11-P03 roles(編輯)`/roles/update/:id`

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

**表格欄位(實機畫面)**:Module、View、Edit、Create、Approve、Select All

**API**:`GET /roles/:id`、`GET /menus`、`GET /roles/:id/permissions`、`PUT /roles/:id`、`PUT /roles/:id/permissions`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/menus` | promotions、bonus-omniplay-freespin、cashless-liability-report、bonus-omniplay、psp、player-management、players、games、referral-setting、notifications、dashboard、promotions-settings、promotions-opt-in、promotions-payout、featured-games、bonus-pragmatic-freespin、bonus-pragmatic、bonus-playtech、playtech-freespin、banners、users、credit-adjustment、maintenance-listing、wallets-refund、audits、quick-access、player-profile-update-requests、wallets、wallet-adjustment、notifications-listing、deposit-report、referral-report、announcements、pragmatic-freespin-reports、bonus-omniplay-freespin-reports、roles、fund-transaction-report、playtech-freespin-reports、game-category、contents-hub …共 60 項 |

## M11-P04 roles(詳情)`/roles/view/:id`

**表格欄位(實機畫面)**:Module、View、Edit、Create、Approve

**唯讀顯示欄位(實機畫面)**:Name、Code、Description、Status、Created By、Updated By、Created At、Updated At

**API**:`GET /roles/:id`、`GET /menus`、`GET /roles/:id/permissions`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/menus` | promotions、bonus-omniplay-freespin、cashless-liability-report、bonus-omniplay、psp、player-management、players、games、referral-setting、notifications、dashboard、promotions-settings、promotions-opt-in、promotions-payout、featured-games、bonus-pragmatic-freespin、bonus-pragmatic、bonus-playtech、playtech-freespin、banners、users、credit-adjustment、maintenance-listing、wallets-refund、audits、quick-access、player-profile-update-requests、wallets、wallet-adjustment、notifications-listing、deposit-report、referral-report、announcements、pragmatic-freespin-reports、bonus-omniplay-freespin-reports、roles、fund-transaction-report、playtech-freespin-reports、game-category、contents-hub …共 60 項 |

## M11-P05 users(新增)`/users/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 2 | Email | AppTextField | `email` | 是 | 必填;Email 格式 |  |  | 頁面 |
| 3 | Password | AppTextField | `password` | 是 | 必填 |  | type=e(U) | 頁面 |
| 4 | Confirm Password | AppTextField | `confirm_password` | 是 | 必填 |  | type=e($) | 頁面 |
| 5 | Role | VAutocomplete | `role_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="id" | 頁面 |
| 6 | Active Statusⁱ | VSwitch | `is_active` | 否 |  |  |  | 頁面 |

**API**:`GET /roles-look-up`、`POST /users`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/roles-look-up` | Administrator、Okada Play、py-test、qa test role、test game role、Test OkadaPlay Module、yc-test |

## M11-P06 User Management(列表)`/users/list`

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

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/roles-look-up` | Administrator、Okada Play、py-test、qa test role、test game role、Test OkadaPlay Module、yc-test |

## M11-P07 users(編輯)`/users/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 是 | 必填 |  |  | 頁面 |
| 2 | Email | AppTextField | `email` | 是 | 必填;Email 格式 |  |  | 頁面 |
| 3 | Role | VAutocomplete | `role_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="id" | 頁面 |

**API**:`GET /roles-look-up`、`GET /users/:id`、`PUT /users/:id`

**實機下拉選項**(2026-10-05 查驗時 API 回傳)

| API | 選項 |
|---|---|
| `/roles-look-up` | Administrator、Okada Play、py-test、qa test role、test game role、Test OkadaPlay Module、yc-test |

## M11-P08 users(詳情)`/users/view/:id`

**唯讀顯示欄位(實機畫面)**:Name、Email、Role、Status、Created By、Created At、Updated By、Updated At

**API**:`GET /users/:id`

