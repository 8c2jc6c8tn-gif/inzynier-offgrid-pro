/**
 * AI tool (9.3) for Module 13 — the "Measurement summary and export" screen: min / max / mean per series and energy
 * integrated from power. `operationType: 'read'` — in-memory only, stores nothing. The longest gap bridged in the energy
 * integral depends on the logger and MUST come from the user (Directive #1); without it energy is not computed.
 */
import { z } from "zod"
import { podsumujSerie } from "@/lib/core/telemetria/podsumowanie"
import { WIELKOSCI_LISTA, zbudujProbke, type Wielkosc } from "@/lib/core/telemetria/probka"
import type { AiToolDefinition } from "../types"

const WielkoscSchema = z.enum(WIELKOSCI_LISTA as [Wielkosc, ...Wielkosc[]])

export const PodsumowanieTelemetriiToolInput = z.object({
  pomiary: z
    .array(
      z.object({
        kanal: z.string().min(1).describe("Kanał w źródle, np. bms, pv, obciazenie"),
        wielkosc: WielkoscSchema,
        wartosc: z.number().nullable().describe("Odczyt w jednostce kanonicznej wielkości (moc w W); null = brak pomiaru"),
        czasIso: z.string().min(1).describe("Czas odczytu, ISO 8601"),
      }),
    )
    .min(1),
  maxPrzerwaMin: z
    .number()
    .positive()
    .optional()
    .describe("Największa przerwa między próbkami mocy (min), którą user nadal uznaje za ciągły pomiar; brak = energia nieliczona"),
})
export type PodsumowanieTelemetriiToolInputT = z.infer<typeof PodsumowanieTelemetriiToolInput>

export const PodsumowanieTelemetriiToolOutput = z.object({
  serie: z.array(
    z.object({
      kanal: z.string(),
      wielkosc: z.string(),
      liczbaProbek: z.number(),
      pominiete: z.number(),
      min: z.number().nullable(),
      max: z.number().nullable(),
      srednia: z.number().nullable(),
      energiaKwh: z.number().nullable(),
      pominieteLuki: z.number(),
    }),
  ),
})
export type PodsumowanieTelemetriiToolOutputT = z.infer<typeof PodsumowanieTelemetriiToolOutput>

export const podsumowanieTelemetriiTool: AiToolDefinition<PodsumowanieTelemetriiToolInputT, PodsumowanieTelemetriiToolOutputT> = {
  name: "podsumuj_pomiary_telemetrii",
  description:
    "Podsumowuje pomiary z magazynu, falownika lub BMS: dla każdej serii liczy minimum, maksimum i średnią z poprawnych odczytów, " +
    "a dla mocy — energię w kWh (metoda trapezów, tylko tam, gdzie przerwa między odczytami nie przekracza limitu podanego przez " +
    "usera; bez limitu energii nie liczy). Odczyty brakujące i spoza fizycznego zakresu czujnika są pomijane i zliczane, nigdy " +
    "traktowane jak zero. Nic nie zapisuje. Użyj, gdy user wkleja historię pomiarów i pyta, ile energii wyprodukowała lub zużyła " +
    "instalacja, jaki był najniższy SoC albo najwyższa temperatura w danym okresie, albo chce zbiorcze liczby dla doby lub tygodnia.",
  inputSchema: PodsumowanieTelemetriiToolInput,
  outputSchema: PodsumowanieTelemetriiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "telemetria/podsumowanie-telemetrii",
  handler: async ({ pomiary, maxPrzerwaMin }) => {
    const probki = pomiary
      .map((p) => ({ ...p, czas: Date.parse(p.czasIso) }))
      .filter((p) => Number.isFinite(p.czas))
      .map((p) => zbudujProbke({ zrodloId: "ai", kanal: p.kanal, czas: p.czas, wielkosc: p.wielkosc, wartosc: p.wartosc }))
    const serie = podsumujSerie(probki, maxPrzerwaMin === undefined ? null : maxPrzerwaMin * 60_000).map(({ energiaWh, ...reszta }) => ({
      ...reszta,
      energiaKwh: energiaWh === null ? null : energiaWh / 1000,
    }))
    return { serie }
  },
}
