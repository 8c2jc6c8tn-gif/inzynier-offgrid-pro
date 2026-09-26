/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A7 "Przygotowanie stanowiska i narzędzi" (LiFePO4).
 * `operationType: 'read'`. Czysty checklist — jedyny wejściowy fakt to lista ID pozycji, które
 * user faktycznie ma przygotowane, bez żadnej wartości liczbowej do zgadywania.
 */
import { z } from "zod"
import { calculatePrzygotowanieStanowiska } from "@/lib/core/modules/montaz-baterii/przygotowanie-stanowiska/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrzygotowanieStanowiskaToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty stanowiska/narzędzi, które user faktycznie ma przygotowane"),
})
export type PrzygotowanieStanowiskaToolInputT = z.infer<typeof PrzygotowanieStanowiskaToolInput>

export const PrzygotowanieStanowiskaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrzygotowanieStanowiskaToolOutputT = z.infer<typeof PrzygotowanieStanowiskaToolOutput>

export const przygotowanieStanowiskaTool: AiToolDefinition<
  PrzygotowanieStanowiskaToolInputT,
  PrzygotowanieStanowiskaToolOutputT
> = {
  name: "sprawdz_przygotowanie_stanowiska",
  description:
    "Sprawdza kompletność przygotowania stanowiska i narzędzi przed montażem pakietu LiFePO4 (Moduł 11, " +
    "Ekran A7): mata izolacyjna, klucz dynamometryczny, ochrona osobista, gaśnica, brak metalu luzem. User " +
    "podaje wyłącznie, co faktycznie ma przygotowane. Użyj, gdy user pyta, czy stanowisko jest gotowe do " +
    "rozpoczęcia montażu.",
  inputSchema: PrzygotowanieStanowiskaToolInput,
  outputSchema: PrzygotowanieStanowiskaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/przygotowanie-stanowiska",
  handler: async (input) => {
    const wynik = calculatePrzygotowanieStanowiska({ potwierdzoneIds: input.potwierdzoneIds })
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
