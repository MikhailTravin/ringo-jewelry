# ringo-jewelry — визуал из ringo-maket

Макеты Desktop/Main и остальные страницы сведены в одну адаптивную вёрстку (≤ 900 px — мобильная версия).
Без support.js / React / Swiper, без inline-стилей и inline-скриптов.

## Общий каркас (все страницы)
| Файл | Что внутри |
|---|---|
| css/site-chrome.css, js/site-chrome.js | шапка, мега-меню, нижняя панель и меню на мобильном, блок «Свяжитесь с нами», подвал (префикс `rg-`) |
| partials/site-header.html, partials/site-footer.html | разметка шапки и подвала для подключения на других страницах / в CMS |
| css/components.css, js/components.js | карточка товара `rg-card` (галерея фото, избранное) |

## Страницы по макету (заменены полностью)
- Главная: index.html (css/main-page.css, js/main-page.js)
- Информационные: o-brende, dostavka-i-oplata, process-oplati, certificate, programma-loyalnosti, proverka-podlinnosti,
  uhod-za-dragocennostyami, diplomy-i-sertifikaty, enciklopediya, rekvizity, agentskoe-soglashenie, vakansii
- Магазины: magaziny.html (js/stores.js — поиск, «показать ещё», карта)
- Кабинет и избранное: personal.html + personal-auth.html, favorite.html + favorite-auth.html (js/favorites.js)
- Стили всех внутренних страниц: css/inner-pages.css (префиксы `pg-`, `st-`, `ac-`, `fv-`)

## Страницы, которых нет в макете
akcii, braslety, eksljuzivnye-juvelirnye-ukrashenija, encyclopedia-izumrud, kollekcii, kollekciya-crystal, kollekciya-laurel,
korzina, magaziny-novosibirsk, magaziny-salon, podarki, podarok-sapfirovaya-svadba, product-card, product-catalog, design-system:
новая шапка/подвал + css/maket-theme.css: токены (серые тона, линии, фоны), шкала заголовков 48/34 и 48/30, выравнивание hero влево, надзаголовки brass без линий, контурные кнопки с золотым hover, чипы, поля, крошки, плоские плитки. Контент и собственные CSS/JS страниц сохранены.

Страницы личного кабинета в подпапке `personal/` (bonus, certificate, orders, private) тоже на новом каркасе;
в них пути к ассетам идут с префиксом `../`. Ссылки нового сайдбара кабинета (`personal-auth.html`) ведут на эти страницы.
`prototipy.html` — презентационный прототип для дизайнера, не страница сайта, оставлен без изменений.

## Подключение каркаса на новой странице
1. `<head>`: css/ringo.css → css/site-chrome.css → (css/components.css) → css страницы.
2. Вместо старых `<header>`/`<footer>` — partials/site-header.html и partials/site-footer.html.
3. Перед `</body>`: js/site-chrome.js.
Страница с баннером: `<body class="has-hero-header">`, баннер `[data-hero]`, блок, наезжающий на баннер, — `data-header-trigger`.
Без баннера шапка белая, отступ сверху ставится автоматически.

`home.css`, `ringo.css`, `header.js` не менялись (на них опираются остальные страницы).
