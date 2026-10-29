/**
 * Narzędzie AI (9.3) dla Modułu 10, Ekran 4 — automatyczny dobór źródła zasilania i prądu ładowania (dawne 12.7,
 * 12.8; 12.9 to Ekran 5). `operationType: 'read'`. Stan instalacji (PV teraz, SoC, prognoza, temperatura ogniw,
 * pojemność, możliwy prąd) — od usera albo z BMS; model nie zgaduje progu SoC ani temperatury.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateDoborZrodelZasilania } from "@/lib/core/modules/ai/dobor-zrodel-zasilania/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborZrodelZasilaniaToolInput = z.object({
  produkcjaPvDostepnaTeraz: z.boolean().describe("Czy PV produkuje teraz"),
  socAktualnyPct: z.number().describe("Aktualny SoC baterii [%]"),
  socProguKrytycznegoPct: z.number().describe("Próg krytyczny SoC [%] — od usera (projekt nie ma jednej wartości)"),
  prognozaSloncaJutro: z.boolean().describe("Czy prognoza przewiduje produkcję PV jutro"),
  agregatDostepny: z.boolean().describe("Czy jest agregat"),
  siecDostepna: z.boolean().describe("Czy jest sieć"),
  taniaTaryfaNocna: z.boolean().describe("Czy teraz obowiązuje tania taryfa"),
  temperaturaOgniwaC: z.number().nullable().describe("Temperatura ogniw z BMS [°C]; null = nieznana"),
  pojemnoscAh: z.number().describe("Pojemność pakietu [Ah]; 0 = nie podano"),
  pradMozliwyA: z.number().describe("Prąd ładowania, jaki źródło mogłoby dać teraz [A]; 0 = nie podano"),
})
export type DoborZrodelZasilaniaToolInputT = z.infer<typeof DoborZrodelZasilaniaToolInput>

export const DoborZrodelZasilaniaToolOutput = z.object({
  status: z.enum(STATUSY),
  zrodlo: z.enum(["PV", "AGREGAT", "SIEC", "BRAK"]),
  pozniejSocPonizejProgu: z.boolean(),
  strefa: z.enum(["blokada", "limit-02c", "luka-zrodla", "pelny-prad"]).nullable(),
  maxPradA: z.number().nullable(),
  pradLadowaniaA: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DoborZrodelZasilaniaToolOutputT = z.infer<typeof DoborZrodelZasilaniaToolOutput>

export const doborZrodelZasilaniaTool: AiToolDefinition<DoborZrodelZasilaniaToolInputT, DoborZrodelZasilaniaToolOutputT> = {
  name: "dobierz_zrodlo_zasilania_i_prad_ladowania",
  description:
    "Które źródło ma teraz ładować baterię (PV, agregat, sieć albo nic — wg hierarchii Modułu 4) i jakim prądem, " +
    "z limitem prądu w zimnie wg temperatury ogniw (blokada poniżej 0 °C, niższy prąd w chłodzie — progi Modułu 4). Użyj, gdy user " +
    "pyta, czy włączyć agregat, z czego teraz ładować, jaki prąd ładowania ustawić przy mrozie albo co system powinien " +
    "zrobić przy danym SoC i pogodzie.",
  inputSchema: DoborZrodelZasilaniaToolInput,
  outputSchema: DoborZrodelZasilaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ai/dobor-zrodel-zasilania",
  handler: async (input) => {
    const wynik = calculateDoborZrodelZasilania(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
