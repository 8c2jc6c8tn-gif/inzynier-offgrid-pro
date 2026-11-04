/**
 * M14 — texts of the shared „Przejście” screens D9/F9 (risk register) and D10/F10 (procedure);
 * order, ids, links and confidence are in `components/siec/tresci-przejscia.ts`. Source: expert
 * knowledge, `03_M14_Dom_i_Firma_Siec.md` §5, opracowanie §5.1–5.2.
 */
// English: ./m14-przejscie.en.ts, Russian: ./m14-przejscie.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-RYZ-R1-T":
    "Nieodwracalność — rozwiązanie umowy i demontaż licznika",
  "UI-RYZ-R1-S":
    "Powrót to nowy wniosek o przyłączenie: nowe warunki, opłata przyłączeniowa, miesiące czekania, ryzyko odmowy.",
  "UI-RYZ-R1-P":
    "Wyceń koszt powrotu (stawka z taryfy OSD × moc) zanim cokolwiek wypowiesz.",
  "UI-RYZ-R1-L":
    "Koszt powrotu do sieci",
  "UI-RYZ-R2-T":
    "Zima — deficyt produkcji",
  "UI-RYZ-R2-S":
    "Brak energii w grudniu i styczniu albo długa praca agregatu.",
  "UI-RYZ-R2-P":
    "Bilans bez sieci i stress-test zimowy (Moduł 7) przed wyborem scenariusza D.",
  "UI-RYZ-R2-L":
    "Zima bez sieci",
  "UI-RYZ-R3-T":
    "Awaria jedynego źródła (falownik, BMS)",
  "UI-RYZ-R3-S":
    "Dom bez prądu do czasu naprawy.",
  "UI-RYZ-R3-P":
    "Zapasowy tor zasilania (agregat → ładowarka albo bypass) i lista części krytycznych.",
  "UI-RYZ-R3-L":
    "Pojedyncze punkty awarii",
  "UI-RYZ-R4-T":
    "Osoby zależne od zasilania (koncentrator tlenu, sprzęt medyczny, lodówka z lekami)",
  "UI-RYZ-R4-S":
    "Zagrożenie zdrowia i życia.",
  "UI-RYZ-R4-P":
    "Pytanie kontrolne w porównaniu scenariuszy — przy „tak” scenariusz D bez redundantnego zapasu jest zablokowany.",
  "UI-RYZ-R5-T":
    "Pompa ciepła albo ogrzewanie elektryczne",
  "UI-RYZ-R5-S":
    "Zimowe zapotrzebowanie wielokrotnie większe niż latem.",
  "UI-RYZ-R5-P":
    "COP pompy ciepła w mrozie (Moduł 6) i bilans zimy.",
  "UI-RYZ-R5-L":
    "COP pompy ciepła",
  "UI-RYZ-R6-T":
    "Formalności budynku — odbiór, kredyt hipoteczny, ubezpieczenie, sprzedaż domu",
  "UI-RYZ-R6-S":
    "Urząd, bank albo ubezpieczyciel może oczekiwać przyłącza albo udokumentowanego źródła.",
  "UI-RYZ-R6-P":
    "Sprawdź przed odłączeniem: umowę kredytu, polisę, warunki banku. Praktyka jest różna — brak jednolitego przepisu.",
  "UI-RYZ-R7-T":
    "Bezpieczeństwo pożarowe magazynu i PV",
  "UI-RYZ-R7-S":
    "Większe ryzyko przy dużych magazynach w budynku.",
  "UI-RYZ-R7-P":
    "Audyt pożarowy (Moduł 8). PV powyżej 6,5 kW: uzgodnienie z rzeczoznawcą ppoż. i zawiadomienie PSP.",
  "UI-RYZ-R7-L":
    "Audyt pożarowy",
  "UI-RYZ-R8-T":
    "Agregat — spaliny (CO), hałas, paliwo, serwis",
  "UI-RYZ-R8-S":
    "Zatrucie czadem przy pracy w pomieszczeniu; spory z sąsiadami.",
  "UI-RYZ-R8-P":
    "Agregat spalinowy tylko na zewnątrz albo w wentylowanym, wydzielonym miejscu, zawsze przez przełącznik.",
  "UI-RYZ-R8-L":
    "Agregat jako zapas",
  "UI-RYZ-R9-T":
    "Utrata rozliczeń prosumenckich i dotacji",
  "UI-RYZ-R9-S":
    "Przepada depozyt albo opusty; możliwy zwrot dotacji, jeśli regulamin wymaga trwałości.",
  "UI-RYZ-R9-P":
    "Policz, co tracisz w depozycie, i sprawdź regulamin dotacji.",
  "UI-RYZ-R9-L":
    "Depozyt prosumencki",
  "UI-RYZ-R10-T":
    "Wartość nieruchomości i przyszły nabywca",
  "UI-RYZ-R10-S":
    "Część kupujących oczekuje przyłącza.",
  "UI-RYZ-R10-P":
    "Weź to pod uwagę, jeśli planujesz sprzedaż.",
  "UI-RYZ-RF1-T":
    "Ciągłość działalności (chłodnie, produkcja, serwery)",
  "UI-RYZ-RF1-S":
    "Przestój kosztuje więcej, niż daje oszczędność.",
  "UI-RYZ-RF1-P":
    "W scenariuszach firmy wpisz dopuszczalny czas bez zasilania — aplikacja sprawdzi zapas magazynu.",
  "UI-RYZ-RF1-L":
    "Scenariusze A–D dla firmy",
  "UI-RYZ-RF2-T":
    "Umowy kompleksowe B2B",
  "UI-RYZ-RF2-S":
    "Okres wypowiedzenia, kary umowne, brak ochrony konsumenckiej.",
  "UI-RYZ-RF2-P":
    "Krok kontrolny w procedurze — przeczytaj umowę przed wypowiedzeniem.",
  "UI-RYZ-RF2-L":
    "Procedura",
  "UI-RYZ-RF3-T":
    "Wymogi ubezpieczyciela i BHP dla magazynu i agregatu",
  "UI-RYZ-RF3-S":
    "Warunki polisy mogą wykluczać albo ograniczać instalację.",
  "UI-RYZ-RF3-P":
    "Zapytaj ubezpieczyciela i służbę BHP przed zakupem.",
  "UI-PROC-P1-T":
    "Policz",
  "UI-PROC-P1-O":
    "Scenariusze A–D i stress-test zimowy (Moduł 7). Zaakceptuj wynik świadomie — z godzinami agregatu i kosztem powrotu.",
  "UI-PROC-P2-T":
    "Zbuduj i przetestuj system wyspowy przy wciąż podłączonej sieci — przez pełną zimę",
  "UI-PROC-P2-O":
    "Najważniejsza rada tego rozdziału: sieć zostaje jako zapas (scenariusz C), dopóki system nie przejdzie realnego grudnia–lutego. Przełącznik sieć – 0 – wyspa, bez pracy równoległej. Wykonanie i pomiary zleć osobie z uprawnieniami (świadectwo SEP — zakres wymogu przy instalacji własnej do potwierdzenia).",
  "UI-PROC-P3-T":
    "Sprawdź formalności",
  "UI-PROC-P3-O":
    "Bank, ubezpieczyciel, umowa sprzedaży energii (okres wypowiedzenia, kary), regulamin dotacji (trwałość).",
  "UI-PROC-P3-F":
    "Umowa kompleksowa B2B: okres wypowiedzenia i kary umowne — przedsiębiorca nie ma ochrony konsumenckiej. Polisa i BHP dla magazynu i agregatu.",
  "UI-PROC-P4-T":
    "Wykorzystaj saldo prosumenckie",
  "UI-PROC-P4-O":
    "Opusty albo depozyt przed końcem umowy — potem przepadają.",
  "UI-PROC-P5-T":
    "Wypowiedz pisemnie umowę sprzedaży i umowę dystrybucyjną (albo kompleksową)",
  "UI-PROC-P5-O":
    "Najpierw sprawdź okres wypowiedzenia i ewentualną karę (oferty z gwarancją ceny, umowy terminowe). Konsument ma ustawowe prawo do wypowiedzenia; koszty przy umowach terminowych — sprawdź w umowie.",
  "UI-PROC-P6-T":
    "Demontaż licznika przez OSD",
  "UI-PROC-P6-O":
    "Opłaty stałe są naliczane do dnia demontażu (praktyka OSD). Przyłącze zwykle zostaje własnością OSD; jego fizyczna likwidacja to osobna sprawa z OSD.",
  "UI-PROC-P7-T":
    "Zachowaj dokumentację",
  "UI-PROC-P7-O":
    "Umowa, protokół demontażu, dawne warunki przyłączenia — przydadzą się przy ewentualnym powrocie.",
} as const
