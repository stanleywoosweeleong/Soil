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

  /* ---------- a fourth set ---------- */
  const tick = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="${C.leaf}"/><path d="M${x - 5} ${y}l4 4l6-8" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cross = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="${C.bad}"/><path d="M${x - 4} ${y - 4}l8 8M${x + 4} ${y - 4}l-8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
  const grains = (pts, col, r = 5) => pts.map(d => `<circle cx="${d[0]}" cy="${d[1]}" r="${r}" fill="${col}" stroke="${C.mute}" stroke-width="0.6"/>`).join('');

  add('tendencies', ['Pasir, lom dan liat dibandingkan', 'Sand, loam and clay compared', '砂土、壤土与黏土的比较'], [
    ['Saliran: paling cepat pada pasir', 'Drainage: fastest in sand', '排水：砂土最快'],
    ['Menyimpan air: paling banyak pada liat', 'Water storage: greatest in clay', '储水：黏土最多'],
    ['Memegang nutrien: paling kuat pada liat', 'Holding nutrients: strongest in clay', '保肥：黏土最强'],
    ['Mudah dikerjakan: paling mudah pada pasir; lom seimbang dalam semua perkara', 'Ease of working: easiest in sand; loam is balanced in everything', '易耕性：砂土最易；壤土各方面均衡'],
  ], () => { const vals = [[0.95, 0.6, 0.2], [0.2, 0.65, 0.95], [0.15, 0.6, 0.95], [0.95, 0.7, 0.25]], cols = [C.sand, C.silt, C.clay];
    return vals.map((row, r) => row.map((v, c) => `<rect x="${44 + c * 92}" y="${24 + r * 36}" width="${80 * v}" height="20" rx="5" fill="${cols[c]}"/><rect x="${44 + c * 92}" y="${24 + r * 36}" width="80" height="20" rx="5" fill="none" stroke="${C.mute}" stroke-width="1"/>`).join('') + call(20, 34 + r * 36, r + 1)).join('') +
      cols.map((c, i) => `<circle cx="${84 + i * 92}" cy="10" r="6" fill="${c}"/>`).join(''); });

  add('builders', ['Apa yang membina dan merosakkan struktur', 'What builds and what damages structure', '什么改善结构，什么破坏结构'], [
    ['Akar dan kulat mengikat zarah menjadi gumpalan', 'Roots and fungi bind particles into crumbs', '根系和真菌把颗粒黏结成团粒'],
    ['Cacing tanah membuat saluran dan mencampur bahan organik', 'Earthworms make channels and mix in organic matter', '蚯蚓开通孔道并混入有机质'],
    ['Sungkupan melindungi permukaan', 'Mulch protects the surface', '覆盖物保护地表'],
    ['Jentera di atas tanah basah menghimpit liang', 'Machinery on wet soil squeezes the pores shut', '机械在湿土上碾压使孔隙闭合'],
    ['Hujan di atas tanah terdedah memecahkan gumpalan dan membentuk kerak', 'Rain on bare soil breaks crumbs and forms a crust', '雨滴打在裸土上击碎团粒并形成结皮'],
  ], () => `<rect x="10" y="100" width="300" height="70" fill="${C.sub}"/><path d="M10 100h140" stroke="${C.ochre}" stroke-width="7"/><path d="M160 100h150" stroke="${C.top}" stroke-width="4"/><path d="M160 20v150" stroke="${C.paper}" stroke-width="3" stroke-dasharray="5 5"/>
    ${sprout(50, 96, 30)}<path d="M50 100q-16 20-24 44M50 100q10 24 22 40M50 100v50" fill="none" stroke="${C.paper}" stroke-width="2"/><path d="M92 130q8-10 16 0t16 0" fill="none" stroke="#d98b8b" stroke-width="6" stroke-linecap="round"/>
    <rect x="186" y="60" width="60" height="26" rx="5" fill="${C.ink}"/><circle cx="198" cy="92" r="10" fill="${C.ink}"/><circle cx="234" cy="92" r="10" fill="${C.ink}"/><path d="M180 102h72" stroke="${C.top}" stroke-width="8"/>${rain(268, 300, 50, 3)}
    ${call(22, 140, 1)}${call(130, 150, 2)}${call(110, 82, 3)}${call(216, 40, 4)}${call(286, 84, 5)}`);

  add('acidcauses', ['Bagaimana tanah menjadi berasid', 'How soil becomes acidic', '土壤如何变酸'], [
    ['Hujan lebat membawa kalsium dan magnesium turun melepasi akar', 'Heavy rain carries calcium and magnesium down past the roots', '大雨把钙和镁带到根层以下'],
    ['Baja ammonium membebaskan asid apabila bakteria menukarnya kepada nitrat', 'Ammonium fertiliser releases acid as bacteria turn it into nitrate', '细菌把铵转化为硝酸盐时释放出酸'],
    ['Hasil tuaian membawa kalsium, magnesium dan kalium keluar dari ladang', 'The harvest carries calcium, magnesium and potassium off the farm', '收获物把钙、镁、钾带离农地'],
    ['Yang tinggal ialah hidrogen dan aluminium', 'What stays behind is hydrogen and aluminium', '留下来的是氢和铝'],
  ], () => { const ion = (x, y, t, col) => `<circle cx="${x}" cy="${y}" r="10" fill="${col}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${t}</text>`;
    return `<rect x="10" y="70" width="300" height="100" fill="${C.sub}"/>${rain(24, 84, 12, 4)}${arr(40, 80, 40, 150, C.water)}${ion(62, 150, 'Ca', C.leaf)}${ion(84, 138, 'Mg', C.leaf)}
      ${grains([[140, 66], [152, 66], [164, 66]], '#fff', 4)}${arr(152, 76, 152, 104, C.mute)}${ion(152, 118, 'H', C.bad)}
      <path d="M214 70h40v-22h-40z" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/>${ion(226, 36, 'K', C.leaf)}${ion(248, 30, 'Ca', C.leaf)}${arr(262, 44, 296, 30)}
      ${ion(200, 140, 'H', C.bad)}${ion(226, 150, 'Al', C.bad)}${ion(252, 138, 'H', C.bad)}${ion(280, 150, 'Al', C.bad)}
      ${call(24, 100, 1)}${call(176, 96, 2)}${call(290, 58, 3)}${call(240, 116, 4)}`; });

  add('fivetypes', ['Lima jenis tanah dalam tangan', 'Five soil types in the hand', '手中的五种土壤'], [
    ['Pasir: kasar, tidak melekat', 'Sand: gritty, does not hold together', '砂土：粗糙，不成团'],
    ['Kelodak: licin seperti tepung', 'Silt: smooth like flour', '粉土：像面粉一样滑'],
    ['Liat: melekit, boleh dibentuk', 'Clay: sticky, can be moulded', '黏土：黏，可塑形'],
    ['Lom: campuran seimbang, gembur', 'Loam: a balanced mix, crumbly', '壤土：均衡的混合，疏松'],
    ['Gambut: gelap, ringan, berserat', 'Peat: dark, light in weight, fibrous', '泥炭土：色深、质轻、多纤维'],
  ], () => { const hand = x => `<path d="M${x - 26} 140c0-26 10-36 26-36s26 10 26 36z" fill="${C.deep}" opacity="0.5"/>`;
    return [0, 1, 2, 3, 4].map(i => { const x = 36 + i * 62;
      const top = i === 0 ? grains([[x - 10, 100], [x, 96], [x + 10, 100], [x - 4, 88], [x + 6, 88]], C.sand, 5)
        : i === 1 ? `<path d="M${x - 18} 104q18-26 36 0z" fill="${C.silt}"/>`
        : i === 2 ? `<ellipse cx="${x}" cy="92" rx="16" ry="12" fill="${C.clay}"/>`
        : i === 3 ? grains([[x - 10, 98], [x + 2, 94], [x + 12, 100], [x - 2, 84]], C.sub, 8)
        : `<path d="M${x - 18} 104q18-30 36 0z" fill="#2a1f17"/><path d="M${x - 8} 96l6-10M${x + 2} 98l8-12M${x - 2} 100l-8-8" stroke="${C.silt}" stroke-width="1.5"/>`;
      return hand(x) + top + call(x, 158, i + 1); }).join(''); });

  add('samplebag', ['Melabel sampel', 'Labelling the sample', '给样本贴标签'], [
    ['Nama anda dan nama plot', 'Your name and the name of the plot', '你的姓名和地块名称'],
    ['Tarikh sampel diambil', 'The date the sample was taken', '取样日期'],
    ['Kedalaman, contohnya 0 hingga 15 cm', 'The depth, for example 0 to 15 cm', '深度，例如 0 至 15 厘米'],
    ['Tanaman, dan apa yang anda mahu diuji', 'The crop, and what you want tested', '作物，以及要检测的项目'],
    ['Kira-kira 1 kg tanah dalam beg plastik yang bersih', 'About 1 kg of soil in a clean plastic bag', '约 1 公斤土，装在干净的塑料袋里'],
  ], () => `<path d="M100 20h120l14 26v100a16 16 0 0 1-16 16H102a16 16 0 0 1-16-16V46z" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/><path d="M92 96h136v52a12 12 0 0 1-12 12H104a12 12 0 0 1-12-12z" fill="${C.sub}"/>
    <path d="M100 20h120" stroke="${C.mute}" stroke-width="6" stroke-linecap="round"/><rect x="112" y="40" width="96" height="48" rx="5" fill="#fff" stroke="${C.mute}"/>${[50, 60, 70, 80].map(y => `<path d="M120 ${y}h${y === 80 ? 50 : 80}" stroke="${C.mute}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
    ${[[50, 1], [60, 2], [70, 3], [80, 4]].map(([y, i]) => `<path d="M${i % 2 ? 112 : 208} ${y}h${i % 2 ? -44 : 44}" stroke="${C.ink}" stroke-width="1.2"/>${call(i % 2 ? 58 : 262, y + (i > 2 ? 14 : -8), i)}`).join('')}${call(160, 132, 5)}`);

  add('gauge', ['Membaca penarafan pada laporan', 'Reading the rating on a report', '解读报告上的评级'], [
    ['Rendah: tanaman berkemungkinan besar bertindak balas terhadap baja itu', 'Low: the crop is very likely to respond to that fertiliser', '低：作物很可能对该肥料有反应'],
    ['Sederhana: tindak balas mungkin; beri dos penyelenggaraan', 'Medium: a response is possible; give a maintenance dose', '中：可能有反应；施维持量'],
    ['Tinggi: menambah lagi tidak banyak membantu dan membazir wang', 'High: adding more helps little and wastes money', '高：再多施帮助不大，还浪费金钱'],
  ], () => `<path d="M40 130a120 120 0 0 1 80-102l14 38a80 80 0 0 0-54 64z" fill="${C.bad}" opacity="0.85"/><path d="M124 26a120 120 0 0 1 72 0l-14 38a80 80 0 0 0-44 0z" fill="${C.yellow}"/><path d="M200 28a120 120 0 0 1 80 102h-40a80 80 0 0 0-54-64z" fill="${C.leaf}"/>
    <path d="M160 140L96 84" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><circle cx="160" cy="140" r="10" fill="${C.ink}"/>${sprout(60, 172, 14)}${sprout(160, 172, 20)}${sprout(260, 172, 26)}
    ${call(74, 74, 1)}${call(160, 44, 2)}${call(246, 74, 3)}`);

  add('landscape', ['Di mana tanah Malaysia terdapat', 'Where Malaysian soils are found', '马来西亚各类土壤的分布位置'], [
    ['Bukit dan tanah tinggi: Ultisol dan Oksisol yang merah atau kuning dan berasid', 'Hills and uplands: red or yellow, acidic Ultisols and Oxisols', '丘陵和高地：红色或黄色的酸性老成土和氧化土'],
    ['Lembah sungai: aluvium, banyak ditanam padi', 'River valleys: alluvium, widely planted with paddy', '河谷：冲积土，多种水稻'],
    ['Paya di belakang pantai: gambut', 'Swamps behind the coast: peat', '海岸后方的沼泽：泥炭土'],
    ['Dataran pantai berlumpur: tanah asid sulfat', 'Muddy coastal plains: acid sulfate soils', '泥质沿海平原：酸性硫酸盐土'],
    ['Permatang pantai: pasir BRIS', 'Beach ridges: BRIS sand', '海滩沙脊：BRIS 砂土'],
  ], () => `<path d="M10 150V70q40-50 80-10q20 20 40 60v30z" fill="#b5532f"/><path d="M130 120q30-6 50 4v26h-50z" fill="${C.silt}"/><path d="M150 122q10-3 20 0" stroke="${C.water}" stroke-width="4" fill="none"/>
    <path d="M180 124h46v26h-46z" fill="#2a1f17"/><path d="M226 126h40v24h-40z" fill="#6d7a76"/><path d="M266 128q14-12 26 0v22h-26z" fill="${C.sand}"/><path d="M292 134h18v16h-18z" fill="${C.water}" opacity="0.7"/><path d="M10 150h300v20H10z" fill="${C.rock}" opacity="0.5"/>
    ${tree(54, 62, 0.7)}${tree(86, 70, 0.6)}${[140, 152, 164].map(x => sprout(x, 120, 10)).join('')}${palm(200, 124, 0.7)}
    ${call(40, 110, 1)}${call(156, 140, 2)}${call(204, 140, 3)}${call(246, 140, 4)}${call(280, 104, 5)}`);

  add('usle', ['Lima perkara yang menentukan kehilangan tanah', 'Five things that decide soil loss', '决定土壤流失量的五个因素'], [
    ['R: hujan, iaitu jumlah dan kelebatannya', 'R: rainfall, its amount and intensity', 'R：降雨的量和强度'],
    ['K: jenis tanah, iaitu betapa mudah ia terhakis', 'K: the soil, how easily it erodes', 'K：土壤的可蚀性'],
    ['LS: panjang dan kecuraman cerun', 'LS: the length and steepness of the slope', 'LS：坡长和坡度'],
    ['C: litupan tanaman dan sungkupan', 'C: crop cover and mulch', 'C：作物覆盖和覆盖物'],
    ['P: amalan pemuliharaan seperti teres dan kontur', 'P: conservation practice such as terraces and contours', 'P：梯田、等高种植等保育措施'],
  ], () => { const box = i => `<rect x="${8 + i * 62}" y="40" width="54" height="80" rx="8" fill="${C.wash}" stroke="${C.mute}"/>`;
    return [0, 1, 2, 3, 4].map(box).join('') + rain(20, 48, 56, 3) + rain(22, 50, 80, 3) + grains([[86, 96], [98, 88], [108, 98], [94, 104]], C.clay, 7) + `<path d="M140 108l44-44v44z" fill="${C.sub}"/>` + sprout(210, 108, 20) + sprout(228, 108, 26) + `<path d="M200 108h44" stroke="${C.ochre}" stroke-width="5"/>` +
      `<path d="M262 76h18v14h14v14h14" fill="none" stroke="${C.sub}" stroke-width="6"/>` + [0, 1, 2, 3, 4].map(i => call(35 + i * 62, 140, i + 1)).join('') + [0, 1, 2, 3].map(i => `<text x="${66 + i * 62}" y="86" text-anchor="middle" font-size="16" font-weight="700" fill="${C.ink}">×</text>`).join(''); });

  add('fronds', ['Pemuliharaan tanah di ladang sawit', 'Soil conservation in an oil palm field', '油棕园中的水土保持'], [
    ['Pelepah yang dipangkas disusun melintang cerun, bukan menuruninya', 'Pruned fronds are stacked across the slope, not down it', '修剪下的叶片横坡堆放，而不是顺坡'],
    ['Kekacang penutup bumi di antara barisan', 'Legume cover crop between the rows', '行间种植豆科覆盖作物'],
    ['Tandan kosong sebagai sungkupan di sekeliling pokok', 'Empty fruit bunches as mulch around the palm', '空果串铺在树周作覆盖物'],
    ['Baja ditabur di atas barisan pelepah, tempat air larian paling sedikit', 'Fertiliser is spread over the frond row, where runoff is least', '肥料撒在叶片堆放行上，那里径流最少'],
  ], () => `<path d="M10 60L310 130v40H10z" fill="${C.sub}"/><path d="M10 60L310 130" stroke="${C.leaf}" stroke-width="6"/>${palm(70, 74, 1)}${palm(240, 114, 1)}
    <path d="M124 82l44 10M128 76l40 10M126 90l40 9" stroke="${C.ochre}" stroke-width="5" stroke-linecap="round"/><ellipse cx="240" cy="118" rx="26" ry="6" fill="${C.top}"/>${grains([[136, 74], [150, 78], [160, 80]], '#fff', 3)}
    ${call(148, 112, 1)}${call(196, 86, 2)}${call(282, 140, 3)}${call(150, 54, 4)}`);

  add('limesteps', ['Empat langkah mengapur', 'Liming in four steps', '施石灰四步骤'], [
    ['Uji tanah dahulu untuk mengetahui pH dan keperluan kapur', 'Test the soil first for pH and the lime requirement', '先测土，了解 pH 和石灰需要量'],
    ['Tabur kapur sekata di seluruh kawasan', 'Spread the lime evenly over the whole area', '把石灰均匀撒遍全区'],
    ['Gaulkan ke dalam tanah atas', 'Mix it into the topsoil', '混入表土'],
    ['Tunggu sebelum menanam, kemudian uji semula dari semasa ke semasa', 'Wait before planting, then retest from time to time', '等待一段时间再种植，之后定期复测'],
  ], () => { const g = x => `<rect x="${x}" y="110" width="66" height="50" fill="${C.sub}"/>`;
    return g(10) + g(88) + g(166) + g(244) + `<rect x="34" y="60" width="16" height="50" rx="4" fill="${C.ink}"/><rect x="37" y="66" width="10" height="10" rx="2" fill="${C.wash}"/>` +
      `<path d="M88 110h66" stroke="#f1eee6" stroke-width="7"/>` + grains([[104, 92], [120, 84], [136, 94]], '#f1eee6', 3) + `<path d="M166 110h66v22h-66z" fill="${C.deep}"/>` + grains([[178, 118], [196, 124], [214, 116], [206, 128], [186, 128]], '#f1eee6', 2.5) + `<path d="M232 74l-28 34" stroke="${C.ink}" stroke-width="3"/><path d="M198 104l10 8" stroke="${C.mute}" stroke-width="6" stroke-linecap="round"/>` +
      sprout(277, 110, 26) + `<circle cx="296" cy="70" r="12" fill="none" stroke="${C.ink}" stroke-width="2"/><path d="M296 63v7l5 3" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>` + [43, 121, 199, 277].map((x, i) => call(x, 172, i + 1)).join('') + arr(78, 136, 86, 136) + arr(156, 136, 164, 136) + arr(234, 136, 242, 136); }, '0 0 320 186');

  add('implements', ['Bahagian kerja alat pembajakan', 'The working parts of tillage implements', '耕作机具的工作部件'], [
    ['Bajak piring: piring cekung memotong dan membalikkan', 'Disc plough: concave discs cut and turn', '圆盘犁：凹面圆盘切土翻土'],
    ['Bajak sepak: mata dan sayap membalikkan kepingan tanah', 'Mouldboard plough: a share and board turn the furrow slice', '铧式犁：犁铧和犁壁翻转垡片'],
    ['Bajak pahat: kaki tirus memecahkan lapisan keras', 'Chisel plough: narrow legs break the hard pan', '凿式犁：窄齿打破硬土层'],
    ['Bajak putar: bilah berputar menghancurkan tanah', 'Rotary tiller: spinning blades pulverise the soil', '旋耕机：旋转刀片打碎土壤'],
    ['Bajak sisir: gigi halus meratakan batas semaian', 'Tine harrow: fine teeth level the seedbed', '钉齿耙：细齿耙平苗床'],
  ], () => `<path d="M8 130h304" stroke="${C.sub}" stroke-width="6"/><path d="M8 60h304" stroke="${C.ink}" stroke-width="4"/>
    <path d="M40 60v36" stroke="${C.ink}" stroke-width="4"/><ellipse cx="40" cy="116" rx="9" ry="24" fill="${C.mute}" stroke="${C.ink}" stroke-width="2"/>
    <path d="M100 60v44" stroke="${C.ink}" stroke-width="4"/><path d="M100 96q26 6 30 38h-34q8-14 4-38z" fill="${C.mute}" stroke="${C.ink}" stroke-width="2"/>
    <path d="M160 60q0 50 -8 86" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M152 146l-8-10h12z" fill="${C.ink}"/>
    <circle cx="220" cy="112" r="8" fill="${C.ink}"/><path d="M220 60v44M220 112l22-12q6 10-2 16M220 112l-22 12q-6-10 2-16M220 112l12 22q-10 6-16-2M220 112l-12-22q10-6 16 2" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
    ${[264, 276, 288, 300].map(x => `<path d="M${x} 60v72" stroke="${C.ink}" stroke-width="2.5"/>`).join('')}
    ${[40, 104, 160, 220, 282].map((x, i) => call(x, 160, i + 1)).join('')}`);

  add('npk', ['Apa yang dilakukan oleh N, P dan K', 'What N, P and K do', '氮、磷、钾的作用'], [
    ['Nitrogen: daun dan batang yang hijau dan subur', 'Nitrogen: green, vigorous leaves and stems', '氮：茎叶浓绿茁壮'],
    ['Fosforus: akar, bunga dan pemindahan tenaga', 'Phosphorus: roots, flowers and energy transfer', '磷：根系、花和能量转移'],
    ['Kalium: kualiti buah, kawalan air dan ketahanan penyakit', 'Potassium: fruit quality, water control and disease resistance', '钾：果实品质、水分调节和抗病力'],
  ], () => `<path d="M10 120h300" stroke="${C.sub}" stroke-width="6"/><path d="M160 120V40" stroke="${C.leaf}" stroke-width="5" stroke-linecap="round"/>
    ${[[100, 1], [78, -1], [56, 1]].map(q => `<path d="M160 ${q[0]}q${q[1] * 26}-18 ${q[1] * 54}-6q${-q[1] * 24} 18 ${-q[1] * 54} 6z" fill="${C.leaf}"/>`).join('')}
    <circle cx="160" cy="34" r="9" fill="${C.yellow}"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${160 + 13 * Math.cos(a * Math.PI / 180)}" cy="${34 + 13 * Math.sin(a * Math.PI / 180)}" r="6" fill="#e58aa0"/>`).join('')}
    <circle cx="196" cy="96" r="13" fill="${C.ochre}"/><circle cx="216" cy="76" r="10" fill="${C.ochre}"/>
    <path d="M160 120q-20 20-50 30M160 120q14 26 44 34M160 120v48M160 140q-14 14-22 24" fill="none" stroke="${C.sub}" stroke-width="3" stroke-linecap="round"/>
    ${call(84, 60, 1)}${call(108, 160, 2)}${call(250, 90, 3)}`);

  add('kinds', ['Baja tunggal, sebatian dan campuran', 'Straight, compound and mixed fertiliser', '单质肥料、复合肥料与混合肥料'], [
    ['Tunggal: setiap butir membawa satu nutrien utama', 'Straight: every granule carries one primary nutrient', '单质：每一粒只含一种大量元素'],
    ['Sebatian: setiap butir membawa nutrien yang sama, dalam nisbah yang sama', 'Compound: every granule carries the same nutrients in the same ratio', '复合：每一粒都含相同养分，比例相同'],
    ['Campuran: butir yang berlainan digaul; boleh terasing semasa diangkut', 'Mixed: different granules blended together; they can separate in transport', '混合：不同的颗粒掺混在一起；运输中可能分层'],
  ], () => { const pts = [[0, 0], [22, 4], [44, 0], [11, 20], [33, 20], [22, 40], [0, 40], [44, 40]]; const tri = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${C.leaf}"/><path d="M${x} ${y}V${y - 9}A9 9 0 0 1 ${x + 7.8} ${y + 4.5}z" fill="${C.clay}"/><path d="M${x} ${y}L${x + 7.8} ${y + 4.5}A9 9 0 0 1 ${x - 7.8} ${y + 4.5}z" fill="${C.ochre}"/>`;
    return pts.map(d => `<circle cx="${34 + d[0]}" cy="${50 + d[1]}" r="9" fill="${C.leaf}"/>`).join('') + pts.map(d => tri(138 + d[0], 50 + d[1])).join('') + pts.map((d, i) => `<circle cx="${242 + d[0]}" cy="${50 + d[1]}" r="9" fill="${[C.leaf, C.clay, C.ochre][i % 3]}"/>`).join('') +
      [56, 160, 264].map((x, i) => call(x, 130, i + 1)).join('') + `<circle cx="110" cy="164" r="6" fill="${C.leaf}"/>${label(122, 168, 'N', 'start')}<circle cx="150" cy="164" r="6" fill="${C.clay}"/>${label(162, 168, 'P', 'start')}<circle cx="190" cy="164" r="6" fill="${C.ochre}"/>${label(202, 168, 'K', 'start')}`; });

  add('overuse', ['Apabila baja berlebihan sampai ke sungai', 'When surplus fertiliser reaches the river', '过量肥料进入河流之后'],  [
    ['Hujan menghanyutkan baja yang berlebihan dari ladang', 'Rain washes surplus fertiliser off the field', '雨水把多余的肥料冲离农田'],
    ['Nitrat meresap ke dalam air bawah tanah', 'Nitrate seeps down into the groundwater', '硝酸盐渗入地下水'],
    ['Alga tumbuh dengan pesat di dalam air', 'Algae grow rapidly in the water', '藻类在水中迅速繁殖'],
    ['Apabila alga mati dan mereput, oksigen habis dan ikan mati', 'As the algae die and rot, oxygen runs out and fish die', '藻类死亡腐烂时耗尽氧气，鱼类死亡'],
  ], () => `<path d="M10 70L190 100v70H10z" fill="${C.sub}"/><path d="M190 100h120v70H190z" fill="${C.water}" opacity="0.6"/><path d="M190 100h120" stroke="${C.leaf}" stroke-width="7" stroke-dasharray="14 6"/>
    ${[40, 70, 100].map((x, i) => sprout(x, 74 + i * 5, 18)).join('')}${rain(30, 110, 20, 4)}${arr(124, 96, 184, 108, C.ochre, 3)}${arr(90, 100, 90, 150, C.ochre)}<path d="M10 150h180" stroke="${C.water}" stroke-width="3" stroke-dasharray="6 4"/>
    <path d="M236 140q10-6 20 0q-10 6-20 0zM256 140l8-5v10z" fill="${C.mute}" transform="rotate(180 250 140)"/>
    ${call(150, 78, 1)}${call(60, 132, 2)}${call(250, 84, 3)}${call(290, 150, 4)}`);

  add('calcflow', ['Daripada syor kepada kuantiti baja', 'From a recommendation to an amount of fertiliser', '从推荐量到肥料用量'], [
    ['Mulakan dengan nutrien yang diperlukan, contohnya 100 kg N sehektar', 'Start with the nutrient needed, for example 100 kg N per hectare', '从所需养分开始，例如每公顷 100 公斤氮'],
    ['Bahagi dengan pecahan nutrien dalam baja: urea ialah 46%, jadi 0.46', 'Divide by the fraction of nutrient in the fertiliser: urea is 46%, so 0.46', '除以肥料中养分的比例：尿素为 46%，即 0.46'],
    ['Hasilnya ialah baja sehektar: 217 kg urea', 'The result is fertiliser per hectare: 217 kg of urea', '得出每公顷的肥料量：217 公斤尿素'],
    ['Darab dengan keluasan plot anda', 'Multiply by the area of your plot', '再乘以地块面积'],
  ], () => { const box = (x, t, col) => `<rect x="${x}" y="60" width="64" height="48" rx="8" fill="${col}"/><text x="${x + 32}" y="90" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">${t}</text>`;
    return box(8, '100', C.leaf) + box(88, '÷ 0.46', C.sub) + box(168, '217', C.clay) + box(248, '× ha', C.water) + arr(74, 84, 86, 84) + arr(154, 84, 166, 84) + arr(234, 84, 246, 84) + [40, 120, 200, 280].map((x, i) => call(x, 130, i + 1)).join(''); });

  add('fpj', ['Membuat jus tumbuhan tertapai', 'Making fermented plant juice', '制作发酵植物汁'], [
    ['Pucuk tumbuhan dan gula perang, sama berat', 'Plant tips and brown sugar, equal weights', '植物嫩梢与红糖，等重'],
    ['Padatkan ke dalam balang hingga dua pertiga penuh', 'Pack into a jar until two thirds full', '装瓶压实至三分之二满'],
    ['Tutup dengan kain atau kertas yang telap udara, bukan penutup yang ketat', 'Cover with breathable cloth or paper, not a tight lid', '用透气的布或纸盖住，不要拧紧盖子'],
    ['Simpan di tempat teduh; tapis apabila cecair sudah terbentuk', 'Keep in the shade; strain once the liquid has formed', '放在阴凉处；液体析出后过滤'],
  ], () => { const jar = (x, fill, h) => `<path d="M${x} 60h56v84a8 8 0 0 1-8 8h-40a8 8 0 0 1-8-8z" fill="${C.wash}" stroke="${C.mute}" stroke-width="2"/><path d="M${x + 2} ${150 - h}h52v${h - 6}a6 6 0 0 1-6 6h-40a6 6 0 0 1-6-6z" fill="${fill}"/>`;
    return sprout(34, 110, 30) + `<rect x="54" y="92" width="26" height="18" rx="3" fill="${C.sub}"/><path d="M10 110h80" stroke="${C.mute}" stroke-width="3"/>` + jar(110, C.leaf, 60) + `<path d="M108 90h60" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="4 3"/>` +
      jar(186, C.leaf, 60) + `<path d="M182 60q32-14 64 0" fill="#fff" stroke="${C.mute}" stroke-width="2"/><path d="M184 66h60" stroke="${C.bad}" stroke-width="2.5"/>` + jar(260, C.top, 40) + `<path d="M262 104h52v10h-52z" fill="${C.leaf}" opacity="0.7"/>` +
      [48, 138, 214, 288].map((x, i) => call(x, 170, i + 1)).join(''); }, '0 0 326 186');

  add('mixing', ['Tiga peraturan mencampur baja', 'Three rules for mixing fertiliser', '混合肥料的三条规则'], [
    ['Urea dengan superfosfat: jangan; ia menjadi melekit', 'Urea with superphosphate: no; it turns sticky', '尿素加过磷酸钙：不可；会变黏'],
    ['Urea atau baja ammonium dengan kapur: jangan tabur bersama; nitrogen hilang sebagai gas', 'Urea or ammonium fertiliser with lime: do not apply together; nitrogen is lost as gas', '尿素或铵态肥加石灰：不要同时施；氮会变成气体损失'],
    ['Urea dengan MOP atau kieserit: boleh, tetapi tabur sebaik sahaja dicampur', 'Urea with MOP or kieserite: yes, but spread as soon as it is mixed', '尿素加氯化钾或硫镁矾：可以，但混后立即施用'],
  ], () => { const pile = (x, y, col) => `<path d="M${x - 22} ${y}q22-34 44 0z" fill="${col}" stroke="${C.mute}"/>`; const plus = (x, y) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="18" font-weight="700" fill="${C.ink}">+</text>`;
    return [0, 1, 2].map(r => { const y = 46 + r * 52; return pile(60, y, '#f3f1ea') + plus(100, y - 6) + pile(140, y, [C.grey, '#e6e1d6', C.clay][r]) + arr(176, y - 12, 214, y - 12, C.mute) + (r < 2 ? cross(240, y - 12) : tick(240, y - 12)) + call(290, y - 12, r + 1); }).join('') +
      `<path d="M228 20q6-8 0-14M252 20q6-8 0-14" fill="none" stroke="${C.mute}" stroke-width="2" stroke-dasharray="3 3" transform="translate(-14 62)"/>`; });

  add('areas', ['Hektar, ekar dan relong dibandingkan', 'A hectare, an acre and a relong compared', '公顷、英亩与 relong 的比较'], [
    ['1 hektar: 100 m × 100 m', '1 hectare: 100 m × 100 m', '1 公顷：100 米 × 100 米'],
    ['1 ekar: kira-kira 0.4 hektar', '1 acre: about 0.4 hectare', '1 英亩：约 0.4 公顷'],
    ['1 relong (Kedah): kira-kira 0.29 hektar', '1 relong (Kedah): about 0.29 hectare', '1 relong（吉打）：约 0.29 公顷'],
  ], () => `<rect x="20" y="20" width="140" height="140" fill="${C.leaf}" opacity="0.3" stroke="${C.leaf}" stroke-width="2"/><rect x="20" y="71" width="89" height="89" fill="${C.ochre}" opacity="0.5" stroke="${C.ochre}" stroke-width="2"/><rect x="20" y="85" width="75" height="75" fill="${C.clay}" opacity="0.7" stroke="${C.clay}" stroke-width="2"/>
    <path d="M20 170h140M20 166v8M160 166v8" stroke="${C.ink}" stroke-width="1.5"/>${label(90, 184, '100 m')}
    <rect x="200" y="50" width="100" height="18" rx="4" fill="${C.leaf}" opacity="0.5"/><rect x="200" y="84" width="40" height="18" rx="4" fill="${C.ochre}" opacity="0.8"/><rect x="200" y="118" width="29" height="18" rx="4" fill="${C.clay}"/>
    ${call(140, 40, 1)}${call(98, 82, 2)}${call(56, 124, 3)}${call(186, 59, 1)}${call(186, 93, 2)}${call(186, 127, 3)}`, '0 0 320 192');

  add('leaflets', ['Anak daun yang disampel', 'Which leaflets to sample', '应采哪些小叶'], [
    ['Cari tempat rabung di atas rakis berubah daripada rata kepada tirus', 'Find where the ridge on top of the rachis changes from flat to pointed', '找到叶轴上面的脊由平变尖的位置'],
    ['Ambil enam anak daun dari setiap belah di tempat itu', 'Take six leaflets from each side at that point', '在该处两侧各取六片小叶'],
    ['Simpan sepertiga tengah setiap anak daun', 'Keep the middle third of each leaflet', '保留每片小叶的中间三分之一'],
    ['Buang hujung, pangkal dan lidi', 'Discard the tip, the base and the midrib', '丢弃叶尖、叶基和中脉'],
  ], () => `<path d="M10 60h300" stroke="${C.sub}" stroke-width="7" stroke-linecap="round"/>${Array.from({ length: 19 }, (_, i) => { const x = 22 + i * 15, hi = i >= 9 && i <= 11; return `<path d="M${x} 60l10-36M${x} 60l10 36" stroke="${hi ? C.ochre : C.leaf}" stroke-width="${hi ? 4 : 3}" stroke-linecap="round" opacity="${hi ? 1 : 0.55}"/>`; }).join('')}
    <path d="M172 52l6-8l6 8" fill="none" stroke="${C.ink}" stroke-width="2"/>
    <path d="M40 150h240" stroke="${C.leaf}" stroke-width="16" stroke-linecap="round" opacity="0.4"/><path d="M120 150h80" stroke="${C.leaf}" stroke-width="16"/><path d="M40 150h240" stroke="${C.paper}" stroke-width="2"/><path d="M120 136v28M200 136v28" stroke="${C.ink}" stroke-width="2" stroke-dasharray="4 3"/>
    ${call(178, 28, 1)}${call(204, 104, 2)}${call(160, 126, 3)}${call(64, 126, 4)}${call(256, 126, 4)}`);

  add('durianyear', ['Baja durian mengikut peringkat', 'Durian fertiliser by stage', '榴莲按生长阶段施肥'], [
    ['Selepas menuai: baja seimbang untuk pucuk dan daun baharu', 'After harvest: a balanced fertiliser for the new flush of leaves', '采收后：施均衡肥，促进新梢新叶'],
    ['Sebelum berbunga: kurangkan nitrogen, tambah fosforus dan kalium', 'Before flowering: less nitrogen, more phosphorus and potassium', '开花前：减氮，增磷钾'],
    ['Semasa buah membesar: kalium tinggi untuk kualiti buah', 'While the fruit swells: high potassium for fruit quality', '果实膨大期：高钾以提高果实品质'],
  ], () => `<circle cx="160" cy="92" r="64" fill="none" stroke="${C.mute}" stroke-width="3" stroke-dasharray="6 6"/><path d="M160 28a64 64 0 0 1 55 96" fill="none" stroke="${C.leaf}" stroke-width="7" marker-end="url(#ah)"/><path d="M212 130a64 64 0 0 1-108-4" fill="none" stroke="${C.yellow}" stroke-width="7" marker-end="url(#ah)"/><path d="M102 120a64 64 0 0 1 52-92" fill="none" stroke="${C.ochre}" stroke-width="7" marker-end="url(#ah)"/>
    ${tree(160, 118, 0.9)}<circle cx="150" cy="80" r="5" fill="${C.ochre}"/><circle cx="172" cy="88" r="5" fill="${C.ochre}"/>
    ${call(232, 60, 1)}${call(160, 170, 2)}${call(86, 60, 3)}`);

  add('paddyn', ['Meletakkan urea di sawah', 'Placing urea in a paddy field', '稻田中尿素的施放位置'], [
    ['Urea yang ditabur ke dalam air bertakung: banyak yang hilang ke udara', 'Urea broadcast into standing water: much is lost to the air', '撒入田面水中的尿素：大量挥发到空气中'],
    ['Urea yang digaul atau dibenamkan ke dalam lapisan terturun: kekal sebagai ammonium dan diambil oleh akar', 'Urea mixed or pushed into the reduced layer: stays as ammonium and is taken up by roots', '混入或深施到还原层的尿素：保持铵态并被根系吸收'],
  ], () => { const half = x => `<rect x="${x}" y="70" width="140" height="24" fill="${C.water}" opacity="0.6"/><rect x="${x}" y="94" width="140" height="8" fill="${C.sub}"/><rect x="${x}" y="102" width="140" height="68" fill="#7d8a86"/><path d="M${x + 70} 102V40M${x + 70} 70q-12-16-16-30M${x + 70} 66q12-16 16-28" fill="none" stroke="${C.leaf}" stroke-width="3" stroke-linecap="round"/><path d="M${x + 70} 102q-10 20-18 30M${x + 70} 102q10 20 18 30M${x + 70} 102v36" fill="none" stroke="${C.paper}" stroke-width="1.5"/>`;
    return half(10) + half(170) + grains([[34, 80], [50, 84], [110, 80], [126, 84]], '#fff', 4) + `<path d="M40 66q6-10 0-20t0-18M118 66q6-10 0-20t0-18" fill="none" stroke="${C.mute}" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#ah)"/>` +
      grains([[214, 130], [266, 130]], '#fff', 5) + arr(220, 126, 234, 116, C.leaf) + arr(260, 126, 246, 116, C.leaf) + call(26, 150, 1) + call(186, 150, 2); });
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
  ['2-1', 'General tendencies', 'tendencies'], ['2-2', 'What damages and what builds structure', 'builders'], ['2-4', 'What makes soil acidic', 'acidcauses'],
  ['2-5', null, 'fivetypes'], ['3-2', 'Where to send it', 'samplebag'], ['3-2', 'Reading the report', 'gauge'], ['3-3', null, 'landscape'],
  ['4-1', 'Estimating soil loss', 'usle'], ['7-1', 'Mineral soils: suitability', 'fronds'], ['5-1', 'How to lime', 'limesteps'], ['5-5', 'Tillage implements', 'implements'],
  ['6-1', 'What the macronutrients do', 'npk'], ['6-2', 'Straight, compound and mixed fertilisers', 'kinds'], ['6-2', 'When chemical fertiliser is overused', 'overuse'],
  ['6-4', null, 'calcflow'], ['6-5', 'Making FPJ', 'fpj'], ['6-6', 'Which fertilisers can be mixed', 'mixing'], ['6-6', 'Local units of area', 'areas'],
  ['7-1', 'Taking the leaf sample', 'leaflets'], ['7-2', 'An example feeding programme by age', 'durianyear'], ['7-4', 'What this means for fertilising', 'paddyn'],
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
