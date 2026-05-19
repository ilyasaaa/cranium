// Bilingual strings + site metadata
const STRINGS = {
  ru: {
    navMethod: "Метод",
    navCalc:   "Калькулятор",
    navCompare:"Сравнение",
    navAbout:  "О работе",

    // Landing
    eyebrow:     "Дипломная работа · 2026 · РГПУ им. Герцена",
    h1Part1:     "Сколько лет",
    h1Part2:     "этому черепу",
    h1Part3:     "?",
    leadKicker:  "Регрессионная модель Самохиной",
    lead:        "Веб-инструмент для судебных антропологов и остеологов. Десять баллов облитерации швов свода, четыре нёбных шва, пол — и комплексная модель возвращает расчётный возраст за миллисекунды.",
    formulaLabel:"Ядро модели",
    sLabel:      "сумма баллов Meindl & Lovejoy",
    pLabel:      "сумма баллов нёбных швов",
    gLabel:      "пол (1 — м, 0 — ж)",
    ctaStart:    "Начать оценку",
    ctaMethod:   "О методике",
    sampleLabel: "Выборка",
    sampleValue: "129 черепов МАЭ РАН",
    rangeLabel:  "Возрастной диапазон",
    rangeValue:  "15 – 90 лет",
    bestLabel:   "Наилучшая точность",
    bestValue:   "30 – 49 лет (MAE 4,6)",
    methodTitle: "Метод",
    methodLead:  "Облитерация черепных швов — один из старейших антропологических признаков возраста. Швы зарастают на протяжении всей взрослой жизни, и эта динамика поддаётся численному описанию.",
    methodP1:    "Модель построена на 129 черепах из остеологической коллекции МАЭ РАН — преимущественно русские, XIX – XX вв. Облитерация оценивалась по шкале Meindl & Lovejoy (0 – 3) для десяти участков свода и в бинарной форме (0 / 1) для четырёх нёбных швов.",
    methodP2:    "Линейная регрессия по сумме баллов и полу даёт прогноз возраста с минимальной средней абсолютной ошибкой в диапазоне 30 – 49 лет (4,6 года). За пределами этого диапазона модель закономерно теряет точность.",
    authorsTitle:"Авторы",
    authors:     [
      ["Самохина Майя Ильинична", "автор · РГПУ им. Герцена"],
      ["Никитина Елена Александровна", "научный руководитель"],
      ["Широбоков Иван Григорьевич", "консультант · МАЭ РАН"]
    ],
    disclaimer:  "Инструмент носит вспомогательный характер и не заменяет комплексное экспертное исследование. Не апробирован на иных этнических группах.",

    // Calculator
    calcTitle:   "Калькулятор возраста",
    sex:         "Пол",
    male:        "Мужчина",
    female:      "Женщина",
    chooseSex:   "Выберите пол индивида",

    sectionVault:"Свод черепа · Meindl & Lovejoy",
    sectionPalate:"Нёбные швы",
    viewTop:     "Сверху",
    viewLateral: "Сбоку",
    viewPalate:  "Снизу",
    paired:      "парный",
    score:       "балл",
    sumS:        "Сумма S",
    sumP:        "Сумма P",

    scoreHelp: [
      "0 — шов полностью открыт",
      "1 — единичные костные мостики",
      "2 — значительная облитерация",
      "3 — полное заращение"
    ],
    palateHelp: [
      "0 — шов различим",
      "1 — частичная или полная облитерация"
    ],

    // result
    resultTitle: "Расчётный возраст",
    years:       "лет",
    rangeText:   "± MAE по группе",
    mae:         "MAE",
    bias:        "Bias",
    yearsShort:  "лет",
    warnYoung:   "В возрастном диапазоне ≤ 29 лет модель имеет ограниченную точность (MAE 13,6, систематическое завышение). Рекомендуется использовать дополнительные методики.",
    warnOld:     "В возрастном диапазоне ≥ 60 лет модель систематически занижает возраст (bias до −20 лет). Рекомендуется использовать DRNNAGE.",
    warnBest:    "Модель показывает наилучшую точность в этом диапазоне.",
    enterData:   "Введите данные осмотра, чтобы увидеть результат",
    needSex:     "Выберите пол индивида, чтобы начать",
    reset:       "Сбросить",
    loadDemo:    "Демо-данные",

    accuracyTitle: "Точность по возрастным группам",
    showHide:     "Показать",
    hide:         "Свернуть",

    // Comparison
    compareTitle:  "Сравнение методик",
    compareLead:   "Три подхода к оценке возраста по черепу — на одной выборке. Модель Самохиной устойчивее в средних диапазонах; DRNNAGE — для возрастных индивидов.",
    methodA:       "Модель Самохиной (2026)",
    methodADesc:   "Комплексная регрессия по сводным и нёбным швам",
    methodB:       "Meindl & Lovejoy (1985)",
    methodBDesc:   "Классическая шкала по 10 участкам свода",
    methodC:       "DRNNAGE (Navega et al., 2018)",
    methodCDesc:   "Нейросетевая модель по 10 участкам свода",
    ageGroup:      "Возрастная группа",
    recTitle:      "Рекомендация",
    recBody:       "Для индивидов моложе 40 лет — модель Самохиной или Meindl & Lovejoy. Для лиц старше 60 — DRNNAGE.",

    // anatomy labels
    sites: {
      midlambdoid: ["Midlambdoid", "Средняя часть ламбдовидного шва"],
      lambda:      ["Lambda", "Лямбда"],
      obelion:     ["Obelion", "Обелион"],
      antSagittal: ["Anterior Sagittal", "Передний сагиттальный"],
      bregma:      ["Bregma", "Брегма"],
      midcoronal:  ["Midcoronal", "Средняя часть венечного шва"],
      pterion:     ["Pterion", "Птерион"],
      sphenofrontal:["Sphenofrontal", "Клиновидно-лобный"],
      infSpheno:   ["Inf. Sphenotemporal", "Нижний височно-клиновидный"],
      supSpheno:   ["Sup. Sphenotemporal", "Верхний височно-клиновидный"],

      transverseL: ["Transverse L",  "Поперечный шов · левый"],
      transverseR: ["Transverse R",  "Поперечный шов · правый"],
      medAnt:      ["Median Anterior","Передний отдел медиального"],
      medPost:     ["Median Posterior","Задний отдел медиального"]
    },
    left:  "L",
    right: "R",

    // explainers
    photoCaption: "Перетащите сюда фотографию для отчёта.",
    photoLabel: "Фото исследуемого образца",
  },
  en: {
    navMethod: "Method",
    navCalc:   "Calculator",
    navCompare:"Comparison",
    navAbout:  "About",

    eyebrow:     "MA Thesis · 2026 · Herzen State Pedagogical University",
    h1Part1:     "How old is",
    h1Part2:     "this skull",
    h1Part3:     "?",
    leadKicker:  "Samokhina's regression model",
    lead:        "A web tool for forensic anthropologists and osteologists. Ten cranial-vault closure scores, four palatine sutures, sex — and a composite regression returns an age estimate in milliseconds.",
    formulaLabel:"Model core",
    sLabel:      "sum of Meindl & Lovejoy scores",
    pLabel:      "sum of palatine suture scores",
    gLabel:      "sex (1 = m, 0 = f)",
    ctaStart:    "Begin estimation",
    ctaMethod:   "About the method",
    sampleLabel: "Sample",
    sampleValue: "129 MAE RAS skulls",
    rangeLabel:  "Age range",
    rangeValue:  "15 – 90 years",
    bestLabel:   "Best accuracy",
    bestValue:   "30 – 49 yrs (MAE 4.6)",
    methodTitle: "Method",
    methodLead:  "Cranial suture closure is one of the oldest anthropological age indicators. Sutures fuse over the entire adult life, and this dynamic can be quantified.",
    methodP1:    "The model was built on 129 skulls from the MAE RAS collection — predominantly Russian, 19th – 20th c. Closure was scored on the Meindl & Lovejoy scale (0 – 3) for ten vault sites and in binary form (0 / 1) for four palatine sutures.",
    methodP2:    "A linear regression on score sums and sex yields an age prediction with a minimum mean absolute error in the 30 – 49 range (4.6 years). Outside this band the model loses accuracy in a predictable way.",
    authorsTitle:"Authors",
    authors:     [
      ["Mayya I. Samokhina", "author · Herzen University"],
      ["Elena A. Nikitina", "supervisor"],
      ["Ivan G. Shirobokov", "advisor · MAE RAS"]
    ],
    disclaimer:  "This tool is auxiliary and does not replace expert examination. Not validated on populations outside the training sample.",

    calcTitle:   "Age calculator",
    sex:         "Sex",
    male:        "Male",
    female:      "Female",
    chooseSex:   "Choose sex of the individual",

    sectionVault:"Cranial vault · Meindl & Lovejoy",
    sectionPalate:"Palatine sutures",
    viewTop:     "Superior",
    viewLateral: "Lateral",
    viewPalate:  "Inferior",
    paired:      "paired",
    score:       "score",
    sumS:        "Sum S",
    sumP:        "Sum P",

    scoreHelp: [
      "0 — suture fully open",
      "1 — single bony bridges",
      "2 — significant closure",
      "3 — complete obliteration"
    ],
    palateHelp: [
      "0 — suture visible",
      "1 — partial or complete closure"
    ],

    resultTitle: "Estimated age",
    years:       "years",
    rangeText:   "± MAE for age group",
    mae:         "MAE",
    bias:        "Bias",
    yearsShort:  "yrs",
    warnYoung:   "In the ≤ 29 range the model has limited accuracy (MAE 13.6, systematic over-estimation). Use additional methods.",
    warnOld:     "In the ≥ 60 range the model systematically under-estimates age (bias up to −20 yrs). Use DRNNAGE.",
    warnBest:    "The model is at its most accurate in this range.",
    enterData:   "Enter examination data to see a result",
    needSex:     "Choose sex of the individual to begin",
    reset:       "Reset",
    loadDemo:    "Demo data",

    accuracyTitle: "Accuracy by age group",
    showHide:     "Show",
    hide:         "Hide",

    compareTitle:  "Method comparison",
    compareLead:   "Three approaches to skull age estimation, evaluated on the same sample. Samokhina's model is more stable in middle ranges; DRNNAGE wins for older individuals.",
    methodA:       "Samokhina's model (2026)",
    methodADesc:   "Composite regression on vault + palatine sutures",
    methodB:       "Meindl & Lovejoy (1985)",
    methodBDesc:   "Classical 10-site vault scale",
    methodC:       "DRNNAGE (Navega et al., 2018)",
    methodCDesc:   "Neural-network model on 10 vault sites",
    ageGroup:      "Age group",
    recTitle:      "Recommendation",
    recBody:       "For individuals younger than 40 — Samokhina or Meindl & Lovejoy. For ≥ 60 — DRNNAGE.",

    sites: {
      midlambdoid: ["Midlambdoid", "Mid-lambdoid suture"],
      lambda:      ["Lambda", "Lambda"],
      obelion:     ["Obelion", "Obelion"],
      antSagittal: ["Anterior Sagittal", "Anterior sagittal"],
      bregma:      ["Bregma", "Bregma"],
      midcoronal:  ["Midcoronal", "Mid-coronal suture"],
      pterion:     ["Pterion", "Pterion"],
      sphenofrontal:["Sphenofrontal", "Spheno-frontal"],
      infSpheno:   ["Inf. Sphenotemporal", "Inferior spheno-temporal"],
      supSpheno:   ["Sup. Sphenotemporal", "Superior spheno-temporal"],

      transverseL: ["Transverse L",  "Transverse suture · left"],
      transverseR: ["Transverse R",  "Transverse suture · right"],
      medAnt:      ["Median Anterior","Median anterior"],
      medPost:     ["Median Posterior","Median posterior"]
    },
    left:  "L",
    right: "R",

    photoCaption: "Drop a specimen photograph here for the report.",
    photoLabel:   "Specimen photograph",
  }
};

