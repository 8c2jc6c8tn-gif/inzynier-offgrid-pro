/**
 * Narzędzie AI (9.3) dla Ekranu 3, Moduł 5 — "Szyny zbiorcze i połączenia" (dolna sekcja E,
 * checklist momentów dokręcania). `operationType: 'read'`. Lista potwierdzonych kroków MUSI
 * pochodzić od użytkownika (rzeczywiste dokręcenie kluczem dynamometrycznym) — model nigdy jej
 * nie zgaduje. Górna sekcja D (dobór przekroju szyny wg wytrzymałości zwarciowej) nie jest
 * zbudowana — brak wzoru/tabeli w źródle.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSzynyZbiorczePolaczenia } from "@/lib/core/modules/okablowanie/szyny-zbiorcze-polaczenia/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/szyny-zbiorcze-polaczenia/constants"
import type { AiToolDefinition } from "../types"

const ID_KROKOW = CHECKLIST_ITEMS.map((item) => item.id) as [string, ...string[]]

export const SzynyZbiorczePolaczeniaToolInput = z.object({
  potwierdzoneIds: z
    .array(z.enum(ID_KROKOW))
    .describe("Lista ID kroków (momenty dokręcania zacisków/szyny/uziomu, kontrola po 24h), które user potwierdził jako wykonane"),
})

export type SzynyZbiorczePolaczeniaToolInputT = z.infer<typeof SzynyZbiorczePolaczeniaToolInput>

export const SzynyZbiorczePolaczeniaToolOutput = z.object({
  potwierdzone: z.number(),
  razem: z.number(),
  status: z.enum(STATUSY),
  wersjaKalkulatora: z.string(),
})

export type SzynyZbiorczePolaczeniaToolOutputT = z.infer<typeof SzynyZbiorczePolaczeniaToolOutput>

export const szynyZbiorczePolaczeniaTool: AiToolDefinition<
  SzynyZbiorczePolaczeniaToolInputT,
  SzynyZbiorczePolaczeniaToolOutputT
> = {
  name: "policz_szyny_zbiorcze_polaczenia",
  description:
    "Sprawdza checklistę momentów dokręcania połączeń szyn zbiorczych (zacisk baterii M8: 8N·m, " +
    "szyna główna M10: 12N·m, uziom M8: 8N·m) i ponownej kontroli po 24h (ważne dla połączeń " +
    "aluminiowych). Nie liczy doboru przekroju szyny wg wytrzymałości zwarciowej — brak wzoru w źródle. " +
    "Użyj, gdy user pyta o dokręcanie/montaż szyn zbiorczych instalacji off-grid.",
  inputSchema: SzynyZbiorczePolaczeniaToolInput,
  outputSchema: SzynyZbiorczePolaczeniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/szyny-zbiorcze-polaczenia",
  handler: async (input) => {
    const wynik = calculateSzynyZbiorczePolaczenia(input)
    return {
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      status: wynik.status,
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
