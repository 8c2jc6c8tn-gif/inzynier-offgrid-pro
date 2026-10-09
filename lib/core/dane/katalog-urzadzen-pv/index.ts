/**
 * Katalog falowników, mikroinwerterów i regulatorów MPPT (prośba właściciela 09.10.2026). Dane WYŁĄCZNIE ze stron/kart producentów,
 * każdy wpis z adresem źródła i datą odczytu; transkrypcja i lista rozbieżności: `docs/zrodla/katalog-urzadzen-pv-2026-10-09.md`.
 * Parametr, którego źródło nie podaje (albo podaje sprzecznie), to `null` — nie „typowa” wartość. Ceny nie ma w katalogu.
 */
export type RodzajUrzadzeniaPv = "regulator-mppt" | "falownik-hybrydowy" | "falownik-wyspowy" | "mikroinwerter-sieciowy"

export type MocPvPrzyNapieciu = { napiecieAkumulatoraV: number; mocW: number }

export type UrzadzeniePv = {
  id: string
  producent: string
  /** Rodzina/seria do wyboru kaskadowego (producent → seria → model). */
  seria: string
  /** Oznaczenie handlowe lub numer artykułu producenta. */
  model: string
  rodzaj: RodzajUrzadzeniaPv

  /** Napięcia systemu DC akumulatora [V] (regulator, hybryda). null = nie dotyczy lub brak w źródle. */
  napieciaAkumulatoraV: readonly number[] | null
  /** Maks. prąd ładowania akumulatora z PV [A]. */
  pradLadowaniaMaxA: number | null
  /** Nominalna moc PV zalecana przy danym napięciu akumulatora (tabela producenta), np. Victron. */
  mocPvNominalna: readonly MocPvPrzyNapieciu[] | null
  /** Maks. łączna moc wejścia PV [W], gdy tabela producenta ją podaje. */
  mocPvMaxW: number | null

  /** Bezwzględne maks. napięcie jałowe PV [V] (najzimniejsze warunki). */
  vocMaxV: number | null
  /** Maks. napięcie PV przy rozruchu i pracy [V], gdy producent podaje je osobno (Victron: 145 przy 150, 245 przy 250). */
  vocRoboczeMaxV: number | null
  /** Okno MPPT [V]; null = brak stałego okna (Victron: zależy od napięcia akumulatora) albo brak w źródle. */
  mpptMinV: number | null
  mpptMaxV: number | null
  /** Maks. prąd zwarcia PV, na wejście [A]. */
  iscMaxA: number | null
  /** Maks. prąd roboczy wejścia PV [A]. */
  iMaxMpptA: number | null
  liczbaWejscMppt: number | null

  /** Moc znamionowa wyjścia AC [W] (falownik, mikroinwerter). */
  mocAcZnamionowaW: number | null
  /** Moc szczytowa wyjścia AC [VA lub W — jak w źródle: falowniki VEVOR w VA, Phoenix w W]. */
  mocSzczytowa: number | null
  mocSzczytowaJednostka: "VA" | "W" | null
  /** Zakres napięcia wejścia DC falownika [V]. */
  napiecieWejsciaDcMinV: number | null
  napiecieWejsciaDcMaxV: number | null

  sprawnoscMaxPct: number | null
  /** Pobór własny bez obciążenia [W] (falowniki; do bilansu energii). */
  poborBezObciazeniaW: number | null
  wifi: boolean | null
  bluetooth: boolean | null
  masaKg: number | null

  zrodloUrl: string
  /** Data odczytu źródła (RRRR-MM-DD). */
  dataOdczytu: string
}

const DATA_ODCZYTU = "2026-10-09"

