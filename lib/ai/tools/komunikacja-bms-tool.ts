/**
 * Narzędzie AI (9.3) — Moduł 4, Ekran 20 „Komunikacja BMS — CAN/RS485/Modbus” (dawne 3.22).
 * `operationType: 'read'`. Echo silnika `baterie/komunikacja-bms`: zgodność protokołu BMS
 * z protokołem falownika/ładowarki (równość 1:1 ze źródła, bez cennika konwerterów).
 */
import { z } from "zod"
import { calculateKomunikacjaBms } from "@/lib/core/modules/baterie/komunikacja-bms/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const PROTOKOL = z.enum(["can", "rs485", "modbus", "pylontech", "inny"])

export const KomunikacjaBmsToolInput = z.object({
  protokolBms: PROTOKOL.describe(
    "Protokół komunikacji BMS baterii: can, rs485, modbus, pylontech (protokół producenta) albo inny/nieznany",
  ),
  protokolFalownika: PROTOKOL.describe("Protokół obsługiwany przez falownik/ładowarkę — te same wartości"),
})
export type KomunikacjaBmsToolInputT = z.infer<typeof KomunikacjaBmsToolInput>

export const KomunikacjaBmsToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zgodne: z.boolean().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KomunikacjaBmsToolOutputT = z.infer<typeof KomunikacjaBmsToolOutput>

export const komunikacjaBmsTool: AiToolDefinition<KomunikacjaBmsToolInputT, KomunikacjaBmsToolOutputT> = {
  name: "sprawdz_komunikacje_bms",
  description:
    "Sprawdza, czy protokół komunikacji BMS baterii (CAN, RS485, Modbus, Pylontech) zgadza się z protokołem " +
    "falownika lub ładowarki (Moduł 4, Ekran 20); przy niezgodności zwraca ostrzeżenie o potrzebie konwertera. " +
    "Protokół spoza listy → OUT_OF_SCOPE (sprawdzić w dokumentacji producenta). Użyj, gdy user pyta, czy bateria " +
    "„dogada się” z falownikiem, jaki protokół wybrać albo czy potrzebny jest konwerter komunikacji.",
  inputSchema: KomunikacjaBmsToolInput,
  outputSchema: KomunikacjaBmsToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/komunikacja-bms",
  handler: async (input) => {
    const wynik = calculateKomunikacjaBms(input)
    return {
      status: wynik.status,
      zgodne: wynik.value.zgodne,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
