// 下載後台前端 bundle(公開靜態檔,不需登入):入口、路由表、全部 chunk
import fs from "node:fs";
const SITE = "https://okada-dev-bo-2.scms2u.lol";
fs.mkdirSync("all", { recursive: true });

const html = await (await fetch(SITE + "/promotions/settings/list")).text();
fs.writeFileSync("index.html", html);
const entryName = /<link rel="modulepreload" as="script" crossorigin href="\/_nuxt\/([^"]+\.js)">/.exec(html)[1];
const entry = await (await fetch(SITE + "/_nuxt/" + entryName)).text();
fs.writeFileSync("entry.js", entry);
fs.writeFileSync("all/" + entryName, entry);
console.log("entry", entryName, "version", (/appVersion:"([^"]+)"/.exec(html) || [])[1]);

// 路由與權限 meta
const meta = {};
for (const m of entry.matchAll(/([A-Za-z_$][\w$]*)=\{([^{}]{0,160})\}/g)) {
  const a = /action:"([^"]*)"/.exec(m[2]), s = /subject:"([^"]*)"/.exec(m[2]);
  if (a && s) meta[m[1]] = { action: a[1], subject: s[1] };
  else if (/authenticatedOnly/.test(m[2])) meta[m[1]] = { authenticatedOnly: true };
}
const routes = [];
for (const m of entry.matchAll(/\{name:"([^"]+)",path:"([^"]+)",(?:meta:([\w$]+)\|\|\{\},)?component:\(\)=>[\w$]+\(\(\)=>import\("\.\/([^"]+)"\)/g))
  routes.push({ name: m[1], path: m[2], meta: m[3] ? meta[m[3]] || null : null, chunk: m[4] });
fs.writeFileSync("routes.json", JSON.stringify(routes, null, 1));
console.log("routes", routes.length);

// 遞迴下載所有 chunk
const seen = new Set([entryName]);
const queue = [...entry.matchAll(/"\.\/([A-Za-z0-9_-]+\.js)"/g)].map(m => m[1]).filter(n => !seen.has(n) && seen.add(n));
while (queue.length) {
  const batch = queue.splice(0, 16);
  const texts = await Promise.all(batch.map(async n => {
    const f = "all/" + n;
    if (fs.existsSync(f)) return fs.readFileSync(f, "utf8");
    const r = await fetch(SITE + "/_nuxt/" + n);
    if (!r.ok) return "";
    const t = await r.text(); fs.writeFileSync(f, t); return t;
  }));
  for (const t of texts) for (const m of t.matchAll(/(?:from|import\(?)"\.\/([A-Za-z0-9_-]+\.js)"/g)) if (!seen.has(m[1])) { seen.add(m[1]); queue.push(m[1]); }
}
console.log("chunks", seen.size);
// 語系檔:含 "/plugins/i18n/locales/en.json" 的 chunk
const loc = fs.readdirSync("all").find(f => fs.readFileSync("all/" + f, "utf8").includes("/plugins/i18n/locales/en.json"));
fs.writeFileSync("locale-chunk.txt", loc || "");
console.log("locale", loc);