const PUSTY: Omit<UrzadzeniePv, "id" | "producent" | "seria" | "model" | "rodzaj" | "zrodloUrl" | "dataOdczytu"> = {
  napieciaAkumulatoraV: null,
  pradLadowaniaMaxA: null,
  mocPvNominalna: null,
  mocPvMaxW: null,
  vocMaxV: null,
  vocRoboczeMaxV: null,
  mpptMinV: null,
  mpptMaxV: null,
  iscMaxA: null,
  iMaxMpptA: null,
  liczbaWejscMppt: null,
  mocAcZnamionowaW: null,
  mocSzczytowa: null,
  mocSzczytowaJednostka: null,
  napiecieWejsciaDcMinV: null,
  napiecieWejsciaDcMaxV: null,
  sprawnoscMaxPct: null,
  poborBezObciazeniaW: null,
  wifi: null,
  bluetooth: null,
  masaKg: null,
}

const VICTRON = "Victron Energy"
const VICTRON_ZRODLO = {
  "75-100-20": "https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-75-10,-75-15,-100-15,-100-20_48V-EN.pdf",
  "100-30-50": "https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-100-30-&-100-50-EN.pdf",
  "150-35-45": "https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-150-35-&-150-45-EN.pdf",
  "150-60-70": "https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-150-60-&-150-70-EN.pdf",
  "250-60-70": "https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-250-60-and-250-70-EN.pdf",
  "ve-can": "https://www.victronenergy.com/media/pg/Manual_SmartSolar_MPPT_150-70_up_to_250-100_VE.Can/en/technical-specifications.html",
} as const

type SmartSolarWiersz = {
  model: string
  zrodlo: keyof typeof VICTRON_ZRODLO
  napiecia: readonly number[]
  pradA: number
  /** Moc nominalna PV dla kolejnych napięć z `napiecia` [W]. */
  mocPvW: readonly number[]
  iscA: number | null
  vocV: number
  vocRoboczeV: number | null
  sprawnoscPct: number
  masaKg: number | null
}

/**
 * Victron SmartSolar MPPT (karty producenta). Sprzeczne lub nieczytelne Isc → `null` (75/10: karta 13 A, instrukcja 10 A;
 * 150/100 i 250/100: odczyt niejednoznaczny). Okno MPPT zależy od napięcia akumulatora (rozruch Vbat + 5 V), więc `mpptMinV` = `null`.
 */
