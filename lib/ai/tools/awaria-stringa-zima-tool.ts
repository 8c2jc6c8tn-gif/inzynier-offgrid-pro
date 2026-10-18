/**
 * Narzędzie AI (9.3) dla Modułu 7 "Stress-test zimowy" — Ekran 26 „Awaria stringa zimą”. `operationType: 'read'`.
 * Dane wejściowe WYŁĄCZNIE od usera (karty urządzeń, Moduły 3/6); model nie zgaduje — null, gdy nieznane.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAwariaStringaZima } from "@/lib/core/modules/stress-test/awaria-stringa-zima/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const n = (opis: string) => z.number().nullable().describe(opis)

export const AwariaStringaZimaToolInput = z.object({
  produkcjaCalkowitaKwhDoba: n("Produkcja instalacji w najgorszym miesiącu [kWh/dobę]"),
  produkcjaStringuKwhDoba: n("Produkcja uszkodzonego stringu [kWh/dobę]"),
  zapotrzebowanieKwhDoba: n("Zapotrzebowanie dobowe [kWh]"),
  pojemnoscBateriiKwh: n("Pojemność znamionowa baterii [kWh]; null = pomiń"),
  dodPct: n("Użyteczna głębokość rozładowania [%]"),
  sprawnoscFalownikaPct: n("Sprawność falownika [%]"),
})
export type AwariaStringaZimaToolInputT = z.infer<typeof AwariaStringaZimaToolInput>

export const AwariaStringaZimaToolOutput = z.object({
  status: z.enum(STATUSY),
  produkcjaPoAwariiKwhDoba: z.number().nullable(),
  deficytDobowyKwh: z.number().nullable(),
  dniNaBaterii: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AwariaStringaZimaToolOutputT = z.infer<typeof AwariaStringaZimaToolOutput>

export const awariaStringaZimaTool: AiToolDefinition<AwariaStringaZimaToolInputT, AwariaStringaZimaToolOutputT> = {
  name: "sprawdz_awarie_stringa_zima",
  description: "Liczy deficyt energii, gdy jeden string PV przestanie działać w najgorszym miesiącu, i na ile dni wystarczy bateria (Moduł 7, Ekran 26). Użyj, gdy user pyta, co się stanie zimą, gdy padnie jeden string PV, i ile dni wytrzyma bateria.",
  inputSchema: AwariaStringaZimaToolInput,
  outputSchema: AwariaStringaZimaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/awaria-stringa-zima",
  handler: async (input) => {
    const wynik = calculateAwariaStringaZima(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
