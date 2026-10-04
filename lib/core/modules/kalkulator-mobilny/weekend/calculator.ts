import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { WeekendInput } from "./input"
import { validateInput } from "./validation"
import { brakNaPochmurnyPobyt, brakNawetZPanelem } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_{d} = \\sum P_i \\times h_i \\times (n_{os}), \\quad E_{akum} = C \\times U \\times DoD, \\quad E_{PV,d} = P_{pan} \\times h_{sł} \\times \\eta, \\quad bilans = E_{akum} + d \\times E_{PV,d} - d \\times E_{d}"

export type WeekendResult = {
  /** Zapotrzebowanie na dobę [Wh]. */
  zuzycieDobaWh: number
  /** Zapotrzebowanie na cały pobyt [Wh]. */
  zuzyciePobytWh: number
  /** Energia akumulatora do wykorzystania [Wh]. */
  energiaAkumulatoraWh: number
  /** Na ile dób bez słońca starczy akumulator. */
  dniBezSlonca: number
  /** Średnia produkcja panelu na dobę [Wh]; 0 = bez panelu. */
  produkcjaPaneluDobaWh: number
  /** Energia na koniec pobytu [Wh] (ujemna = zabraknie). */
  bilansPobytuWh: number
}

const PUSTY_WYNIK: WeekendResult = {
  zuzycieDobaWh: 0,
  zuzyciePobytWh: 0,
  energiaAkumulatoraWh: 0,
  dniBezSlonca: 0,
  produkcjaPaneluDobaWh: 0,
  bilansPobytuWh: 0,
}

/**
 * Ekran 5, Moduł 12 — "Kalkulator na weekend" (dawne 8.5, Biblia §12.5). Sumuje dobowe zużycie z listy
 * urządzeń usera (urządzenia „na osobę” × liczba osób), sprawdza, na ile dób bez słońca starczy
 * akumulator, i — jeśli podano panel — bilans całego pobytu przy średniej produkcji. Uwaga: przykład
 * Biblii (800 Wh/dobę, 12 V 80 Ah → „wystarczy na 2 dni bez słońca”) się nie zgadza — nawet przy DoD
 * 100% to 960 / 800 = 1,2 doby. Ekran liczy wzorem, DoD wpisuje user (docs/memory.md).
 */
export function calculateWeekend(input: WeekendInput): CalcResult<WeekendResult> {
  const { errors } = validateInput(input)
  const inputs = {
    dni: input.dni,
    osoby: input.osoby,
    pojemnoscAh: input.pojemnoscAh,
    napiecieV: input.napiecieV,
    dodPct: input.dodPct,
    mocPaneluW: input.mocPaneluW,
    godzinSlonca: input.godzinSlonca,
    sprawnoscToruPct: input.sprawnoscToruPct,
  }
  const baza = { unit: "Wh", formula: FORMULA, formulaKey: "UI-FORMULA-KALKULATOR-MOBILNY-WEEKEND", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wpisane = input.urzadzenia.filter((u) => u.mocW > 0 && u.godzinNaDobe > 0)
  const panelWpisany = input.mocPaneluW > 0
  if (
    input.dni === 0 ||
    input.osoby === 0 ||
    wpisane.length === 0 ||
    input.pojemnoscAh === 0 ||
    input.napiecieV === 0 ||
    input.dodPct === 0 ||
    (panelWpisany && (input.godzinSlonca === 0 || input.sprawnoscToruPct === 0))
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zuzycieDobaWh = wpisane.reduce((s, u) => s + u.mocW * u.godzinNaDobe * (u.naOsobe ? input.osoby : 1), 0)
  const zuzyciePobytWh = zuzycieDobaWh * input.dni
  const energiaAkumulatoraWh = input.pojemnoscAh * input.napiecieV * (input.dodPct / 100)
  const dniBezSlonca = energiaAkumulatoraWh / zuzycieDobaWh
  const produkcjaPaneluDobaWh = panelWpisany ? input.mocPaneluW * input.godzinSlonca * (input.sprawnoscToruPct / 100) : 0
  const bilansPobytuWh = energiaAkumulatoraWh + input.dni * produkcjaPaneluDobaWh - zuzyciePobytWh

  const warnings: Warning[] = []
  if (dniBezSlonca < input.dni) warnings.push(brakNaPochmurnyPobyt(dniBezSlonca, input.dni))
  if (panelWpisany && bilansPobytuWh < 0) warnings.push(brakNawetZPanelem(-bilansPobytuWh))
  const assumptions: Assumption[] = [{ kod: "WK-ZALOZENIE-PELNY-NA-START" }]
  if (panelWpisany) assumptions.push({ kod: "WK-ZALOZENIE-PANEL-SREDNIA" })

  return {
    ...baza,
    value: { zuzycieDobaWh, zuzyciePobytWh, energiaAkumulatoraWh, dniBezSlonca, produkcjaPaneluDobaWh, bilansPobytuWh },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
