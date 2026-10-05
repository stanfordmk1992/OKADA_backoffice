# 01 功能模塊與功能點清單(項管)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

## 總覽

| 模塊 | 名稱 | 前端選單(英文) | 頁面數 | 功能點數 |
|---|---|---|---|---|
| M01 | 首頁與帳號 | Home | 3 | 3 |
| M02 | 錢包管理 | Wallets Management | 8 | 19 |
| M03 | 玩家管理 | Player Management | 4 | 15 |
| M04 | 促銷活動 | Promotions | 5 | 14 |
| M05 | 獎金(免費旋轉) | Bonus | 11 | 31 |
| M06 | 推薦獎勵 | Referral | 6 | 11 |
| M07 | 內容中心 | Contents Hub | 14 | 21 |
| M08 | 通知 | Notifications | 4 | 8 |
| M09 | 遊戲中心 | Games Hub | 23 | 52 |
| M10 | 支付通道 | PSP Hub | 4 | 6 |
| M11 | 維護排程 | Maintenance Listing | 4 | 6 |
| M12 | 合規與責任博彩 | Compliance | 5 | 19 |
| M13 | 報表 | Reports | 10 | 29 |
| M14 | 系統設定 | Settings | 8 | 16 |
| M15 | OkadaPlay | OkadaPlay | 1 | 1 |
| M00 | 登入與錯誤頁 | — | 2 | 2 |
| **合計** | | | **112** | **253** |

- 分類依據:路由前綴 + 前端選單定義(`navigation.*`)。**實際側欄選單由後端 `/get_role_menu` 依角色回傳**,登入後需比對(見 04 測試報告)。
- 權限欄為前端路由守衛的 CASL 規則 `action:subject`,沒有權限的使用者會被導向 `/not-authorized`。

## M01 首頁與帳號(Home / Account)

後台登入後的首頁,以及管理員修改自己的密碼。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M01-P01 | Home | 頁面 | `/` | `登入即可` | M01-F01 頁面 |
| M01-P02 | My Profile | 頁面 | `/profile` | `登入即可` | M01-F02 頁面 |
| M01-P03 | second-page | 頁面 | `/second-page` | `view:users` | M01-F03 頁面 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M01-F01 | M01-P01 | 頁面 | 靜態頁或內嵌頁 |
| M01-F02 | M01-P02 | 頁面 | 靜態頁或內嵌頁 |
| M01-F03 | M01-P03 | 頁面 | 靜態頁或內嵌頁 |

</details>

## M02 錢包管理(Wallets Management)

處理玩家錢包的人工調帳與沖正(Credit Reversal),以及查詢存款、提款交易紀錄。屬於資金異動模塊,操作會直接影響玩家餘額。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M02-P01 | Deposit Report | 列表 | `/reports/deposit/list` | `view:deposit-report` | M02-F01 查詢列表<br>M02-F02 欄位排序<br>M02-F03 分頁<br>M02-F04 匯出 |
| M02-P02 | Deposit Log | 詳情 | `/reports/deposit/view/:id` | `view:deposit-report` | M02-F05 檢視詳情 |
| M02-P03 | Withdrawal Report | 列表 | `/reports/withdrawal/list` | `view:withdrawal-report` | M02-F06 查詢列表<br>M02-F07 欄位排序<br>M02-F08 分頁<br>M02-F09 匯出 |
| M02-P04 | Withdrawal Log | 詳情 | `/reports/withdrawal/view/:id` | `view:withdrawal-report` | M02-F10 檢視詳情 |
| M02-P05 | wallets / adjustment | 新增 | `/wallets/adjustment/add` | `create:wallet-adjustment` | M02-F11 新增 |
| M02-P06 | Wallet Adjustment | 列表 | `/wallets/adjustment/list` | `view:wallet-adjustment` | M02-F12 查詢列表<br>M02-F13 欄位排序<br>M02-F14 分頁 |
| M02-P07 | wallets / adjustment | 詳情 | `/wallets/adjustment/view/:id` | `view:wallet-adjustment` | M02-F15 檢視詳情 |
| M02-P08 | Credit Reversal | 列表 | `/wallets/refund/list` | `view:wallets-refund` | M02-F16 查詢列表<br>M02-F17 欄位排序<br>M02-F18 分頁<br>M02-F19 執行沖正(Credit Reversal) |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M02-F01 | M02-P01 | 查詢列表 | 篩選條件:Deposit Report、Player ID、Transaction ID、Reference ID、Bank Name、Status、Request UUID;表格 10 欄 |
| M02-F02 | M02-P01 | 欄位排序 | 可排序欄位:Player ID、Bank Name、Request UUID、Transaction ID、Reference ID、Amount、Status、Remarks、Created At |
| M02-F03 | M02-P01 | 分頁 | 可切換每頁筆數 |
| M02-F04 | M02-P01 | 匯出 | 依目前篩選條件下載 Download CSV |
| M02-F05 | M02-P02 | 檢視詳情 | 顯示單筆資料內容 |
| M02-F06 | M02-P03 | 查詢列表 | 篩選條件:Withdrawal Report、Player ID、Transaction ID、Reference ID、Bank Name、Status、Request UUID;表格 10 欄 |
| M02-F07 | M02-P03 | 欄位排序 | 可排序欄位:Player ID、Bank Name、Request UUID、Transaction ID、Reference ID、Amount、Status、Remarks、Created At |
| M02-F08 | M02-P03 | 分頁 | 可切換每頁筆數 |
| M02-F09 | M02-P03 | 匯出 | 依目前篩選條件下載 Download CSV |
| M02-F10 | M02-P04 | 檢視詳情 | 顯示單筆資料內容 |
| M02-F11 | M02-P05 | 新增 | 表單 7 個欄位 |
| M02-F12 | M02-P06 | 查詢列表 | 篩選條件:Player ID、Wallet Type、Wallet Type;表格 10 欄 |
| M02-F13 | M02-P06 | 欄位排序 | 可排序欄位:ID、Player ID、Wallet、Balance Before、Balance After、Amount Debit (+)、Amount Credit (-)、Adjusted By、Created At |
| M02-F14 | M02-P06 | 分頁 | 可切換每頁筆數 |
| M02-F15 | M02-P07 | 檢視詳情 | 顯示單筆資料內容 |
| M02-F16 | M02-P08 | 查詢列表 | 篩選條件:Credit Reversal、Credit Reversal、Credit Reversal;表格 7 欄 |
| M02-F17 | M02-P08 | 欄位排序 | 可排序欄位:ID、Player ID、Amount、Created At |
| M02-F18 | M02-P08 | 分頁 | 可切換每頁筆數 |
| M02-F19 | M02-P08 | 執行沖正(Credit Reversal) | PUT /wallets/refund/:id |

</details>

