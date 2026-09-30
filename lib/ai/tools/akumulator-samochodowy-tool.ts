/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 16 "Czas pracy na akumulatorze samochodowym".
 * `operationType: 'read'`. Pojemność, napięcie, część użyteczna i moc MUSZĄ pochodzić od usera —
 * część użyteczną rozruchowego źródło podaje tylko jako zakres 30–50% (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateAkumulatorSamochodowy } from "@/lib/core/modules/kalkulator-mobilny/akumulator-samochodowy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AkumulatorSamochodowyToolInput = z.object({
  typ: z.enum(["rozruchowy", "agm", "kwasowy"]).describe("Typ akumulatora: rozruchowy (zwykły samochodowy), AGM, kwasowy głębokiego rozładowania"),
  pojemnoscAh: z.number().describe("Pojemność znamionowa [Ah] — od usera, z naklejki"),
  napiecieV: z.number().describe("Napięcie akumulatora [V], zwykle 12 — od usera"),
  uzytecznaPct: z
    .number()
    .describe("Część pojemności, którą wolno zużyć [%] — od usera; dla rozruchowego źródło podaje 30–50%, nie zgaduj"),
  mocW: z.number().describe("Łączna moc urządzeń pobierana z akumulatora [W] — od usera"),
  planowanyCzasH: z.number().describe("Planowany czas pracy [h]; 0 gdy user nie podał"),
})
export type AkumulatorSamochodowyToolInputT = z.infer<typeof AkumulatorSamochodowyToolInput>

export const AkumulatorSamochodowyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  czasH: z.number().describe("Czas pracy do granicy części użytecznej [h]"),
  pradA: z.number().describe("Prąd pobierany z akumulatora [A] = P / U"),
  pojemnoscUzytecznaAh: z.number(),
  energiaUzytecznaWh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AkumulatorSamochodowyToolOutputT = z.infer<typeof AkumulatorSamochodowyToolOutput>

export const akumulatorSamochodowyTool: AiToolDefinition<AkumulatorSamochodowyToolInputT, AkumulatorSamochodowyToolOutputT> = {
  name: "policz_czas_pracy_na_akumulatorze_samochodowym",
  description:
    "Liczy, jak długo urządzenia (lodówka, oświetlenie, ładowarki) popracują na akumulatorze samochodowym: " +
    "t = C_Ah × część użyteczna / (P / U). Ostrzega, że akumulator rozruchowy nie jest do głębokiego " +
    "rozładowania, a planowana praca ponad część użyteczną rozruchowego to twardy stop (nie odpalisz auta). " +
    "Użyj, gdy user pyta, ile wytrzyma akumulator w aucie albo czy może zasilać nim urządzenia na postoju.",
  inputSchema: AkumulatorSamochodowyToolInput,
  outputSchema: AkumulatorSamochodowyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/akumulator-samochodowy",
  handler: async (input) => {
    const wynik = calculateAkumulatorSamochodowy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
