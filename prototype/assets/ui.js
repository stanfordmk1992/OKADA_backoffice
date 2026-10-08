/* 共用 UI 小工具:提示、對話框、表格、進度、CSV 匯出 */
(function () {
  'use strict';
  var S = window.Store, esc = S.esc, money = S.money;
  function toast(msg, type) {
    var box = document.querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    var t = document.createElement('div'); t.className = 'toast ' + (type || ''); t.textContent = msg; t.setAttribute('role', 'status');
    box.appendChild(t); setTimeout(function () { t.remove(); }, 3500);
  }
  /** dialog({title, body, actions:[{label, cls, id, onClick(close, root)}]}) */
  function dialog(o) {
    var m = document.createElement('div'); m.className = 'mask';
    m.innerHTML = '<div class="dialog" role="dialog" aria-label="' + esc(o.title) + '"><h2>' + esc(o.title) + '</h2><div class="dlg-body">' + (o.body || '') + '</div><div class="dialog-actions"></div></div>';
    var close = function () { m.remove(); };
    var act = m.querySelector('.dialog-actions');
    (o.actions || [{ label: 'Close', cls: 'sec' }]).forEach(function (a) {
      var b = document.createElement('button'); b.className = 'btn ' + (a.cls || ''); b.textContent = a.label; if (a.id) b.id = a.id;
      b.onclick = function () { if (a.onClick) a.onClick(close, m); else close(); };
      act.appendChild(b);
    });
    m.addEventListener('click', function (e) { if (e.target === m && !o.modal) close(); });
    document.body.appendChild(m);
    return { close: close, root: m };
  }
  /** cols: [{t:'Title', k: row=>html, cls, newCol}] */
  function table(cols, rows, opt) {
    opt = opt || {};
    var h = '<div class="tbl-wrap"><table class="tbl"' + (opt.id ? ' id="' + opt.id + '"' : '') + '><thead><tr>' +
      cols.map(function (c) { return '<th class="' + (c.newCol ? 'new-col ' : '') + (c.cls || '') + '">' + esc(c.t) + (c.newCol ? ' <span class="tag-new">NEW</span>' : '') + '</th>'; }).join('') + '</tr></thead><tbody>';
    if (!rows.length) h += '<tr><td class="empty" colspan="' + cols.length + '">No data available</td></tr>';
    rows.forEach(function (r) { h += '<tr>' + cols.map(function (c) { return '<td class="' + (c.cls || '') + '">' + c.k(r) + '</td>'; }).join('') + '</tr>'; });
    h += '</tbody>' + (opt.foot || '') + '</table></div>';
    if (opt.count !== false) h += '<div class="count">Showing ' + rows.length + ' record(s)</div>';
    return h;
  }
  function statusChip(st) { var x = S.STATUS[st]; return '<span class="chip ' + x.cls + '" data-status="' + st + '">' + x.en + ' ' + x.zh + '</span>'; }
  function progLine(label, t, unit) {
    if (!t) return '';
    var pct = t.target > 0 ? Math.min(100, t.cur / t.target * 100) : 100;
    return '<div class="prog' + (t.done ? ' ' : '') + '">' + label + ':' + (unit === 'pts' ? t.cur : money(t.cur)) + ' / ' + (unit === 'pts' ? t.target : money(t.target)) +
      (t.done ? ' <span class="done">✓</span>' : '') + '<div class="bar' + (t.done ? ' full' : '') + '"><i style="width:' + pct + '%"></i></div></div>';
  }
  function progress(s, r) {
    var t = S.tasks(s, r);
    var dep = { done: t.deposit.done, cur: t.deposit.cur, target: t.deposit.target };
    return progLine('Deposit 存款', dep) + progLine('Turnover 流水', t.turnover) + (t.tier ? progLine('Tier Points 等級點數', t.tier, 'pts') : '<div class="prog muted">Tier Points:無此任務</div>');
  }
  function csv(filename, header, rows) {
    var q = function (v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var text = '﻿' + [header].concat(rows).map(function (r) { return r.map(q).join(','); }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    window.__lastCsv = { filename: filename, text: text };
    return text;
  }
  function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
  window.UI = { toast: toast, dialog: dialog, table: table, statusChip: statusChip, progress: progress, progLine: progLine, csv: csv, val: val };
})();
