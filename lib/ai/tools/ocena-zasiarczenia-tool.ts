/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B10 "Ocena zużycia — siarczanowanie" (kwasowo-ołowiowa).
 * `operationType: 'read'`. Lista obserwowanych objawów to obserwacje wizualne usera — "nie
 * zaznaczone" znaczy tu realnie "nieobserwowane", nie "jeszcze niesprawdzone".
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOcenaZasiarczenia } from "@/lib/core/modules/montaz-baterii/ocena-zasiarczenia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OcenaZasiarczeniaToolInput = z.object({
  obserwowaneObjawyIds: z
    .array(z.string())
    .describe("ID objawów siarczanowania, które user faktycznie zaobserwował wizualnie na akumulatorze"),
})
export type OcenaZasiarczeniaToolInputT = z.infer<typeof OcenaZasiarczeniaToolInput>

export const OcenaZasiarczeniaToolOutput = z.object({
  status: z.enum(STATUSY),
  liczbaObjawow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OcenaZasiarczeniaToolOutputT = z.infer<typeof OcenaZasiarczeniaToolOutput>

export const ocenaZasiarczeniaTool: AiToolDefinition<OcenaZasiarczeniaToolInputT, OcenaZasiarczeniaToolOutputT> = {
  name: "ocen_zasiarczenie_akumulatora",
  description:
    "Ocenia siarczanowanie akumulatora kwasowo-ołowiowego na podstawie obserwowanych objawów (Moduł 11, " +
    "Ekran B10) — obecność ≥1 objawu daje ostrzeżenie z odesłaniem do procedury ratowania zasiarczenia. User " +
    "podaje wyłącznie objawy, które faktycznie zaobserwował. Użyj, gdy user pyta, czy jego akumulator kwasowy " +
    "jest zasiarczony.",
  inputSchema: OcenaZasiarczeniaToolInput,
  outputSchema: OcenaZasiarczeniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/ocena-zasiarczenia",
  handler: async (input) => {
    const wynik = calculateOcenaZasiarczenia({ obserwowaneObjawyIds: input.obserwowaneObjawyIds })
    return {
      status: wynik.status,
      liczbaObjawow: wynik.value.liczbaObjawow,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
