import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie/bojler-cwu/constants"

/**
 * Water-side physics shared by the Module 6 heat pump screens (Dyrektywa #8 — one formula in one place): the 2D factor
 * engine (`wplyw-czynnika`, factors „przeplyw” 5.94 and „bufor-starty” 5.100) and the Part 2B additions to Screens 14
 * and 15 (5.28/5.70 buffer, 5.65 flow). Only the water heat capacity of M2 `bojler-cwu` — no other coefficient.
 */

const MIN_NA_H = 60

/** Water flow that carries `mocKw` at a temperature difference `dTK`: V̇ = P / (c_w·ΔT) [l/h]. */
export function przeplywWodyLH(mocKw: number, dTK: number): number {
  return mocKw / (WSPOLCZYNNIK_KWH_NA_L_K * dTK)
}

export type CyklStartStop = {
  /** Compressor run time of one cycle [min]. */
  pracaMin: number
  /** Standstill of one cycle [min]. */
  postojMin: number
  /** Starts per day = 24 h / (run + standstill). */
  startyDoba: number
}

/**
 * On/off cycle of a start/stop heat pump on a water volume (installation water, plus buffer): the controller switches
 * the pump on at T − ΔT_h and off at T, so one cycle stores C·ΔT_h = V·c_w·ΔT_h. While running, the pump charges it with
 * (P − L); while standing still, the load L drains it. Requires 0 < L < P (the caller handles L >= P = continuous run).
 */
export function cyklStartStop(litry: number, histerezaK: number, mocKw: number, obciazenieKw: number): CyklStartStop {
  const energia = litry * WSPOLCZYNNIK_KWH_NA_L_K * histerezaK
  const pracaMin = (energia / (mocKw - obciazenieKw)) * MIN_NA_H
  const postojMin = (energia / obciazenieKw) * MIN_NA_H
  return { pracaMin, postojMin, startyDoba: (24 * MIN_NA_H) / (pracaMin + postojMin) }
}
