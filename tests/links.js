/* Checks that every source link in the guide still answers. It needs the network, so it is not part
   of `node tests/run.js`; run it by hand now and then:  node tests/links.js
   A link is reported only when the server says the page is gone (404 or 410) or the host cannot be
   found. Sites that refuse automated requests (401, 403, 429) are listed separately to check by eye. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = vm.createContext({});
vm.runInContext(['content', 'units', 'crops', 'records', 'figures'].map(f => fs.readFileSync(path.join(root, 'js', f + '.js'), 'utf8')).join('\n') + '\n;globalThis.__c = { LESSONS, SOURCES };', ctx);
const { LESSONS, SOURCES } = ctx.__c;
const urls = new Map();
for (const [id, l] of Object.entries(LESSONS)) for (const b of l.body) if (b[0] === 'src' && b[1].u) urls.set(b[1].u, 'lesson ' + id);
for (const g of SOURCES) for (const it of g.items) if (it[1] && !urls.has(it[1])) urls.set(it[1], 'sources list');

async function check(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'Mozilla/5.0 (link check)' } });
      if (res.status === 405 || (method === 'HEAD' && res.status >= 400)) continue;
      return res.status;
    } catch (e) { if (method === 'GET') return String(e.cause && e.cause.code || e.name); }
  }
  return 'no answer';
}
(async () => {
  const list = [...urls], gone = [], refused = [], other = [];
  for (let i = 0; i < list.length; i += 8) {
    await Promise.all(list.slice(i, i + 8).map(async ([u, where]) => {
      const s = await check(u);
      if (s === 404 || s === 410 || s === 'ENOTFOUND') gone.push([s, u, where]);
      else if (s === 401 || s === 403 || s === 429) refused.push([s, u, where]);
      else if (s !== 200) other.push([s, u, where]);
    }));
  }
  const show = (title, rows) => { if (rows.length) { console.log(`\n${title}`); for (const r of rows) console.log(`  ${r[0]}  ${r[1]}  (${r[2]})`); } };
  console.log(`${list.length} links checked`);
  show('Reported gone; some sites answer this way to automated requests, so open each by hand before removing it:', gone); show('Refused an automated check; open by hand:', refused); show('Other answers:', other);
  process.exit(gone.length ? 1 : 0);
})();
