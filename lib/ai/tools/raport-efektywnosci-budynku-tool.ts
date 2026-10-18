/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — raport efektywności cieplnej budynku i ranking strat (dawne 5.40,
 * 5.67), dokładka do Ekranu 1. `operationType: 'read'`. Straty — z Ekranu 1 (przegrody + wentylacja).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateRaportEfektywnosci } from "@/lib/core/modules/ogrzewanie/raport-efektywnosci-budynku/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const RaportEfektywnosciToolInput = z.object({
  pozycje: z
    .array(z.object({ nazwa: z.string().describe("Przegroda albo „wentylacja”"), strataW: z.number().describe("Strata przy θe [W]") }))
    .describe("Straty z Ekranu 1: każda przegroda i wentylacja"),
  cieploRokKwh: z.number().describe("Ciepło na ogrzewanie w roku [kWh]; 0 = nie podano"),
  powierzchniaM2: z.number().describe("Powierzchnia ogrzewana [m²]; 0 = nie podano"),
  cop: z.number().describe("COP źródła ciepła (grzałka = 1); 0 = nie podano"),
  cenaZlKwh: z.number().describe("Cena prądu [zł/kWh]; 0 = nie podano"),
})
export type RaportEfektywnosciToolInputT = z.infer<typeof RaportEfektywnosciToolInput>

export const RaportEfektywnosciToolOutput = z.object({
  status: z.enum(STATUSY),
  ranking: z.array(z.object({ nazwa: z.string(), strataW: z.number(), udzialPct: z.number() })),
  sumaW: z.number(),
  wskaznikKwhM2Rok: z.number().nullable(),
  energiaElRokKwh: z.number().nullable(),
  kosztRokZl: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RaportEfektywnosciToolOutputT = z.infer<typeof RaportEfektywnosciToolOutput>

export const raportEfektywnosciTool: AiToolDefinition<RaportEfektywnosciToolInputT, RaportEfektywnosciToolOutputT> = {
  name: "przygotuj_ranking_strat_ciepla_budynku",
  description:
    "Ranking strat ciepła budynku (przegrody i wentylacja, udział %), ciepło na m² w roku, roczny prąd Q/COP i koszt " +
    "ogrzewania. Bez klasy energetycznej i energii pierwotnej (brak progów i współczynników w źródle). Użyj, gdy user " +
    "pyta, gdzie ucieka najwięcej ciepła, ile kWh/m² zużywa dom albo ile rocznie kosztuje ogrzewanie.",
  inputSchema: RaportEfektywnosciToolInput,
  outputSchema: RaportEfektywnosciToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/raport-efektywnosci-budynku",
  handler: async (input) => {
    const wynik = calculateRaportEfektywnosci(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
