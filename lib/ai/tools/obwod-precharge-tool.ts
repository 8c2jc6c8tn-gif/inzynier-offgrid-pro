/**
 * Narzędzie AI (9.3) dla Ekranu 7, Moduł 4 "Magazyn energii / baterie" — "Obwód Pre-Charge".
 * `operationType: 'read'`. Pojemność wejściowa falownika i rezystor pre-charge MUSZĄ pochodzić z
 * karty katalogowej/pomiaru usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateObwodPrecharge } from "@/lib/core/modules/baterie/obwod-precharge/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ObwodPrechargeToolInput = z.object({
  pojemnoscFalownikaUf: z.number().describe("Pojemność wejściowa DC falownika [µF] — z karty katalogowej"),
  rezystancjaPreChargeOhm: z.number().describe("Rezystor wstępny użyty do pre-charge [Ω] — tylko od usera (np. 50Ω/50W)"),
})
export type ObwodPrechargeToolInputT = z.infer<typeof ObwodPrechargeToolInput>

export const ObwodPrechargeToolOutput = z.object({
  status: z.enum(STATUSY),
  czasPreChargeS: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ObwodPrechargeToolOutputT = z.infer<typeof ObwodPrechargeToolOutput>

export const obwodPrechargeTool: AiToolDefinition<ObwodPrechargeToolInputT, ObwodPrechargeToolOutputT> = {
  name: "policz_czas_pre_charge",
  description:
    "Liczy czas obwodu pre-charge (ładowania wstępnego kondensatorów wejściowych falownika przez rezystor) " +
    "z pojemności wejściowej falownika i rezystancji pre-charge (Moduł 4, Ekran 7). Pojemność falownika i " +
    "rezystancja MUSZĄ pochodzić z karty katalogowej/doboru usera — nie zgaduj. Użyj, gdy user pyta o czas " +
    "pre-charge albo dobór rezystora pre-charge.",
  inputSchema: ObwodPrechargeToolInput,
  outputSchema: ObwodPrechargeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/obwod-precharge",
  handler: async (input) => {
    const wynik = calculateObwodPrecharge({
      pojemnoscFalownikaUf: input.pojemnoscFalownikaUf,
      rezystancjaPreChargeOhm: input.rezystancjaPreChargeOhm,
    })
    return {
      status: wynik.status,
      czasPreChargeS: wynik.value.czasPreChargeS,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
