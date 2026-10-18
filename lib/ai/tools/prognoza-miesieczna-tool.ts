/**
 * Narzędzie AI (9.3) dla Modułu 10, ekran „Prognoza produkcji miesięcznej” (dawne 12.3).
 * `operationType: 'read'`. Produkcję z ostatnich 12 miesięcy i degradację paneli MUSI podać user (z falownika, z karty paneli) —
 * brak degradacji = 0 % (brak danych), a model nie zgaduje ani produkcji, ani wahań pogody.
 */
import { z } from "zod"
import { STATUSY, isComputed } from "@/lib/core/calc-result"
import { calculatePrognozaMiesieczna } from "@/lib/core/modules/ai/prognoza-miesieczna/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrognozaMiesiecznaToolInput = z.object({
  produkcjaHistoriaKwh: z
    .array(z.number().nullable())
    .length(12)
    .describe("Produkcja PV [kWh] w każdym miesiącu kalendarzowym OSTATNICH 12 miesięcy: indeks 0 = styczeń … 11 = grudzień; null = brak danych z tego miesiąca (nie zero)"),
  miesiacStartu: z.number().describe("Pierwszy miesiąc prognozy, 1 = styczeń … 12 = grudzień"),
  miesiecyNaprzod: z.number().describe("Na ile miesięcy naprzód, 1–12"),
  degradacjaRocznaPct: z.number().optional().describe("Roczna degradacja paneli [%/rok] z karty paneli — brak = 0 %, nie zgaduj"),
  odchylenieMeteoPct: z.number().optional().describe("Wahania pogody między latami [%] — opcjonalnie; od usera, daje zakres dolny/górny ±; brak = bez zakresu"),
})
export type PrognozaMiesiecznaToolInputT = z.infer<typeof PrognozaMiesiecznaToolInput>

export const PrognozaMiesiecznaToolOutput = z.object({
  status: z.enum(STATUSY),
  wiersze: z
    .array(
      z.object({
        miesiac: z.number(),
        historiaKwh: z.number().nullable(),
        prognozaKwh: z.number().nullable(),
        dolnaKwh: z.number().nullable(),
        gornaKwh: z.number().nullable(),
      }),
    )
    .nullable(),
  sumaPrognozyKwh: z.number().nullable().describe("Suma prognozy z miesięcy, które mają dane [kWh]"),
  sumaHistoriiKwh: z.number().nullable().describe("Suma tych samych miesięcy sprzed roku [kWh]"),
  zmianaPct: z.number().nullable().describe("Zmiana prognozy względem tych samych miesięcy sprzed roku [%]"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrognozaMiesiecznaToolOutputT = z.infer<typeof PrognozaMiesiecznaToolOutput>

export const prognozaMiesiecznaTool: AiToolDefinition<PrognozaMiesiecznaToolInputT, PrognozaMiesiecznaToolOutputT> = {
  name: "policz_prognoze_miesieczna",
  description:
    "Prognoza produkcji PV na 1–12 miesięcy naprzód z produkcji usera z ostatnich 12 miesięcy (Moduł 10): ten sam miesiąc kalendarzowy " +
    "sprzed roku pomniejszony o roczną degradację paneli z karty; z wahaniami pogody podanymi przez usera daje też zakres dolny/górny. " +
    "Miesiąc bez danych nie dostaje prognozy (to brak danych, nie zero). Nie przewiduje pogody, zacienienia ani zabrudzenia paneli — to " +
    "rachunek na danych usera. Produkcję i degradację podaje user, nie zgaduj. " +
    "Użyj, gdy user pyta, ile energii dadzą panele w najbliższych miesiącach, ile będzie produkcji zimą albo o ile spadnie produkcja przez degradację paneli.",
  inputSchema: PrognozaMiesiecznaToolInput,
  outputSchema: PrognozaMiesiecznaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ai/prognoza-miesieczna",
  handler: async (input) => {
    const wynik = calculatePrognozaMiesieczna({
      produkcjaHistoriaKwh: input.produkcjaHistoriaKwh,
      degradacjaRocznaPct: input.degradacjaRocznaPct ?? null,
      miesiacStartu: input.miesiacStartu,
      miesiecyNaprzod: input.miesiecyNaprzod,
      odchylenieMeteoPct: input.odchylenieMeteoPct ?? null,
    })
    const ma = isComputed(wynik.status)
    const v = ma ? wynik.value : null
    return {
      status: wynik.status,
      wiersze: v?.wiersze ?? null,
      sumaPrognozyKwh: v?.sumaPrognozyKwh ?? null,
      sumaHistoriiKwh: v?.sumaHistoriiKwh ?? null,
      zmianaPct: v?.zmianaPct ?? null,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
