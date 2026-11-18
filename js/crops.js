/* Crop unit (oil palm, selected fruit trees, paddy) and the field extras that go with it.
   Loaded after content.js and units.js; text tuples are [ms, en, zh].

   Numbers in this file are teaching examples from named sources. Each one carries a
   ['src', …] block saying where it came from and where it applies. */

Object.assign(UI, {
  toolsIntro: ['Lima alat untuk digunakan di tapak.', 'Five tools to use at the site.', '五个可在田间使用的工具。'],
  srcLabel: ['Sumber', 'Source', '来源'],
  appliesLabel: ['Terpakai untuk', 'Applies to', '适用范围'],
  caseLabel: ['Kajian kes', 'Case study', '案例'],

  /* slope tool */
  tSlope: ['Kalkulator cerun', 'Slope calculator', '坡度计算器'],
  tSlopeDesc: ['Tukar ukuran beza tinggi dan jarak mendatar kepada peratus cerun dan darjah.', 'Turn a rise and a horizontal run into a slope in percent and degrees.', '把垂直高差和水平距离换算成坡度百分比和度数。'],
  rise: ['Beza tinggi (m)', 'Rise (m)', '垂直高差（米）'],
  run: ['Jarak mendatar (m)', 'Horizontal run (m)', '水平距离（米）'],
  slope: ['Cerun', 'Slope', '坡度'],
  enterSlope: ['Masukkan beza tinggi (0 atau lebih) dan jarak mendatar yang lebih daripada 0.', 'Enter a rise of 0 or more and a run greater than 0.', '请输入高差（0 或以上）和大于 0 的水平距离。'],
  slopePalm: ['Kelas kecerunan untuk kelapa sawit di tanah mineral', 'Terrain class for oil palm on mineral soil', '矿质土上油棕的坡度等级'],
  slopeDo: ['Contoh langkah dalam satu panduan kelapa sawit', 'Example measures in one oil palm guide', '一份油棕指南中的示例措施'],
  slopeNote: ['Kecerunan hanyalah satu faktor. Panjang cerun, laluan air larian dan keamatan ribut juga menentukan hakisan. Untuk perancangan, rujuk Garis Panduan Pembangunan Pertanian di Tanah Bercerun (Jabatan Pertanian, 2020).',
              'Steepness is only one factor. Slope length, runoff paths and storm intensity also decide erosion. For planning, refer to the Jabatan Pertanian guideline on agricultural development on sloping land (2020).',
              '坡度只是因素之一。坡长、径流路径和暴雨强度同样决定侵蚀程度。规划时请参考农业局《坡地农业发展指南》（2020）。'],

  /* pH tool: crop target, no lime rate */
  crop: ['Tanaman', 'Crop', '作物'],
  target: ['Julat pH panduan', 'Guide pH range', '参考 pH 范围'],
  limeEst: ['Perlukah kapur?', 'Is lime needed?', '需要施石灰吗？'],
  inRange: ['pH berada dalam julat panduan tanaman ini. Kapur tidak diperlukan.', 'The pH is within this crop’s guide range. No lime is needed.', 'pH 在该作物的参考范围内，无需施石灰。'],
  aboveRange: ['pH melebihi julat panduan. Jangan mengapur.', 'The pH is above the guide range. Do not lime.', 'pH 高于参考范围，不要施石灰。'],
  belowRange: ['pH di bawah julat panduan. Kapur mungkin diperlukan, tetapi alat ini tidak memberi kadar.', 'The pH is below the guide range. Lime may be needed, but this tool does not give a rate.', 'pH 低于参考范围，可能需要施石灰，但本工具不提供用量。'],
  limeSteps: [
    ['Hantar sampel tanah ke makmal dan minta keperluan kapur, bukan pH sahaja.', 'Send a soil sample to a laboratory and ask for the lime requirement, not only the pH.', '把土样送到实验室，要求测定石灰需要量，而不只是 pH。'],
    ['Semak nilai peneutralan pada label kapur; kapur yang kurang tulen memerlukan kuantiti lebih.', 'Check the neutralising value on the lime label; less pure lime needs a larger amount.', '查看石灰标签上的中和值；纯度较低的石灰需要更多用量。'],
    ['Ikut kadar dan pecahan pemberian yang disyorkan oleh makmal atau pegawai pertanian.', 'Follow the rate and the split applications recommended by the laboratory or agriculture officer.', '按实验室或农业官员建议的用量和分次方式施用。'],
    ['Uji semula sebelum mengapur lagi.', 'Retest before liming again.', '再次施石灰前重新检测。'],
  ],
  limeNote: ['Julat panduan ialah nilai umum untuk pH dalam air. Makmal mungkin melaporkan pH dalam kalsium klorida, yang bacaannya lebih rendah.',
             'Guide ranges are general values for pH in water. A laboratory may report pH in calcium chloride, which reads lower.',
             '参考范围是针对水浸提 pH 的一般数值。实验室可能报告氯化钙 pH，其读数较低。'],

  /* fertiliser tool: tree programme */
  modeTree: ['Program pokok', 'Tree programme', '果树施肥计划'],
  treeRate: ['Baja sepokok setahun (kg)', 'Fertiliser per tree per year (kg)', '每株每年肥料（公斤）'],
  apps: ['Bilangan pemberian setahun', 'Applications per year', '每年施肥次数'],
  trees: ['Bilangan pokok', 'Number of trees', '株数'],
  perApp: ['Sepokok, setiap pemberian', 'Per tree, each application', '每株每次'],
  perRound: ['Semua pokok, setiap pemberian', 'All trees, each application', '全部树每次'],
  perYear: ['Semua pokok, setahun', 'All trees, per year', '全部树每年'],
  organicPresets: ['Baja organik (nilai lazim)', 'Organic manures (typical values)', '有机肥（常见数值）'],
  costNote: ['Harga dibahagi dengan jumlah N + P₂O₅ + K₂O dalam beg. Ini perbandingan kasar sahaja: ia tidak mengambil kira nutrien yang sebenarnya diperlukan, Mg, S, mikronutrien atau kelarutan.',
             'Price divided by the total N + P₂O₅ + K₂O in the bag. This is only a rough comparison: it ignores which nutrient you actually need, Mg, S, micronutrients and solubility.',
             '价格除以包内 N + P₂O₅ + K₂O 的总量。这只是粗略比较：它没有考虑你实际需要哪种养分，也不计镁、硫、微量元素和溶解性。'],
});

/* guide pH ranges (pH in water); general values, not calibrated recommendations */
const CROP_PH = [
  { id: 'gen', range: [5.5, 7.0], name: ['Umum', 'General', '一般作物'] },
  { id: 'palm', range: [4.5, 6.5], name: ['Kelapa sawit', 'Oil palm', '油棕'] },
  { id: 'durian', range: [5.5, 6.5], name: ['Durian', 'Durian', '榴莲'] },
  { id: 'fruit', range: [5.5, 7.0], name: ['Pokok buah lain', 'Other fruit trees', '其他果树'] },
];

/* slope classes */
const SLOPE_PALM = [   // terrain in degrees, mineral soils
  { max: 12, name: ['Julat yang diingini', 'Desirable range', '理想范围'] },
  { max: 16, name: ['Had kecil', 'Minor limitation', '轻度限制'] },
  { max: 24, name: ['Had serius', 'Serious limitation', '严重限制'] },
  { max: Infinity, name: ['Had sangat serius', 'Very serious limitation', '极严重限制'] },
];
const SLOPE_DO = [     // slope in percent
  { max: 9, text: ['Tiada langkah khas; kekalkan litupan tanah.', 'No special measures; keep the ground covered.', '无特别措施；保持地面覆盖。'] },
  { max: 16, text: ['Susun pelepah mengikut kontur dan gali lubang kelodak.', 'Stack fronds along the contour and dig silt pits.', '沿等高线堆放叶柄并挖集泥坑。'] },
  { max: 40, text: ['Teres dan kekacang penutup bumi.', 'Terraces and legume cover crops.', '修梯田并种植豆科覆盖作物。'] },
  { max: Infinity, text: ['Tidak ditanam.', 'Not planted.', '不种植。'] },
];

const ORGANIC_PRESETS = [
  { g: [1.4, 0.4, 2.0], name: ['Tahi lembu', 'Cattle manure', '牛粪'] },
  { g: [0.5, 0.2, 0.5], name: ['Baja kandang reput', 'Rotted farmyard manure', '腐熟厩肥'] },
];

/* shared wording */
const EXAMPLE_ONLY = ['Jadual di bawah ialah contoh yang diterbitkan, untuk memahami bentuk sesuatu program dan berlatih mengira. Ia bukan syor untuk ladang anda. Untuk perancangan sebenar, dapatkan syor tempatan berdasarkan analisis tanah dan daun, baca analisis pada label baja, dan sesuaikan dengan keadaan pokok serta beban buah.',
  'The table below is a published example, for seeing what a programme looks like and practising the arithmetic. It is not a recommendation for your farm. For real planning, get a local recommendation based on soil and leaf analysis, read the analysis on the fertiliser label, and adjust for tree condition and crop load.',
  '下表是已发表的示例，用来了解施肥计划的形式并练习计算，并不是针对你农地的建议。实际规划时，应取得基于土壤和叶片分析的本地建议，查看肥料标签上的成分，并根据树势和挂果量调整。'];
const GRADE_HEAD = ['Gred baja seperti dicetak', 'Fertiliser grade as printed', '肥料配比（按原文）'];
const GRADE_NOTE = ['Gred ditulis seperti dalam sumber. Mengikut kelaziman label baja, nombor itu ialah peratus N, P₂O₅, K₂O dan MgO, bukan unsur P, K dan Mg. Sahkan pada label beg.',
  'Grades are written as in the source. By fertiliser-label convention the numbers are percent N, P₂O₅, K₂O and MgO, not elemental P, K and Mg. Confirm on the bag label.',
  '配比按来源原文书写。依肥料标签惯例，这些数字是 N、P₂O₅、K₂O 和 MgO 的百分比，而不是元素 P、K、Mg。请以包装标签为准。'];
const TFNET_APPLIES = ['Contoh umum; halaman tidak bertarikh dan tidak menyatakan jenis tanah atau hasil.', 'A general example; the page is undated and states no soil type or yield.', '一般性示例；该网页未注明日期，也未说明土壤类型或产量。'];

/* ---------- Unit 7 ---------- */
UNITS.push({ n: 7, chip: '#3f6e63', title: ['Kelapa sawit, pokok buah terpilih dan padi', 'Oil palm, selected fruit trees and paddy', '油棕、部分果树与水稻'],
  blurb: ['Keperluan tanah dan contoh program pembajaan. Sayur-sayuran, nanas dan getah tidak diliputi.', 'Soil needs and example feeding programmes. Vegetables, pineapple and rubber are not covered.', '土壤要求与施肥计划示例。不包括蔬菜、黄梨和橡胶。'],
  lessons: ['7-1', '7-2', '7-3', '7-4'] });

