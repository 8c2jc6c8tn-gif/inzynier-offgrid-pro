/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 7 "Śnieg i oblodzenie na PV" (dawne 6.7, 6.20) i Ekran 14 "Wieczna mgła i
 * szadź" (dawne 6.18) — wspólny silnik. `operationType: 'read'`. Dni zalegania i procent produkcji pod osadem MUSZĄ
 * pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateOsadNaPv } from "@/lib/core/modules/stress-test/osad-na-pv/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OsadNaPvToolInput = z.object({
  rodzaj: z.enum(["sypki", "mokry", "lod", "szadz"]).describe("Rodzaj osadu: śnieg sypki, śnieg mokry, gołoledź/szron, szadź z mgły"),
  katDeg: z.number().nullable().describe("Kąt nachylenia paneli [°]; null = nie podano"),
  produkcjaDobaKwh: z.number().describe("Produkcja PV na dobę bez osadu [kWh]"),
  dniZalegania: z.number().describe("Ile dni osad zostanie na panelach"),
  pozostalaProdukcjaPct: z.number().describe("Produkcja pod osadem [% normalnej]; śnieg zwykle 0, szadź po 48 h ok. 5 (źródło)"),
  nierownoStringi: z.boolean().describe("Stringi zasypane nierównomiernie"),
})
export type OsadNaPvToolInputT = z.infer<typeof OsadNaPvToolInput>

export const OsadNaPvToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  utrataKwh: z.number(),
  produkcjaPodOsademKwh: z.number(),
  mozeZsunacSie: z.boolean().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OsadNaPvToolOutputT = z.infer<typeof OsadNaPvToolOutput>

export const osadNaPvTool: AiToolDefinition<OsadNaPvToolInputT, OsadNaPvToolOutputT> = {
  name: "policz_strate_pv_snieg_szadz",
  description:
    "Strata produkcji PV, gdy panele pokrywa śnieg, lód, szron albo szadź z mgły: utracona energia w okresie " +
    "zalegania, czy sypki śnieg zsunie się sam przy danym kącie (powyżej 30°) oraz ostrzeżenia o mokrym śniegu, " +
    "gołoledzi, szadzi i nierównym zasypaniu stringów. Użyj, gdy user pyta, ile energii straci przez zasypane " +
    "panele, czy śnieg zsunie się z paneli, czy odśnieżać, albo co zrobi kilka dni mgły z szadzią.",
  inputSchema: OsadNaPvToolInput,
  outputSchema: OsadNaPvToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/osad-na-pv",
  handler: async (input) => {
    const wynik = calculateOsadNaPv(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
