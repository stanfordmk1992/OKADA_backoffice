# OKADA 後台 — 需求工作流 — 主設定

## 版本
v2.1(2026-10-05:開發產出定為原型(沒有後台原始碼);後台以 Playwright 瀏覽器只讀查驗,人工手動登入;原型推送到 GitHub,master 以 GitHub Pages 部署)。
v2.0(2026-10-05:新增「已取消」狀態與「卡住」標記;定稿前清空待確認事項、定稿後內容鎖定,修改一律發起新需求;測試用例由產品寫、測試結果由測試寫、缺陷由新的開發代理修復;全部手動觸發;建立 git 分支與 worktree 流程)。
v1.1(2026-10-05:新增四個角色檔 `roles/`)。
v1.0(2026-10-05:建立六節點需求看板與工作流)。
異動規則時手動遞增此版本號並註明日期與原因。

## 專案資訊
| 項目 | 位置 |
|---|---|
| 本地專案 | `C:\Users\Stanf\OneDrive\桌面\OKADA_backoffice` |
| 後台(dev) | https://okada-dev-bo-2.scms2u.lol/promotions/settings/list(促銷活動設定列表) |
| 需求看板 | https://claude.ai/artifact/1LzrjoTDoZyNa3njtoLJvP(狀態、優先級、需求內容的唯一來源) |
| 看板頁面原始碼 | `board/okada-board.html`(改看板時改這份,再發布到上面的網址) |
| 原型代碼倉庫 | https://github.com/stanfordmk1992/OKADA_backoffice(remote `origin`) |
| 原型線上版 | https://stanfordmk1992.github.io/OKADA_backoffice/(GitHub Pages,只部署 `master` 的 `prototype/`) |

## 開發產出 = 原型
- **沒有 OKADA 後台原始碼**。「開發」產出的是**可操作的 HTML 原型**,放在 `prototype/`(純靜態 HTML/CSS/JS,不需建置)。
- 原型以真實後台為參照:版面、欄位、用語、操作流程先在後台查驗現況,再依需求做出修改後的樣子。
- 原型的資料一律是假資料,不得放入從後台抄來的真實玩家、金額、帳號資訊。

## 後台查驗(Playwright 瀏覽器)
- 工具:專案 `.mcp.json` 的 Playwright MCP(Chrome,登入狀態存在 `C:\Users\Stanf\.okada-playwright-profile`,不在 OneDrive 內)。
- **登入由人工手動完成**:Claude 開啟後台時,若看到登入頁,停下來請你在 Playwright 開出的 Chrome 視窗登入;Claude **不得輸入、詢問或記錄帳號密碼**。
- **只讀**:在真實後台只能瀏覽、切換頁籤、篩選、搜尋、截圖、讀取頁面。**禁止任何會改資料的操作**:儲存、送出、新增、編輯、刪除、啟用/停用開關、匯入、審核。需要看編輯畫面時可以打開表單,但只能關閉或取消,不得送出。
- 截圖存在 `.playwright-output/`(不進 git);截圖如含真實玩家或金額資料,不得放進原型或看板。
- 登入過期或權限不足 → 標記卡住「需要重新登入 / 權限不足」。

## 角色
執行任一角色的工作前,先讀對應的角色檔並照其規則執行。
| 角色 | 檔案 | 負責 |
|---|---|---|
| 產品 | `roles/product.md` | 需求說明、**測試用例**、清空待確認事項、範圍判斷建議 |
| 開發 | `roles/dev.md` | 在需求分支實作;**缺陷修復由新的開發代理執行** |
| 測試 | `roles/qa.md` | 以獨立子代理逐條執行測試用例,**撰寫測試結果** |
| 項管 | `roles/pm.md` | 看板維護、規則把關、卡點與等待關係追蹤、進度回報 |

**人工(你)負責**:定稿、範圍判斷(需不需開發)、優先級、驗收通過/退回、取消、解除卡住。
**全部手動觸發**:Claude 不主動挑需求開工,只執行你下的指令(見「人工操作方式」)。

## 工作節點(狀態機)
```
新需求 ──定稿──► 已定稿 ──[判斷範圍]──┬─ 需開發 ──► 開發完成 ──測試通過──► 測試完成 ──送交──► 待驗收 ──驗收通過──► 已完成
                    ▲                  │                │                                         │
                    │                  └─ 不需開發 ─────┼─────────────────────────────────────────┼──────────► 已完成
                    └──── 測試未過 / 驗收退回(缺陷,回開發修復)────┘◄─────────────────────────────────┘

任一進行中節點 ──取消(必填原因)──► 已取消
任一進行中節點可標記「卡住」(必填原因),狀態不變,解除後繼續
```