const SMARTSOLAR: readonly SmartSolarWiersz[] = [
  { model: "75/10", zrodlo: "75-100-20", napiecia: [12, 24], pradA: 10, mocPvW: [145, 290], iscA: null, vocV: 75, vocRoboczeV: null, sprawnoscPct: 98, masaKg: 0.5 },
  { model: "75/15", zrodlo: "75-100-20", napiecia: [12, 24], pradA: 15, mocPvW: [220, 440], iscA: 15, vocV: 75, vocRoboczeV: null, sprawnoscPct: 98, masaKg: 0.5 },
  { model: "100/15", zrodlo: "75-100-20", napiecia: [12, 24], pradA: 15, mocPvW: [220, 440], iscA: 15, vocV: 100, vocRoboczeV: null, sprawnoscPct: 98, masaKg: 0.6 },
  { model: "100/20", zrodlo: "75-100-20", napiecia: [12, 24, 48], pradA: 20, mocPvW: [290, 580, 1160], iscA: 20, vocV: 100, vocRoboczeV: null, sprawnoscPct: 98, masaKg: 0.65 },
  { model: "100/30", zrodlo: "100-30-50", napiecia: [12, 24], pradA: 30, mocPvW: [440, 880], iscA: 35, vocV: 100, vocRoboczeV: null, sprawnoscPct: 98, masaKg: 1.3 },
  { model: "100/50", zrodlo: "100-30-50", napiecia: [12, 24], pradA: 50, mocPvW: [700, 1400], iscA: 60, vocV: 100, vocRoboczeV: null, sprawnoscPct: 98, masaKg: 1.3 },
  { model: "150/35", zrodlo: "150-35-45", napiecia: [12, 24, 48], pradA: 35, mocPvW: [500, 1000, 2000], iscA: 40, vocV: 150, vocRoboczeV: 145, sprawnoscPct: 98, masaKg: 1.25 },
  { model: "150/45", zrodlo: "150-35-45", napiecia: [12, 24, 48], pradA: 45, mocPvW: [650, 1300, 2600], iscA: 50, vocV: 150, vocRoboczeV: 145, sprawnoscPct: 98, masaKg: 1.25 },
  { model: "150/60", zrodlo: "150-60-70", napiecia: [12, 24, 48], pradA: 60, mocPvW: [860, 1720, 3440], iscA: 50, vocV: 150, vocRoboczeV: 145, sprawnoscPct: 98, masaKg: 3 },
  { model: "150/70", zrodlo: "150-60-70", napiecia: [12, 24, 48], pradA: 70, mocPvW: [1000, 2000, 4000], iscA: 50, vocV: 150, vocRoboczeV: 145, sprawnoscPct: 98, masaKg: 3 },
  { model: "150/85", zrodlo: "ve-can", napiecia: [12, 24, 48], pradA: 85, mocPvW: [1200, 2400, 4900], iscA: 70, vocV: 150, vocRoboczeV: 145, sprawnoscPct: 98, masaKg: 4.5 },
  { model: "150/100", zrodlo: "ve-can", napiecia: [12, 24, 48], pradA: 100, mocPvW: [1450, 2900, 5800], iscA: null, vocV: 150, vocRoboczeV: 145, sprawnoscPct: 98, masaKg: null },
  { model: "250/60", zrodlo: "250-60-70", napiecia: [12, 24, 48], pradA: 60, mocPvW: [860, 1720, 3440], iscA: 35, vocV: 250, vocRoboczeV: 245, sprawnoscPct: 99, masaKg: 3 },
  { model: "250/70", zrodlo: "250-60-70", napiecia: [12, 24, 48], pradA: 70, mocPvW: [1000, 2000, 4000], iscA: 35, vocV: 250, vocRoboczeV: 245, sprawnoscPct: 99, masaKg: 3 },
  { model: "250/85", zrodlo: "ve-can", napiecia: [12, 24, 48], pradA: 85, mocPvW: [1200, 2400, 4900], iscA: 70, vocV: 250, vocRoboczeV: 245, sprawnoscPct: 99, masaKg: 4.5 },
  { model: "250/100", zrodlo: "ve-can", napiecia: [12, 24, 48], pradA: 100, mocPvW: [1450, 2900, 5800], iscA: null, vocV: 250, vocRoboczeV: 245, sprawnoscPct: 99, masaKg: null },
]

const REGULATORY_VICTRON: UrzadzeniePv[] = SMARTSOLAR.map((w) => ({
  ...PUSTY,
  id: `victron-smartsolar-${w.model.replace("/", "-")}`,
  producent: VICTRON,
  seria: "SmartSolar MPPT",
  model: w.model,
  rodzaj: "regulator-mppt",
  napieciaAkumulatoraV: w.napiecia,
  pradLadowaniaMaxA: w.pradA,
  mocPvNominalna: w.napiecia.map((napiecieAkumulatoraV, i) => ({ napiecieAkumulatoraV, mocW: w.mocPvW[i] as number })),
  vocMaxV: w.vocV,
  vocRoboczeMaxV: w.vocRoboczeV,
  iscMaxA: w.iscA,
  liczbaWejscMppt: 1,
  sprawnoscMaxPct: w.sprawnoscPct,
  bluetooth: true,
  masaKg: w.masaKg,
  zrodloUrl: VICTRON_ZRODLO[w.zrodlo],
  dataOdczytu: DATA_ODCZYTU,
}))

type PhoenixWiersz = {
  napiecieV: 12 | 24 | 48
  va: number
  ciaglaW: number
  szczytW: number
  sprawnoscPct: number
  poborW: number
  masaKg: number
}

const PHOENIX_WEJSCIE_DC: Record<12 | 24 | 48, readonly [number, number]> = { 12: [9.2, 17], 24: [18.4, 34], 48: [36.8, 62] }

