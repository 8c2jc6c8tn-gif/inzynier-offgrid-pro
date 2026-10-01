/**
 * Ekran 25, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Szybka diagnoza problemów" (dawne 8.50,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.38). Wzorzec D, diagnostyka reaktywna.
 */
import type { ObjawDiagnozy } from "./constants"

export type OdpowiedzKroku = "ok" | "problem"

export type SzybkaDiagnozaInput = {
  objaw: ObjawDiagnozy | null
  /** Odpowiedzi na kroki (id kroku → wynik sprawdzenia); brak klucza = jeszcze nie sprawdzone. */
  odpowiedzi: Record<string, OdpowiedzKroku>
}
