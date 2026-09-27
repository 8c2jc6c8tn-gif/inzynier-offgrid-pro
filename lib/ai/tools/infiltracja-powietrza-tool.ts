/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 12 "Infiltracja powietrza (test szczelności)"
 * (dawne 5.12). `operationType: 'read'`. Wynik testu szczelności (n50/blower door) lub
 * szacunek wymian powietrza, kubatura budynku i ΔT pochodzą WYŁĄCZNIE od usera. Kalkulator
 * liczy tylko podstawową fizykę strat wentylacyjnych — poprawa 8% po uszczelnieniu (przykład
 * źródła) NIE jest liczona, celowo pominięta w `calculator.ts`.
 */
import { z } from "zod"
import { calculateInfiltracjaPowietrza } from "@/lib/core/modules/ogrzewanie/infiltracja-powietrza/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const InfiltracjaPowietrzaToolInput = z.object({
  wymianyPowietrzaNaH: z.number().describe("Wynik testu szczelności (blower door) lub szacunek — wymiany powietrza na godzinę [1/h] — od usera"),
  kubaturaBudynkuM3: z.number().describe("Kubatura budynku [m³] — od usera"),
  deltaTK: z.number().describe("Różnica temperatur wewnątrz/na zewnątrz [K] — od usera"),
})
export type InfiltracjaPowietrzaToolInputT = z.infer<typeof InfiltracjaPowietrzaToolInput>

export const InfiltracjaPowietrzaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  strataCieplnaKw: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type InfiltracjaPowietrzaToolOutputT = z.infer<typeof InfiltracjaPowietrzaToolOutput>

export const infiltracjaPowietrzaTool: AiToolDefinition<InfiltracjaPowietrzaToolInputT, InfiltracjaPowietrzaToolOutputT> = {
  name: "policz_strate_infiltracji_powietrza",
  description:
    "Strata ciepła przez infiltrację/wymianę powietrza: Q = n·V·ρ·cp·ΔT/3600 (stałe fizyczne powietrza, nie " +
    "wymyślony współczynnik). Wymiany powietrza (z testu szczelności blower door lub szacunek), kubatura i ΔT " +
    "podaje user. Nie liczy poprawy po uszczelnieniu (brak wzoru w źródle) — tylko bieżącą stratę. Użyj, gdy user " +
    "pyta o straty ciepła z infiltracji/nieszczelności budynku.",
  inputSchema: InfiltracjaPowietrzaToolInput,
  outputSchema: InfiltracjaPowietrzaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/infiltracja-powietrza",
  handler: async (input) => {
    const wynik = calculateInfiltracjaPowietrza({
      wymianyPowietrzaNaH: input.wymianyPowietrzaNaH,
      kubaturaBudynkuM3: input.kubaturaBudynkuM3,
      deltaTK: input.deltaTK,
    })
    return {
      status: wynik.status,
      strataCieplnaKw: wynik.value.strataCieplnaKw,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
