/**
 * Narzędzie AI (9.3) dla M14 — D12/F11 „Test licznika i reklamacja” (część kalkulatora).
 * `operationType: 'read'`. Echo silnika `siec/test-licznika`: P = 3600 · n / (t · stała).
 * Liczbę impulsów, czas i stałą z tabliczki licznika podaje user — model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateTestLicznika } from "@/lib/core/modules/siec/test-licznika/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TestLicznikaToolInput = z.object({
  liczbaImpulsow: z.number().describe("Liczba policzonych mrugnięć diody licznika (impulsów)"),
  czasS: z.number().describe("Czas trwania tych impulsów [s], zmierzony stoperem"),
  stalaImpKwh: z.number().describe("Stała licznika z tabliczki [imp/kWh], np. 1000 — od usera, nie zgaduj"),
  mocOdbiornikaW: z
    .number()
    .nullable()
    .describe("Znana moc jedynego włączonego odbiornika [W] (np. czajnik z tabliczki) — do porównania; null gdy brak"),
})
export type TestLicznikaToolInputT = z.infer<typeof TestLicznikaToolInput>

export const TestLicznikaToolOutput = z.object({
  status: z.enum(STATUSY),
  mocZLicznikaKw: z.number(),
  roznicaProcent: z.number().nullable(),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TestLicznikaToolOutputT = z.infer<typeof TestLicznikaToolOutput>

export const testLicznikaTool: AiToolDefinition<TestLicznikaToolInputT, TestLicznikaToolOutputT> = {
  name: "sprawdz_licznik_energii",
  description:
    "Liczy moc, jaką rejestruje licznik energii, z mrugnięć jego diody (M14, D12/F11): P = 3600 · n / (t[s] · stała " +
    "[imp/kWh]), i porównuje ją ze znaną mocą jedynego włączonego odbiornika (różnica %). Dane z pomiaru i tabliczki " +
    "podaje user — nie zgaduj. Użyj, gdy user podejrzewa, że licznik źle liczy, chce go sprawdzić przed reklamacją " +
    "albo pyta, jak zmierzyć pobór mocy licznikiem.",
  inputSchema: TestLicznikaToolInput,
  outputSchema: TestLicznikaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/test-licznika",
  handler: async (input) => {
    const wynik = calculateTestLicznika(input)
    return {
      status: wynik.status,
      ...wynik.value,
      wzor: wynik.formula,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
