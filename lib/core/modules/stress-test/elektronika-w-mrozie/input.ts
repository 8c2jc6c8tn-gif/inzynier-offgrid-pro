/**
 * Moduł 7 "Stress-test zimowy" — Ekran 19 "Wpływ niskich temperatur na elektronikę" (dawne
 * 6.29→7.27, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Bez bazy komponentów —
 * minimalną temperaturę pracy każdego urządzenia user przepisuje z karty katalogowej.
 */

/** Typy z sekcji B źródła (wyświetlacze LCD, BMS, czujniki, przetwornice) + „inne”. */
export type TypElektroniki = "BMS" | "wyswietlacz" | "czujnik" | "przetwornica" | "inne"

export type UrzadzenieElektroniczne = {
  id: string
  nazwa: string
  typ: TypElektroniki
  /** Minimalna temperatura pracy z karty katalogowej [°C]. null = user nie zna. */
  minTempPracyC: number | null
}

export type ElektronikaWMrozieInput = {
  /** Minimalna spodziewana temperatura w miejscu montażu urządzeń [°C]. null = jeszcze nie wpisano. */
  temperaturaMiejscaC: number | null
  urzadzenia: UrzadzenieElektroniczne[]
}
