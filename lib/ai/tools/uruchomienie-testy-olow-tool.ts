/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B6 "Pierwsze uruchomienie i testy" (kwasowo-ołowiowa).
 * `operationType: 'read'`. Czysty checklist — jedyny wejściowy fakt to lista ID pozycji faktycznie
 * sprawdzonych przez usera.
 */
import { z } from "zod"
import { calculateUruchomienieTestyOlow } from "@/lib/core/modules/montaz-baterii/uruchomienie-testy-olow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const UruchomienieTestyOlowToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty pierwszego uruchomienia i testów, które user faktycznie sprawdził"),
})
export type UruchomienieTestyOlowToolInputT = z.infer<typeof UruchomienieTestyOlowToolInput>

export const UruchomienieTestyOlowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type UruchomienieTestyOlowToolOutputT = z.infer<typeof UruchomienieTestyOlowToolOutput>

export const uruchomienieTestyOlowTool: AiToolDefinition<
  UruchomienieTestyOlowToolInputT,
  UruchomienieTestyOlowToolOutputT
> = {
  name: "sprawdz_uruchomienie_testy_olow",
  description:
    "Sprawdza kompletność pierwszego uruchomienia i testów akumulatorów kwasowo-ołowiowych (Moduł 11, " +
    "Ekran B6). User podaje wyłącznie, które pozycje checklisty faktycznie sprawdził. Użyj, gdy user pyta o " +
    "pierwsze uruchomienie zestawu akumulatorów kwasowych.",
  inputSchema: UruchomienieTestyOlowToolInput,
  outputSchema: UruchomienieTestyOlowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/uruchomienie-testy-olow",
  handler: async (input) => {
    const wynik = calculateUruchomienieTestyOlow({ potwierdzoneIds: input.potwierdzoneIds })
    return {
      status: wynik.status,
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
