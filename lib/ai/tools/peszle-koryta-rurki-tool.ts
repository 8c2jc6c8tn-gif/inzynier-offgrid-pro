/**
 * Narzędzie AI (9.3) dla Ekranu 24, Moduł 5 — "Peszle, koryta, rurki". `operationType: 'read'`.
 * Miejsce montażu MUSI pochodzić od użytkownika (rzeczywiste miejsce prowadzenia trasy) — model
 * nigdy go nie zgaduje.
 */
import { z } from "zod"
import { calculatePeszleKorytaRurki } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/calculator"
import type { MiejsceMontazu } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/input"
import type { AiToolDefinition } from "../types"

const MIEJSCA_MONTAZU = ["wewnatrz", "na-scianie-zewnatrz", "w-ziemi", "przemyslowe"] as [MiejsceMontazu, ...MiejsceMontazu[]]

export const PeszleKorytaRurkiToolInput = z.object({
  miejsceMontazu: z.enum(MIEJSCA_MONTAZU).nullable().describe("Miejsce montażu trasy kabla. null = jeszcze nie wybrano"),
})

export type PeszleKorytaRurkiToolInputT = z.infer<typeof PeszleKorytaRurkiToolInput>

export const PeszleKorytaRurkiToolOutput = z.object({
  zalecanaOslona: z
    .object({ id: z.string(), nazwa: z.string(), opis: z.string() })
    .nullable(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wersjaKalkulatora: z.string(),
})

export type PeszleKorytaRurkiToolOutputT = z.infer<typeof PeszleKorytaRurkiToolOutput>

export const peszleKorytaRurkiTool: AiToolDefinition<PeszleKorytaRurkiToolInputT, PeszleKorytaRurkiToolOutputT> = {
  name: "policz_peszle_koryta_rurki",
  description:
    "Dobiera osłonę kabla (peszel karbowany, peszel UV-odporny, rura HDPE, korytko metalowe) na " +
    "podstawie miejsca montażu podanego przez usera. Użyj, gdy user pyta o wybór osłony/peszla/koryta " +
    "dla trasy kablowej w instalacji off-grid.",
  inputSchema: PeszleKorytaRurkiToolInput,
  outputSchema: PeszleKorytaRurkiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/peszle-koryta-rurki",
  handler: async (input) => {
    const wynik = calculatePeszleKorytaRurki(input)
    const o = wynik.value.zalecanaOslona
    return {
      zalecanaOslona: o ? { id: o.id, nazwa: o.nazwa, opis: o.opis } : null,
      status: wynik.status,
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
