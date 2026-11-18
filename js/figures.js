/* Illustrations. Each one is drawn here as an SVG, so there are no image files and nothing to license.
   A drawing carries numbers only; the words are in the key underneath, so every language fits and a
   screen reader gets the same information. Colours for ink, paper and leaf follow the theme. */
const ILLUS = {};
(() => {
  const C = { water: '#3f7fa6', sand: '#d9b77a', silt: '#b08a5a', clay: '#a65530', top: '#4b3525', sub: '#8a5a33', deep: '#b98558', rock: '#8c8f8a',
    leaf: 'var(--leaf)', ink: 'var(--ink)', mute: 'var(--muted)', paper: 'var(--surface)', wash: 'var(--wash)', ochre: 'var(--ochre)', bad: '#c0392b', yellow: '#e5c53a', grey: '#9aa3a0' };
  const call = (x, y, i) => `<circle cx="${x}" cy="${y}" r="9" fill="${C.ink}" stroke="${C.paper}" stroke-width="1.5"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="${C.paper}">${i}</text>`;
  const arr = (x1, y1, x2, y2, col = C.ink, w = 2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#ah)"/>`;
  const drop = (x, y, s = 1) => `<path d="M${x} ${y - 7 * s}c${4 * s} ${5 * s} ${5 * s} ${8 * s} 0 ${11 * s}c${-5 * s} ${-3 * s} ${-4 * s} ${-6 * s} 0 ${-11 * s}z" fill="${C.water}"/>`;
  const rain = (x0, x1, y, n = 6) => Array.from({ length: n }, (_, i) => `<line x1="${x0 + (x1 - x0) * i / (n - 1)}" y1="${y}" x2="${x0 + (x1 - x0) * i / (n - 1) - 5}" y2="${y + 14}" stroke="${C.water}" stroke-width="2" stroke-linecap="round"/>`).join('');
  const tree = (x, y, s = 1) => `<rect x="${x - 3 * s}" y="${y - 26 * s}" width="${6 * s}" height="${26 * s}" fill="${C.sub}"/><circle cx="${x}" cy="${y - 38 * s}" r="${18 * s}" fill="${C.leaf}"/>`;
  const palm = (x, y, s = 1) => `<path d="M${x - 3 * s} ${y}l${1 * s} ${-34 * s}h${4 * s}l${1 * s} ${34 * s}z" fill="${C.sub}"/>` +
    [-70, -40, -15, 15, 40, 70].map(a => `<path d="M${x} ${y - 34 * s}q${Math.sin(a * Math.PI / 180) * 16 * s} ${-18 * s} ${Math.sin(a * Math.PI / 180) * 30 * s} ${(-6 + Math.abs(a) / 9) * s}" fill="none" stroke="${C.leaf}" stroke-width="${4 * s}" stroke-linecap="round"/>`).join('');
  const sprout = (x, y, h = 22, col = C.leaf) => `<path d="M${x} ${y}v${-h}" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/><path d="M${x} ${y - h * 0.6}q-9 -3 -11 -11q9 0 11 11zM${x} ${y - h * 0.85}q9 -3 11 -11q-9 0 -11 11z" fill="${col}"/>`;
  const label = (x, y, s, anchor = 'middle', size = 11) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="700" fill="${C.ink}">${s}</text>`;
  const add = (id, cap, key, draw, vb = '0 0 320 180') => { ILLUS[id] = { cap, key, vb, draw }; };

  /* ---------- soil basics ---------- */
  add('particles', ['Saiz zarah tanah', 'Sizes of soil particles', '土壤颗粒的大小'], [
    ['Pasir: 0.05 hingga 2 mm; terasa kasar', 'Sand: 0.05 to 2 mm; feels gritty', '砂粒：0.05 至 2 毫米；手感粗糙'],
    ['Kelodak: 0.002 hingga 0.05 mm; terasa seperti tepung', 'Silt: 0.002 to 0.05 mm; feels like flour', '粉粒：0.002 至 0.05 毫米；手感如面粉'],
    ['Liat: lebih kecil daripada 0.002 mm; melekit apabila basah', 'Clay: smaller than 0.002 mm; sticky when wet', '黏粒：小于 0.002 毫米；湿时黏手'],
  ], () => `<circle cx="80" cy="90" r="62" fill="${C.sand}"/><circle cx="196" cy="128" r="22" fill="${C.silt}"/><circle cx="270" cy="146" r="5" fill="${C.clay}"/>
    <path d="M18 162h284" stroke="${C.mute}" stroke-width="1.5"/>${call(80, 90, 1)}${call(196, 96, 2)}${call(270, 126, 3)}`);

  add('ribbon', ['Ujian reben', 'The ribbon test', '搓条测试'], [
    ['Tidak membentuk reben: pasir atau pasir berlom', 'No ribbon forms: sand or loamy sand', '搓不成条：砂土或壤质砂土'],
    ['Reben pendek, kurang daripada 2.5 cm: lom', 'Short ribbon, under 2.5 cm: loam', '短条，不足 2.5 厘米：壤土'],
    ['Reben sederhana, 2.5 hingga 5 cm: lom liat', 'Medium ribbon, 2.5 to 5 cm: clay loam', '中等长度，2.5 至 5 厘米：黏壤土'],
    ['Reben panjang, lebih 5 cm: liat', 'Long ribbon, over 5 cm: clay', '长条，超过 5 厘米：黏土'],
  ], () => { const hand = x => `<path d="M${x - 22} 150c0-22 8-30 22-30s22 8 22 30z" fill="${C.deep}" opacity="0.55"/>`;
    return [0, 1, 2, 3].map(i => { const x = 46 + i * 76, len = [0, 22, 48, 86][i];
      return hand(x) + (len ? `<rect x="${x - 7}" y="${122 - len}" width="14" height="${len}" rx="4" fill="${C.clay}"/>` : `<circle cx="${x - 6}" cy="114" r="5" fill="${C.sand}"/><circle cx="${x + 5}" cy="116" r="4" fill="${C.sand}"/><circle cx="${x}" cy="108" r="3" fill="${C.sand}"/>`) + call(x, 164, i + 1); }).join(''); });

  add('jar', ['Ujian balang selepas mendap', 'The jar test after settling', '沉降后的瓶子试验'], [
    ['Air, jernih apabila liat sudah mendap', 'Water, clear once the clay has settled', '水，黏粒沉降后变清'],
    ['Liat: mendap terakhir, selepas berjam-jam atau berhari-hari', 'Clay: settles last, after hours or days', '黏粒：最后沉降，需数小时至数天'],
    ['Kelodak: mendap selepas beberapa jam', 'Silt: settles within a few hours', '粉粒：数小时内沉降'],
    ['Pasir: mendap dalam masa seminit', 'Sand: settles within a minute', '砂粒：一分钟内沉降'],
  ], () => `<rect x="118" y="8" width="84" height="12" rx="3" fill="${C.mute}"/><rect x="110" y="20" width="100" height="150" rx="10" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/>
    <rect x="112" y="22" width="96" height="62" fill="${C.water}" opacity="0.35"/><rect x="112" y="84" width="96" height="22" fill="${C.clay}"/><rect x="112" y="106" width="96" height="26" fill="${C.silt}"/><path d="M112 132h96v28a8 8 0 0 1-8 8h-80a8 8 0 0 1-8-8z" fill="${C.sand}"/>
    ${[[50, 1], [95, 2], [119, 3], [150, 4]].map(([y, i]) => `<path d="M212 ${y}h28" stroke="${C.ink}" stroke-width="1.5"/>${call(250, y, i)}`).join('')}
`);

  add('water', ['Tiga keadaan air dalam tanah', 'Three states of water in soil', '土壤水分的三种状态'], [
    ['Tepu: semua liang penuh air, tiada udara untuk akar', 'Saturated: every pore is full of water, no air for roots', '饱和：所有孔隙充满水，根系缺氧'],
    ['Kapasiti ladang: liang besar berisi udara, liang kecil berisi air; paling baik untuk tanaman', 'Field capacity: large pores hold air, small pores hold water; best for crops', '田间持水量：大孔隙含空气，小孔隙含水；对作物最有利'],
    ['Takat layu: hanya selaput nipis air yang tidak dapat diambil oleh akar', 'Wilting point: only thin films of water that roots cannot take up', '萎蔫点：只剩根系吸不到的薄水膜'],
  ], () => [0, 1, 2].map(k => { const ox = 14 + k * 102; const grains = [[22, 28, 17], [62, 24, 15], [42, 58, 18], [78, 60, 14], [18, 82, 15], [56, 94, 16], [84, 96, 11], [30, 116, 13], [68, 124, 14]];
    return `<rect x="${ox}" y="8" width="94" height="132" rx="8" fill="${k === 0 ? C.water : C.wash}" opacity="${k === 0 ? 0.7 : 1}"/>` +
      grains.map(g => `<circle cx="${ox + g[0]}" cy="${g[1] + 4}" r="${g[2] + (k === 1 ? 3.5 : k === 2 ? 1.5 : 0)}" fill="${k === 0 ? 'none' : C.water}" opacity="0.8"/>`).join('') +
      grains.map(g => `<circle cx="${ox + g[0]}" cy="${g[1] + 4}" r="${g[2]}" fill="${C.sub}"/>`).join('') + call(ox + 47, 160, k + 1); }).join(''));

  add('infiltration', ['Air meresap dalam pasir dan dalam liat', 'How water moves into sand and into clay', '水在砂土和黏土中的下渗'], [
    ['Pasir: air turun dengan cepat dan dalam, tetapi sedikit yang tersimpan', 'Sand: water goes down fast and deep, but little is stored', '砂土：水下渗快而深，但储存少'],
    ['Liat: air meresap perlahan dan merebak ke sisi; banyak tersimpan, tetapi mudah bertakung', 'Clay: water enters slowly and spreads sideways; much is stored, but it ponds easily', '黏土：水下渗慢并向两侧扩散；储水多，但容易积水'],
  ], () => `<rect x="10" y="50" width="140" height="120" fill="${C.sand}"/><rect x="170" y="50" width="140" height="120" fill="${C.clay}"/>
    <path d="M62 50h36l-4 112h-28z" fill="${C.water}" opacity="0.7"/><path d="M196 50h88c4 30-16 52-44 52s-48-22-44-52z" fill="${C.water}" opacity="0.7"/><rect x="204" y="44" width="72" height="6" rx="3" fill="${C.water}"/>
    ${drop(80, 22)}${drop(240, 22)}${arr(80, 30, 80, 44, C.water)}${arr(240, 30, 240, 40, C.water)}${call(28, 66, 1)}${call(188, 66, 2)}`);

  add('availability', ['pH dan ketersediaan nutrien (skematik)', 'pH and nutrient availability (schematic)', '酸碱度与养分有效性（示意图）'], [
    ['Jalur yang lebih tebal bermaksud nutrien lebih mudah diambil', 'A thicker band means the nutrient is easier to take up', '色带越宽，表示养分越容易被吸收'],
    ['Julat pH 5.5 hingga 6.5, tempat kebanyakan nutrien tersedia serentak', 'The range pH 5.5 to 6.5, where most nutrients are available together', 'pH 5.5 至 6.5 的范围，多数养分同时有效'],
  ], () => { const x = p => 52 + (p - 4) * 43; const rows = [['N', [0.25, 0.6, 1, 1, 1, 0.8, 0.6]], ['P', [0.2, 0.35, 0.8, 1, 0.75, 0.4, 0.5]], ['K', [0.3, 0.6, 1, 1, 1, 1, 0.9]], ['Ca Mg', [0.15, 0.4, 0.7, 1, 1, 1, 0.9]], ['Fe Mn Zn', [1, 1, 0.9, 0.6, 0.3, 0.15, 0.1]], ['B', [0.5, 0.8, 1, 0.9, 0.5, 0.3, 0.5]], ['Mo', [0.1, 0.25, 0.5, 0.8, 1, 1, 1]]];
    const cols = [C.leaf, C.clay, C.sub, C.water, C.ochre, C.silt, C.grey];
    return `<rect x="${x(5.5)}" y="6" width="${x(6.5) - x(5.5)}" height="160" fill="${C.leaf}" opacity="0.16"/>` + rows.map((r, i) => { const cy = 30 + i * 19;
      const up = r[1].map((v, j) => `${x(4 + j)},${cy - v * 8}`).join(' '), dn = r[1].map((v, j) => `${x(4 + j)},${cy + v * 8}`).reverse().join(' ');
      return `<polygon points="${up} ${dn}" fill="${cols[i]}"/>` + label(46, cy + 4, r[0], 'end', 10); }).join('') +
      [4, 5, 6, 7, 8, 9, 10].map(p => `<text x="${x(p)}" y="178" text-anchor="middle" font-size="10" fill="${C.ink}">${p}</text>`).join('') + `<path d="M296 16L280 26" stroke="${C.ink}" stroke-width="1.5"/>` + call(300, 11, 1) + call(x(6), 160, 2); });

  add('colours', ['Warna tanah dan maksudnya', 'Soil colours and what they suggest', '土壤颜色及其含义'], [
    ['Hitam atau perang gelap: banyak bahan organik', 'Black or dark brown: plenty of organic matter', '黑色或深棕色：有机质丰富'],
    ['Merah: besi teroksida; saliran baik', 'Red: oxidised iron; good drainage', '红色：铁被氧化；排水良好'],
    ['Kuning: besi terhidrat; lebih lembap', 'Yellow: hydrated iron; moister', '黄色：水合态的铁；较湿润'],
    ['Kelabu kebiruan: sering tepu air, kurang udara', 'Bluish grey: often waterlogged, short of air', '蓝灰色：经常渍水、缺氧'],
    ['Berbintik: paras air naik dan turun', 'Mottled: the water table rises and falls', '带斑纹：地下水位升降'],
    ['Putih atau pucat: liat kaolinit atau pasir yang terlarut resap', 'White or pale: kaolinite clay or leached sand', '白色或浅色：高岭石黏土或淋洗过的砂'],
  ], () => { const cols = ['#2a1f17', '#a13c22', '#c99a35', '#8f9ea3', '#8f9ea3', '#e6e1d6'];
    return cols.map((c, i) => { const x = 12 + (i % 3) * 102, y = 8 + Math.floor(i / 3) * 86;
      return `<rect x="${x}" y="${y}" width="92" height="72" rx="10" fill="${c}" stroke="${C.mute}"/>` + (i === 4 ? [[20, 20], [52, 14], [70, 40], [30, 48], [58, 58]].map(m => `<ellipse cx="${x + m[0]}" cy="${y + m[1]}" rx="9" ry="6" fill="#c99a35"/>`).join('') : '') + call(x + 16, y + 16, i + 1); }).join(''); });

  /* ---------- reading a site ---------- */
  add('zigzag', ['Laluan zig-zag untuk sampel komposit', 'A zigzag path for a composite sample', '采集混合样本的“之”字形路线'], [
    ['Ambil 10 hingga 20 teras di sepanjang laluan zig-zag', 'Take 10 to 20 cores along a zigzag path', '沿“之”字形路线采集 10 至 20 个土芯'],
    ['Elakkan tepi ladang, laluan dan pagar', 'Keep away from field edges, paths and fences', '避开田边、道路和围篱'],
    ['Elakkan tempat baja, kapur atau abu pernah dilonggokkan', 'Avoid spots where fertiliser, lime or ash was heaped', '避开曾堆放肥料、石灰或灰烬的地点'],
    ['Kawasan yang berbeza, seperti tanah rendah yang basah, disampel berasingan', 'A different area, such as a wet hollow, is sampled separately', '不同的区块（如潮湿洼地）要另行取样'],
  ], () => { const pts = [[36, 150], [70, 44], [104, 150], [138, 44], [172, 150], [206, 44], [234, 132]];
    return `<rect x="10" y="12" width="300" height="160" rx="10" fill="${C.wash}" stroke="${C.mute}" stroke-width="2" stroke-dasharray="6 5"/>
      <ellipse cx="270" cy="52" rx="30" ry="24" fill="${C.water}" opacity="0.45"/><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="3 5"/>
      ${pts.concat([[53, 97], [87, 97], [121, 97], [155, 97], [189, 97], [220, 88]]).map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${C.clay}" stroke="${C.paper}" stroke-width="1.5"/>`).join('')}
      <path d="M262 118l16 28h-32z" fill="${C.ochre}"/>${call(104, 124, 1)}${call(24, 26, 2)}${call(262, 160, 3)}${call(270, 52, 4)}`; });

  add('core', ['Kedalaman sampel', 'How deep to sample', '取样深度'], [
    ['Buang sampah dan rumput di permukaan dahulu', 'Clear litter and grass from the surface first', '先清除地表的枯枝落叶和草'],
    ['Potong berbentuk V dengan cangkul, kemudian ambil satu hirisan nipis dari sisinya', 'Cut a V with a hoe, then take one thin slice from its side', '用锄头挖出 V 形口，再从侧面切下一薄片'],
    ['Tanah atas, 0 hingga 15 cm: sampel biasa untuk kebanyakan tanaman', 'Topsoil, 0 to 15 cm: the usual sample for most crops', '表土，0 至 15 厘米：多数作物的常规取样层'],
    ['Lapisan 15 hingga 30 cm atau lebih: sampel kedua untuk pokok', 'The 15 to 30 cm layer or deeper: a second sample for trees', '15 至 30 厘米或更深：果树的第二层样本'],
  ], () => `<rect x="10" y="60" width="300" height="52" fill="${C.top}"/><rect x="10" y="112" width="300" height="58" fill="${C.sub}"/><path d="M10 60h300" stroke="${C.leaf}" stroke-width="5"/>
    <path d="M110 60l34 52l34-52z" fill="${C.paper}"/><path d="M178 60l-34 52h10l34-52z" fill="${C.ochre}"/>
    <path d="M276 60v52M270 60h12M270 112h12M276 112v58M270 170h12" stroke="${C.paper}" stroke-width="1.5" fill="none"/>
    ${[40, 60, 80, 220, 240].map(x => `<path d="M${x} 58l-3-12M${x} 58l4-10" stroke="${C.leaf}" stroke-width="2"/>`).join('')}
    ${call(60, 30, 1)}${call(144, 36, 2)}${call(296, 86, 3)}${call(296, 142, 4)}`);

  add('slope', ['Mengukur cerun', 'Measuring a slope', '测量坡度'], [
    ['Jarak mendatar, diukur rata dengan tali dan timbang air', 'Run: the horizontal distance, measured level with a string and spirit level', '水平距离：用绳和水平仪保持水平量出'],
    ['Beza tinggi, diukur tegak dari tali ke tanah', 'Rise: the height difference, measured straight down from the string to the ground', '高差：从绳垂直量到地面'],
    ['Cerun dalam peratus = beza tinggi ÷ jarak mendatar × 100', 'Slope in percent = rise ÷ run × 100', '坡度（%）= 高差 ÷ 水平距离 × 100'],
  ], () => `<path d="M20 60L290 150v20H20z" fill="${C.sub}"/><path d="M20 60L290 150" stroke="${C.leaf}" stroke-width="5"/>
    <path d="M20 60H290" stroke="${C.ink}" stroke-width="2" stroke-dasharray="6 4"/><path d="M290 60V150" stroke="${C.ink}" stroke-width="2"/><path d="M276 60v14h14" fill="none" stroke="${C.ink}" stroke-width="1.5"/>
    <rect x="16" y="36" width="5" height="26" fill="${C.ink}"/><rect x="288" y="36" width="5" height="116" fill="${C.ink}"/>${call(150, 44, 1)}${call(306, 106, 2)}${call(110, 136, 3)}`);

  add('peat', ['Paras air di tanah gambut', 'The water level in peat', '泥炭土中的水位'], [
    ['Gambut di atas paras air: kering, mereput, memendap dan mudah terbakar', 'Peat above the water level: dry, decomposing, sinking and able to burn', '水位以上的泥炭：干燥、分解、沉降并且可燃'],
    ['Paras air, dikawal dengan empangan kecil di dalam parit', 'The water level, held by small weirs in the drains', '水位，由沟中的小堰控制'],
    ['Gambut di bawah paras air: basah dan stabil', 'Peat below the water level: wet and stable', '水位以下的泥炭：湿润而稳定'],
    ['Akar pokok yang condong apabila tanah memendap', 'Palms lean as the ground sinks', '地面沉降时油棕倾斜'],
  ], () => `<path d="M10 70h190v100H10z" fill="#3a2a1e"/><path d="M250 70h60v100h-60z" fill="#3a2a1e"/><path d="M200 70l12 60h26l12-60" fill="none"/><path d="M200 70l12 62h26l12-62v100h-50z" fill="#3a2a1e"/>
    <rect x="10" y="112" width="300" height="58" fill="${C.water}" opacity="0.5"/><path d="M10 112h300" stroke="${C.water}" stroke-width="2.5" stroke-dasharray="7 4"/><path d="M209 112h32l-3 20h-26z" fill="${C.water}"/>
    <rect x="219" y="98" width="12" height="34" fill="${C.rock}"/>${palm(70, 70, 1.1)}<g transform="rotate(14 150 70)">${palm(150, 70, 1.1)}</g>
    ${call(30, 92, 1)}${call(292, 112, 2)}${call(30, 150, 3)}${call(176, 30, 4)}`);

  add('sulfate', ['Lapisan pirit di tanah asid sulfat', 'The pyrite layer in an acid sulfate soil', '酸性硫酸盐土中的黄铁矿层'],  [
    ['Selagi paras air berada di atas lapisan pirit, tanah ini stabil', 'While the water level stays above the pyrite layer, the soil is stable', '只要水位保持在黄铁矿层之上，土壤就稳定'],
    ['Parit yang dalam menurunkan paras air', 'A deep drain lowers the water level', '深沟使水位下降'],
    ['Udara sampai ke pirit, lalu terbentuk asid sulfurik', 'Air reaches the pyrite and sulfuric acid forms', '空气接触黄铁矿，生成硫酸'],
    ['Asid, besi dan aluminium mengalir ke dalam parit', 'Acid, iron and aluminium drain into the ditch', '酸、铁和铝流入沟渠'],
  ], () => `<rect x="10" y="40" width="300" height="60" fill="${C.sub}"/><rect x="10" y="100" width="300" height="70" fill="#5d6a66"/>
    ${[30, 62, 96, 128, 240, 272, 296, 50, 110, 262].map((x, i) => `<path d="M${x} ${116 + (i % 3) * 16}l5 5l-5 5l-5-5z" fill="${C.yellow}"/>`).join('')}
    <path d="M170 40l10 96h30l10-96z" fill="${C.paper}"/><path d="M178 118h34l-2 18h-30z" fill="${C.ochre}"/>
    <path d="M10 66H96C140 66 160 92 176 120" fill="none" stroke="${C.water}" stroke-width="2.5" stroke-dasharray="7 4"/><path d="M214 120C230 92 262 72 310 68" fill="none" stroke="${C.water}" stroke-width="2.5" stroke-dasharray="7 4"/>
    ${arr(244, 14, 244, 104, C.mute)}${arr(250, 126, 216, 126, C.bad)}<path d="M10 40h160M220 40h90" stroke="${C.leaf}" stroke-width="5"/>
    ${call(50, 66, 1)}${call(195, 60, 2)}${call(262, 26, 3)}${call(238, 150, 4)}`);

  /* ---------- protecting soil ---------- */
  add('erosion', ['Empat peringkat hakisan air', 'The four stages of water erosion', '水蚀的四个阶段'], [
    ['Percikan: titisan hujan memecahkan gumpalan tanah yang terdedah', 'Splash: raindrops break up exposed clods', '溅蚀：雨滴击碎裸露的土块'],
    ['Lembar: lapisan nipis tanah dihanyutkan secara sekata; sukar dilihat', 'Sheet: a thin layer of soil is washed off evenly; hard to see', '片蚀：一薄层土被均匀冲走；不易察觉'],
    ['Alur: saluran kecil yang masih boleh diratakan dengan cangkul', 'Rill: small channels that a hoe can still smooth out', '细沟：锄头仍可整平的小沟'],
    ['Galur: parit dalam yang tidak dapat dilintasi jentera', 'Gully: a deep channel machinery cannot cross', '冲沟：机械无法越过的深沟'],
  ], () => `<path d="M10 40L310 130v40H10z" fill="${C.sub}"/><path d="M10 40L310 130" stroke="${C.deep}" stroke-width="4"/>
    ${rain(30, 70, 8, 4)}${[[36, 44], [58, 52]].map(q => `<path d="M${q[0]} ${q[1]}l-6-9M${q[0]} ${q[1]}l1-11M${q[0]} ${q[1]}l7-8" stroke="${C.deep}" stroke-width="2" stroke-linecap="round"/>`).join('')}
    <path d="M96 62l60 18" stroke="${C.water}" stroke-width="7" opacity="0.5" stroke-linecap="round"/>
    ${[0, 8, 16].map(d => `<path d="M${172 + d} ${86 + d * 0.3 + (d ? 3 : 0)}l44 13" stroke="${C.top}" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M238 106l14 30l22-8l14-12z" fill="${C.top}"/><path d="M238 106l50 15" stroke="${C.deep}" stroke-width="4"/><path d="M252 134l22-7" stroke="${C.water}" stroke-width="3"/>
    ${call(46, 76, 1)}${call(124, 98, 2)}${call(196, 122, 3)}${call(262, 156, 4)}`);

  add('terrace', ['Teres dan penanaman kontur', 'Terraces and contour planting', '梯田与等高种植'], [
    ['Teres: tangga yang memotong cerun dan memperlahankan air', 'Terrace: a step cut across the slope that slows the water', '梯田：横切斜坡的台阶，减缓水流'],
    ['Lantai teres condong sedikit ke dalam supaya air meresap', 'The terrace floor tilts slightly inward so that water soaks in', '梯面略向内倾斜，让水渗入'],
    ['Dinding teres dilitupi rumput atau kekacang', 'The terrace wall is kept under grass or legumes', '梯壁保持草或豆科植物覆盖'],
    ['Tanaman dibariskan mengikut kontur, bukan menuruni cerun', 'Crops are planted along the contour, not down the slope', '作物沿等高线成行种植，而不是顺坡'],
  ], () => { const step = (x, y) => `<path d="M${x} ${y}l70 6v40h-70z" fill="${C.sub}"/><path d="M${x} ${y}l70 6" stroke="${C.top}" stroke-width="3"/><path d="M${x + 70} ${y + 6}l8 30" stroke="${C.leaf}" stroke-width="5" stroke-linecap="round"/>`;
    return `<path d="M10 30L310 150v20H10z" fill="${C.deep}" opacity="0.5"/>${step(20, 44)}${step(98, 78)}${step(176, 112)}<path d="M254 146l56 5v19h-56z" fill="${C.sub}"/>
      ${tree(56, 46, 0.7)}${tree(134, 80, 0.7)}${tree(212, 114, 0.7)}${arr(118, 60, 108, 76, C.water)}
      ${call(30, 76, 1)}${call(160, 70, 2)}${call(262, 128, 3)}${call(236, 60, 4)}`; });

  add('cover', ['Tanah terdedah dan tanah berlitup', 'Bare soil and covered soil', '裸露的土壤与有覆盖的土壤'], [
    ['Tanah terdedah: hujan memukul permukaan, air mengalir dan membawa tanah', 'Bare soil: rain hits the surface, runs off and carries soil with it', '裸土：雨滴击打地表，径流带走泥土'],
    ['Tanah berlitup: daun dan sungkupan menyerap pukulan hujan', 'Covered soil: leaves and mulch take the force of the rain', '有覆盖的土壤：叶片和覆盖物承受雨滴冲击'],
    ['Air meresap ke dalam tanah dan bukannya mengalir di permukaan', 'Water soaks into the soil instead of running off', '水渗入土中，而不是沿地表流走'],
  ], () => `<path d="M10 80l140 30v60H10z" fill="${C.sub}"/><path d="M170 80l140 30v60H170z" fill="${C.sub}"/><path d="M170 80l140 30" stroke="${C.ochre}" stroke-width="7" stroke-linecap="round"/>
    ${rain(30, 130, 14, 5)}${rain(190, 290, 14, 5)}<path d="M30 88l110 24" stroke="${C.water}" stroke-width="5" opacity="0.6" stroke-linecap="round"/><path d="M132 116c8 4 12 12 6 20" fill="none" stroke="${C.top}" stroke-width="4" stroke-linecap="round"/>
    ${[200, 232, 264, 292].map((x, i) => sprout(x, 84 + i * 7 + 2, 20)).join('')}${[212, 250, 284].map((x, i) => arr(x, 104 + i * 7, x, 138 + i * 7, C.water)).join('')}
    ${call(26, 150, 1)}${call(186, 60, 2)}${call(232, 156, 3)}`);

  /* ---------- improving soil ---------- */
  add('liming', ['Apa yang kapur lakukan pada zarah tanah', 'What lime does on a soil particle', '石灰对土壤颗粒的作用'], [
    ['Tanah berasid: permukaan liat dipenuhi hidrogen dan aluminium', 'Acidic soil: the clay surface is crowded with hydrogen and aluminium', '酸性土壤：黏粒表面布满氢和铝'],
    ['Kapur membekalkan kalsium dan meneutralkan asid', 'Lime supplies calcium and neutralises the acid', '石灰提供钙并中和酸'],
    ['Selepas dikapur: kalsium dan magnesium memegang tempat itu, dan aluminium tidak lagi larut', 'After liming: calcium and magnesium hold those places, and aluminium is no longer dissolved', '施石灰后：钙和镁占据这些位置，铝不再溶出'],
  ], () => { const ion = (x, y, t, col) => `<circle cx="${x}" cy="${y}" r="11" fill="${col}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${t}</text>`;
    return `<rect x="16" y="70" width="110" height="60" rx="8" fill="${C.clay}"/><rect x="196" y="70" width="110" height="60" rx="8" fill="${C.clay}"/>
      ${[[30, 58, 'H'], [58, 58, 'Al'], [86, 58, 'H'], [112, 58, 'H'], [40, 142, 'Al'], [72, 142, 'H'], [104, 142, 'Al']].map(q => ion(q[0], q[1], q[2], C.bad)).join('')}
      ${[[210, 58, 'Ca'], [238, 58, 'Mg'], [266, 58, 'Ca'], [292, 58, 'K'], [220, 142, 'Ca'], [252, 142, 'Ca'], [284, 142, 'Mg']].map(q => ion(q[0], q[1], q[2], C.leaf)).join('')}
      ${arr(138, 100, 184, 100)}<rect x="146" y="64" width="30" height="22" rx="4" fill="${C.wash}" stroke="${C.mute}"/><text x="161" y="79" text-anchor="middle" font-size="9" font-weight="700" fill="${C.ink}">CaCO₃</text>
      ${call(70, 100, 1)}${call(161, 122, 2)}${call(250, 100, 3)}`; });

  add('compost', ['Timbunan kompos', 'A compost heap', '堆肥堆'], [
    ['Bahan perang (kering, kaya karbon): daun kering, jerami, sabut', 'Browns (dry, rich in carbon): dry leaves, straw, husk', '褐色材料（干燥、富含碳）：枯叶、稻草、椰糠'],
    ['Bahan hijau (lembap, kaya nitrogen): rumput segar, sisa sayur, baja kandang', 'Greens (moist, rich in nitrogen): fresh grass, vegetable waste, manure', '绿色材料（湿润、富含氮）：鲜草、菜叶、厩肥'],
    ['Bahagian tengah menjadi panas; haba inilah yang membunuh biji rumpai dan kuman', 'The centre heats up; this heat is what kills weed seeds and germs', '堆心升温；正是这种热量杀死杂草种子和病菌'],
    ['Balikkan supaya bahagian luar masuk ke tengah, dan pastikan lembap', 'Turn it so the outside moves to the centre, and keep it moist', '翻堆使外层进入堆心，并保持湿润'],
  ], () => `<path d="M40 160C60 60 110 30 160 30s100 30 120 130z" fill="${C.sub}"/>
    ${[[60, 150, 200], [72, 126, 176], [88, 102, 144], [108, 78, 104], [132, 56, 56]].map((r, i) => `<path d="M${r[0]} ${r[1]}h${r[2]}" stroke="${i % 2 ? C.leaf : C.ochre}" stroke-width="9" stroke-linecap="round"/>`).join('')}
    <circle cx="160" cy="112" r="26" fill="${C.bad}" opacity="0.55"/><path d="M160 96v26" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="160" cy="126" r="7" fill="#fff"/>
    <path d="M286 70a36 36 0 0 0-50-30" fill="none" stroke="${C.ink}" stroke-width="2" marker-end="url(#ah)"/>
    ${call(36, 150, 1)}${call(48, 126, 2)}${call(200, 112, 3)}${call(296, 86, 4)}`);

  add('hardpan', ['Lapisan keras di bawah tanah', 'A hard pan below the surface', '地表下的硬土层'], [
    ['Tanah atas yang gembur', 'Loose topsoil', '疏松的表土'],
    ['Lapisan keras yang terbentuk oleh jentera atau pembajakan pada kedalaman yang sama', 'A hard layer made by machinery or by ploughing at the same depth', '机械碾压或长期同一耕深形成的硬层'],
    ['Akar membelok dan tumbuh mendatar', 'Roots turn and grow sideways', '根系转向横向生长'],
    ['Air bertakung di atas lapisan itu', 'Water ponds above the layer', '水滞留在硬层之上'],
  ], () => `<rect x="10" y="60" width="300" height="46" fill="${C.sub}"/><rect x="10" y="106" width="300" height="16" fill="${C.top}"/><rect x="10" y="122" width="300" height="48" fill="${C.deep}"/>
    <rect x="190" y="92" width="110" height="14" fill="${C.water}" opacity="0.6"/>${sprout(100, 60, 34)}
    <path d="M100 60v40q0 6-30 6h-30M100 100q0 6 30 6h34M100 78q-14 6-26 26M100 84q14 4 22 20" fill="none" stroke="${C.paper}" stroke-width="2.5" stroke-linecap="round"/>
    ${call(284, 74, 1)}${call(170, 114, 2)}${call(40, 90, 3)}${call(246, 84, 4)}`);

  add('drains', ['Tiga susun atur parit', 'Three drain layouts', '三种排水沟布局'], [
    ['Rawak: parit menghubungkan lekuk yang basah', 'Random: drains link the wet hollows', '随机式：排水沟连接潮湿的洼地'],
    ['Selari: parit ladang yang sama jarak mengalir ke parit pengumpul', 'Parallel: evenly spaced field drains run to a collector', '平行式：等距的田间沟汇入集水沟'],
    ['Tulang hering: parit sisi masuk ke parit utama pada suatu sudut', 'Herringbone: side drains join the main drain at an angle', '鱼骨式：支沟斜向汇入主沟'],
  ], () => { const box = x => `<rect x="${x}" y="10" width="92" height="130" rx="8" fill="${C.wash}" stroke="${C.mute}"/>`; const w = `stroke="${C.water}" stroke-width="3" fill="none" stroke-linecap="round"`;
    return box(10) + box(114) + box(218) +
      `<ellipse cx="34" cy="40" rx="12" ry="8" fill="${C.water}" opacity="0.4"/><ellipse cx="78" cy="66" rx="12" ry="8" fill="${C.water}" opacity="0.4"/><ellipse cx="38" cy="96" rx="12" ry="8" fill="${C.water}" opacity="0.4"/>
      <path d="M34 40q30 6 22 40T56 138M78 66q-10 10-22 14M38 96q10 6 18 4" ${w}/>
      <path d="M124 128h72M${[132, 146, 160, 174, 188].map(x => `${x} 22V128`).join('M')}" ${w}/>
      <path d="M264 18V138M264 44l-30-18M264 44l30-18M264 72l-30-18M264 72l30-18M264 100l-30-18M264 100l30-18M264 128l-30-18M264 128l30-18" ${w}/>` +
      call(56, 160, 1) + call(160, 160, 2) + call(264, 160, 3); });

  add('irrigation', ['Tiga cara mengairi', 'Three ways to irrigate', '三种灌溉方式'], [
    ['Permukaan: air dialirkan di atas tanah, di dalam petak atau alur', 'Surface: water flows over the ground, in basins or furrows', '地面灌溉：水在格田或沟中流过地面'],
    ['Renjis: air disembur seperti hujan', 'Sprinkler: water is sprayed like rain', '喷灌：像下雨一样喷洒'],
    ['Titis: air dititiskan di pangkal setiap pokok', 'Drip: water drips at the base of each plant', '滴灌：在每株根部滴水'],
  ], () => `<rect x="10" y="118" width="300" height="52" fill="${C.sub}"/>
    <path d="M14 118v-10h10v10M86 118v-10h10v10" fill="${C.sub}"/><rect x="24" y="110" width="62" height="8" fill="${C.water}" opacity="0.7"/>${sprout(40, 112, 22)}${sprout(70, 112, 22)}
    <rect x="158" y="86" width="4" height="32" fill="${C.ink}"/><path d="M160 86q-26-34-44 10M160 86q26-34 44 10M160 86q-12-30-22 16M160 86q12-30 22 16" fill="none" stroke="${C.water}" stroke-width="2" stroke-dasharray="3 4"/>${sprout(126, 118, 18)}${sprout(194, 118, 18)}
    <path d="M226 104h78" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>${sprout(246, 118, 24)}${sprout(286, 118, 24)}${drop(252, 114, 0.7)}${drop(292, 114, 0.7)}
    <ellipse cx="252" cy="126" rx="12" ry="6" fill="${C.water}" opacity="0.5"/><ellipse cx="292" cy="126" rx="12" ry="6" fill="${C.water}" opacity="0.5"/>
    ${call(55, 150, 1)}${call(160, 150, 2)}${call(266, 150, 3)}`);

  add('saltcrust', ['Bagaimana garam terkumpul di permukaan', 'How salt builds up at the surface', '盐分如何在地表积聚'], [
    ['Air bawah tanah yang masin dan cetek', 'Shallow, salty groundwater', '浅层含盐地下水'],
    ['Air naik melalui liang halus tanah', 'Water rises through the fine pores of the soil', '水沿土壤细孔上升'],
    ['Air menyejat dan garam tertinggal sebagai kerak putih', 'The water evaporates and the salt stays behind as a white crust', '水分蒸发，盐留下形成白色结皮'],
    ['Hujan atau pengairan yang cukup, dengan saliran, membasuh garam ke bawah', 'Enough rain or irrigation, with drainage, washes the salt down again', '充足的降雨或灌溉加上排水，可把盐淋洗下去'],
  ], () => `<rect x="10" y="50" width="300" height="80" fill="${C.sub}"/><rect x="10" y="130" width="300" height="40" fill="${C.water}" opacity="0.6"/><path d="M14 50h170" stroke="#f1eee6" stroke-width="7" stroke-linecap="round"/>
    ${[50, 100, 150].map(x => arr(x, 126, x, 62, C.water)).join('')}${[60, 110, 160].map(x => `<path d="M${x} 42q6-8 0-16t0-14" fill="none" stroke="${C.mute}" stroke-width="2" stroke-dasharray="3 4"/>`).join('')}
    ${rain(220, 290, 10, 4)}${[236, 276].map(x => arr(x, 60, x, 122, C.water)).join('')}
    ${call(290, 150, 1)}${call(76, 96, 2)}${call(190, 34, 3)}${call(256, 92, 4)}`);

  add('tillage', ['Dua peringkat pembajakan', 'The two stages of tillage', '耕作的两个阶段'], [
    ['Sebelum: tanah padat dengan sisa tanaman dan rumpai', 'Before: firm ground with crop residue and weeds', '耕前：板结的土地，带有残茬和杂草'],
    ['Pembajakan utama: tanah dipotong dan dibalikkan menjadi gumpalan besar', 'Primary tillage: the soil is cut and turned into large clods', '初耕：把土切开翻转成大土块'],
    ['Pembajakan kedua: gumpalan dihancurkan menjadi batas semaian yang halus dan rata', 'Secondary tillage: the clods are broken into a fine, level seedbed', '次耕：把土块打碎成细而平整的苗床'],
  ], () => `<rect x="10" y="90" width="92" height="60" fill="${C.sub}"/><path d="M10 90h92" stroke="${C.ochre}" stroke-width="4"/>${sprout(34, 90, 14)}${sprout(78, 90, 12)}
    <rect x="114" y="104" width="92" height="46" fill="${C.sub}"/>${[[126, 96, 14], [150, 92, 16], [176, 97, 13], [196, 94, 11]].map(c => `<path d="M${c[0] - c[2]} ${c[1] + 10}l${c[2] * 0.6}-${c[2]}l${c[2] * 1.1} ${c[2] * 0.2}l${c[2] * 0.4} ${c[2] * 0.9}z" fill="${C.top}"/>`).join('')}
    <rect x="218" y="96" width="92" height="54" fill="${C.sub}"/><path d="M218 96h92" stroke="${C.top}" stroke-width="6" stroke-dasharray="2 3"/>${sprout(244, 94, 10)}${sprout(264, 94, 10)}${sprout(284, 94, 10)}
    ${arr(102, 70, 114, 70)}${arr(206, 70, 218, 70)}${call(56, 166, 1)}${call(160, 166, 2)}${call(264, 166, 3)}`);

  /* ---------- feeding crops ---------- */
  add('mobile', ['Di mana tanda kekurangan muncul dahulu', 'Where a deficiency shows first', '缺素症状最先出现的位置'], [
    ['Daun tua menguning dahulu: nutrien mudah alih seperti nitrogen, fosforus, kalium dan magnesium', 'Old leaves yellow first: a mobile nutrient such as nitrogen, phosphorus, potassium or magnesium', '老叶先发黄：氮、磷、钾、镁等可移动的养分'],
    ['Daun muda terjejas dahulu: nutrien tidak mudah alih seperti kalsium, sulfur, besi, zink dan boron', 'Young leaves are affected first: an immobile nutrient such as calcium, sulphur, iron, zinc or boron', '新叶先受影响：钙、硫、铁、锌、硼等不易移动的养分'],
  ], () => { const pl = (x, low) => `<path d="M${x} 160V40" stroke="${C.leaf}" stroke-width="4" stroke-linecap="round"/>` + [[140, 1], [112, -1], [84, 1], [58, -1]].map((q, i) => { const sick = low ? i < 2 : i > 1;
      return `<path d="M${x} ${q[0]}q${q[1] * 22}-16 ${q[1] * 46}-6q${-q[1] * 20} 16 ${-q[1] * 46} 6z" fill="${sick ? C.yellow : C.leaf}"/>`; }).join('') + `<path d="M${x} 40q-8-14 0-22q8 8 0 22z" fill="${low ? C.leaf : C.yellow}"/>`;
    return `<path d="M10 160h300" stroke="${C.sub}" stroke-width="6"/>` + pl(90, true) + pl(230, false) + call(30, 130, 1) + call(292, 60, 2); });

  add('baglabel', ['Membaca gred pada beg baja', 'Reading the grade on a fertiliser bag', '读懂肥料袋上的配比'], [
    ['Nombor pertama: peratus nitrogen (N)', 'First number: percent nitrogen (N)', '第一个数字：氮 (N) 的百分比'],
    ['Nombor kedua: peratus fosfat (P₂O₅)', 'Second number: percent phosphate (P₂O₅)', '第二个数字：磷酸盐 (P₂O₅) 的百分比'],
    ['Nombor ketiga: peratus kalium oksida (K₂O)', 'Third number: percent potash (K₂O)', '第三个数字：氧化钾 (K₂O) 的百分比'],
    ['Berat beg; beg 50 kg bergred 15 mengandungi 7.5 kg nutrien itu', 'Bag weight; a 50 kg bag graded 15 holds 7.5 kg of that nutrient', '袋重；50 公斤、配比为 15 的一袋含该养分 7.5 公斤'],
  ], () => `<path d="M96 14h128l10 14v130l-10 12H96l-10-12V28z" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/><path d="M96 14h128M96 170h128" stroke="${C.mute}" stroke-width="5" stroke-dasharray="4 4"/>
    <rect x="100" y="50" width="120" height="44" rx="6" fill="${C.leaf}"/><text x="160" y="80" text-anchor="middle" font-size="22" font-weight="700" fill="${C.paper}">15 · 15 · 15</text>
    <text x="160" y="126" text-anchor="middle" font-size="16" font-weight="700" fill="${C.ink}">50 kg</text>
    <path d="M118 50V34H60M160 50V30M202 50V34h58M190 120h60" stroke="${C.ink}" stroke-width="1.5" fill="none"/>${call(50, 34, 1)}${call(160, 22, 2)}${call(270, 34, 3)}${call(260, 120, 4)}`);

  add('placement', ['Di mana baja ditabur di sekeliling pokok', 'Where to spread fertiliser around a tree', '树周围的施肥位置'], [
    ['Jangan letak baja di pangkal batang', 'Do not put fertiliser against the trunk', '不要把肥料放在树干基部'],
    ['Tabur dalam jalur di bawah hujung kanopi, tempat akar penyerap paling banyak', 'Spread it in a band under the edge of the canopy, where the feeder roots are thickest', '撒在树冠边缘下方的环带，那里吸收根最多'],
    ['Bersihkan rumpai di jalur itu dahulu, dan jangan timbunkan baja', 'Clear weeds from the band first, and do not leave it in heaps', '先清除环带内的杂草，不要成堆放置'],
  ], () => `<circle cx="84" cy="96" r="70" fill="${C.ochre}" opacity="0.35"/><circle cx="84" cy="96" r="50" fill="${C.paper}"/><circle cx="84" cy="96" r="58" fill="none" stroke="${C.leaf}" stroke-width="2" stroke-dasharray="5 4"/><circle cx="84" cy="96" r="8" fill="${C.sub}"/>
    <path d="M170 150h140" stroke="${C.sub}" stroke-width="6"/><rect x="236" y="92" width="8" height="58" fill="${C.sub}"/><ellipse cx="240" cy="66" rx="52" ry="40" fill="${C.leaf}"/>
    <path d="M178 150h30M272 150h30" stroke="${C.ochre}" stroke-width="8" stroke-linecap="round"/><path d="M188 104v44M292 104v44" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="4 4"/>
    <path d="M240 150q-20 14-50 10M240 150q20 14 50 10" fill="none" stroke="${C.sub}" stroke-width="2"/>
    ${call(84, 74, 1)}${call(84, 28, 2)}${call(192, 170, 2)}${call(148, 96, 3)}`);

  add('frond', ['Mencari pelepah ke-17 pada kelapa sawit', 'Finding frond 17 on an oil palm', '在油棕上找到第 17 片叶'], [
    ['Pelepah 1: pelepah termuda yang terbuka sepenuhnya', 'Frond 1: the youngest fully opened frond', '第 1 片叶：最年轻的完全展开叶'],
    ['Pelepah tersusun dalam lapan lingkaran; pelepah 9 terletak betul-betul di bawah pelepah 1', 'Fronds sit in eight spirals; frond 9 is directly below frond 1', '叶片排成八条螺旋；第 9 片叶正好在第 1 片叶下方'],
    ['Pelepah 17 terletak di bawah pelepah 9; inilah yang disampel pada pokok matang', 'Frond 17 is below frond 9; this is the one sampled on mature palms', '第 17 片叶在第 9 片叶下方；成龄树即采这片'],
    ['Ambil anak daun dari bahagian tengah pelepah, di kedua-dua belah', 'Take leaflets from the middle of the frond, from both sides', '从叶片中段两侧采取小叶'],
  ], () => { const fr = (y, len, n, hi) => `<path d="M96 ${y}q${len * 0.5}-${14} ${len} ${6}" fill="none" stroke="${hi ? C.ochre : C.leaf}" stroke-width="${hi ? 6 : 4}" stroke-linecap="round"/>` + (n ? `<text x="${96 + len + 12}" y="${y + 12}" font-size="12" font-weight="700" fill="${C.ink}">${n}</text>` : '');
    return `<path d="M84 170l4-120h16l4 120z" fill="${C.sub}"/><path d="M96 50q-4-20 6-36" fill="none" stroke="${C.leaf}" stroke-width="4" stroke-linecap="round"/>
      ${[40, 88, 136].map((y, i) => `<path d="M96 ${y + 22}q-40-10-66 12" fill="none" stroke="${C.leaf}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>`).join('')}
      ${fr(48, 110, 1)}${fr(96, 120, 9)}${fr(144, 126, 17, true)}<path d="M150 136l8-14M158 138l8-14M150 146l8 14M158 148l8 14" stroke="${C.ochre}" stroke-width="3" stroke-linecap="round"/>
      ${arr(250, 62, 250, 92, C.mute)}${arr(258, 110, 258, 140, C.mute)}${call(290, 54, 1)}${call(290, 102, 2)}${call(290, 150, 3)}${call(158, 172, 4)}`; });

  add('scoop', ['Menentukur sukatan', 'Calibrating a measure', '校准量具'], [
    ['Isi sukatan hingga rata, bukan membukit', 'Fill the measure level, not heaped', '把量具装平，不要堆尖'],
    ['Timbang sekali dengan penimbang dapur dan tolak berat bekas', 'Weigh it once on kitchen scales and take off the weight of the container', '用厨房秤称一次，并减去容器重量'],
    ['Sukatan yang membukit berubah setiap kali. Baja yang berlainan juga berlainan beratnya, jadi timbang setiap satu', 'A heaped measure varies every time. Different fertilisers also weigh differently, so weigh each one', '堆尖的量每次都不同。不同肥料的重量也不同，所以每种都要称'],
  ], () => `<rect x="60" y="120" width="120" height="16" rx="5" fill="${C.mute}"/><rect x="40" y="136" width="160" height="30" rx="8" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/><rect x="92" y="142" width="56" height="18" rx="4" fill="${C.ink}"/><text x="120" y="156" text-anchor="middle" font-size="12" font-weight="700" fill="${C.paper}">320 g</text>
    <path d="M90 60h60v60H90z" fill="${C.grey}" stroke="${C.mute}" stroke-width="2"/><path d="M90 60h60" stroke="${C.ochre}" stroke-width="6"/><path d="M76 54h88" stroke="${C.ink}" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M230 120h40v-40h-40z" fill="${C.grey}" stroke="${C.mute}" stroke-width="2"/><path d="M230 80q20-22 40 0z" fill="${C.ochre}"/><path d="M222 60l56 76M278 60l-56 76" stroke="${C.bad}" stroke-width="4" stroke-linecap="round"/>
    ${call(176, 54, 1)}${call(216, 150, 2)}${call(290, 160, 3)}`);

  /* ---------- more: how soil works ---------- */
  add('factors', ['Lima faktor pembentuk tanah', 'The five soil-forming factors', '五大成土因素'], [
    ['Bahan induk: batuan atau enapan asal', 'Parent material: the rock or sediment it starts from', '母质：最初的岩石或沉积物'],
    ['Iklim: hujan dan suhu yang meluluhawakan batuan', 'Climate: the rain and heat that weather the rock', '气候：使岩石风化的降雨和温度'],
    ['Organisma: tumbuhan, haiwan dan mikrob yang menambah bahan organik', 'Organisms: plants, animals and microbes that add organic matter', '生物：增加有机质的植物、动物和微生物'],
    ['Topografi: cerun menentukan ke mana air dan tanah bergerak', 'Relief: the slope decides where water and soil move', '地形：坡度决定水和土向哪里移动'],
    ['Masa: tanah yang dalam mengambil ribuan tahun', 'Time: a deep soil takes thousands of years', '时间：深厚的土壤需要数千年'],
  ], () => `<path d="M10 150L120 80L210 120L310 96v74H10z" fill="${C.rock}"/><path d="M10 150L120 80L210 120L310 96" fill="none" stroke="${C.sub}" stroke-width="12" stroke-linejoin="round"/><path d="M10 146L120 76L210 116L310 92" fill="none" stroke="${C.top}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="268" cy="30" r="15" fill="${C.yellow}"/>${rain(40, 100, 14, 4)}${tree(160, 96, 0.7)}${sprout(236, 108, 16)}
    <circle cx="60" cy="150" r="13" fill="none" stroke="${C.paper}" stroke-width="2"/><path d="M60 142v8l6 4" stroke="${C.paper}" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${call(280, 150, 1)}${call(116, 30, 2)}${call(186, 46, 3)}${call(110, 110, 4)}${call(60, 124, 5)}`);

  add('soillife', ['Kitaran bahan organik', 'The organic matter cycle', '有机质的循环'], [
    ['Daun dan akar yang mati jatuh ke tanah', 'Dead leaves and roots fall to the soil', '枯叶和死根落入土壤'],
    ['Cacing, serangga dan kulat menghancurkannya', 'Earthworms, insects and fungi break them up', '蚯蚓、昆虫和真菌将其粉碎'],
    ['Mikrob menukarnya kepada humus dan membebaskan nutrien', 'Microbes turn them into humus and release nutrients', '微生物把它们转化为腐殖质并释放养分'],
    ['Akar mengambil nutrien itu semula', 'Roots take the nutrients up again', '根系重新吸收这些养分'],
  ], () => `<rect x="10" y="100" width="300" height="70" fill="${C.sub}"/><rect x="10" y="100" width="300" height="20" fill="${C.top}"/>${tree(70, 100, 1.2)}
    <path d="M110 60q20 10 30 34" fill="none" stroke="${C.ochre}" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#ah)"/><path d="M132 98q8-6 14 0q-6 6-14 0z" fill="${C.ochre}"/><path d="M152 100q8-6 14 0q-6 6-14 0z" fill="${C.ochre}"/>
    <path d="M176 132q10-12 20 0t20 0t20 0" fill="none" stroke="#d98b8b" stroke-width="6" stroke-linecap="round"/>
    ${[[250, 140], [266, 150], [280, 138], [262, 128], [290, 152]].map(d => `<circle cx="${d[0]}" cy="${d[1]}" r="4" fill="${C.yellow}"/>`).join('')}
    <path d="M70 100q-10 30-30 44M70 100q6 34 30 50M70 100q0 30-4 56" fill="none" stroke="${C.paper}" stroke-width="2"/><path d="M246 160q-80 20-140-6" fill="none" stroke="${C.leaf}" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#ah)"/>
    ${call(150, 74, 1)}${call(206, 112, 2)}${call(296, 126, 3)}${call(30, 150, 4)}`);

  add('pores', ['Struktur yang baik dan tanah yang padat', 'Good structure and compacted soil', '良好的结构与压实的土壤'], [
    ['Gumpalan kecil dengan ruang di antaranya', 'Small crumbs with gaps between them', '小团粒之间留有空隙'],
    ['Liang besar membawa air turun dan udara masuk; akar tumbuh melaluinya', 'Large pores take water down and let air in; roots grow through them', '大孔隙让水下渗、空气进入；根系由此伸展'],
    ['Tanah padat: gumpalan terhimpit, liang besar hilang', 'Compacted soil: the crumbs are squeezed and the large pores are gone', '压实的土壤：团粒被挤压，大孔隙消失'],
    ['Air bertakung dan akar berhenti di permukaan', 'Water ponds and roots stop near the surface', '水滞留，根系停在表层'],
  ], () => { const crumbs = [[30, 70], [62, 62], [96, 72], [44, 100], [80, 104], [112, 98], [28, 132], [64, 138], [100, 136], [126, 126]];
    return `<rect x="10" y="44" width="140" height="126" rx="8" fill="${C.wash}"/>${crumbs.map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="15" fill="${C.sub}"/>`).join('')}
      ${sprout(76, 44, 22)}<path d="M76 44q-6 30 6 60t-8 56" fill="none" stroke="${C.paper}" stroke-width="2.5"/>${arr(128, 46, 136, 150, C.water)}
      <rect x="170" y="44" width="140" height="126" rx="8" fill="${C.sub}"/>${[62, 86, 110, 134, 158].map(y => `<path d="M176 ${y}h128" stroke="${C.top}" stroke-width="2"/>`).join('')}
      <rect x="196" y="36" width="90" height="8" rx="3" fill="${C.water}" opacity="0.7"/>${sprout(240, 36, 18)}<path d="M240 44q-16 8-30 6M240 44q16 8 30 6" fill="none" stroke="${C.paper}" stroke-width="2.5"/>
      ${call(30, 22, 1)}${call(120, 22, 2)}${call(190, 22, 3)}${call(296, 22, 4)}`; });

  add('cec', ['Bagaimana tanah memegang nutrien', 'How soil holds nutrients', '土壤如何保持养分'], [
    ['Liat dan humus bercas negatif', 'Clay and humus carry negative charges', '黏粒和腐殖质带负电荷'],
    ['Nutrien bercas positif melekat padanya dan tersimpan untuk akar', 'Positively charged nutrients cling to them and are stored for roots', '带正电荷的养分吸附其上，留给根系'],
    ['Pasir hampir tiada cas, jadi nutrien dibawa turun oleh air hujan', 'Sand has almost no charge, so nutrients are washed down by rain', '砂粒几乎不带电荷，养分被雨水冲走'],
  ], () => { const ion = (x, y, t) => `<circle cx="${x}" cy="${y}" r="10" fill="${C.leaf}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${t}</text>`;
    return `<rect x="20" y="64" width="120" height="52" rx="8" fill="${C.clay}"/>${[34, 58, 82, 106, 128].map(x => `<text x="${x}" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">−</text><text x="${x}" y="112" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">−</text>`).join('')}
      ${[[34, 50, 'K'], [62, 50, 'Ca'], [92, 50, 'Mg'], [122, 50, 'K'], [48, 130, 'Ca'], [80, 130, 'NH₄'], [112, 130, 'Mg']].map(q => ion(q[0], q[1], q[2])).join('')}
      <circle cx="240" cy="74" r="34" fill="${C.sand}"/>${rain(210, 270, 8, 4)}${[[216, 130, 'K'], [244, 148, 'Ca'], [272, 132, 'Mg']].map(q => ion(q[0], q[1], q[2])).join('')}${arr(216, 106, 216, 118, C.water)}${arr(272, 108, 272, 120, C.water)}${arr(244, 112, 244, 136, C.water)}
      ${call(80, 90, 1)}${call(150, 44, 2)}${call(296, 80, 3)}`; });

  add('phmeter', ['Mengukur pH dengan meter', 'Measuring pH with a meter', '用 pH 计测量酸碱度'], [
    ['Tentukur meter dalam larutan penimbal', 'Calibrate the meter in buffer solution', '在缓冲液中校准仪器'],
    ['Campur tanah dan air suling sama banyak, kacau dan biarkan', 'Mix equal parts of soil and distilled water, stir and let it stand', '土与蒸馏水等量混合，搅拌后静置'],
    ['Celup hujung elektrod ke dalam campuran tanah, bukan air di atasnya', 'Put the electrode tip into the slurry, not the water above it', '把电极头插入泥浆，而不是上层清液'],
    ['Bilas elektrod dengan air suling selepas setiap sampel', 'Rinse the electrode with distilled water after each sample', '每测完一个样本，用蒸馏水冲洗电极'],
  ], () => { const beaker = (x, fill, mud) => `<path d="M${x} 90v62a8 8 0 0 0 8 8h36a8 8 0 0 0 8-8V90" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/><path d="M${x + 2} 112h48v40a6 6 0 0 1-6 6h-36a6 6 0 0 1-6-6z" fill="${fill}" opacity="0.75"/>${mud ? `<path d="M${x + 2} 134h48v18a6 6 0 0 1-6 6h-36a6 6 0 0 1-6-6z" fill="${C.sub}"/>` : ''}`;
    const meter = x => `<rect x="${x - 9}" y="30" width="18" height="60" rx="5" fill="${C.ink}"/><rect x="${x - 6}" y="36" width="12" height="12" rx="2" fill="${C.wash}"/><rect x="${x - 3}" y="90" width="6" height="56" fill="${C.mute}"/>`;
    return beaker(14, C.yellow) + meter(40) + beaker(92, C.water, true) + `<path d="M132 60v82" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>` + beaker(170, C.water, true) + meter(196) +
      `<path d="M262 60h30v26l-8 60h-14l-8-60z" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/>${drop(277, 160)}${drop(268, 168, 0.7)}` + call(40, 14, 1) + call(118, 46, 2) + call(196, 14, 3) + call(277, 44, 4); });

  add('ballrod', ['Ujian bebola, rod dan gelang', 'The ball, rod and ring test', '搓球、搓条和弯环测试'], [
    ['Bebola tidak terbentuk atau pecah: pasir', 'No ball forms, or it falls apart: sand', '搓不成球或一碰就散：砂土'],
    ['Bebola terbentuk tetapi tidak boleh digelek menjadi rod: pasir berlom', 'A ball forms but cannot be rolled into a rod: loamy sand', '能成球但搓不成条：壤质砂土'],
    ['Rod terbentuk tetapi patah apabila dibengkokkan: lom', 'A rod forms but breaks when bent: loam', '能搓成条，但弯曲即断：壤土'],
    ['Rod boleh dibengkokkan menjadi gelang tanpa retak: liat', 'The rod bends into a ring without cracking: clay', '土条能弯成环而不裂：黏土'],
  ], () => `${[[30, 100, 5], [44, 108, 4], [36, 114, 3], [52, 98, 3], [24, 112, 3]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2] + 2}" fill="${C.sand}"/>`).join('')}
    <circle cx="116" cy="102" r="22" fill="${C.silt}"/><rect x="164" y="94" width="30" height="14" rx="7" fill="${C.sub}"/><rect x="200" y="98" width="28" height="14" rx="7" fill="${C.sub}" transform="rotate(18 214 105)"/>
    <circle cx="276" cy="102" r="20" fill="none" stroke="${C.clay}" stroke-width="12"/>${[38, 116, 196, 276].map((x, i) => call(x, 150, i + 1)).join('')}`);

  add('munsell', ['Tiga bahagian warna Munsell', 'The three parts of a Munsell colour', '孟塞尔颜色的三个要素'], [
    ['Hue: warna utama, daripada merah (R) ke kuning (Y)', 'Hue: the dominant colour, from red (R) to yellow (Y)', '色相：主要颜色，由红 (R) 到黄 (Y)'],
    ['Value: cerah atau gelap, dari 0 (hitam) ke 10 (putih)', 'Value: lightness, from 0 (black) to 10 (white)', '明度：明暗，由 0（黑）到 10（白）'],
    ['Chroma: kekuatan warna, daripada kelabu ke warna yang terang', 'Chroma: strength, from grey to a vivid colour', '彩度：颜色强度，由灰到鲜艳'],
  ], () => { const hues = ['#9c3b25', '#a8532b', '#b06f33', '#b08a3c', '#b3a04a'], vals = ['#2b2623', '#4a3f38', '#6e5d50', '#93806f', '#b9a896', '#ddd2c4'], chr = ['#8d867f', '#927f6c', '#98774f', '#9f6f36', '#a8651d'];
    return hues.map((c, i) => `<rect x="${14 + i * 22}" y="20" width="20" height="40" rx="4" fill="${c}"/>`).join('') + vals.map((c, i) => `<rect x="150" y="${150 - i * 24}" width="40" height="22" rx="4" fill="${c}" stroke="${C.mute}" stroke-width="0.5"/>`).join('') +
      chr.map((c, i) => `<rect x="${206 + i * 21}" y="100" width="19" height="40" rx="4" fill="${c}"/>`).join('') + arr(14, 72, 122, 72) + arr(140, 168, 140, 34) + arr(206, 152, 310, 152) + call(68, 92, 1) + call(126, 100, 2) + call(258, 80, 3); });

  add('greenmanure', ['Baja hijau', 'Green manure', '绿肥'], [
    ['Tanam kekacang yang cepat membesar; bintil akarnya mengikat nitrogen dari udara', 'Sow a fast-growing legume; its root nodules fix nitrogen from the air', '种植速生豆科作物；其根瘤固定空气中的氮'],
    ['Potong semasa mula berbunga, sebelum berbiji', 'Cut it as flowering starts, before it sets seed', '在初花期、结籽之前割下'],
    ['Gaulkan ke dalam tanah atau biarkan sebagai sungkupan', 'Work it into the soil or leave it as mulch', '翻入土中或留作覆盖物'],
    ['Tunggu dua hingga tiga minggu sebelum menanam tanaman seterusnya', 'Wait two to three weeks before planting the next crop', '等两到三周再种下一茬作物'],
  ], () => `<rect x="10" y="110" width="300" height="60" fill="${C.sub}"/>${[30, 50, 70].map(x => sprout(x, 110, 34)).join('')}${[[30, 124], [50, 130], [70, 122]].map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#e7b6b0"/><path d="M${q[0]} 110v${q[1] - 114}" stroke="${C.paper}" stroke-width="2"/>`).join('')}
    <path d="M110 108h60" stroke="${C.leaf}" stroke-width="8" stroke-linecap="round"/><path d="M112 96l56 6" stroke="${C.leaf}" stroke-width="6" stroke-linecap="round"/><path d="M178 70l-22 30" stroke="${C.ink}" stroke-width="3"/><path d="M178 70q14 4 12 18" fill="none" stroke="${C.mute}" stroke-width="4"/>
    <rect x="196" y="110" width="52" height="26" fill="${C.top}"/><path d="M200 120h44M204 130h36" stroke="${C.leaf}" stroke-width="3" stroke-dasharray="6 5"/>${sprout(284, 110, 26)}
    ${arr(92, 80, 106, 80)}${arr(182, 122, 194, 122)}${arr(252, 122, 268, 122)}${call(50, 54, 1)}${call(140, 76, 2)}${call(222, 92, 3)}${call(284, 66, 4)}`);

  /* ---------- more: fertiliser ---------- */
  add('nloss', ['Ke mana baja nitrogen hilang', 'Where nitrogen fertiliser is lost', '氮肥的流失途径'], [
    ['Meruap: urea di permukaan yang kering dan panas hilang sebagai gas ammonia', 'Volatilisation: urea left on a dry, hot surface is lost as ammonia gas', '挥发：尿素留在干热的地表，以氨气形式散失'],
    ['Air larian: hujan lebat menghanyutkan baja yang baru ditabur', 'Runoff: heavy rain washes away fertiliser that was just spread', '径流：大雨冲走刚撒下的肥料'],
    ['Larut resap: nitrat dibawa turun melepasi akar', 'Leaching: nitrate is carried down past the roots', '淋溶：硝酸盐被带到根层以下'],
    ['Tanah tepu air: nitrat bertukar menjadi gas dan hilang', 'Waterlogged soil: nitrate turns into gas and escapes', '渍水的土壤：硝酸盐变成气体逸失'],
    ['Yang tinggal diambil oleh akar', 'What remains is taken up by the roots', '剩下的被根系吸收'],
  ], () => `<path d="M10 90L310 110v60H10z" fill="${C.sub}"/><path d="M10 90L310 110" stroke="${C.top}" stroke-width="4"/>${tree(150, 100, 1)}
    ${[[70, 92], [84, 94], [98, 94], [200, 102], [214, 104]].map(d => `<circle cx="${d[0]}" cy="${d[1]}" r="3.5" fill="#fff" stroke="${C.mute}"/>`).join('')}
    <path d="M78 84q8-14 0-26t0-22" fill="none" stroke="${C.mute}" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#ah)"/>
    ${arr(226, 106, 296, 111, C.water, 3)}${arr(206, 112, 206, 160, C.water)}<path d="M40 130h40v28H40z" fill="${C.water}" opacity="0.6"/><path d="M60 128q8-12 0-22" fill="none" stroke="${C.mute}" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#ah)"/>
    <path d="M150 100q-12 20-26 26M150 100q10 22 24 30" fill="none" stroke="${C.paper}" stroke-width="2"/>${arr(128, 138, 142, 116, C.leaf)}
    ${call(104, 40, 1)}${call(296, 92, 2)}${call(226, 150, 3)}${call(24, 120, 4)}${call(174, 150, 5)}`);

  add('release', ['Pembebasan nutrien dari masa ke masa (skematik)', 'Nutrient release over time (schematic)', '养分随时间的释放（示意图）'], [
    ['Baja kimia: banyak nutrien dengan segera, kemudian cepat berkurang', 'Chemical fertiliser: a lot of nutrient at once, then a quick fall', '化肥：立即释放大量养分，随后迅速下降'],
    ['Baja organik: sedikit pada mulanya, tetapi berterusan lebih lama', 'Organic fertiliser: little at first, but it carries on for longer', '有机肥：起初很少，但持续时间更长'],
    ['Digunakan bersama, bekalan lebih sekata', 'Used together, the supply is more even', '两者配合，供应更平稳'],
  ], () => `<path d="M30 20v140h270" fill="none" stroke="${C.ink}" stroke-width="2"/><path d="M30 160C44 20 66 24 90 70S150 150 290 154" fill="none" stroke="${C.clay}" stroke-width="4"/>
    <path d="M30 160C80 150 110 108 160 100S250 112 290 124" fill="none" stroke="${C.leaf}" stroke-width="4"/><path d="M30 96h260" stroke="${C.ochre}" stroke-width="2" stroke-dasharray="6 5"/>
    ${arr(250, 172, 296, 172, C.mute)}${call(84, 30, 1)}${call(200, 84, 2)}${call(300, 96, 3)}`);

  add('forms', ['Bentuk baja', 'Forms of fertiliser', '肥料的形态'], [
    ['Butir: bulat, 1 hingga 4 mm', 'Granules: round, 1 to 4 mm', '颗粒：圆形，1 至 4 毫米'],
    ['Serbuk: sangat halus', 'Powder: very fine', '粉末：非常细'],
    ['Pelet: ketulan termampat, biasa untuk baja organik', 'Pellets: pressed pieces, common for organic fertiliser', '丸粒：压制的小块，常见于有机肥'],
    ['Cecair: nutrien terlarut dalam air', 'Liquid: nutrients dissolved in water', '液体：养分溶于水中'],
  ], () => { const pile = (x, col) => `<path d="M${x - 30} 130q30-50 60 0z" fill="${col}" opacity="0.35"/>`;
    return pile(46, C.grey) + [[30, 122], [42, 118], [54, 122], [38, 108], [50, 108], [46, 96], [62, 124], [24, 126]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="6" fill="#f3f1ea" stroke="${C.mute}"/>`).join('') +
      `<path d="M92 130q30-56 60 0z" fill="#e9e5da" stroke="${C.mute}"/>` + pile(198, C.sub) + [[180, 120, 20], [200, 124, -15], [190, 106, 40], [208, 110, -30], [216, 124, 10]].map(c => `<rect x="${c[0] - 9}" y="${c[1] - 4}" width="18" height="8" rx="4" fill="${C.sub}" transform="rotate(${c[2]} ${c[0]} ${c[1]})"/>`).join('') +
      `<path d="M258 60h24v12l10 12v46h-44V84l10-12z" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/><path d="M250 100h40v28h-40z" fill="${C.leaf}" opacity="0.6"/><rect x="262" y="52" width="16" height="8" fill="${C.ink}"/>` + [46, 122, 198, 270].map((x, i) => call(x, 154, i + 1)).join(''); });

  add('methods', ['Empat cara membaja', 'Four ways to apply fertiliser', '四种施肥方法'], [
    ['Tabur: disebar sekata di seluruh permukaan', 'Broadcast: spread evenly over the whole surface', '撒施：均匀撒遍整个地面'],
    ['Jalur: diletak dalam barisan di sisi tanaman', 'Band: placed in a line beside the crop row', '条施：成条施在作物行旁'],
    ['Poket: dimasukkan ke dalam lubang kecil dan ditimbus', 'Pocket: put into small holes and covered', '穴施：放入小穴后覆土'],
    ['Semburan daun: larutan cair disembur pada daun', 'Foliar: a dilute solution sprayed on the leaves', '叶面喷施：把稀溶液喷在叶片上'],
  ], () => { const g = x => `<rect x="${x}" y="110" width="68" height="50" fill="${C.sub}"/>`; const dots = (pts) => pts.map(d => `<circle cx="${d[0]}" cy="${d[1]}" r="3" fill="#fff" stroke="${C.mute}"/>`).join('');
    return g(10) + g(88) + g(166) + g(244) + sprout(44, 110, 26) + sprout(122, 110, 26) + sprout(200, 110, 26) + sprout(278, 110, 30) +
      dots([[18, 108], [28, 108], [56, 108], [66, 108], [72, 108], [36, 108]]) + `<rect x="134" y="112" width="18" height="6" rx="3" fill="#fff" stroke="${C.mute}"/>` +
      `<path d="M176 110l6 18h8l6-18z" fill="${C.top}"/>` + dots([[184, 124], [188, 120]]) + `<path d="M252 60h20l6 14h-32z" fill="${C.ink}"/><path d="M262 76l8 14M258 76l2 16M254 76l-4 14" stroke="${C.water}" stroke-width="2" stroke-dasharray="2 4"/>` +
      [44, 122, 200, 278].map((x, i) => call(x, 172, i + 1)).join(''); }, '0 0 320 186');

  add('paddy', ['Tanah sawah yang ditenggelami air', 'A flooded paddy soil', '淹水的稻田土壤'], [
    ['Air bertakung menghalang udara masuk ke dalam tanah', 'Standing water keeps air out of the soil', '田面水阻隔空气进入土壤'],
    ['Lapisan nipis di permukaan yang masih beroksigen', 'A thin surface layer that still has oxygen', '表面仍含氧的薄层'],
    ['Lapisan terturun tanpa oksigen: berwarna kelabu, pH menghampiri neutral dan fosforus lebih tersedia', 'The reduced layer without oxygen: grey, with pH moving towards neutral and phosphorus more available', '缺氧的还原层：呈灰色，pH 趋于中性，磷更有效'],
    ['Lapisan keras yang menahan air', 'The plough pan that holds the water', '保水的犁底层'],
  ], () => `<rect x="10" y="70" width="300" height="26" fill="${C.water}" opacity="0.6"/><rect x="10" y="96" width="300" height="8" fill="${C.sub}"/><rect x="10" y="104" width="300" height="42" fill="#7d8a86"/><rect x="10" y="146" width="300" height="24" fill="${C.top}"/>
    ${[50, 110, 170, 230].map(x => `<path d="M${x} 104V40M${x} 70q-12-16-16-30M${x} 66q12-16 16-28M${x} 80q-8-10-12-20" fill="none" stroke="${C.leaf}" stroke-width="3" stroke-linecap="round"/><path d="M${x} 104q-8 14-14 20M${x} 104q8 14 14 22M${x} 104v26" fill="none" stroke="${C.paper}" stroke-width="1.5"/>`).join('')}
    ${call(290, 82, 1)}${call(270, 100, 2)}${call(290, 124, 3)}${call(270, 158, 4)}`);

  add('store', ['Menyimpan baja', 'Storing fertiliser', '储存肥料'], [
    ['Bumbung yang tidak bocor dan lantai yang kering', 'A roof that does not leak and a dry floor', '不漏雨的屋顶和干燥的地面'],
    ['Beg di atas palet, tidak menyentuh lantai atau dinding', 'Bags on a pallet, off the floor and away from the wall', '袋子放在托盘上，不接触地面和墙壁'],
    ['Racun perosak, bahan api, benih dan makanan disimpan berasingan', 'Pesticides, fuel, seed and food are kept separately', '农药、燃料、种子和食物分开存放'],
    ['Pintu berkunci; jauh dari perigi dan parit', 'A locked door; away from wells and drains', '门上锁；远离水井和沟渠'],
  ], () => { const bag = (x, y) => `<rect x="${x}" y="${y}" width="44" height="18" rx="5" fill="${C.wash}" stroke="${C.mute}" stroke-width="1.5"/>`;
    return `<path d="M30 60L140 22L250 60" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><path d="M44 60v100h192V60" fill="none" stroke="${C.mute}" stroke-width="3"/><path d="M30 160h220" stroke="${C.sub}" stroke-width="5"/>
      <rect x="70" y="146" width="100" height="8" fill="${C.sub}"/><path d="M78 154v6M120 154v6M162 154v6" stroke="${C.sub}" stroke-width="5"/>${bag(72, 128)}${bag(122, 128)}${bag(72, 110)}${bag(122, 110)}${bag(96, 92)}
      <rect x="200" y="112" width="30" height="46" rx="2" fill="${C.mute}"/><circle cx="206" cy="136" r="2.5" fill="${C.paper}"/>
      <rect x="270" y="126" width="36" height="34" rx="4" fill="${C.bad}" opacity="0.8"/><path d="M270 110l36 60M306 110l-36 60" stroke="${C.ink}" stroke-width="2"/>
      ${call(140, 44, 1)}${call(54, 120, 2)}${call(288, 100, 3)}${call(215, 96, 4)}`; });
})();

/* Where each illustration appears: [lesson, the English heading it follows (null = near the top), id].
   A heading that no longer exists stops the page loading, so the tests catch it. */
const ILLUS_AT = [
  ['2-1', null, 'particles'], ['2-3', null, 'water'], ['2-3', 'Texture and available water', 'infiltration'],
  ['2-4', 'The effects of pH in more detail', 'availability'], ['2-6', null, 'colours'],
  ['3-1', 'Testing texture by feel', 'ribbon'], ['3-1', 'The jar test', 'jar'], ['3-1', 'Measuring slope', 'slope'],
  ['3-2', 'Taking the sample', 'zigzag'], ['3-2', 'Fit the sampling to the crop and the purpose', 'core'],
  ['3-4', 'Peat', 'peat'], ['3-4', 'Acid sulfate soils', 'sulfate'],
  ['4-1', null, 'erosion'], ['4-2', null, 'cover'], ['4-2', 'Choosing by slope', 'terrace'],
  ['5-1', null, 'liming'], ['5-2', 'Making compost', 'compost'], ['5-3', null, 'hardpan'], ['5-3', 'Drain layouts', 'drains'],
  ['5-4', null, 'saltcrust'], ['5-5', 'Tillage', 'tillage'], ['5-5', 'Irrigation', 'irrigation'],
  ['6-1', 'Where the signs show first', 'mobile'], ['6-3', 'Methods', 'placement'], ['6-4', 'Reading a fertiliser grade', 'baglabel'],
  ['7-1', 'Leaf sampling: frond 17', 'frond'],
  ['1-2', 'Five soil-forming factors', 'factors'], ['1-1', 'Organic matter and soil life', 'soillife'], ['2-2', null, 'pores'],
  ['2-4', 'The ability to hold nutrients', 'cec'], ['2-4', 'The pH meter, step by step', 'phmeter'], ['3-1', 'The ball, rod and ring test', 'ballrod'],
  ['2-6', 'The Munsell colour chart', 'munsell'], ['5-2', 'Green manure', 'greenmanure'], ['6-3', 'Keeping nitrogen from escaping', 'nloss'],
  ['6-2', 'Organic and inorganic fertilisers', 'release'], ['6-2', 'Forms of fertiliser', 'forms'], ['6-3', 'Methods', 'methods'],
  ['7-4', 'What changes when soil is flooded', 'paddy'],
  ['6-6', 'Measuring without a scale', 'scoop'], ['6-6', 'Storing and handling', 'store'],
];
if (typeof LESSONS !== 'undefined') {
  for (const [lesson, heading, id] of ILLUS_AT) {
    const body = LESSONS[lesson].body;
    const i = heading === null ? 0 : body.findIndex(b => b[0] === 'h' && b[1][1] === heading);
    if (i < 0) throw new Error(`illustration ${id}: lesson ${lesson} has no heading "${heading}"`);
    if (!ILLUS[id]) throw new Error(`no illustration called ${id}`);
    body.splice(i + 1, 0, ['fig', id]);
  }
}
if (typeof module !== 'undefined' && module.exports) module.exports = { ILLUS };
