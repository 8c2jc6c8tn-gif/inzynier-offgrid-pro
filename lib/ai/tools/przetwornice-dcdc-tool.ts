/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 11 "Przetwornice DC/DC". `operationType: 'read'`.
 * Zapotrzebowanie urządzenia, sposób zasilania i sprawność przetwornicy pochodzą WYŁĄCZNIE od
 * usera (~90-95% typowo wg źródła, ale nie domyślna do zgadywania).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePrzetworniceDcdc } from "@/lib/core/modules/zapotrzebowanie/przetwornice-dcdc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrzetworniceDcdcToolInput = z.object({
  zapotrzebowanieUrzadzeniaW: z.number().describe("Zapotrzebowanie mocy urządzenia niskonapięciowego [W] — od usera"),
  zasilanieBezposrednie: z.boolean().describe("Czy urządzenie zasilane jest bezpośrednio z magistrali (bez przetwornicy)"),
  sprawnoscPrzetwornicyPct: z
    .number()
    .optional()
    .describe("Sprawność przetwornicy DC/DC [%] — od usera, wymagana gdy zasilanieBezposrednie=false, nie zgaduj"),
})
export type PrzetworniceDcdcToolInputT = z.infer<typeof PrzetworniceDcdcToolInput>

export const PrzetworniceDcdcToolOutput = z.object({
  status: z.enum(STATUSY),
  zapotrzebowanieRealneW: z.number(),
  strataW: z.number(),
  strataPct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrzetworniceDcdcToolOutputT = z.infer<typeof PrzetworniceDcdcToolOutput>

export const przetworniceDcdcTool: AiToolDefinition<PrzetworniceDcdcToolInputT, PrzetworniceDcdcToolOutputT> = {
  name: "policz_strate_przetwornicy_dcdc",
  description:
    "Liczy realne zapotrzebowanie mocy [W] i stratę na konwersji DC/DC (P_realne = P_urządzenia / η) — Moduł 2, " +
    "Ekran 11. Sprawność przetwornicy podaje user — nie zgaduj. Jeśli urządzenie zasilane jest bezpośrednio z " +
    "magistrali, strata wynosi 0. Użyj, gdy user pyta o dodatkowe zapotrzebowanie wynikające z przetwornic DC/DC.",
  inputSchema: PrzetworniceDcdcToolInput,
  outputSchema: PrzetworniceDcdcToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/przetwornice-dcdc",
  handler: async (input) => {
    const wynik = calculatePrzetworniceDcdc({
      zapotrzebowanieUrzadzeniaW: input.zapotrzebowanieUrzadzeniaW,
      zasilanieBezposrednie: input.zasilanieBezposrednie,
      sprawnoscPrzetwornicyPct: input.sprawnoscPrzetwornicyPct ?? 0,
    })
    return {
      status: wynik.status,
      zapotrzebowanieRealneW: wynik.value.zapotrzebowanieRealneW,
      strataW: wynik.value.strataW,
      strataPct: wynik.value.strataPct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
