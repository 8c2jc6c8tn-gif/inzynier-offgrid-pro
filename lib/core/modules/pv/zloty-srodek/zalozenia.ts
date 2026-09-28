import type { Assumption } from "@/lib/core/calc-result"
import { GAMMA_G_INF_EQU } from "../eurokod-0/rownowaga"

/**
 * D29 (28.09.2026): self-weight of panels and frame in EQU — shared by M3/E9, M3/E2 and M3/E6.
 * Entered (datasheet/scale) → stabilising action with γG,inf; empty → ignored, on the safe side.
 */
export function zalozenieMasyWlasnej(masaKg: number | null): Assumption {
  return masaKg === null
    ? { kod: "ZS-ZALOZENIE-MASA-WLASNA-POMINIETA" }
    : { kod: "ZS-ZALOZENIE-MASA-WLASNA", params: { masa: masaKg, gammaG: GAMMA_G_INF_EQU } }
}
