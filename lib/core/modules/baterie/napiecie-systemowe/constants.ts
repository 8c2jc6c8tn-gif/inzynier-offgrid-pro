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
// Etap G — dobór PV (dane panelu z karty katalogowej, specyfikacje falowników VEVOR ze źródła)
// ---------------------------------------------------------------------------------------------

/** JA Solar JAM60D41-500/LB — docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/00-INDEKS.md. */
export const PANEL_JA_SOLAR_500W = {
  mocWp: 500,
  vocStcV: 43.85,
  vmpStcV: 36.91,
  iscA: 14.42,
  impA: 13.55,
  betaPctNaC: -0.25,
}

export type FalownikVevorId = "vevor_12v_1500w" | "vevor_24v_3000w" | "vevor_48v_5000va"

export type FalownikVevorSpec = {
  id: FalownikVevorId
  label: string
  napiecieDcV: 12 | 24 | 48
  mocCiaglaW: number
  mocSzczytowaW: number
  maMppt: boolean
  mpptMinV: number | null
  mpptMaxV: number | null
  iMaxMpptA: number | null
  vMaxFalownikaV: number | null
  liczbaPaneliWSzereguRekomendowana: number
  liczbaStringowRownoleglychRekomendowana: number
  cenaZl: number
}

/** Trzy modele ze źródła (Etap G.2/G.3) — dane katalogowe producenta, nie zgadywane. Model 3
 *  MPPT ma podany zakres prądu 60-87A; użyty konserwatywny dolny koniec (60A). */
export const FALOWNIKI_VEVOR: FalownikVevorSpec[] = [
  {
    id: "vevor_12v_1500w",
    label: "VEVOR 12V 1500W (bez wbudowanego MPPT)",
    napiecieDcV: 12,
    mocCiaglaW: 1500,
    mocSzczytowaW: 3000,
    maMppt: false,
    mpptMinV: null,
    mpptMaxV: null,
    iMaxMpptA: null,
    vMaxFalownikaV: null,
    liczbaPaneliWSzereguRekomendowana: 2,
    liczbaStringowRownoleglychRekomendowana: 2,
    cenaZl: 700,
  },
  {
    id: "vevor_24v_3000w",
    label: "VEVOR 24V 3000W Hybrid (MPPT 80A wbudowany)",
    napiecieDcV: 24,
    mocCiaglaW: 3000,
    mocSzczytowaW: 6000,
    maMppt: true,
    mpptMinV: 60,
    mpptMaxV: 500,
    iMaxMpptA: 80,
    vMaxFalownikaV: 500,
    liczbaPaneliWSzereguRekomendowana: 8,
    liczbaStringowRownoleglychRekomendowana: 1,
    cenaZl: 1100,
  },
  {
    id: "vevor_48v_5000va",
    label: "VEVOR 48V 5000VA/4000W MPS-5K (MPPT 60-87A wbudowany)",
    napiecieDcV: 48,
    mocCiaglaW: 4000,
    mocSzczytowaW: 5000,
    maMppt: true,
    mpptMinV: 60,
    mpptMaxV: 145,
    iMaxMpptA: 60,
    vMaxFalownikaV: 145,
    liczbaPaneliWSzereguRekomendowana: 2,
    liczbaStringowRownoleglychRekomendowana: 4,
    cenaZl: 1500,
  },
]
