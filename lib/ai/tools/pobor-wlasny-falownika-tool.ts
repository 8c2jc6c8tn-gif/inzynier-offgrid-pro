/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 9 "Pobór własny falownika". `operationType: 'read'`.
 * Pobór jałowy falownika [W] pochodzi WYŁĄCZNIE od usera (karta katalogowa falownika).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePoborWlasnyFalownika } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PoborWlasnyFalownikaToolInput = z.object({
  poborJalowyW: z.number().describe("Pobór falownika w stanie jałowym (bez obciążenia) [W] — od usera, karta katalogowa"),
})
export type PoborWlasnyFalownikaToolInputT = z.infer<typeof PoborWlasnyFalownikaToolInput>

export const PoborWlasnyFalownikaToolOutput = z.object({
  status: z.enum(STATUSY),
  strataDobowaKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PoborWlasnyFalownikaToolOutputT = z.infer<typeof PoborWlasnyFalownikaToolOutput>

export const poborWlasnyFalownikaTool: AiToolDefinition<
  PoborWlasnyFalownikaToolInputT,
  PoborWlasnyFalownikaToolOutputT
> = {
  name: "policz_strate_poboru_wlasnego_falownika",
  description:
    "Liczy dobową stratę energii [kWh/dobę] z poboru własnego falownika w stanie jałowym (E = P × 24h / 1000) — " +
    "Moduł 2, Ekran 9. Pobór jałowy podaje user z karty katalogowej falownika — nie zgaduj. Użyj, gdy user pyta " +
    "o stały koszt energii samego utrzymania falownika w gotowości.",
  inputSchema: PoborWlasnyFalownikaToolInput,
  outputSchema: PoborWlasnyFalownikaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/pobor-wlasny-falownika",
  handler: async (input) => {
    const wynik = calculatePoborWlasnyFalownika({ poborJalowyW: input.poborJalowyW })
    return {
      status: wynik.status,
      strataDobowaKwh: wynik.value.strataDobowaKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
