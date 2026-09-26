/**
 * Narzędzie AI (9.3) dla Ekranu 27, Moduł 5 — "Puszki połączeniowe". `operationType: 'read'`.
 * Miejsce montażu MUSI pochodzić od użytkownika (rzeczywiste miejsce puszki) — model nigdy go
 * nie zgaduje.
 */
import { z } from "zod"
import { calculatePuszkiPolaczeniowe } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/calculator"
import type { MiejsceMontazu } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/input"
import type { AiToolDefinition } from "../types"

const MIEJSCA_MONTAZU = ["zewnatrz", "w-ziemi", "wewnatrz"] as [MiejsceMontazu, ...MiejsceMontazu[]]

export const PuszkiPolaczenioweToolInput = z.object({
  miejsceMontazu: z.enum(MIEJSCA_MONTAZU).nullable().describe("Miejsce montażu puszki połączeniowej. null = jeszcze nie wybrano"),
})

export type PuszkiPolaczenioweToolInputT = z.infer<typeof PuszkiPolaczenioweToolInput>

export const PuszkiPolaczenioweToolOutput = z.object({
  wymaganyTyp: z.string().nullable(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wersjaKalkulatora: z.string(),
})

export type PuszkiPolaczenioweToolOutputT = z.infer<typeof PuszkiPolaczenioweToolOutput>

export const puszkiPolaczenioweTool: AiToolDefinition<PuszkiPolaczenioweToolInputT, PuszkiPolaczenioweToolOutputT> = {
  name: "policz_puszki_polaczeniowe",
  description:
    "Dobiera wymagany typ puszki połączeniowej (IP66 z dławikami na zewnątrz, zalewana żywicą w ziemi, " +
    "IP20 wewnątrz) na podstawie miejsca montażu podanego przez usera. Użyj, gdy user pyta o dobór " +
    "puszki połączeniowej dla instalacji off-grid.",
  inputSchema: PuszkiPolaczenioweToolInput,
  outputSchema: PuszkiPolaczenioweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/puszki-polaczeniowe",
  handler: async (input) => {
    const wynik = calculatePuszkiPolaczeniowe(input)
    return {
      wymaganyTyp: wynik.value.wymaganyTyp,
      status: wynik.status,
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
