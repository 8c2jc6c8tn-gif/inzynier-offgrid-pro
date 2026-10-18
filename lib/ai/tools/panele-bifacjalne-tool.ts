/**
 * Narzędzie AI (9.3) dla Ekranu 16, Moduł 3 "Instalacja PV" — "Panele bifacjalne".
 * `operationType: 'read'`. Roczny uzysk bazowy MUSI pochodzić z obliczenia produkcji użytkownika
 * (np. Ekranu "kąt i azymut"), a procent dodatkowego uzysku bifacjalnego — z ręcznego wpisu
 * usera w zakresie typowym dla wybranej powierzchni (źródło podaje zakres, nie jedną liczbę) —
 * model nigdy nie zgaduje żadnej z tych wartości.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePaneleBifacjalne } from "@/lib/core/modules/pv/panele-bifacjalne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PaneleBifacjalneToolInput = z.object({
  mocRocznaBazowaKwh: z.number().describe("Roczny uzysk energii z samej przedniej strony paneli (bez efektu bifacjalnego) [kWh]"),
  typPowierzchni: z
    .enum(["biala_membrana", "jasny_beton", "piasek", "trawa"])
    .describe("Typ powierzchni pod spodem paneli"),
  dodatkowyUzyskPct: z
    .number()
    .describe(
      "Dodatkowy uzysk z tylnej strony (bifacjalny) [%] — user wpisuje ręcznie w zakresie typowym dla wybranej " +
        "powierzchni (źródło podaje zakres, nie jedną liczbę); nie zgaduj",
    ),
})
export type PaneleBifacjalneToolInputT = z.infer<typeof PaneleBifacjalneToolInput>

export const PaneleBifacjalneToolOutput = z.object({
  status: z.enum(STATUSY),
  dodatkowyUzyskKwh: z.number(),
  calkowityUzyskKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PaneleBifacjalneToolOutputT = z.infer<typeof PaneleBifacjalneToolOutput>

export const paneleBifacjalneTool: AiToolDefinition<PaneleBifacjalneToolInputT, PaneleBifacjalneToolOutputT> = {
  name: "policz_dodatkowy_uzysk_bifacjalny",
  description:
    "Liczy dodatkowy roczny uzysk energii z tylnej strony paneli bifacjalnych jako procent uzysku bazowego " +
    "(Moduł 3, Ekran 16). Procent zależy od albedo powierzchni pod spodem (biała membrana/jasny beton/piasek/ " +
    "trawa) i user wpisuje go ręcznie w zakresie typowym dla wybranej powierzchni — nie zgaduj tego procenta " +
    "ani uzysku bazowego. Użyj, gdy user pyta o zysk z paneli bifacjalnych.",
  inputSchema: PaneleBifacjalneToolInput,
  outputSchema: PaneleBifacjalneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/panele-bifacjalne",
  handler: async (input) => {
    const wynik = calculatePaneleBifacjalne(input)
    return {
      status: wynik.status,
      dodatkowyUzyskKwh: wynik.value.dodatkowyUzyskKwh,
      calkowityUzyskKwh: wynik.value.calkowityUzyskKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
