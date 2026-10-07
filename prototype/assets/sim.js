/* 模擬控制台:觸發系統事件(報名、存款、下注/流水、等級點數、時間推進、角色、前台登入、重設)
 * 首頁內嵌;其他頁面右下角「模擬控制台」按鈕開啟側邊抽屜。所有頁面共用同一份 localStorage 狀態。 */
(function () {
  'use strict';
  var S = window.Store, esc = S.esc, money = S.money;

  var HTML =
    '<div class="sim">' +
    '<h2>模擬控制台 Simulator</h2>' +
    '<div class="small muted" style="margin-bottom:10px">原型專用:模擬玩家行為與系統事件。所有頁面共用同一份資料(localStorage),其他分頁會自動更新。</div>' +
    '<fieldset><legend>1. 模擬時鐘(UTC+8)</legend>' +
    '<div class="row">目前:<b class="sim-now"></b></div>' +
    '<div class="row"><button class="btn" data-act="h1">+1 小時</button><button class="btn" data-act="d1">+1 天</button>' +
    '<input class="sim-dt" placeholder="YYYY-MM-DD HH:mm" style="width:150px" aria-label="set time"><button class="btn" data-act="setdt">設定時間</button></div>' +
    '<div class="row"><select class="sim-promo-time" aria-label="promotion for time jump"></select></div>' +
    '<div class="row"><button class="btn" data-act="toEnd">推進到活動結束(結束後 1 秒)</button><button class="btn" data-act="toDeadline">推進到領取期截止後</button></div>' +
    '<div class="row small muted sim-promo-info"></div>' +
    '</fieldset>' +
    '<fieldset><legend>2. 玩家行為</legend>' +
    '<div class="row">玩家 <select class="sim-player" aria-label="simulated player"></select></div>' +
    '<div class="row small sim-player-info"></div>' +
    '<div class="row"><select class="sim-promo-opt" aria-label="promotion to opt in"></select><button class="btn" data-act="optin">報名 Opt-In(直接呼叫後端報名,不經前台按鈕)</button></div>' +
    '<div class="row"><input type="number" class="sim-dep" value="1000" min="1" aria-label="deposit amount"><button class="btn" data-act="deposit">模擬存款</button></div>' +
    '<div class="row"><input type="number" class="sim-bet" value="500" min="1" aria-label="bet amount"><button class="btn" data-act="bet">模擬下注(扣 OKash Balance,計流水)</button></div>' +
    '<div class="row"><input type="number" class="sim-to" value="1000" min="1" aria-label="turnover amount"><button class="btn" data-act="turnover">推進流水(不扣餘額)</button></div>' +
    '<div class="row"><input type="number" class="sim-tp" value="10" min="1" aria-label="tier points"><button class="btn" data-act="tier">推進等級點數</button></div>' +
    '</fieldset>' +
    '<fieldset><legend>3. 前台登入 / 後台角色</legend>' +
    '<div class="row">前台登入玩家 <select class="sim-front" aria-label="front logged-in player"></select></div>' +
    '<div class="row">後台角色 <select class="sim-role" aria-label="backoffice role"></select></div>' +
    '</fieldset>' +
    '<fieldset><legend>4. 同時 Claim 測試(TC-10)</legend>' +
    '<div class="row"><select class="sim-claimable" aria-label="claimable reward"></select></div>' +
    '<div class="row"><button class="btn" data-act="dblclaim">同時送出 2 次 Claim</button></div>' +
    '<div class="small muted">也可直接在前台快速連點 Claim,或開兩個分頁同時點。</div>' +
    '</fieldset>' +
    '<fieldset><legend>REQ-0013 日界測試派彩</legend>' +
    '<div class="small muted">預設已有 2026-10-06 23:59:59(player_demo14)與 2026-10-07 00:00:00(player_demo15)的派彩。按下後時鐘推進到 2026-10-07 23:59:59 由 player_demo16 領取,再推進到 2026-10-08 00:00:00 由 player_demo17 領取(時鐘只能往後,做完其他測試再按,或之後重設)。</div>' +
    '<div class="row"><button class="btn" data-act="boundary">產生 10-07 23:59:59 / 10-08 00:00:00 派彩</button></div>' +
    '</fieldset>' +
    '<fieldset><legend>5. 資料</legend><div class="row"><button class="btn err" data-act="reset">重設所有資料(回到預設假資料)</button></div></fieldset>' +
    '<div class="sim-msg" role="status"></div>' +
    '<h3>事件紀錄</h3><div class="sim-log"></div>' +
    '</div>';

  function opts(list, sel) { return list.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(sel) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join(''); }

  function build(root) {
    root.innerHTML = HTML;
    var $ = function (c) { return root.querySelector(c); };
    var msg = function (t, bad) { var m = $('.sim-msg'); m.innerHTML = '<span class="' + (bad ? 'bad-text' : 'ok-text') + '">' + esc(t) + '</span>'; };
    var run = function (fn, okText) {
      try { var r = S.mutate(fn); msg(typeof okText === 'function' ? okText(r) : (okText || '完成')); }
      catch (e) { msg(e.message, true); if (window.UI) UI.toast(e.message, 'err'); }
    };
    function refresh() {
      var s = S.load();
      $('.sim-now').textContent = S.fmt(s.now);
      var promoList = s.promos.map(function (p) { return [p.id, p.id + ' ' + p.name + '(' + p.from + '~' + p.to + ')']; });
      var keep = function (sel, list, def) { var cur = $(sel).value || def; $(sel).innerHTML = opts(list, cur); };
      keep('.sim-promo-time', promoList, s.promos[0].id);
      keep('.sim-promo-opt', promoList, 101);
      var pid = s.simPlayer;
      $('.sim-player').innerHTML = opts(s.players.map(function (p) { return [p.name, p.name]; }), pid);
      $('.sim-front').innerHTML = '<option value="">(未登入)</option>' + opts(s.players.map(function (p) { return [p.name, p.name]; }), s.frontPlayer);
      $('.sim-role').innerHTML = opts(Object.keys(S.ROLES).map(function (k) { return [k, S.ROLES[k].name]; }), s.role);
      var pl = S.player(s, pid);
      var pend = s.rewards.filter(function (r) { return r.playerId === pl.id && S.isPending(r); });
      var joined = s.optins.filter(function (o) { return o.playerId === pl.id; }).map(function (o) { return o.promoId; });
      $('.sim-player-info').innerHTML = 'OKash Balance <b>' + money(pl.okash) + '</b> · Free Play ' + money(pl.freePlay) + ' · 優惠錢包待領取 <b>' + money(pend.reduce(function (a, r) { return a + r.amount; }, 0)) + '</b>(' + pend.length + ' 筆)<br>已報名活動:' + (joined.join(', ') || '無');
      var act = s.optins.find(function (x) { return x.playerId === pl.id && S.depositTaskInProgress(s, x); });
      $('.sim-player-info').innerHTML += '<br>進行中的存款活動 <span class="tag-new">REQ-0012</span>:' + (act ? '<b class="sim-active-dep">' + esc(act.promoId + ' ' + S.promo(s, act.promoId).name) + '</b>(不能再報名其他存款活動)' : '<span class="sim-active-dep">無</span>');
      var p = S.promo(s, $('.sim-promo-time').value);
      if (p) $('.sim-promo-info').innerHTML = '活動結束:' + S.fmt(S.promoEnd(p)) + (p.distribution === 'promo_wallet' ? ' · 領取期 ' + p.claimDays + ' 天 → 截止 ' + S.fmt(S.promoEnd(p) + p.claimDays * S.DAY) : ' · 直接派發(無領取期)');
      var cl = s.rewards.filter(function (r) { return r.status === 'claimable'; });
      $('.sim-claimable').innerHTML = cl.length ? opts(cl.map(function (r) { return [r.id, r.id + ' · ' + S.player(s, r.playerId).name + ' · ' + money(r.amount)]; }), $('.sim-claimable').value) : '<option value="">(目前沒有可領取的獎勵)</option>';
      $('.sim-log').innerHTML = s.log.map(function (l) { return '<div><span class="muted">' + S.fmt(l.at) + '</span> ' + esc(l.text) + '</div>'; }).join('');
    }
    $('.sim-promo-time').addEventListener('change', refresh);
    $('.sim-player').addEventListener('change', function (e) { S.mutate(function (s) { s.simPlayer = e.target.value; }); });
    $('.sim-front').addEventListener('change', function (e) { S.mutate(function (s) { s.frontPlayer = e.target.value || null; }); msg('前台登入玩家:' + (e.target.value || '未登入')); });
    $('.sim-role').addEventListener('change', function (e) { S.mutate(function (s) { s.role = e.target.value; }); msg('後台角色:' + S.ROLES[e.target.value].name); });
    root.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-act'); if (!a) return;
      var pid = function (s) { return S.player(s, s.simPlayer).id; };
      if (a === 'h1') run(function (s) { S.setNow(s, s.now + 3600e3); }, '時鐘 +1 小時');
      if (a === 'd1') run(function (s) { S.setNow(s, s.now + S.DAY); }, '時鐘 +1 天');
      if (a === 'setdt') run(function (s) { var t = S.parseDT($('.sim-dt').value); if (t == null) throw new Error('時間格式:YYYY-MM-DD HH:mm'); S.setNow(s, t); }, '時鐘已設定');
      if (a === 'toEnd') run(function (s) { var p = S.promo(s, $('.sim-promo-time').value); var t = S.promoEnd(p) + 1000; if (t > s.now) S.setNow(s, t); else throw new Error('目前時間已在活動結束之後'); }, '已推進到活動結束後');
      if (a === 'toDeadline') run(function (s) {
        var p = S.promo(s, $('.sim-promo-time').value);
        var t = S.promoEnd(p) + (p.claimDays || 0) * S.DAY + 1000;
        if (t > s.now) S.setNow(s, t); else throw new Error('目前時間已在領取期截止之後');
      }, '已推進到領取期截止後');
      if (a === 'optin') run(function (s) { S.optIn(s, pid(s), $('.sim-promo-opt').value); }, '報名成功');
      if (a === 'deposit') run(function (s) { return S.deposit(s, pid(s), $('.sim-dep').value); }, function (r) { return r.join(';'); });
      if (a === 'bet') run(function (s) { S.bet(s, pid(s), $('.sim-bet').value); }, '下注成功,已計入流水');
      if (a === 'turnover') run(function (s) { S.addTurnover(s, pid(s), $('.sim-to').value); }, '已推進流水');
      if (a === 'tier') run(function (s) { S.addTierPoints(s, pid(s), $('.sim-tp').value); }, '已推進等級點數');
      if (a === 'boundary') run(function (s) {
        var t1 = S.parseDT('2026-10-07 23:59:59'), t2 = S.parseDT('2026-10-08 00:00:00');
        var r16 = s.rewards.find(function (r) { return r.playerId === 1016 && r.status === 'claimable'; });
        var r17 = s.rewards.find(function (r) { return r.playerId === 1017 && r.status === 'claimable'; });
        if (s.now > t1) throw new Error('目前時間已超過 2026-10-07 23:59:59,請先「重設所有資料」');
        if (!r16 || !r17) throw new Error('player_demo16 / player_demo17 沒有可領取的獎勵,請先「重設所有資料」');
        S.setNow(s, t1); S.tick(s); S.claim(s, r16.id, 1016);
        S.setNow(s, t2); S.tick(s); S.claim(s, r17.id, 1017);
      }, '已產生派彩:2026-10-07 23:59:59(player_demo16)、2026-10-08 00:00:00(player_demo17);時鐘 = 2026-10-08 00:00:00');
      if (a === 'reset') { if (confirm('確定重設所有原型資料?')) { S.reset(); msg('已重設'); } }
      if (a === 'dblclaim') {
        var id = $('.sim-claimable').value; if (!id) { msg('沒有可領取的獎勵', true); return; }
        var results = [];
        Promise.all([Sim.claimSafe(id, null), Sim.claimSafe(id, null)].map(function (p) { return p.then(function () { results.push('成功'); }, function (err) { results.push('失敗:' + err.message); }); }))
          .then(function () { msg('兩次 Claim 結果:' + results.join(' / ')); });
      }
    });
    S.onChange(refresh);
    refresh();
  }

  /** 以 Web Locks 跨分頁互斥:鎖內重新讀取最新狀態後才領取,保證只入帳一次 */
  function claimSafe(rewardId, playerName) {
    var work = function () {
      return new Promise(function (res) { setTimeout(res, 400); }).then(function () {
        return S.mutate(function (s) { return S.claim(s, rewardId, playerName); });
      });
    };
    if (navigator.locks && navigator.locks.request) return navigator.locks.request('okada-promo-wallet-claim', work);
    return work();
  }

  function mountInline(el) { build(el); }
  function mountFloating() {
    if (document.querySelector('.sim-fab') || document.getElementById('sim-inline')) return;
    var fab = document.createElement('button'); fab.className = 'sim-fab'; fab.textContent = '模擬控制台'; fab.id = 'sim-open';
    var drawer = document.createElement('div'); drawer.className = 'sim-drawer'; drawer.hidden = true; drawer.id = 'sim-drawer';
    var close = document.createElement('button'); close.className = 'btn sec sm'; close.textContent = '關閉 ✕'; close.style.float = 'right'; close.id = 'sim-close';
    var body = document.createElement('div');
    drawer.appendChild(close); drawer.appendChild(body);
    document.body.appendChild(fab); document.body.appendChild(drawer);
    build(body);
    fab.onclick = function () { drawer.hidden = false; fab.hidden = true; };
    close.onclick = function () { drawer.hidden = true; fab.hidden = false; };
  }
  window.Sim = { mountInline: mountInline, mountFloating: mountFloating, claimSafe: claimSafe };
})();
