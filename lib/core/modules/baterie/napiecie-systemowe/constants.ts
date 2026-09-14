/** Progi napięcia systemowego — dane 1:1 ze źródła (Sekcja B, materiał v1). */
export const PROG_12V_MAX_W = 1000
export const PROG_48V_MIN_W = 3000

export const NAPIECIA_DO_POROWNANIA_V = [12, 24, 48] as const

// ---------------------------------------------------------------------------------------------
// Etap A — kontekst zastosowania (docs/zrodla/Material_Nowy_Modul_Dobor_Napiecia_Systemu_OffGrid_v3_0.md, A.1/A.2)
// ---------------------------------------------------------------------------------------------

export type Zastosowanie =
  | "nowy_budynek"
  | "budynek_z_instalacja"
  | "kamper"
  | "mala_lodz"
  | "duza_lodz"
  | "off_grid"

export const ZASTOSOWANIA: { id: Zastosowanie; label: string; filozofia: string }[] = [
  {
    id: "nowy_budynek",
    label: "Nowy budynek (projektowany od zera)",
    filozofia: "Maksymalna zgodność z filozofią Off-Grid: niskie napięcie DC, minimalne straty, dedykowane gniazda DC.",
  },
  {
    id: "budynek_z_instalacja",
    label: "Budynek z istniejącą instalacją 230V",
    filozofia: "Kompromis: falownik 230V, ale z możliwością częściowego zasilania DC.",
  },
  {
    id: "kamper",
    label: "Kamper / van",
    filozofia: "Priorytet: niskie napięcie, małe straty, kompatybilność z urządzeniami 12V.",
  },
  {
    id: "mala_lodz",
    label: "Mała łódź",
    filozofia: "Priorytet: 12V, standard w małych łodziach, łatwy dostęp do urządzeń.",
  },
  {
    id: "duza_lodz",
    label: "Duża łódź / jacht",
    filozofia: "Priorytet: 24V lub 48V (bezpieczeństwo, mniejsze prądy, korozja).",
  },
  {
    id: "off_grid",
    label: "Budynek Off-Grid (całkowicie poza siecią)",
    filozofia: "Maksymalna zgodność z filozofią Off-Grid: 48V, dedykowane DC, minimalizacja strat.",
  },
]

export type Priorytet = "koszt" | "straty" | "kompatybilnosc_12v" | "rozbudowa"

export const PRIORYTETY: { id: Priorytet; label: string }[] = [
  { id: "koszt", label: "Minimalizacja kosztów początkowych" },
  { id: "straty", label: "Minimalizacja strat energii i grubości przewodów" },
  { id: "kompatybilnosc_12v", label: "Kompatybilność z istniejącymi urządzeniami 12V" },
  { id: "rozbudowa", label: "Możliwość rozbudowy w przyszłości" },
]

/** Tabela decyzyjna C.1 (skrót) — czysto informacyjna, NIE steruje wynikiem liczbowym (ten
 *  liczy się z mocy/energii przez I=P/V), tylko dopowiada kontekstowe uzasadnienie w UI. */
export const KONTEKST_ZALECENIA: Record<Zastosowanie, { v12: string; v24: string; v48: string }> = {
  nowy_budynek: { v12: "Niezalecany", v24: "Dobry kompromis", v48: "Najlepszy" },
  budynek_z_instalacja: { v12: "Rzadko", v24: "Możliwy", v48: "Zalecany (falownik 230V + częściowe DC)" },
  kamper: { v12: "Zalecany", v24: "Możliwy przy większych potrzebach", v48: "Rzadko stosowany" },
  mala_lodz: { v12: "Zalecany", v24: "Możliwy", v48: "Niezalecany" },
  duza_lodz: { v12: "Możliwy", v24: "Zalecany", v48: "Możliwy" },
  off_grid: { v12: "Niezalecany", v24: "Tylko małe domki", v48: "Zalecany" },
}

// ---------------------------------------------------------------------------------------------
// Etap B — kreator odbiorników (B.1 katalog, ceny/moce jako środek przedziału źródła)
// ---------------------------------------------------------------------------------------------

