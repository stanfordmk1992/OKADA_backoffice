/* 前台外框(REQ-0020:結構與樣式比照現有前台 okada-dev-ooc-2,零誤差;樣式見 assets/front.css)
 * 頂部導航(登入後:左 餘額區 a.balanceFigure + 刷新鈕、中 logo、右 Promotion + 漢堡選單;未登入:Login / Sign Up、logo、Promotion + EN)、
 * 跑馬燈、左側欄(Games / Quick Access)、頁尾、手機底部列(Browse / Games / Promo)、客服鈕(佔位)、公告對話框(FR.announce)
 * REQ-0014:錢包下拉框(新元件,桌機 hover / 手機點擊)顯示 4 個錢包;帳號選單 / Logout 在漢堡選單內(REQ-0020)
 * REQ-0017:頂部 ₱ 與下拉框 4 個錢包金額 = 「讀取當下」的快照,只在以下時機讀取:
 *   1. 進入頁面(每次載入或切換到另一個前台頁面;登入切換視同進入)時讀取一次
 *   2. 停留在頁面時,玩家按頂部刷新按鈕(轉圈)
 *   3. 玩家在本頁 Claim 成功後自動更新一次(其他分頁的 Claim 不算)
 * 展開 / 收起下拉框不重新讀取;存款、下注、其他分頁或模擬控制台造成的變動不會自動反映到頂部。頁面主體(卡片、列表、/en/points)維持即時。
 * 原型專用元素(原型導覽、模擬控制台)加上 .proto-only(橘色虛線),不屬於現有前台。 */
