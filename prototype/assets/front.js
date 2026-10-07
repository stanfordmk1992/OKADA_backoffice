/* 前台外框(REQ-0014 比照現有前台):頂部導航(錢包區 + 4 個錢包下拉 + 刷新餘額)、跑馬燈、左側欄、頁尾、手機底部列、模擬登入
 * REQ-0017:頂部 ₱ 與下拉框 4 個錢包金額 = 「讀取當下」的快照,只在以下時機讀取:
 *   1. 進入頁面(每次載入或切換到另一個前台頁面;登入切換視同進入)時讀取一次
 *   2. 停留在頁面時,玩家按頂部刷新按鈕(轉圈)
 *   3. 玩家在本頁 Claim 成功後自動更新一次(其他分頁的 Claim 不算)
 * 展開 / 收起下拉框不重新讀取;存款、下注、其他分頁或模擬控制台造成的變動不會自動反映到頂部。頁面主體(卡片、列表、/en/points)維持即時。 */
(function () {
  'use strict';
  var S = window.Store, esc = S.esc, money = S.money;
  var REFRESH_MS = 800;

  var ICON = {
    flower: '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="#f6efdd"><circle cx="20" cy="8" r="6"/><circle cx="31.4" cy="16.3" r="6"/><circle cx="27" cy="29.7" r="6"/><circle cx="13" cy="29.7" r="6"/><circle cx="8.6" cy="16.3" r="6"/></g><circle cx="20" cy="20" r="5" fill="#d9b25a"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>',
    caret: '<svg class="caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    promo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11v2l11 5V6L3 11z"/><path d="M14 8a4 4 0 0 1 0 8"/><path d="M6 13l1 5h3l-1-4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
    browse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>'
  };

  var GAMES = [['Live Slots', 'LS'], ['Live Slots - New', 'NEW'], ['Live Tables', 'LT'], ['eGaming', 'eG'], ['Sportsbook', 'SB']];
  var QUICK = ['Provider A', 'Provider B', 'Provider C', 'Provider D'];
  var PROTO = [['index.html', 'Home', 'home'], ['promotions.html', 'Promotions', 'promotions'], ['wallet.html', 'Wallet', 'wallet'], ['points.html', 'Points', 'points']];

  function logo() { return '<a class="fr-logo" href="index.html" aria-label="OKADA ONLINE">' + ICON.flower + '<span class="w"><span class="w1">OKADA</span><span class="w2">ONLINE</span></span></a>'; }

  function walletArea(pl) {
    return '<div class="fr-wal" id="fr-wal">' +
      '<a class="fr-wal-btn" id="nav-wallet" href="wallet.html" aria-haspopup="true" aria-expanded="false" title="Wallet">' +
        '<span class="bal">₱ <span id="nav-balance"></span></span><span class="mem" id="nav-member">' + esc(S.memberNo(pl)) + '</span>' + ICON.caret + '</a>' +
      '<div class="fr-dd" id="wallet-dd" hidden role="menu" aria-label="Wallets"><div class="fr-dd-in">' +
        '<div class="fr-dd-h">My Wallets</div>' +
        '<a class="it" role="menuitem" data-wallet="okash" href="wallet.html"><div class="row1"><span class="nm">OKash Balance</span><span class="amt">₱ <span id="dd-okash"></span></span></div><div class="sub">Available to bet 可下注</div></a>' +
        '<a class="it" role="menuitem" data-wallet="table" href="points.html"><div class="row1"><span class="nm">Table Bonus Credit</span><span class="amt">₱ <span id="dd-table"></span></span></div></a>' +
        '<a class="it" role="menuitem" data-wallet="slot" href="points.html"><div class="row1"><span class="nm">Slot Bonus Credit</span><span class="amt">₱ <span id="dd-slot"></span></span></div></a>' +
        '<a class="it" role="menuitem" data-wallet="promo" href="wallet.html?tab=promo"><div class="row1"><span class="nm">Promo Wallet<span class="fr-tag" id="dd-nobet">Not for betting 不可下注</span></span></div>' +
          '<div class="pw-lines"><span>Locked 鎖定</span><b>₱ <span id="dd-locked"></span></b><span>Claimable 可領取</span><b>₱ <span id="dd-claimable"></span></b></div></a>' +
      '</div></div></div>' +
      '<button type="button" class="fr-refresh" id="btn-refresh" title="Refresh balance 刷新餘額" aria-label="Refresh balance">' + ICON.refresh + '</button>';
  }

  function header(s) {
    var pl = s.frontPlayer ? S.player(s, s.frontPlayer) : null;
    var left = pl ? walletArea(pl)
      : '<button type="button" class="fr-btn login" id="btn-login">LOGIN</button><button type="button" class="fr-btn signup" id="btn-signup">SIGN UP</button>';
    var right = '<a class="fr-btn plum hide-m" id="nav-promotion" href="promotions.html">' + ICON.promo + 'Promotion</a>' +
      '<button type="button" class="fr-btn lang' + (pl ? ' hide-m' : '') + '" title="Language(原型僅 EN)">' + ICON.globe + 'EN</button>' +
      (pl ? '<div class="fr-acc"><button type="button" class="fr-btn plum" id="btn-account" aria-haspopup="true" title="Account">' + ICON.user + '</button>' +
        '<div class="fr-acc-menu" id="acc-menu" hidden><div class="who">' + esc(pl.name) + ' · ' + esc(S.memberNo(pl)) + '</div>' +
        '<a href="wallet.html">My Wallet</a><a href="points.html">Points</a><button type="button" id="btn-logout">Logout</button></div></div>' : '');
    var marq = ['Prototype announcement — all data is fake 原型公告:所有資料皆為假資料', 'Promo Wallet rewards cannot be used for betting 優惠錢包獎勵不可下注', 'Claim your rewards before the claim deadline 請於領取截止前 Claim'];
    return '<header class="fr-topnav" id="fr-topnav"><div class="fr-bar"><div class="fr-left">' + left + '</div><div class="fr-center">' + logo() + '</div><div class="fr-right">' + right + '</div></div>' +
      '<div class="fr-marq" aria-label="announcement"><div class="track">' + marq.concat(marq).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div></header>';
  }

  function sidebar(active) {
    return '<aside class="fr-side" id="fr-side">' +
      '<nav class="fr-menu" aria-label="Games"><div class="collapse" aria-hidden="true">«</div><span class="t">Games</span>' +
        GAMES.map(function (g) { return '<a href="index.html" data-proto="game"><span class="ic">' + g[1].slice(0, 2) + '</span>' + g[0] + '</a>'; }).join('') + '</nav>' +
      '<nav class="fr-menu" aria-label="Quick access"><span class="t">Quick Access</span>' +
        QUICK.map(function (q) { return '<a href="index.html" data-proto="quick"><span class="ic">' + q.slice(-1) + '</span>' + q + '</a>'; }).join('') + '</nav>' +
      '<nav class="fr-menu" aria-label="Prototype pages" id="fr-proto-nav"><span class="t">Prototype 原型頁面</span>' +
        PROTO.map(function (p) { return '<a href="' + p[0] + '" class="' + (p[2] === active ? 'on' : '') + '" data-page="' + p[2] + '"><span class="ic">' + p[1].charAt(0) + '</span>' + p[1] + '</a>'; }).join('') +
        '<a href="' + S.url('index.html') + '"><span class="ic">←</span>原型首頁 / 後台</a><div class="proto">此選單為原型導覽(現有前台沒有)</div></nav>' +
      '</aside>';
  }

  function footer() {
    var cols = [['About', ['Company Information', 'Awards', 'Careers', 'Contact Us']], ['Stay', ['Rooms', 'Suites', 'Facilities']], ['Play', ['Reward Circle', 'Responsible Gaming']], ['Visitor Information', ['Getting Here']]];
    return '<footer class="fr-foot" id="fr-foot"><div class="cols">' + cols.map(function (c) {
      return '<div><h3>' + c[0] + '</h3>' + c[1].map(function (x) { return '<a href="javascript:void(0)">' + x + '</a>'; }).join('') + '</div>';
    }).join('') + '</div><div class="legal"><span>T&amp;C apply. 21&amp;up. Game responsibly.(原型頁尾示意)</span><span>Prototype only · fake data</span></div></footer>';
  }

  function mobileBar() {
    return '<nav class="fr-mbar" id="fr-mbar" aria-label="Mobile navigation">' +
      '<button type="button" id="mb-browse">' + ICON.browse + 'Browse</button>' +
      '<a class="games" href="index.html" id="mb-games"><span class="circ">' + ICON.flower + 'Games</span></a>' +
      '<a href="promotions.html" id="mb-promo">' + ICON.promo + 'Promo</a></nav>';
  }

  function loginDialog() {
    var s = S.load();
    var d = UI.dialog({ title: 'Login', body: '<p class="small">原型模擬登入:不使用帳號密碼,請選擇一個假資料玩家。</p><select id="login-player" style="width:100%">' +
      s.players.map(function (p) { return '<option value="' + p.name + '">' + p.name + '</option>'; }).join('') + '</select>',
      actions: [{ label: 'Cancel', cls: 'sec' }, { label: 'Login', id: 'btn-do-login', onClick: function (close, root) {
        var v = root.querySelector('#login-player').value; S.mutate(function (x) { x.frontPlayer = v; }); close(); UI.toast('Welcome, ' + v, 'ok');
      } }] });
    return d;
  }

  /* ---------- 頂部錢包:快照、下拉、刷新 ---------- */
  var hdr, shownPlayer, ddOpen = false, closeTimer = null, refreshing = false;
  function isTouchLayout() { return window.matchMedia('(max-width: 768px), (hover: none)').matches; }
  /** 讀取最新餘額(含時間事件處理後的狀態;不寫回)並更新頂部 ₱ 與下拉框 */
  function syncBalances() {
    if (!hdr || !hdr.querySelector('#nav-balance')) return null;
    var s = S.load(); S.tick(s);
    var pl = s.frontPlayer ? S.player(s, s.frontPlayer) : null; if (!pl) return null;
    var w = S.frontWallets(s, pl.id);
    var set = function (id, v) { var e = hdr.querySelector('#' + id); if (e) e.textContent = money(v); };
    set('nav-balance', w.okash); set('dd-okash', w.okash); set('dd-table', w.table); set('dd-slot', w.slot); set('dd-locked', w.locked); set('dd-claimable', w.claimable);
    hdr.querySelector('#fr-wal').setAttribute('data-synced-at', String(Date.now()));
    return w;
  }
  function openDD() {
    var dd = hdr.querySelector('#wallet-dd'); if (!dd) return;
    clearTimeout(closeTimer);
    // REQ-0017:展開下拉框不重新讀取,顯示的是進入頁面 / 按刷新 / 本頁 Claim 成功時讀到的金額
    ddOpen = true; dd.hidden = false;
    hdr.querySelector('#fr-wal').classList.add('open'); hdr.querySelector('#nav-wallet').setAttribute('aria-expanded', 'true');
  }
  function closeDD() {
    var dd = hdr.querySelector('#wallet-dd'); if (!dd) return;
    ddOpen = false; dd.hidden = true;
    hdr.querySelector('#fr-wal').classList.remove('open'); hdr.querySelector('#nav-wallet').setAttribute('aria-expanded', 'false');
  }
  function refresh() {
    var b = hdr.querySelector('#btn-refresh'); if (!b || refreshing) return;
    refreshing = true; b.classList.add('spinning'); b.disabled = true; b.setAttribute('aria-busy', 'true');
    setTimeout(function () {
      syncBalances();
      refreshing = false; b.classList.remove('spinning'); b.disabled = false; b.removeAttribute('aria-busy');
    }, REFRESH_MS);
  }
  function bindHeader() {
    var li = hdr.querySelector('#btn-login'); if (li) li.onclick = loginDialog;
    var su = hdr.querySelector('#btn-signup'); if (su) su.onclick = loginDialog;
    var lo = hdr.querySelector('#btn-logout'); if (lo) lo.onclick = function () { S.mutate(function (x) { x.frontPlayer = null; }); };
    var acc = hdr.querySelector('#btn-account'), menu = hdr.querySelector('#acc-menu');
    if (acc) acc.onclick = function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; };
    var wal = hdr.querySelector('#fr-wal'); if (!wal) return;
    // 桌機:hover 展開;離開錢包區與下拉框才收起(下拉框在 .fr-wal 內,且有 padding 橋接,移入途中不收起)
    wal.addEventListener('mouseenter', function () { if (!isTouchLayout()) openDD(); });
    wal.addEventListener('mouseleave', function () { if (!isTouchLayout()) { clearTimeout(closeTimer); closeTimer = setTimeout(closeDD, 120); } });
    // 手機:點擊錢包區展開 / 再點一次收起(不跳頁);下拉框內的項目照常跳頁
    hdr.querySelector('#nav-wallet').addEventListener('click', function (e) {
      if (!isTouchLayout()) return; // 桌機點錢包區 → /en/wallet(與現有前台相同)
      e.preventDefault();
      if (ddOpen) closeDD(); else openDD();
    });
    hdr.querySelector('#btn-refresh').onclick = refresh;
  }
  document.addEventListener('click', function (e) {
    if (!hdr) return;
    if (ddOpen && !e.target.closest('#fr-wal')) closeDD();
    var menu = hdr.querySelector('#acc-menu'); if (menu && !menu.hidden && !e.target.closest('.fr-acc')) menu.hidden = true;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr && ddOpen) closeDD(); });

  /** FR.init({active, render(s, player), needLogin}) — 需要 #page 容器 */
  function init(o) {
    document.body.classList.add('front');
    var page = document.getElementById('page');
    var shell = document.createElement('div'); shell.className = 'fr-shell';
    hdr = document.createElement('div');
    var body = document.createElement('div'); body.className = 'fr-body';
    body.innerHTML = sidebar(o.active);
    document.body.insertBefore(shell, page);
    shell.appendChild(hdr); shell.appendChild(body); body.appendChild(page);
    shell.insertAdjacentHTML('beforeend', footer());
    document.body.insertAdjacentHTML('beforeend', mobileBar() + '<div class="fr-mask-side" id="fr-mask-side"></div>');
    page.classList.add('fr-main');
    var side = body.querySelector('#fr-side'), mask = document.getElementById('fr-mask-side');
    var toggleSide = function (on) { side.classList.toggle('open', on); mask.classList.toggle('open', on); };
    document.getElementById('mb-browse').onclick = function () { toggleSide(!side.classList.contains('open')); };
    mask.onclick = function () { toggleSide(false); };

    var drawHeader = function (s) {
      ddOpen = false; refreshing = false;
      hdr.innerHTML = header(s);
      shownPlayer = s.frontPlayer || null;
      bindHeader(); syncBalances();
    };
    var draw = function () {
      var s = S.load();
      // 頂部導航只在登入玩家改變時重畫;金額不自動跟著變(見檔頭說明)
      if ((s.frontPlayer || null) !== shownPlayer || !hdr.firstChild) drawHeader(s);
      var pl = s.frontPlayer ? S.player(s, s.frontPlayer) : null;
      if (o.needLogin && !pl) {
        page.innerHTML = '<div class="fr-card"><h2>Please log in</h2><p>Log in to view your wallet.</p><button class="btn" id="btn-login2">LOGIN</button></div>';
        page.querySelector('#btn-login2').onclick = loginDialog; return;
      }
      o.render(s, pl);
    };
    var s0 = S.load(); S.tick(s0); S.save(s0);
    S.onChange(draw); draw();
    if (window.Sim) window.Sim.mountFloating();
  }
  /** REQ-0017:本頁 Claim 成功後自動更新一次頂部金額 */
  function onClaimSuccess() { syncBalances(); }
  window.FR = { init: init, loginDialog: loginDialog, syncBalances: syncBalances, onClaimSuccess: onClaimSuccess, refresh: refresh, isTouchLayout: isTouchLayout };
})();
