/**
 * Narzędzie AI (9.3) — Moduł 4, „Czas balansowania”. `operationType: 'read'`. Echo silnika
 * `baterie/czas-balansowania`: ładunek do przeniesienia (pojemność × rozjazd), czas pracy balansera
 * (Ah ÷ A) i liczba dób okna powyżej progu startu. Rozjazd i prąd balansera pochodzą od użytkownika.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateCzasBalansowania } from "@/lib/core/modules/baterie/czas-balansowania/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const CzasBalansowaniaToolInput = z.object({
  pojemnoscAh: z.number().describe("Pojemność jednego ogniwa [Ah] — z karty ogniwa"),
  rozjazdProc: z.number().describe("Różnica pojemności najbardziej i najmniej naładowanego ogniwa przy górze [% pojemności ogniwa] — z pomiaru użytkownika"),
  pradBalanseraA: z.number().describe("Prąd balansera [A] — z karty/ustawień BMS"),
  oknoGodzinDobe: z.number().describe("Ile godzin na dobę ogniwa są powyżej progu startu balansowania; 0 = nie podano"),
})
export type CzasBalansowaniaToolInputT = z.infer<typeof CzasBalansowaniaToolInput>

export const CzasBalansowaniaToolOutput = z.object({
  status: z.enum(STATUSY),
  ahDoPrzeniesienia: z.number(),
  czasPracyH: z.number(),
  dniOkna: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type CzasBalansowaniaToolOutputT = z.infer<typeof CzasBalansowaniaToolOutput>

export const czasBalansowaniaTool: AiToolDefinition<CzasBalansowaniaToolInputT, CzasBalansowaniaToolOutputT> = {
  name: "oblicz_czas_balansowania",
  description:
    "Liczy, ile godzin musi pracować balanser BMS, żeby wyrównać rozjazd ogniw (pojemność ogniwa × rozjazd w % ÷ prąd balansera), " +
    "i ile dób okna powyżej progu startu balansowania to zajmie. Rozjazd i prąd balansera podaje użytkownik — aplikacja ich nie zna. " +
    "Model idealny: stały prąd, stały rozjazd, jedno najbardziej rozjechane ogniwo. Użyj, gdy user pyta, jak długo potrwa balansowanie, " +
    "czy słaby balanser zdąży wyrównać pakiet albo czy zimą, gdy ogniwa rzadko dochodzą do progu startu, balansowanie ma szansę zadziałać.",
  inputSchema: CzasBalansowaniaToolInput,
  outputSchema: CzasBalansowaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/czas-balansowania",
  handler: async (input) => {
    const wynik = calculateCzasBalansowania(input)
    return {
      status: wynik.status,
      ahDoPrzeniesienia: wynik.value.ahDoPrzeniesienia,
      czasPracyH: wynik.value.czasPracyH,
      dniOkna: wynik.value.dniOkna,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
