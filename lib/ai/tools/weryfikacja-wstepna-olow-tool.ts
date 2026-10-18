/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B1 "Weryfikacja + kontrola wstępna" (kwasowo-ołowiowa).
 * `operationType: 'read'`. Czysty checklist bez wymuszonej kolejności — jedyny wejściowy fakt to
 * lista ID pozycji faktycznie sprawdzonych przez usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWeryfikacjaWstepnaOlow } from "@/lib/core/modules/montaz-baterii/weryfikacja-wstepna-olow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WeryfikacjaWstepnaOlowToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty weryfikacji wstępnej, które user faktycznie sprawdził"),
})
export type WeryfikacjaWstepnaOlowToolInputT = z.infer<typeof WeryfikacjaWstepnaOlowToolInput>

export const WeryfikacjaWstepnaOlowToolOutput = z.object({
  status: z.enum(STATUSY),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WeryfikacjaWstepnaOlowToolOutputT = z.infer<typeof WeryfikacjaWstepnaOlowToolOutput>

export const weryfikacjaWstepnaOlowTool: AiToolDefinition<
  WeryfikacjaWstepnaOlowToolInputT,
  WeryfikacjaWstepnaOlowToolOutputT
> = {
  name: "sprawdz_weryfikacje_wstepna_olow",
  description:
    "Sprawdza kompletność weryfikacji wstępnej akumulatorów kwasowo-ołowiowych przed montażem (Moduł 11, " +
    "Ekran B1). User podaje wyłącznie, które pozycje checklisty faktycznie sprawdził. Użyj, gdy user pyta, czy " +
    "akumulatory kwasowe są gotowe do montażu.",
  inputSchema: WeryfikacjaWstepnaOlowToolInput,
  outputSchema: WeryfikacjaWstepnaOlowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/weryfikacja-wstepna-olow",
  handler: async (input) => {
    const wynik = calculateWeryfikacjaWstepnaOlow({ potwierdzoneIds: input.potwierdzoneIds })
    return {
      status: wynik.status,
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
