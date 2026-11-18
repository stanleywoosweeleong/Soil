/* Calculations. Pure functions only: no page, no storage, no language.
   Loaded in the browser as the global SoilCalc, and by the tests through require(). */
(function (root) {
  'use strict';

  /* ---------- texture ---------- */
  /* USDA texture class from percent sand and clay (silt is the remainder) */
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

  /* ---------- numbers as shown ---------- */
  /* Every quantity on screen is printed to four significant figures, or as a whole number from 1,000 up.
     shownAs() is the value that printed text stands for, so a line can say "≈" when it was rounded. */
  const shownAs = v => (Math.abs(v) >= 1000 ? Math.round(v) : Number(Number(v).toPrecision(4)));
  const isExact = v => Math.abs(shownAs(v) - v) <= 1e-9 * Math.max(1, Math.abs(v));
  /* "=" only when the result and every operand are printed exactly */
  const eq = (result, ...operands) => (isExact(result) && operands.every(isExact) ? '=' : '≈');
  /* weights are kept in kilograms; small amounts are shown in grams or milligrams */
  const massParts = v => (v > 0 && v < 0.001 ? [v * 1e6, 'mg'] : v > 0 && v < 1 ? [v * 1000, 'g'] : [v, 'kg']);

  /* ---------- input checks ---------- */
  const blank = v => String(v == null ? '' : v).trim() === '';
  /* a count typed by the user: a whole number of 1 or more */
  const isCount = v => !blank(v) && Number.isInteger(Number(v)) && Number(v) >= 1;
  const pctOk = v => !blank(v) && Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 100;
  /* a grade is three percentages that cannot total more than 100 */
  const gradeOk = g => Array.isArray(g) && g.length === 3 && g.every(pctOk) && g.reduce((sum, v) => sum + Number(v), 0) <= 100;

  /* ---------- slope ---------- */
  /* A rise of 0 is flat ground and is valid; a blank rise, a negative one, or a run of 0 is not. */
  function slopeOf(riseRaw, runRaw) {
    const rise = Number(riseRaw), run = Number(runRaw);
    if (blank(riseRaw) || !Number.isFinite(rise) || rise < 0 || !Number.isFinite(run) || run <= 0) return null;
    if (!Number.isFinite(rise / run)) return null;
    return { rise, run, pct: rise / run * 100, deg: Math.atan(rise / run) * 180 / Math.PI };
  }
  /* first class whose limit the value is under; the last class catches everything steeper */
  const classOf = (list, value, inclusive) => list.find(x => (inclusive ? value <= x.max : value < x.max)) || list[list.length - 1];

  /* ---------- fertiliser ---------- */
  /* a Kedah relong is 0.711 acre; some older sources give a larger relong for other states */
  const HA = { ha: 1, m2: 1 / 10000, acre: 0.4047, relong: 0.2877 };
  const areaHa = f => Math.max(0, Number(f.area) || 0) * (HA[f.unit] || 1);
  const NUTRIENT_INDEX = { n: 0, p: 1, k: 2 };

  /* what is wrong with the calculator inputs, as a message key, or null */
  function fertProblem(f) {
    if (f.mode === 'compound' && !gradeOk(f.g)) return 'pctBad';
    if (f.mode === 'bag' && !gradeOk(f.bg)) return 'pctBad';
    if (f.mode === 'plant' && !blank(f.pct) && !pctOk(f.pct)) return 'pctBad';
    if (f.mode === 'plant' && !blank(f.plants) && !isCount(f.plants)) return 'countBad';
    if (f.mode === 'tree' && ((!blank(f.tapps) && !isCount(f.tapps)) || (!blank(f.ttrees) && !isCount(f.ttrees)))) return 'countBad';
    return null;
  }

  /* The fertiliser the calculator would apply right now: one line per product, in kilograms at
     full precision, with the product's grade where it is known. `products` is the product list. */
  function fertLines(f, products) {
    if (fertProblem(f)) return [];
    const a = areaHa(f);
    if (f.mode === 'straight') {
      return [['n', 'pn'], ['p', 'pp'], ['k', 'pk']].map(([rk, pk]) => {
        const rate = Number(f[rk]) || 0, p = products.find(x => x.id === f[pk]);
        if (!p || !(rate > 0) || !(a > 0) || !(p[rk] > 0)) return null;
        return { product: p.id, kg: rate / (p[rk] / 100) * a, grade: [p.n, p.p, p.k] };
      }).filter(Boolean);
    }
    if (f.mode === 'compound') {
      const g = f.g.map(Number), i = NUTRIENT_INDEX[f.basis], rate = Number(f.crate) || 0;
      return rate > 0 && g[i] > 0 && a > 0 ? [{ label: `NPK ${g.join('-')}`, kg: rate / (g[i] / 100) * a, grade: g }] : [];
    }
    if (f.mode === 'plant') {
      const need = Number(f.need) || 0, pct = Number(f.pct) || 0;
      if (!(need > 0) || !(pct > 0) || !isCount(f.plants)) return [];
      /* The percentage is for one nutrient only. The rest of the product's analysis is unknown,
         not zero, so no grade is inferred; the save form asks for the full grade instead. */
      return [{ kg: need / (pct / 100) * Number(f.plants) / 1000, grade: null }];
    }
    if (f.mode === 'tree') {
      const rate = Number(f.trate) || 0;
      if (!(rate > 0) || !isCount(f.tapps) || !isCount(f.ttrees)) return [];
      return [{ kg: rate / Number(f.tapps) * Number(f.ttrees), grade: null }];
    }
    return [];
  }

  /* An optional grade typed as three fields. All blank means the grade is unknown (null). A
     partly filled grade is refused: a blank is not a zero, and guessing would understate totals. */
  function parseGrade(raw) {
    const v = raw.map(x => String(x == null ? '' : x).trim());
    if (v.every(x => x === '')) return { grade: null };
    if (v.some(x => x === '')) return { error: 'gradeAll' };
    const grade = v.map(Number);
    return gradeOk(grade) ? { grade } : { error: 'pctBad' };
  }

  /* How many level measures (a tin, cup or scoop the grower has weighed) make up a dose in grams. */
  function measures(grams, measureGrams) {
    const g = Number(grams), m = Number(measureGrams);
    return g > 0 && m > 0 && Number.isFinite(g / m) ? g / m : null;
  }

  /* ---------- nutrients and cost applied ---------- */
  /* Nutrients in one application record, in kilograms. Organic materials are reported as total
     content, with the available part estimated only when the record carries a percentage. */
  function appliedOf(d) {
    const graded = gradeOk(d.grade);
    const total = graded ? d.grade.map(g => Number(d.kg) * Number(g) / 100) : null;
    const organic = d.organic === true;
    const avail = organic && total && pctOk(d.avail) ? total.map(v => v * Number(d.avail) / 100) : null;
    return { total, organic, avail, cost: Number.isFinite(Number(d.cost)) && d.cost !== null && d.cost !== '' && Number(d.cost) >= 0 ? Number(d.cost) : 0 };
  }
  function summarise(fertEntries) {
    const zero = () => [0, 0, 0];
    const out = { count: 0, ungraded: 0, mineral: zero(), organicTotal: zero(), organicAvail: zero(), organicCount: 0, organicWithAvail: 0, cost: 0, costed: 0 };
    const add = (into, vals) => vals.forEach((v, i) => { into[i] += v; });
    for (const e of fertEntries) {
      const a = appliedOf(e.data || {});
      out.count++;
      if (e.data && e.data.cost !== null && e.data.cost !== undefined && e.data.cost !== '') { out.cost += a.cost; out.costed++; }
      if (!a.total) { out.ungraded++; continue; }
      if (a.organic) {
        out.organicCount++; add(out.organicTotal, a.total);
        if (a.avail) { out.organicWithAvail++; add(out.organicAvail, a.avail); }
      } else add(out.mineral, a.total);
    }
    return out;
  }

  const api = { classify, shownAs, isExact, eq, massParts, blank, isCount, pctOk, gradeOk, slopeOf, classOf, HA, areaHa, fertProblem, fertLines, parseGrade, measures, appliedOf, summarise };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SoilCalc = api;
})(typeof self !== 'undefined' ? self : globalThis);
