import type { CalcResult } from "@/lib/core/calc-result"
import type { PompyCyrkulacyjneInput } from "./input"
import { validateInput } from "./validation"
import { oszczednoscInfo, nowaPompaNieOszczedza } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type PompyCyrkulacyjneResult = {
  energiaObecnaKwh: number
  energiaNowaKwh: number
  oszczednoscKwh: number
  oszczednoscPct: number
}

const FORMULA =
  "E = \\frac{P \\times h}{1000} \\;\\; ; \\;\\; oszczędność = E_{obecna} - E_{nowa}"

/**
 * Ekran 15, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Pompy cyrkulacyjne — dobór"
 * (dawne 5.15, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Sekcja B). Energia = moc × czas
 * (definicja jednostki, nie wymyślony współczynnik). Godziny pracy dobowo to pole ręcznego
 * wpisu (D16) — źródło opisuje profil "ciągły/sterowany" bez wzoru przeliczającego "sterowany"
 * na konkretną liczbę godzin.
 *
 * Przykład źródła (pompa 45W, praca 24/7 → 1,08 kWh/dobę; pompa elektroniczna 8W → 0,19 kWh/dobę)
 * odtworzony DOKŁADNIE przy godzinyPracyDobowoH=24, zweryfikowany niezależnie w Pythonie.
 */
export function calculatePompyCyrkulacyjne(
  input: PompyCyrkulacyjneInput,
): CalcResult<PompyCyrkulacyjneResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PompyCyrkulacyjneResult = {
    energiaObecnaKwh: 0,
    energiaNowaKwh: 0,
    oszczednoscKwh: 0,
    oszczednoscPct: 0,
  }
  const inputs = {
    mocObecnejPompyW: input.mocObecnejPompyW,
    mocNowejPompyW: input.mocNowejPompyW,
    godzinyPracyDobowoH: input.godzinyPracyDobowoH,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.mocObecnejPompyW === 0 || input.mocNowejPompyW === 0 || input.godzinyPracyDobowoH === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaObecnaKwh = (input.mocObecnejPompyW * input.godzinyPracyDobowoH) / 1000
  const energiaNowaKwh = (input.mocNowejPompyW * input.godzinyPracyDobowoH) / 1000
  const oszczednoscKwh = energiaObecnaKwh - energiaNowaKwh
  const oszczednoscPct = (oszczednoscKwh / energiaObecnaKwh) * 100

  const warnings =
    input.mocNowejPompyW >= input.mocObecnejPompyW
      ? [nowaPompaNieOszczedza()]
      : [oszczednoscInfo(oszczednoscKwh, oszczednoscPct)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { energiaObecnaKwh, energiaNowaKwh, oszczednoscKwh, oszczednoscPct },
    unit: "kWh/dobę",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Godziny pracy dobowo wpisane ręcznie — źródło opisuje profil ciągły/sterowany bez wzoru na konkretną liczbę godzin dla trybu sterowanego.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
