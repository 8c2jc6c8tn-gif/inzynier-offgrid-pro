/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 34 "Solarny generator (stacja) vs zestaw DIY".
 * `operationType: 'read'`. Ceny, pojemności, DoD i masy MUSZĄ pochodzić od usera (Dyrektywa #1 —
 * w repo nie ma bazy stacji ani cennika).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateStacjaVsDiy } from "@/lib/core/modules/kalkulator-mobilny/stacja-vs-diy/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StacjaVsDiyToolInput = z.object({
  cenaStacjiZl: z.number().describe("Cena gotowej stacji [zł] — od usera"),
  pojemnoscStacjiWh: z.number().describe("Pojemność stacji wg producenta [Wh] — od usera"),
  uzytecznaStacjiPct: z.number().describe("Część pojemności stacji do wykorzystania [%]; 100 gdy producent podaje pojemność użyteczną"),
  masaStacjiKg: z.number().describe("Masa stacji [kg]; 0 = bez porównania masy"),
  cenaDiyZl: z.number().describe("Łączna cena elementów zestawu DIY [zł] — od usera"),
  pojemnoscDiyAh: z.number().describe("Pojemność akumulatora zestawu [Ah] — od usera"),
  napiecieDiyV: z.number().describe("Napięcie akumulatora zestawu [V] — od usera"),
  dodDiyPct: z.number().describe("Dopuszczalna głębokość rozładowania akumulatora zestawu [%] — z karty, nie zgaduj"),
  masaDiyKg: z.number().describe("Masa zestawu [kg]; 0 = bez porównania masy"),
})
export type StacjaVsDiyToolInputT = z.infer<typeof StacjaVsDiyToolInput>

export const StacjaVsDiyToolOutput = z.object({
  status: z.enum(STATUSY),
  energiaStacjiWh: z.number(),
  energiaDiyWh: z.number(),
  zlZaWhStacja: z.number().describe("Cena za 1 Wh użyteczną stacji [zł/Wh]"),
  zlZaWhDiy: z.number().describe("Cena za 1 Wh użyteczną zestawu DIY [zł/Wh]"),
  krotnoscDiy: z.number().describe("Ile razy więcej energii za te same pieniądze daje DIY (< 1 = stacja korzystniejsza)"),
  kgNaKwhStacja: z.number(),
  kgNaKwhDiy: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type StacjaVsDiyToolOutputT = z.infer<typeof StacjaVsDiyToolOutput>

export const stacjaVsDiyTool: AiToolDefinition<StacjaVsDiyToolInputT, StacjaVsDiyToolOutputT> = {
  name: "porownaj_stacje_zasilania_z_zestawem_diy",
  description:
    "Porównuje gotową stację zasilania (typu „solarny generator”) z zestawem DIY: energia użyteczna, cena " +
    "za 1 Wh i masa na 1 kWh obu opcji. Użyj, gdy user waha się, czy kupić gotową stację zasilania, czy " +
    "złożyć zestaw z akumulatora, regulatora i przetwornicy.",
  inputSchema: StacjaVsDiyToolInput,
  outputSchema: StacjaVsDiyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/stacja-vs-diy",
  handler: async (input) => {
    const wynik = calculateStacjaVsDiy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
