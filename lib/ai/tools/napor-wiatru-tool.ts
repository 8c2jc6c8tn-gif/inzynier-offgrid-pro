/**
 * Narzędzie AI (9.3) dla Ekranu 6, Moduł 3 "Instalacja PV" — "Aerodynamika — napór wiatru i
 * ssanie". `operationType: 'read'`. Prędkość wiatru referencyjna, powierzchnia panelu i Cd MUSZĄ
 * pochodzić z normy/karty katalogowej/danych lokalizacji użytkownika — model nigdy ich nie
 * zgaduje. Liczy tylko siłę naporu z przodu i balast projektowy wg PN-EN 1990 (EQU) — siła ssania
 * od spodu i moment wywracający NIE są liczone (wymagają geometrii montażu nieobecnej w źródle).
 */
import { z } from "zod"
import { calculateNaporWiatru } from "@/lib/core/modules/pv/napor-wiatru/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const NaporWiatruToolInput = z.object({
  predkoscWiatruMS: z.number().describe("Prędkość wiatru referencyjna (poryw) [m/s] — dana usera/normy, nie zgaduj"),
  powierzchniaM2: z.number().describe("Powierzchnia panelu [m²]"),
  cd: z.number().describe("Współczynnik oporu aerodynamicznego Cd, typowo 1,2-1,5 dla paneli"),
  balastPlanowanyKg: z
    .number()
    .optional()
    .describe("Planowana masa balastu [kg], do porównania z balastem projektowym; pomiń, jeśli user nie podał"),
})
export type NaporWiatruToolInputT = z.infer<typeof NaporWiatruToolInput>

export const NaporWiatruToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  silaNaporuN: z.number(),
  balastProjektowyKg: z.number().describe("Balast projektowy przeciw oderwaniu wg PN-EN 1990 (EQU) [kg]"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type NaporWiatruToolOutputT = z.infer<typeof NaporWiatruToolOutput>

export const naporWiatruTool: AiToolDefinition<NaporWiatruToolInputT, NaporWiatruToolOutputT> = {
  name: "policz_napor_wiatru_na_panel",
  description:
    "Liczy siłę naporu wiatru na panel PV (F = 0,5×ρ×v²×A×Cd) oraz balast projektowy przeciw oderwaniu wg " +
    "PN-EN 1990 (EQU) (Moduł 3, Ekran 6). Nie liczy siły ssania od spodu ani momentu wywracającego (brak " +
    "geometrii montażu w źródle). Prędkość wiatru, powierzchnia i Cd podaje user — nie zgaduj. Użyj, gdy " +
    "user pyta o siłę wiatru na panele albo ile balastu potrzeba pod stelaż balastowy.",
  inputSchema: NaporWiatruToolInput,
  outputSchema: NaporWiatruToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/napor-wiatru",
  handler: async (input) => {
    const wynik = calculateNaporWiatru({
      predkoscWiatruMS: input.predkoscWiatruMS,
      powierzchniaM2: input.powierzchniaM2,
      cd: input.cd,
      balastPlanowanyKg: input.balastPlanowanyKg ?? null,
    })
    return {
      status: wynik.status,
      silaNaporuN: wynik.value.silaNaporuN,
      balastProjektowyKg: wynik.value.balastProjektowyKg,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
