import type { CalcResult } from "@/lib/core/calc-result"
import type { OcenaZasiarczeniaInput } from "./input"
import { objawyZasiarczeniaObecne } from "./warnings"
import { OBJAWY } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type OcenaZasiarczeniaResult = {
  liczbaObjawow: number
}

/**
 * Ekran B10, Moduł 11, Ścieżka B — "Ocena zużycia — siarczanowanie" (dawne 10.16,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 */
export function calculateOcenaZasiarczenia(
  input: OcenaZasiarczeniaInput,
): CalcResult<OcenaZasiarczeniaResult> {
  const validIds = new Set(OBJAWY.map((item) => item.id))
  const liczbaObjawow = new Set(input.obserwowaneObjawyIds.filter((id) => validIds.has(id))).size

  return {
    value: { liczbaObjawow },
    unit: "objawów",
    status: liczbaObjawow > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs: { liczbaObjawow },
    assumptions: [],
    warnings: liczbaObjawow > 0 ? [objawyZasiarczeniaObecne(liczbaObjawow)] : [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
