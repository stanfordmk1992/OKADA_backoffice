// 比對實機查驗結果(live/pages.json)與靜態盤點(pages.json),輸出 live/compare.json
const fs = require("fs");
const EN = require("./i18n-en.json");
const stat = require("./pages.json");
const live = JSON.parse(fs.readFileSync("live/pages.json", "utf8"));
const norm = s => String(s || "").replace(/\*/g, "").replace(/\s+/g, " ").trim().toLowerCase();
const OVR = require("./overrides.cjs");

const out = [];
for (const L of live) {
  const S = stat.find(p => p.path === L.path);
  if (!S) continue;
  const rec = { path: L.path, visited: L.visited || null };
  if (L.skipped) { out.push({ ...rec, status: "略過", reason: L.skipped }); continue; }
  if (L.error) { out.push({ ...rec, status: "錯誤", reason: L.error }); continue; }
  if (L.notAuthorized) { out.push({ ...rec, status: "無權限", reason: "目前登入帳號沒有此頁權限" }); continue; }
  const F = [...S.fields, ...S.subs.flatMap(s => s.fields)];
  const liveText = new Set([...L.labels, ...L.placeholders, ...L.switches, ...L.title, ...L.buttons].map(norm));
  const liveAll = [...liveText].join(" | ");
  const pageOvr = OVR.find(o => o.path === S.path && o.page) || {};
  const conds = [];
  const fieldNames = F.map(f => {
    const o = OVR.find(o => !o.page && o.path === S.path && [f.label, f.placeholder, f.key, f.comp, f.model].filter(Boolean).some(h => o.match instanceof RegExp ? o.match.test(h) : String(h).includes(o.match)));
    const name = (o && o.label) || f.label || f.placeholder;
    if (o && o.cond) { conds.push(name + "(" + o.cond + ")"); return null; } // 有顯示條件的欄位,預設畫面看不到是正常的
    return o && o.liveMatch ? o.liveMatch : name;
  }).filter(Boolean).filter(n => !/items per page|per_page/i.test(n));
  const missingFields = fieldNames.filter(n => {
    const alts = n.split(" / ");
    return !alts.some(a => a.split(" ~ ").map(norm).every(p => liveText.has(p) || liveAll.includes(p)));
  });
  const staticHeaders = (S.headers || []).map(h => norm(h.title));
  const liveHeaders = L.headers.map(norm).filter(Boolean);
  const pageOvr0 = OVR.find(o => o.path === S.path && o.page) || {};
  const missingHeaders = pageOvr0.tabHeaders ? [] : staticHeaders.filter(h => h && !liveHeaders.includes(h));
  const extraHeaders = liveHeaders.filter(h => !staticHeaders.includes(h));
  const liveLabels = [...new Set([...L.labels, ...L.switches].map(x => x.replace(/\*/g, "").trim()).filter(Boolean))];
  const allNames = F.map(f => f.label || f.placeholder).concat(OVR.filter(o => o.path === S.path).flatMap(o => [o.label, o.liveMatch]));
  const known = new Set(allNames.filter(Boolean).flatMap(n => n.split(/ ~ | \/ /)).map(norm));
  if (F.some(f => f.comp === "DateRangePicker")) ["start date", "end date"].forEach(k => known.add(k));
  const STATE = /^(active|inactive|yes|no|on|off|enabled|disabled)$/i;
  const META = /^(id|created at|created by|updated at|updated by|.* id)$/i; // 唯讀的系統欄位
  const ignore = new Set((pageOvr.ignoreExtra || []).map(norm));
  const isView = /\/view\/:id\(\)$/.test(S.path);
  const rawExtra = liveLabels.filter(x => !known.has(norm(x)) && !STATE.test(x) && !ignore.has(norm(x)) && !/items per page|rows per page/i.test(x));
  // 詳情頁的標籤都是唯讀顯示欄位:靜態抓不到,以實機為準補進盤點,不算差異
  const displayFields = isView ? rawExtra : rawExtra.filter(x => META.test(x));
  const extraLabels = isView ? [] : rawExtra.filter(x => !META.test(x));
  const staticGets = new Set([...S.api, ...S.subs.flatMap(s => s.api)].filter(a => a.method === "GET").map(a => a.url.replace(/:id/g, "*")));
  const liveGets = [...new Set(L.api.filter(a => a.method === "GET").map(a => a.ep.replace(/\/\d+(?=\/|$)/g, "/*")))];
  const apiErrors = L.api.filter(a => a.status >= 400).map(a => `${a.method} ${a.ep} → ${a.status}`);
  const options = L.api.filter(a => a.options && a.options.length).map(a => ({ ep: a.ep, options: a.options.filter(Boolean) }));
  const ok = !missingFields.length && !missingHeaders.length && !apiErrors.length;
  const headersFromLive = !staticHeaders.length && L.headers.length ? L.headers.filter(Boolean) : null; // 靜態抓不到(表頭寫在頁面內)時以實機為準
  const ok2 = ok && !extraLabels.length && !(staticHeaders.length && extraHeaders.length && !pageOvr.headersFromLive);
  const liveHeaderList = pageOvr.headersFromLive || headersFromLive ? L.headers.filter(Boolean) : null;
  out.push({ ...rec, status: ok2 ? "一致" : "有差異", title: L.title[0] || "", missingFields, missingHeaders, extraHeaders: staticHeaders.length && !pageOvr.headersFromLive ? extraHeaders : [], headersFromLive: liveHeaderList, tabs: L.tabs, conds, extraLabels, displayFields, pageNote: pageOvr.note || null, liveGets, staticGets: [...staticGets], apiErrors, options, rows: L.rows, shot: L.shot });
}
// 選單
let menu = [];
try { menu = JSON.parse(fs.readFileSync("live/menu.json", "utf8")); } catch {}
const flat = (items, parent = "") => items.flatMap(i => [{ title: i.title, href: i.href, parent, depth: i.depth }, ...flat(i.children || [], i.title)]);
const menuFlat = flat(menu);
const navEN = new Set(Object.entries(EN).filter(([k]) => /^navigation\./.test(k)).map(([, v]) => norm(v)));
const menuUnknown = menuFlat.filter(m => !navEN.has(norm(m.title)));
const menuHrefs = menuFlat.filter(m => m.href).map(m => m.href);
const routesInMenu = new Set(menuHrefs.map(h => h.split("?")[0]));
let blocked = [];
try { blocked = JSON.parse(fs.readFileSync("live/blocked.json", "utf8")); } catch {}
fs.writeFileSync("live/compare.json", JSON.stringify({ date: new Date().toISOString().slice(0, 10), pages: out, menu: menuFlat, menuUnknown, routesInMenu: [...routesInMenu], blocked }, null, 1));
const c = s => out.filter(o => o.status === s).length;
console.log("一致", c("一致"), "有差異", c("有差異"), "無權限", c("無權限"), "略過", c("略過"), "錯誤", c("錯誤"), "選單", menuFlat.length, "攔截", blocked.length);
