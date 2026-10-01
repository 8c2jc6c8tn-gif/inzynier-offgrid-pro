import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { NAPIECIE_BAZOWE_V, NAPIECIE_LADOWANIA_12V } from "./constants"
import type { AlternatorVsPaneleInput } from "./input"
import { validateInput } from "./validation"
import { brakPokrycia, lifepo4BezDcDc, napiecieZaNiskie, napiecieZaWysokie } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_{alt} = I \\times U \\times h_{jazdy}, \\quad E_{PV} = P \\times h_{sł} \\times \\eta, \\quad t = \\dfrac{C \\times (1 - SoC_0)}{I}"

export type AlternatorVsPaneleResult = {
  energiaAlternatorWh: number
  energiaPaneliWh: number
  sumaWh: number
  /** Czas ładowania z alternatora od SoC startowego do pełna [h]; 0 = nie liczono. */
  czasLadowaniaH: number
  /** Okno napięcia ładowania dla typu i napięcia akumulatora [V]; null = nie wybrano typu. */
  oknoNapieciaV: { minV: number; maxV: number } | null
}

const PUSTY_WYNIK: AlternatorVsPaneleResult = {
  energiaAlternatorWh: 0,
  energiaPaneliWh: 0,
  sumaWh: 0,
  czasLadowaniaH: 0,
  oknoNapieciaV: null,
}

/** Rounds to 0.01 V so 14.6 × 2 compares as 29.2, not 29.199999…. */
const v2 = (x: number) => Math.round(x * 100) / 100

/**
 * Ekran 20, Moduł 12 — "Ładowanie z alternatora vs paneli" (dawne 8.40 + 8.43, Biblia §12.28, §12.31).
 * Energia na dobę z alternatora (prąd ładowania × napięcie × godziny jazdy) i z paneli (moc × słońce ×
 * sprawność), suma wobec zapotrzebowania; czas ładowania C × (1 − SoC) / I (przykład §12.31: 10 A, 100 Ah
 * od 50% → 5 h, odtworzony w teście). Okno napięcia ładowania wg typu akumulatora z §12.31 (dla 12 V,
 * skalowane × U/12): powyżej 🔴, poniżej 🟡. Przykład §12.28 ("2 h jazdy = 60 Ah") nie podaje prądu.
 */
export function calculateAlternatorVsPanele(input: AlternatorVsPaneleInput): CalcResult<AlternatorVsPaneleResult> {
  const { errors } = validateInput(input)
  const inputs = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  const baza = { unit: "Wh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (
    input.napiecieV === 0 ||
    input.godzinJazdy === 0 ||
    input.pradLadowaniaA === 0 ||
    input.mocPaneluW === 0 ||
    input.godzinSlonca === 0 ||
    input.sprawnoscToruPct === 0
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const energiaAlternatorWh = input.pradLadowaniaA * input.napiecieV * input.godzinJazdy
  const energiaPaneliWh = input.mocPaneluW * input.godzinSlonca * (input.sprawnoscToruPct / 100)
  const sumaWh = energiaAlternatorWh + energiaPaneliWh
  const czasLadowaniaH =
    input.pojemnoscAh > 0 ? (input.pojemnoscAh * (1 - input.socStartPct / 100)) / input.pradLadowaniaA : 0

  const okno12 = input.typAkumulatora ? NAPIECIE_LADOWANIA_12V[input.typAkumulatora] : null
  const skala = input.napiecieV / NAPIECIE_BAZOWE_V
  const oknoNapieciaV = okno12 ? { minV: v2(okno12.minV * skala), maxV: v2(okno12.maxV * skala) } : null

  const warnings: Warning[] = []
  if (oknoNapieciaV && input.napiecieLadowaniaV > 0) {
    if (input.napiecieLadowaniaV > oknoNapieciaV.maxV) warnings.push(napiecieZaWysokie(input.napiecieLadowaniaV, oknoNapieciaV.maxV))
    else if (input.napiecieLadowaniaV < oknoNapieciaV.minV) warnings.push(napiecieZaNiskie(input.napiecieLadowaniaV, oknoNapieciaV.minV))
  }
  if (input.typAkumulatora === "lifepo4" && input.maDcDc === false) warnings.push(lifepo4BezDcDc())
  if (input.zapotrzebowanieWhDoba > 0 && sumaWh < input.zapotrzebowanieWhDoba) {
    warnings.push(brakPokrycia(input.zapotrzebowanieWhDoba - sumaWh))
  }

  const assumptions = [{ kod: "AL-ZALOZENIE-STALY-PRAD" }]
  return {
    ...baza,
    value: { energiaAlternatorWh, energiaPaneliWh, sumaWh, czasLadowaniaH, oknoNapieciaV },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
