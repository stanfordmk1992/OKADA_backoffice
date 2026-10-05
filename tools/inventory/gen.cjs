// 由 pages.json 產生盤點文件(項管/產品/開發/測試)
const fs = require("fs");
const path = require("path");
const EN = require("./i18n-en.json");
const MODS = require("./modules.cjs");
const pages = require("./pages.json");
const OUT = process.argv[2];
const SRC_VER = "2.8.2";
const TODAY = "2026-10-05";

const esc = s => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const t = k => EN[k] ?? null;
const FRONT_ROUTES = new Set(pages.map(p => p.path.replace(/:id\(\)/, ":id")));
const cleanApi = list => list.map(a => ({ ...a, url: a.url.replace(/^\/?:id\//, "/{vendor}/") })).filter(a => /^\/(\{vendor\}\/)?[a-z]/i.test(a.url) && !/\s|\?/.test(a.url) && !FRONT_ROUTES.has(a.url) && !/^\/(game-category|game-type|game-offering|game-provider|responsible-gaming|terms-and-conditions|status-declaration|referral-setting)\/list$/.test(a.url))
  .filter((a, i, arr) => arr.findIndex(b => b.method === a.method && b.url === a.url) === i);

// 歸屬模塊
function moduleOf(p) {
  let best = null, len = -1;
  for (const m of MODS) for (const pre of m.prefixes) {
    const hit = pre === "/" ? p.path === "/" : (p.path === pre || p.path.startsWith(pre.endsWith("/") ? pre : pre + "/") || p.path.startsWith(pre));
    if (hit && pre.length > len) { best = m; len = pre.length; }
  }
  return best;
}
const TYPE = { list: "列表", add: "新增", create: "新增", update: "編輯", view: "詳情", reports: "報表" };
function pageType(p) {
  const segs = p.path.split("/").filter(Boolean);
  const last = segs[segs.length - 1] || "";
  const prev = segs[segs.length - 2] || "";
  if (/^:id/.test(last)) return TYPE[prev] ? prev : "view";
  if (TYPE[last]) return last;
  return "page";
}
function pageTitle(p) {
  const k = p.keys.find(k => /^navigation\.(subsubmenu|submenu|menu)\./.test(k)) || p.keys.find(k => /\.(title|pageTitle|header)$/.test(k));
  const base = k ? t(k) : null;
  const seg = p.path.split("/").filter(Boolean).filter(s => !/^:id/.test(s) && !TYPE[s]).join(" / ") || "Home";
  return base || seg;
}
const OVR = require("./overrides.cjs");
const applyOvr = (p, f) => {
  const hay = [f.label, f.placeholder, f.key, f.comp, f.model].filter(Boolean);
  const o = OVR.find(o => !o.page && o.path === p.path && hay.some(h => o.match instanceof RegExp ? o.match.test(h) : String(h).includes(o.match)));
  if (!o) return f;
  return { ...f, label: o.label || f.label, labelFrom: o.label ? "人工" : f.labelFrom, key: o.key || f.key, note: o.note || null, cond: o.cond || null, manual: true };
};
const allFields = p => [...p.fields.map(f => ({ ...f, from: "頁面" })), ...p.subs.flatMap(s => s.fields.map(f => ({ ...f, from: s.name || s.file })))].map(f => applyOvr(p, f));
const allApi = p => cleanApi([...p.api, ...p.subs.flatMap(s => s.api)]);
const allKeys = p => [...new Set([...p.keys, ...p.subs.flatMap(s => s.keys)])];
const actionsOf = p => [...new Set(allKeys(p).filter(k => /^common\.actions\./.test(k)).map(k => t(k)).filter(Boolean))];
const messagesOf = p => [...new Set(allKeys(p).filter(k => /\.messages\./.test(k)).map(k => t(k)).filter(Boolean))];

// 由 API 推得的操作功能點
function apiAction(a) {
  const u = a.url, m = a.method;
  if (/sequence\/update/.test(u)) return "拖曳調整顯示順序";
  if (/toggle_status/.test(u)) return "切換狀態";
  if (/status\/:id/.test(u)) return "啟用/停用切換";
  if (/approve/.test(u)) return "核准申請";
  if (/reject/.test(u)) return "駁回申請";
  if (/regenerate/.test(u)) return "重新產生報表檔";
  if (/\/logs$/.test(u)) return "查看產出紀錄";
  if (/transfer_back/.test(u)) return "將子錢包餘額轉回";
  if (/wallets\/refresh/.test(u)) return "重新整理錢包餘額";
  if (/remove-all/.test(u)) return "移除玩家全部未使用免費旋轉";
  if (/remove/.test(u)) return "移除免費旋轉";
  if (/massGive|\/give/.test(u)) return "發放免費旋轉";
  if (/sync-.*image/.test(u)) return "同步供應商遊戲圖片(" + (u.match(/sync-(\w+)-image/) || [])[1] + ")";
  if (/permissions/.test(u) && m !== "GET") return "儲存角色權限";
  if (/player_list/.test(u)) return "查看通知對象名單";
  if (/wallets\/refund\/:id/.test(u)) return "執行沖正(Credit Reversal)";
  if (m === "DELETE") return "刪除";
  return null;
}
const filterName = f => f.label || f.placeholder || f.key || f.comp;

// 功能點清單
function featurePoints(p) {
  const type = pageType(p), F = allFields(p), A = allApi(p), acts = actionsOf(p);
  const fp = [];
  const filters = F.filter(f => !/per page|per_page/i.test(filterName(f) || "") && f.key !== "per_page" && !/Items per page/.test(f.label || ""));
  if (type === "list" || type === "reports" || (type === "page" && p.headers)) {
    fp.push({ name: "查詢列表", desc: (filters.length ? "篩選條件:" + filters.map(filterName).filter(Boolean).join("、") : "無篩選條件") + (p.headers ? `;表格 ${p.headers.length} 欄` : "") });
    if (p.headers && p.headers.some(h => h.sortable)) fp.push({ name: "欄位排序", desc: "可排序欄位:" + p.headers.filter(h => h.sortable).map(h => h.title).join("、") });
    if (F.some(f => /per page|per_page/i.test(filterName(f) || "") || f.key === "per_page")) fp.push({ name: "分頁", desc: "可切換每頁筆數" });
    if (acts.some(a => /Download|Export/i.test(a))) fp.push({ name: "匯出", desc: "依目前篩選條件下載 " + (acts.find(a => /Download|Export/i.test(a))) });
  }
  if (type === "view") fp.push({ name: "檢視詳情", desc: "顯示單筆資料內容" + (p.headers ? `,含明細表格 ${p.headers.length} 欄` : "") });
  if (type === "add" || type === "create") fp.push({ name: "新增", desc: `表單 ${F.length} 個欄位` });
  if (type === "update") fp.push({ name: "編輯", desc: `表單 ${F.length} 個欄位` });
  for (const a of A) { const n = apiAction(a); if (n && !fp.find(x => x.name === n)) fp.push({ name: n, desc: `${a.method} ${a.url}` }); }
  if (type === "page" && !fp.length) fp.push({ name: "頁面", desc: "靜態頁或內嵌頁" });
  return fp;
}

// 依模塊整理
const byMod = {};
for (const p of pages) { const m = moduleOf(p); if (!m) { console.warn("unmapped", p.path); continue; } (byMod[m.id] ||= []).push(p); }
const ORDER = MODS.map(m => m.id);
const typeOrder = { list: 0, reports: 1, view: 2, add: 3, create: 3, update: 4, page: 5 };
for (const id of ORDER) (byMod[id] || []).sort((a, b) => a.path.localeCompare(b.path) || typeOrder[pageType(a)] - typeOrder[pageType(b)]);

// 頁面/功能點編號
const PG = {}, FPS = {};
for (const m of MODS) {
  let pi = 0, fi = 0;
  for (const p of byMod[m.id] || []) {
    PG[p.path] = `${m.id}-P${String(++pi).padStart(2, "0")}`;
    FPS[p.path] = featurePoints(p).map(f => ({ ...f, id: `${m.id}-F${String(++fi).padStart(2, "0")}` }));
  }
}
const perm = p => p.meta && p.meta.action ? `${p.meta.action}:${p.meta.subject}` : (p.meta && p.meta.authenticatedOnly ? "登入即可" : "公開/未設定");
// 實機查驗結果(有跑 live.mjs + compare.cjs 才有)
let LIVE = null, MENU_TO = null, MENU_TREE = null;
try { LIVE = JSON.parse(fs.readFileSync("live/compare.json", "utf8")); } catch {}
try { const j = JSON.parse(fs.readFileSync("live/role_menu.json", "utf8")); MENU_TREE = (j.data ?? j).menu; MENU_TO = new Set(); const w = a => a.forEach(m => { if (m.to) MENU_TO.add(m.to); w(m.children || []); }); w(MENU_TREE); } catch {}
const liveOf = p => LIVE && LIVE.pages.find(x => x.path === p.path);
const inMenu = p => {
  if (!MENU_TO) return "未查驗";
  if (MENU_TO.has(p.name)) return "✅ 選單";
  if (p.path === "/profile") return "個人選單";
  if (["view", "add", "create", "update"].includes(pageType(p))) return "由列表進入";
  return "❌ 不在選單";
};
const liveStatus = p => { const l = liveOf(p); return !l ? "未查驗" : l.status === "一致" ? "✅ 一致" : l.status === "有差異" ? "⚠ 有差異" : l.status; };
const W = (rel, s) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s.replace(/\n{3,}/g, "\n\n")); };
const slug = m => `${m.id}-${m.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;
const SRC_NOTE = LIVE
  ? `> 資料來源:後台前端程式(版本 ${SRC_VER})靜態分析,並於 ${LIVE.date} 以人工登入帳號實機只讀查驗(選單依該帳號角色)。各頁查驗結果見 04 測試報告。`
  : `> 資料來源:後台前端程式(版本 ${SRC_VER})靜態分析,${TODAY}。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。`;

/* ===================== 01 項管:模塊與功能點 ===================== */
{
  let s = `# 01 功能模塊與功能點清單(項管)\n\n${SRC_NOTE}\n\n`;
  const total = pages.length, fpN = Object.values(FPS).reduce((n, a) => n + a.length, 0);
  s += `## 總覽\n\n| 模塊 | 名稱 | 前端選單(英文) | 頁面數 | 功能點數 |\n|---|---|---|---|---|\n`;
  for (const m of MODS) { const ps = byMod[m.id] || []; s += `| ${m.id} | ${m.name} | ${m.nav ? esc(t(m.nav)) : "—"} | ${ps.length} | ${ps.reduce((n, p) => n + FPS[p.path].length, 0)} |\n`; }
  s += `| **合計** | | | **${total}** | **${fpN}** |\n\n`;
  s += `- 分類依據:實機後端選單 \`/get_role_menu\` 的分組與順序${MENU_TO ? "(已查驗)" : "(尚未查驗)"};不在選單的路由歸到最接近的模塊,「選單」欄標示「❌ 不在選單」。\n- 權限欄為前端路由守衛的 CASL 規則 \`action:subject\`,沒有權限的使用者會被導向 \`/not-authorized\`。\n- 實機欄:✅ 畫面與盤點一致;⚠ 有差異(見 04 測試報告 B 段);略過 = 列表沒有資料,無法開啟詳情/編輯頁。\n\n`;
  if (MENU_TREE) {
    s += `## 實機選單結構\n\n\`\`\`\n`;
    const pr = (a, d) => a.forEach(m => { s += `${"  ".repeat(d)}${t(m.title) || m.title}${m.to ? "  → " + m.to : ""}\n`; pr(m.children || [], d + 1); });
    pr(MENU_TREE, 0);
    s += `\`\`\`\n\n`;
  }
  for (const m of MODS) {
    const ps = byMod[m.id] || [];
    s += `## ${m.id} ${m.name}(${m.en})\n\n${m.purpose}\n\n| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 選單 | 實機 | 功能點 |\n|---|---|---|---|---|---|---|---|\n`;
    for (const p of ps) s += `| ${PG[p.path]} | ${esc(pageTitle(p))} | ${TYPE[pageType(p)] || "頁面"} | \`${p.path.replace(":id()", ":id")}\` | \`${perm(p)}\` | ${inMenu(p)} | ${liveStatus(p)} | ${FPS[p.path].map(f => `${f.id} ${f.name}`).join("<br>")} |\n`;
    s += `\n<details><summary>功能點說明</summary>\n\n| 功能點 | 頁面 | 名稱 | 說明 |\n|---|---|---|---|\n`;
    for (const p of ps) for (const f of FPS[p.path]) s += `| ${f.id} | ${PG[p.path]} | ${f.name} | ${esc(f.desc)} |\n`;
    s += `\n</details>\n\n`;
  }
  W("01-pm-modules.md", s);
}

/* ===================== 02 產品:模塊內容與操作流程 ===================== */
const mm = s => String(s).replace(/["<>{}\[\]()|]/g, " ").replace(/\s+/g, " ").trim();
for (const m of MODS) {
  const ps = byMod[m.id] || [];
  let s = `# ${m.id} ${m.name}(${m.en})— 模塊內容與操作流程(產品)\n\n${SRC_NOTE}\n\n## 模塊說明\n\n${m.purpose}\n\n`;
  s += `## 頁面一覽\n\n| 頁面 | 名稱 | 類型 | 路由 | 主要操作 |\n|---|---|---|---|---|\n`;
  for (const p of ps) s += `| ${PG[p.path]} | ${esc(pageTitle(p))} | ${TYPE[pageType(p)] || "頁面"} | \`${p.path.replace(":id()", ":id")}\` | ${esc(actionsOf(p).join("、"))} |\n`;
  // 模塊頁面流程圖
  s += `\n## 頁面流程圖\n\n\`\`\`mermaid\nflowchart LR\n`;
  const groups = {};
  for (const p of ps) { const base = p.path.replace(/\/(list|add|create|update|view|reports)(\/:id\(\))?$/, ""); (groups[base] ||= []).push(p); }
  let gi = 0;
  for (const [base, gp] of Object.entries(groups)) {
    gi++;
    const node = p => `${m.id}_${PG[p.path].split("-")[1]}`;
    const list = gp.find(p => pageType(p) === "list"), add = gp.find(p => ["add", "create"].includes(pageType(p))), upd = gp.find(p => pageType(p) === "update"), view = gp.find(p => pageType(p) === "view"), rep = gp.find(p => pageType(p) === "reports");
    s += `  subgraph G${gi}["${mm(pageTitle(list || gp[0]))}"]\n`;
    for (const p of gp) s += `    ${node(p)}["${PG[p.path]} ${TYPE[pageType(p)] || "頁面"}"]\n`;
    s += `  end\n`;
    if (list && add) s += `  ${node(list)} -->|新增| ${node(add)}\n  ${node(add)} -->|儲存成功| ${node(list)}\n`;
    if (list && view) s += `  ${node(list)} -->|檢視| ${node(view)}\n`;
    if (list && upd) s += `  ${node(list)} -->|編輯| ${node(upd)}\n`;
    if (view && upd) s += `  ${node(view)} -->|編輯| ${node(upd)}\n`;
    if (upd && (list || view)) s += `  ${node(upd)} -->|更新成功| ${node(list || view)}\n`;
    if (list && rep) s += `  ${node(list)} -.-> ${node(rep)}\n`;
    for (const p of gp) for (const a of allApi(p)) { const n = apiAction(a); if (n) { const id = `${node(p)}_${Math.abs([...a.url].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)) % 9999}`; s += `  ${node(p)} -.-> ${id}(["${mm(n)}"])\n`; } }
  }
  s += `\`\`\`\n\n`;
  // 每頁操作說明
  s += `## 頁面內容與操作說明\n\n`;
  for (const p of ps) {
    const type = pageType(p), F = allFields(p), A = allApi(p), msgs = messagesOf(p);
    s += `### ${PG[p.path]} ${esc(pageTitle(p))}(${TYPE[type] || "頁面"})\n\n- 路由:\`${p.path.replace(":id()", ":id")}\`  權限:\`${perm(p)}\`\n`;
    const fps = FPS[p.path];
    s += `- 功能點:${fps.map(f => `${f.id} ${f.name}`).join("、")}\n`;
    {
      const lvp = liveOf(p), pnote = (OVR.find(o => o.page && o.path === p.path) || {}).note;
      if (pnote) s += `- 頁面說明:${esc(pnote)}\n`;
      const hs = lvp && lvp.headersFromLive ? lvp.headersFromLive : (p.headers ? p.headers.map(h => h.title) : null);
      if (hs) s += `- 表格欄位${lvp && lvp.headersFromLive ? "(實機)" : ""}:${hs.map(esc).join("、")}\n`;
      if (lvp && lvp.displayFields && lvp.displayFields.length) s += `- 顯示內容(實機):${lvp.displayFields.map(esc).join("、")}\n`;
      const cf = F.filter(f => f.cond);
      if (cf.length) s += `- 條件顯示的欄位:${cf.map(f => esc(filterName(f)) + "(" + esc(f.cond) + ")").join("、")}\n`;
    }
    if (F.length) s += `- ${["list", "reports"].includes(type) ? "篩選條件" : "表單欄位"}:${F.map(f => esc(filterName(f))).filter(Boolean).join("、")}(欄位規則見 03 開發欄位控制)\n`;
    const roF = F.filter(f => f.loadOnly || /^—/.test(f.key || ""));
    if (type === "update" && roF.length >= 3) s += `- ⚠ **實際可修改的欄位**:${F.filter(f => f.key && !/^—/.test(f.key)).map(f => esc(filterName(f))).join("、") || "無"};其餘 ${roF.length} 個欄位只顯示、不會送出(${roF.map(f => esc(filterName(f))).join("、")})\n`;
    if (msgs.length) s += `- 系統提示:${msgs.slice(0, 12).map(x => "「" + esc(x) + "」").join("、")}\n`;
    const lv = liveOf(p);
    s += `- 選單位置:${inMenu(p)};實機狀態:${liveStatus(p)}${lv && lv.reason ? "(" + esc(lv.reason) + ")" : ""}${lv && lv.shot ? `;截圖(本機,不進 git):\`.playwright-output/live/${path.basename(lv.shot)}\`` : ""}\n`;
    if (lv && lv.status === "有差異") {
      if (lv.missingFields.length) s += `  - ⚠ 盤點有、畫面沒看到:${lv.missingFields.map(esc).join("、")}\n`;
      if (lv.extraLabels.length) s += `  - ⚠ 畫面有、盤點沒有:${lv.extraLabels.map(esc).join("、")}\n`;
      if (lv.missingHeaders.length) s += `  - ⚠ 表格欄位畫面沒看到:${lv.missingHeaders.map(esc).join("、")}\n`;
      if (lv.apiErrors.length) s += `  - ⚠ API 錯誤:${lv.apiErrors.map(esc).join("、")}\n`;
    }
    s += `\n`;
    // 操作步驟(文)
    const loads = A.filter(a => a.method === "GET"), writes = A.filter(a => a.method !== "GET");
    const steps = [];
    if (type === "list" || type === "reports") {
      steps.push("從側欄選單進入本頁,系統載入第一頁資料" + (loads.length ? `(${loads.map(a => a.url).join("、")})` : ""));
      if (F.length) steps.push("輸入篩選條件後按「Search」查詢;按「Clear」清除條件");
      if (p.headers && p.headers.some(h => h.sortable)) steps.push("點欄位標題排序");
      if (actionsOf(p).some(a => /Download/i.test(a))) steps.push("按「Download CSV / Download」匯出目前查詢結果");
      for (const a of writes) { const n = apiAction(a); if (n) steps.push(`${n}(${a.method} ${a.url})`); }
    } else if (["add", "create", "update"].includes(type)) {
      steps.push(`開啟${TYPE[type]}頁,系統載入下拉選項` + (loads.length ? `(${loads.map(a => a.url).join("、")})` : ""));
      steps.push("依序填寫欄位(必填欄位標示 *)");
      steps.push("按「" + (actionsOf(p).find(a => /Save|Update/.test(a)) || "Save") + "」送出;前端驗證未通過時,游標跳到第一個錯誤欄位並顯示錯誤訊息");
      if (writes.length) steps.push(`驗證通過後送出 ${writes.map(a => a.method + " " + a.url).join("、")}`);
      steps.push("成功:顯示成功提示並返回列表;失敗:顯示後端回傳的錯誤訊息,留在本頁");
      steps.push("按「Cancel」放棄並返回上一頁");
    } else if (type === "view") {
      steps.push("由列表按「View」進入,系統載入單筆資料" + (loads.length ? `(${loads.map(a => a.url).join("、")})` : ""));
      for (const a of writes) { const n = apiAction(a); if (n) steps.push(`${n}(${a.method} ${a.url})`); }
      if (actionsOf(p).includes("Edit")) steps.push("按「Edit」進入編輯頁");
    }
    if (steps.length) s += `**操作步驟**\n\n${steps.map((x, i) => `${i + 1}. ${esc(x)}`).join("\n")}\n\n`;
    // 送出流程圖(新增/編輯)
    if (["add", "create", "update"].includes(type) && writes.length) {
      s += `\`\`\`mermaid\nflowchart TD\n  A["開啟${TYPE[type]}頁"] --> B["載入選項 ${mm(loads.map(a => a.url).join(" ")) || "無"}"]\n  B --> C["填寫 ${F.length} 個欄位"]\n  C --> D{"前端驗證"}\n  D -->|未通過| E["顯示錯誤並聚焦第一個錯誤欄位"] --> C\n  D -->|通過| F["${mm(writes.map(a => a.method + " " + a.url).join(" / "))}"]\n  F --> G{"後端回應"}\n  G -->|成功| H["成功提示 → 返回列表"]\n  G -->|失敗| I["顯示錯誤訊息,留在本頁"] --> C\n\`\`\`\n\n`;
    }
  }
  W(`02-product/${slug(m)}.md`, s);
}

/* ===================== 03 開發:欄位控制 ===================== */
for (const m of MODS) {
  const ps = byMod[m.id] || [];
  let s = `# ${m.id} ${m.name} — 欄位控制規格(開發)\n\n${SRC_NOTE}\n\n- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。\n- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。\n\n`;
  for (const p of ps) {
    const F = allFields(p), A = allApi(p);
    if (!F.length && !p.headers && !A.length) continue;
    s += `## ${PG[p.path]} ${esc(pageTitle(p))}(${TYPE[pageType(p)] || "頁面"})\`${p.path.replace(":id()", ":id")}\`\n\n`;
    if (F.length) {
      s += `| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |\n|---|---|---|---|---|---|---|---|---|\n`;
      F.forEach((f, i) => {
        const req = f.rules.some(r => r === "必填" || /is required|required/i.test(r) || /^圖片/.test(r)) ? "是" : (/\*\s*$/.test(f.label || "") ? "是(標示)" : "否");
        const opt = f.items ? (f.items === "(動態載入)" || /^[\w$]+\.value$/.test(f.items) ? "API 動態載入" : f.items) : "";
        const sendKey = f.key ? "`" + f.key + "`" : f.loadOnly ? `—(只顯示,不送出;資料來自 \`${f.loadOnly}\`)` : (["add", "create", "update"].includes(pageType(p)) ? "未確定" : "");
        s += `| ${i + 1} | ${esc(filterName(f))}${f.labelFrom === "相鄰文字" ? "ⁱ" : ""} | ${esc(f.comp)} | ${esc(sendKey)} | ${req} | ${esc(f.rules.join(";"))} | ${esc(opt)} | ${esc([f.cond ? "顯示條件:" + f.cond : "", f.note ? "說明:" + f.note : "", f.flags.join(" ")].filter(Boolean).join(" "))} | ${esc(f.manual ? "人工補全" : f.from)} |\n`;
      });
      s += `\n`;
    }
    const lvp = liveOf(p), pnote = (OVR.find(o => o.page && o.path === p.path) || {}).note;
    if (pnote) s += `> 頁面說明:${esc(pnote)}

`;
    if (lvp && lvp.headersFromLive) s += `**表格欄位(實機畫面)**:${lvp.headersFromLive.map(esc).join("、")}

`;
    if (lvp && lvp.displayFields && lvp.displayFields.length) s += `**唯讀顯示欄位(實機畫面)**:${lvp.displayFields.map(esc).join("、")}

`;
    if (p.headers) {
      s += `**表格欄位**\n\n| # | 欄位標題 | 資料 key | 可排序 |\n|---|---|---|---|\n`;
      p.headers.forEach((h, i) => s += `| ${i + 1} | ${esc(h.title)} | \`${h.key}\` | ${h.sortable ? "是" : "否"} |\n`);
      s += `\n`;
    }
    if (A.length) s += `**API**:${A.map(a => `\`${a.method} ${a.url}\``).join("、")}\n\n`;
    const lv = liveOf(p);
    if (lv && lv.options && lv.options.length) {
      s += `**實機下拉選項**(${LIVE.date} 查驗時 API 回傳)\n\n| API | 選項 |\n|---|---|\n`;
      for (const o of lv.options) s += `| \`${o.ep}\` | ${esc(o.options.slice(0, 40).join("、"))}${o.options.length > 40 ? ` …共 ${o.options.length} 項` : ""} |\n`;
      s += `\n`;
    }
  }
  W(`03-dev/fields/${slug(m)}.md`, s);
}

