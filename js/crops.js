/* Crop unit (oil palm and tropical fruit trees) and the field extras that go with it:
   slope measurement, lime estimate, nitrogen losses, organic manure values.
   Loaded after content.js and units.js; text tuples are [ms, en, zh]. */

Object.assign(UI, {
  toolsIntro: ['Lima alat untuk digunakan di tapak.', 'Five tools to use at the site.', '五个可在田间使用的工具。'],

  /* slope tool */
  tSlope: ['Kalkulator cerun', 'Slope calculator', '坡度计算器'],
  tSlopeDesc: ['Tukar ukuran beza tinggi dan jarak mendatar kepada peratus cerun dan darjah.', 'Turn a rise and a horizontal run into a slope in percent and degrees.', '把垂直高差和水平距离换算成坡度百分比和度数。'],
  rise: ['Beza tinggi (m)', 'Rise (m)', '垂直高差（米）'],
  run: ['Jarak mendatar (m)', 'Horizontal run (m)', '水平距离（米）'],
  slope: ['Cerun', 'Slope', '坡度'],
  enterSlope: ['Masukkan beza tinggi (0 atau lebih) dan jarak mendatar yang lebih daripada 0.', 'Enter a rise of 0 or more and a run greater than 0.', '请输入高差（0 或以上）和大于 0 的水平距离。'],
  slopePalm: ['Had tanah untuk kelapa sawit', 'Soil limitation for oil palm', '对油棕的土地限制'],
  slopeDo: ['Langkah pemuliharaan', 'Conservation measures', '保育措施'],
  slopeNote: ['Kelas kelapa sawit mengikut satu skema kesesuaian tanah Malaysia; langkah pemuliharaan mengikut satu panduan pekebun kecil kelapa sawit.', 'Oil palm classes follow one Malaysian land suitability scheme; the measures follow one oil palm smallholder guide.', '油棕等级依据马来西亚的一套土地适宜性标准；保育措施依据一份油棕小园主指南。'],

  /* pH tool: crop target and lime estimate */
  crop: ['Tanaman', 'Crop', '作物'],
  target: ['Julat pH sasaran', 'Target pH range', '目标 pH 范围'],
  soilTex: ['Tekstur tanah', 'Soil texture', '土壤质地'],
  limeEst: ['Anggaran kapur', 'Lime estimate', '石灰估算'],
  limeText: ['Untuk menaikkan pH dari {a} ke {b}: kira-kira {t} tan kapur sehektar.', 'To raise the pH from {a} to {b}: about {t} tonnes of lime per hectare.', '把 pH 从 {a} 提高到 {b}：每公顷约需 {t} 吨石灰。'],
  limeMore: ['Sasaran masih belum tercapai. Uji semula sebelum mengapur kali kedua.', 'This is still short of the target. Retest before liming a second time.', '这仍未达到目标。再次施石灰前请重新检测。'],
  limeNote: ['Panduan kasar: (pH sasaran − pH semasa) × faktor tekstur, iaitu 2 untuk pasir, 3 untuk lom berpasir dan 4 untuk lom hingga lom liat, bagi kapur tulen. Naikkan paling banyak 1 unit pH pada satu masa, dan kurangkan kadar 25% pada tanah yang sangat rendah bahan organik. Formula ini berasal dari Australia Selatan dan berdasarkan pH dalam kalsium klorida; ujian tanah tempatan lebih tepat.',
             'A rough guide: (target pH − current pH) × texture factor, which is 2 for sand, 3 for sandy loam and 4 for loam to clay loam, for pure lime. Raise the pH by at most 1 unit at a time, and cut the rate by 25% on soil very low in organic matter. The formula comes from South Australia and is based on pH in calcium chloride; a local soil test is more accurate.',
             '粗略估算：（目标 pH − 当前 pH）× 质地系数，砂土为 2、砂质壤土为 3、壤土至黏壤土为 4，按纯石灰计。每次最多提高 1 个 pH 单位；有机质极低的土壤减量 25%。此公式来自南澳大利亚，以氯化钙测得的 pH 为基准；本地的土壤检测更为准确。'],
  inRange: ['pH berada dalam julat sasaran tanaman ini. Kapur tidak diperlukan.', 'The pH is within this crop’s target range. No lime is needed.', 'pH 在该作物的目标范围内，无需施石灰。'],
  aboveRange: ['pH melebihi julat sasaran. Jangan mengapur.', 'The pH is above the target range. Do not lime.', 'pH 高于目标范围，不要施石灰。'],

  /* fertiliser tool: tree programme */
  modeTree: ['Program pokok', 'Tree programme', '果树施肥计划'],
  treeRate: ['Baja sepokok setahun (kg)', 'Fertiliser per tree per year (kg)', '每株每年肥料（公斤）'],
  apps: ['Bilangan pemberian setahun', 'Applications per year', '每年施肥次数'],
  trees: ['Bilangan pokok', 'Number of trees', '株数'],
  perApp: ['Sepokok, setiap pemberian', 'Per tree, each application', '每株每次'],
  perRound: ['Semua pokok, setiap pemberian', 'All trees, each application', '全部树每次'],
  perYear: ['Semua pokok, setahun', 'All trees, per year', '全部树每年'],
  organicPresets: ['Baja organik (nilai lazim)', 'Organic manures (typical values)', '有机肥（常见数值）'],
});