| # | 節點 | 看板代碼 | 進入條件 | 可前往 |
|---|---|---|---|---|
| 1 | 新需求 | `new` | 提出需求(內容可編輯) | 已定稿 |
| 2 | 已定稿 | `final` | 通過定稿檢查(見硬規則 2);**內容從此鎖定** | 先判斷範圍 → 需開發:開發完成;不需開發:**直接已完成** |
| 3 | 開發完成 | `dev` | 需開發,且在需求分支 commit(備註 commit hash) | 測試完成(通過)/ 已定稿(未過,回開發修復) |
| 4 | 測試完成 | `qa` | 測試用例全數通過,測試結果已寫入 | 待驗收 |
| 5 | 待驗收 | `uat` | 送交人工實機驗收 | 已完成(通過,合併 master)/ 已定稿(退回,回開發修復) |
| 6 | 已完成 | `done` | 驗收通過,或判定不需開發 | 結束(要再改 → 發起新需求) |
| 7 | 已取消 | `cancelled` | 人工決定不做,必填原因 | 結束(要再做 → 發起新需求) |

## 硬規則
1. **已定稿必須先判斷範圍**(`needsDev`):未判斷前不得進入開發完成。不需開發 → 直接已完成,必填原因。
2. **定稿檢查**(看板「確認定稿」按鈕會擋):標題已填、**測試用例已填**、**待確認事項已清空**、沒有在等待其他需求、沒有標記卡住。
3. **定稿後內容一律不得修改**(標題、模組、說明、測試用例、待確認事項、等待需求)。任何新的修改都**發起新需求**。
   - 例外:優先級屬於排程,仍可由人工調整。
4. **修改動到執行中的需求範圍**:新需求停在「新需求」,`waitFor` 設為該需求編號,看板顯示「等待 REQ-xxxx 完成」;該需求進入已完成或已取消後,新需求才能再次確認並定稿。看板上的「提出修改(發起新需求)」會自動帶入等待關係。
5. **缺陷一律回開發修復**:測試未過或驗收退回 → 回到「已定稿」(需開發),**由新的開發代理執行修復**,不沿用原開發的對話上下文。
6. **測試用例由產品寫、測試結果由測試寫**,不得互相代寫;測試結果逐條記錄在看板的 `testRuns`。
7. **卡住**:任何角色遇到無法自行解決的問題(規格模糊或矛盾、需要改範圍、同一缺陷修 2 次仍不過且原因不明、缺環境或權限)→ 標記卡住並寫原因,停止該需求的工作,等人工處理。卡住的需求不得定稿、不得開工。
8. **退回、取消、卡住一律必填原因**;每次變更都要在 `history` 留下一筆。
9. **不得跳節點**:需開發的需求必須依序經過 開發完成 → 測試完成 → 待驗收 → 已完成。

## 分支與 worktree 流程
| 分支 | 內容 | 誰寫入 |
|---|---|---|
| `master` | **只放已完成(驗收通過)的原型**(`prototype/`)+ 工作流文件(`CLAUDE.md`、`roles/`、`board/`、`.mcp.json`、`.github/`) | 原型只能透過「驗收合併」進入;工作流文件直接提交 |
| `dev/req-xxxx`(例 `dev/req-0001`) | 單一進行中需求的程式碼,從 `master` 開出 | 開發代理(開發與修復) |

- **為什麼每個需求一條 dev 分支**:如果所有進行中的需求共用一條 `dev`,要合併其中一個完成的需求時,會把其他還沒完成的程式碼一起帶進 `master`。
- **工作目錄**:專案根目錄固定停在 `master`,只用來改工作流文件;每個需求分支掛一個 worktree 在 `worktrees/req-xxxx/`(已列入 `.gitignore`),開發、測試、人工本地驗收都在那裡進行。
- **一個分支只做一個需求**:commit 訊息一律以 `REQ-xxxx:` 開頭。需要用到另一個還沒合併的需求的程式碼 → 標記卡住,由人工決定先驗收哪一項,不得把其他需求分支合進來。
- **開分支**(第一次「開發 REQ-xxxx」時):
  ```
  git branch dev/req-xxxx master
  git worktree add worktrees/req-xxxx dev/req-xxxx
  ```
- **同步 master**:每次測試前,先在 worktree 執行 `git merge master`,讓測試涵蓋整合後的結果。衝突無法判斷取捨 → 標記卡住。
- **驗收合併**(「REQ-xxxx 驗收通過」):
  ```
  git merge --no-ff dev/req-xxxx -m "REQ-xxxx: 驗收通過,合併至 master"
  git worktree remove worktrees/req-xxxx
  git branch -d dev/req-xxxx
  ```
  合併有衝突 → `git merge --abort`,狀態退回「已定稿」並備註「需同步 master」,修復重測後要再驗收一次。
- **推送(部署)**:
  - 開發完成、修復完成後:`git push -u origin dev/req-xxxx`(備份,不會上線)
  - 驗收合併後:`git push origin master` → GitHub Actions(`.github/workflows/pages.yml`)把 `prototype/` 部署到 GitHub Pages;合併後在 `git push origin --delete dev/req-xxxx` 刪除遠端分支
  - 工作流文件在 `master` commit 後一併推送
