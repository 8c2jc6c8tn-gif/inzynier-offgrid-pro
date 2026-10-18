/**
 * Narzędzie AI (9.3) dla Ekranu 5, Moduł 7 "Stress-test zimowy" — "Procedura Black Start".
 * `operationType: 'read'`. Jedyny wejściowy fakt to lista ID kroków, które user faktycznie
 * potwierdził w checkliście — model nigdy nie zgaduje, które kroki są zrobione.
 *
 * TWARDY STOP KRYTYCZNY: zaznaczenie kroku poza kolejnością (`KROK-POZA-KOLEJNOSCIA`, `level:
 * "critical"`, decyzja właściciela 07.09.2026) sygnalizuje realne ryzyko uszkodzenia sprzętu
 * (np. podłączenie agregatu przed naładowaniem baterii) — narzędzie MUSI zwrócić to ostrzeżenie
 * z tą samą wagą co UI, nigdy go nie łagodzić ani nie pomijać w odpowiedzi dla usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateProceduraBlackStart } from "@/lib/core/modules/stress-test/procedura-black-start/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ProceduraBlackStartToolInput = z.object({
  potwierdzoneIds: z
    .array(z.string())
    .describe(
      "Lista ID kroków checklisty Black Start, które user faktycznie potwierdził jako wykonane — " +
        "od usera, nie zgaduj kolejności ani które kroki zostały zrobione.",
    ),
})
export type ProceduraBlackStartToolInputT = z.infer<typeof ProceduraBlackStartToolInput>

export const ProceduraBlackStartToolOutput = z.object({
  status: z.enum(STATUSY),
  potwierdzoneWKolejnosci: z.number().describe("Liczba kroków potwierdzonych w prawidłowej kolejności od początku"),
  razem: z.number().describe("Łączna liczba kroków procedury"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ProceduraBlackStartToolOutputT = z.infer<typeof ProceduraBlackStartToolOutput>

export const proceduraBlackStartTool: AiToolDefinition<
  ProceduraBlackStartToolInputT,
  ProceduraBlackStartToolOutputT
> = {
  name: "sprawdz_procedure_black_start",
  description:
    "Sprawdza postęp procedury Black Start (Moduł 7, Ekran 5) — rozruch systemu z zera po agregat/generator. " +
    "Kolejność kroków ma znaczenie: zaznaczenie kroku poza kolejnością to TWARDY STOP KRYTYCZNY " +
    "(KROK-POZA-KOLEJNOSCIA) — realne ryzyko uszkodzenia sprzętu (np. podłączenie agregatu przed " +
    "naładowaniem baterii). To ostrzeżenie MUSI być przekazane userowi z pełną powagą, nigdy złagodzone. " +
    "Użyj, gdy user pyta o kolejność rozruchu systemu po awarii/black-out lub raportuje, które kroki wykonał.",
  inputSchema: ProceduraBlackStartToolInput,
  outputSchema: ProceduraBlackStartToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/procedura-black-start",
  handler: async (input) => {
    const wynik = calculateProceduraBlackStart(input)
    return {
      status: wynik.status,
      potwierdzoneWKolejnosci: wynik.value.potwierdzoneWKolejnosci,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
