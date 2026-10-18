/**
 * Narzędzie AI (9.3) dla Ekranu 26, Moduł 3 "Instalacja PV" — "Straty na złączkach MC4 w
 * praktyce". `operationType: 'read'`. Rezystancja złączki MUSI pochodzić z ręcznego wpisu
 * użytkownika w zakresie typowym dla stanu styku (dobry 0,5-2 mΩ, zaśniedziały nawet 10× więcej
 * — źródło podaje zakres, nie jedną liczbę), liczba złączek i prąd — z danych instalacji usera.
 * Nie mylić z `zlacza-mc4-tool.ts` (Moduł "okablowanie" — inny kalkulator, inny ekran).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateStratyZlaczkiMc4 } from "@/lib/core/modules/pv/straty-zlaczki-mc4/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StratyZlaczkiMc4ToolInput = z.object({
  rezystancjaZlaczkiMOhm: z
    .number()
    .describe(
      "Rezystancja pojedynczej złączki MC4 [mΩ] — user wpisuje ręcznie w zakresie typowym dla stanu styku " +
        "(dobry 0,5-2 mΩ, zły nawet 10× więcej); nie zgaduj",
    ),
  liczbaZlaczek: z.number().describe("Liczba złączek MC4 w rozpatrywanej trasie (szeregowo, ten sam prąd)"),
  pradA: z.number().describe("Prąd płynący przez złączki [A]"),
})
export type StratyZlaczkiMc4ToolInputT = z.infer<typeof StratyZlaczkiMc4ToolInput>

export const StratyZlaczkiMc4ToolOutput = z.object({
  status: z.enum(STATUSY),
  strataNaZlaczkeW: z.number(),
  strataCalkowitaW: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type StratyZlaczkiMc4ToolOutputT = z.infer<typeof StratyZlaczkiMc4ToolOutput>

export const stratyZlaczkiMc4Tool: AiToolDefinition<StratyZlaczkiMc4ToolInputT, StratyZlaczkiMc4ToolOutputT> = {
  name: "policz_straty_na_zlaczkach_mc4",
  description:
    "Liczy stratę mocy (prawo Joule'a) na złączkach MC4 w trasie stringu (Moduł 3, Ekran 26): strata na jedną " +
    "złączkę i strata całkowita, oraz ocenia stan styku (dobry/podwyższona rezystancja/zły). Rezystancję " +
    "złączki user wpisuje ręcznie w zakresie typowym dla stanu styku — nie zgaduj. Użyj, gdy user pyta o " +
    "wpływ złączek MC4 na straty mocy w instalacji PV.",
  inputSchema: StratyZlaczkiMc4ToolInput,
  outputSchema: StratyZlaczkiMc4ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/straty-zlaczki-mc4",
  handler: async (input) => {
    const wynik = calculateStratyZlaczkiMc4(input)
    return {
      status: wynik.status,
      strataNaZlaczkeW: wynik.value.strataNaZlaczkeW,
      strataCalkowitaW: wynik.value.strataCalkowitaW,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
