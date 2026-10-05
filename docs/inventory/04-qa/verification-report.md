# 04 盤點驗證報告(測試)

> 驗證日期 2026-10-05。**A. 靜態一致性檢查**(已完成)、**B. 實機只讀查驗**(已完成)。

## 結論

| 項目 | 結果 |
|---|---|
| 實機查驗頁數 | 110 頁:✅ 一致 104、⚠ 有差異 0、無權限 1、略過 5、錯誤 0 |
| 實機選單項目 | 54 個連結,已依此重排 01 模塊分類 |
| 查驗期間攔截的寫入請求 | 0 次;後台資料未被修改 |
| 待補全 | 0 項(見 A-1,依退回角色處理) |
| 待人工決定 | 7 項;環境限制 5 項 |
| 是否 100% 正確 | 已查驗的 104 頁 **100% 一致**、沒有待補全項目;但 5 頁因 dev 環境沒有資料無法開啟、1 頁因帳號權限不足,只有靜態盤點,所以**整體還不能宣告 100%** |

**查驗範圍限制**:只用一個登入帳號,選單與權限依該帳號角色;其他角色看到的範圍沒有驗證。只讀查驗不送出表單,所以後端驗證規則、送出後的行為沒有驗證。

## A. 靜態一致性檢查結果

| 檢查項目 | 結果 |
|---|---|
| 每個路由都歸屬到模塊 | ✅ 112 / 112 |
| 每個模塊都有產品說明文件 | ✅ 17 / 17 |
| 每個新增/編輯頁都有欄位控制表 | ✅ 33 / 33 |
| 每個列表頁都有表格欄位定義 | 38 / 44(缺的頁面為卡片式或自訂表格,需實機查驗) |
| 需修正/待確認項目 | 13 項(見下表) |

## A-1. 缺漏與退回清單

| # | 退回角色 | 頁面/模塊 | 問題 | 補全方式 | 狀態 |
|---|---|---|---|---|---|
| 1 | 產品 | M13-P03 | 編輯頁只有 Status 可修改,其餘 9 個欄位為灰色唯讀(Title、Period From、Period To、Payout Frequency、Payout Frequency、Payout Type、Payout Option、Deposit Option、Terms and Conditions) | 已寫入產品說明「實際可修改的欄位」 | 已實機確認,已補全 |
| 2 | 人工決定 | M12-P09 | 玩家帳戶交易報表的詳情頁,實機顯示的是「Player Cashless Liability」頁(與無現金負債報表詳情相同,權限也用 cashless-liability-report),判定為前端複製錯誤 | 決定是否回報後台團隊修正 | 已實機確認,待決定 |
| 3 | 人工決定 | M12-P08 | 玩家帳戶交易報表列表一進頁面就呼叫 GET /report/player-account-transaction/undefined(尚未選玩家就帶 undefined 送出),屬前端缺陷 | 決定是否回報後台團隊修正 | 已實機確認,待決定 |
| 4 | 人工決定 | M08-P01 | 目前登入帳號沒有 /psp/add 的權限(create:psp),此頁只做了靜態盤點 | 如需實機查驗,請提供有此權限的帳號 | 待決定 |
| 5 | 測試 | M05-P02 | /reports/deposit/view/:id() 未能實機開啟:列表沒有資料可取得 id(dev 環境沒有資料) | dev 有資料後重跑 node live.mjs --only-skipped | 環境限制 |
| 6 | 測試 | M13-P06 | /reports/referral-report/view/:id() 未能實機開啟:列表沒有資料可取得 id(dev 環境沒有資料) | dev 有資料後重跑 node live.mjs --only-skipped | 環境限制 |
| 7 | 測試 | M05-P04 | /reports/withdrawal/view/:id() 未能實機開啟:列表沒有資料可取得 id(dev 環境沒有資料) | dev 有資料後重跑 node live.mjs --only-skipped | 環境限制 |
| 8 | 測試 | M06-P12 | /status-declaration/update/:id() 未能實機開啟:列表沒有資料可取得 id(dev 環境沒有資料) | dev 有資料後重跑 node live.mjs --only-skipped | 環境限制 |
| 9 | 測試 | M05-P07 | /wallets/adjustment/view/:id() 未能實機開啟:列表沒有資料可取得 id(dev 環境沒有資料) | dev 有資料後重跑 node live.mjs --only-skipped | 環境限制 |
| 10 | 人工決定 | M16 | 自我排除、投注限額報表各有兩個路由。實機選單只使用 /responsible-gaming-report/betting-limit/list;/reports/self-exclusion/list、/responsible-gaming-report/self-exclusion/list、/reports/betting-limit/list 不在選單(可直接輸入網址開啟) | 決定不在選單的頁面是否下架;自我排除報表不在此帳號選單,確認是否為權限設定或已停用 | 已實機確認,待決定 |
| 11 | 人工決定 | M12-P10 | 舊版報表 /reports/revenue-old/list 仍在選單中(名稱前綴「Old-」) | 決定是否保留舊版報表 | 已實機確認,待決定 |
| 12 | 人工決定 | M12-P01 | 舊版報表 /reports/cashless-liability-old/list 仍在選單中(名稱前綴「Old-」) | 決定是否保留舊版報表 | 已實機確認,待決定 |
| 13 | 人工決定 | M01-P03 | 範本殘留頁 /second-page(權限 view:users),不在選單 | 決定是否請後台團隊移除 | 已實機確認,待決定 |

