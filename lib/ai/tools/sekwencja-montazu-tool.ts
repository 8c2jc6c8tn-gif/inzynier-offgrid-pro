/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A3b/A4b "Sekwencja montażu — połączenia busbarów +
 * okablowanie BMS" (4S/8S/16S). `operationType: 'read'`. Jedyny wejściowy fakt to liczba ogniw w
 * szeregu, którą user wybiera/wpisuje — generator jest deterministyczny (2 rzędy serpentyna), nie
 * ma tu żadnej wartości fizycznej do zgadywania.
 */
import { z } from "zod"
import { calculateSekwencjaMontazu } from "@/lib/core/modules/montaz-baterii/sekwencja-montazu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SekwencjaMontazuToolInput = z.object({
  liczbaOgniw: z.number().describe("Liczba ogniw w szeregu (np. 4, 8, 16) — od usera, tylko parzysta liczba jest obsługiwana"),
})
export type SekwencjaMontazuToolInputT = z.infer<typeof SekwencjaMontazuToolInput>

export const SekwencjaMontazuToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  polaczeniaBusbarow: z.array(
    z.object({
      numer: z.number(),
      zOgniwa: z.number(),
      doOgniwa: z.number(),
      miedzyRzedami: z.boolean(),
    }),
  ),
  okablowanieBms: z.array(
    z.object({
      numer: z.number(),
      etykieta: z.string(),
      punkt: z.string(),
      napiecieNominalneV: z.number(),
    }),
  ),
  liczbaRzedow: z.number().nullable(),
  ogniwWRzedzie: z.number(),
  napiecieCalkowiteNominalneV: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SekwencjaMontazuToolOutputT = z.infer<typeof SekwencjaMontazuToolOutput>

export const sekwencjaMontazuTool: AiToolDefinition<SekwencjaMontazuToolInputT, SekwencjaMontazuToolOutputT> = {
  name: "wygeneruj_sekwencje_montazu_pakietu",
  description:
    "Generuje szczegółową sekwencję montażu pakietu LiFePO4 (Moduł 11, Ekran A3b) dla dowolnej parzystej liczby " +
    "ogniw w szeregu (2 rzędy, układ serpentyny, zweryfikowane dla 4S/8S/16S): numerowaną kolejność połączeń " +
    "busbarów oraz okablowanie balansujące BMS (B0..Bn). Nieparzysta/za mała/za duża liczba ogniw → " +
    "OUT_OF_SCOPE (źródło nie opisuje takiego układu). Użyj, gdy user pyta o kolejność łączenia busbarów albo " +
    "podłączenie przewodów balansujących BMS dla konkretnej liczby ogniw.",
  inputSchema: SekwencjaMontazuToolInput,
  outputSchema: SekwencjaMontazuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/sekwencja-montazu",
  handler: async (input) => {
    const wynik = calculateSekwencjaMontazu({ liczbaOgniw: input.liczbaOgniw })
    return {
      status: wynik.status,
      polaczeniaBusbarow: wynik.value.polaczeniaBusbarow,
      okablowanieBms: wynik.value.okablowanieBms,
      liczbaRzedow: wynik.value.polaczeniaBusbarow.length > 0 ? wynik.value.liczbaRzedow : null,
      ogniwWRzedzie: wynik.value.ogniwWRzedzie,
      napiecieCalkowiteNominalneV: wynik.value.napiecieCalkowiteNominalneV,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
