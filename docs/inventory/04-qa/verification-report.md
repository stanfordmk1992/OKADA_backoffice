# 04 盤點驗證報告(測試)

> 驗證日期 2026-10-05。本報告分兩階段:**A. 靜態一致性檢查**(已完成)、**B. 實機查驗**(需人工登入後執行)。在 B 完成前,本盤點**不能宣告 100% 正確**。

## A. 靜態一致性檢查結果

| 檢查項目 | 結果 |
|---|---|
| 每個路由都歸屬到模塊 | ✅ 112 / 112 |
| 每個模塊都有產品說明文件 | ✅ 16 / 16 |
| 每個新增/編輯頁都有欄位控制表 | ✅ 33 / 33 |
| 每個列表頁都有表格欄位定義 | 38 / 44(缺的頁面為卡片式或自訂表格,需實機查驗) |
| 需修正/待確認項目 | 6 項(見下表) |

## A-1. 缺漏與退回清單

| # | 退回角色 | 頁面/模塊 | 問題 | 補全方式 | 狀態 |
|---|---|---|---|---|---|
| 1 | 產品 | M06-P03 | 編輯頁有 9 個欄位只顯示、不會送出(Title、Period From、Period To、Payout Frequency、Payout Frequency、Payout Type、Payout Option、Deposit Option、Terms and Conditions) | 實機確認這些欄位是否為唯讀;產品說明需寫明「編輯頁實際可修改的欄位」 | 待補 |
| 2 | 產品 | M13-P08 | 玩家帳戶交易報表的詳情頁使用「無現金負債報表」的權限與 API(/report/cashless/player/list) | 實機確認此頁實際顯示內容,是否為前端複製錯誤 | 待補 |
| 3 | 產品 | M12 | 自我排除、投注限額報表各有兩個路由(/reports/... 與 /responsible-gaming-report/...),內容幾乎相同 | 實機確認選單實際使用哪一個,另一個是否為舊版 | 待補 |
| 4 | 產品 | M13-P09 | 舊版報表 /reports/revenue-old/list 仍存在 | 實機確認是否仍在選單中、與新版差異 | 待補 |
| 5 | 產品 | M13-P01 | 舊版報表 /reports/cashless-liability-old/list 仍存在 | 實機確認是否仍在選單中、與新版差異 | 待補 |
| 6 | 項管 | M01-P03 | 範本殘留頁 /second-page(權限 view:users) | 確認是否應移除 | 待補 |

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

## B. 實機查驗清單(待執行)

執行方式:人工在 Playwright 開出的 Chrome 視窗登入後台 → 測試依下表**只讀**逐頁查驗(不送出任何表單)。

| 檢查 | 方法 | 狀態 |
|---|---|---|
| 側欄選單與 01 模塊分類一致 | 展開所有選單,逐項比對名稱與層級 | 待執行 |
| 每個頁面可開啟且標題正確 | 依 01 路由逐頁開啟 | 待執行 |
| 篩選條件、表格欄位與 03 一致 | 逐頁比對畫面 | 待執行 |
| 新增/編輯表單欄位、必填標示、選項內容與 03 一致 | 開啟表單只看不送 | 待執行 |
| 開關/勾選欄位標籤補齊 | 讀取畫面文字 | 待執行 |
| 下拉選項的實際值(API 動態載入的選項) | 展開下拉選單 | 待執行 |
| 依角色的權限差異 | 需要不同角色帳號,目前只有一個登入帳號 | 待決定 |
