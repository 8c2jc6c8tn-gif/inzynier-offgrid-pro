/**
 * Narzędzie AI (9.3) dla Modułu 7 "Stress-test zimowy" — Ekran 20 „Bez rekuperacji”. `operationType: 'read'`.
 * Dane wejściowe WYŁĄCZNIE od usera (karty urządzeń, Moduły 3/6); model nie zgaduje — null, gdy nieznane.
 */
import { z } from "zod"
import { calculateBezRekuperacji } from "@/lib/core/modules/stress-test/bez-rekuperacji/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const n = (opis: string) => z.number().nullable().describe(opis)

export const BezRekuperacjiToolInput = z.object({
  strumienM3H: n("Wydajność centrali [m³/h]"),
  sprawnoscOdzyskuPct: n("Sprawność odzysku [%]"),
  tempWewnC: n("Temperatura wewnątrz [°C]"),
  tempZewnC: n("Najniższa temperatura zewnętrzna [°C]"),
  tempZamarzaniaWymiennikaC: n("Granica zamarzania wymiennika wg producenta [°C]; null gdy nieznana"),
  tempZaNagrzewnicaC: n("Temperatura za nagrzewnicą wstępną wg producenta [°C]; null gdy nieznana"),
})
export type BezRekuperacjiToolInputT = z.infer<typeof BezRekuperacjiToolInput>

export const BezRekuperacjiToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  dodatkowaStrataKw: z.number().nullable(),
  dodatkowaEnergiaKwhDoba: z.number().nullable(),
  mocNagrzewnicyW: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BezRekuperacjiToolOutputT = z.infer<typeof BezRekuperacjiToolOutput>

export const bezRekuperacjiTool: AiToolDefinition<BezRekuperacjiToolInputT, BezRekuperacjiToolOutputT> = {
  name: "sprawdz_wentylacje_bez_odzysku",
  description: "Liczy dodatkową stratę ciepła, gdy rekuperator zamarznie lub pracuje bez odzysku, i moc nagrzewnicy wstępnej; ostrzega, gdy mróz przekracza granicę zamarzania wymiennika (Moduł 7, Ekran 20).",
  inputSchema: BezRekuperacjiToolInput,
  outputSchema: BezRekuperacjiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/bez-rekuperacji",
  handler: async (input) => {
    const wynik = calculateBezRekuperacji(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
