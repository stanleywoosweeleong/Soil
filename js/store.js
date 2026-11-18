/* Record validation. Everything read from browser storage or from a backup file passes through
   cleanRecords() before the app uses it, so only the shape this app writes ever reaches the page.
   Loaded in the browser as the global SoilStore, and by the tests through require(). */
(function (root) {
  'use strict';
  const calc = (typeof module !== 'undefined' && module.exports) ? require('./calc.js') : root.SoilCalc;

  const KINDS = ['texture', 'ph', 'slope', 'fert', 'note'];
  const UNITS_OF_AREA = ['ha', 'm2', 'acre'];
  /* IDs are placed in links and attributes, so only plain letters and digits are accepted */
  const okId = v => typeof v === 'string' && /^[a-z0-9]{1,40}$/i.test(v);
  /* a real calendar date, not only the right shape */
  const okDate = v => {
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const d = new Date(v + 'T00:00:00Z');
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  };
  /* text is only ever taken from a string or a number, never from an object's own toString */
  const str = (v, max) => (typeof v === 'string' || (typeof v === 'number' && Number.isFinite(v)) ? String(v) : '').slice(0, max);
  /* a plain decimal number: a finite number, or a string of digits. Booleans, arrays and "0x10" are refused. */
  const fin = v => (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && /^\s*-?(\d+\.?\d*|\.\d+)\s*$/.test(v));
  /* upper limits, far beyond any real farm, so a wild figure in a backup cannot break the page */
  const MAX_KG = 1e7, MAX_COST = 1e9, MAX_AREA_HA = 1e5, MAX_LENGTH = 1e6;
  const LIMITS = { kg: MAX_KG, cost: MAX_COST, areaHa: MAX_AREA_HA, length: MAX_LENGTH };
  /* the limit on a plot's size is in hectares, whatever unit it was typed in */
  const areaOk = (area, unit) => fin(area) && Number(area) > 0 && Number(area) * (calc.HA[unit] || 1) <= MAX_AREA_HA;

  /* one entry's data, forced into shape, or null when it cannot be trusted */
  function cleanData(kind, d) {
    if (!d || typeof d !== 'object') return null;
    if (kind === 'texture') {
      return fin(d.sand) && fin(d.clay) && d.sand >= 0 && d.clay >= 0 && Number(d.sand) + Number(d.clay) <= 100
        ? { sand: Number(d.sand), clay: Number(d.clay) } : null;
    }
    if (kind === 'ph') return fin(d.ph) && d.ph >= 0 && d.ph <= 14 ? { ph: Number(d.ph) } : null;
    if (kind === 'slope') return fin(d.rise) && fin(d.run) && Math.abs(d.rise) <= MAX_LENGTH && d.run <= MAX_LENGTH && calc.slopeOf(d.rise, d.run) ? { rise: Number(d.rise), run: Number(d.run) } : null;
    if (kind === 'fert') {
      if (!(fin(d.kg) && Number(d.kg) > 0 && Number(d.kg) <= MAX_KG)) return null;           // any positive weight, however small
      return {
        what: str(d.what, 60),
        kg: Number(d.kg),
        grade: Array.isArray(d.grade) && d.grade.every(fin) && calc.gradeOk(d.grade) ? d.grade.map(Number) : null,
        cost: fin(d.cost) && Number(d.cost) >= 0 && Number(d.cost) <= MAX_COST ? Number(d.cost) : null,
        organic: d.organic === true,
        avail: d.organic === true && fin(d.avail) && calc.pctOk(d.avail) ? Number(d.avail) : null,
      };
    }
    if (kind === 'note') return { text: str(d.text, 500) };
    return null;
  }

  /* `make` supplies newId() and today() so this file stays free of clocks and randomness */
  function cleanRecords(obj, make) {
    if (!obj || !Array.isArray(obj.plots) || !Array.isArray(obj.entries)) return null;
    const seenPlot = new Set(), seenEntry = new Set();
    /* a plot id is kept once: the first plot with it wins */
    const plots = obj.plots.filter(p => p && okId(p.id) && str(p.name, 60).trim() && !seenPlot.has(p.id) && seenPlot.add(p.id)).map(p => ({
      id: p.id,
      name: str(p.name, 60),
      crop: str(p.crop, 60),
      area: areaOk(p.area, UNITS_OF_AREA.includes(p.unit) ? p.unit : 'ha') ? Number(p.area) : '',
      unit: UNITS_OF_AREA.includes(p.unit) ? p.unit : 'ha',
      trees: fin(p.trees) && calc.isCount(p.trees) ? Number(p.trees) : '',
    }));
    const ids = new Set(plots.map(p => p.id));
    const entries = obj.entries
      .filter(e => e && okId(e.plot) && ids.has(e.plot) && KINDS.includes(e.kind))
      .map(e => {
        const data = cleanData(e.kind, e.data);
        if (!data) return null;
        /* an entry id is used once; a repeat gets a new one so that deleting one entry never removes another */
        let id = okId(e.id) && !seenEntry.has(e.id) ? e.id : make.newId();
        for (let n = 0; seenEntry.has(id); n++) id = make.newId() + (n > 5 ? String(n) : '');
        seenEntry.add(id);
        return { id, plot: e.plot, date: okDate(e.date) ? e.date : make.today(), kind: e.kind, data };
      })
      .filter(Boolean);
    return { plots, entries };
  }

  const api = { KINDS, LIMITS, okId, okDate, areaOk, cleanData, cleanRecords };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SoilStore = api;
})(typeof self !== 'undefined' ? self : globalThis);
