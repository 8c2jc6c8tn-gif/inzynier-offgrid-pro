/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 32 "Ile dni pracy bez
 * słońca — mały zestaw". `operationType: 'read'`. Pojemność, napięcie, DoD, sprawność i zużycie
 * dobowe MUSZĄ pochodzić od usera — DoD zależy od chemii akumulatora, sprawność od tego, czy są
 * przetwornice; model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { calculateDniBezSlonca } from "@/lib/core/modules/kalkulator-mobilny/dni-bez-slonca/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DniBezSloncaToolInput = z.object({
  pojemnoscAh: z.number().describe("Pojemność znamionowa akumulatora [Ah] — od usera, z tabliczki"),
  napiecieV: z.number().describe("Napięcie akumulatora [V], np. 12 — od usera"),
  dodPct: z
    .number()
    .describe("Dopuszczalna głębokość rozładowania DoD [%] — od usera (zależy od chemii, np. LiFePO4 vs AGM), nie zgaduj"),
  sprawnoscPct: z
    .number()
    .describe("Sprawność przetwornicy/falownika [%]; 100 gdy odbiorniki DC zasilane wprost z akumulatora — od usera"),
  zuzycieDoboweWh: z.number().describe("Zużycie energii na dobę [Wh] — od usera"),
})
export type DniBezSloncaToolInputT = z.infer<typeof DniBezSloncaToolInput>

export const DniBezSloncaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  dni: z.number().describe("Liczba dni pracy bez doładowania (ułamkowa)"),
  pelneDoby: z.number().describe("Pełne doby pracy"),
  energiaDostepnaWh: z.number().describe("Energia realnie dostępna z akumulatora [Wh] = C × U × DoD × η"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DniBezSloncaToolOutputT = z.infer<typeof DniBezSloncaToolOutput>

export const dniBezSloncaTool: AiToolDefinition<DniBezSloncaToolInputT, DniBezSloncaToolOutputT> = {
  name: "policz_dni_bez_slonca",
  description:
    "Liczy, ile dni mały zestaw (kamper, działka, kemping — Moduł 12) wytrzyma na akumulatorze bez żadnego " +
    "doładowania: d = C_Ah × U × DoD × η / zużycie dobowe. Ten sam wzór co dobór pojemności baterii (Moduł 4), " +
    "rozwiązany względem dni — dla akumulatora, który user już ma. Bez korekty temperatury (zimą realnie mniej). " +
    "Użyj, gdy user pyta, na ile dni pochmurnej pogody starczy mu akumulator.",
  inputSchema: DniBezSloncaToolInput,
  outputSchema: DniBezSloncaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/dni-bez-slonca",
  handler: async (input) => {
    const wynik = calculateDniBezSlonca(input)
    return {
      status: wynik.status,
      dni: wynik.value.dni,
      pelneDoby: wynik.value.pelneDoby,
      energiaDostepnaWh: wynik.value.energiaDostepnaWh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
