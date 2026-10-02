import type { Warning } from "@/lib/core/calc-result"
import type { DoborZrodelZasilaniaInput } from "./input"
import { pradUjemny } from "./warnings"

/** Own field only — SoC, temperature and capacity are validated by the Moduł 4 engines this screen echoes. */
export function validateInput(input: DoborZrodelZasilaniaInput): Warning[] {
  return input.pradMozliwyA < 0 ? [pradUjemny(input.pradMozliwyA)] : []
}
