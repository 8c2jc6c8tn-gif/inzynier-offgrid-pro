/**
 * Narzędzie AI (9.3) dla Ekranu 4, Moduł 7 "Stress-test zimowy" — "Blackout" (dawne 6.4). `operationType: 'read'`.
 * Pojemność, SoC, sprawność i zużycie w mrozie od usera; model nie zgaduje (null, gdy nieznane).
 */
import { z } from "zod"
import { calculateBlackout } from "@/lib/core/modules/stress-test/blackout/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const liczbaLubNull = (opis: string) => z.number().nullable().describe(opis)

export const BlackoutToolInput = z.object({
  pojemnoscKwh: liczbaLubNull("Pojemność znamionowa baterii [kWh]"),
  socStartPct: liczbaLubNull("SoC na początku scenariusza [%]"),
  socMinPct: liczbaLubNull("Krytyczne minimum SoC [%]"),
  sprawnoscFalownikaPct: liczbaLubNull("Sprawność falownika [%]"),
  zuzycieDoboweKwh: liczbaLubNull("Zużycie dobowe w mrozie [kWh/dobę]"),
  dniScenariusza: liczbaLubNull("Długość scenariusza bez słońca [dni], źródło: 10–14"),
  agregatKwhDoba: liczbaLubNull("Energia z agregatu na dobę [kWh]; null = bez agregatu"),
})
export type BlackoutToolInputT = z.infer<typeof BlackoutToolInput>

export const BlackoutToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  energiaDostepnaKwh: z.number().nullable(),
  deficytDobowyKwh: z.number().nullable(),
  dniPrzetrwania: z.number().nullable(),
  dzienAwarii: z.number().nullable(),
  dodatkowaPojemnoscKwh: z.number().nullable(),
  redukcjaZuzyciaPct: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BlackoutToolOutputT = z.infer<typeof BlackoutToolOutput>

export const blackoutTool: AiToolDefinition<BlackoutToolInputT, BlackoutToolOutputT> = {
  name: "symuluj_blackout_zimowy",
  description:
    "Symuluje N dni bez słońca (PV = 0) w mrozie: ile dni bateria wytrzyma do krytycznego minimum, którego dnia system " +
    "padnie, ile brakuje pojemności albo o ile ograniczyć zużycie, z uwzględnieniem agregatu (Moduł 7, Ekran 4). Użyj, gdy user pyta, ile dni bez słońca wytrzyma jego system zimą albo ile pojemności baterii brakuje na taki scenariusz.",
  inputSchema: BlackoutToolInput,
  outputSchema: BlackoutToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/blackout",
  handler: async (input) => {
    const wynik = calculateBlackout(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