export type OdbiornikKatalogowy = {
  id: string
  kategoria: string
  label: string
  /** Moc [W] — środek przedziału ze źródła, edytowalna przez użytkownika. */
  mocDomyslnaW: number
  /** Czas pracy jednorazowo [min] — 0 gdy źródło nie podaje (Etap B.3), edytowalny. */
  czasPracyDomyslnyMin: number
  /** Bazowy/ciągły (Etap B.2: lodówka, router, oświetlenie — sumowane bezwarunkowo) vs przełączalny. */
  bazowy: boolean
  uwagi: string
}

export const KATALOG_ODBIORNIKOW: OdbiornikKatalogowy[] = [
  { id: "led-230v", kategoria: "Oświetlenie", label: "LED 230V (żarówka)", mocDomyslnaW: 12, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Wymaga falownika" },
  { id: "led-12v", kategoria: "Oświetlenie", label: "LED 12V (żarówka)", mocDomyslnaW: 6, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Zasilane bezpośrednio z DC" },
  { id: "led-24v", kategoria: "Oświetlenie", label: "LED 24V (żarówka)", mocDomyslnaW: 8, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Zalecane w systemach DC" },
  { id: "tasma-led", kategoria: "Oświetlenie", label: "Taśma LED (1m)", mocDomyslnaW: 10, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Dostępna 12V/24V/230V" },
  { id: "lodowka-12v", kategoria: "Chłodzenie", label: "Lodówka 12V DC", mocDomyslnaW: 50, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Kompresor DC, ciągła" },
  { id: "lodowka-230v", kategoria: "Chłodzenie", label: "Lodówka 230V AC", mocDomyslnaW: 100, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Wymaga falownika" },
  { id: "zamrazarka", kategoria: "Chłodzenie", label: "Zamrażarka 230V", mocDomyslnaW: 125, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Wymaga falownika" },
  { id: "router", kategoria: "Elektronika", label: "Router WiFi", mocDomyslnaW: 15, czasPracyDomyslnyMin: 0, bazowy: true, uwagi: "Można zasilać z dedykowanego gniazda DC" },
  { id: "tv", kategoria: "Elektronika", label: "Telewizor 32\"", mocDomyslnaW: 65, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Zasilacz często 12V/19V DC" },
  { id: "laptop", kategoria: "Elektronika", label: "Laptop", mocDomyslnaW: 68, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Zasilacz 19V DC" },
  { id: "ladowarki-usb", kategoria: "Elektronika", label: "Ładowarki USB", mocDomyslnaW: 13, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Gniazda USB 5V DC" },
  { id: "czajnik", kategoria: "AGD (wysokie moce)", label: "Czajnik elektryczny", mocDomyslnaW: 1850, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Tylko przez falownik" },
  { id: "mikrofalowka", kategoria: "AGD (wysokie moce)", label: "Mikrofalówka", mocDomyslnaW: 1000, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Tylko przez falownik" },
  { id: "pralka", kategoria: "AGD (wysokie moce)", label: "Pralka (grzanie wody)", mocDomyslnaW: 1250, czasPracyDomyslnyMin: 45, bazowy: false, uwagi: "Długotrwałe (0,5-1h) — poprawka B.3, nie chwilowe" },
  { id: "zmywarka", kategoria: "AGD (wysokie moce)", label: "Zmywarka", mocDomyslnaW: 1500, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Tylko przez falownik" },
  { id: "piekarnik", kategoria: "AGD (wysokie moce)", label: "Piekarnik elektryczny", mocDomyslnaW: 2750, czasPracyDomyslnyMin: 60, bazowy: false, uwagi: "Wymaga 48V" },
  { id: "airfryer", kategoria: "AGD (wysokie moce)", label: "Airfryer", mocDomyslnaW: 1700, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Tylko przez falownik" },
  { id: "grill", kategoria: "AGD (wysokie moce)", label: "Grill elektryczny", mocDomyslnaW: 2500, czasPracyDomyslnyMin: 75, bazowy: false, uwagi: "Wymaga 48V" },
  { id: "bojler", kategoria: "Ciepła woda", label: "Bojler elektryczny", mocDomyslnaW: 2250, czasPracyDomyslnyMin: 120, bazowy: false, uwagi: "Przewody dobrane na prąd ciągły" },
  { id: "podgrzewacz-przeplywowy", kategoria: "Ciepła woda", label: "Podgrzewacz przepływowy", mocDomyslnaW: 4750, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Wymaga 48V" },
  { id: "wiertarka", kategoria: "Narzędzia", label: "Wiertarka", mocDomyslnaW: 750, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Przez falownik lub DC" },
  { id: "szlifierka", kategoria: "Narzędzia", label: "Szlifierka", mocDomyslnaW: 1000, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Przez falownik" },
  { id: "spawarka", kategoria: "Narzędzia", label: "Spawarka inwerterowa", mocDomyslnaW: 3000, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Wymaga 48V" },
  { id: "klimatyzacja-230v", kategoria: "Klimatyzacja", label: "Klimatyzacja 230V", mocDomyslnaW: 1100, czasPracyDomyslnyMin: 480, bazowy: false, uwagi: "Przez falownik" },
  { id: "klimatyzacja-24v", kategoria: "Klimatyzacja", label: "Klimatyzacja 24V DC", mocDomyslnaW: 600, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Możliwa bez falownika" },
  { id: "pompa-230v", kategoria: "Pompy", label: "Pompa wodna 230V", mocDomyslnaW: 1000, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Przez falownik" },
  { id: "pompa-24v", kategoria: "Pompy", label: "Pompa wodna 24V DC", mocDomyslnaW: 350, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Bez falownika" },
  { id: "promiennik", kategoria: "Ogrzewanie", label: "Promiennik elektryczny", mocDomyslnaW: 1500, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Tylko przez falownik, 48V" },
  { id: "kociol-elektryczny", kategoria: "Ogrzewanie", label: "Kocioł elektryczny", mocDomyslnaW: 4000, czasPracyDomyslnyMin: 240, bazowy: false, uwagi: "Tylko przez falownik, 48V" },
  { id: "pompa-ciepla", kategoria: "Ogrzewanie", label: "Pompa ciepła", mocDomyslnaW: 1000, czasPracyDomyslnyMin: 0, bazowy: false, uwagi: "Przez falownik" },
]

/** Próg klasyfikacji "długotrwałe" (Etap B.3): od 30 minut pracy jednorazowo. */
export const PROG_DLUGOTRWALE_MIN = 30

// ---------------------------------------------------------------------------------------------
// WYCOFANE Z TEGO EKRANU (14.09.2026, zgłoszenie użytkownika) — treść poniżej dotyczy oświetlenia,
// nie doboru napięcia systemowego, i nie jest tu już renderowana. Zachowana tylko jako materiał
// do przeniesienia do przyszłego modułu "Oświetlenie" (jeszcze nie zbudowanego) — nie usuwać przy
// porządkach dead-code, patrz docs/memory.md. Koszt przetwornic DC-DC dla linii 24V w systemie
// 48V nadal liczy się w Etapie E (kosztorys.ts) — to zostaje, niezależnie od przeniesienia.
// ---------------------------------------------------------------------------------------------

export type PorownanieOswietlenia = {
  cecha: string
  v230: string
  v24: string
  v48: string
}

/** D.1 — tabela porównawcza LED 230V/24V/48V, dane 1:1 ze źródła. */
export const POROWNANIE_OSWIETLENIA_LED: PorownanieOswietlenia[] = [
  { cecha: "Pobór mocy", v230: "8–15 W", v24: "5–10 W", v48: "5–10 W" },
  { cecha: "Grzejność", v230: "Wyższa (zasilacz w każdej żarówce)", v24: "Niższa (brak przetwornicy)", v48: "Niższa (brak przetwornicy)" },
  { cecha: "Żywotność", v230: "Krótsza (ciepło skraca życie LED)", v24: "Dłuższa (mniejsze ciepło)", v48: "Dłuższa (mniejsze ciepło)" },
  { cecha: "Jakość światła", v230: "Dobra", v24: "Lepsza (2× jaśniejsza przy tym samym poborze)", v48: "Lepsza" },
  { cecha: "Kompatybilność z Off-Grid", v230: "Wymaga falownika 230V", v24: "Bezpośrednie zasilanie z DC", v48: "Bezpośrednie zasilanie z DC" },
  { cecha: "Straty", v230: "Przetwornica 230V→DC w każdej żarówce", v24: "Brak przetwornicy", v48: "Brak przetwornicy" },
  { cecha: "Koszt", v230: "Niższy początkowy", v24: "Wyższy początkowy (ale niższy eksploatacyjny)", v48: "Wyższy początkowy" },
  { cecha: "Dostępność", v230: "Powszechna", v24: "Dobra", v48: "Ograniczona" },
  { cecha: "Koszt przetwornicy DC-DC", v230: "–", v24: "–", v48: "48V→24V: ~350–400 zł/szt." },
]

export const ZALECENIE_OSWIETLENIA_LED =
  "W systemie Off-Grid zawsze wybieraj oświetlenie 24V. LEDy 24V mniej się grzeją, dwa razy lepiej świecą przy tym samym poborze prądu i nie wymagają falownika. W systemie 48V rozważ oświetlenie 48V (jeśli dostępne) lub zaakceptuj koszt przetwornic DC-DC — policzony w kosztorysie Etapu E."

export type UrzadzenieDcKatalog = {
  urzadzenie: string
  napiecieZasilania: string
  zalecaneRozwiazanie: string
}

/** D.2 — dedykowane gniazda DC dla elektroniki, dane 1:1 ze źródła. */
export const KATALOG_URZADZEN_DC: UrzadzenieDcKatalog[] = [
  { urzadzenie: "Router WiFi", napiecieZasilania: "12 V DC", zalecaneRozwiazanie: "Gniazdo DC 12V (bezpośrednio z pakietu)" },
  { urzadzenie: "Telewizor", napiecieZasilania: "19 V DC", zalecaneRozwiazanie: "Przetwornica DC-DC 24V→19V" },
  { urzadzenie: "Laptop", napiecieZasilania: "19 V DC", zalecaneRozwiazanie: "Przetwornica DC-DC 24V→19V" },
  { urzadzenie: "Telefon/tablet", napiecieZasilania: "5 V DC (USB)", zalecaneRozwiazanie: "Gniazdo USB 5V z przetwornicą DC-DC" },
  { urzadzenie: "Radio", napiecieZasilania: "12 V DC", zalecaneRozwiazanie: "Gniazdo DC 12V" },
]

export const ZALETA_GNIAZD_DC =
  "Unikasz podwójnej konwersji (DC → AC → DC), która generuje straty rzędu 15–25%."

// ---------------------------------------------------------------------------------------------
// Etap E — kosztorysy (E.1 założenia cenowe, wszystkie edytowalne przez użytkownika)
// ---------------------------------------------------------------------------------------------

/** EVE MB31 3,2V 314Ah, 75,50 USD/szt. × ~4,00 PLN/USD ≈ 302 zł/szt. (źródło E.1/E.2). */
export const CENA_OGNIWA_DOMYSLNA_ZL = 302
/** Pojemność jednego ogniwa [Wh] = 3,2V × 314Ah. */
export const POJEMNOSC_OGNIWA_WH = 3.2 * 314

export const CENY_DOMYSLNE = {
  bms4sZl: 150,
  bms8sZl: 250,
  bms16sZl: 600,
  falownik12vZl: 700,
  falownik24vZl: 1100,
  falownik48vZl: 1500,
  /** Przewody (5m/dobrane do napięcia) — wartości z tabeli E.3 (porównanie tej samej pojemności). */
  przewody12vZl: 500,
  przewody24vZl: 300,
  przewody48vZl: 150,
  bezpiecznik12vZl: 150,
  bezpiecznik24vZl: 100,
  bezpiecznik48vZl: 80,
  /** Przetwornica DC-DC 48V→24V, 480W/20A (Etap D.1). */
  przetwornicaDcDcZl: 400,
}

// ---------------------------------------------------------------------------------------------
// USUNIĘTE Z TEGO EKRANU (14.09.2026, zgłoszenie użytkownika: "F i G mają się nijak do tego
// rozdziału, nic tu nie wnoszą oprócz zamętu"). Etap G dobierał panele PV do konkretnych modeli
// falowników VEVOR — to nie odpowiada na pytanie "jakie napięcie systemowe wybrać", to osobna
// decyzja (dobór PV do już wybranego falownika), którą pokrywa już M3/Ekran14
// dopasowanie-tablicy-falownika. Dane (PANEL_JA_SOLAR_500W, FALOWNIKI_VEVOR) nie są używane
// nigdzie indziej w repo (sprawdzone grepem) — usunięte całkowicie, nie przeniesione. Historia
// w git (commit poprzedzający tę zmianę) i w docs/memory.md, gdyby trzeba było je odtworzyć.
// ---------------------------------------------------------------------------------------------
