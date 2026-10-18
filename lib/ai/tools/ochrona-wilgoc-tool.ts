/**
 * Narzędzie AI (9.3) dla Ekranu 10, Moduł 4 "Magazyn energii / baterie" — "Ochrona przed
 * wilgocią i kondensacją". `operationType: 'read'`. Temperatura otoczenia, wilgotność i
 * temperatura obudowy/ogniw MUSZĄ pochodzić z pomiaru usera (wzór Magnusa-Tetensa na punkt rosy).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOchronaWilgoc } from "@/lib/core/modules/baterie/ochrona-wilgoc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OchronaWilgocToolInput = z.object({
  temperaturaOtoczeniaC: z.number().describe("Temperatura otoczenia [°C], do wzoru punktu rosy — z pomiaru"),
  wilgotnoscPct: z.number().describe("Wilgotność względna [%] — z pomiaru"),
  temperaturaObudowyC: z.number().describe("Zmierzona/spodziewana temperatura obudowy lub ogniw [°C] — porównywana z punktem rosy"),
  srodowiskoWilgotne: z.boolean().describe("Czy miejsce jest narażone na wilgoć (garaż, komora zewnętrzna)"),
  ipKod: z.number().describe("Kod IP obudowy (np. 55 dla IP55) — z karty katalogowej"),
})
export type OchronaWilgocToolInputT = z.infer<typeof OchronaWilgocToolInput>

export const OchronaWilgocToolOutput = z.object({
  status: z.enum(STATUSY),
  punktRosyC: z.number(),
  temperaturaObudowyC: z.number(),
  ryzykoKondensacji: z.boolean(),
  ipWystarczajace: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OchronaWilgocToolOutputT = z.infer<typeof OchronaWilgocToolOutput>

export const ochronaWilgocTool: AiToolDefinition<OchronaWilgocToolInputT, OchronaWilgocToolOutputT> = {
  name: "sprawdz_ryzyko_kondensacji",
  description:
    "Liczy punkt rosy (wzór Magnusa-Tetensa) z temperatury otoczenia i wilgotności, porównuje z temperaturą " +
    "obudowy/ogniw i sprawdza, czy ryzyko kondensacji jest realne oraz czy kod IP obudowy wystarcza (Moduł 4, " +
    "Ekran 10). Temperatura, wilgotność i kod IP MUSZĄ pochodzić z pomiaru/karty katalogowej — nie zgaduj. " +
    "Użyj, gdy user pyta o ryzyko kondensacji na baterii/obudowie.",
  inputSchema: OchronaWilgocToolInput,
  outputSchema: OchronaWilgocToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/ochrona-wilgoc",
  handler: async (input) => {
    const wynik = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: input.temperaturaOtoczeniaC,
      wilgotnoscPct: input.wilgotnoscPct,
      temperaturaObudowyC: input.temperaturaObudowyC,
      srodowiskoWilgotne: input.srodowiskoWilgotne,
      ipKod: input.ipKod,
    })
    return {
      status: wynik.status,
      punktRosyC: wynik.value.punktRosyC,
      temperaturaObudowyC: wynik.value.temperaturaObudowyC,
      ryzykoKondensacji: wynik.value.ryzykoKondensacji,
      ipWystarczajace: wynik.value.ipWystarczajace,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