/** Victron Phoenix VE.Direct 230 V / 50 Hz (karta producenta). Karta nie podaje 24/1600 i 48/1600 — brak wpisów. */
const PHOENIX: readonly PhoenixWiersz[] = [
  { napiecieV: 12, va: 250, ciaglaW: 200, szczytW: 400, sprawnoscPct: 87, poborW: 4.2, masaKg: 2.4 },
  { napiecieV: 24, va: 250, ciaglaW: 200, szczytW: 400, sprawnoscPct: 88, poborW: 5.2, masaKg: 2.4 },
  { napiecieV: 48, va: 250, ciaglaW: 200, szczytW: 400, sprawnoscPct: 88, poborW: 7.9, masaKg: 2.4 },
  { napiecieV: 12, va: 375, ciaglaW: 300, szczytW: 700, sprawnoscPct: 89, poborW: 5.6, masaKg: 3 },
  { napiecieV: 24, va: 375, ciaglaW: 300, szczytW: 700, sprawnoscPct: 89, poborW: 6.1, masaKg: 3 },
  { napiecieV: 48, va: 375, ciaglaW: 300, szczytW: 700, sprawnoscPct: 90, poborW: 8.5, masaKg: 3 },
  { napiecieV: 12, va: 500, ciaglaW: 400, szczytW: 900, sprawnoscPct: 90, poborW: 6, masaKg: 3.9 },
  { napiecieV: 24, va: 500, ciaglaW: 400, szczytW: 900, sprawnoscPct: 90, poborW: 6.5, masaKg: 3.9 },
  { napiecieV: 48, va: 500, ciaglaW: 400, szczytW: 900, sprawnoscPct: 91, poborW: 9, masaKg: 3.9 },
  { napiecieV: 12, va: 800, ciaglaW: 650, szczytW: 1500, sprawnoscPct: 90, poborW: 6.5, masaKg: 5.5 },
  { napiecieV: 24, va: 800, ciaglaW: 650, szczytW: 1500, sprawnoscPct: 90, poborW: 7, masaKg: 5.5 },
  { napiecieV: 48, va: 800, ciaglaW: 650, szczytW: 1500, sprawnoscPct: 91, poborW: 9.5, masaKg: 5.5 },
  { napiecieV: 12, va: 1200, ciaglaW: 1000, szczytW: 2200, sprawnoscPct: 91, poborW: 10, masaKg: 7.4 },
  { napiecieV: 24, va: 1200, ciaglaW: 1000, szczytW: 2200, sprawnoscPct: 91, poborW: 11, masaKg: 7.4 },
  { napiecieV: 48, va: 1200, ciaglaW: 1000, szczytW: 2200, sprawnoscPct: 92, poborW: 12, masaKg: 7.4 },
  { napiecieV: 12, va: 1600, ciaglaW: 1450, szczytW: 2200, sprawnoscPct: 92, poborW: 12, masaKg: 8.9 },
]

const FALOWNIKI_VICTRON: UrzadzeniePv[] = PHOENIX.map((w) => ({
  ...PUSTY,
  id: `victron-phoenix-${w.napiecieV}-${w.va}`,
  producent: VICTRON,
  seria: "Phoenix VE.Direct 230 V",
  model: `${w.napiecieV}/${w.va}`,
  rodzaj: "falownik-wyspowy",
  napieciaAkumulatoraV: [w.napiecieV],
  mocAcZnamionowaW: w.ciaglaW,
  mocSzczytowa: w.szczytW,
  mocSzczytowaJednostka: "W",
  napiecieWejsciaDcMinV: PHOENIX_WEJSCIE_DC[w.napiecieV][0],
  napiecieWejsciaDcMaxV: PHOENIX_WEJSCIE_DC[w.napiecieV][1],
  sprawnoscMaxPct: w.sprawnoscPct,
  poborBezObciazeniaW: w.poborW,
  masaKg: w.masaKg,
  zrodloUrl: "https://www.victronenergy.com/upload/documents/Datasheet-Inverter-VE.Direct-250VA-1600VA-EN.pdf",
  dataOdczytu: DATA_ODCZYTU,
}))

const VEVOR = "VEVOR"
const VEVOR_PL_FALOWNIK = "https://www.vevor.pl/falownik-czystej-fali-sinusoidalnej-c_10760/x-p_"
const VEVOR_EUR_MIKRO = "https://eur.vevor.com/grid-tie-solar-inverter-c_10762/x-p_"