LESSONS['7-1'] = { title: ['Kelapa sawit', 'Oil palm', '油棕'], body: [
  ['p', ['Kelapa sawit tahan tanah berasid dan mengambil banyak nutrien, terutamanya kalium. Nasihat untuk tanah mineral dan untuk tanah gambut berbeza, jadi kedua-duanya diasingkan di sini.',
         'Oil palm tolerates acidic soil and takes up a lot of nutrients, potassium above all. Advice for mineral soil and for peat differs, so the two are kept apart here.',
         '油棕耐酸性土壤，并吸收大量养分，尤其是钾。矿质土和泥炭土的建议不同，因此这里分开说明。']],
  ['h', ['Tanah mineral: kesesuaian', 'Mineral soils: suitability', '矿质土：适宜性']],
  ['table', { head: [['Sifat', 'Property', '性质'], ['Julat yang diingini', 'Desirable range', '理想范围'], ['Had serius', 'Serious limitation', '严重限制']],
    rows: [
      [['Kecerunan', 'Terrain', '地形坡度'], '0 – 12°', '16 – 24°'],
      [['Kedalaman tanah berkesan', 'Effective soil depth', '有效土层深度'], '> 90 cm', '30 – 60 cm'],
      [['Tekstur', 'Texture', '质地'], ['Lom liat berpasir, lom liat atau lebih berat', 'Sandy clay loam, clay loam or heavier', '砂质黏壤土、黏壤土或更黏重'], ['Pasir berlom', 'Loamy sand', '壤质砂土']],
      [['Saliran', 'Drainage', '排水'], ['Sederhana baik hingga baik', 'Moderately well to well drained', '排水中等良好至良好'], ['Saliran lemah atau berlebihan', 'Poorly or excessively drained', '排水不良或过度排水']],
    ] }],
  ['src', { s: 'Applied Agricultural Resources (Malaysia), Soil requirements of plantation tree crops', u: 'https://aarsb.com.my/soil-management-soil-requirements-of-plantation-tree-crops',
    a: ['Menilai tanah mineral untuk kelapa sawit. Bukan untuk tanah gambut.', 'Assessing mineral soils for oil palm. Not for peat.', '评估矿质土对油棕的适宜性，不适用于泥炭土。'] }],
  ['tool', 'cerun'],
  ['h', ['Ladang sedia ada di tanah gambut', 'Existing plantations on peat', '泥炭土上的现有种植园']],
  ['p', ['Bahagian ini adalah tentang mengurus tanah gambut yang sudah ditanam, bukan tentang membuka gambut baharu. Di tanah gambut, aras air diurus supaya cukup tinggi untuk memperlahankan pemendapan dan mengurangkan risiko kebakaran, tetapi cukup rendah untuk akar.',
         'This section is about managing peat that is already planted, not about opening new peat. On peat, the water level is managed to be high enough to slow subsidence and reduce fire risk, yet low enough for roots.',
         '本节讲的是管理已经种植的泥炭土，而不是开发新的泥炭地。在泥炭土上，水位要管理得足够高，以减缓沉降并降低火灾风险，同时又要足够低，让根系正常生长。']],
  ['table', { head: [['Tempat diukur', 'Where measured', '测量位置'], ['Julat', 'Range', '范围'], ['Purata', 'Average', '平均']],
    rows: [
      [['Aras air dalam parit pengumpul, di bawah tebing', 'Water level in collection drains, below the bank', '集水沟水位（低于沟岸）'], '50 – 70 cm', '60 cm'],
      [['Aras air bawah tanah dalam telaga pemantauan', 'Groundwater level in a monitoring well', '监测井的地下水位'], '40 – 60 cm', '50 cm'],
    ] }],
  ['src', { s: 'RSPO, Manual on Best Management Practices for existing oil palm cultivation on peat', u: 'https://rspo.org/wp-content/uploads/2-water-management-the-flood-risk-assessment-template-is-attached-separately.pdf',
    a: ['Ladang kelapa sawit sedia ada di tanah gambut sahaja. Jangan gunakan sebagai sasaran saliran untuk tanah mineral.', 'Existing oil palm on peat only. Do not use as a drainage target for mineral soil.', '仅适用于泥炭土上的现有油棕园，不要用作矿质土的排水目标。'] }],
  ['p', ['Lihat pelajaran tentang tanah gambut dan tanah asid sulfat dalam Unit 3 untuk pemantauan aras air, pemendapan dan kebakaran.',
         'See the lesson on peat and acid sulfate soils in Unit 3 for water-level monitoring, subsidence and fire.',
         '关于水位监测、沉降和火灾，请参阅第 3 单元中有关泥炭土和酸性硫酸盐土的课。']],
  ['h', ['Menentukan kadar baja', 'Setting fertiliser rates', '确定施肥量']],
  ['p', ['Kadar untuk kelapa sawit ditetapkan daripada analisis daun, analisis tanah dan hasil bagi setiap blok. Tiada satu resipi yang sesuai untuk semua ladang.',
         'Rates for oil palm are set from leaf analysis, soil analysis and yield for each block. No single recipe fits every estate.',
         '油棕的施肥量是根据每个地块的叶片分析、土壤分析和产量确定的，没有适用于所有种植园的统一配方。']],
  ['case', ['Satu percubaan di Sabah pada tanah siri Sahabat (1996) mencadangkan 4.0 hingga 5.0 kg ammonium sulfat, 1.5 hingga 2.0 kg batuan fosfat dan 3.0 hingga 4.0 kg MOP sepokok setahun untuk pokok matang. Magnesium tidak disyorkan di situ kerana magnesium boleh tukar dalam tanah itu sangat tinggi, yang menunjukkan betapa kadar bergantung pada tapak.',
            'One trial in Sabah on Sahabat series soil (1996) suggested 4.0 to 5.0 kg ammonium sulphate, 1.5 to 2.0 kg rock phosphate and 3.0 to 4.0 kg MOP per palm per year for mature palms. Magnesium was not recommended there because exchangeable magnesium in that soil was very high, which shows how far rates depend on the site.',
            '沙巴在 Sahabat 土系上的一项试验（1996 年）建议成龄树每株每年施 4.0 至 5.0 公斤硫酸铵、1.5 至 2.0 公斤磷矿粉和 3.0 至 4.0 公斤氯化钾。由于该土壤的交换性镁很高，试验不建议施镁，这说明施肥量在很大程度上取决于地点。']],
  ['src', { s: 'Malaysian Palm Oil Board, Oil Palm Bulletin: Oil palm fertiliser recommendation for Sabah soils', u: 'https://opb.mpob.gov.my/oil-palm-fertiliser-recommendation-for-sabah-soils/',
    a: ['Satu siri tanah di Sabah; pokok matang.', 'One soil series in Sabah; mature palms.', '沙巴的一个土系；成龄树。'] }],
  ['h', ['Persampelan daun: pelepah ke-17', 'Leaf sampling: frond 17', '叶片取样：第 17 片叶']],
  ['steps', [
    ['Cari pelepah 1, iaitu pelepah termuda yang telah terbuka sepenuhnya.', 'Find frond 1, the youngest fully opened frond.', '找出第 1 片叶，即最年轻且已完全展开的叶。'],
    ['Pelepah tersusun dalam lapan pilin. Ikut pilin pelepah 1 ke bawah: pelepah seterusnya pada pilin yang sama ialah pelepah 9.', 'Fronds are arranged in eight spirals. Follow the spiral of frond 1 downward: the next frond on the same spiral is frond 9.', '叶片排列成八条螺旋线。沿第 1 片叶所在的螺旋线向下：同一螺旋线上的下一片是第 9 片叶。'],
    ['Pelepah di bawah pelepah 9 pada pilin itu ialah pelepah 17. Ambil sampel daripada pelepah ini.', 'The frond below frond 9 on that spiral is frond 17. Sample this frond.', '该螺旋线上第 9 片叶下方的是第 17 片叶。从这片叶取样。'],
  ]],
  ['src', { s: 'InfoSAWIT (PPKS), Understanding leaf patterns and counting fronds on oil palm', u: 'https://www.en.infosawit.com/news/16670/understanding-leaf-patterns-and-counting-fronds-on-oil-palm',
    a: ['Pokok matang. Pokok muda disampel secara berbeza; ikut protokol makmal.', 'Mature palms. Young palms are sampled differently; follow the laboratory’s protocol.', '成龄树。幼龄树的取样方式不同，请按实验室的规程进行。'] }],
  ['p', ['Mengenal pelepah 1 dengan betul memerlukan latihan di lapangan daripada orang yang berpengalaman.',
         'Recognising frond 1 correctly takes field training from someone experienced.',
         '要正确辨认第 1 片叶，需要有经验的人在田间指导。']],
  ['case', ['Dalam satu kajian, 37.5 tan tandan kosong sehektar setahun bersama baja N dan K menambah baik N dan K daun serta hasil, tetapi menurunkan magnesium daun. Tandan kosong membekalkan kalium, jadi nutriennya perlu dikira sebagai sebahagian daripada program, bukan tambahan kepadanya.',
            'In one study, 37.5 tonnes of empty fruit bunches per hectare per year with N and K fertiliser improved leaf N and K and yield, but lowered leaf magnesium. Empty fruit bunches supply potassium, so their nutrients should be counted as part of the programme, not added on top of it.',
            '在一项研究中，每公顷每年施 37.5 吨空果串并配合氮钾肥，提高了叶片氮、钾含量和产量，但降低了叶片的镁含量。空果串本身提供钾，因此其养分应计入施肥计划之内，而不是额外追加。']],
  ['src', { s: 'Journal of Oil Palm Research (MPOB), The effects of oil palm empty fruit bunches on oil palm nutrition and yield, and soil chemical properties', u: 'https://jopr.mpob.gov.my/the-effects-of-oil-palm-empty-fruit-bunches-on-oil-palm-nutrition-and-yield-and-soil-chemical-properties/',
    a: ['Satu tapak percubaan; bukan kadar sungkupan yang disyorkan.', 'One trial site; not a recommended mulch rate.', '单一试验点；并非推荐的覆盖用量。'] }],
] };

