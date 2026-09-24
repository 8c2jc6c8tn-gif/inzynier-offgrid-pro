/**
 * Ekran 2, Moduł 1 "Lokalizacja i teren" — "Skaner działki" (dawne 0.2, Wzorzec A,
 * docs/zrodla/Tresc_Modul_1_Lokalizacja_Ekrany.md). Architektura: rejestr-decyzji.md D22.
 *
 * Jądro wspólne dla obu trybów źródła: punkty z "spaceru GPS" (offline) albo z Geoportalu/ULDK
 * (online) trafiają tu w tej samej postaci — tryb decyduje tylko, SKĄD przychodzą punkty.
 */

export type PunktGps = {
  szerokosc: number
  dlugosc: number
  /** Wysokość elipsoidalna/n.p.m. z GPS [m] — potrzebna tylko dla połaci i kalenicy. */
  wysokoscM?: number
}

export type Kalibracja = {
  /** Który zbiór punktów zawiera odcinek o znanej długości. */
  zbior: "dzialka" | "budynek"
  indeksA: number
  indeksB: number
  /** Znana, zmierzona taśmą długość odcinka A–B [m] (np. "długość ściany 12 m" ze źródła). */
  znanaDlugoscM: number
}

export type PolacGps = { nazwa: string; punkty: PunktGps[] }

/** Przeszkoda jako walec (drzewo): środek, wysokość, promień. */
export type PrzeszkodaWalecGps = {
  typ: "walec"
  nazwa: string
  punkt: PunktGps
  wysokoscM: number
  /** Promień korony/rzutu przeszkody [m]. */
  promienM: number
}

/** Przeszkoda o obrysie wielokąta (sąsiedni budynek, ściana): narożniki przy gruncie + wysokość. */
export type PrzeszkodaObrysGps = {
  typ: "obrys"
  nazwa: string
  /** Narożniki w kolejności obchodzenia. */
  obrys: PunktGps[]
  wysokoscM: number
}

export type PrzeszkodaGps = PrzeszkodaWalecGps | PrzeszkodaObrysGps

export type SkanerDzialkiInput = {
  /** Narożniki działki w kolejności obchodzenia. */
  punktyDzialki?: PunktGps[]
  /** Narożniki budynku (przy gruncie) w kolejności obchodzenia. */
  punktyBudynku?: PunktGps[]
  polacie?: PolacGps[]
  przeszkody?: PrzeszkodaGps[]
  kalibracja?: Kalibracja
}
