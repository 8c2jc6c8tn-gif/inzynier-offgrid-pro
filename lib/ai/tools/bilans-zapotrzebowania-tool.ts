/**
 * Narzędzie AI (9.3) dla Modułu 2 — „Bilans zapotrzebowania” (D-3). `operationType: 'read'`. Pozycje dobowe [kWh/dobę] podaje
 * user (albo pochodzą z liczb jego projektu) — narzędzie tylko sumuje, nie zgaduje brakujących pozycji.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBilansZapotrzebowania } from "@/lib/core/modules/zapotrzebowanie/bilans-zapotrzebowania/calculator"
import { ZRODLA_BILANSU } from "@/lib/core/modules/zapotrzebowanie/bilans-zapotrzebowania/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BilansZapotrzebowaniaToolInput = z.object({
  pozycje: z
    .array(
      z.object({
        zrodlo: z.enum(ZRODLA_BILANSU).describe("Rodzaj pozycji: lista odbiorników, bojler, standby, pobór falownika, urządzenia zmienne, kategorie specjalne, urządzenie sezonowe"),
        kwhDobaTypowa: z.number().describe("Zużycie tej pozycji w typowej dobie [kWh/dobę] — od usera"),
        kwhDobaMiesiace: z
          .array(z.number())
          .length(12)
          .nullable()
          .describe("Zużycie dobowe w 12 miesiącach od stycznia [kWh/dobę] dla pozycji sezonowych; null = tak samo przez cały rok"),
      }),
    )
    .describe("Pozycje dobowego zużycia obiektu — wyłącznie od usera"),
  buforPct: z.number().nullable().describe("Bufor na rozbudowę [%]; null = bez bufora"),
})
export type BilansZapotrzebowaniaToolInputT = z.infer<typeof BilansZapotrzebowaniaToolInput>

export const BilansZapotrzebowaniaToolOutput = z.object({
  status: z.enum(STATUSY),
  typowaKwh: z.number(),
  typowaZBuforemKwh: z.number(),
  najgorszyMiesiac: z.number().nullable().describe("1–12; null gdy nic nie zsumowano"),
  najgorszyKwh: z.number(),
  najgorszyZBuforemKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BilansZapotrzebowaniaToolOutputT = z.infer<typeof BilansZapotrzebowaniaToolOutput>

export const bilansZapotrzebowaniaTool: AiToolDefinition<BilansZapotrzebowaniaToolInputT, BilansZapotrzebowaniaToolOutputT> = {
  name: "policz_bilans_zapotrzebowania",
  description:
    "Sumuje dobowe zużycie energii obiektu z pozycji (odbiorniki, bojler, standby, pobór własny falownika, urządzenia zmienne, " +
    "kategorie specjalne, urządzenie sezonowe): doba typowa i najgorszy miesiąc [kWh/dobę], z buforem na rozbudowę i bez — " +
    "Moduł 2, Bilans zapotrzebowania. Pozycje podaje user — nie zgaduj brakujących. Użyj, gdy user pyta, ile energii na dobę " +
    "potrzebuje cały dom/obiekt, albo chce zsumować kilka znanych zużyć.",
  inputSchema: BilansZapotrzebowaniaToolInput,
  outputSchema: BilansZapotrzebowaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/bilans-zapotrzebowania",
  handler: async (input) => {
    const wynik = calculateBilansZapotrzebowania({
      pozycje: input.pozycje.map((p) => ({
        zrodlo: p.zrodlo,
        wlaczona: true,
        kwhDobaTypowa: p.kwhDobaTypowa,
        kwhDobaMiesiace: p.kwhDobaMiesiace ?? Array(12).fill(p.kwhDobaTypowa),
      })),
      buforPct: input.buforPct,
    })
    return {
      status: wynik.status,
      typowaKwh: wynik.value.typowaKwh,
      typowaZBuforemKwh: wynik.value.typowaZBuforemKwh,
      najgorszyMiesiac: wynik.value.najgorszyMiesiac === null ? null : wynik.value.najgorszyMiesiac + 1,
      najgorszyKwh: wynik.value.najgorszyKwh,
      najgorszyZBuforemKwh: wynik.value.najgorszyZBuforemKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
