import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { SCENARIUSZE } from "./constants"
import type { KreatorMalegoOdbiornikaInput } from "./input"
import { validateInput } from "./validation"
import { akumulatorZaMaly, panelNiePokrywa, rozruchPrzezFalownik, swiatloPrzezFalownik, uwagaScenariusza } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_{d} = \\sum P_i h_i, \\quad E_T = E_d \\times \\dfrac{T}{24}, \\quad C_{min} = \\dfrac{E_T}{U \\times u \\times \\eta_f}, \\quad E_{PV} = P \\times h_{sł} \\times \\eta"

export type KreatorMalegoOdbiornikaResult = {
  zuzycieDobaWh: number
  /** Suma mocy wszystkich składników (wszystkie naraz) [W] — minimalna moc ciągła falownika. */
  sumaMocyW: number
  /** Szczyt przy rozruchu najbardziej wymagającego składnika [W]. */
  szczytW: number
  energiaPodtrzymaniaWh: number
  minimalnyAh: number
  /** Na ile godzin starczy posiadany akumulator; 0 = nie podano. */
  posiadanyStarczyH: number
  /** Energia z panelu na dobę [Wh]; 0 = bez panelu. */
  energiaPaneluWh: number
}

const PUSTY_WYNIK: KreatorMalegoOdbiornikaResult = {
  zuzycieDobaWh: 0,
  sumaMocyW: 0,
  szczytW: 0,
  energiaPodtrzymaniaWh: 0,
  minimalnyAh: 0,
  posiadanyStarczyH: 0,
  energiaPaneluWh: 0,
}

/**
 * Ekran 12, Moduł 12 — "Kreator zasilania małego odbiornika" (Biblia §12.24 + scenariusze dołączone). Logika
 * wspólna wszystkich scenariuszy (Tresc): moc odbiornika, wymagany czas podtrzymania, minimalny zestaw —
 * akumulator E_T / (U × u × η_f) (η_f = 1 bez falownika) i ewentualny falownik ≥ suma mocy, szczyt przy
 * rozruchu jak w E8. Scenariusz dodaje tylko nazwy typowych składników i notę Biblii.
 * Przykłady Biblii sprawdzone: alarm 25 W, 12 V 40 Ah → 19,2 h (§12.24.3, odtworzony w teście); kocioł
 * 70 W, 100 Ah → 17,1 h (§12.41); LED 30 W, 50 Ah → 20 h przy pełnej pojemności, Biblia podaje 16 h (zgodne
 * dopiero przy części użytecznej 80%); brama §12.24.4 "200 W, cykl 20 s, 10 cykli = 40 Wh" — z tych liczb
 * 11,1 Wh (§12.55 podaje 40 Wh na jeden cykl) — przykłady niespójne, ekran liczy wzorem.
 */
export function calculateKreatorMalegoOdbiornika(
  input: KreatorMalegoOdbiornikaInput,
): CalcResult<KreatorMalegoOdbiornikaResult> {
  const { errors } = validateInput(input)
  const inputs = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  const baza = { unit: "Ah", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wpisane = input.skladniki.filter((s) => s.mocW > 0 && s.godzinNaDobe > 0)
  if (
    wpisane.length === 0 ||
    input.czasPodtrzymaniaH === 0 ||
    input.napiecieV === 0 ||
    input.uzytecznaPct === 0 ||
    input.przezFalownik === null ||
    (input.przezFalownik && input.sprawnoscFalownikaPct === 0) ||
    (input.mocPaneluW > 0 && (input.godzinSlonca === 0 || input.sprawnoscToruPct === 0))
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zuzycieDobaWh = wpisane.reduce((s, x) => s + x.mocW * x.godzinNaDobe, 0)
  const sumaMocyW = wpisane.reduce((s, x) => s + x.mocW, 0)
  const szczytW = sumaMocyW + Math.max(...wpisane.map((x) => x.mocW * (Math.max(x.krotnoscRozruchu, 1) - 1)))
  const etaF = input.przezFalownik ? input.sprawnoscFalownikaPct / 100 : 1
  const whNaAh = input.napiecieV * (input.uzytecznaPct / 100) * etaF
  const energiaPodtrzymaniaWh = (zuzycieDobaWh * input.czasPodtrzymaniaH) / 24
  const minimalnyAh = energiaPodtrzymaniaWh / whNaAh
  const posiadanyStarczyH = input.posiadanyAh > 0 ? ((input.posiadanyAh * whNaAh) / zuzycieDobaWh) * 24 : 0
  const energiaPaneluWh = input.mocPaneluW * input.godzinSlonca * (input.sprawnoscToruPct / 100)

  const warnings: Warning[] = []
  if (input.scenariusz === "oswietlenie-awaryjne" && input.przezFalownik) warnings.push(swiatloPrzezFalownik())
  if (input.posiadanyAh > 0 && input.posiadanyAh < minimalnyAh) {
    warnings.push(akumulatorZaMaly(input.posiadanyAh, minimalnyAh, posiadanyStarczyH))
  }
  if (input.mocPaneluW > 0 && energiaPaneluWh < zuzycieDobaWh) warnings.push(panelNiePokrywa(energiaPaneluWh, zuzycieDobaWh))
  if (input.przezFalownik && szczytW > sumaMocyW) warnings.push(rozruchPrzezFalownik(szczytW))
  const scenariusz = SCENARIUSZE.find((s) => s.id === input.scenariusz)
  if (scenariusz) warnings.push(uwagaScenariusza(scenariusz.uwaga))

  return {
    ...baza,
    value: { zuzycieDobaWh, sumaMocyW, szczytW, energiaPodtrzymaniaWh, minimalnyAh, posiadanyStarczyH, energiaPaneluWh },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "KZ-ZALOZENIE-ROWNOMIERNY-POBOR" }],
    warnings,
  }
}
