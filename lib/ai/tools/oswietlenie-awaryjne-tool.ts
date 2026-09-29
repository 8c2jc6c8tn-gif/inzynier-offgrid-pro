/**
 * Narzędzie AI (9.3) dla Ekranu 7, Moduł 8 — "Oświetlenie awaryjne" (dawne 11.55; część AI 12.52 poza zakresem).
 * `operationType: 'read'`. Stan lamp z ostatniego testu — WYŁĄCZNIE od usera; lampa bez wyniku testu = 'nietestowana'.
 */
import { z } from "zod"
import { calculateOswietlenieAwaryjne } from "@/lib/core/modules/bezpieczenstwo/oswietlenie-awaryjne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OswietlenieAwaryjneToolInput = z.object({
  zasilanie: z.enum(["ups", "wlasne-akumulatory"]).nullable(),
  lampy: z
    .array(
      z.object({
        nazwa: z.string().describe("Miejsce lampy, np. 'korytarz'"),
        stan: z.enum(["sprawna", "niesprawna", "nietestowana"]).describe("Wynik ostatniego testu; brak wyniku = 'nietestowana', nie zgaduj"),
      }),
    )
    .describe("Lampy awaryjne na drogach ewakuacji"),
  oswietlenieZewnetrzne: z.boolean().describe("Oświetlenie zewnętrzne dla służb włączane po alarmie — deklaracja usera"),
})
export type OswietlenieAwaryjneToolInputT = z.infer<typeof OswietlenieAwaryjneToolInput>

export const OswietlenieAwaryjneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  sprawne: z.number(),
  niesprawne: z.number(),
  nietestowane: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OswietlenieAwaryjneToolOutputT = z.infer<typeof OswietlenieAwaryjneToolOutput>

export const oswietlenieAwaryjneTool: AiToolDefinition<OswietlenieAwaryjneToolInputT, OswietlenieAwaryjneToolOutputT> = {
  name: "sprawdz_oswietlenie_awaryjne",
  description:
    "Sprawdza lampy awaryjne na drogach ewakuacji: niesprawna lampa to twardy stop, nietestowana — ostrzeżenie; " +
    "przypomina o oświetleniu zewnętrznym dla służb (Moduł 8, Ekran 7). Użyj, gdy user pyta o oświetlenie awaryjne dróg ewakuacji albo o stan i testy lamp awaryjnych.",
  inputSchema: OswietlenieAwaryjneToolInput,
  outputSchema: OswietlenieAwaryjneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/oswietlenie-awaryjne",
  handler: async (input) => {
    const wynik = calculateOswietlenieAwaryjne(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
