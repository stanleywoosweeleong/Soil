/* Automated checks. No dependencies: run with `node tests/run.js`.
   They cover the calculation and record-validation code, the bugs found in review so far,
   and the integrity of the content in all three languages. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const calc = require('../js/calc.js');
const store = require('../js/store.js');

/* the content files are plain scripts that declare constants; load them together and hand the constants back */
const names = ['LANGS', 'LANG_ORDER', 'UI', 'HORIZONS', 'UNITS', 'TASKS', 'LESSONS', 'ACTIVITIES', 'QUIZ', 'QUIZ_LESSON', 'DEFICIENCY', 'GLOSSARY', 'BOOK',
  'PRODUCTS', 'COMPOUND_PRESETS', 'ORGANIC_PRESETS', 'TEXTURE', 'TEXTURE_NOTE', 'TEXTURE_POLY', 'TEXTURE_GROUP', 'PH_BANDS', 'CROP_PH', 'SLOPE_PALM', 'SLOPE_DO', 'SOURCES', 'SEARCH_ALIASES'];
const ctx = vm.createContext({});
vm.runInContext(['content', 'units', 'crops', 'records'].map(f => read(`js/${f}.js`)).join('\n') + `\n;globalThis.__c = { ${names.join(', ')} };`, ctx);
const C = ctx.__c;
const N = C.LANGS.length;

let passed = 0;
const failures = [];
function test(name, fn) {
  try { fn(); passed++; } catch (e) { failures.push(`${name}\n    ${String(e.message).split('\n')[0]}`); }
}
const isTuple = x => Array.isArray(x) && x.length === N && x.every(s => typeof s === 'string');
const okText = x => typeof x === 'string' || (isTuple(x) && x.every(s => s.trim() !== ''));

/* ---------- content integrity ---------- */
test('three languages are declared', () => assert.strictEqual(C.LANGS.map(l => l.code).join(','), 'ms,en,zh'));

test('every interface string has all three languages', () => {
  for (const [key, v] of Object.entries(C.UI)) {
    if (key === 'limeSteps') { assert.ok(v.every(okText), key); continue; }
    if (key === 'questionSuffix') { assert.ok(isTuple(v), key); continue; }   // a counter word that only Chinese needs
    assert.ok(isTuple(v) && v.every(s => s.trim() !== ''), `UI.${key}`);
  }
});

test('placeholders match across languages', () => {
  for (const [key, v] of Object.entries(C.UI)) {
    if (!isTuple(v)) continue;
    const marks = v.map(s => (s.match(/\{\w+\}/g) || []).sort().join(','));
    assert.ok(marks.every(m => m === marks[0]), `UI.${key}: ${marks.join(' | ')}`);
  }
});

const TOOLS = ['tekstur', 'ph', 'cerun', 'tanda', 'baja'];
test('every lesson block is well formed in all three languages', () => {
  const kinds = new Set(['p', 'h', 'ul', 'steps', 'note', 'case', 'formula', 'fig', 'tool', 'ex', 'table', 'src']);
  for (const [id, L] of Object.entries(C.LESSONS)) {
    assert.ok(okText(L.title) && isTuple(L.title), `${id} title`);
    L.body.forEach((b, i) => {
      const [kind, v] = b, at = `${id} block ${i} (${kind})`;
      assert.ok(kinds.has(kind), at);
      if (['p', 'h', 'note', 'case', 'formula'].includes(kind)) assert.ok(isTuple(v) && okText(v), at);
      if (kind === 'ul' || kind === 'steps') assert.ok(v.length && v.every(x => isTuple(x) && okText(x)), at);
      if (kind === 'ex') assert.ok(isTuple(v.title) && v.steps.every(isTuple), at);
      if (kind === 'tool') assert.ok(TOOLS.includes(v), at);
      if (kind === 'fig') assert.ok(['profile', 'composition', 'structure', 'phscale'].includes(v), at);
      if (kind === 'src') assert.ok(typeof v.s === 'string' && v.s && typeof v.u === 'string' && isTuple(v.a) && okText(v.a), at);
      if (kind === 'table') {
        assert.ok(v.head.every(x => typeof x === 'string' || isTuple(x)), at + ' head');
        v.rows.forEach(r => { assert.strictEqual(r.length, v.head.length, at + ' row width'); assert.ok(r.every(x => typeof x === 'string' || isTuple(x)), at + ' cells'); });
      }
    });
  }
});

