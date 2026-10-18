/**
 * Narzędzie AI (9.3) dla Ekranu 1, Moduł 4 "Magazyn energii / baterie" — "Dobór pojemności
 * baterii". `operationType: 'read'`. Zapotrzebowanie dobowe i dni autonomii docelowo mają
 * pochodzić z Modułu 2 (jeszcze nie istnieje w kodzie) — dziś wpisywane ręcznie przez usera,
 * nigdy nie zgaduj tych wartości.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDoborPojemnosci } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborPojemnosciToolInput = z.object({
  zapotrzebowanieDoboweKwh: z.number().describe("Zapotrzebowanie dobowe [kWh] — od usera (docelowo z Modułu 2)"),
  dniAutonomii: z.number().describe("Dni autonomii — ile dni bez słońca system ma wytrzymać wyłącznie na baterii"),
  sprawnoscFalownikaPct: z.number().describe("Sprawność falownika [%], 0–100"),
  dodPct: z.number().describe("DoD — głębokość rozładowania [%], 0–100"),
})
export type DoborPojemnosciToolInputT = z.infer<typeof DoborPojemnosciToolInput>

export const DoborPojemnosciToolOutput = z.object({
  status: z.enum(STATUSY),
  pojemnoscUzytecznaKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DoborPojemnosciToolOutputT = z.infer<typeof DoborPojemnosciToolOutput>

export const doborPojemnosciTool: AiToolDefinition<DoborPojemnosciToolInputT, DoborPojemnosciToolOutputT> = {
  name: "policz_dobor_pojemnosci_baterii",
  description:
    "Liczy wymaganą pojemność użyteczną banku baterii na podstawie zapotrzebowania dobowego, dni autonomii, " +
    "sprawności falownika i DoD (Moduł 4, Ekran 1). Zapotrzebowanie dobowe i dni autonomii podaje user " +
    "ręcznie — nie zgaduj ich. Użyj, gdy user pyta, jaką pojemność baterii dobrać do systemu off-grid.",
  inputSchema: DoborPojemnosciToolInput,
  outputSchema: DoborPojemnosciToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/dobor-pojemnosci",
  handler: async (input) => {
    const wynik = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: input.zapotrzebowanieDoboweKwh,
      dniAutonomii: input.dniAutonomii,
      sprawnoscFalownikaPct: input.sprawnoscFalownikaPct,
      dodPct: input.dodPct,
    })
    return {
      status: wynik.status,
      pojemnoscUzytecznaKwh: wynik.value.pojemnoscUzytecznaKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