LESSONS['7-2'] = { title: ['Durian', 'Durian', '榴莲'], body: [
  ['table', { head: [['Keperluan', 'Requirement', '要求'], ['Butiran', 'Detail', '说明']],
    rows: [
      [['pH', 'pH', 'pH'], '5.5 – 6.5'],
      [['Tanah', 'Soil', '土壤'], ['Lom yang subur dan bersaliran baik', 'Fertile, well-drained loam', '肥沃且排水良好的壤土']],
      [['Risiko utama', 'Main risk', '主要风险'], ['Air bertakung, yang merosakkan akar. Elakkan tanah rendah yang rata dengan aras air tinggi.', 'Waterlogging, which damages the roots. Avoid flat lowland with a high water table.', '积水会损伤根系。避开地下水位高的平坦低地。']],
      [['Akar', 'Roots', '根系'], ['Cetek, jadi sensitif kepada kemarau dan kepada baja yang terlalu pekat', 'Shallow, so sensitive to drought and to concentrated fertiliser', '根浅，因此对干旱和过浓的肥料敏感']],
    ] }],
  ['src', { s: 'Top Fruits (Malaysia), Durian soil and climate essentials', u: 'https://topfruits.com.my/durian-soil-and-climate-essentials/',
    a: ['Panduan umum daripada perunding komersial, bukan garis panduan agensi kerajaan.', 'General guidance from a commercial consultancy, not a government agency guideline.', '商业顾问公司的一般指引，并非政府机构的指南。'] }],
  ['tool', 'ph'],
  ['h', ['Contoh program pembajaan mengikut umur', 'An example feeding programme by age', '按树龄的施肥计划示例']],
  ['note', EXAMPLE_ONLY],
  ['table', { head: [['Umur (tahun)', 'Age (years)', '树龄（年）'], ['kg sepokok setahun', 'kg per tree per year', '每株每年公斤数'], ['Pemberian setahun', 'Applications per year', '每年次数'], GRADE_HEAD],
    rows: [
      ['1', '0.6', '6', '14:13:9:2.5'],
      ['2', '1.0', '4', '15:15:15'],
      ['3', '2.0', '4', '15:15:6:4'],
      ['4', '3.6', '4', '11:16:9:2.5'],
      ['5', '4.5', '4', '12:12:17:2 + TE'],
      ['6', '6.0', '4', '12:12:17:2 + TE'],
      ['7', '7.5', '3', '13:13:20'],
      ['8', '9.0', '3', '12:6:22:3'],
      ['9', '10', '3', '15:7:18:2'],
      [['10 dan ke atas', '10 and over', '10 年及以上'], '10', '3', ['Tidak dinyatakan', 'Not stated', '未说明']],
    ] }],
  ['src', { s: 'International Tropical Fruits Network (TFNet), Durian: agronomy, fertiliser', u: 'http://www.itfnet.org/gfruit/Templates%20English/durian.agro.fert.htm', a: TFNET_APPLIES }],
  ['p', GRADE_NOTE],
  ['h', ['Apa yang ditunjukkan oleh contoh itu', 'What the example shows', '这个示例说明了什么']],
  ['ul', [
    ['Peringkat awal menekankan nitrogen dan fosforus; pokok yang berbuah beralih kepada gred yang tinggi kalium.', 'The early years emphasise nitrogen and phosphorus; bearing trees move to high-potassium grades.', '幼龄期侧重氮和磷；结果树转用高钾配比。'],
    ['Baja ditabur di sekeliling kanopi, sedikit melepasi jejarinya. Di tanah curam, baja dimasukkan ke dalam lubang di sekeliling kanopi dan ditimbus.', 'Fertiliser is broadcast around the canopy, slightly beyond its radius. On steep land, it goes into holes around the canopy and is covered.', '肥料撒施在树冠周围，略超出树冠半径。在陡坡地，则放入树冠周围的穴中并覆土。'],
    ['Sumber itu juga menyenaraikan 15 hingga 30 kg tahi lembu sepokok setahun. Gunakan hanya baja kandang yang telah dikompos sepenuhnya, dan kira nutriennya sebagai sebahagian daripada program, bukan sebagai tambahan kepada program baja mineral yang penuh.',
     'The source also lists 15 to 30 kg of cow dung per tree per year. Use only fully composted manure, and count its nutrients as part of the programme, not on top of a full mineral fertiliser programme.',
     '该来源还列出每株每年 15 至 30 公斤牛粪。只可使用充分腐熟的粪肥，并把其养分计入施肥计划之内，而不是在完整的化肥计划之外额外追加。'],
  ]],
  ['tool', 'baja'],
] };

LESSONS['7-3'] = { title: ['Rambutan dan mangga', 'Rambutan and mango', '红毛丹与芒果'], body: [
  ['h', ['Rambutan', 'Rambutan', '红毛丹']],
  ['p', ['Rambutan paling sesuai di tanah lom yang dalam dan bersaliran baik, di kawasan rata hingga beralun.',
         'Rambutan does best in deep, well-drained loam on flat to undulating land.',
         '红毛丹最适合种在平坦至缓起伏地带的深厚、排水良好的壤土上。']],
  ['src', { s: 'Department of Agriculture Sarawak, Rambutan', u: 'https://doa.sarawak.gov.my/web/subpage/webpage_view/137', a: ['Sarawak; panduan umum.', 'Sarawak; general guidance.', '砂拉越；一般指引。'] }],
  ['note', EXAMPLE_ONLY],
  ['table', { head: [['Umur (tahun)', 'Age (years)', '树龄（年）'], GRADE_HEAD, ['kg sepokok setahun', 'kg per tree per year', '每株每年公斤数'], ['Pemberian setahun', 'Applications per year', '每年次数']],
    rows: [
      ['1', 'NPK 15:15:15', '0.5', '3'],
      ['2', 'NPK 15:15:15', '1.0', '3'],
      ['3', 'NPKMg 12:12:17:2', '1.5', '3'],
      ['4', 'NPKMg 12:12:17:2', '2.0', '3'],
      ['5', 'NPKMg 12:12:17:2', '2.5', '3'],
      ['6', 'NPKMg 12:12:17:2', '3.0', '4'],
      ['7', 'NPKMg 12:12:17:2', '4.0', '4'],
      ['8 – 10', 'NPKMg 12:12:17:2', '5.0', '4'],
      ['11 – 15', 'NPKMg 12:12:17:2', '6.0', '4'],
      ['16+', 'NPKMg 12:12:17:2', '7.0', '4'],
    ] }],
  ['src', { s: 'International Tropical Fruits Network (TFNet), Rambutan: agronomy, fertiliser', u: 'http://www.itfnet.org/gfruit/Templates%20English/rambutan.agro.fert.htm', a: TFNET_APPLIES }],
  ['p', GRADE_NOTE],
  ['ul', [
    ['Rambutan sensitif kepada ketoksikan klorida, jadi sumber itu menyarankan NPK tanpa klorida. Ini bermakna kalium daripada kalium sulfat (SOP), bukan MOP.', 'Rambutan is sensitive to chloride toxicity, so the source advises chloride-free NPK. That means potassium from sulphate of potash (SOP), not MOP.', '红毛丹对氯毒害敏感，因此该来源建议使用不含氯的 NPK，即钾来自硫酸钾（SOP），而不是氯化钾（MOP）。'],
    ['Masa penting dalam contoh itu: sebelum berbunga, semasa berbunga dan pembentukan buah, beberapa minggu selepas buah terbentuk, dan selepas menuai.', 'Key times in the example: before flowering, during flowering and fruit set, a few weeks after fruit set, and after harvest.', '示例中的关键时期：开花前、开花和坐果期、坐果后数周，以及采收后。'],
    ['Baja ditabur 60 cm dari batang, atau dalam jalur lebar di bawah pinggir kanopi.', 'Fertiliser is broadcast 60 cm from the trunk, or in a wide band below the canopy edge.', '肥料撒施在距树干 60 厘米处，或在树冠边缘下方作宽带状施用。'],
    ['Tanah berasid dikapur sebelum menanam, pada kadar yang ditentukan oleh ujian tanah.', 'Acidic soil is limed before planting, at a rate set by a soil test.', '酸性土壤在种植前施石灰，用量由土壤检测确定。'],
  ]],
  ['h', ['Mangga', 'Mango', '芒果']],
  ['p', ['Mangga agak tahan kemarau dan tanah kurang subur, tetapi saliran yang baik perlu untuk hasil yang memuaskan.',
         'Mango is fairly tolerant of drought and poor soil, but good drainage is needed for a satisfactory crop.',
         '芒果相当耐旱、耐瘠，但要有理想的产量，必须排水良好。']],
  ['ul', [
    ['Selepas memindah, jangan baja sehingga pucuk baharu pertama kelihatan.', 'After transplanting, do not fertilise until the first new flush appears.', '移栽后，在第一次新梢长出之前不要施肥。'],
    ['Pokok muda sangat sensitif kepada baja berlebihan.', 'Young trees are especially sensitive to over-fertilising.', '幼树对施肥过量特别敏感。'],
    ['Elakkan membaja sejurus sebelum berbunga.', 'Avoid fertilising just before flowering.', '避免在开花前不久施肥。'],
    ['Nitrogen berlebihan semasa berbuah menjejaskan kualiti buah: isi lembik, buah kekal hijau dan masak tidak sekata.', 'Too much nitrogen during fruiting harms fruit quality: soft flesh, fruit staying green and uneven ripening.', '结果期氮过多会影响果实品质：果肉变软、果皮不转色、成熟不均。'],
    ['Mikronutrien diberi sebagai semburan daun hanya apabila kekurangan berlaku.', 'Give micronutrients as a foliar spray only when a deficiency appears.', '只有出现缺素时，才以叶面喷施方式补充微量元素。'],
    ['Tanah berpasir selalunya memerlukan pemberian yang lebih kecil dan lebih kerap; tentukan jumlah keperluan daripada keperluan tanaman dan analisis tanah serta daun.', 'Sandy soils often need smaller, more frequent applications; determine the total requirement from crop demand and soil and leaf analysis.', '砂质土往往需要少量多次施用；总需要量应根据作物需求以及土壤和叶片分析来确定。'],
  ]],
  ['src', { s: 'International Tropical Fruits Network (TFNet), Mango: agronomy, fertiliser', u: 'http://www.itfnet.org/gfruit/Templates%20English/mango.agro.fert.htm', a: TFNET_APPLIES }],
] };

