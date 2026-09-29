/**
 * Narzędzie AI (9.3) — Moduł 10, Ekran 1 „Prognozy”. `operationType: 'read'`. Echo silnika
 * `ai/prognozy`: bilans energii z punktów prognozy co 3 h (każdy punkt = średnia moc w oknie 3 h,
 * energia = Σ P × 3 h) i godzina szczytu zużycia. Punkty podaje model — bez danych demonstracyjnych.
 */
import { z } from "zod"
import { calculatePrognozy, KROK_PROBKOWANIA_H } from "@/lib/core/modules/ai/prognozy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrognozyToolInput = z.object({
  punkty: z
    .array(
      z.object({
        godzina: z.number().describe("Godzina początku okna 3 h (0, 3, 6, …, 21)"),
        produkcjaKw: z.number().describe("Średnia moc produkcji PV w tym oknie 3 h [kW]"),
        zuzycieKw: z.number().describe("Średnia moc zużycia w tym oknie 3 h [kW]"),
      }),
    )
    .describe("Punkty prognozy co 3 h; każdy punkt to średnia moc [kW] w swoim 3-godzinnym oknie"),
})
export type PrognozyToolInputT = z.infer<typeof PrognozyToolInput>

export const PrognozyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  produkcjaLacznaKwh: z.number(),
  zuzycieLaczneKwh: z.number(),
  bilansKwh: z.number(),
  godzinaSzczytuZuzycia: z.number().nullable(),
  krokProbkowaniaH: z.number(),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrognozyToolOutputT = z.infer<typeof PrognozyToolOutput>

export const prognozyTool: AiToolDefinition<PrognozyToolInputT, PrognozyToolOutputT> = {
  name: "policz_bilans_prognozy",
  description:
    "Liczy bilans energii z prognozy co 3 h (Moduł 10, Ekran 1): każdy punkt to średnia moc produkcji i zużycia " +
    "[kW] w oknie 3 h, energia = Σ P × 3 h, bilans = produkcja − zużycie [kWh], plus godzina szczytu zużycia. " +
    "Orientacyjnie — próbkowanie co 3 h, nie pełna krzywa godzinowa. Użyj, gdy user podaje prognozę mocy " +
    "(np. z pogody albo symulacji) i pyta, czy na dobę wystarczy prądu, ile zabraknie/zostanie albo kiedy będzie ciasno.",
  inputSchema: PrognozyToolInput,
  outputSchema: PrognozyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ai/prognozy",
  handler: async (input) => {
    const wynik = calculatePrognozy(input.punkty)
    const pusty = wynik.status === "INCOMPLETE"
    return {
      status: wynik.status,
      produkcjaLacznaKwh: wynik.value.produkcjaLacznaKwh,
      zuzycieLaczneKwh: wynik.value.zuzycieLaczneKwh,
      bilansKwh: wynik.value.bilansKwh,
      godzinaSzczytuZuzycia: pusty ? null : wynik.value.godzinaSzczytuZuzycia,
      krokProbkowaniaH: KROK_PROBKOWANIA_H,
      wzor: wynik.formula,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