/* target pH ranges (pH in water) */
const CROP_PH = [
  { id: 'gen', range: [5.5, 7.0], name: ['Umum', 'General', '一般作物'] },
  { id: 'palm', range: [4.5, 6.5], name: ['Kelapa sawit', 'Oil palm', '油棕'] },
  { id: 'durian', range: [5.5, 6.5], name: ['Durian', 'Durian', '榴莲'] },
  { id: 'fruit', range: [5.5, 7.0], name: ['Pokok buah lain', 'Other fruit trees', '其他果树'] },
];
const LIME_TEX = [
  { id: 'sand', f: 2, name: ['Pasir', 'Sand', '砂土'] },
  { id: 'sloam', f: 3, name: ['Lom berpasir', 'Sandy loam', '砂质壤土'] },
  { id: 'loam', f: 4, name: ['Lom hingga lom liat', 'Loam to clay loam', '壤土至黏壤土'] },
];

/* slope classes */
const SLOPE_PALM = [   // terrain in degrees
  { max: 12, name: ['Julat yang diingini', 'Desirable range', '理想范围'] },
  { max: 16, name: ['Had kecil', 'Minor limitation', '轻度限制'] },
  { max: 24, name: ['Had serius', 'Serious limitation', '严重限制'] },
  { max: 999, name: ['Had sangat serius', 'Very serious limitation', '极严重限制'] },
];
const SLOPE_DO = [     // slope in percent
  { max: 9, text: ['Tiada langkah khas diperlukan; kekalkan litupan tanah.', 'No special measures needed; keep the ground covered.', '无需特别措施；保持地面覆盖。'] },
  { max: 16, text: ['Susun pelepah mengikut kontur dan gali lubang kelodak.', 'Stack fronds along the contour and dig silt pits.', '沿等高线堆放叶柄并挖集泥坑。'] },
  { max: 40, text: ['Teres dan kekacang penutup bumi.', 'Terraces and legume cover crops.', '修梯田并种植豆科覆盖作物。'] },
  { max: 9999, text: ['Tidak ditanam.', 'Not planted.', '不种植。'] },
];

const ORGANIC_PRESETS = [
  { g: [2.2, 1.8, 1.1], name: ['Tahi ayam', 'Poultry manure', '鸡粪'] },
  { g: [1.4, 0.4, 2.0], name: ['Tahi lembu', 'Cattle manure', '牛粪'] },
  { g: [0.5, 0.2, 0.5], name: ['Baja kandang reput', 'Rotted farmyard manure', '腐熟厩肥'] },
];

/* ---------- Unit 7 ---------- */
UNITS.push({ n: 7, chip: '#3f6e63', title: ['Kelapa sawit dan pokok buah', 'Oil palm and fruit trees', '油棕与果树'],
  blurb: ['Keperluan tanah dan program pembajaan untuk kelapa sawit, durian, rambutan dan mangga.', 'Soil needs and feeding programmes for oil palm, durian, rambutan and mango.', '油棕、榴莲、红毛丹和芒果的土壤要求与施肥计划。'],
  lessons: ['7-1', '7-2', '7-3'] });

