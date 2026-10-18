/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 7 "Dni autonomii". `operationType: 'read'`. Dni
 * autonomii pochodzą WYŁĄCZNIE od usera (suwak 1/2/3/5/7 wg źródła). Trzy pola opcjonalne
 * (zapotrzebowanie dobowe, sprawność falownika, DoD) służą tylko do podglądu szacunkowego
 * wpływu na wielkość magazynu (wzorzec "echo" Modułu 4/Ekran 1) — również od usera, nie zgaduj.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDniAutonomii } from "@/lib/core/modules/zapotrzebowanie/dni-autonomii/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DniAutonomiiToolInput = z.object({
  dniAutonomii: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(5), z.literal(7)])
    .describe("Dni autonomii — suwak dyskretny ze źródła — od usera"),
  zapotrzebowanieDoboweKwh: z.number().optional().describe("Opcjonalnie: zapotrzebowanie dobowe [kWh] do podglądu wpływu na magazyn"),
  sprawnoscFalownikaPct: z.number().optional().describe("Opcjonalnie: sprawność falownika [%], 0-100"),
  dodPct: z.number().optional().describe("Opcjonalnie: DoD [%], 0-100"),
})
export type DniAutonomiiToolInputT = z.infer<typeof DniAutonomiiToolInput>

export const DniAutonomiiToolOutput = z.object({
  status: z.enum(STATUSY),
  dniAutonomii: z.number(),
  pojemnoscUzytecznaSzacowanaKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DniAutonomiiToolOutputT = z.infer<typeof DniAutonomiiToolOutput>

export const dniAutonomiiTool: AiToolDefinition<DniAutonomiiToolInputT, DniAutonomiiToolOutputT> = {
  name: "policz_dni_autonomii",
  description:
    "Zapisuje wybrane dni autonomii i opcjonalnie liczy szacunkową pojemność użyteczną magazynu, jaką by to " +
    "dało (echo wzoru z Moduł 4/Ekran 1) — Moduł 2, Ekran 7. Dni autonomii oraz opcjonalne dane magazynu " +
    "podaje user — nie zgaduj. Użyj, gdy user pyta o wpływ liczby dni autonomii na wielkość banku baterii.",
  inputSchema: DniAutonomiiToolInput,
  outputSchema: DniAutonomiiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/dni-autonomii",
  handler: async (input) => {
    const wynik = calculateDniAutonomii({
      dniAutonomii: input.dniAutonomii,
      zapotrzebowanieDoboweKwh: input.zapotrzebowanieDoboweKwh ?? 0,
      sprawnoscFalownikaPct: input.sprawnoscFalownikaPct ?? 0,
      dodPct: input.dodPct ?? 0,
    })
    return {
      status: wynik.status,
      dniAutonomii: wynik.value.dniAutonomii,
      pojemnoscUzytecznaSzacowanaKwh: wynik.value.pojemnoscUzytecznaSzacowanaKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
