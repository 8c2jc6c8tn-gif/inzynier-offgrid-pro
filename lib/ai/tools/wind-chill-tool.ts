/**
 * Narzędzie AI (9.3) dla Ekranu 17, Moduł 7 "Stress-test zimowy" — "Wind Chill (temperatura
 * odczuwalna)". `operationType: 'read'`. Temperatura i prędkość wiatru MUSZĄ pochodzić z
 * pomiaru/prognozy lokalizacji użytkownika — model nigdy ich nie zgaduje.
 *
 * Wzór NWS/Environment Canada (2001), ważny tylko w zakresie: T ≤ 10°C, V > 4,8 km/h — poza tym
 * zakresem kalkulator zwraca OUT_OF_SCOPE (wzór traci sens fizyczny), nie przybliżoną wartość.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWindChill } from "@/lib/core/modules/stress-test/wind-chill/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WindChillToolInput = z.object({
  temperaturaC: z
    .number()
    .describe("Temperatura powietrza [°C] — dana usera z pomiaru/prognozy lokalizacji, nie zgaduj"),
  predkoscWiatruKmh: z
    .number()
    .describe("Prędkość wiatru na wysokości 10m [km/h] — dana usera, nie zgaduj"),
})
export type WindChillToolInputT = z.infer<typeof WindChillToolInput>

export const WindChillToolOutput = z.object({
  status: z.enum(STATUSY),
  temperaturaOdczuwalnaC: z.number().describe("Temperatura odczuwalna (wind chill) [°C]"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WindChillToolOutputT = z.infer<typeof WindChillToolOutput>

export const windChillTool: AiToolDefinition<WindChillToolInputT, WindChillToolOutputT> = {
  name: "oblicz_temperature_odczuwalna_wind_chill",
  description:
    "Liczy temperaturę odczuwalną (wind chill) ze wzoru NWS/Environment Canada (Moduł 7, Ekran 17) dla " +
    "temperatury powietrza i prędkości wiatru w lokalizacji instalacji. Wzór obowiązuje tylko dla T ≤ 10°C " +
    "i V > 4,8 km/h — poza tym zakresem wynik to OUT_OF_SCOPE, nie przybliżenie. Liczy WYŁĄCZNIE temperaturę " +
    "odczuwalną, nie wpływ na zapotrzebowanie na ciepło (brak wzoru w źródle). Użyj, gdy user pyta, jak zimno " +
    "faktycznie odczuwają ludzie/sprzęt przy danym wietrze i mrozie.",
  inputSchema: WindChillToolInput,
  outputSchema: WindChillToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/wind-chill",
  handler: async (input) => {
    const wynik = calculateWindChill(input)
    return {
      status: wynik.status,
      temperaturaOdczuwalnaC: wynik.value.temperaturaOdczuwalnaC,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
