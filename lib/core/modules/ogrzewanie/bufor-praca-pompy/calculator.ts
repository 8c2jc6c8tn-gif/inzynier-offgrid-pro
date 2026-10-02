import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie/bojler-cwu/constants"
import { buforPracaCiagla } from "../wplyw-czynnika/warnings"
import { cyklStartStop, type CyklStartStop } from "../wspolne/hydraulika"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { BuforPracaPompyInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "C = V c_w,\\; t_{pracy} = \\dfrac{C \\Delta T_h}{P - L},\\; t_{postoju} = \\dfrac{C \\Delta T_h}{L},\\; n = \\dfrac{24\\,h}{t_{pracy} + t_{postoju}},\\quad " +
  "Q_{mag} = V_b c_w \\Delta T_{mag},\\; t = Q_{mag}/L,\\quad E_{strat} = S \\cdot 24\\,h \\cdot d"

const W_NA_KW = 1000

export type BuforPracaPompyResult = {
  /** Cycle without the buffer; null = continuous run (load >= pump power). */
  bez: CyklStartStop | null
  /** Cycle with the buffer; null = continuous run. */
  z: CyklStartStop | null
  /** Heat the buffer stores over `dTMagazynK` [kWh]; null = not entered. */
  cieploMagazynKwh: number | null
  /** Hours the stored heat covers the average load [h]; null = no storage or load. */
  czasPokryciaH: number | null
  /** Standing loss per day [kWh]; null = not entered. */
  stratyDobaKwh: number | null
  /** Standing loss per season [kWh]; null = no days. */
  stratySezonKwh: number | null
}

const PUSTY: BuforPracaPompyResult = { bez: null, z: null, cieploMagazynKwh: null, czasPokryciaH: null, stratyDobaKwh: null, stratySezonKwh: null }

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 14: współpraca pompy z buforem (dawne 5.28, Biblia §6.27.2) i praca z buforem
 * i bez (dawne 5.70, §6.27.44). What the source asks and has physics for: fewer starts (the same start/stop cycle on a
 * water volume as the 2D factor „bufor-starty” 5.100 — `cyklStartStop`, Dyrektywa #8), heat stored when it is cheap
 * (PV) and the hours it covers (Q = V·c_w·ΔT, water constant of M2 `bojler-cwu`), and the price of a bigger buffer — its
 * standing loss S from the datasheet × time.
 *
 * Not computed (Dyrektywa #1): the energy saving of fewer starts („oszczędzisz 15%”, „oszczędność 10%”) and the longer
 * pump life — the source gives no model of start losses or compressor wear; assumption shown.
 *
 * Source examples (Dyrektywa #5): 5.28 „z buforem 200 l pompa będzie pracować 4 razy na dobę po 40 minut zamiast 20 razy
 * po 5 minut” — 160 min against 100 min of running per day for the same heat; at the same power the daily run time
 * cannot change with the buffer (it is heat ÷ power), only its split into cycles. 5.28 says 15% saving and 5.70 says 10%
 * for the same „20 → 4 starty” — two numbers for one case, none computed here. 20 → 4 starts (5×) needs about 5× more
 * water in the cycle (buffer ≈ 4× the installation water) — the same note as 5.100.
 */
export function calculateBuforPracaPompy(input: BuforPracaPompyInput): CalcResult<BuforPracaPompyResult> {
  const errors = ujemneWartosci({ ...input })
  const inputs = { ...input }
  const baza = { unit: "1/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const { mocPompyKw: p, obciazenieKw: l, wodaInstalacjiL, histerezaK, buforL } = input
  if (p === 0 || l === 0 || wodaInstalacjiL === 0 || histerezaK === 0 || buforL === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const assumptions: Assumption[] = [{ kod: "WPC-ZAL-START-STOP" }, { kod: "BPP-ZAL-BEZ-OSZCZEDNOSCI" }]
  const ciagla = l >= p
  if (ciagla) warnings.push(buforPracaCiagla())
  const cieploMagazynKwh = input.dTMagazynK > 0 ? buforL * WSPOLCZYNNIK_KWH_NA_L_K * input.dTMagazynK : null
  const stratyDobaKwh = input.stratyPostojoweW > 0 ? (input.stratyPostojoweW * 24) / W_NA_KW : null
  return {
    ...baza,
    value: {
      bez: ciagla ? null : cyklStartStop(wodaInstalacjiL, histerezaK, p, l),
      z: ciagla ? null : cyklStartStop(wodaInstalacjiL + buforL, histerezaK, p, l),
      cieploMagazynKwh,
      czasPokryciaH: cieploMagazynKwh === null ? null : cieploMagazynKwh / l,
      stratyDobaKwh,
      stratySezonKwh: stratyDobaKwh !== null && input.dniPracy > 0 ? stratyDobaKwh * input.dniPracy : null,
    },
    status: "VALID",
    assumptions,
    warnings,
  }
}
