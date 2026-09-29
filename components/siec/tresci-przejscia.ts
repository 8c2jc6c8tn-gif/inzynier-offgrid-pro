/**
 * M14 — guide content of the shared „Przejście” screens D9/F9 (risk register) and D10/F10
 * (procedure), `03_M14_Dom_i_Firma_Siec.md` §5, opracowanie §5.1–5.2 (expert knowledge; confidence per
 * item as in the source table). Screen text, not domain output — Polish only, like other guide screens.
 */
export type Pewnosc = "✅" | "🔎A" | "🔎B"

export type Ryzyko = {
  id: string
  tytul: string
  skutek: string
  pomoc: string
  link?: { href: string; etykieta: string }
  pewnosc: Pewnosc
  tylkoFirma?: boolean
}

export const RYZYKA: Ryzyko[] = [
  {
    id: "R1",
    tytul: "Nieodwracalność — rozwiązanie umowy i demontaż licznika",
    skutek: "Powrót to nowy wniosek o przyłączenie: nowe warunki, opłata przyłączeniowa, miesiące czekania, ryzyko odmowy.",
    pomoc: "Wyceń koszt powrotu (stawka z taryfy OSD × moc) zanim cokolwiek wypowiesz.",
    link: { href: "/kalkulatory/rezygnacja-z-przylacza", etykieta: "Koszt powrotu do sieci" },
    pewnosc: "✅",
  },
  {
    id: "R2",
    tytul: "Zima — deficyt produkcji",
    skutek: "Brak energii w grudniu i styczniu albo długa praca agregatu.",
    pomoc: "Bilans bez sieci i stress-test zimowy (Moduł 7) przed wyborem scenariusza D.",
    link: { href: "/kalkulatory/zima-bez-sieci", etykieta: "Zima bez sieci" },
    pewnosc: "✅",
  },
  {
    id: "R3",
    tytul: "Awaria jedynego źródła (falownik, BMS)",
    skutek: "Dom bez prądu do czasu naprawy.",
    pomoc: "Zapasowy tor zasilania (agregat → ładowarka albo bypass) i lista części krytycznych.",
    link: { href: "/kalkulatory/analiza-spof", etykieta: "Pojedyncze punkty awarii" },
    pewnosc: "✅",
  },
  {
    id: "R4",
    tytul: "Osoby zależne od zasilania (koncentrator tlenu, sprzęt medyczny, lodówka z lekami)",
    skutek: "Zagrożenie zdrowia i życia.",
    pomoc: "Pytanie kontrolne w porównaniu scenariuszy — przy „tak” scenariusz D bez redundantnego zapasu jest zablokowany.",
    pewnosc: "✅",
  },
  {
    id: "R5",
    tytul: "Pompa ciepła albo ogrzewanie elektryczne",
    skutek: "Zimowe zapotrzebowanie wielokrotnie większe niż latem.",
    pomoc: "COP pompy ciepła w mrozie (Moduł 6) i bilans zimy.",
    link: { href: "/kalkulatory/cop-pompy-ciepla", etykieta: "COP pompy ciepła" },
    pewnosc: "✅",
  },
  {
    id: "R6",
    tytul: "Formalności budynku — odbiór, kredyt hipoteczny, ubezpieczenie, sprzedaż domu",
    skutek: "Urząd, bank albo ubezpieczyciel może oczekiwać przyłącza albo udokumentowanego źródła.",
    pomoc: "Sprawdź przed odłączeniem: umowę kredytu, polisę, warunki banku. Praktyka jest różna — brak jednolitego przepisu.",
    pewnosc: "🔎B",
  },
  {
    id: "R7",
    tytul: "Bezpieczeństwo pożarowe magazynu i PV",
    skutek: "Większe ryzyko przy dużych magazynach w budynku.",
    pomoc: "Audyt pożarowy (Moduł 8). PV powyżej 6,5 kW: uzgodnienie z rzeczoznawcą ppoż. i zawiadomienie PSP.",
    link: { href: "/kalkulatory/audyt-pozarowy", etykieta: "Audyt pożarowy" },
    pewnosc: "🔎A",
  },
  {
    id: "R8",
    tytul: "Agregat — spaliny (CO), hałas, paliwo, serwis",
    skutek: "Zatrucie czadem przy pracy w pomieszczeniu; spory z sąsiadami.",
    pomoc: "Agregat spalinowy tylko na zewnątrz albo w wentylowanym, wydzielonym miejscu, zawsze przez przełącznik.",
    link: { href: "/kalkulatory/agregat-jako-zapas", etykieta: "Agregat jako zapas" },
    pewnosc: "✅",
  },
  {
    id: "R9",
    tytul: "Utrata rozliczeń prosumenckich i dotacji",
    skutek: "Przepada depozyt albo opusty; możliwy zwrot dotacji, jeśli regulamin wymaga trwałości.",
    pomoc: "Policz, co tracisz w depozycie, i sprawdź regulamin dotacji.",
    link: { href: "/kalkulatory/depozyt-prosumencki", etykieta: "Depozyt prosumencki" },
    pewnosc: "🔎B",
  },
  {
    id: "R10",
    tytul: "Wartość nieruchomości i przyszły nabywca",
    skutek: "Część kupujących oczekuje przyłącza.",
    pomoc: "Weź to pod uwagę, jeśli planujesz sprzedaż.",
    pewnosc: "🔎B",
  },
  {
    id: "RF1",
    tytul: "Ciągłość działalności (chłodnie, produkcja, serwery)",
    skutek: "Przestój kosztuje więcej, niż daje oszczędność.",
    pomoc: "W scenariuszach firmy wpisz dopuszczalny czas bez zasilania — aplikacja sprawdzi zapas magazynu.",
    link: { href: "/kalkulatory/scenariusze-firma", etykieta: "Scenariusze A–D dla firmy" },
    pewnosc: "✅",
    tylkoFirma: true,
  },
  {
    id: "RF2",
    tytul: "Umowy kompleksowe B2B",
    skutek: "Okres wypowiedzenia, kary umowne, brak ochrony konsumenckiej.",
    pomoc: "Krok kontrolny w procedurze — przeczytaj umowę przed wypowiedzeniem.",
    link: { href: "/kalkulatory/rezygnacja-z-przylacza", etykieta: "Procedura" },
    pewnosc: "🔎B",
    tylkoFirma: true,
  },
  {
    id: "RF3",
    tytul: "Wymogi ubezpieczyciela i BHP dla magazynu i agregatu",
    skutek: "Warunki polisy mogą wykluczać albo ograniczać instalację.",
    pomoc: "Zapytaj ubezpieczyciela i służbę BHP przed zakupem.",
    pewnosc: "🔎B",
    tylkoFirma: true,
  },
]

