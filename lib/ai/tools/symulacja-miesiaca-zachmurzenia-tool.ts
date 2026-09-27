/**
 * Narzędzie AI (9.3) dla Ekranu 33, Moduł 4 "Magazyn energii / baterie" — "Symulacja miesiąca
 * zachmurzenia (No-Sun Scenario)". `operationType: 'read'`. Zapotrzebowanie dobowe, produkcja
 * nominalna i poziom zachmurzenia MUSZĄ pochodzić od usera — nie zgaduj prognozy pogody.
 */
import { z } from "zod"
import { calculateSymulacjaZachmurzenia } from "@/lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SymulacjaMiesiacaZachmurzeniaToolInput = z.object({
  pojemnoscUzytecznaKwh: z.number().describe("Pojemność użyteczna baterii [kWh]"),
  socStartPct: z.number().describe("SoC na początku scenariusza [%], 0–100"),
  zapotrzebowanieDoboweKwh: z.number().describe("Zapotrzebowanie dobowe [kWh] — od usera"),
  produkcjaNominalnaDobowaKwh: z.number().describe("Nominalna produkcja PV dobowa w pełnym słońcu [kWh] — od usera"),
  poziomZachmurzeniaPct: z.number().describe("Poziom zachmurzenia scenariusza — produkcja jako % nominalnej, np. 5-10% wg scenariusza no-sun; tylko od usera, nie zgaduj prognozy pogody"),
  liczbaDniScenariusza: z.number().describe("Liczba dni scenariusza zachmurzenia"),
})
export type SymulacjaMiesiacaZachmurzeniaToolInputT = z.infer<typeof SymulacjaMiesiacaZachmurzeniaToolInput>

export const SymulacjaMiesiacaZachmurzeniaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  dobowyDeficytKwh: z.number(),
  przetrwaCalyScenariusz: z.boolean(),
  dzienPadnieSystem: z.number().nullable(),
  godzinaPadnieSystemW24H: z.number().nullable(),
  energiaBrakujacaKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SymulacjaMiesiacaZachmurzeniaToolOutputT = z.infer<typeof SymulacjaMiesiacaZachmurzeniaToolOutput>

export const symulacjaMiesiacaZachmurzeniaTool: AiToolDefinition<
  SymulacjaMiesiacaZachmurzeniaToolInputT,
  SymulacjaMiesiacaZachmurzeniaToolOutputT
> = {
  name: "symuluj_miesiac_zachmurzenia",
  description:
    "Symuluje przetrwanie systemu przez wielodniowy scenariusz silnego zachmurzenia (No-Sun Scenario) — dobowy " +
    "deficyt energii, czy system przetrwa cały scenariusz, i który dzień/godzina system padnie (Moduł 4, " +
    "Ekran 33). Zapotrzebowanie dobowe, produkcja nominalna i poziom zachmurzenia MUSZĄ pochodzić od usera — " +
    "nie zgaduj prognozy pogody. Użyj, gdy user pyta, czy system przetrwa dłuższy okres bez słońca.",
  inputSchema: SymulacjaMiesiacaZachmurzeniaToolInput,
  outputSchema: SymulacjaMiesiacaZachmurzeniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/symulacja-miesiaca-zachmurzenia",
  handler: async (input) => {
    const wynik = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
      socStartPct: input.socStartPct,
      zapotrzebowanieDoboweKwh: input.zapotrzebowanieDoboweKwh,
      produkcjaNominalnaDobowaKwh: input.produkcjaNominalnaDobowaKwh,
      poziomZachmurzeniaPct: input.poziomZachmurzeniaPct,
      liczbaDniScenariusza: input.liczbaDniScenariusza,
    })
    return {
      status: wynik.status,
      dobowyDeficytKwh: wynik.value.dobowyDeficytKwh,
      przetrwaCalyScenariusz: wynik.value.przetrwaCalyScenariusz,
      dzienPadnieSystem: wynik.value.dzienPadnieSystem,
      godzinaPadnieSystemW24H: wynik.value.godzinaPadnieSystemW24H,
      energiaBrakujacaKwh: wynik.value.energiaBrakujacaKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
