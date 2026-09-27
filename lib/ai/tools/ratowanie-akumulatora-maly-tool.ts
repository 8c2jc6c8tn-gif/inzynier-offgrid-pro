/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 42 "Ratowanie rozładowanego
 * akumulatora — mała instalacja". `operationType: 'read'`. Odsyłacz do procedur Modułu 11 wg chemii.
 */
import { z } from "zod"
import { calculateRatowanieAkumulatoraMaly } from "@/lib/core/modules/kalkulator-mobilny/ratowanie-akumulatora-maly/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const RatowanieAkumulatoraMalyToolInput = z.object({
  chemia: z.enum(["AGM", "kwasowy", "LiFePO4"]).describe("Chemia akumulatora — od usera"),
  napiecieSpoczynkoweV: z.number().optional().describe("Zmierzone napięcie spoczynkowe akumulatora 12 V [V] — opcjonalnie, od usera"),
})
export type RatowanieAkumulatoraMalyToolInputT = z.infer<typeof RatowanieAkumulatoraMalyToolInput>

export const RatowanieAkumulatoraMalyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  procedury: z.array(z.object({ ekran: z.string(), href: z.string() })).describe("Ekrany Modułu 11 z pełną procedurą, w kolejności"),
  krytycznieRozladowany: z.boolean().nullable().describe("Ołowiowy 12 V poniżej 10,5 V; null = nie dotyczy/nie zmierzono"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RatowanieAkumulatoraMalyToolOutputT = z.infer<typeof RatowanieAkumulatoraMalyToolOutput>

export const ratowanieAkumulatoraMalyTool: AiToolDefinition<RatowanieAkumulatoraMalyToolInputT, RatowanieAkumulatoraMalyToolOutputT> = {
  name: "wskaz_procedure_ratowania_akumulatora",
  description:
    "Wskazuje pełną procedurę ratowania rozładowanego akumulatora małej instalacji (Moduł 12 → Moduł 11): LiFePO4 → " +
    "ratowanie głęboko rozładowanego ogniwa (A9), AGM/kwasowy → ocena zasiarczenia (B10) i ratowanie zasiarczonego (B11). " +
    "Dla ołowiowego 12 V poniżej 10,5 V oznacza krytyczne rozładowanie. Użyj, gdy user pyta, jak uratować rozładowany akumulator.",
  inputSchema: RatowanieAkumulatoraMalyToolInput,
  outputSchema: RatowanieAkumulatoraMalyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/ratowanie-akumulatora-maly",
  handler: async (input) => {
    const wynik = calculateRatowanieAkumulatoraMaly({ chemia: input.chemia, napiecieSpoczynkoweV: input.napiecieSpoczynkoweV ?? null })
    return {
      ...wynik.value,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
