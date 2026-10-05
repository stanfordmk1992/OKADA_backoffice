// 實機只讀查驗:人工登入後,逐頁讀取選單、標題、欄位、表格、按鈕並截圖
// 安全:登入完成後攔截所有送往 API 的非 GET 請求(POST/PUT/PATCH/DELETE),後台資料不會被修改
import fs from "node:fs";
import { chromium } from "playwright-core";

const SITE = "https://okada-dev-bo-2.scms2u.lol";
const API_HOST = "okada-dev-api-2.scms2u.lol";
const PROFILE = "C:\\Users\\Stanf\\.okada-playwright-profile";
const SHOTS = "../../.playwright-output/live";
const OUT = "live";
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => { const s = `[${new Date().toLocaleTimeString()}] ` + a.join(" "); console.log(s); fs.appendFileSync(OUT + "/progress.log", s + "\n"); };
fs.writeFileSync(OUT + "/progress.log", "");

const routes = JSON.parse(fs.readFileSync("routes.json", "utf8")).filter(r => !r.path.endsWith("/tableHeaders"));
const SKIP = new Set(["/login", "/login-pagcor", "/not-authorized"]);
// 下拉選項類端點:可以記錄選項名稱(設定資料,不含玩家資料)
const OPTION_EP = /(setting\/|_dropdown|_types?$|_type$|lookup\/wallet|_list$|_category|game_providers|maintenance_(type|status|target)|get_language|advertisement_(page|position)_list|announcement_categories|roles-look-up|referral_payout|deposit_option|payout\/option|menus|menu_permissions|game_offerings$|freespin\/games)/;
const PII_EP = /(players|player\/|report|wallet_adjustment|wallets\/|audits|opt_in|payout$|freespin\/list|freespin\/report|downloads|users)/;

const ctx = await chromium.launchPersistentContext(PROFILE, { channel: "chrome", headless: false, viewport: { width: 1440, height: 900 } });
const page = ctx.pages()[0] || await ctx.newPage();
let loggedIn = false, blocked = [];
await ctx.route(url => url.hostname === API_HOST, route => {
  const req = route.request(), m = req.method();
  if (m === "GET" || m === "HEAD" || m === "OPTIONS") return route.continue();
  if (!loggedIn && /\/login$/.test(new URL(req.url()).pathname)) return route.continue(); // 只允許人工登入
  blocked.push(m + " " + new URL(req.url()).pathname);
  log("已攔截寫入請求", m, new URL(req.url()).pathname);
  return route.abort();
});

// 收集 API 回應
let calls = [];
page.on("response", async res => {
  try {
    const u = new URL(res.url());
    if (u.hostname !== API_HOST) return;
    const ep = u.pathname.replace(/^\/backoffice/, "");
    const rec = { method: res.request().method(), ep, status: res.status() };
    if (res.request().method() === "GET" && res.status() === 200 && /json/.test(res.headers()["content-type"] || "")) {
      const j = await res.json();
      const data = j?.data?.data ?? j?.data;
      if (Array.isArray(data)) {
        rec.count = data.length;
        rec.keys = data[0] && typeof data[0] === "object" ? Object.keys(data[0]) : [];
        rec.firstId = data[0] && typeof data[0] === "object" ? data[0][Object.keys(data[0])[0]] ?? null : null; // 第一個欄位通常是自身 id
        if (OPTION_EP.test(ep) && !PII_EP.test(ep)) rec.options = data.slice(0, 60).map(o => typeof o === "object" ? (Object.entries(o).find(([k, v]) => typeof v === "string" && /name|title|label|code/.test(k)) || [])[1] ?? null : o);
      } else if (data && typeof data === "object") rec.keys = Object.keys(data);
      if (ep === "/get_role_menu") fs.writeFileSync(OUT + "/role_menu.json", JSON.stringify(j, null, 1));
    }
    calls.push(rec);
  } catch {}
});

// 1. 等人工登入
log("開啟後台,請在這個 Chrome 視窗登入(最多等 15 分鐘)");
await page.goto(SITE + "/", { waitUntil: "domcontentloaded" }).catch(() => {});
const t0 = Date.now();
while (Date.now() - t0 < 15 * 60 * 1000) {
  const cookies = await ctx.cookies(SITE);
  const tok = cookies.find(c => /_accessToken$/.test(c.name) && c.value && c.value !== "null");
  if (tok && !/\/login/.test(page.url())) { loggedIn = true; break; }
  await page.waitForTimeout(2000);
}
if (!loggedIn) { log("逾時:沒有偵測到登入"); await ctx.close(); process.exit(2); }
log("已登入,開始只讀查驗;此後所有寫入請求都會被攔截");
await page.waitForTimeout(3000);

// 2. 讀取側欄選單(展開所有群組)
async function readMenu() {
  for (let i = 0; i < 4; i++) {
    const groups = await page.$$(".nav-group:not(.open) > .nav-group-label, .nav-group:not(.open) > a");
    if (!groups.length) break;
    for (const g of groups) { await g.click({ timeout: 1000 }).catch(() => {}); await page.waitForTimeout(150); }
  }
  return page.evaluate(() => {
    const walk = (ul, depth) => [...ul.children].map(li => {
      const title = (li.querySelector(":scope > a .nav-item-title, :scope > .nav-group-label .nav-item-title, :scope > a, :scope > .nav-group-label")?.textContent || "").trim();
      const href = li.querySelector(":scope > a")?.getAttribute("href") || null;
      const sub = li.querySelector(":scope > ul");
      return { title, href, depth, children: sub ? walk(sub, depth + 1) : [] };
    }).filter(x => x.title);
    const root = document.querySelector(".layout-vertical-nav .nav-items, .nav-items");
    return root ? walk(root, 0) : [];
  });
}
if (!process.argv.includes("--only-skipped")) {
  const menu = await readMenu();
  fs.writeFileSync(OUT + "/menu.json", JSON.stringify(menu, null, 1));
  log("選單項目", JSON.stringify(menu).match(/"title"/g)?.length || 0);
}

