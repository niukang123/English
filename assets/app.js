/* ══════════════════════════════════════════════════════════
   四六级学习台 · 应用逻辑
   所有数据保存在浏览器 localStorage，不联网、不上传
   ══════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ─────────────── 工具 ─────────────── */

const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function todayKey(d) {
  const t = d || new Date();
  return t.getFullYear() + '-' +
         String(t.getMonth() + 1).padStart(2, '0') + '-' +
         String(t.getDate()).padStart(2, '0');
}

function addDays(key, n) {
  const p = key.split('-').map(Number);
  const d = new Date(p[0], p[1] - 1, p[2]);
  d.setDate(d.getDate() + n);
  return todayKey(d);
}

let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 250);
  }, 1800);
}

function copyText(text) {
  const done = () => toast('已复制');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { toast('复制失败，请手动选择'); }
  document.body.removeChild(ta);
}

/* ─────────────── 语音合成 ─────────────── */
const TTS = {
  ready: false,
  voices: [],
  unlocked: false,

  // iOS（含 iPadOS）要求语音必须由用户手势触发，否则静默失败
  isIOS() {
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) return true;
    // iPadOS 13+ 伪装成 Mac，用触摸点数区分
    return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  },

  init() {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      this.voices = window.speechSynthesis.getVoices() || [];
      this.ready = this.voices.length > 0;
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;

    // 在第一次用户交互时「解锁」语音，之后才能自动朗读
    if (this.isIOS()) {
      const unlock = () => {
        try {
          const u = new SpeechSynthesisUtterance(' ');
          u.volume = 0.01;
          u.rate = 2;
          window.speechSynthesis.speak(u);
          this.unlocked = true;
        } catch (e) { /* 忽略 */ }
        document.removeEventListener('touchend', unlock, true);
        document.removeEventListener('click', unlock, true);
      };
      document.addEventListener('touchend', unlock, true);
      document.addEventListener('click', unlock, true);
    } else {
      this.unlocked = true;
    }
  },

  best() {
    if (!this.voices.length) this.voices = window.speechSynthesis.getVoices() || [];
    const en = this.voices.filter(v => /^en/i.test(v.lang));
    if (!en.length) return null;
    const prefer = [/Google US English/i, /Microsoft (Aria|Zira|Guy|Jenny)/i,
                    /Samantha/i, /Alex/i, /en-US/i];
    for (const re of prefer) {
      const hit = en.find(v => re.test(v.name) || re.test(v.lang));
      if (hit) return hit;
    }
    return en[0];
  },

  say(text, rate) {
    if (!('speechSynthesis' in window) || !text) return;
    // iOS 上还没被手势解锁时，不要尝试（否则静默失败还清掉队列）
    if (this.isIOS() && !this.unlocked) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate || state.settings.ttsRate || 0.9;
      const v = this.best();
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 忽略：部分浏览器无语音 */ }
  }
};

/* ─────────────── 状态存储 ─────────────── */

const LS_KEY = 'cet-study-v1';

const DEFAULT_STATE = {
  version: 1,
  level: 'CET4',
  settings: { dailyNew: 20, reviewLimit: 120, ttsRate: 0.9, autoSpeak: true, theme: '', phraseHide: false },
  progress: { CET4: {}, CET6: {} },
  wrong: { CET4: {}, CET6: {} },
  history: {},
  streak: { count: 0, last: '' },
  notes: [],
  examLog: [],
  translation: {},
  vocabHistory: []
};

let state = null;

function loadState() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { raw = null; }
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  if (raw && typeof raw === 'object') {
    if (raw.level === 'CET6') state.level = 'CET6';
    Object.assign(state.settings, raw.settings || {});
    Object.assign(state.progress.CET4, (raw.progress && raw.progress.CET4) || {});
    Object.assign(state.progress.CET6, (raw.progress && raw.progress.CET6) || {});
    Object.assign(state.wrong.CET4, (raw.wrong && raw.wrong.CET4) || {});
    Object.assign(state.wrong.CET6, (raw.wrong && raw.wrong.CET6) || {});
    state.history = raw.history || {};
    state.streak = raw.streak || { count: 0, last: '' };
    state.notes = Array.isArray(raw.notes) ? raw.notes : [];
    state.examLog = Array.isArray(raw.examLog) ? raw.examLog : [];
    state.translation = (raw.translation && typeof raw.translation === 'object') ? raw.translation : {};
    state.vocabHistory = Array.isArray(raw.vocabHistory) ? raw.vocabHistory : [];
  }
}

let saveTimer = null;
function save(now) {
  if (now) { flushSave(); return; }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 400);
}
function flushSave() {
  clearTimeout(saveTimer);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) {
    toast('存储空间不足，请清理部分记录');
  }
}
window.addEventListener('beforeunload', flushSave);

/* ─────────────── 遗忘曲线调度 ─────────────── */

const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;

// 艾宾浩斯复习间隔：5分钟 → 30分钟 → 12小时 → 1天 → 2天 → 4天 → 7天 → 15天 → 30天 → 已掌握
const STAGES = [
  { label: '新词',    ms: 0 },
  { label: '5 分钟',  ms: 5 * MIN },
  { label: '30 分钟', ms: 30 * MIN },
  { label: '12 小时', ms: 12 * 60 * MIN },
  { label: '1 天',    ms: 1 * DAY },
  { label: '2 天',    ms: 2 * DAY },
  { label: '4 天',    ms: 4 * DAY },
  { label: '7 天',    ms: 7 * DAY },
  { label: '15 天',   ms: 15 * DAY },
  { label: '30 天',   ms: 30 * DAY },
  { label: '已掌握',  ms: 90 * DAY }
];
const MASTER = STAGES.length - 1;

// 选择题模式下，超过这个时间才作答视为「犹豫/排除法」，不允许跳级
const RATE_FAST_LIMIT = 6000;

function nextStage(cur, wasNew, rating) {
  if (wasNew) return [1, 1, 2, 3][rating];
  if (rating === 0) return 1;                       // 忘记 → 打回 5 分钟
  if (rating === 1) return Math.max(1, cur - 1);    // 模糊 → 退一级
  if (rating === 2) return Math.min(MASTER, cur + 1); // 认识 → 进一级
  return Math.min(MASTER, cur + 2);                 // 熟练 → 跳一级
}

function schedule(word, rating) {
  const prog = state.progress[state.level];
  const wasNew = !prog[word];
  const cur = wasNew ? 0 : prog[word].s;
  const s = nextStage(cur, wasNew, rating);
  const now = Date.now();
  const prev = prog[word] || { r: 0, l: 0 };
  prog[word] = {
    s: s,
    d: now + STAGES[s].ms,
    r: (prev.r || 0) + 1,
    l: (prev.l || 0) + (rating === 0 ? 1 : 0),
    t: now
  };

  if (rating === 0) {
    const wb = state.wrong[state.level];
    const w = wb[word] || { c: 0, t: 0 };
    w.c++; w.t = now;
    wb[word] = w;
  } else if (rating >= 2) {
    const wb = state.wrong[state.level];
    if (wb[word]) { wb[word].c = Math.max(0, wb[word].c - 1); if (!wb[word].c) delete wb[word]; }
  }

  const h = state.history[todayKey()] || { new: 0, review: 0 };
  if (wasNew) h.new++; else h.review++;
  state.history[todayKey()] = h;

  touchStreak();
  save();
  return s;
}

function touchStreak() {
  const today = todayKey();
  if (state.streak.last === today) return;
  const yesterday = addDays(today, -1);
  state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
  state.streak.last = today;
}

/* ─────────────── 词库 ─────────────── */

function words(level) {
  const g = level === 'CET6' ? window.CET_CET6 : window.CET_CET4;
  return (g && g.words) || [];
}
function curWords() { return words(state.level); }

// 例句查询（语料例句 + 手写补充合并后的表）
function exampleFor(word) {
  const E = window.CET_EXAMPLES;
  if (!E) return null;
  const ex = E[String(word).toLowerCase()];
  return (ex && ex.length >= 2) ? ex : null;
}

function exampleHTML(word) {
  const ex = exampleFor(word);
  if (!ex) return '';
  return '<div class="example">' +
      '<div class="ex-label">例句</div>' +
      '<div class="ex-en">' + esc(ex[0]) + '</div>' +
      '<div class="ex-zh">' + esc(ex[1]) + '</div>' +
      '<button type="button" class="mini-btn" data-say="' + esc(ex[0]) + '">🔊 朗读例句</button>' +
    '</div>';
}

/* ─────────────── 视图路由 ─────────────── */

// 音标查询
function phoneticFor(word) {
  const P = window.CET_PHONETICS;
  if (!P) return '';
  return P[String(word).toLowerCase()] || '';
}
function phoneticHTML(word, cls) {
  const p = phoneticFor(word);
  return p ? '<span class="' + (cls || 'phonetic') + '">/' + esc(p) + '/</span>' : '';
}

