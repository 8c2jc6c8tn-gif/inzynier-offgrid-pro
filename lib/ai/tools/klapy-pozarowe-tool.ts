/**
 * Narzędzie AI (9.3) dla Ekranu 8, Moduł 8 — "Klapy pożarowe i wentylacja" (dawne 11.56 + 12.56).
 * `operationType: 'read'`. Reakcje wentylacji na pożar — WYŁĄCZNIE deklaracja usera; model nie zakłada "tak".
 */
import { z } from "zod"
import { calculateKlapyPozarowe } from "@/lib/core/modules/bezpieczenstwo/klapy-pozarowe/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KlapyPozaroweToolInput = z.object({
  wentylacja: z.enum(["brak", "mechaniczna"]).nullable().describe("Czy budynek ma wentylację mechaniczną/rekuperację"),
  wentylacjaWylaczanaPrzyPozarze: z.boolean(),
  klapyZamykanePrzyPozarze: z.boolean(),
  sygnalizacjaStanuKlap: z.boolean(),
  maOddymianie: z.boolean(),
})
export type KlapyPozaroweToolInputT = z.infer<typeof KlapyPozaroweToolInput>

export const KlapyPozaroweToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  liczbaBrakow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KlapyPozaroweToolOutputT = z.infer<typeof KlapyPozaroweToolOutput>

export const klapyPozaroweTool: AiToolDefinition<KlapyPozaroweToolInputT, KlapyPozaroweToolOutputT> = {
  name: "sprawdz_klapy_pozarowe_i_wentylacje",
  description:
    "Sprawdza, czy przy pożarze wentylacja/rekuperacja się wyłącza i klapy w kanałach zamykają (żeby nie tłoczyć dymu), " +
    "oraz sygnalizację klap i oddymianie (Moduł 8, Ekran 8).",
  inputSchema: KlapyPozaroweToolInput,
  outputSchema: KlapyPozaroweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/klapy-pozarowe",
  handler: async (input) => {
    const wynik = calculateKlapyPozarowe(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