LESSONS['7-4'] = { title: ['Padi', 'Paddy', '水稻'], body: [
  ['p', ['Tanah sawah berkelakuan berbeza daripada tanah tanah tinggi kerana ia ditenggelami air. Nasihat “tanah bersaliran baik” untuk tanaman lain tidak boleh dipindahkan terus ke sawah.',
         'Paddy soil behaves differently from upland soil because it is flooded. The “well-drained soil” advice for other crops cannot simply be carried over to the rice field.',
         '稻田土壤因为被水淹没，表现与旱地土壤不同。适用于其他作物的“排水良好”的建议不能直接套用到稻田。']],
  ['h', ['Apa yang berubah apabila tanah ditenggelami', 'What changes when soil is flooded', '土壤淹水后发生什么变化']],
  ['table', { head: [['Perubahan', 'Change', '变化'], ['Kesan pada padi', 'Effect on rice', '对水稻的影响']],
    rows: [
      [['Oksigen dalam tanah habis', 'Oxygen in the soil runs out', '土壤中的氧气耗尽'], ['Besi dan mangan berubah kepada bentuk yang larut', 'Iron and manganese change to soluble forms', '铁和锰转变为可溶形态']],
      [['pH tanah berasid naik', 'The pH of acidic soil rises', '酸性土壤的 pH 上升'], ['Dalam satu kajian, pH naik dari 4.2 kepada 5.5 hingga 6.0 selepas ditenggelami', 'In one study, pH rose from 4.2 to between 5.5 and 6.0 after flooding', '在一项研究中，淹水后 pH 从 4.2 升至 5.5 至 6.0']],
      [['Fosforus lebih tersedia', 'Phosphorus becomes more available', '磷的有效性提高'], ['Padi sawah selalunya kurang bertindak balas terhadap fosfat berbanding tanaman tanah tinggi', 'Flooded rice often responds less to phosphate than upland crops', '淹水稻对磷肥的反应往往小于旱地作物']],
      [['Nitrat tidak stabil', 'Nitrate is unstable', '硝态氮不稳定'], ['Nitrat hilang ke udara melalui denitrifikasi', 'Nitrate is lost to the air by denitrification', '硝态氮通过反硝化作用散失到空气中']],
    ] }],
  ['src', { s: 'Plant and Soil, Phosphorus nutrition of rice in relation to flooding', u: 'https://link.springer.com/article/10.1023/A:1026452029146',
    a: ['Angka pH daripada tanah di Kemboja; arah perubahan adalah umum, magnitudnya bergantung pada tanah.', 'The pH figures are from soils in Cambodia; the direction of change is general, the size depends on the soil.', 'pH 数字来自柬埔寨的土壤；变化方向具有普遍性，幅度则因土壤而异。'] }],
  ['h', ['Akibatnya untuk pembajaan', 'What this means for fertilising', '对施肥的意义']],
  ['ul', [
    ['Gunakan nitrogen dalam bentuk ammonium atau urea, bukan nitrat.', 'Use nitrogen as ammonium or urea, not nitrate.', '使用铵态氮或尿素，不要用硝态氮。'],
    ['Nitrogen dalam air sawah boleh hilang sebagai gas ammonia, terutamanya apabila pH air naik pada waktu siang. Bahagikan nitrogen kepada beberapa kali pemberian mengikut peringkat pertumbuhan.', 'Nitrogen in the floodwater can be lost as ammonia gas, especially when the water’s pH rises during the day. Split nitrogen into several applications by growth stage.', '田面水中的氮可能以氨气形式损失，尤其是白天水的 pH 升高时。应按生育期把氮肥分几次施用。'],
    ['Mengeringkan dan menenggelamkan sawah berulang kali mengubah keadaan tanah, jadi pengurusan air dan pembajaan perlu dirancang bersama.', 'Repeated drying and reflooding changes the soil conditions, so water management and fertilising have to be planned together.', '反复落干和复水会改变土壤状况，因此水分管理和施肥必须一并规划。'],
  ]],
  ['src', { s: 'JIRCAS / IRRI, Japan Agricultural Research Quarterly 40(4)', u: 'https://www.jircas.go.jp/sites/default/files/publication/jarq/40-04-09_0.pdf', a: ['Prinsip umum tanah sawah.', 'General principles of flooded rice soils.', '淹水稻田土壤的一般原理。'] }],
  ['h', ['Di Malaysia', 'In Malaysia', '在马来西亚']],
  ['ul', [
    ['Kebanyakan sawah berada di tanah aluvium. Sesetengah kawasan jelapang mempunyai tanah asid sulfat, yang memerlukan pengurusan air yang teliti.', 'Most rice fields are on alluvial soils. Some granary areas have acid sulfate soils, which need careful water management.', '大多数稻田位于冲积土上。部分粮仓区有酸性硫酸盐土，需要谨慎的水分管理。'],
    ['Kadar baja, masa dan pengurusan air untuk padi ditetapkan mengikut kawasan dan musim. Ikut panduan semakan tanaman padi dan nasihat pejabat pertanian kawasan anda.', 'Fertiliser rates, timing and water management for rice are set by area and season. Follow the rice crop-check guidance and the advice of your area’s agriculture office.', '水稻的施肥量、时间和水分管理按地区和季节确定。请遵循水稻作物检查指引和所在地区农业办事处的建议。'],
  ]],
  ['case', ['Di kawasan jelapang MADA di Kedah dan Perlis, hasil padi pada tanah asid sulfat meningkat dengan ketara selepas 2.5 tan batu kapur magnesium terkisar sehektar ditabur.',
            'In the MADA granary area of Kedah and Perlis, rice yield on acid sulfate soil improved significantly after 2.5 tonnes of ground magnesium limestone per hectare were applied.',
            '在吉打和玻璃市的 MADA 粮仓区，酸性硫酸盐土上施用每公顷 2.5 吨磨细镁质石灰石后，水稻产量显著提高。']],
  ['src', { s: 'Universiti Putra Malaysia, research on liming acid and acid sulfate soils (lihat Sumber / see Sources)', u: '', a: ['Tanah asid sulfat di kawasan MADA; bukan kadar umum.', 'Acid sulfate soils in the MADA area; not a general rate.', 'MADA 地区的酸性硫酸盐土；并非通用用量。'] }],
] };

ACTIVITIES[7] = { title: ['Sediakan pelan baja untuk satu blok pokok', 'Prepare a fertiliser plan for one block of trees', '为一个地块的果树准备施肥计划'],
  need: ['Buku nota; laporan analisis tanah atau daun jika ada; label baja', 'A notebook; a soil or leaf analysis report if you have one; the fertiliser label', '笔记本；土壤或叶片分析报告（如有）；肥料标签'],
  steps: [
    ['Kira bilangan pokok dalam blok, catat umurnya, keadaan pokok dan beban buah.', 'Count the trees in the block and note their age, condition and crop load.', '数清地块内的树，记下树龄、树势和挂果量。'],
    ['Dapatkan syor untuk blok itu daripada pejabat pertanian atau perunding, berdasarkan analisis tanah dan daun. Untuk latihan dalam kelas sahaja, gunakan jadual contoh dalam unit ini.', 'Get a recommendation for the block from the agriculture office or an adviser, based on soil and leaf analysis. For classroom practice only, use the example tables in this unit.', '向农业办事处或顾问取得基于土壤和叶片分析的地块建议。仅作课堂练习时，才使用本单元的示例表。'],
    ['Baca analisis pada label baja dan sahkan ia sepadan dengan syor.', 'Read the analysis on the fertiliser label and confirm it matches the recommendation.', '查看肥料标签上的成分，确认与建议相符。'],
    ['Gunakan mod “Program pokok” untuk mendapatkan kuantiti setiap pemberian dan jumlah beg setahun.', 'Use the “Tree programme” mode to get the amount per application and the bags needed for the year.', '用“果树施肥计划”模式算出每次的用量和全年所需包数。'],
    ['Tulis kalendar mengikut hujan tempatan dan peringkat pokok, dan rekod setiap pemberian dalam Rekod.', 'Write a calendar that follows local rainfall and the tree’s stage, and log each application in Records.', '按当地降雨和树的生育期写出日历，并在“记录”中登记每次施肥。'],
  ] };

QUIZ[7] = [
  Q(['Pelepah yang manakah diambil untuk analisis daun kelapa sawit matang?', 'Which frond is sampled for leaf analysis of mature oil palm?', '成龄油棕的叶片分析取哪一片叶？'],
    [['Pelepah ke-17', 'Frond 17', '第 17 片叶'], ['Pelepah ke-1', 'Frond 1', '第 1 片叶'], ['Pelepah paling tua', 'The oldest frond', '最老的叶'], ['Mana-mana pelepah', 'Any frond', '任何一片叶']],
    ['Pelepah 17 ditemui dengan mengikut pilin dari pelepah 1 ke 9 ke 17.', 'Frond 17 is found by following the spiral from frond 1 to 9 to 17.', '沿螺旋线从第 1 片叶到第 9 片再到第 17 片即可找到。']),
  Q(['Mengapa julat aras air untuk gambut tidak boleh digunakan pada tanah mineral?', 'Why can the water-level range for peat not be used on mineral soil?', '为什么泥炭土的水位范围不能用于矿质土？'],
    [['Ia ditetapkan untuk memperlahankan pemendapan gambut dan mengurangkan risiko kebakaran', 'It is set to slow peat subsidence and reduce fire risk', '它是为减缓泥炭沉降和降低火灾风险而定的'], ['Tanah mineral tidak mempunyai air', 'Mineral soil holds no water', '矿质土不含水'], ['Gambut tidak perlu disaliri', 'Peat needs no drainage', '泥炭土不需要排水'], ['Julat itu hanya untuk padi', 'The range is only for rice', '该范围只适用于水稻']],
    ['Gambut memendap dan mudah terbakar apabila terlalu kering; tanah mineral tidak berkelakuan begitu.', 'Peat subsides and burns when it is too dry; mineral soil does not behave that way.', '泥炭过干时会沉降并容易起火，矿质土则不会如此。']),
  Q(['Apakah risiko tanah yang utama bagi durian?', 'What is the main soil risk for durian?', '榴莲最主要的土壤风险是什么？'],
    [['Air bertakung', 'Waterlogging', '积水'], ['Tanah terlalu dalam', 'Soil that is too deep', '土层太深'], ['pH 6', 'A pH of 6', 'pH 为 6'], ['Terlalu banyak bahan organik', 'Too much organic matter', '有机质太多']],
    ['Akar durian cetek dan mudah rosak dalam tanah yang tepu air.', 'Durian roots are shallow and easily damaged in waterlogged soil.', '榴莲根浅，在积水的土壤中容易受损。']),
  Q(['Rambutan sensitif kepada klorida. Sumber kalium yang manakah sesuai?', 'Rambutan is sensitive to chloride. Which potassium source suits it?', '红毛丹对氯敏感，哪一种钾肥适合？'],
    [['Kalium sulfat (SOP)', 'Sulphate of potash (SOP)', '硫酸钾（SOP）'], ['Muriate of potash (MOP)', 'Muriate of potash (MOP)', '氯化钾（MOP）'], ['Urea', 'Urea', '尿素'], ['Batuan fosfat', 'Rock phosphate', '磷矿粉']],
    ['MOP ialah kalium klorida dan tinggi klorida; SOP tidak mengandungi klorida.', 'MOP is potassium chloride and is high in chloride; SOP contains none.', 'MOP 是氯化钾，含氯量高；SOP 不含氯。']),
  Q(['Mengapa baja nitrat tidak sesuai untuk sawah yang ditenggelami?', 'Why is nitrate fertiliser unsuitable for a flooded rice field?', '为什么硝态氮肥不适合淹水的稻田？'],
    [['Nitrat hilang ke udara melalui denitrifikasi', 'Nitrate is lost to the air by denitrification', '硝态氮通过反硝化作用散失到空气中'], ['Nitrat menaikkan pH kepada 9', 'Nitrate raises the pH to 9', '硝态氮把 pH 提高到 9'], ['Padi tidak memerlukan nitrogen', 'Rice needs no nitrogen', '水稻不需要氮'], ['Nitrat tidak larut dalam air', 'Nitrate does not dissolve in water', '硝态氮不溶于水']],
    ['Tanpa oksigen, mikrob menukar nitrat kepada gas nitrogen.', 'Without oxygen, microbes turn nitrate into nitrogen gas.', '在缺氧条件下，微生物把硝态氮转化为氮气。']),
  Q(['Untuk merancang baja bagi satu blok pokok buah, apakah yang patut menjadi asas kadar?', 'When planning fertiliser for a block of fruit trees, what should the rate be based on?', '为一个果树地块规划施肥时，用量应以什么为依据？'],
    [['Syor tempatan daripada analisis tanah dan daun, disesuaikan dengan keadaan pokok dan beban buah', 'A local recommendation from soil and leaf analysis, adjusted for tree condition and crop load', '基于土壤和叶片分析的本地建议，并按树势和挂果量调整'], ['Jadual contoh dalam buku tanpa diubah', 'An example table from a book, unchanged', '书上的示例表，原样照搬'], ['Kadar yang digunakan jiran', 'The rate a neighbour uses', '邻居所用的用量'], ['Kadar tertinggi yang mampu dibeli', 'The highest rate you can afford', '买得起的最高用量']],
    ['Jadual yang diterbitkan ialah contoh; tanah, umur dan hasil setiap blok berbeza.', 'Published tables are examples; every block differs in soil, age and yield.', '已发表的表格只是示例；每个地块的土壤、树龄和产量都不同。']),
];

