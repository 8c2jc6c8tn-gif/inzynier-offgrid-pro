/**
 * Narzędzie AI (9.3) dla M14 — pole „Wzrost cen energii” ekranów D7/F8. `operationType: 'read'`.
 * Echo silnika `siec/sciezka-cen-energii` (D40–D43): suwak −3/0/+5/+10 %, dynamika EU Reference
 * Scenario 2020 dla Polski albo ta sama dynamika + inflacja. Aplikacja nigdy sama nie prognozuje cen.
 *
 * Kształt wejścia spłaszczony (nie unia) — jak w pilocie `kalkulatory-pomocnicze-tool`: brakujące pole
 * danego trybu handler zwraca jako INCOMPLETE, zamiast wstawiać wartość domyślną.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSciezkaCen, CALCULATOR_VERSION } from "@/lib/core/modules/siec/sciezka-cen-energii/calculator"
import type { TrybSciezki } from "@/lib/core/modules/siec/sciezka-cen-energii/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SciezkaCenEnergiiToolInput = z.object({
  rokBazowy: z.number().int().describe("Rok bazowy cen (rok 0), np. bieżący rok"),
  horyzontLat: z.number().int().min(10).max(25).describe("Horyzont analizy N [lata], 10–25"),
  kosztRocznyZl: z.number().describe("Roczny koszt energii z sieci w cenach roku bazowego [zł/rok] — z faktur usera"),
  rodzaj: z
    .enum(["suwak", "ue", "ue-inflacja"])
    .describe("suwak = stała realna zmiana g %/rok; ue = dynamika EU Reference Scenario 2020 (ceny realne); ue-inflacja = ta sama dynamika + inflacja (kwoty nominalne do zapłaty)"),
  gProcent: z
    .number()
    .optional()
    .describe("Tylko dla suwak: realna zmiana ceny [%/rok] — dozwolone wyłącznie −3, 0, 5 albo 10; zapytaj usera"),
  zrodloInflacji: z
    .enum(["gus", "nbp", "wlasna"])
    .optional()
    .describe("Tylko dla ue-inflacja: źródło inflacji (GUS, cel NBP albo własna usera)"),
  wlasnaInflacjaProcent: z
    .number()
    .nullable()
    .optional()
    .describe("Tylko dla ue-inflacja + wlasna: inflacja [%/rok] podana przez usera; nie zgaduj"),
})
export type SciezkaCenEnergiiToolInputT = z.infer<typeof SciezkaCenEnergiiToolInput>

export const SciezkaCenEnergiiToolOutput = z.object({
  status: z.enum(STATUSY),
  mnozniki: z.array(z.number()),
  mnoznikKoncowy: z.number().nullable(),
  sredniaProcentRok: z.number().nullable(),
  sumaNominalnaZl: z.number().nullable(),
  sumaDzisiejszeZl: z.number().nullable(),
  inflacjaProcent: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SciezkaCenEnergiiToolOutputT = z.infer<typeof SciezkaCenEnergiiToolOutput>

function trybSciezki(input: SciezkaCenEnergiiToolInputT): TrybSciezki | { blad: string } {
  switch (input.rodzaj) {
    case "suwak":
      if (input.gProcent === undefined) return { blad: "Brakuje realnej zmiany ceny (gProcent) dla trybu suwak." }
      return { rodzaj: "suwak", gProcent: input.gProcent }
    case "ue":
      return { rodzaj: "ue" }
    case "ue-inflacja":
      if (input.zrodloInflacji === undefined) return { blad: "Brakuje źródła inflacji (zrodloInflacji) dla trybu ue-inflacja." }
      return { rodzaj: "ue-inflacja", zrodloInflacji: input.zrodloInflacji, wlasnaInflacjaProcent: input.wlasnaInflacjaProcent ?? null }
  }
}

export const sciezkaCenEnergiiTool: AiToolDefinition<SciezkaCenEnergiiToolInputT, SciezkaCenEnergiiToolOutputT> = {
  name: "policz_sciezke_cen_energii",
  description:
    "Liczy, jak zmieni się roczny koszt energii z sieci w horyzoncie 10–25 lat (M14, pole „Wzrost cen energii” D7/F8): " +
    "mnożnik ceny w każdym roku, średnią zmianę %/rok i sumę kosztów w złotych nominalnych i dzisiejszych. Trzy tryby: " +
    "suwak (−3/0/+5/+10 % realnie), dynamika EU Reference Scenario 2020 albo ta sama + inflacja. Aplikacja nie " +
    "prognozuje cen sama — nie podawaj własnej prognozy. Użyj, gdy user pyta, ile zapłaci za prąd z sieci przez " +
    "najbliższe lata albo jak wzrost cen wpływa na opłacalność PV/magazynu/off-grid.",
  inputSchema: SciezkaCenEnergiiToolInput,
  outputSchema: SciezkaCenEnergiiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/sciezka-cen-energii",
  handler: async (input) => {
    const tryb = trybSciezki(input)
    if ("blad" in tryb) {
      return {
        status: "INCOMPLETE",
        mnozniki: [],
        mnoznikKoncowy: null,
        sredniaProcentRok: null,
        sumaNominalnaZl: null,
        sumaDzisiejszeZl: null,
        inflacjaProcent: null,
        ostrzezenia: [tryb.blad],
        zalozenia: [],
        wersjaKalkulatora: CALCULATOR_VERSION,
      }
    }
    const wynik = calculateSciezkaCen({
      rokBazowy: input.rokBazowy,
      horyzontLat: input.horyzontLat,
      kosztRocznyZl: input.kosztRocznyZl,
      tryb,
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