let currentView = 'today';
function show(view) {
  currentView = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  $$('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.body.classList.remove('hide-tabs');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════ 今日面板 ═══════════════ */

function countDue() {
  const prog = state.progress[state.level];
  const now = Date.now();
  let n = 0;
  for (const w of curWords()) {
    const p = prog[w[0]];
    if (p && p.d <= now) n++;
  }
  return n;
}

function countLearned() {
  const prog = state.progress[state.level];
  return Object.keys(prog).length;
}

function countMastered() {
  const prog = state.progress[state.level];
  let n = 0;
  for (const k in prog) if (prog[k].s >= MASTER) n++;
  return n;
}

function renderToday() {
  const now = new Date();
  const week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  $('#today-date').textContent =
    now.getFullYear() + ' 年 ' + (now.getMonth() + 1) + ' 月 ' + now.getDate() + ' 日 · ' + week[now.getDay()];

  const due = countDue();
  const learned = countLearned();
  const mastered = countMastered();
  const total = curWords().length;
  const h = state.history[todayKey()] || { new: 0, review: 0 };
  const newLeft = Math.max(0, state.settings.dailyNew - h.new);

  $('#stat-due').textContent = due;
  $('#stat-new').textContent = newLeft;
  $('#stat-new-goal').textContent = state.settings.dailyNew;
  $('#stat-mastered').textContent = mastered;
  $('#stat-total').textContent = total;
  $('#streak-num').textContent = state.streak.count;

  if (due + newLeft > 0) {
    $('#today-greeting').textContent = '今天有 ' + (due + newLeft) + ' 个词等着你';
    $('#today-sub').textContent = due > 0
      ? '其中 ' + due + ' 个到期待复习，' + newLeft + ' 个新词。复习优先，别让曲线断了。'
      : '没有到期复习，可以安心推进 ' + newLeft + ' 个新词。';
  } else {
    $('#today-greeting').textContent = '今日任务已完成 🎉';
    $('#today-sub').textContent = h.new + h.review > 0
      ? '今天学了 ' + h.new + ' 个新词、复习了 ' + h.review + ' 次。'
      : '还没有开始，点右边的按钮吧。';
  }

  // 掌握度分布
  const buckets = [0, 0, 0, 0]; // 未学 / 初学(1-3) / 巩固(4-7) / 掌握(8-10)
  const prog = state.progress[state.level];
  const list = curWords();
  for (let i = 0; i < list.length; i++) {
    const p = prog[list[i][0]];
    if (!p) buckets[0]++;
    else if (p.s <= 3) buckets[1]++;
    else if (p.s <= 7) buckets[2]++;
    else buckets[3]++;
  }
  const pct = total ? (buckets[0] / total) * 100 : 100;
  $('#mastery-bar').style.width = (100 - pct) + '%';
  $('#mastery-note').textContent = learned + ' / ' + total + ' 词已进入学习队列';

  const colors = ['var(--border)', 'var(--new)', 'var(--review)', 'var(--done)'];
  const names = ['未学', '初学', '巩固', '已掌握'];
  $('#mastery-legend').innerHTML = names.map((n, i) =>
    '<span><i style="background:' + colors[i] + '"></i>' + n + ' ' + buckets[i] + '</span>'
  ).join('');

  renderWeekChart();
  renderSessionSummary();
}

function renderWeekChart() {
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(addDays(todayKey(), -i));
  const vals = days.map(d => {
    const h = state.history[d] || { new: 0, review: 0 };
    return (h.new || 0) + (h.review || 0);
  });
  const max = Math.max.apply(null, vals.concat([1]));
  const labels = ['日','一','二','三','四','五','六'];

  $('#week-chart').innerHTML = days.map((d, i) => {
    const hgt = Math.max(3, Math.round((vals[i] / max) * 82));
    const parts = d.split('-');
    const dow = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).getDay();
    return '<div class="chart-col">' +
             '<span class="chart-val">' + (vals[i] || '') + '</span>' +
             '<div class="chart-bar' + (vals[i] ? '' : ' zero') + '" style="height:' + hgt + 'px"></div>' +
             '<span class="chart-day">' + labels[dow] + '</span>' +
           '</div>';
  }).join('');
}

/* ═══════════════ 背单词 ═══════════════ */

const MODE_NAMES = { en2zh: '英 → 中', zh2en: '中 → 英', spell: '拼写', listen: '听音辨词', dictation: '听力听写' };
let mode = 'en2zh';
let session = null;

function renderSessionSummary() {
  const due = countDue();
  const learnedToday = (state.history[todayKey()] || {}).new || 0;
  const newLeft = Math.max(0, state.settings.dailyNew - learnedToday);
  const limit = state.settings.reviewLimit;
  const planned = Math.min(due, limit);
  const backlog = Math.max(0, due - limit);

  $('#session-summary').innerHTML =
    '<span class="sum-pill review">待复习 <b>' + due + '</b> 词</span>' +
    '<span class="sum-pill new">新词 <b>' + newLeft + '</b> 词</span>' +
    '<span class="sum-pill">模式 ' + MODE_NAMES[mode] + '</span>';

  // 积压说明：到期数超过本轮上限时，明确告诉用户剩下的去哪了
  const note = $('#backlog-note');
  if (!note) return;
  if (backlog > 0) {
    note.hidden = false;
    note.innerHTML = '本轮最多安排 <b>' + planned + '</b> 个到期词（复习上限 ' + limit +
      '），另有 <b>' + backlog + '</b> 个会顺延到下一轮，不会丢失。' +
      '想让积压消化得快一些，可在「今日 → 学习设置」调高复习上限。';
  } else {
    note.hidden = true;
    note.textContent = '';
  }
}

function buildQueue(onlyReview, onlyWrong) {
  const now = Date.now();
  const prog = state.progress[state.level];
  const all = curWords();
  const due = [];
  const fresh = [];

  if (onlyWrong) {
    const wb = state.wrong[state.level];
    const keys = Object.keys(wb);
    const out = [];
    for (const w of all) if (wb[w[0]]) out.push({ w: w, isNew: false });
    if (out.length) return out.slice(0, state.settings.reviewLimit);
    return [];
  }

  for (const w of all) {
    const p = prog[w[0]];
    if (!p) fresh.push(w);
    else if (p.d <= now) due.push({ w: w, d: p.d });
  }
  due.sort((a, b) => a.d - b.d);

  const limit = state.settings.reviewLimit;
  const queue = due.slice(0, limit).map(x => ({ w: x.w, isNew: false }));

  if (!onlyReview) {
    const learnedToday = (state.history[todayKey()] || {}).new || 0;
    const quota = Math.max(0, state.settings.dailyNew - learnedToday);
    for (let i = 0; i < Math.min(quota, fresh.length); i++) {
      queue.push({ w: fresh[i], isNew: true });
    }
  }
  return queue;
}

function startSession(onlyReview, onlyWrong) {
  let queue = buildQueue(onlyReview, onlyWrong);
  if (!queue.length) {
    toast(onlyWrong ? '错题本是空的' : '没有需要学习的内容了');
    return;
  }
  // 听写模式优先安排有例句的词（没有例句的会退化成单词听写）
  if (mode === 'dictation') {
    const withEx = queue.filter(q => exampleFor(q.w[0]));
    const withoutEx = queue.filter(q => !exampleFor(q.w[0]));
    if (withEx.length >= 5) {
      queue = withEx.concat(withoutEx.slice(0, 3));
    } else {
      queue = withEx.concat(withoutEx);
    }
  }
  session = {
    mode: mode,
    queue: queue,
    total: queue.length,
    done: 0,
    right: 0,
    wrong: 0,
    newCount: queue.filter(q => q.isNew).length,
    seen: {},
    requeue: {},
    current: null,
    answered: false
  };
  $('#study-setup').hidden = true;
  $('#study-done').hidden = true;
  $('#study-session').hidden = false;
  nextQuestion();
}

function nextQuestion() {
  if (!session.queue.length) { finishSession(); return; }
  const item = session.queue.shift();
  session.current = item;
  session.answered = false;
  session.qStart = Date.now();          // 用于判断「答得快还是慢」
  $('#rate-bar').hidden = true;
  $('#rate-note').hidden = true;
  $('#quiz-feedback').textContent = '';
  $('#quiz-feedback').className = 'quiz-feedback';
  $('#btn-known').hidden = false;

  const w = item.w;
  const isNewHere = !!item.isNew && !session.seen[w[0]];
  $('#quiz-tag').textContent = isNewHere ? '新词' : '复习';
  $('#quiz-tag').className = 'quiz-tag' + (isNewHere ? '' : ' review');

  renderQuestion(w);
  updateSessionBar();
}

/* ── 跳过已会的词：直接记为已掌握 ──
   碰到本来就会的词，不必再走完 10 个阶段。 */
function markKnown() {
  if (!session || !session.current || session.answered) return;
  const w = session.current.w;
  const prog = state.progress[state.level];
  const wasNew = !prog[w[0]];
  const now = Date.now();

  prog[w[0]] = {
    s: MASTER,
    d: now + STAGES[MASTER].ms,
    r: (prog[w[0]] ? prog[w[0]].r : 0) + 1,
    l: prog[w[0]] ? prog[w[0]].l || 0 : 0,
    t: now
  };

  // 既然已掌握，错题本里也一并移除
  if (state.wrong[state.level][w[0]]) delete state.wrong[state.level][w[0]];

  const h = state.history[todayKey()] || { new: 0, review: 0 };
  if (wasNew) h.new++; else h.review++;
  state.history[todayKey()] = h;

  session.answered = true;
  session.known = (session.known || 0) + 1;
  session.done++;
  session.seen[w[0]] = true;

  const fb = $('#quiz-feedback');
  fb.className = 'quiz-feedback ok';
  fb.innerHTML = '<span style="color:var(--ok)">✓ 已标记为「已掌握」</span> ' +
    '<span style="color:var(--text-2);font-weight:400">' + esc(w[0]) + ' · ' + esc(w[2]) + '</span>' +
    exampleHTML(w[0]);

  $('#btn-known').hidden = true;
  $('#rate-bar').hidden = true;
  updateSessionBar();

  touchStreak();
  save();
  setTimeout(() => { if (session) nextQuestion(); }, 550);
}

function updateSessionBar() {
  const pct = session.total ? (session.done / session.total) * 100 : 0;
  $('#session-bar').style.width = Math.min(100, pct) + '%';
  $('#session-count').textContent = session.done + ' / ' + session.total;
}

function renderQuestion(w) {
  const promptEl = $('#quiz-prompt');
  const bodyEl = $('#quiz-body');
  const speakBtn = $('#quiz-speak');
  promptEl.className = 'quiz-prompt';
  bodyEl.innerHTML = '';
  speakBtn.hidden = false;

  const word = w[0], pos = w[1], zh = w[2];

  if (session.mode === 'en2zh') {
    promptEl.innerHTML = esc(word) +
      (phoneticFor(word) ? '<span class="pos-tag phonetic-tag">/' + esc(phoneticFor(word)) + '/</span>' : '') +
      (pos ? '<span class="pos-tag">' + esc(pos) + '</span>' : '');
    if (state.settings.autoSpeak) TTS.say(word);
    renderOptions(bodyEl, 'zh', zh, w);

  } else if (session.mode === 'zh2en') {
    promptEl.className = 'quiz-prompt zh';
    promptEl.innerHTML = esc(zh);
    speakBtn.hidden = true;
    renderOptions(bodyEl, 'en', word, w);

  } else if (session.mode === 'dictation') {
    promptEl.innerHTML = '<span style="font-size:26px">🔊 听句子，写出你听到的内容</span>';
    if (phoneticFor(w[0])) {
      promptEl.innerHTML += '<span class="pos-tag phonetic-tag">/' + esc(phoneticFor(w[0])) + '/</span>';
    }
    renderDictation(bodyEl, w);
    return;

  } else if (session.mode === 'spell') {
    promptEl.className = 'quiz-prompt zh';
    promptEl.innerHTML = esc(zh) + (pos ? '<span class="pos-tag">' + esc(pos) + '</span>' : '');
    TTS.say(word);
    const hint = word[0] + ' ' + '_ '.repeat(Math.max(0, word.length - 1)).trim();
    bodyEl.innerHTML =
      '<div class="spell-wrap">' +
        '<div class="spell-hint">' + esc(word.length + ' 个字母 · ' + hint) + '</div>' +
        '<input type="text" class="spell-input" id="spell-input" autocomplete="off" ' +
               'autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="输入英文单词">' +
        '<div class="spell-actions">' +
          '<button type="button" class="btn btn-primary" id="spell-submit">确认</button>' +
          '<button type="button" class="btn" id="spell-skip">不会</button>' +
        '</div>' +
      '</div>';
    const input = $('#spell-input');
    setTimeout(() => input.focus(), 60);
    $('#spell-submit').addEventListener('click', () => checkSpell(w));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') checkSpell(w); });
    $('#spell-skip').addEventListener('click', () => revealAnswer(w, false));

  } else { // listen
    promptEl.innerHTML = '<span style="font-size:26px">🔊 听发音，选出你听到的词</span>';
    TTS.say(word);
    renderOptions(bodyEl, 'en', word, w);
  }
}

/* ── 听力听写 ──
   用例句做听写素材：先播整句，可重播 / 慢放 / 逐词提示，
   写完按词比对，正确率低于 60% 记为「没听懂」。 */
function normSentence(s) {
  return String(s).toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dictationScore(ref, input) {
  const a = normSentence(ref).split(' ').filter(Boolean);
  const b = normSentence(input).split(' ').filter(Boolean);
  if (!a.length) return { pct: 0, missed: [], extra: b };
  const pool = b.slice();
  const missed = [];
  let hit = 0;
  a.forEach(w => {
    const i = pool.indexOf(w);
    if (i !== -1) { hit++; pool.splice(i, 1); }
    else missed.push(w);
  });
  return { pct: Math.round(hit / a.length * 100), missed: missed, extra: pool };
}

function renderDictation(bodyEl, w) {
  const ex = exampleFor(w[0]);
  const sentence = ex ? ex[0] : null;

  if (!sentence) {
    // 没有例句的词，退化成单词听写
    bodyEl.innerHTML =
      '<div class="spell-wrap">' +
        '<div class="spell-hint">这个词没有例句，改为听写单词（' + w[0].length + ' 个字母）</div>' +
        '<input type="text" class="spell-input" id="dict-input" autocomplete="off" ' +
               'autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="输入你听到的单词">' +
        '<div class="spell-actions">' +
          '<button type="button" class="btn btn-primary" id="dict-submit">确认</button>' +
          '<button type="button" class="btn" id="dict-replay">🔊 再听一次</button>' +
        '</div>' +
      '</div>';
    dictationRef = w[0];
    TTS.say(w[0], 0.8);
    const inp = $('#dict-input');
    setTimeout(() => inp.focus(), 60);
    $('#dict-submit').addEventListener('click', () => checkDictation(w));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkDictation(w); });
    $('#dict-replay').addEventListener('click', () => TTS.say(w[0], 0.8));
    return;
  }

  dictationRef = sentence;
  bodyEl.innerHTML =
    '<div class="dict-wrap">' +
      '<div class="dict-tools">' +
        '<button type="button" class="btn btn-sm" id="dict-play">🔊 播放句子</button>' +
        '<button type="button" class="btn btn-sm" id="dict-slow">🐢 慢速</button>' +
        '<button type="button" class="btn btn-sm" id="dict-word">单听这个词</button>' +
      '</div>' +
      '<textarea class="tp-input" id="dict-input" rows="3" ' +
        'placeholder="把你听到的句子写下来（拼错个别词没关系，按词计分）"></textarea>' +
      '<div class="row-actions" style="margin-top:10px">' +
        '<button type="button" class="btn btn-primary" id="dict-submit">提交对照</button>' +
        '<button type="button" class="btn" id="dict-skip">直接看答案</button>' +
      '</div>' +
    '</div>';

  setTimeout(() => TTS.say(sentence, 0.85), 120);
  $('#dict-play').addEventListener('click', () => TTS.say(sentence, 0.85));
  $('#dict-slow').addEventListener('click', () => TTS.say(sentence, 0.6));
  $('#dict-word').addEventListener('click', () => TTS.say(w[0], 0.8));
  $('#dict-submit').addEventListener('click', () => checkDictation(w));
  $('#dict-skip').addEventListener('click', () => { $('#dict-input').value = ''; checkDictation(w); });
  const input = $('#dict-input');
  setTimeout(() => input.focus(), 200);
}

