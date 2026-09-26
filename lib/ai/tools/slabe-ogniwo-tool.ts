/**
 * Narzędzie AI (9.3) dla Ekranu 8, Moduł 4 "Magazyn energii / baterie" — "Symulacja Słabego
 * Ogniwa (Cell Drift & Balancing)". `operationType: 'read'`. Pojemność znamionowa ogniwa i
 * tolerancja fabryczna MUSZĄ pochodzić z karty katalogowej ogniw.
 */
import { z } from "zod"
import { calculateSlabeOgniwo } from "@/lib/core/modules/baterie/slabe-ogniwo/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SlabeOgniwoToolInput = z.object({
  pojemnoscZnamionowaAh: z.number().describe("Pojemność znamionowa ogniwa [Ah] — z karty katalogowej"),
  tolerancjaPct: z.number().describe("Tolerancja fabryczna [%] (domyślnie wg producenta ±3%) — z karty katalogowej"),
})
export type SlabeOgniwoToolInputT = z.infer<typeof SlabeOgniwoToolInput>

export const SlabeOgniwoToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pojemnoscNajslabszegoAh: z.number(),
  utrataPct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SlabeOgniwoToolOutputT = z.infer<typeof SlabeOgniwoToolOutput>

export const slabeOgniwoTool: AiToolDefinition<SlabeOgniwoToolInputT, SlabeOgniwoToolOutputT> = {
  name: "policz_wplyw_slabego_ogniwa",
  description:
    "Liczy pojemność najsłabszego ogniwa w łańcuchu szeregowym (ograniczoną tolerancją fabryczną) i wynikającą " +
    "z tego utratę pojemności całego pakietu w Ah (Moduł 4, Ekran 8, Cell Drift). Pojemność znamionowa i " +
    "tolerancja MUSZĄ pochodzić z karty katalogowej ogniw — nie zgaduj. Użyj, gdy user pyta, ile pojemności " +
    "traci pakiet przez rozrzut fabryczny ogniw.",
  inputSchema: SlabeOgniwoToolInput,
  outputSchema: SlabeOgniwoToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/slabe-ogniwo",
  handler: async (input) => {
    const wynik = calculateSlabeOgniwo({ pojemnoscZnamionowaAh: input.pojemnoscZnamionowaAh, tolerancjaPct: input.tolerancjaPct })
    return {
      status: wynik.status,
      pojemnoscNajslabszegoAh: wynik.value.pojemnoscNajslabszegoAh,
      utrataPct: wynik.value.utrataPct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