/* ---------- Additions to existing lessons ---------- */
LESSONS['3-1'].body.push(
  ['h', ['Mengukur cerun', 'Measuring slope', '测量坡度']],
  ['steps', [
    ['Pacak satu pancang di bahagian atas cerun dan ikat tali padanya pada aras tanah.', 'Drive a stake in at the top of the slope and tie a string to it at ground level.', '在坡的上方打一根桩，把绳子系在桩的地面高度处。'],
    ['Tarik tali ke bawah cerun dan pegang supaya mendatar, menggunakan timbang air tali.', 'Pull the string downhill and hold it level, using a line level.', '把绳子拉向坡下，并用线水平仪使其保持水平。'],
    ['Ukur panjang tali yang mendatar itu. Inilah jarak mendatar.', 'Measure the length of the level string. This is the run.', '量出水平绳子的长度，这就是水平距离。'],
    ['Di hujung bawah, ukur ketinggian dari tali ke tanah. Inilah beza tinggi.', 'At the downhill end, measure the height from the string to the ground. This is the rise.', '在下坡一端，量出绳子到地面的高度，这就是垂直高差。'],
  ]],
  ['formula', ['Cerun (%) = beza tinggi ÷ jarak mendatar × 100', 'Slope (%) = rise ÷ run × 100', '坡度（%）= 垂直高差 ÷ 水平距离 × 100']],
  ['p', ['Contoh: beza tinggi 1.5 m pada jarak mendatar 10 m ialah cerun 15%. Catat juga panjang cerun dan ke mana air larian mengalir, kerana kedua-duanya mempengaruhi hakisan.', 'Example: a rise of 1.5 m over a run of 10 m is a 15% slope. Note the slope length and where runoff flows as well, because both affect erosion.', '例如：水平距离 10 米、高差 1.5 米，坡度即为 15%。同时记下坡长和径流的去向，因为两者都影响侵蚀。']],
  ['tool', 'cerun'],
);

LESSONS['6-2'].body.push(
  ['h', ['Memilih sumber kalium', 'Choosing a potassium source', '选择钾肥']],
  ['p', ['MOP ialah sumber kalium yang biasa, tetapi ia tinggi klorida. Untuk tanaman yang sensitif kepada klorida seperti rambutan, kalium sulfat (SOP) digunakan.',
         'MOP is the usual potassium source, but it is high in chloride. For chloride-sensitive crops such as rambutan, sulphate of potash (SOP) is used instead.',
         'MOP 是常用的钾肥，但含氯量高。对红毛丹等对氯敏感的作物，应改用硫酸钾（SOP）。']],
  ['h', ['Kandungan nutrien baja organik', 'Nutrients in organic manures', '有机肥的养分含量']],
  ['table', { head: [['Bahan', 'Material', '材料'], 'N', 'P₂O₅', 'K₂O'],
    rows: [
      [['Tahi lembu', 'Cattle manure', '牛粪'], '1.4', '0.4', '2.0'],
      [['Baja kandang yang reput sepenuhnya', 'Well-rotted farmyard manure', '充分腐熟的厩肥'], '0.5', '0.2', '0.5'],
    ] }],
  ['src', { s: 'FAO, Fertilizer use by crop in Ghana: organic sources of nutrients', u: 'https://www.fao.org/4/a0013e/a0013e08.htm',
    a: ['Nilai lazim dari Ghana, mengikut berat. Kandungan sebenar sangat berbeza; analisis bahan anda sendiri.', 'Typical values from Ghana, by weight. Actual content varies widely; have your own material analysed.', '来自加纳的常见数值，按重量计。实际含量差别很大，应对自己的材料进行分析。'] }],
  ['ul', [
    ['Nilai ini ialah jumlah nutrien. Hanya sebahagian yang tersedia kepada tanaman pada musim pertama; selebihnya dibebaskan perlahan-lahan.', 'These are total nutrients. Only part is available to the crop in the first season; the rest is released slowly.', '这些是养分总量。第一季只有一部分可被作物利用，其余缓慢释放。'],
    ['Kira nutrien daripada baja kandang, kompos dan tandan kosong sebagai sebahagian daripada program, kemudian kurangkan baja mineral sewajarnya.', 'Count the nutrients from manure, compost and empty fruit bunches as part of the programme, then reduce the mineral fertiliser to match.', '把厩肥、堆肥和空果串提供的养分计入施肥计划，再相应减少化肥用量。'],
    ['Program yang lengkap juga meliputi magnesium, sulfur dan mikronutrien, bukan N, P dan K sahaja.', 'A complete programme also covers magnesium, sulphur and micronutrients, not only N, P and K.', '完整的施肥计划还应包括镁、硫和微量元素，而不仅是氮磷钾。'],
  ]],
);

LESSONS['6-3'].body.push(
  ['h', ['Mengelakkan kehilangan nitrogen', 'Keeping nitrogen from escaping', '防止氮素损失']],
  ['ul', [
    ['Urea yang dibiarkan di permukaan kehilangan nitrogen ke udara sebagai gas ammonia. Semakin lama tanpa hujan, semakin banyak yang hilang.', 'Urea left on the surface loses nitrogen to the air as ammonia gas. The longer it sits without rain, the more is lost.', '留在地表的尿素会以氨气形式向空气损失氮。无雨的时间越长，损失越多。'],
    ['Hujan yang meresap atau pengairan sejurus selepas membaja membawa urea masuk ke dalam tanah. Hujan renyai boleh memburukkan keadaan kerana ia melarutkan urea tanpa membawanya masuk.', 'A soaking rain or irrigation soon after application carries urea into the soil. A light shower can make things worse, because it dissolves the urea without washing it in.', '施肥后不久的透雨或灌溉能把尿素带入土中。小雨反而可能更糟，因为它溶解了尿素却没有把它冲入土中。'],
    ['Gaulkan atau timbus urea, atau letak dalam jalur dan bukan ditabur rata.', 'Mix or cover the urea with soil, or place it in a band instead of broadcasting.', '把尿素混入土中或覆土，或者条施而不是撒施。'],
    ['Kehilangan lebih tinggi pada tanah berpasir, pada pH yang tinggi dan dalam cuaca panas serta berangin. Oleh itu, jangan tabur urea bersama kapur.', 'Losses are higher on sandy soil, at high pH and in warm, windy weather. For that reason, do not apply urea together with lime.', '在砂质土、pH 高以及炎热多风的天气下损失更大。因此，不要把尿素和石灰一起施用。'],
  ]],
  ['src', { s: 'Purdue University Extension; Government of Manitoba; Montana State University Extension (lihat Sumber / see Sources)', u: '',
    a: ['Prinsip umum daripada kajian iklim sederhana; jumlah kehilangan di kawasan tropika mungkin berbeza.', 'General principles from temperate studies; the size of losses in the tropics may differ.', '来自温带研究的一般原理；热带地区的损失量可能不同。'] }],
);

