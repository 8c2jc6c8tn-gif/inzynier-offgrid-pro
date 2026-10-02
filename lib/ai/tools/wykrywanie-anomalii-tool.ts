/**
 * Narzędzie AI (9.3) dla Modułu 10, Ekran 7 — wykrywanie anomalii: produkcja PV (dawne 12.13), zużycie (12.14) i
 * kaskada przyczyn spadku PV (12.17). `operationType: 'read'`. Energia oczekiwana i zmierzona, próg i odpowiedzi
 * kaskady — od usera; model nie zgaduje progu ani przyczyny.
 */
import { z } from "zod"
import { calculateWykrywanieAnomalii } from "@/lib/core/modules/ai/wykrywanie-anomalii/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Odp = z.boolean().nullable().optional()

export const WykrywanieAnomaliiToolInput = z.object({
  podsystem: z.enum(["pv", "zuzycie"]).describe("pv = produkcja PV, zuzycie = zużycie energii"),
  oczekiwanaKwh: z.number().describe("Energia oczekiwana w okresie [kWh] — PV: dla faktycznego nasłonecznienia; zużycie: typowe"),
  zmierzonaKwh: z.number().describe("Energia zmierzona w tym samym okresie [kWh]"),
  progAlarmuPct: z.number().nullable().describe("Próg alarmu [%] — od usera; null = tylko odchylenie"),
  kaskada: z
    .object({ pogoda: Odp, brud: Odp, snieg: Odp, cien: Odp })
    .describe("Tylko PV: czy dana przyczyna tłumaczy spadek (true/false), w kolejności pogoda→brud→śnieg→cień; null = niesprawdzone"),
})
export type WykrywanieAnomaliiToolInputT = z.infer<typeof WykrywanieAnomaliiToolInput>

export const WykrywanieAnomaliiToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  odchylenieKwh: z.number(),
  odchyleniePct: z.number(),
  przekroczonyProg: z.boolean().nullable(),
  przyczyna: z.enum(["pogoda", "brud", "snieg", "cien", "uszkodzenie"]).nullable(),
  nastepnyKrok: z.enum(["pogoda", "brud", "snieg", "cien"]).nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WykrywanieAnomaliiToolOutputT = z.infer<typeof WykrywanieAnomaliiToolOutput>

export const wykrywanieAnomaliiTool: AiToolDefinition<WykrywanieAnomaliiToolInputT, WykrywanieAnomaliiToolOutputT> = {
  name: "wykryj_anomalie_produkcji_lub_zuzycia",
  description:
    "Porównanie zmierzonej energii z oczekiwaną (produkcja PV albo zużycie): odchylenie w kWh i %, werdykt wg progu " +
    "usera, a przy spadku PV kaskada przyczyn w kolejności pogoda → brud → śnieg → cień → uszkodzenie. Użyj, gdy user " +
    "pyta, czemu panele produkują mniej niż powinny, czy spadek produkcji to usterka, albo czemu zużycie nagle wzrosło " +
    "lub spadło.",
  inputSchema: WykrywanieAnomaliiToolInput,
  outputSchema: WykrywanieAnomaliiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ai/wykrywanie-anomalii",
  handler: async (input) => {
    const wynik = calculateWykrywanieAnomalii(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
