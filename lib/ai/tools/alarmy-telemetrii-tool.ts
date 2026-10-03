/**
 * AI tool (9.3) for Module 13 — the "Live readings and alarms" screen: evaluates which user-defined thresholds are breached
 * by the latest valid reading of each series. `operationType: 'read'` — in-memory only, stores nothing. Thresholds have no
 * defaults and MUST come from the user (Directive #1); missing and out-of-range readings are skipped, never treated as zero.
 */
import { z } from "zod"
import { ocenAlarmy } from "@/lib/core/telemetria/alarmy"
import { WIELKOSCI_LISTA, zbudujProbke, type Wielkosc } from "@/lib/core/telemetria/probka"
import type { AiToolDefinition } from "../types"

const WielkoscSchema = z.enum(WIELKOSCI_LISTA as [Wielkosc, ...Wielkosc[]])

export const AlarmyTelemetriiToolInput = z.object({
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
export type AlarmyTelemetriiToolInputT = z.infer<typeof AlarmyTelemetriiToolInput>

export const AlarmyTelemetriiToolOutput = z.object({
  aktywne: z.array(
    z.object({
      progId: z.string(),
      priorytet: z.string(),
      kanal: z.string(),
      wielkosc: z.string(),
      wartosc: z.number(),
      prog: z.number(),
      kierunek: z.string(),
    }),
  ),
  pominieteOdczyty: z.number(),
})
export type AlarmyTelemetriiToolOutputT = z.infer<typeof AlarmyTelemetriiToolOutput>

export const alarmyTelemetriiTool: AiToolDefinition<AlarmyTelemetriiToolInputT, AlarmyTelemetriiToolOutputT> = {
  name: "ocen_alarmy_telemetrii",
  description:
    "Sprawdza, które progi alarmowe są teraz przekroczone, na podstawie ostatniego poprawnego odczytu każdej serii (np. SoC poniżej " +
    "progu, temperatura ogniw powyżej progu). Progi podaje user — aplikacja nie ma żadnych domyślnych. Odczyty brakujące i spoza " +
    "fizycznego zakresu czujnika są pomijane, nigdy liczone jako zero. Nic nie zapisuje. " +
    "Użyj, gdy user pyta, czy przy jego odczytach z magazynu, falownika lub BMS któryś alarm by się włączył, jak ustawić progi " +
    "ostrzeżeń i alarmów krytycznych albo wkleja pomiary i chce sprawdzić, co jest poza limitem.",
  inputSchema: AlarmyTelemetriiToolInput,
  outputSchema: AlarmyTelemetriiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "telemetria/pomiary-na-zywo",
  handler: async ({ pomiary, progi }) => {
    const probki = pomiary
      .map((p) => ({ ...p, czas: Date.parse(p.czasIso) }))
      .filter((p) => Number.isFinite(p.czas))
      .map((p) => zbudujProbke({ zrodloId: "ai", kanal: p.kanal, czas: p.czas, wielkosc: p.wielkosc, wartosc: p.wartosc }))
    const aktywne = ocenAlarmy(probki, progi).map(({ progId, priorytet, kanal, wielkosc, wartosc, prog, kierunek }) => ({
      progId,
      priorytet,
      kanal,
      wielkosc,
      wartosc,
      prog,
      kierunek,
    }))
    return { aktywne, pominieteOdczyty: probki.filter((p) => p.jakosc !== "ok").length }
  },
}
