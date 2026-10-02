import type { Czynnik, KluczPola } from "./input"

/**
 * Rodzaj pola decyduje o walidacji:
 * - dodatnia: >= 0 (0 = nie wpisano),
 * - procent: 0–100,
 * - cop: 0 (nie wpisano) albo >= 1,
 * - godziny: 0–24,
 * - ulamek: 0–1 (np. współczynnik g okna),
 * - temperatura: dowolna liczba, pusta = nie wpisano.
 */
export type RodzajPola = "dodatnia" | "procent" | "ulamek" | "cop" | "godziny" | "temperatura"

export type DefinicjaPola = {
  klucz: KluczPola
  rodzaj: RodzajPola
  /** false = pole opcjonalne (np. zapotrzebowanie i moc pompy — tylko do sprawdzenia doboru). */
  wymagane: boolean
}

const p = (klucz: KluczPola, rodzaj: RodzajPola, wymagane = true): DefinicjaPola => ({ klucz, rodzaj, wymagane })

/** Pola doboru pompy — opcjonalne przy każdym czynniku „mocowym”. */
const DOBOR = [p("zapotrzebowanieKw", "dodatnia", false), p("mocPompyKw", "dodatnia", false)]

/** Kolejność pól = kolejność na ekranie (Sekcja A źródła). */
export const POLA_CZYNNIKA: Record<Czynnik, readonly DefinicjaPola[]> = {
  okna: [p("powierzchniaM2", "dodatnia"), p("uPrzed", "dodatnia"), p("uPo", "dodatnia"), p("dTK", "dodatnia"), ...DOBOR],
  dach: [p("powierzchniaM2", "dodatnia"), p("uPrzed", "dodatnia"), p("gruboscCm", "dodatnia"), p("lambda", "dodatnia"), p("dTK", "dodatnia"), ...DOBOR],
  podloga: [
    p("powierzchniaM2", "dodatnia"),
    p("uPrzed", "dodatnia"),
    p("gruboscCm", "dodatnia"),
    p("lambda", "dodatnia"),
    p("dTGruntK", "dodatnia"),
    ...DOBOR,
  ],
  mostki: [p("hMostkowPrzedWK", "dodatnia"), p("hMostkowPoWK", "dodatnia", false), p("dTK", "dodatnia"), ...DOBOR],
  szczelnosc: [p("kubaturaM3", "dodatnia"), p("nPrzed", "dodatnia"), p("nPo", "dodatnia", false), p("dTK", "dodatnia"), ...DOBOR],
  wentylacja: [
    p("strumienM3H", "dodatnia"),
    p("etaPrzedPct", "procent", false),
    p("etaPoPct", "procent", false),
    p("wentylatoryKwhDoba", "dodatnia", false),
    p("dTK", "dodatnia"),
    ...DOBOR,
  ],
  wysokosc: [
    p("powierzchniaPodlogiM2", "dodatnia"),
    p("obwodM", "dodatnia"),
    p("uScian", "dodatnia"),
    p("nPrzed", "dodatnia"),
    p("hPrzedM", "dodatnia"),
    p("hPoM", "dodatnia"),
    p("dTK", "dodatnia"),
    ...DOBOR,
  ],
  rury: [
    p("dlugoscRurM", "dodatnia"),
    p("psiPrzed", "dodatnia"),
    p("psiPo", "dodatnia", false),
    p("tWodyC", "temperatura"),
    p("tOtoczeniaC", "temperatura"),
    p("godzinyH", "godziny"),
  ],
  "zyski-sloneczne": [
    p("powierzchniaOkienM2", "dodatnia"),
    p("g", "ulamek"),
    p("napromieniowanieKwhM2", "dodatnia"),
    p("zacienieniePrzedPct", "procent", false),
    p("zacieniePoPct", "procent", false),
    p("godzinySezonuH", "dodatnia", false),
  ],
  "zyski-bytowe": [p("zyskiKwhDoba", "dodatnia"), p("dniSezonu", "dodatnia", false)],
  "temp-zasilania": [p("tPrzedC", "temperatura"), p("tPoC", "temperatura"), p("copPrzed", "cop"), p("copPo", "cop", false), p("cieploSezonKwh", "dodatnia", false)],
  "temp-zrodla": [p("tPrzedC", "temperatura"), p("tPoC", "temperatura"), p("copPrzed", "cop"), p("copPo", "cop"), p("cieploSezonKwh", "dodatnia", false)],
  "temp-powrotu": [p("tPrzedC", "temperatura"), p("tPoC", "temperatura"), p("copPrzed", "cop"), p("copPo", "cop"), p("cieploSezonKwh", "dodatnia", false)],
  defrost: [p("defrostKwhDoba", "dodatnia"), p("dniSzronienia", "dodatnia"), p("zuzyciePompySezonKwh", "dodatnia", false)],
  "ograniczenie-mocy": [
    p("mocPompyKw", "dodatnia"),
    p("ograniczeniePct", "procent"),
    p("zapotrzebowanieKw", "dodatnia", false),
    p("copPrzed", "cop", false),
    p("copOgraniczony", "cop", false),
    p("mocFalownikaKw", "dodatnia", false),
  ],
  przeplyw: [p("mocPompyKw", "dodatnia"), p("dTObieguK", "dodatnia")],
  odwierty: [
    p("liczbaA", "dodatnia"),
    p("glebokoscAM", "dodatnia"),
    p("liczbaB", "dodatnia"),
    p("glebokoscBM", "dodatnia"),
    p("cenaZlM", "dodatnia"),
    p("wNaM", "dodatnia"),
    p("mocPompyKw", "dodatnia", false),
  ],
  "bufor-starty": [p("mocPompyKw", "dodatnia"), p("obciazenieKw", "dodatnia"), p("wodaInstalacjiL", "dodatnia"), p("buforL", "dodatnia"), p("histerezaK", "dodatnia")],
}

