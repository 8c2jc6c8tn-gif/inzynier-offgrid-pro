/**
 * Narzędzie AI (9.3) dla Modułu 11, Ekran A1 "Weryfikacja kompletności + kontrola wstępna ogniw"
 * (ścieżka LiFePO4). `operationType: 'read'`. Napięcia poszczególnych ogniw i obecność
 * balancera BMS pochodzą WYŁĄCZNIE z pomiaru/oględzin usera przed montażem — nigdy zgadywane
 * przez model. To dane bezpieczeństwa (różnica napięć >0,05V, brak balancera BMS).
 */
import { z } from "zod"
import { calculateWeryfikacjaOgniw } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WeryfikacjaOgniwToolInput = z.object({
  napiecieSystemu: z.union([z.literal(12), z.literal(24), z.literal(48)]),
  napieciaOgniwV: z
    .array(z.number())
    .min(1)
    .describe("Napięcie każdego ogniwa [V], zmierzone multimetrem przed montażem — tylko od usera, nie zgaduj"),
  bmsMaBalancer: z.boolean().describe("Czy BMS ma przewody balansujące — tylko od usera, dane bezpieczeństwa"),
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty już potwierdzonych przez usera"),
})
export type WeryfikacjaOgniwToolInputT = z.infer<typeof WeryfikacjaOgniwToolInput>

export const WeryfikacjaOgniwToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  liczbaOgniw: z.number(),
  minNapiecieV: z.number(),
  maxNapiecieV: z.number(),
  roznicaNapiecV: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WeryfikacjaOgniwToolOutputT = z.infer<typeof WeryfikacjaOgniwToolOutput>

export const weryfikacjaOgniwTool: AiToolDefinition<WeryfikacjaOgniwToolInputT, WeryfikacjaOgniwToolOutputT> = {
  name: "sprawdz_wstepna_weryfikacje_ogniw",
  description:
    "Weryfikacja kompletności pakietu LiFePO4 przed montażem (Moduł 11, Ekran A1): liczba ogniw zgodna z " +
    "napięciem systemu, różnica napięć między ogniwami (ΔV = Vmax − Vmin, próg 0,05V), obecność balancera BMS. " +
    "Napięcia ogniw i obecność balancera podaje user z pomiaru — nie zgaduj. Użyj, gdy user pyta, czy pakiet " +
    "ogniw jest gotowy do montażu.",
  inputSchema: WeryfikacjaOgniwToolInput,
  outputSchema: WeryfikacjaOgniwToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "montaz-baterii/weryfikacja-ogniw",
  handler: async (input) => {
    const wynik = calculateWeryfikacjaOgniw({
      napiecieSystemu: input.napiecieSystemu,
      napieciaOgniwV: input.napieciaOgniwV,
      bmsMaBalancer: input.bmsMaBalancer,
      potwierdzoneIds: input.potwierdzoneIds,
    })
    return {
      status: wynik.status,
      liczbaOgniw: wynik.value.liczbaOgniw,
      minNapiecieV: wynik.value.minNapiecieV,
      maxNapiecieV: wynik.value.maxNapiecieV,
      roznicaNapiecV: wynik.value.roznicaNapiecV,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
