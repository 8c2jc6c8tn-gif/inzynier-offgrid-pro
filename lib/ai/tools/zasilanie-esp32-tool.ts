/**
 * Narzędzie AI (9.3) dla Ekranu 2, Moduł 9 "Elektronika / ESP32" — "Zasilanie ESP32 z magistrali" (dawne 11.2).
 * `operationType: 'read'`. Parametry przetwornicy — z karty katalogowej podanej przez usera; model ich nie zgaduje.
 */
import { z } from "zod"
import { calculateZasilanieEsp32 } from "@/lib/core/modules/esp32/zasilanie-esp32/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const n = (opis: string) => z.number().nullable().describe(opis)

export const ZasilanieEsp32ToolInput = z.object({
  sposob: z.enum(["przetwornica", "bezposrednio"]).nullable(),
  napiecieMagistraliV: n("Napięcie nominalne magistrali [V]"),
  napiecieMagistraliMaxV: n("Najwyższe napięcie magistrali przy ładowaniu [V]; null = nominalne"),
  poborMocyW: n("Pobór ESP32 + czujników [W]"),
  napiecieWyjscioweV: n("Napięcie wyjściowe przetwornicy [V] (5 lub 3,3)"),
  napiecieWejscioweMaxV: n("Maks. napięcie wejściowe przetwornicy z karty [V]; null gdy nieznane — nie zgaduj"),
  pradWyjsciowyMaxA: n("Maks. prąd wyjściowy przetwornicy z karty [A]"),
  sprawnoscPct: n("Sprawność przetwornicy [%]"),
})
export type ZasilanieEsp32ToolInputT = z.infer<typeof ZasilanieEsp32ToolInput>

export const ZasilanieEsp32ToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pradWyjsciowyA: z.number().nullable(),
  pradWejsciowyA: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ZasilanieEsp32ToolOutputT = z.infer<typeof ZasilanieEsp32ToolOutput>

export const zasilanieEsp32Tool: AiToolDefinition<ZasilanieEsp32ToolInputT, ZasilanieEsp32ToolOutputT> = {
  name: "sprawdz_zasilanie_esp32",
  description:
    "Sprawdza zasilanie ESP32 z magistrali 12/24/48 V: czy jest przetwornica (bez niej — twardy stop), czy jej napięcie " +
    "wejściowe wytrzyma najwyższe napięcie magistrali i czy starczy prądu; liczy prąd z magistrali (Moduł 9, Ekran 2).",
  inputSchema: ZasilanieEsp32ToolInput,
  outputSchema: ZasilanieEsp32ToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/zasilanie-esp32",
  handler: async (input) => {
    const wynik = calculateZasilanieEsp32(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
