// 靜態分析每個頁面 chunk:欄位、驗證規則、送出欄位、表格欄位、API、文字
const fs = require("fs");
const EN = require("./i18n-en.json");
const ZH = require("./i18n-zh.json");
const routes = require("./routes.json");
const read = f => { try { return fs.readFileSync("all/" + f, "utf8"); } catch { return ""; } };

const VALIDATORS = { r: "必填", e: "Email 格式", p: "密碼強度(≥8 碼,含大小寫、數字、特殊字元)", c: "與密碼相同", u: "URL 格式(http/https)", i: "圖片(jpeg/png/webp,≤5MB,必填)" };

function imports(src) {
  const map = {}; // local -> {file, name}
  for (const m of src.matchAll(/import\{([^}]*)\}from"\.\/([^"]+)"/g))
    for (const p of m[1].split(",")) { const [a, b] = p.split(" as ").map(x => x.trim()); map[b || a] = { file: m[2], name: a }; }
  return map;
}
function exportsOf(src) {
  const m = /export\{([^}]*)\}/.exec(src); const map = {};
  if (m) for (const p of m[1].split(",")) { const [a, b] = p.split(" as ").map(x => x.trim()); map[b || a] = a; }
  return map; // exported -> local
}
function balanced(src, start) { // start at '{' or '['
  const open = src[start], close = open === "{" ? "}" : open === "[" ? "]" : ")";
  let d = 0, q = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (q) { if (ch === "\\") { i++; continue; } if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { q = ch; continue; }
    if (ch === "{" || ch === "[" || ch === "(") d++;
    else if (ch === "}" || ch === "]" || ch === ")") { d--; if (d === 0) return src.slice(start, i + 1); }
  }
  return src.slice(start, start + 2000);
}
const t = k => EN[k] ?? null;

