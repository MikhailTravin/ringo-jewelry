/* ==========================================================================
   RINGO — данные карточки товара (эмуляция выгрузки из CMS).
   Прототип А — коллекционное изделие (свойство «Коллекция» заполнено).
   Все условные блоки строятся по этим свойствам: если свойство пустое —
   соответствующий блок не рендерится (секции идут стык встык).
   ========================================================================== */
window.RINGO_PRODUCT = {
  // — базовые свойства товара —
  sku: 'RG-0417-BW',
  name: 'Золотое кольцо с бриллиантом 0,039 карата',
  type: 'Кольцо',            // тип изделия
  typePlural: 'кольца',      // для теговых страниц
  category: 'Кольца',
  categoryUrl: '/catalog/koltsa/',
  price: 85000,
  priceLabel: '85 000 ₽',
  currency: 'RUB',
  url: '/catalog/koltsa/zolotoe-kolco-s-brilliantom-rg-0417/',
  canonical: 'https://ringo-jewelry.ru/catalog/koltsa/zolotoe-kolco-s-brilliantom-rg-0417/',

  // — статус наличия (свойство товара) —
  availability: 'InStock',   // 'InStock' | 'PreOrder'
  availabilityText: 'В наличии в салоне Москва',
  preorderWeeks: null,

  // — коллекция (заполнено => прототип А) —
  collection: {
    name: 'Мозаика',
    url: '/collections/mozaika/',
    story: [
      'Коллекция «Мозаика» родилась из наблюдения за игрой света на гранях природного кристалла. Каждое изделие собрано из ромбовидных фрагментов — светлых и тёмных, — которые складываются в единый узор, будто мозаичное полотно.',
      'Мастера РИНГО сохранили в линии главный принцип: контраст полированного золота и глубокого чернения, между которыми загорается бриллиант чистой воды.'
    ],
    gallery: [
      { src: 'images/prod-set.jpg',        alt: 'Комплект коллекции «Мозаика» RINGO' },
      { src: 'images/prod-model.jpg',      alt: 'Кольцо из коллекции «Мозаика» на модели' },
      { src: 'images/prod-ring-finger.jpg',alt: 'Кольцо «Мозаика» с бриллиантом на руке' }
    ]
  },

  // — основной камень (заполнено => секция «О камне») —
  stone: {
    key: 'diamond',
    name: 'Бриллиант',
    summary: 'Бриллиант — эталон твёрдости и чистоты света. В украшениях РИНГО используются камни природного происхождения, огранённые так, чтобы вернуть максимум блеска даже при малом весе.',
    fact: {
      label: 'Ключевой факт',
      text: 'Твёрдость 10 по шкале Мооса — абсолютный максимум среди природных минералов. Именно поэтому бриллиант веками остаётся символом вечности.'
    },
    photo: { src: 'images/stone-diamond-macro.jpg', alt: 'Макро-фото бриллианта' },
    encyclopediaUrl: '/encyclopedia/brilliant/'
  },

  // — символика годовщин по камню (для блока «Подойдёт в подарок») —
  anniversary: {
    diamond: { title: 'Бриллиантовая свадьба', kicker: '60 лет вместе', url: '/gifts/godovshchiny/brilliantovaya-svadba/' },
    pearl:   { title: 'Жемчужная свадьба',     kicker: '30 лет вместе', url: '/gifts/godovshchiny/zhemchuzhnaya-svadba/' },
    ruby:    { title: 'Рубиновая свадьба',     kicker: '40 лет вместе', url: '/gifts/godovshchiny/rubinovaya-svadba/' },
    sapphire:{ title: 'Сапфировая свадьба',    kicker: '45 лет вместе', url: '/gifts/godovshchiny/sapfirovaya-svadba/' },
    emerald: { title: 'Изумрудная свадьба',    kicker: '55 лет вместе', url: '/gifts/godovshchiny/izumrudnaya-svadba/' }
  },

  // — галерея hero (порядок = порядок в галерее) —
  gallery: [
    { cap: 'Каталог · ракурс 3/4', kind: 'photo', src: 'images/prod-ring-34.jpg',     fit: 'contain', eager: true  },
    { cap: 'Кольцо на руке',       kind: 'photo', src: 'images/prod-ring-finger.jpg', fit: 'cover',   eager: false },
    { cap: 'На руке · в образе',   kind: 'photo', src: 'images/prod-model.jpg',       fit: 'cover',   eager: false },
    { cap: 'Комплект украшений',   kind: 'photo', src: 'images/prod-set.jpg',         fit: 'cover',   eager: false }
  ],

  sizeList: ['15.5','16','16.5','17','17.5','18','18.5','19','19.5','20'],
  outOfStock: ['15.5','18.5','20'],

  // — карточки «К этому украшению подойдут» —
  // Прототип А: комплект (та же коллекция) + похожие (тот же камень, др. коллекции)
  companionsSet: [
    { title: 'Золотые серьги «Мозаика» с бриллиантами 0,05 карата', price: '124 000 ₽', img: 'images/comp-sergi.jpg',  url: '/catalog/sergi/mozaika-sergi/' },
    { title: 'Золотые пусеты «Мозаика» с бриллиантами 0,042 карата', price: '46 500 ₽',  img: 'images/comp-pusety.jpg', url: '/catalog/pusety/mozaika-pusety/' },
    { title: 'Браслет «Мозаика» из золота с бриллиантами 0,148 карата', price: '210 000 ₽', img: 'images/comp-braslet.jpg', url: '/catalog/braslety/mozaika-braslet/' }
  ],
  companionsSimilar: [
    { title: 'Золотое кольцо с бриллиантами на 0,074 карата', price: '92 000 ₽',  img: 'images/comp-kolco.jpg',   url: '/catalog/koltsa/kolco-brilliant-0074/' },
    { title: 'Золотые серьги с бриллиантами 0,05 карата и чернением', price: '124 000 ₽', img: 'images/comp-sergi.jpg', url: '/catalog/sergi/sergi-brilliant-005/' },
    { title: 'Золотые пусеты с бриллиантами 0,042 карата', price: '46 500 ₽', img: 'images/comp-pusety.jpg', url: '/catalog/pusety/pusety-brilliant-0042/' }
  ],

  // — изображение для микроразметки / og —
  primaryImage: 'https://ringo-jewelry.ru/images/prod-ring-34.jpg',
  primaryImageW: 1000,
  primaryImageH: 1000
};
