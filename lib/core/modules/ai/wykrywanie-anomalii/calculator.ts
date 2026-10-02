import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { KASKADA_PV, type KrokKaskady, type PrzyczynaSpadku } from "./constants"
import type { WykrywanieAnomaliiInput } from "./input"
import { validateInput } from "./validation"
import { odchylenie, przyczyna, pvSpadek, zuzycieSpadek, zuzycieWzrost } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "\\Delta = E_{zmierzona} - E_{oczekiwana},\\quad \\Delta\\% = \\Delta / E_{oczekiwana} \\times 100"

export type WykrywanieAnomaliiResult = {
  odchylenieKwh: number
  odchyleniePct: number
  /** null = no threshold entered. */
  przekroczonyProg: boolean | null
  /** 12.17 — only for a PV drop: the first step answered „yes”, or „uszkodzenie” when all four are „no”. */
  przyczyna: PrzyczynaSpadku | null
  /** Next cascade step still to answer; null = cascade not needed or finished. */
  nastepnyKrok: KrokKaskady | null
}

const PUSTY: WykrywanieAnomaliiResult = {
  odchylenieKwh: 0,
  odchyleniePct: 0,
  przekroczonyProg: null,
  przyczyna: null,
  nastepnyKrok: null,
}

function kaskada(input: WykrywanieAnomaliiInput): { przyczyna: PrzyczynaSpadku | null; nastepnyKrok: KrokKaskady | null } {
  for (const krok of KASKADA_PV) {
    const odp = input.kaskada[krok]
    if (odp === true) return { przyczyna: krok, nastepnyKrok: null }
    if (odp !== false) return { przyczyna: null, nastepnyKrok: krok }
  }
  return { przyczyna: "uszkodzenie", nastepnyKrok: null }
}

/**
 * Moduł 10, Ekran 7 — the same mechanism for each subsystem: measured against expected. 12.13 PV: a drop below the
 * expected production for the conditions; 12.14 consumption: an unusual rise or fall; 12.17: when PV dropped, the
 * cause cascade in the source's order (weather → dirt → snow → shade → damage). The source's percentages („o 20%
 * niższa”, „wzrosło o 40%”) are examples, not thresholds (Dyrektywa #1) — the alarm threshold is the user's; without
 * it the screen shows the deviation only. One period, entered by hand until telemetry (Moduł 13) feeds it.
 */
export function calculateWykrywanieAnomalii(input: WykrywanieAnomaliiInput): CalcResult<WykrywanieAnomaliiResult> {
  const inputs: Record<string, number> = {
    oczekiwanaKwh: input.oczekiwanaKwh,
    zmierzonaKwh: input.zmierzonaKwh,
    progAlarmuPct: input.progAlarmuPct ?? Number.NaN,
  }
  const baza = { unit: "%", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const errors = validateInput(input)
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.oczekiwanaKwh === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const odchylenieKwh = input.zmierzonaKwh - input.oczekiwanaKwh
  const odchyleniePct = (odchylenieKwh / input.oczekiwanaKwh) * 100
  const prog = input.progAlarmuPct
  const warnings: Warning[] = []
  let przekroczonyProg: boolean | null = null

  if (prog === null || prog === 0) warnings.push(odchylenie(odchyleniePct, odchylenieKwh))
  else if (input.podsystem === "pv") {
    przekroczonyProg = -odchyleniePct >= prog
    if (przekroczonyProg) warnings.push(pvSpadek(odchyleniePct, prog))
  } else {
    przekroczonyProg = Math.abs(odchyleniePct) >= prog
    if (przekroczonyProg) warnings.push(odchyleniePct > 0 ? zuzycieWzrost(odchyleniePct, prog) : zuzycieSpadek(odchyleniePct, prog))
  }

  // The cascade runs for a PV drop: past the threshold, or for any drop when no threshold was entered.
  let wynikKaskady: { przyczyna: PrzyczynaSpadku | null; nastepnyKrok: KrokKaskady | null } = { przyczyna: null, nastepnyKrok: null }
  if (input.podsystem === "pv" && odchylenieKwh < 0 && przekroczonyProg !== false) {
    wynikKaskady = kaskada(input)
    if (wynikKaskady.przyczyna) warnings.push(przyczyna(wynikKaskady.przyczyna))
  }

  const assumptions: Assumption[] = [{ kod: input.podsystem === "pv" ? "ANOM-ZAL-PV" : "ANOM-ZAL-ZUZYCIE" }]
  return {
    ...baza,
    value: { odchylenieKwh, odchyleniePct, przekroczonyProg, ...wynikKaskady },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
