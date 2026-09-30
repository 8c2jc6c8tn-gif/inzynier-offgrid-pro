/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 7 "Powerbank solarny vs mały akumulator".
 * `operationType: 'read'`. Część użyteczna akumulatora i sprawność MUSZĄ pochodzić od usera
 * (Dyrektywa #1). Cena/masa na Wh — `porownaj_stacje_zasilania_z_zestawem_diy` (E34).
 */
import { z } from "zod"
import { calculatePowerbankVsAkumulator } from "@/lib/core/modules/kalkulator-mobilny/powerbank-vs-akumulator/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PowerbankVsAkumulatorToolInput = z.object({
  mocUrzadzeniaW: z.number().describe("Moc urządzenia podczas pracy/ładowania [W]"),
  energiaNaUzycieWh: z.number().describe("Energia na jedno naładowanie albo dobę pracy urządzenia [Wh]"),
  powerbankWh: z.number().describe("Pojemność powerbanku z etykiety [Wh]"),
  powerbankMocWyjsciaW: z.number().describe("Maks. ciągła moc wyjścia powerbanku [W]"),
  akumulatorAh: z.number().describe("Pojemność akumulatora [Ah]"),
  akumulatorV: z.number().describe("Napięcie akumulatora [V]"),
  akumulatorUzytecznaPct: z.number().describe("Część pojemności akumulatora do wykorzystania [%] — od usera, nie zgaduj"),
  sprawnoscPct: z.number().describe("Sprawność przetwarzania do urządzenia [%] — od usera, nie zgaduj"),
})
export type PowerbankVsAkumulatorToolInputT = z.infer<typeof PowerbankVsAkumulatorToolInput>

export const PowerbankVsAkumulatorToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  energiaPowerbankuWh: z.number(),
  energiaAkumulatoraWh: z.number(),
  uzyciaPowerbank: z.number().describe("Ile pełnych użyć z powerbanku"),
  uzyciaAkumulator: z.number().describe("Ile pełnych użyć z akumulatora"),
  powerbankMaMoc: z.boolean().describe("Czy powerbank uciągnie moc urządzenia"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PowerbankVsAkumulatorToolOutputT = z.infer<typeof PowerbankVsAkumulatorToolOutput>

export const powerbankVsAkumulatorTool: AiToolDefinition<PowerbankVsAkumulatorToolInputT, PowerbankVsAkumulatorToolOutputT> = {
  name: "porownaj_powerbank_solarny_z_akumulatorem",
  description:
    "Porównuje powerbank solarny z małym akumulatorem: czy powerbank uciągnie moc urządzenia i ile razy " +
    "każda opcja naładuje telefon/laptopa albo zasili lodówkę turystyczną. Użyj, gdy user pyta, czy " +
    "wystarczy mu powerbank solarny, czy potrzebuje akumulatora z panelem.",
  inputSchema: PowerbankVsAkumulatorToolInput,
  outputSchema: PowerbankVsAkumulatorToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/powerbank-vs-akumulator",
  handler: async (input) => {
    const wynik = calculatePowerbankVsAkumulator(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
