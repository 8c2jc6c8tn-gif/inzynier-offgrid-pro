/**
 * AI tool (9.3) for Module 13 — the "Event history and replay" screen: finds continuous threshold breaches in recorded
 * readings. `operationType: 'read'` — in-memory only, stores nothing. Thresholds have no defaults and MUST come from the user
 * (Directive #1); missing and out-of-range readings are skipped, never treated as zero, and never open or close an episode.
 */
import { z } from "zod"
import { epizodyAlarmow } from "@/lib/core/telemetria/alarmy"
import { WIELKOSCI_LISTA, zbudujProbke, type Wielkosc } from "@/lib/core/telemetria/probka"
import type { AiToolDefinition } from "../types"

const WielkoscSchema = z.enum(WIELKOSCI_LISTA as [Wielkosc, ...Wielkosc[]])

export const HistoriaAlarmowToolInput = z.object({
  pomiary: z
    .array(
      z.object({
        kanal: z.string().min(1).describe("Kanał w źródle, np. bms, pv, obciazenie"),
        wielkosc: WielkoscSchema,
        wartosc: z.number().nullable().describe("Odczyt w jednostce kanonicznej wielkości; null = brak pomiaru"),
        czasIso: z.string().min(1).describe("Czas odczytu, ISO 8601"),
      }),
    )
    .min(1),
  progi: z
    .array(
      z.object({
        id: z.string().min(1),
        wielkosc: WielkoscSchema,
        kanal: z.string().min(1).optional(),
        kierunek: z.enum(["ponizej", "powyzej"]),
        wartosc: z.number().describe("Próg podany przez usera — nie zgadywany"),
        priorytet: z.enum(["info", "ostrzezenie", "krytyczny"]),
      }),
    )
    .min(1),
})
export type HistoriaAlarmowToolInputT = z.infer<typeof HistoriaAlarmowToolInput>

export const HistoriaAlarmowToolOutput = z.object({
  epizody: z.array(
    z.object({
      progId: z.string(),
      priorytet: z.string(),
      kanal: z.string(),
      wielkosc: z.string(),
      kierunek: z.string(),
      prog: z.number(),
      odIso: z.string(),
      doIso: z.string().nullable(),
      czasTrwaniaMin: z.number().nullable(),
      ekstremum: z.number(),
    }),
  ),
  pominieteOdczyty: z.number(),
})
export type HistoriaAlarmowToolOutputT = z.infer<typeof HistoriaAlarmowToolOutput>

export const historiaAlarmowTool: AiToolDefinition<HistoriaAlarmowToolInputT, HistoriaAlarmowToolOutputT> = {
  name: "znajdz_zdarzenia_alarmowe",
  description:
    "Przegląda historię odczytów i znajduje zdarzenia alarmowe: każde ciągłe przekroczenie progu z czasem początku, końca " +
    "(null = trwa do ostatniego odczytu), czasem trwania i najgorszą wartością. Progi podaje user — aplikacja nie ma żadnych " +
    "domyślnych. Odczyty brakujące i spoza fizycznego zakresu czujnika są pomijane, nigdy liczone jako zero i nie kończą zdarzenia. " +
    "Nic nie zapisuje. Użyj, gdy user wkleja historię pomiarów z magazynu, falownika lub BMS i pyta, kiedy i jak długo próg był " +
    "przekroczony, co się działo w nocy albo czy ustawione limity nie są zbyt czułe lub zbyt luźne.",
  inputSchema: HistoriaAlarmowToolInput,
  outputSchema: HistoriaAlarmowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "telemetria/historia-zdarzen",
  handler: async ({ pomiary, progi }) => {
    const probki = pomiary
      .map((p) => ({ ...p, czas: Date.parse(p.czasIso) }))
      .filter((p) => Number.isFinite(p.czas))
      .map((p) => zbudujProbke({ zrodloId: "ai", kanal: p.kanal, czas: p.czas, wielkosc: p.wielkosc, wartosc: p.wartosc }))
    const epizody = epizodyAlarmow(probki, progi).map((e) => ({
      progId: e.progId,
      priorytet: e.priorytet,
      kanal: e.kanal,
      wielkosc: e.wielkosc,
      kierunek: e.kierunek,
      prog: e.prog,
      odIso: new Date(e.odMs).toISOString(),
      doIso: e.doMs === null ? null : new Date(e.doMs).toISOString(),
      czasTrwaniaMin: e.doMs === null ? null : Math.round((e.doMs - e.odMs) / 60_000),
      ekstremum: e.ekstremum,
    }))
    return { epizody, pominieteOdczyty: probki.filter((p) => p.jakosc !== "ok").length }
  },
}