## A-2. 前端有定義但沒有頁面使用的選單名稱

這些名稱可能是後端選單 `/get_role_menu` 使用的群組名稱,需實機比對:

- `navigation.submenu.creditAdjustment` = Credit Adjustment
- `navigation.submenu.cashlessLiability` = Cashless Liability Report
- `navigation.submenu.cashlessLiabilityOld` = Old- Cashless Liability Report
- `navigation.submenu.maintenanceListing` = Maintenance Listing
- `navigation.submenu.fundTransaction` = Fund Transaction Report
- `navigation.submenu.depositReport` = Deposit Report
- `navigation.submenu.withdrawalReport` = Withdrawal Report
- `navigation.submenu.revenueReport` = Revenue Report
- `navigation.submenu.revenueReportOld` = Old- Revenue Report
- `navigation.submenu.downloadCenter` = Download Center
- `navigation.submenu.playerProfileUpdateRequests` = Profile Update Requests
- `navigation.submenu.gameProviders` = Game Providers
- `navigation.submenu.gameCategory` = Game Category
- `navigation.submenu.gameType` = Game Type
- `navigation.submenu.featuredGames` = Featured Games
- `navigation.submenu.auditLogs` = Audit Logs
- `navigation.submenu.cashlessLiabilityReport` = Cashless Liability Report
- `navigation.submenu.fundTransactionReport` = Fund Transaction Report
- `navigation.submenu.gameList` = Game List
- `navigation.submenu.gameReport` = Game Report
- `navigation.submenu.referralReport` = Referral Report
- `navigation.submenu.playerAccountTransactionReport` = Player Account Transaction Report
- `navigation.submenu.selfExclusionReport` = Self-Exclusion Report
- `navigation.submenu.bettingLimitReport` = Betting Limit Report
- `navigation.submenu.bonusPlaytech` = Playtech
- `navigation.submenu.playtechFreespinListing` = Free Spin Listing
- `navigation.submenu.playtechFreespinReports` = Free Spin Reports
- `navigation.submenu.bonusPragmaticFreespin` = Pragmatic Play Freespin
- `navigation.submenu.bonusPragmatic` = Pragmatic Play Freespin
- `navigation.submenu.pragmaticFreespinListing` = Pragmatic Freespin Listing
- `navigation.submenu.pragmaticFreespinReports` = Pragmatic Freespin Reports
- `navigation.submenu.bonusOmniplay` = Omniplay
- `navigation.submenu.omniplayFreespinListing` = Free Spin Listing
- `navigation.submenu.omniplayFreespinReports` = Free Spin Reports
- `navigation.submenu.gameOffering` = Game Offerings
- `navigation.subsubmenu.refund` = Credit Reversal
- `navigation.subsubmenu.walletAdjustment` = Wallet Adjustment

## B. 實機只讀查驗結果

執行:`node live.mjs`(人工登入;登入後所有送往 API 的寫入請求都被攔截)→ `node compare.cjs`。截圖存在本機 `.playwright-output/live/`(不進 git)。

