/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 24 "Falownik przy odkształconych obciążeniach (THD)" (dawne 6.38→7.36).
 * `operationType: 'read'`. Tabela obniżenia mocy MUSI pochodzić z karty falownika wpisanej przez usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateFalownikThd } from "@/lib/core/modules/stress-test/falownik-thd/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const FalownikThdToolInput = z.object({
  mocZnamionowaKw: z.number().describe("Moc znamionowa (ciągła czynna) falownika [kW]"),
  mocObciazeniaKw: z.number().describe("Moc czynna obciążenia [kW]"),
  thdPct: z.number().nullable().describe("THD prądu obciążenia [%]; null gdy user nie podał"),
  tabela: z
    .array(
      z.object({
        thdPct: z.number().describe("THD w punkcie tabeli [%], rosnąco"),
        wspolczynnik: z.number().describe("Jaka część mocy znamionowej (0..1) przy tym THD, z karty falownika"),
      }),
    )
    .describe("Tabela obniżenia mocy z karty katalogowej falownika; min. 2 punkty"),
})
export type FalownikThdToolInputT = z.infer<typeof FalownikThdToolInput>

export const FalownikThdToolOutput = z.object({
  status: z.enum(STATUSY),
  wspolczynnik: z.number(),
  dostepnaKw: z.number(),
  zapasKw: z.number(),
  zapasPct: z.number().nullable(),
  przekroczone: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type FalownikThdToolOutputT = z.infer<typeof FalownikThdToolOutput>

export const falownikThdTool: AiToolDefinition<FalownikThdToolInputT, FalownikThdToolOutputT> = {
  name: "sprawdz_falownik_przy_thd",
  description:
    "Sprawdza, ile mocy czynnej odda falownik przy odkształconym prądzie obciążenia (THD): współczynnik obniżenia " +
    "z tabeli producenta (interpolacja liniowa, bez ekstrapolacji), moc dostępna = P_nom·k, zapas w kW i %, " +
    "czerwony stop, gdy obciążenie jest większe. Użyj, gdy user pyta, czy falownik uciągnie pompę ciepła albo " +
    "silniki z dużymi harmonicznymi, ile realnie odda przy danym THD, albo czy trzeba filtra harmonicznych.",
  inputSchema: FalownikThdToolInput,
  outputSchema: FalownikThdToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/falownik-thd",
  handler: async (input) => {
    const wynik = calculateFalownikThd(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
