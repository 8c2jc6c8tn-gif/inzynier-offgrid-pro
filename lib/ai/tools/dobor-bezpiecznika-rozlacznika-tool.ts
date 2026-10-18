/**
 * Narzędzie AI (9.3) dla Ekranu 6, Moduł 5 — "Dobór bezpieczników i rozłączników".
 * `operationType: 'read'`. Prąd znamionowy obwodu, prąd zwarciowy i AIC bezpiecznika MUSZĄ
 * pochodzić od użytkownika (pomiar/projekt obwodu, karta katalogowa zabezpieczenia) — model
 * nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDoborBezpiecznikaRozlacznika } from "@/lib/core/modules/okablowanie/dobor-bezpiecznika-rozlacznika/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborBezpiecznikaRozlacznikaToolInput = z.object({
  pradZnamionowyA: z.number().describe("Prąd znamionowy obwodu ogólnego [A]. 0 = jeszcze nie podano"),
  pradZwarciowyA: z
    .number()
    .describe(
      "Prąd zwarciowy w tym punkcie instalacji [A] — z Ekranu 12 (Analiza zwarciowa) albo pomiaru. 0 = jeszcze niesprawdzone",
    ),
  aicBezpiecznikaA: z
    .number()
    .describe("Zdolność wyłączania (AIC) wybranego bezpiecznika [A], z karty katalogowej. 0 = jeszcze niewybrany"),
})

export type DoborBezpiecznikaRozlacznikaToolInputT = z.infer<typeof DoborBezpiecznikaRozlacznikaToolInput>

export const DoborBezpiecznikaRozlacznikaToolOutput = z.object({
  pradBezpiecznikaZalecanyA: z.number(),
  aicWystarczajace: z.boolean().nullable(),
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type DoborBezpiecznikaRozlacznikaToolOutputT = z.infer<typeof DoborBezpiecznikaRozlacznikaToolOutput>

export const doborBezpiecznikaRozlacznikaTool: AiToolDefinition<
  DoborBezpiecznikaRozlacznikaToolInputT,
  DoborBezpiecznikaRozlacznikaToolOutputT
> = {
  name: "policz_dobor_bezpiecznika_rozlacznika",
  description:
    "Liczy zalecany prąd bezpiecznika/rozłącznika ogólnego obwodu (margines 1,25× prądu znamionowego) " +
    "i opcjonalnie sprawdza, czy zdolność wyłączania (AIC) jest wystarczająca wobec prądu zwarciowego. " +
    "To reguła produktowa dla ogólnych obwodów instalacji — NIE dotyczy doboru bezpiecznika stringu PV " +
    "(inna reguła, norma HD 60364-7-712). Użyj, gdy user pyta o dobór bezpiecznika/rozłącznika obwodu ogólnego.",
  inputSchema: DoborBezpiecznikaRozlacznikaToolInput,
  outputSchema: DoborBezpiecznikaRozlacznikaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/dobor-bezpiecznika-rozlacznika",
  handler: async (input) => {
    const wynik = calculateDoborBezpiecznikaRozlacznika(input)
    return {
      pradBezpiecznikaZalecanyA: wynik.value.pradBezpiecznikaZalecanyA,
      aicWystarczajace: wynik.value.aicWystarczajace,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