| 頁面 | 路由 | 結果 | 說明 |
|---|---|---|---|
| M06-P01 | `/announcements/add` | 一致 | 列表 0 列 |
| M06-P02 | `/announcements/list` | 一致 | 列表 10 列 |
| M10-P01 | `/audits/list` | 一致 | 列表 1 列 |
| M06-P05 | `/banners/add` | 一致 | 列表 0 列 |
| M06-P06 | `/banners/list` | 一致 | 列表 10 列 |
| M15-P01 | `/bonus/omniplay/freespin/create` | 一致 | 列表 0 列 |
| M15-P02 | `/bonus/omniplay/freespin/list` | 一致 | 列表 1 列 |
| M15-P03 | `/bonus/omniplay/freespin/reports` | 一致 | 列表 1 列 |
| M15-P04 | `/bonus/playtech/freespin/create` | 一致 | 列表 0 列 |
| M15-P05 | `/bonus/playtech/freespin/list` | 一致 | 列表 10 列 |
| M15-P06 | `/bonus/playtech/freespin/reports` | 一致 | 列表 1 列 |
| M15-P08 | `/bonus/pragmatic-play/freespin/create` | 一致 | 列表 0 列 |
| M15-P09 | `/bonus/pragmatic-play/freespin/list` | 一致 | 列表 10 列 |
| M15-P10 | `/bonus/pragmatic-play/freespin/reports` | 一致 | 列表 1 列 |
| M07-P01 | `/featured-games/list` | 一致 | 列表 10 列 |
| M07-P02 | `/game-category/add` | 一致 | 列表 0 列 |
| M07-P06 | `/game-offering/add` | 一致 | 列表 0 列 |
| M07-P10 | `/game-provider/list` | 一致 | 列表 10 列 |
| M07-P15 | `/games/add` | 一致 | 列表 0 列 |
| M07-P16 | `/games/list` | 一致 | 列表 10 列 |
| M01-P01 | `/` | 一致 | 列表 0 列 |
| M09-P01 | `/maintenance/add` | 一致 | 列表 0 列 |
| M09-P02 | `/maintenance/list` | 一致 | 列表 10 列 |
| M03-P01 | `/notifications/add` | 一致 | 列表 0 列 |
| M03-P02 | `/notifications/list` | 一致 | 列表 10 列 |
| M14-P01 | `/okadaplay` | 一致 | 列表 0 列 |
| M02-P01 | `/player-profile-update-requests/list` | 一致 | 列表 5 列 |
| M02-P03 | `/players/list` | 一致 | 列表 10 列 |
| M01-P02 | `/profile` | 一致 | 列表 0 列 |
| M04-P01 | `/promotions/opt-in/list` | 一致 | 列表 10 列 |
| M04-P02 | `/promotions/payout/list` | 一致 | 列表 10 列 |
| M04-P03 | `/promotions/settings/add` | 一致 | 列表 0 列 |
| M04-P04 | `/promotions/settings/list` | 一致 | 列表 10 列 |
| M08-P01 | `/psp/add` | 無權限 | 目前登入帳號沒有此頁權限 |
| M08-P02 | `/psp/list` | 一致 | 列表 10 列 |
| M07-P19 | `/quickAccess/add` | 一致 | 列表 0 列 |
| M07-P20 | `/quickAccess/list` | 一致 | 列表 10 列 |
| M13-P01 | `/referral-setting/add` | 一致 | 列表 0 列 |
| M13-P02 | `/referral-setting/list` | 一致 | 列表 10 列 |
| M16-P01 | `/reports/betting-limit/list` | 一致 | 列表 10 列 |
| M12-P01 | `/reports/cashless-liability-old/list` | 一致 | 列表 1 列 |
| M12-P03 | `/reports/cashless-liability/list` | 一致 | 列表 1 列 |
| M12-P05 | `/reports/download-center/list` | 一致 | 列表 8 列 |
| M12-P06 | `/reports/fund-transaction/list` | 一致 | 列表 1 列 |
| M12-P07 | `/reports/game-report/list` | 一致 | 列表 1 列 |
| M12-P08 | `/reports/player-account-transaction/list` | 一致 | 列表 1 列 |
| M12-P10 | `/reports/revenue-old/list` | 一致 | 列表 1 列 |
| M12-P11 | `/reports/revenue/list` | 一致 | 列表 1 列 |
| M16-P02 | `/reports/self-exclusion/list` | 一致 | 列表 8 列 |
| M16-P03 | `/responsible-gaming-report/betting-limit/list` | 一致 | 列表 10 列 |
| M16-P04 | `/responsible-gaming-report/self-exclusion/list` | 一致 | 列表 8 列 |
| M11-P01 | `/roles/add` | 一致 | 列表 64 列 |
| M11-P02 | `/roles/list` | 一致 | 列表 7 列 |
| M01-P03 | `/second-page` | 一致 | 列表 0 列 |
| M11-P05 | `/users/add` | 一致 | 列表 0 列 |
| M11-P06 | `/users/list` | 一致 | 列表 10 列 |
| M05-P05 | `/wallets/adjustment/add` | 一致 | 列表 0 列 |
| M05-P08 | `/wallets/refund/list` | 一致 | 列表 10 列 |
| M06-P03 | `/announcements/update/:id` | 一致 | 列表 0 列 |
| M06-P04 | `/announcements/view/:id` | 一致 | 列表 0 列 |
| M06-P07 | `/banners/update/:id` | 一致 | 列表 0 列 |
| M06-P08 | `/banners/view/:id` | 一致 | 列表 0 列 |
| M15-P07 | `/bonus/playtech/freespin/view/:id` | 一致 | 列表 1 列 |
| M15-P11 | `/bonus/pragmatic-play/freespin/view/:id` | 一致 | 列表 1 列 |
| M07-P11 | `/game-provider/view/:id` | 一致 | 列表 0 列 |
| M07-P17 | `/games/update/:id` | 一致 | 列表 0 列 |
| M07-P18 | `/games/view/:id` | 一致 | 列表 0 列 |
| M09-P03 | `/maintenance/update/:id` | 一致 | 列表 0 列 |
| M09-P04 | `/maintenance/view/:id` | 一致 | 列表 0 列 |
| M03-P03 | `/notifications/update/:id` | 一致 | 列表 0 列 |
| M03-P04 | `/notifications/view/:id` | 一致 | 列表 10 列 |
| M02-P02 | `/player-profile-update-requests/view/:id` | 一致 | 列表 0 列 |
| M02-P04 | `/players/view/:id` | 一致 | 列表 0 列 |
| M04-P05 | `/promotions/settings/view/:id` | 一致 | 列表 0 列 |
| M08-P03 | `/psp/update/:id` | 一致 | 列表 0 列 |
| M08-P04 | `/psp/view/:id` | 一致 | 列表 0 列 |
| M07-P21 | `/quickAccess/update/:id` | 一致 | 列表 0 列 |
| M07-P22 | `/quickAccess/view/:id` | 一致 | 列表 6 列 |
| M13-P03 | `/referral-setting/update/:id` | 一致 | 列表 0 列 |
| M13-P04 | `/referral-setting/view/:id` | 一致 | 列表 0 列 |
| M12-P02 | `/reports/cashless-liability-old/view/:id` | 一致 | 列表 10 列 |
| M12-P04 | `/reports/cashless-liability/view/:id` | 一致 | 列表 10 列 |
| M12-P09 | `/reports/player-account-transaction/view/:id` | 一致 | 列表 10 列 |
| M11-P03 | `/roles/update/:id` | 一致 | 列表 64 列 |
| M11-P04 | `/roles/view/:id` | 一致 | 列表 64 列 |
| M11-P07 | `/users/update/:id` | 一致 | 列表 0 列 |
| M11-P08 | `/users/view/:id` | 一致 | 列表 0 列 |
| M07-P03 | `/game-category/list` | 一致 | 列表 10 列 |
| M07-P07 | `/game-offering/list` | 一致 | 列表 10 列 |
| M07-P12 | `/game-type/list` | 一致 | 列表 5 列 |
| M07-P04 | `/game-category/update/:id` | 一致 | 列表 0 列 |
| M07-P05 | `/game-category/view/:id` | 一致 | 列表 0 列 |
| M07-P08 | `/game-offering/update/:id` | 一致 | 列表 0 列 |
| M07-P09 | `/game-offering/view/:id` | 一致 | 列表 0 列 |
| M07-P13 | `/game-type/update/:id` | 一致 | 列表 0 列 |
| M07-P14 | `/game-type/view/:id` | 一致 | 列表 0 列 |
| M06-P09 | `/responsible-gaming/list` | 一致 | 列表 0 列 |
| M06-P13 | `/terms-and-conditions/list` | 一致 | 列表 0 列 |
| M06-P10 | `/responsible-gaming/update/:id` | 一致 | 列表 0 列 |
| M06-P14 | `/terms-and-conditions/update/:id` | 一致 | 列表 0 列 |
| M05-P01 | `/reports/deposit/list` | 一致 | 列表 1 列 |
| M13-P05 | `/reports/referral-report/list` | 一致 | 列表 1 列 |
| M05-P03 | `/reports/withdrawal/list` | 一致 | 列表 1 列 |
| M06-P11 | `/status-declaration/list` | 一致 | 列表 0 列 |
| M05-P06 | `/wallets/adjustment/list` | 一致 | 列表 1 列 |
| M05-P02 | `/reports/deposit/view/:id` | 略過 | 列表沒有資料可取得 id |
| M13-P06 | `/reports/referral-report/view/:id` | 略過 | 列表沒有資料可取得 id |
| M05-P04 | `/reports/withdrawal/view/:id` | 略過 | 列表沒有資料可取得 id |
| M06-P12 | `/status-declaration/update/:id` | 略過 | 列表沒有資料可取得 id |
| M05-P07 | `/wallets/adjustment/view/:id` | 略過 | 列表沒有資料可取得 id |

