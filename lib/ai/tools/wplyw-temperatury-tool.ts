/**
 * Narzędzie AI (9.3) dla Ekranu 18, Moduł 3 "Instalacja PV" — "Wpływ temperatury na wydajność".
 * `operationType: 'read'`. Temperatura otoczenia, przyrost temperatury panelu i współczynnik γ
 * MUSZĄ pochodzić z pomiaru/danych lokalizacji i karty katalogowej użytkownika (przyrost i γ są
 * podane w źródle jako zakresy, nie pojedyncze liczby) — model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWplywTemperatury } from "@/lib/core/modules/pv/wplyw-temperatury/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WplywTemperaturyToolInput = z.object({
  temperaturaOtoczeniaC: z.number().describe("Temperatura otoczenia [°C] — dana usera, nie zgaduj"),
  przyrostTemperaturyC: z
    .number()
    .describe("Przyrost temperatury panelu ponad otoczenie [°C], typowo 25-30 — user wpisuje ręcznie, nie zgaduj"),
  gammaPctNaC: z
    .number()
    .describe("Współczynnik temperaturowy mocy γ [%/°C], ujemny, typowo -0,3 do -0,45, z karty katalogowej"),
  mocNominalnaW: z.number().describe("Moc nominalna panelu (STC, 25°C) [W]"),
})
export type WplywTemperaturyToolInputT = z.infer<typeof WplywTemperaturyToolInput>

export const WplywTemperaturyToolOutput = z.object({
  status: z.enum(STATUSY),
  temperaturaPanelaC: z.number(),
  mocRzeczywistaW: z.number(),
  strataPct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WplywTemperaturyToolOutputT = z.infer<typeof WplywTemperaturyToolOutput>

export const wplywTemperaturyTool: AiToolDefinition<WplywTemperaturyToolInputT, WplywTemperaturyToolOutputT> = {
  name: "policz_wplyw_temperatury_na_moc",
  description:
    "Liczy rzeczywistą temperaturę panelu (otoczenie + przyrost) i wynikającą z niej stratę mocy wg " +
    "współczynnika temperaturowego γ (Moduł 3, Ekran 18). Przyrost temperatury i γ są zakresami ze źródła — " +
    "user wpisuje je ręcznie, nie zgaduj. Użyj, gdy user pyta, ile mocy traci panel w upał albo jaka jest " +
    "rzeczywista moc przy danej temperaturze.",
  inputSchema: WplywTemperaturyToolInput,
  outputSchema: WplywTemperaturyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/wplyw-temperatury",
  handler: async (input) => {
    const wynik = calculateWplywTemperatury(input)
    return {
      status: wynik.status,
      temperaturaPanelaC: wynik.value.temperaturaPanelaC,
      mocRzeczywistaW: wynik.value.mocRzeczywistaW,
      strataPct: wynik.value.strataPct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
