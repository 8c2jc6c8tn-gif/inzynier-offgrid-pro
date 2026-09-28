/**
 * Narzędzie AI (9.3) dla Ekranu 10, Moduł 7 "Stress-test zimowy" — "Analiza SPOF" (dawne 6.12).
 * `operationType: 'read'`. Redundancję komponentu deklaruje user — model nigdy jej nie zakłada.
 */
import { z } from "zod"
import { calculateAnalizaSpof } from "@/lib/core/modules/stress-test/analiza-spof/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AnalizaSpofToolInput = z.object({
  komponenty: z.array(
    z.object({
      nazwa: z.string(),
      typ: z.enum(["bms", "falownik", "bezpiecznik-glowny", "mppt", "pompa-ciepla", "pompa", "czujnik", "inne"]),
      maRedundancje: z.boolean().describe("Drugi egzemplarz, obejście, zapas lub źródło awaryjne — tylko deklaracja usera"),
    }),
  ),
})
export type AnalizaSpofToolInputT = z.infer<typeof AnalizaSpofToolInput>

export const AnalizaSpofToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  liczbaKomponentow: z.number(),
  liczbaSpof: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AnalizaSpofToolOutputT = z.infer<typeof AnalizaSpofToolOutput>

export const analizaSpofTool: AiToolDefinition<AnalizaSpofToolInputT, AnalizaSpofToolOutputT> = {
  name: "znajdz_pojedyncze_punkty_awarii",
  description:
    "Wskazuje pojedyncze punkty awarii (SPOF) w systemie off-grid — komponenty bez redundancji; BMS bez obejścia to " +
    "twardy stop (Moduł 7, Ekran 10).",
  inputSchema: AnalizaSpofToolInput,
  outputSchema: AnalizaSpofToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/analiza-spof",
  handler: async (input) => {
    const wynik = calculateAnalizaSpof(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
