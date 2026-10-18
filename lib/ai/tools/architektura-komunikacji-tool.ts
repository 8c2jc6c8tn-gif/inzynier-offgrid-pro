/**
 * Narzędzie AI (9.3) dla Ekranu 4, Moduł 9 "Elektronika / ESP32" — "Architektura komunikacji" (dawne 11.4).
 * `operationType: 'read'`. Obecność transceivera, adresy i prędkości — tylko od usera; model nie zakłada transceivera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateArchitekturaKomunikacji } from "@/lib/core/modules/esp32/architektura-komunikacji/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ArchitekturaKomunikacjiToolInput = z.object({
  polaczenia: z.array(
    z.object({
      nazwa: z.string(),
      protokol: z.enum(["rs485", "can", "wifi", "ethernet", "bluetooth", "lora"]),
      maTransceiver: z.boolean().describe("Jest transceiver (MAX485, SN65HVD230…) — tylko deklaracja usera"),
      adres: z.number().nullable().describe("Adres Modbus na RS485; null gdy nie dotyczy"),
      predkoscBps: z.number().nullable().describe("Prędkość transmisji [bit/s]"),
    }),
  ),
})
export type ArchitekturaKomunikacjiToolInputT = z.infer<typeof ArchitekturaKomunikacjiToolInput>

export const ArchitekturaKomunikacjiToolOutput = z.object({
  status: z.enum(STATUSY),
  liczbaPolaczen: z.number(),
  liczbaProblemow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ArchitekturaKomunikacjiToolOutputT = z.infer<typeof ArchitekturaKomunikacjiToolOutput>

export const architekturaKomunikacjiTool: AiToolDefinition<ArchitekturaKomunikacjiToolInputT, ArchitekturaKomunikacjiToolOutputT> = {
  name: "sprawdz_architekture_komunikacji_esp32",
  description:
    "Sprawdza połączenia ESP32 z falownikiem, BMS i aplikacją: RS485 bez transceivera (twardy stop), CAN bez transceivera, " +
    "powtórzone adresy Modbus i różne prędkości na jednej magistrali (Moduł 9, Ekran 4). Użyj, gdy user pyta, jak podłączyć ESP32 do falownika/BMS (RS485, CAN, Modbus) albo dlaczego komunikacja nie działa.",
  inputSchema: ArchitekturaKomunikacjiToolInput,
  outputSchema: ArchitekturaKomunikacjiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "esp32/architektura-komunikacji",
  handler: async (input) => {
    const wynik = calculateArchitekturaKomunikacji(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
