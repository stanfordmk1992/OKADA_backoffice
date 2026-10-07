/* 促銷設定 新增 / 編輯 表單(/promotions/settings/add、/promotions/settings/update?id=) */
(function () {
  'use strict';
  var S = window.Store, esc = S.esc;
  function checks(name, list, sel) {
    return '<div id="' + name + '" style="max-height:130px;overflow:auto;border:1px solid #d1d0d4;border-radius:6px;padding:6px 10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 10px">' +
      list.map(function (v) { return '<label style="color:var(--text);font-size:13px"><input type="checkbox" value="' + esc(v) + '"' + (sel.indexOf(v) >= 0 ? ' checked' : '') + '> ' + esc(v) + '</label>'; }).join('') + '</div>';
  }
  function f(id, label, input, req, hint, cls) {
    return '<div class="field ' + (cls || '') + '" data-field="' + id + '"><label for="' + id + '">' + label + (req ? ' <span class="req">*</span>' : '') + '</label>' + input + (hint ? '<div class="hint">' + hint + '</div>' : '') + '<div class="err-msg" id="err-' + id + '"></div></div>';
  }
  function render(mode) {
    var s = S.load();
    var p = mode === 'edit' ? S.promo(s, S.qs('id')) : null;
    if (mode === 'edit' && !p) { document.getElementById('page').innerHTML = '<div class="card">Promotion not found.</div>'; return; }
    var v = p || { name: '', from: '', to: '', ranks: [], depOption: '', min: '', max: '', freq: '', vendors: [], tnc: '', payout: '', pct: '', maxCampaign: '', turnover: '', tierPoints: '', distribution: 'direct', claimDays: '' };
    var opt = function (list, sel) { return '<option value="">Select</option>' + list.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === sel ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join(''); };
    var h = '<div class="card"><div class="card-head"><div><h1>promotions / settings / ' + (p ? 'update' : 'add') + '</h1><div class="muted small">' + (p ? 'Edit Promotion #' + p.id : 'Add Promotion') + '</div></div></div>' +
      '<form id="promo-form" novalidate><div class="form-grid">' +
      f('bonus_name', 'Promotion Name', '<input id="bonus_name" value="' + esc(v.name) + '">', true) +
      f('period', 'Start Date ~ End Date', '<div style="display:flex;gap:6px;align-items:center"><input type="date" id="period_from" value="' + esc(v.from) + '" aria-label="Start Date"> ~ <input type="date" id="period_to" value="' + esc(v.to) + '" aria-label="End Date"></div>', true, '活動於結束日 23:59:59 結束') +
      f('player_rank_id', 'Player Ranking', checks('player_rank_id', S.RANKS, v.ranks), true) +
      f('dep_option_code', 'Deposit Option', '<select id="dep_option_code">' + opt(S.DEP_OPTIONS.map(function (x) { return [x, x]; }), v.depOption) + '</select>', true) +
      f('min_amount', 'Minimum Deposit', '<input type="number" id="min_amount" value="' + esc(v.min) + '">', true) +
      f('max_amount', 'Maximum Deposit', '<input type="number" id="max_amount" value="' + esc(v.max) + '">', true) +
      f('frequency_code', 'Payout Frequency', '<select id="frequency_code">' + opt([['end_of_promotion', 'End of Promotion'], ['instant', 'Instant']], v.freq) + '</select>', true) +
      f('vendor_id', 'Vendors', checks('vendor_id', S.PROVIDERS, v.vendors), true) +
      f('term_and_condition', 'Terms and Conditions', '<textarea id="term_and_condition" rows="4">' + esc(v.tnc) + '</textarea>', false, '', 'full') +
      f('payout_option_code', 'Payout Method(派發錢包)', '<select id="payout_option_code">' + opt([['igaming_credit', 'OKash Balance'], ['free_play_halo', 'Free Play (HALO)']], v.payout) + '</select>', true, '獎勵最終入帳的錢包。REQ-0015:選 OKash Balance 才可選派發方式(直接派發 / 經由優惠錢包);Free Play (HALO) 固定直接派發') +
      f('percentage', 'Percentage(%)', '<input type="number" step="0.0001" id="percentage" value="' + esc(v.pct) + '">', true) +
      f('max_campaign_amount', 'Max Campaign Amount', '<input type="number" id="max_campaign_amount" value="' + esc(v.maxCampaign) + '">', true) +
      f('turnover_amount', 'Turnover Amount', '<input type="number" id="turnover_amount" value="' + esc(v.turnover) + '">', true) +
      f('tier_points', 'Earn Points(Tier Points)', '<input type="number" id="tier_points" value="' + esc(v.tierPoints || '') + '">', false) +
      '<div class="full newbox" id="dist-box"><div class="newbox-title">NEW · REQ-0008 優惠錢包(REQ-0015:派發錢包 = OKash Balance 才顯示)</div><div class="form-grid">' +
      f('distribution', 'Distribution Method(派發方式)', '<div class="radio-row" id="distribution">' +
        '<label><input type="radio" name="distribution" value="direct"' + (v.distribution === 'direct' ? ' checked' : '') + '> Direct Payout(直接派發,現行)</label>' +
        '<label><input type="radio" name="distribution" value="promo_wallet"' + (v.distribution === 'promo_wallet' ? ' checked' : '') + '> Via Promo Wallet(經由優惠錢包)</label></div>', true, '經由優惠錢包:獎勵先進優惠錢包(鎖定中),任務完成後玩家在前台 Claim 才派發到上方派發錢包') +
      f('claim_period_days', 'Claim Period After Promotion Ends (days)(活動結束後領取期)', '<input type="number" min="0" step="1" id="claim_period_days" value="' + esc(v.claimDays == null ? '' : v.claimDays) + '">', true,
        'End of Promotion:必填且至少 1 天(活動結束時判定任務並解鎖,在領取期內 Claim)。Instant:可填 0(活動結束即作廢)。活動結束 + 領取期結束時,未領取獎勵一律作廢。', 'claim-wrap') +
      '</div></div>' +
      f('banner_image', 'Banner', '<input type="file" id="banner_image" accept="image/png,image/jpeg,image/jpg">', false, '原型不保存圖片', 'full') +
      '</div><div class="dialog-actions" style="justify-content:flex-start"><button type="submit" class="btn" id="btn-save">Save</button><a class="btn sec" id="btn-cancel" href="' + S.url('promotions/settings/list.html') + '">Cancel</a></div></form></div>';
    document.getElementById('page').innerHTML = h;
    var form = document.getElementById('promo-form');
    var payoutSel = document.getElementById('payout_option_code');
    var syncClaim = function () {
      // REQ-0015:派發錢包 = OKash Balance 才顯示派發方式;HALO / 未選不顯示(固定直接派發)
      var okash = payoutSel.value === 'igaming_credit';
      document.getElementById('dist-box').style.display = okash ? '' : 'none';
      var pw = form.querySelector('input[name=distribution]:checked');
      form.querySelector('.claim-wrap').style.display = okash && pw && pw.value === 'promo_wallet' ? '' : 'none';
    };
    payoutSel.addEventListener('change', function () {
      // 切換派發錢包:派發方式重設為直接派發、領取期清空
      form.querySelector('input[name=distribution][value=direct]').checked = true;
      document.getElementById('claim_period_days').value = '';
    });
    form.addEventListener('change', syncClaim); syncClaim();
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(p); });
  }
  function submit(p) {
    var errs = {};
    var g = function (id) { return document.getElementById(id).value.trim(); };
    var checked = function (id) { return Array.prototype.map.call(document.querySelectorAll('#' + id + ' input:checked'), function (x) { return x.value; }); };
    var REQ = 'This field is required';
    var name = g('bonus_name');
    if (!name) errs.bonus_name = REQ; else if (name.length < 4 || name.length > 100) errs.bonus_name = 'Promotion name must be between 4 and 100 characters';
    var from = g('period_from'), to = g('period_to');
    if (!from || !to) errs.period = REQ; else if (from > to) errs.period = 'End Date cannot be earlier than Start Date';
    var ranks = checked('player_rank_id'); if (!ranks.length) errs.player_rank_id = REQ;
    var dep = g('dep_option_code'); if (!dep) errs.dep_option_code = REQ;
    var min = g('min_amount'), max = g('max_amount');
    if (min === '') errs.min_amount = REQ; if (max === '') errs.max_amount = REQ;
    if (min !== '' && max !== '' && Number(min) > Number(max)) { errs.min_amount = 'Minimum deposit cannot be greater than maximum deposit'; errs.max_amount = 'Maximum deposit cannot be less than minimum deposit'; }
    var freq = g('frequency_code'); if (!freq) errs.frequency_code = REQ;
    var vendors = checked('vendor_id'); if (!vendors.length) errs.vendor_id = REQ;
    var payout = g('payout_option_code'); if (!payout) errs.payout_option_code = REQ;
    var pct = g('percentage'); if (pct === '') errs.percentage = REQ; else if (!(Number(pct) >= 0.0001 && Number(pct) <= 100)) errs.percentage = 'Percentage must be between 0.0001 and 100';
    var mc = g('max_campaign_amount'); if (mc === '') errs.max_campaign_amount = REQ;
    var tov = g('turnover_amount'); if (tov === '') errs.turnover_amount = REQ;
    var tp = g('tier_points');
    var distEl = document.querySelector('input[name=distribution]:checked');
    var dist = distEl ? distEl.value : '';
    if (payout !== 'igaming_credit') dist = 'direct'; // REQ-0015:HALO / 未選固定直接派發
    else if (!dist) errs.distribution = REQ;
    var cd = g('claim_period_days'), claimDays = null;
    if (dist === 'promo_wallet') {
      if (freq === 'end_of_promotion') {
        if (cd === '' || !/^\d+$/.test(cd) || Number(cd) < 1) errs.claim_period_days = 'Claim period must be at least 1 day for End of Promotion(派彩頻率 End of Promotion 時,領取期至少 1 天)';
      } else if (cd === '') errs.claim_period_days = REQ + '(Instant 可填 0)';
      else if (!/^\d+$/.test(cd)) errs.claim_period_days = 'Claim period must be a whole number of days ≥ 0';
      if (!errs.claim_period_days) claimDays = Number(cd);
    }
    document.querySelectorAll('.err-msg').forEach(function (e) { e.textContent = ''; });
    document.querySelectorAll('.err-input').forEach(function (e) { e.classList.remove('err-input'); });
    var keys = Object.keys(errs);
    if (keys.length) {
      keys.forEach(function (k) {
        document.getElementById('err-' + k).textContent = errs[k];
        var inp = document.querySelector('[data-field="' + k + '"] input, [data-field="' + k + '"] select'); if (inp) inp.classList.add('err-input');
      });
      var first = document.querySelector('[data-field="' + keys[0] + '"]');
      first.scrollIntoView({ block: 'center' }); var fi = first.querySelector('input,select,textarea'); if (fi) fi.focus();
      UI.toast(p ? 'Error updating promotion' : 'Error creating promotion', 'err');
      return;
    }
    var data = { name: name, from: from, to: to, ranks: ranks, depOption: dep, min: Number(min), max: Number(max), freq: freq, vendors: vendors, tnc: g('term_and_condition'),
      payout: payout, pct: Number(pct), maxCampaign: Number(mc), turnover: Number(tov), tierPoints: tp === '' ? 0 : Number(tp), distribution: dist, claimDays: claimDays };
    if (p) data.id = p.id;
    try { S.mutate(function (s) { return S.savePromo(s, data, S.ROLES[s.role].user); }); }
    catch (ex) { UI.toast(ex.message, 'err'); return; } // 後端拒絕(REQ-0015)

    UI.toast(p ? 'Promotion updated successfully' : 'Promotion created successfully', 'ok');
    document.getElementById('btn-save').disabled = true;
    setTimeout(function () { location.href = S.url('promotions/settings/list.html'); }, 1200);
  }
  window.PromoForm = { render: render };
})();
