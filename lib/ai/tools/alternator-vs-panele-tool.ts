/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 20 "Ładowanie z alternatora vs paneli" (+ dawne 8.43:
 * ładowanie z prostownika/alternatora). `operationType: 'read'`. Prąd ładowania, godziny słońca
 * i sprawność MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateAlternatorVsPanele } from "@/lib/core/modules/kalkulator-mobilny/alternator-vs-panele/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AlternatorVsPaneleToolInput = z.object({
  napiecieV: z.number().describe("Napięcie nominalne akumulatora [V]"),
  godzinJazdy: z.number().describe("Godziny jazdy na dobę [h]"),
  pradLadowaniaA: z.number().describe("Prąd ładowania z alternatora/DC-DC [A] — od usera"),
  mocPaneluW: z.number().describe("Moc paneli [W]"),
  godzinSlonca: z.number().describe("Równoważne godziny pełnego słońca [h/dobę] — od usera, nie zgaduj"),
  sprawnoscToruPct: z.number().describe("Sprawność toru panel → akumulator [%] — od usera, nie zgaduj"),
  zapotrzebowanieWhDoba: z.number().describe("Zapotrzebowanie na dobę [Wh]; 0 = bez porównania"),
  typAkumulatora: z.enum(["lifepo4", "agm", "kwasowy"]).nullable().describe("Typ akumulatora; null = nie sprawdzaj napięcia"),
  maDcDc: z.boolean().nullable().describe("Czy jest ładowarka DC/DC; null = nie wiadomo"),
  napiecieLadowaniaV: z.number().describe("Napięcie ładowania prostownika/alternatora/DC-DC [V]; 0 = nie sprawdzaj"),
  pojemnoscAh: z.number().describe("Pojemność akumulatora [Ah]; 0 = bez czasu ładowania"),
  socStartPct: z.number().describe("Stan naładowania na start [%]"),
})
export type AlternatorVsPaneleToolInputT = z.infer<typeof AlternatorVsPaneleToolInput>

export const AlternatorVsPaneleToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  energiaAlternatorWh: z.number(),
  energiaPaneliWh: z.number(),
  sumaWh: z.number(),
  czasLadowaniaH: z.number().describe("Czas ładowania z alternatora do pełna [h]; 0 = nie liczono"),
  oknoNapieciaV: z.object({ minV: z.number(), maxV: z.number() }).nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AlternatorVsPaneleToolOutputT = z.infer<typeof AlternatorVsPaneleToolOutput>

export const alternatorVsPaneleTool: AiToolDefinition<AlternatorVsPaneleToolInputT, AlternatorVsPaneleToolOutputT> = {
  name: "porownaj_ladowanie_z_alternatora_i_paneli",
  description:
    "Porównuje dobową energię z alternatora (prąd × napięcie × godziny jazdy) i z paneli, sumę wobec " +
    "zapotrzebowania, czas ładowania i zgodność napięcia ładowania z typem akumulatora (LiFePO4/AGM/kwasowy). " +
    "Użyj, gdy user pyta, czy w kamperze wystarczy ładowanie z jazdy, z paneli, czy potrzebuje obu, albo " +
    "czy jego prostownik/DC-DC pasuje do akumulatora.",
  inputSchema: AlternatorVsPaneleToolInput,
  outputSchema: AlternatorVsPaneleToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/alternator-vs-panele",
  handler: async (input) => {
    const wynik = calculateAlternatorVsPanele(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
