/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B8 "Bezpieczeństwo pracy z kwasem" (kwasowo-ołowiowa).
 * `operationType: 'read'`. Czysty checklist (w tym twardy stop: praca bez okularów ochronnych) —
 * jedyny wejściowy fakt to lista ID pozycji faktycznie sprawdzonych przez usera.
 */
import { z } from "zod"
import { calculateBezpieczenstwoKwas } from "@/lib/core/modules/montaz-baterii/bezpieczenstwo-kwas/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BezpieczenstwoKwasToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty bezpieczeństwa pracy z kwasem, które user faktycznie sprawdził"),
})
export type BezpieczenstwoKwasToolInputT = z.infer<typeof BezpieczenstwoKwasToolInput>

export const BezpieczenstwoKwasToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BezpieczenstwoKwasToolOutputT = z.infer<typeof BezpieczenstwoKwasToolOutput>

export const bezpieczenstwoKwasTool: AiToolDefinition<BezpieczenstwoKwasToolInputT, BezpieczenstwoKwasToolOutputT> = {
  name: "sprawdz_bezpieczenstwo_kwas",
  description:
    "Sprawdza bezpieczeństwo pracy z kwasem przy akumulatorach kwasowo-ołowiowych z korkami (Moduł 11, " +
    "Ekran B8) — obejmuje twardy stop źródła: praca bez okularów ochronnych. User podaje wyłącznie, które " +
    "pozycje checklisty faktycznie sprawdził. Użyj, gdy user pyta o środki ochrony przy pracy z elektrolitem " +
    "kwasowym.",
  inputSchema: BezpieczenstwoKwasToolInput,
  outputSchema: BezpieczenstwoKwasToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/bezpieczenstwo-kwas",
  handler: async (input) => {
    const wynik = calculateBezpieczenstwoKwas({ potwierdzoneIds: input.potwierdzoneIds })
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
