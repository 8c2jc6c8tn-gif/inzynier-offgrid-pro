/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A3 "Połączenia elektryczne + kolejność łączenia"
 * (LiFePO4). `operationType: 'read'`. Jedyny wejściowy fakt to lista ID kroków checklisty już
 * fizycznie wykonanych przez usera — nic tu nie jest liczone/mierzone, tylko kolejność.
 */
import { z } from "zod"
import { calculatePolaczeniaElektryczne } from "@/lib/core/modules/montaz-baterii/polaczenia-elektryczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PolaczeniaElektryczneToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID kroków checklisty, które user faktycznie już wykonał, w dowolnej kolejności podania"),
})
export type PolaczeniaElektryczneToolInputT = z.infer<typeof PolaczeniaElektryczneToolInput>

export const PolaczeniaElektryczneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  potwierdzoneWKolejnosci: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PolaczeniaElektryczneToolOutputT = z.infer<typeof PolaczeniaElektryczneToolOutput>

export const polaczeniaElektryczneTool: AiToolDefinition<
  PolaczeniaElektryczneToolInputT,
  PolaczeniaElektryczneToolOutputT
> = {
  name: "sprawdz_kolejnosc_polaczen_elektrycznych",
  description:
    "Sprawdza kolejność łączenia ogniw pakietu LiFePO4 (Moduł 11, Ekran A3) — kolejność kroków ma znaczenie " +
    "bezpieczeństwa, krok potwierdzony poza kolejnością daje ostrzeżenie. User podaje wyłącznie, które kroki " +
    "checklisty faktycznie wykonał. Użyj, gdy user pyta, w jakiej kolejności łączyć ogniwa albo czy może przejść " +
    "do kolejnego kroku.",
  inputSchema: PolaczeniaElektryczneToolInput,
  outputSchema: PolaczeniaElektryczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/polaczenia-elektryczne",
  handler: async (input) => {
    const wynik = calculatePolaczeniaElektryczne({ potwierdzoneIds: input.potwierdzoneIds })
    return {
      status: wynik.status,
      potwierdzoneWKolejnosci: wynik.value.potwierdzoneWKolejnosci,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