function checkDictation(w) {
  if (session.answered) return;
  const input = $('#dict-input');
  const typed = input ? input.value : '';
  const ref = dictationRef || w[0];
  const isWord = ref.indexOf(' ') === -1;
  const res = isWord
    ? { pct: normSentence(typed) === normSentence(ref) ? 100 : 0, missed: [], extra: [] }
    : dictationScore(ref, typed);
  const ex = exampleFor(w[0]);

  const fb = $('#quiz-feedback');
  const pass = res.pct >= 60;
  fb.className = 'quiz-feedback ' + (pass ? 'ok' : 'no');

  let html = '<div class="dict-result">' +
    '<div class="dict-score ' + (pass ? 'good' : 'bad') + '">听写正确率 ' + res.pct + '%</div>' +
    '<div class="ex-label">原文</div>' +
    '<div class="ex-en">' + esc(ref) + '</div>' +
    (ex && !isWord ? '<div class="ex-zh">' + esc(ex[1]) + '</div>' : '') +
    '<div class="ex-zh" style="margin-top:6px">' + esc(w[0]) +
      (w[1] ? ' <span style="color:var(--muted)">' + esc(w[1]) + '</span>' : '') +
      ' — ' + esc(w[2]) + '</div>';

  if (res.missed && res.missed.length) {
    html += '<div class="dict-missed">漏听或写错：' + res.missed.map(esc).join(' · ') + '</div>';
  }
  if (typed.trim() && res.pct === 100) {
    html += '<div class="dict-perfect">全部听对了 👍</div>';
  }
  html += '</div>';
  fb.innerHTML = html;

  session.answered = true;
  session.done++;
  if (pass) session.right++; else session.wrong++;
  session.seen[w[0]] = true;
  updateSessionBar();

  const rateBar = $('#rate-bar');
  rateBar.hidden = false;
  rateBar.dataset.next = '';
  $$('#rate-bar .rate').forEach(b => { b.hidden = false; });
  const label = $('.rate-label');
  if (label) label.textContent = pass
    ? '这句听懂了 👍 这个词的熟悉程度？'
    : '没听懂没关系，多听几遍。这个词的熟悉程度？';
}

let dictationRef = '';

function renderOptions(bodyEl, kind, correct, w) {
  const all = curWords();
  const opts = [correct];
  let guard = 0;
  while (opts.length < 4 && guard++ < 300) {
    const cand = all[Math.floor(Math.random() * all.length)];
    if (!cand) continue;
    const val = kind === 'zh' ? cand[2] : cand[0];
    if (!val || opts.indexOf(val) !== -1) continue;
    if (kind === 'zh' && val === correct) continue;
    if (kind === 'en' && cand[0] === w[0]) continue;
    opts.push(val);
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = opts[i]; opts[i] = opts[j]; opts[j] = t;
  }

  const wrap = document.createElement('div');
  wrap.className = 'opts';
  opts.forEach(val => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opt';
    if (kind === 'zh') {
      b.textContent = val;
    } else {
      b.innerHTML = (w[1] && val === w[0] ? '<span class="opt-pos">' + esc(w[1]) + '</span>' : '') +
                    '<span class="opt-en">' + esc(val) + '</span>';
    }
    b.addEventListener('click', () => {
      if (session.answered) return;
      const ok = val === correct;
      $$('.opt', wrap).forEach(x => {
        x.disabled = true;
        const xv = kind === 'zh' ? x.textContent : $('.opt-en', x).textContent;
        if (xv === correct) x.classList.add('correct');
        else if (x === b) x.classList.add('wrong');
      });
      if (ok) markCorrect(w); else revealAnswer(w, false);
    });
    wrap.appendChild(b);
  });
  bodyEl.appendChild(wrap);
}

function checkSpell(w) {
  if (session.answered) return;
  const input = $('#spell-input');
  const val = (input.value || '').trim().toLowerCase();
  if (val === w[0].toLowerCase()) {
    input.style.borderColor = 'var(--ok)';
    markCorrect(w);
  } else {
    input.style.borderColor = 'var(--wrong)';
    revealAnswer(w, false);
  }
}

function markCorrect(w) {
  const elapsed = session.qStart ? (Date.now() - session.qStart) : 0;
  session.answered = true;
  session.done++;
  session.right++;
  session.seen[w[0]] = true;
  session.lastElapsed = elapsed;

  const fb = $('#quiz-feedback');
  fb.className = 'quiz-feedback ok';
  fb.innerHTML = '✓ 答对了 <span style="color:var(--text-2);font-weight:400">' + esc(w[0]) + ' · ' + esc(w[2]) + '</span>' +
                 exampleHTML(w[0]);

  $('#btn-known').hidden = true;

  const rateBar = $('#rate-bar');
  rateBar.hidden = false;
  rateBar.dataset.next = '';
  $$('#rate-bar .rate').forEach(b => { b.hidden = false; });
  $('.rate-label').textContent = '这个词你记得怎么样？（决定下次复习时间）';

  // 自评校验：只有「答得快且从没错过」才允许跳级
  const prog = state.progress[state.level][w[0]];
  const lapses = prog ? (prog.l || 0) : 0;
  const guessable = (session.mode === 'en2zh' || session.mode === 'zh2en' || session.mode === 'listen');
  const slow = guessable && elapsed > RATE_FAST_LIMIT;

  const easyBtn = $('.rate.easy');
  const reasons = [];
  if (lapses > 0) reasons.push('这个词之前错过');
  if (slow) reasons.push('本次用了 ' + Math.round(elapsed / 1000) + ' 秒');

  if (reasons.length) {
    easyBtn.disabled = true;
    easyBtn.title = reasons.join('，') + '，暂不能跳级';
    const note = $('#rate-note');
    note.hidden = false;
    note.textContent = reasons.join('，') + '——为避免「蒙对」，这回只能记到「认识」为止。';
  } else {
    easyBtn.disabled = false;
    easyBtn.title = '';
    $('#rate-note').hidden = true;
  }

  updateSessionBar();
}

function revealAnswer(w, wasRight) {
  if (session.answered) return;
  session.answered = true;
  session.done++;
  if (!wasRight) session.wrong++;
  session.seen[w[0]] = true;

  const fb = $('#quiz-feedback');
  fb.className = 'quiz-feedback no';
  fb.innerHTML = '✗ 正确答案：<b>' + esc(w[0]) + '</b>' +
                 (w[1] ? ' <span style="color:var(--muted)">' + esc(w[1]) + '</span>' : '') +
                 ' — ' + esc(w[2]) +
                 (w[3] && w[3].length
                   ? '<div style="margin-top:8px;font-size:13px;color:var(--text-2);font-weight:400">' +
                     w[3].map(p => esc(p[0]) + ' — ' + esc(p[1])).join('<br>') + '</div>'
                   : '') +
                 exampleHTML(w[0]);

  TTS.say(w[0]);
  $('#btn-known').hidden = true;
  $('#rate-note').hidden = true;
  const rateBar = $('#rate-bar');
  rateBar.hidden = false;
  rateBar.dataset.next = 'auto';
  $$('#rate-bar .rate').forEach(b => { b.hidden = true; });
  $('.rate-label').innerHTML = '<button type="button" class="btn btn-primary" id="btn-continue">继续（记为忘记）</button>';
  const btn = $('#btn-continue');
  if (btn) {
    btn.addEventListener('click', () => {
      applyRate(0);
    });
  }
  updateSessionBar();
}

function applyRate(rating) {
  if (!session || !session.current) return;
  const item = session.current;
  const w = item.w;
  const wasNew = !state.progress[state.level][w[0]];
  const s = schedule(w[0], rating);

  // 短间隔的词在本轮内再出现，符合艾宾浩斯"当堂重复"；
  // 但最多重插 2 次，否则反复答错会让这一轮永远结束不了
  if (STAGES[s].ms > 0 && STAGES[s].ms <= 30 * MIN) {
    const key = w[0];
    session.requeue[key] = (session.requeue[key] || 0) + 1;
    if (session.requeue[key] <= 2) {
      const pos = Math.min(session.queue.length, 3 + Math.floor(Math.random() * 4));
      session.queue.splice(pos, 0, { w: w, isNew: false });
      session.total++;
    }
  }
  session.current = null;
  nextQuestion();
}

function finishSession() {
  $('#study-session').hidden = true;
  $('#study-done').hidden = false;
  $('#btn-known').hidden = true;
  $('#rate-note').hidden = true;
  const acc = session.done ? Math.round((session.right / session.done) * 100) : 0;
  $('#done-stats').innerHTML =
    '<div class="done-stat"><b>' + session.done + '</b><span>总题数</span></div>' +
    '<div class="done-stat"><b style="color:var(--ok)">' + session.right + '</b><span>答对</span></div>' +
    '<div class="done-stat"><b style="color:var(--wrong)">' + session.wrong + '</b><span>答错</span></div>' +
    (session.known ? '<div class="done-stat"><b style="color:var(--new)">' + session.known +
      '</b><span>标记已会</span></div>' : '') +
    '<div class="done-stat"><b>' + acc + '%</b><span>正确率</span></div>';
  session = null;
  renderToday();
}

