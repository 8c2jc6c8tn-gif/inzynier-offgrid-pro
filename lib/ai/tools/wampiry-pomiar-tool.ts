/**
 * Narzędzie AI (9.3) — Wampiry energetyczne, podzakładka Pomiar (dawne 1.30 + 1.38).
 * `operationType: 'read'`. Echo silnika `zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej`:
 * suma zmierzonych mocy jałowych → kWh/dobę i kWh/rok. Pomiary podaje user — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculatePomiarMocyJalowej } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WampiryPomiarToolInput = z.object({
  pozycje: z
    .array(
      z.object({
        nazwa: z.string().describe("Nazwa urządzenia (np. ładowarka laptopa, zasilacz routera, sterownik)"),
        mocJalowaW: z.number().describe("Zmierzona moc jałowa [W] — z watomierza, od usera, nie zgaduj"),
      }),
    )
    .describe("Ręcznie zmierzone moce jałowe ładowarek, zasilaczy, transformatorów, przekaźników, sterowników"),
})
export type WampiryPomiarToolInputT = z.infer<typeof WampiryPomiarToolInput>

export const WampiryPomiarToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  sumaW: z.number(),
  energiaDobowaKwh: z.number(),
  energiaRocznaKwh: z.number(),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WampiryPomiarToolOutputT = z.infer<typeof WampiryPomiarToolOutput>

export const wampiryPomiarTool: AiToolDefinition<WampiryPomiarToolInputT, WampiryPomiarToolOutputT> = {
  name: "policz_standby_z_pomiarow",
  description:
    "Sumuje zmierzone moce jałowe urządzeń i przelicza je na kWh/dobę (×24 h) i kWh/rok (×365) — moduł Wampiry " +
    "energetyczne, Pomiar (np. 8 W ciągle → ok. 70 kWh/rok). Moce z pomiaru podaje user. Użyj, gdy user zmierzył " +
    "watomierzem pobór ładowarek, zasilaczy, sterowników lub przekaźników bez obciążenia i pyta, ile to energii rocznie.",
  inputSchema: WampiryPomiarToolInput,
  outputSchema: WampiryPomiarToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/wampiry-energetyczne/pomiar-mocy-jalowej",
  handler: async (input) => {
    const wynik = calculatePomiarMocyJalowej({
      pozycje: input.pozycje.map((p, i) => ({ id: String(i + 1), nazwa: p.nazwa, mocJalowaW: p.mocJalowaW })),
    })
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
