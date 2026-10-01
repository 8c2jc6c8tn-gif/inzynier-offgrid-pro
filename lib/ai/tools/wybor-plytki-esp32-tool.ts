/**
 * Narzędzie AI (9.3) dla Ekranu 1, Moduł 9 "Elektronika / ESP32" — "Wybór płytki ESP32" (dawne 11.1).
 * `operationType: 'read'`. Dopasowanie po cechach wariantów ze źródła; kanałów ADC, flash i poboru prądu nie porównuje.
 */
import { z } from "zod"
import { calculateWyborPlytki } from "@/lib/core/modules/esp32/wybor-plytki/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WyborPlytkiEsp32ToolInput = z.object({
  zasilanie: z.enum(["stale", "bateria", "poe"]).nullable().describe("null = nieznane — wynik INCOMPLETE"),
  duzoGpio: z.boolean(),
  antenaZewnetrzna: z.boolean(),
  mocObliczeniowa: z.boolean(),
  szybkieAdc: z.boolean(),
})
export type WyborPlytkiEsp32ToolInputT = z.infer<typeof WyborPlytkiEsp32ToolInput>

export const WyborPlytkiEsp32ToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  rekomendacja: z.array(z.string()),
  plytki: z.array(z.object({ id: z.string(), dopasowania: z.number() })),
  liczbaPotrzeb: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WyborPlytkiEsp32ToolOutputT = z.infer<typeof WyborPlytkiEsp32ToolOutput>

export const wyborPlytkiEsp32Tool: AiToolDefinition<WyborPlytkiEsp32ToolInputT, WyborPlytkiEsp32ToolOutputT> = {
  name: "dobierz_plytke_esp32",
  description:
    "Poleca wariant płytki ESP32 (DevKit V1, WROOM-32U, S3, C3, POE) po cechach ze źródła: dużo GPIO, antena zewnętrzna, " +
    "moc obliczeniowa, szybkie ADC, praca na baterii, zasilanie PoE (Moduł 9, Ekran 1). Użyj, gdy user pyta, jaką płytkę ESP32 " +
    "kupić do sterownika instalacji off-grid albo czy wybrana płytka pasuje do jego potrzeb.",
  inputSchema: WyborPlytkiEsp32ToolInput,
  outputSchema: WyborPlytkiEsp32ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/wybor-plytki",
  handler: async (input) => {
    const wynik = calculateWyborPlytki(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
