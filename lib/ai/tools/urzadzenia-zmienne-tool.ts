/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 3 "Urządzenia zmienne + płyta indukcyjna + klasa
 * energetyczna". `operationType: 'read'`. Lista urządzeń (moc, czas pracy, klasa, zaznaczenie)
 * oraz dane płyty indukcyjnej pochodzą WYŁĄCZNIE od usera — nigdy nie zgaduj czasu pracy.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateUrzadzeniaZmienne } from "@/lib/core/modules/zapotrzebowanie/urzadzenia-zmienne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const UrzadzeniaZmienneToolInput = z.object({
  urzadzenia: z
    .array(
      z.object({
        id: z.string().describe("Identyfikator urządzenia, np. 'pralka', 'lodowka-230v'"),
        wybrane: z.boolean().describe("Czy urządzenie jest dziś wliczane do bilansu"),
        mocW: z.number().describe("Moc urządzenia [W] — od usera"),
        czasMin: z.number().describe("Dobowy czas pracy [min] — od usera, nie zgaduj"),
        klasa: z
          .enum(["nowoczesne", "standardowe", "stare"])
          .describe("Klasa energetyczna: mnożnik 0,8/1,0/1,4 wg źródła"),
      }),
    )
    .describe("Lista urządzeń zmiennych z zaznaczeniem, mocą, czasem pracy i klasą — od usera"),
  plytaIndukcyjnaWybrana: z.boolean().describe("Czy płyta indukcyjna jest wliczana do bilansu"),
  plytaIndukcyjnaMocW: z.number().describe("Moc płyty indukcyjnej [W] — od usera (przykład źródła: ~7000 W)"),
  plytaIndukcyjnaCzasMin: z.number().describe("Dobowy czas pracy płyty indukcyjnej [min] — od usera"),
})
export type UrzadzeniaZmienneToolInputT = z.infer<typeof UrzadzeniaZmienneToolInput>

export const UrzadzeniaZmienneToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaWh: z.number(),
  plytaIndukcyjnaEnergiaWh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type UrzadzeniaZmienneToolOutputT = z.infer<typeof UrzadzeniaZmienneToolOutput>

export const urzadzeniaZmienneTool: AiToolDefinition<UrzadzeniaZmienneToolInputT, UrzadzeniaZmienneToolOutputT> = {
  name: "policz_energie_urzadzen_zmiennych",
  description:
    "Liczy dobową energię [Wh] urządzeń zmiennych (z mnożnikiem wg klasy energetycznej) oraz osobno energię " +
    "płyty indukcyjnej — Moduł 2, Ekran 3. Moc, czas pracy i klasa energetyczna pochodzą od usera — nie zgaduj " +
    "czasu pracy żadnego urządzenia. Użyj, gdy user pyta o zużycie energii sprzętu AGD/RTV.",
  inputSchema: UrzadzeniaZmienneToolInput,
  outputSchema: UrzadzeniaZmienneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/urzadzenia-zmienne",
  handler: async (input) => {
    const wynik = calculateUrzadzeniaZmienne({
      urzadzenia: input.urzadzenia,
      plytaIndukcyjnaWybrana: input.plytaIndukcyjnaWybrana,
      plytaIndukcyjnaMocW: input.plytaIndukcyjnaMocW,
      plytaIndukcyjnaCzasMin: input.plytaIndukcyjnaCzasMin,
    })
    return {
      status: wynik.status,
      energiaWh: wynik.value.energiaWh,
      plytaIndukcyjnaEnergiaWh: wynik.value.plytaIndukcyjnaEnergiaWh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