test('every unit has its lessons, a practical and a quiz', () => {
  const seen = new Set();
  for (const u of C.UNITS) {
    assert.ok(isTuple(u.title) && isTuple(u.blurb), `unit ${u.n}`);
    for (const id of u.lessons) { assert.ok(C.LESSONS[id], `unit ${u.n} lesson ${id}`); assert.ok(!seen.has(id), `duplicate ${id}`); seen.add(id); }
    const a = C.ACTIVITIES[u.n];
    assert.ok(a && isTuple(a.title) && isTuple(a.need) && a.steps.every(isTuple), `practical ${u.n}`);
    assert.ok(Array.isArray(C.QUIZ[u.n]) && C.QUIZ[u.n].length >= 5, `quiz ${u.n}`);
  }
  assert.strictEqual(seen.size, Object.keys(C.LESSONS).length, 'a lesson belongs to no unit');
});

test('quiz questions have four distinct answers in each language and point to a lesson', () => {
  for (const [n, list] of Object.entries(C.QUIZ)) {
    assert.strictEqual((C.QUIZ_LESSON[n] || []).length, list.length, `QUIZ_LESSON[${n}] length`);
    list.forEach((q, i) => {
      const at = `quiz ${n} question ${i + 1}`;
      assert.ok(isTuple(q.q) && isTuple(q.why), at);
      assert.strictEqual(q.o.length, 4, at); assert.strictEqual(q.a, 0, at);
      for (let l = 0; l < N; l++) {
        const opts = q.o.map(o => (typeof o === 'string' ? o : o[l]));
        assert.strictEqual(new Set(opts).size, 4, `${at} (${C.LANGS[l].code}) has repeated answers`);
      }
      assert.ok(C.LESSONS[C.QUIZ_LESSON[n][i]], `${at} lesson link`);
    });
  }
});

test('links inside the app point at things that exist', () => {
  for (const t of C.TASKS) {
    const [kind, id] = t.href.split('/');
    assert.ok((kind === 'alat' && TOOLS.includes(id)) || (kind === 'nota' && C.LESSONS[id]), t.href);
  }
  for (const b of C.BOOK) b.to.forEach(id => assert.ok(C.LESSONS[id], `textbook ${b.n} -> ${id}`));
});