/* ═══════════════ 词库浏览 ═══════════════ */

let browseShown = 40;
let browseFilter = '';

function renderBrowse(reset) {
  if (reset) browseShown = 40;
  const prog = state.progress[state.level];
  const now = Date.now();
  const kw = browseFilter.trim().toLowerCase();
  let list = curWords();
  if (kw) {
    list = list.filter(w =>
      w[0].toLowerCase().indexOf(kw) !== -1 || String(w[2]).toLowerCase().indexOf(kw) !== -1);
  }
  const slice = list.slice(0, browseShown);

  $('#browse-list').innerHTML = slice.length ? slice.map(w => {
    const p = prog[w[0]];
    let badge = '<span class="w-badge new">未学</span>';
    if (p) {
      if (p.s >= MASTER) badge = '<span class="w-badge ok">已掌握</span>';
      else if (p.d <= now) badge = '<span class="w-badge due">待复习·' + STAGES[p.s].label + '</span>';
      else badge = '<span class="w-badge ok">' + STAGES[p.s].label + '后</span>';
    }
    const ex = exampleFor(w[0]);
    return '<div class="word-row">' +
      '<div>' +
        '<div><span class="w-en">' + esc(w[0]) + '</span>' +
          (w[1] ? '<span class="w-pos">' + esc(w[1]) + '</span>' : '') +
          phoneticHTML(w[0]) + '</div>' +
        '<div class="w-zh">' + esc(w[2]) + '</div>' +
        (ex ? '<div class="w-ex"><span class="w-ex-en">' + esc(ex[0]) + '</span>' +
              '<span class="w-ex-zh">' + esc(ex[1]) + '</span></div>' : '') +
        (w[3] && w[3].length ? '<div class="w-phrase">' +
          w[3].map(p => esc(p[0]) + ' ' + esc(p[1])).join(' · ') + '</div>' : '') +
      '</div>' +
      '<div class="w-actions">' + badge +
        '<button type="button" class="mini-btn" data-say="' + esc(w[0]) + '">🔊</button>' +
      '</div>' +
    '</div>';
  }).join('') : '<div class="empty">没有匹配的单词</div>';

  $('#browse-more').hidden = list.length <= browseShown;
}

/* ═══════════════ 作文 ═══════════════ */

function renderWriting(pane) {
  const D = window.CET_WRITING;
  const box = $('#writing-content');
  if (!D) { box.innerHTML = '<div class="empty">作文数据未加载</div>'; return; }

  if (pane === 'templates') {
    box.innerHTML = D.categories.map((c, i) =>
      '<div class="acc' + (i === 0 ? ' open' : '') + '" data-acc>' +
        '<button type="button" class="acc-head">' +
          '<span><span class="acc-title">' + esc(c.name) + '</span>' +
          '<span class="acc-desc" style="display:block">' + esc(c.desc) + '</span></span>' +
          '<span class="acc-caret">▶</span>' +
        '</button>' +
        '<div class="acc-body">' +
          c.stages.map(s =>
            '<div class="stage">' +
              '<div class="stage-title">' + esc(s.stage) + '</div>' +
              '<div class="stage-zh">' + esc(s.zh) + '</div>' +
              s.patterns.map(p =>
                '<div class="pattern">' +
                  '<div class="pattern-text">' +
                    '<div class="pat-en">' + esc(p.en) + '</div>' +
                    '<div class="pat-zh">' + esc(p.zh) + '</div>' +
                  '</div>' +
                  '<button type="button" class="copy-btn" data-copy="' + esc(p.en) + '">复制</button>' +
                '</div>').join('') +
            '</div>').join('') +
        '</div>' +
      '</div>').join('');

  } else if (pane === 'samples') {
    const list = D.samples || [];
    box.innerHTML = '<div class="panel" style="background:transparent;border:0;box-shadow:none;padding:0 0 4px">' +
      '<p style="font-size:13.5px;color:var(--muted)">范文先自己读一遍，再对照每篇下面的' +
      '「值得背下来的句子」——那些就是模板里的句型在真实文章中的样子。</p></div>' +
      list.map((s, i) =>
      '<div class="acc' + (i === 0 ? ' open' : '') + '" data-acc>' +
        '<button type="button" class="acc-head">' +
          '<span><span class="acc-title">' + esc(s.title) + '</span>' +
          '<span class="acc-desc" style="display:block">' + esc(s.titleZh) + ' · ' +
            esc(s.type) + ' · ' + esc(s.level) + ' · ' + s.words + ' 词</span></span>' +
          '<span class="acc-caret">▶</span>' +
        '</button>' +
        '<div class="acc-body">' +
          '<div class="essay">' +
            String(s.en).split(/\n{2,}/).map(p => '<p>' + esc(p) + '</p>').join('') +
          '</div>' +
          '<div class="row-actions" style="margin:14px 0 4px">' +
            '<button type="button" class="btn btn-sm" data-togglezh="' + esc(s.id) + '">显示中文译文</button>' +
            '<button type="button" class="btn btn-sm" data-copy="' + esc(s.en) + '">复制英文全文</button>' +
          '</div>' +
          '<div class="essay essay-zh" id="zh-' + esc(s.id) + '" hidden>' +
            String(s.zh).split(/\n{2,}/).map(p => '<p>' + esc(p) + '</p>').join('') +
          '</div>' +
          '<h4 class="hl-title">值得背下来的句子</h4>' +
          s.highlights.map(h =>
            '<div class="pattern">' +
              '<div class="pattern-text">' +
                '<div class="pat-en">' + esc(h.en) + '</div>' +
                '<div class="pat-zh">' + esc(h.why) + '</div>' +
              '</div>' +
              '<button type="button" class="copy-btn" data-copy="' + esc(h.en) + '">复制</button>' +
            '</div>').join('') +
        '</div>' +
      '</div>').join('');

  } else if (pane === 'linkers') {
    box.innerHTML = '<div class="panel">' +
      Object.keys(D.linkers).map(k =>
        '<div class="linker-group">' +
          '<div class="linker-title">' + esc(k) + '</div>' +
          '<div class="chips">' + D.linkers[k].map(x =>
            '<span class="chip" data-copy="' + esc(x) + '">' + esc(x) + '</span>').join('') +
          '</div>' +
        '</div>').join('') +
      '</div>';

  } else if (pane === 'upgrades') {
    const groups = D.upgradeGroups || [];
    const totalGroups = groups.reduce((n, g) => n + g.items.length, 0);
    const totalWords = groups.reduce((n, g) =>
      n + g.items.reduce((m, u) => m + u.better.length, 0), 0);

    box.innerHTML =
      '<div class="panel" style="background:transparent;border:0;box-shadow:none;padding:0 0 4px">' +
        '<p style="font-size:13.5px;color:var(--muted)">共 ' + totalGroups + ' 组对照、' +
        totalWords + ' 个高级表达，按词性分成 ' + groups.length +
        ' 类。点任意词即可复制；带 ⚠ 的是最容易用错的地方，考前扫一遍。</p></div>' +
      groups.map((g, i) => {
        const cnt = g.items.reduce((m, u) => m + u.better.length, 0);
        return '<div class="acc' + (i === 0 ? ' open' : '') + '" data-acc>' +
          '<button type="button" class="acc-head">' +
            '<span><span class="acc-title">' + esc(g.name) +
              ' <em style="font-style:normal;font-weight:400;color:var(--muted)">' +
              g.items.length + ' 组 / ' + cnt + ' 个</em></span>' +
            '<span class="acc-desc" style="display:block">' + esc(g.desc) + '</span></span>' +
            '<span class="acc-caret">▶</span>' +
          '</button>' +
          '<div class="acc-body">' +
            g.items.map(u =>
              '<div class="upgrade-row">' +
                '<div class="up-basic">' + esc(u.basic) + '</div>' +
                '<div class="up-arrow">→</div>' +
                '<div class="up-better">' +
                  u.better.map(b =>
                    '<span class="chip" data-copy="' + esc(b) + '">' + esc(b) + '</span>').join('') +
                  (u.note ? '<div class="up-note">⚠ ' + esc(u.note) + '</div>' : '') +
                '</div>' +
              '</div>').join('') +
          '</div>' +
        '</div>';
      }).join('');

  } else {
    box.innerHTML = '<div class="panel">' +
      '<div class="panel-head"><h2>考场策略</h2></div>' +
      '<div class="tip-list">' + D.examTips.map((t, i) =>
        '<div class="tip-item"><span class="tip-num">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>'
      ).join('') + '</div></div>';
  }
}

/* ═══════════════ 翻译 ═══════════════ */

/* ─────────────── 翻译练习 ─────────────── */

// 关键词提取用的停用词（只保留有实义的词作为检查点）
const TP_STOP = new Set(('the a an and or but of to in on at for with by from as is are was were be been ' +
  'being it its this that these those they their them he she his her him we our us you your i me my ' +
  'not no nor more most than has have had do does did can could will would shall should may might must ' +
  'which who whom whose when where why how all both each few other some such only own same so too very ' +
  'just also into during while about after before between under over up down out off again further then ' +
  'once here there what any because if as well').split(/\s+/));

let tp = {
  topicId: 'all', queue: [], idx: 0, cur: null,
  revealed: false, hinted: false, userText: '', requeued: {}
};

function tpList() {
  const D = window.CET_PHRASES;
  const out = [];
  if (!D) return out;
  (D.topics || []).forEach(t => {
    (t.items || []).forEach((it, i) => {
      out.push({
        key: t.id + ':' + i,
        topicId: t.id,
        topicName: t.name,
        zh: it.zh,
        en: it.en
      });
    });
  });
  return out;
}

