/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 1 "Systemy podtrzymania życia (Survival Core)". Suma
 * mocy zaznaczonych odbiorników krytycznych. `operationType: 'read'`. Lista odbiorników (id,
 * etykieta, moc, zaznaczenie) pochodzi WYŁĄCZNIE od usera — moc "Ogrzewanie" nie ma domyślnej
 * wartości źródłowej i musi być wpisana ręcznie, nigdy nie zgaduj.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSurvivalCore } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SystemyPodtrzymaniaZyciaToolInput = z.object({
  items: z
    .array(
      z.object({
        id: z.string().describe("Identyfikator pozycji, np. 'pompa-glebinowa', 'ogrzewanie'"),
        label: z.string().describe("Etykieta odbiornika"),
        powerW: z.number().describe("Moc odbiornika [W] — od usera, dla 'ogrzewanie' brak domyślnej, nie zgaduj"),
        selected: z.boolean().describe("Czy odbiornik jest dziś częścią zestawu krytycznego (priorytet 1)"),
      }),
    )
    .describe("Katalog odbiorników krytycznych z zaznaczeniem i mocą — od usera"),
})
export type SystemyPodtrzymaniaZyciaToolInputT = z.infer<typeof SystemyPodtrzymaniaZyciaToolInput>

export const SystemyPodtrzymaniaZyciaToolOutput = z.object({
  status: z.enum(STATUSY),
  mocBazowaW: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SystemyPodtrzymaniaZyciaToolOutputT = z.infer<typeof SystemyPodtrzymaniaZyciaToolOutput>

export const systemyPodtrzymaniaZyciaTool: AiToolDefinition<
  SystemyPodtrzymaniaZyciaToolInputT,
  SystemyPodtrzymaniaZyciaToolOutputT
> = {
  name: "policz_moc_bazowa_survival_core",
  description:
    "Liczy łączną moc [W] zaznaczonych odbiorników krytycznych (priorytet 1, nigdy nie odłączane) — Moduł 2, " +
    "Ekran 1 'Systemy podtrzymania życia'. Lista odbiorników i ich moce podaje user — nie zgaduj mocy 'Ogrzewanie', " +
    "źródło jej nie podaje. Użyj, gdy user pyta o bazowe zapotrzebowanie krytyczne systemu off-grid.",
  inputSchema: SystemyPodtrzymaniaZyciaToolInput,
  outputSchema: SystemyPodtrzymaniaZyciaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/systemy-podtrzymania-zycia",
  handler: async (input) => {
    const wynik = calculateSurvivalCore({ items: input.items })
    return {
      status: wynik.status,
      mocBazowaW: wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
