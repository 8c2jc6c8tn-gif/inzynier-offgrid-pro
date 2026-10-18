/**
 * Narzędzie AI (9.3) dla Ekranu 22, Moduł 5 — "String Box / Array Box". `operationType: 'read'`.
 * Liczba stringów, liczba wejść skrzynki, prąd bezpiecznika stringowego i obecność skrzynki IP66
 * MUSZĄ pochodzić od użytkownika (projekt instalacji, karta katalogowa skrzynki) — model nigdy
 * ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateStringBox } from "@/lib/core/modules/okablowanie/string-box/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StringBoxToolInput = z.object({
  liczbaStringow: z.number().describe("Liczba stringów PV do podłączenia. 0 = jeszcze nie podano"),
  liczbaWejscSkrzynki: z.number().describe("Liczba wejść DC skrzynki (deklarowana przez producenta/dobrana). 0 = nie sprawdzane"),
  bezpiecznikStringowyA: z
    .number()
    .describe("Prąd znamionowy bezpiecznika stringowego wybranego do montażu [A] — zalecany zakres 15-20 A/string. 0 = jeszcze niewybrany"),
  maSkrzynkeIp66: z.boolean().describe("Czy skrzynka ma stopień ochrony IP66 (wymóg przy montażu na wolnym powietrzu)"),
})

export type StringBoxToolInputT = z.infer<typeof StringBoxToolInput>

export const StringBoxToolOutput = z.object({
  wejscWystarczajaco: z.boolean().nullable(),
  bezpiecznikWZakresie: z.boolean().nullable(),
  maSkrzynkeIp66: z.boolean(),
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type StringBoxToolOutputT = z.infer<typeof StringBoxToolOutput>

export const stringBoxTool: AiToolDefinition<StringBoxToolInputT, StringBoxToolOutputT> = {
  name: "policz_string_box",
  description:
    "Sprawdza konfigurację skrzynki łączeniowej stringów PV (String Box / Array Box): czy liczba wejść " +
    "wystarcza na liczbę stringów, czy bezpiecznik stringowy mieści się w zalecanym zakresie 15-20 A, i " +
    "czy skrzynka ma stopień ochrony IP66 (twardy stop przy montażu na wolnym powietrzu bez IP66). Nie " +
    "sprawdza SPD Typ 2 ani rozłącznika izolacyjnego DC — to poza zakresem tego kalkulatora. Użyj, gdy " +
    "user pyta o String Box/Array Box.",
  inputSchema: StringBoxToolInput,
  outputSchema: StringBoxToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/string-box",
  handler: async (input) => {
    const wynik = calculateStringBox(input)
    return {
      wejscWystarczajaco: wynik.value.wejscWystarczajaco,
      bezpiecznikWZakresie: wynik.value.bezpiecznikWZakresie,
      maSkrzynkeIp66: wynik.value.maSkrzynkeIp66,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
