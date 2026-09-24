/**
 * Ekran 4, Moduł 1 "Lokalizacja i teren" — "Bryła budynku i orientacja ścian" (dawne 0.4,
 * Wzorzec D, docs/zrodla/Tresc_Modul_1_Lokalizacja_Ekrany.md). Architektura: rejestr-decyzji.md D22.
 */

/**
 * Jeden rekord godzinowy danych nasłonecznienia (format PVGIS TMY: G(h), Gb(n), Gd(h)) [W/m²].
 * Dane pobierane online z PVGIS (przez proxy, D22) i zapisywane lokalnie — offline używane z zapisu.
 */
export type RekordGodzinowy = {
  /** Rzeczywista chwila wartości (dla PVGIS: znacznik HH:00 + irradiance_time_offset — dodaje adapter). */
  czasUtcMs: number
  /** Promieniowanie całkowite na płaszczyznę poziomą. */
  ghi: number
  /** Promieniowanie bezpośrednie na płaszczyznę prostopadłą do promieni. */
  dni: number
  /** Promieniowanie rozproszone na płaszczyznę poziomą. */
  dhi: number
}

export type Powierzchnia = {
  nazwa: string
  /** Nachylenie od poziomu [°]: 0 — płaski dach, 90 — ściana. */
  nachylenieDeg: number
  /** Kierunek, w który powierzchnia "patrzy" (N=0, E=90, S=180, W=270) [°]. */
  azymutDeg: number
  /**
   * Profile horyzontu przeszkód z punktów tej powierzchni (np. siatka jak na mapie cieplnej
   * Ekranu 3): kąt wzniesienia [°] w równych krokach azymutu od 0° (360 wartości = co 1°).
   * Napromieniowanie = średnia po punktach. Brak → powierzchnia oceniana bez zacienienia.
   */
  horyzontyDeg?: number[][]
}

export type OrientacjaPowierzchniInput = {
  szerokoscGeograficzna?: number
  dlugoscGeograficzna?: number
  daneGodzinowe?: RekordGodzinowy[]
  /** Współczynnik odbicia gruntu (albedo) [-]; brak → wartość domyślna z constants.ts. */
  albedo?: number
  powierzchnie?: Powierzchnia[]
}