LESSONS['7-1'] = { book: '', title: ['Kelapa sawit', 'Oil palm', '油棕'], body: [
  ['p', ['Kelapa sawit tahan tanah berasid, tetapi memerlukan tanah yang dalam dan bersaliran baik, dan mengambil banyak nutrien, terutamanya kalium.',
         'Oil palm tolerates acidic soil, but it needs deep, well-drained soil and takes up a lot of nutrients, potassium above all.',
         '油棕耐酸性土壤，但需要深厚且排水良好的土壤，并吸收大量养分，尤其是钾。']],
  ['h', ['Kesesuaian tanah', 'Soil suitability', '土壤适宜性']],
  ['table', { head: [['Sifat', 'Property', '性质'], ['Julat yang diingini', 'Desirable range', '理想范围'], ['Had serius', 'Serious limitation', '严重限制']],
    rows: [
      [['Kecerunan', 'Terrain', '地形坡度'], '0 – 12°', '16 – 24°'],
      [['Kedalaman tanah berkesan', 'Effective soil depth', '有效土层深度'], '> 90 cm', '30 – 60 cm'],
      [['Tekstur', 'Texture', '质地'], ['Lom liat berpasir, lom liat atau lebih berat', 'Sandy clay loam, clay loam or heavier', '砂质黏壤土、黏壤土或更黏重'], ['Pasir berlom', 'Loamy sand', '壤质砂土']],
      [['Saliran', 'Drainage', '排水'], ['Sederhana baik hingga baik', 'Moderately well to well drained', '排水中等良好至良好'], ['Saliran lemah atau berlebihan', 'Poorly or excessively drained', '排水不良或过度排水']],
      [['Kedalaman aras air', 'Water table depth', '地下水位深度'], '75 – 90 cm', '30 – 60 cm'],
      [['Kedalaman gambut', 'Peat depth', '泥炭层厚度'], '< 30 cm', '100 – 150 cm'],
    ] }],
  ['p', ['Kecerunan melebihi 24°, kedalaman kurang daripada 30 cm atau tekstur pasir dianggap had yang sangat serius.',
         'Terrain steeper than 24°, depth under 30 cm or a sand texture counts as a very serious limitation.',
         '坡度超过 24°、土层不足 30 厘米或质地为砂土，均属极严重限制。']],
  ['tool', 'cerun'],
  ['h', ['Menentukan kadar baja', 'Setting fertiliser rates', '确定施肥量']],
  ['p', ['Kadar untuk kelapa sawit ditetapkan daripada analisis daun dan hasil, bukan daripada satu resipi tetap. Contoh daripada kajian yang diterbitkan untuk pokok matang:',
         'Rates for oil palm are set from leaf analysis and yield, not from one fixed recipe. Examples from published work on mature palms:',
         '油棕的施肥量是根据叶片分析和产量确定的，而不是一成不变的配方。已发表研究中成龄树的例子：']],
  ['ul', [
    ['Satu percubaan di Sabah mencadangkan 4.0 hingga 5.0 kg ammonium sulfat, 1.5 hingga 2.0 kg batuan fosfat dan 3.0 hingga 4.0 kg MOP sepokok setahun. Magnesium tidak disyorkan di situ kerana magnesium boleh tukar dalam tanah sangat tinggi.',
     'One trial in Sabah suggested 4.0 to 5.0 kg ammonium sulphate, 1.5 to 2.0 kg rock phosphate and 3.0 to 4.0 kg MOP per palm per year. Magnesium was not recommended there because exchangeable magnesium in the soil was very high.',
     '沙巴的一项试验建议每株每年施 4.0 至 5.0 公斤硫酸铵、1.5 至 2.0 公斤磷矿粉和 3.0 至 4.0 公斤氯化钾。由于当地土壤的交换性镁很高，该试验不建议施镁。'],
    ['Satu contoh imbangan nutrien untuk hasil 30 tan sehektar di tanah kurang subur berjumlah 10.75 kg baja sepokok setahun.',
     'One nutrient-balance example for a 30 tonne per hectare yield on poor soil came to 10.75 kg of fertiliser per palm per year.',
     '一个养分平衡实例显示，在贫瘠土壤上要达到每公顷 30 吨的产量，每株每年共需 10.75 公斤肥料。'],
    ['Untuk pokok belum matang, satu panduan pekebun kecil menyenaraikan boraks kira-kira 0.05 hingga 0.10 kg sepokok setahun.',
     'For immature palms, one smallholder guide lists borax at about 0.05 to 0.10 kg per palm per year.',
     '对于幼龄树，一份小园主指南列出硼砂约每株每年 0.05 至 0.10 公斤。'],
  ]],
  ['note', ['Angka ini ialah contoh daripada tapak tertentu, bukan syor umum. Tanah dan hasil yang berbeza memerlukan kadar yang berbeza.',
            'These figures are examples from particular sites, not general recommendations. Different soils and yields need different rates.',
            '这些数字是特定地点的例子，并非通用建议。不同的土壤和产量需要不同的用量。']],
  ['h', ['Persampelan daun: pelepah ke-17', 'Leaf sampling: frond 17', '叶片取样：第 17 片叶']],
  ['steps', [
    ['Cari pelepah 1, iaitu pelepah termuda yang telah terbuka sepenuhnya.', 'Find frond 1, the youngest fully opened frond.', '找出第 1 片叶，即最年轻且已完全展开的叶。'],
    ['Ikut pilin pelepah itu ke bawah: pelepah di bawah pelepah 1 pada pilin yang sama ialah pelepah 8.', 'Follow its spiral downward: the frond below frond 1 on the same spiral is frond 8.', '沿其螺旋线向下：同一螺旋线上第 1 片叶下方的是第 8 片叶。'],
    ['Pelepah di bawah pelepah 8 pada pilin itu ialah pelepah 17. Ambil sampel daripada pelepah ini.', 'The frond below frond 8 on that spiral is frond 17. Sample this frond.', '该螺旋线上第 8 片叶下方的是第 17 片叶。从这片叶取样。'],
  ]],
  ['p', ['Mengenal pelepah 1 dan 17 dengan betul memerlukan latihan di lapangan daripada orang yang berpengalaman.',
         'Recognising fronds 1 and 17 correctly takes field training from someone experienced.',
         '要正确辨认第 1 片和第 17 片叶，需要有经验的人在田间指导。']],
  ['h', ['Tandan kosong sebagai sungkupan', 'Empty fruit bunches as mulch', '空果串作覆盖物']],
  ['p', ['Dalam satu kajian, 37.5 tan tandan kosong sehektar setahun bersama baja N dan K menambah baik N dan K daun serta hasil, tetapi menurunkan magnesium daun. Sungkupan tandan kosong juga menambah baik kalium, kalsium dan magnesium boleh tukar serta pH tanah.',
         'In one study, 37.5 tonnes of empty fruit bunches per hectare per year with N and K fertiliser improved leaf N and K and yield, but lowered leaf magnesium. Empty fruit bunch mulch also improved soil exchangeable potassium, calcium and magnesium, and pH.',
         '在一项研究中，每公顷每年施 37.5 吨空果串并配合氮钾肥，提高了叶片氮、钾含量和产量，但降低了叶片的镁含量。空果串覆盖还改善了土壤的交换性钾、钙、镁和 pH。']],
  ['tool', 'baja'],
] };

