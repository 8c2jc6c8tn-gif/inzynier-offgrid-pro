/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 15 "Kategorie specjalne — warsztat/gospodarstwo/
 * oświetlenie terenowe". `operationType: 'read'`. Kategoria i lista pozycji (nazwa, moc, czas)
 * pochodzą WYŁĄCZNIE od usera — źródło nie podaje domyślnych mocy dla żadnej kategorii.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateKategorieSpecjalne } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KategorieSpecjalneToolInput = z.object({
  kategoria: z.enum(["warsztat", "gospodarstwo", "oswietlenie-terenowe"]).describe("Kategoria specjalna wybrana przez usera"),
  pozycje: z
    .array(
      z.object({
        id: z.string().describe("Identyfikator pozycji"),
        nazwa: z.string().describe("Nazwa urządzenia — od usera"),
        mocW: z.number().describe("Moc urządzenia [W] — od usera, brak domyślnych w źródle"),
        czasMin: z.number().describe("Dobowy czas pracy [min] — od usera"),
      }),
    )
    .describe("Lista urządzeń przypisanych do kategorii — cała lista jest ręcznym wpisem usera"),
})
export type KategorieSpecjalneToolInputT = z.infer<typeof KategorieSpecjalneToolInput>

export const KategorieSpecjalneToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaWh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KategorieSpecjalneToolOutputT = z.infer<typeof KategorieSpecjalneToolOutput>

export const kategorieSpecjalneTool: AiToolDefinition<KategorieSpecjalneToolInputT, KategorieSpecjalneToolOutputT> = {
  name: "policz_energie_kategorii_specjalnej",
  description:
    "Liczy dobową energię [Wh] listy urządzeń przypisanych do kategorii specjalnej (warsztat/gospodarstwo/" +
    "oświetlenie terenowe), E = Σ P×t — Moduł 2, Ekran 15. Lista urządzeń, ich moc i czas pracy podaje user w " +
    "całości — źródło nie podaje żadnych domyślnych mocy, nie zgaduj. Użyj, gdy user pyta o zapotrzebowanie " +
    "warsztatu/gospodarstwa/oświetlenia terenowego.",
  inputSchema: KategorieSpecjalneToolInput,
  outputSchema: KategorieSpecjalneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/kategorie-specjalne",
  handler: async (input) => {
    const wynik = calculateKategorieSpecjalne({ kategoria: input.kategoria, pozycje: input.pozycje })
    return {
      status: wynik.status,
      energiaWh: wynik.value.energiaWh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