// 元件名稱(依 chunk 內的 name / __name)
const compNameCache = {};
function compName(file) {
  if (file in compNameCache) return compNameCache[file];
  const s = read(file);
  const n = (/name:"(V[A-Z][A-Za-z]+)"/.exec(s) || /__name:"([A-Za-z]+)"/.exec(s) || [])[1] || null;
  return (compNameCache[file] = n);
}
// API 模組:匯出名 -> {method, url}
const apiCache = {};
function apiOf(file) {
  if (apiCache[file]) return apiCache[file];
  const s = read(file); const ex = exportsOf(s); const out = {};
  const fns = {};
  for (const m of s.matchAll(/(?:^|[,;{ ])([\w$]+)=async(?:\s*\(?[\w$,\s]*\)?)=>\{/g)) {
    const body = balanced(s, m.index + m[0].length - 1);
    const call = /[\w$]+\((`\/[^`]*`|`\$\{[^`]*`|"\/[^"]*")(,\{[^]*?\})?\)/.exec(body);
    if (!call) continue;
    const tern = /method:[\w$]+\?"([a-zA-Z]+)":"([a-zA-Z]+)"/.exec(body);
    const method = tern ? tern[2].toUpperCase() : (/method:"([a-zA-Z]+)"/.exec(body) || [, "get"])[1].toUpperCase();
    fns[m[1]] = { method, url: call[1].replace(/^["`]|["`]$/g, "").replace(/\$\{[^}]+\}/g, ":id") };
  }
  for (const [e, l] of Object.entries(ex)) if (fns[l]) out[e] = fns[l];
  return (apiCache[file] = out);
}

function analyze(src, label) {
  const imp = imports(src);
  // ref 變數 -> 送出欄位 key
  const payload = {};
  for (const m of src.matchAll(/\.append\("([\w.\[\]]+)",(?:JSON\.stringify\()?([\w$]+)\.value/g)) payload[m[2]] = m[1];
  for (const m of src.matchAll(/([\w]+):([\w$]+)\.value(?=[,}])/g)) if (!payload[m[2]]) payload[m[2]] = m[1];
  // body.member_ids=c.value.map(...) / i.deposit_service_fee=y.value
  for (const m of src.matchAll(/[\w$]+\.([a-z][a-z0-9_]+)=([\w$]+)\.value/g)) if (!payload[m[2]] && m[1] !== "value") payload[m[2]] = m[1];
  // 載入對應:X.value=u.bonus_name / X.value=((l=u.payout_frequency)==null?void 0:l.frequency_code)
  const loaded = {};
  for (const m of src.matchAll(/([\w$]+)\.value=([^;]{0,120}?)(?=,[\w$]+\.value=|;|\}|$)/g)) {
    const acc = /\b[a-z]\.([a-z][a-z0-9_]*)(?:\)==null\?void 0:[a-z]\.([a-z][a-z0-9_]*))?/.exec(m[2]);
    if (acc && !loaded[m[1]]) loaded[m[1]] = acc[2] ? acc[1] + "." + acc[2] : acc[1];
  }
  // JSON body:{member_id:p.value.map(...)}、{status:T.value?1:0}、{x:Number(y.value)}
  const SKIP = /^(modelValue|value|items|label|title|key|class|style|color|loading|disabled|readonly|type)$/;
  for (const m of src.matchAll(/[{,]"?([a-z][a-z0-9_]*)"?:(?:[\w$.]+\()?([\w$]+)\.value(?!\))?/g)) if (!SKIP.test(m[1]) && !payload[m[2]] && /_/.test(m[1] + "_")) payload[m[2]] = m[1];
  // 物件型 form:modelValue:s(form).field
  const fields = [];
  let pos = 0; const seenObj = new Set();
  // computed get/set 包裝:Y=g({get:()=>S(C.value),set:...}) -> Y 對應 C
  const alias = {};
  for (const m of src.matchAll(/([\w$]+)=[\w$]+\(\{get:\(\)=>[^]{0,40}?([\w$]+)\.value/g)) alias[m[1]] = m[2];
  const TRIG = /modelValue:|"model-value":|"start-date":|accept:"/g;
  let tm;
  while ((tm = TRIG.exec(src))) {
    pos = tm.index;
    let d = 0, idx = pos;
    for (; idx > 0; idx--) { const ch = src[idx]; if (ch === "}") d++; else if (ch === "{") { if (d === 0) break; d--; } }
    if (seenObj.has(idx)) continue; seenObj.add(idx);
    if (src[idx - 1] === "(" ) {}
    const obj = balanced(src, idx);
    const before = src.slice(Math.max(0, idx - 40), idx);
    const cm = /([\w$]+),\s*$/.exec(before);
    let comp = null;
    if (cm) { let id = cm[1]; let im = imp[id];
      if (!im) { const ms = [...src.slice(0, idx).matchAll(new RegExp("[,{ ;]" + id.replace(/\$/g, "\\$") + "=([\\w$]+)[,;]", "g"))]; const last = ms[ms.length - 1]; if (last) im = imp[last[1]]; }
      comp = im ? compName(im.file) : id; }
    const mv = /(?:modelValue|"model-value"):([^,}]+)/.exec(obj);
    let model = mv ? mv[1] : "";
    let key = null;
    const keyOf = m => { const v = /^[\w$]+\(([\w$]+)\)(?:\.([\w.]+))?/.exec(m) || /([\w$]+)\.value(?:\.([\w.]+))?/.exec(m); if (!v) return null; const base = alias[v[1]] || v[1]; if (v[2]) return v[2]; if (payload[base]) return payload[base]; if (loaded[base]) { loadOnly = loaded[base]; } return null; };
    let loadOnly = null;
    if (model) key = keyOf(model);
    const sd = /"start-date":([^,}]+)/.exec(obj), ed = /"end-date":([^,}]+)/.exec(obj);
    if (sd) { model = "dateRange"; key = [keyOf(sd[1]), ed && keyOf(ed[1])].filter(Boolean).join(" ~ ") || null; }
    if (!model && /accept:"/.test(obj)) { // 檔案上傳:由 onUpdate:modelValue / onChange 處理函式找到 ref
      const h = /"on(?:Update:modelValue|Change)":(?:[\w$]+\[\d+\]\|\|\([\w$]+\[\d+\]=)?([\w$]+)/.exec(obj);
      model = "file";
      if (h) { const def = new RegExp("[,;{ ]" + h[1].replace(/\$/g, "\\$") + "=[\\w$]+=>\\{(?:[^{}]{0,80}?)([\\w$]+)\\.value=").exec(src); if (def) key = payload[def[1]] || null; }
    }
    const pick = name => {
      const lit = new RegExp('(?:^|[,{])"?' + name + '"?:"([^"]*)"').exec(obj);
      if (lit) return /^(features|common|navigation|validation)\./.test(lit[1]) ? (t(lit[1]) ?? lit[1]) : lit[1];
      const i18 = new RegExp('(?:^|[,{])"?' + name + '"?:[\\w$.]+(?:\\([\\w$]*\\))?\\("([\\w.]+)"').exec(obj);
      if (i18) return t(i18[1]) ?? i18[1];
      return null;
    };
    const rulesM = /rules:(\[[^]*?\]|[\w$]+\([\w$]+\)|[\w$]+)(?=[,}])/.exec(obj);
    let rules = [];
    if (rulesM) {
      let txt = rulesM[1];
      const ref = /^[\w$]+\(([\w$]+)\)$/.exec(txt) || /^([\w$]+)$/.exec(txt);
      if (ref) {
        const id = ref[1].replace(/\$/g, "\\$");
        const d = new RegExp("[,;{ ]" + id + "=[\\w$]+\\(\\(\\)=>").exec(src) || new RegExp("[,;{ ]" + id + "=(?=\\[)").exec(src);
        if (d) txt = balanced(src, d.index + d[0].length);
      }
      for (const v of txt.matchAll(/(?:^|[\[,(])\s*(?:[sf]\()?([\w$]+)\)?(?=[,\]])/g)) { const im = imp[v[1]]; if (im && im.file === "kmRJa_lM.js") rules.push(VALIDATORS[im.name] || im.name); }
      for (const v of txt.matchAll(/"([^"]{6,140})"/g)) if (!/^[\w.]+$/.test(v[1])) rules.push("自訂:" + v[1]);
      for (const v of txt.matchAll(/\("((?:validation|features|common)\.[\w.]+)"/g)) rules.push("自訂:" + (t(v[1]) || v[1]));
      for (const v of txt.matchAll(/\.length[<>]=?(\d+)/g)) rules.push("長度限制 " + v[0]);
    }
    const items = /items:(\[[^\]]{0,600}\]|[\w$]+\([\w$]+\)|[\w$]+\.value)/.exec(obj);
    let itemText = null;
    if (items) {
      itemText = items[1];
      const ref = /^[\w$]+\(([\w$]+)\)$/.exec(itemText);
      if (ref) { const d = new RegExp("[,;{ ]" + ref[1].replace("$", "\\$") + "=[\\w$]+\\((\\[[^\\]]{0,800}\\])").exec(src); itemText = d ? d[1] : "(動態載入)"; }
      itemText = itemText.replace(/[\w$]+\("((?:features|common)\.[\w.]+)"\)/g, (m, k) => JSON.stringify(t(k) || k)).slice(0, 500);
    }
    const flags = [];
    for (const f of ["multiple", "readonly", "disabled", "clearable", "chips", "required", "counter", "maxlength", "accept", "type", "min", "max", "step", "rows", "item-title", "item-value", "prefix", "suffix", "prepend-inner-icon", "hint", "persistent-hint", "return-object", "closable-chips", "show-size", "inline", "inset", "color"]) {
      const m = new RegExp('(?:^|[,{])"?' + f + '"?:("[^"]*"|![01]|\\d+|[\\w$]+\\([\\w$]+\\)|[\\w$.]+)').exec(obj);
      if (m) flags.push(f + "=" + m[1].replace(/^!0$/, "true").replace(/^!1$/, "false"));
    }
    let label = pick("label") || (sd ? [pick("start-date-label"), pick("end-date-label")].filter(Boolean).join(" ~ ") : null);
    let labelFrom = label ? "label" : null;
    if (!label && !pick("placeholder")) { // 標籤寫在元件外:取前方最近的文字節點(有 placeholder 的欄位不猜)
      const back = src.slice(Math.max(0, idx - 900), idx);
      const ks = [...back.matchAll(/\("((?:features|common)\.[\w.]+)"[,)]/g)].map(m => m[1]).filter(k => !/placeholders|messages|actions|options/.test(k));
      const k = ks[ks.length - 1];
      if (k && t(k)) { label = t(k); labelFrom = "相鄰文字"; }
      else { const lt = [...back.matchAll(/[\w$]\("\s*([A-Za-z][^"\\]{1,60}?)\s*"(?:,1)?\)/g)].map(m => m[1]).filter(x => !/^[a-z]+\.[\w.]+$/.test(x) && (!/^[\w-]+$/.test(x) || /^[A-Z]/.test(x))); if (lt.length) { label = lt[lt.length - 1]; labelFrom = "相鄰文字"; } }
    }
    if (/^\{|modelValue/.test(model)) continue; // 子元件內部 props 定義,不是欄位
    if (/^(VCounter|VForm|VTab|VTabs|VAlert|VComponentIcon|VSnackbar|VDialog|VNavigationDrawer|VMenu|VTooltip|VOverlay|VWindow|VTabs|VExpansionPanels|VBottomSheet)$/.test(comp || "")) continue;
    fields.push({ comp, label, labelFrom, placeholder: pick("placeholder"), key, loadOnly, model: model.slice(0, 60), rules: [...new Set(rules)], items: itemText, flags });
  }
  // i18n keys
  const keys = [...new Set([...src.matchAll(/\("((?:features|common|navigation|validation|userProfile)\.[\w.]+)"/g)].map(m => m[1]))];
  // 模板文字
  const texts = [...new Set([...src.matchAll(/[\w$]\("\s*([^"\\]{2,80}?)\s*"(?:,1)?\)/g)].map(m => m[1]).filter(x => /[A-Za-z]/.test(x) && !/^[\w.-]+$/.test(x) && !/[{}<>=]/.test(x)))].slice(0, 60);
  // API
  const api = [];
  for (const [local, im] of Object.entries(imp)) {
    const a = apiOf(im.file)[im.name];
    if (a && new RegExp("[^\\w$]" + local.replace("$", "\\$") + "\\(").test(src)) api.push(a);
  }
  for (const m of src.matchAll(/[\w$]+\((`\/[^`]*`|"\/[a-z_][^"]*")(,\{[^)]{0,200}\})?\)/g)) {
    const url = m[1].replace(/^["`]|["`]$/g, "").replace(/\$\{[^}]+\}/g, ":id");
    if (/^\/(?:[a-z_]+)/.test(url) && !/^\/(promotions|players|reports|users|roles|games|banners|announcements|wallets|bonus|psp|maintenance|notifications|game-|quickAccess|referral|terms|status|responsible|audits|featured|login|not-auth)\//.test(url))
      api.push({ method: (/method:"(\w+)"/.exec(m[2] || "") || [, "get"])[1].toUpperCase(), url });
  }
  // 表格欄位
  let headers = null;
  for (const im of Object.values(imp)) if (im.name === "headers") { const hs = read(im.file); headers = [...hs.matchAll(/title:"([\w.]+)",key:"([\w.]+)"(?:,sortable:(![01]))?/g)].map(m => ({ title: t(m[1]) || m[1], key: m[2], sortable: m[3] === "!0" })); }
  // 子元件(頁面專屬)
  const children = Object.values(imp).map(i => i.file).filter((f, i, a) => a.indexOf(f) === i);
  const dialogs = [...src.matchAll(/__name:"([A-Za-z]+)"/g)].map(m => m[1]);
  // 權限檢查
  const can = [...new Set([...src.matchAll(/\("(create|edit|delete|view|export|approve|reject|update|activate|deactivate)","([\w-]+)"\)/g)].map(m => m[1] + ":" + m[2]))];
  return { fields, keys, texts, api: dedupe(api), headers, children, dialogs, can };
}
const dedupe = a => a.filter((x, i) => a.findIndex(y => y.method === x.method && y.url === x.url) === i);

// import 次數,用來判斷頁面專屬元件
const usage = {};
for (const r of routes) for (const im of Object.values(imports(read(r.chunk)))) usage[im.file] = (usage[im.file] || 0) + 1;

const out = [];
for (const r of routes) {
  if (r.path.endsWith("/tableHeaders")) continue;
  const src = read(r.chunk);
  const main = analyze(src);
  const subs = [];
  for (const f of main.children) {
    if ((usage[f] || 0) > 3) continue;
    const s = read(f); if (!s || !/__name:"/.test(s) || s.length < 400) continue;
    if (/^V[A-Z]/.test(compName(f) || "")) continue;
    const a = analyze(s);
    if (a.fields.length || a.api.length || a.keys.length > 3) subs.push({ file: f, name: compName(f), ...a });
  }
  out.push({ ...r, size: src.length, ...main, subs });
}
fs.writeFileSync("pages.json", JSON.stringify(out, null, 1));
const nf = out.reduce((n, p) => n + p.fields.length + p.subs.reduce((m, s) => m + s.fields.length, 0), 0);
console.log("pages", out.length, "fields", nf, "api", new Set(out.flatMap(p => [...p.api, ...p.subs.flatMap(s => s.api)]).map(a => a.method + " " + a.url)).size);
