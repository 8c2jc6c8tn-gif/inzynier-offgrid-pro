/**
 * Narzędzie AI (9.3) dla Ekranu 27, Moduł 4 "Magazyn energii / baterie" — "Chłodzenie baterii
 * latem". `operationType: 'read'`. Temperatura ogniw MUSI pochodzić z pomiaru/BMS użytkownika —
 * nigdy zgadywana przez model (dane bezpieczeństwa, sprawdzenie zakresu pracy termicznej).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateChlodzenieLatem } from "@/lib/core/modules/baterie/chlodzenie-latem/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ChlodzenieLatemToolInput = z.object({
  temperaturaOgniwC: z.number().describe("Zmierzona/spodziewana temperatura ogniw [°C] — tylko od usera/BMS, nie zgaduj"),
})
export type ChlodzenieLatemToolInputT = z.infer<typeof ChlodzenieLatemToolInput>

export const ChlodzenieLatemToolOutput = z.object({
  status: z.enum(STATUSY),
  temperaturaOgniwC: z.number(),
  wZakresie: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ChlodzenieLatemToolOutputT = z.infer<typeof ChlodzenieLatemToolOutput>

export const chlodzenieLatemTool: AiToolDefinition<ChlodzenieLatemToolInputT, ChlodzenieLatemToolOutputT> = {
  name: "sprawdz_chlodzenie_baterii_latem",
  description:
    "Sprawdza, czy zmierzona temperatura ogniw baterii mieści się w dopuszczalnym zakresie pracy latem " +
    "(Moduł 4, Ekran 27). Temperatura musi pochodzić z pomiaru/BMS użytkownika — nie zgaduj jej. Użyj, gdy " +
    "user pyta, czy bateria nie przegrzewa się latem.",
  inputSchema: ChlodzenieLatemToolInput,
  outputSchema: ChlodzenieLatemToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/chlodzenie-latem",
  handler: async (input) => {
    const wynik = calculateChlodzenieLatem({ temperaturaOgniwC: input.temperaturaOgniwC })
    return {
      status: wynik.status,
      temperaturaOgniwC: wynik.value.temperaturaOgniwC,
      wZakresie: wynik.value.wZakresie,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
