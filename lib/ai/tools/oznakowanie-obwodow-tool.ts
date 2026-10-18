/**
 * Narzędzie AI (9.3) dla Ekranu 20, Moduł 5 — "Oznakowanie obwodów". `operationType: 'read'`.
 * Lista oznaczonych elementów MUSI pochodzić od użytkownika (wizualne sprawdzenie instalacji) —
 * model nigdy jej nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOznakowanieObwodow } from "@/lib/core/modules/okablowanie/oznakowanie-obwodow/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/oznakowanie-obwodow/constants"
import type { AiToolDefinition } from "../types"

const ID_ELEMENTOW = CHECKLIST_ITEMS.map((item) => item.id) as [string, ...string[]]

export const OznakowanieObwodowToolInput = z.object({
  oznaczoneIds: z
    .array(z.enum(ID_ELEMENTOW))
    .describe("Lista ID elementów (DC+/-, PE, faza AC, N), które user potwierdził jako oznaczone wg PN-EN 60445"),
})

export type OznakowanieObwodowToolInputT = z.infer<typeof OznakowanieObwodowToolInput>

export const OznakowanieObwodowToolOutput = z.object({
  oznaczone: z.number(),
  razem: z.number(),
  status: z.enum(STATUSY),
  wersjaKalkulatora: z.string(),
})

export type OznakowanieObwodowToolOutputT = z.infer<typeof OznakowanieObwodowToolOutput>

export const oznakowanieObwodowTool: AiToolDefinition<OznakowanieObwodowToolInputT, OznakowanieObwodowToolOutputT> = {
  name: "policz_oznakowanie_obwodow",
  description:
    "Sprawdza checklistę kodów oznaczania zacisków/żył wg Tabeli 1 normy PN-EN 60445 (DC+, DC−, PE, " +
    "faza AC, N). Nie ocenia kolorystyki żył — to reguluje inna norma (IEC 60446), której projekt nie " +
    "posiada. Użyj, gdy user pyta o oznakowanie obwodów/zacisków instalacji off-grid.",
  inputSchema: OznakowanieObwodowToolInput,
  outputSchema: OznakowanieObwodowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/oznakowanie-obwodow",
  handler: async (input) => {
    const wynik = calculateOznakowanieObwodow(input)
    return {
      oznaczone: wynik.value.oznaczone,
      razem: wynik.value.razem,
      status: wynik.status,
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
