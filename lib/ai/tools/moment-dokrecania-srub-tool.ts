/**
 * Narzędzie AI (9.3) dla Modułu 4 "Magazyn energii / baterie" — "Moment dokręcania śrub"
 * (checklista procedury). `operationType: 'read'`. Lista potwierdzonych kroków MUSI pochodzić
 * od usera — narzędzie tylko liczy postęp, nie ocenia, czy dokręcanie zostało wykonane poprawnie.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMomentDokrecania } from "@/lib/core/modules/baterie/moment-dokrecania-srub/calculator"
import type { AiToolDefinition } from "../types"

export const MomentDokrecaniaSrubToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID kroków checklisty momentu dokręcania śrub już potwierdzonych przez usera"),
})
export type MomentDokrecaniaSrubToolInputT = z.infer<typeof MomentDokrecaniaSrubToolInput>

export const MomentDokrecaniaSrubToolOutput = z.object({
  status: z.enum(STATUSY),
  potwierdzone: z.number(),
  razem: z.number(),
  wersjaKalkulatora: z.string(),
})
export type MomentDokrecaniaSrubToolOutputT = z.infer<typeof MomentDokrecaniaSrubToolOutput>

export const momentDokrecaniaSrubTool: AiToolDefinition<MomentDokrecaniaSrubToolInputT, MomentDokrecaniaSrubToolOutputT> = {
  name: "sprawdz_postep_checklisty_momentu_dokrecania_srub",
  description:
    "Liczy postęp checklisty momentu dokręcania śrub połączeń baterii (Moduł 4) na podstawie kroków, które " +
    "user już potwierdził. Lista potwierdzonych kroków pochodzi wyłącznie od usera. Użyj, gdy user pyta, ile " +
    "kroków checklisty dokręcania śrub zostało wykonane.",
  inputSchema: MomentDokrecaniaSrubToolInput,
  outputSchema: MomentDokrecaniaSrubToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/moment-dokrecania-srub",
  handler: async (input) => {
    const wynik = calculateMomentDokrecania({ potwierdzoneIds: input.potwierdzoneIds })
    return {
      status: wynik.status,
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