## M03 玩家管理(Player Management)

查詢玩家清單與詳情(含各錢包餘額、轉回主錢包),停用/啟用玩家,審核玩家提出的個人資料修改申請。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M03-P01 | Player Profile Update Requests | 列表 | `/player-profile-update-requests/list` | `view:player-profile-update-requests` | M03-F01 查詢列表<br>M03-F02 欄位排序<br>M03-F03 分頁<br>M03-F04 核准申請<br>M03-F05 駁回申請 |
| M03-P02 | Player Profile Update Requests | 詳情 | `/player-profile-update-requests/view/:id` | `view:player-profile-update-requests` | M03-F06 檢視詳情<br>M03-F07 核准申請<br>M03-F08 駁回申請 |
| M03-P03 | Player List | 列表 | `/players/list` | `view:players` | M03-F09 查詢列表<br>M03-F10 欄位排序<br>M03-F11 分頁<br>M03-F12 啟用/停用切換 |
| M03-P04 | players | 詳情 | `/players/view/:id` | `view:players` | M03-F13 檢視詳情<br>M03-F14 重新整理錢包餘額<br>M03-F15 將子錢包餘額轉回 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M03-F01 | M03-P01 | 查詢列表 | 篩選條件:Player ID、Request Type、Status、Start Date ~ End Date、Admin Password、Rejection Reason;表格 7 欄 |
| M03-F02 | M03-P01 | 欄位排序 | 可排序欄位:Request No.、Player ID、Request Type、Status、Submitted At |
| M03-F03 | M03-P01 | 分頁 | 可切換每頁筆數 |
| M03-F04 | M03-P01 | 核准申請 | POST /player/profile-update-request/:id/approve |
| M03-F05 | M03-P01 | 駁回申請 | POST /player/profile-update-request/:id/reject |
| M03-F06 | M03-P02 | 檢視詳情 | 顯示單筆資料內容 |
| M03-F07 | M03-P02 | 核准申請 | POST /player/profile-update-request/:id/approve |
| M03-F08 | M03-P02 | 駁回申請 | POST /player/profile-update-request/:id/reject |
| M03-F09 | M03-P03 | 查詢列表 | 篩選條件:Player ID、Email、Status;表格 7 欄 |
| M03-F10 | M03-P03 | 欄位排序 | 可排序欄位:ID、Player ID、Email、Status |
| M03-F11 | M03-P03 | 分頁 | 可切換每頁筆數 |
| M03-F12 | M03-P03 | 啟用/停用切換 | PUT /players/status/:id |
| M03-F13 | M03-P04 | 檢視詳情 | 顯示單筆資料內容,含明細表格 6 欄 |
| M03-F14 | M03-P04 | 重新整理錢包餘額 | POST /players/:id/wallets/refresh |
| M03-F15 | M03-P04 | 將子錢包餘額轉回 | GET /players/:id/wallets/transfer_back |

</details>

## M04 促銷活動(Promotions)

設定存款類促銷活動(期間、適用等級、存款條件、派彩方式與頻率、流水要求),查看玩家報名(Opt-In)名單與派彩紀錄。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M04-P01 | Promotion Opt-In List | 列表 | `/promotions/opt-in/list` | `view:promotions-opt-in` | M04-F01 查詢列表<br>M04-F02 欄位排序<br>M04-F03 分頁<br>M04-F04 匯出 |
| M04-P02 | Promotion Payout | 列表 | `/promotions/payout/list` | `view:promotions-payout` | M04-F05 查詢列表<br>M04-F06 欄位排序<br>M04-F07 分頁<br>M04-F08 匯出 |
| M04-P03 | promotions / settings | 新增 | `/promotions/settings/add` | `create:promotions-settings` | M04-F09 新增 |
| M04-P04 | Promotion Settings | 列表 | `/promotions/settings/list` | `view:promotions-settings` | M04-F10 查詢列表<br>M04-F11 欄位排序<br>M04-F12 分頁 |
| M04-P05 | promotions / settings | 詳情 | `/promotions/settings/view/:id` | `view:promotions-settings` | M04-F13 檢視詳情<br>M04-F14 啟用/停用切換 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M04-F01 | M04-P01 | 查詢列表 | 篩選條件:navigation.submenu.promotionOptInList、features.promotions.placeholders.searchPlayerId;表格 12 欄 |
| M04-F02 | M04-P01 | 欄位排序 | 可排序欄位:ID、Player ID、Promotion Name、Min/Max Deposit、Deposit Information、Turnover Information、Tier Points Information、Join Date、Payment Method、Created At、Updated At |
| M04-F03 | M04-P01 | 分頁 | 可切換每頁筆數 |
| M04-F04 | M04-P01 | 匯出 | 依目前篩選條件下載 Download CSV |
| M04-F05 | M04-P02 | 查詢列表 | 篩選條件:navigation.submenu.promotionPayout、features.promotions.placeholders.searchPlayerId;表格 7 欄 |
| M04-F06 | M04-P02 | 欄位排序 | 可排序欄位:ID、Player ID、Promotion Name、Payout Amount、Payout Method、Payout Date、Status |
| M04-F07 | M04-P02 | 分頁 | 可切換每頁筆數 |
| M04-F08 | M04-P02 | 匯出 | 依目前篩選條件下載 Download CSV |
| M04-F09 | M04-P03 | 新增 | 表單 15 個欄位 |
| M04-F10 | M04-P04 | 查詢列表 | 篩選條件:Search Promotion Name、Search Payout Frequency、Start Date (FROM) ~ Start Date (TO);表格 8 欄 |
| M04-F11 | M04-P04 | 欄位排序 | 可排序欄位:ID、Promotion Name、Start Date、End Date、Payout Frequency、Created At、Updated At |
| M04-F12 | M04-P04 | 分頁 | 可切換每頁筆數 |
| M04-F13 | M04-P05 | 檢視詳情 | 顯示單筆資料內容 |
| M04-F14 | M04-P05 | 啟用/停用切換 | POST /promotion_setting/status/:id |

</details>

## M05 獎金(免費旋轉)(Bonus / Free Spin)

