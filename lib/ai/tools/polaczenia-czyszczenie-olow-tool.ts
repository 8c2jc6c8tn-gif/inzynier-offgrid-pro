/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran B3 "Połączenia + czyszczenie biegunów"
 * (kwasowo-ołowiowa). `operationType: 'read'`. Czysty checklist — jedyny wejściowy fakt to lista
 * ID pozycji faktycznie sprawdzonych przez usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePolaczeniaCzyszczenieOlow } from "@/lib/core/modules/montaz-baterii/polaczenia-czyszczenie-olow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PolaczeniaCzyszczenieOlowToolInput = z.object({
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty połączeń i czyszczenia biegunów, które user faktycznie sprawdził"),
})
export type PolaczeniaCzyszczenieOlowToolInputT = z.infer<typeof PolaczeniaCzyszczenieOlowToolInput>

export const PolaczeniaCzyszczenieOlowToolOutput = z.object({
  status: z.enum(STATUSY),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PolaczeniaCzyszczenieOlowToolOutputT = z.infer<typeof PolaczeniaCzyszczenieOlowToolOutput>

export const polaczeniaCzyszczenieOlowTool: AiToolDefinition<
  PolaczeniaCzyszczenieOlowToolInputT,
  PolaczeniaCzyszczenieOlowToolOutputT
> = {
  name: "sprawdz_polaczenia_czyszczenie_olow",
  description:
    "Sprawdza połączenia i czyszczenie biegunów akumulatorów kwasowo-ołowiowych (Moduł 11, Ekran B3). User " +
    "podaje wyłącznie, które pozycje checklisty faktycznie sprawdził. Użyj, gdy user pyta o połączenia " +
    "międzyakumulatorowe albo czyszczenie biegunów.",
  inputSchema: PolaczeniaCzyszczenieOlowToolInput,
  outputSchema: PolaczeniaCzyszczenieOlowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/polaczenia-czyszczenie-olow",
  handler: async (input) => {
    const wynik = calculatePolaczeniaCzyszczenieOlow({ potwierdzoneIds: input.potwierdzoneIds })
    return {
      status: wynik.status,
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
