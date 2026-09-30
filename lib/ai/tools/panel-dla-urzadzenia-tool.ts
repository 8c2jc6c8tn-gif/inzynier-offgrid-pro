/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 6 "Szybki dobór paneli PV dla pojedynczego urządzenia".
 * `operationType: 'read'`. Godziny słońca i uzysk MUSZĄ pochodzić od usera — 70% ze źródła to tylko
 * przykład (Dyrektywa #1).
 */
import { z } from "zod"
import { calculatePanelDlaUrzadzenia } from "@/lib/core/modules/kalkulator-mobilny/panel-dla-urzadzenia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PanelDlaUrzadzeniaToolInput = z.object({
  mocUrzadzeniaW: z.number().describe("Moc urządzenia [W] — od usera"),
  godzinPracy: z.number().describe("Godziny pracy urządzenia na dobę [h]"),
  godzinSlonca: z.number().describe("Równoważne godziny pełnego słońca na dobę [h] — od usera, nie zgaduj"),
  uzyskPct: z.number().describe("Uzysk z mocy nominalnej panelu [%] — od usera, nie zgaduj"),
  posiadanyPanelW: z.number().describe("Moc panelu, który user już ma [W]; 0 = tylko dobór"),
})
export type PanelDlaUrzadzeniaToolInputT = z.infer<typeof PanelDlaUrzadzeniaToolInput>

export const PanelDlaUrzadzeniaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zuzycieWh: z.number().describe("Zużycie urządzenia na dobę [Wh]"),
  minimalnaMocPaneluW: z.number().describe("Minimalna moc panelu [W]"),
  produkcjaPosiadanegoWh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PanelDlaUrzadzeniaToolOutputT = z.infer<typeof PanelDlaUrzadzeniaToolOutput>

export const panelDlaUrzadzeniaTool: AiToolDefinition<PanelDlaUrzadzeniaToolInputT, PanelDlaUrzadzeniaToolOutputT> = {
  name: "dobierz_panel_dla_jednego_urzadzenia",
  description:
    "Dobiera minimalną moc panelu PV dla jednego urządzenia: zużycie E = P × h, panel = E / (godziny słońca " +
    "× uzysk); porównuje z panelem, który user ma. Użyj, gdy user pyta, jaki panel wystarczy do lodówki, " +
    "pompy, oświetlenia albo innego pojedynczego urządzenia.",
  inputSchema: PanelDlaUrzadzeniaToolInput,
  outputSchema: PanelDlaUrzadzeniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/panel-dla-urzadzenia",
  handler: async (input) => {
    const wynik = calculatePanelDlaUrzadzenia(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
