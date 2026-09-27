/**
 * Narzędzie AI (9.3) dla Ekranu 16, Moduł 4 "Magazyn energii / baterie" — "Tryb Long Term
 * Storage (odstawienie na zimę)". `operationType: 'read'`. Temperatura minimalna w miejscu
 * przechowywania i lista potwierdzonych czynności MUSZĄ pochodzić od usera.
 */
import { z } from "zod"
import { calculateLongTermStorage } from "@/lib/core/modules/baterie/long-term-storage/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const LongTermStorageToolInput = z.object({
  socDocelowyPct: z.number().describe("Docelowy SoC przed odstawieniem [%]"),
  temperaturaMinC: z.number().describe("Najniższa spodziewana temperatura w miejscu przechowywania [°C] — tylko od usera"),
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty procedury odstawienia już potwierdzonych przez usera"),
})
export type LongTermStorageToolInputT = z.infer<typeof LongTermStorageToolInput>

export const LongTermStorageToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  socDocelowyPct: z.number(),
  temperaturaMinC: z.number(),
  socWZakresie: z.boolean(),
  temperaturaBezpieczna: z.boolean(),
  potwierdzoneCzynnosci: z.number(),
  razemCzynnosci: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type LongTermStorageToolOutputT = z.infer<typeof LongTermStorageToolOutput>

export const longTermStorageTool: AiToolDefinition<LongTermStorageToolInputT, LongTermStorageToolOutputT> = {
  name: "sprawdz_tryb_dlugoterminowego_przechowywania",
  description:
    "Sprawdza, czy docelowy SoC i temperatura minimalna miejsca przechowywania są bezpieczne na czas " +
    "odstawienia baterii na zimę, i śledzi postęp checklisty procedury (Moduł 4, Ekran 16). Temperatura i " +
    "lista potwierdzonych czynności pochodzą wyłącznie od usera — nie zgaduj. Użyj, gdy user pyta, jak " +
    "bezpiecznie odstawić baterię na dłuższy postój.",
  inputSchema: LongTermStorageToolInput,
  outputSchema: LongTermStorageToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/long-term-storage",
  handler: async (input) => {
    const wynik = calculateLongTermStorage({
      socDocelowyPct: input.socDocelowyPct,
      temperaturaMinC: input.temperaturaMinC,
      potwierdzoneIds: input.potwierdzoneIds,
    })
    return {
      status: wynik.status,
      socDocelowyPct: wynik.value.socDocelowyPct,
      temperaturaMinC: wynik.value.temperaturaMinC,
      socWZakresie: wynik.value.socWZakresie,
      temperaturaBezpieczna: wynik.value.temperaturaBezpieczna,
      potwierdzoneCzynnosci: wynik.value.potwierdzoneCzynnosci,
      razemCzynnosci: wynik.value.razemCzynnosci,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
