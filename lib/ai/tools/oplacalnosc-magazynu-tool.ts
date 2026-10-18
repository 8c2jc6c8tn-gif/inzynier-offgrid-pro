/**
 * Narzędzie AI (9.3) dla Ekranu 23, Moduł 4 "Magazyn energii / baterie" — "Analiza opłacalności
 * magazynu (True Cost of Storage)". `operationType: 'read'`. Cena baterii, pojemność, liczba
 * cykli i sprawność MUSZĄ pochodzić z karty katalogowej/oferty — koszt alternatywy jest
 * opcjonalny (porównanie pominięte, gdy nie podany).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOplacalnoscMagazynu } from "@/lib/core/modules/baterie/oplacalnosc-magazynu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OplacalnoscMagazynuToolInput = z.object({
  cenaBateriiZl: z.number().describe("Cena zakupu baterii [zł] — z oferty/faktury"),
  pojemnoscUzytecznaKwh: z.number().describe("Pojemność użyteczna [kWh]"),
  liczbaCykli: z.number().describe("Liczba cykli życia przy wybranym DoD (z karty katalogowej lub Ekranu 30 — Porównanie technologii)"),
  sprawnoscPct: z.number().describe("Sprawność magazynu [%]"),
  kosztAlternatywyZlZaKwh: z.number().nullable().describe("Koszt alternatywy (agregat/sieć) [zł/kWh] — null pomija porównanie, nie zgaduj tej ceny"),
})
export type OplacalnoscMagazynuToolInputT = z.infer<typeof OplacalnoscMagazynuToolInput>

export const OplacalnoscMagazynuToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaCalkowitaZyciaKwh: z.number(),
  kosztZaKwh: z.number(),
  tansze: z.boolean().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OplacalnoscMagazynuToolOutputT = z.infer<typeof OplacalnoscMagazynuToolOutput>

export const oplacalnoscMagazynuTool: AiToolDefinition<OplacalnoscMagazynuToolInputT, OplacalnoscMagazynuToolOutputT> = {
  name: "policz_oplacalnosc_magazynu",
  description:
    "Liczy prawdziwy koszt energii oddanej przez magazyn w całym cyklu życia (True Cost of Storage) — energia " +
    "całkowita = pojemność × cykle × DoD, koszt za kWh, i opcjonalnie porównuje z kosztem alternatywy " +
    "(Moduł 4, Ekran 23). Cena baterii, pojemność, liczba cykli i sprawność MUSZĄ pochodzić z karty " +
    "katalogowej/oferty — nie zgaduj. Użyj, gdy user pyta, czy magazyn energii się opłaca.",
  inputSchema: OplacalnoscMagazynuToolInput,
  outputSchema: OplacalnoscMagazynuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/oplacalnosc-magazynu",
  handler: async (input) => {
    const wynik = calculateOplacalnoscMagazynu({
      cenaBateriiZl: input.cenaBateriiZl,
      pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
      liczbaCykli: input.liczbaCykli,
      sprawnoscPct: input.sprawnoscPct,
      kosztAlternatywyZlZaKwh: input.kosztAlternatywyZlZaKwh,
    })
    return {
      status: wynik.status,
      energiaCalkowitaZyciaKwh: wynik.value.energiaCalkowitaZyciaKwh,
      kosztZaKwh: wynik.value.kosztZaKwh,
      tansze: wynik.value.tansze,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
