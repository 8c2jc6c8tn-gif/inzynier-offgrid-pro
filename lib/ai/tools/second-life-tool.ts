/**
 * Narzędzie AI (9.3) dla Ekranu 17, Moduł 4 "Magazyn energii / baterie" — "Analiza Second-Life
 * (baterie z EV)". `operationType: 'read'`. Pojemność deklarowana, cena, metoda szacunku i
 * wiek/przebieg MUSZĄ pochodzić z oferty/oględzin usera — nie zgaduj tempa degradacji.
 */
import { z } from "zod"
import { calculateSecondLife } from "@/lib/core/modules/baterie/second-life/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SecondLifeToolInput = z.object({
  pojemnoscDeklarowanaKwh: z.number().describe("Deklarowana pojemność baterii z EV [kWh] — z oferty"),
  cenaZakupuZl: z.number().describe("Cena zakupu [zł] — z oferty"),
  metodaSzacunku: z.enum(["wiek", "przebieg"]).describe("Metoda szacunku SoH — wybór usera wg dostępnych danych"),
  wiekLata: z.number().describe("Wiek baterii [lata] — używane tylko gdy metodaSzacunku = 'wiek', tylko od usera"),
  przebiegKm: z.number().describe("Przebieg pojazdu [km] — używane tylko gdy metodaSzacunku = 'przebieg', tylko od usera"),
  cenaNowejLiFePO4ZlZaKwh: z.number().nullable().describe("Cena nowej baterii LiFePO4 [zł/kWh] do porównania — null pomija porównanie, nie zgaduj tej ceny"),
})
export type SecondLifeToolInputT = z.infer<typeof SecondLifeToolInput>

export const SecondLifeToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  sohSzacowanyPct: z.number(),
  pojemnoscUzytecznaKwh: z.number(),
  kosztZaKwh: z.number(),
  tansza: z.boolean().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SecondLifeToolOutputT = z.infer<typeof SecondLifeToolOutput>

export const secondLifeTool: AiToolDefinition<SecondLifeToolInputT, SecondLifeToolOutputT> = {
  name: "policz_oplacalnosc_baterii_second_life",
  description:
    "Szacuje SoH baterii z EV (na podstawie wieku LUB przebiegu, wg wyboru usera), pojemność użyteczną i " +
    "koszt za kWh, opcjonalnie porównując z ceną nowej baterii LiFePO4 (Moduł 4, Ekran 17). Pojemność " +
    "deklarowana, cena, metoda i wiek/przebieg MUSZĄ pochodzić od usera z oferty/oględzin — nie zgaduj tempa " +
    "degradacji. Użyj, gdy user pyta, czy opłaca się kupić baterię second-life z EV.",
  inputSchema: SecondLifeToolInput,
  outputSchema: SecondLifeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/second-life",
  handler: async (input) => {
    const wynik = calculateSecondLife({
      pojemnoscDeklarowanaKwh: input.pojemnoscDeklarowanaKwh,
      cenaZakupuZl: input.cenaZakupuZl,
      metodaSzacunku: input.metodaSzacunku,
      wiekLata: input.wiekLata,
      przebiegKm: input.przebiegKm,
      cenaNowejLiFePO4ZlZaKwh: input.cenaNowejLiFePO4ZlZaKwh,
    })
    return {
      status: wynik.status,
      sohSzacowanyPct: wynik.value.sohSzacowanyPct,
      pojemnoscUzytecznaKwh: wynik.value.pojemnoscUzytecznaKwh,
      kosztZaKwh: wynik.value.kosztZaKwh,
      tansza: wynik.value.tansza,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
