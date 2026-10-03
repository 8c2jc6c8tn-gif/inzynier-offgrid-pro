/**
 * AI tool (9.3) for Module 13 — the "Telemetry data sources" screen: quality check of a CSV file against a
 * user-supplied column mapping. `operationType: 'read'` — parses in memory, stores nothing. The sampling step and
 * the column mapping MUST come from the user (Directive #1); neither is ever guessed from the data.
 */
import { z } from "zod"
import { parsujCsv } from "@/lib/core/telemetria/csv"
import { ocenJakosc, usunDuplikaty } from "@/lib/core/telemetria/jakosc"
import { ProfilCsvSchema } from "@/lib/core/telemetria/rejestr"
import type { AiToolDefinition } from "../types"

export const JakoscCsvTelemetriiToolInput = z.object({
  tekstCsv: z.string().min(1).describe("Pełna treść pliku CSV (z nagłówkiem lub bez)"),
  profil: ProfilCsvSchema.describe(
    "Mapowanie kolumn podane przez usera: kolumna czasu i jej format, przesunięcie zegara względem UTC [min], znaczniki braku pomiaru, " +
      "kolumny z pomiarami (kanał, wielkość, jednostka w pliku)",
  ),
  krokS: z.number().positive().describe("Odstęp między pomiarami w pliku [s] — podany przez usera, nie zgadywany"),
})
export type JakoscCsvTelemetriiToolInputT = z.infer<typeof JakoscCsvTelemetriiToolInput>

export const JakoscCsvTelemetriiToolOutput = z.object({
  probek: z.number(),
  bledyWierszy: z.number(),
  przykladyBledow: z.array(z.object({ wiersz: z.number(), powod: z.string() })),
  duplikaty: z.number(),
  pozaZakresem: z.number(),
  brakWartosci: z.number(),
  luki: z.array(z.object({ seria: z.string(), odIso: z.string(), doIso: z.string() })),
  zamrozone: z.array(z.string()),
})
export type JakoscCsvTelemetriiToolOutputT = z.infer<typeof JakoscCsvTelemetriiToolOutput>

export const jakoscCsvTelemetriiTool: AiToolDefinition<JakoscCsvTelemetriiToolInputT, JakoscCsvTelemetriiToolOutputT> = {
  name: "ocen_jakosc_pliku_csv_telemetrii",
  description:
    "Sprawdza jakość pliku CSV z pomiarami (falownik, regulator, logger, stacja pogodowa) przed jego wczytaniem: ile próbek da się " +
      "odczytać, które wiersze mają błąd (zła liczba kolumn, nieczytelny czas lub liczba), ile jest powtórzeń, wartości spoza " +
      "fizycznego zakresu czujnika, braków, luk dłuższych niż 2× odstęp i serii zamrożonych (czujnik bez żadnej zmiany). " +
      "Nic nie zapisuje. " +
      "Użyj, gdy user pyta, czy jego plik CSV z pomiarami jest dobry, dlaczego import pliku gubi wiersze, czy w danych z logera są luki " +
      "albo zawieszony czujnik, albo wkleja zawartość pliku i prosi o ocenę, zanim wczyta go do aplikacji.",
  inputSchema: JakoscCsvTelemetriiToolInput,
  outputSchema: JakoscCsvTelemetriiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "telemetria/zrodla",
  handler: async ({ tekstCsv, profil, krokS }) => {
    // `ProfilCsvSchema` types the quantity as string; the parser narrows it, so the cast mirrors the screen's use.
    const { probki, bledy } = parsujCsv(tekstCsv, profil as Parameters<typeof parsujCsv>[1], "podglad")
    const raport = ocenJakosc(probki, krokS * 1000)
    return {
      probek: usunDuplikaty(probki).length,
      bledyWierszy: bledy.length,
      przykladyBledow: bledy.slice(0, 5).map((b) => ({ wiersz: b.wiersz, powod: b.powod })),
      duplikaty: raport.duplikaty,
      pozaZakresem: raport.pozaZakresem,
      brakWartosci: raport.brakWartosci,
      luki: raport.luki.slice(0, 10).map((l) => ({ seria: l.seria, odIso: new Date(l.od).toISOString(), doIso: new Date(l.do).toISOString() })),
      zamrozone: raport.zamrozone,
    }
  },
}
