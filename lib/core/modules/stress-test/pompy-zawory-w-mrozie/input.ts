/**
 * Moduł 7 "Stress-test zimowy" — Ekran 21 "Wydajność pomp i zaworów w niskich temperaturach" (dawne
 * 6.32, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Bez bazy komponentów —
 * minimalną temperaturę pracy każdej pompy/zaworu user przepisuje z karty katalogowej.
 */

/** Grupy z sekcji A/B źródła: pompy (ciepła, obiegowa, głębinowa), zawory, siłowniki + „inne”. */
export type TypArmatury = "pompa" | "zawor" | "silownik" | "inne"

export type ElementArmatury = {
  id: string
  nazwa: string
  typ: TypArmatury
  /** Minimalna temperatura pracy z karty katalogowej [°C]. null = user nie zna. */
  minTempPracyC: number | null
}

export type PompyZaworyWMrozieInput = {
  /** Minimalna spodziewana temperatura w miejscu montażu [°C]. null = jeszcze nie wpisano. */
  temperaturaMiejscaC: number | null
  elementy: ElementArmatury[]
  /** Jest zawór zewnętrzny do wody ogrodowej. */
  maZaworZewnetrzny: boolean
  /** Zawór zewnętrzny opróżniony przed zimą. */
  zaworZewnetrznyOprozniony: boolean
}
