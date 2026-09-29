/**
 * Narzędzie AI (9.3) dla Ekranu 6, Moduł 7 "Stress-test zimowy" — "Strategia Zamarzanie" (dawne 6.6).
 * `operationType: 'read'` — liczy, niczego nie odłącza. Priorytety odbiorników nadaje user.
 */
import { z } from "zod"
import { calculateStrategiaZamarzanie } from "@/lib/core/modules/stress-test/strategia-zamarzanie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StrategiaZamarzanieToolInput = z.object({
  pojemnoscKwh: z.number().nullable(),
  socPct: z.number().nullable().describe("Aktualny SoC [%]"),
  socMinPct: z.number().nullable().describe("SoC, przy którym system się wyłącza [%]"),
  sprawnoscFalownikaPct: z.number().nullable(),
  odbiorniki: z.array(
    z.object({
      nazwa: z.string(),
      mocW: z.number().nullable().describe("Średnia moc w mroźną dobę [W]"),
      priorytet: z
        .union([z.literal(1), z.literal(2), z.literal(3)])
        .describe("1 krytyczne (ogrzewanie, pompy, grzałki BMS), 2 ważne (oświetlenie, router), 3 komfort (pralka, zmywarka)"),
    }),
  ),
})
export type StrategiaZamarzanieToolInputT = z.infer<typeof StrategiaZamarzanieToolInput>

export const StrategiaZamarzanieToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  mocKrytycznychW: z.number(),
  mocWaznychW: z.number(),
  mocKomfortuW: z.number(),
  czasEtapuAH: z.number().nullable(),
  czasEtapuBH: z.number().nullable(),
  czasKrytycznychH: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type StrategiaZamarzanieToolOutputT = z.infer<typeof StrategiaZamarzanieToolOutput>

export const strategiaZamarzanieTool: AiToolDefinition<StrategiaZamarzanieToolInputT, StrategiaZamarzanieToolOutputT> = {
  name: "policz_strategie_zamarzanie",
  description:
    "Zimowa strategia odłączania odbiorników: komfort od razu, ważne poniżej 20% SoC, krytyczne nigdy — liczy, jak długo " +
    "bateria utrzyma ogrzewanie i pompy (Moduł 7, Ekran 6). Użyj, gdy user pyta, które odbiorniki odłączać zimą przy spadku SoC i jak długo bateria utrzyma ogrzewanie i pompy.",
  inputSchema: StrategiaZamarzanieToolInput,
  outputSchema: StrategiaZamarzanieToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/strategia-zamarzanie",
  handler: async (input) => {
    const wynik = calculateStrategiaZamarzanie(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