/* ===================== 03 開發:API 清單 ===================== */
{
  const map = {};
  for (const p of pages) for (const a of allApi(p)) { const k = a.method + " " + a.url; (map[k] ||= new Set()).add(PG[p.path] || p.path); }
  let s = `# API 清單(開發)\n\n${SRC_NOTE}\n\nBase URL(dev):\`https://okada-dev-api-2.scms2u.lol/backoffice\`;所有請求帶 \`Authorization: Bearer <token>\`。\n\n| 方法 | 路徑 | 使用頁面 |\n|---|---|---|\n`;
  for (const k of Object.keys(map).sort((a, b) => a.split(" ")[1].localeCompare(b.split(" ")[1]))) { const [mth, u] = k.split(" "); s += `| ${mth} | \`${u}\` | ${[...map[k]].join("、")} |\n`; }
  s += `\n共 ${Object.keys(map).length} 個端點。\n`;
  W("03-dev/api.md", s);
}

/* ===================== 04 測試:靜態一致性檢查 ===================== */
{
  const issues = [];
  for (const p of pages) {
    const F = allFields(p), type = pageType(p), id = PG[p.path];
    const isForm = ["add", "create", "update"].includes(type);
    const isRoleGrid = f => /^\/roles\//.test(p.path) && f.comp === "VCheckbox";
    const noName = F.filter(f => !f.label && !f.placeholder && !isRoleGrid(f) && f.key !== "per_page");
    if (noName.length) issues.push({ owner: "開發", id, what: `${noName.length} 個欄位沒有可讀名稱(${noName.map(f => f.comp + (f.key ? ":" + f.key : "")).join("、")})`, fix: "實機查驗畫面上的欄位標籤後補上" });
    if (isForm) {
      const noKey = F.filter(f => !f.key && !f.loadOnly && !isRoleGrid(f) && !/^(ID|New Balance)$/.test(f.label || ""));
      if (noKey.length) issues.push({ owner: "開發", id, what: `${noKey.length} 個欄位找不到送出參數(${noKey.map(filterName).join("、")})`, fix: "閱讀送出邏輯確認;若為只顯示欄位,標註「不送出」" });
      const ro = F.filter(f => f.loadOnly);
      if (type === "update" && ro.length >= 3) issues.push(liveOf(p) && liveOf(p).status === "一致"
        ? { owner: "產品", id, what: `編輯頁只有 Status 可修改,其餘 ${ro.length} 個欄位為灰色唯讀(${ro.map(filterName).join("、")})`, fix: "已寫入產品說明「實際可修改的欄位」", status: "已實機確認,已補全" }
        : { owner: "產品", id, what: `編輯頁有 ${ro.length} 個欄位只顯示、不會送出(${ro.map(filterName).join("、")})`, fix: "實機確認這些欄位是否為唯讀;產品說明需寫明「編輯頁實際可修改的欄位」" });
    }
    if (["add", "create", "update"].includes(type) && !allApi(p).some(a => a.method !== "GET")) issues.push({ owner: "開發", id, what: "表單頁找不到送出 API", fix: "確認送出端點" });
    if (!p.meta || !p.meta.action) if (!/login|not-authorized|^\/$|profile/.test(p.path)) issues.push({ owner: "項管", id, what: "路由沒有權限設定", fix: "確認是否刻意公開" });
  }
  const pg = r => pages.find(p => p.path === r);
  // 已知可疑
  const pat = pages.find(p => p.path === "/reports/player-account-transaction/view/:id()");
  if (pat && pat.meta && pat.meta.subject === "cashless-liability-report") issues.push(liveOf(pat) && liveOf(pat).status === "一致"
    ? { owner: "人工決定", id: PG[pat.path], what: "玩家帳戶交易報表的詳情頁,實機顯示的是「Player Cashless Liability」頁(與無現金負債報表詳情相同,權限也用 cashless-liability-report),判定為前端複製錯誤", fix: "決定是否回報後台團隊修正", status: "已實機確認,待決定" }
    : { owner: "產品", id: PG[pat.path], what: "玩家帳戶交易報表的詳情頁使用「無現金負債報表」的權限與 API(/report/cashless/player/list)", fix: "實機確認此頁實際顯示內容,是否為前端複製錯誤" });
  // 實機才看得到的缺陷
  if (LIVE) {
    const pal = LIVE.pages.find(x => x.path === "/reports/player-account-transaction/list");
    if (pal && (pal.liveGets || []).some(g => /\/undefined$/.test(g))) issues.push({ owner: "人工決定", id: PG[pal.path], what: "玩家帳戶交易報表列表一進頁面就呼叫 GET /report/player-account-transaction/undefined(尚未選玩家就帶 undefined 送出),屬前端缺陷", fix: "決定是否回報後台團隊修正", status: "已實機確認,待決定" });
    for (const x of LIVE.pages.filter(x => x.status === "無權限")) issues.push({ owner: "人工決定", id: PG[x.path], what: `目前登入帳號沒有 ${x.path} 的權限(${perm(pg(x.path))}),此頁只做了靜態盤點`, fix: "如需實機查驗,請提供有此權限的帳號", status: "待決定" });
    for (const x of LIVE.pages.filter(x => x.status === "略過")) issues.push({ owner: "測試", id: PG[x.path], what: `${x.path} 未能實機開啟:${x.reason}(dev 環境沒有資料)`, fix: "dev 有資料後重跑 node live.mjs --only-skipped", status: "環境限制" });
  }

  const dupRoutes = ["/reports/self-exclusion/list", "/responsible-gaming-report/self-exclusion/list", "/reports/betting-limit/list", "/responsible-gaming-report/betting-limit/list"].filter(pg);
  if (dupRoutes.length === 4) {
    if (MENU_TO) {
      const used = dupRoutes.filter(r => MENU_TO.has(pg(r).name));
      issues.push({ owner: "人工決定", id: "M16", what: `自我排除、投注限額報表各有兩個路由。實機選單只使用 ${used.join("、") || "(都沒有)"};${dupRoutes.filter(r => !used.includes(r)).join("、")} 不在選單(可直接輸入網址開啟)`, fix: "決定不在選單的頁面是否下架;自我排除報表不在此帳號選單,確認是否為權限設定或已停用", status: "已實機確認,待決定" });
    } else issues.push({ owner: "產品", id: "M16", what: "自我排除、投注限額報表各有兩個路由(/reports/... 與 /responsible-gaming-report/...),內容幾乎相同", fix: "實機確認選單實際使用哪一個,另一個是否為舊版" });
  }
  for (const r of ["/reports/revenue-old/list", "/reports/cashless-liability-old/list"]) if (pg(r)) {
    if (MENU_TO) issues.push({ owner: "人工決定", id: PG[r], what: `舊版報表 ${r} ${MENU_TO.has(pg(r).name) ? "仍在選單中(名稱前綴「Old-」)" : "不在選單"}`, fix: "決定是否保留舊版報表", status: "已實機確認,待決定" });
    else issues.push({ owner: "產品", id: PG[r], what: `舊版報表 ${r} 仍存在`, fix: "實機確認是否仍在選單中、與新版差異" });
  }
  if (pg("/second-page")) issues.push({ owner: MENU_TO ? "人工決定" : "項管", id: PG["/second-page"], what: "範本殘留頁 /second-page(權限 view:users)" + (MENU_TO && !MENU_TO.has("second-page") ? ",不在選單" : ""), fix: "決定是否請後台團隊移除", status: MENU_TO ? "已實機確認,待決定" : undefined });
  const navTitles = Object.keys(EN).filter(k => /^navigation\.(menu|submenu|subsubmenu)\./.test(k)).map(k => k);
  const used = new Set(pages.flatMap(allKeys));
  const navUnused = navTitles.filter(k => !used.has(k) && !MODS.some(m => m.nav === k));
  // 實機差異 → 退回清單
  if (LIVE) for (const l of LIVE.pages) {
    const p = pg(l.path); if (!p) continue; const id = PG[p.path];
    if (l.status === "錯誤") issues.push({ owner: "測試", id, what: `實機開啟失敗:${l.reason}`, fix: "重新查驗" });
    if (l.status !== "有差異") continue;
    if (l.missingFields.length) issues.push({ owner: "開發", id, what: `盤點有、畫面沒看到的欄位:${l.missingFields.join("、")}`, fix: "對照截圖:欄位可能需切換條件才出現(如勾選開關、選某種類型),或盤點名稱與畫面不同;更正 overrides 或註明顯示條件" });
    if (l.extraLabels.length) issues.push({ owner: "開發", id, what: `畫面有、盤點沒有的欄位/標籤:${l.extraLabels.join("、")}`, fix: "對照截圖補進欄位控制表(overrides)" });
    if (l.missingHeaders.length || l.extraHeaders.length) issues.push({ owner: "開發", id, what: `表格欄位不一致。畫面沒看到:${l.missingHeaders.join("、") || "無"};畫面多出:${l.extraHeaders.join("、") || "無"}`, fix: "對照截圖更正表格欄位" });
    if (l.apiErrors.length) issues.push({ owner: "產品", id, what: `頁面呼叫的 API 回錯誤:${l.apiErrors.join("、")}`, fix: "確認是權限不足、資料不存在,或後台缺陷" });
  }
  const LV = LIVE ? LIVE.pages : [];
  const cnt = s => LV.filter(x => x.status === s).length;
  let s = `# 04 盤點驗證報告(測試)\n\n> 驗證日期 ${LIVE ? LIVE.date : TODAY}。**A. 靜態一致性檢查**(已完成)、**B. 實機只讀查驗**(${LIVE ? "已完成" : "待執行"})。${LIVE ? "" : "在 B 完成前,本盤點**不能宣告 100% 正確**。"}\n\n`;
  if (LIVE) {
    const done = issues.filter(x => !x.status).length;
    s += `## 結論\n\n| 項目 | 結果 |\n|---|---|\n| 實機查驗頁數 | ${LV.length} 頁:✅ 一致 ${cnt("一致")}、⚠ 有差異 ${cnt("有差異")}、無權限 ${cnt("無權限")}、略過 ${cnt("略過")}、錯誤 ${cnt("錯誤")} |\n| 實機選單項目 | ${MENU_TO ? MENU_TO.size : 0} 個連結,已依此重排 01 模塊分類 |\n| 查驗期間攔截的寫入請求 | ${LIVE.blocked.length} 次${LIVE.blocked.length ? "(" + esc(LIVE.blocked.join("、")) + ")" : ""};後台資料未被修改 |\n| 待補全 | ${done} 項(見 A-1,依退回角色處理) |\n| 待人工決定 | ${issues.filter(x => /待決定/.test(x.status || "")).length} 項;環境限制 ${issues.filter(x => x.status === "環境限制").length} 項 |\n| 是否 100% 正確 | ${done === 0 && cnt("有差異") === 0 && cnt("錯誤") === 0
      ? `已查驗的 ${cnt("一致")} 頁 **100% 一致**、沒有待補全項目;但 ${cnt("略過")} 頁因 dev 環境沒有資料無法開啟、${cnt("無權限")} 頁因帳號權限不足,只有靜態盤點,所以**整體還不能宣告 100%**`
      : "❌ 尚未:仍有待補全或差異"} |\n\n`;
    s += `**查驗範圍限制**:只用一個登入帳號,選單與權限依該帳號角色;其他角色看到的範圍沒有驗證。只讀查驗不送出表單,所以後端驗證規則、送出後的行為沒有驗證。\n\n`;
  }
  s += `## A. 靜態一致性檢查結果\n\n| 檢查項目 | 結果 |\n|---|---|\n`;
  const unmapped = pages.filter(p => !moduleOf(p)).length;
  s += `| 每個路由都歸屬到模塊 | ${unmapped ? "❌ " + unmapped + " 個未歸屬" : "✅ " + pages.length + " / " + pages.length} |\n`;
  s += `| 每個模塊都有產品說明文件 | ✅ ${MODS.length} / ${MODS.length} |\n`;
  const formPages = pages.filter(p => ["add", "create", "update"].includes(pageType(p)));
  s += `| 每個新增/編輯頁都有欄位控制表 | ${formPages.every(p => allFields(p).length) ? "✅" : "❌"} ${formPages.filter(p => allFields(p).length).length} / ${formPages.length} |\n`;
  const listPages = pages.filter(p => pageType(p) === "list");
  s += `| 每個列表頁都有表格欄位定義 | ${listPages.filter(p => p.headers).length} / ${listPages.length}(缺的頁面為卡片式或自訂表格,需實機查驗) |\n`;
  s += `| 需修正/待確認項目 | ${issues.length} 項(見下表) |\n\n`;
  s += `## A-1. 缺漏與退回清單\n\n| # | 退回角色 | 頁面/模塊 | 問題 | 補全方式 | 狀態 |\n|---|---|---|---|---|---|\n`;
  issues.forEach((x, i) => s += `| ${i + 1} | ${x.owner} | ${x.id} | ${esc(x.what)} | ${esc(x.fix)} | ${x.status || "待補"} |\n`);
  s += `\n## A-2. 前端有定義但沒有頁面使用的選單名稱\n\n這些名稱可能是後端選單 \`/get_role_menu\` 使用的群組名稱,需實機比對:\n\n${navUnused.map(k => `- \`${k}\` = ${t(k)}`).join("\n")}\n\n`;
  if (!LIVE) {
    s += `## B. 實機查驗清單(待執行)\n\n執行方式:\`tools/inventory\` 內 \`node live.mjs\` → 人工在開出的 Chrome 視窗登入 → 自動只讀逐頁查驗 → \`node compare.cjs\` → 重新產生文件。\n`;
  } else {
    s += `## B. 實機只讀查驗結果\n\n執行:\`node live.mjs\`(人工登入;登入後所有送往 API 的寫入請求都被攔截)→ \`node compare.cjs\`。截圖存在本機 \`.playwright-output/live/\`(不進 git)。\n\n`;
    s += `| 頁面 | 路由 | 結果 | 說明 |\n|---|---|---|---|\n`;
    for (const l of LV) {
      const p = pg(l.path); if (!p) continue;
      const note = l.status === "有差異" ? [l.missingFields.length ? "畫面沒看到:" + l.missingFields.join("、") : "", l.extraLabels.length ? "畫面多出:" + l.extraLabels.join("、") : "", l.missingHeaders.length ? "表頭沒看到:" + l.missingHeaders.join("、") : "", l.apiErrors.length ? "API 錯誤:" + l.apiErrors.join("、") : ""].filter(Boolean).join(";") : (l.reason || (l.rows != null ? `列表 ${l.rows} 列` : ""));
      s += `| ${PG[p.path]} | \`${p.path.replace(":id()", ":id")}\` | ${l.status} | ${esc(note)} |\n`;
    }
    s += `\n`;
  }
  W("04-qa/verification-report.md", s);
  console.log("issues", issues.length);
}