/**
 * VEVOR — hybrydowe falowniki off-grid (vevor.pl). Strony nie podają Voc max, Isc, prądu wejściowego PV ani liczby paneli — `null`.
 * „60–500 V DC” (EM3500, EM6200) to jedyny zakres wejścia PV na stronie, wpisany jako okno MPPT; EM5500 podaje tylko maks. napięcie MPPT 500 V.
 */
const FALOWNIKI_VEVOR: UrzadzeniePv[] = [
  {
    ...PUSTY,
    id: "vevor-hybryda-gd3024jmh",
    producent: VEVOR,
    seria: "Falownik hybrydowy off-grid",
    model: "GD3024JMH (3000 W, 24 V)",
    rodzaj: "falownik-hybrydowy",
    napieciaAkumulatoraV: [24],
    pradLadowaniaMaxA: 80,
    mocAcZnamionowaW: 3000,
    wifi: false,
    zrodloUrl: `${VEVOR_PL_FALOWNIK}010413032596`,
    dataOdczytu: DATA_ODCZYTU,
  },
  {
    ...PUSTY,
    id: "vevor-hybryda-gd5548jmh",
    producent: VEVOR,
    seria: "Falownik hybrydowy off-grid",
    model: "GD5548JMH (4000 W, 24 V, Wi-Fi)",
    rodzaj: "falownik-hybrydowy",
    napieciaAkumulatoraV: [24],
    pradLadowaniaMaxA: 120,
    mocAcZnamionowaW: 4000,
    wifi: true,
    zrodloUrl: `${VEVOR_PL_FALOWNIK}010597768916`,
    dataOdczytu: DATA_ODCZYTU,
  },
  {
    ...PUSTY,
    id: "vevor-hybryda-em3500-24l",
    producent: VEVOR,
    seria: "Falownik hybrydowy off-grid",
    model: "EM3500-24L (3500 W, 24 V, Wi-Fi)",
    rodzaj: "falownik-hybrydowy",
    napieciaAkumulatoraV: [24],
    pradLadowaniaMaxA: 100,
    mocPvMaxW: 4000,
    mpptMinV: 60,
    mpptMaxV: 500,
    mocAcZnamionowaW: 3500,
    poborBezObciazeniaW: 35,
    sprawnoscMaxPct: 94,
    wifi: true,
    masaKg: 6.1,
    zrodloUrl: `${VEVOR_PL_FALOWNIK}010626100855`,
    dataOdczytu: DATA_ODCZYTU,
  },
  {
    ...PUSTY,
    id: "vevor-hybryda-em5500-48l",
    producent: VEVOR,
    seria: "Falownik hybrydowy off-grid",
    model: "EM5500-48L (5500 W, 48 V)",
    rodzaj: "falownik-hybrydowy",
    napieciaAkumulatoraV: [48],
    pradLadowaniaMaxA: 100,
    mpptMaxV: 500,
    mocAcZnamionowaW: 5500,
    mocSzczytowa: 11000,
    mocSzczytowaJednostka: "VA",
    wifi: false,
    masaKg: 8.35,
    zrodloUrl: "https://www.vevor.pl/off-grid-solar-inverter-c_10764/x-p_010914991247",
    dataOdczytu: DATA_ODCZYTU,
  },
  {
    ...PUSTY,
    id: "vevor-hybryda-em6200-48l",
    producent: VEVOR,
    seria: "Falownik hybrydowy off-grid",
    model: "EM6200-48L (6000 W, 48 V, Wi-Fi)",
    rodzaj: "falownik-hybrydowy",
    napieciaAkumulatoraV: [48],
    pradLadowaniaMaxA: 120,
    mpptMinV: 60,
    mpptMaxV: 500,
    mocAcZnamionowaW: 6000,
    mocSzczytowa: 12000,
    mocSzczytowaJednostka: "VA",
    poborBezObciazeniaW: 35,
    sprawnoscMaxPct: 94,
    wifi: true,
    masaKg: 9,
    zrodloUrl: `${VEVOR_PL_FALOWNIK}010209748438`,
    dataOdczytu: DATA_ODCZYTU,
  },
  {
    ...PUSTY,
    id: "vevor-mppt-mc2450n10-b",
    producent: VEVOR,
    seria: "Regulator MPPT",
    model: "MC2450N10-B (50 A)",
    rodzaj: "regulator-mppt",
    napieciaAkumulatoraV: [12, 24],
    pradLadowaniaMaxA: 50,
    mocPvNominalna: [
      { napiecieAkumulatoraV: 12, mocW: 660 },
      { napiecieAkumulatoraV: 24, mocW: 1320 },
    ],
    vocMaxV: 100,
    sprawnoscMaxPct: 98,
    bluetooth: true,
    masaKg: 1.33,
    zrodloUrl: "https://www.vevor.pl/kontroler-ladowania-slonecznego-mppt-c_10732/x-p_010825717610",
    dataOdczytu: DATA_ODCZYTU,
  },
]

