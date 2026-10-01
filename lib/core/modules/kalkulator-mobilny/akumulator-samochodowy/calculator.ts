import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { AkumulatorSamochodowyInput } from "./input"
import { validateInput } from "./validation"
import { ponadUzyteczna, rozruchowyNieDoGlebokiego, rozruchowyPonadUzyteczna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "t = \\dfrac{C_{Ah} \\times u}{P / U} = \\dfrac{C_{Ah} \\times U \\times u}{P}"

export type AkumulatorSamochodowyResult = {
  /** Czas pracy do granicy użytecznej pojemności [h]. */
  czasH: number
  /** Prąd pobierany z akumulatora [A] = P / U. */
  pradA: number
  /** Pojemność, którą wolno zużyć [Ah] = C × u. */
  pojemnoscUzytecznaAh: number
  /** Energia, którą wolno zużyć [Wh] = C × U × u. */
  energiaUzytecznaWh: number
}

const PUSTY_WYNIK: AkumulatorSamochodowyResult = { czasH: 0, pradA: 0, pojemnoscUzytecznaAh: 0, energiaUzytecznaWh: 0 }

/**
 * Ekran 16, Moduł 12 — "Czas pracy na akumulatorze samochodowym" (dawne 8.14). Biblia §12.14:
 * pojemność użyteczna (dla rozruchowego zwykle 30–50% — wpisuje user, Dyrektywa #1), prąd I = P/U,
 * czas do rozładowania. Przykład Biblii: 60 Ah rozruchowy, użyteczne 30 Ah, lodówka 50 W (4,2 A)
 * → ok. 7 h. 🔴 (Tresc E16): planowane rozładowanie rozruchowego ponad część użyteczną.
 */
export function calculateAkumulatorSamochodowy(input: AkumulatorSamochodowyInput): CalcResult<AkumulatorSamochodowyResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscAh: input.pojemnoscAh,
    napiecieV: input.napiecieV,
    uzytecznaPct: input.uzytecznaPct,
    mocW: input.mocW,
    planowanyCzasH: input.planowanyCzasH,
  }
  const baza = { unit: "h", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  if (errors.length > 0) {
    return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  }
  if (input.typ === null || input.pojemnoscAh === 0 || input.napiecieV === 0 || input.uzytecznaPct === 0 || input.mocW === 0) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const u = input.uzytecznaPct / 100
  const pojemnoscUzytecznaAh = input.pojemnoscAh * u
  const pradA = input.mocW / input.napiecieV
  const czasH = pojemnoscUzytecznaAh / pradA
  const energiaUzytecznaWh = pojemnoscUzytecznaAh * input.napiecieV

  const warnings: Warning[] = []
  const rozruchowy = input.typ === "rozruchowy"
  if (rozruchowy) warnings.push(rozruchowyNieDoGlebokiego())
  if (input.planowanyCzasH > 0 && input.planowanyCzasH > czasH) {
    warnings.push(rozruchowy ? rozruchowyPonadUzyteczna(input.planowanyCzasH, czasH) : ponadUzyteczna(input.planowanyCzasH, czasH))
  }
  const assumptions: Assumption[] = [
    { kod: "AS-ZALOZENIE-MOC-Z-AKUMULATORA" },
    { kod: "AS-ZALOZENIE-BEZ-TEMPERATURY" },
  ]

  return {
    ...baza,
    value: { czasH, pradA, pojemnoscUzytecznaAh, energiaUzytecznaWh },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
