/**
 * Narzędzie AI (9.3) dla Ekranu 14, Moduł 4 "Magazyn energii / baterie" — "SoH (State of
 * Health) — prognoza żywotności per ogniwo". `operationType: 'read'`. Rezystancja fabryczna i
 * aktualna MUSZĄ pochodzić z pomiaru — dane bezpieczeństwa (kwalifikacja ogniwa do wymiany).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSohPerOgniwo } from "@/lib/core/modules/baterie/soh-per-ogniwo/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SohPerOgniwoToolInput = z.object({
  rezystancjaFabrycznaMOhm: z.number().describe("Rezystancja wewnętrzna ogniwa fabrycznie (nowe) [mΩ] — z karty katalogowej"),
  rezystancjaAktualnaMOhm: z.number().describe("Aktualnie zmierzona rezystancja wewnętrzna ogniwa [mΩ] — tylko od usera/pomiaru"),
})
export type SohPerOgniwoToolInputT = z.infer<typeof SohPerOgniwoToolInput>

export const SohPerOgniwoToolOutput = z.object({
  status: z.enum(STATUSY),
  wzrostPct: z.number(),
  doWymiany: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SohPerOgniwoToolOutputT = z.infer<typeof SohPerOgniwoToolOutput>

export const sohPerOgniwoTool: AiToolDefinition<SohPerOgniwoToolInputT, SohPerOgniwoToolOutputT> = {
  name: "sprawdz_soh_per_ogniwo",
  description:
    "Liczy wzrost rezystancji wewnętrznej ogniwa względem stanu fabrycznego i kwalifikuje, czy ogniwo powinno " +
    "być wymienione (Moduł 4, Ekran 14, diagnostyka per ogniwo). Rezystancja fabryczna i aktualna MUSZĄ " +
    "pochodzić z karty katalogowej/pomiaru — nie zgaduj. Użyj, gdy user pyta, czy dane ogniwo jest już zużyte " +
    "i wymaga wymiany.",
  inputSchema: SohPerOgniwoToolInput,
  outputSchema: SohPerOgniwoToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/soh-per-ogniwo",
  handler: async (input) => {
    const wynik = calculateSohPerOgniwo({
      rezystancjaFabrycznaMOhm: input.rezystancjaFabrycznaMOhm,
      rezystancjaAktualnaMOhm: input.rezystancjaAktualnaMOhm,
    })
    return {
      status: wynik.status,
      wzrostPct: wynik.value.wzrostPct,
      doWymiany: wynik.value.doWymiany,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
