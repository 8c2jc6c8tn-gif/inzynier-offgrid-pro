/**
 * Narzędzie AI (9.3) dla Ekranu 8, Moduł 5 — "Przepust powietrza pod panelami". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculatePrzepustPowietrza } from "@/lib/core/modules/okablowanie/przepust-powietrza/calculator"
import type { AiToolDefinition } from "../types"

export const PrzepustPowietrzaToolInput = z.object({
  szczelinaCm: z.number().describe("Planowana szczelina wentylacyjna pod panelami PV, w centymetrach"),
})

export type PrzepustPowietrzaToolInputT = z.infer<typeof PrzepustPowietrzaToolInput>

export const PrzepustPowietrzaToolOutput = z.object({
  klasyfikacja: z.enum(["krytyczna", "posrednia", "bezpieczna"]),
  strataOrientacyjnaPct: z.number().nullable(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type PrzepustPowietrzaToolOutputT = z.infer<typeof PrzepustPowietrzaToolOutput>

export const przepustPowietrzaTool: AiToolDefinition<PrzepustPowietrzaToolInputT, PrzepustPowietrzaToolOutputT> = {
  name: "policz_przepust_powietrza",
  description:
    "Ocenia, czy szczelina wentylacyjna pod panelami PV jest wystarczająca, żeby uniknąć przegrzania " +
    "i straty mocy. Użyj, gdy user pyta o odstęp montażowy paneli od dachu/podłoża, wentylację pod " +
    "panelami, albo stratę mocy z przegrzania.",
  inputSchema: PrzepustPowietrzaToolInput,
  outputSchema: PrzepustPowietrzaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/przepust-powietrza",
  handler: async (input) => {
    const wynik = calculatePrzepustPowietrza(input)
    return {
      klasyfikacja: wynik.value.klasyfikacja,
      strataOrientacyjnaPct: wynik.value.strataOrientacyjnaPct,
      status: wynik.status,
      ostrzezenia: wynik.warnings.map((w) => w.technicalMessage),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