/**
 * VEVOR — mikroinwertery sieciowe (eur.vevor.com; na vevor.pl nie znaleziono). Oddają energię do sieci 230 V, więc nie są falownikiem wyspowym.
 * Sprzeczności na stronach: GT-600 — tabela 12 A ×2, Q&A „nie więcej niż 15 A” (wpisano tabelę); GT-800 — „800 W ±10 %”, ale opis „ciągła 360 W” (wpisano 800 W jako moc znamionową producenta).
 */
const MIKROINWERTERY_VEVOR: UrzadzeniePv[] = [
  {
    ...PUSTY,
    id: "vevor-mikro-gt-600",
    producent: VEVOR,
    seria: "Mikroinwerter sieciowy",
    model: "GT-600 (600 W, IP67, Wi-Fi)",
    rodzaj: "mikroinwerter-sieciowy",
    napiecieWejsciaDcMinV: 18,
    napiecieWejsciaDcMaxV: 50,
    iMaxMpptA: 12,
    liczbaWejscMppt: 2,
    mocAcZnamionowaW: 600,
    wifi: true,
    masaKg: 3.8,
    zrodloUrl: `${VEVOR_EUR_MIKRO}010205565976`,
    dataOdczytu: DATA_ODCZYTU,
  },
  {
    ...PUSTY,
    id: "vevor-mikro-gt-800",
    producent: VEVOR,
    seria: "Mikroinwerter sieciowy",
    model: "GT-800 (800 W, IP67, Wi-Fi)",
    rodzaj: "mikroinwerter-sieciowy",
    napiecieWejsciaDcMinV: 18,
    napiecieWejsciaDcMaxV: 50,
    iMaxMpptA: 14,
    liczbaWejscMppt: 2,
    mocAcZnamionowaW: 800,
    wifi: true,
    masaKg: 3.8,
    zrodloUrl: `${VEVOR_EUR_MIKRO}010175865987`,
    dataOdczytu: DATA_ODCZYTU,
  },
  {
    ...PUSTY,
    id: "vevor-mikro-nbq600w",
    producent: VEVOR,
    seria: "Mikroinwerter sieciowy",
    model: "NBQ600W-220VWXBW1V0 (550 W, IP65)",
    rodzaj: "mikroinwerter-sieciowy",
    vocMaxV: 54,
    mpptMinV: 25,
    mpptMaxV: 40,
    iscMaxA: 40,
    iMaxMpptA: 27.2,
    napiecieWejsciaDcMinV: 17,
    napiecieWejsciaDcMaxV: 50,
    mocAcZnamionowaW: 550,
    zrodloUrl: `${VEVOR_EUR_MIKRO}010707692025`,
    dataOdczytu: DATA_ODCZYTU,
  },
]

export const KATALOG_URZADZEN_PV: readonly UrzadzeniePv[] = [
  ...REGULATORY_VICTRON,
  ...FALOWNIKI_VICTRON,
  ...FALOWNIKI_VEVOR,
  ...MIKROINWERTERY_VEVOR,
]

export function znajdzUrzadzeniePv(id: string): UrzadzeniePv | undefined {
  return KATALOG_URZADZEN_PV.find((u) => u.id === id)
}
