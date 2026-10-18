/**
 * Narzędzie AI (9.3) — Wampiry energetyczne, podzakładka Automatyzacja (dawne 1.34 + 1.40 + 1.48).
 * `operationType: 'read'`. Echo silnika `zapotrzebowanie/wampiry-energetyczne/automatyzacja`:
 * redukcja standby w scenariuszu (noc, nieobecność, urlop) względem trybu referencyjnego.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateScenariuszAutomatyzacji } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/automatyzacja/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WampiryAutomatyzacjaToolInput = z.object({
  standbyReferencyjnyW: z.number().describe("Pobór standby w normalnym trybie, dziś [W]"),
  standbyWScenariuszuW: z
    .number()
    .describe("Pobór standby w wybranym scenariuszu (nocny, nieobecność, urlop) [W]; 0 = całkowite odłączenie"),
})
export type WampiryAutomatyzacjaToolInputT = z.infer<typeof WampiryAutomatyzacjaToolInput>

export const WampiryAutomatyzacjaToolOutput = z.object({
  status: z.enum(STATUSY),
  redukcjaW: z.number(),
  redukcjaDobowaKwh: z.number(),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WampiryAutomatyzacjaToolOutputT = z.infer<typeof WampiryAutomatyzacjaToolOutput>

export const wampiryAutomatyzacjaTool: AiToolDefinition<
  WampiryAutomatyzacjaToolInputT,
  WampiryAutomatyzacjaToolOutputT
> = {
  name: "policz_scenariusz_automatyzacji_standby",
  description:
    "Liczy, ile energii na dobę oszczędza scenariusz automatyzacji standby (tryb nocny, nieobecność, weekend, urlop): " +
    "E = (P_ref − P_scenariusz) × 24 h / 1000, np. 45 W → 15 W daje 0,72 kWh/dobę — moduł Wampiry energetyczne, " +
    "Automatyzacja. Użyj, gdy user pyta, ile zyska, wyłączając zbędne obwody na noc, na czas wyjazdu lub urlopu, " +
    "albo porównuje pobór czuwania przed i po automatyzacji.",
  inputSchema: WampiryAutomatyzacjaToolInput,
  outputSchema: WampiryAutomatyzacjaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/wampiry-energetyczne/automatyzacja",
  handler: async (input) => {
    const wynik = calculateScenariuszAutomatyzacji(input)
    return {
      status: wynik.status,
      ...wynik.value,
      wzor: wynik.formula,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
