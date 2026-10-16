/**
 * Narzędzie AI (9.3) dla Modułu 13: „Tryb wyjazdu i tryb nocny" (7.27 + 7.49 bez telemetrii). `operationType: 'read'`.
 * Zużycie dobowe odbiorników i wybór, które zostają włączone, podaje user — model nie ocenia, co jest krytyczne dla bezpieczeństwa.
 */
import { z } from "zod"
import { calculateTrybOgraniczonegoZuzycia } from "@/lib/core/modules/zapotrzebowanie/tryb-ograniczonego-zuzycia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TrybOgraniczonegoZuzyciaToolInput = z.object({
  tryb: z.enum(["wyjazd", "noc"]).describe("wyjazd = nieobecność w dobach, noc = okno nocne w godzinach"),
  odbiorniki: z
    .array(
      z.object({
        nazwa: z.string(),
        zuzycieDobaWh: z.number().describe("Dobowe zużycie odbiornika w normalnej pracy [Wh] — z listy usera"),
        zostaje: z.boolean().describe("Czy odbiornik zostaje włączony w trybie ograniczonym — decyduje user"),
      }),
    )
    .describe("Lista odbiorników usera"),
  dniNieobecnosci: z.number().optional().describe("Tryb wyjazd: liczba dób nieobecności"),
  godzinNocy: z.number().optional().describe("Tryb noc: długość okna nocnego [h], 0 < h ≤ 24"),
  pojemnoscUzytecznaKwh: z.number().optional().describe("Energia użyteczna baterii [kWh] — opcjonalnie; daje, na ile dób/nocy wystarczy bez ładowania"),
})
export type TrybOgraniczonegoZuzyciaToolInputT = z.infer<typeof TrybOgraniczonegoZuzyciaToolInput>

export const TrybOgraniczonegoZuzyciaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  normalnieDobaKwh: z.number().nullable(),
  ograniczoneDobaKwh: z.number().nullable(),
  oszczednoscDobaKwh: z.number().nullable(),
  oszczednoscPct: z.number().nullable(),
  okresNormalnieKwh: z.number().nullable().describe("Wyjazd: zużycie w całym okresie, normalnie [kWh]"),
  okresOgraniczoneKwh: z.number().nullable().describe("Wyjazd: zużycie w całym okresie w trybie ograniczonym [kWh]"),
  nocNormalnieKwh: z.number().nullable(),
  nocOgraniczoneKwh: z.number().nullable(),
  bateriaWystarczaNormalnie: z.number().nullable().describe("Na ile dób (wyjazd) albo nocy (noc) wystarczy baterii normalnie"),
  bateriaWystarczaOgraniczone: z.number().nullable(),
  zostaja: z.array(z.string()),
  wylaczone: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TrybOgraniczonegoZuzyciaToolOutputT = z.infer<typeof TrybOgraniczonegoZuzyciaToolOutput>

export const trybOgraniczonegoZuzyciaTool: AiToolDefinition<TrybOgraniczonegoZuzyciaToolInputT, TrybOgraniczonegoZuzyciaToolOutputT> = {
  name: "policz_tryb_ograniczonego_zuzycia",
  description:
    "Zużycie energii w trybie wyjazdu (nieobecność w dobach) albo trybie nocnym (okno nocne w godzinach), gdy część odbiorników zostaje " +
    "włączona, a reszta jest wyłączona (Moduł 13, bez telemetrii). Z dobowych zużyć odbiorników liczę zużycie normalne i ograniczone, oszczędność, " +
    "zużycie w całym okresie (wyjazd) albo w oknie nocnym (noc; zakładam równomierne zużycie w ciągu doby) oraz — z energią użyteczną baterii — " +
    "na ile dób albo nocy wystarczy bez ładowania z paneli. Zużycie i wybór, co zostaje włączone, podaje user; nie oceniam, co jest krytyczne " +
    "(lodówka, alarm, pompa). Użyj, gdy user pyta, ile prądu zabierze wyjazd albo noc, co wyłączyć, żeby bateria wystarczyła, albo na ile dni " +
    "starczy baterii przy ograniczonym zużyciu.",
  inputSchema: TrybOgraniczonegoZuzyciaToolInput,
  outputSchema: TrybOgraniczonegoZuzyciaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/tryb-ograniczonego-zuzycia",
  handler: async (input) => {
    const wynik = calculateTrybOgraniczonegoZuzycia({
      tryb: input.tryb,
      odbiorniki: input.odbiorniki.map((o, i) => ({ id: String(i), nazwa: o.nazwa, zuzycieDobaWh: o.zuzycieDobaWh, zostaje: o.zostaje })),
      dniNieobecnosci: input.dniNieobecnosci ?? null,
      godzinNocy: input.godzinNocy ?? null,
      pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh ?? null,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      normalnieDobaKwh: v?.normalnieDobaKwh ?? null,
      ograniczoneDobaKwh: v?.ograniczoneDobaKwh ?? null,
      oszczednoscDobaKwh: v?.oszczednoscDobaKwh ?? null,
      oszczednoscPct: v?.oszczednoscPct ?? null,
      okresNormalnieKwh: v?.okresNormalnieKwh ?? null,
      okresOgraniczoneKwh: v?.okresOgraniczoneKwh ?? null,
      nocNormalnieKwh: v?.nocNormalnieKwh ?? null,
      nocOgraniczoneKwh: v?.nocOgraniczoneKwh ?? null,
      bateriaWystarczaNormalnie: v?.bateriaWystarczaNormalnie ?? null,
      bateriaWystarczaOgraniczone: v?.bateriaWystarczaOgraniczone ?? null,
      zostaja: v?.zostaja ?? [],
      wylaczone: v?.wylaczone ?? [],
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
