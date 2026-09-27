/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 14 "Architektura 1-fazowa / 3-fazowa". `operationType:
 * 'read'`. Obciążenia poszczególnych faz pochodzą WYŁĄCZNIE od usera. Kalkulator świadomie NIE
 * wydaje automatycznego werdyktu ok/uwaga/zabroniona — źródło nie podaje liczbowego progu
 * "znacznej" asymetrii, tylko jakościowy opis — nie wymyślaj progu w interpretacji wyniku.
 */
import { z } from "zod"
import { calculateArchitekturaFazowa } from "@/lib/core/modules/zapotrzebowanie/architektura-fazowa/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ArchitekturaFazowaToolInput = z.object({
  mocL1W: z.number().describe("Obciążenie przypisane do fazy L1 [W] — od usera"),
  mocL2W: z.number().describe("Obciążenie przypisane do fazy L2 [W] — od usera, 0 = brak obciążenia/instalacja 1-fazowa"),
  mocL3W: z.number().describe("Obciążenie przypisane do fazy L3 [W] — od usera, 0 = brak obciążenia"),
})
export type ArchitekturaFazowaToolInputT = z.infer<typeof ArchitekturaFazowaToolInput>

export const ArchitekturaFazowaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  sumaW: z.number(),
  maxFazaW: z.number(),
  minFazaW: z.number(),
  asymetriaPct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ArchitekturaFazowaToolOutputT = z.infer<typeof ArchitekturaFazowaToolOutput>

export const architekturaFazowaTool: AiToolDefinition<ArchitekturaFazowaToolInputT, ArchitekturaFazowaToolOutputT> = {
  name: "policz_asymetrie_obciazenia_faz",
  description:
    "Liczy sumę obciążenia, moc maksymalnej/minimalnej fazy i asymetrię % ((Pmax-Pmin)/Pmax) między fazami L1/L2/L3 " +
    "— Moduł 2, Ekran 14 'Architektura 1-fazowa/3-fazowa'. Nie wydaje werdyktu ok/uwaga/zabroniona — źródło nie " +
    "podaje liczbowego progu, oceń to opisowo dla usera, nie wymyślaj progu. Moce faz podaje user — nie zgaduj.",
  inputSchema: ArchitekturaFazowaToolInput,
  outputSchema: ArchitekturaFazowaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/architektura-fazowa",
  handler: async (input) => {
    const wynik = calculateArchitekturaFazowa({
      mocL1W: input.mocL1W,
      mocL2W: input.mocL2W,
      mocL3W: input.mocL3W,
    })
    return {
      status: wynik.status,
      sumaW: wynik.value.sumaW,
      maxFazaW: wynik.value.maxFazaW,
      minFazaW: wynik.value.minFazaW,
      asymetriaPct: wynik.value.asymetriaPct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