/* ===================== README ===================== */
{
  let s = `# OKADA 後台功能盤點\n\n| 文件 | 負責角色 | 內容 |\n|---|---|---|\n| [01-pm-modules.md](01-pm-modules.md) | 項管 | 功能模塊分類、頁面、功能點清單 |\n`;
  for (const m of MODS) s += `| [02-product/${slug(m)}.md](02-product/${slug(m)}.md) | 產品 | ${m.id} ${m.name}:模塊內容、頁面流程圖、操作說明 |\n`;
  s += `| [03-dev/architecture.md](03-dev/architecture.md) | 開發 | 系統層面交互架構圖 |\n| [03-dev/api.md](03-dev/api.md) | 開發 | API 清單 |\n`;
  for (const m of MODS) s += `| [03-dev/fields/${slug(m)}.md](03-dev/fields/${slug(m)}.md) | 開發 | ${m.id} ${m.name}:欄位控制規格 |\n`;
  s += `| [04-qa/verification-report.md](04-qa/verification-report.md) | 測試 | 盤點驗證報告與缺漏退回清單 |\n\n${SRC_NOTE}\n\n重新產生:盤點工具在 \`tools/inventory/\`(見該資料夾 README)。\n`;
  W("README.md", s);
}
console.log("done", Object.keys(PG).length, "pages");