// 从参考译文里挑出实义词作为"检查点"，长的词优先，最多 10 个
function tpKeywords(en) {
  const words = String(en).toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [];
  const seen = new Set();
  const out = [];
  for (const w of words) {
    if (TP_STOP.has(w) || w.length < 3 || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  out.sort((a, b) => b.length - a.length);
  return out.slice(0, 10);
}

// 允许简单的词形变化（复数/时态）
function tpTermMatched(term, normUser) {
  if (normUser.indexOf(term) !== -1) return true;
  const stem = term.replace(/(ing|ed|es|s|ly)$/, '');
  return stem.length >= 4 && normUser.indexOf(stem) !== -1;
}

function tpStart(topicId) {
  tp.topicId = topicId || 'all';
  const all = tpList();
  const pool = tp.topicId === 'all' ? all : all.filter(x => x.topicId === tp.topicId);
  const prog = state.translation;
  const fresh = pool.filter(x => !(prog[x.key] && prog[x.key].m));
  const done = pool.filter(x => prog[x.key] && prog[x.key].m);
  tp.queue = fresh.concat(done);
  tp.idx = 0;
  tp.requeued = {};
  tp.revealed = false;
  tp.hinted = false;
  tp.userText = '';
  tpLoad();
}

function tpLoad() {
  tp.cur = tp.idx < tp.queue.length ? tp.queue[tp.idx] : null;
  tp.revealed = false;
  tp.hinted = false;
  tp.userText = '';
  tpRender();
}

function tpCaptureInput() {
  const el = document.getElementById('tp-input');
  if (el) tp.userText = el.value;
}

function tpReveal() {
  tpCaptureInput();
  tp.revealed = true;
  tpRender();
}

function tpRate(mastered) {
  if (!tp.cur) return;
  const k = tp.cur.key;
  const p = state.translation[k] || { n: 0, m: 0 };
  p.n = (p.n || 0) + 1;
  p.last = Date.now();
  if (mastered) p.m = 1;
  state.translation[k] = p;
  save();

  const item = tp.cur;
  tp.idx++;
  // 没掌握的，本轮内再排一次（每题最多重排一次，避免练不完）
  if (!mastered && !tp.requeued[k]) {
    tp.requeued[k] = true;
    const pos = Math.min(tp.queue.length, tp.idx + 2);
    tp.queue.splice(pos, 0, item);
  }
  tpLoad();
}

function tpTopicChips() {
  const D = window.CET_PHRASES;
  const all = tpList();
  const prog = state.translation;
  const mastered = all.filter(x => prog[x.key] && prog[x.key].m).length;

  let html = '<div class="panel">' +
    '<div class="panel-head"><h2>练习范围</h2>' +
    '<span class="panel-note">已掌握 ' + mastered + ' / ' + all.length + ' 组</span></div>' +
    '<div class="chips">' +
    '<span class="chip' + (tp.topicId === 'all' ? ' active' : '') + '" data-tp-topic="all">全部 ' +
      all.length + '</span>';
  (D.topics || []).forEach(t => {
    const n = all.filter(x => x.topicId === t.id).length;
    const m = all.filter(x => x.topicId === t.id && prog[x.key] && prog[x.key].m).length;
    html += '<span class="chip' + (tp.topicId === t.id ? ' active' : '') +
            '" data-tp-topic="' + esc(t.id) + '">' + esc(t.name) + ' ' + m + '/' + n + '</span>';
  });
  html += '</div></div>';
  return html;
}

function tpRender() {
  const box = $('#translation-content');
  const all = tpList();
  if (!all.length) { box.innerHTML = '<div class="empty">翻译数据未加载</div>'; return; }

  if (!tp.cur) {
    box.innerHTML = '<div class="panel"><div class="empty">' +
      '这个范围已经全部练完了 🎉<br><span style="font-size:13px">练过的题会存在本机，换范围或重新开始都行。</span>' +
      '</div><div class="row-actions center">' +
      '<button type="button" class="btn btn-primary" id="tp-restart">再练一遍</button>' +
      '</div></div>' + tpTopicChips();
    return;
  }

  const item = tp.cur;
  const p = state.translation[item.key] || { n: 0, m: 0 };
  const keys = tpKeywords(item.en);

  let html = '<div class="panel">' +
    '<div class="panel-head">' +
      '<h2>第 ' + (tp.idx + 1) + ' / ' + tp.queue.length + ' 题</h2>' +
      '<span class="panel-note">' + esc(item.topicName) +
        (p.n ? ' · 已练 ' + p.n + ' 次' : '') + (p.m ? ' · 已掌握' : '') + '</span>' +
    '</div>' +
    '<div class="tp-zh">' + esc(item.zh) + '</div>';

  if (!tp.revealed) {
    html += '<textarea id="tp-input" class="tp-input" rows="4" ' +
            'placeholder="在这里写下你的英文翻译，然后对照参考答案…">' + esc(tp.userText) + '</textarea>' +
            '<div class="row-actions" style="margin-top:12px">' +
              '<button type="button" class="btn btn-primary" id="tp-reveal">对照参考答案</button>' +
              '<button type="button" class="btn" id="tp-hint">给我提示</button>' +
            '</div>' +
            (tp.hinted
              ? '<div class="tp-hint">可以从这些关键词入手：<b>' +
                keys.slice(0, 4).map(esc).join(' · ') + '</b></div>'
              : '');
  } else {
    const norm = String(tp.userText || '').toLowerCase();
    const missed = keys.filter(k => !tpTermMatched(k, norm));
    const hit = keys.length - missed.length;

    html += '<div class="tp-answer">' +
      '<div class="tp-answer-label">参考答案</div>' +
      '<div class="tp-answer-en">' + esc(item.en) + '</div>';

    if (String(tp.userText || '').trim()) {
      html += '<div class="tp-coverage">关键词覆盖：<b>' + hit + ' / ' + keys.length + '</b>' +
        (missed.length
          ? '<div class="tp-missed">这些没译到：' + missed.map(esc).join(' · ') + '</div>'
          : '<div class="tp-allhit">关键信息都译到了 👍</div>') +
        '<div class="tp-caveat">这只是机器按关键词粗略比对，不是评分。' +
        '句子结构、时态、冠词是否准确，要自己对着原文再读一遍。</div>' +
        '</div>';
    } else {
      html += '<div class="tp-caveat">这次没有写译文，直接看了答案。建议至少动笔写一遍，' +
              '「看得懂」和「写得出」是两件事。</div>';
    }

    html += '<div class="row-actions" style="margin-top:14px">' +
      '<button type="button" class="btn btn-primary" id="tp-good">掌握了，下一题</button>' +
      '<button type="button" class="btn" id="tp-again">还要再练</button>' +
      '</div>' +
      '<div class="row-actions"><button type="button" class="btn btn-sm" data-say-en="' +
        esc(item.en) + '">🔊 听一遍参考译文</button></div>' +
      '</div>';
  }

  html += '</div>' + tpTopicChips();
  box.innerHTML = html;
}

function renderTranslation(pane) {
  const D = window.CET_PHRASES;
  const box = $('#translation-content');
  if (!D) { box.innerHTML = '<div class="empty">翻译数据未加载</div>'; return; }

  if (pane === 'practice') { tpRender(); return; }

  if (pane === 'topics') {
    box.innerHTML = D.topics.map((t, i) =>
      '<div class="acc' + (i === 0 ? ' open' : '') + '" data-acc>' +
        '<button type="button" class="acc-head">' +
          '<span class="acc-title">' + esc(t.name) + '</span>' +
          '<span class="acc-caret">▶</span>' +
        '</button>' +
        '<div class="acc-body">' +
          t.items.map(p =>
            '<div class="pair">' +
              '<div class="pair-zh">' + esc(p.zh) + '</div>' +
              '<div class="pair-en">' + esc(p.en) + '</div>' +
            '</div>').join('') +
        '</div>' +
      '</div>').join('');

  } else if (pane === 'techniques') {
    box.innerHTML = D.techniques.map((t, i) =>
      '<div class="acc' + (i === 0 ? ' open' : '') + '" data-acc>' +
        '<button type="button" class="acc-head">' +
          '<span><span class="acc-title">' + esc(t.name) + '</span>' +
          '<span class="acc-desc" style="display:block">' + esc(t.zh) + '</span></span>' +
          '<span class="acc-caret">▶</span>' +
        '</button>' +
        '<div class="acc-body">' +
          t.examples.map(p =>
            '<div class="pair">' +
              '<div class="pair-zh">' + esc(p.zh) + '</div>' +
              '<div class="pair-en">' + esc(p.en) + '</div>' +
            '</div>').join('') +
        '</div>' +
      '</div>').join('');

  } else {
    box.innerHTML = '<div class="panel">' +
      '<div class="panel-head"><h2>考场策略</h2></div>' +
      '<div class="tip-list">' + D.examTips.map((t, i) =>
        '<div class="tip-item"><span class="tip-num">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>'
      ).join('') + '</div></div>';
  }
}

/* ═══════════════ 考试常用短语 ═══════════════ */

let phraseRevealed = {};

function renderPhrases() {
  const D = window.CET_EXAM_PHRASES;
  const box = $('#phrase-list');
  if (!box) return;
  if (!D) { box.innerHTML = '<div class="empty">短语数据未加载</div>'; return; }

  const kw = ($('#phrase-search').value || '').trim().toLowerCase();
  const hide = $('#phrase-hide').checked;
  let total = 0, shown = 0, html = '';

  D.groups.forEach(g => {
    const items = g.items.filter(it =>
      !kw || it[0].toLowerCase().indexOf(kw) !== -1 || it[1].toLowerCase().indexOf(kw) !== -1);
    total += g.items.length;
    shown += items.length;
    if (!items.length) return;

    html += '<div class="acc' + (kw ? ' open' : '') + '" data-acc>' +
      '<button type="button" class="acc-head">' +
        '<span><span class="acc-title">' + esc(g.name) +
          ' <em style="font-style:normal;font-weight:400;color:var(--muted)">' +
          items.length + ' 条</em></span>' +
        '<span class="acc-desc" style="display:block">' + esc(g.desc) + '</span></span>' +
        '<span class="acc-caret">▶</span>' +
      '</button>' +
      '<div class="acc-body">' +
        '<div class="phrase-rows">' +
          items.map(it => {
            const key = it[0].toLowerCase();
            const hidden = hide && !phraseRevealed[key];
            return '<div class="phrase-row' + (hidden ? ' hidden-zh' : '') + '" data-ph="' + esc(key) + '">' +
                '<span class="ph-en">' + esc(it[0]) + '</span>' +
                '<span class="ph-zh">' + esc(it[1]) + '</span>' +
                '<button type="button" class="mini-btn" data-copy="' + esc(it[0]) + '">复制</button>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  });

  box.innerHTML = html || '<div class="empty">没有匹配的短语</div>';
  const note = $('#phrase-count');
  if (note) note.textContent = kw ? ('匹配 ' + shown + ' / ' + total + ' 条') : (total + ' 条');
}

/* ═══════════════ 语法专项 ═══════════════ */

function renderGrammar() {
  const G = window.CET_GRAMMAR;
  const box = $('#grammar-list');
  if (!box) return;
  if (!G) { box.innerHTML = '<div class="empty">语法数据未加载</div>'; return; }

  box.innerHTML = G.topics.map((t, i) =>
    '<div class="acc' + (i === 0 ? ' open' : '') + '" data-acc>' +
      '<button type="button" class="acc-head">' +
        '<span><span class="acc-title">' + esc(t.name) +
          ' <em style="font-style:normal;font-weight:400;color:var(--muted)">' +
          esc(t.en) + '</em></span>' +
        '<span class="acc-desc" style="display:block">' + esc(t.intro) + '</span></span>' +
        '<span class="acc-caret">▶</span>' +
      '</button>' +
      '<div class="acc-body">' +
        t.points.map(pt =>
          '<div class="gram-point">' +
            '<div class="gram-title">' + esc(pt.title) + '</div>' +
            '<div class="gram-rule">' + esc(pt.rule) + '</div>' +
            pt.examples.map(ex =>
              '<div class="pattern">' +
                '<div class="pattern-text">' +
                  '<div class="pat-en">' + esc(ex.en) + '</div>' +
                  '<div class="pat-zh">' + esc(ex.zh) +
                    (ex.why ? ' <span class="gram-why">' + esc(ex.why) + '</span>' : '') + '</div>' +
                '</div>' +
                '<button type="button" class="copy-btn" data-copy="' + esc(ex.en) + '">复制</button>' +
              '</div>').join('') +
            (pt.errors && pt.errors.length
              ? '<div class="gram-errors">' +
                '<div class="gram-err-label">常见错误</div>' +
                pt.errors.map(er =>
                  '<div class="gram-err">' +
                    '<div class="err-wrong"><span class="err-mark">✗</span>' + esc(er.wrong) + '</div>' +
                    '<div class="err-right"><span class="err-mark">✓</span>' + esc(er.right) + '</div>' +
                    '<div class="err-why">' + esc(er.why) + '</div>' +
                  '</div>').join('') +
                '</div>'
              : '') +
          '</div>').join('') +
        '<div class="gram-tips">' +
          '<div class="gram-tips-label">考点提示</div>' +
          t.examTips.map((tip, j) =>
            '<div class="tip-item"><span class="tip-num">' + (j + 1) + '</span><span>' +
            esc(tip) + '</span></div>').join('') +
        '</div>' +
      '</div>' +
    '</div>').join('');
}

/* ═══════════════ 词汇量自测 ═══════════════ */

const VOCAB_SAMPLE = 60;
let vocab = null;

// 从四个频段各抽一组，覆盖不同难度
function buildVocabTest() {
  const list = curWords();
  const n = list.length;
  const bands = [
    { from: 0, to: Math.floor(n * 0.25) },
    { from: Math.floor(n * 0.25), to: Math.floor(n * 0.5) },
    { from: Math.floor(n * 0.5), to: Math.floor(n * 0.75) },
    { from: Math.floor(n * 0.75), to: n }
  ];
  const per = Math.floor(VOCAB_SAMPLE / bands.length);
  const picked = [];
  bands.forEach((b, bi) => {
    const pool = [];
    for (let i = b.from; i < b.to; i++) pool.push(list[i]);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    pool.slice(0, per).forEach(w => picked.push({ w: w, band: bi }));
  });
  return picked.slice(0, VOCAB_SAMPLE);
}

function vocabStart() {
  vocab = { items: buildVocabTest(), idx: 0, known: 0, byBand: [0, 0, 0, 0], total: [0, 0, 0, 0] };
  $('#vocab-intro').hidden = true;
  $('#vocab-result').hidden = true;
  $('#vocab-quiz').hidden = false;
  renderVocabQuestion();
}

function renderVocabQuestion() {
  const v = vocab;
  if (!v || v.idx >= v.items.length) { vocabFinish(); return; }
  const it = v.items[v.idx];
  $('#vocab-word').innerHTML = esc(it.w[0]) + phoneticHTML(it.w[0], 'vocab-phonetic');
  $('#vocab-count').textContent = (v.idx + 1) + ' / ' + v.items.length;
  $('#vocab-bar').style.width = Math.round(v.idx / v.items.length * 100) + '%';
}

function vocabAnswer(known) {
  const v = vocab;
  if (!v || v.idx >= v.items.length) return;
  const it = v.items[v.idx];
  const bi = it.band;
  v.total[bi]++;
  if (known) { v.known++; v.byBand[bi]++; }
  v.idx++;
  renderVocabQuestion();
}

function vocabFinish() {
  const v = vocab;
  $('#vocab-quiz').hidden = true;
  const box = $('#vocab-result');
  box.hidden = false;

  const rate = v.known / v.items.length;
  const base = curWords().length;
  const estimate = Math.round(base * rate);
  const bandNames = ['高频段', '中高频段', '中低频段', '低频段'];
  const bandRates = v.total.map((t, i) => t ? Math.round((v.byBand[i] || 0) / t * 100) : 0);

  // 留存结果，便于看长期变化
  state.vocabHistory = state.vocabHistory || [];
  state.vocabHistory.push({
    t: Date.now(),
    level: state.level,
    known: v.known,
    total: v.items.length,
    est: estimate
  });
  state.vocabHistory = state.vocabHistory.slice(-60);
  save();

  let advice;
  if (rate >= 0.85) {
    advice = '词汇基础已经相当扎实，建议把时间转向阅读速度和写作表达，而不是继续背词表。';
  } else if (rate >= 0.6) {
    advice = '基础不错。重点补「中高频段」的词，同时开始做真题阅读，在语境中巩固。';
  } else if (rate >= 0.4) {
    advice = '还有明显的提升空间。建议每天 25–30 个新词，先啃学习顺序前 1000 个核心词。';
  } else {
    advice = '词汇量是当前最大的瓶颈。建议每天 20 个新词起步，别贪多，重点是坚持复习不让曲线断。';
  }

  // 与上一次结果对比
  const hist = state.vocabHistory;
  let trendHTML = '';
  if (hist.length >= 2) {
    const prev = hist[hist.length - 2];
    const diff = estimate - prev.est;
    const d = new Date(prev.t);
    const sign = diff > 0 ? '+' : '';
    const cls = diff > 0 ? 'up' : (diff < 0 ? 'down' : '');
    trendHTML = '<div class="vocab-trend">上次（' + (d.getMonth() + 1) + ' 月 ' + d.getDate() +
      ' 日）估算 <b>' + prev.est + '</b> 词，本次 <b>' + estimate + '</b> 词，' +
      '变化 <span class="' + cls + '">' + sign + diff + '</span>' +
      (hist.length >= 2 ? '（共测过 ' + hist.length + ' 次）' : '') + '</div>';
  }

  box.innerHTML =
    '<div class="vocab-result-card">' +
      '<div class="vocab-main">' +
        '<span class="vocab-est">' + estimate + '</span>' +
        '<span class="vocab-est-label">估算已认识（当前词表 ' + base + ' 词）</span>' +
      '</div>' +
      '<div class="vocab-sub">抽样 ' + v.items.length + ' 词，认识 ' + v.known +
        '，识别率 ' + Math.round(rate * 100) + '%</div>' +
      trendHTML +
      '<div class="vocab-bands">' +
        bandNames.map((n, i) =>
          '<div class="vocab-band-row">' +
            '<span class="vb-name">' + n + '</span>' +
            '<div class="bar-track sm"><div class="bar-fill" style="width:' +
              bandRates[i] + '%"></div></div>' +
            '<span class="vb-pct">' + bandRates[i] + '%</span>' +
          '</div>').join('') +
      '</div>' +
      '<div class="vocab-advice">' + esc(advice) + '</div>' +
      '<p class="vocab-caveat">这只是抽样估算：只测了「认不认识」，没有测「会不会用」。' +
        '真实考试还涉及搭配、语感和阅读速度。</p>' +
      '<div class="row-actions">' +
        '<button type="button" class="btn btn-primary" id="btn-vocab-again">再测一次</button>' +
      '</div>' +
    '</div>';

  $('#btn-vocab-again').addEventListener('click', () => {
    $('#vocab-result').hidden = true;
    vocabStart();
  });
}

/* ═══════════════ 模考计时 ═══════════════ */

const EXAM_PRESETS = [
  { id: 'cet4', name: '四级全卷', desc: '作文 30 · 听力 25 · 阅读 40 · 翻译 30',
    sections: [{ name: '作文', min: 30 }, { name: '听力', min: 25 }, { name: '阅读', min: 40 }, { name: '翻译', min: 30 }] },
  { id: 'cet6', name: '六级全卷', desc: '作文 30 · 听力 30 · 阅读 40 · 翻译 30',
    sections: [{ name: '作文', min: 30 }, { name: '听力', min: 30 }, { name: '阅读', min: 40 }, { name: '翻译', min: 30 }] },
  { id: 'reading', name: '阅读专项', desc: '选词填空 + 长篇阅读 + 仔细阅读',
    sections: [{ name: '选词填空', min: 8 }, { name: '长篇阅读', min: 15 }, { name: '仔细阅读', min: 17 }] },
  { id: 'listening', name: '听力专项', desc: '短篇新闻 + 长对话 + 听力篇章',
    sections: [{ name: '短篇新闻', min: 8 }, { name: '长对话', min: 8 }, { name: '听力篇章', min: 9 }] },
  { id: 'writing', name: '作文限时', desc: '模拟考场写作，30 分钟一篇',
    sections: [{ name: '写作', min: 30 }] },
  { id: 'translation', name: '翻译限时', desc: '一段汉译英，30 分钟',
    sections: [{ name: '翻译', min: 30 }] }
];

const RING_C = 2 * Math.PI * 88;
let exam = {
  preset: EXAM_PRESETS[0],
  idx: 0,
  remaining: 0,
  total: 0,
  running: false,
  endAt: 0,
  tick: null
};

function renderExamPresets() {
  $('#exam-presets').innerHTML = EXAM_PRESETS.map(p =>
    '<button type="button" class="exam-preset' + (p.id === exam.preset.id ? ' active' : '') +
    '" data-preset="' + p.id + '">' +
      '<strong>' + esc(p.name) + '</strong><span>' + esc(p.desc) + '</span>' +
    '</button>').join('');
}

function renderSectionList() {
  $('#section-list').innerHTML = exam.preset.sections.map((s, i) =>
    '<div class="section-item' + (i === exam.idx ? ' active' : '') + (i < exam.idx ? ' done' : '') + '">' +
      '<span class="sec-name">' + (i + 1) + '. ' + esc(s.name) + '</span>' +
      '<span class="sec-min">' + s.min + ' 分钟</span>' +
    '</div>').join('');
}

function loadSection(i) {
  exam.idx = Math.max(0, Math.min(exam.preset.sections.length - 1, i));
  const s = exam.preset.sections[exam.idx];
  exam.total = s.min * 60 * 1000;
  exam.remaining = exam.total;
  exam.running = false;
  exam.endAt = 0;
  clearInterval(exam.tick);
  exam.tick = null;
  $('#timer-section').textContent = s.name;
  $('#timer-total').textContent = '共 ' + s.min + ' 分钟';
  $('#btn-timer-start').textContent = '开始';
  renderSectionList();
  paintTimer();
}

function paintTimer() {
  const rem = Math.max(0, exam.remaining);
  const sec = Math.ceil(rem / 1000);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  const disp = $('#timer-display');
  disp.textContent = mm + ':' + ss;

  const ratio = exam.total ? rem / exam.total : 0;
  const ring = $('#ring-fg');
  ring.style.strokeDashoffset = String(RING_C * (1 - ratio));
  ring.classList.toggle('warn', ratio <= 0.34 && ratio > 0.1);
  ring.classList.toggle('danger', ratio <= 0.1);
  disp.classList.toggle('danger', ratio <= 0.1);
}

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach(t => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.28);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.3);
    });
    setTimeout(() => { try { ctx.close(); } catch (e) {} }, 1600);
  } catch (e) { /* 忽略 */ }
}

function tickTimer() {
  if (!exam.running) return;
  exam.remaining = exam.endAt - Date.now();
  if (exam.remaining <= 0) {
    exam.remaining = 0;
    exam.running = false;
    clearInterval(exam.tick);
    exam.tick = null;
    $('#btn-timer-start').textContent = '开始';
    beep();
    toast('时间到！' + exam.preset.sections[exam.idx].name + '结束');
    state.examLog.unshift({
      t: Date.now(),
      name: exam.preset.name + ' · ' + exam.preset.sections[exam.idx].name,
      min: exam.preset.sections[exam.idx].min
    });
    state.examLog = state.examLog.slice(0, 20);
    save();
    renderExamLog();
  }
  paintTimer();
}

function renderExamLog() {
  $('#exam-log').innerHTML = state.examLog.length
    ? state.examLog.map(l => {
        const d = new Date(l.t);
        const stamp = (d.getMonth() + 1) + '/' + d.getDate() + ' ' +
                      String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        return '<div class="log-item"><span>' + esc(l.name) + '</span>' +
               '<span class="log-time">' + stamp + ' · ' + l.min + '分钟</span></div>';
      }).join('')
    : '<div class="empty">还没有完成过模考计时</div>';
}

/* ═══════════════ 错题本 ═══════════════ */

function renderWrongBook() {
  const wb = state.wrong[state.level];
  const keys = Object.keys(wb);
  const map = {};
  curWords().forEach(w => { map[w[0]] = w; });

  keys.sort((a, b) => (wb[b].c - wb[a].c) || (wb[b].t - wb[a].t));
  $('#wrong-count-note').textContent = keys.length ? '共 ' + keys.length + ' 个词' : '';

  $('#wrong-list').innerHTML = keys.length
    ? keys.map(k => {
        const w = map[k];
        if (!w) return '';
        return '<div class="word-row">' +
          '<div><div><span class="w-en">' + esc(w[0]) + '</span>' +
            (w[1] ? '<span class="w-pos">' + esc(w[1]) + '</span>' : '') + '</div>' +
            '<div class="w-zh">' + esc(w[2]) + '</div></div>' +
          '<div class="w-actions">' +
            '<span class="w-badge wrong">错 ' + wb[k].c + ' 次</span>' +
            '<button type="button" class="mini-btn" data-say="' + esc(w[0]) + '">🔊</button>' +
            '<button type="button" class="mini-btn" data-remove="' + esc(k) + '">移除</button>' +
          '</div></div>';
      }).join('')
    : '<div class="empty">还没有错词。答错的单词会自动出现在这里。</div>';

  renderNotes();
}

function renderNotes() {
  $('#note-list').innerHTML = state.notes.length
    ? state.notes.map(n => {
        const d = new Date(n.t);
        const stamp = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
        return '<div class="note-item">' +
          '<div class="note-head">' +
            '<span class="note-source">' + esc(n.source) + '</span>' +
            '<span class="note-date">' + stamp +
              ' <button type="button" class="mini-btn" data-delnote="' + n.id + '">删除</button></span>' +
          '</div>' +
          '<div class="note-answers">' +
            (n.mine ? '<span class="mine">我的答案：' + esc(n.mine) + '</span>' : '') +
            (n.right ? '<span class="right">正确答案：' + esc(n.right) + '</span>' : '') +
          '</div>' +
          (n.reason ? '<div class="note-reason">' + esc(n.reason) + '</div>' : '') +
        '</div>';
      }).join('')
    : '<div class="empty">还没有记录真题错题</div>';
}

/* ═══════════════ 进度导出 / 导入 ═══════════════ */

const BACKUP_VERSION = 1;

function exportProgress() {
  const payload = {
    app: 'cet-study',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    level: state.level,
    progress: state.progress,
    wrong: state.wrong,
    history: state.history,
    streak: state.streak,
    translation: state.translation,
    notes: state.notes,
    examLog: state.examLog,
    vocabHistory: state.vocabHistory || [],
    settings: state.settings
  };

  const counts = {
    words: Object.keys(payload.progress.CET4).length + Object.keys(payload.progress.CET6).length,
    wrong: Object.keys(payload.wrong.CET4).length + Object.keys(payload.wrong.CET6).length,
    days: Object.keys(payload.history).length,
    notes: payload.notes.length
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)],
    { type: 'application/json;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '四六级学习台进度_' + todayKey() + '.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);

  toast('已导出：' + counts.words + ' 词 / ' + counts.days + ' 天记录');
}

