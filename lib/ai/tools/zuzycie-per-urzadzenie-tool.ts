/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 11 "Kalkulator zużycia energii
 * per urządzenie". `operationType: 'read'`. Moce, czasy i współczynniki pracy MUSZĄ pochodzić od usera —
 * model nie zgaduje typowych mocy ani współczynnika sprężarki.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateZuzyciePerUrzadzenie } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZuzyciePerUrzadzenieToolInput = z.object({
  urzadzenia: z
    .array(
      z.object({
        nazwa: z.string().describe("Nazwa urządzenia"),
        mocW: z.number().describe("Moc znamionowa [W] — od usera"),
        godzinNaDobe: z.number().describe("Czas włączenia na dobę [h], 0–24 — od usera"),
        cykliczne: z.boolean().describe("true = sprężarka załącza się cyklicznie (lodówka, klimatyzator)"),
        wspolczynnikPracyPct: z
          .number()
          .optional()
          .describe("Współczynnik pracy sprężarki [%] — wymagany dla cyklicznych, od usera, nie zgaduj"),
      }),
    )
    .describe("Lista urządzeń"),
})
export type ZuzyciePerUrzadzenieToolInputT = z.infer<typeof ZuzyciePerUrzadzenieToolInput>

export const ZuzyciePerUrzadzenieToolOutput = z.object({
  status: z.enum(STATUSY),
  urzadzenia: z.array(z.object({ nazwa: z.string(), zuzycieWh: z.number(), zuzycieZnamionoweWh: z.number() })),
  sumaWh: z.number().describe("Łączne zużycie na dobę [Wh]"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ZuzyciePerUrzadzenieToolOutputT = z.infer<typeof ZuzyciePerUrzadzenieToolOutput>

export const zuzyciePerUrzadzenieTool: AiToolDefinition<ZuzyciePerUrzadzenieToolInputT, ZuzyciePerUrzadzenieToolOutputT> = {
  name: "policz_zuzycie_per_urzadzenie",
  description:
    "Liczy dobowe zużycie energii urządzeń małej instalacji (Moduł 12): moc × czas pracy, a dla urządzeń cyklicznych " +
    "(lodówka, klimatyzator) × współczynnik pracy sprężarki (np. lodówka 45 W, 40% → 432 Wh, nie 1080 Wh). " +
    "Użyj, gdy user pyta, ile energii na dobę zużyje jego sprzęt.",
  inputSchema: ZuzyciePerUrzadzenieToolInput,
  outputSchema: ZuzyciePerUrzadzenieToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/zuzycie-per-urzadzenie",
  handler: async (input) => {
    const wynik = calculateZuzyciePerUrzadzenie({
      urzadzenia: input.urzadzenia.map((u, i) => ({ ...u, id: String(i), wspolczynnikPracyPct: u.wspolczynnikPracyPct ?? 0 })),
    })
    return {
      status: wynik.status,
      urzadzenia: wynik.value.urzadzenia.map(({ nazwa, zuzycieWh, zuzycieZnamionoweWh }) => ({ nazwa, zuzycieWh, zuzycieZnamionoweWh })),
      sumaWh: wynik.value.sumaWh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
