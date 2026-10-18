/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A2 "Montaż mechaniczny + separacja ogniw" (LiFePO4).
 * `operationType: 'read'`. Docisk [kgf] pochodzi z pomiaru użytkownika (klucz dynamometryczny) —
 * tylko od usera, nigdy zgadywany. Próg 300-400 kgf to wzorzec "echo" z Modułu 4/Ekran 21.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMontazMechaniczny } from "@/lib/core/modules/montaz-baterii/montaz-mechaniczny/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MontazMechanicznyToolInput = z.object({
  dociskKgf: z.number().describe("Docisk ogniw pryzmatycznych [kgf], zmierzony kluczem dynamometrycznym — tylko od usera"),
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty już potwierdzonych (separatory, krawędzie, obudowa)"),
})
export type MontazMechanicznyToolInputT = z.infer<typeof MontazMechanicznyToolInput>

export const MontazMechanicznyToolOutput = z.object({
  status: z.enum(STATUSY),
  dociskKgf: z.number(),
  dociskWZakresie: z.boolean(),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MontazMechanicznyToolOutputT = z.infer<typeof MontazMechanicznyToolOutput>

export const montazMechanicznyTool: AiToolDefinition<MontazMechanicznyToolInputT, MontazMechanicznyToolOutputT> = {
  name: "sprawdz_montaz_mechaniczny_ogniw",
  description:
    "Sprawdza docisk ogniw pryzmatycznych LiFePO4 (Moduł 11, Ekran A2) wobec zalecanego zakresu 300-400 kgf " +
    "(wzorzec echo, ten sam próg co Moduł 4/Ekran 21) oraz postęp checklisty (separatory, krawędzie, obudowa). " +
    "Docisk podaje user z pomiaru kluczem dynamometrycznym — nie zgaduj. Użyj, gdy user pyta o docisk pakietu " +
    "albo gotowość montażu mechanicznego.",
  inputSchema: MontazMechanicznyToolInput,
  outputSchema: MontazMechanicznyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/montaz-mechaniczny",
  handler: async (input) => {
    const wynik = calculateMontazMechaniczny({
      dociskKgf: input.dociskKgf,
      potwierdzoneIds: input.potwierdzoneIds,
    })
    return {
      status: wynik.status,
      dociskKgf: wynik.value.dociskKgf,
      dociskWZakresie: wynik.value.dociskWZakresie,
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
