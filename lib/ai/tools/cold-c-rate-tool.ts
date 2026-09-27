/**
 * Narzędzie AI (9.3) dla Ekranu 12, Moduł 4 "Magazyn energii / baterie" — "Ograniczenie prądu
 * ładowania w mrozie (Cold C-Rate)". `operationType: 'read'`. Temperatura ogniwa MUSI pochodzić
 * z pomiaru/BMS — dane bezpieczeństwa (ładowanie poniżej 0°C degraduje/uszkadza LiFePO4).
 */
import { z } from "zod"
import { calculateColdCRate } from "@/lib/core/modules/baterie/cold-c-rate/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ColdCRateToolInput = z.object({
  temperaturaOgniwaC: z.number().describe("Temperatura ogniwa [°C], live z BMS — tylko od usera, nie zgaduj"),
  pojemnoscAh: z.number().describe("Pojemność pakietu [Ah]"),
})
export type ColdCRateToolInputT = z.infer<typeof ColdCRateToolInput>

export const ColdCRateToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  temperaturaC: z.number(),
  strefa: z.enum(["blokada", "limit-01c", "limit-02c", "luka-zrodla", "pelny-prad"]),
  maxPradA: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ColdCRateToolOutputT = z.infer<typeof ColdCRateToolOutput>

export const coldCRateTool: AiToolDefinition<ColdCRateToolInputT, ColdCRateToolOutputT> = {
  name: "sprawdz_limit_pradu_ladowania_w_mrozie",
  description:
    "Liczy maksymalny dopuszczalny prąd ładowania pakietu LiFePO4 w zależności od temperatury ogniwa " +
    "(Moduł 4, Ekran 12, Cold C-Rate) — blokada poniżej progu, ograniczony C-rate w chłodzie, pełny prąd " +
    "w normalnej temperaturze. Temperatura MUSI pochodzić z pomiaru/BMS — nie zgaduj. Użyj, gdy user pyta, " +
    "ile prądu można wpompować w baterię zimą.",
  inputSchema: ColdCRateToolInput,
  outputSchema: ColdCRateToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/cold-c-rate",
  handler: async (input) => {
    const wynik = calculateColdCRate({ temperaturaOgniwaC: input.temperaturaOgniwaC, pojemnoscAh: input.pojemnoscAh })
    return {
      status: wynik.status,
      temperaturaC: wynik.value.temperaturaC,
      strefa: wynik.value.strefa,
      maxPradA: wynik.value.maxPradA,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
