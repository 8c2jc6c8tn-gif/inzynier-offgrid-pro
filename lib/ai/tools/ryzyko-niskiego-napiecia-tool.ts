/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran dodatkowy "Ryzyko wyłączenia pompy przy niskim napięciu"
 * (dawne 5.63). `operationType: 'read'`. Minimalne napięcie robocze pompy (karta katalogowa) i
 * aktualne napięcie systemu off-grid pochodzą WYŁĄCZNIE od usera — napięcie systemu przy danym
 * SoC zależy od krzywej rozładowania konkretnych ogniw, nie jest wyprowadzane z SoC.
 */
import { z } from "zod"
import { calculateRyzykoNiskiegoNapiecia } from "@/lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const RyzykoNiskiegoNapieciaToolInput = z.object({
  minNapiecieRoboczeV: z.number().describe("Minimalne napięcie pracy pompy ciepła [V], z karty katalogowej — od usera"),
  aktualneNapiecieSystemuV: z.number().describe("Aktualne napięcie systemu off-grid [V] — od usera (docelowo auto z Modułu 4)"),
})
export type RyzykoNiskiegoNapieciaToolInputT = z.infer<typeof RyzykoNiskiegoNapieciaToolInput>

export const RyzykoNiskiegoNapieciaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  marginesV: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RyzykoNiskiegoNapieciaToolOutputT = z.infer<typeof RyzykoNiskiegoNapieciaToolOutput>

export const ryzykoNiskiegoNapieciaTool: AiToolDefinition<RyzykoNiskiegoNapieciaToolInputT, RyzykoNiskiegoNapieciaToolOutputT> = {
  name: "policz_ryzyko_niskiego_napiecia_pompy",
  description:
    "Margines napięcia dla pompy ciepła w systemie off-grid: margines = V_system − V_min,pompy. Przy rozładowanej " +
    "baterii napięcie systemu spada — poniżej progu pompa wyłączy się (ryzykownie: mróz + rozładowana bateria). " +
    "Minimalne napięcie robocze pompy i aktualne napięcie systemu podaje user. Użyj, gdy user pyta, czy pompa " +
    "ciepła wyłączy się przy niskim SoC/napięciu baterii.",
  inputSchema: RyzykoNiskiegoNapieciaToolInput,
  outputSchema: RyzykoNiskiegoNapieciaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/ryzyko-niskiego-napiecia",
  handler: async (input) => {
    const wynik = calculateRyzykoNiskiegoNapiecia({
      minNapiecieRoboczeV: input.minNapiecieRoboczeV,
      aktualneNapiecieSystemuV: input.aktualneNapiecieSystemuV,
    })
    return {
      status: wynik.status,
      marginesV: wynik.value.marginesV,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
