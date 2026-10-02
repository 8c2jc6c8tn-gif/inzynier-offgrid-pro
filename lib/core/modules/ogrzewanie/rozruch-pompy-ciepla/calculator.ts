import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { RozruchPompyCieplaInput } from "./input"
import { pracaPonadMoc, softstartWystarczy, startPonadSzczyt } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const VA_NA_KVA = 1000

const FORMULA = "S_{start} = U I_{LRA} \\;(1f),\\quad S_{start} = \\sqrt{3}\\, U I_{LRA} \\;(3f),\\quad S_{start} + P_{inne} \\le P_{szczyt},\\quad P_{pracy} + P_{inne} \\le P_{ciągła}"

export type RozruchPompyCieplaResult = {
  /** Apparent power at start without a soft starter [kVA]. */
  startKva: number
  /** Same with the soft starter [kVA]; null = no soft starter entered. */
  softstartKva: number | null
  /** Start (the soft one when entered) plus other loads [kVA]. */
  szczytWymaganyKva: number
  /** Running draw plus other loads [kW]. */
  pracaKw: number
}

const PUSTY: RozruchPompyCieplaResult = { startKva: 0, softstartKva: null, szczytWymaganyKva: 0, pracaKw: 0 }

/** Apparent power drawn at a given current [kVA] — single phase U·I, three phase √3·U·I (U line-to-line). */
export function mocPozornaKva(napiecieV: number, pradA: number, fazy: 1 | 3): number {
  return ((fazy === 3 ? Math.sqrt(3) : 1) * napiecieV * pradA) / VA_NA_KVA
}

/**
 * Moduł 6, Część 2C — rozruch i praca pompy ciepła z falownika albo agregatu (dawne 5.52, 5.61, 5.66; Biblia §6.27.26,
 * §6.27.35, §6.27.40). Physics: the apparent power drawn at the locked-rotor current. The source warns that the start
 * current (LRA) can overload the inverter/generator and advises a soft starter; it gives no thresholds, so the check is
 * the plain comparison with the source's own surge/maximum power from its datasheet.
 *
 * ✅🤖 The start kVA is compared with a kW rating as if cos φ = 1 — the power factor at start is not on the datasheet
 * and a lower one would only make the real kW smaller, so the check errs on the safe side. Other loads are added on
 * top (they keep running while the compressor starts).
 *
 * Source examples (Dyrektywa #5): 5.52 „prąd skoczy do 40 A, falownik 5 kW nie udźwignie” — 40 A × 230 V = 9,2 kVA;
 * whether a 5 kW inverter carries it depends on its surge rating (often given as a multiple of the continuous power for
 * a few seconds), which the example does not state. 5.61/5.66 „falownik/agregat 5 kW nie udźwignie startu pompy 8 kW”
 * mixes the pump's heating power (8 kW) with electrical power — the check here uses the electrical start current.
 */
export function calculateRozruchPompyCiepla(input: RozruchPompyCieplaInput): CalcResult<RozruchPompyCieplaResult> {
  const errors = ujemneWartosci({
    napiecieV: input.napiecieV,
    pradRozruchuA: input.pradRozruchuA,
    pradSoftstartA: input.pradSoftstartA,
    poborPracyKw: input.poborPracyKw,
    inneObciazenieKw: input.inneObciazenieKw,
    mocCiaglaKw: input.mocCiaglaKw,
    mocSzczytowaKw: input.mocSzczytowaKw,
  })
  const inputs = {
    fazy: input.fazy,
    napiecieV: input.napiecieV,
    pradRozruchuA: input.pradRozruchuA,
    pradSoftstartA: input.pradSoftstartA,
    poborPracyKw: input.poborPracyKw,
    inneObciazenieKw: input.inneObciazenieKw,
    mocCiaglaKw: input.mocCiaglaKw,
    mocSzczytowaKw: input.mocSzczytowaKw,
  }
  const baza = { unit: "kVA", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    input.zrodlo === null ||
    input.napiecieV === 0 ||
    input.pradRozruchuA === 0 ||
    input.poborPracyKw === 0 ||
    input.mocCiaglaKw === 0 ||
    input.mocSzczytowaKw === 0
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const startKva = mocPozornaKva(input.napiecieV, input.pradRozruchuA, input.fazy)
  const softstartKva = input.pradSoftstartA > 0 ? mocPozornaKva(input.napiecieV, input.pradSoftstartA, input.fazy) : null
  const inne = input.inneObciazenieKw
  const pracaKw = input.poborPracyKw + inne
  const warnings: Warning[] = []

  const bezSoftstartu = startKva + inne
  if (softstartKva === null) {
    if (bezSoftstartu > input.mocSzczytowaKw) warnings.push(startPonadSzczyt(bezSoftstartu, input.mocSzczytowaKw, false))
  } else if (softstartKva + inne > input.mocSzczytowaKw) {
    warnings.push(startPonadSzczyt(softstartKva + inne, input.mocSzczytowaKw, true))
  } else if (bezSoftstartu > input.mocSzczytowaKw) {
    warnings.push(softstartWystarczy(softstartKva + inne, input.mocSzczytowaKw))
  }
  if (pracaKw > input.mocCiaglaKw) warnings.push(pracaPonadMoc(pracaKw, input.mocCiaglaKw))

  const assumptions: Assumption[] = [{ kod: "ROZ-ZAL-KVA-JAK-KW" }]
  if (input.zrodlo === "agregat") assumptions.push({ kod: "ROZ-ZAL-AGREGAT-KOSZT" })
  return {
    ...baza,
    value: { startKva, softstartKva, szczytWymaganyKva: (softstartKva ?? startKva) + inne, pracaKw },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
