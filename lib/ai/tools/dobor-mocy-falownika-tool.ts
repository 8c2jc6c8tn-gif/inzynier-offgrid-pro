/**
 * Narzędzie AI (9.3) dla Ekranu 7, Moduł 5 — "Dobór mocy falownika". `operationType: 'read'`.
 * Moc szczytowa odbiorników i współczynnik jednoczesności MUSZĄ pochodzić od użytkownika/Modułu 2
 * (bilans mocy) — model nigdy ich nie zgaduje. Prądy rozruchowe silników NIE są liczone liczbowo
 * przez ten kalkulator (źródło nie podaje wzoru wiążącego typ silnika z mnożnikiem).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDoborMocyFalownika } from "@/lib/core/modules/okablowanie/dobor-mocy-falownika/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborMocyFalownikaToolInput = z.object({
  mocSzczytowaW: z.number().describe("Moc szczytowa odbiorników [W], z Modułu 2 (bilans mocy). 0 = jeszcze nie podano"),
  mocPozornaVa: z.number().describe("Moc pozorna odbiorników [VA], opcjonalnie. 0 = nie podano"),
  wspolczynnikJednoczesnosci: z
    .number()
    .describe("Współczynnik jednoczesności — domyślnie 0,7 wg źródła, edytowalny przez usera. 0 = jeszcze nie podano"),
  mocFalownikaWybranaW: z.number().describe("Moc rozważanego/posiadanego falownika [W], opcjonalnie do sprawdzenia. 0 = nie podano"),
})

export type DoborMocyFalownikaToolInputT = z.infer<typeof DoborMocyFalownikaToolInput>

export const DoborMocyFalownikaToolOutput = z.object({
  mocFalownikaZalecanaW: z.number(),
  mocFalownikaZalecanaVa: z.number(),
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type DoborMocyFalownikaToolOutputT = z.infer<typeof DoborMocyFalownikaToolOutput>

export const doborMocyFalownikaTool: AiToolDefinition<DoborMocyFalownikaToolInputT, DoborMocyFalownikaToolOutputT> = {
  name: "policz_dobor_mocy_falownika",
  description:
    "Liczy zalecaną moc falownika (P_szczytowa / współczynnik_jednoczesności) i opcjonalnie sprawdza, " +
    "czy wybrany falownik jest wystarczający. Współczynnik jednoczesności działa jako odwrotny margines " +
    "na rozruchy silników (szczyt = max 70% mocy ciągłej falownika), nie jako redukcja sumy odbiorników. " +
    "Użyj, gdy user pyta o dobór mocy falownika w systemie off-grid.",
  inputSchema: DoborMocyFalownikaToolInput,
  outputSchema: DoborMocyFalownikaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/dobor-mocy-falownika",
  handler: async (input) => {
    const wynik = calculateDoborMocyFalownika(input)
    return {
      mocFalownikaZalecanaW: wynik.value.mocFalownikaZalecanaW,
      mocFalownikaZalecanaVa: wynik.value.mocFalownikaZalecanaVa,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
