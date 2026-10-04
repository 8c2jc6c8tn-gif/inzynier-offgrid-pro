/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 16 "Turbina wiatrowa jako wsparcie zimowe" (dawne 6.24→7.23).
 * `operationType: 'read'`. Krzywa mocy, prędkość wyłączenia i współczynnik dostępności MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateTurbinaWiatrowa } from "@/lib/core/modules/stress-test/turbina-wiatrowa/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TurbinaWiatrowaToolInput = z.object({
  sredniaPredkoscMs: z.number().describe("Średnia prędkość wiatru na wysokości piasty [m/s]"),
  krzywa: z
    .array(
      z.object({
        predkoscMs: z.number().describe("Prędkość wiatru w punkcie krzywej [m/s], rosnąco"),
        mocKw: z.number().describe("Moc elektryczna turbiny przy tej prędkości [kW]"),
      }),
    )
    .describe("Krzywa mocy z karty turbiny; min. 3 punkty"),
  predkoscWylaczeniaMs: z.number().describe("Prędkość wyłączenia turbiny [m/s]; nie mniejsza niż ostatni punkt krzywej"),
  wspolczynnikDostepnosciStrat: z
    .number()
    .nullable()
    .describe("Współczynnik dostępności i strat 0..1 podany przez usera; null gdy nie podał"),
})
export type TurbinaWiatrowaToolInputT = z.infer<typeof TurbinaWiatrowaToolInput>

export const TurbinaWiatrowaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  energiaDobaKwh: z.number(),
  sredniaMocKw: z.number(),
  calkaKw: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TurbinaWiatrowaToolOutputT = z.infer<typeof TurbinaWiatrowaToolOutput>

export const turbinaWiatrowaTool: AiToolDefinition<TurbinaWiatrowaToolInputT, TurbinaWiatrowaToolOutputT> = {
  name: "szacuj_produkcje_turbiny_wiatrowej_zima",
  description:
    "Szacuje dobową produkcję energii turbiny wiatrowej ze średniej prędkości wiatru: całka z krzywej mocy z karty " +
    "turbiny i rozkładu Rayleigha (krok 0,1 m/s), razy 24 h i współczynnik dostępności i strat podany przez usera. " +
    "Użyj, gdy user pyta, ile energii da turbina wiatrowa zimą, czy turbina uzupełni bilans, albo ile realnie da " +
    "turbina o danej mocy znamionowej przy danej średniej prędkości wiatru.",
  inputSchema: TurbinaWiatrowaToolInput,
  outputSchema: TurbinaWiatrowaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/turbina-wiatrowa",
  handler: async (input) => {
    const wynik = calculateTurbinaWiatrowa(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
