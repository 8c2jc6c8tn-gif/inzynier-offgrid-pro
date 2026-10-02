/**
 * Moduł 6, Część 2C — rekomendacje poprawy efektywności cieplnej (dawne 5.68, Biblia §6.27.42). Wzorzec G.
 * Oszczędność ciepła każdego działania przychodzi z ekranu „Wpływ czynnika” (2D) albo z audytu; koszt — z oferty.
 */
export type Dzialanie = {
  /** Nazwa działania (np. „Izolacja dachu”). */
  nazwa: string
  /** Oszczędność ciepła w roku [kWh]. 0 = nie wpisano. */
  oszczednoscCieplaKwh: number
  /** Koszt działania [zł]. 0 = nie wpisano (bez zwrotu). */
  kosztZl: number
}

export type PlanPoprawyInput = {
  dzialania: readonly Dzialanie[]
  /** COP źródła ciepła (grzałka = 1) — przelicza ciepło na prąd. 0 = nie wpisano. */
  cop: number
  /** Cena prądu [zł/kWh]. 0 = nie wpisano (bez złotówek i zwrotu). */
  cenaZlKwh: number
}
