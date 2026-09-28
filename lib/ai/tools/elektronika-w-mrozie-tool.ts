/**
 * Narzędzie AI (9.3) dla Ekranu 19, Moduł 7 "Stress-test zimowy" — "Wpływ niskich temperatur na
 * elektronikę". `operationType: 'read'`. Minimalne temperatury pracy urządzeń pochodzą z kart
 * katalogowych podanych przez usera — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculateElektronikaWMrozie } from "@/lib/core/modules/stress-test/elektronika-w-mrozie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Typ = z.enum(["BMS", "wyswietlacz", "czujnik", "przetwornica", "regulator", "inne"])

export const ElektronikaWMrozieToolInput = z.object({
  temperaturaMiejscaC: z.number().describe("Minimalna spodziewana temperatura w miejscu montażu [°C] — od usera"),
  urzadzenia: z
    .array(
      z.object({
        nazwa: z.string(),
        typ: Typ,
        minTempPracyC: z.number().nullable().describe("Minimalna temperatura pracy z karty [°C]; null gdy user nie zna — nie zgaduj"),
      }),
    )
    .describe("Urządzenia elektroniczne w tym miejscu"),
})
export type ElektronikaWMrozieToolInputT = z.infer<typeof ElektronikaWMrozieToolInput>

export const ElektronikaWMrozieToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  oceny: z.array(z.object({ nazwa: z.string(), typ: Typ, zapasK: z.number().nullable() })),
  liczbaPonizejMin: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ElektronikaWMrozieToolOutputT = z.infer<typeof ElektronikaWMrozieToolOutput>

export const elektronikaWMrozieTool: AiToolDefinition<ElektronikaWMrozieToolInputT, ElektronikaWMrozieToolOutputT> = {
  name: "sprawdz_elektronike_w_mrozie",
  description:
    "Sprawdza, które urządzenia elektroniczne (BMS, wyświetlacze, czujniki, przetwornice/falowniki, regulatory ładowania) pracują poniżej swojej " +
    "minimalnej temperatury pracy z karty katalogowej przy najniższej temperaturze miejsca montażu (Moduł 7, Ekran 19). " +
    "BMS lub przetwornica/falownik poniżej minimum to twardy stop. Użyj, gdy user pyta, czy sprzęt w garażu/altanie przetrwa mróz.",
  inputSchema: ElektronikaWMrozieToolInput,
  outputSchema: ElektronikaWMrozieToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/elektronika-w-mrozie",
  handler: async (input) => {
    const wynik = calculateElektronikaWMrozie({
      temperaturaMiejscaC: input.temperaturaMiejscaC,
      urzadzenia: input.urzadzenia.map((u, i) => ({ ...u, id: String(i + 1) })),
    })
    return {
      status: wynik.status,
      oceny: wynik.value.oceny.map(({ nazwa, typ, zapasK }) => ({ nazwa, typ, zapasK })),
      liczbaPonizejMin: wynik.value.liczbaPonizejMin,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
