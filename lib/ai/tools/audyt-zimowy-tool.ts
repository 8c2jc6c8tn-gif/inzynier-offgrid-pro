/**
 * Narzędzie AI (9.3) dla Modułu 10, Ekran 12 — generalny audyt zimowy (dawne 12.36). `operationType: 'read'`.
 * Stan każdego punktu i ilości paliwa — wyłącznie od usera; model nie zgaduje, co zostało zrobione.
 */
import { z } from "zod"
import { calculateAudytZimowy } from "@/lib/core/modules/ai/audyt-zimowy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Stan = z.enum(["gotowe", "zaplanowane", "brak", "nie-dotyczy"]).nullable()

export const AudytZimowyToolInput = z.object({
  pozycje: z
    .object({
      "test-generatora": Stan.optional(),
      "test-webasto": Stan.optional(),
      "przeglad-grzewczej": Stan.optional(),
      "zapas-paliwa": Stan.optional(),
      "grzalki-bms": Stan.optional(),
    })
    .describe("Stan każdego punktu wg usera: gotowe / zaplanowane (ale niewykonane) / brak / nie-dotyczy; null = nieocenione"),
  zapasPaliwaL: z.number().nullable().describe("Zapas paliwa [l] — od usera; null = nie podano"),
  wymaganyZapasL: z.number().nullable().describe("Potrzebny zapas paliwa na zimę [l] — od usera; null = nie podano"),
})
export type AudytZimowyToolInputT = z.infer<typeof AudytZimowyToolInput>

export const AudytZimowyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pozycje: z.array(z.object({ id: z.string(), stan: z.string(), zLiczb: z.boolean() })),
  gotowe: z.number(),
  liczbaPozycji: z.number(),
  braki: z.array(z.string()),
  brakPaliwaL: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AudytZimowyToolOutputT = z.infer<typeof AudytZimowyToolOutput>

export const audytZimowyTool: AiToolDefinition<AudytZimowyToolInputT, AudytZimowyToolOutputT> = {
  name: "podsumuj_audyt_zimowy",
  description:
    "Raport gotowości na zimę z listy źródła: test generatora, test webasto, przegląd instalacji grzewczej, zapas " +
    "paliwa (z liczb, gdy user poda zapas i potrzebę) i grzałki BMS — ile punktów gotowych i co zostało. Użyj, gdy " +
    "user pyta, czy jest gotowy na zimę, co sprawdzić przed sezonem grzewczym albo czy ma dość paliwa na zimę.",
  inputSchema: AudytZimowyToolInput,
  outputSchema: AudytZimowyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ai/audyt-zimowy",
  handler: async (input) => {
    const wynik = calculateAudytZimowy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
