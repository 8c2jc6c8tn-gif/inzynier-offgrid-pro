/**
 * Narzędzie AI (9.3) dla Ekranu 10, Moduł 8 — "Integracja z syreną, monitoringiem i służbami" (dawne 12.55).
 * `operationType: 'read'` — sprawdza konfigurację, NIGDY nie wzywa służb. Zgoda na automatyczne wezwanie —
 * WYŁĄCZNIE wyraźna deklaracja usera, model nigdy jej nie zakłada.
 */
import { z } from "zod"
import { calculatePowiadomieniaAlarmowe } from "@/lib/core/modules/bezpieczenstwo/powiadomienia-alarmowe/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PowiadomieniaAlarmoweToolInput = z.object({
  maSyrene: z.boolean(),
  liczbaKontaktow: z.number().nullable().describe("Liczba kontaktów alarmowych (liczba całkowita ≥ 0)"),
  maKamery: z.boolean(),
  autoWezwanieSluzb: z.boolean().describe("Czy włączono automatyczne wezwanie służb"),
  zgodaNaWezwanieSluzb: z.boolean().describe("Wyraźna, wcześniejsza zgoda usera na automatyczne wezwanie — nigdy domyślnie true"),
})
export type PowiadomieniaAlarmoweToolInputT = z.infer<typeof PowiadomieniaAlarmoweToolInput>

export const PowiadomieniaAlarmoweToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  autoWezwanieAktywne: z.boolean(),
  liczbaBrakow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PowiadomieniaAlarmoweToolOutputT = z.infer<typeof PowiadomieniaAlarmoweToolOutput>

export const powiadomieniaAlarmoweTool: AiToolDefinition<PowiadomieniaAlarmoweToolInputT, PowiadomieniaAlarmoweToolOutputT> = {
  name: "sprawdz_powiadomienia_alarmowe",
  description:
    "Sprawdza konfigurację reakcji na zagrożenie: syrena, kontakty alarmowe, kamery i automatyczne wezwanie służb — to " +
    "ostatnie działa tylko za wyraźną zgodą usera (bez zgody — twardy stop). Niczego nie wysyła (Moduł 8, Ekran 10).",
  inputSchema: PowiadomieniaAlarmoweToolInput,
  outputSchema: PowiadomieniaAlarmoweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/powiadomienia-alarmowe",
  handler: async (input) => {
    const wynik = calculatePowiadomieniaAlarmowe(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