SOURCES.push({ topic: ['Kelapa sawit, pokok buah, padi dan kapur', 'Oil palm, fruit trees, paddy and lime', '油棕、果树、水稻与石灰'], items: [
  ['Applied Agricultural Resources (Malaysia) – Soil requirements of plantation tree crops', 'https://aarsb.com.my/soil-management-soil-requirements-of-plantation-tree-crops'],
  ['RSPO – Manual on Best Management Practices for existing oil palm cultivation on peat: water management', 'https://rspo.org/wp-content/uploads/2-water-management-the-flood-risk-assessment-template-is-attached-separately.pdf'],
  ['RSPO – Best Management Practices on peat: fire prevention', 'https://rspo.org/wp-content/uploads/6-fire-prevention.pdf'],
  ['Journal of Oil Palm Research (MPOB) – Ground water-table maintenance in relation to peat subsidence, Sessang, Sarawak', 'https://jopr.mpob.gov.my/best-management-practices-for-oil-palm-cultivation-on-peat-ground-water-table-maintenance-in-relation-to-peat-subsidence-and-estimation-of-co2-emissions-at-sessang-sarawak/'],
  ['Malaysian Palm Oil Board, Oil Palm Bulletin – Oil palm fertiliser recommendation for Sabah soils', 'https://opb.mpob.gov.my/oil-palm-fertiliser-recommendation-for-sabah-soils/'],
  ['InfoSAWIT (PPKS) – Understanding leaf patterns and counting fronds on oil palm', 'https://www.en.infosawit.com/news/16670/understanding-leaf-patterns-and-counting-fronds-on-oil-palm'],
  ['Journal of Oil Palm Research (MPOB) – Effects of oil palm empty fruit bunches on nutrition, yield and soil', 'https://jopr.mpob.gov.my/the-effects-of-oil-palm-empty-fruit-bunches-on-oil-palm-nutrition-and-yield-and-soil-chemical-properties/'],
  ['International Tropical Fruits Network (TFNet) – Durian: fertiliser', 'http://www.itfnet.org/gfruit/Templates%20English/durian.agro.fert.htm'],
  ['International Tropical Fruits Network (TFNet) – Rambutan: fertiliser', 'http://www.itfnet.org/gfruit/Templates%20English/rambutan.agro.fert.htm'],
  ['International Tropical Fruits Network (TFNet) – Mango: fertiliser', 'http://www.itfnet.org/gfruit/Templates%20English/mango.agro.fert.htm'],
  ['Department of Agriculture Sarawak – Rambutan', 'https://doa.sarawak.gov.my/web/subpage/webpage_view/137'],
  ['Top Fruits (Malaysia) – Durian soil and climate essentials', 'https://topfruits.com.my/durian-soil-and-climate-essentials/'],
  ['Plant and Soil – Phosphorus nutrition of rice in relation to flooding', 'https://link.springer.com/article/10.1023/A:1026452029146'],
  ['JIRCAS / IRRI – Japan Agricultural Research Quarterly 40(4), rice soil nutrient study', 'https://www.jircas.go.jp/sites/default/files/publication/jarq/40-04-09_0.pdf'],
  ['Universiti Putra Malaysia – research on liming acid and acid sulfate soils (CORE repository)', 'https://core.ac.uk/download/153827785.pdf'],
  ['Universiti Putra Malaysia – research on liming acid soils for annual crops (CORE repository)', 'https://core.ac.uk/download/18446285.pdf'],
  ['Government of South Australia – Soil acidity and liming notes (lime requirement formula)', 'https://cdn.environment.sa.gov.au/landscape/docs/hf/soil-lime-notepad.pdf'],
  ['Purdue University Extension – Improving the efficient use of urea-containing fertilizers', 'https://www.ag.purdue.edu/agry/agry-extension/_docs/soil-fertility/improving-the-efficient-use-of-urea-containing-fertilizers.pdf'],
  ['Government of Manitoba – Volatilization losses from surface applied nitrogen', 'https://gov.mb.ca/agriculture/crops/soil-fertility/volatilization-losses-from-surface-applied-nitrogen.html'],
  ['Montana State University Extension – Reduce loss of ammonia gas from urea fertilizer', 'https://www.montana.edu/extension/roosevelt/ammoniagas.html'],
  ['FAO – Fertilizer use by crop in Ghana: organic sources of nutrients', 'https://www.fao.org/4/a0013e/a0013e08.htm'],
] });

/* ---------- leaf sampling, and corrections from Malaysian sources ---------- */
LESSONS['7-1'].body.push(
  ['h', ['Mengambil sampel daun', 'Taking the leaf sample', '采集叶片样本']],
  ['steps', [
    ['Gunakan pelepah 17 untuk pokok berumur 3 tahun atau lebih selepas ditanam, dan pelepah 9 untuk pokok yang lebih muda.', 'Use frond 17 for palms 3 years or more after planting, and frond 9 for younger palms.', '定植 3 年或以上的树采第 17 片叶，较年幼的树采第 9 片叶。'],
    ['Cari tempat rabung di atas rakis berubah daripada rata kepada tirus. Di situ, ambil 6 anak daun dari setiap belah: 3 dari barisan atas dan 3 dari barisan bawah.', 'Find the point where the ridge on top of the rachis changes from flat to pointed. There, take 6 leaflets from each side: 3 from the upper rank and 3 from the lower.', '找到叶轴上面的脊由平变尖的位置。在该处两侧各取 6 片小叶：上排 3 片、下排 3 片。'],
    ['Simpan sepertiga tengah setiap anak daun sahaja, dan buang lidinya.', 'Keep only the middle third of each leaflet, and discard the midrib.', '每片小叶只保留中间三分之一，并去掉中脉。'],
    ['Di tanah rata, sampel setiap pokok ke-10 dalam setiap baris ke-10: sekurang-kurangnya 1% pokok. Untuk memeriksa satu tompok bermasalah, gabungkan 20 hingga 30 pokok, dan sampel pokok yang sihat secara berasingan.', 'On flat land, sample every 10th palm in every 10th row: at least 1% of the palms. To check a problem patch, bulk 20 to 30 palms, and sample healthy palms separately.', '在平地上，每隔 10 行取第 10 株：至少占全部植株的 1%。检查问题地块时，合并 20 至 30 株，健康植株另行取样。'],
    ['Tandakan pokok itu dan gunakan pokok yang sama setiap tahun. Pilih pokok yang sihat, sekurang-kurangnya empat pokok dari tepi jalan.', 'Mark those palms and use the same ones every year. Choose healthy palms at least four palms in from the roadside.', '给这些植株做标记，每年采同一批。选择离路边至少四株以内的健康植株。'],
    ['Ambil sampel pada waktu pagi, sekali setahun pada masa yang sama, sekurang-kurangnya tiga bulan selepas membaja, dan bukan pada hari hujan atau musim yang sangat basah atau sangat kering.', 'Sample in the morning, once a year at the same time of year, at least three months after fertilising, and not on a rainy day or in a very wet or very dry spell.', '在上午取样，每年同一时间取一次，至少在施肥三个月之后，并避开雨天以及特别湿或特别干的时期。'],
    ['Hantar ke makmal dengan segera dalam beg berlabel; ladang mengeringkan sampel dalam masa 24 jam.', 'Get it to the laboratory quickly in labelled bags; estates dry the samples within 24 hours.', '装入贴好标签的袋子尽快送到实验室；种植园会在 24 小时内把样本烘干。'],
  ]],
  ['note', ['Daun yang lebih muda daripada pelepah rujukan memberi bacaan N, P, K dan Mg yang lebih tinggi, dan daun yang lebih tua memberi bacaan yang lebih rendah. Tersilap pelepah boleh menyembunyikan atau mereka-reka kekurangan.',
            'A leaf younger than the reference frond reads higher in N, P, K and Mg, and an older one reads lower. Taking the wrong frond can hide a deficiency or invent one.',
            '比标准叶年幼的叶片，氮、磷、钾、镁读数偏高；较老的叶片读数偏低。采错叶片会掩盖缺素，或造成缺素的假象。']],
  ['src', { s: 'Fairhurst (2015), Minimization of error in leaf analysis sampling and analysis, Tropical Crop Consultants Extension Bulletin TCCL-001', u: 'http://www.tropcropconsult.com/wp-content/uploads/2017/04/Fairhurst2015.pdf',
    a: ['Amalan ladang kelapa sawit. Waktu pagi dan tempoh tiga bulan selepas membaja datang daripada panduan makmal dan pekebun kecil, bukan daripada MPOB.', 'Oil palm estate practice. The morning timing and the three months after fertilising come from laboratory and smallholder guides, not from MPOB.', '油棕种植园的做法。上午取样和施肥后三个月的说法来自实验室和小园主指南，而非 MPOB。'] }],
  ['h', ['Membaca keputusan daun', 'Reading leaf results', '解读叶片分析结果']],
  ['table', { head: [['Nutrien, pelepah 17', 'Nutrient, frond 17', '养分，第 17 片叶'], ['Kekurangan', 'Deficient', '缺乏'], ['Optimum, pokok muda (bawah 6 tahun)', 'Optimum, young palms (under 6 years)', '适宜，幼树（6 年以下）'], ['Optimum, pokok matang', 'Optimum, mature palms', '适宜，成龄树']],
    rows: [
      ['N (%)', '<2.30–2.50', '2.60–2.90', '2.40–2.80'],
      ['P (%)', '<0.14–0.15', '0.16–0.19', '0.15–0.18'],
      ['K (%)', '<0.75–1.00', '1.10–1.30', '0.90–1.20'],
      ['Mg (%)', '<0.20', '0.30–0.45', '0.25–0.40'],
      ['Ca (%)', '<0.25–0.30', '0.50–0.70', '0.50–0.75'],
      ['B (mg/kg)', '<8', '15–25', '15–25'],
      ['Cu (mg/kg)', '<3', '5–7', '5–8'],
      ['Zn (mg/kg)', '<10', '15–20', '12–18'],
    ] }],
  ['ul', [
    ['Gunakan julat, bukan satu nilai. Paras kritikal berubah mengikut umur pokok, kelembapan tanah, bahan tanaman dan jarak tanaman.', 'Use ranges, not single values. Critical levels shift with palm age, soil moisture, planting material and spacing.', '要用范围，而不是单一数值。临界值随树龄、土壤湿度、种植材料和株距而变。'],
    ['Baca fosforus bersama nitrogen: P kritikal = 0.0487 × N daun + 0.039.', 'Read phosphorus against nitrogen: critical P = 0.0487 × leaf N + 0.039.', '磷要对照氮来读：临界磷 = 0.0487 × 叶片氮 + 0.039。'],
    ['Keputusan lebih berguna apabila terkumpul selama beberapa tahun; perhatikan arah alirannya.', 'Results become more useful as they build up over several years; watch the trend.', '结果累积数年后更有用；要看变化趋势。'],
    ['Jangan tetapkan baja daripada helaian makmal sahaja. N daun yang rendah mungkin berpunca daripada pemangkasan berlebihan atau saliran yang lemah, bukan kurang baja.', 'Do not set fertiliser from the laboratory sheet alone. Low leaf N may come from over-pruning or poor drainage, not too little fertiliser.', '不要只凭化验单定肥。叶片氮低可能是修剪过度或排水不良，而不是肥料不足。'],
    ['Ralat persampelan dan makmal bersama boleh mencapai 10 hingga 20%. Gunakan makmal dan kaedah yang sama setiap tahun.', 'Sampling and laboratory error together can reach 10 to 20%. Use the same laboratory and method every year.', '取样和实验室误差合计可达 10% 至 20%。每年使用同一实验室和同一方法。'],
  ]],
  ['src', { s: 'Fairhurst & Mutert (1999), Interpretation and Management of Oil Palm Leaf Analysis Data, Better Crops International 13(1), after von Uexküll & Fairhurst (1991)', u: 'https://www.fertilizer.org/wp-content/uploads/2023/01/Better-Crops-International-1999-1.pdf',
    a: ['Kelapa sawit di Asia Tenggara. MPOB tidak menerbitkan jadual paras kritikal yang ringkas; sistemnya menggunakan persamaan tindak balas hasil.', 'Oil palm in Southeast Asia. MPOB does not publish a simple table of critical levels; its system uses yield response equations.', '东南亚的油棕。MPOB 没有发布简单的临界值表；其系统采用产量反应方程。'] }],
);