向指定玩家或玩家等級發放遊戲供應商的免費旋轉(Playtech、Pragmatic Play、Omniplay),查詢發放紀錄、移除未使用的免費旋轉,以及查看使用報表。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M05-P01 | bonus / omniplay / freespin | 新增 | `/bonus/omniplay/freespin/create` | `create:bonus-omniplay-freespin` | M05-F01 新增<br>M05-F02 發放免費旋轉 |
| M05-P02 | bonus / omniplay / freespin | 列表 | `/bonus/omniplay/freespin/list` | `view:bonus-omniplay-freespin` | M05-F03 查詢列表<br>M05-F04 分頁<br>M05-F05 匯出<br>M05-F06 移除免費旋轉 |
| M05-P03 | bonus / omniplay / freespin | 報表 | `/bonus/omniplay/freespin/reports` | `view:bonus-omniplay-freespin-reports` | M05-F07 查詢列表<br>M05-F08 分頁<br>M05-F09 匯出 |
| M05-P04 | bonus / playtech / freespin | 新增 | `/bonus/playtech/freespin/create` | `create:playtech-freespin` | M05-F10 新增<br>M05-F11 發放免費旋轉 |
| M05-P05 | bonus / playtech / freespin | 列表 | `/bonus/playtech/freespin/list` | `view:playtech-freespin` | M05-F12 查詢列表<br>M05-F13 分頁<br>M05-F14 匯出 |
| M05-P06 | bonus / playtech / freespin | 報表 | `/bonus/playtech/freespin/reports` | `view:playtech-freespin` | M05-F15 查詢列表<br>M05-F16 分頁<br>M05-F17 匯出 |
| M05-P07 | bonus / playtech / freespin | 詳情 | `/bonus/playtech/freespin/view/:id` | `view:playtech-freespin` | M05-F18 檢視詳情<br>M05-F19 移除免費旋轉<br>M05-F20 移除玩家全部未使用免費旋轉 |
| M05-P08 | bonus / pragmatic-play / freespin | 新增 | `/bonus/pragmatic-play/freespin/create` | `create:bonus-pragmatic-freespin` | M05-F21 新增<br>M05-F22 發放免費旋轉 |
| M05-P09 | bonus / pragmatic-play / freespin | 列表 | `/bonus/pragmatic-play/freespin/list` | `view:bonus-pragmatic-freespin` | M05-F23 查詢列表<br>M05-F24 分頁<br>M05-F25 匯出 |
| M05-P10 | bonus / pragmatic-play / freespin | 報表 | `/bonus/pragmatic-play/freespin/reports` | `view:pragmatic-freespin-reports` | M05-F26 查詢列表<br>M05-F27 分頁<br>M05-F28 匯出 |
| M05-P11 | bonus / pragmatic-play / freespin | 詳情 | `/bonus/pragmatic-play/freespin/view/:id` | `view:bonus-pragmatic-freespin` | M05-F29 檢視詳情<br>M05-F30 移除免費旋轉<br>M05-F31 移除玩家全部未使用免費旋轉 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M05-F01 | M05-P01 | 新增 | 表單 7 個欄位 |
| M05-F02 | M05-P01 | 發放免費旋轉 | POST /{vendor}/freespin/give |
| M05-F03 | M05-P02 | 查詢列表 | 篩選條件:Member ID、Batch ID、Free Card ID、Status、Usage Status、Created Start Date ~ Created End Date;表格 15 欄 |
| M05-F04 | M05-P02 | 分頁 | 可切換每頁筆數 |
| M05-F05 | M05-P02 | 匯出 | 依目前篩選條件下載 Download CSV |
| M05-F06 | M05-P02 | 移除免費旋轉 | POST /{vendor}/freespin/remove |
| M05-F07 | M05-P03 | 查詢列表 | 篩選條件:Free Spin Report - Omniplay、Member ID |
| M05-F08 | M05-P03 | 分頁 | 可切換每頁筆數 |
| M05-F09 | M05-P03 | 匯出 | 依目前篩選條件下載 Download CSV |
| M05-F10 | M05-P04 | 新增 | 表單 5 個欄位 |
| M05-F11 | M05-P04 | 發放免費旋轉 | POST /freespin/massGive |
| M05-F12 | M05-P05 | 查詢列表 | 篩選條件:Member ID、Ref ID、Status、Created Start Date ~ Created End Date;表格 9 欄 |
| M05-F13 | M05-P05 | 分頁 | 可切換每頁筆數 |
| M05-F14 | M05-P05 | 匯出 | 依目前篩選條件下載 Download CSV |
| M05-F15 | M05-P06 | 查詢列表 | 篩選條件:Free Spin Report - Playtech、Member ID |
| M05-F16 | M05-P06 | 分頁 | 可切換每頁筆數 |
| M05-F17 | M05-P06 | 匯出 | 依目前篩選條件下載 Download CSV |
| M05-F18 | M05-P07 | 檢視詳情 | 顯示單筆資料內容 |
| M05-F19 | M05-P07 | 移除免費旋轉 | POST /freespin/remove |
| M05-F20 | M05-P07 | 移除玩家全部未使用免費旋轉 | POST /freespin/remove-all |
| M05-F21 | M05-P08 | 新增 | 表單 4 個欄位 |
| M05-F22 | M05-P08 | 發放免費旋轉 | POST /pragmatic-play/freespin/massGive |
| M05-F23 | M05-P09 | 查詢列表 | 篩選條件:Member ID、Ref ID、Status、Created Start Date ~ Created End Date;表格 9 欄 |
| M05-F24 | M05-P09 | 分頁 | 可切換每頁筆數 |
| M05-F25 | M05-P09 | 匯出 | 依目前篩選條件下載 Download CSV |
| M05-F26 | M05-P10 | 查詢列表 | 篩選條件:Free Spin Report - Pragmatic Play、Member ID |
| M05-F27 | M05-P10 | 分頁 | 可切換每頁筆數 |
| M05-F28 | M05-P10 | 匯出 | 依目前篩選條件下載 Download CSV |
| M05-F29 | M05-P11 | 檢視詳情 | 顯示單筆資料內容 |
| M05-F30 | M05-P11 | 移除免費旋轉 | POST /pragmatic-play/freespin/remove |
| M05-F31 | M05-P11 | 移除玩家全部未使用免費旋轉 | POST /pragmatic-play/freespin/remove-all |

</details>

## M06 推薦獎勵(Referral)