export const CZYNNIKI: readonly Czynnik[] = Object.keys(POLA_CZYNNIKA) as Czynnik[]

/** Numery dawnych funkcji (rejestr pokrycia) — do opisu w UI i w narzędziu AI. */
export const NUMERY_ZRODLA: Record<Czynnik, string> = {
  okna: "5.77",
  dach: "5.78",
  podloga: "5.79",
  mostki: "5.75",
  szczelnosc: "5.80",
  wentylacja: "5.76",
  wysokosc: "5.83",
  rury: "5.73",
  "zyski-sloneczne": "5.81, 5.84, 5.86",
  "zyski-bytowe": "5.82",
  "temp-zasilania": "5.69",
  "temp-zrodla": "5.93",
  "temp-powrotu": "5.95",
  defrost: "5.96",
  "ograniczenie-mocy": "5.97, 5.98",
  przeplyw: "5.94",
  odwierty: "5.90, 5.91",
  "bufor-starty": "5.100",
}

/**
 * Reguła kciuka ze źródła (Biblia §6.27.43, dawne 5.69): „obniżenie temperatury zasilania o 1 °C zwykle zwiększa COP
 * o 2–3%”. Używana tylko wtedy, gdy user nie wpisze COP po zmianie — jako widełki, liniowo ✅🤖.
 */
export const COP_NA_STOPIEN_ZASILANIA = { min: 0.02, max: 0.03 } as const

/** Pozycje 2D bez fizyki do policzenia (źródło daje tylko przykładowe procenty) — powód w rejestrze pokrycia. */
export const CZYNNIKI_NIEBUDOWANE = ["5.74", "5.85", "5.87", "5.88", "5.89", "5.92", "5.99"] as const

export const W_NA_KW = 1000
export const L_NA_M3 = 1000
export const MIN_NA_H = 60
