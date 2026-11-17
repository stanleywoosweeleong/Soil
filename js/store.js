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
  const okDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const str = (v, max) => String(v == null ? '' : v).slice(0, max);
  const fin = v => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v));

  /* one entry's data, forced into shape, or null when it cannot be trusted */
  function cleanData(kind, d) {
    if (!d || typeof d !== 'object') return null;
    if (kind === 'texture') {
      return fin(d.sand) && fin(d.clay) && d.sand >= 0 && d.clay >= 0 && Number(d.sand) + Number(d.clay) <= 100
        ? { sand: Number(d.sand), clay: Number(d.clay) } : null;
    }
    if (kind === 'ph') return fin(d.ph) && d.ph >= 0 && d.ph <= 14 ? { ph: Number(d.ph) } : null;
    if (kind === 'slope') return calc.slopeOf(d.rise, d.run) ? { rise: Number(d.rise), run: Number(d.run) } : null;
    if (kind === 'fert') {
      if (!(fin(d.kg) && Number(d.kg) > 0)) return null;           // any positive weight, however small
      return {
        what: str(d.what, 60),
        kg: Number(d.kg),
        grade: calc.gradeOk(d.grade) ? d.grade.map(Number) : null,
        cost: fin(d.cost) && Number(d.cost) >= 0 ? Number(d.cost) : null,
        organic: d.organic === true,
        avail: d.organic === true && calc.pctOk(d.avail) ? Number(d.avail) : null,
      };
    }
    if (kind === 'note') return { text: str(d.text, 500) };
    return null;
  }

  /* `make` supplies newId() and today() so this file stays free of clocks and randomness */
  function cleanRecords(obj, make) {
    if (!obj || !Array.isArray(obj.plots) || !Array.isArray(obj.entries)) return null;
    const plots = obj.plots.filter(p => p && okId(p.id) && p.name).map(p => ({
      id: p.id,
      name: str(p.name, 60),
      crop: str(p.crop, 60),
      area: Number(p.area) > 0 ? Number(p.area) : '',
      unit: UNITS_OF_AREA.includes(p.unit) ? p.unit : 'ha',
      trees: calc.isCount(p.trees) ? Number(p.trees) : '',
    }));
    const ids = new Set(plots.map(p => p.id));
    const entries = obj.entries
      .filter(e => e && okId(e.plot) && ids.has(e.plot) && KINDS.includes(e.kind))
      .map(e => {
        const data = cleanData(e.kind, e.data);
        return data && { id: okId(e.id) ? e.id : make.newId(), plot: e.plot, date: okDate(e.date) ? e.date : make.today(), kind: e.kind, data };
      })
      .filter(Boolean);
    return { plots, entries };
  }

  const api = { KINDS, okId, okDate, cleanData, cleanRecords };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SoilStore = api;
})(typeof self !== 'undefined' ? self : globalThis);
