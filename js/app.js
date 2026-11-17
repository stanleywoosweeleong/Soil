/* Soil field guide: routing, rendering, tools and quizzes. */
(function () {
  'use strict';

  /* ---------- storage ---------- */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('soil.' + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    /* returns false when the browser refuses the write (blocked, private mode or full) */
    set(key, value) {
      let ok = true;
      try { localStorage.setItem('soil.' + key, JSON.stringify(value)); } catch (e) { ok = false; }
      store.broken = !ok;
      const warn = document.getElementById('storewarn');
      if (warn) { warn.hidden = ok; if (!ok) warn.textContent = store.warning(); }
      return ok;
    },
    broken: false,
    warning: () => '',
  };

  /* ---------- language ---------- */
  function detectLang() {
    const saved = store.get('lang', null);
    if (LANGS.some(l => l.code === saved)) return saved;
    const nav = (navigator.language || 'ms').toLowerCase();
    if (nav.startsWith('zh')) return 'zh';
    if (nav.startsWith('en')) return 'en';
    return 'ms';
  }
  let lang = detectLang();
  const EN = LANGS.findIndex(l => l.code === 'en');
  const li = () => LANGS.findIndex(l => l.code === lang);
  /* translate a tuple; plain strings are language-neutral */
  function tr(x) {
    if (typeof x === 'string') return x;
    if (!Array.isArray(x)) return '';
    const v = x[li()];
    return v === undefined ? x[EN] : v;
  }
  const t = key => tr(UI[key]);
  store.warning = () => t('storeWarn');
  const fill = (key, vars) => t(key).replace(/\{(\w+)\}/g, (m, k) => vars[k]);

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* escape, then turn **bold** into <strong> */
  const rich = x => esc(tr(x)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const num = (v, d = 1) => Number(v).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-GB', { maximumFractionDigits: d, minimumFractionDigits: 0 });

  /* ---------- state ---------- */
  const ALL_LESSONS = UNITS.flatMap(u => u.lessons);
  let done = store.get('done', []).filter(id => ALL_LESSONS.includes(id));
  let best = store.get('best2', {});
  if (!best || typeof best !== 'object' || Array.isArray(best)) best = {};
  for (const k of Object.keys(best)) if (!Number.isInteger(best[k]) || best[k] < 0) delete best[k];
  let horizon = 'A';
  let quiz = null; // { n, qs, i, score, picked, order }
  let glossQuery = '';
  let rec = store.get('rec', null) || { plots: [], entries: [] };
  const saveRec = () => store.set('rec', rec);
  /* change the records, and undo the change if the browser cannot store it */
  function commitRec(mutate) {
    const before = JSON.stringify(rec);
    mutate();
    if (saveRec()) return true;
    rec = JSON.parse(before);
    return false;
  }
  const def = { where: null, pick: null };
  const tex = { sand: 40, clay: 20 };
  let ph = 5.0;
  const phx = { crop: 'gen', tex: 'sloam' };
  const slope = { rise: '', run: '' };
  const fert = Object.assign({
    mode: 'straight', area: 1, unit: 'ha',
    n: 100, p: 40, k: 60, pn: 'urea', pp: 'tsp', pk: 'mop',
    g: [15, 15, 15], basis: 'n', crate: 60,
    need: 20, pct: 60, plants: 300,
    bag: 50, bg: [15, 15, 15], price: '',
    trate: 4.5, tapps: 4, ttrees: 100,
  }, store.get('fert', null) || {});
  /* stored calculator settings may be stale or tampered with: force them back into shape */
  (function tidyFert() {
    const triple = v => Array.isArray(v) && v.length === 3 ? v.map(x => (Number.isFinite(Number(x)) ? Number(x) : 0)) : [15, 15, 15];
    if (!['straight', 'compound', 'plant', 'tree', 'bag'].includes(fert.mode)) fert.mode = 'straight';
    if (!['ha', 'm2', 'acre'].includes(fert.unit)) fert.unit = 'ha';
    if (!['n', 'p', 'k'].includes(fert.basis)) fert.basis = 'n';
    fert.g = triple(fert.g); fert.bg = triple(fert.bg);
    [['pn', 'n', 'urea'], ['pp', 'p', 'tsp'], ['pk', 'k', 'mop']].forEach(([key, field, fallback]) => {
      if (!PRODUCTS.some(x => x.id === fert[key] && x[field] > 0)) fert[key] = fallback;
    });
  })();

  const unitOf = id => UNITS.find(u => u.lessons.includes(id));
  const main = document.getElementById('main');

  /* ---------- chrome ---------- */
  const ICONS = {
    guide: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
    tools: '<path d="M12 3l9 16H3z"/><path d="M12 10v4"/>',
    records: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    glossary: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',
    sources: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  };
  const icon = n => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  function renderChrome(route) {
    document.documentElement.lang = LANGS.find(l => l.code === lang).html;
    document.title = t('appName');
    document.getElementById('brand').innerHTML =
      `<span class="mark" aria-hidden="true">${HORIZONS.slice(0, 4).map(h => `<i style="background:${h.color}"></i>`).join('')}</span><span>${esc(t('appName'))}</span>`;
    const tabs = [['', 'navHome', 'guide'], ['alat', 'navTools', 'tools'], ['rekod', 'navRecords', 'records'], ['istilah', 'navGlossary', 'glossary'], ['sumber', 'navSources', 'sources']];
    const top = ['alat', 'rekod', 'istilah', 'sumber'].includes(route[0]) ? route[0] : '';
    document.getElementById('tabs').innerHTML = tabs.map(([r, key, ic]) =>
      `<a href="#/${r}" ${top === r ? 'aria-current="page"' : ''}>${icon(ic)}<span>${esc(t(key))}</span></a>`).join('');
    const lg = document.getElementById('lang');
    lg.setAttribute('aria-label', t('language'));
    lg.innerHTML = LANGS.map(l =>
      `<button type="button" data-lang="${l.code}" lang="${l.html}" aria-pressed="${l.code === lang}" title="${esc(l.name)}">${esc(l.label)}</button>`).join('');
    document.getElementById('foot').textContent = t('disclaimer');
  }

  /* ---------- figures ---------- */
  function figProfile() {
    const h = HORIZONS.find(x => x.id === horizon);
    return `<div class="profile">
      <div class="profile-col" role="group" aria-label="${esc(t('profileTitle'))}">
        ${HORIZONS.map(x => `<button type="button" class="hz" data-hz="${x.id}" aria-pressed="${x.id === horizon}" style="background:${x.color};flex:${x.h}" aria-label="${esc(tr(x.name))}"><span>${x.id}</span></button>`).join('')}
      </div>
      <div class="profile-info" aria-live="polite">
        <p class="profile-name">${esc(tr(h.name))}</p>
        <p>${esc(tr(h.text))}</p>
        <p class="hint">${esc(t('profileHint'))}</p>
      </div>
    </div>`;
  }

  function figComposition() {
    const parts = [
      [45, '#a65530', ['Mineral', 'Mineral', '矿物质']],
      [5, '#2a1f17', ['Bahan organik', 'Organic matter', '有机质']],
      [25, '#3f7fa6', ['Air', 'Water', '水']],
      [25, '#c9d6cf', ['Udara', 'Air', '空气']],
    ];
    return `<figure class="comp">
      <div class="comp-bar" role="img" aria-label="${parts.map(p => tr(p[2]) + ' ' + p[0] + '%').join(', ')}">
        ${parts.map(p => `<i style="flex:${p[0]};background:${p[1]}"></i>`).join('')}
      </div>
      <ul class="comp-key">${parts.map(p => `<li><i style="background:${p[1]}"></i>${esc(tr(p[2]))} <b>${p[0]}%</b></li>`).join('')}</ul>
    </figure>`;
  }

  function figStructure() {
    const s = 'fill="var(--soil)" stroke="var(--surface)" stroke-width="1.5"';
    const items = [
      [['Berbutir', 'Granular', '粒状'], [[14, 16, 7], [30, 13, 6], [45, 17, 7], [20, 32, 7], [37, 31, 8], [12, 46, 6], [28, 47, 6], [45, 46, 7]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" ${s}/>`).join('')],
      [['Gumpal', 'Blocky', '块状'], `<path d="M6 8h20v18H6zM30 6h22v22H30zM6 30h24v22H6zM34 32h18v20H34z" ${s}/>`],
      [['Prismatik', 'Prismatic', '棱柱状'], `<path d="M6 6h13v48H6zM23 6h13v48H23zM40 6h13v48H40z" ${s}/>`],
      [['Kolumnar', 'Columnar', '柱状'], [6, 23, 40].map(x => `<path d="M${x} 54V14a6.5 8 0 0 1 13 0v40z" ${s}/>`).join('')],
      [['Berkeping', 'Platy', '片状'], [8, 20, 32, 44].map((y, i) => `<rect x="${4 + (i % 2) * 4}" y="${y}" width="48" height="8" rx="2" ${s}/>`).join('')],
      [['Pejal', 'Massive', '整块状'], `<rect x="5" y="6" width="50" height="48" ${s}/>`],
    ];
    return `<figure class="struct">${items.map(it => `<div><svg viewBox="0 0 60 60" aria-hidden="true">${it[1]}</svg><span>${esc(tr(it[0]))}</span></div>`).join('')}</figure>`;
  }

  const PH_GRADIENT = 'linear-gradient(90deg,#c0392b 0%,#e08a2c 22%,#e5c53a 40%,#5d9e4a 57%,#2f7f86 75%,#3d4f9f 100%)';
  const phTicks = () => `<span class="ph-ticks">${[3, 4, 5, 6, 7, 8, 9].map(v => `<span style="left:${((v - 3) / 6) * 100}%">${v}</span>`).join('')}</span>`;
  function figPhScale() {
    const marks = [['3.0–4.5', ['Tanah gambut', 'Peat soil', '泥炭土']], ['5', ['Kebanyakan tanah tanah tinggi Malaysia', 'Most Malaysian upland soils', '马来西亚多数高地土壤']], ['7', ['Neutral', 'Neutral', '中性']]];
    return `<figure class="phfig">
      <div class="ph-track" style="background:${PH_GRADIENT}"></div>${phTicks()}
      <ul class="ph-marks">${marks.map(m => `<li><b>pH ${m[0]}</b> ${esc(tr(m[1]))}</li>`).join('')}</ul>
    </figure>`;
  }

  const FIGS = { profile: figProfile, composition: figComposition, structure: figStructure, phscale: figPhScale };
  const TOOLS = ['tekstur', 'ph', 'cerun', 'tanda', 'baja'];
  const TOOL_KEYS = { tekstur: 'tTexture', ph: 'tPh', cerun: 'tSlope', tanda: 'tDef', baja: 'tFert' };

  /* ---------- lesson blocks ---------- */
  function block(b) {
    const [kind, v] = b;
    switch (kind) {
      case 'p': return `<p>${rich(v)}</p>`;
      case 'h': return `<h2>${rich(v)}</h2>`;
      case 'ul': return `<ul>${v.map(x => `<li>${rich(x)}</li>`).join('')}</ul>`;
      case 'steps': return `<ol class="steps">${v.map(x => `<li>${rich(x)}</li>`).join('')}</ol>`;
      case 'note': return `<p class="note">${rich(v)}</p>`;
      case 'formula': return `<p class="formula">${rich(v)}</p>`;
      case 'fig': return FIGS[v]();
      case 'tool': return `<a class="toolcard" href="#/alat/${v}"><span><b>${esc(t(TOOL_KEYS[v]))}</b><small>${esc(t(TOOL_KEYS[v] + 'Desc'))}</small></span><em>${esc(t('openTool'))}</em></a>`;
      case 'ex': return `<div class="ex"><h3>${rich(v.title)}</h3><ol>${v.steps.map(x => `<li>${rich(x)}</li>`).join('')}</ol></div>`;
      case 'table': return `<div class="tablewrap"><table><thead><tr>${v.head.map(x => `<th scope="col">${rich(x)}</th>`).join('')}</tr></thead><tbody>${
        v.rows.map(r => `<tr>${r.map((x, i) => i === 0 ? `<th scope="row">${rich(x)}</th>` : `<td>${rich(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      default: return '';
    }
  }

  /* ---------- pages ---------- */
  function pageHome() {
    const pct = Math.round((done.length / ALL_LESSONS.length) * 100);
    return `<section class="hero">
      <h1>${esc(t('appName'))}</h1>
      <p class="lede">${esc(t('tagline'))}</p>
    </section>
    <section>
      <h2 class="sec">${esc(t('tasksTitle'))}</h2>
      <ul class="tasks">${TASKS.map(k => `<li><a href="#/${k.href}">${esc(tr(k.t))}</a></li>`).join('')}</ul>
    </section>
    <section>
      <h2 class="sec">${esc(t('unitsTitle'))}</h2>
      <div class="meter" role="img" aria-label="${esc(t('progress'))} ${pct}%">
        <div class="meter-bar"><i style="width:${pct}%"></i></div>
        <span>${esc(t('progress'))}: ${done.length}/${ALL_LESSONS.length}</span>
      </div>
      ${UNITS.map(u => `<div class="chapter">
        <header><span class="chip" style="background:${u.chip}">${u.n}</span>
          <div><h3>${esc(tr(u.title))}</h3><p>${esc(tr(u.blurb))}</p></div></header>
        <ul class="lessonlist">
          ${u.lessons.map(id => `<li><a href="#/nota/${id}"><span class="ltitle">${esc(tr(LESSONS[id].title))}</span>${done.includes(id) ? `<span class="tick" aria-label="${esc(t('done'))}">✓</span>` : ''}</a></li>`).join('')}
          <li><a class="extra" href="#/amali/${u.n}"><span class="tag">${esc(t('activity'))}</span><span class="ltitle">${esc(tr(ACTIVITIES[u.n].title))}</span></a></li>
          <li><a class="extra" href="#/kuiz/${u.n}"><span class="tag">${esc(t('quiz'))}</span><span class="ltitle">${quizSize(u.n)} ${esc(t('questions'))}</span>${best[u.n] !== undefined ? `<span class="tick">${esc(t('best'))} ${esc(best[u.n])}/${quizSize(u.n)}</span>` : ''}</a></li>
        </ul>
      </div>`).join('')}
      <p class="booklink"><a href="#/buku">${esc(t('bookIndex'))}</a></p>
    </section>`;
  }

  const unitHead = (u, title) => `<a class="back" href="#/">‹ ${esc(t('backToNotes'))}</a>
    <header class="lesson-head"><span class="chip" style="background:${u.chip}">${u.n}</span>
      <div><p class="label">${esc(t('unit'))} ${u.n}: ${esc(tr(u.title))}</p><h1>${esc(title)}</h1></div></header>`;

  function pageLesson(id) {
    const L = LESSONS[id];
    if (!L) return pageHome();
    const u = unitOf(id);
    const i = ALL_LESSONS.indexOf(id);
    const prev = ALL_LESSONS[i - 1], next = ALL_LESSONS[i + 1];
    const isDone = done.includes(id);
    return `<article class="lesson">
      ${unitHead(u, tr(L.title))}
      ${L.book ? `<p class="hint bookref">${esc(t('bookRef'))} ${L.book}</p>` : ''}
      ${L.body.map(block).join('')}
      <div class="lesson-end">
        <button type="button" class="btn ${isDone ? 'is-done' : ''}" data-done="${id}" aria-pressed="${isDone}">${isDone ? '✓ ' + esc(t('markedDone')) : esc(t('markDone'))}</button>
        <a class="btn ghost" href="#/kuiz/${u.n}">${esc(t('takeQuiz'))}</a>
      </div>
      <nav class="pager" aria-label="${esc(t('navHome'))}">
        ${prev ? `<a href="#/nota/${prev}"><small>${esc(t('prev'))}</small>${esc(tr(LESSONS[prev].title))}</a>` : '<span></span>'}
        ${next ? `<a class="nx" href="#/nota/${next}"><small>${esc(t('next'))}</small>${esc(tr(LESSONS[next].title))}</a>` : '<span></span>'}
      </nav>
    </article>`;
  }

  function pageActivity(n) {
    const u = UNITS.find(x => x.n === Number(n));
    if (!u) return pageHome();
    const a = ACTIVITIES[u.n];
    return `<article class="lesson">
      ${unitHead(u, tr(a.title))}
      <p class="note"><b>${esc(t('youNeed'))}:</b> ${esc(tr(a.need))}</p>
      <ol class="steps">${a.steps.map(s => `<li>${rich(s)}</li>`).join('')}</ol>
      <div class="lesson-end"><a class="btn ghost" href="#/kuiz/${u.n}">${esc(t('takeQuiz'))}</a></div>
    </article>`;
  }

  function pageBook() {
    return `<section class="page">
      <a class="back" href="#/">‹ ${esc(t('backToNotes'))}</a>
      <h1>${esc(t('bookIndex'))}</h1>
      <p class="lede">${esc(t('bookIntro'))}</p>
      <div class="tablewrap"><table><tbody>${BOOK.map(b => `<tr><th scope="row">${b.n}<br><span class="plain">${esc(tr(b.t))}</span></th>
        <td>${b.to.map(id => `<a href="#/nota/${id}">${esc(tr(LESSONS[id].title))}</a>`).join('<br>')}</td></tr>`).join('')}</tbody></table></div>
    </section>`;
  }

  function glossaryRows() {
    const q = glossQuery.trim().toLowerCase();
    const idx = li();
    const rows = GLOSSARY
      .filter(g => !q || g[0].some(x => x.toLowerCase().includes(q)))
      .sort((a, b) => tr(a[0]).localeCompare(tr(b[0]), LANGS[idx].html));
    if (!rows.length) return `<p class="empty">${esc(t('noMatch'))}</p>`;
    return `<dl class="gloss">${rows.map(g => `<div><dt>${esc(tr(g[0]))}</dt>
      <dd class="others">${g[0].map((x, i) => i === idx ? '' : `<span lang="${LANGS[i].html}">${esc(x)}</span>`).join('')}</dd>
      <dd>${esc(tr(g[1]))}</dd></div>`).join('')}</dl>`;
  }
  function pageGlossary() {
    return `<section class="page">
      <h1>${esc(t('navGlossary'))}</h1>
      <p class="lede">${esc(t('glossaryIntro'))}</p>
      <label class="searchbox">${esc(t('search'))}<input type="search" id="gq" value="${esc(glossQuery)}" autocomplete="off"></label>
      <div id="glist" aria-live="polite">${glossaryRows()}</div>
    </section>`;
  }

  function pageTools(which) {
    const cur = TOOLS.includes(which) ? which : 'tekstur';
    const body = { tekstur: toolTexture, ph: toolPh, cerun: toolSlope, tanda: toolDef, baja: toolFert }[cur]();
    return `<section class="page">
      <h1>${esc(t('navTools'))}</h1>
      <p class="lede">${esc(t('toolsIntro'))}</p>
      <div class="seg" role="tablist">${TOOLS.map(k => `<a role="tab" href="#/alat/${k}" aria-selected="${k === cur}">${esc(t(TOOL_KEYS[k]))}</a>`).join('')}</div>
      <div class="tool" id="tool">${body}</div>
    </section>`;
  }

  /* ----- texture tool ----- */
  function classify(sand, clay) {
    const silt = 100 - sand - clay;
    if (silt + 1.5 * clay < 15) return 'sand';
    if (silt + 2 * clay < 30) return 'loamySand';
    if ((clay >= 7 && clay < 20 && sand > 52) || (clay < 7 && silt < 50)) return 'sandyLoam';
    if (clay >= 7 && clay < 27 && silt >= 28 && silt < 50 && sand <= 52) return 'loam';
    if ((silt >= 50 && clay >= 12 && clay < 27) || (silt >= 50 && silt < 80 && clay < 12)) return 'siltLoam';
    if (silt >= 80 && clay < 12) return 'silt';
    if (clay >= 20 && clay < 35 && silt < 28 && sand > 45) return 'sandyClayLoam';
    if (clay >= 27 && clay < 40 && sand > 20 && sand <= 45) return 'clayLoam';
    if (clay >= 27 && clay < 40 && sand <= 20) return 'siltyClayLoam';
    if (clay >= 35 && sand > 45) return 'sandyClay';
    if (clay >= 40 && silt >= 40) return 'siltyClay';
    return 'clay';
  }
  /* triangle: clay apex on top, sand bottom-left, silt bottom-right */
  const W = 320, H = 277, PAD = 26;
  const pt = (sand, clay) => {
    const silt = 100 - sand - clay;
    return [PAD + (silt + clay / 2) / 100 * W, PAD + (1 - clay / 100) * H];
  };
  function triangleSvg() {
    const cls = classify(tex.sand, tex.clay);
    const polys = Object.keys(TEXTURE_POLY).map(k =>
      `<polygon class="tp ${k === cls ? 'on' : ''}" points="${TEXTURE_POLY[k].map(p => pt(p[0], p[1]).map(n => n.toFixed(1)).join(',')).join(' ')}"/>`).join('');
    const [x, y] = pt(tex.sand, tex.clay);
    const a = pt(0, 100), b = pt(100, 0), c = pt(0, 0);
    return `<svg class="tri" viewBox="0 0 ${W + PAD * 2} ${H + PAD * 2 + 8}" role="img" aria-label="${esc(t('tTexture'))}: ${esc(tr(TEXTURE[cls]))}">
      ${polys}
      <circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7"/>
      <text x="${a[0]}" y="${a[1] - 9}" text-anchor="middle">${esc(t('clay'))}</text>
      <text x="${b[0] - 4}" y="${b[1] + 20}" text-anchor="start">${esc(t('sand'))}</text>
      <text x="${c[0] + 4}" y="${c[1] + 20}" text-anchor="end">${esc(t('silt'))}</text>
    </svg>`;
  }
  function textureResult() {
    const silt = 100 - tex.sand - tex.clay;
    const cls = classify(tex.sand, tex.clay);
    return `<div class="tex-out">
      ${triangleSvg()}
      <div class="readout">
        <p class="label">${esc(t('textureClass'))}</p>
        <p class="big">${esc(tr(TEXTURE[cls]))}</p>
        <p class="split">${esc(t('sand'))} ${tex.sand}% · ${esc(t('silt'))} ${silt}% · ${esc(t('clay'))} ${tex.clay}%</p>
        <p>${esc(tr(TEXTURE_NOTE[TEXTURE_GROUP[cls]]))}</p>
      </div>
    </div>`;
  }
  function toolTexture() {
    return `<p class="tool-desc">${esc(t('tTextureDesc'))}</p>
      <div id="texout" aria-live="polite">${textureResult()}</div>
      <div class="sliders">
        <label>${esc(t('sand'))} <output id="o-sand">${tex.sand}%</output><input type="range" id="r-sand" min="0" max="100" value="${tex.sand}"></label>
        <label>${esc(t('clay'))} <output id="o-clay">${tex.clay}%</output><input type="range" id="r-clay" min="0" max="100" value="${tex.clay}"></label>
        <p class="hint">${esc(t('siltAuto'))}</p>
      </div>
      ${saveBar('texture')}
      <form class="jar" id="jar">
        <h2>${esc(t('jarTitle'))}</h2>
        <p>${esc(t('jarDesc'))}</p>
        <div class="row3">
          <label>${esc(t('jarClay'))}<input type="number" inputmode="decimal" min="0" step="any" name="clay"></label>
          <label>${esc(t('jarSilt'))}<input type="number" inputmode="decimal" min="0" step="any" name="silt"></label>
          <label>${esc(t('jarSand'))}<input type="number" inputmode="decimal" min="0" step="any" name="sand"></label>
        </div>
        <button class="btn" type="submit">${esc(t('jarApply'))}</button>
        <p class="err" id="jarerr" role="alert" hidden>${esc(t('jarErr'))}</p>
      </form>`;
  }
  function updateTexture() {
    document.getElementById('texout').innerHTML = textureResult();
    document.getElementById('o-sand').textContent = tex.sand + '%';
    document.getElementById('o-clay').textContent = tex.clay + '%';
    document.getElementById('r-sand').value = tex.sand;
    document.getElementById('r-clay').value = tex.clay;
  }

  /* ----- pH tool ----- */
  function phResult() {
    const b = PH_BANDS.find(x => ph < x.max);
    return `<div class="readout">
        <p class="label">pH ${ph.toFixed(1)}</p>
        <p class="big">${esc(tr(b.name))}</p>
        <p><b>${esc(t('whatToDo'))}:</b> ${esc(tr(b.text))}</p>
      </div>
      <ul class="res plain-res">
        <li><span>${esc(t('alRisk'))}</span><b class="risk ${b.risk}">${esc(t(b.risk))}</b></li>
        <li><span>${esc(t('phLimited'))}</span><b>${b.limited || esc(t('phNone'))}</b></li>
        <li><span>${esc(t('phExcess'))}</span><b>${b.excess || esc(t('phNone'))}</b></li>
      </ul>
      <p class="hint">${esc(t('availNote'))}</p>
      ${limeCard()}`;
  }
  function limeCard() {
    const crop = CROP_PH.find(c => c.id === phx.crop);
    const [lo, hi] = crop.range;
    let body;
    if (ph > hi) body = `<p>${esc(t('aboveRange'))}</p>`;
    else if (ph >= lo) body = `<p>${esc(t('inRange'))}</p>`;
    else {
      const f = LIME_TEX.find(x => x.id === phx.tex).f;
      const to = Math.min(lo, ph + 1);
      const tonnes = (to - ph) * f;
      body = `<p class="big">${num(tonnes)} t/ha</p>
        <p>${esc(fill('limeText', { a: ph.toFixed(1), b: to.toFixed(1), t: num(tonnes) }))}${to < lo ? ' ' + esc(t('limeMore')) : ''}</p>
        <details><summary>${esc(t('working'))}</summary><p class="work">(${to.toFixed(1)} − ${ph.toFixed(1)}) × ${f} = ${num(tonnes)} t/ha</p><p class="hint">${esc(t('limeNote'))}</p></details>`;
    }
    return `<h2>${esc(t('limeEst'))}</h2>
      <p class="label">${esc(tr(crop.name))}: ${esc(t('target'))} ${lo.toFixed(1)} – ${hi.toFixed(1)}</p>${body}`;
  }
  function toolPh() {
    return `<p class="tool-desc">${esc(t('tPhDesc'))}</p>
      <label class="phslider">${esc(t('phValue'))}
        <input type="range" id="r-ph" min="3" max="9" step="0.1" value="${ph}" style="--track:${PH_GRADIENT}">
        ${phTicks()}
      </label>
      <div class="row2">
        <label>${esc(t('crop'))}<select data-phx="crop">${CROP_PH.map(c => `<option value="${c.id}" ${phx.crop === c.id ? 'selected' : ''}>${esc(tr(c.name))}</option>`).join('')}</select></label>
        <label>${esc(t('soilTex'))}<select data-phx="tex">${LIME_TEX.map(c => `<option value="${c.id}" ${phx.tex === c.id ? 'selected' : ''}>${esc(tr(c.name))}</option>`).join('')}</select></label>
      </div>
      <div id="phout" aria-live="polite">${phResult()}</div>
      ${saveBar('ph')}`;
  }

  /* ----- slope tool ----- */
  /* a rise of 0 is flat ground and is valid; a blank rise is not */
  function slopeValues() {
    const rise = Number(slope.rise), run = Number(slope.run);
    if (String(slope.rise).trim() === '' || !Number.isFinite(rise) || rise < 0 || !Number.isFinite(run) || run <= 0) return null;
    return { rise, run };
  }
  function slopeResult() {
    const v = slopeValues();
    if (!v) return `<p class="empty">${esc(t('enterSlope'))}</p>`;
    const { rise, run } = v;
    const pct = rise / run * 100;
    const deg = Math.atan(rise / run) * 180 / Math.PI;
    return `<div class="readout">
        <p class="label">${esc(t('slope'))}</p>
        <p class="big">${num(pct)}% · ${num(deg)}°</p>
      </div>
      <ul class="res plain-res">
        <li><span>${esc(t('slopeDo'))}</span><b>${esc(tr(SLOPE_DO.find(x => pct < x.max).text))}</b></li>
        <li><span>${esc(t('slopePalm'))}</span><b>${esc(tr(SLOPE_PALM.find(x => deg <= x.max).name))}</b></li>
      </ul>
      <details open><summary>${esc(t('working'))}</summary><p class="work">${num(rise, 2)} ÷ ${num(run, 2)} × 100 = ${num(pct)}%</p></details>
      <p class="hint">${esc(t('slopeNote'))}</p>`;
  }
  function toolSlope() {
    const f = (key) => `<label>${esc(t(key))}<input type="number" inputmode="decimal" min="0" step="any" data-slope="${key}" value="${esc(slope[key])}"></label>`;
    return `<p class="tool-desc">${esc(t('tSlopeDesc'))}</p>
      <div class="row2">${f('rise')}${f('run')}</div>
      <div id="slopeout" aria-live="polite">${slopeResult()}</div>
      ${saveBar('slope')}`;
  }

  /* ----- deficiency key ----- */
  function toolDef() {
    const list = def.where ? DEFICIENCY[def.where] : [];
    const hit = list.find(d => d.s === def.pick);
    return `<p class="tool-desc">${esc(t('tDefDesc'))}</p>
      <h2 class="first">${esc(t('defWhere'))}</h2>
      <div class="seg small">${[['old', 'defOld'], ['young', 'defYoung']].map(w =>
        `<button type="button" data-defwhere="${w[0]}" aria-pressed="${def.where === w[0]}">${esc(t(w[1]))}</button>`).join('')}</div>
      ${def.where ? `<h2>${esc(t('defPick'))}</h2>
        <div class="opts">${list.map(d => `<button type="button" class="opt ${def.pick === d.s ? 'chosen' : ''}" data-defpick="${d.s}" aria-pressed="${def.pick === d.s}">${esc(tr(d.sign))}</button>`).join('')}</div>` : ''}
      <div aria-live="polite">${hit ? `<div class="readout">
        <p class="label">${esc(t('defLikely'))}</p>
        <p class="big">${esc(tr(hit.name))} (${hit.s})</p>
        <p><b>${esc(t('whatToDo'))}:</b> ${esc(tr(hit.fix))}</p>
        <p class="note">${esc(t('defCaveat'))}</p></div>` : ''}</div>`;
  }

  /* ----- fertiliser tool ----- */
  const HA = { ha: 1, m2: 1 / 10000, acre: 0.4047 };
  const areaHa = () => Math.max(0, Number(fert.area) || 0) * HA[fert.unit];
  const prod = id => PRODUCTS.find(p => p.id === id);
  const kg = v => `${num(v, v < 10 ? 2 : 1)} kg`;
  const numIn = (label, key, extra = '') => `<label>${label}<input type="number" inputmode="decimal" min="0" step="any" data-f="${key}" value="${esc(fert[key])}" ${extra}></label>`;
  function areaFields() {
    return `<div class="row2">${numIn(esc(t('area')), 'area')}
      <label><span class="vh">${esc(t('area'))}</span><select data-f="unit">${['ha', 'm2', 'acre'].map(u => `<option value="${u}" ${fert.unit === u ? 'selected' : ''}>${esc(t(u))}</option>`).join('')}</select></label>
    </div>`;
  }
  function gradeFields(key) {
    return `<fieldset class="grade"><legend>${esc(t('grade'))}</legend>
      <div class="row3">${['N', 'P₂O₅', 'K₂O'].map((s, i) => `<label>${s}<input type="number" inputmode="decimal" min="0" max="100" step="any" data-g="${key}" data-i="${i}" value="${esc(fert[key][i])}"></label>`).join('')}</div>
      <div class="presets">${COMPOUND_PRESETS.map(p => `<button type="button" data-preset="${key}:${p.join('-')}">${p.join('-')}</button>`).join('')}</div>
    </fieldset>`;
  }
  function fertInputs() {
    if (fert.mode === 'straight') {
      const row = (sym, rateKey, prodKey, field) => `<div class="row2">
        ${numIn(`${sym} · ${esc(t('rate'))}`, rateKey)}
        <label>${esc(t('product'))}<select data-f="${prodKey}">${PRODUCTS.filter(p => p[field] > 0).map(p => `<option value="${p.id}" ${fert[prodKey] === p.id ? 'selected' : ''}>${esc(tr(p.name))} (${p[field]}%)</option>`).join('')}</select></label>
      </div>`;
      return areaFields() + row('N', 'n', 'pn', 'n') + row('P₂O₅', 'p', 'pp', 'p') + row('K₂O', 'k', 'pk', 'k') + `<p class="hint">${esc(t('typical'))}</p>`;
    }
    if (fert.mode === 'compound') {
      return areaFields() + gradeFields('g') + `<div class="row2">
        <label>${esc(t('basis'))}<select data-f="basis">${[['n', 'N'], ['p', 'P₂O₅'], ['k', 'K₂O']].map(b => `<option value="${b[0]}" ${fert.basis === b[0] ? 'selected' : ''}>${b[1]}</option>`).join('')}</select></label>
        ${numIn(esc(t('rate')), 'crate')}
      </div>`;
    }
    if (fert.mode === 'plant') {
      return `<div class="row2">${numIn(esc(t('perPlantNeed')), 'need')}${numIn(esc(t('pct')), 'pct', 'max="100"')}</div>${numIn(esc(t('plants')), 'plants')}`;
    }
    if (fert.mode === 'tree') {
      return `<div class="row2">${numIn(esc(t('treeRate')), 'trate')}${numIn(esc(t('apps')), 'tapps')}</div>${numIn(esc(t('trees')), 'ttrees')}`;
    }
    return `<div class="row2">${numIn(esc(t('bagWeight')), 'bag')}${numIn(esc(t('price')), 'price')}</div>` + gradeFields('bg') +
      `<p class="label">${esc(t('organicPresets'))}</p><div class="presets">${ORGANIC_PRESETS.map(o => `<button type="button" data-preset="bg:${o.g.join('-')}">${esc(tr(o.name))}</button>`).join('')}</div>`;
  }
  /* percentages typed into the calculator must be real percentages */
  function fertProblem() {
    const pctOk = v => Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 100;
    const gradeOk = g => g.every(pctOk) && g.reduce((sum, v) => sum + Number(v), 0) <= 100;
    if (fert.mode === 'compound' && !gradeOk(fert.g)) return 'pctBad';
    if (fert.mode === 'bag' && !gradeOk(fert.bg)) return 'pctBad';
    if (fert.mode === 'plant' && String(fert.pct).trim() !== '' && !pctOk(fert.pct)) return 'pctBad';
    return null;
  }
  function fertResult() {
    const a = areaHa();
    const empty = `<p class="empty">${esc(t('enterRate'))}</p>`;
    const problem = fertProblem();
    if (problem) return `<p class="err" role="alert">${esc(t(problem))}</p>`;
    if (fert.mode === 'straight') {
      const lines = [['N', 'n', 'pn'], ['P₂O₅', 'p', 'pp'], ['K₂O', 'k', 'pk']].map(([sym, rk, pk]) => {
        const rate = Number(fert[rk]) || 0;
        if (rate <= 0) return null;
        const p = prod(fert[pk]);
        const perHa = rate / (p[rk] / 100);
        return { sym, rate, p, pctv: p[rk], perHa, total: perHa * a };
      }).filter(Boolean);
      if (!lines.length) return empty;
      return `<h2>${esc(t('result'))}</h2>
        <ul class="res">${lines.map(l => `<li><span>${esc(tr(l.p.name))}</span><b>${kg(l.total)}</b><small>${num(l.perHa)} ${esc(t('perHa'))} · ${num(l.total / 50, 1)} ${esc(t('bags50'))}</small></li>`).join('')}</ul>
        <details open><summary>${esc(t('working'))}</summary><ol class="work">${lines.map(l =>
          `<li>${l.sym}: ${num(l.rate)} ÷ ${(l.pctv / 100).toFixed(2)} = ${num(l.perHa)} ${esc(t('perHa'))}; × ${num(a, 4)} ha = ${kg(l.total)}</li>`).join('')}</ol></details>`;
    }
    const syms = ['N', 'P₂O₅', 'K₂O'];
    if (fert.mode === 'compound') {
      const idx = { n: 0, p: 1, k: 2 }[fert.basis];
      const g = fert.g.map(v => Number(v) || 0);
      const rate = Number(fert.crate) || 0;
      if (rate <= 0) return empty;
      if (g[idx] <= 0) return `<p class="empty">${esc(t('gradeZero'))}</p>`;
      const perHa = rate / (g[idx] / 100), total = perHa * a;
      return `<h2>${esc(t('result'))}</h2>
        <ul class="res"><li><span>NPK ${g.join('-')}</span><b>${kg(total)}</b><small>${num(perHa)} ${esc(t('perHa'))} · ${num(total / 50, 1)} ${esc(t('bags50'))}</small></li></ul>
        <p><b>${esc(t('alsoSupplies'))}</b> (${esc(t('perHa'))}): ${syms.map((s, i) => `${s} ${num(perHa * g[i] / 100)}`).join(' · ')}</p>
        <details open><summary>${esc(t('working'))}</summary><ol class="work">
          <li>${syms[idx]}: ${num(rate)} ÷ ${(g[idx] / 100).toFixed(2)} = ${num(perHa)} ${esc(t('perHa'))}</li>
          <li>${num(perHa)} × ${num(a, 4)} ha = ${kg(total)}</li></ol></details>`;
    }
    if (fert.mode === 'plant') {
      const need = Number(fert.need) || 0, pctv = Number(fert.pct) || 0, n = Math.max(0, Number(fert.plants) || 0);
      if (need <= 0 || pctv <= 0) return empty;
      const each = need / (pctv / 100), total = each * n / 1000;
      return `<h2>${esc(t('result'))}</h2>
        <ul class="res">
          <li><span>${esc(t('perPlant'))}</span><b>${num(each)} g</b></li>
          <li><span>${esc(t('total'))}</span><b>${kg(total)}</b><small>${num(total / 50, 1)} ${esc(t('bags50'))}</small></li>
        </ul>
        <details open><summary>${esc(t('working'))}</summary><ol class="work">
          <li>${num(need)} ÷ ${(pctv / 100).toFixed(2)} = ${num(each)} g</li>
          <li>${num(each)} × ${num(n, 0)} = ${num(each * n, 0)} g = ${kg(total)}</li></ol></details>`;
    }
    if (fert.mode === 'tree') {
      const rate = Number(fert.trate) || 0, apps = Math.max(0, Math.round(Number(fert.tapps) || 0)), n = Math.max(0, Number(fert.ttrees) || 0);
      if (rate <= 0 || apps <= 0) return empty;
      const each = rate / apps, round = each * n, year = rate * n;
      return `<h2>${esc(t('result'))}</h2>
        <ul class="res">
          <li><span>${esc(t('perApp'))}</span><b>${each < 1 ? num(each * 1000, 0) + ' g' : kg(each)}</b></li>
          <li><span>${esc(t('perRound'))}</span><b>${kg(round)}</b><small>${num(round / 50, 1)} ${esc(t('bags50'))}</small></li>
          <li><span>${esc(t('perYear'))}</span><b>${kg(year)}</b><small>${num(year / 50, 1)} ${esc(t('bags50'))}</small></li>
        </ul>
        <details open><summary>${esc(t('working'))}</summary><ol class="work">
          <li>${num(rate, 2)} ÷ ${apps} = ${num(each, 3)} kg</li>
          <li>${num(each, 3)} × ${num(n, 0)} = ${kg(round)}</li>
          <li>${num(rate, 2)} × ${num(n, 0)} = ${kg(year)}</li></ol></details>`;
    }
    const w = Number(fert.bag) || 0;
    const g = fert.bg.map(v => Number(v) || 0);
    if (w <= 0) return empty;
    const amt = g.map(x => w * x / 100);
    const sum = amt[0] + amt[1] + amt[2];
    const price = Number(fert.price) || 0;
    return `<h2>${esc(t('contains'))}</h2>
      <ul class="res">${syms.map((s, i) => `<li><span>${s}</span><b>${kg(amt[i])}</b><small>${num(w)} × ${num(g[i] / 100, 3)}</small></li>`).join('')}</ul>
      <p><b>${esc(t('elemental'))}:</b> P ${kg(amt[1] * 0.436)} (P₂O₅ × 0.436) · K ${kg(amt[2] * 0.83)} (K₂O × 0.83)</p>
      ${price > 0 && sum > 0 ? `<ul class="res"><li><span>${esc(t('costPerKg'))}</span><b>${num(price / sum, 2)}</b><small>${num(price, 2)} ÷ ${num(sum, 2)} kg. ${esc(t('costNote'))}</small></li></ul>` : ''}`;
  }
  function toolFert() {
    return `<p class="tool-desc">${esc(t('tFertDesc'))}</p>
      <div class="seg small" role="tablist">${[['straight', 'modeStraight'], ['compound', 'modeCompound'], ['plant', 'modePlant'], ['tree', 'modeTree'], ['bag', 'modeBag']].map(m =>
        `<button type="button" role="tab" data-mode="${m[0]}" aria-selected="${fert.mode === m[0]}">${esc(t(m[1]))}</button>`).join('')}</div>
      <form class="fert" id="fert" onsubmit="return false">${fertInputs()}</form>
      <div class="fert-out" id="fertout" aria-live="polite">${fertResult()}</div>
      ${fert.mode === 'bag' ? '' : saveBar('fert')}`;
  }


  /* ----- field records ----- */
  const today = () => new Date().toLocaleDateString('en-CA');           // YYYY-MM-DD in local time
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const plotById = id => rec.plots.find(p => p.id === id);
  const entriesOf = id => rec.entries.filter(e => e.plot === id).sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  const KIND_KEY = { texture: 'kTexture', ph: 'kPh', slope: 'kSlope', fert: 'kFert', note: 'kNote' };
  /* an entry's detail, rendered in the current language from the stored numbers */
  function entryText(e) {
    const d = e.data || {};
    if (e.kind === 'texture') return `${tr(TEXTURE[classify(d.sand, d.clay)])}: ${t('sand')} ${d.sand}% · ${t('silt')} ${100 - d.sand - d.clay}% · ${t('clay')} ${d.clay}%`;
    if (e.kind === 'ph') return `pH ${Number(d.ph).toFixed(1)} · ${tr(PH_BANDS.find(x => d.ph < x.max).name)}`;
    if (e.kind === 'slope') return `${num(d.rise / d.run * 100)}% · ${num(Math.atan(d.rise / d.run) * 180 / Math.PI)}°`;
    if (e.kind === 'fert') return `${d.what}: ${kg(Number(d.kg))}`;
    return String(d.text || '');
  }
  const makeEntry = (plot, date, kind, data) => ({ id: newId(), plot, date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today(), kind, data });
  /* returns false if the entries could not be stored */
  const addEntries = list => commitRec(() => { rec.entries.push(...list); });
  /* the lines the fertiliser calculator would apply right now */
  function fertLines(material) {
    if (fertProblem()) return [];
    const a = areaHa();
    if (fert.mode === 'straight') {
      return [['n', 'pn'], ['p', 'pp'], ['k', 'pk']].map(([rk, pk]) => {
        const rate = Number(fert[rk]) || 0, p = prod(fert[pk]);
        return rate > 0 && a > 0 ? { what: tr(p.name), kg: rate / (p[rk] / 100) * a } : null;
      }).filter(Boolean);
    }
    if (fert.mode === 'compound') {
      const g = fert.g.map(v => Number(v) || 0), i = { n: 0, p: 1, k: 2 }[fert.basis], rate = Number(fert.crate) || 0;
      return rate > 0 && g[i] > 0 && a > 0 ? [{ what: `NPK ${g.join('-')}`, kg: rate / (g[i] / 100) * a }] : [];
    }
    const what = material.trim() || t('product');
    if (fert.mode === 'plant') {
      const need = Number(fert.need) || 0, pctv = Number(fert.pct) || 0, n = Number(fert.plants) || 0;
      return need > 0 && pctv > 0 && n > 0 ? [{ what, kg: need / (pctv / 100) * n / 1000 }] : [];
    }
    if (fert.mode === 'tree') {
      const rate = Number(fert.trate) || 0, apps = Math.round(Number(fert.tapps) || 0), n = Number(fert.ttrees) || 0;
      return rate > 0 && apps > 0 && n > 0 ? [{ what, kg: rate / apps * n }] : [];
    }
    return [];
  }
  function saveBar(kind) {
    if (!rec.plots.length) return `<p class="savebar hint">${esc(t('needPlot'))} <a href="#/rekod">${esc(t('addPlot'))}</a></p>`;
    const last = store.get('lastPlot', '');
    const needsName = kind === 'fert' && (fert.mode === 'plant' || fert.mode === 'tree');
    return `<form class="savebar" data-save="${kind}">
      <div class="row2">
        <label>${esc(t('plots'))}<select name="plot">${rec.plots.map(p => `<option value="${esc(p.id)}" ${p.id === last ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label>
        <label>${esc(t('date'))}<input type="date" name="date" value="${today()}"></label>
      </div>
      ${needsName ? `<label>${esc(t('what'))}<input type="text" name="what" maxlength="60"></label>` : ''}
      <button class="btn" type="submit">${esc(t('saveToRec'))}</button>
      <p class="savemsg" role="status"></p>
    </form>`;
  }
  function handleSave(form) {
    const f = new FormData(form), plot = plotById(f.get('plot')), kind = form.dataset.save;
    const msg = form.querySelector('.savemsg');
    if (!plot) return;
    const date = f.get('date');
    let list = [];
    if (kind === 'texture') list = [makeEntry(plot.id, date, kind, { sand: tex.sand, clay: tex.clay })];
    else if (kind === 'ph') list = [makeEntry(plot.id, date, kind, { ph })];
    else if (kind === 'slope') {
      const v = slopeValues();
      if (v) list = [makeEntry(plot.id, date, kind, v)];
    } else if (kind === 'fert') {
      list = fertLines(String(f.get('what') || '')).map(l => makeEntry(plot.id, date, 'fert', { what: l.what, kg: Math.round(l.kg * 100) / 100 }));
    }
    const stored = list.length > 0 && addEntries(list);
    if (stored) store.set('lastPlot', plot.id);
    msg.className = 'savemsg ' + (stored ? 'ok' : 'err');
    msg.innerHTML = stored ? `${esc(fill('savedTo', { p: plot.name }))} <a href="#/rekod/${esc(plot.id)}">${esc(t('navRecords'))}</a>`
      : esc(t(list.length ? 'saveFailed' : (kind === 'fert' && fertProblem()) || 'nothingToSave'));
  }

  function latestOf(id, kind) { return entriesOf(id).find(e => e.kind === kind); }
  function pageRecords() {
    return `<section class="page">
      <h1>${esc(t('navRecords'))}</h1>
      <p class="lede">${esc(t('recIntro'))}</p>
      <p class="note">${esc(t('recDevice'))}</p>
      <h2>${esc(t('plots'))}</h2>
      ${rec.plots.length ? `<ul class="quizlist">${rec.plots.map(p => {
        const n = entriesOf(p.id).length, phE = latestOf(p.id, 'ph');
        return `<li><a href="#/rekod/${esc(p.id)}"><span class="ltitle"><b>${esc(p.name)}</b><small>${[p.crop, p.area ? `${p.area} ${t(p.unit)}` : '', `${n} ${t('entries')}`, phE ? `pH ${Number(phE.data.ph).toFixed(1)}` : ''].filter(Boolean).map(esc).join(' · ')}</small></span></a></li>`;
      }).join('')}</ul>` : `<p class="empty">${esc(t('noPlots'))}</p>`}
      <form class="tool recform" id="plotform">
        <h2 class="first">${esc(t('addPlot'))}</h2>
        <label>${esc(t('plotName'))}<input type="text" name="name" maxlength="60" required></label>
        <label>${esc(t('crop'))}<input type="text" name="crop" maxlength="60"></label>
        <div class="row2">
          <label>${esc(t('area'))}<input type="number" inputmode="decimal" min="0" step="any" name="area"></label>
          <label><span class="vh">${esc(t('area'))}</span><select name="unit">${['ha', 'm2', 'acre'].map(u => `<option value="${u}">${esc(t(u))}</option>`).join('')}</select></label>
        </div>
        <label>${esc(t('trees'))}<input type="number" inputmode="numeric" min="0" step="1" name="trees"></label>
        <button class="btn" type="submit">${esc(t('savePlot'))}</button>
        <p class="err" role="alert" hidden>${esc(t('nameNeeded'))}</p>
      </form>
      <div class="lesson-end">
        <button type="button" class="btn ghost" data-backup>${esc(t('backup'))}</button>
        <label class="btn ghost filebtn">${esc(t('restore'))}<input type="file" id="restorefile" accept="application/json,.json" class="vh"></label>
      </div>
      <p class="savemsg" id="recmsg" role="status"></p>
    </section>`;
  }
  function pagePlot(id) {
    const p = plotById(id);
    if (!p) return pageRecords();
    const list = entriesOf(id);
    const latest = kind => { const e = latestOf(id, kind); return e ? `${esc(entryText(e))} <small>${esc(e.date)}</small>` : `<span class="plain">${esc(t('noReading'))}</span>`; };
    return `<section class="page">
      <a class="back" href="#/rekod">‹ ${esc(t('allPlots'))}</a>
      <h1 class="plot-title">${esc(p.name)}</h1>
      <p class="lede">${[p.crop, p.area ? `${p.area} ${t(p.unit)}` : '', p.trees ? `${t('trees')}: ${p.trees}` : ''].filter(Boolean).map(esc).join(' · ')}</p>
      <h2>${esc(t('latest'))}</h2>
      <ul class="res plain-res latest">
        <li><span>${esc(t('kTexture'))}</span><b>${latest('texture')}</b></li>
        <li><span>${esc(t('kPh'))}</span><b>${latest('ph')}</b></li>
        <li><span>${esc(t('kSlope'))}</span><b>${latest('slope')}</b></li>
      </ul>
      <h2>${esc(t('log'))}</h2>
      ${list.length ? `<ul class="loglist">${list.map(e => `<li>
        <div><small>${esc(e.date)} · ${esc(t(KIND_KEY[e.kind] || 'kNote'))}</small><span>${esc(entryText(e))}</span></div>
        <button type="button" class="delbtn" data-delentry="${esc(e.id)}" aria-label="${esc(t('del'))}: ${esc(entryText(e))}">${esc(t('del'))}</button>
      </li>`).join('')}</ul>` : `<p class="empty">${esc(t('noEntries'))}</p>`}
      <form class="tool recform" id="appform" data-plot="${esc(p.id)}">
        <h2 class="first">${esc(t('addApp'))}</h2>
        <label>${esc(t('date'))}<input type="date" name="date" value="${today()}"></label>
        <div class="row2">
          <label>${esc(t('what'))}<input type="text" name="what" maxlength="60"></label>
          <label>${esc(t('amountKg'))}<input type="number" inputmode="decimal" min="0" step="any" name="kg"></label>
        </div>
        <button class="btn" type="submit">${esc(t('save'))}</button>
        <p class="err" role="alert" hidden>${esc(t('appNeeded'))}</p>
      </form>
      <form class="tool recform" id="noteform" data-plot="${esc(p.id)}">
        <h2 class="first">${esc(t('addNote'))}</h2>
        <label>${esc(t('date'))}<input type="date" name="date" value="${today()}"></label>
        <label>${esc(t('note'))}<textarea name="text" rows="3" maxlength="500"></textarea></label>
        <button class="btn" type="submit">${esc(t('save'))}</button>
        <p class="err" role="alert" hidden>${esc(t('noteNeeded'))}</p>
      </form>
      <div class="lesson-end">
        <button type="button" class="btn ghost" data-csv="${esc(p.id)}">${esc(t('csv'))}</button>
        <button type="button" class="btn ghost danger" data-delplot="${esc(p.id)}">${esc(t('delPlot'))}</button>
      </div>
    </section>`;
  }
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function plotCsv(id) {
    const p = plotById(id);
    const cell = v => { let s = String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };  // quote, and stop spreadsheet formulas
    const rows = [[t('date'), t('plotName'), t('csvType'), t('csvDetail')].map(cell).join(',')]
      .concat(entriesOf(id).reverse().map(e => [e.date, p.name, t(KIND_KEY[e.kind] || 'kNote'), entryText(e)].map(cell).join(',')));
    download(`${p.name.replace(/[^\w一-鿿-]+/g, '_') || 'plot'}.csv`, '﻿' + rows.join('\r\n'), 'text/csv;charset=utf-8');
  }
  /* accept only the shape this app writes */
  function cleanBackup(obj) {
    if (!obj || !Array.isArray(obj.plots) || !Array.isArray(obj.entries)) return null;
    const str = (v, n) => String(v == null ? '' : v).slice(0, n);
    const okId = v => typeof v === 'string' && /^[a-z0-9]{1,40}$/i.test(v);
    const plots = obj.plots.filter(p => p && okId(p.id) && p.name).map(p => ({ id: p.id, name: str(p.name, 60), crop: str(p.crop, 60), area: Number(p.area) > 0 ? Number(p.area) : '', unit: HA[p.unit] ? p.unit : 'ha', trees: Number(p.trees) > 0 ? Math.round(Number(p.trees)) : '' }));
    const ids = new Set(plots.map(p => p.id));
    const fin = v => Number.isFinite(Number(v));
    const entries = obj.entries.filter(e => e && okId(e.plot) && ids.has(e.plot) && Object.prototype.hasOwnProperty.call(KIND_KEY, e.kind) && e.data && typeof e.data === 'object').map(e => {
      const d = e.data;
      let data = null;
      if (e.kind === 'texture' && fin(d.sand) && fin(d.clay) && d.sand >= 0 && d.clay >= 0 && Number(d.sand) + Number(d.clay) <= 100) data = { sand: Number(d.sand), clay: Number(d.clay) };
      else if (e.kind === 'ph' && fin(d.ph) && d.ph >= 0 && d.ph <= 14) data = { ph: Number(d.ph) };
      else if (e.kind === 'slope' && d.rise !== '' && d.rise !== null && fin(d.rise) && Number(d.rise) >= 0 && Number(d.run) > 0) data = { rise: Number(d.rise), run: Number(d.run) };
      else if (e.kind === 'fert' && Number(d.kg) > 0) data = { what: str(d.what, 60), kg: Number(d.kg) };
      else if (e.kind === 'note') data = { text: str(d.text, 500) };
      return data && { id: okId(e.id) ? e.id : newId(), plot: e.plot, date: /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : today(), kind: e.kind, data };
    }).filter(Boolean);
    return { plots, entries };
  }

  /* ----- quiz ----- */
  const GENERATED = 3; // calculation questions added to unit 6 with fresh numbers each attempt
  const quizSize = n => QUIZ[n].length + (n === 6 ? GENERATED : 0);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffled(n) {
    const a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  /* build a numeric question: the correct answer plus three distinct wrong ones */
  function numericQ(q, right, wrongs, unit, why) {
    const seen = new Set([right]);
    const opts = [right];
    for (const w of wrongs.concat([right * 2, right / 2, right + 10, right * 3])) {
      const v = Math.round(w * 10) / 10;
      if (v > 0 && !seen.has(v) && opts.length < 4) { seen.add(v); opts.push(v); }
    }
    return { q, o: opts.map(v => `${num(v)} ${unit}`), a: 0, why };
  }
  function generated() {
    const straight = [['urea', 'N', 46], ['as', 'N', 21], ['tsp', 'P₂O₅', 46], ['mop', 'K₂O', 60]];
    const out = [];
    { // amount of a straight fertiliser for a nutrient target
      const [id, s, g] = pick(straight);
      const ans = pick([100, 150, 200, 250, 300, 400]);
      const x = ans * g / 100;
      out.push(numericQ(fill('gq1', { p: tr(prod(id).name), g, s, x: num(x) }), ans, [x * g / 100, x, ans + 50], 'kg', `${num(x)} ÷ ${(g / 100).toFixed(2)} = ${num(ans)} kg`));
    }
    { // nutrient in a weight of compound fertiliser
      const g = pick([[15, 15, 15], [12, 12, 17], [10, 10, 10], [18, 46, 0]]);
      const i = pick(g[2] === 0 ? [0, 1] : [0, 1, 2]);
      const w = pick([100, 200, 250, 300, 500]);
      const ans = w * g[i] / 100;
      out.push(numericQ(fill('gq2', { w, g: g.join('-'), s: ['N', 'P₂O₅', 'K₂O'][i] }), ans, [w / g[i] * 10, g[i], w - ans], 'kg', `${w} × ${(g[i] / 100).toFixed(2)} = ${num(ans)} kg`));
    }
    { // per-plant amount scaled to a number of plants
      const [id, s, g] = pick(straight);
      const each = pick([25, 50, 100]);           // grams of fertiliser per plant
      const n = pick([100, 200, 400]);
      const x = each * g / 100;
      const ans = each * n / 1000;
      out.push(numericQ(fill('gq3', { p: tr(prod(id).name), g, s, x: num(x), n }), ans, [x * n / 1000, ans * 10, x * g / 100 * n / 1000], 'kg', `${num(x)} ÷ ${(g / 100).toFixed(2)} = ${num(each)} g; ${num(each)} × ${n} = ${num(ans)} kg`));
    }
    return out;
  }
  function startQuiz(n) {
    const qs = QUIZ[n].slice();
    if (n === 6) qs.push(...generated());
    quiz = { n, qs, i: 0, score: 0, picked: null, order: shuffled(4) };
  }
  function pageQuiz(n) {
    const u = UNITS.find(x => x.n === Number(n));
    if (!u) return pageHome();
    const head = unitHead(u, t('quiz'));
    const size = quizSize(u.n);
    if (!quiz || quiz.n !== u.n) {
      return `<section class="page quiz">${head}
        <p>${size} ${esc(t('questions'))}${best[u.n] !== undefined ? ` · ${esc(t('best'))} ${esc(best[u.n])}/${size}` : ''}</p>
        <button type="button" class="btn" data-start="${u.n}">${esc(t('start'))}</button>
      </section>`;
    }
    if (quiz.i >= quiz.qs.length) {
      return `<section class="page quiz">${head}
        <p class="label">${esc(t('score'))}</p>
        <p class="score">${quiz.score}<span>/${size}</span></p>
        <div class="lesson-end">
          <button type="button" class="btn" data-start="${u.n}">${esc(t('retry'))}</button>
          <a class="btn ghost" href="#/nota/${u.lessons[0]}">${esc(t('reviewNotes'))}</a>
        </div>
      </section>`;
    }
    const q = quiz.qs[quiz.i];
    const answered = quiz.picked !== null;
    return `<section class="page quiz">${head}
      <p class="label">${esc(t('question'))} ${quiz.i + 1}${esc(t('questionSuffix'))} ${esc(t('of'))} ${size}</p>
      <h2 class="qtext">${esc(tr(q.q))}</h2>
      <div class="opts">${quiz.order.map(oi => {
        let cls = '';
        if (answered) cls = oi === q.a ? 'right' : (oi === quiz.picked ? 'wrongpick' : '');
        return `<button type="button" class="opt ${cls}" data-pick="${oi}" ${answered ? 'disabled' : ''}>${esc(tr(q.o[oi]))}</button>`;
      }).join('')}</div>
      <div aria-live="polite">${answered ? `<p class="fb ${quiz.picked === q.a ? 'ok' : 'no'}"><b>${esc(t(quiz.picked === q.a ? 'correct' : 'wrong'))}.</b> ${esc(tr(q.why))}</p>
        <button type="button" class="btn" data-nextq>${esc(t(quiz.i + 1 < quiz.qs.length ? 'nextQ' : 'seeResult'))}</button>` : ''}</div>
    </section>`;
  }

  function pageSources() {
    return `<section class="page">
      <h1>${esc(t('navSources'))}</h1>
      <p class="lede">${esc(t('sourcesIntro'))}</p>
      ${SOURCES.map(s => `<h2>${esc(tr(s.topic))}</h2><ul class="srcs">${s.items.map(i => `<li><a href="${esc(i[1])}" target="_blank" rel="noopener">${esc(i[0])}</a></li>`).join('')}</ul>`).join('')}
    </section>`;
  }

  /* ---------- router ---------- */
  const parse = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  function render(keepScroll) {
    const r = parse();
    if (r[0] !== 'kuiz' || (quiz && quiz.n !== Number(r[1]))) quiz = null;
    renderChrome(r);
    main.innerHTML =
      r[0] === 'nota' ? pageLesson(r[1]) :
      r[0] === 'amali' ? pageActivity(r[1]) :
      r[0] === 'kuiz' ? pageQuiz(r[1]) :
      r[0] === 'alat' ? pageTools(r[1]) :
      r[0] === 'rekod' ? (r[1] ? pagePlot(r[1]) : pageRecords()) :
      r[0] === 'istilah' ? pageGlossary() :
      r[0] === 'buku' ? pageBook() :
      r[0] === 'sumber' ? pageSources() : pageHome();
    if (!keepScroll) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', () => render(false));

  /* ---------- events ---------- */
  const redrawTool = fn => { document.getElementById('tool').innerHTML = fn(); };
  document.addEventListener('click', e => {
    const el = e.target.closest('button, a');
    if (!el) return;
    const d = el.dataset;
    if (d.lang) { lang = d.lang; store.set('lang', lang); render(true); return; }
    if (d.hz) {
      horizon = d.hz;
      document.querySelectorAll('.profile').forEach(p => { p.outerHTML = figProfile(); });
      const again = document.querySelector(`.hz[data-hz="${horizon}"]`);
      if (again) again.focus();
      return;
    }
    if (d.done) {
      done = done.includes(d.done) ? done.filter(x => x !== d.done) : done.concat(d.done);
      store.set('done', done); render(true); return;
    }
    if (d.delentry) {
      if (window.confirm(t('confirmDelEntry'))) { commitRec(() => { rec.entries = rec.entries.filter(x => x.id !== d.delentry); }); render(true); }
      return;
    }
    if (d.delplot) {
      if (window.confirm(t('confirmDelPlot'))) {
        if (commitRec(() => { rec.plots = rec.plots.filter(x => x.id !== d.delplot); rec.entries = rec.entries.filter(x => x.plot !== d.delplot); })) location.hash = '#/rekod';
      }
      return;
    }
    if (d.csv) { plotCsv(d.csv); return; }
    if (d.backup !== undefined) { download('soil-records.json', JSON.stringify(rec, null, 1), 'application/json'); return; }
    if (d.defwhere) { def.where = d.defwhere; def.pick = null; redrawTool(toolDef); return; }
    if (d.defpick) { def.pick = d.defpick; redrawTool(toolDef); return; }
    if (d.mode) { fert.mode = d.mode; store.set('fert', fert); redrawTool(toolFert); return; }
    if (d.preset) {
      const [key, g] = d.preset.split(':');
      fert[key] = g.split('-').map(Number); store.set('fert', fert);
      redrawTool(toolFert); return;
    }
    if (d.start) { startQuiz(Number(d.start)); render(false); return; }
    if (d.pick !== undefined && quiz && quiz.picked === null) {
      quiz.picked = Number(d.pick);
      if (quiz.picked === quiz.qs[quiz.i].a) quiz.score++;
      render(true);
      const nx = document.querySelector('[data-nextq]'); if (nx) nx.focus();
      return;
    }
    if (d.nextq !== undefined && quiz) {
      quiz.i++; quiz.picked = null; quiz.order = shuffled(4);
      if (quiz.i >= quiz.qs.length && (best[quiz.n] === undefined || quiz.score > best[quiz.n])) {
        best[quiz.n] = quiz.score; store.set('best2', best);
      }
      render(false);
    }
  });

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.id === 'r-sand' || el.id === 'r-clay') {
      let sand = Number(document.getElementById('r-sand').value);
      let clay = Number(document.getElementById('r-clay').value);
      if (sand + clay > 100) { if (el.id === 'r-sand') clay = 100 - sand; else sand = 100 - clay; }
      tex.sand = sand; tex.clay = clay; updateTexture(); return;
    }
    if (el.id === 'r-ph') { ph = Number(el.value); document.getElementById('phout').innerHTML = phResult(); return; }
    if (el.dataset.slope) { slope[el.dataset.slope] = el.value; document.getElementById('slopeout').innerHTML = slopeResult(); return; }
    if (el.dataset.phx) { phx[el.dataset.phx] = el.value; document.getElementById('phout').innerHTML = phResult(); return; }
    if (el.id === 'gq') { glossQuery = el.value; document.getElementById('glist').innerHTML = glossaryRows(); return; }
    if (el.dataset.f || el.dataset.g) {
      if (el.dataset.f) fert[el.dataset.f] = el.value;
      else fert[el.dataset.g][Number(el.dataset.i)] = el.value;
      store.set('fert', fert);
      document.getElementById('fertout').innerHTML = fertResult();
    }
  });
  document.addEventListener('submit', e => {
    const form = e.target;
    if (form.dataset.save) { e.preventDefault(); handleSave(form); return; }
    if (form.classList.contains('recform')) {
      e.preventDefault();
      const f = new FormData(form), err = form.querySelector('.err');
      const text = k => String(f.get(k) || '').trim();
      const needed = { plotform: 'nameNeeded', appform: 'appNeeded', noteform: 'noteNeeded' }[form.id];
      let valid = false, stored = false;
      if (form.id === 'plotform' && text('name')) {
        valid = true;
        const id = newId();
        stored = commitRec(() => { rec.plots.push({ id, name: text('name').slice(0, 60), crop: text('crop').slice(0, 60), area: Number(f.get('area')) > 0 ? Number(f.get('area')) : '', unit: HA[f.get('unit')] ? f.get('unit') : 'ha', trees: Number(f.get('trees')) > 0 ? Math.round(Number(f.get('trees'))) : '' }); });
        if (stored) store.set('lastPlot', id);
      } else if (form.id === 'appform' && plotById(form.dataset.plot) && text('what') && Number(f.get('kg')) > 0) {
        valid = true;
        stored = addEntries([makeEntry(form.dataset.plot, f.get('date'), 'fert', { what: text('what').slice(0, 60), kg: Number(f.get('kg')) })]);
      } else if (form.id === 'noteform' && plotById(form.dataset.plot) && text('text')) {
        valid = true;
        stored = addEntries([makeEntry(form.dataset.plot, f.get('date'), 'note', { text: text('text').slice(0, 500) })]);
      }
      if (stored) render(true);
      else { err.textContent = t(valid ? 'saveFailed' : needed); err.hidden = false; }
      return;
    }
    if (e.target.id !== 'jar') return;
    e.preventDefault();
    const f = new FormData(e.target);
    const s = Math.max(0, Number(f.get('sand')) || 0), si = Math.max(0, Number(f.get('silt')) || 0), c = Math.max(0, Number(f.get('clay')) || 0);
    const total = s + si + c;
    const err = document.getElementById('jarerr');
    if (total <= 0) { err.hidden = false; return; }
    err.hidden = true;
    tex.sand = Math.round(s / total * 100);
    tex.clay = Math.min(100 - tex.sand, Math.round(c / total * 100));
    updateTexture();
    document.getElementById('texout').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.addEventListener('change', e => {
    if (e.target.id !== 'restorefile' || !e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = () => {
      let clean = null;
      try { clean = cleanBackup(JSON.parse(reader.result)); } catch (err) { clean = null; }
      if (clean && window.confirm(t('confirmRestore'))) {
        const stored = commitRec(() => { rec = clean; });
        render(true);
        const m = document.getElementById('recmsg');
        m.className = 'savemsg ' + (stored ? 'ok' : 'err'); m.textContent = t(stored ? 'restoreOk' : 'saveFailed');
      } else if (!clean) { const m = document.getElementById('recmsg'); m.className = 'savemsg err'; m.textContent = t('restoreBad'); }
    };
    reader.readAsText(e.target.files[0]);
    e.target.value = '';
  });

  rec = cleanBackup(rec) || { plots: [], entries: [] };
  store.set('probe', 1);
  render(false);
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
