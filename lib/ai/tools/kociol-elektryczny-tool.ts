/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran dodatkowy "Kocioł elektryczny — porównanie kosztu z
 * pompą ciepła" (dawne 5.33). `operationType: 'read'`. Zapotrzebowanie cieplne, COP pompy (karta
 * katalogowa/pomiar) i cena energii pochodzą WYŁĄCZNIE od usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateKociolElektryczny } from "@/lib/core/modules/ogrzewanie/kociol-elektryczny/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KociolElektrycznyToolInput = z.object({
  zapotrzebowanieCieplneKwh: z.number().describe("Zapotrzebowanie na ciepło do pokrycia [kWh] — od usera"),
  copPompy: z.number().describe("COP pompy ciepła przy aktualnej temperaturze — z krzywej COP pompy lub zmierzony — od usera"),
  cenaZaKwhZl: z.number().describe("Cena energii elektrycznej [zł/kWh] — od usera"),
})
export type KociolElektrycznyToolInputT = z.infer<typeof KociolElektrycznyToolInput>

export const KociolElektrycznyToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaPompyKwh: z.number(),
  energiaKotlaKwh: z.number(),
  kosztPompyZl: z.number(),
  kosztKotlaZl: z.number(),
  oszczednoscZl: z.number(),
  mnoznikZuzycia: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KociolElektrycznyToolOutputT = z.infer<typeof KociolElektrycznyToolOutput>

export const kociolElektrycznyTool: AiToolDefinition<KociolElektrycznyToolInputT, KociolElektrycznyToolOutputT> = {
  name: "policz_koszt_kotla_elektrycznego_vs_pompa_ciepla",
  description:
    "Porównanie kosztu ogrzewania kotłem elektrycznym (COP=1, sprawność ok. 99%) vs pompą ciepła: " +
    "E_elektryczna = Q_cieplna / COP, koszt = E_elektryczna × cena_kWh. Zapotrzebowanie cieplne, COP pompy i " +
    "cena energii podaje user. Zakłada tę samą cenę energii dla obu źródeł. Użyj, gdy user pyta o opłacalność " +
    "kotła elektrycznego jako alternatywy/rezerwy dla pompy ciepła.",
  inputSchema: KociolElektrycznyToolInput,
  outputSchema: KociolElektrycznyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/kociol-elektryczny",
  handler: async (input) => {
    const wynik = calculateKociolElektryczny({
      zapotrzebowanieCieplneKwh: input.zapotrzebowanieCieplneKwh,
      copPompy: input.copPompy,
      cenaZaKwhZl: input.cenaZaKwhZl,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      energiaPompyKwh: v.energiaPompyKwh,
      energiaKotlaKwh: v.energiaKotlaKwh,
      kosztPompyZl: v.kosztPompyZl,
      kosztKotlaZl: v.kosztKotlaZl,
      oszczednoscZl: v.oszczednoscZl,
      mnoznikZuzycia: v.mnoznikZuzycia,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
