/**
 * Narzędzie AI (9.3) dla Ekranu 3, Moduł 3 — "Tracker vs konstrukcja stała". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateTrackerVsStaly } from "@/lib/core/modules/pv/tracker-vs-staly/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TrackerVsStalyToolInput = z.object({
  liczbaPaneliTracker: z.number().describe("Liczba paneli na trackerze, szt. (liczba całkowita)"),
  kosztTrackeraZl: z.number().describe("Koszt trackera — mechanizm + fundament, w zł"),
  kosztPaneluZl: z.number().describe("Koszt jednego dodatkowego panelu na stałym stelażu (z jego częścią stelaża i montażu), w zł"),
  uzyskPaneluKwh: z.number().describe("Roczny uzysk jednego panelu na stałym stelażu, w kWh/rok"),
})

export type TrackerVsStalyToolInputT = z.infer<typeof TrackerVsStalyToolInput>

export const TrackerVsStalyToolOutput = z.object({
  dodatkowePanele: z.number(),
  liczbaPaneliStaly: z.number(),
  uzyskStalyKwh: z.number(),
  uzyskTrackerMinKwh: z.number(),
  uzyskTrackerMaxKwh: z.number(),
  przewagaStalegoMinPct: z.number(),
  przewagaStalegoMaxPct: z.number(),
  werdykt: z.enum(["staly", "tracker", "zalezy"]),
  jednostka: z.string(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type TrackerVsStalyToolOutputT = z.infer<typeof TrackerVsStalyToolOutput>

export const trackerVsStalyTool: AiToolDefinition<TrackerVsStalyToolInputT, TrackerVsStalyToolOutputT> = {
  name: "porownaj_tracker_ze_stalym_stelazem",
  description:
    "Porównuje tracker PV ze stałym stelażem przy tych samych pieniądzach: ile paneli da się dokupić za " +
    "cenę trackera i który wariant da więcej energii rocznie. Zysk trackera liczony dla obu granic zakresu " +
    "źródła 30–40%, więc werdykt może brzmieć 'zalezy'. Napór wiatru trackera NIE jest liczony (brak wzoru). " +
    "Użyj, gdy user pyta, czy opłaca się tracker (nadążnik).",
  inputSchema: TrackerVsStalyToolInput,
  outputSchema: TrackerVsStalyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/tracker-vs-staly",
  handler: async (input) => {
    const wynik = calculateTrackerVsStaly(input)
    return {
      ...wynik.value,
      jednostka: wynik.unit,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
