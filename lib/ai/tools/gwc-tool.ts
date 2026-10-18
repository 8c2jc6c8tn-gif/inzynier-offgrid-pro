/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 4 "Gruntowy wymiennik ciepła (GWC)" (dawne 5.4).
 * `operationType: 'read'`. Przyrost temperatury w GWC MUSI pochodzić od usera (karta/pomiar, Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateGwc } from "@/lib/core/modules/ogrzewanie/gwc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const GwcToolInput = z.object({
  strumienM3H: z.number().describe("Strumień powietrza przez GWC [m³/h]"),
  przyrostTempK: z.number().describe("Zimowy przyrost temperatury powietrza w GWC [K] — karta producenta albo pomiar"),
  godzinyPracyH: z.number().describe("Godziny pracy GWC na dobę [h]"),
  sprawnoscRekuperatoraPct: z.number().describe("Sprawność rekuperatora za GWC [%]; 0 = brak rekuperatora"),
  zapotrzebowanieDobaKwh: z.number().describe("Dobowe zapotrzebowanie na ciepło [kWh]; 0 = bez udziału"),
  cop: z.number().describe("COP ogrzewania; 0 = bez przeliczenia na prąd"),
})
export type GwcToolInputT = z.infer<typeof GwcToolInput>

export const GwcToolOutput = z.object({
  status: z.enum(STATUSY),
  mocCieplnaW: z.number(),
  oszczednoscDobaKwh: z.number(),
  udzialPct: z.number().nullable(),
  oszczednoscPraduKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type GwcToolOutputT = z.infer<typeof GwcToolOutput>

export const gwcTool: AiToolDefinition<GwcToolInputT, GwcToolOutputT> = {
  name: "policz_zysk_gwc",
  description:
    "Zysk z gruntowego wymiennika ciepła (GWC) przy znanym zimowym przyroście temperatury powietrza: moc " +
    "podgrzania, ciepło zaoszczędzone na dobę (za rekuperatorem tylko (1 − sprawność) zysku), udział w " +
    "zapotrzebowaniu i mniej prądu przy danym COP. Użyj, gdy user pyta, ile daje GWC, czy GWC ma sens za " +
    "rekuperatorem albo ile prądu na ogrzewanie oszczędzi wstępne podgrzanie powietrza w gruncie.",
  inputSchema: GwcToolInput,
  outputSchema: GwcToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/gwc",
  handler: async (input) => {
    const wynik = calculateGwc(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