LESSONS['7-2'] = { book: '', title: ['Durian', 'Durian', '榴莲'], body: [
  ['table', { head: [['Keperluan', 'Requirement', '要求'], ['Butiran', 'Detail', '说明']],
    rows: [
      [['pH', 'pH', 'pH'], '5.5 – 6.5'],
      [['Tanah', 'Soil', '土壤'], ['Lom yang subur dan bersaliran baik', 'Fertile, well-drained loam', '肥沃且排水良好的壤土']],
      [['Risiko utama', 'Main risk', '主要风险'], ['Air bertakung, yang merosakkan akar. Elakkan tanah rendah yang rata dengan aras air tinggi.', 'Waterlogging, which damages the roots. Avoid flat lowland with a high water table.', '积水会损伤根系。避开地下水位高的平坦低地。']],
      [['Akar', 'Roots', '根系'], ['Cetek, jadi sensitif kepada kemarau dan kepada baja yang terlalu pekat', 'Shallow, so sensitive to drought and to concentrated fertiliser', '根浅，因此对干旱和过浓的肥料敏感']],
    ] }],
  ['p', ['Di tapak yang salirannya meragukan, tanam di atas busut dan gali parit lencongan di bahagian atas cerun.',
         'Where drainage is doubtful, plant on mounds and dig diversion drains on the uphill side.',
         '在排水可疑的地点，应起墩种植，并在上坡一侧开挖截水沟。']],
  ['tool', 'ph'],
  ['h', ['Program pembajaan mengikut umur', 'Feeding programme by age', '按树龄的施肥计划']],
  ['table', { head: [['Umur (tahun)', 'Age (years)', '树龄（年）'], ['kg sepokok setahun', 'kg per tree per year', '每株每年公斤数'], ['Pemberian setahun', 'Applications per year', '每年次数'], ['Gred N:P:K:Mg', 'Grade N:P:K:Mg', '配比 N:P:K:Mg']],
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
  ['ul', [
    ['Peringkat awal memerlukan nitrogen dan fosforus yang tinggi; pokok yang berbuah memerlukan kalium yang tinggi.', 'The early years need high nitrogen and phosphorus; bearing trees need high potassium.', '幼龄期需要较多的氮和磷；结果树需要较多的钾。'],
    ['Tambah 15 hingga 30 kg tahi ayam atau tahi lembu sepokok setiap tahun.', 'Add 15 to 30 kg of chicken or cow dung per tree each year.', '每株每年另施 15 至 30 公斤鸡粪或牛粪。'],
    ['Tabur di sekeliling kanopi, sedikit melepasi jejari kanopi. Di tanah curam, masukkan baja ke dalam lubang di sekeliling kanopi dan timbus.', 'Broadcast around the canopy, slightly beyond its radius. On steep land, put the fertiliser in holes around the canopy and cover them.', '撒施在树冠周围，略超出树冠半径。在陡坡地，把肥料放入树冠周围的穴中并覆土。'],
    ['Baja pada bulan-bulan yang lebih basah.', 'Fertilise during the wetter months.', '在较湿润的月份施肥。'],
  ]],
  ['note', ['Jadual ini ialah panduan umum daripada Rangkaian Buah-buahan Tropika Antarabangsa (TFNet). Sesuaikan dengan ujian tanah, keadaan pokok dan hasil.',
            'This schedule is a general guide from the International Tropical Fruits Network (TFNet). Adjust it to the soil test, tree condition and crop load.',
            '此表是国际热带水果网络（TFNet）提供的一般指引，应根据土壤检测、树势和挂果量调整。']],
  ['tool', 'baja'],
] };

LESSONS['7-3'] = { book: '', title: ['Rambutan dan mangga', 'Rambutan and mango', '红毛丹与芒果'], body: [
  ['h', ['Rambutan', 'Rambutan', '红毛丹']],
  ['p', ['Rambutan paling sesuai di tanah lom yang dalam dan bersaliran baik, di kawasan rata hingga beralun.',
         'Rambutan does best in deep, well-drained loam on flat to undulating land.',
         '红毛丹最适合种在平坦至缓起伏地带的深厚、排水良好的壤土上。']],
  ['table', { head: [['Umur (tahun)', 'Age (years)', '树龄（年）'], ['Baja', 'Fertiliser', '肥料'], ['kg sepokok setahun', 'kg per tree per year', '每株每年公斤数'], ['Pemberian setahun', 'Applications per year', '每年次数']],
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
  ['ul', [
    ['Gunakan NPK tanpa klorida; rambutan sensitif kepada ketoksikan klorida.', 'Use chloride-free NPK; rambutan is sensitive to chloride toxicity.', '使用不含氯的 NPK；红毛丹对氯毒害敏感。'],
    ['Lubang tanaman: gaulkan 5 hingga 10 kg bahan organik, 0.5 kg batu kapur dan 0.2 kg batuan fosfat dengan tanah atas.', 'Planting hole: mix 5 to 10 kg of organic matter, 0.5 kg of limestone and 0.2 kg of rock phosphate into the topsoil.', '种植穴：把 5 至 10 公斤有机质、0.5 公斤石灰石和 0.2 公斤磷矿粉与表土混匀。'],
    ['Kapur sebelum menanam. Menaikkan pH dari bawah 5 ke 6 mungkin memerlukan sehingga 5 tan sehektar.', 'Lime before planting. Raising the pH from below 5 to 6 may take up to 5 tonnes per hectare.', '种植前施石灰。把 pH 从 5 以下提高到 6，每公顷可能需要多达 5 吨。'],
    ['Tabur 60 cm dari batang, atau dalam jalur lebar di bawah pinggir kanopi.', 'Broadcast 60 cm from the trunk, or in a wide band below the canopy edge.', '撒施在距树干 60 厘米处，或在树冠边缘下方作宽带状施用。'],
    ['Masa penting: sebelum berbunga, semasa berbunga dan pembentukan buah, beberapa minggu selepas buah terbentuk, dan selepas menuai.', 'Key times: before flowering, during flowering and fruit set, a few weeks after fruit set, and after harvest.', '关键时期：开花前、开花和坐果期、坐果后数周，以及采收后。'],
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
    ['Tanah berpasir memerlukan lebih banyak baja daripada lom atau tanah liat.', 'Sandy soil needs more fertiliser than loam or clay.', '砂质土比壤土或黏质土需要更多肥料。'],
  ]],
  ['tool', 'baja'],
] };

ACTIVITIES[7] = { title: ['Rancang baja setahun untuk satu blok pokok', 'Plan a year of fertiliser for one block of trees', '为一个地块的果树制定全年施肥计划'],
  need: ['Buku nota; kalkulator baja dalam aplikasi ini', 'A notebook; the fertiliser calculator in this app', '笔记本；本应用的肥料计算器'],
  steps: [
    ['Kira bilangan pokok dalam blok dan catat umurnya.', 'Count the trees in the block and note their age.', '数清地块内的树并记下树龄。'],
    ['Cari kadar sepokok setahun dan bilangan pemberian daripada jadual tanaman itu.', 'Find the rate per tree per year and the number of applications from the crop’s table.', '从该作物的表中查出每株每年的用量和施肥次数。'],
    ['Gunakan mod “Program pokok” untuk mendapatkan kuantiti setiap pemberian dan jumlah beg setahun.', 'Use the “Tree programme” mode to get the amount per application and the bags needed for the year.', '用“果树施肥计划”模式算出每次的用量和全年所需包数。'],
    ['Tulis kalendar: bulan setiap pemberian, mengikut musim hujan dan peringkat pokok.', 'Write a calendar: the month of each application, following the wet season and the tree’s stage.', '写出日历：每次施肥的月份，配合雨季和树的生育期。'],
    ['Selepas setiap pemberian, catat tarikh, kuantiti dan keadaan pokok.', 'After each application, record the date, the amount and how the trees look.', '每次施肥后，记录日期、用量和树的状况。'],
  ] };

QUIZ[7] = [
  Q(['Pelepah yang manakah diambil untuk analisis daun kelapa sawit?', 'Which frond is sampled for oil palm leaf analysis?', '油棕叶片分析取哪一片叶？'],
    [['Pelepah ke-17', 'Frond 17', '第 17 片叶'], ['Pelepah ke-1', 'Frond 1', '第 1 片叶'], ['Pelepah paling tua', 'The oldest frond', '最老的叶'], ['Mana-mana pelepah', 'Any frond', '任何一片叶']],
    ['Pelepah 17 ditemui dengan mengikut pilin dari pelepah 1 ke 8 ke 17.', 'Frond 17 is found by following the spiral from frond 1 to 8 to 17.', '沿螺旋线从第 1 片叶到第 8 片再到第 17 片即可找到。']),
  Q(['Apakah kecerunan yang diingini untuk kelapa sawit?', 'What terrain is desirable for oil palm?', '油棕理想的地形坡度是多少？'],
    ['0 – 12°', '16 – 24°', '24 – 30°', '> 30°'],
    ['Melebihi 16° dianggap had serius, dan melebihi 24° sangat serius.', 'Above 16° counts as a serious limitation, and above 24° as very serious.', '超过 16° 属严重限制，超过 24° 属极严重限制。']),
  Q(['Apakah risiko tanah yang utama bagi durian?', 'What is the main soil risk for durian?', '榴莲最主要的土壤风险是什么？'],
    [['Air bertakung', 'Waterlogging', '积水'], ['Tanah terlalu dalam', 'Soil that is too deep', '土层太深'], ['pH 6', 'A pH of 6', 'pH 为 6'], ['Terlalu banyak bahan organik', 'Too much organic matter', '有机质太多']],
    ['Akar durian cetek dan mudah rosak dalam tanah yang tepu air.', 'Durian roots are shallow and easily damaged in waterlogged soil.', '榴莲根浅，在积水的土壤中容易受损。']),
  Q(['Mengapa rambutan memerlukan NPK tanpa klorida?', 'Why does rambutan need chloride-free NPK?', '为什么红毛丹需要不含氯的 NPK？'],
    [['Ia sensitif kepada ketoksikan klorida', 'It is sensitive to chloride toxicity', '它对氯毒害敏感'], ['Klorida menaikkan pH', 'Chloride raises the pH', '氯会提高 pH'], ['Klorida terlalu mahal', 'Chloride is too expensive', '氯太贵'], ['Klorida menarik perosak', 'Chloride attracts pests', '氯会招来害虫']],
    ['Baja seperti MOP mengandungi klorida yang tinggi.', 'Fertilisers such as MOP are high in chloride.', '氯化钾等肥料含氯量高。']),
  Q(['Apakah kesan nitrogen berlebihan pada mangga yang sedang berbuah?', 'What does too much nitrogen do to a fruiting mango?', '结果期的芒果氮过多会怎样？'],
    [['Kualiti buah merosot', 'Fruit quality suffers', '果实品质下降'], ['Buah masak lebih awal', 'Fruit ripens earlier', '果实提早成熟'], ['pH tanah naik', 'Soil pH rises', '土壤 pH 升高'], ['Akar tumbuh lebih dalam', 'Roots grow deeper', '根长得更深']],
    ['Isi menjadi lembik dan buah masak tidak sekata.', 'The flesh turns soft and the fruit ripens unevenly.', '果肉变软，成熟不均。']),
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
  ['p', ['Contoh: beza tinggi 1.5 m pada jarak mendatar 10 m ialah cerun 15%.', 'Example: a rise of 1.5 m over a run of 10 m is a 15% slope.', '例如：水平距离 10 米、高差 1.5 米，坡度即为 15%。']],
  ['tool', 'cerun'],
);

LESSONS['6-2'].body.push(
  ['h', ['Kandungan nutrien baja organik', 'Nutrients in organic manures', '有机肥的养分含量']],
  ['table', { head: [['Bahan', 'Material', '材料'], 'N', 'P₂O₅', 'K₂O'],
    rows: [
      [['Tahi ayam', 'Poultry manure', '鸡粪'], '2.2', '1.8', '1.1'],
      [['Tahi lembu', 'Cattle manure', '牛粪'], '1.4', '0.4', '2.0'],
      [['Baja kandang yang reput sepenuhnya', 'Well-rotted farmyard manure', '充分腐熟的厩肥'], '0.5', '0.2', '0.5'],
    ] }],
  ['note', ['Peratus mengikut berat, sebagai nilai lazim. Kandungan sebenar sangat berbeza mengikut makanan ternakan, alas kandang, penyimpanan dan kelembapan. Tandan kosong kelapa sawit kaya kalium, tetapi nilai yang diterbitkan berbeza-beza.',
            'Percent by weight, as typical values. Actual content varies widely with feed, bedding, storage and moisture. Oil palm empty fruit bunches are rich in potassium, but published values differ.',
            '按重量计的百分比，属常见数值。实际含量因饲料、垫料、贮存和含水量而差别很大。油棕空果串富含钾，但已发表的数值并不一致。']],
);

LESSONS['6-3'].body.push(
  ['h', ['Mengelakkan kehilangan nitrogen', 'Keeping nitrogen from escaping', '防止氮素损失']],
  ['ul', [
    ['Urea yang dibiarkan di permukaan kehilangan nitrogen ke udara sebagai gas ammonia. Semakin lama tanpa hujan, semakin banyak yang hilang.', 'Urea left on the surface loses nitrogen to the air as ammonia gas. The longer it sits without rain, the more is lost.', '留在地表的尿素会以氨气形式向空气损失氮。无雨的时间越长，损失越多。'],
    ['Hujan yang meresap atau pengairan sejurus selepas membaja membawa urea masuk ke dalam tanah. Hujan renyai boleh memburukkan keadaan kerana ia melarutkan urea tanpa membawanya masuk.', 'A soaking rain or irrigation soon after application carries urea into the soil. A light shower can make things worse, because it dissolves the urea without washing it in.', '施肥后不久的透雨或灌溉能把尿素带入土中。小雨反而可能更糟，因为它溶解了尿素却没有把它冲入土中。'],
    ['Gaulkan atau timbus urea, atau letak dalam jalur dan bukan ditabur rata.', 'Mix or cover the urea with soil, or place it in a band instead of broadcasting.', '把尿素混入土中或覆土，或者条施而不是撒施。'],
    ['Kehilangan lebih tinggi pada tanah berpasir, pada pH yang tinggi dan dalam cuaca panas serta berangin. Oleh itu, jangan tabur urea bersama kapur.', 'Losses are higher on sandy soil, at high pH and in warm, windy weather. For that reason, do not apply urea together with lime.', '在砂质土、pH 高以及炎热多风的天气下损失更大。因此，不要把尿素和石灰一起施用。'],
  ]],
);

SOURCES.push({ topic: ['Kelapa sawit, pokok buah dan kapur', 'Oil palm, fruit trees and lime', '油棕、果树与石灰'], items: [
  ['Applied Agricultural Resources (Malaysia) – Soil requirements of plantation tree crops', 'https://aarsb.com.my/soil-management-soil-requirements-of-plantation-tree-crops'],
  ['Applied Agricultural Resources (Malaysia) – Fertilizer management: principles', 'https://aarsb.com.my/fertilizer-management-principles'],
  ['Malaysian Palm Oil Board, Oil Palm Bulletin – Oil palm fertiliser recommendation for Sabah soils', 'https://opb.mpob.gov.my/oil-palm-fertiliser-recommendation-for-sabah-soils/'],
  ['Akvopedia (SNV / Wageningen University) – Sustainable Oil Palm Farming: Fertiliser recommendations', 'https://akvopedia.org/wiki/Sustainable_Oil_Palm_Farming_/_Fertiliser_recommendations'],
  ['Malaysian Palm Oil Board, Journal of Oil Palm Research – Effects of oil palm empty fruit bunches on nutrition, yield and soil', 'https://jopr.mpob.gov.my/the-effects-of-oil-palm-empty-fruit-bunches-on-oil-palm-nutrition-and-yield-and-soil-chemical-properties/?v=true'],
  ['International Tropical Fruits Network (TFNet) – Durian: fertiliser', 'http://www.itfnet.org/gfruit/Templates%20English/durian.agro.fert.htm'],
  ['International Tropical Fruits Network (TFNet) – Rambutan: fertiliser', 'http://www.itfnet.org/gfruit/Templates%20English/rambutan.agro.fert.htm'],
  ['International Tropical Fruits Network (TFNet) – Mango: fertiliser', 'http://www.itfnet.org/gfruit/Templates%20English/mango.agro.fert.htm'],
  ['Department of Agriculture Sarawak – Rambutan', 'https://doa.sarawak.gov.my/web/subpage/webpage_view/137'],
  ['Top Fruits (Malaysia) – Durian soil and climate essentials', 'https://topfruits.com.my/durian-soil-and-climate-essentials/'],
  ['Rare Fruit Council of Australia archives – Durian culture', 'https://mail.rfcarchives.org.au/Next/Fruits/Durian/DurianCulture3-81.htm'],
  ['Government of South Australia – Soil acidity and liming notes (lime requirement formula)', 'https://cdn.environment.sa.gov.au/landscape/docs/hf/soil-lime-notepad.pdf'],
  ['Purdue University Extension – Improving the efficient use of urea-containing fertilizers', 'https://www.ag.purdue.edu/agry/agry-extension/_docs/soil-fertility/improving-the-efficient-use-of-urea-containing-fertilizers.pdf'],
  ['Government of Manitoba – Volatilization losses from surface applied nitrogen', 'https://gov.mb.ca/agriculture/crops/soil-fertility/volatilization-losses-from-surface-applied-nitrogen.html'],
  ['Montana State University Extension – Reduce loss of ammonia gas from urea fertilizer', 'https://www.montana.edu/extension/roosevelt/ammoniagas.html'],
  ['FAO – Fertilizer use by crop in Ghana: organic sources of nutrients', 'https://www.fao.org/4/a0013e/a0013e08.htm'],
] });
