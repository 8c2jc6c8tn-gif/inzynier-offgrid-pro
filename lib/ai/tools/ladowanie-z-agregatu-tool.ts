/**
 * Narzędzie AI (9.3) dla Modułu 7 "Stress-test zimowy" — ekran „Ładowanie magazynu z agregatu” (decyzja 1A,
 * 05.10.2026). `operationType: 'read'`. Dane wejściowe WYŁĄCZNIE od usera (karty agregatu, ładowarki, magazynu);
 * model nie zgaduje — null, gdy nieznane.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateLadowanieZAgregatu } from "@/lib/core/modules/stress-test/ladowanie-z-agregatu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const n = (opis: string) => z.number().nullable().describe(opis)

export const LadowanieZAgregatuToolInput = z.object({
  mocAgregatuKw: n("Moc znamionowa (ciągła) agregatu [kW]"),
  mocLadowarkiKw: n("Maksymalna moc ładowania ładowarki/falownika z agregatu [kW]"),
  mocOdbiornikowKw: n("Moc odbiorników na linii awaryjnej podczas ładowania [kW]; 0 = brak"),
  pojemnoscKwh: n("Pojemność użyteczna magazynu [kWh]"),
  socStartPct: n("Próg SOC startu agregatu [%]"),
  socStopPct: n("Próg SOC zatrzymania agregatu [%]"),
  sprawnoscLadowaniaPct: n("Sprawność ładowania AC → magazyn wg karty ładowarki [%]"),
  zuzyciePaliwaLH: n("Zużycie paliwa wg karty agregatu przy obciążeniu z wyniku [l/h]; null gdy nieznane"),
  cenaPaliwaZlL: n("Cena paliwa [zł/l]; null gdy nieznana"),
})
export type LadowanieZAgregatuToolInputT = z.infer<typeof LadowanieZAgregatuToolInput>

export const LadowanieZAgregatuToolOutput = z.object({
  status: z.enum(STATUSY),
  mocLadowaniaKw: z.number().nullable(),
  obciazeniePct: z.number().nullable(),
  energiaDoMagazynuKwh: z.number().nullable(),
  energiaLadowaniaAcKwh: z.number().nullable(),
  czasPracyH: z.number().nullable(),
  energiaAgregatuKwh: z.number().nullable(),
  paliwoL: z.number().nullable(),
  litryNaKwh: z.number().nullable(),
  litryNaKwhMagazynu: z.number().nullable(),
  kosztZl: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type LadowanieZAgregatuToolOutputT = z.infer<typeof LadowanieZAgregatuToolOutput>

export const ladowanieZAgregatuTool: AiToolDefinition<LadowanieZAgregatuToolInputT, LadowanieZAgregatuToolOutputT> = {
  name: "policz_ladowanie_magazynu_z_agregatu",
  description: "Liczy moc ładowania magazynu z agregatu po odjęciu odbiorników linii awaryjnej, obciążenie agregatu, czas pracy na cykl SOC start→stop, paliwo i koszt cyklu; ostrzega, gdy ładowarka z odbiornikami przekracza moc agregatu (Moduł 7). Użyj, gdy user pyta, jak długo agregat ładuje magazyn, przy jakim obciążeniu pracuje albo ile paliwa zużyje cykl ładowania.",
  inputSchema: LadowanieZAgregatuToolInput,
  outputSchema: LadowanieZAgregatuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/ladowanie-z-agregatu",
  handler: async (input) => {
    const wynik = calculateLadowanieZAgregatu(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
