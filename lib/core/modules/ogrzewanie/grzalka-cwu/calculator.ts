import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../zapotrzebowanie-co-cwu/constants"
import type { GrzalkaCwuInput } from "./input"
import { validateInput } from "./validation"
import { czescZBaterii, grzalkaPonadFalownik, pvStala } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "Q = V \\Delta T c, \\quad t = \\dfrac{Q}{P_{ef}}, \\quad P_{ef} = \\begin{cases} P_{grz} & \\text{stała moc} \\\\ \\min(P_{grz}, P_{PV}) & \\text{regulator PV} \\end{cases}"

export type GrzalkaCwuResult = {
  /** Ciepło na podgrzanie zasobnika [kWh] = energia elektryczna grzałki (grzałka oporowa). */
  cieploKwh: number
  /** Czas grzania [h]. */
  czasH: number
  /** Część energii z nadwyżki PV [kWh]; null = PV nie wpisane. */
  energiaZPvKwh: number | null
  /** Część energii z baterii [kWh]; null = PV nie wpisane. */
  energiaZBateriiKwh: number | null
}

const PUSTY: GrzalkaCwuResult = { cieploKwh: 0, czasH: 0, energiaZPvKwh: null, energiaZBateriiKwh: null }

const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Ekran 18, Moduł 6 — "Grzałki elektryczne do C.W.U." (dawne 5.22, Biblia §6.22). Źródło: czas grzania =
 * f(moc grzałki, ΔT, pojemność) — fizyka ciepła właściwego wody, ta sama stała co M2/E2 i M6/E2:
 * Q = V·ΔT·c, t = Q / P. Grzałka oporowa zamienia prąd w ciepło 1:1; straty zasobnika w czasie grzania
 * pominięte (liczy je Ekran 17). Planowanie pod PV: grzałka o stałej mocy pobiera swoją moc niezależnie od
 * słońca (brakującą część daje bateria), regulator nadwyżki PV obniża moc do nadwyżki (grzeje dłużej, 0 z
 * baterii). Nadwyżka PV przyjęta jako stała przez czas grzania (ℹ️ ✅🤖). 🟡 źródła „sprawdź, czy falownik
 * udźwignie” — gdy moc grzałki > moc ciągła falownika (próg = karta falownika; inne odbiorniki w tym czasie
 * nie są doliczane).
 *
 * Przykład źródła: „2 kW, 200 l od 10 do 50 °C → 4,6 h, 9,2 kWh” — fizyka daje 9,30 kWh i 4,65 h (źródło
 * zaokrągliło czas, a energię policzyło z zaokrąglonego czasu 4,6 × 2). Niespójność (Dyrektywa #5): „przy
 * produkcji PV 3 kW zajmie to tylko 3 h” — grzałka 2 kW nie pobierze 3 kW, więc czas zostaje 4,65 h; 3,1 h
 * wychodzi dopiero dla grzałki 3 kW.
 */
export function calculateGrzalkaCwu(input: GrzalkaCwuInput): CalcResult<GrzalkaCwuResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscL: input.pojemnoscL,
    mocGrzalkiKw: input.mocGrzalkiKw,
    mocPvKw: input.mocPvKw,
    mocFalownikaKw: input.mocFalownikaKw,
  }
  const baza = { unit: "h", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const zPv = input.mocPvKw > 0
  if (
    input.pojemnoscL === 0 ||
    input.tStartC === null ||
    input.tKoniecC === null ||
    input.mocGrzalkiKw === 0 ||
    (zPv && input.sterowanie === null)
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const cieploKwh = input.pojemnoscL * (input.tKoniecC - input.tStartC) * WSPOLCZYNNIK_KWH_NA_L_K
  const warnings: Warning[] = []
  let czasH = cieploKwh / input.mocGrzalkiKw
  let energiaZPvKwh: number | null = null
  let energiaZBateriiKwh: number | null = null
  if (zPv) {
    if (input.sterowanie === "regulator-pv") {
      czasH = cieploKwh / Math.min(input.mocGrzalkiKw, input.mocPvKw)
      energiaZPvKwh = cieploKwh
      energiaZBateriiKwh = 0
    } else {
      energiaZPvKwh = Math.min(cieploKwh, input.mocPvKw * czasH)
      energiaZBateriiKwh = cieploKwh - energiaZPvKwh
      if (energiaZBateriiKwh > 0) warnings.push(czescZBaterii(r2(energiaZBateriiKwh)))
    }
    warnings.push(pvStala())
  }
  if (input.mocFalownikaKw > 0 && input.mocGrzalkiKw > input.mocFalownikaKw) {
    warnings.push(grzalkaPonadFalownik(input.mocGrzalkiKw, input.mocFalownikaKw))
  }

  const assumptions: Assumption[] = [{ kod: "GRZ-ZALOZENIE-OPOROWA" }]
  return {
    ...baza,
    value: { cieploKwh, czasH, energiaZPvKwh, energiaZBateriiKwh },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
