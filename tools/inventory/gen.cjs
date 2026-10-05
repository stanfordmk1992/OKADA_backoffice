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
  const o = OVR.find(o => o.path === p.path && hay.some(h => o.match instanceof RegExp ? o.match.test(h) : String(h).includes(o.match)));
  if (!o) return f;
  return { ...f, label: o.label || f.label, labelFrom: o.label ? "人工" : f.labelFrom, key: o.key || f.key, note: o.note || null, manual: true };
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
const W = (rel, s) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s.replace(/\n{3,}/g, "\n\n")); };
const slug = m => `${m.id}-${m.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;
const SRC_NOTE = `> 資料來源:後台前端程式(版本 ${SRC_VER})靜態分析,${TODAY}。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。`;

/* ===================== 01 項管:模塊與功能點 ===================== */
{
  let s = `# 01 功能模塊與功能點清單(項管)\n\n${SRC_NOTE}\n\n`;
  const total = pages.length, fpN = Object.values(FPS).reduce((n, a) => n + a.length, 0);
  s += `## 總覽\n\n| 模塊 | 名稱 | 前端選單(英文) | 頁面數 | 功能點數 |\n|---|---|---|---|---|\n`;
  for (const m of MODS) { const ps = byMod[m.id] || []; s += `| ${m.id} | ${m.name} | ${m.nav ? esc(t(m.nav)) : "—"} | ${ps.length} | ${ps.reduce((n, p) => n + FPS[p.path].length, 0)} |\n`; }
  s += `| **合計** | | | **${total}** | **${fpN}** |\n\n`;
  s += `- 分類依據:路由前綴 + 前端選單定義(\`navigation.*\`)。**實際側欄選單由後端 \`/get_role_menu\` 依角色回傳**,登入後需比對(見 04 測試報告)。\n- 權限欄為前端路由守衛的 CASL 規則 \`action:subject\`,沒有權限的使用者會被導向 \`/not-authorized\`。\n\n`;
  for (const m of MODS) {
    const ps = byMod[m.id] || [];
    s += `## ${m.id} ${m.name}(${m.en})\n\n${m.purpose}\n\n| 頁面 | 頁面名稱 | 類型 | 路由 | 權限 | 功能點 |\n|---|---|---|---|---|---|\n`;
    for (const p of ps) s += `| ${PG[p.path]} | ${esc(pageTitle(p))} | ${TYPE[pageType(p)] || "頁面"} | \`${p.path.replace(":id()", ":id")}\` | \`${perm(p)}\` | ${FPS[p.path].map(f => `${f.id} ${f.name}`).join("<br>")} |\n`;
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
    if (p.headers) s += `- 表格欄位:${p.headers.map(h => esc(h.title)).join("、")}\n`;
    if (F.length) s += `- ${["list", "reports"].includes(type) ? "篩選條件" : "表單欄位"}:${F.map(f => esc(filterName(f))).filter(Boolean).join("、")}(欄位規則見 03 開發欄位控制)\n`;
    const roF = F.filter(f => f.loadOnly || /^—/.test(f.key || ""));
    if (type === "update" && roF.length >= 3) s += `- ⚠ **實際可修改的欄位**:${F.filter(f => f.key && !/^—/.test(f.key)).map(f => esc(filterName(f))).join("、") || "無"};其餘 ${roF.length} 個欄位只顯示、不會送出(${roF.map(f => esc(filterName(f))).join("、")})\n`;
    if (msgs.length) s += `- 系統提示:${msgs.slice(0, 12).map(x => "「" + esc(x) + "」").join("、")}\n`;
    s += `- 實機狀態:待實機查驗\n\n`;
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
        s += `| ${i + 1} | ${esc(filterName(f))}${f.labelFrom === "相鄰文字" ? "ⁱ" : ""} | ${esc(f.comp)} | ${esc(sendKey)} | ${req} | ${esc(f.rules.join(";"))} | ${esc(opt)} | ${esc([f.note ? "說明:" + f.note : "", f.flags.join(" ")].filter(Boolean).join(" "))} | ${esc(f.manual ? "人工補全" : f.from)} |\n`;
      });
      s += `\n`;
    }
    if (p.headers) {
      s += `**表格欄位**\n\n| # | 欄位標題 | 資料 key | 可排序 |\n|---|---|---|---|\n`;
      p.headers.forEach((h, i) => s += `| ${i + 1} | ${esc(h.title)} | \`${h.key}\` | ${h.sortable ? "是" : "否"} |\n`);
      s += `\n`;
    }
    if (A.length) s += `**API**:${A.map(a => `\`${a.method} ${a.url}\``).join("、")}\n\n`;
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
      if (type === "update" && ro.length >= 3) issues.push({ owner: "產品", id, what: `編輯頁有 ${ro.length} 個欄位只顯示、不會送出(${ro.map(filterName).join("、")})`, fix: "實機確認這些欄位是否為唯讀;產品說明需寫明「編輯頁實際可修改的欄位」" });
    }
    if (["add", "create", "update"].includes(type) && !allApi(p).some(a => a.method !== "GET")) issues.push({ owner: "開發", id, what: "表單頁找不到送出 API", fix: "確認送出端點" });
    if (!p.meta || !p.meta.action) if (!/login|not-authorized|^\/$|profile/.test(p.path)) issues.push({ owner: "項管", id, what: "路由沒有權限設定", fix: "確認是否刻意公開" });
  }
  // 已知可疑
  const pat = pages.find(p => p.path === "/reports/player-account-transaction/view/:id()");
  if (pat && pat.meta && pat.meta.subject === "cashless-liability-report") issues.push({ owner: "產品", id: PG[pat.path], what: "玩家帳戶交易報表的詳情頁使用「無現金負債報表」的權限與 API(/report/cashless/player/list)", fix: "實機確認此頁實際顯示內容,是否為前端複製錯誤" });
  const dupRoutes = ["/reports/self-exclusion/list", "/responsible-gaming-report/self-exclusion/list", "/reports/betting-limit/list", "/responsible-gaming-report/betting-limit/list"].filter(r => pages.find(p => p.path === r));
  if (dupRoutes.length === 4) issues.push({ owner: "產品", id: "M12", what: "自我排除、投注限額報表各有兩個路由(/reports/... 與 /responsible-gaming-report/...),內容幾乎相同", fix: "實機確認選單實際使用哪一個,另一個是否為舊版" });
  for (const r of ["/reports/revenue-old/list", "/reports/cashless-liability-old/list"]) if (pages.find(p => p.path === r)) issues.push({ owner: "產品", id: PG[r], what: `舊版報表 ${r} 仍存在`, fix: "實機確認是否仍在選單中、與新版差異" });
  for (const r of ["/second-page"]) if (pages.find(p => p.path === r)) issues.push({ owner: "項管", id: PG[r], what: "範本殘留頁 /second-page(權限 view:users)", fix: "確認是否應移除" });
  const navTitles = Object.keys(EN).filter(k => /^navigation\.(menu|submenu|subsubmenu)\./.test(k)).map(k => k);
  const used = new Set(pages.flatMap(allKeys));
  const navUnused = navTitles.filter(k => !used.has(k) && !MODS.some(m => m.nav === k));
  let s = `# 04 盤點驗證報告(測試)\n\n> 驗證日期 ${TODAY}。本報告分兩階段:**A. 靜態一致性檢查**(已完成)、**B. 實機查驗**(需人工登入後執行)。在 B 完成前,本盤點**不能宣告 100% 正確**。\n\n`;
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
  issues.forEach((x, i) => s += `| ${i + 1} | ${x.owner} | ${x.id} | ${esc(x.what)} | ${esc(x.fix)} | 待補 |\n`);
  s += `\n## A-2. 前端有定義但沒有頁面使用的選單名稱\n\n這些名稱可能是後端選單 \`/get_role_menu\` 使用的群組名稱,需實機比對:\n\n${navUnused.map(k => `- \`${k}\` = ${t(k)}`).join("\n")}\n\n`;
  s += `## B. 實機查驗清單(待執行)\n\n執行方式:人工在 Playwright 開出的 Chrome 視窗登入後台 → 測試依下表**只讀**逐頁查驗(不送出任何表單)。\n\n| 檢查 | 方法 | 狀態 |\n|---|---|---|\n`;
  s += `| 側欄選單與 01 模塊分類一致 | 展開所有選單,逐項比對名稱與層級 | 待執行 |\n| 每個頁面可開啟且標題正確 | 依 01 路由逐頁開啟 | 待執行 |\n| 篩選條件、表格欄位與 03 一致 | 逐頁比對畫面 | 待執行 |\n| 新增/編輯表單欄位、必填標示、選項內容與 03 一致 | 開啟表單只看不送 | 待執行 |\n| 開關/勾選欄位標籤補齊 | 讀取畫面文字 | 待執行 |\n| 下拉選項的實際值(API 動態載入的選項) | 展開下拉選單 | 待執行 |\n| 依角色的權限差異 | 需要不同角色帳號,目前只有一個登入帳號 | 待決定 |\n`;
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
