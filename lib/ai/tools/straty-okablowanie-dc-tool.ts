/**
 * Narzędzie AI (9.3) dla Ekranu 8, Moduł 3 "Instalacja PV" — "Straty na okablowaniu DC (efekt
 * Joule'a)". `operationType: 'read'`. Długość kabla, prąd, napięcie i przekrój MUSZĄ pochodzić od
 * użytkownika (pomiar trasy kabla, karta katalogowa panelu, wybrany przekrój) — model nigdy ich
 * nie zgaduje.
 */
import { z } from "zod"
import { calculateStratyOkablowanieDc } from "@/lib/core/modules/pv/straty-okablowanie-dc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StratyOkablowanieDcToolInput = z.object({
  dlugoscKablaM: z.number().describe("Długość kabla panel→falownik, jeden odcinek w jedną stronę [m]"),
  pradA: z.number().describe("Prąd roboczy (Imp) [A]"),
  napiecieV: z.number().describe("Napięcie robocze (Vmp) [V]"),
  przekrojMm2: z.number().describe("Przekrój kabla [mm²]"),
})
export type StratyOkablowanieDcToolInputT = z.infer<typeof StratyOkablowanieDcToolInput>

export const StratyOkablowanieDcToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  rezystancjaOhm: z.number(),
  spadekNapieciaV: z.number(),
  strataMocyW: z.number(),
  strataProcentowa: z.number(),
  porownaniePrzekrojow: z.array(
    z.object({
      przekrojMm2: z.number(),
      strataProcentowa: z.number(),
    }),
  ).describe("Porównanie straty dla kilku typowych przekrojów kabla, przy tych samych parametrach"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type StratyOkablowanieDcToolOutputT = z.infer<typeof StratyOkablowanieDcToolOutput>

export const stratyOkablowanieDcTool: AiToolDefinition<
  StratyOkablowanieDcToolInputT,
  StratyOkablowanieDcToolOutputT
> = {
  name: "policz_straty_na_okablowaniu_dc",
  description:
    "Liczy stratę mocy (efekt Joule'a) na kablu DC panel→falownik, wg R = ρ×2L/S (Moduł 3, Ekran 8), i " +
    "porównuje wynik dla kilku typowych przekrojów kabla. Długość, prąd, napięcie i przekrój podaje user z " +
    "pomiaru trasy i karty katalogowej — nie zgaduj. Użyj, gdy user pyta o dobór przekroju kabla DC albo o " +
    "stratę na okablowaniu.",
  inputSchema: StratyOkablowanieDcToolInput,
  outputSchema: StratyOkablowanieDcToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/straty-okablowanie-dc",
  handler: async (input) => {
    const wynik = calculateStratyOkablowanieDc(input)
    return {
      status: wynik.status,
      rezystancjaOhm: wynik.value.rezystancjaOhm,
      spadekNapieciaV: wynik.value.spadekNapieciaV,
      strataMocyW: wynik.value.strataMocyW,
      strataProcentowa: wynik.value.strataProcentowa,
      porownaniePrzekrojow: wynik.value.porownaniePrzekrojow,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
