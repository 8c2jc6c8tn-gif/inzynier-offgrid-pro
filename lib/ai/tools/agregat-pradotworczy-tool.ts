/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 17 "Agregat prądotwórczy – definicja i logika pracy".
 * `operationType: 'read'`. Deficyt energetyczny, moc agregatu, zużycie paliwa, cena paliwa i
 * obecność wyjścia sterującego BMS pochodzą WYŁĄCZNIE od usera. Optymalne obciążenie agregatu
 * (70-80%, górna granica) jest stałą projektu, nie wymyśloną tu wartością.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAgregatPradotworczy } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"
import { MiejsceAgregatuSchema, PodlaczenieAgregatuSchema } from "./agregat-bezpieczenstwo-schema"

export const AgregatPradotworczyToolInput = z.object({
  deficytKwh: z.number().describe("Deficyt energetyczny w najgorszym miesiącu roku [kWh] — od usera"),
  mocAgregatuKw: z.number().describe("Moc znamionowa agregatu [kW] — od usera"),
  sredniZuzycieLH: z.number().describe("Średnie zużycie paliwa przy optymalnym obciążeniu [l/h] — od usera, karta katalogowa"),
  cenaZaLitrZl: z.number().describe("Cena paliwa [zł/l] — od usera"),
  maWyjscieSterujaceBms: z.boolean().describe("Czy BMS ma wyjście sterujące do automatycznego startu agregatu"),
  miejsceAgregatu: MiejsceAgregatuSchema,
  podlaczenieAgregatu: PodlaczenieAgregatuSchema,
})
export type AgregatPradotworczyToolInputT = z.infer<typeof AgregatPradotworczyToolInput>

export const AgregatPradotworczyToolOutput = z.object({
  status: z.enum(STATUSY),
  godzinyPracy: z.number(),
  zuzyciePaliwaLitry: z.number(),
  kosztZl: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AgregatPradotworczyToolOutputT = z.infer<typeof AgregatPradotworczyToolOutput>

export const agregatPradotworczyTool: AiToolDefinition<
  AgregatPradotworczyToolInputT,
  AgregatPradotworczyToolOutputT
> = {
  name: "policz_godziny_pracy_agregatu",
  description:
    "Liczy godziny pracy agregatu prądotwórczego (przy optymalnym obciążeniu), zużycie paliwa [l] i koszt [zł] " +
    "potrzebne do pokrycia podanego deficytu energetycznego — Moduł 2, Ekran 17. Deficyt, moc agregatu, zużycie " +
    "paliwa i cena podaje user — nie zgaduj. Użyj, gdy user pyta, ile paliwa/godzin/kosztów wymaga agregat do " +
    "pokrycia deficytu w najgorszym miesiącu.",
  inputSchema: AgregatPradotworczyToolInput,
  outputSchema: AgregatPradotworczyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/agregat-pradotworczy",
  handler: async (input) => {
    const wynik = calculateAgregatPradotworczy({
      deficytKwh: input.deficytKwh,
      mocAgregatuKw: input.mocAgregatuKw,
      sredniZuzycieLH: input.sredniZuzycieLH,
      cenaZaLitrZl: input.cenaZaLitrZl,
      maWyjscieSterujaceBms: input.maWyjscieSterujaceBms,
      miejsceAgregatu: input.miejsceAgregatu ?? null,
      podlaczenieAgregatu: input.podlaczenieAgregatu ?? null,
    })
    return {
      status: wynik.status,
      godzinyPracy: wynik.value.godzinyPracy,
      zuzyciePaliwaLitry: wynik.value.zuzyciePaliwaLitry,
      kosztZl: wynik.value.kosztZl,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
