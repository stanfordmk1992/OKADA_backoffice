/* 前台外框:頂部導航(含錢包入口 /en/wallet)、模擬登入 */
(function () {
  'use strict';
  var S = window.Store, esc = S.esc, money = S.money;
  function header(s, active) {
    var pl = s.frontPlayer ? S.player(s, s.frontPlayer) : null;
    var nav = [['index.html', 'Home', 'home'], ['promotions.html', 'Promotions', 'promotions'], ['points.html', 'Points', 'points']];
    var right = pl
      ? '<a class="fr-wallet' + (active === 'wallet' ? ' on' : '') + '" id="nav-wallet" href="wallet.html" title="Wallet"><span class="dot"></span>Wallet ₱ <span id="nav-balance">' + money(pl.okash) + '</span></a>' +
        '<span class="small" style="color:#9e9bb0">' + esc(pl.name) + '</span><button class="btn sec sm" id="btn-logout">Logout</button>'
      : '<button class="btn sm" id="btn-login" style="background:#f5c451;color:#1b1f2c">Login</button>';
    return '<header class="fr-top"><a class="fr-logo" href="index.html">OKADA</a><nav class="fr-nav">' +
      nav.map(function (n) { return '<a href="' + n[0] + '" class="' + (n[2] === active ? 'on' : '') + '">' + n[1] + '</a>'; }).join('') +
      '<a href="' + S.url('index.html') + '" class="small" style="color:#6f6b8a">← 原型首頁 / 後台</a></nav>' + right + '</header>';
  }
  function loginDialog() {
    var s = S.load();
    var d = UI.dialog({ title: 'Login(原型模擬登入)', body: '<p class="small">原型不使用帳號密碼,請選擇一個假資料玩家登入。</p><select id="login-player" style="width:100%">' +
      s.players.map(function (p) { return '<option value="' + p.name + '">' + p.name + '</option>'; }).join('') + '</select>',
      actions: [{ label: 'Cancel', cls: 'sec' }, { label: 'Login', id: 'btn-do-login', onClick: function (close, root) {
        var v = root.querySelector('#login-player').value; S.mutate(function (x) { x.frontPlayer = v; }); close(); UI.toast('Welcome, ' + v, 'ok');
      } }] });
    return d;
  }
  /** FR.init({active, render(s, player)}) — 需要 #page 容器 */
  function init(o) {
    document.body.classList.add('front');
    var page = document.getElementById('page');
    var hdr = document.createElement('div'); document.body.insertBefore(hdr, page);
    page.classList.add('fr-main');
    var draw = function () {
      var s = S.load();
      hdr.innerHTML = header(s, o.active);
      var lo = hdr.querySelector('#btn-logout'); if (lo) lo.onclick = function () { S.mutate(function (x) { x.frontPlayer = null; }); };
      var li = hdr.querySelector('#btn-login'); if (li) li.onclick = loginDialog;
      var pl = s.frontPlayer ? S.player(s, s.frontPlayer) : null;
      if (o.needLogin && !pl) { page.innerHTML = '<div class="fr-card"><h2>Please log in</h2><p>Log in to view your wallet.</p><button class="btn" id="btn-login2" style="background:#f5c451;color:#1b1f2c">Login</button></div>'; page.querySelector('#btn-login2').onclick = loginDialog; return; }
      o.render(s, pl);
    };
    var s0 = S.load(); S.tick(s0); S.save(s0);
    S.onChange(draw); draw();
    if (window.Sim) window.Sim.mountFloating();
  }
  window.FR = { init: init, loginDialog: loginDialog };
})();
