/* REQ-0008 優惠錢包原型 — 共用狀態與模擬引擎(所有頁面共用 localStorage)
 * 全部為假資料。時間一律以 UTC+8 顯示;模擬時鐘存在 state.now。 */
(function () {
  'use strict';
  var KEY = 'okada_proto_req0008_v6'; // v6:REQ-0015 經由優惠錢包的活動一律派發 OKash Balance(102、105 改 OKash)、新增 108 直接派發 + Free Play (HALO) // v5:REQ-0014 前台 Table / Slot Bonus Credit 假資料、TC-12 測試玩家 // v4:REQ-0013 日界測試派彩假資料 // v2:REQ-0011 交易紀錄加 Reward ID / 交易編號;v3:REQ-0012 假資料符合「存款任務同時只能參加一個」
  var TZ = 8 * 3600e3;
  var DAY = 86400e3;
  var ROOT = document.documentElement.getAttribute('data-root') || '';

  /* ---------- 格式 ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmt(ms) {
    if (ms == null) return '—';
    var d = new Date(ms + TZ);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + ' ' +
      pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
  }
  function fmtDate(ms) { return ms == null ? '—' : fmt(ms).slice(0, 10); }
  function dayStart(dateStr) { var p = dateStr.split('-').map(Number); return Date.UTC(p[0], p[1] - 1, p[2]) - TZ; }
  function dayEnd(dateStr) { return dayStart(dateStr) + DAY - 1000; }
  function parseDT(str) { // 'YYYY-MM-DD HH:mm[:ss]' or 'YYYY-MM-DDTHH:mm'
    var m = String(str).trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return null;
    return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)) - TZ;
  }
  function money(n) { return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function round2(n) { return Math.round(n * 100) / 100; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- 常數 ---------- */
  var PAYOUT = {
    igaming_credit: { name: 'OKash Balance', payoutListName: 'OKash Balance' },
    free_play_halo: { name: 'Free Play (HALO)', payoutListName: 'Free Play (HaLo)' }
  };
  var FREQ = { instant: 'Instant', end_of_promotion: 'End of Promotion' };
  var DIST = { direct: 'Direct Payout', promo_wallet: 'Via Promo Wallet' };
  var STATUS = {
    locked: { en: 'Locked', zh: '鎖定中', cls: 'st-locked' },
    claimable: { en: 'Claimable', zh: '可領取', cls: 'st-claimable' },
    claimed: { en: 'Claimed', zh: '已領取', cls: 'st-claimed' },
    expired: { en: 'Expired', zh: '已作廢', cls: 'st-expired' },
    cancelled: { en: 'Cancelled', zh: '已取消', cls: 'st-cancelled' }
  };
  var WALLET_TYPES = ['iGaming Bonus Wallet', 'iSlot Wallet', 'iTable Wallet', 'Live Slot Bonus Wallet', 'Live Table Bonus Wallet',
    'OKash Balance', 'OKASH Wallet', 'Provider Wallet', 'Safekeeping Wallet', 'Temp Wallet', 'Promo Wallet'];
  var PROVIDERS = ['YellowBat', 'ETG', 'Zitro', 'Nsoft', 'Jili', 'Fachai', 'iTable', 'iSLot', 'Skivot', 'Omniplay', 'JDB',
    'Playtech', 'Rps', 'Light & Wonder', 'Habanero', 'Pragmatic Play', 'Inferno Play'];
  var RANKS = ['All Member', 'Prime', 'Elite', 'Premium', 'Supreme', 'Maharlika', 'Okada Club', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Ruby', 'Diamond'];
  var DEP_OPTIONS = ['accumulative_deposit', 'first_deposit', 'first_promo_deposit', 'highest_deposit'];
  var TX = {
    DEPOSIT: 'Deposit', BET: 'Bet Placement', BONUS_PAYOUT: 'Bonus Payout',
    PW_ISSUE: 'Promo Wallet - Reward Issued', PW_CLAIM: 'Promo Wallet - Reward Claimed',
    PW_EXPIRY: 'Promo Wallet - Reward Expired', PW_CANCEL: 'Promo Wallet - Reward Cancelled'
  };

  /* ---------- 權限(模擬後台角色) ---------- */
  var ALL_PERMS = ['view:players', 'view:promotions-settings', 'create:promotions-settings', 'update:promotions-settings',
    'view:promotions-opt-in', 'view:promotions-payout', 'view:promo-wallet', 'update:promo-wallet', 'view:promo-wallet-report',
    'view:cashless-liability-report', 'view:fund-transaction-report', 'view:wallet-adjustment', 'view:audits'];
  var ROLES = {
    super_admin: { name: 'Super Admin(全部權限)', user: 'admin_demo', perms: ALL_PERMS },
    promo_viewer: { name: 'Promotion Viewer(可看優惠錢包,不可取消)', user: 'viewer_demo', perms: ALL_PERMS.filter(function (p) { return p !== 'update:promo-wallet'; }) },
    cs_agent: { name: 'CS Agent(無優惠錢包權限)', user: 'cs_demo', perms: ALL_PERMS.filter(function (p) { return ['view:promo-wallet', 'update:promo-wallet', 'view:promo-wallet-report'].indexOf(p) < 0; }) }
  };

  /* ---------- 狀態 ---------- */
  var listeners = [];
  function nextId(s, k) { s.seq[k] = (s.seq[k] || 0) + 1; return s.seq[k]; }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* ignore */ }
    var s = seed(); persist(s); return s;
  }
  function persist(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function save(s) { persist(s); listeners.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }
  function onChange(f) { listeners.push(f); }
  window.addEventListener('storage', function (e) { if (e.key === KEY) listeners.forEach(function (f) { f(); }); });
  /** 讀最新狀態 → 處理時間事件 → 執行 fn → 再處理時間事件 → 存檔 */
  function mutate(fn) {
    var s = load();
    tick(s);
    var r = fn(s);
    tick(s);
    save(s);
    return r;
  }
  function reset() { var s = seed(); save(s); return s; }

  /* ---------- 查找 ---------- */
  function player(s, id) { return s.players.find(function (p) { return p.id === Number(id) || p.name === id; }); }
  function promo(s, id) { return s.promos.find(function (p) { return p.id === Number(id); }); }
  function optin(s, id) { return s.optins.find(function (o) { return o.id === Number(id); }); }
  function reward(s, id) { return s.rewards.find(function (r) { return r.id === id; }); }
  function promoStart(p) { return dayStart(p.from); }
  function promoEnd(p) { return dayEnd(p.to); }
  function promoRunning(s, p) { return p.active && s.now >= promoStart(p) && s.now <= promoEnd(p); }
  function rewardResolvedAt(r) { return r.claimedAt || r.expiredAt || r.cancelledAt || null; }
  function isPending(r) { return r.status === 'locked' || r.status === 'claimable'; }
  /** 某時間點的待領取金額(鎖定中 + 可領取) */
  function pendingAt(s, t, filter) {
    return round2(s.rewards.reduce(function (sum, r) {
      if (filter && !filter(r)) return sum;
      var res = rewardResolvedAt(r);
      if (r.createdAt <= t && !(res != null && res <= t)) return sum + r.amount;
      return sum;
    }, 0));
  }
  function okashAt(s, pid, t) {
    var last = null;
    s.ftx.forEach(function (x) { if (x.playerId === pid && x.okash && x.at <= t) last = x; });
    var p = player(s, pid);
    return last ? last.after : p.okashInit;
  }
  function tasks(s, r) { // r 可為 reward 或 opt-in
    var o = r.optinId ? optin(s, r.optinId) : r; var p = promo(s, o.promoId);
    var dep = { done: !!o.qualified, cur: o.depositAmount || 0, target: p.min };
    var to = { done: o.turnover >= p.turnover, cur: o.turnover, target: p.turnover };
    var tp = p.tierPoints > 0 ? { done: o.tierPoints >= p.tierPoints, cur: o.tierPoints, target: p.tierPoints } : null;
    return { deposit: dep, turnover: to, tier: tp, all: dep.done && to.done && (!tp || tp.done) };
  }
  function log(s, text) { s.log.unshift({ at: s.now, text: text }); s.log = s.log.slice(0, 40); }

  /* ---------- 資金交易紀錄 ---------- */
  function pad6(n) { return String(n).padStart(6, '0'); }
  /** Ref ID = 交易編號:refPrefix + 交易流水號(例 DP-000012);未給 refPrefix 時沿用 o.ref(例:直接派彩 PO-n,不變) */
  function addFtx(s, o) {
    o.id = nextId(s, 'ftx'); o.status = o.status || 'Success';
    if (o.refPrefix) { o.ref = o.refPrefix + '-' + pad6(o.id); delete o.refPrefix; }
    if (o.rewardId === undefined) o.rewardId = null;
    s.ftx.push(o); return o;
  }
  /** 該玩家優惠錢包帳本最後一筆的 After(= 目前待領取金額) */
  function pwLedgerBalance(s, pid) {
    var last = null;
    s.ftx.forEach(function (x) { if (x.playerId === pid && x.pw) last = x; });
    return last ? last.after : 0;
  }
  function pwFtx(s, r, type, at, from, to, remarks) {
    // REQ-0011 優惠錢包帳本:Before = 上一筆的 After(前後餘額連續);產生為 +,領取 / 作廢 / 取消為 −
    var before = pwLedgerBalance(s, r.playerId);
    var after = round2(type === TX.PW_ISSUE ? before + r.amount : before - r.amount);
    return addFtx(s, { playerId: r.playerId, type: type, from: from, to: to, refPrefix: 'PWT', rewardId: r.id, pw: true, at: at, before: before, amount: r.amount, after: after, remarks: remarks, promoId: r.promoId });
  }
  function okashMove(s, pid, delta, at, o) {
    var p = player(s, pid);
    var before = p.okash; p.okash = round2(p.okash + delta);
    o.playerId = pid; o.at = at; o.before = before; o.amount = Math.abs(delta); o.after = p.okash; o.okash = true;
    return addFtx(s, o);
  }

  /* ---------- 時間事件:EoP 解鎖、直接派彩、作廢 ---------- */
  function tick(s) {
    s.promos.forEach(function (p) {
      var end = promoEnd(p);
      if (s.now > end && !p.endProcessed) {
        p.endProcessed = true;
        var at = end + 1000;
        s.optins.filter(function (o) { return o.promoId === p.id; }).forEach(function (o) {
          var t = tasks(s, o);
          if (p.distribution === 'direct') {
            if (p.freq === 'end_of_promotion' && t.all && !o.directPaid) directPayout(s, o, p, at);
          } else if (p.freq === 'end_of_promotion') {
            var r = s.rewards.find(function (x) { return x.optinId === o.id && x.status === 'locked'; });
            if (r && t.all) unlock(s, r, at, 'System(活動結束判定任務完成)');
          }
        });
      }
    });
    // 依截止時間先後處理,確保優惠錢包帳本依時間連續
    s.rewards.filter(function (r) { return isPending(r) && s.now > r.claimDeadline; })
      .sort(function (a, b) { return a.claimDeadline - b.claimDeadline || a.createdAt - b.createdAt; }).forEach(function (r) {
      {
        var at = r.claimDeadline + 1000;
        var prev = r.status;
        r.status = 'expired'; r.expiredAt = at;
        r.audit.push({ at: at, by: 'System', action: 'Expired', note: '活動結束且領取期已過,原狀態 ' + STATUS[prev].en });
        pwFtx(s, r, TX.PW_EXPIRY, at, 'Promo Wallet', '—(作廢,不入帳)', 'Promo ' + promo(s, r.promoId).name + ';原狀態 ' + STATUS[prev].en + ';By System');
        log(s, '獎勵 ' + r.id + ' 已作廢(' + player(s, r.playerId).name + ')');
      }
    });
  }
  function unlock(s, r, at, by) {
    r.status = 'claimable'; r.unlockedAt = at;
    r.audit.push({ at: at, by: by, action: 'Unlocked', note: '所有任務完成,可領取' });
    log(s, '獎勵 ' + r.id + ' 已解鎖(可領取)');
  }
  function directPayout(s, o, p, at) {
    var amount = round2(Math.min(o.depositAmount * p.pct / 100, p.maxCampaign));
    o.directPaid = true;
    var pay = { id: nextId(s, 'payout'), playerId: o.playerId, promoId: p.id, optinId: o.id, amount: amount, method: p.payout, date: at, status: 'Paid', route: 'direct', rewardId: null };
    s.payouts.push(pay);
    if (p.payout === 'igaming_credit') okashMove(s, o.playerId, amount, at, { type: TX.BONUS_PAYOUT, from: 'Promotion', to: 'OKash Balance', ref: 'PO-' + pay.id, remarks: 'Promo ' + p.name + '(Direct Payout)' });
    else player(s, o.playerId).freePlay = round2(player(s, o.playerId).freePlay + amount);
    log(s, '直接派彩 ' + money(amount) + ' → ' + PAYOUT[p.payout].name + '(' + player(s, o.playerId).name + ',' + p.name + ')');
  }
  /** Instant 活動:任務完成當下處理 */
  function progress(s, pid) {
    s.optins.filter(function (o) { return o.playerId === pid; }).forEach(function (o) {
      var p = promo(s, o.promoId);
      if (!promoRunning(s, p) || p.freq !== 'instant') return;
      var t = tasks(s, o);
      if (!t.all) return;
      if (p.distribution === 'direct') { if (!o.directPaid) directPayout(s, o, p, s.now); }
      else {
        var r = s.rewards.find(function (x) { return x.optinId === o.id && x.status === 'locked'; });
        if (r) unlock(s, r, s.now, 'System(任務完成)');
      }
    });
  }

  /* ---------- REQ-0012 存款任務活動同一時間只能參加一個 ---------- */
  /** 存款任務活動 = 設有存款條件(Minimum / Maximum Deposit)的活動,不分派發方式 */
  function isDepositTask(p) { return p.min != null || p.max != null; }
  /** 報名是否為「進行中」的存款任務:
   *  尚未參加成功且活動未結束;或已參加成功且獎勵鎖定中 / 可領取(直接派發:尚未派彩,活動結束後不再派彩) */
  function depositTaskInProgress(s, o) {
    var p = promo(s, o.promoId);
    if (!isDepositTask(p)) return false;
    if (!o.qualified) return s.now <= promoEnd(p);
    if (p.distribution === 'promo_wallet') {
      var r = s.rewards.find(function (x) { return x.optinId === o.id; });
      return !!r && isPending(r);
    }
    return !o.directPaid && s.now <= promoEnd(p);
  }
  /** 報名 promoId 時擋下的原因:回傳進行中的存款任務活動(或 null);沒有存款條件的活動不受限制 */
  function depositTaskBlock(s, pid, promoId) {
    var p = promo(s, promoId), pl = player(s, pid);
    if (!p || !pl || !isDepositTask(p)) return null;
    var o = s.optins.find(function (x) { return x.playerId === pl.id && x.promoId !== p.id && depositTaskInProgress(s, x); });
    return o ? promo(s, o.promoId) : null;
  }
  function depositTaskBlockMsg(bp) { return 'You already have an ongoing deposit promotion: ' + bp.name + '(你已有進行中的存款活動:' + bp.name + ')'; }

  /* ---------- 操作(由模擬控制台、前台、後台呼叫) ---------- */
  function optIn(s, pid, promoId) {
    var p = promo(s, promoId); var pl = player(s, pid);
    if (!p || !pl) throw new Error('找不到玩家或活動');
    if (!promoRunning(s, p)) throw new Error('活動不在期間內或已停用,無法報名');
    if (s.optins.some(function (o) { return o.playerId === pl.id && o.promoId === p.id; })) throw new Error('已報名過此活動');
    // REQ-0012 後端檢查(前台按鈕之外也擋,不能繞過)
    var bp = depositTaskBlock(s, pl.id, p.id);
    if (bp) throw new Error(depositTaskBlockMsg(bp));
    var o = { id: nextId(s, 'optin'), playerId: pl.id, promoId: p.id, joinedAt: s.now, depositHandled: false, qualified: false, depositAmount: 0, firstDepositAmount: null, turnover: 0, tierPoints: 0, directPaid: false, updatedAt: s.now };
    s.optins.push(o);
    log(s, pl.name + ' 報名 ' + p.name);
    return o;
  }
  function deposit(s, pid, amount) {
    amount = round2(Number(amount));
    if (!(amount > 0)) throw new Error('存款金額需大於 0');
    var pl = player(s, pid);
    var depTx = okashMove(s, pl.id, amount, s.now, { type: TX.DEPOSIT, from: '—', to: 'OKash Balance', refPrefix: 'DP', remarks: 'Simulated deposit' });
    var msgs = ['存款 ' + money(amount)];
    s.optins.filter(function (o) { return o.playerId === pl.id && !o.depositHandled; }).forEach(function (o) {
      var p = promo(s, o.promoId);
      if (!promoRunning(s, p) || !isDepositTask(p)) return; // 沒有存款條件的活動不判定存款
      o.depositHandled = true; o.firstDepositAmount = amount; o.updatedAt = s.now;
      if (amount < p.min || amount > p.max) {
        msgs.push(p.name + ':報名後第一筆存款 ' + money(amount) + ' 不在 ' + money(p.min) + '~' + money(p.max) + ' 範圍,不算參加');
        return;
      }
      o.qualified = true; o.depositAmount = amount; o.depositRef = depTx.ref;
      if (p.distribution === 'promo_wallet') {
        var amt = round2(Math.min(amount * p.pct / 100, p.maxCampaign));
        var r = {
          id: 'PW-' + String(nextId(s, 'reward')).padStart(6, '0'), playerId: pl.id, promoId: p.id, optinId: o.id,
          depositAmount: amount, depositRef: depTx.ref, amount: amt, payout: p.payout, createdAt: s.now, unlockedAt: null, claimedAt: null,
          expiredAt: null, cancelledAt: null, cancelledBy: null, cancelReason: null, status: 'locked',
          claimDeadline: promoEnd(p) + p.claimDays * DAY, audit: []
        };
        r.audit.push({ at: s.now, by: 'System', action: 'Issued', note: '第一筆符合存款 ' + money(amount) + ' × ' + p.pct + '%' + (amount * p.pct / 100 > p.maxCampaign ? '(超過上限,以 Max Campaign Amount ' + money(p.maxCampaign) + ' 計)' : '') });
        s.rewards.push(r);
        pwFtx(s, r, TX.PW_ISSUE, s.now, 'Promotion', 'Promo Wallet', 'Promo ' + p.name + ';Deposit ' + money(amount) + ' × ' + p.pct + '%;By System');
        msgs.push(p.name + ':產生獎勵 ' + r.id + ' ' + money(amt) + '(鎖定中)');
      } else {
        msgs.push(p.name + ':符合參加(直接派發活動,不進優惠錢包)');
      }
    });
    log(s, pl.name + ' ' + msgs.join(';'));
    progress(s, pl.id);
    return msgs;
  }
  function addTurnover(s, pid, amount, label) {
    amount = round2(Number(amount));
    if (!(amount > 0)) throw new Error('金額需大於 0');
    var pl = player(s, pid);
    s.optins.filter(function (o) { return o.playerId === pl.id; }).forEach(function (o) {
      if (promoRunning(s, promo(s, o.promoId))) { o.turnover = round2(o.turnover + amount); o.updatedAt = s.now; }
    });
    log(s, pl.name + ' ' + (label || '流水') + ' +' + money(amount) + '(計入進行中活動)');
    progress(s, pl.id);
  }
  function bet(s, pid, amount) {
    amount = round2(Number(amount));
    var pl = player(s, pid);
    if (!(amount > 0)) throw new Error('下注金額需大於 0');
    if (amount > pl.okash) throw new Error('可下注餘額不足:OKash Balance ' + money(pl.okash) + '。優惠錢包的鎖定中 / 可領取獎勵不能用來下注。');
    okashMove(s, pl.id, -amount, s.now, { type: TX.BET, from: 'OKash Balance', to: 'Provider Wallet', refPrefix: 'BT', remarks: 'Simulated bet' });
    addTurnover(s, pid, amount, '下注 ' + money(amount) + ',流水');
  }
  function addTierPoints(s, pid, pts) {
    pts = Number(pts); if (!(pts > 0)) throw new Error('點數需大於 0');
    var pl = player(s, pid);
    s.optins.filter(function (o) { return o.playerId === pl.id; }).forEach(function (o) {
      if (promoRunning(s, promo(s, o.promoId))) { o.tierPoints += pts; o.updatedAt = s.now; }
    });
    log(s, pl.name + ' 等級點數 +' + pts);
    progress(s, pl.id);
  }
  function claim(s, rewardId, pid) {
    var r = reward(s, rewardId);
    if (!r || (pid != null && r.playerId !== player(s, pid).id)) throw new Error('找不到獎勵');
    if (r.status === 'claimed') throw new Error('This reward has already been claimed.(此獎勵已領取,不可重複領取)');
    if (r.status === 'expired') throw new Error('The claim period has ended.(領取期已結束,獎勵已作廢)');
    if (r.status === 'cancelled') throw new Error('This reward has been cancelled.(獎勵已取消)');
    if (r.status !== 'claimable') throw new Error('Tasks not completed yet.(任務未完成,尚不可領取)');
    if (s.now > r.claimDeadline) throw new Error('The claim period has ended.');
    var p = promo(s, r.promoId);
    r.status = 'claimed'; r.claimedAt = s.now;
    r.audit.push({ at: s.now, by: player(s, r.playerId).name + '(Player)', action: 'Claimed', note: '派發到 ' + PAYOUT[r.payout].name });
    var pay = { id: nextId(s, 'payout'), playerId: r.playerId, promoId: r.promoId, optinId: r.optinId, amount: r.amount, method: r.payout, date: s.now, status: 'Paid', route: 'promo_wallet', rewardId: r.id };
    s.payouts.push(pay);
    // REQ-0011:不論派發到哪個錢包,優惠錢包帳本一律寫一筆 Reward Claimed
    pwFtx(s, r, TX.PW_CLAIM, s.now, 'Promo Wallet', PAYOUT[r.payout].name, 'Promo ' + p.name + ';Claim → ' + PAYOUT[r.payout].name + (r.payout === 'free_play_halo' ? '(送外部系統 HALO)' : '') + ';Payout ID ' + pay.id);
    if (r.payout === 'igaming_credit') {
      // 派發到 OKash Balance:另寫一筆 Bonus Payout(OKash Balance 帳),以同一 Reward ID 關聯
      var bp = okashMove(s, r.playerId, r.amount, s.now, { type: TX.BONUS_PAYOUT, from: 'Promo Wallet', to: 'OKash Balance', refPrefix: 'BP', rewardId: r.id, remarks: 'Promo ' + p.name + ';Claim via Promo Wallet;Payout ID ' + pay.id, promoId: r.promoId });
      pay.bonusRef = bp.ref;
    } else {
      var pl = player(s, r.playerId); pl.freePlay = round2(pl.freePlay + r.amount);
    }
    log(s, player(s, r.playerId).name + ' 領取 ' + r.id + ' ' + money(r.amount) + ' → ' + PAYOUT[r.payout].name);
    return r;
  }
  function cancelReward(s, rewardId, reason, user) {
    reason = String(reason || '').trim();
    if (!reason) throw new Error('Cancellation reason is required.(必填取消原因)');
    var r = reward(s, rewardId);
    if (!r) throw new Error('找不到獎勵');
    if (!isPending(r)) throw new Error('只有鎖定中或可領取的獎勵可以取消(目前:' + STATUS[r.status].en + ')');
    var prev = r.status;
    r.status = 'cancelled'; r.cancelledAt = s.now; r.cancelledBy = user; r.cancelReason = reason;
    r.audit.push({ at: s.now, by: user, action: 'Cancelled', note: reason });
    s.audits.push({ id: nextId(s, 'audit'), at: s.now, user: user, module: 'Promo Wallet', action: 'Cancel Reward', target: r.id + '(' + player(s, r.playerId).name + ',' + money(r.amount) + ',原狀態 ' + STATUS[prev].en + ')', reason: reason });
    pwFtx(s, r, TX.PW_CANCEL, s.now, 'Promo Wallet', '—(取消,不入帳)', 'Promo ' + promo(s, r.promoId).name + ';By ' + user + ';Reason: ' + reason);
    log(s, user + ' 取消獎勵 ' + r.id + ':' + reason);
    return r;
  }
  /** REQ-0015 後端檢查:經由優惠錢包只能派發到 OKash Balance(不靠前端,模擬控制台 / 直接呼叫也擋) */
  var PW_HALO_MSG = 'Via Promo Wallet can only pay out to OKash Balance.(經由優惠錢包的獎勵只能派發到 OKash Balance,不能派發到 Free Play (HALO))';
  function savePromo(s, data, user) {
    var p;
    if (data.id && !promo(s, data.id)) throw new Error('找不到活動');
    var merged = Object.assign({}, data.id ? promo(s, data.id) : {}, data);
    if (merged.distribution === 'promo_wallet' && merged.payout !== 'igaming_credit') throw new Error(PW_HALO_MSG);
    if (data.id) {
      p = promo(s, data.id); Object.assign(p, data); p.updatedAt = s.now; p.updatedBy = user;
      s.audits.push({ id: nextId(s, 'audit'), at: s.now, user: user, module: 'Promotion Settings', action: 'Update Promotion', target: p.id + ' ' + p.name, reason: '' });
    } else {
      p = Object.assign({ id: 100 + nextId(s, 'promo'), active: true, endProcessed: false, createdAt: s.now, createdBy: user, updatedAt: s.now, updatedBy: user }, data);
      delete p.idPlaceholder;
      s.promos.push(p);
      s.audits.push({ id: nextId(s, 'audit'), at: s.now, user: user, module: 'Promotion Settings', action: 'Create Promotion', target: p.id + ' ' + p.name, reason: '' });
    }
    if (s.now <= promoEnd(p)) p.endProcessed = false;
    log(s, user + ' 儲存促銷設定 ' + p.name);
    return p;
  }
  function setNow(s, ms) {
    if (ms < s.now) throw new Error('模擬時鐘只能往後推進');
    s.now = ms; log(s, '時鐘推進到 ' + fmt(ms));
  }

  /* ---------- REQ-0011 追溯鏈 ---------- */
  /** 獎勵的追溯節點(依時間):報名、來源存款、產生、解鎖、領取 / 作廢 / 取消、派彩紀錄、Bonus Payout。
   *  link.page + link.q = 跳到對應紀錄的頁面;link.anchor = 同一詳情內的區塊 */
  function trace(s, r) {
    var o = optin(s, r.optinId), nodes = [], seq = 0;
    var txOf = function (type) { return s.ftx.find(function (x) { return x.rewardId === r.id && x.type === type; }); };
    var ftxLink = function (x) { return { page: 'reports/fund-transaction/list.html', q: 'ref=' + x.ref }; };
    var add = function (n) { n.seq = seq++; nodes.push(n); };
    if (o) add({ key: 'optin', at: o.joinedAt, label: 'Opt-In 報名', ref: 'Opt-In ID ' + o.id, link: { page: 'promotions/opt-in/list.html', q: 'id=' + o.id } });
    var dep = r.depositRef ? s.ftx.find(function (x) { return x.ref === r.depositRef; }) : null;
    if (dep) add({ key: 'deposit', at: dep.at, label: 'Source Deposit 來源存款(參加成功)', ref: dep.ref, amount: dep.amount, link: ftxLink(dep) });
    var iss = txOf(TX.PW_ISSUE);
    if (iss) add({ key: 'issued', at: iss.at, label: 'Issued 產生(鎖定中)', ref: iss.ref, amount: iss.amount, link: ftxLink(iss) });
    if (r.unlockedAt) add({ key: 'unlocked', at: r.unlockedAt, label: 'Unlocked 解鎖(可領取)', ref: 'Audit Trail', link: { anchor: 'tbl-audit' } });
    var cl = txOf(TX.PW_CLAIM);
    if (cl) add({ key: 'claimed', at: cl.at, label: 'Claimed 領取(Reward Claimed)', ref: cl.ref, amount: cl.amount, note: '→ ' + PAYOUT[r.payout].name, link: ftxLink(cl) });
    var pay = s.payouts.find(function (x) { return x.rewardId === r.id; });
    if (pay) add({ key: 'payout', at: pay.date, label: 'Promotion Payout 派彩紀錄', ref: 'Payout ID ' + pay.id, amount: pay.amount, note: PAYOUT[pay.method].payoutListName + ' · ' + pay.status, link: { page: 'promotions/payout/list.html', q: 'id=' + pay.id } });
    var bp = txOf(TX.BONUS_PAYOUT);
    if (bp) add({ key: 'bonus', at: bp.at, label: 'Bonus Payout → OKash Balance', ref: bp.ref, amount: bp.amount, link: ftxLink(bp) });
    var ex = txOf(TX.PW_EXPIRY);
    if (ex) add({ key: 'expired', at: ex.at, label: 'Expired 作廢', ref: ex.ref, amount: ex.amount, note: 'By System(活動結束且領取期已過,未入帳)', link: ftxLink(ex) });
    var ca = txOf(TX.PW_CANCEL);
    if (ca) add({ key: 'cancelled', at: ca.at, label: 'Cancelled 取消', ref: ca.ref, amount: ca.amount, note: 'By ' + r.cancelledBy + ';Reason: ' + r.cancelReason + '(未入帳)', link: ftxLink(ca) });
    nodes.sort(function (a, b) { return a.at - b.at || a.seq - b.seq; });
    return nodes;
  }

  /* ---------- 報表計算 ---------- */
  function inRange(t, a, b) { return t != null && t >= a && t <= b; }
  function summarize(s, rewards, from, to) { // from/to ms;to 已截到 now
    var o = { opening: 0, issuedN: 0, issued: 0, unlockedN: 0, unlocked: 0, claimedN: 0, claimed: 0, expiredN: 0, expired: 0, cancelledN: 0, cancelled: 0, closing: 0 };
    var ids = {}; rewards.forEach(function (r) { ids[r.id] = 1; });
    var f = function (r) { return ids[r.id]; };
    o.opening = pendingAt(s, from - 1, f);
    o.closing = pendingAt(s, to, f);
    rewards.forEach(function (r) {
      if (inRange(r.createdAt, from, to)) { o.issuedN++; o.issued += r.amount; }
      if (inRange(r.unlockedAt, from, to)) { o.unlockedN++; o.unlocked += r.amount; }
      if (inRange(r.claimedAt, from, to)) { o.claimedN++; o.claimed += r.amount; }
      if (inRange(r.expiredAt, from, to)) { o.expiredN++; o.expired += r.amount; }
      if (inRange(r.cancelledAt, from, to)) { o.cancelledN++; o.cancelled += r.amount; }
    });
    ['issued', 'unlocked', 'claimed', 'expired', 'cancelled'].forEach(function (k) { o[k] = round2(o[k]); });
    o.calc = round2(o.opening + o.issued - o.claimed - o.expired - o.cancelled);
    o.ok = Math.abs(o.calc - o.closing) < 0.005;
    return o;
  }
  function dateList(fromStr, toStr) {
    var out = []; for (var t = dayStart(fromStr); t <= dayStart(toStr); t += DAY) out.push(fmtDate(t)); return out;
  }

  /* ---------- REQ-0014 前台錢包 ---------- */
  /** 優惠錢包合計:鎖定 = 鎖定中;可領取 = 可領取(已領取 / 已作廢 / 已取消不計入) */
  function promoSums(s, pid) {
    var o = { locked: 0, claimable: 0, lockedN: 0, claimableN: 0 };
    s.rewards.forEach(function (r) {
      if (r.playerId !== pid) return;
      if (r.status === 'locked') { o.locked = round2(o.locked + r.amount); o.lockedN++; }
      if (r.status === 'claimable') { o.claimable = round2(o.claimable + r.amount); o.claimableN++; }
    });
    return o;
  }
  /** 前台頂部錢包下拉的 4 個錢包(讀取當下的值) */
  function frontWallets(s, pid) {
    var pl = player(s, pid), pw = promoSums(s, pl.id);
    return { okash: pl.okash, table: pl.liveTableBonus, slot: pl.liveSlotBonus, locked: pw.locked, claimable: pw.claimable };
  }
  /** 前台會員編號(假資料) */
  function memberNo(pl) { return 'OM' + String(pl.id).padStart(9, '0'); }
  /** REQ-0014 TC-12 測試玩家 player_demo18:鎖定 500 + 300、可領取 1,000,另有已領取 / 已作廢 / 已取消各一筆。
   *  REQ-0012 之後同一玩家不會同時有多筆進行中的存款活動獎勵,故此資料直接寫入(繞過報名檢查),只用來驗證金額加總。 */
  function addTc12Player(s) {
    if (player(s, 'player_demo18')) throw new Error('player_demo18 已存在(要重建請先「重設所有資料」)');
    var pid = 1018, n = 'player_demo18';
    s.players.push({ id: pid, name: n, email: 'demo18@example.test', status: 'Active', referral: 'RFDEMO18', upline: '—', okash: 3000, okashInit: 3000, freePlay: 0, circlePoint: 900,
      igBonus: 0, liveSlotBonus: 420, liveTableBonus: 680, createdAt: s.now - 30 * DAY });
    var created = s.now - 3600e3;
    function mk(promoId, dep, amt, turnover, claimable, createdAt) {
      var p = promo(s, promoId);
      var o = { id: nextId(s, 'optin'), playerId: pid, promoId: p.id, joinedAt: createdAt - 600e3, depositHandled: true, qualified: true, depositAmount: dep, firstDepositAmount: dep, turnover: turnover, tierPoints: 0, directPaid: false, updatedAt: createdAt, test: 'REQ-0014 TC-12' };
      s.optins.push(o);
      var r = { id: 'PW-' + String(nextId(s, 'reward')).padStart(6, '0'), playerId: pid, promoId: p.id, optinId: o.id, depositAmount: dep, depositRef: null, amount: amt, payout: p.payout,
        createdAt: createdAt, unlockedAt: null, claimedAt: null, expiredAt: null, cancelledAt: null, cancelledBy: null, cancelReason: null, status: 'locked',
        claimDeadline: promoEnd(p) + p.claimDays * DAY, audit: [{ at: createdAt, by: 'System', action: 'Issued', note: 'REQ-0014 TC-12 測試資料(直接寫入)' }] };
      s.rewards.push(r);
      pwFtx(s, r, TX.PW_ISSUE, createdAt, 'Promotion', 'Promo Wallet', 'Promo ' + p.name + ';REQ-0014 TC-12 測試資料');
      if (claimable) unlock(s, r, createdAt + 60e3, 'System(任務完成)');
      return r;
    }
    mk(105, 500, 500, 0, false, created);          // 鎖定 500(流水 0 / 1,000)
    mk(103, 1500, 300, 0, false, created);         // 鎖定 300(流水 0 / 5,000)
    mk(101, 1000, 1000, 3000, true, created);      // 可領取 1,000(派發 OKash Balance)
    var c = mk(102, 400, 200, 2000, true, created); claim(s, c.id, pid);                                            // 已領取 200
    var x = mk(103, 500, 100, 0, false, created); cancelReward(s, x.id, 'REQ-0014 TC-12 測試資料:取消', 'admin_demo'); // 已取消 100
    var e = mk(107, 750, 150, 0, false, Math.min(created, parseDT('2026-10-03 10:00'))); e.claimDeadline = Math.min(e.claimDeadline, s.now - 1000); // 已作廢 150
    tick(s);
    s.frontPlayer = n; s.simPlayer = n;
    log(s, '已建立 REQ-0014 TC-12 測試玩家 player_demo18(鎖定 500 + 300、可領取 1,000;已領取 200 / 已作廢 150 / 已取消 100 不計入)');
  }

  /* ---------- 假資料 ---------- */
  function seed() {
    var t0 = dayStart('2026-10-01');
    var s = {
      version: 1, now: t0, seq: { reward: 0, optin: 0, payout: 0, ftx: 0, audit: 0, promo: 5 },
      role: 'super_admin', frontPlayer: 'player_demo01', simPlayer: 'player_demo01', seedStart: '2026-10-01',
      players: [], promos: [], optins: [], rewards: [], payouts: [], ftx: [], audits: [], log: []
    };
    // [編號, OKash Balance, Free Play, iGaming Bonus, Live Table Bonus, Live Slot Bonus]
    // REQ-0014:player_demo01 有 Table / Slot Bonus Credit 假資料(前台頂部錢包下拉、/en/points 讀同一份)
    [[1, 20000, 0, 0, 1250, 860.5], [2, 5000, 0, 0, 3], [3, 30000, 0, 50, 0], [4, 8000, 150, 0, 0], [5, 3000, 0, 0, 0], [6, 6000, 300, 0, 0], [7, 10000, 0, 0, 0], [8, 12000, 0, 25, 0],
      [9, 7000, 0, 0, 0], [10, 15000, 0, 0, 0], [11, 4000, 0, 0, 0], [12, 9000, 0, 0, 0], [13, 2000, 0, 0, 0],
      [14, 5000, 0, 0, 0], [15, 5000, 0, 0, 0], [16, 5000, 0, 0, 0], [17, 5000, 0, 0, 0]].forEach(function (d, i) {
      var n = 'player_demo' + pad(d[0]);
      s.players.push({
        id: 1000 + d[0], name: n, email: n.replace('player_', '') + '@example.test', status: 'Active', referral: 'RF' + n.slice(-6).toUpperCase(), upline: '—',
        okash: d[1], okashInit: d[1], freePlay: d[2], circlePoint: 1200 + i * 100,
        igBonus: d[3], liveSlotBonus: d[5] || 0, liveTableBonus: d[4], createdAt: t0 - 30 * DAY
      });
    });
    function P(o) {
      return Object.assign({ ranks: ['All Member'], depOption: 'first_promo_deposit', vendors: ['Pragmatic Play', 'Jili', 'Playtech'], tnc: '<p>Demo terms. Fake data for prototype only.</p>',
        active: true, endProcessed: false, createdAt: t0 - 2 * DAY, createdBy: 'admin_demo', updatedAt: t0 - 2 * DAY, updatedBy: 'admin_demo', banner: '' }, o);
    }
    s.promos.push(P({ id: 101, name: 'Promo Wallet Welcome 100%', from: '2026-10-01', to: '2026-10-20', min: 500, max: 50000, freq: 'instant', payout: 'igaming_credit', pct: 100, maxCampaign: 5000, turnover: 3000, tierPoints: 0, distribution: 'promo_wallet', claimDays: 0 }));
    // REQ-0015:經由優惠錢包的活動一律派發 OKash Balance(102、105 原為 Free Play (HALO))
    s.promos.push(P({ id: 102, name: 'Weekend Reload 50% (End of Promotion)', from: '2026-10-05', to: '2026-10-12', min: 1000, max: 20000, freq: 'end_of_promotion', payout: 'igaming_credit', pct: 50, maxCampaign: 3000, turnover: 2000, tierPoints: 50, distribution: 'promo_wallet', claimDays: 3 }));
    s.promos.push(P({ id: 103, name: 'Midweek Cashback 20%', from: '2026-10-01', to: '2026-10-10', min: 1000, max: 100000, freq: 'instant', payout: 'igaming_credit', pct: 20, maxCampaign: 1000, turnover: 5000, tierPoints: 0, distribution: 'promo_wallet', claimDays: 1 }));
    s.promos.push(P({ id: 104, name: 'Classic Reload 30% (Direct)', from: '2026-10-01', to: '2026-10-31', min: 500, max: 20000, freq: 'instant', payout: 'igaming_credit', pct: 30, maxCampaign: 3000, turnover: 2000, tierPoints: 0, distribution: 'direct', claimDays: null }));
    s.promos.push(P({ id: 105, name: 'Bonus Boost 100%', from: '2026-10-01', to: '2026-10-10', min: 500, max: 10000, freq: 'instant', payout: 'igaming_credit', pct: 100, maxCampaign: 2000, turnover: 1000, tierPoints: 0, distribution: 'promo_wallet', claimDays: 1 }));
    // REQ-0011:已結束的活動(10-05 結束、領取期 1 天 → 10-07 00:00:00 作廢),提供作廢的追溯資料
    s.promos.push(P({ id: 107, name: 'Early October Reload 20% (Ended)', from: '2026-10-01', to: '2026-10-05', min: 500, max: 20000, freq: 'instant', payout: 'igaming_credit', pct: 20, maxCampaign: 1000, turnover: 4000, tierPoints: 0, distribution: 'promo_wallet', claimDays: 1 }));
    // REQ-0012:沒有存款條件的活動(原型測試用;現行後台 Min/Max Deposit 為必填,無法由表單建立此類活動;本原型不模擬其派彩)
    s.promos.push(P({ id: 106, name: 'Turnover Challenge (No Deposit Requirement)', from: '2026-10-01', to: '2026-10-31', min: null, max: null, depOption: '', freq: 'instant', payout: 'igaming_credit', pct: 10, maxCampaign: 500, turnover: 5000, tierPoints: 0, distribution: 'direct', claimDays: null }));
    // REQ-0015 TC-09:直接派發 + Free Play (HALO) 的活動(達標後直接派彩到 HALO,不進優惠錢包)
    s.promos.push(P({ id: 108, name: 'Free Play Direct 50% (HALO)', from: '2026-10-01', to: '2026-10-31', min: 500, max: 10000, freq: 'instant', payout: 'free_play_halo', pct: 50, maxCampaign: 1000, turnover: 1000, tierPoints: 0, distribution: 'direct', claimDays: null }));
    s.promos.sort(function (a, b) { return a.id - b.id; });
    s.seq.promo = 8;
    function at(str) { s.now = parseDT(str); tick(s); }
    var rw = function (pid, promoId) { return s.rewards.find(function (r) { return r.playerId === pid && r.promoId === promoId; }).id; };
    // 歷史:player_demo08 先參加 103 並領取,之後才報名 104(直接派發)並派彩(REQ-0012:存款任務一次只能參加一個)
    at('2026-10-02 09:00'); optIn(s, 1008, 103);
    at('2026-10-02 09:10'); deposit(s, 1008, 5000);
    at('2026-10-02 11:00'); addTurnover(s, 1008, 5000);
    at('2026-10-02 12:00'); claim(s, rw(1008, 103), 1008);
    // REQ-0011 TC-03 / 05 / 06:player_demo10 依序 A 領取(101,OKash)→ B 作廢(107)→ C 取消(103)
    at('2026-10-02 12:10'); optIn(s, 1010, 101);
    at('2026-10-02 12:20'); deposit(s, 1010, 1000);
    at('2026-10-02 12:40'); addTurnover(s, 1010, 3000);
    at('2026-10-02 12:50'); claim(s, rw(1010, 101), 1010);
    at('2026-10-02 13:00'); optIn(s, 1010, 107);
    at('2026-10-02 13:10'); deposit(s, 1010, 2000);
    at('2026-10-02 13:30'); optIn(s, 1008, 104);
    at('2026-10-02 13:40'); deposit(s, 1008, 5000);
    at('2026-10-02 14:00'); addTurnover(s, 1008, 2000);
    // REQ-0012 TC-04(已作廢):player_demo11 參加 107 → 10-07 00:00:00 作廢;TC-05:player_demo13 報名 107 始終未存款,活動已結束
    at('2026-10-02 15:00'); optIn(s, 1011, 107); optIn(s, 1013, 107);
    at('2026-10-02 15:10'); deposit(s, 1011, 1000);
    // REQ-0008 TC-14:player_demo05 一筆鎖定中(103)、player_demo09 一筆可領取(105);兩活動都 10-10 結束、領取期 1 天
    // (REQ-0012 後同一玩家不能同時有兩個進行中的存款活動,故分成兩位玩家)
    at('2026-10-03 10:00'); optIn(s, 1005, 103); optIn(s, 1009, 105);
    at('2026-10-03 10:05'); deposit(s, 1005, 2000); deposit(s, 1009, 2000);
    at('2026-10-03 15:00'); addTurnover(s, 1005, 1200); addTurnover(s, 1009, 1200);
    // REQ-0012 TC-04(已取消):player_demo12 參加 103 後由後台取消
    at('2026-10-03 16:00'); optIn(s, 1012, 103);
    at('2026-10-03 16:10'); deposit(s, 1012, 1000);
    at('2026-10-04 10:00'); cancelReward(s, rw(1012, 103), '測試資料:重複帳號,取消獎勵', 'admin_demo');
    // 測試用新報名(尚未存款)
    at('2026-10-06 10:00');
    optIn(s, 1001, 101); optIn(s, 1002, 101); optIn(s, 1003, 101); optIn(s, 1004, 102); optIn(s, 1006, 108); optIn(s, 1007, 104);
    // REQ-0013 日界測試:player_demo14 於 10-06 23:59:59 領取(前一日)、player_demo15 於 10-07 00:00:00 領取;
    // player_demo16 / 17 為可領取,保留給模擬控制台「REQ-0013 日界測試」於 10-07 23:59:59 / 10-08 00:00:00 領取
    at('2026-10-06 20:00'); optIn(s, 1014, 105); optIn(s, 1015, 101); optIn(s, 1016, 101); optIn(s, 1017, 105);
    at('2026-10-06 20:10'); deposit(s, 1014, 1000); deposit(s, 1015, 1000); deposit(s, 1016, 800); deposit(s, 1017, 600);
    at('2026-10-06 21:00'); addTurnover(s, 1014, 1000); addTurnover(s, 1015, 3000); addTurnover(s, 1016, 3000); addTurnover(s, 1017, 1000);
    at('2026-10-06 23:59:59'); claim(s, rw(1014, 105), 1014);
    at('2026-10-07 00:00:00'); claim(s, rw(1015, 101), 1015);
    // player_demo10 的 B(107)於 10-07 00:00:00 作廢;之後產生 C(103)並由後台取消
    at('2026-10-07 08:00'); optIn(s, 1010, 103);
    at('2026-10-07 08:10'); deposit(s, 1010, 1500);
    at('2026-10-07 09:00'); cancelReward(s, rw(1010, 103), '測試資料:玩家重複申請,取消獎勵', 'admin_demo');
    at('2026-10-07 10:00');
    s.log = [{ at: s.now, text: '已載入預設假資料(模擬時鐘 2026-10-07 10:00:00)' }];
    return s;
  }

  function can(s, perm) { return ROLES[s.role].perms.indexOf(perm) >= 0; }
  function url(path) { return ROOT + path; }
  function qs(name) { return new URLSearchParams(location.search).get(name); }

  window.Store = {
    KEY: KEY, DAY: DAY, ROOT: ROOT, PAYOUT: PAYOUT, FREQ: FREQ, DIST: DIST, STATUS: STATUS, WALLET_TYPES: WALLET_TYPES, PROVIDERS: PROVIDERS,
    RANKS: RANKS, DEP_OPTIONS: DEP_OPTIONS, TX: TX, ROLES: ROLES,
    fmt: fmt, fmtDate: fmtDate, dayStart: dayStart, dayEnd: dayEnd, parseDT: parseDT, money: money, esc: esc, round2: round2,
    load: load, save: save, mutate: mutate, reset: reset, onChange: onChange, tick: tick,
    player: player, promo: promo, optin: optin, reward: reward, promoStart: promoStart, promoEnd: promoEnd, promoRunning: promoRunning,
    pendingAt: pendingAt, okashAt: okashAt, trace: trace, isDepositTask: isDepositTask, depositTaskInProgress: depositTaskInProgress,
    depositTaskBlock: depositTaskBlock, depositTaskBlockMsg: depositTaskBlockMsg, tasks: tasks, isPending: isPending,
    optIn: optIn, deposit: deposit, addTurnover: addTurnover, bet: bet, addTierPoints: addTierPoints, claim: claim, cancelReward: cancelReward,
    savePromo: savePromo, PW_HALO_MSG: PW_HALO_MSG, setNow: setNow, promoSums: promoSums, frontWallets: frontWallets, memberNo: memberNo, addTc12Player: addTc12Player, summarize: summarize, dateList: dateList, can: can, url: url, qs: qs
  };
})();
