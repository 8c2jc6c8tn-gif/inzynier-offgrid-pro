/**
 * Narzędzie AI (9.3) dla Ekranu 25, Moduł 5 — "Ochrona przed gryzoniami". `operationType: 'read'`.
 * Poziom ryzyka MUSI pochodzić od użytkownika (ocena terenu działki) — model nigdy go nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOchronaPrzedGryzoniami } from "@/lib/core/modules/okablowanie/ochrona-przed-gryzoniami/calculator"
import type { PoziomRyzykaGryzoni } from "@/lib/core/modules/okablowanie/ochrona-przed-gryzoniami/input"
import type { AiToolDefinition } from "../types"

const POZIOMY_RYZYKA = ["wysokie", "niskie"] as [PoziomRyzykaGryzoni, ...PoziomRyzykaGryzoni[]]

export const OchronaPrzedGryzoniamiToolInput = z.object({
  poziomRyzyka: z
    .enum(POZIOMY_RYZYKA)
    .nullable()
    .describe(
      "Poziom ryzyka gryzoni na terenie działki (wysokie: działka leśna/pole/stodoła w pobliżu, niskie: teren miejski/zabudowa zwarta) — ocena usera, null = jeszcze nie wybrano",
    ),
})

export type OchronaPrzedGryzoniamiToolInputT = z.infer<typeof OchronaPrzedGryzoniamiToolInput>

export const OchronaPrzedGryzoniamiToolOutput = z.object({
  zalecanaOslona: z.string().nullable(),
  status: z.enum(STATUSY),
  wersjaKalkulatora: z.string(),
})

export type OchronaPrzedGryzoniamiToolOutputT = z.infer<typeof OchronaPrzedGryzoniamiToolOutput>

export const ochronaPrzedGryzoniamiTool: AiToolDefinition<
  OchronaPrzedGryzoniamiToolInputT,
  OchronaPrzedGryzoniamiToolOutputT
> = {
  name: "policz_ochrone_przed_gryzoniami",
  description:
    "Rekomenduje typ osłony kabla (peszel metalowy spiralny przy wysokim ryzyku gryzoni, peszel " +
    "plastikowy standardowy przy niskim) na podstawie poziomu ryzyka podanego przez usera. Użyj, gdy user " +
    "pyta o ochronę okablowania przed gryzoniami na działce off-grid.",
  inputSchema: OchronaPrzedGryzoniamiToolInput,
  outputSchema: OchronaPrzedGryzoniamiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/ochrona-przed-gryzoniami",
  handler: async (input) => {
    const wynik = calculateOchronaPrzedGryzoniami(input)
    return {
      zalecanaOslona: wynik.value.zalecanaOslona,
      status: wynik.status,
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