設定推薦活動規則(期間、派彩頻率與方式、獎金池與上限、流水門檻),並查詢推薦報表。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M06-P01 | referral-setting | 新增 | `/referral-setting/add` | `create:referral-setting` | M06-F01 新增 |
| M06-P02 | Referral Setting | 列表 | `/referral-setting/list` | `view:referral-setting` | M06-F02 查詢列表<br>M06-F03 欄位排序<br>M06-F04 分頁 |
| M06-P03 | Title | 編輯 | `/referral-setting/update/:id` | `edit:referral-setting` | M06-F05 編輯 |
| M06-P04 | Title | 詳情 | `/referral-setting/view/:id` | `view:referral-setting` | M06-F06 檢視詳情 |
| M06-P05 | Player Referral Batch Report | 列表 | `/reports/referral-report/list` | `view:referral-report` | M06-F07 查詢列表<br>M06-F08 欄位排序<br>M06-F09 分頁<br>M06-F10 匯出 |
| M06-P06 | referral-report | 詳情 | `/reports/referral-report/view/:id` | `view:referral-report` | M06-F11 檢視詳情 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M06-F01 | M06-P01 | 新增 | 表單 14 個欄位 |
| M06-F02 | M06-P02 | 查詢列表 | 篩選條件:Title、Status、Start Date (FROM) ~ Start Date (TO);表格 7 欄 |
| M06-F03 | M06-P02 | 欄位排序 | 可排序欄位:ID、Title、Frequency |
| M06-F04 | M06-P02 | 分頁 | 可切換每頁筆數 |
| M06-F05 | M06-P03 | 編輯 | 表單 14 個欄位 |
| M06-F06 | M06-P04 | 檢視詳情 | 顯示單筆資料內容 |
| M06-F07 | M06-P05 | 查詢列表 | 篩選條件:Title、Date From ~ Date To;表格 9 欄 |
| M06-F08 | M06-P05 | 欄位排序 | 可排序欄位:Option |
| M06-F09 | M06-P05 | 分頁 | 可切換每頁筆數 |
| M06-F10 | M06-P05 | 匯出 | 依目前篩選條件下載 Download |
| M06-F11 | M06-P06 | 檢視詳情 | 顯示單筆資料內容,含明細表格 7 欄 |

</details>

## M07 內容中心(Contents Hub)

管理前台顯示內容:Banner 廣告、公告、條款與細則、責任博彩說明、狀態聲明(多語系內容)。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M07-P01 | announcements | 新增 | `/announcements/add` | `create:announcements` | M07-F01 新增 |
| M07-P02 | Announcements | 列表 | `/announcements/list` | `view:announcements` | M07-F02 查詢列表<br>M07-F03 欄位排序<br>M07-F04 分頁<br>M07-F05 拖曳調整顯示順序 |
| M07-P03 | announcements | 編輯 | `/announcements/update/:id` | `edit:announcements` | M07-F06 編輯 |
| M07-P04 | Announcements | 詳情 | `/announcements/view/:id` | `view:announcements` | M07-F07 檢視詳情 |
| M07-P05 | banners | 新增 | `/banners/add` | `create:banners` | M07-F08 新增 |
| M07-P06 | Banners | 列表 | `/banners/list` | `view:banners` | M07-F09 查詢列表<br>M07-F10 欄位排序<br>M07-F11 分頁<br>M07-F12 啟用/停用切換<br>M07-F13 拖曳調整顯示順序 |
| M07-P07 | banners | 編輯 | `/banners/update/:id` | `edit:banners` | M07-F14 編輯 |
| M07-P08 | banners | 詳情 | `/banners/view/:id` | `view:banners` | M07-F15 檢視詳情 |
| M07-P09 | Responsible Gaming | 列表 | `/responsible-gaming/list` | `view:responsible-gaming` | M07-F16 查詢列表 |
| M07-P10 | Title | 編輯 | `/responsible-gaming/update/:id` | `edit:responsible-gaming` | M07-F17 編輯 |
| M07-P11 | Status Declaration | 列表 | `/status-declaration/list` | `view:status-declaration` | M07-F18 查詢列表 |
| M07-P12 | status-declaration | 編輯 | `/status-declaration/update/:id` | `edit:status-declaration` | M07-F19 編輯 |
| M07-P13 | Terms and Conditions | 列表 | `/terms-and-conditions/list` | `view:terms-and-conditions` | M07-F20 查詢列表 |
| M07-P14 | Title | 編輯 | `/terms-and-conditions/update/:id` | `edit:terms-and-conditions` | M07-F21 編輯 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M07-F01 | M07-P01 | 新增 | 表單 9 個欄位 |
| M07-F02 | M07-P02 | 查詢列表 | 篩選條件:Name、Category、Status、Popup、Start Date (FROM) ~ Start Date (TO);表格 9 欄 |
| M07-F03 | M07-P02 | 欄位排序 | 可排序欄位:Name、Enable Popup、Status、Sequence、Start Date、End Date、Created At |
| M07-F04 | M07-P02 | 分頁 | 可切換每頁筆數 |
| M07-F05 | M07-P02 | 拖曳調整顯示順序 | POST /announcement/sequence/update |
| M07-F06 | M07-P03 | 編輯 | 表單 9 個欄位 |
| M07-F07 | M07-P04 | 檢視詳情 | 顯示單筆資料內容 |
| M07-F08 | M07-P05 | 新增 | 表單 12 個欄位 |
| M07-F09 | M07-P06 | 查詢列表 | 篩選條件:Name、Page、Status、Start Date (FROM) ~ Start Date (TO);表格 10 欄 |
| M07-F10 | M07-P06 | 欄位排序 | 可排序欄位:Name、Position、Page、Sequence、Start Date、End Date、Status、Created At、Updated At |
| M07-F11 | M07-P06 | 分頁 | 可切換每頁筆數 |
| M07-F12 | M07-P06 | 啟用/停用切換 | PUT /advertisement/status/:id |
| M07-F13 | M07-P06 | 拖曳調整顯示順序 | POST /advertisement/sequence/update |
| M07-F14 | M07-P07 | 編輯 | 表單 12 個欄位 |
| M07-F15 | M07-P08 | 檢視詳情 | 顯示單筆資料內容 |
| M07-F16 | M07-P09 | 查詢列表 | 篩選條件:Language |
| M07-F17 | M07-P10 | 編輯 | 表單 2 個欄位 |
| M07-F18 | M07-P11 | 查詢列表 | 無篩選條件 |
| M07-F19 | M07-P12 | 編輯 | 表單 2 個欄位 |
| M07-F20 | M07-P13 | 查詢列表 | 篩選條件:Language |
| M07-F21 | M07-P14 | 編輯 | 表單 2 個欄位 |

</details>

## M08 通知(Notifications)

建立發送給全部或指定玩家的站內通知(可設定頻率、期間、是否彈窗),並查看通知對象名單。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M08-P01 | notifications | 新增 | `/notifications/add` | `create:notifications-listing` | M08-F01 新增 |
| M08-P02 | Notifications List | 列表 | `/notifications/list` | `view:notifications-listing` | M08-F02 查詢列表<br>M08-F03 欄位排序<br>M08-F04 分頁<br>M08-F05 啟用/停用切換 |
| M08-P03 | notifications | 編輯 | `/notifications/update/:id` | `edit:notifications-listing` | M08-F06 編輯 |
| M08-P04 | notifications | 詳情 | `/notifications/view/:id` | `view:notifications-listing` | M08-F07 檢視詳情<br>M08-F08 查看通知對象名單 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M08-F01 | M08-P01 | 新增 | 表單 8 個欄位 |
| M08-F02 | M08-P02 | 查詢列表 | 篩選條件:Notification Name、Start Date (FROM) ~ Start Date (TO)、Pop Up、Frequency、Status;表格 8 欄 |
| M08-F03 | M08-P02 | 欄位排序 | 可排序欄位:ID、Notification Name、Start Date、End Date、Pop Up、Frequency、Status |
| M08-F04 | M08-P02 | 分頁 | 可切換每頁筆數 |
| M08-F05 | M08-P02 | 啟用/停用切換 | PUT /notification/status/:id |
| M08-F06 | M08-P03 | 編輯 | 表單 8 個欄位 |
| M08-F07 | M08-P04 | 檢視詳情 | 顯示單筆資料內容,含明細表格 2 欄 |
| M08-F08 | M08-P04 | 查看通知對象名單 | GET /notification/:id/player_list |

