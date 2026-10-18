/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 15 "Krótkie okno słoneczne" (dawne 6.22).
 * `operationType: 'read'`. Produkcja okna, bateria i SoC MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOknoSloneczne } from "@/lib/core/modules/stress-test/okno-sloneczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OknoSloneczneToolInput = z.object({
  energiaOknaKwh: z.number().describe("Produkcja PV w oknie słonecznym [kWh]"),
  zuzycieWOknieKwh: z.number().describe("Zużycie domu w czasie okna [kWh]; 0 = brak"),
  pojemnoscBateriiKwh: z.number().describe("Pojemność użyteczna baterii [kWh]"),
  socStartPct: z.number().describe("SoC na początku okna [%]"),
  grzalkiBmsKwh: z.number().describe("Energia grzałek BMS potrzebna przed ładowaniem [kWh]; 0 = bateria nie wymaga ogrzania"),
  bojlerL: z.number().describe("Pojemność bojlera C.W.U. [l]; 0 = bez bojlera"),
  bojlerTStartC: z.number().nullable().describe("Temperatura wody teraz [°C]; null gdy brak bojlera"),
  bojlerTCelC: z.number().nullable().describe("Temperatura docelowa wody [°C]; null gdy brak bojlera"),
})
export type OknoSloneczneToolInputT = z.infer<typeof OknoSloneczneToolInput>

export const OknoSloneczneToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaDoPodzialuKwh: z.number(),
  naGrzalkiBmsKwh: z.number(),
  naBaterieKwh: z.number(),
  naBojlerKwh: z.number(),
  nadwyzkaKwh: z.number(),
  socKoniecPct: z.number(),
  bojlerTKoniecC: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OknoSloneczneToolOutputT = z.infer<typeof OknoSloneczneToolOutput>

export const oknoSloneczneTool: AiToolDefinition<OknoSloneczneToolInputT, OknoSloneczneToolOutputT> = {
  name: "rozdziel_energie_okna_slonecznego",
  description:
    "Podział energii z krótkiego zimowego okna słonecznego w kolejności priorytetów: grzałki BMS (gdy bateria " +
    "wymaga ogrzania), bateria do 80%, bojler C.W.U., bateria do 100%, odbiorniki nadwyżkowe; SoC po oknie i " +
    "temperatura wody. Użyj, gdy user pyta, do ilu naładuje się bateria w kilka godzin zimowego słońca, czy " +
    "grzać dziś bojler, czy włączyć pralkę albo jak najlepiej wykorzystać krótkie słońce zimą.",
  inputSchema: OknoSloneczneToolInput,
  outputSchema: OknoSloneczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/okno-sloneczne",
  handler: async (input) => {
    const wynik = calculateOknoSloneczne(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
