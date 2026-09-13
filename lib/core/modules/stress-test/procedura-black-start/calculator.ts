import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { ProceduraBlackStartInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.1.0"

export type ProceduraBlackStartResult = {
  potwierdzoneWKolejnosci: number
  razem: number
}

/**
 * Ekran 5, Moduł 7 — "Procedura Black Start" (dawne 6.5,
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Kolejność kroków ma znaczenie (analogicznie do
 * kolejności łączenia ogniw w Module 11) — zaznaczenie kroku poza kolejnością jest oznaczane jako
 * twardy stop, nie liczy się do postępu.
 *
 * [07.09.2026] KOREKTA: `KROK-POZA-KOLEJNOSCIA` podniesiony z `warning` na `critical`, na wyraźną
 * prośbę właściciela projektu — otwarte pytanie z `docs/lista-do-zrobienia.md` (2026-09-03).
 * Uzasadnienie: źródło opisuje realne ryzyko uszkodzenia sprzętu przy złej kolejności rozruchu
 * (np. podłączenie agregatu przed naładowaniem baterii), więc poziom `warning` zaniżał ryzyko
 * względem pozostałych twardych stopów w `docs/rejestr-twardych-stopow.md`. Dotyczy tylko tego
 * ekranu (M7/E5) — ten sam kod ostrzeżenia jest niezależnie zdefiniowany (nie echo) w kilku
 * ekranach Modułu 11 (`polaczenia-elektryczne`, `podlaczenie-bms`, `demontaz-pakietu`,
 * `demontaz-olow`), świadomie NIEZMIENIONYCH tutaj — decyzja właściciela dotyczyła wprost
 * Black Start, nie całego wzorca.
 */
export function calculateProceduraBlackStart(
  input: ProceduraBlackStartInput,
): CalcResult<ProceduraBlackStartResult> {
  const checked = new Set(input.potwierdzoneIds)
  const razem = CHECKLIST_ITEMS.length

  let potwierdzoneWKolejnosci = 0
  for (const item of CHECKLIST_ITEMS) {
    if (!checked.has(item.id)) break
    potwierdzoneWKolejnosci++
  }

  const zaznaczonePozaKolejnoscia = CHECKLIST_ITEMS.slice(potwierdzoneWKolejnosci).some((item) =>
    checked.has(item.id),
  )

  const warnings: Warning[] = zaznaczonePozaKolejnoscia
    ? [
        {
          code: "KROK-POZA-KOLEJNOSCIA",
          level: "critical",
          message: "Zaznaczono krok poza kolejnością — potwierdź wcześniejsze kroki najpierw, zła kolejność rozruchu może uszkodzić sprzęt.",
          technicalMessage: `pierwszy niepotwierdzony krok w sekwencji: index ${potwierdzoneWKolejnosci}`,
        },
      ]
    : []

  return {
    value: { potwierdzoneWKolejnosci, razem },
    unit: "kroków potwierdzonych",
    status: potwierdzoneWKolejnosci === razem ? "VALID" : warnings.length > 0 ? "VALID_WITH_WARNINGS" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzoneWKolejnosci, razem },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