(function () {
  'use strict';
  var S = window.Store, esc = S.esc, money = S.money;
  var REFRESH_MS = 800;

  /* 圖示(簡化 SVG;現有前台的圖片一律以佔位代替) */
  var I = {
    refresh: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>',
    promo: '<svg class="fr-ico" viewBox="0 0 32 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="3" width="28" height="14" rx="3"/><path d="M11 3v14" stroke-dasharray="2 2"/><path d="M17 7l6 6M23 7l-6 6"/></svg>',
    menu: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    chevL: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    chevR: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    chevD: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    dbl: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>',
    dblR: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>',
    close: '<svg class="fr-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>',
    browse: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
    flower: '<svg class="fr-ico" viewBox="0 0 26 29" aria-hidden="true"><g fill="currentColor"><circle cx="13" cy="4.5" r="4.5"/><circle cx="4.5" cy="9.5" r="4.5"/><circle cx="21.5" cy="9.5" r="4.5"/><circle cx="13" cy="14.5" r="4.5"/><circle cx="4.5" cy="19.5" r="4.5"/><circle cx="21.5" cy="19.5" r="4.5"/><circle cx="13" cy="24.5" r="4.5"/></g></svg>',
    tag: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11V4h7l10 10-7 7L3 11z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    star: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    phone: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    social: '<svg class="fr-ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="currentColor"/></svg>',
    slot: '<svg class="fr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 5v14M15 5v14"/></svg>'
  };
  window.FR_ICONS = I;

  var GAMES = [['Live Slots', 'a'], ['Live Slots - New', 'a'], ['Live Tables', 'a'], ['eGaming', 'a'], ['Sportsbook', 'div']];
  // Quick Access / 首頁分類按鈕:供應商名稱(公開資訊;第 16、22 項為兩行標籤,版面同現有前台)
  var QUICK = ['inferno play', 'pragmatic play', 'jili', 'habanero', 'playtech', 'jdb', 'fachai', 'yellowbat', 'etg', 'zitro', 'nsoft', 'arcade', 'sport', 'fishing', 'bingo',
    'Prototype quick access', 'table games', 'skivot', 'omniplay', 'new jumbo', 'Playtech Quick Access'];
  var PROTO = [['index.html', 'Home(大廳)', 'home'], ['promotions.html', 'Promotions', 'promotions'], ['wallet.html', 'Wallet', 'wallet'], ['points.html', 'Points', 'points']];
  var MARQ = ['Prototype announcement — all data is fake(原型公告:所有資料皆為假資料)', 'Promo Wallet rewards cannot be used for betting(優惠錢包獎勵不可下注)', 'Claim your rewards before the claim deadline(請於領取截止前 Claim)'];

  function marquee(items) {
    var kids = items.map(function (t) { return '<div class="rfm-child"><span class="px-5"><a class="hover:underline" href="javascript:void(0)">' + esc(t) + '</a></span></div>'; }).join('');
    return '<div class="rfm-marquee-container"><div class="rfm-marquee"><div class="rfm-initial-child-container">' + kids + '</div>' + kids + '</div><div class="rfm-marquee" aria-hidden="true">' + kids + kids + '</div></div>';
  }

  function walletArea(pl) {
    // 錢包區(div.balanceBox = #fr-wal):a.balanceFigure(#nav-wallet)+ 刷新鈕;下拉框 #wallet-dd 為新元件(data-new),放在 balanceBox 之後
    return '<div class="balanceBox fr-wal" id="fr-wal">' +
        '<a class="balanceFigure" id="nav-wallet" href="wallet.html" aria-haspopup="true" aria-expanded="false" title="Wallet">' +
          '<span class="amount"><span class="tracking-wide">₱ <span id="nav-balance"></span></span></span><span class="playerName" id="nav-member">' + esc(S.memberNo(pl)) + '</span></a>' +
        '<button type="button" class="z-0 group relative fr-refresh" id="btn-refresh" title="Refresh balance 刷新餘額" aria-label="Refresh balance"><span>' + I.refresh + '</span></button>' +
      '</div>' +
      '<div class="fr-dd" id="wallet-dd" hidden role="menu" aria-label="Wallets" data-new="wallet-dropdown"><div class="fr-dd-in">' +
        '<div class="fr-dd-h">My Wallets</div>' +
        '<a class="it" role="menuitem" data-wallet="okash" href="wallet.html"><div class="row1"><span class="nm">OKash Balance</span><span class="amt">₱ <span id="dd-okash"></span></span></div><div class="sub">Available to bet 可下注</div></a>' +
        '<a class="it" role="menuitem" data-wallet="table" href="points.html"><div class="row1"><span class="nm">Table Bonus Credit</span><span class="amt">₱ <span id="dd-table"></span></span></div></a>' +
        '<a class="it" role="menuitem" data-wallet="slot" href="points.html"><div class="row1"><span class="nm">Slot Bonus Credit</span><span class="amt">₱ <span id="dd-slot"></span></span></div></a>' +
        '<a class="it" role="menuitem" data-wallet="promo" href="wallet.html?tab=promo"><div class="row1"><span class="nm">Promo Wallet<span class="fr-tag" id="dd-nobet">Not for betting 不可下注</span></span></div>' +
          '<div class="pw-lines"><span>Locked 鎖定</span><b>₱ <span id="dd-locked"></span></b><span>Claimable 可領取</span><b>₱ <span id="dd-claimable"></span></b></div></a>' +
      '</div></div>';
  }

  function header(s) {
    var pl = s.frontPlayer ? S.player(s, s.frontPlayer) : null;
    var left = pl ? walletArea(pl)
      : '<a class="z-0 group relative fr-btn-login" id="btn-login" role="button" tabindex="0">Login</a><a class="z-0 group relative fr-btn-signup" id="btn-signup" role="button" tabindex="0">Sign Up</a>';
    var right = '<a class="z-0 group relative fr-btn-promo" id="nav-promotion" href="promotions.html"><span class="ic">' + I.promo + '</span>Promotion</a>' +
      (pl
        // 登入後:漢堡選單(現有前台頂部沒有 EN);帳號選單 / Logout 在漢堡選單內(展開內容為推定)
        ? '<div class="relative fr-ham-wrap fr-acc"><div class="relative inline-flex shrink-0"><button type="button" class="z-0 group relative fr-ham" id="btn-account" aria-haspopup="true" aria-label="Menu" title="Menu"><span>' + I.menu + '</span></button><span class="flex z-10 flex-wrap fr-badge"></span></div>' +
          '<div class="fr-acc-menu" id="acc-menu" hidden role="menu" data-new="hamburger-menu"><span class="who">' + esc(pl.name) + ' · ' + esc(S.memberNo(pl)) + '</span>' +
          '<a href="wallet.html" role="menuitem">My Wallet</a><a href="wallet.html?tab=promo" role="menuitem">Promo Wallet</a><a href="points.html" role="menuitem">Points</a><a href="promotions.html" role="menuitem">Promotions</a>' +
          '<button type="button" id="btn-logout" role="menuitem">Logout</button></div></div>'
        : '<button type="button" class="fr-btn-lang" id="btn-lang" title="Language(原型僅 EN)"><span class="flex relative justify-center flag"></span>EN<span class="caret">' + I.chevD + '</span></button>');
    return '<div class="wrapper fr-bar"><div class="leftColumn fr-left">' + left + '</div>' +
      '<div class="centerColumn fr-center"><a class="logo focus:outline-none fr-logo" href="index.html" aria-label="OKADA ONLINE"><span class="ph">OKADA ONLINE</span></a></div>' +
      '<div class="rightColumn fr-right">' + right + '</div></div>' +
      '<div class="relative z-10 animate__animated fr-marq" aria-label="announcement">' + marquee(MARQ) + '</div>';
  }

  function sideBtn(tag, label, extra) {
    return '<' + tag + ' class="sidebarButton' + (extra || '') + '"' + (tag === 'a' ? ' href="index.html"' : '') + '><div class="flex items-center justify-center icwrap"><div></div></div><span class="label">' + esc(label) + '</span></' + tag + '>';
  }
  function sidebar(active) {
    return '<aside class="sticky top-default-topnavbar max-h-[calc(100dvh-theme(spacing.default-topnavbar))] fr-side" id="fr-side">' +
      '<div class="menu lobbyMenu fr-menu"><div class="toggleWrapper"><button type="button" class="z-0 group relative" aria-label="Collapse"><span>' + I.dbl + '</span></button></div><span class="menuTitle">Games</span>' +
        '<div class="menuWrapper flex-1 overflow-hidden">' + GAMES.map(function (g) { return sideBtn(g[1], g[0], g[1] === 'div' ? ' lobbyMenu' : ''); }).join('') + '</div></div>' +
      '<div class="menu quickAccessMenu fr-menu"><span class="menuTitle">Quick Access</span><div class="menuWrapper flex-1 overflow-hidden">' + QUICK.map(function (q) { return sideBtn('a', q); }).join('') + '</div></div>' +
      '<nav class="fr-proto-nav proto-only" id="fr-proto-nav" aria-label="Prototype pages"><span class="t">原型導覽 Prototype</span>' +
        PROTO.map(function (p) { return '<a href="' + p[0] + '" class="' + (p[2] === active ? 'on' : '') + '" data-page="' + p[2] + '">' + p[1] + '</a>'; }).join('') +
        '<a href="' + S.url('index.html') + '">← 原型首頁 / 後台</a><span class="proto">原型專用元素(現有前台沒有),不計入比對</span></nav>' +
      '</aside>';
  }

  var FOOT = [
    ['About Okada Manila', ['Company Information', 'Tiger Resort Leisure & Entertainment, Inc.', 'Awards', 'Okada Foundation, Inc.', 'Okada Green Heart', 'Media Center', 'Careers', 'Procurement', 'Contact Us']],
    ['Stay', ['Rooms', 'Suites', 'Villas', 'Facilities']], ['Shop', ['The Promenade', 'Les Fleurs', 'The Gift Boutique']], ['Deals', null],
    ['Play', ['Reward Circle', 'Responsible Gaming']], ['Relax', ['The Retreat Spa', 'The Sole Retreat']], ['Events', null], ['Visitor Information', ['Getting Here']]
  ];
  function footer() {
    var groups = FOOT.map(function (g) {
      return '<div class="footer_quickLinkGroup__D24U6">' + (g[1]
        ? '<h3>' + esc(g[0]) + '</h3><ul class="footer_linkList__WJRtl">' + g[1].map(function (x) { return '<li><a class="footer_link__L6W7F" href="javascript:void(0)">' + esc(x) + '</a></li>'; }).join('') + '</ul>'
        : '<a class="footer_link__L6W7F" href="javascript:void(0)"><h3>' + esc(g[0]) + '</h3></a>') + '</div>';
    }).join('');
    var acc = FOOT.map(function (g, i) {
      return '<div><h2><button type="button" id="fr-facc-' + i + '" aria-expanded="false" data-facc="' + i + '"><div class="flex-1 flex flex-col"><span class="text-foreground text-medium footer_title__eJ_fP">' + esc(g[0]) + '</span></div>' +
        (g[1] ? '<span class="text-default-400 transition-transform rotate-0 chev">' + I.chevD + '</span>' : '') + '</button></h2>' +
        (g[1] ? '<section hidden data-facc-panel="' + i + '">' + g[1].map(function (x) { return '<a href="javascript:void(0)">' + esc(x) + '</a>'; }).join('') + '</section>' : '') + '</div>';
    }).join('');
    var awards = [1, 2, 3, 4, 5, 6, 7].map(function (n) { return '<div class="footer_gridItem__NgZxH">' + (n === 3 ? '<a href="javascript:void(0)"><span class="fr-ph">Award ' + n + '</span></a>' : '<span class="fr-ph">Award ' + n + '</span>') + '</div>'; }).join('');
    return '<footer class="footer_pageFooter__Tkpxm fr-foot" id="fr-foot"><div class="footer_wrapper__bAje4">' +
      '<div class="footer_footerLogoSocialMedia__jkI_Q"><a class="inline-flex" href="index.html"><span class="fr-ph">Logo</span></a><div class="footer_awardsRecognition__B0YAI">' + awards + '</div>' +
        '<div class="footer_socialMediaLinks__TKITN">' + [1, 2, 3, 4, 5, 6].map(function () { return '<a class="tap-highlight-transparent no-underline hover:opacity-hover" href="javascript:void(0)" aria-label="Social"><span>' + I.social + '</span></a>'; }).join('') + '</div></div>' +
      '<hr>' +
      '<div class="footer_content__55gvT"><div class="footer_contentLeft___cyt_"><div class="footer_footerQuickLink__5rwSj"><div class="footer_quickLinkGroupWrapper__7A_pb">' + groups + '</div></div>' +
        '<div class="footer_footerMobileQuickLink__TcmoS"><div class="px-2 w-full footer_accordion__0wPtF">' + acc + '</div></div></div>' +
        '<div class="fr-vsep" aria-hidden="true"></div><div class="footer_contentRight__VcDDR"><div class="footer_rulesRegulation__LqWCV"><div class="footer_regulatoryIcon__qbu13"><span class="fr-ph">Icon</span><span class="fr-ph">Regulator logo</span></div>' +
          '<span>T&amp;C apply. 21&amp;up. Game responsibly. Keep it fun and play within your limits. Prototype only — all footer content is placeholder text.</span></div><div class="fr-sep" aria-hidden="true"></div>' +
          '<div class="footer_contactUs__1Q5pC"><h3 class="footer_title__eJ_fP">Contact Us</h3><div class="footer_contactDetails__qUDS_">' +
            '<a class="footer_contactLink__jMiSs" href="javascript:void(0)"><span class="ic">' + I.phone + '</span>+632 8555 7777</a><a class="footer_contactLink__jMiSs" href="javascript:void(0)"><span class="ic">' + I.mail + '</span>Send a message</a></div></div></div></div>' +
      '<hr>' +
      '<div class="footer_footerBottom__HDfXI"><div class="footer_copyright__dP3SM">All rights reserved. Copyright © 2026 Okada Demo.</div><div class="footer_version__qesqk">1.0</div>' +
        '<div class="footer_additionalLinks__q7rNE"><a class="text-sm" href="javascript:void(0)">Privacy Policy</a><a class="text-sm" href="javascript:void(0)">Terms of Use</a><a class="text-sm" href="javascript:void(0)">Internet Fraud and Scam Alert</a></div></div>' +
      '</div></footer>';
  }

  function mobileBar() {
    return '<footer class="animate__animated animate__slideInUp MobileFooter_mobileFooter__w9dJp fr-mbar" id="fr-mbar" aria-label="Mobile navigation"><div class="MobileFooter_footerMenu__YCEUH">' +
      '<button type="button" class="z-0 group relative fb" id="mb-browse"><span class="ic">' + I.browse + '</span><span class="MobileFooter_label__5eyFp">Browse</span></button>' +
      '<button type="button" class="group relative inline-flex games" id="mb-games"><span class="ic">' + I.flower + '</span><span class="MobileFooter_label__5eyFp">Games</span></button>' +
      '<a class="z-0 group relative fb" href="promotions.html" id="mb-promo"><span class="ic">' + I.tag + '</span><span class="MobileFooter_label__5eyFp">Promo</span></a></div></footer>';
  }

  function loginDialog() {
    var s = S.load();
    var d = UI.dialog({ title: 'Login', body: '<p class="small">原型模擬登入:不使用帳號密碼,請選擇一個假資料玩家。</p><select id="login-player">' +
      s.players.map(function (p) { return '<option value="' + p.name + '">' + p.name + '</option>'; }).join('') + '</select>',
      actions: [{ label: 'Cancel', cls: 'sec' }, { label: 'Login', id: 'btn-do-login', onClick: function (close, root) {
        var v = root.querySelector('#login-player').value; S.mutate(function (x) { x.frontPlayer = v; }); close(); UI.toast('Welcome, ' + v, 'ok');
      } }] });
    return d;
  }

  /** 公告對話框(現有前台登入後於首頁彈出的輪播公告;原型以假資料呈現,比對腳本以 FR.announce() 開啟) */
  function announce() {
    if (document.getElementById('fr-ann')) return;
    var root = document.createElement('div'); root.id = 'fr-ann';
    root.innerHTML = '<div class="z-50 bg-overlay/50 backdrop-opacity-disabled fr-ann-mask"></div>' +
      '<div class="flex w-screen fixed fr-ann-wrap"><section class="fr-ann" role="dialog" aria-label="Announcement"><button type="button" class="appearance-none select-none end-1" aria-label="Close" id="fr-ann-close"><span>' + I.close + '</span></button>' +
      '<div class="fr-ann-body"><div class="overflow-hidden rounded-t-lg"><div class="-ml-1 flex touch-pan-y"><div class="relative w-full min-w-0"><div class="flex h-64 items-center"><div class="ph">Prototype announcement<br>原型公告(佔位,假資料)</div></div></div></div></div></div>' +
      '<footer class="flex flex-row gap-2"><div class="flex w-full justify-between"><button type="button" class="hover:text-plum-100 nav" aria-label="Previous">' + I.chevL + '</button>' +
      '<div class="flex flex-wrap items-center dots"><button type="button" class="flex h-3 cursor-pointer" aria-label="Slide 1"></button></div>' +
      '<button type="button" class="hover:text-plum-100 nav" aria-label="Next">' + I.chevR + '</button></div></footer></section></div>';
    document.body.appendChild(root);
    var close = function () { root.remove(); };
    root.querySelector('#fr-ann-close').onclick = close;
    root.querySelector('.fr-ann-mask').onclick = close;
    root.querySelector('.fr-ann-wrap').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
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
    var dd = hdr.querySelector('#wallet-dd');
    // 桌機:hover 錢包區(a.balanceFigure)展開,hover 刷新鈕不展開;離開錢包區與下拉框才收起
    // 下拉框以左欄定位,上緣緊貼錢包區下緣(y=58、x 與錢包區對齊),外層 8px 上內距為橋接,慢速移入途中不收起(REQ-0014 TC-04)
    var fig = hdr.querySelector('#nav-wallet');
    var enter = function () { if (!isTouchLayout()) openDD(); };
    var leave = function () { if (!isTouchLayout()) { clearTimeout(closeTimer); closeTimer = setTimeout(closeDD, 120); } };
    fig.addEventListener('mouseenter', enter); fig.addEventListener('mouseleave', leave);
    dd.addEventListener('mouseenter', function () { clearTimeout(closeTimer); }); dd.addEventListener('mouseleave', leave);
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
    if (ddOpen && !e.target.closest('#fr-wal, #wallet-dd')) closeDD();
    var menu = hdr.querySelector('#acc-menu'); if (menu && !menu.hidden && !e.target.closest('.fr-acc')) menu.hidden = true;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr && ddOpen) closeDD(); });

  /** FR.init({active, render(s, player), needLogin}) — 頁面需有 <main id="page" class="mx-auto w-[calc(100vw-218px)] max-w-main-content fr-main"> */
  function init(o) {
    document.body.classList.add('__variable_069ab3', 'front');
    var page = document.getElementById('page');
    var root = document.createElement('div'); root.id = 'fr-root';
    root.innerHTML = '<div class="flex min-h-dvh flex-col fr-shell"><div class="flex flex-col portrait:mb-portrait-mobile-footer fr-col"><div class="flex flex-1 bg-main-background fr-body" id="fr-body"></div>' + footer() + mobileBar() + '</div></div>';
    document.body.insertBefore(root, page);
    var body = root.querySelector('#fr-body');
    hdr = document.createElement('header'); hdr.className = 'topNav fr-topnav'; hdr.id = 'fr-topnav';
    body.appendChild(hdr);
    body.insertAdjacentHTML('beforeend', sidebar(o.active));
    body.appendChild(page);
    document.body.insertAdjacentHTML('beforeend', '<div id="chatLauncher" title="Live chat(原型佔位)"><span class="fr-ph">Chat</span></div><div class="fr-mask-side" id="fr-mask-side"></div>');
    var side = body.querySelector('#fr-side'), mask = document.getElementById('fr-mask-side');
    var toggleSide = function (on) { side.classList.toggle('open', on); mask.classList.toggle('open', on); };
    document.getElementById('mb-browse').onclick = function () { toggleSide(!side.classList.contains('open')); };
    document.getElementById('mb-games').onclick = function () { location.href = 'index.html'; };
    mask.onclick = function () { toggleSide(false); };
    root.querySelector('.footer_accordion__0wPtF').addEventListener('click', function (e) {
      var b = e.target.closest('[data-facc]'); if (!b) return;
      var p = root.querySelector('[data-facc-panel="' + b.getAttribute('data-facc') + '"]'); if (!p) return;
      p.hidden = !p.hidden; b.setAttribute('aria-expanded', String(!p.hidden));
    });

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
        page.innerHTML = '<div class="fr-card"><h2>Please log in</h2><p>Log in to view your wallet.</p><button type="button" class="z-0 group relative fr-gold md" id="btn-login2" style="margin-top:12px">Login</button></div>';
        page.querySelector('#btn-login2').onclick = loginDialog; return;
      }
      o.render(s, pl);
    };
    var s0 = S.load(); S.tick(s0); S.save(s0);
    S.onChange(draw); draw();
    if (window.Sim) {
      window.Sim.mountFloating();
      var fab = document.getElementById('sim-open'); if (fab) fab.classList.add('proto-only');
    }
  }
  /** REQ-0017:本頁 Claim 成功後自動更新一次頂部金額 */
  function onClaimSuccess() { syncBalances(); }
  window.FR = { init: init, loginDialog: loginDialog, syncBalances: syncBalances, onClaimSuccess: onClaimSuccess, refresh: refresh, isTouchLayout: isTouchLayout, announce: announce, icons: I };
})();
