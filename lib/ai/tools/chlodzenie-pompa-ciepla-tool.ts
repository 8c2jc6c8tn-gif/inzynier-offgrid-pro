/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2C — chłodzenie latem pompą ciepła (dawne 5.29, 5.47, 5.51, energia z 5.53).
 * `operationType: 'read'`. Ciepło do usunięcia, EER/COP, moce i temperatury pochodzą od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateChlodzeniePompaCiepla } from "@/lib/core/modules/ogrzewanie/chlodzenie-pompa-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ChlodzeniePompaCieplaToolInput = z.object({
  chlodDobaKwh: z.number().describe("Ciepło do usunięcia z domu na dobę latem [kWh]"),
  eerPompy: z.number().describe("EER pompy ciepła w trybie chłodzenia"),
  eerKlimatyzatora: z.number().describe("EER klimatyzatora do porównania; 0 = bez porównania"),
  mocObiegowejW: z.number().describe("Free cooling: moc pompy obiegowej dolnego źródła [W]; 0 = bez free coolingu"),
  godzinyFreeCoolingH: z.number().describe("Free cooling: godziny pracy pompy obiegowej na dobę [h]"),
  tZasilaniaC: z.number().nullable().describe("Temperatura zasilania chłodzenia [°C]; null = nie sprawdzaj rosy"),
  tPomieszczeniaC: z.number().nullable().describe("Temperatura w pomieszczeniu [°C]; null = nie podano"),
  wilgotnoscPct: z.number().describe("Wilgotność względna w pomieszczeniu [%]; 0 = nie podano"),
  cieploSezonKwh: z.number().describe("Porównanie grzania: ciepło na sezon [kWh]; 0 = bez porównania"),
  copPompy: z.number().describe("COP pompy ciepła w grzaniu; 0 = nie podano"),
  copKlimatyzatora: z.number().describe("COP klimatyzatora w grzaniu; 0 = nie podano"),
})
export type ChlodzeniePompaCieplaToolInputT = z.infer<typeof ChlodzeniePompaCieplaToolInput>

export const ChlodzeniePompaCieplaToolOutput = z.object({
  status: z.enum(STATUSY),
  pradPompyKwh: z.number(),
  pradKlimatyzatoraKwh: z.number().nullable(),
  pradFreeCoolingKwh: z.number().nullable(),
  punktRosyC: z.number().nullable(),
  grzaniePompaKwh: z.number().nullable(),
  grzanieKlimatyzatorKwh: z.number().nullable(),
  grzanieOszczednoscPct: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ChlodzeniePompaCieplaToolOutputT = z.infer<typeof ChlodzeniePompaCieplaToolOutput>

export const chlodzeniePompaCieplaTool: AiToolDefinition<ChlodzeniePompaCieplaToolInputT, ChlodzeniePompaCieplaToolOutputT> = {
  name: "policz_chlodzenie_latem_pompa_ciepla",
  description:
    "Prąd na chłodzenie domu latem pompą ciepła (Q/EER) w porównaniu z klimatyzatorem i z samym free coolingiem z " +
    "dolnego źródła, punkt rosy w pomieszczeniu względem temperatury zasilania chłodzenia oraz porównanie grzania " +
    "pompą i klimatyzatorem w sezonie. Użyj, gdy user pyta, czy chłodzić pompą ciepła czy klimatyzatorem, ile prądu " +
    "zje chłodzenie latem, czy free cooling z odwiertu się opłaca albo czy chłodzona podłoga nie będzie się pocić.",
  inputSchema: ChlodzeniePompaCieplaToolInput,
  outputSchema: ChlodzeniePompaCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/chlodzenie-pompa-ciepla",
  handler: async (input) => {
    const wynik = calculateChlodzeniePompaCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
