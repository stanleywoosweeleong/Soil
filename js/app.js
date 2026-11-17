/* Soil science app: routing, rendering and the three tools. */
(function () {
  'use strict';

  /* ---------- storage ---------- */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('soil.' + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem('soil.' + key, JSON.stringify(value)); } catch (e) { /* private mode */ } },
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

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* escape, then turn **bold** into <strong> */
  const rich = x => esc(tr(x)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const num = (v, d = 1) => Number(v).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-GB', { maximumFractionDigits: d, minimumFractionDigits: 0 });

  /* ---------- state ---------- */
  let done = store.get('done', []);
  let best = store.get('best', {});
  let reflect = store.get('reflect', {});
  let horizon = 'A';
  let quiz = null; // { id, i, score, picked }
  const tex = { sand: 40, clay: 20 };
  let ph = 5.0;
  const fert = store.get('fert', null) || {
    mode: 'straight', area: 1, unit: 'ha',
    n: 100, p: 40, k: 60, pn: 'urea', pp: 'tsp', pk: 'mop',
    g: [15, 15, 15], basis: 'n', crate: 60, bag: 50, bg: [15, 15, 15],
  };

  const ALL_LESSONS = CHAPTERS.flatMap(c => c.lessons);
  const chapterOf = id => CHAPTERS.find(c => c.lessons.includes(id));
  const main = document.getElementById('main');

  /* ---------- chrome ---------- */
  const ICONS = {
    notes: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
    tools: '<path d="M12 3l9 16H3z"/><path d="M12 10v4"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7"/><path d="M12 17h.01"/>',
    sources: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',
  };
  const icon = n => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  function renderChrome(route) {
    const html = LANGS.find(l => l.code === lang).html;
    document.documentElement.lang = html;
    document.title = t('appName');
    document.getElementById('brand').innerHTML =
      `<span class="mark" aria-hidden="true">${HORIZONS.slice(0, 4).map(h => `<i style="background:${h.color}"></i>`).join('')}</span><span>${esc(t('appName'))}</span>`;
    const tabs = [['', 'navHome', 'notes'], ['alat', 'navTools', 'tools'], ['kuiz', 'navQuiz', 'quiz'], ['sumber', 'navSources', 'sources']];
    const top = route[0] === 'nota' ? '' : (route[0] || '');
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
  function figPhScale() {
    const marks = [[3, ['Tanah gambut', 'Peat soil', '泥炭土']], [5, ['Kebanyakan tanah tanah tinggi Malaysia', 'Most Malaysian upland soils', '马来西亚多数高地土壤']], [7, ['Neutral', 'Neutral', '中性']]];
    const pos = v => ((v - 3) / 6) * 100;
    return `<figure class="phfig">
      <div class="ph-track" style="background:${PH_GRADIENT}"></div>
      <div class="ph-ticks">${[3, 4, 5, 6, 7, 8, 9].map(v => `<span style="left:${pos(v)}%">${v}</span>`).join('')}</div>
      <ul class="ph-marks">${marks.map(m => `<li><b>pH ${m[0] === 3 ? '3.0–4.5' : m[0]}</b> ${esc(tr(m[1]))}</li>`).join('')}</ul>
    </figure>`;
  }

  const FIGS = { profile: figProfile, composition: figComposition, structure: figStructure, phscale: figPhScale };
  const TOOL_KEYS = { tekstur: 'tTexture', ph: 'tPh', baja: 'tFert' };

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
      <div class="hero-text">
        <h1>${esc(t('appName'))}</h1>
        <p class="lede">${esc(t('tagline'))}</p>
        <div class="meter" role="img" aria-label="${esc(t('progress'))} ${pct}%">
          <div class="meter-bar"><i style="width:${pct}%"></i></div>
          <span>${esc(t('progress'))}: ${done.length}/${ALL_LESSONS.length}</span>
        </div>
      </div>
      ${figProfile()}
    </section>
    ${CHAPTERS.map(c => `<section class="chapter">
      <header><span class="chip" style="background:${c.chip}">${c.id}</span>
        <div><h2>${esc(tr(c.title))}</h2><p>${esc(tr(c.blurb))}</p></div></header>
      <ul class="lessonlist">
        ${c.lessons.map(id => `<li><a href="#/nota/${id}"><span class="lnum">${id}</span><span class="ltitle">${esc(tr(LESSONS[id].title))}</span>${done.includes(id) ? `<span class="tick" aria-label="${esc(t('done'))}">✓</span>` : ''}</a></li>`).join('')}
        <li><a class="quizlink" href="#/kuiz/${c.id}"><span class="lnum">?</span><span class="ltitle">${esc(t('reflection'))} + Jana Minda</span>${best[c.id] !== undefined ? `<span class="tick">${best[c.id]}/${QUIZ[c.id].length}</span>` : ''}</a></li>
      </ul>
    </section>`).join('')}`;
  }

  function pageLesson(id) {
    const L = LESSONS[id];
    if (!L) return pageHome();
    const c = chapterOf(id);
    const i = ALL_LESSONS.indexOf(id);
    const prev = ALL_LESSONS[i - 1], next = ALL_LESSONS[i + 1];
    const isDone = done.includes(id);
    return `<article class="lesson">
      <a class="back" href="#/">‹ ${esc(t('backToNotes'))}</a>
      <header class="lesson-head"><span class="chip" style="background:${c.chip}">${id}</span><h1>${esc(tr(L.title))}</h1></header>
      ${L.body.map(block).join('')}
      <div class="lesson-end">
        <button type="button" class="btn ${isDone ? 'is-done' : ''}" data-done="${id}" aria-pressed="${isDone}">${isDone ? '✓ ' + esc(t('markedDone')) : esc(t('markDone'))}</button>
        <a class="btn ghost" href="#/kuiz/${c.id}">${esc(t('takeQuiz'))}</a>
      </div>
      <nav class="pager" aria-label="${esc(t('navHome'))}">
        ${prev ? `<a href="#/nota/${prev}"><small>${esc(t('prev'))}</small>${prev} ${esc(tr(LESSONS[prev].title))}</a>` : '<span></span>'}
        ${next ? `<a class="nx" href="#/nota/${next}"><small>${esc(t('next'))}</small>${next} ${esc(tr(LESSONS[next].title))}</a>` : '<span></span>'}
      </nav>
    </article>`;
  }

  function pageTools(which) {
    const order = ['tekstur', 'ph', 'baja'];
    const cur = order.includes(which) ? which : 'tekstur';
    return `<section class="page">
      <h1>${esc(t('navTools'))}</h1>
      <p class="lede">${esc(t('toolsIntro'))}</p>
      <div class="seg" role="tablist">${order.map(k => `<a role="tab" href="#/alat/${k}" aria-selected="${k === cur}">${esc(t(TOOL_KEYS[k]))}</a>`).join('')}</div>
      <div class="tool" id="tool">${cur === 'tekstur' ? toolTexture() : cur === 'ph' ? toolPh() : toolFert()}</div>
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
  function avail(c, v) {
    if (v <= c[0] || v >= c[3]) return 0;
    if (v < c[1]) return (v - c[0]) / (c[1] - c[0]);
    if (v > c[2]) return (c[3] - v) / (c[3] - c[2]);
    return 1;
  }
  function phResult() {
    const cls = PH_CLASSES.find(c => ph < c.max);
    const adv = PH_ADVICE.find(a => ph < a.max);
    const risk = ph < 5.0 ? 'riskHigh' : ph < 5.5 ? 'riskSome' : 'riskLow';
    return `<div class="readout">
        <p class="label">pH ${ph.toFixed(1)}</p>
        <p class="big">${esc(tr(cls.name))}</p>
        <p><b>${esc(t('alRisk'))}:</b> <span class="risk ${risk}">${esc(t(risk))}</span></p>
        <p><b>${esc(t('whatToDo'))}:</b> ${esc(tr(adv.text))}</p>
      </div>
      <h2>${esc(t('availability'))}</h2>
      <ul class="bars">${PH_NUTRIENTS.map(n => {
        const a = Math.round(avail(n.c, ph) * 100);
        return `<li><span class="sym">${n.s}</span><span class="nm">${esc(tr(n.name))}</span><span class="bar" role="img" aria-label="${a}%"><i style="width:${Math.max(a, 2)}%"></i></span></li>`;
      }).join('')}</ul>
      <p class="hint">${esc(t('availNote'))}</p>`;
  }
  function toolPh() {
    return `<p class="tool-desc">${esc(t('tPhDesc'))}</p>
      <label class="phslider">${esc(t('phValue'))}
        <input type="range" id="r-ph" min="3" max="9" step="0.1" value="${ph}" style="--track:${PH_GRADIENT}">
        <span class="ph-ticks">${[3, 4, 5, 6, 7, 8, 9].map(v => `<span style="left:${((v - 3) / 6) * 100}%">${v}</span>`).join('')}</span>
      </label>
      <div id="phout" aria-live="polite">${phResult()}</div>`;
  }

  /* ----- fertiliser tool ----- */
  const HA = { ha: 1, m2: 1 / 10000, acre: 0.4047 };
  const areaHa = () => Math.max(0, Number(fert.area) || 0) * HA[fert.unit];
  const prod = id => PRODUCTS.find(p => p.id === id);
  const kg = v => `${num(v, v < 10 ? 2 : 1)} kg`;
  function areaFields() {
    return `<div class="row2">
      <label>${esc(t('area'))}<input type="number" inputmode="decimal" min="0" step="any" data-f="area" value="${fert.area}"></label>
      <label><span class="vh">${esc(t('area'))}</span><select data-f="unit">${['ha', 'm2', 'acre'].map(u => `<option value="${u}" ${fert.unit === u ? 'selected' : ''}>${esc(t(u))}</option>`).join('')}</select></label>
    </div>`;
  }
  function gradeFields(key) {
    return `<fieldset class="grade"><legend>${esc(t('grade'))}</legend>
      <div class="row3">${['N', 'P₂O₅', 'K₂O'].map((s, i) => `<label>${s}<input type="number" inputmode="decimal" min="0" max="100" step="any" data-g="${key}" data-i="${i}" value="${fert[key][i]}"></label>`).join('')}</div>
      <div class="presets">${COMPOUND_PRESETS.map(p => `<button type="button" data-preset="${key}:${p.join('-')}">${p.join('-')}</button>`).join('')}</div>
    </fieldset>`;
  }
  function fertInputs() {
    if (fert.mode === 'straight') {
      const row = (sym, rateKey, prodKey, field) => `<div class="row2">
        <label>${sym} · ${esc(t('rate'))}<input type="number" inputmode="decimal" min="0" step="any" data-f="${rateKey}" value="${fert[rateKey]}"></label>
        <label>${esc(t('product'))}<select data-f="${prodKey}">${PRODUCTS.filter(p => p[field] > 0).map(p => `<option value="${p.id}" ${fert[prodKey] === p.id ? 'selected' : ''}>${esc(tr(p.name))} (${p[field]}%)</option>`).join('')}</select></label>
      </div>`;
      return areaFields() + row('N', 'n', 'pn', 'n') + row('P₂O₅', 'p', 'pp', 'p') + row('K₂O', 'k', 'pk', 'k') + `<p class="hint">${esc(t('typical'))}</p>`;
    }
    if (fert.mode === 'compound') {
      return areaFields() + gradeFields('g') + `<div class="row2">
        <label>${esc(t('basis'))}<select data-f="basis">${[['n', 'N'], ['p', 'P₂O₅'], ['k', 'K₂O']].map(b => `<option value="${b[0]}" ${fert.basis === b[0] ? 'selected' : ''}>${b[1]}</option>`).join('')}</select></label>
        <label>${esc(t('rate'))}<input type="number" inputmode="decimal" min="0" step="any" data-f="crate" value="${fert.crate}"></label>
      </div>`;
    }
    return `<label>${esc(t('bagWeight'))}<input type="number" inputmode="decimal" min="0" step="any" data-f="bag" value="${fert.bag}"></label>` + gradeFields('bg');
  }
  function fertResult() {
    const a = areaHa();
    if (fert.mode === 'straight') {
      const lines = [['N', 'n', 'pn'], ['P₂O₅', 'p', 'pp'], ['K₂O', 'k', 'pk']].map(([sym, rk, pk]) => {
        const rate = Number(fert[rk]) || 0;
        if (rate <= 0) return null;
        const p = prod(fert[pk]);
        const pctv = p[rk];
        const perHa = rate / (pctv / 100);
        return { sym, rate, p, pctv, perHa, total: perHa * a };
      }).filter(Boolean);
      if (!lines.length) return `<p class="empty">${esc(t('enterRate'))}</p>`;
      return `<h2>${esc(t('result'))}</h2>
        <ul class="res">${lines.map(l => `<li><span>${esc(tr(l.p.name))}</span><b>${kg(l.total)}</b><small>${num(l.perHa)} ${esc(t('perHa'))} · ${num(l.total / 50, 1)} ${esc(t('bags50'))}</small></li>`).join('')}</ul>
        <details open><summary>${esc(t('working'))}</summary><ol class="work">${lines.map(l =>
          `<li>${l.sym}: ${num(l.rate)} ÷ ${(l.pctv / 100).toFixed(2)} = ${num(l.perHa)} ${esc(t('perHa'))}; × ${num(a, 4)} ha = ${kg(l.total)}</li>`).join('')}</ol></details>`;
    }
    if (fert.mode === 'compound') {
      const idx = { n: 0, p: 1, k: 2 }[fert.basis];
      const g = fert.g.map(v => Number(v) || 0);
      const rate = Number(fert.crate) || 0;
      if (rate <= 0) return `<p class="empty">${esc(t('enterRate'))}</p>`;
      if (g[idx] <= 0) return `<p class="empty">${esc(t('gradeZero'))}</p>`;
      const perHa = rate / (g[idx] / 100), total = perHa * a;
      const syms = ['N', 'P₂O₅', 'K₂O'];
      return `<h2>${esc(t('result'))}</h2>
        <ul class="res"><li><span>NPK ${g.join('-')}</span><b>${kg(total)}</b><small>${num(perHa)} ${esc(t('perHa'))} · ${num(total / 50, 1)} ${esc(t('bags50'))}</small></li></ul>
        <p><b>${esc(t('alsoSupplies'))}</b> (${esc(t('perHa'))}): ${syms.map((s, i) => `${s} ${num(perHa * g[i] / 100)}`).join(' · ')}</p>
        <details open><summary>${esc(t('working'))}</summary><ol class="work">
          <li>${syms[idx]}: ${num(rate)} ÷ ${(g[idx] / 100).toFixed(2)} = ${num(perHa)} ${esc(t('perHa'))}</li>
          <li>${num(perHa)} × ${num(a, 4)} ha = ${kg(total)}</li></ol></details>`;
    }
    const w = Number(fert.bag) || 0;
    const g = fert.bg.map(v => Number(v) || 0);
    if (w <= 0) return `<p class="empty">${esc(t('enterRate'))}</p>`;
    const n = w * g[0] / 100, p = w * g[1] / 100, k = w * g[2] / 100;
    return `<h2>${esc(t('contains'))}</h2>
      <ul class="res">
        <li><span>N</span><b>${kg(n)}</b><small>${num(w)} × ${(g[0] / 100).toFixed(2)}</small></li>
        <li><span>P₂O₅</span><b>${kg(p)}</b><small>${num(w)} × ${(g[1] / 100).toFixed(2)}</small></li>
        <li><span>K₂O</span><b>${kg(k)}</b><small>${num(w)} × ${(g[2] / 100).toFixed(2)}</small></li>
      </ul>
      <p><b>${esc(t('elemental'))}:</b> P ${kg(p * 0.436)} (P₂O₅ × 0.436) · K ${kg(k * 0.83)} (K₂O × 0.83)</p>`;
  }
  function toolFert() {
    return `<p class="tool-desc">${esc(t('tFertDesc'))}</p>
      <div class="seg small" role="tablist">${[['straight', 'modeStraight'], ['compound', 'modeCompound'], ['bag', 'modeBag']].map(m =>
        `<button type="button" role="tab" data-mode="${m[0]}" aria-selected="${fert.mode === m[0]}">${esc(t(m[1]))}</button>`).join('')}</div>
      <form class="fert" id="fert" onsubmit="return false">${fertInputs()}</form>
      <div class="fert-out" id="fertout" aria-live="polite">${fertResult()}</div>`;
  }

  /* ----- quiz ----- */
  function pageQuizList() {
    return `<section class="page">
      <h1>${esc(t('navQuiz'))}</h1>
      <p class="lede">${esc(t('quizIntro'))}</p>
      <ul class="quizlist">${CHAPTERS.map(c => `<li><a href="#/kuiz/${c.id}">
        <span class="chip" style="background:${c.chip}">${c.id}</span>
        <span class="ltitle"><b>${esc(tr(c.title))}</b><small>${QUIZ[c.id].length} ${esc(t('questions'))}${best[c.id] !== undefined ? ` · ${esc(t('best'))} ${best[c.id]}/${QUIZ[c.id].length}` : ''}</small></span>
      </a></li>`).join('')}</ul>
    </section>`;
  }
  function shuffled(n) {
    const a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function pageQuiz(id) {
    const c = CHAPTERS.find(x => x.id === id);
    if (!c) return pageQuizList();
    const qs = QUIZ[id];
    const head = `<a class="back" href="#/kuiz">‹ ${esc(t('allQuizzes'))}</a>
      <header class="lesson-head"><span class="chip" style="background:${c.chip}">${id}</span><h1>${esc(tr(c.title))}</h1></header>`;
    if (!quiz || quiz.id !== id) {
      const ticks = reflect[id] || [];
      return `<section class="page quiz">${head}
        <h2>${esc(t('reflection'))}</h2><p class="hint">${esc(t('reflectionHint'))}</p>
        <ul class="checks">${REFLECT[id].map((r, i) => `<li><label><input type="checkbox" data-reflect="${id}:${i}" ${ticks.includes(i) ? 'checked' : ''}><span>${esc(tr(r))}</span></label></li>`).join('')}</ul>
        <h2>Jana Minda</h2>
        <p>${qs.length} ${esc(t('questions'))}${best[id] !== undefined ? ` · ${esc(t('best'))} ${best[id]}/${qs.length}` : ''}</p>
        <button type="button" class="btn" data-start="${id}">${esc(t('start'))}</button>
      </section>`;
    }
    if (quiz.i >= qs.length) {
      return `<section class="page quiz">${head}
        <p class="label">${esc(t('score'))}</p>
        <p class="score">${quiz.score}<span>/${qs.length}</span></p>
        <div class="lesson-end">
          <button type="button" class="btn" data-start="${id}">${esc(t('retry'))}</button>
          <a class="btn ghost" href="#/nota/${c.lessons[0]}">${esc(t('reviewNotes'))}</a>
        </div>
      </section>`;
    }
    const q = qs[quiz.i];
    const answered = quiz.picked !== null;
    return `<section class="page quiz">${head}
      <p class="label">${esc(t('question'))} ${quiz.i + 1}${esc(t('questionSuffix'))} ${esc(t('of'))} ${qs.length}</p>
      <h2 class="qtext">${esc(tr(q.q))}</h2>
      <div class="opts">${quiz.order.map(oi => {
        let cls = '';
        if (answered) cls = oi === q.a ? 'right' : (oi === quiz.picked ? 'wrongpick' : '');
        return `<button type="button" class="opt ${cls}" data-pick="${oi}" ${answered ? 'disabled' : ''}>${esc(tr(q.o[oi]))}</button>`;
      }).join('')}</div>
      <div aria-live="polite">${answered ? `<p class="fb ${quiz.picked === q.a ? 'ok' : 'no'}"><b>${esc(t(quiz.picked === q.a ? 'correct' : 'wrong'))}.</b> ${esc(tr(q.why))}</p>
        <button type="button" class="btn" data-nextq>${esc(t(quiz.i + 1 < qs.length ? 'nextQ' : 'seeResult'))}</button>` : ''}</div>
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
    if (r[0] !== 'kuiz' || (quiz && quiz.id !== r[1])) quiz = null;
    renderChrome(r);
    main.innerHTML =
      r[0] === 'nota' ? pageLesson(r[1]) :
      r[0] === 'alat' ? pageTools(r[1]) :
      r[0] === 'kuiz' ? (r[1] ? pageQuiz(r[1]) : pageQuizList()) :
      r[0] === 'sumber' ? pageSources() : pageHome();
    if (!keepScroll) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', () => render(false));

  /* ---------- events ---------- */
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
    if (d.mode) { fert.mode = d.mode; store.set('fert', fert); document.getElementById('tool').innerHTML = toolFert(); return; }
    if (d.preset) {
      const [key, g] = d.preset.split(':');
      fert[key] = g.split('-').map(Number); store.set('fert', fert);
      document.getElementById('tool').innerHTML = toolFert(); return;
    }
    if (d.start) { quiz = { id: d.start, i: 0, score: 0, picked: null, order: shuffled(4) }; render(false); return; }
    if (d.pick !== undefined && quiz && quiz.picked === null) {
      quiz.picked = Number(d.pick);
      if (quiz.picked === QUIZ[quiz.id][quiz.i].a) quiz.score++;
      render(true);
      const nx = document.querySelector('[data-nextq]'); if (nx) nx.focus();
      return;
    }
    if (d.nextq !== undefined && quiz) {
      quiz.i++; quiz.picked = null; quiz.order = shuffled(4);
      if (quiz.i >= QUIZ[quiz.id].length && (best[quiz.id] === undefined || quiz.score > best[quiz.id])) {
        best[quiz.id] = quiz.score; store.set('best', best);
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
    if (el.dataset.f || el.dataset.g) {
      if (el.dataset.f) fert[el.dataset.f] = el.type === 'number' ? el.value : el.value;
      else fert[el.dataset.g][Number(el.dataset.i)] = el.value;
      store.set('fert', fert);
      document.getElementById('fertout').innerHTML = fertResult();
    }
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.reflect) {
      const [id, i] = el.dataset.reflect.split(':');
      const set = new Set(reflect[id] || []);
      if (el.checked) set.add(Number(i)); else set.delete(Number(i));
      reflect[id] = [...set]; store.set('reflect', reflect);
    }
  });
  document.addEventListener('submit', e => {
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

  render(false);
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
