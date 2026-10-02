import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie/bojler-cwu/constants"
import { copPonizejJednosci, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { OdzyskCieplaSciekowInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

/** Source (Biblia §6.27.15): „Oblicza, ile energii można odzyskać (zwykle 20–40% ciepła ze ścieków)”. Info range only. */
export const SPRAWNOSC_ZRODLO_PCT = { min: 20, max: 40 } as const

const FORMULA = "Q = V c_w (\\theta_{ścieki} - \\theta_{zimna}) \\eta,\\quad Q_{rok} = Q \\cdot d,\\quad E = Q / COP"

export type OdzyskCieplaSciekowResult = {
  /** Heat recovered per day [kWh]. */
  cieploDobaKwh: number
  /** Per year [kWh]; null = no days entered. */
  cieploRokKwh: number | null
  /** Share of the annual domestic hot water heat [%]; null = no days or no demand. */
  udzialCwuPct: number | null
  /** Electricity saved per day [kWh]; null = no water heater COP. */
  pradDobaKwh: number | null
}

const PUSTY: OdzyskCieplaSciekowResult = { cieploDobaKwh: 0, cieploRokKwh: null, udzialCwuPct: null, pradDobaKwh: null }

function sprawnoscSpozaZrodla(pct: number): Warning {
  return {
    code: "DWHR-SPRAWNOSC-SPOZA-ZRODLA",
    level: "info",
    params: { pct, min: SPRAWNOSC_ZRODLO_PCT.min, max: SPRAWNOSC_ZRODLO_PCT.max },
    technicalMessage: `sprawnoscPct = ${pct} poza widełkami źródła ${SPRAWNOSC_ZRODLO_PCT.min}–${SPRAWNOSC_ZRODLO_PCT.max}%`,
    field: "sprawnoscPct",
  }
}

/**
 * Moduł 6, Część 2C — odzysk ciepła ze ścieków (dawne 5.41, Biblia §6.27.15). Q = V·c_w·(θ_ścieki − θ_zimna)·η with
 * the water heat capacity of M2 `bojler-cwu` (echo). Only water that drains while cold water flows to the heater counts
 * (the source: „najlepszy efekt jest przy równoczesnym poborze” — a shower); the user enters that volume.
 *
 * Source example (Dyrektywa #5): „0,5 kWh dziennie, czyli 180 kWh rocznie. To 10% zapotrzebowania na C.W.U.” —
 * 0,5 × 365 = 182,5 kWh (180 is rounded or ≈ 360 days); 10% means an annual hot-water demand of about 1800 kWh.
 */
export function calculateOdzyskCieplaSciekow(input: OdzyskCieplaSciekowInput): CalcResult<OdzyskCieplaSciekowResult> {
  const errors = [
    ...ujemneWartosci({ litryDoba: input.litryDoba, dniRok: input.dniRok, cwuKwhRok: input.cwuKwhRok }),
    ...procentPozaZakresem("sprawnoscPct", input.sprawnoscPct),
    ...copPonizejJednosci("copPodgrzewacza", input.copPodgrzewacza),
  ]
  const inputs = {
    litryDoba: input.litryDoba,
    tSciekowC: input.tSciekowC ?? 0,
    tZimnejC: input.tZimnejC ?? 0,
    sprawnoscPct: input.sprawnoscPct,
    dniRok: input.dniRok,
    cwuKwhRok: input.cwuKwhRok,
    copPodgrzewacza: input.copPodgrzewacza,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.litryDoba === 0 || input.sprawnoscPct === 0 || input.tSciekowC === null || input.tZimnejC === null) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const dt = Math.max(0, input.tSciekowC - input.tZimnejC)
  const cieploDobaKwh = input.litryDoba * WSPOLCZYNNIK_KWH_NA_L_K * dt * (input.sprawnoscPct / 100)
  const cieploRokKwh = input.dniRok > 0 ? cieploDobaKwh * input.dniRok : null
  const warnings: Warning[] = []
  if (input.sprawnoscPct < SPRAWNOSC_ZRODLO_PCT.min || input.sprawnoscPct > SPRAWNOSC_ZRODLO_PCT.max) {
    warnings.push(sprawnoscSpozaZrodla(input.sprawnoscPct))
  }
  return {
    ...baza,
    value: {
      cieploDobaKwh,
      cieploRokKwh,
      udzialCwuPct: cieploRokKwh !== null && input.cwuKwhRok > 0 ? (cieploRokKwh / input.cwuKwhRok) * 100 : null,
      pradDobaKwh: input.copPodgrzewacza > 0 ? cieploDobaKwh / input.copPodgrzewacza : null,
    },
    status: "VALID",
    assumptions: [{ kod: "DWHR-ZAL-ROWNOCZESNIE" }],
    warnings,
  }
}
