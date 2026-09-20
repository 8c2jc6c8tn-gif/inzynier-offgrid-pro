/**
 * Narzędzie AI (9.3) dla Ekranu 5, Moduł 5 — "Złącza MC4". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateZlaczaMc4 } from "@/lib/core/modules/okablowanie/zlacza-mc4/calculator"
import { PRODUCENCI_MC4 } from "@/lib/core/modules/okablowanie/zlacza-mc4/constants"
import type { AiToolDefinition } from "../types"

export const ZlaczaMc4ToolInput = z.object({
  producentZenski: z
    .enum(PRODUCENCI_MC4)
    .describe("Producent/rodzina złączki żeńskiej MC4, jedna z listy zamkniętej"),
  producentMeski: z
    .enum(PRODUCENCI_MC4)
    .describe("Producent/rodzina złączki męskiej MC4, jedna z listy zamkniętej"),
})

export type ZlaczaMc4ToolInputT = z.infer<typeof ZlaczaMc4ToolInput>

export const ZlaczaMc4ToolOutput = z.object({
  zgodne: z.boolean(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type ZlaczaMc4ToolOutputT = z.infer<typeof ZlaczaMc4ToolOutput>

export const zlaczaMc4Tool: AiToolDefinition<ZlaczaMc4ToolInputT, ZlaczaMc4ToolOutputT> = {
  name: "policz_zlacza_mc4",
  description:
    "Sprawdza, czy złączki MC4 po obu stronach połączenia (żeńska/męska) są od tego samego producenta. " +
    "Użyj, gdy user pyta, czy można mieszać złączki różnych producentów/marek MC4 — mieszanie to " +
    "realne ryzyko łukowania i pożaru z luźnego styku.",
  inputSchema: ZlaczaMc4ToolInput,
  outputSchema: ZlaczaMc4ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/zlacza-mc4",
  handler: async (input) => {
    const wynik = calculateZlaczaMc4(input)
    return {
      zgodne: wynik.value.zgodne,
      status: wynik.status,
      ostrzezenia: wynik.warnings.map((w) => w.technicalMessage),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
