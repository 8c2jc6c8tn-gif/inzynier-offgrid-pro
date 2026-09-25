/**
 * Narzędzie AI (9.3) dla Ekranu 23, Moduł 3 — "Powłoki antyrefleksyjne". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculatePowlokiAntyrefleksyjne } from "@/lib/core/modules/pv/powloki-antyrefleksyjne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PowlokiAntyrefleksyjneToolInput = z.object({
  rocznyUzyskKwh: z.number().describe("Roczny uzysk instalacji PV z panelami bez powłoki antyrefleksyjnej, w kWh/rok"),
})

export type PowlokiAntyrefleksyjneToolInputT = z.infer<typeof PowlokiAntyrefleksyjneToolInput>

export const PowlokiAntyrefleksyjneToolOutput = z.object({
  zyskMinKwh: z.number(),
  zyskMaxKwh: z.number(),
  jednostka: z.string(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type PowlokiAntyrefleksyjneToolOutputT = z.infer<typeof PowlokiAntyrefleksyjneToolOutput>

export const powlokiAntyrefleksyjneTool: AiToolDefinition<
  PowlokiAntyrefleksyjneToolInputT,
  PowlokiAntyrefleksyjneToolOutputT
> = {
  name: "policz_zysk_z_powloki_antyrefleksyjnej",
  description:
    "Przelicza typowy wzrost uzysku z powłoki antyrefleksyjnej paneli PV (zakres 1–3% ze źródła) na " +
    "przedział kWh/rok dla podanego rocznego uzysku instalacji. Zwraca przedział, nie jedną liczbę. " +
    "Użyj, gdy user pyta, ile daje powłoka antyrefleksyjna albo szkło teksturowane.",
  inputSchema: PowlokiAntyrefleksyjneToolInput,
  outputSchema: PowlokiAntyrefleksyjneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/powloki-antyrefleksyjne",
  handler: async (input) => {
    const wynik = calculatePowlokiAntyrefleksyjne(input)
    return {
      zyskMinKwh: wynik.value.zyskMinKwh,
      zyskMaxKwh: wynik.value.zyskMaxKwh,
      jednostka: wynik.unit,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
