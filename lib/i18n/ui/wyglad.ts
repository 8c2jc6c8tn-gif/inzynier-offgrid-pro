/**
 * Appearance styles: the style picker in the settings (`components/styl-wygladu-wybor.tsx`) and the
 * style names/descriptions from the style table (`lib/wyglad/style.ts`, decisions D63–D67).
 * Descriptions follow the owner-approved prototype (artifact JsYnhZYECTQtSTAPAj4kmL).
 */
// English: ./wyglad.en.ts, Russian: ./wyglad.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
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
  "UI-WYGLAD-IKONY-TYTUL": "Ilustracje modułów",
  "UI-WYGLAD-IKONY-OPIS": "Obrazek na kafelku pulpitu i na górze strony modułu. Wybór zapisuje się automatycznie i nie zmienia żadnych obliczeń.",
  "UI-WYGLAD-IKONY-BOB": "Maskotka Bob",
  "UI-WYGLAD-IKONY-BOB-OPIS": "Bob w kasku przy każdym module (jak dotąd).",
  "UI-WYGLAD-IKONY-3D": "Ikony 3D",
  "UI-WYGLAD-IKONY-3D-OPIS": "Bez maskotki: jedna ikona 3D na moduł, w tym samym miejscu.",
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
  "UI-STYL-TYTAN": "Tytan",
  "UI-STYL-TYTAN-OPIS":
    "Chłodny grafit z platynowymi ramkami. Techniczny luksus jak sprzęt pomiarowy.",
  "UI-STYL-LAS-MOSIADZ": "Las + mosiądz",
  "UI-STYL-LAS-MOSIADZ-OPIS":
    "Ciemna leśna zieleń i mosiądz, klimat domu w lesie. Najcieplejszy z ciemnych stylów.",
  "UI-STYL-KRESLARSKI": "Kreślarski",
  "UI-STYL-KRESLARSKI-OPIS":
    "Granat z delikatną siatką kreślarską i cienkimi białymi ramkami, jak rysunek techniczny.",
  "UI-STYL-NOC-POLARNA": "Noc polarna",
  "UI-STYL-NOC-POLARNA-OPIS":
    "Bardzo ciemny granat i lodowy błękit. Na scenariusz „zima, −20 °C, 3 dni bez słońca”.",
  "UI-STYL-ROZOWE-ZLOTO": "Różowe złoto",
  "UI-STYL-ROZOWE-ZLOTO-OPIS":
    "Grafit z nutą śliwki, ramki i akcenty w różowym złocie. Elegancki, ale wciąż ciemny i techniczny.",
  "UI-STYL-POMARANCZ": "Pomarańcz sygnałowy",
  "UI-STYL-POMARANCZ-OPIS":
    "Czarny grafit z pomarańczowymi krawędziami kart, jak obudowy elektronarzędzi. Pomarańcz tylko na krawędziach i przyciskach.",
  "UI-STYL-ZACHOD": "Zachód słońca",
  "UI-STYL-ZACHOD-OPIS":
    "Głęboki fiolet nocy z brzoskwiniowymi ramkami. Spokojny ciemny styl w ciepłych barwach.",
  "UI-STYL-PUDROWY-ROZ": "Pudrowy róż",
  "UI-STYL-PUDROWY-ROZ-OPIS":
    "Jasny, ciepły róż jak papier listowy, akcent śliwkowo-malinowy. Najłagodniejszy styl.",
  "UI-STYL-SLONECZNY": "Słoneczny poranek",
  "UI-STYL-SLONECZNY-OPIS":
    "Jasne niebo u góry przechodzące w ciepłą biel, granatowe przyciski i tekst.",
  "UI-STYL-EINK": "E-ink",
  "UI-STYL-EINK-OPIS":
    "Wygląd czytnika e-booków: szare tło, czarny tusz, zero ozdób. Kolor mają tylko werdykty. To styl wyglądu, nie obsługa czytników e-ink.",
  "UI-STYL-MARMUR": "Marmur i złoto",
  "UI-STYL-MARMUR-OPIS":
    "Biały marmur z delikatnymi żyłkami i złoty akcent. Luksusowy jak hol hotelu.",
  "UI-STYL-ZEN": "Zen",
  "UI-STYL-ZEN-OPIS":
    "Papier washi, czarny tusz i dużo pustej przestrzeni. Akcent w japońskim indygo.",
  "UI-STYL-HOLO": "Holograficzny",
  "UI-STYL-HOLO-OPIS":
    "Ciemne tło i ramki kart jak folia holograficzna, z powoli przelewającym się tęczowym połyskiem. Werdykty bez tęczy.",
  "UI-STYL-HUD": "Kokpit HUD",
  "UI-STYL-HUD-OPIS":
    "Wyświetlacz jak w kokpicie: czerń, cienkie turkusowe linie, linie skanowania, nagłówki i liczby pismem maszynowym.",
  "UI-STYL-SZKLO": "Szkło",
  "UI-STYL-SZKLO-OPIS":
    "Karty z matowego szkła na ciemnym, miękko podświetlonym tle. Na słabszych telefonach karty bez rozmycia.",
  "UI-STYL-BRUTALIZM": "Brutalizm",
  "UI-STYL-BRUTALIZM-OPIS":
    "Surowy jak plan budowy: czarne ramki, twarde cienie, zero zaokrągleń, pismo maszynowe i jeden elektryczny błękit.",
  "UI-STYL-ORBITA": "Orbita",
  "UI-STYL-ORBITA-OPIS":
    "Czarna przestrzeń z gwiazdami i fioletowy akcent. Kosmiczny, ale spokojny.",
  "UI-STYL-NEUMORFIZM": "Neumorfizm",
  "UI-STYL-NEUMORFIZM-OPIS":
    "Jasnoszary, miękki interfejs: karty wytłoczone z tła cieniem i światłem, pola z wyraźnym obrysem, akcent indygo.",
  "UI-STYL-NOTATNIK": "Notatnik inżyniera",
  "UI-STYL-NOTATNIK-OPIS":
    "Papier w kratkę, odręczne nagłówki i wynik jak zapisany długopisem. Liczby w tabelach i formularzach zwykłym pismem.",
  "UI-STYL-PLYNNY": "Płynny gradient",
  "UI-STYL-PLYNNY-OPIS":
    "Tło z miękkich plam fioletu, turkusu i błękitu, które powoli się przelewają tylko na pulpicie. Półprzezroczyste karty.",
  "UI-STYL-SYNTHWAVE": "Synthwave",
  "UI-STYL-SYNTHWAVE-OPIS":
    "Retro-futuryzm lat 80.: fioletowa noc, neonowa siatka u dołu ekranu, turkusowe ramki. Neon nigdy na werdyktach.",
  "UI-STYL-DOS": "Terminal DOS",
  "UI-STYL-DOS-OPIS":
    "Niebieski ekran jak menedżer plików z lat 90., pismo maszynowe wszędzie. Wynik zawsze biały.",
  "UI-WYGLAD-KOLOR-TLO": "Tło aplikacji",
  "UI-WYGLAD-KOLOR-TLO-OPIS": "Główne tło strony",
  "UI-WYGLAD-KOLOR-KARTY": "Karty i panele",
  "UI-WYGLAD-KOLOR-KARTY-OPIS": "Tło kart, popoverów, list",
  "UI-WYGLAD-KOLOR-TEKST": "Tekst",
  "UI-WYGLAD-KOLOR-TEKST-OPIS": "Kolor tekstu na tle i kartach",
  "UI-WYGLAD-KOLOR-AKCENT": "Akcent (przyciski, aktywne stany)",
  "UI-WYGLAD-KOLOR-AKCENT-OPIS": "Kolor główny UI",
  "UI-WYGLAD-KOLOR-SUKCES": "Werdykt 🟢 Zalecane",
  "UI-WYGLAD-KOLOR-SUKCES-OPIS": "Bezpiecznie, z marginesem",
  "UI-WYGLAD-KOLOR-UWAGA": "Werdykt 🟡 Dopuszczalne",
  "UI-WYGLAD-KOLOR-UWAGA-OPIS": "Blisko limitu",
  "UI-WYGLAD-KOLOR-BLAD": "Werdykt 🔴 Zabronione",
  "UI-WYGLAD-KOLOR-BLAD-OPIS": "Ryzyko uszkodzenia/pożaru",
} as const