// accuracy table for results
const ACCURACY = [
  { group: "≤ 29",   range: [0, 29],   mae: 13.6, bias: +13.6 },
  { group: "30–39",  range: [30, 39],  mae: 6.9,  bias: +5.8  },
  { group: "40–49",  range: [40, 49],  mae: 4.6,  bias: -2.3  },
  { group: "50–59",  range: [50, 59],  mae: 9.4,  bias: -8.6  },
  { group: "60–69",  range: [60, 69],  mae: 15.5, bias: -14.4 },
  { group: "70+",    range: [70, 999], mae: 20.3, bias: -20.3 },
];

function maeForAge(age) {
  if (age == null || isNaN(age)) return ACCURACY[2];
  for (const row of ACCURACY) {
    if (age >= row.range[0] && age <= row.range[1]) return row;
  }
  return ACCURACY[ACCURACY.length - 1];
}

const COMPARISON_DATA = [
  // mae for Samokhina / M&L / DRNNAGE
  { group: "≤ 29",  mae: [13.6, 11.4, 16.8] },
  { group: "30–39", mae: [ 6.9,  7.2,  9.1] },
  { group: "40–49", mae: [ 4.6,  6.8,  7.2] },
  { group: "50–59", mae: [ 9.4, 10.1,  7.6] },
  { group: "60–69", mae: [15.5, 16.2,  6.4] },
  { group: "70+",   mae: [20.3, 21.8,  8.9] },
];

Object.assign(window, { STRINGS, ACCURACY, COMPARISON_DATA, maeForAge });