- **本地執行原型**(測試與人工本地驗收都用這個,埠號固定 4173):
  ```
  cd worktrees/req-xxxx
  npx -y http-server@14.1.1 prototype -p 4173 -c-1
  ```
  瀏覽器開 http://localhost:4173 。Playwright 預設擋 `file://`,所以一律透過本地伺服器開啟。
- **取消**:在看板 `history` 記下分支最後的 commit hash,再移除 worktree、刪除本地與遠端分支(`git branch -D`、`git push origin --delete`)。
- **禁止**:直接在 `master` 改程式碼、fast-forward / squash / rebase 改寫 `master` 歷史。
- **不需開發的需求**不開分支。

## 看板資料結構
看板資料存在 artifact 資料庫,collection `reqs`,文件 id = 需求編號。

| 欄位 | 說明 | 誰寫 |
|---|---|---|
| `id` | 需求編號 `REQ-0001` 起,接續最大編號 | 建立時 |
| `title` | 需求標題 | 產品(新需求階段) |
| `module` | 功能模組(例:促銷活動設定) | 產品 |
| `priority` | `P0`–`P3` | 人工 |
| `description` | 需求說明(背景、要做什麼、影響頁面、不做的範圍) | 產品 |
| `testCases` | 測試用例(`TC-01`…,含驗收標準) | **產品** |
| `openQuestions` | 待確認事項;非空不得定稿 | 產品提出、人工回答後清空 |
| `waitFor` | 等待的需求編號;空字串 = 不等待 | 產品/項管 |
| `status` | `new` / `final` / `dev` / `qa` / `uat` / `done` / `cancelled` | 依流轉 |
| `needsDev` | `null` 未判斷 / `true` 需開發 / `false` 不需開發 | 人工 |
| `blocked` / `blockedReason` | 卡住標記與原因 | 任何角色標記;人工解除 |
| `testRuns` | 測試結果陣列 `{at, by, result: pass/fail, report, commit}` | **測試** |
| `createdAt` / `updatedAt` / `createdBy` | 時間與建立者 | 自動 |
| `history` | 流轉紀錄 `{from?, to, at, by, note, testResult?}` | 自動 |

- 欄位遵循唯一字段規則:同義欄位禁止並存;需要新欄位時先經人工確認,再同步修改看板頁面與本文件。
- 分支名由需求編號推得(`dev/req-xxxx`),不另設欄位。

## Claude 操作看板的方式
- 讀取:`ArtifactData` `list`,collection `reqs`。
- 寫入:`ArtifactData` `update`,寫入既有文件必須帶 `if_version`;同時更新 `updatedAt`,並在 `history` 追加一筆紀錄。新建用 `set`;多筆用 `batch`。
- Claude 寫入的 `history.note` 開頭標明角色,例:`[開發] ...`、`[測試] ...`、`[項管] ...`(看板以你的帳號寫入,靠這個區分是誰做的)。
- 修改看板頁面:改 `board/okada-board.html` → `Artifact` publish 帶上面的看板網址(先 `read`)→ 在 `master` commit。

## 人工操作方式(直接在對話裡說)
| 指令 | 執行 |
|---|---|
| 描述新需求 | 產品配發編號、寫說明/測試用例/待確認事項草案,登錄到「新需求」 |
| 回答待確認事項 | 產品更新內容並清空該欄 |
| 「REQ-xxxx 定稿」 | 項管檢查定稿條件 → 已定稿 |
| 「REQ-xxxx 需開發」/「REQ-xxxx 不需開發:原因」 | 範圍判斷(不需開發直接已完成) |
| 「開發 REQ-xxxx」 | 開發依 `roles/dev.md` 開分支、實作、commit → 開發完成 |
| 「測試 REQ-xxxx」 | 以**新的測試子代理**依 `roles/qa.md` 執行 → 測試完成 / 退回已定稿 |
| 「修復 REQ-xxxx」 | 以**新的開發子代理**依測試結果修復 → 開發完成 |
| 「REQ-xxxx 送驗收」 | 測試完成 → 待驗收,附人工驗收清單與 worktree 位置 |
| 「REQ-xxxx 驗收通過」 | 已完成 + 合併至 `master`(見分支流程) |
| 「REQ-xxxx 退回:原因」 | 回已定稿,等「修復 REQ-xxxx」;規格問題請另開新需求 |
| 「REQ-xxxx 取消:原因」 | 已取消 + 清理分支 |
| 「REQ-xxxx 卡住:原因」/「REQ-xxxx 解除卡住」 | 卡住標記 |
| 「REQ-xxxx 改 P1」 | 直接生效 |
| 「進度」/「看板狀態」 | 項管依 `roles/pm.md` 格式回報 |

## 一次性設定(人工)
- [ ] 在本資料夾開新的 Claude Code 對話,同意載入專案 MCP 伺服器 `playwright`
- [ ] 第一次查驗時,在 Playwright 開出的 Chrome 視窗手動登入後台
- [ ] GitHub repo → Settings → Branches:預設分支改成 `master`,再刪除 `main`
- [ ] GitHub repo → Settings → Pages → Source 選「GitHub Actions」(私有 repo 需付費方案才能用 Pages)
