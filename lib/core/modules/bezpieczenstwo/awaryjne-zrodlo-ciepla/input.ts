/**
 * Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — Ekran 1 "Awaryjne źródło ciepła (kominek, koza, piec na
 * drewno)" (dawne 6.19; docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Biblia v2.0 §8.1). Wzorzec D.
 * Moc, sprawność i wartość opałowa paliwa od usera (karta urządzenia, dostawca drewna) — źródło podaje
 * sprawność tylko jako zakres 60–80%, wartości opałowej wcale.
 */

export type TypZrodlaCiepla = "kominek" | "koza" | "piec"

export type AwaryjneZrodloCieplaInput = {
  typZrodla: TypZrodlaCiepla | null
  /** Nominalna moc cieplna urządzenia z karty [kW]. */
  mocKw: number | null
  /** Płaszcz wodny podłączony do bufora/instalacji C.O. */
  plaszczWodny: boolean
  /** Moc oddawana do wody (płaszcza) [kW] — tylko przy płaszczu wodnym. */
  mocDoWodyKw: number | null
  /** Czas palenia w dobie [h]. */
  godzinyPaleniaNaDobe: number | null
  /** Dobowe zapotrzebowanie na ciepło w mroźny dzień [kWh/dobę] — z M6 (straty ciepła / C.O.). */
  zapotrzebowanieCieplaKwhDoba: number | null
  /** Sprawność urządzenia [%] — z karty (źródło: typowo 60–80%). */
  sprawnoscProc: number | null
  /** Wartość opałowa paliwa [kWh/kg] — od dostawcy (zależy od gatunku i wilgotności drewna). */
  wartoscOpalowaKwhKg: number | null
}
