/**
 * Narzędzie AI (9.3) dla Ekranu 21, Moduł 5 — "Normy i certyfikaty". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateNormyICertyfikaty } from "@/lib/core/modules/okablowanie/normy-i-certyfikaty/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/normy-i-certyfikaty/constants"
import type { AiToolDefinition } from "../types"

const ID_KOMPONENTU = CHECKLIST_ITEMS.map((item) => item.id) as [string, ...string[]]

export const NormyICertyfikatyToolInput = z.object({
  potwierdzoneIds: z
    .array(z.enum(ID_KOMPONENTU))
    .describe("Lista ID komponentów, dla których user potwierdził posiadanie wymaganego certyfikatu"),
})

export type NormyICertyfikatyToolInputT = z.infer<typeof NormyICertyfikatyToolInput>

export const NormyICertyfikatyToolOutput = z.object({
  potwierdzone: z.number(),
  razem: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  brakujaceKomponenty: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type NormyICertyfikatyToolOutputT = z.infer<typeof NormyICertyfikatyToolOutput>

export const normyICertyfikatyTool: AiToolDefinition<NormyICertyfikatyToolInputT, NormyICertyfikatyToolOutputT> = {
  name: "policz_normy_i_certyfikaty",
  description:
    "Sprawdza checklistę certyfikatów wymaganych normą per typ komponentu instalacji PV (panele, " +
    "falownik, baterie litowe). Użyj, gdy user pyta, jakie certyfikaty/normy są wymagane dla " +
    "komponentów instalacji, albo czy dany zestaw komponentów ma komplet certyfikatów.",
  inputSchema: NormyICertyfikatyToolInput,
  outputSchema: NormyICertyfikatyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/normy-i-certyfikaty",
  handler: async (input) => {
    const wynik = calculateNormyICertyfikaty(input)
    return {
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      status: wynik.status,
      brakujaceKomponenty: wynik.warnings.map((w) => w.technicalMessage),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