</details>

## M09 遊戲中心(Games Hub)

管理遊戲大廳:遊戲、遊戲類型、遊戲分類、遊戲供應商、遊戲產品線(Game Offering)、精選遊戲、快捷入口,以及遊戲投注紀錄報表。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M09-P01 | Featured eGames | 列表 | `/featured-games/list` | `view:featured-games` | M09-F01 查詢列表<br>M09-F02 欄位排序<br>M09-F03 分頁<br>M09-F04 啟用/停用切換<br>M09-F05 拖曳調整顯示順序 |
| M09-P02 | game-category | 新增 | `/game-category/add` | `create:game-category` | M09-F06 新增 |
| M09-P03 | Game Category | 列表 | `/game-category/list` | `view:game-category` | M09-F07 查詢列表<br>M09-F08 欄位排序<br>M09-F09 分頁<br>M09-F10 啟用/停用切換<br>M09-F11 拖曳調整顯示順序 |
| M09-P04 | game-category | 編輯 | `/game-category/update/:id` | `edit:game-category` | M09-F12 編輯 |
| M09-P05 | game-category | 詳情 | `/game-category/view/:id` | `view:game-category` | M09-F13 檢視詳情 |
| M09-P06 | game-offering | 新增 | `/game-offering/add` | `create:game-offering` | M09-F14 新增 |
| M09-P07 | Game Offerings | 列表 | `/game-offering/list` | `view:game-offering` | M09-F15 查詢列表<br>M09-F16 欄位排序<br>M09-F17 分頁<br>M09-F18 啟用/停用切換<br>M09-F19 拖曳調整顯示順序 |
| M09-P08 | game-offering | 編輯 | `/game-offering/update/:id` | `edit:game-offering` | M09-F20 編輯 |
| M09-P09 | game-offering | 詳情 | `/game-offering/view/:id` | `view:game-offering` | M09-F21 檢視詳情 |
| M09-P10 | Game Providers | 列表 | `/game-provider/list` | `view:game-provider` | M09-F22 查詢列表<br>M09-F23 欄位排序<br>M09-F24 分頁<br>M09-F25 啟用/停用切換<br>M09-F26 拖曳調整顯示順序 |
| M09-P11 | game-provider | 詳情 | `/game-provider/view/:id` | `view:game-provider` | M09-F27 檢視詳情 |
| M09-P12 | Game Type | 列表 | `/game-type/list` | `view:game-type` | M09-F28 查詢列表<br>M09-F29 分頁<br>M09-F30 啟用/停用切換<br>M09-F31 拖曳調整顯示順序 |
| M09-P13 | game-type | 編輯 | `/game-type/update/:id` | `edit:game-type` | M09-F32 編輯 |
| M09-P14 | game-type | 詳情 | `/game-type/view/:id` | `view:game-type` | M09-F33 檢視詳情 |
| M09-P15 | games | 新增 | `/games/add` | `create:games` | M09-F34 新增 |
| M09-P16 | Games | 列表 | `/games/list` | `view:games` | M09-F35 查詢列表<br>M09-F36 欄位排序<br>M09-F37 分頁<br>M09-F38 同步供應商遊戲圖片(islot)<br>M09-F39 同步供應商遊戲圖片(rps)<br>M09-F40 啟用/停用切換 |
| M09-P17 | games | 編輯 | `/games/update/:id` | `edit:games` | M09-F41 編輯 |
| M09-P18 | games | 詳情 | `/games/view/:id` | `view:games` | M09-F42 檢視詳情 |
| M09-P19 | quickAccess | 新增 | `/quickAccess/add` | `create:quick-access` | M09-F43 新增 |
| M09-P20 | Quick Access | 列表 | `/quickAccess/list` | `view:quick-access` | M09-F44 查詢列表<br>M09-F45 欄位排序<br>M09-F46 分頁<br>M09-F47 拖曳調整顯示順序 |
| M09-P21 | quickAccess | 編輯 | `/quickAccess/update/:id` | `edit:quick-access` | M09-F48 編輯 |
| M09-P22 | Quick Access Management | 詳情 | `/quickAccess/view/:id` | `view:quick-access` | M09-F49 檢視詳情 |
| M09-P23 | Game Report | 列表 | `/reports/game-report/list` | `view:games-report` | M09-F50 查詢列表<br>M09-F51 分頁<br>M09-F52 匯出 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M09-F01 | M09-P01 | 查詢列表 | 篩選條件:Game Name、Status、Select Games;表格 5 欄 |
| M09-F02 | M09-P01 | 欄位排序 | 可排序欄位:Game Name、Status、Sequence Number、Created At |
| M09-F03 | M09-P01 | 分頁 | 可切換每頁筆數 |
| M09-F04 | M09-P01 | 啟用/停用切換 | POST /featured_games/status/:id |
| M09-F05 | M09-P01 | 拖曳調整顯示順序 | POST /featured_games/sequence/update |
| M09-F06 | M09-P02 | 新增 | 表單 4 個欄位 |
| M09-F07 | M09-P03 | 查詢列表 | 篩選條件:Game Type、Status;表格 7 欄 |
| M09-F08 | M09-P03 | 欄位排序 | 可排序欄位:Category Name、Sequence No.、Game Type、Created At、Updated At、Status |
| M09-F09 | M09-P03 | 分頁 | 可切換每頁筆數 |
| M09-F10 | M09-P03 | 啟用/停用切換 | PUT /provider/game_category/status/:id |
| M09-F11 | M09-P03 | 拖曳調整顯示順序 | POST /provider/game_category/sequence/update |
| M09-F12 | M09-P04 | 編輯 | 表單 4 個欄位 |
| M09-F13 | M09-P05 | 檢視詳情 | 顯示單筆資料內容 |
| M09-F14 | M09-P06 | 新增 | 表單 2 個欄位 |
| M09-F15 | M09-P07 | 查詢列表 | 篩選條件:Status;表格 6 欄 |
| M09-F16 | M09-P07 | 欄位排序 | 可排序欄位:Game Offering Name、Sequence Number、Status |
| M09-F17 | M09-P07 | 分頁 | 可切換每頁筆數 |
| M09-F18 | M09-P07 | 啟用/停用切換 | PUT /game_offerings/status/:id |
| M09-F19 | M09-P07 | 拖曳調整顯示順序 | POST /game_offerings/sequence/update |
| M09-F20 | M09-P08 | 編輯 | 表單 2 個欄位 |
| M09-F21 | M09-P09 | 檢視詳情 | 顯示單筆資料內容 |
| M09-F22 | M09-P10 | 查詢列表 | 篩選條件:Provider Name、Status;表格 5 欄 |
| M09-F23 | M09-P10 | 欄位排序 | 可排序欄位:Provider Name、Sequence Number、Display Name、Status |
| M09-F24 | M09-P10 | 分頁 | 可切換每頁筆數 |
| M09-F25 | M09-P10 | 啟用/停用切換 | PUT /game_provider/status/:id |
| M09-F26 | M09-P10 | 拖曳調整顯示順序 | POST /game_provider/sequence/update |
| M09-F27 | M09-P11 | 檢視詳情 | 顯示單筆資料內容 |
| M09-F28 | M09-P12 | 查詢列表 | 篩選條件:Game Type Name、Status;表格 6 欄 |
| M09-F29 | M09-P12 | 分頁 | 可切換每頁筆數 |
| M09-F30 | M09-P12 | 啟用/停用切換 | PUT /game_type/status/:id |
| M09-F31 | M09-P12 | 拖曳調整顯示順序 | POST /game_type/sequence/update |
| M09-F32 | M09-P13 | 編輯 | 表單 3 個欄位 |
| M09-F33 | M09-P14 | 檢視詳情 | 顯示單筆資料內容 |
| M09-F34 | M09-P15 | 新增 | 表單 16 個欄位 |
| M09-F35 | M09-P16 | 查詢列表 | 篩選條件:Search Game Name、Search Provider、Search Game Type、Search Game Category、Search Status、Search Featured、Search Hot、Search New、Search Demo;表格 15 欄 |
| M09-F36 | M09-P16 | 欄位排序 | 可排序欄位:ID、Game Name、Provider、Game Type、Game Category、Status、Featured、Demo、Hot、New、Seq No.、Updated At |
| M09-F37 | M09-P16 | 分頁 | 可切換每頁筆數 |
| M09-F38 | M09-P16 | 同步供應商遊戲圖片(islot) | POST /games/sync-islot-image |
| M09-F39 | M09-P16 | 同步供應商遊戲圖片(rps) | POST /games/sync-rps-image |
| M09-F40 | M09-P16 | 啟用/停用切換 | PUT /games/status/:id |
| M09-F41 | M09-P17 | 編輯 | 表單 17 個欄位 |
| M09-F42 | M09-P18 | 檢視詳情 | 顯示單筆資料內容 |
| M09-F43 | M09-P19 | 新增 | 表單 4 個欄位 |
| M09-F44 | M09-P20 | 查詢列表 | 篩選條件:Name、Status;表格 6 欄 |
| M09-F45 | M09-P20 | 欄位排序 | 可排序欄位:Name、Status、Sequence Number、No. of Games、Created At |
| M09-F46 | M09-P20 | 分頁 | 可切換每頁筆數 |
| M09-F47 | M09-P20 | 拖曳調整顯示順序 | POST /quick_access/sequence/update |
| M09-F48 | M09-P21 | 編輯 | 表單 4 個欄位 |
| M09-F49 | M09-P22 | 檢視詳情 | 顯示單筆資料內容 |
| M09-F50 | M09-P23 | 查詢列表 | 篩選條件:Provider、Game、Game Offering、Player ID、Options、Date Filter Type、Transaction Start Date & Time ~ Transaction End Date & Time、Settlement Start Date & Time ~ Settlement End Date & Time |
| M09-F51 | M09-P23 | 分頁 | 可切換每頁筆數 |
| M09-F52 | M09-P23 | 匯出 | 依目前篩選條件下載 Download CSV |

