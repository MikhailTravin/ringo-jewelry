/* ============================================================
   RINGO — данные карточки товара (демо-данные прототипа Б).
   Прототип Б — каталожное изделие ВНЕ коллекции.
   Отличия от А: свойство collection НЕ заполнено (=> секция
   «История коллекции» и строка «Коллекция» скрыты, а в блоке
   «Сочетается с» вместо «Составьте комплект» — подбор по
   категории/типу изделия).
   ============================================================ */
window.RINGO_PRODUCT = {
  // --- идентификация ---
  sku: "RG-2210-ENG-585",
  name: "Помолвочное кольцо с бриллиантом 0,15 карата",
  category: { name: "Помолвочные кольца", url: "/catalog/pomolvochnye-kolca/" },
  type: { name: "Помолвочное кольцо", url: "/catalog/pomolvochnye-kolca/" },
  price: 74500,
  currency: "RUB",
  url: "/product/pomolvochnoe-kolco-brilliant-015/",

  // --- наличие ---
  availability: {
    status: "InStock",
    label: "В наличии в салоне Москва",
    city: "Москва"
  },

  // --- коллекция: НЕ заполнено => прототип Б (каталожное изделие вне коллекции) ---
  collection: null,

  // --- основной камень: ЗАПОЛНЕНО => секция «О камне» ОСТАЁТСЯ (как в А) ---
  stone: {
    name: "Бриллиант",
    url: "/encyclopedia/brilliant/",
    image: { src: "images/prod-kolco-catalog.jpg", alt: "Макро-фото бриллианта в помолвочном кольце RINGO" },
    summary: [
      "Бриллиант — эталон твёрдости и чистоты среди драгоценных камней. Его ценность определяется системой «4C»: карат (вес), цвет, чистота и качество огранки. Именно огранка раскрывает знаменитую игру света — россыпь искр внутри камня.",
      "В этом помолвочном кольце центральный бриллиант закреплён в классическом крапановом касте, приподнятом над шинкой, — так камень получает максимум света со всех сторон."
    ],
    fact: { key: "Твёрдость", val: "10 из 10 по шкале Мооса — самый твёрдый природный минерал на Земле." },
    factExtra: { key: "Символ", val: "Классический выбор для помолвки и символ вечной верности." }
  },

  // --- галерея hero ---
  gallery: [
    { cap: "Каталог · ракурс 3/4",     kind: "photo", img: "images/hero-ring-front.jpg",      fit: "contain", grp: "Каталог" },
    { cap: "Каталог · фронтальный вид", kind: "photo", img: "images/prod-kolco-catalog.jpg",   fit: "contain", grp: "Каталог" },
    { cap: "Кольцо на руке",            kind: "photo", img: "images/hero-hand-finger.jpg",     fit: "cover",   grp: "На руке" },
    { cap: "Образ с кольцом",           kind: "photo", img: "images/model-portrait.jpg",       fit: "cover",   grp: "Образ" },
    { cap: "Кольцо в подарочной коробке", kind: "photo", img: "images/hero-set.jpg",           fit: "cover",   grp: "Подача" }
  ],

  sizeList: ["15.5","16","16.5","17","17.5","18","18.5","19","19.5","20"],
  sizeOutOfStock: ["15.5","20"],

  // --- поводы для подарка (по типу изделия и камню) ---
  gifts: [
    { label: "Помолвка", url: "/gifts/pomolvka/", accent: true, icon: "ring" },
    { label: "Предложение руки и сердца", url: "/gifts/predlozhenie/", icon: "diamond" },
    { label: "Подарок девушке", url: "/gifts/devushke/", icon: "heart" },
    { label: "Годовщина отношений", url: "/gifts/godovshchina/", icon: "gift" },
    { label: "День рождения", url: "/gifts/den-rozhdeniya/", icon: "flower" }
  ],

  // --- Блок 6, логика Б: подбор по КАТЕГОРИИ / КАМНЮ (нет коллекции) ---
  // «Составьте комплект» ОТСУТСТВУЕТ (нет коллекции).
  // Остаётся подбор похожих изделий той же категории и с тем же камнем.
  suite: null,
  similar: [
    { title: "Помолвочное кольцо с бриллиантом 0,20 карата",   price: "96 000 ₽",  img: "images/prod-kolco-catalog.jpg", url: "/product/pomolvochnoe-kolco-brilliant-020/" },
    { title: "Помолвочное кольцо с бриллиантом 0,10 карата",   price: "58 000 ₽",  img: "images/hero-ring-front.jpg",    url: "/product/pomolvochnoe-kolco-brilliant-010/" },
    { title: "Помолвочное кольцо-дорожка с бриллиантами",       price: "82 000 ₽",  img: "images/prod-sergi.jpg",         url: "/product/pomolvochnoe-kolco-dorozhka/" },
    { title: "Помолвочное кольцо с бриллиантом «принцесса»",     price: "110 000 ₽", img: "images/prod-braslet.jpg",       url: "/product/pomolvochnoe-kolco-printsessa/" }
  ],
  // теговая страница «Все [категория] с [камень]»
  tagPage: { label: "Смотреть все помолвочные кольца с бриллиантом", url: "/catalog/pomolvochnye-kolca-s-brilliantom/" }
};
