/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A9 "Ratowanie głęboko rozładowanego ogniwa" (LiFePO4).
 * `operationType: 'read'`. Napięcie ogniwa pochodzi wyłącznie z pomiaru usera — `0` jest
 * prawidłowym, krytycznym wynikiem pomiaru (nie placeholderem), `null` = jeszcze niezmierzone.
 */
import { z } from "zod"
import { calculateRatowanieOgniwa } from "@/lib/core/modules/montaz-baterii/ratowanie-ogniwa/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const RatowanieOgniwaToolInput = z.object({
  napiecieOgniwaV: z
    .number()
    .nullable()
    .describe("Zmierzone napięcie ogniwa [V] — tylko od usera. 0 to prawidłowy wynik krytyczny, null = jeszcze niezmierzone"),
})
export type RatowanieOgniwaToolInputT = z.infer<typeof RatowanieOgniwaToolInput>

export const RatowanieOgniwaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  napiecieOgniwaV: z.number(),
  strefa: z.enum(["krytyczna", "ryzykowna", "bezpieczna"]).nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RatowanieOgniwaToolOutputT = z.infer<typeof RatowanieOgniwaToolOutput>

export const ratowanieOgniwaTool: AiToolDefinition<RatowanieOgniwaToolInputT, RatowanieOgniwaToolOutputT> = {
  name: "ocen_ratowanie_ogniwa",
  description:
    "Ocenia szansę ratowania głęboko rozładowanego ogniwa LiFePO4 (Moduł 11, Ekran A9) na podstawie zmierzonego " +
    "napięcia — trzy strefy 1:1 ze źródła: 0V (krytyczna, ogniwo zerowoltowe), (0, 1,5V] (ryzykowna, ratunek " +
    "opcjonalny niezalecany), >1,5V (bezpieczna, procedura standardowego ratunku). Napięcie ogniwa podaje user " +
    "z pomiaru — nie zgaduj. Użyj, gdy user pyta, czy da się uratować rozładowane ogniwo LiFePO4.",
  inputSchema: RatowanieOgniwaToolInput,
  outputSchema: RatowanieOgniwaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/ratowanie-ogniwa",
  handler: async (input) => {
    const wynik = calculateRatowanieOgniwa({ napiecieOgniwaV: input.napiecieOgniwaV })
    return {
      status: wynik.status,
      napiecieOgniwaV: wynik.value.napiecieOgniwaV,
      strefa: wynik.status === "VALID_WITH_WARNINGS" ? wynik.value.strefa : null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