// 合并两条单词进度：保留更成熟的阶段；阶段相同取更晚的记录
function mergeWord(a, b) {
  if (!a) return b;
  if (!b) return a;
  let keep = b;
  if (a.s > b.s) keep = a;
  else if (a.s === b.s) keep = (a.t || 0) >= (b.t || 0) ? a : b;
  return {
    s: keep.s,
    d: Math.max(a.d || 0, b.d || 0),
    r: Math.max(a.r || 0, b.r || 0),
    l: Math.min(a.l || 0, b.l || 0) || Math.max(a.l || 0, b.l || 0),
    t: Math.max(a.t || 0, b.t || 0)
  };
}

function mergeProgressBooks(local, incoming) {
  const out = {};
  ['CET4', 'CET6'].forEach(lv => {
    const a = (local && local[lv]) || {};
    const b = (incoming && incoming[lv]) || {};
    const merged = {};
    const keys = new Set(Object.keys(a).concat(Object.keys(b)));
    keys.forEach(k => { merged[k] = mergeWord(a[k], b[k]); });
    out[lv] = merged;
  });
  return out;
}

function mergeWrongBooks(local, incoming) {
  const out = {};
  ['CET4', 'CET6'].forEach(lv => {
    const a = (local && local[lv]) || {};
    const b = (incoming && incoming[lv]) || {};
    const merged = {};
    const keys = new Set(Object.keys(a).concat(Object.keys(b)));
    keys.forEach(k => {
      const x = a[k] || { c: 0, t: 0 };
      const y = b[k] || { c: 0, t: 0 };
      merged[k] = { c: Math.max(x.c || 0, y.c || 0), t: Math.max(x.t || 0, y.t || 0) };
    });
    out[lv] = merged;
  });
  return out;
}

function importProgressFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try {
      data = JSON.parse(String(reader.result));
    } catch (e) {
      toast('文件不是有效的 JSON');
      return;
    }
    if (!data || data.app !== 'cet-study' || !data.progress) {
      toast('这不是本应用导出的进度文件');
      return;
    }

    const incoming = {
      words: Object.keys(data.progress.CET4 || {}).length +
             Object.keys(data.progress.CET6 || {}).length
    };
    const localWords = Object.keys(state.progress.CET4).length +
                       Object.keys(state.progress.CET6).length;
    const when = data.exportedAt ? new Date(data.exportedAt).toLocaleString() : '未知时间';

    if (!confirm(
      '即将导入这份备份：\n\n' +
      '导出时间：' + when + '\n' +
      '备份中单词数：' + incoming.words + '\n' +
      '本机现有单词数：' + localWords + '\n\n' +
      '导入采用「合并」方式：同一个词保留更成熟的学习阶段，' +
      '不会覆盖本机更完整的记录。是否继续？'
    )) return;

    // 合并各类数据
    state.progress = mergeProgressBooks(state.progress, data.progress);
    state.wrong = mergeWrongBooks(state.wrong, data.wrong);

    if (data.history) {
      Object.keys(data.history).forEach(day => {
        const a = state.history[day] || { new: 0, review: 0 };
        const b = data.history[day] || { new: 0, review: 0 };
        state.history[day] = {
          new: Math.max(a.new || 0, b.new || 0),
          review: Math.max(a.review || 0, b.review || 0)
        };
      });
    }

    if (data.streak && (data.streak.last || '') > (state.streak.last || '')) {
      state.streak = { count: data.streak.count || 0, last: data.streak.last || '' };
    } else if (data.streak && data.streak.last === state.streak.last) {
      state.streak.count = Math.max(state.streak.count, data.streak.count || 0);
    }

    if (data.translation) {
      Object.keys(data.translation).forEach(k => {
        const a = state.translation[k] || { n: 0, m: 0 };
        const b = data.translation[k] || { n: 0, m: 0 };
        state.translation[k] = {
          n: Math.max(a.n || 0, b.n || 0),
          m: Math.max(a.m || 0, b.m || 0),
          last: Math.max(a.last || 0, b.last || 0) || undefined
        };
      });
    }

    if (Array.isArray(data.notes)) {
      const ids = new Set(state.notes.map(n => String(n.id)));
      data.notes.forEach(n => {
        if (n && n.id != null && !ids.has(String(n.id))) {
          state.notes.push(n);
          ids.add(String(n.id));
        }
      });
      state.notes.sort((a, b) => (b.t || 0) - (a.t || 0));
    }

    if (Array.isArray(data.examLog)) {
      const seen = new Set(state.examLog.map(l => l.t + '|' + l.name));
      data.examLog.forEach(l => {
        if (l && !seen.has(l.t + '|' + l.name)) state.examLog.push(l);
      });
      state.examLog.sort((a, b) => (b.t || 0) - (a.t || 0));
      state.examLog = state.examLog.slice(0, 20);
    }

    if (Array.isArray(data.vocabHistory)) {
      const seenV = new Set((state.vocabHistory || []).map(v => v.t));
      (state.vocabHistory || []).forEach(v => seenV.add(v.t));
      const merged = (state.vocabHistory || []).slice();
      data.vocabHistory.forEach(v => {
        if (v && v.t && !merged.some(x => x.t === v.t)) merged.push(v);
      });
      merged.sort((a, b) => (a.t || 0) - (b.t || 0));
      state.vocabHistory = merged.slice(-60);
    }

    save(true);
    syncSettingsUI();
    renderToday();
    renderSessionSummary();
    renderBrowse(true);
    renderWrongBook();
    renderExamLog();

    const after = Object.keys(state.progress.CET4).length + Object.keys(state.progress.CET6).length;
    toast('导入完成，现有 ' + after + ' 个词的学习记录');
  };
  reader.onerror = () => toast('读取文件失败');
  reader.readAsText(file);
}

function exportNotes() {
  if (!state.notes.length) { toast('还没有错题记录'); return; }
  const txt = state.notes.map((n, i) => {
    const d = new Date(n.t);
    return [
      '【' + (i + 1) + '】' + n.source,
      '日期：' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(),
      n.mine ? '我的答案：' + n.mine : '',
      n.right ? '正确答案：' + n.right : '',
      n.reason ? '解析：' + n.reason : '',
      ''
    ].filter(Boolean).join('\n');
  }).join('\n------------------------\n');

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '四六级错题本_' + todayKey() + '.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('已导出');
}

/* ═══════════════ 事件绑定 ═══════════════ */