LESSONS['7-2'].body.push(
  ['h', ['Analisis daun durian', 'Durian leaf analysis', '榴莲的叶片分析']],
  ['p', ['Tiada protokol persampelan daun atau jadual kecukupan Malaysia yang berwibawa ditemui untuk durian. Piawaian yang paling kerap dirujuk berasal dari Thailand, daripada kebun Mon Thong yang berhasil tinggi. Ia ditunjukkan di sini sebagai contoh sahaja.',
         'No authoritative Malaysian leaf sampling protocol or sufficiency table was found for durian. The standard cited most often comes from Thailand, from high-yielding Mon Thong orchards. It is shown here as an example only.',
         '未找到针对榴莲的权威马来西亚叶片取样规程或适宜范围表。最常被引用的标准来自泰国高产的金枕头果园。这里仅作示例。']],
  ['table', { head: ['N (%)', 'P (%)', 'K (%)', 'Ca (%)', 'Mg (%)'], rows: [['2.0–2.4', '0.15–0.25', '1.5–2.5', '1.7–2.5', '0.25–0.50']] }],
  ['ul', [
    ['Daun yang disampel: daun kedua hingga keempat dari hujung pucuk yang sudah matang dan berhenti membesar, berumur kira-kira 5 hingga 7 bulan. Dua kertas kumpulan yang sama memberi kedudukan daun yang sedikit berbeza.', 'The leaf sampled: the second to fourth leaf from the tip of a flush that has matured and stopped growing, about 5 to 7 months old. Two papers by the same group give slightly different leaf positions.', '取样叶：已成熟并停止生长的新梢顶端往下第二至第四片叶，叶龄约 5 至 7 个月。同一研究组的两篇论文给出的叶位略有不同。'],
    ['Di Australia, sepuluh pasang daun diambil daripada setiap sepuluh pokok dan digabungkan.', 'In Australia, ten leaf pairs are taken from each of ten trees and combined.', '在澳大利亚，从十棵树上各取十对叶片并合并。'],
    ['Satu tinjauan di Queensland tidak menemui kaitan langsung antara paras nutrien daun, baja yang diberi dan hasil, dan menyifatkan piawaian sebegini sebagai tentatif.', 'A survey in Queensland found no direct link between leaf nutrient levels, fertiliser applied and yield, and described standards of this kind as tentative.', '昆士兰的一项调查未发现叶片养分水平、施肥量与产量之间有直接联系，并称这类标准只是暂定的。'],
  ]],
  ['src', { s: 'Poovarodom et al. (2002), Development of Leaf Nutrient Concentration Standards for Durian, Acta Horticulturae 594; Diczbalis & Westerhuis (2005), RIRDC Publication 05/163', u: 'https://ishs.org/ishs-article/594_51/',
    a: ['Thailand timur dan utara Queensland; bukan Malaysia.', 'Eastern Thailand and north Queensland; not Malaysia.', '泰国东部和昆士兰北部；并非马来西亚。'] }],
);

/* corrections and additions from checking against Malaysian sources */
putBefore('2-4', 'Colour indicator with barium sulfate',
  ['note', ['Di Malaysia, makmal biasanya mengukur pH dalam air pada nisbah tanah kepada air 1:2.5, mengikut piawaian MS 2457. Jika anda mahu bacaan anda setanding dengan laporan makmal, gunakan 10 g tanah dengan 25 ml air.',
            'In Malaysia, laboratories usually measure pH in water at a soil to water ratio of 1:2.5, following the standard MS 2457. If you want your reading to match a laboratory report, use 10 g of soil with 25 ml of water.',
            '在马来西亚，实验室通常按 MS 2457 标准，以 1:2.5 的土水比在水中测 pH。若想让自己的读数与实验室报告可比，可用 10 克土加 25 毫升水。']],
  ['src', { s: 'Standards Malaysia, MS 2457:2012; Alia Farhana et al. (2017), Universiti Putra Malaysia, Pakistan Journal of Botany 49(5)', u: 'https://www.pakbs.org/pjbot/papers/1507287778.pdf',
    a: ['Malaysia. Teks piawaian tidak dapat dibuka; nisbah disahkan daripada kertas UPM.', 'Malaysia. The text of the standard could not be opened; the ratio is confirmed from the UPM paper.', '马来西亚。标准原文无法打开；该比例由博特拉大学的论文证实。'] }],
);

putBefore('5-1', 'Kinds of liming material',
  ['h', ['Angka daripada kajian di Malaysia', 'Figures from Malaysian work', '马来西亚研究中的数字']],
  ['ul', [
    ['Tanah mineral berasid yang sangat terluluhawa: kira-kira 2 hingga 4 tan batu kapur sehektar setiap dua tahun.', 'Acidic, highly weathered mineral soils: about 2 to 4 tonnes of limestone per hectare every two years.', '高度风化的酸性矿质土：每两年每公顷约 2 至 4 吨石灰石。'],
    ['Padi di tanah asid sulfat: 4 tan GML sehektar dalam satu kajian; dalam kajian lain, 2 tan GML bersama baja bio-organik menaikkan pH ke 5.', 'Paddy on acid sulfate soil: 4 tonnes of GML per hectare in one study; in another, 2 tonnes of GML with a bio-organic fertiliser raised pH to 5.', '酸性硫酸盐土上的水稻：一项研究为每公顷 4 吨 GML；另一项研究中，2 吨 GML 加生物有机肥把 pH 提高到 5。'],
    ['Gambut: dalam percubaan MARDI, 12 tan kapur sehektar menaikkan pH daripada 3.47 kepada 4.20 sahaja. Tanaman pula berbeza: ubi kayu memberi hasil terbaik pada pH 3.8, manakala keledek terus meningkat hingga pH 5.5.', 'Peat: in a MARDI trial, 12 tonnes of lime per hectare raised pH only from 3.47 to 4.20. Crops differ too: cassava yielded best at pH 3.8, while sweet potato kept improving up to pH 5.5.', '泥炭土：在 MARDI 的试验中，每公顷 12 吨石灰只把 pH 从 3.47 提高到 4.20。作物也各不相同：木薯在 pH 3.8 时产量最好，而番薯一直到 pH 5.5 仍在增产。'],
    ['Kelapa sawit bertoleransi terhadap asid: pH melebihi 4.0 sudah memadai, dan getah sesuai pada 4.5 hingga 5.5.', 'Oil palm tolerates acid: a pH above 4.0 is already adequate, and rubber suits 4.5 to 5.5.', '油棕耐酸：pH 高于 4.0 即已足够，橡胶适宜 4.5 至 5.5。'],
    ['Dalam kajian padi di Malaysia, GML digaul kira-kira dua minggu sebelum menanam.', 'In Malaysian rice studies, GML was mixed in about two weeks before planting.', '在马来西亚的水稻研究中，GML 在种植前约两周混入土中。'],
  ]],
  ['note', ['Kadar yang jauh lebih tinggi, 20 hingga 25 tan sehektar, kadangkala disebut untuk gambut. Kadar itu hanya munasabah sebagai dos untuk mencapai kira-kira pH 5, yang tidak diperlukan oleh kebanyakan tanaman di gambut. Angka di atas ialah contoh kajian, bukan syor: dapatkan keperluan kapur daripada ujian tanah.',
            'Much higher rates, 20 to 25 tonnes per hectare, are sometimes quoted for peat. That only makes sense as the dose to reach about pH 5, which most crops on peat do not need. The figures above are examples from research, not recommendations: get the lime requirement from a soil test.',
            '有时会见到泥炭土每公顷 20 至 25 吨这样高得多的用量。这只有作为达到约 pH 5 的用量才说得通，而泥炭土上的大多数作物并不需要这么高。以上数字是研究实例，不是建议：石灰需要量应以土壤检测为准。']],
  ['src', { s: 'FAO, Fertilizer use by crop in Malaysia; Shamshuddin et al. (2016), Sains Malaysiana 45(3); Chew et al. (MARDI, 1980 to 1982), Experimental Agriculture; Applied Agricultural Resources, Soil requirements of plantation tree crops', u: 'https://www.fao.org/4/y5797e/y5797e05.htm',
    a: ['Malaysia. Setiap angka datang daripada satu tanah dan satu tanaman.', 'Malaysia. Each figure comes from one soil and one crop.', '马来西亚。每个数字都来自某一种土壤和某一种作物。'] }],
);

putBefore('3-4', 'Acid sulfate soils',
  ['table', { head: [['Umur kelapa sawit', 'Age of the oil palm', '油棕树龄'], ['Aras air tanah di ladang (cm)', 'Groundwater level in the field (cm)', '田间地下水位（厘米）'], ['Aras air dalam parit pengumpul (cm)', 'Water level in the collection drain (cm)', '集水沟水位（厘米）']],
    rows: [
      [['Belum matang, 1 hingga 3 tahun', 'Immature, 1 to 3 years', '未成龄，1 至 3 年'], '30–40', '35–45'],
      [['Matang muda, 4 hingga 7 tahun', 'Young mature, 4 to 7 years', '初成龄，4 至 7 年'], '35–45', '45–55'],
      [['Matang sepenuhnya, lebih 8 tahun', 'Fully mature, over 8 years', '完全成龄，8 年以上'], '40–50', '50–60'],
    ] }],
  ['note', ['Jadual MPOB ini lebih cetek daripada nasihat lama 50 hingga 70 cm. Manual RSPO untuk pekebun kecil memberi purata 50 cm di telaga pemantauan dan 60 cm di parit pengumpul. Kedua-duanya diukur ke bawah dari permukaan tanah atau tebing; pastikan tempat ukuran sebelum membandingkan angka.',
            'This MPOB table is shallower than the older advice of 50 to 70 cm. The RSPO smallholder manual gives an average of 50 cm in a monitoring well and 60 cm in the collection drain. Both are measured downward from the ground surface or the bank; make sure where a figure was measured before comparing.',
            'MPOB 的这张表比早期 50 至 70 厘米的建议更浅。RSPO 小园主手册给出监测井平均 50 厘米、集水沟平均 60 厘米。两者都是从地面或沟岸向下量；比较数字前要先确认测量位置。']],
  ['src', { s: 'MPOB TT No. 472 (2010), Best management practices for oil palm planting on peat: optimum groundwater table; RSPO Smallholder BMP Manual for Existing Oil Palm Cultivation on Peat', u: 'https://tot.mpob.gov.my/files/2020/02/TT-472.pdf',
    a: ['Kelapa sawit sedia ada di gambut, Malaysia.', 'Existing oil palm on peat, Malaysia.', '马来西亚泥炭土上的现有油棕。'] }],
);

