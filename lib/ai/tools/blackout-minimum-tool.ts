/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 13 "Blackout w domu — minimum do przeżycia".
 * `operationType: 'read'`. Moce, czasy, część użyteczna i sprawność MUSZĄ pochodzić od usera
 * (Dyrektywa #1). Wielodniowy blackout istniejącej instalacji PV — `stress-test/blackout` (M7).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBlackoutMinimum } from "@/lib/core/modules/kalkulator-mobilny/blackout-minimum/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BlackoutMinimumToolInput = z.object({
  odbiorniki: z
    .array(
      z.object({
        nazwa: z.string(),
        mocW: z.number().describe("Moc [W] — od usera"),
        godzinNaDobe: z.number().describe("Średni czas pracy na dobę [h]"),
      }),
    )
    .describe("Odbiorniki krytyczne (lodówka, router, oświetlenie, ładowarki)"),
  czasBlackoutuH: z.number().describe("Przewidywany czas blackoutu [h]"),
  napiecieV: z.number().describe("Napięcie akumulatora [V]"),
  uzytecznaPct: z.number().describe("Część pojemności do wykorzystania [%] — od usera, nie zgaduj"),
  sprawnoscPrzetwornicyPct: z.number().describe("Sprawność przetwornicy [%] — od usera; 100 gdy wszystko DC"),
  posiadanyAh: z.number().describe("Akumulator, który user ma [Ah]; 0 = tylko dobór"),
})
export type BlackoutMinimumToolInputT = z.infer<typeof BlackoutMinimumToolInput>

export const BlackoutMinimumToolOutput = z.object({
  status: z.enum(STATUSY),
  zuzycieDobaWh: z.number(),
  energiaBlackoutWh: z.number(),
  energiaReferencyjnaWh: z.array(z.number()).describe("Energia na 12, 24 i 48 h [Wh]"),
  minimalnyAh: z.number().describe("Minimalna pojemność akumulatora [Ah]"),
  minimalnaPrzetwornicaW: z.number().describe("Minimalna moc ciągła przetwornicy [W], bez rozruchu"),
  posiadanyStarczyH: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BlackoutMinimumToolOutputT = z.infer<typeof BlackoutMinimumToolOutput>

export const blackoutMinimumTool: AiToolDefinition<BlackoutMinimumToolInputT, BlackoutMinimumToolOutputT> = {
  name: "dobierz_minimum_na_blackout_w_domu",
  description:
    "Dobiera minimalny zestaw awaryjny na blackout w domu tylko dla odbiorników krytycznych: energia na " +
    "czas awarii (i na 12/24/48 h), minimalny akumulator i moc przetwornicy. Użyj, gdy user pyta, co " +
    "kupić, żeby lodówka, router i światło przetrwały awarię sieci przez dobę czy dwie.",
  inputSchema: BlackoutMinimumToolInput,
  outputSchema: BlackoutMinimumToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/blackout-minimum",
  handler: async (input) => {
    const wynik = calculateBlackoutMinimum(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
