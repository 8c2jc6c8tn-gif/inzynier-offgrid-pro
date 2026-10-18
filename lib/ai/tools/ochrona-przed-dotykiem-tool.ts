/**
 * Narzędzie AI (9.3) dla Ekranu 17, Moduł 5 — "Ochrona przed dotykiem". `operationType: 'read'`.
 * Lista potwierdzonych mechanizmów ochrony MUSI pochodzić od użytkownika (rzeczywiste sprawdzenie
 * instalacji) — model nigdy jej nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOchronaPrzedDotykiem } from "@/lib/core/modules/okablowanie/ochrona-przed-dotykiem/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/ochrona-przed-dotykiem/constants"
import type { AiToolDefinition } from "../types"

const ID_MECHANIZMOW = CHECKLIST_ITEMS.map((item) => item.id) as [string, ...string[]]

export const OchronaPrzedDotykiemToolInput = z.object({
  potwierdzoneIds: z
    .array(z.enum(ID_MECHANIZMOW))
    .describe("Lista ID mechanizmów ochrony (bezpośrednia, pośrednia), które user potwierdził jako zastosowane"),
})

export type OchronaPrzedDotykiemToolInputT = z.infer<typeof OchronaPrzedDotykiemToolInput>

export const OchronaPrzedDotykiemToolOutput = z.object({
  potwierdzone: z.number(),
  razem: z.number(),
  status: z.enum(STATUSY),
  wersjaKalkulatora: z.string(),
})

export type OchronaPrzedDotykiemToolOutputT = z.infer<typeof OchronaPrzedDotykiemToolOutput>

export const ochronaPrzedDotykiemTool: AiToolDefinition<
  OchronaPrzedDotykiemToolInputT,
  OchronaPrzedDotykiemToolOutputT
> = {
  name: "policz_ochrone_przed_dotykiem",
  description:
    "Sprawdza checklistę dwóch mechanizmów ochrony przed porażeniem (ochrona bezpośrednia — izolacja i " +
    "obudowy, ochrona pośrednia — samoczynne wyłączenie zasilania). Użyj, gdy user pyta o ochronę przed " +
    "dotykiem/porażeniem w instalacji off-grid. Nie zawiera tabeli wymaganych stopni IP wg miejsca — " +
    "źródło jej nie podaje dla tego ekranu.",
  inputSchema: OchronaPrzedDotykiemToolInput,
  outputSchema: OchronaPrzedDotykiemToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/ochrona-przed-dotykiem",
  handler: async (input) => {
    const wynik = calculateOchronaPrzedDotykiem(input)
    return {
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      status: wynik.status,
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
