import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { obliczNapiecieStringuZimowego } from "@/lib/core/modules/pv/stress-test-mppt/calculator"
import { PROG_OSTRZEGAWCZY_UDZIAL_LIMITU } from "@/lib/core/modules/pv/stress-test-mppt/constants"
import type { PanelDoStacjiZasilaniaInput } from "./input"
import { validateInput } from "./validation"
import { bliskoLimituNapiecia, polaryzacjaInfo, pradPowyzejLimitu, przekroczoneNapiecieWejscia } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "V_{oc,zima} = n_s \\times V_{oc} \\times (1 + \\beta (T_{min} - 25)) \\le U_{max,wej} \;\; ; \;\; I_{sc} \\times n_p \\le I_{max,wej}"

export type PanelDoStacjiZasilaniaResult = {
  /** Napięcie jałowe całego łańcucha w najniższej temperaturze [V]. */
  vocZimoweV: number
  /** Udział limitu napięcia wejścia [%]. */
  udzialLimituPct: number
  /** Suma prądów zwarciowych gałęzi [A]. null = nie podano Isc. */
  pradZwarciowyA: number | null
}

const PUSTY_WYNIK: PanelDoStacjiZasilaniaResult = { vocZimoweV: 0, udzialLimituPct: 0, pradZwarciowyA: null }

/**
 * Ekran 39, Moduł 12 — "Łączenie paneli z powerbankiem/stacją zasilania" (dawne 8.66). Wzorzec "echo":
 * napięcie łańcucha w mrozie liczone tą samą funkcją co Moduł 3/Ekran 5 (`obliczNapiecieStringuZimowego`),
 * te same progi werdyktu (> limit → 🔴, > 95% limitu → 🟡). 🔴 ze źródła: przekroczenie max napięcia
 * wejścia solarnego stacji — mają niższe limity niż profesjonalne MPPT.
 *
 * Prąd (Biblia §12.54: „sprawdza prąd zwarciowy”) — tylko 🟡: źródło nie stawia tu stopu, a wiele stacji
 * samo ogranicza pobierany prąd; decyduje instrukcja producenta. Dobór przejściówek (MC4/XT60/Anderson)
 * świadomie pominięty — źródło nie podaje danych do doboru, tylko nazwy złączy.
 */
export function calculatePanelDoStacjiZasilania(
  input: PanelDoStacjiZasilaniaInput,
): CalcResult<PanelDoStacjiZasilaniaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    vocStcV: input.vocStcV,
    betaPctNaC: input.betaPctNaC,
    tminC: input.tminC ?? 0,
    liczbaSzeregowo: input.liczbaSzeregowo,
    maxNapiecieWejsciaV: input.maxNapiecieWejsciaV,
    iscA: input.iscA,
    liczbaRownolegle: input.liczbaRownolegle,
    maxPradWejsciaA: input.maxPradWejsciaA,
  }

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (
    input.vocStcV === 0 ||
    input.betaPctNaC === 0 ||
    input.tminC === null ||
    input.liczbaSzeregowo === 0 ||
    input.maxNapiecieWejsciaV === 0
  ) {
    return {
      value: PUSTY_WYNIK,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const vocZimoweV = obliczNapiecieStringuZimowego(input.vocStcV, input.betaPctNaC, input.tminC, input.liczbaSzeregowo)
  const udzialLimituPct = (vocZimoweV / input.maxNapiecieWejsciaV) * 100

  const warnings: Warning[] = []
  if (vocZimoweV > input.maxNapiecieWejsciaV) {
    warnings.push(przekroczoneNapiecieWejscia(vocZimoweV, input.maxNapiecieWejsciaV))
  } else if (vocZimoweV > PROG_OSTRZEGAWCZY_UDZIAL_LIMITU * input.maxNapiecieWejsciaV) {
    warnings.push(bliskoLimituNapiecia(vocZimoweV, input.maxNapiecieWejsciaV))
  }

  const galezie = Math.max(1, input.liczbaRownolegle)
  const pradZwarciowyA = input.iscA > 0 ? input.iscA * galezie : null
  if (pradZwarciowyA !== null && input.maxPradWejsciaA > 0 && pradZwarciowyA > input.maxPradWejsciaA) {
    warnings.push(pradPowyzejLimitu(pradZwarciowyA, input.maxPradWejsciaA))
  }
  warnings.push(polaryzacjaInfo())

  const assumptions: Assumption[] = [{ kod: "PST-ZALOZENIE-VOC-W-MROZIE" }]
  if (pradZwarciowyA === null || input.maxPradWejsciaA === 0) assumptions.push({ kod: "PST-ZALOZENIE-PRAD-NIESPRAWDZONY" })

  return {
    value: { vocZimoweV, udzialLimituPct, pradZwarciowyA },
    unit: "V",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