// 3. 逐頁查驗
const read = () => page.evaluate(() => {
  const txt = el => (el?.textContent || "").replace(/\s+/g, " ").trim();
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const main = document.querySelector(".layout-page-content, main") || document.body;
  return {
    url: location.pathname,
    title: [...main.querySelectorAll("h1,h2,h3,h4,h5,.v-card-title")].filter(vis).map(txt).filter(Boolean).slice(0, 8),
    labels: [...main.querySelectorAll(".v-input .v-label, .v-field-label, label")].filter(vis).map(txt).filter(Boolean),
    placeholders: [...main.querySelectorAll("input[placeholder], textarea[placeholder]")].filter(vis).map(e => e.getAttribute("placeholder")).filter(Boolean),
    headers: [...main.querySelectorAll("thead th")].filter(vis).map(txt),
    buttons: [...main.querySelectorAll("button, .v-btn, a.v-btn")].filter(vis).map(txt).filter(Boolean),
    tabs: [...main.querySelectorAll(".v-tab")].filter(vis).map(txt),
    switches: [...main.querySelectorAll(".v-switch .v-label, .v-checkbox .v-label")].filter(vis).map(txt),
    notAuthorized: /not-authorized/.test(location.pathname),
    rows: main.querySelectorAll("tbody tr").length,
  };
});
// --only-skipped:只重跑上次略過的詳情/編輯頁(連同其列表頁以取得 id)
const ONLY_SKIPPED = process.argv.includes("--only-skipped");
let results = [];
let todo = routes;
if (ONLY_SKIPPED) {
  results = JSON.parse(fs.readFileSync(OUT + "/pages.json", "utf8"));
  const sk = new Set([...results.filter(x => x.skipped).map(x => x.path), ...routes.filter(r => !SKIP.has(r.path) && !results.some(x => x.path === r.path)).map(r => r.path)]);
  const bases = new Set([...sk].map(p => p.replace(/\/(view|update)\/:id\(\)$/, "") + "/list"));
  todo = routes.filter(r => sk.has(r.path) || bases.has(r.path));
  results = results.filter(x => !todo.some(r => r.path === x.path));
  log("只重跑略過的頁面", todo.length, "頁");
}
const firstIds = {}; // 列表頁抓到的第一筆 id,用於詳情/編輯頁
const ordered = [...todo].sort((a, b) => (a.path.includes(":id") ? 1 : 0) - (b.path.includes(":id") ? 1 : 0));
for (const r of ordered) {
  if (SKIP.has(r.path)) continue;
  let path = r.path;
  if (path.includes(":id")) {
    const base = path.replace(/\/(view|update)\/:id\(\)$/, "");
    const id = firstIds[base];
    if (id == null) { results.push({ path: r.path, skipped: "列表沒有資料可取得 id" }); log("略過", r.path, "(沒有 id)"); continue; }
    path = path.replace(":id()", encodeURIComponent(id));
  }
  calls = [];
  try {
    await page.goto(SITE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const d = await read();
    const shot = SHOTS + "/" + (r.path.replace(/[/:()]+/g, "_").replace(/^_|_$/g, "") || "home") + ".png";
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    const withData = calls.filter(c => c.method === "GET" && c.count > 0 && c.firstId != null);
    // 有表格:只認筆數等於表格列數的回應;沒有表格(卡片式):退而用第一個有資料的回應
    const listCall = d.headers.length ? withData.find(c => c.count === d.rows) : (withData.find(c => !OPTION_EP.test(c.ep)) || withData[0]); // 卡片式列表(如依語系,沒有表格)才退而用第一個有資料的回應
    if (/\/list$/.test(r.path) && listCall) firstIds[r.path.replace(/\/list$/, "")] = listCall.firstId;
    results.push({ path: r.path, visited: path, ...d, api: calls.map(c => ({ method: c.method, ep: c.ep, status: c.status, count: c.count, keys: c.keys, options: c.options })), shot });
    log("完成", r.path, d.notAuthorized ? "(無權限)" : "", `欄位 ${d.labels.length} 表頭 ${d.headers.length}`);
  } catch (e) {
    results.push({ path: r.path, error: String(e.message || e).slice(0, 200) });
    log("錯誤", r.path, String(e.message || e).slice(0, 120));
  }
  fs.writeFileSync(OUT + "/pages.json", JSON.stringify(results, null, 1));
}
fs.writeFileSync(OUT + "/pages.json", JSON.stringify(results, null, 1));
let prevBlocked = [];
if (ONLY_SKIPPED) try { prevBlocked = JSON.parse(fs.readFileSync(OUT + "/blocked.json", "utf8")); } catch {}
blocked = [...prevBlocked, ...blocked];
fs.writeFileSync(OUT + "/blocked.json", JSON.stringify(blocked, null, 1));
log("全部完成", results.length, "頁;攔截寫入請求", blocked.length, "次");
await ctx.close();
