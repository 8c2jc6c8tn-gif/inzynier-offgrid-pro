/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 15 "Pompy cyrkulacyjne — dobór" (dawne 5.15).
 * `operationType: 'read'`. Moc obecnej i rozważanej pompy oraz godziny pracy na dobę pochodzą
 * WYŁĄCZNIE od usera — źródło nie podaje wzoru przeliczającego profil "sterowany" na godziny.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePompyCyrkulacyjne } from "@/lib/core/modules/ogrzewanie/pompy-cyrkulacyjne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PompyCyrkulacyjneToolInput = z.object({
  mocObecnejPompyW: z.number().describe("Moc obecnej pompy obiegowej (typowo stałoobrotowa 100-150 W) [W] — od usera"),
  mocNowejPompyW: z.number().describe("Moc rozważanej pompy elektronicznej PWM (typowo 5-50 W) [W] — od usera"),
  godzinyPracyDobowoH: z.number().describe("Godziny pracy pompy na dobę [h] — od usera (24 dla pracy ciągłej 24/7)"),
  dniSezonu: z.number().optional().describe("Dni pracy w sezonie grzewczym — opcjonalne, do zużycia sezonowego (dawne 5.72)"),
  cenaZlKwh: z.number().optional().describe("Cena energii [zł/kWh] — opcjonalna, do oszczędności w złotych"),
})
export type PompyCyrkulacyjneToolInputT = z.infer<typeof PompyCyrkulacyjneToolInput>

export const PompyCyrkulacyjneToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaObecnaKwh: z.number(),
  energiaNowaKwh: z.number(),
  oszczednoscKwh: z.number(),
  oszczednoscPct: z.number(),
  energiaSezonObecnaKwh: z.number().nullable(),
  energiaSezonNowaKwh: z.number().nullable(),
  oszczednoscSezonKwh: z.number().nullable(),
  oszczednoscSezonZl: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PompyCyrkulacyjneToolOutputT = z.infer<typeof PompyCyrkulacyjneToolOutput>

export const pompyCyrkulacyjneTool: AiToolDefinition<PompyCyrkulacyjneToolInputT, PompyCyrkulacyjneToolOutputT> = {
  name: "policz_oszczednosc_pompy_cyrkulacyjnej",
  description:
    "Porównanie zużycia energii pompy obiegowej stałoobrotowej vs elektronicznej (PWM): E = P×h/1000, oszczędność " +
    "= E_obecna − E_nowa. Moce obu pomp i godziny pracy na dobę podaje user (24h dla pracy ciągłej). Użyj, gdy " +
    "user pyta o wymianę pompy cyrkulacyjnej/obiegowej C.O. lub C.W.U. na energooszczędną albo ile pompa obiegowa " +
    "zużyje w całym sezonie grzewczym (z dniami sezonu i ceną energii).",
  inputSchema: PompyCyrkulacyjneToolInput,
  outputSchema: PompyCyrkulacyjneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/pompy-cyrkulacyjne",
  handler: async (input) => {
    const wynik = calculatePompyCyrkulacyjne({
      mocObecnejPompyW: input.mocObecnejPompyW,
      mocNowejPompyW: input.mocNowejPompyW,
      godzinyPracyDobowoH: input.godzinyPracyDobowoH,
      dniSezonu: input.dniSezonu,
      cenaZlKwh: input.cenaZlKwh,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      energiaObecnaKwh: v.energiaObecnaKwh,
      energiaNowaKwh: v.energiaNowaKwh,
      oszczednoscKwh: v.oszczednoscKwh,
      oszczednoscPct: v.oszczednoscPct,
      energiaSezonObecnaKwh: v.energiaSezonObecnaKwh,
      energiaSezonNowaKwh: v.energiaSezonNowaKwh,
      oszczednoscSezonKwh: v.oszczednoscSezonKwh,
      oszczednoscSezonZl: v.oszczednoscSezonZl,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
