/**
 * Narzędzie AI (9.3) dla Ekranu 32, Moduł 4 "Magazyn energii / baterie" — "Hierarchia ładowania
 * (PV > Agregat > Sieć)". `operationType: 'read'`. Klasyfikator dyskretny wg priorytetów (nie
 * wzór liczbowy) — dostępność PV/agregatu/sieci, SoC i prognoza słońca MUSZĄ pochodzić z
 * live danych/pomiaru usera, nigdy zgadywane.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateHierarchiaLadowania } from "@/lib/core/modules/baterie/hierarchia-ladowania/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const HierarchiaLadowaniaToolInput = z.object({
  produkcjaPvDostepnaTeraz: z.boolean().describe("Czy jest teraz dostępna produkcja PV — tylko od usera"),
  socAktualnyPct: z.number().describe("Aktualny SoC baterii [%]"),
  socProguKrytycznegoPct: z.number().describe("Próg krytyczny SoC, poniżej którego uruchamia się agregat [%]"),
  prognozaSloncaJutro: z.boolean().describe("Czy prognoza pogody zapowiada słońce jutro — tylko od usera, nie zgaduj pogody"),
  agregatDostepny: z.boolean().describe("Czy agregat jest dostępny/sprawny"),
  siecDostepna: z.boolean().describe("Czy sieć energetyczna jest dostępna (system hybrydowy)"),
  taniaTaryfaNocna: z.boolean().describe("Czy obecnie obowiązuje tania taryfa nocna"),
})
export type HierarchiaLadowaniaToolInputT = z.infer<typeof HierarchiaLadowaniaToolInput>

export const HierarchiaLadowaniaToolOutput = z.object({
  status: z.enum(STATUSY),
  zrodlo: z.enum(["PV", "AGREGAT", "SIEC", "BRAK"]),
  pozniejSocPonizejProgu: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type HierarchiaLadowaniaToolOutputT = z.infer<typeof HierarchiaLadowaniaToolOutput>

export const hierarchiaLadowaniaTool: AiToolDefinition<HierarchiaLadowaniaToolInputT, HierarchiaLadowaniaToolOutputT> = {
  name: "wyznacz_zrodlo_ladowania_wg_hierarchii",
  description:
    "Wyznacza źródło ładowania wg hierarchii PV > Agregat > Sieć (Moduł 4, Ekran 32): PV zawsze pierwsze, " +
    "agregat gdy SoC poniżej progu krytycznego i brak prognozy słońca, sieć przy taniej taryfie nocnej. " +
    "Dostępność źródeł, SoC i prognoza słońca MUSZĄ pochodzić z live danych/pomiaru usera — nie zgaduj pogody " +
    "ani stanu urządzeń. Użyj, gdy user pyta, skąd system powinien teraz ładować baterię.",
  inputSchema: HierarchiaLadowaniaToolInput,
  outputSchema: HierarchiaLadowaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/hierarchia-ladowania",
  handler: async (input) => {
    const wynik = calculateHierarchiaLadowania({
      produkcjaPvDostepnaTeraz: input.produkcjaPvDostepnaTeraz,
      socAktualnyPct: input.socAktualnyPct,
      socProguKrytycznegoPct: input.socProguKrytycznegoPct,
      prognozaSloncaJutro: input.prognozaSloncaJutro,
      agregatDostepny: input.agregatDostepny,
      siecDostepna: input.siecDostepna,
      taniaTaryfaNocna: input.taniaTaryfaNocna,
    })
    return {
      status: wynik.status,
      zrodlo: wynik.value.zrodlo,
      pozniejSocPonizejProgu: wynik.value.pozniejSocPonizejProgu,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
