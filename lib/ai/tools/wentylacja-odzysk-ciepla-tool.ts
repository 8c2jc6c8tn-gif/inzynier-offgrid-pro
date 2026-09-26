/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 3 "System wentylacji z odzyskiem ciepła" (scala dawne
 * 5.3, 5.23, 5.24). `operationType: 'read'`. Wydajność centrali, sprawność rekuperatora (z bazy
 * komponentów/karty katalogowej), ΔT i pobór wentylatorów pochodzą WYŁĄCZNIE od usera. Kalkulator
 * liczy tylko podstawowy bilans cieplno-elektryczny — projekt strumieni per pomieszczenie i logika
 * bypassu letniego są świadomie pominięte (brak wzoru w źródle).
 */
import { z } from "zod"
import { calculateWentylacjaOdzyskCiepla } from "@/lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WentylacjaOdzyskCieplaToolInput = z.object({
  wydajnoscCentraliM3H: z.number().describe("Wydajność centrali wentylacyjnej [m³/h] — od usera"),
  sprawnoscRekuperatoraPct: z.number().describe("Sprawność rekuperatora [%] — z bazy komponentów/karty katalogowej — od usera"),
  deltaTK: z.number().describe("Różnica temperatur wewnątrz/na zewnątrz [K] — od usera"),
  poborWentylatorowW: z.number().describe("Stały pobór mocy wentylatorów centrali [W] — od usera (źródło podaje zakres 50-100 W, nie pojedynczą liczbę)"),
})
export type WentylacjaOdzyskCieplaToolInputT = z.infer<typeof WentylacjaOdzyskCieplaToolInput>

export const WentylacjaOdzyskCieplaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  odzyskaneCieploKw: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WentylacjaOdzyskCieplaToolOutputT = z.infer<typeof WentylacjaOdzyskCieplaToolOutput>

export const wentylacjaOdzyskCieplaTool: AiToolDefinition<WentylacjaOdzyskCieplaToolInputT, WentylacjaOdzyskCieplaToolOutputT> = {
  name: "policz_odzysk_ciepla_wentylacji",
  description:
    "Ilość ciepła odzyskanego przez rekuperator wentylacji mechanicznej: Q_odzysk = V̇×η×ρ×cp×ΔT/3600 (stałe " +
    "fizyczne powietrza). Wydajność centrali, sprawność rekuperatora, ΔT i pobór wentylatorów podaje user. Nie " +
    "liczy projektu strumieni per pomieszczenie ani bypassu letniego (brak wzoru w źródle). Użyj, gdy user pyta o " +
    "korzyści cieplne z wentylacji mechanicznej z odzyskiem ciepła (rekuperacji).",
  inputSchema: WentylacjaOdzyskCieplaToolInput,
  outputSchema: WentylacjaOdzyskCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/wentylacja-odzysk-ciepla",
  handler: async (input) => {
    const wynik = calculateWentylacjaOdzyskCiepla({
      wydajnoscCentraliM3H: input.wydajnoscCentraliM3H,
      sprawnoscRekuperatoraPct: input.sprawnoscRekuperatoraPct,
      deltaTK: input.deltaTK,
      poborWentylatorowW: input.poborWentylatorowW,
    })
    return {
      status: wynik.status,
      odzyskaneCieploKw: wynik.value.odzyskaneCieploKw,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
