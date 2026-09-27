/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B9 "Test pojemności i gęstości elektrolitu"
 * (kwasowo-ołowiowa). `operationType: 'read'`. Gęstość elektrolitu pochodzi wyłącznie z pomiaru
 * areometrem przez usera — nie zgaduj. `null` = jeszcze niezmierzone.
 */
import { z } from "zod"
import { calculateGestoscElektrolitu } from "@/lib/core/modules/montaz-baterii/gestosc-elektrolitu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const GestoscElektrolituToolInput = z.object({
  gestoscGCm3: z.number().nullable().describe("Zmierzona gęstość elektrolitu [g/cm³] areometrem — tylko od usera. null = jeszcze niezmierzone"),
})
export type GestoscElektrolituToolInputT = z.infer<typeof GestoscElektrolituToolInput>

export const GestoscElektrolituToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  gestoscGCm3: z.number(),
  stan: z.enum(["pelny", "czesciowo-naladowany", "rozladowany"]).nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type GestoscElektrolituToolOutputT = z.infer<typeof GestoscElektrolituToolOutput>

export const gestoscElektrolituTool: AiToolDefinition<GestoscElektrolituToolInputT, GestoscElektrolituToolOutputT> = {
  name: "ocen_gestosc_elektrolitu",
  description:
    "Ocenia stan naładowania akumulatora kwasowo-ołowiowego z korkami na podstawie zmierzonej gęstości " +
    "elektrolitu (Moduł 11, Ekran B9) — trzy strefy z tabeli referencyjnej źródła: ≥1,28 g/cm³ pełny, " +
    "≥1,20 g/cm³ częściowo naładowany, <1,20 g/cm³ rozładowany (wymaga doładowania). Gęstość podaje user z " +
    "pomiaru areometrem — nie zgaduj. Użyj, gdy user pyta o stan naładowania akumulatora kwasowego z pomiaru " +
    "gęstości elektrolitu.",
  inputSchema: GestoscElektrolituToolInput,
  outputSchema: GestoscElektrolituToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/gestosc-elektrolitu",
  handler: async (input) => {
    const wynik = calculateGestoscElektrolitu({ gestoscGCm3: input.gestoscGCm3 })
    return {
      status: wynik.status,
      gestoscGCm3: wynik.value.gestoscGCm3,
      stan: wynik.status === "VALID_WITH_WARNINGS" ? wynik.value.stan : null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
