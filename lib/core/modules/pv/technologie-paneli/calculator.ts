import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { TechnologiePaneliInput } from "./input"
import { validateInput } from "./validation"
import {
  GRUPY_TECHNOLOGII,
  NATEZENIE_STC_W_M2,
  TECHNOLOGIE_KRYSTALICZNE,
  type Sprawnosc,
} from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

const W_NA_KW = 1000

export type PowierzchniaTechnologii = {
  id: string
  /** Powierzchnia modułów dla planowanej mocy przy górnej granicy sprawności [m²]; `null` — sprawność otwarta w górę ("23%+"). */
  powierzchniaMinM2: number | null
  /** Powierzchnia modułów dla planowanej mocy przy dolnej granicy sprawności [m²]. */
  powierzchniaMaxM2: number
}

export type TechnologiePaneliResult = {
  krystaliczne: PowierzchniaTechnologii[]
  grupy: PowierzchniaTechnologii[]
}

const FORMULA = `A = \\frac{P_{kWp} \\times 1000}{\\eta \\times ${NATEZENIE_STC_W_M2}\\,\\text{W/m}^2}`

/**
 * Powierzchnia modułów na zadaną moc [m²] z definicji mocy znamionowej: 1 kWp to 1000 W przy
 * natężeniu STC 1000 W/m², więc A = P / (η × 1000 W/m²). Fizyka bez wolnego parametru —
 * sprawność przekłada się na POWIERZCHNIĘ na kWp, nie na kWh z kWp.
 */
export function obliczPowierzchnieM2(mocKwp: number, sprawnoscPct: number): number {
  return (mocKwp * W_NA_KW) / ((sprawnoscPct / 100) * NATEZENIE_STC_W_M2)
}

function powierzchnia(id: string, mocKwp: number, sprawnosc: Sprawnosc): PowierzchniaTechnologii {
  return {
    id,
    powierzchniaMinM2: sprawnosc.maxPct === null ? null : obliczPowierzchnieM2(mocKwp, sprawnosc.maxPct),
    powierzchniaMaxM2: obliczPowierzchnieM2(mocKwp, sprawnosc.minPct),
  }
}

/**
 * Ekran 15, Moduł 3 — "Technologie paneli". Dane porównawcze (sprawność, degradacja, uzysk) to
 * treść źródła wyświetlana 1:1 (`constants.ts`); jedyne obliczenie to powierzchnia modułów dla
 * planowanej mocy. 🔎 Deklarowany w źródle wzrost uzysku per technologia (§3.30) NIE jest tu
 * używany jako mnożnik — patrz `docs/memory.md` (25.09.2026) i `docs/rejestr-pokrycia.md` Ekran 15.
 */
export function calculateTechnologiePaneli(input: TechnologiePaneliInput): CalcResult<TechnologiePaneliResult> {
  const { errors } = validateInput(input)
  const pustyWynik: TechnologiePaneliResult = { krystaliczne: [], grupy: [] }
  const inputs = { mocInstalacjiKwp: input.mocInstalacjiKwp }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "m²",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.mocInstalacjiKwp === 0) {
    return {
      value: pustyWynik,
      unit: "m²",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const moc = input.mocInstalacjiKwp
  return {
    value: {
      krystaliczne: TECHNOLOGIE_KRYSTALICZNE.map((tech) => powierzchnia(tech.id, moc, tech.sprawnosc)),
      grupy: GRUPY_TECHNOLOGII.map((grupa) => powierzchnia(grupa.id, moc, grupa.sprawnosc)),
    },
    unit: "m²",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      { kod: "TECHNOLOGIE-POWIERZCHNIA-MODULOW" },
      { kod: "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA" },
    ] satisfies Assumption[],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
