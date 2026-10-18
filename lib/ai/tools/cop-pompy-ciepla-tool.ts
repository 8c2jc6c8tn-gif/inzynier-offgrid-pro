/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 5 "Pompa ciepła — COP/SCOP w funkcji temperatury"
 * (dawne 5.5). `operationType: 'read'`. Moc cieplna i COP (z krzywej COP pompy — karta
 * katalogowa — lub zmierzony) pochodzą WYŁĄCZNIE od usera; nie zgaduj COP.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateCopPompyCiepla } from "@/lib/core/modules/ogrzewanie/cop-pompy-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const CopPompyCieplaToolInput = z.object({
  mocCieplnaKw: z.number().describe("Zapotrzebowanie na moc cieplną w danym momencie [kW] — od usera"),
  cop: z.number().describe("COP przy aktualnej temperaturze zewnętrznej — z krzywej COP pompy (karta katalogowa) lub zmierzony — od usera, nie zgaduj"),
})
export type CopPompyCieplaToolInputT = z.infer<typeof CopPompyCieplaToolInput>

export const CopPompyCieplaToolOutput = z.object({
  status: z.enum(STATUSY),
  mocElektrycznaKw: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type CopPompyCieplaToolOutputT = z.infer<typeof CopPompyCieplaToolOutput>

export const copPompyCieplaTool: AiToolDefinition<CopPompyCieplaToolInputT, CopPompyCieplaToolOutputT> = {
  name: "policz_moc_elektryczna_pompy_ciepla",
  description:
    "Moc elektryczna pompy ciepła z mocy cieplnej i COP: P_elektryczna = P_cieplna / COP. COP jest 'mnożnikiem' — " +
    "pompa nie produkuje ciepła z niczego, tylko przenosi je z zewnątrz. COP podaje user (z krzywej COP producenta " +
    "lub zmierzony) — nie zgaduj wartości. Użyj, gdy user pyta o pobór prądu pompy ciepła przy danym COP.",
  inputSchema: CopPompyCieplaToolInput,
  outputSchema: CopPompyCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/cop-pompy-ciepla",
  handler: async (input) => {
    const wynik = calculateCopPompyCiepla({
      mocCieplnaKw: input.mocCieplnaKw,
      cop: input.cop,
    })
    return {
      status: wynik.status,
      mocElektrycznaKw: wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