function bindEvents() {

  // 标签切换
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('button[data-view]');
    if (!b) return;
    show(b.dataset.view);
    if (b.dataset.view === 'today') renderToday();
    if (b.dataset.view === 'study') { renderSessionSummary(); renderBrowse(true); }
    if (b.dataset.view === 'wrong') renderWrongBook();
    if (b.dataset.view === 'phrases') renderPhrases();
    if (b.dataset.view === 'grammar') renderGrammar();
  });

  // 级别切换
  $('#level-switch').addEventListener('click', e => {
    const b = e.target.closest('button[data-level]');
    if (!b) return;
    state.level = b.dataset.level;
    $$('#level-switch button').forEach(x => x.classList.toggle('active', x === b));
    save();
    browseShown = 40; browseFilter = ''; $('#browse-search').value = '';
    renderToday(); renderSessionSummary(); renderBrowse(true); renderWrongBook();
    toast('已切换到' + (state.level === 'CET4' ? '四级' : '六级') + '词库');
  });

  // 主题
  $('#theme-toggle').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme;
    const isDark = cur ? cur === 'dark'
                       : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    state.settings.theme = next;
    save();
  });

  $('#menu-toggle').addEventListener('click', () => {
    document.body.classList.toggle('hide-tabs');
  });

  // 今日
  $('#start-study').addEventListener('click', () => { show('study'); startSession(false); });
  $('#btn-back-today').addEventListener('click', () => { show('today'); renderToday(); });
  $('#btn-again').addEventListener('click', () => {
    $('#study-done').hidden = true;
    $('#study-setup').hidden = false;
    renderSessionSummary();
  });

  $('#set-daily-new').addEventListener('change', e => {
    state.settings.dailyNew = Math.max(5, Math.min(100, Number(e.target.value) || 20));
    e.target.value = state.settings.dailyNew;
    save(); renderToday();
  });
  $('#set-review-limit').addEventListener('change', e => {
    state.settings.reviewLimit = Math.max(20, Math.min(500, Number(e.target.value) || 120));
    e.target.value = state.settings.reviewLimit;
    save(); renderToday();
  });
  $('#set-tts-rate').addEventListener('input', e => {
    state.settings.ttsRate = Number(e.target.value);
    $('#set-tts-rate-val').textContent = state.settings.ttsRate.toFixed(2).replace(/0$/, '') + '×';
    save();
  });
  $('#set-auto-speak').addEventListener('change', e => {
    state.settings.autoSpeak = e.target.checked;
    save();
  });
  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('确定清空全部学习记录？进度、错题、统计都会删除，且无法恢复。')) return;
    localStorage.removeItem(LS_KEY);
    loadState();
    syncSettingsUI();
    renderToday(); renderSessionSummary(); renderBrowse(true); renderWrongBook(); renderExamLog();
    toast('已清空');
  });

  // 背单词
  $('#mode-grid').addEventListener('click', e => {
    const b = e.target.closest('.mode-card');
    if (!b) return;
    mode = b.dataset.mode;
    $$('#mode-grid .mode-card').forEach(x => x.classList.toggle('active', x === b));
    renderSessionSummary();
  });
  $('#btn-start-session').addEventListener('click', () => startSession(false));
  $('#btn-review-only').addEventListener('click', () => startSession(true));
  $('#btn-free-browse').addEventListener('click', () => {
    const p = $('#browse-panel');
    p.hidden = !p.hidden;
    if (!p.hidden) renderBrowse(true);
  });
  $('#browse-search').addEventListener('input', e => {
    browseFilter = e.target.value;
    renderBrowse(true);
  });
  $('#browse-more').addEventListener('click', () => { browseShown += 60; renderBrowse(false); });

  // 词汇量自测
  $('#btn-vocab-start').addEventListener('click', vocabStart);
  $('#vocab-yes').addEventListener('click', () => vocabAnswer(true));
  $('#vocab-no').addEventListener('click', () => vocabAnswer(false));
  $('#browse-list').addEventListener('click', e => {
    const s = e.target.closest('[data-say]');
    if (s) TTS.say(s.dataset.say);
  });

  $('#quiz-speak').addEventListener('click', () => {
    if (session && session.current) TTS.say(session.current.w[0]);
  });
  $('#btn-quit-session').addEventListener('click', () => {
    if (session && session.done > 0) finishSession();
    else {
      session = null;
      $('#study-session').hidden = true;
      $('#study-setup').hidden = false;
    }
    renderToday();
  });
  $('#rate-bar').addEventListener('click', e => {
    const b = e.target.closest('.rate');
    if (!b || b.hidden) return;
    if (b.disabled) {
      toast('这个词暂不能跳级，请选「认识」或以下');
      return;
    }
    applyRate(Number(b.dataset.rate));
  });

  // 跳过已会的词
  $('#btn-known').addEventListener('click', markKnown);

  // 进度导出 / 导入
  $('#btn-export').addEventListener('click', exportProgress);
  $('#btn-import').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (f) importProgressFile(f);
    e.target.value = '';   // 允许重复导入同一个文件
  });

  // 作文 / 翻译 子导航
  $('#writing-subnav').addEventListener('click', e => {
    const b = e.target.closest('button[data-pane]');
    if (!b) return;
    $$('#writing-subnav button').forEach(x => x.classList.toggle('active', x === b));
    renderWriting(b.dataset.pane);
  });
  $('#translation-subnav').addEventListener('click', e => {
    const b = e.target.closest('button[data-pane]');
    if (!b) return;
    $$('#translation-subnav button').forEach(x => x.classList.toggle('active', x === b));
    renderTranslation(b.dataset.pane);
  });

  // 通用：手风琴 + 复制 + 范文译文开关 + 朗读
  document.addEventListener('click', e => {
    const head = e.target.closest('.acc-head');
    if (head) { head.parentElement.classList.toggle('open'); return; }

    const zhBtn = e.target.closest('[data-togglezh]');
    if (zhBtn) {
      const el = document.getElementById('zh-' + zhBtn.dataset.togglezh);
      if (el) {
        el.hidden = !el.hidden;
        zhBtn.textContent = el.hidden ? '显示中文译文' : '隐藏中文译文';
      }
      return;
    }

    const sayEn = e.target.closest('[data-say-en]');
    if (sayEn) { TTS.say(sayEn.dataset.sayEn); return; }

    const cp = e.target.closest('[data-copy]');
    if (cp) copyText(cp.dataset.copy);
  });

  // 翻译练习
  $('#translation-content').addEventListener('click', e => {
    const topic = e.target.closest('[data-tp-topic]');
    if (topic) { tpStart(topic.dataset.tpTopic); return; }
    if (e.target.closest('#tp-reveal')) { tpReveal(); return; }
    if (e.target.closest('#tp-hint')) { tpCaptureInput(); tp.hinted = true; tpRender(); return; }
    if (e.target.closest('#tp-good')) { tpRate(true); return; }
    if (e.target.closest('#tp-again')) { tpRate(false); return; }
    if (e.target.closest('#tp-restart')) { tpStart(tp.topicId); return; }
  });

  // 考试常用短语
  $('#phrase-search').addEventListener('input', renderPhrases);
  $('#phrase-hide').addEventListener('change', e => {
    state.settings.phraseHide = e.target.checked;
    save();
    renderPhrases();
  });
  $('#phrase-list').addEventListener('click', e => {
    if (e.target.closest('[data-copy]')) return;   // 复制交给通用处理器
    const row = e.target.closest('.phrase-row');
    if (row && row.classList.contains('hidden-zh')) {
      row.classList.remove('hidden-zh');
      phraseRevealed[row.dataset.ph] = true;
    }
  });

  // 模考
  $('#exam-presets').addEventListener('click', e => {
    const b = e.target.closest('[data-preset]');
    if (!b) return;
    const p = EXAM_PRESETS.find(x => x.id === b.dataset.preset);
    if (!p) return;
    exam.preset = p;
    renderExamPresets();
    loadSection(0);
  });
  $('#btn-timer-start').addEventListener('click', () => {
    if (exam.running) {
      exam.running = false;
      clearInterval(exam.tick); exam.tick = null;
      $('#btn-timer-start').textContent = '继续';
    } else {
      exam.endAt = Date.now() + Math.max(0, exam.remaining);
      exam.running = true;
      exam.tick = setInterval(tickTimer, 200);
      $('#btn-timer-start').textContent = '暂停';
    }
  });
  $('#btn-timer-reset').addEventListener('click', () => loadSection(exam.idx));
  $('#btn-timer-next').addEventListener('click', () => {
    if (exam.idx < exam.preset.sections.length - 1) loadSection(exam.idx + 1);
    else toast('已经是最后一部分了');
  });

  // 错题本
  $('#wrong-subnav').addEventListener('click', e => {
    const b = e.target.closest('button[data-pane]');
    if (!b) return;
    $$('#wrong-subnav button').forEach(x => x.classList.toggle('active', x === b));
    const isWords = b.dataset.pane === 'words';
    $('#wrong-words-pane').hidden = !isWords;
    $('#wrong-notes-pane').hidden = isWords;
  });
  $('#wrong-list').addEventListener('click', e => {
    const s = e.target.closest('[data-say]');
    if (s) { TTS.say(s.dataset.say); return; }
    const r = e.target.closest('[data-remove]');
    if (r) {
      delete state.wrong[state.level][r.dataset.remove];
      save(); renderWrongBook();
    }
  });
  $('#btn-practice-wrong').addEventListener('click', () => {
    if (!Object.keys(state.wrong[state.level]).length) { toast('错题本是空的'); return; }
    show('study');
    startSession(false, true);
  });
  $('#btn-clear-wrong').addEventListener('click', () => {
    if (!confirm('清空当前级别的错词记录？')) return;
    state.wrong[state.level] = {};
    save(); renderWrongBook(); renderToday();
  });
  $('#btn-add-note').addEventListener('click', () => {
    const source = $('#note-source').value.trim();
    if (!source) { toast('请填写题目或来源'); return; }
    state.notes.unshift({
      id: Date.now() + '_' + Math.floor(Math.random() * 1000),
      source: source,
      mine: $('#note-mine').value.trim(),
      right: $('#note-right').value.trim(),
      reason: $('#note-reason').value.trim(),
      t: Date.now()
    });
    ['#note-source', '#note-mine', '#note-right', '#note-reason'].forEach(s => { $(s).value = ''; });
    save(true);
    renderNotes();
    toast('已添加');
  });
  $('#note-list').addEventListener('click', e => {
    const d = e.target.closest('[data-delnote]');
    if (!d) return;
    state.notes = state.notes.filter(n => String(n.id) !== d.dataset.delnote);
    save(true); renderNotes();
  });
  $('#btn-export-notes').addEventListener('click', exportNotes);
}

/* ═══════════════ 初始化 ═══════════════ */

function syncSettingsUI() {
  $('#set-daily-new').value = state.settings.dailyNew;
  $('#set-review-limit').value = state.settings.reviewLimit;
  $('#set-tts-rate').value = state.settings.ttsRate;
  $('#set-tts-rate-val').textContent = Number(state.settings.ttsRate).toFixed(2).replace(/0$/, '') + '×';
  $('#set-auto-speak').checked = !!state.settings.autoSpeak;
  $$('#level-switch button').forEach(b => b.classList.toggle('active', b.dataset.level === state.level));
}

/* ═══════════════ PWA：离线与安装 ═══════════════ */

let installPrompt = null;

function setupPWA() {
  // 注册 service worker（file:// 下不支持，自动跳过）
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('[PWA] service worker 已注册，作用域：' + reg.scope);
      }).catch(err => {
        console.warn('[PWA] service worker 注册失败：' + err.message);
      });
    });
  }

  // 安卓 / 桌面 Chrome：可以走系统安装流程
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installPrompt = e;
    const btn = $('#btn-install');
    if (btn) btn.hidden = false;
  });

  $('#btn-install').addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    toast(choice.outcome === 'accepted' ? '正在安装…' : '已取消');
    installPrompt = null;
    $('#btn-install').hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    $('#btn-install').hidden = true;
    toast('已安装到主屏幕');
  });

  // iOS 没有 beforeinstallprompt，给出文字指引
  const note = $('#pwa-note');
  if (!note) return;
  const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                     navigator.standalone === true;

  if (standalone) {
    note.hidden = false;
    note.textContent = '你正在以「已安装应用」的方式使用，已支持完全离线。';
  } else if (TTS.isIOS()) {
    note.hidden = false;
    note.innerHTML = '在 iPhone / iPad 上：点 Safari 底部<b>分享</b>按钮 → <b>添加到主屏幕</b>，' +
      '之后可全屏离线使用。<br>注意：iOS 需要先点一次页面才能启用朗读，' +
      '所以第一次进入后请随便点一下。';
  } else {
    note.hidden = false;
    note.innerHTML = '这是可安装的网页应用：用浏览器菜单里的<b>「安装应用」/「添加到主屏幕」</b>，' +
      '安装后首次联网加载完即可<b>完全离线</b>使用。';
  }
}

function init() {
  loadState();
  TTS.init();

  if (state.settings.theme) document.documentElement.dataset.theme = state.settings.theme;

  if (!window.CET_CET4 || !window.CET_CET4.words) {
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="padding:16px;background:#b4392f;color:#fff">词库未能加载，请确认 data/cet4.js 与 data/cet6.js 已正确上传。</div>');
    return;
  }

  syncSettingsUI();
  bindEvents();
  renderToday();
  renderSessionSummary();
  renderBrowse(true);
  renderWriting('templates');
  tpStart('all');
  $('#phrase-hide').checked = !!state.settings.phraseHide;
  renderPhrases();
  renderGrammar();
  renderExamPresets();
  loadSection(0);
  renderExamLog();
  renderWrongBook();
  setupPWA();
  show('today');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
