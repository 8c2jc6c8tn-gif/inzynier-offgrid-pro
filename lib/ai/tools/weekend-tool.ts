/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 5 "Kalkulator na weekend".
 * `operationType: 'read'`. Moce i czasy pracy urządzeń, dane akumulatora i panelu MUSZĄ pochodzić od
 * usera — w repo nie ma bazy „typowych mocy” (D33, Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWeekend } from "@/lib/core/modules/kalkulator-mobilny/weekend/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WeekendToolInput = z.object({
  dni: z.number().describe("Liczba dni pobytu"),
  osoby: z.number().describe("Liczba osób"),
  urzadzenia: z
    .array(
      z.object({
        nazwa: z.string(),
        mocW: z.number().describe("Moc [W] — od usera"),
        godzinNaDobe: z.number().describe("Godziny pracy na dobę [h]"),
        naOsobe: z.boolean().describe("Czy liczyć osobno dla każdej osoby (np. ładowarka telefonu)"),
      }),
    )
    .describe("Urządzenia na wyjazd"),
  pojemnoscAh: z.number().describe("Pojemność akumulatora [Ah]"),
  napiecieV: z.number().describe("Napięcie akumulatora [V]"),
  dodPct: z.number().describe("Dopuszczalna głębokość rozładowania [%] — z karty, nie zgaduj"),
  mocPaneluW: z.number().describe("Moc panelu [W]; 0 = bez panelu"),
  godzinSlonca: z.number().describe("Równoważne godziny pełnego słońca na dobę [h] — od usera; 0 gdy bez panelu"),
  sprawnoscToruPct: z.number().describe("Sprawność toru panel → akumulator [%] — od usera; 0 gdy bez panelu"),
})
export type WeekendToolInputT = z.infer<typeof WeekendToolInput>

export const WeekendToolOutput = z.object({
  status: z.enum(STATUSY),
  zuzycieDobaWh: z.number(),
  zuzyciePobytWh: z.number(),
  energiaAkumulatoraWh: z.number(),
  dniBezSlonca: z.number().describe("Na ile dób bez słońca starczy akumulator"),
  produkcjaPaneluDobaWh: z.number(),
  bilansPobytuWh: z.number().describe("Energia na koniec pobytu [Wh]; ujemna = zabraknie"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WeekendToolOutputT = z.infer<typeof WeekendToolOutput>

export const weekendTool: AiToolDefinition<WeekendToolInputT, WeekendToolOutputT> = {
  name: "policz_energie_na_weekend",
  description:
    "Sumuje zużycie energii na krótki wyjazd (dni × osoby × urządzenia), sprawdza, na ile dób bez słońca " +
    "starczy akumulator, i — z panelem — bilans całego pobytu. Użyj, gdy user jedzie na weekend na działkę " +
    "albo kemping i pyta, czy jego akumulator (i panel) wystarczy.",
  inputSchema: WeekendToolInput,
  outputSchema: WeekendToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/weekend",
  handler: async (input) => {
    const wynik = calculateWeekend(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
