/**
 * Narzędzie AI (9.3) dla M14 — F5 „Opłata mocowa — przesunięcie poboru”. `operationType: 'read'`.
 * Echo silnika `siec/oplata-mocowa`: stawka ✅ z pliku danych (Informacja Prezesa URE), energia
 * w godzinach 7:00–22:00 dni roboczych — od usera, z danych licznika.
 */
import { z } from "zod"
import { calculateOplataMocowa } from "@/lib/core/modules/siec/oplata-mocowa/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OplataMocowaToolInput = z.object({
  dataRozliczenia: z.string().describe("Data rozliczenia RRRR-MM-DD (wybiera okres ważności stawki)"),
  energiaRocznaKwh: z.number().describe("Cała energia pobrana w roku [kWh] — z faktur"),
  energiaWGodzinachKwh: z
    .number()
    .nullable()
    .describe("Energia pobrana w dni robocze 7:00–22:00 [kWh/rok] — z danych licznika/OSD; null gdy user nie zna (0 jest poprawne)"),
  przesuniecieProcent: z.number().min(0).max(100).describe("Jaki % tej energii da się przesunąć poza te godziny (0–100) — scenariusz usera"),
  stawkaWlasnaZlKwh: z.number().optional().describe("Stawka z faktury [zł/kWh]; pomiń, żeby użyć stawki z danych 2026"),
})
export type OplataMocowaToolInputT = z.infer<typeof OplataMocowaToolInput>

export const OplataMocowaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  stawkaZlKwh: z.number(),
  udzialProcent: z.number(),
  oplataRokZl: z.number(),
  oplataPoPrzesunieciuZl: z.number(),
  oszczednoscRokZl: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OplataMocowaToolOutputT = z.infer<typeof OplataMocowaToolOutput>

export const oplataMocowaTool: AiToolDefinition<OplataMocowaToolInputT, OplataMocowaToolOutputT> = {
  name: "policz_oplate_mocowa",
  description:
    "Liczy roczną opłatę mocową firmy (M14, F5) za energię pobraną w dni robocze 7:00–22:00, udział tych godzin w " +
    "całym poborze i oszczędność po przesunięciu X% tej energii poza te godziny (np. magazynem albo zmianą harmonogramu). " +
    "Stawka z danych 2026 albo z faktury. Energię w godzinach podaje user z danych licznika — nie zgaduj. Użyj, gdy " +
    "firma pyta, ile płaci opłaty mocowej albo ile zaoszczędzi, przesuwając pobór poza szczyt.",
  inputSchema: OplataMocowaToolInput,
  outputSchema: OplataMocowaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/oplata-mocowa",
  handler: async (input) => {
    const wynik = calculateOplataMocowa(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
