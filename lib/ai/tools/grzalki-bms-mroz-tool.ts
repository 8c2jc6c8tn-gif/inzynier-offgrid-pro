/**
 * Narzędzie AI (9.3) dla Ekranu 5, Moduł 4 "Magazyn energii / baterie" — "Grzałki BMS i ochrona
 * przed mrozem". `operationType: 'read'`. Implementuje wyłącznie drzewo decyzyjne źródła prądu
 * na grzanie — temperatura minimalna, SoC i dostępność produkcji PV MUSZĄ pochodzić z
 * pomiaru/live danych, nigdy zgadywane.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateGrzalkiBmsMroz } from "@/lib/core/modules/baterie/grzalki-bms-mroz/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const GrzalkiBmsMrozToolInput = z.object({
  temperaturaMinC: z.number().describe("Najniższa spodziewana temperatura przy baterii [°C] — tylko od usera"),
  socPct: z.number().describe("Bieżący SoC baterii [%]"),
  produkcjaPv: z.enum(["tak", "nie"]).describe("Czy w tej chwili jest produkcja PV — tylko od usera, nie zgaduj"),
})
export type GrzalkiBmsMrozToolInputT = z.infer<typeof GrzalkiBmsMrozToolInput>

export const GrzalkiBmsMrozToolOutput = z.object({
  status: z.enum(STATUSY),
  temperaturaMinC: z.number(),
  socPct: z.number(),
  zrodloGrzania: z.enum(["brak-potrzeby", "pv", "bateria", "wstrzymane"]),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type GrzalkiBmsMrozToolOutputT = z.infer<typeof GrzalkiBmsMrozToolOutput>

export const grzalkiBmsMrozTool: AiToolDefinition<GrzalkiBmsMrozToolInputT, GrzalkiBmsMrozToolOutputT> = {
  name: "sprawdz_zrodlo_grzania_bms_w_mrozie",
  description:
    "Wg drzewa decyzyjnego wyznacza źródło prądu na grzałki BMS w mrozie: brak potrzeby, PV, bateria albo " +
    "wstrzymanie grzania przy niskim SoC (Moduł 4, Ekran 5). Temperatura minimalna, SoC i dostępność produkcji " +
    "PV MUSZĄ pochodzić z pomiaru/live danych — nie zgaduj. Użyj, gdy user pyta, skąd wziąć prąd na grzanie " +
    "baterii zimą.",
  inputSchema: GrzalkiBmsMrozToolInput,
  outputSchema: GrzalkiBmsMrozToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/grzalki-bms-mroz",
  handler: async (input) => {
    const wynik = calculateGrzalkiBmsMroz({
      temperaturaMinC: input.temperaturaMinC,
      socPct: input.socPct,
      produkcjaPv: input.produkcjaPv,
    })
    return {
      status: wynik.status,
      temperaturaMinC: wynik.value.temperaturaMinC,
      socPct: wynik.value.socPct,
      zrodloGrzania: wynik.value.zrodloGrzania,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
