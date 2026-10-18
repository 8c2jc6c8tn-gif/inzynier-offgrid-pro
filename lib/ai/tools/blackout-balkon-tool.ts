/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 40 "Blackout w bloku — zestaw balkonowy" (dawne 8.68, Biblia §12.56).
 * `operationType: 'read'`. Moce, pojemność, sprawności, wymiary i godziny słońca MUSZĄ pochodzić od usera
 * (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBlackoutBalkon } from "@/lib/core/modules/kalkulator-mobilny/blackout-balkon/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BlackoutBalkonToolInput = z.object({
  odbiorniki: z.array(z.object({ nazwa: z.string(), mocW: z.number(), godzinNaDobe: z.number() })).describe("Odbiorniki krytyczne mieszkania"),
  czasBlackoutuH: z.number().describe("Czas blackoutu do przetrwania [h]"),
  pojemnoscWh: z.number().describe("Energia stacji zasilania / akumulatora [Wh]"),
  uzytecznaPct: z.number().describe("Część użyteczna [%] — od usera, nie zgaduj"),
  sprawnoscFalownikaPct: z.number().describe("Sprawność falownika stacji [%] — od usera, nie zgaduj"),
  dlugoscBalustradyM: z.number().describe("Długość balustrady pod panele [m]; 0 = bez panelu"),
  szerokoscPaneluM: z.number().describe("Szerokość panelu wzdłuż balustrady [m]"),
  mocPaneluW: z.number().describe("Moc jednego panelu [W]"),
  godzinSlonca: z.number().describe("Równoważne godziny pełnego słońca na balkonie [h/dobę]"),
  sprawnoscToruPct: z.number().describe("Sprawność toru panel → magazyn [%]"),
})
export type BlackoutBalkonToolInputT = z.infer<typeof BlackoutBalkonToolInput>

export const BlackoutBalkonToolOutput = z.object({
  status: z.enum(STATUSY),
  zuzycieDobaWh: z.number(),
  energiaBlackoutWh: z.number(),
  energiaMagazynuWh: z.number(),
  magazynStarczyH: z.number(),
  liczbaPaneli: z.number(),
  mocPaneliW: z.number(),
  energiaPaneliDobaWh: z.number(),
  bilansWh: z.number().describe("Ujemny = zabraknie na czas blackoutu"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BlackoutBalkonToolOutputT = z.infer<typeof BlackoutBalkonToolOutput>

export const blackoutBalkonTool: AiToolDefinition<BlackoutBalkonToolInputT, BlackoutBalkonToolOutputT> = {
  name: "dobierz_zestaw_balkonowy_na_blackout",
  description:
    "Liczy, ile godzin stacja zasilania lub akumulator podtrzyma krytyczne odbiorniki mieszkania (lodówka, router, " +
    "światło, telefon) i ile dołożą panele na balustradzie balkonu w czasie blackoutu. Użyj, gdy user mieszka " +
    "w bloku i pyta, jak przygotować się na brak prądu albo czy panel balkonowy ze stacją wystarczy.",
  inputSchema: BlackoutBalkonToolInput,
  outputSchema: BlackoutBalkonToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/blackout-balkon",
  handler: async (input) => {
    const wynik = calculateBlackoutBalkon(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
