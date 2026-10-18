/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A8 "Ocena zużycia ogniwa po demontażu" (LiFePO4).
 * `operationType: 'read'`. Widoczne puchnięcie obudowy to ocena wizualna wyłącznie usera (nie da
 * się jej zgadnąć) — `null` oznacza jeszcze nieocenione, wygrywa natychmiast nad checklistą.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOcenaZuzycia } from "@/lib/core/modules/montaz-baterii/ocena-zuzycia/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OcenaZuzyciaToolInput = z.object({
  widocznePuchniecie: z
    .boolean()
    .nullable()
    .describe("Ocena wizualna usera: czy widoczne puchnięcie obudowy ogniwa. null = jeszcze nie oceniono"),
  potwierdzoneIds: z.array(z.string()).describe("ID pozostałych pomiarów z checklisty, które user faktycznie wykonał"),
})
export type OcenaZuzyciaToolInputT = z.infer<typeof OcenaZuzyciaToolInput>

export const OcenaZuzyciaToolOutput = z.object({
  status: z.enum(STATUSY),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OcenaZuzyciaToolOutputT = z.infer<typeof OcenaZuzyciaToolOutput>

export const ocenaZuzyciaTool: AiToolDefinition<OcenaZuzyciaToolInputT, OcenaZuzyciaToolOutputT> = {
  name: "ocen_zuzycie_ogniwa",
  description:
    "Ocena zużycia zdemontowanego ogniwa LiFePO4 (Moduł 11, Ekran A8): widoczne puchnięcie obudowy wygrywa " +
    "natychmiast (ostrzeżenie krytyczne), pozostałe pomiary (napięcie po 24h, rezystancja) to checklist " +
    "procesu bez progu liczbowego w źródle. Ocenę wizualną puchnięcia podaje wyłącznie user — nie zgaduj. " +
    "Użyj, gdy user pyta, czy zdemontowane ogniwo nadaje się do dalszego użytku.",
  inputSchema: OcenaZuzyciaToolInput,
  outputSchema: OcenaZuzyciaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/ocena-zuzycia",
  handler: async (input) => {
    const wynik = calculateOcenaZuzycia({
      widocznePuchniecie: input.widocznePuchniecie,
      potwierdzoneIds: input.potwierdzoneIds,
    })
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
