/**
 * Narzędzie AI (9.3) dla Ekranu 6, Moduł 9 "Elektronika / ESP32" — "Konfiguracja niezawodności" (dawne 11.29–11.50).
 * `operationType: 'read'`. Stan przełączników — tylko deklaracja usera; model nie zakłada weryfikacji podpisu OTA.
 */
import { z } from "zod"
import { calculateNiezawodnoscEsp32 } from "@/lib/core/modules/esp32/niezawodnosc-esp32/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const NiezawodnoscEsp32ToolInput = z.object({
  kartaSd: z.boolean(),
  rtc: z.boolean(),
  podtrzymanieZasilania: z.boolean(),
  watchdog: z.boolean(),
  izolacjaGalwaniczna: z.boolean(),
  ochronaPrzepieciowa: z.boolean(),
  ota: z.boolean(),
  redundancjaMasterSlave: z.boolean(),
  otaPodpis: z.boolean().describe("OTA weryfikuje podpis cyfrowy — tylko deklaracja usera"),
  otaSumaKontrolna: z.boolean(),
  otaRollback: z.boolean(),
})
export type NiezawodnoscEsp32ToolInputT = z.infer<typeof NiezawodnoscEsp32ToolInput>

export const NiezawodnoscEsp32ToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  liczbaWlaczonych: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type NiezawodnoscEsp32ToolOutputT = z.infer<typeof NiezawodnoscEsp32ToolOutput>

export const niezawodnoscEsp32Tool: AiToolDefinition<NiezawodnoscEsp32ToolInputT, NiezawodnoscEsp32ToolOutputT> = {
  name: "sprawdz_niezawodnosc_esp32",
  description:
    "Sprawdza ustawienia niezawodności sterownika ESP32 (SD, RTC, podtrzymanie, watchdog, izolacja, ochrona przepięciowa, OTA, " +
    "redundancja); OTA bez weryfikacji podpisu to twardy stop, bez sumy kontrolnej i rollbacku — ostrzeżenie (Moduł 9, Ekran 6).",
  inputSchema: NiezawodnoscEsp32ToolInput,
  outputSchema: NiezawodnoscEsp32ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/niezawodnosc-esp32",
  handler: async (input) => {
    const wynik = calculateNiezawodnoscEsp32(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
