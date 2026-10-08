/* 後台外框:側欄選單(依角色權限過濾)、頂列、路由權限守衛 */
(function () {
  'use strict';
  var S = window.Store, esc = S.esc;
  var MENU = [
    { group: 'Home', items: [{ t: 'Prototype Home(原型首頁)', to: 'index.html' }, { t: '鏈路圖 / 系統交互圖', to: 'diagrams/promo-wallet.html', key: 'diagrams', isNew: true }] },
    { group: 'Player Management', items: [{ t: 'Player List', to: 'players/list.html', perm: 'view:players', key: 'players' }] },
    { group: 'Promotions', items: [
      { t: 'Promotion Settings', to: 'promotions/settings/list.html', perm: 'view:promotions-settings', key: 'promotions-settings' },
      { t: 'Promotion Opt-In List', to: 'promotions/opt-in/list.html', perm: 'view:promotions-opt-in', key: 'promotions-opt-in' },
      { t: 'Promotion Payout', to: 'promotions/payout/list.html', perm: 'view:promotions-payout', key: 'promotions-payout' }] },
    { group: 'Wallets Management', items: [
      { sub: 'Credit Adjustment' },
      { t: 'Wallet Adjustment', to: 'wallets/adjustment/list.html', perm: 'view:wallet-adjustment', key: 'wallets-adjustment', lvl3: true },
      { t: 'Promo Wallet', to: 'wallets/promo-wallet/list.html', perm: 'view:promo-wallet', key: 'promo-wallet', isNew: true }] },
    { group: 'Compliance', items: [{ t: 'Audit Logs', to: 'audits/list.html', perm: 'view:audits', key: 'audits' }] },
    { group: 'Reports', items: [
      { t: 'Cashless Liability Report', to: 'reports/cashless-liability/list.html', perm: 'view:cashless-liability-report', key: 'cashless' },
      { t: 'Fund Transaction Report', to: 'reports/fund-transaction/list.html', perm: 'view:fund-transaction-report', key: 'fund-transaction' },
      { t: 'Promo Wallet Report', to: 'reports/promo-wallet/list.html', perm: 'view:promo-wallet-report', key: 'promo-wallet-report', isNew: true }] },
    { group: 'Front Site(前台)', items: [{ t: 'Front Home /en', to: 'front/en/index.html' }, { t: 'Front Wallet /en/wallet', to: 'front/en/wallet.html' }] }
  ];

  function sideHtml(s, active) {
    var h = '<nav class="bo-side" aria-label="Backoffice menu"><div class="bo-brand">OKADA Backoffice<small>Prototype · REQ-0008 Promo Wallet(+0011~0013)</small></div>';
    MENU.forEach(function (g) {
      var items = g.items.filter(function (i) { return i.sub || !i.perm || S.can(s, i.perm); });
      var links = items.filter(function (i) { return !i.sub; });
      if (!links.length) return;
      h += '<div class="bo-group">' + esc(g.group) + '</div>';
      items.forEach(function (i) {
        if (i.sub) { h += '<div class="bo-sub">' + esc(i.sub) + '</div>'; return; }
        h += '<a href="' + S.url(i.to) + '" data-menu="' + (i.key || '') + '" class="' + (i.key && i.key === active ? 'active ' : '') + (i.lvl3 ? 'lvl3' : '') + '">' + esc(i.t) + (i.isNew ? '<span class="tag-new">NEW</span>' : '') + '</a>';
      });
    });
    return h + '</nav>';
  }
  function topHtml(s, crumb) {
    var role = S.ROLES[s.role];
    var opts = Object.keys(S.ROLES).map(function (k) { return '<option value="' + k + '"' + (k === s.role ? ' selected' : '') + '>' + esc(S.ROLES[k].name) + '</option>'; }).join('');
    return '<div class="bo-top"><div class="crumb">' + esc(crumb || '') + '</div>' +
      '<div class="row" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="clock" title="模擬時鐘(UTC+8)">模擬時間 <span id="bo-clock">' + S.fmt(s.now) + '</span></span>' +
      '<label class="small muted">後台角色 <select id="bo-role" aria-label="Backoffice role">' + opts + '</select></label>' +
      '<span class="small">登入:<b>' + esc(role.user) + '</b></span></div></div>';
  }
  /** BO.init({perm, active, crumb, render}) — 需要 #page 容器 */
  function init(o) {
    var s = S.load(); S.tick(s); S.save(s);
    if (o.perm && !S.can(s, o.perm)) { location.replace(S.url('not-authorized.html') + '?from=' + encodeURIComponent(location.pathname.split('/').slice(-3).join('/')) + '&perm=' + encodeURIComponent(o.perm)); return; }
    var page = document.getElementById('page');
    var wrap = document.createElement('div'); wrap.className = 'bo';
    document.body.insertBefore(wrap, page);
    var shell = function () {
      var st = S.load();
      var old = wrap.querySelector('.bo-side'); if (old) old.remove();
      wrap.insertAdjacentHTML('afterbegin', sideHtml(st, o.active));
      var top = main.querySelector('.bo-top'); if (top) top.remove();
      main.insertAdjacentHTML('afterbegin', topHtml(st, o.crumb));
      main.querySelector('#bo-role').onchange = function (e) {
        S.mutate(function (x) { x.role = e.target.value; });
        UI.toast('已切換後台角色:' + S.ROLES[e.target.value].name);
      };
    };
    var main = document.createElement('main'); main.className = 'bo-main';
    wrap.appendChild(main); main.appendChild(page);
    shell();
    var rerender = function () {
      var st = S.load();
      if (o.perm && !S.can(st, o.perm)) { location.replace(S.url('not-authorized.html') + '?perm=' + encodeURIComponent(o.perm)); return; }
      shell(); if (o.render) o.render(st);
    };
    S.onChange(rerender);
    if (o.render) o.render(S.load());
    if (window.Sim) window.Sim.mountFloating();
  }
  window.BO = { init: init, MENU: MENU };
})();
