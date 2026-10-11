/**
 * Help content — settings, appearance (the style picker `components/styl-wygladu-wybor.tsx`, styles
 * from `lib/wyglad/style.ts`, decisions D63–D67). A field group, not a screen: the settings page has
 * no Migawka of its own.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "ustawienia-wyglad": {
    pola: {
      styl: {
        nazwa: "Styl wyglądu",
        cel: "Zmienia kolory tła, kart i akcentu, czcionkę nagłówków i liczb oraz zaokrąglenia w całej aplikacji naraz. Nie zmienia żadnych obliczeń. Każdy styl przechodzi automatyczny test kontrastu werdyktów 🟢🟡🔴 (WCAG), a twardy stop 🔴 zostaje zawsze widoczny.",
        gdzie: "Wybierz styl z listy; zmiana działa od razu i zapisuje się w tej przeglądarce. Kolory ustawione niżej w sekcji kolorów mają pierwszeństwo przed stylem — przycisk przywracający domyślne kolory odsłania czysty styl.",
        zakres: "„Domyślny” albo jeden styl z grup Premium, Jasne, Eksperymentalne lub Ukryte i sezonowe. Styl ciemny jest zawsze ciemny, jasny zawsze jasny.",
      },
      ukryte: {
        nazwa: "Style ukryte i sezonowe",
        cel: "Pokazuje na liście dodatkową grupę stylów „dla zabawy” (np. retro albo sezonowe), które domyślnie są schowane, żeby nie zaśmiecały wyboru.",
        gdzie: "Zaznacz pole, aby grupa pojawiła się na liście; odznacz, aby ją schować. Wybrany już styl z tej grupy zostaje.",
        zakres: "Włączone albo wyłączone.",
      },
    },
  },
  "ustawienia-obiekt": {
    pola: {
      rodzaj: {
        nazwa: "Rodzaj obiektu",
        cel: "Mówi aplikacji, czy liczysz budynek całoroczny, czy mikroinstalację (kamper, altana lub domek ROD, garaż). Mikroinstalacja bierze zużycie z listy odbiorników, a nie ze strat ciepła budynku.",
        gdzie: "Wybierz z listy; zmiana zapisuje się od razu w tej przeglądarce.",
        zakres: "Budynek, kamper, altana lub domek ROD, garaż albo brak wyboru (aplikacja działa jak dotąd).",
      },
      miesiace: {
        nazwa: "Miesiące użytkowania",
        cel: "Mikroinstalacja bywa używana tylko w części roku (działka od wiosny do jesieni, kamper w sezonie). Zużycie w miesiącach bez zaznaczenia liczy się jako zero.",
        gdzie: "Zaznacz miesiące, w których faktycznie korzystasz z obiektu.",
        zakres: "Od jednego do dwunastu miesięcy; bez zaznaczenia aplikacja nie policzy zużycia mikroinstalacji.",
      },
      napiecie: {
        nazwa: "Napięcie układu",
        cel: "Wybierasz je raz dla całej mikroinstalacji. Ekrany, które pytają o napięcie akumulatora albo układu, pokażą obok swojego pola przycisk z tą wartością; nie wpisują jej same.",
        gdzie: "Z akumulatora albo z projektu instalacji (kamper i działka najczęściej 12 V albo 24 V).",
        zakres: "12, 24 albo 48 V; bez wyboru ekrany nic nie podpowiadają.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "ustawienia-wyglad": {
    pola: {
      styl: {
        nazwa: "Appearance style",
        cel: "Changes the colours of the background, cards and accent, the font of headings and numbers and the corner shapes across the whole app at once. It does not change any calculation. Every style passes an automatic contrast test of the verdicts 🟢🟡🔴 (WCAG), and a hard stop 🔴 always stays visible.",
        gdzie: "Pick a style from the list; the change applies at once and is saved in this browser. Colours set below in the colours section take precedence over the style — the button that restores the default colours reveals the pure style.",
        zakres: "“Default” or one style from the Premium, Light, Experimental or Hidden and seasonal groups. A dark style is always dark, a light one always light.",
      },
      ukryte: {
        nazwa: "Hidden and seasonal styles",
        cel: "Shows an extra group of “just for fun” styles (e.g. retro or seasonal) on the list; it is hidden by default so it does not clutter the choice.",
        gdzie: "Tick the box to show the group on the list; untick it to hide it. A style already chosen from this group stays.",
        zakres: "On or off.",
      },
    },
  },
  "ustawienia-obiekt": {
    pola: {
      rodzaj: {
        nazwa: "Type of site",
        cel: "Tells the app whether you are calculating a year-round building or a micro-installation (camper, garden-plot cabin, garage). A micro-installation takes its consumption from the list of appliances, not from building heat losses.",
        gdzie: "Pick from the list; the change is saved at once in this browser.",
        zakres: "Building, camper, garden-plot cabin, garage, or no choice (the app works as before).",
      },
      miesiace: {
        nazwa: "Months of use",
        cel: "A micro-installation is often used only part of the year (a garden plot from spring to autumn, a camper in season). Consumption in unticked months counts as zero.",
        gdzie: "Tick the months in which you actually use the site.",
        zakres: "From one to twelve months; with none ticked the app cannot calculate the micro-installation’s consumption.",
      },
      napiecie: {
        nazwa: "System voltage",
        cel: "You choose it once for the whole micro-installation. Screens that ask for the battery or system voltage show a button with this value next to their own field; they never fill it in themselves.",
        gdzie: "From the battery or the installation design (camper and garden plot most often 12 V or 24 V).",
        zakres: "12, 24 or 48 V; with no choice the screens suggest nothing.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "ustawienia-wyglad": {
    pola: {
      styl: {
        nazwa: "Стиль оформления",
        cel: "Меняет сразу во всём приложении цвета фона, карточек и акцента, шрифт заголовков и чисел, а также скругления. Не меняет никаких расчётов. Каждый стиль проходит автоматическую проверку контраста вердиктов 🟢🟡🔴 (WCAG), а жёсткий стоп 🔴 всегда остаётся видимым.",
        gdzie: "Выберите стиль из списка; изменение действует сразу и сохраняется в этом браузере. Цвета, заданные ниже в разделе цветов, имеют приоритет над стилем — кнопка восстановления цветов по умолчанию показывает чистый стиль.",
        zakres: "«По умолчанию» или один стиль из групп Премиум, Светлые, Экспериментальные или Скрытые и сезонные. Тёмный стиль всегда тёмный, светлый всегда светлый.",
      },
      ukryte: {
        nazwa: "Скрытые и сезонные стили",
        cel: "Показывает в списке дополнительную группу стилей «для развлечения» (например, ретро или сезонные), которая по умолчанию скрыта, чтобы не загромождать выбор.",
        gdzie: "Отметьте поле, чтобы группа появилась в списке; снимите отметку, чтобы скрыть её. Уже выбранный стиль из этой группы остаётся.",
        zakres: "Включено или выключено.",
      },
    },
  },
  "ustawienia-obiekt": {
    pola: {
      rodzaj: {
        nazwa: "Тип объекта",
        cel: "Сообщает приложению, считаете ли вы круглогодичное здание или микроустановку (кемпер, дачный домик, гараж). Микроустановка берёт потребление из списка потребителей, а не из теплопотерь здания.",
        gdzie: "Выберите из списка; изменение сразу сохраняется в этом браузере.",
        zakres: "Здание, кемпер, дачный домик, гараж или без выбора (приложение работает как раньше).",
      },
      miesiace: {
        nazwa: "Месяцы использования",
        cel: "Микроустановку часто используют лишь часть года (дача с весны до осени, кемпер в сезон). Потребление в неотмеченные месяцы считается нулевым.",
        gdzie: "Отметьте месяцы, в которые вы реально пользуетесь объектом.",
        zakres: "От одного до двенадцати месяцев; без отметок приложение не посчитает потребление микроустановки.",
      },
      napiecie: {
        nazwa: "Напряжение системы",
        cel: "Вы выбираете его один раз для всей микроустановки. Экраны, где спрашивают напряжение аккумулятора или системы, показывают рядом со своим полем кнопку с этим значением; сами они его не вписывают.",
        gdzie: "С аккумулятора или из проекта установки (кемпер и дача чаще всего 12 В или 24 В).",
        zakres: "12, 24 или 48 В; без выбора экраны ничего не предлагают.",
      },
    },
  },
}
