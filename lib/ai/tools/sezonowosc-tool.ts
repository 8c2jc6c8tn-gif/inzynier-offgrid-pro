/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 6 "Sezonowość i tryb wakacyjny". `operationType: 'read'`.
 * Zapotrzebowanie urządzenia, typ sezonowości i granice miesięcy pochodzą WYŁĄCZNIE od usera —
 * źródło nie definiuje uniwersalnych granic "lata"/"zimy" dla wszystkich urządzeń, nie zgaduj ich.
 */
import { z } from "zod"
import { calculateSezonowosc } from "@/lib/core/modules/zapotrzebowanie/sezonowosc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SezonowoscToolInput = z.object({
  zapotrzebowanieKwhDoba: z.number().describe("Zapotrzebowanie urządzenia w okresie aktywności [kWh/dobę] — od usera"),
  typ: z.enum(["caloroczny", "sezonowy", "weekendowy"]).describe("Typ trybu pracy urządzenia"),
  miesiacOd: z.number().optional().describe("Miesiąc początku sezonu (1-12) — tylko dla typ='sezonowy', od usera"),
  miesiacDo: z.number().optional().describe("Miesiąc końca sezonu (1-12) — tylko dla typ='sezonowy', od usera"),
  aktualnyMiesiac: z.number().optional().describe("Miesiąc, dla którego sprawdzamy aktywność (1-12) — tylko dla typ='sezonowy'"),
  czyWeekend: z.boolean().optional().describe("Czy dzisiaj jest weekend — tylko dla typ='weekendowy'"),
})
export type SezonowoscToolInputT = z.infer<typeof SezonowoscToolInput>

export const SezonowoscToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  aktywne: z.boolean(),
  zapotrzebowanieWliczoneKwhDoba: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SezonowoscToolOutputT = z.infer<typeof SezonowoscToolOutput>

export const sezonowoscTool: AiToolDefinition<SezonowoscToolInputT, SezonowoscToolOutputT> = {
  name: "sprawdz_aktywnosc_sezonowa_urzadzenia",
  description:
    "Sprawdza, czy urządzenie jest dziś aktywne (całoroczne / sezonowe / tylko weekendowe) i ile z jego " +
    "zapotrzebowania wlicza się do bieżącego bilansu [kWh/dobę] — Moduł 2, Ekran 6. Granice sezonu ustala user " +
    "per urządzenie — nie zakładaj uniwersalnych miesięcy 'lata'/'zimy'. Użyj, gdy user pyta, czy dane urządzenie " +
    "sezonowe (np. klimatyzacja) liczy się dzisiaj do zapotrzebowania.",
  inputSchema: SezonowoscToolInput,
  outputSchema: SezonowoscToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/sezonowosc",
  handler: async (input) => {
    const wynik = calculateSezonowosc({
      zapotrzebowanieKwhDoba: input.zapotrzebowanieKwhDoba,
      typ: input.typ,
      miesiacOd: input.miesiacOd ?? 0,
      miesiacDo: input.miesiacDo ?? 0,
      aktualnyMiesiac: input.aktualnyMiesiac ?? 0,
      czyWeekend: input.czyWeekend ?? false,
    })
    return {
      status: wynik.status,
      aktywne: wynik.value.aktywne,
      zapotrzebowanieWliczoneKwhDoba: wynik.value.zapotrzebowanieWliczoneKwhDoba,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
