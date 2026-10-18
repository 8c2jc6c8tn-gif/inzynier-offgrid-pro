/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — dobór przepływu przez pompę ciepła (dawne 5.65), dokładka do Ekranu 15.
 * `operationType: 'read'`. Moc, ΔT, przepływ pompy obiegowej (jej krzywa) i minimum z karty — od usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePrzeplywPompyCiepla } from "@/lib/core/modules/ogrzewanie/przeplyw-pompy-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrzeplywPompyCieplaToolInput = z.object({
  mocPompyKw: z.number().describe("Moc grzewcza pompy ciepła [kW]"),
  dTK: z.number().describe("Różnica temperatur zasilanie/powrót na pompie ciepła [K]"),
  przeplywPompyM3H: z.number().describe("Przepływ pompy obiegowej w punkcie pracy z jej krzywej [m³/h]; 0 = nie podano"),
  minPrzeplywM3H: z.number().describe("Minimalny przepływ pompy ciepła z karty [m³/h]; 0 = nie podano"),
})
export type PrzeplywPompyCieplaToolInputT = z.infer<typeof PrzeplywPompyCieplaToolInput>

export const PrzeplywPompyCieplaToolOutput = z.object({
  status: z.enum(STATUSY),
  wymaganyM3H: z.number(),
  wymaganyLMin: z.number(),
  rzeczywistyDTK: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrzeplywPompyCieplaToolOutputT = z.infer<typeof PrzeplywPompyCieplaToolOutput>

export const przeplywPompyCieplaTool: AiToolDefinition<PrzeplywPompyCieplaToolInputT, PrzeplywPompyCieplaToolOutputT> = {
  name: "dobierz_przeplyw_przez_pompe_ciepla",
  description:
    "Wymagany przepływ wody przez pompę ciepła V̇ = P/(c·ΔT) w m³/h i l/min, porównanie z przepływem pompy obiegowej " +
    "(rzeczywiste ΔT) i z minimum z karty pompy ciepła. Użyj, gdy user pyta, jaki przepływ ustawić, czy pompa obiegowa " +
    "da radę, czemu pompa ciepła zgłasza alarm przepływu albo jaką różnicę temperatur zasilanie/powrót przyjąć.",
  inputSchema: PrzeplywPompyCieplaToolInput,
  outputSchema: PrzeplywPompyCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/przeplyw-pompy-ciepla",
  handler: async (input) => {
    const wynik = calculatePrzeplywPompyCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
