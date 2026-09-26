/**
 * Narzędzie AI (9.3) dla Ekranu 28, Moduł 4 "Magazyn energii / baterie" — "Kalibracja i
 * dokładność SoC". `operationType: 'read'`. Liczba dni od ostatniego pełnego naładowania MUSI
 * pochodzić z BMS/live danych usera, nigdy zgadywana.
 */
import { z } from "zod"
import { calculateKalibracjaSoc } from "@/lib/core/modules/baterie/kalibracja-soc/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KalibracjaSocToolInput = z.object({
  dniOdOstatniegoPelnegoNaladowania: z
    .number()
    .describe("Dni od ostatniego pełnego naładowania baterii — tylko od usera/BMS, nie zgaduj (0 = dziś było pełne ładowanie)"),
})
export type KalibracjaSocToolInputT = z.infer<typeof KalibracjaSocToolInput>

export const KalibracjaSocToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  dni: z.number(),
  kalibracjaRekomendowana: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KalibracjaSocToolOutputT = z.infer<typeof KalibracjaSocToolOutput>

export const kalibracjaSocTool: AiToolDefinition<KalibracjaSocToolInputT, KalibracjaSocToolOutputT> = {
  name: "sprawdz_kalibracje_soc",
  description:
    "Sprawdza, czy trzeba wykonać pełne naładowanie do kalibracji SoC (coulomb counting w BMS kumuluje błąd " +
    "bez okresowego pełnego naładowania), na podstawie liczby dni od ostatniego pełnego naładowania (Moduł 4, " +
    "Ekran 28). Liczba dni MUSI pochodzić z BMS/live danych usera — nie zgaduj. Użyj, gdy user pyta, czy pora " +
    "skalibrować SoC.",
  inputSchema: KalibracjaSocToolInput,
  outputSchema: KalibracjaSocToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/kalibracja-soc",
  handler: async (input) => {
    const wynik = calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: input.dniOdOstatniegoPelnegoNaladowania })
    return {
      status: wynik.status,
      dni: wynik.value.dni,
      kalibracjaRekomendowana: wynik.value.kalibracjaRekomendowana,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
