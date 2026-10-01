/**
 * Appearance styles: the style picker in the settings (`components/styl-wygladu-wybor.tsx`) and the
 * style names/descriptions from the style table (`lib/wyglad/style.ts`, decisions D63–D67).
 * Descriptions follow the owner-approved prototype (artifact JsYnhZYECTQtSTAPAj4kmL).
 */
export const pl = {
  "UI-WYGLAD-STYL-TYTUL": "Styl wyglądu",
  "UI-WYGLAD-STYL-OPIS":
    "Gotowy zestaw kolorów, czcionek i zaokrągleń dla całej aplikacji. Kolory werdyktu 🟢🟡🔴 zostają zawsze czytelne. Twoje własne kolory niżej mają pierwszeństwo przed stylem. Wybór zapisuje się automatycznie.",
  "UI-WYGLAD-STYL-DOMYSLNY": "Domyślny",
  "UI-WYGLAD-STYL-DOMYSLNY-OPIS": "Obecny wygląd aplikacji; jasny lub ciemny według przełącznika motywu.",
  "UI-WYGLAD-GRUPA-PREMIUM": "Premium",
  "UI-WYGLAD-GRUPA-JASNE": "Jasne",
  "UI-WYGLAD-GRUPA-EKSPERYMENTALNE": "Eksperymentalne",
  "UI-WYGLAD-GRUPA-UKRYTE": "Ukryte i sezonowe",
  "UI-WYGLAD-GRUPA-PUSTA": "Style z tej grupy dojdą w kolejnych partiach.",
  "UI-WYGLAD-POKAZ-UKRYTE": "Pokaż style ukryte i sezonowe",
  "UI-WYGLAD-SCHEMAT-CIEMNY": "Ten styl jest zawsze ciemny. Przełącznik motywu działa przy stylu „Domyślny”.",
  "UI-WYGLAD-SCHEMAT-JASNY": "Ten styl jest zawsze jasny. Przełącznik motywu działa przy stylu „Domyślny”.",
  "UI-STYL-GRAFIT-ZLOTO": "Grafit + złoto",
  "UI-STYL-GRAFIT-ZLOTO-OPIS": "Ciemny grafit z akcentem szampańskiego złota, szeryfowe nagłówki. Elegancki, dużo powietrza.",
  "UI-STYL-GRANAT-MIEDZ": "Granat + miedź",
  "UI-STYL-GRANAT-MIEDZ-OPIS": "Głęboki granat z miedzianym akcentem, cieplejszy klimat zachodu słońca.",
  "UI-STYL-JASNY-ARCH": "Jasny architektoniczny",
  "UI-STYL-JASNY-ARCH-OPIS": "Ciepła biel i złoty akcent. Na słońce i do pokazania klientowi na tablecie.",
  "UI-STYL-ROZDZIELNICA": "Rozdzielnica",
  "UI-STYL-ROZDZIELNICA-OPIS":
    "Szara obudowa jak rozdzielnica elektryczna (RAL 7035), liczby pismem maszynowym, akcent w elektrycznym błękicie.",
  "UI-STYL-OLED": "OLED oszczędny",
  "UI-STYL-OLED-OPIS":
    "Czysta czerń i cienkie szare linie. Na ekranach OLED czarne piksele są wyłączone, więc styl oszczędza baterię telefonu (nie dotyczy ekranów LCD).",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-WYGLAD-STYL-TYTUL": "Appearance style",
  "UI-WYGLAD-STYL-OPIS":
    "A ready set of colours, fonts and corner shapes for the whole app. The verdict colours 🟢🟡🔴 always stay readable. Your own colours below take precedence over the style. Your choice is saved automatically.",
  "UI-WYGLAD-STYL-DOMYSLNY": "Default",
  "UI-WYGLAD-STYL-DOMYSLNY-OPIS": "The current look of the app; light or dark according to the theme switch.",
  "UI-WYGLAD-GRUPA-PREMIUM": "Premium",
  "UI-WYGLAD-GRUPA-JASNE": "Light",
  "UI-WYGLAD-GRUPA-EKSPERYMENTALNE": "Experimental",
  "UI-WYGLAD-GRUPA-UKRYTE": "Hidden and seasonal",
  "UI-WYGLAD-GRUPA-PUSTA": "Styles in this group will come in later batches.",
  "UI-WYGLAD-POKAZ-UKRYTE": "Show hidden and seasonal styles",
  "UI-WYGLAD-SCHEMAT-CIEMNY": "This style is always dark. The theme switch works with the “Default” style.",
  "UI-WYGLAD-SCHEMAT-JASNY": "This style is always light. The theme switch works with the “Default” style.",
  "UI-STYL-GRAFIT-ZLOTO": "Graphite + gold",
  "UI-STYL-GRAFIT-ZLOTO-OPIS": "Dark graphite with a champagne-gold accent and serif headings. Elegant, with plenty of space.",
  "UI-STYL-GRANAT-MIEDZ": "Navy + copper",
  "UI-STYL-GRANAT-MIEDZ-OPIS": "Deep navy with a copper accent, a warmer sunset mood.",
  "UI-STYL-JASNY-ARCH": "Light architectural",
  "UI-STYL-JASNY-ARCH-OPIS": "Warm white with a gold accent. For bright sunlight and for showing a client on a tablet.",
  "UI-STYL-ROZDZIELNICA": "Switchboard",
  "UI-STYL-ROZDZIELNICA-OPIS":
    "Grey housing like an electrical distribution board (RAL 7035), numbers in a monospaced font, electric-blue accent.",
  "UI-STYL-OLED": "OLED saver",
  "UI-STYL-OLED-OPIS":
    "Pure black and thin grey lines. On OLED screens black pixels are switched off, so the style saves phone battery (not on LCD screens).",
}

