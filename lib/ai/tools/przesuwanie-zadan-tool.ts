/**
 * Narzędzie AI (9.3) dla Modułu 10, Ekran 5 — dynamiczne przesuwanie zadań domowych (dawne 12.10).
 * `operationType: 'read'`. Prognoza (8 punktów co 3 h, jak Ekran Prognozy) i zadania (moc, czas, okno) — od usera.
 */
import { z } from "zod"
import { calculatePrzesuwanieZadan } from "@/lib/core/modules/ai/przesuwanie-zadan/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrzesuwanieZadanToolInput = z.object({
  prognoza: z
    .array(
      z.object({
        godzina: z.number().describe("Początek okna 3 h: 0, 3, 6, …, 21"),
        produkcjaKw: z.number().describe("Średnia produkcja PV w tym oknie [kW] — od usera / z Ekranu Prognozy"),
        zuzycieKw: z.number().describe("Średnie zużycie bazowe w tym oknie [kW] (bez planowanych zadań)"),
      }),
    )
    .describe("Prognoza doby: 8 punktów co 3 h"),
  zadania: z
    .array(
      z.object({
        id: z.string(),
        nazwa: z.string().describe("Nazwa zadania, np. Pranie"),
        mocKw: z.number().describe("Średnia moc urządzenia w pracy [kW] — od usera"),
        czasTrwaniaH: z.number().describe("Czas pracy [h], krok 0,5"),
        najwczesniejOdH: z.number().describe("Najwcześniejszy start [godzina 0–24], krok 0,5"),
        gotoweDoH: z.number().describe("Musi być gotowe do [godzina 0–24], krok 0,5"),
      }),
    )
    .describe("Zadania w kolejności ważności — wyższe na liście zabiera nadwyżkę pierwsze"),
})
export type PrzesuwanieZadanToolInputT = z.infer<typeof PrzesuwanieZadanToolInput>

export const PrzesuwanieZadanToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zadania: z.array(
    z.object({
      id: z.string(),
      nazwa: z.string(),
      startH: z.number().nullable(),
      koniecH: z.number().nullable(),
      energiaKwh: z.number(),
      zPvKwh: z.number(),
      zBateriiKwh: z.number(),
      pokryciePvPct: z.number(),
    }),
  ),
  nadwyzkaDobyKwh: z.number(),
  zPvRazemKwh: z.number(),
  zBateriiRazemKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrzesuwanieZadanToolOutputT = z.infer<typeof PrzesuwanieZadanToolOutput>

export const przesuwanieZadanTool: AiToolDefinition<PrzesuwanieZadanToolInputT, PrzesuwanieZadanToolOutputT> = {
  name: "zaplanuj_zadania_domowe_pod_nadwyzke_pv",
  description:
    "Plan uruchomienia zadań domowych (pranie, zmywarka, ładowanie EV) na godziny z największą nadwyżką PV z prognozy " +
    "doby, zawsze w oknie usera (najwcześniej od / gotowe do): start, koniec, ile kWh z PV, ile z baterii. Użyj, gdy " +
    "user pyta, kiedy włączyć pralkę albo zmywarkę, jak przesunąć zadania na słońce, czy zdąży z praniem do danej " +
    "godziny albo ile energii zadań pokryje PV.",
  inputSchema: PrzesuwanieZadanToolInput,
  outputSchema: PrzesuwanieZadanToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ai/przesuwanie-zadan",
  handler: async (input) => {
    const wynik = calculatePrzesuwanieZadan(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
