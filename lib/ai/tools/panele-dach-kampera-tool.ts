/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 19 "Ile paneli na dachu kampera". `operationType: 'read'`.
 * Wymiary, marginesy i odstępy MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculatePaneleDachKampera } from "@/lib/core/modules/kalkulator-mobilny/panele-dach-kampera/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PaneleDachKamperaToolInput = z.object({
  szerokoscDachuM: z.number().describe("Szerokość dachu [m]"),
  marginesM: z.number().describe("Odstęp od krawędzi dachu i przeszkód [m] — od usera"),
  odstepM: z.number().describe("Odstęp między panelami [m] — od usera"),
  panelDlugoscM: z.number().describe("Długość panelu [m]"),
  panelSzerokoscM: z.number().describe("Szerokość panelu [m]"),
  panelMocW: z.number().describe("Moc panelu [W]"),
  odcinki: z
    .array(z.object({ nazwa: z.string(), dlugoscM: z.number().describe("Długość wolnego odcinka [m]") }))
    .describe("Wolne odcinki dachu między klimatyzatorem, świetlikami i krawędziami"),
})
export type PaneleDachKamperaToolInputT = z.infer<typeof PaneleDachKamperaToolInput>

export const PaneleDachKamperaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  odcinki: z.array(
    z.object({ wzdluz: z.number(), wPoprzek: z.number(), panelWzdluz: z.boolean(), paneli: z.number() }),
  ),
  liczbaPaneli: z.number(),
  mocW: z.number().describe("Łączna moc paneli na dachu [W]"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PaneleDachKamperaToolOutputT = z.infer<typeof PaneleDachKamperaToolOutput>

export const paneleDachKamperaTool: AiToolDefinition<PaneleDachKamperaToolInputT, PaneleDachKamperaToolOutputT> = {
  name: "policz_panele_na_dachu_kampera",
  description:
    "Liczy, ile paneli zmieści się na dachu kampera: siatka na każdym wolnym odcinku dachu (między " +
    "klimatyzatorem i świetlikami), z marginesem i odstępami, w lepszej z dwóch orientacji; podaje łączną " +
    "moc. Użyj, gdy user pyta, ile paneli albo ile watów zmieści na dachu kampera lub przyczepy.",
  inputSchema: PaneleDachKamperaToolInput,
  outputSchema: PaneleDachKamperaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/panele-dach-kampera",
  handler: async (input) => {
    const wynik = calculatePaneleDachKampera(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