LESSONS['3-3'].body.push(
  ['h', ['Berapa luas setiap jenis', 'How much there is of each', '各类土壤的面积']],
  ['table', { head: [['Tanah', 'Soil', '土壤'], ['Keluasan', 'Extent', '面积'], ['Angka utama', 'Key figures', '主要数字']],
    rows: [
      [['Ultisol dan Oksisol', 'Ultisols and Oxisols', '老成土和氧化土'], ['Kira-kira 72% tanah Malaysia', 'About 72% of Malaysian soils', '约占马来西亚土壤的 72%'], ['Berasid, sangat terluluhawa', 'Acidic, highly weathered', '酸性、高度风化']],
      [['Gambut', 'Peat', '泥炭土'], ['Kira-kira 2.4 juta ha: 1.5 juta di Sarawak, 0.8 juta di Semenanjung, 0.1 juta di Sabah', 'About 2.4 million ha: 1.5 million in Sarawak, 0.8 million in the Peninsula, 0.1 million in Sabah', '约 240 万公顷：砂拉越 150 万、半岛 80 万、沙巴 10 万'], 'pH 3.3–3.5'],
      [['Asid sulfat', 'Acid sulfate', '酸性硫酸盐土'], ['Kira-kira 0.5 juta ha, 110 000 ha di Semenanjung', 'About 0.5 million ha, 110 000 ha of it in the Peninsula', '约 50 万公顷，其中半岛 11 万公顷'], ['pH di bawah 3.5; hasil padi kurang daripada 2 tan sehektar tanpa pembaikan', 'pH below 3.5; rice yields under 2 tonnes per hectare without treatment', 'pH 低于 3.5；未经改良时水稻每公顷产量不足 2 吨']],
      ['BRIS', ['Kira-kira 155 400 ha di Semenanjung dan 40 400 ha di Sabah', 'About 155 400 ha in the Peninsula and 40 400 ha in Sabah', '半岛约 155 400 公顷，沙巴约 40 400 公顷'], ['Pasir kadangkala melebihi 95%', 'Sand occasionally exceeding 95%', '砂粒有时超过 95%']],
      [['Bekas lombong bijih timah', 'Tin tailings', '锡矿尾砂'], ['Kira-kira 200 000 ha pada tahun 1995; sumber lain memberi 113 700 ha', 'About 200 000 ha in 1995; other sources give 113 700 ha', '1995 年约 20 万公顷；其他资料为 113 700 公顷'], ''],
    ] }],
  ['src', { s: 'FAO, Fertilizer use by crop in Malaysia, Chapter 2; Universiti Malaya presentation to the FAO Global Soil Partnership, citing Shamshuddin et al. (2017)', u: 'https://www.fao.org/4/y5797e/y5797e05.htm',
    a: ['Malaysia. Angka keluasan berbeza antara sumber.', 'Malaysia. The areas differ between sources.', '马来西亚。各资料的面积数字不一。'] }],
);

putBefore('5-2', 'Green manure',
  ['p', ['Berapa lama? Kaedah pengkomposan pantas mengambil 2 hingga 7 minggu; timbunan dan lubang tradisional mengambil 2 hingga 4 bulan. Dalam satu kajian di Sabah, kompos tinja kambing matang selepas 56 hari. Nilai kematangan pada rupa dan bau, bukan pada bilangan hari.',
         'How long? Rapid composting methods take 2 to 7 weeks; traditional heaps and pits take 2 to 4 months. In one study in Sabah, goat dung compost was mature after 56 days. Judge readiness by look and smell, not by a count of days.',
         '需要多久？快速堆肥法需 2 至 7 周；传统的堆置和坑沤需 2 至 4 个月。沙巴的一项研究中，羊粪堆肥在 56 天后腐熟。要凭外观和气味判断是否腐熟，而不是数天数。']],
  ['src', { s: 'FAO, On-farm composting methods (2003), Chapter 1; Kamal et al. (2025), Universiti Malaysia Sabah', u: 'http://www.fao.org/4/y5104e/y5104e05.htm',
    a: ['Panduan umum dan satu kajian di Sabah.', 'General guidance and one Sabah study.', '一般指引和沙巴的一项研究。'] }],
);

putBefore('6-2', 'Commonly used fertilisers',
  ['p', ['**Sekam padi** kaya silika tetapi rendah N, P dan K. Ia ialah pembaik tanah, bukan baja. Sekam yang dibakar menjadi arang digunakan untuk membantu tanah memegang air dan nutrien.',
         '**Rice husk** is rich in silica but low in N, P and K. It is a soil conditioner, not a fertiliser. Husk charred into biochar is used to help soil hold water and nutrients.',
         '**稻壳**富含硅，但氮、磷、钾含量低。它是土壤改良材料，而不是肥料。烧成炭的稻壳用于帮助土壤保水保肥。']],
  ['src', { s: 'International Rice Research Institute, Rice Today: Black soil, green rice (2007); PhilRice, Golden waste', u: 'https://ricetoday.irri.org/black-soil-green-rice/',
    a: ['Asia; tiada angka kandungan nutrien yang berwibawa ditemui untuk sekam Malaysia.', 'Asia; no authoritative nutrient figures were found for Malaysian husk.', '亚洲；未找到马来西亚稻壳的权威养分数据。'] }],
);
{ /* superphosphate grades, and the measured grade of Christmas Island rock phosphate */
  const t = LESSONS['6-2'].body.find(b => b[0] === 'table' && b[1].rows.some(r => Array.isArray(r[0]) && r[0][1] === 'Urea'));
  const at = t[1].rows.findIndex(r => Array.isArray(r[0]) && r[0][1].startsWith('Triple superphosphate'));
  if (at < 0) throw new Error('the fertiliser table has no triple superphosphate row');
  t[1].rows.splice(at, 0, [['Superfosfat tunggal (SSP)', 'Single superphosphate (SSP)', '过磷酸钙 (SSP)'], '0', '16–20', '0', '18–21% Ca, 11–12% S']);
  const note = LESSONS['6-2'].body.find(b => b[0] === 'note' && b[1][1].startsWith('Christmas Island rock phosphate'));
  if (!note) throw new Error('the note on Christmas Island rock phosphate is missing');
  note[1] = ['MPOB mengukur batuan fosfat Pulau Christmas (CIRP) pada 32.5% P₂O₅, dan batuan fosfat lain antara 30 dan 34%. Gred eksport lama ialah kira-kira 35%. Gunakan angka pada beg.',
    'MPOB measured Christmas Island rock phosphate (CIRP) at 32.5% P₂O₅, and other rock phosphates at between 30 and 34%. The old export grade was about 35%. Use the figure on the bag.',
    'MPOB 测得圣诞岛磷矿粉（CIRP）含 32.5% P₂O₅，其他磷矿粉在 30% 至 34% 之间。早期的出口品位约为 35%。请以包装上的数字为准。'];
}

SOURCES.push({ topic: ['Amalan ladang: sukatan, campuran, simpanan, hujan, daun dan makmal', 'Field practice: measures, mixing, storage, rain, leaf and laboratories', '田间实务：计量、混合、储存、降雨、叶片与实验室'], items: [
  ['Fertilizers Europe – Guidance for the Compatibility of Fertilizer Blending Materials', 'https://www.fertilizerseurope.com/wp-content/uploads/2019/08/Guidance_for_compatibility2.pdf'],
  ['Fertilizers Europe – Fertilizer storage on farms', 'https://www.fertilizerseurope.com/wp-content/uploads/2019/08/Farm_storage_A5_V4.pdf'],
  ['Department of Agriculture Malaysia – SALM Standard (2005)', 'https://law.resource.org/pub/my/ibr/ms.gap.2005.pdf'],
  ['FAO/IFA – Fertilizers and their use (2000)', 'https://www.fertilizer.org/wp-content/uploads/2023/01/2000_IFa_FAO_fertilizeruse.pdf'],
  ['Goh, Härdter & Fairhurst (2003) – Fertilizing for maximum return', 'https://aarsb.com.my/wp-content/AgroMgmt/OilPalm/FertMgmt/Application/Goh,Hardter_FairhurstF[1]%20Fertilizing%20for%20maximum%20returns.pdf'],
  ['MPOB TT No. 348 – Efficient Use of Urea as Nitrogen Fertilizer for Mature Oil Palm', 'https://tot.mpob.gov.my/files/2020/02/TT-348.pdf'],
  ['MPOB TT No. 472 – Optimum groundwater table for oil palm on peat', 'https://tot.mpob.gov.my/files/2020/02/TT-472.pdf'],
  ['MPOB TT No. 256 – Reactive phosphate fertilizers for young oil palm', 'https://tot.mpob.gov.my/files/2020/02/TT-256.pdf'],
  ['MPOB TS No. 185 – Laboratory analyses and agronomy advisory services', 'https://tot.mpob.gov.my/files/2020/07/TS185-Farawahida-Mohamad-Darus.pdf'],
  ['Fairhurst (2015) – Minimization of error in leaf analysis sampling and analysis', 'http://www.tropcropconsult.com/wp-content/uploads/2017/04/Fairhurst2015.pdf'],
  ['Better Crops International 13(1), 1999 – oil palm leaf analysis and soil suitability', 'https://www.fertilizer.org/wp-content/uploads/2023/01/Better-Crops-International-1999-1.pdf'],
  ['FAO – Fertilizer use by crop in Malaysia', 'https://www.fao.org/4/y5797e/y5797e05.htm'],
  ['FAO – On-farm composting methods', 'http://www.fao.org/4/y5104e/y5104e05.htm'],
  ['MADA–TARC – Farm management studies, Muda Irrigation Scheme (1981)', 'https://www.jircas.go.jp/sites/default/files/publication/techtarc/techtarc14-_1-101.pdf'],
] });

QUIZ[6].push(
  Q(['Baja yang manakah tidak boleh dicampur dengan urea?', 'Which fertiliser must not be mixed with urea?', '哪一种肥料不可与尿素混合？'],
    [['Superfosfat (SSP atau TSP)', 'Superphosphate (SSP or TSP)', '过磷酸钙（SSP 或 TSP）'], ['Kieserit', 'Kieserite', '硫镁矾'], ['Batuan fosfat', 'Rock phosphate', '磷矿粉'], ['Ammonium sulfat', 'Ammonium sulphate', '硫酸铵']],
    ['Urea dan superfosfat membentuk bahan yang sangat melekit; tiga yang lain serasi dengan urea.', 'Urea and superphosphate form a very sticky material; the other three are compatible with urea.', '尿素与过磷酸钙会生成非常黏的物质；其余三种与尿素相容。']),
  Q(['Bilakah masa yang paling sesuai untuk menabur urea?', 'When is the best time to spread urea?', '什么时候最适合撒施尿素？'],
    [['Pada tanah lembap apabila hujan ringan dijangka dalam sehari dua', 'On moist soil when light rain is expected within a day or two', '土壤湿润、一两天内预计有小雨时'], ['Pada tanah kering dalam musim kemarau', 'On dry soil in the dry season', '旱季的干土上'], ['Sejurus sebelum hujan lebat', 'Just before heavy rain', '大雨来临前'], ['Bersama kapur', 'Together with lime', '与石灰一起']],
    ['Urea di atas tanah kering hilang sebagai gas ammonia; hujan lebat menghanyutkannya; kapur mempercepat kehilangan itu.', 'Urea on dry soil is lost as ammonia gas; heavy rain washes it away; lime speeds up the loss.', '尿素在干土上会以氨气形式损失；大雨会把它冲走；石灰会加快损失。']));
