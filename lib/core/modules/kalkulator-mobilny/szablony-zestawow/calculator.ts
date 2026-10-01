import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { godzinyPonadDobe, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { SzablonyZestawowInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_d = \\sum P_i h_i (\\times n_{os}), \\quad C_{pobyt} = \\dfrac{E_d \\times d}{U \\times DoD}, \\quad C_{doba} = \\dfrac{E_d}{U \\times DoD}, \\quad P_{PV} = \\dfrac{E_d}{h_{sł} \\times \\eta}, \\quad I_{reg} = \\dfrac{P_{PV}}{U}"

export type SzablonyZestawowResult = {
  zuzycieDobaWh: number
  zuzyciePobytWh: number
  /** Suma mocy wszystkich urządzeń naraz [W]. */
  szczytW: number
  /** Akumulator na cały pobyt bez słońca [Ah]. */
  minimalnyAhPobyt: number
  /** Akumulator na jedną dobę — gdy panel pokrywa dobowe zużycie [Ah]. */
  minimalnyAhDoba: number
  /** Panel pokrywający dobowe zużycie [W]; 0 = bez panelu. */
  minimalnyPanelW: number
  /** Prąd ładowania z tego panelu po stronie akumulatora — minimum dla regulatora [A]; 0 = bez panelu. */
  pradRegulatoraA: number
}

const PUSTY_WYNIK: SzablonyZestawowResult = {
  zuzycieDobaWh: 0,
  zuzyciePobytWh: 0,
  szczytW: 0,
  minimalnyAhPobyt: 0,
  minimalnyAhDoba: 0,
  minimalnyPanelW: 0,
  pradRegulatoraA: 0,
}

/**
 * Ekran 3, Moduł 12 — "Gotowe szablony zestawów" (dawne 8.3 + 8.16, Biblia §12.3, §12.16). Szablon ładuje
 * nazwy typowych odbiorników (constants.ts), user wpisuje moce i czasy. Wynik: zapotrzebowanie dobowe i na
 * pobyt, szczyt (wszystko naraz), minimalny akumulator — na cały pobyt bez słońca i na dobę (gdy panel
 * nadąża), panel pokrywający dobę i minimalny prąd regulatora P/U (dobór typu PWM/MPPT — M12 "PWM vs MPPT").
 * Przykład Biblii („1,8 kWh/dobę, szczyt 400 W → LiFePO4 100 Ah, 2 × 100 W, MPPT 20 A”) nie podaje DoD ani
 * słońca — 1800 Wh / 12 V = 150 Ah nawet przy DoD 100%, więc „100 Ah” zakłada panel doładowujący w ciągu dnia.
 */
export function calculateSzablonyZestawow(input: SzablonyZestawowInput): CalcResult<SzablonyZestawowResult> {
  const liczby: Record<string, number> = {
    dni: input.dni,
    osoby: input.osoby,
    napiecieV: input.napiecieV,
    dodPct: input.dodPct,
    godzinSlonca: input.godzinSlonca,
    sprawnoscToruPct: input.sprawnoscToruPct,
  }
  const wiersze = input.urzadzenia.flatMap((u, i) => {
    liczby[`urzadzenia[${i}].mocW`] = u.mocW
    liczby[`urzadzenia[${i}].godzinNaDobe`] = u.godzinNaDobe
    return godzinyPonadDobe(`urzadzenia[${i}].godzinNaDobe`, u.godzinNaDobe)
  })
  const errors = [
    ...ujemneWartosci(liczby),
    ...wiersze,
    ...procentPozaZakresem("dodPct", input.dodPct),
    ...procentPozaZakresem("sprawnoscToruPct", input.sprawnoscToruPct),
    ...godzinyPonadDobe("godzinSlonca", input.godzinSlonca),
  ]
  const baza = { unit: "Ah", formula: FORMULA, inputs: liczby, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wpisane = input.urzadzenia.filter((u) => u.mocW > 0 && u.godzinNaDobe > 0)
  const zPanelem = input.godzinSlonca > 0
  if (
    wpisane.length === 0 ||
    input.dni === 0 ||
    input.osoby === 0 ||
    input.napiecieV === 0 ||
    input.dodPct === 0 ||
    (zPanelem && input.sprawnoscToruPct === 0)
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const krotnosc = (naOsobe: boolean) => (naOsobe ? input.osoby : 1)
  const zuzycieDobaWh = wpisane.reduce((s, u) => s + u.mocW * u.godzinNaDobe * krotnosc(u.naOsobe), 0)
  const szczytW = wpisane.reduce((s, u) => s + u.mocW * krotnosc(u.naOsobe), 0)
  const whNaAh = input.napiecieV * (input.dodPct / 100)
  const minimalnyPanelW = zPanelem ? zuzycieDobaWh / (input.godzinSlonca * (input.sprawnoscToruPct / 100)) : 0

  const assumptions: Assumption[] = [{ kod: "SZ-ZALOZENIE-PUNKT-STARTOWY" }]
  if (zPanelem) assumptions.push({ kod: "SZ-ZALOZENIE-PANEL-NA-DOBE" })
  return {
    ...baza,
    value: {
      zuzycieDobaWh,
      zuzyciePobytWh: zuzycieDobaWh * input.dni,
      szczytW,
      minimalnyAhPobyt: (zuzycieDobaWh * input.dni) / whNaAh,
      minimalnyAhDoba: zuzycieDobaWh / whNaAh,
      minimalnyPanelW,
      pradRegulatoraA: minimalnyPanelW / input.napiecieV,
    },
    status: "VALID",
    assumptions,
    warnings: [],
  }
}
