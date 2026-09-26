/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 2 "Zapotrzebowanie na C.O. i C.W.U." (dawne 5.2).
 * `operationType: 'read'`. Liczba osób, temperatury wody i ciepło miesięcy (z Ekranu 1) tylko od
 * usera — brak → INCOMPLETE albo samo C.W.U., nigdy wartość zgadnięta przez model.
 */
import { z } from "zod"
import { calculateZapotrzebowanieCoCwu } from "@/lib/core/modules/ogrzewanie/zapotrzebowanie-co-cwu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZapotrzebowanieCoCwuToolInput = z.object({
  cieploCoMiesiaceKwh: z
    .array(z.number().nullable())
    .length(12)
    .optional()
    .describe("Ciepło C.O. w miesiącach [kWh/miesiąc], od stycznia — z narzędzia policz_straty_ciepla_budynku; brak → samo C.W.U."),
  liczbaOsob: z.number().int().describe("Liczba domowników — od usera"),
  cwuLitrowNaOsobeDoba: z.number().describe("Ciepła woda na osobę [l/dobę] — źródło podaje ok. 50; zapytaj usera, jeśli ma inną"),
  temperaturaZimnejWodyC: z.number().describe("Temperatura zimnej wody [°C] — od usera"),
  temperaturaCwuC: z.number().describe("Temperatura ciepłej wody [°C] — od usera"),
  copCo: z.number().optional().describe("COP źródła ciepła C.O.; brak → bez prądu"),
  copCwu: z.number().optional().describe("COP podgrzewania wody (grzałka = 1); brak → bez prądu"),
})
export type ZapotrzebowanieCoCwuToolInputT = z.infer<typeof ZapotrzebowanieCoCwuToolInput>

export const ZapotrzebowanieCoCwuToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  cwuKwhDoba: z.number().nullable(),
  cwuPradKwhDoba: z.number().nullable(),
  miesiace: z.array(
    z.object({ miesiac: z.number(), coKwhDoba: z.number(), cwuKwhDoba: z.number(), razemKwhDoba: z.number(), pradKwhDoba: z.number().nullable() }),
  ),
  coSumaKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ZapotrzebowanieCoCwuToolOutputT = z.infer<typeof ZapotrzebowanieCoCwuToolOutput>

export const zapotrzebowanieCoCwuTool: AiToolDefinition<ZapotrzebowanieCoCwuToolInputT, ZapotrzebowanieCoCwuToolOutputT> = {
  name: "policz_zapotrzebowanie_co_cwu",
  description:
    "Dobowe zapotrzebowanie na ciepło: C.O. (ogrzewanie) w miesiącach z ciepła miesięcy policzonego przez " +
    "policz_straty_ciepla_budynku oraz C.W.U. (ciepła woda) z liczby osób, litrów na osobę i temperatur wody " +
    "(Q = m·c·ΔT); prąd przy podanych COP. Bez strat zasobnika i cyrkulacji — zawsze to przekaż. Użyj, gdy user " +
    "pyta, ile ciepła dziennie na ogrzewanie i ciepłą wodę.",
  inputSchema: ZapotrzebowanieCoCwuToolInput,
  outputSchema: ZapotrzebowanieCoCwuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/zapotrzebowanie-co-cwu",
  handler: async (input) => {
    const wynik = calculateZapotrzebowanieCoCwu({
      cieploCoMiesiaceKwh: input.cieploCoMiesiaceKwh ?? Array(12).fill(null),
      liczbaOsob: input.liczbaOsob,
      cwuLitrowNaOsobeDoba: input.cwuLitrowNaOsobeDoba,
      temperaturaZimnejWodyC: input.temperaturaZimnejWodyC,
      temperaturaCwuC: input.temperaturaCwuC,
      copCo: input.copCo ?? null,
      copCwu: input.copCwu ?? null,
    })
    const v = wynik.value
    return {
      status: wynik.status,
      cwuKwhDoba: v?.cwuKwhDoba ?? null,
      cwuPradKwhDoba: v?.cwuPradKwhDoba ?? null,
      miesiace: (v?.miesiace ?? []).map((m) => ({
        miesiac: m.miesiac,
        coKwhDoba: m.coKwhDoba,
        cwuKwhDoba: m.cwuKwhDoba,
        razemKwhDoba: m.razemKwhDoba,
        pradKwhDoba: m.pradKwhDoba,
      })),
      coSumaKwh: v?.coSumaKwh ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
