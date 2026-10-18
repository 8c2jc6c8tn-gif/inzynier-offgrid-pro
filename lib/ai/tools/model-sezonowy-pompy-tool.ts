/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2C — model zużycia energii pompy ciepła w sezonie (dawne 5.64) z realnym
 * SCOP (dawne 5.43). `operationType: 'read'`. Ciepło miesięcy (Ekran 1/2) i COP miesięcy (karta) — od usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateModelSezonowyPompy } from "@/lib/core/modules/ogrzewanie/model-sezonowy-pompy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ModelSezonowyPompyToolInput = z.object({
  cieploKwh: z.array(z.number().nullable()).length(12).describe("Ciepło na ogrzewanie w każdym miesiącu [kWh], od stycznia; null = bez grzania"),
  cop: z.array(z.number().nullable()).length(12).describe("COP pompy w każdym miesiącu (karta przy średniej temperaturze miesiąca); null = nie podano"),
  scopKatalogowy: z.number().describe("SCOP z karty do porównania; 0 = nie podano"),
})
export type ModelSezonowyPompyToolInputT = z.infer<typeof ModelSezonowyPompyToolInput>

export const ModelSezonowyPompyToolOutput = z.object({
  status: z.enum(STATUSY),
  miesiace: z.array(
    z.object({ miesiac: z.number(), cieploKwh: z.number(), cop: z.number(), energiaKwh: z.number(), energiaDobaKwh: z.number() }),
  ),
  cieploSumaKwh: z.number(),
  energiaSumaKwh: z.number(),
  scopRealny: z.number(),
  najwiekszyMiesiac: z.number(),
  roznicaScopPct: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ModelSezonowyPompyToolOutputT = z.infer<typeof ModelSezonowyPompyToolOutput>

export const modelSezonowyPompyTool: AiToolDefinition<ModelSezonowyPompyToolInputT, ModelSezonowyPompyToolOutputT> = {
  name: "policz_zuzycie_pompy_ciepla_w_sezonie",
  description:
    "Zużycie prądu pompy ciepła miesiąc po miesiącu (E = Q/COP), suma sezonu, najgorszy miesiąc (kWh i kWh na dobę) i " +
    "realny SCOP budynku porównany z katalogowym. Użyj, gdy user pyta, ile prądu pompa zużyje w sezonie albo w styczniu, " +
    "jaki jest jej rzeczywisty SCOP, czemu zużywa więcej niż w katalogu albo ile energii zaplanować na zimę.",
  inputSchema: ModelSezonowyPompyToolInput,
  outputSchema: ModelSezonowyPompyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/model-sezonowy-pompy",
  handler: async (input) => {
    const wynik = calculateModelSezonowyPompy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