export const ru: Record<Klucz, string> = {
  "UI-WYGLAD-STYL-TYTUL": "Стиль оформления",
  "UI-WYGLAD-STYL-OPIS":
    "Готовый набор цветов, шрифтов и скруглений для всего приложения. Цвета вердикта 🟢🟡🔴 всегда остаются читаемыми. Ваши собственные цвета ниже имеют приоритет над стилем. Выбор сохраняется автоматически.",
  "UI-WYGLAD-STYL-DOMYSLNY": "По умолчанию",
  "UI-WYGLAD-STYL-DOMYSLNY-OPIS": "Текущий вид приложения; светлый или тёмный в зависимости от переключателя темы.",
  "UI-WYGLAD-GRUPA-PREMIUM": "Премиум",
  "UI-WYGLAD-GRUPA-JASNE": "Светлые",
  "UI-WYGLAD-GRUPA-EKSPERYMENTALNE": "Экспериментальные",
  "UI-WYGLAD-GRUPA-UKRYTE": "Скрытые и сезонные",
  "UI-WYGLAD-GRUPA-PUSTA": "Стили этой группы появятся в следующих партиях.",
  "UI-WYGLAD-POKAZ-UKRYTE": "Показать скрытые и сезонные стили",
  "UI-WYGLAD-SCHEMAT-CIEMNY": "Этот стиль всегда тёмный. Переключатель темы работает со стилем «По умолчанию».",
  "UI-WYGLAD-SCHEMAT-JASNY": "Этот стиль всегда светлый. Переключатель темы работает со стилем «По умолчанию».",
  "UI-STYL-GRAFIT-ZLOTO": "Графит + золото",
  "UI-STYL-GRAFIT-ZLOTO-OPIS": "Тёмный графит с акцентом цвета шампанского золота, заголовки с засечками. Элегантный, много воздуха.",
  "UI-STYL-GRANAT-MIEDZ": "Тёмно-синий + медь",
  "UI-STYL-GRANAT-MIEDZ-OPIS": "Глубокий тёмно-синий с медным акцентом, более тёплое настроение заката.",
  "UI-STYL-JASNY-ARCH": "Светлый архитектурный",
  "UI-STYL-JASNY-ARCH-OPIS": "Тёплый белый с золотым акцентом. Для яркого солнца и показа клиенту на планшете.",
  "UI-STYL-ROZDZIELNICA": "Электрощит",
  "UI-STYL-ROZDZIELNICA-OPIS":
    "Серый корпус как у электрощита (RAL 7035), цифры моноширинным шрифтом, акцент электрического синего цвета.",
  "UI-STYL-OLED": "OLED-экономный",
  "UI-STYL-OLED-OPIS":
    "Чистый чёрный и тонкие серые линии. На OLED-экранах чёрные пиксели выключены, поэтому стиль экономит батарею телефона (не касается LCD-экранов).",
}
