/**
 * Narzędzie AI (9.3) dla Ekranu 8, Moduł 7 "Stress-test zimowy" — "Agregat w mrozie".
 * `operationType: 'read'`. Parametry agregatu (praca ciągła, przerwa, zużycie, interwał oleju)
 * pochodzą z instrukcji producenta podanej przez usera — model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAgregatWMrozie } from "@/lib/core/modules/stress-test/agregat-w-mrozie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"
import { MiejsceAgregatuSchema, PodlaczenieAgregatuSchema } from "./agregat-bezpieczenstwo-schema"

const liczbaLubNull = (opis: string) => z.number().nullable().describe(opis)

export const AgregatWMrozieToolInput = z.object({
  paliwo: z.enum(["diesel-zwykly", "diesel-arktyczny", "benzyna", "inne"]).nullable(),
  temperaturaMiejscaC: liczbaLubNull("Najniższa temperatura w miejscu agregatu [°C]"),
  wymaganyCzasPracyH: liczbaLubNull("Łączny czas pracy w scenariuszu [h]"),
  maxPracaCiaglaH: liczbaLubNull("Maks. czas pracy ciągłej wg producenta [h]; null gdy nieznany — nie zgaduj"),
  przerwaH: liczbaLubNull("Wymagana przerwa [h]"),
  zuzyciePaliwaLH: liczbaLubNull("Zużycie paliwa [l/h]; null gdy nieznane — nie zgaduj"),
  interwalWymianyOlejuH: liczbaLubNull("Interwał wymiany oleju [h]; null gdy nieznany — nie zgaduj"),
  dniPostoju: liczbaLubNull("Dni bez uruchamiania"),
  miejsceAgregatu: MiejsceAgregatuSchema,
  podlaczenieAgregatu: PodlaczenieAgregatuSchema,
})
export type AgregatWMrozieToolInputT = z.infer<typeof AgregatWMrozieToolInput>

export const AgregatWMrozieToolOutput = z.object({
  status: z.enum(STATUSY),
  paliwoL: z.number().nullable(),
  wymianyOleju: z.number().nullable(),
  liczbaPrzerw: z.number().nullable(),
  czasKalendarzowyH: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AgregatWMrozieToolOutputT = z.infer<typeof AgregatWMrozieToolOutput>

export const agregatWMrozieTool: AiToolDefinition<AgregatWMrozieToolInputT, AgregatWMrozieToolOutputT> = {
  name: "sprawdz_agregat_w_mrozie",
  description:
    "Liczy paliwo, wymiany oleju i przerwy agregatu w scenariuszu zimowym (np. tydzień blackoutu) z danych " +
    "producenta oraz ostrzega przed długim postojem w mrozie i ryzykiem rozruchu: zwykły diesel 🟡 od +10°C, " +
    "🔴 poniżej +5°C, każdy diesel 🟡 od −10°C (akumulator, świece żarowe), benzyna ℹ️ poniżej 0°C — progi z praktyki " +
    "(decyzja właściciela), nie z normy (Moduł 7, Ekran 8). Użyj, gdy user pyta, ile paliwa i serwisu zużyje agregat w długim zimowym scenariuszu albo czy agregat odpali w mrozie.",
  inputSchema: AgregatWMrozieToolInput,
  outputSchema: AgregatWMrozieToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/agregat-w-mrozie",
  handler: async (input) => {
    const wynik = calculateAgregatWMrozie({
      ...input,
      miejsceAgregatu: input.miejsceAgregatu ?? null,
      podlaczenieAgregatu: input.podlaczenieAgregatu ?? null,
    })
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