</details>

## M10 支付通道(PSP Hub)

管理支付服務商(PSP)通道:是否支援存款/提款、手續費、單筆上下限、圖示。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M10-P01 | psp | 新增 | `/psp/add` | `create:psp` | M10-F01 新增 |
| M10-P02 | PSP Listing | 列表 | `/psp/list` | `view:psp` | M10-F02 查詢列表<br>M10-F03 欄位排序<br>M10-F04 分頁 |
| M10-P03 | psp | 編輯 | `/psp/update/:id` | `edit:psp` | M10-F05 編輯 |
| M10-P04 | psp | 詳情 | `/psp/view/:id` | `view:psp` | M10-F06 檢視詳情 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M10-F01 | M10-P01 | 新增 | 表單 15 個欄位 |
| M10-F02 | M10-P02 | 查詢列表 | 篩選條件:Name、Code、External Code、Type、Category、Status、Deposit Capability、Withdrawal Capability;表格 11 欄 |
| M10-F03 | M10-P02 | 欄位排序 | 可排序欄位:Name、Code、Type、Category、Deposit Capability、Withdrawal Capability、Status、Created At、Updated At |
| M10-F04 | M10-P02 | 分頁 | 可切換每頁筆數 |
| M10-F05 | M10-P03 | 編輯 | 表單 11 個欄位 |
| M10-F06 | M10-P04 | 檢視詳情 | 顯示單筆資料內容 |

</details>

## M11 維護排程(Maintenance)

建立系統或遊戲供應商的維護排程(類型、對象、起訖時間、原因),並更新維護狀態。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M11-P01 | maintenance | 新增 | `/maintenance/add` | `create:maintenance-listing` | M11-F01 新增 |
| M11-P02 | Maintenance Listing | 列表 | `/maintenance/list` | `view:maintenance-listing` | M11-F02 查詢列表<br>M11-F03 欄位排序<br>M11-F04 分頁 |
| M11-P03 | maintenance | 編輯 | `/maintenance/update/:id` | `edit:maintenance-listing` | M11-F05 編輯 |
| M11-P04 | maintenance | 詳情 | `/maintenance/view/:id` | `view:maintenance-listing` | M11-F06 檢視詳情 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M11-F01 | M11-P01 | 新增 | 表單 4 個欄位 |
| M11-F02 | M11-P02 | 查詢列表 | 篩選條件:Type、Status、Target、Schedule Start Date (FROM) ~ Schedule Start Date (TO);表格 10 欄 |
| M11-F03 | M11-P02 | 欄位排序 | 可排序欄位:Schedule Start DateTime、Schedule End DateTime、Type、Target、Actual Start DateTime、Actual End DateTime、Created At |
| M11-F04 | M11-P02 | 分頁 | 可切換每頁筆數 |
| M11-F05 | M11-P03 | 編輯 | 表單 2 個欄位 |
| M11-F06 | M11-P04 | 檢視詳情 | 顯示單筆資料內容 |

