/**
 * Narzędzie AI (9.3) dla Ekranu 21, Moduł 4 "Magazyn energii / baterie" — "Pozycjonowanie ogniw
 * (kompresja/spuchnięcie)". `operationType: 'read'`. Docisk i obecność luzu na pęcznienie MUSZĄ
 * pochodzić z pomiaru/oględzin usera — dane bezpieczeństwa mechanicznego pakietu ogniw.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePozycjonowanieOgniw } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PozycjonowanieOgniwToolInput = z.object({
  dociskKgf: z.number().describe("Zastosowany docisk na pakiet ogniw [kgf] — z pomiaru, tylko od usera"),
  luzNaPeczenie: z.boolean().describe("Czy zostawiono min. 1 mm luzu na pęcznienie (dylatację) podczas ładowania — tylko od usera"),
})
export type PozycjonowanieOgniwToolInputT = z.infer<typeof PozycjonowanieOgniwToolInput>

export const PozycjonowanieOgniwToolOutput = z.object({
  status: z.enum(STATUSY),
  dociskKgf: z.number(),
  wZakresie: z.boolean(),
  luzNaPeczenie: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PozycjonowanieOgniwToolOutputT = z.infer<typeof PozycjonowanieOgniwToolOutput>

export const pozycjonowanieOgniwTool: AiToolDefinition<PozycjonowanieOgniwToolInputT, PozycjonowanieOgniwToolOutputT> = {
  name: "sprawdz_docisk_ogniw",
  description:
    "Sprawdza, czy zastosowany docisk mechaniczny na pakiet ogniw mieści się w zalecanym zakresie i czy " +
    "zostawiono luz na pęcznienie podczas ładowania (Moduł 4, Ekran 21). Docisk i obecność luzu podaje user " +
    "z pomiaru/oględzin — nie zgaduj. Użyj, gdy user pyta o prawidłowy docisk pakietu ogniw.",
  inputSchema: PozycjonowanieOgniwToolInput,
  outputSchema: PozycjonowanieOgniwToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/pozycjonowanie-ogniw",
  handler: async (input) => {
    const wynik = calculatePozycjonowanieOgniw({ dociskKgf: input.dociskKgf, luzNaPeczenie: input.luzNaPeczenie })
    return {
      status: wynik.status,
      dociskKgf: wynik.value.dociskKgf,
      wZakresie: wynik.value.wZakresie,
      luzNaPeczenie: wynik.value.luzNaPeczenie,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
