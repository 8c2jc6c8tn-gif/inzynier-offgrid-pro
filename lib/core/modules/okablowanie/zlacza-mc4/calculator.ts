import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { ZlaczaMc4Input } from "./input"
import { validateInput } from "./validation"
import { mieszaniProducenci, producentNieznany, zlaczaZgodne } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type ZlaczaMc4Result = {
  zgodne: boolean
}

const NIEZNANY = "Inny / nieznany"

function pusty(): ZlaczaMc4Result {
  return { zgodne: false }
}

/**
 * Ekran 5, Moduł 5 "Okablowanie i zabezpieczenia" — "Złącza MC4" (dawne 4.21, 4.35,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Twardy stop 1:1 ze źródła: mieszanie klonów
 * różnych producentów po dwóch stronach złącza — realne ryzyko łukowania/pożaru z luźnego styku.
 * Bez bazy komponentów (§15.2 jeszcze nie istnieje w tym projekcie) — porównanie po nazwie z listy
 * zamkniętej, nie po realnym numerze katalogowym.
 */
export function calculateZlaczaMc4(input: ZlaczaMc4Input): CalcResult<ZlaczaMc4Result> {
  const { errors } = validateInput(input)

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "",
      status: "INVALID_INPUT",
      formula: "",
      inputs: {},
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.producentZenski === "" || input.producentMeski === "") {
    return {
      value: pusty(),
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs: {},
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings: Warning[] = []
  const takiSamProducent = input.producentZenski === input.producentMeski
  const ktorysNieznany = input.producentZenski === NIEZNANY || input.producentMeski === NIEZNANY

  if (!takiSamProducent) {
    warnings.push(mieszaniProducenci())
  } else if (ktorysNieznany) {
    warnings.push(producentNieznany())
  } else {
    warnings.push(zlaczaZgodne(input.producentZenski))
  }

  const zgodne = takiSamProducent && !ktorysNieznany
  const hasCritical = warnings.some((w) => w.level === "critical")

  return {
    value: { zgodne },
    unit: "",
    status: hasCritical || warnings.some((w) => w.level === "warning") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs: {},
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