test('glossary, deficiency key and sources are complete', () => {
  for (const g of C.GLOSSARY) assert.ok(isTuple(g[0]) && isTuple(g[1]) && okText(g[0]) && okText(g[1]), String(g[0]));
  for (const side of ['old', 'young']) for (const d of C.DEFICIENCY[side]) assert.ok(isTuple(d.name) && isTuple(d.sign) && isTuple(d.fix), d.s);
  for (const s of C.SOURCES) { assert.ok(isTuple(s.topic)); s.items.forEach(i => assert.ok(i[0] && /^https?:\/\//.test(i[1]), i[0])); }
  for (const g of C.SEARCH_ALIASES) assert.ok(g.length >= 2 && g.every(x => typeof x === 'string' && x === x.toLowerCase()), String(g));
});

test('product and preset grades are valid percentages', () => {
  for (const p of C.PRODUCTS) assert.ok(calc.gradeOk([p.n, p.p, p.k]), p.id);
  for (const g of C.COMPOUND_PRESETS) assert.ok(calc.gradeOk(g), String(g));
  for (const o of C.ORGANIC_PRESETS) assert.ok(calc.gradeOk(o.g) && isTuple(o.name), String(o.g));
});

test('chicken manure stays out of the app', () => {
  const all = ['content', 'units', 'crops', 'records'].map(f => read(`js/${f}.js`)).join('\n');
  assert.ok(!/chicken|poultry|tahi ayam|鸡粪/i.test(all));
});

/* ---------- calculations ---------- */
test('texture classes', () => {
  assert.strictEqual(calc.classify(40, 20), 'loam');
  assert.strictEqual(calc.classify(90, 5), 'sand');
  assert.strictEqual(calc.classify(20, 60), 'clay');
  assert.strictEqual(calc.classify(10, 5), 'silt');
  assert.strictEqual(calc.classify(65, 10), 'sandyLoam');
  const classes = new Set();
  for (let s = 0; s <= 100; s++) for (let c = 0; c <= 100 - s; c++) classes.add(calc.classify(s, c));
  assert.strictEqual(classes.size, 12, 'every USDA class is reachable');
});

test('the texture drawing covers the same twelve classes as the classifier', () => {
  assert.deepStrictEqual(Object.keys(C.TEXTURE_POLY).sort(), Object.keys(C.TEXTURE).sort());
  assert.deepStrictEqual(Object.keys(C.TEXTURE_GROUP).sort(), Object.keys(C.TEXTURE).sort());
});

test('flat ground is a valid slope; blank, negative and zero-run are not', () => {
  assert.deepStrictEqual([calc.slopeOf('0', '10').pct, calc.slopeOf('0', '10').deg], [0, 0]);
  assert.strictEqual(calc.slopeOf('1.5', '10').pct, 15);
  for (const [r, n] of [['', '10'], ['-1', '10'], ['1', '0'], ['1', ''], ['x', '10']]) assert.strictEqual(calc.slopeOf(r, n), null, `${r}/${n}`);
});

test('extreme slopes get a class instead of throwing', () => {
  const v = calc.slopeOf('100', '1');
  assert.strictEqual(v.pct, 10000);
  assert.ok(calc.classOf(C.SLOPE_DO, v.pct).text, 'conservation class');
  assert.ok(calc.classOf(C.SLOPE_PALM, v.deg, true).name, 'oil palm class');
  assert.ok(calc.classOf(C.SLOPE_DO, 1e12).text);
  assert.strictEqual(calc.slopeOf('1e308', '1e-300'), null, 'too extreme to divide');
});

const base = { mode: 'straight', area: 1, unit: 'ha', n: 100, p: 40, k: 60, pn: 'urea', pp: 'tsp', pk: 'mop', g: [15, 15, 15], basis: 'n', crate: 60,
  need: 20, pct: 60, plants: 300, pnut: 'k', trate: 4.5, tapps: 4, ttrees: 100, bag: 50, bg: [15, 15, 15] };
const with_ = o => Object.assign({}, base, o);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} vs ${b}`);

test('worked examples from the lessons', () => {
  const lines = calc.fertLines(base, C.PRODUCTS);
  near(lines[0].kg, 100 / 0.46); near(lines[2].kg, 100);
  near(calc.fertLines(with_({ area: 0.5 }), C.PRODUCTS)[0].kg, 100 / 0.46 * 0.5);
  near(calc.fertLines(with_({ mode: 'compound' }), C.PRODUCTS)[0].kg, 400);
  near(calc.fertLines(with_({ mode: 'plant' }), C.PRODUCTS)[0].kg, 10);
  near(calc.fertLines(with_({ mode: 'tree' }), C.PRODUCTS)[0].kg, 112.5);
});

test('percentages outside 0-100 and grades over 100 are refused', () => {
  assert.strictEqual(calc.fertProblem(with_({ mode: 'plant', pct: 200 })), 'pctBad');
  assert.strictEqual(calc.fertProblem(with_({ mode: 'compound', g: [150, 0, 0] })), 'pctBad');
  assert.strictEqual(calc.fertProblem(with_({ mode: 'compound', g: [50, 40, 30] })), 'pctBad');
  assert.strictEqual(calc.fertProblem(with_({ mode: 'bag', bg: [15, 15, -5] })), 'pctBad');
  assert.deepStrictEqual(calc.fertLines(with_({ mode: 'plant', pct: 200 }), C.PRODUCTS), []);
  assert.strictEqual(calc.fertProblem(base), null);
});

test('counts must be whole numbers and are never rounded', () => {
  assert.strictEqual(calc.fertProblem(with_({ mode: 'tree', tapps: 2.5 })), 'countBad');
  assert.strictEqual(calc.fertProblem(with_({ mode: 'tree', tapps: 0 })), 'countBad');
  assert.strictEqual(calc.fertProblem(with_({ mode: 'tree', ttrees: '10.2' })), 'countBad');
  assert.strictEqual(calc.fertProblem(with_({ mode: 'plant', plants: 1.5 })), 'countBad');
  assert.deepStrictEqual(calc.fertLines(with_({ mode: 'tree', tapps: 2.5 }), C.PRODUCTS), []);
  assert.ok(calc.isCount('3') && calc.isCount(1) && !calc.isCount('') && !calc.isCount('2.5') && !calc.isCount(0) && !calc.isCount(-2));
});

test('small amounts keep their full precision', () => {
  const kg = calc.fertLines(with_({ mode: 'plant', need: 0.001, pct: 50, plants: 1 }), C.PRODUCTS)[0].kg;
  near(kg, 0.000002);
  assert.deepStrictEqual(calc.massParts(0.000002).map((x, i) => (i ? x : Math.round(x * 1000) / 1000)), [2, 'mg']);
  assert.strictEqual(calc.massParts(0.0004)[1], 'mg'); assert.strictEqual(calc.massParts(0.002)[1], 'g'); assert.strictEqual(calc.massParts(2)[1], 'kg');
});

test('rounded figures are marked as approximate', () => {
  assert.strictEqual(calc.eq(400, 60, 0.15), '=');
  assert.strictEqual(calc.eq(100 / 0.46, 100, 0.46), '≈');
  assert.strictEqual(calc.eq(10, 100 / 3), '≈', 'a rounded operand makes the line approximate');
  assert.strictEqual(calc.shownAs(217.391304), 217.4); assert.strictEqual(calc.shownAs(12345.678), 12346);
  assert.ok(calc.isExact(0.125) && !calc.isExact(1 / 3));
});

test('the calculator records the grade of what it applies', () => {
  assert.deepStrictEqual(calc.fertLines(base, C.PRODUCTS).map(l => l.grade), [[46, 0, 0], [0, 46, 0], [0, 0, 60]]);
  /* one known percentage is not a grade: 100 g of 15-15-15 chosen by its N must not record 15-0-0 */
  assert.strictEqual(calc.fertLines(with_({ mode: 'plant' }), C.PRODUCTS)[0].grade, null);
  assert.strictEqual(calc.fertLines(with_({ mode: 'plant', pnut: 'n', pct: 15 }), C.PRODUCTS)[0].grade, null);
  assert.strictEqual(calc.fertLines(with_({ mode: 'plant', pnut: '' }), C.PRODUCTS)[0].grade, null);
  assert.strictEqual(calc.fertLines(with_({ mode: 'tree' }), C.PRODUCTS)[0].grade, null);
});

test('a grade is complete or absent, never partly guessed', () => {
  assert.deepStrictEqual(calc.parseGrade(['', '', null]), { grade: null });
  assert.deepStrictEqual(calc.parseGrade(['15', '15', '15']), { grade: [15, 15, 15] });
  assert.deepStrictEqual(calc.parseGrade(['46', '0', '0']), { grade: [46, 0, 0] });
  assert.deepStrictEqual(calc.parseGrade(['15', '', '']), { error: 'gradeAll' });
  assert.deepStrictEqual(calc.parseGrade(['60', '60', '0']), { error: 'pctBad' });
});

test('organic nutrients are totalled apart from mineral fertiliser', () => {
  const e = d => ({ data: d });
  const s = calc.summarise([
    e({ kg: 200, grade: [46, 0, 0], cost: 500, organic: false }),
    e({ kg: 1000, grade: [1.4, 0.4, 2], cost: 200, organic: true, avail: 40 }),
    e({ kg: 500, grade: [0.5, 0.2, 0.5], organic: true, avail: null, cost: null }),
    e({ kg: 2000, grade: null, cost: null }),
  ]);
  near(s.mineral[0], 92); near(s.organicTotal[0], 16.5); near(s.organicAvail[0], 5.6);
  assert.strictEqual(s.organicCount, 2); assert.strictEqual(s.organicWithAvail, 1); assert.strictEqual(s.ungraded, 1);
  assert.strictEqual(s.cost, 700); assert.strictEqual(s.costed, 2);
});

/* ---------- record validation ---------- */
const make = { newId: () => 'fresh1', today: () => '2026-01-01' };
const clean = o => store.cleanRecords(o, make);

test('a backup with the wrong shape is refused', () => {
  for (const bad of [null, {}, { plots: 'x', entries: [] }, { plots: [] }]) assert.strictEqual(clean(bad), null);
});

test('IDs that could break out of an attribute are rejected', () => {
  const evil = 'x" onmouseover="alert(1)';
  const out = clean({ plots: [{ id: evil, name: 'Evil' }, { id: "a'b", name: 'Quote' }, { id: 'good1', name: 'Good' }],
    entries: [{ id: '"><img src=x>', plot: 'good1', date: '2026-01-01', kind: 'note', data: { text: 'kept' } }, { id: 'e2', plot: evil, date: '2026-01-01', kind: 'note', data: { text: 'dropped' } }] });
  assert.deepStrictEqual(out.plots.map(p => p.id), ['good1']);
  assert.deepStrictEqual(out.entries.map(e => e.id), ['fresh1']);
});

test('unknown kinds, including inherited property names, are dropped', () => {
  const out = clean({ plots: [{ id: 'p1', name: 'P' }], entries: ['constructor', 'toString', '__proto__', 'bogus'].map(kind => ({ id: 'e1', plot: 'p1', date: '2026-01-01', kind, data: {} })) });
  assert.strictEqual(out.entries.length, 0);
});

test('valid readings survive: flat ground, tiny weights, graded and organic applications', () => {
  const entry = (kind, data) => ({ id: 'e' + kind, plot: 'p1', date: '2026-02-03', kind, data });
  const out = clean({ plots: [{ id: 'p1', name: 'P', area: 2, unit: 'acre', trees: 80 }], entries: [
    entry('slope', { rise: 0, run: 10 }),
    entry('fert', { what: 'Trace', kg: 0.000002 }),
    entry('fert', { what: 'Manure', kg: 1000, grade: [1.4, 0.4, 2], organic: true, avail: 40, cost: 200 }),
    entry('texture', { sand: 40, clay: 20 }),
    entry('ph', { ph: 5.2 }),
  ] });
  assert.strictEqual(out.entries.length, 5);
  assert.deepStrictEqual(out.entries[0].data, { rise: 0, run: 10 });
  assert.strictEqual(out.entries[1].data.kg, 0.000002);
  assert.deepStrictEqual(out.entries[2].data, { what: 'Manure', kg: 1000, grade: [1.4, 0.4, 2], cost: 200, organic: true, avail: 40 });
  assert.deepStrictEqual(out.plots[0], { id: 'p1', name: 'P', crop: '', area: 2, unit: 'acre', trees: 80 });
});

test('invalid readings are dropped or stripped', () => {
  const entry = (kind, data) => ({ id: 'e1', plot: 'p1', date: 'not-a-date', kind, data });
  const out = clean({ plots: [{ id: 'p1', name: 'P', unit: 'furlong', trees: 2.5 }], entries: [
    entry('ph', { ph: 'abc' }), entry('ph', { ph: 20 }), entry('slope', { rise: 1, run: 0 }), entry('slope', { rise: '', run: 5 }),
    entry('fert', { what: 'x', kg: 0 }), entry('texture', { sand: 80, clay: 40 }),
    entry('fert', { what: 'y', kg: 5, grade: [90, 90, 0], cost: -3, organic: 'yes', avail: 150 }),
  ] });
  assert.strictEqual(out.entries.length, 1);
  assert.deepStrictEqual(out.entries[0].data, { what: 'y', kg: 5, grade: null, cost: null, organic: false, avail: null });
  assert.strictEqual(out.entries[0].date, '2026-01-01');
  assert.strictEqual(out.plots[0].unit, 'ha'); assert.strictEqual(out.plots[0].trees, '');
});

test('a backup with repeated ids or junk values is tidied, not trusted', () => {
  const entry = (id, data, kind = 'fert', date = '2026-01-01') => ({ id, plot: 'a1', date, kind, data });
  const out = clean({ plots: [{ id: 'a1', name: 'One' }, { id: 'a1', name: 'Two' }, { id: 'b1', name: { toString: 1 } }], entries: [
    entry('e1', { what: 'x', kg: 5 }), entry('e1', { what: 'y', kg: 6 }),
    entry('e2', { what: 'hex', kg: '0x10' }), entry('e3', { what: 'huge', kg: 5, cost: 1e300 }),
    entry('e4', { sand: true, clay: [5] }, 'texture'), entry('e5', { what: 'z', kg: 1 }, 'fert', '2025-13-45'),
  ] });
  assert.deepStrictEqual(out.plots.map(p => p.name), ['One']);
  assert.strictEqual(new Set(out.entries.map(e => e.id)).size, out.entries.length, 'entry ids are unique');
  assert.deepStrictEqual(out.entries.map(e => e.data.what), ['x', 'y', 'huge', 'z']);
  assert.strictEqual(out.entries[2].data.cost, null);
  assert.notStrictEqual(out.entries[3].date, '2025-13-45');
});

test('long text is cut to its limit', () => {
  const out = clean({ plots: [{ id: 'p1', name: 'N'.repeat(200) }], entries: [{ id: 'e1', plot: 'p1', date: '2026-01-01', kind: 'note', data: { text: 'T'.repeat(900) } }] });
  assert.strictEqual(out.plots[0].name.length, 60); assert.strictEqual(out.entries[0].data.text.length, 500);
});

/* ---------- page shell, service worker and rendering code ---------- */
const app = read('js/app.js'), sw = read('sw.js'), html = read('index.html');

/* ---------- service worker behaviour, run against a fake cache and network ---------- */
function swHarness() {
  const stores = new Map(), listeners = {}, posted = [];
  const cacheOf = name => { if (!stores.has(name)) stores.set(name, new Map()); const m = stores.get(name);
    const key = k => { const u = String(k.url || k); return u.startsWith('https://x.test/Soil/') ? './' + u.slice(20) : u; };
    return { put: async (k, r) => { m.set(key(k), r.clone()); }, match: async k => { const r = m.get(key(k)); return r ? r.clone() : undefined; } }; };
  const net = { files: {}, fail: new Set() };
  const ctx = {
    caches: { open: async n => cacheOf(n), has: async n => stores.has(n), delete: async n => stores.delete(n), keys: async () => [...stores.keys()] },
    fetch: async url => { const u = String(url.url || url); if (net.hang) await new Promise(() => {}); if (net.fail.has(u) || !(u in net.files)) throw new Error('offline'); return new Response(net.files[u]); },
    Response, Headers, URL, Uint8Array, Promise, Error, Date, Object, String, AbortController, setTimeout, clearTimeout,
    self: { addEventListener: (k, fn) => { listeners[k] = fn; }, skipWaiting: async () => {}, location: { origin: 'https://x.test', href: 'https://x.test/Soil/sw.js' },
      clients: { claim: async () => {}, matchAll: async () => [{ postMessage: m => posted.push(m) }] } },
  };
  require('vm').runInNewContext(sw, ctx);
  const shell = [...sw.match(/const SHELL = \[([^\]]+)\]/)[1].matchAll(/'(\.\/[^']+)'/g)].map(m => m[1]).concat('./index.html');
  const release = tag => { for (const f of shell) net.files[f] = tag + ':' + f; };
  const fire = async (kind, data) => { let p; listeners[kind]({ data, waitUntil: x => { p = x; } }); await p; };
  const saved = async f => { const m = stores.get('soil-shell'); const r = m && m.get(f); return r ? r.clone().text() : null; };
  const open = path => new Promise(done => listeners.fetch({ request: { method: 'GET', url: 'https://x.test/Soil/' + path, mode: 'no-cors' }, respondWith: p => done(p) })).then(r => r && r.text());
  return { net, shell, release, fire, saved, posted, stores, open };
}
const pending = [];
const testAsync = (name, fn) => pending.push(fn().then(() => { passed++; }, e => { failures.push(`${name}\n    ${String(e.message).split('\n')[0]}`); }));

testAsync('an interrupted update leaves the saved release whole', async () => {
  const h = swHarness();
  h.release('v1'); await h.fire('install');
  for (const f of h.shell) assert.strictEqual(await h.saved(f), 'v1:' + f);
  h.release('v2'); h.net.fail.add('./js/calc.js');
  await h.fire('message', 'check');
  for (const f of h.shell) assert.strictEqual(await h.saved(f), 'v1:' + f, `${f} changed during a failed update`);
  assert.deepStrictEqual(h.posted, [], 'a failed update must not announce a new version');
  assert.ok(!h.stores.has('soil-staging'), 'no staging cache is left behind');
});

testAsync('a complete update replaces every file and is announced once', async () => {
  const h = swHarness();
  h.release('v1'); await h.fire('install');
  await h.fire('message', 'check');
  assert.deepStrictEqual(h.posted, [], 'nothing changed');
  h.release('v2'); await h.fire('message', 'check');
  for (const f of h.shell) assert.strictEqual(await h.saved(f), 'v2:' + f);
  assert.deepStrictEqual(h.posted, ['updated']);
});

testAsync('a stalled update check does not hold up pages opening from the cache', async () => {
  const h = swHarness();
  h.release('v1'); await h.fire('install');
  h.net.hang = true; h.fire('message', 'check');           // never finishes
  const got = await Promise.race([h.open('js/app.js'), new Promise(r => setTimeout(() => r('timed out'), 500))]);
  assert.strictEqual(got, 'v1:./js/app.js');
});

testAsync('a swap cut short is finished when the worker next starts', async () => {
  const h = swHarness();
  h.release('v1'); await h.fire('install');
  /* a complete staged release, with the live cache only partly overwritten */
  const stage = new Map(h.shell.map(f => [f, new Response('v2:' + f)])); stage.set('./__release-complete', new Response('ok'));
  h.stores.set('soil-staging', stage); h.stores.get('soil-shell').set('./js/app.js', new Response('v2:./js/app.js'));
  const h2 = swHarness(); for (const [k, v] of h.stores) h2.stores.set(k, v);
  h2.release('v2'); await h2.fire('message', 'check');
  for (const f of h2.shell) assert.strictEqual(await h2.saved(f), 'v2:' + f);
});

test('the service worker saves every file the page loads', () => {
  const files = [...sw.match(/const SHELL = \[([^\]]+)\]/)[1].matchAll(/'\.\/([^']+)'/g)].map(m => m[1]);
  assert.ok(/const INDEX = '\.\/index\.html';/.test(sw) && files.length >= 10, 'shell list');
  const loaded = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1])
    .concat([...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]))
    .concat([...html.matchAll(/<img src="([^"]+)"/g)].map(m => m[1]));
  for (const f of loaded) assert.ok(files.includes(f), `${f} is not in the offline file list`);
  for (const f of files) assert.ok(fs.existsSync(path.join(root, f)), `${f} is listed but missing`);
  for (const icon of JSON.parse(read('manifest.webmanifest')).icons) assert.ok(fs.existsSync(path.join(root, icon.src)), icon.src);
});

test('the service worker has one fixed cache and needs no version bump', () => {
  assert.ok(/const CACHE = 'soil-shell';/.test(sw) && /const CACHE_PREFIX = 'soil-';/.test(sw));
  assert.ok(!/soil-v\d/.test(sw), 'no versioned cache name');
});

test('the service worker clears only this app\'s old caches and reads only its own', () => {
  assert.ok(/k\.indexOf\(CACHE_PREFIX\) === 0 && k !== CACHE && k !== STAGING \? caches\.delete\(k\)/.test(sw), 'old caches are filtered by prefix');
  assert.ok(!/caches\.match\(/.test(sw), 'no lookup across every cache');
  assert.ok(/if \(!res \|\| !res\.ok\) throw new Error/.test(sw), 'an error response never replaces a saved file');
  assert.ok(/cache: 'no-cache'/.test(sw), 'update checks go past the HTTP cache');
});

test('the page offers the new version and asks for a language on first launch', () => {
  for (const id of ['toast', 'toastgo', 'toastx', 'langpick']) assert.ok(html.includes(`id="${id}"`), id);
  assert.deepStrictEqual([...html.matchAll(/data-langpick="(\w+)"/g)].map(m => m[1]), ['en', 'zh', 'ms'], 'picker order');
  assert.strictEqual(C.LANG_ORDER.join(','), 'en,zh,ms', 'header order');
  assert.strictEqual([...C.LANG_ORDER].sort().join(','), C.LANGS.map(l => l.code).sort().join(','), 'every language is offered');
  assert.ok(/postMessage\('check'\)/.test(app) && /e\.data === 'updated'/.test(app));
  const css = read('css/styles.css');
  assert.ok(css.includes('.toast[hidden] { display: none; }') && css.includes('#langpick[hidden] { display: none; }'), 'hidden wins over display:flex');
});

test('no click attribute is used for two different things', () => {
  /* the click handler dispatches on data- attributes; a name shared by two features sends one feature's clicks to the other */
  const inShell = new Set([...html.matchAll(/ data-([a-z]+)=/g)].map(m => m[1]));
  const inPages = new Set([...app.matchAll(/ data-([a-z]+)="/g)].map(m => m[1]));
  for (const name of inShell) assert.ok(!inPages.has(name), `data-${name} is used in both index.html and app.js`);
});

test('stored IDs are escaped wherever they are placed in markup', () => {
  const raw = app.match(/(href|value|data-[a-z]+)="[^"]*\$\{(p|e|plot|l)\.id\}/g) || [];
  /* built-in product and class lists are constants, not stored data */
  assert.deepStrictEqual(raw.filter(x => !/^value="\$\{(p|c)\.id\}$/.test(x)), []);
  assert.ok(/"'": '&#39;'/.test(app), 'esc() covers single quotes');
});

test('forms use the app\'s own validation', () => {
  const forms = app.match(/<form [^>]*>/g) || [];
  assert.ok(forms.length >= 5);
  for (const f of forms) assert.ok(/novalidate|onsubmit="return false"/.test(f), f);
});

test('scripts load in dependency order', () => {
  const order = [...html.matchAll(/<script src="js\/([a-z]+)\.js"/g)].map(m => m[1]);
  assert.deepStrictEqual(order, ['content', 'units', 'crops', 'records', 'calc', 'store', 'app']);
});

/* ---------- report ---------- */
Promise.all(pending).then(() => {
  if (failures.length) {
    console.error(`${failures.length} failed, ${passed} passed\n`);
    for (const f of failures) console.error('  ✗ ' + f);
    process.exit(1);
  }
  console.log(`${passed} checks passed`);
});