</details>

## M12 合規與責任博彩(Compliance)

後台操作稽核紀錄,以及責任博彩相關報表:自我排除名單(可切換狀態)、投注限額變更與高使用率名單。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M12-P01 | Audit Logs | 列表 | `/audits/list` | `view:audits` | M12-F01 查詢列表<br>M12-F02 欄位排序<br>M12-F03 分頁 |
| M12-P02 | betting-limit | 列表 | `/reports/betting-limit/list` | `view:betting-limit-report` | M12-F04 查詢列表<br>M12-F05 分頁<br>M12-F06 匯出 |
| M12-P03 | self-exclusion | 列表 | `/reports/self-exclusion/list` | `view:self-exclusion-report` | M12-F07 查詢列表<br>M12-F08 欄位排序<br>M12-F09 分頁<br>M12-F10 匯出<br>M12-F11 切換狀態 |
| M12-P04 | responsible-gaming-report / betting-limit | 列表 | `/responsible-gaming-report/betting-limit/list` | `view:betting-limit-report` | M12-F12 查詢列表<br>M12-F13 分頁<br>M12-F14 匯出 |
| M12-P05 | responsible-gaming-report / self-exclusion | 列表 | `/responsible-gaming-report/self-exclusion/list` | `view:self-exclusion-report` | M12-F15 查詢列表<br>M12-F16 欄位排序<br>M12-F17 分頁<br>M12-F18 匯出<br>M12-F19 切換狀態 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M12-F01 | M12-P01 | 查詢列表 | 篩選條件:User Name、Type、Event、IP Address、IP Address;表格 7 欄 |
| M12-F02 | M12-P01 | 欄位排序 | 可排序欄位:User Name、Type、Event、IP Address、Created At |
| M12-F03 | M12-P01 | 分頁 | 可切換每頁筆數 |
| M12-F04 | M12-P02 | 查詢列表 | 篩選條件:Member ID、Status、Limit Period |
| M12-F05 | M12-P02 | 分頁 | 可切換每頁筆數 |
| M12-F06 | M12-P02 | 匯出 | 依目前篩選條件下載 Download CSV |
| M12-F07 | M12-P03 | 查詢列表 | 篩選條件:Member ID、Status、common.actions.search;表格 2 欄 |
| M12-F08 | M12-P03 | 欄位排序 | 可排序欄位:Status、Actions |
| M12-F09 | M12-P03 | 分頁 | 可切換每頁筆數 |
| M12-F10 | M12-P03 | 匯出 | 依目前篩選條件下載 Download CSV |
| M12-F11 | M12-P03 | 切換狀態 | POST /report/self_exclusion/toggle_status |
| M12-F12 | M12-P04 | 查詢列表 | 篩選條件:Player ID、Status、Limit Period |
| M12-F13 | M12-P04 | 分頁 | 可切換每頁筆數 |
| M12-F14 | M12-P04 | 匯出 | 依目前篩選條件下載 Download CSV |
| M12-F15 | M12-P05 | 查詢列表 | 篩選條件:Player ID、Status、common.actions.search;表格 2 欄 |
| M12-F16 | M12-P05 | 欄位排序 | 可排序欄位:Status、Actions |
| M12-F17 | M12-P05 | 分頁 | 可切換每頁筆數 |
| M12-F18 | M12-P05 | 匯出 | 依目前篩選條件下載 Download CSV |
| M12-F19 | M12-P05 | 切換狀態 | POST /report/self_exclusion/toggle_status |

</details>

## M13 報表(Reports)

財務與營運報表:無現金負債、資金交易、玩家帳戶交易、營收報表(含舊版),以及非同步匯出的下載中心。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M13-P01 | cashless-liability-old | 列表 | `/reports/cashless-liability-old/list` | `view:cashless-liability-report` | M13-F01 查詢列表<br>M13-F02 欄位排序<br>M13-F03 分頁<br>M13-F04 匯出 |
| M13-P02 | Player Cashless Liability | 詳情 | `/reports/cashless-liability-old/view/:id` | `view:cashless-liability-report` | M13-F05 檢視詳情 |
| M13-P03 | Cashless Liability Report | 列表 | `/reports/cashless-liability/list` | `view:cashless-liability-report` | M13-F06 查詢列表<br>M13-F07 欄位排序<br>M13-F08 分頁<br>M13-F09 匯出 |
| M13-P04 | Player Cashless Liability | 詳情 | `/reports/cashless-liability/view/:id` | `view:cashless-liability-report` | M13-F10 檢視詳情 |
| M13-P05 | Download Center | 列表 | `/reports/download-center/list` | `view:download-center` | M13-F11 查詢列表<br>M13-F12 分頁<br>M13-F13 查看產出紀錄<br>M13-F14 重新產生報表檔 |
| M13-P06 | Fund Transactions Report | 列表 | `/reports/fund-transaction/list` | `view:fund-transaction-report` | M13-F15 查詢列表<br>M13-F16 欄位排序<br>M13-F17 分頁<br>M13-F18 匯出 |
| M13-P07 | Player Account Transaction Report | 列表 | `/reports/player-account-transaction/list` | `view:player-account-transaction-report` | M13-F19 查詢列表<br>M13-F20 欄位排序<br>M13-F21 分頁<br>M13-F22 匯出 |
| M13-P08 | Player Cashless Liability | 詳情 | `/reports/player-account-transaction/view/:id` | `view:cashless-liability-report` | M13-F23 檢視詳情 |
| M13-P09 | revenue-old | 列表 | `/reports/revenue-old/list` | `view:revenue-report` | M13-F24 查詢列表<br>M13-F25 分頁<br>M13-F26 匯出 |
| M13-P10 | Revenue Report | 列表 | `/reports/revenue/list` | `view:revenue-report` | M13-F27 查詢列表<br>M13-F28 分頁<br>M13-F29 匯出 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M13-F01 | M13-P01 | 查詢列表 | 篩選條件:Cashless Liability Report - Old;表格 6 欄 |
| M13-F02 | M13-P01 | 欄位排序 | 可排序欄位:Gaming Date、Total Wallets、iGaming Wallet、iGaming Bonus Wallet、Total Provider Wallet |
| M13-F03 | M13-P01 | 分頁 | 可切換每頁筆數 |
| M13-F04 | M13-P01 | 匯出 | 依目前篩選條件下載 Download CSV |
| M13-F05 | M13-P02 | 檢視詳情 | 顯示單筆資料內容,含明細表格 5 欄 |
| M13-F06 | M13-P03 | 查詢列表 | 篩選條件:Cashless Liability Report;表格 6 欄 |
| M13-F07 | M13-P03 | 欄位排序 | 可排序欄位:Gaming Date、Total Wallets、iGaming Wallet、iGaming Bonus Wallet、Total Provider Wallet |
| M13-F08 | M13-P03 | 分頁 | 可切換每頁筆數 |
| M13-F09 | M13-P03 | 匯出 | 依目前篩選條件下載 Download CSV |
| M13-F10 | M13-P04 | 檢視詳情 | 顯示單筆資料內容,含明細表格 5 欄 |
| M13-F11 | M13-P05 | 查詢列表 | 篩選條件:Report Name、Status、Requested From ~ Requested To;表格 9 欄 |
| M13-F12 | M13-P05 | 分頁 | 可切換每頁筆數 |
| M13-F13 | M13-P05 | 查看產出紀錄 | GET /report/downloads/:id/logs |
| M13-F14 | M13-P05 | 重新產生報表檔 | POST /report/downloads/:id/regenerate |
| M13-F15 | M13-P06 | 查詢列表 | 篩選條件:Fund Transactions Report、Player ID、Transaction Type、Status、Ref ID;表格 11 欄 |
| M13-F16 | M13-P06 | 欄位排序 | 可排序欄位:Player ID、Transaction Type、Wallet From、Wallet To、Ref ID、Transaction Date、Status |
| M13-F17 | M13-P06 | 分頁 | 可切換每頁筆數 |
| M13-F18 | M13-P06 | 匯出 | 依目前篩選條件下載 Download CSV |
| M13-F19 | M13-P07 | 查詢列表 | 篩選條件:Player Account Transaction Report、Player ID;表格 7 欄 |
| M13-F20 | M13-P07 | 欄位排序 | 可排序欄位:ID、Player ID、Provider Name、Turnover、Actual Win、Ref ID、Transaction Date Time |
| M13-F21 | M13-P07 | 分頁 | 可切換每頁筆數 |
| M13-F22 | M13-P07 | 匯出 | 依目前篩選條件下載 Download CSV |
| M13-F23 | M13-P08 | 檢視詳情 | 顯示單筆資料內容,含明細表格 5 欄 |
| M13-F24 | M13-P09 | 查詢列表 | 篩選條件:Provider、Game Category、Game Offering、Game、End Date、Most Recent;表格 0 欄 |
| M13-F25 | M13-P09 | 分頁 | 可切換每頁筆數 |
| M13-F26 | M13-P09 | 匯出 | 依目前篩選條件下載 Download CSV |
| M13-F27 | M13-P10 | 查詢列表 | 篩選條件:Provider、Game Category、Game Offering、Game、End Date、Most Recent;表格 0 欄 |
| M13-F28 | M13-P10 | 分頁 | 可切換每頁筆數 |
| M13-F29 | M13-P10 | 匯出 | 依目前篩選條件下載 Download CSV |

