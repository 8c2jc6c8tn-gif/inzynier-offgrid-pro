/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B4 "Balansery zewnętrzne" (kwasowo-ołowiowa).
 * `operationType: 'read'`. Liczba akumulatorów w szeregu i posiadanie balansera pochodzą
 * wyłącznie od usera (skład jego instalacji) — nie zgaduj.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBalanseryZewnetrzneOlow } from "@/lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BalanseryZewnetrzneOlowToolInput = z.object({
  iloscAkumulatorowWSzeregu: z.number().describe("Liczba akumulatorów kwasowo-ołowiowych w szeregu — tylko od usera"),
  posiadaBalanserZewnetrzny: z.boolean().describe("Czy user ma już zamontowany balanser zewnętrzny"),
})
export type BalanseryZewnetrzneOlowToolInputT = z.infer<typeof BalanseryZewnetrzneOlowToolInput>

export const BalanseryZewnetrzneOlowToolOutput = z.object({
  status: z.enum(STATUSY),
  iloscAkumulatorowWSzeregu: z.number(),
  wymaganyBalanser: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BalanseryZewnetrzneOlowToolOutputT = z.infer<typeof BalanseryZewnetrzneOlowToolOutput>

export const balanseryZewnetrzneOlowTool: AiToolDefinition<
  BalanseryZewnetrzneOlowToolInputT,
  BalanseryZewnetrzneOlowToolOutputT
> = {
  name: "sprawdz_balansery_zewnetrzne_olow",
  description:
    "Sprawdza konieczność balansera zewnętrznego dla akumulatorów kwasowo-ołowiowych w szeregu (Moduł 11, " +
    "Ekran B4) — akumulatory kwasowe rozjeżdżają się napięciowo z czasem (w odróżnieniu od LiFePO4 z aktywnym " +
    "BMS) i wymagają balansera równoległego, gdy jest ich ≥2 w szeregu. Liczba akumulatorów i posiadanie " +
    "balansera pochodzą od usera. Użyj, gdy user pyta, czy jego szereg akumulatorów kwasowych potrzebuje " +
    "balansera.",
  inputSchema: BalanseryZewnetrzneOlowToolInput,
  outputSchema: BalanseryZewnetrzneOlowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/balansery-zewnetrzne-olow",
  handler: async (input) => {
    const wynik = calculateBalanseryZewnetrzneOlow({
      iloscAkumulatorowWSzeregu: input.iloscAkumulatorowWSzeregu,
      posiadaBalanserZewnetrzny: input.posiadaBalanserZewnetrzny,
    })
    return {
      status: wynik.status,
      iloscAkumulatorowWSzeregu: wynik.value.iloscAkumulatorowWSzeregu,
      wymaganyBalanser: wynik.value.wymaganyBalanser,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
