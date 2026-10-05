const fs=require('fs'),vm=require('vm');
let s=fs.readFileSync('all/'+fs.readFileSync('locale-chunk.txt','utf8').trim(),'utf8');
s=s.replace(/^import\{[^}]*\}from"[^"]*";/,'const f=()=>({value:"en"}),S={app:{i18n:{defaultLocale:"en"}}};');
s=s.replace(/export\{[^}]*\};?\s*$/,'__out=w;');
const ctx={__out:null,Symbol,Object};vm.createContext(ctx);vm.runInContext(s,ctx);
for(const k of Object.keys(ctx.__out)){const flat={};const w=(o,p)=>{for(const kk in o){const v=o[kk];if(v&&typeof v==='object')w(v,p?p+'.'+kk:kk);else flat[p?p+'.'+kk:kk]=String(v);}};w(ctx.__out[k],'');fs.writeFileSync('i18n-'+k+'.json',JSON.stringify(flat,null,1));console.log(k,Object.keys(flat).length);}