export type KrokProcedury = { id: string; tytul: string; opis: string; odwracalny: boolean; firma?: string }

export const PROCEDURA: KrokProcedury[] = [
  {
    id: "P1",
    tytul: "Policz",
    opis: "Scenariusze A–D i stress-test zimowy (Moduł 7). Zaakceptuj wynik świadomie — z godzinami agregatu i kosztem powrotu.",
    odwracalny: true,
  },
  {
    id: "P2",
    tytul: "Zbuduj i przetestuj system wyspowy przy wciąż podłączonej sieci — przez pełną zimę",
    opis:
      "Najważniejsza rada tego rozdziału: sieć zostaje jako zapas (scenariusz C), dopóki system nie przejdzie realnego grudnia–lutego. " +
      "Przełącznik sieć – 0 – wyspa, bez pracy równoległej. Wykonanie i pomiary zleć osobie z uprawnieniami (świadectwo SEP — zakres wymogu przy instalacji własnej do potwierdzenia).",
    odwracalny: true,
  },
  {
    id: "P3",
    tytul: "Sprawdź formalności",
    opis: "Bank, ubezpieczyciel, umowa sprzedaży energii (okres wypowiedzenia, kary), regulamin dotacji (trwałość).",
    odwracalny: true,
    firma: "Umowa kompleksowa B2B: okres wypowiedzenia i kary umowne — przedsiębiorca nie ma ochrony konsumenckiej. Polisa i BHP dla magazynu i agregatu.",
  },
  {
    id: "P4",
    tytul: "Wykorzystaj saldo prosumenckie",
    opis: "Opusty albo depozyt przed końcem umowy — potem przepadają.",
    odwracalny: true,
  },
  {
    id: "P5",
    tytul: "Wypowiedz pisemnie umowę sprzedaży i umowę dystrybucyjną (albo kompleksową)",
    opis:
      "Najpierw sprawdź okres wypowiedzenia i ewentualną karę (oferty z gwarancją ceny, umowy terminowe). Konsument ma ustawowe prawo do wypowiedzenia; koszty przy umowach terminowych — sprawdź w umowie.",
    odwracalny: false,
  },
  {
    id: "P6",
    tytul: "Demontaż licznika przez OSD",
    opis:
      "Opłaty stałe są naliczane do dnia demontażu (praktyka OSD). Przyłącze zwykle zostaje własnością OSD; jego fizyczna likwidacja to osobna sprawa z OSD.",
    odwracalny: false,
  },
  {
    id: "P7",
    tytul: "Zachowaj dokumentację",
    opis: "Umowa, protokół demontażu, dawne warunki przyłączenia — przydadzą się przy ewentualnym powrocie.",
    odwracalny: false,
  },
]
