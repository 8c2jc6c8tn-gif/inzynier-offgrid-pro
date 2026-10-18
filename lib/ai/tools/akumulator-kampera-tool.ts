/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 17 "Dobór akumulatora do kampera (AGM vs LiFePO4)".
 * `operationType: 'read'`. DoD, cykle, ceny i masy MUSZĄ pochodzić od usera z kart konkretnych
 * akumulatorów (Dyrektywa #1); pełne porównanie technologii — M4/E30.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAkumulatorKampera } from "@/lib/core/modules/kalkulator-mobilny/akumulator-kampera/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AkumulatorKamperaToolInput = z.object({
  zapotrzebowanieWhDoba: z.number().describe("Zapotrzebowanie kampera na dobę [Wh]"),
  dniBezLadowania: z.number().describe("Ile dób bez ładowania"),
  napiecieV: z.number().describe("Napięcie instalacji [V]"),
  agmAh: z.number().describe("AGM: pojemność jednej sztuki [Ah]"),
  agmCenaZl: z.number().describe("AGM: cena sztuki [zł]"),
  agmMasaKg: z.number().describe("AGM: masa sztuki [kg]"),
  agmDodPct: z.number().describe("AGM: dopuszczalna głębokość rozładowania [%] — z karty, nie zgaduj"),
  agmCykle: z.number().describe("AGM: liczba cykli przy tej głębokości — z karty, nie zgaduj"),
  lfpAh: z.number().describe("LiFePO4: pojemność jednej sztuki [Ah]"),
  lfpCenaZl: z.number().describe("LiFePO4: cena sztuki [zł]"),
  lfpMasaKg: z.number().describe("LiFePO4: masa sztuki [kg]"),
  lfpDodPct: z.number().describe("LiFePO4: dopuszczalna głębokość rozładowania [%] — z karty, nie zgaduj"),
  lfpCykle: z.number().describe("LiFePO4: liczba cykli — z karty, nie zgaduj"),
  zapasMasyKg: z.number().describe("Zapas ładowności pojazdu na akumulatory [kg]; 0 = nie sprawdzaj"),
})
export type AkumulatorKamperaToolInputT = z.infer<typeof AkumulatorKamperaToolInput>

const Wariant = z.object({
  uzytecznaSztukaWh: z.number(),
  sztuk: z.number(),
  masaKg: z.number(),
  cenaZl: z.number(),
  kosztKwhZyciaZl: z.number().describe("Koszt 1 kWh w całym życiu [zł/kWh]"),
})

export const AkumulatorKamperaToolOutput = z.object({
  status: z.enum(STATUSY),
  agm: Wariant,
  lfp: Wariant,
  potrzebaWh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AkumulatorKamperaToolOutputT = z.infer<typeof AkumulatorKamperaToolOutput>

export const akumulatorKamperaTool: AiToolDefinition<AkumulatorKamperaToolInputT, AkumulatorKamperaToolOutputT> = {
  name: "porownaj_akumulator_agm_i_lifepo4_do_kampera",
  description:
    "Porównuje AGM i LiFePO4 do kampera dla wpisanych modeli: ile sztuk pokryje zapotrzebowanie przez " +
    "zadaną liczbę dób, masa, cena i koszt 1 kWh w całym życiu; sprawdza zapas ładowności pojazdu. " +
    "Użyj, gdy user wybiera akumulator do kampera albo przyczepy i waha się między AGM a LiFePO4.",
  inputSchema: AkumulatorKamperaToolInput,
  outputSchema: AkumulatorKamperaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/akumulator-kampera",
  handler: async (input) => {
    const wynik = calculateAkumulatorKampera(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
