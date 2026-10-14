/* ============================================================
   RINGO — данные карточки товара (демо-данные прототипа А).
   Здесь собраны все свойства товара. Логика "если свойство
   не заполнено — блок скрывается" опирается на эти поля.
   ============================================================ */
window.RINGO_PRODUCT = {
  // --- идентификация ---
  sku: "RG-1042-BRD-585",
  name: "Золотое кольцо с бриллиантом 0,039 карата",
  category: { name: "Кольца", url: "/catalog/koltsa/" },
  type: { name: "Кольцо", url: "/catalog/koltsa/" },
  price: 85000,
  currency: "RUB",
  url: "/product/zolotoe-kolco-s-brilliantom-ringo/",

  // --- наличие (Блок 2) ---
  availability: {
    status: "InStock",              // InStock | PreOrder
    label: "В наличии в салоне Москва",
    city: "Москва"
  },

  // --- коллекция (Блок 4 + Блок 2). Заполнено => прототип А ---
  collection: {
    name: "Мозаика",
    url: "/collections/mozaika/",
    subtitle: "Коллекция «Мозаика»",
    story: [
      "«Мозаика» родилась из наблюдения за игрой света на гранях необработанного кристалла. Каждый элемент коллекции — это собранная вручную геометрия из полированного золота и глубокого чернения, где свет и тень существуют на равных.",
      "Дизайнеры RINGO выстроили линию вокруг принципа симметрии половинок: зеркальные ромбы, кубические соты, ступенчатые грани. Так рождается узнаваемый силуэт, объединяющий кольца, серьги, браслеты и колье коллекции в единую историю."
    ],
    gallery: [
      { src: "images/hero-set.jpg",     alt: "Коллекция «Мозаика» RINGO — комплект украшений" },
      { src: "images/hero-hand-finger.jpg", alt: "Коллекция «Мозаика» RINGO — кольцо на руке модели" },
      { src: "images/model-portrait.jpg", alt: "Коллекция «Мозаика» RINGO — образ с кольцом" }
    ]
  },

  // --- основной камень (Блок 3). Заполнено => секция «О камне» ---
  stone: {
    name: "Бриллиант",
    url: "/encyclopedia/brilliant/",
    image: { src: "images/prod-kolco-catalog.jpg", alt: "Макро-фото бриллианта в золотом кольце RINGO" },
    summary: [
      "Бриллиант — эталон твёрдости и чистоты среди драгоценных камней. Его ценность определяется системой «4C»: карат (вес), цвет, чистота и качество огранки. Именно огранка раскрывает знаменитую игру света — россыпь искр внутри камня.",
      "В этом кольце использованы бриллианты, огранка которых обращена в саму форму украшения: каждая грань металла продолжает линию камня и усиливает его блеск."
    ],
    fact: { key: "Твёрдость", val: "10 из 10 по шкале Мооса — самый твёрдый природный минерал на Земле." },
    factExtra: { key: "Символ", val: "Камень бриллиантовой свадьбы (60 лет брака) и классический выбор для помолвки." }
  },

  // --- галерея hero ---
  gallery: [
    { cap: "Каталог · ракурс 3/4",      kind: "photo", img: "images/prod-kolco-catalog.jpg", fit: "contain", grp: "Каталог" },
    { cap: "Каталог · фронтальный вид",  kind: "photo", img: "images/hero-ring-front.jpg",    fit: "contain", grp: "Каталог" },
    { cap: "Кольцо на руке",             kind: "photo", img: "images/hero-hand-finger.jpg",   fit: "cover",   grp: "На руке" },
    { cap: "Образ с кольцом",            kind: "photo", img: "images/model-portrait.jpg",     fit: "cover",   grp: "Образ" },
    { cap: "Комплект украшений",         kind: "photo", img: "images/hero-set.jpg",           fit: "cover",   grp: "Комплект" }
  ],

  sizeList: ["15.5","16","16.5","17","17.5","18","18.5","19","19.5","20"],
  sizeOutOfStock: ["15.5","18.5","20"],

  // --- Блок 5: поводы для подарка (сопоставлены по камню и типу) ---
  gifts: [
    { label: "Помолвочное кольцо", url: "/gifts/pomolvochnye-kolca/", accent: true, icon: "ring" },
    { label: "Бриллиантовая свадьба", url: "/gifts/brilliantovaya-svadba/", icon: "diamond" },
    { label: "Подарок жене", url: "/gifts/zhene/", icon: "heart" },
    { label: "Подарок девушке", url: "/gifts/devushke/", icon: "gift" },
    { label: "Подарок маме", url: "/gifts/mame/", icon: "flower" }
  ],

  // --- Блок 6, логика А: «Составьте комплект» (та же коллекция) ---
  suite: [
    { title: "Золотые серьги с бриллиантами 0,05 карата и чернением", price: "124 000 ₽", img: "images/prod-sergi.jpg",  url: "/product/zolotye-sergi-mozaika/" },
    { title: "Золотые пусеты с бриллиантами 0,042 карата",           price: "46 500 ₽",  img: "images/prod-pusety.jpg", url: "/product/zolotye-pusety-mozaika/" },
    { title: "Браслет из золота с бриллиантами 0,148 карата",         price: "210 000 ₽", img: "images/prod-braslet.jpg", url: "/product/zolotoy-braslet-mozaika/" }
  ],
  // --- Блок 6, логика А: «Похожие модели» (тот же камень, др. коллекции) ---
  similar: [
    { title: "Золотое кольцо с бриллиантами на 0,074 карата", price: "92 000 ₽",  img: "images/prod-kolco-catalog.jpg", url: "/product/zolotoe-kolco-brilliant-074/" },
    { title: "Золотые серьги с бриллиантами 0,05 карата",      price: "124 000 ₽", img: "images/prod-sergi.jpg",  url: "/product/zolotye-sergi-brilliant/" },
    { title: "Золотые пусеты с бриллиантами 0,042 карата",     price: "46 500 ₽",  img: "images/prod-pusety.jpg", url: "/product/zolotye-pusety-brilliant/" },
    { title: "Браслет из золота с бриллиантами 0,148 карата",   price: "210 000 ₽", img: "images/prod-braslet.jpg", url: "/product/zolotoy-braslet-brilliant/" }
  ],
  // теговая страница «[тип] с [камень]»
  tagPage: { label: "Смотреть все кольца с бриллиантом", url: "/catalog/koltsa-s-brilliantom/" }
};