</details>

## M14 系統設定(Settings)

管理後台使用者帳號與角色權限(選單權限勾選),決定每個使用者看得到哪些模塊、能做哪些操作。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M14-P01 | roles | 新增 | `/roles/add` | `create:roles` | M14-F01 新增<br>M14-F02 儲存角色權限 |
| M14-P02 | Role Management | 列表 | `/roles/list` | `view:roles` | M14-F03 查詢列表<br>M14-F04 欄位排序<br>M14-F05 分頁<br>M14-F06 刪除 |
| M14-P03 | roles | 編輯 | `/roles/update/:id` | `edit:roles` | M14-F07 編輯<br>M14-F08 儲存角色權限 |
| M14-P04 | roles | 詳情 | `/roles/view/:id` | `view:roles` | M14-F09 檢視詳情 |
| M14-P05 | users | 新增 | `/users/add` | `create:users` | M14-F10 新增 |
| M14-P06 | User Management | 列表 | `/users/list` | `view:users` | M14-F11 查詢列表<br>M14-F12 欄位排序<br>M14-F13 分頁<br>M14-F14 刪除 |
| M14-P07 | users | 編輯 | `/users/update/:id` | `edit:users` | M14-F15 編輯 |
| M14-P08 | users | 詳情 | `/users/view/:id` | `view:users` | M14-F16 檢視詳情 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M14-F01 | M14-P01 | 新增 | 表單 17 個欄位 |
| M14-F02 | M14-P01 | 儲存角色權限 | POST /roles/:id/permissions |
| M14-F03 | M14-P02 | 查詢列表 | 篩選條件:Name、Code、Status;表格 7 欄 |
| M14-F04 | M14-P02 | 欄位排序 | 可排序欄位:Name、Code、Description、Status、Created At、Updated At |
| M14-F05 | M14-P02 | 分頁 | 可切換每頁筆數 |
| M14-F06 | M14-P02 | 刪除 | DELETE /roles/:id |
| M14-F07 | M14-P03 | 編輯 | 表單 17 個欄位 |
| M14-F08 | M14-P03 | 儲存角色權限 | PUT /roles/:id/permissions |
| M14-F09 | M14-P04 | 檢視詳情 | 顯示單筆資料內容 |
| M14-F10 | M14-P05 | 新增 | 表單 6 個欄位 |
| M14-F11 | M14-P06 | 查詢列表 | 篩選條件:Name、Email、Role、Status;表格 7 欄 |
| M14-F12 | M14-P06 | 欄位排序 | 可排序欄位:Name、Email、Status、Created At、Updated At |
| M14-F13 | M14-P06 | 分頁 | 可切換每頁筆數 |
| M14-F14 | M14-P06 | 刪除 | DELETE /users/:id |
| M14-F15 | M14-P07 | 編輯 | 表單 3 個欄位 |
| M14-F16 | M14-P08 | 檢視詳情 | 顯示單筆資料內容 |

</details>

## M15 OkadaPlay(OkadaPlay)

以內嵌頁面(iframe)開啟 OkadaPlay(playcard.zone)管理後台。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M15-P01 | OkadaPlay | 頁面 | `/okadaplay` | `view:okadaplay` | M15-F01 頁面 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M15-F01 | M15-P01 | 頁面 | 靜態頁或內嵌頁 |

</details>

## M00 登入與錯誤頁(Auth / System)

後台登入(一般登入、PAGCOR 登入)與無權限提示頁。

| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |
|---|---|---|---|---|---|
| M00-P01 | Login | 頁面 | `/login` | `登入即可` | M00-F01 頁面 |
| M00-P02 | Login | 頁面 | `/login-pagcor` | `登入即可` | M00-F02 頁面 |

<details><summary>功能點說明</summary>

| 功能點 | 頁面 | 名稱 | 說明 |
|---|---|---|---|
| M00-F01 | M00-P01 | 頁面 | 靜態頁或內嵌頁 |
| M00-F02 | M00-P02 | 頁面 | 靜態頁或內嵌頁 |

</details>

