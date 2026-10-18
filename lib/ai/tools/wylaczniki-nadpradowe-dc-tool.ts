/**
 * Narzędzie AI (9.3) dla Ekranu 14, Moduł 5 — "Wyłączniki nadprądowe DC". `operationType: 'read'`.
 * Prąd, napięcie, liczba biegunów, certyfikacja DC, AIC i prąd zwarciowy MUSZĄ pochodzić od
 * użytkownika (karta katalogowa wyłącznika, Ekran 12 Analiza zwarciowa) — model nigdy ich nie
 * zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWylacznikiNadpradoweDc } from "@/lib/core/modules/okablowanie/wylaczniki-nadpradowe-dc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WylacznikiNadpradoweDcToolInput = z.object({
  pradA: z.number().describe("Prąd znamionowy obwodu [A]. 0 = jeszcze nie podano"),
  napiecieV: z.number().describe("Napięcie DC obwodu [V]. 0 = jeszcze nie podano"),
  liczbaBiegunow: z.number().describe("Liczba biegunów wyłącznika. 0 = jeszcze nie podano"),
  certyfikowanyDoDc: z.boolean().describe("Czy wyłącznik ma certyfikację do pracy w DC (gaszenie łuku stałoprądowego)"),
  aicA: z.number().describe("Zdolność wyłączania (AIC) wyłącznika [A], z karty katalogowej. 0 = nie podano — sprawdzenie pomijane"),
  pradZwarciowyA: z.number().describe("Prąd zwarciowy w tym punkcie [A], docelowo z Ekranu 12 (Analiza zwarciowa). 0 = nie podano"),
})

export type WylacznikiNadpradoweDcToolInputT = z.infer<typeof WylacznikiNadpradoweDcToolInput>

export const WylacznikiNadpradoweDcToolOutput = z.object({
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type WylacznikiNadpradoweDcToolOutputT = z.infer<typeof WylacznikiNadpradoweDcToolOutput>

export const wylacznikiNadpradoweDcTool: AiToolDefinition<
  WylacznikiNadpradoweDcToolInputT,
  WylacznikiNadpradoweDcToolOutputT
> = {
  name: "policz_wylaczniki_nadpradowe_dc",
  description:
    "Sprawdza, czy wyłącznik nadprądowy obwodu DC ma certyfikację do pracy w DC (twardy stop — " +
    "wyłącznik AC w obwodzie DC nie gasi łuku stałoprądowego) i opcjonalnie, czy zdolność wyłączania " +
    "(AIC) jest wystarczająca wobec prądu zwarciowego. Użyj, gdy user pyta o dobór wyłącznika " +
    "nadprądowego DC w instalacji off-grid.",
  inputSchema: WylacznikiNadpradoweDcToolInput,
  outputSchema: WylacznikiNadpradoweDcToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/wylaczniki-nadpradowe-dc",
  handler: async (input) => {
    const wynik = calculateWylacznikiNadpradoweDc(input)
    return {
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
