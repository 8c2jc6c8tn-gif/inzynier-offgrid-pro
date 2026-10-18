/**
 * Narzędzie AI (9.3) dla Ekranu 22, Moduł 4 "Magazyn energii / baterie" — "Pobór własny BMS i
 * tryb uśpienia". `operationType: 'read'`. Pobór ciągły i pobór uśpienia MUSZĄ pochodzić z karty
 * katalogowej BMS.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePoborWlasnyBms } from "@/lib/core/modules/baterie/pobor-wlasny-bms/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PoborWlasnyBmsToolInput = z.object({
  poborCiagleW: z.number().describe("Pobór BMS w trybie pracy ciągłej [W] (typowo 5-15W) — z karty katalogowej"),
  poborUspienieW: z.number().describe("Pobór BMS w trybie uśpienia (deep sleep) [W] (typowo 0,5-1W) — z karty katalogowej"),
})
export type PoborWlasnyBmsToolInputT = z.infer<typeof PoborWlasnyBmsToolInput>

export const PoborWlasnyBmsToolOutput = z.object({
  status: z.enum(STATUSY),
  strataRocznaCiagleKwh: z.number(),
  strataDoboweUspienieKwh: z.number(),
  strataRocznaUspienieKwh: z.number(),
  oszczednoscRocznaKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PoborWlasnyBmsToolOutputT = z.infer<typeof PoborWlasnyBmsToolOutput>

export const poborWlasnyBmsTool: AiToolDefinition<PoborWlasnyBmsToolInputT, PoborWlasnyBmsToolOutputT> = {
  name: "policz_pobor_wlasny_bms",
  description:
    "Liczy roczną stratę energii z poboru własnego BMS w trybie ciągłym i w trybie uśpienia oraz oszczędność " +
    "roczną z użycia trybu uśpienia (Moduł 4, Ekran 22). Pobór ciągły i pobór uśpienia MUSZĄ pochodzić z karty " +
    "katalogowej BMS — nie zgaduj. Użyj, gdy user pyta, ile energii zjada sam BMS rocznie.",
  inputSchema: PoborWlasnyBmsToolInput,
  outputSchema: PoborWlasnyBmsToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/pobor-wlasny-bms",
  handler: async (input) => {
    const wynik = calculatePoborWlasnyBms({ poborCiagleW: input.poborCiagleW, poborUspienieW: input.poborUspienieW })
    return {
      status: wynik.status,
      strataRocznaCiagleKwh: wynik.value.strataRocznaCiagleKwh,
      strataDoboweUspienieKwh: wynik.value.strataDoboweUspienieKwh,
      strataRocznaUspienieKwh: wynik.value.strataRocznaUspienieKwh,
      oszczednoscRocznaKwh: wynik.value.oszczednoscRocznaKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
