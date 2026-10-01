/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 14 "Raport bezpieczeństwa małej instalacji" (dawne 8.22, Biblia §12.22).
 * `operationType: 'read'`. Odpowiedzi OK / Błąd MUSZĄ pochodzić od usera — narzędzie nie zgaduje stanu instalacji.
 */
import { z } from "zod"
import { calculateRaportBezpieczenstwa } from "@/lib/core/modules/kalkulator-mobilny/raport-bezpieczenstwa-maly/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Odpowiedz = z.enum(["ok", "blad"]).nullable()

export const RaportBezpieczenstwaToolInput = z.object({
  odpowiedzi: z
    .object({
      "bezpiecznik-akumulatora": Odpowiedz.optional().describe("Bezpiecznik przy akumulatorze na plusie"),
      "dobor-bezpiecznikow": Odpowiedz.optional().describe("Bezpieczniki większe od prądu odbiorników (nie wyzwalają przy normalnej pracy)"),
      "bezpiecznik-a-przewod": Odpowiedz.optional().describe("Żaden bezpiecznik nie jest większy niż obciążalność chronionego przewodu"),
      "przekroje-przewodow": Odpowiedz.optional().describe("Przekroje przewodów sprawdzone na prąd i spadek napięcia"),
      "ochrona-rozladowania": Odpowiedz.optional().describe("Ochrona przed głębokim rozładowaniem (BMS / LVD / wyjście regulatora)"),
      "wentylacja-akumulatora": Odpowiedz.optional().describe("Wentylacja miejsca akumulatora"),
      polaczenia: Odpowiedz.optional().describe("Połączenia: zaciśnięte końcówki, dokręcone, bez skręcanych przewodów"),
    })
    .describe("Odpowiedzi usera; brak = niesprawdzone (liczy się jako nie-OK)"),
})
export type RaportBezpieczenstwaToolInputT = z.infer<typeof RaportBezpieczenstwaToolInput>

export const RaportBezpieczenstwaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  procentBezpieczenstwa: z.number(),
  liczbaOk: z.number(),
  liczbaBledow: z.number(),
  liczbaNiesprawdzonych: z.number(),
  ostrzezenia: z.array(z.string()).describe("Błędy z krokami naprawczymi"),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RaportBezpieczenstwaToolOutputT = z.infer<typeof RaportBezpieczenstwaToolOutput>

export const raportBezpieczenstwaMalyTool: AiToolDefinition<RaportBezpieczenstwaToolInputT, RaportBezpieczenstwaToolOutputT> = {
  name: "przygotuj_raport_bezpieczenstwa_malej_instalacji",
  description:
    "Składa raport bezpieczeństwa małej instalacji (kamper, działka, balkon) z odpowiedzi OK / Błąd dla siedmiu " +
    "punktów: bezpiecznik przy akumulatorze, dobór bezpieczników, bezpiecznik a przewód, przekroje przewodów, ochrona przed rozładowaniem, " +
    "wentylacja akumulatora, połączenia — z procentem bezpieczeństwa i krokami naprawczymi. " +
    "Użyj, gdy user pyta, czy jego mała instalacja jest bezpieczna, albo chce listę rzeczy do poprawy.",
  inputSchema: RaportBezpieczenstwaToolInput,
  outputSchema: RaportBezpieczenstwaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/raport-bezpieczenstwa-maly",
  handler: async (input) => {
    const wynik = calculateRaportBezpieczenstwa(input)
    const { procentBezpieczenstwa, liczbaOk, liczbaBledow, liczbaNiesprawdzonych } = wynik.value
    return {
      status: wynik.status,
      procentBezpieczenstwa,
      liczbaOk,
      liczbaBledow,
      liczbaNiesprawdzonych,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
