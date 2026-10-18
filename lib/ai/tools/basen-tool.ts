/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2C — pompa ciepła w trybie ogrzewania basenu (dawne 5.48). `operationType:
 * 'read'`. Objętość, przyrost, moc, COP i nocny spadek temperatury pochodzą od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBasen } from "@/lib/core/modules/ogrzewanie/basen/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BasenToolInput = z.object({
  objetoscM3: z.number().describe("Objętość wody w basenie [m³]"),
  przyrostK: z.number().describe("O ile podgrzać wodę [K]"),
  mocPompyKw: z.number().describe("Moc grzewcza pompy w trybie basenowym [kW]"),
  cop: z.number().describe("COP pompy w trybie basenowym; 0 = nie podano"),
  spadekNocK: z.number().describe("Zmierzony spadek temperatury wody przez noc [K]; 0 = nie podano"),
})
export type BasenToolInputT = z.infer<typeof BasenToolInput>

export const BasenToolOutput = z.object({
  status: z.enum(STATUSY),
  cieploKwh: z.number(),
  czasH: z.number(),
  pradKwh: z.number().nullable(),
  cieploNocKwh: z.number().nullable(),
  pradNocKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BasenToolOutputT = z.infer<typeof BasenToolOutput>

export const basenTool: AiToolDefinition<BasenToolInputT, BasenToolOutputT> = {
  name: "policz_ogrzewanie_basenu_pompa_ciepla",
  description:
    "Ciepło i prąd na podgrzanie wody w basenie pompą ciepła, czas pracy pompy oraz codzienne dogrzanie po nocnym " +
    "wychłodzeniu (bez strat przez parowanie). Użyj, gdy user pyta, ile kWh i ile godzin zajmie podgrzanie basenu, " +
    "ile prądu zjada basen albo czy pompa ciepła do basenu ma sens w off-gridzie.",
  inputSchema: BasenToolInput,
  outputSchema: BasenToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/basen",
  handler: async (input) => {
    const wynik = calculateBasen(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
