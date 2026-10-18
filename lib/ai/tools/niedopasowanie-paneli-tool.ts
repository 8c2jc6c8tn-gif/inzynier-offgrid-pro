/**
 * Narzędzie AI (9.3) dla Ekranu 17, Moduł 3 "Instalacja PV" — "Niedopasowanie mocy paneli
 * (mismatch)". `operationType: 'read'`. Moc i Imp obu paneli oraz napięcie wspólne stringu MUSZĄ
 * pochodzić od użytkownika (karty katalogowe / pomiar) — model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateNiedopasowaniePaneli } from "@/lib/core/modules/pv/niedopasowanie-paneli/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const NiedopasowaniePaneliToolInput = z.object({
  mocPanel1W: z.number().describe("Moc znamionowa panelu 1 [W]"),
  impPanel1A: z.number().describe("Prąd roboczy panelu 1 (Imp) [A]"),
  mocPanel2W: z.number().describe("Moc znamionowa panelu 2 [W]"),
  impPanel2A: z.number().describe("Prąd roboczy panelu 2 (Imp) [A]"),
  napiecieWspolneV: z.number().describe("Wspólne napięcie robocze stringu [V] — dana usera, nie zgaduj"),
})
export type NiedopasowaniePaneliToolInputT = z.infer<typeof NiedopasowaniePaneliToolInput>

export const NiedopasowaniePaneliToolOutput = z.object({
  status: z.enum(STATUSY),
  mocTeoretycznaW: z.number(),
  mocRzeczywistaW: z.number(),
  strataPct: z.number(),
  roznicaMocyPct: z.number().describe("Różnica mocy paneli [%]; >10-15% to strefa uwagi/zakazu wg źródła"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type NiedopasowaniePaneliToolOutputT = z.infer<typeof NiedopasowaniePaneliToolOutput>

export const niedopasowaniePaneliTool: AiToolDefinition<
  NiedopasowaniePaneliToolInputT,
  NiedopasowaniePaneliToolOutputT
> = {
  name: "policz_niedopasowanie_mocy_paneli",
  description:
    "Liczy stratę mocy (mismatch) przy łączeniu w szeregu dwóch paneli o różnej mocy/prądzie (Moduł 3, " +
    "Ekran 17) — w stringu prąd ogranicza najsłabszy panel. Ocenia też różnicę mocy paneli wobec progów " +
    "10-15% (uwaga/zakaz). Moc, Imp i napięcie wspólne podaje user z kart katalogowych/pomiaru — nie zgaduj. " +
    "Użyj, gdy user pyta, czy może łączyć dwa różne panele w jednym stringu.",
  inputSchema: NiedopasowaniePaneliToolInput,
  outputSchema: NiedopasowaniePaneliToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/niedopasowanie-paneli",
  handler: async (input) => {
    const wynik = calculateNiedopasowaniePaneli(input)
    return {
      status: wynik.status,
      mocTeoretycznaW: wynik.value.mocTeoretycznaW,
      mocRzeczywistaW: wynik.value.mocRzeczywistaW,
      strataPct: wynik.value.strataPct,
      roznicaMocyPct: wynik.value.roznicaMocyPct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
