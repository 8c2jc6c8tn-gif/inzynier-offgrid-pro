/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 10 "Łączenie paneli przenośnych". `operationType: 'read'`.
 * Sprawdza zgodność typów i złączy; napięcie/prąd wobec wejścia stacji liczy
 * `sprawdz_panel_do_stacji_zasilania` (E39).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateLaczeniePaneliPrzenosnych } from "@/lib/core/modules/kalkulator-mobilny/laczenie-paneli-przenosnych/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen } from "./teksty-wyniku"

const ZLACZA = ["mc4", "xt60", "anderson", "dc5521", "usb", "inne"] as const

export const LaczeniePaneliPrzenosnychToolInput = z.object({
  typ: z.enum(["skladany", "mata", "powerbank-solarny"]).nullable().describe("Typ panelu; null = nie wiadomo"),
  liczbaPaneli: z.number().describe("Ile paneli user chce połączyć"),
  takieSame: z.boolean().nullable().describe("Czy wszystkie panele to ten sam model; null = nie wiadomo"),
  zlaczePaneli: z.enum(ZLACZA).nullable().describe("Złącze wyjściowe paneli"),
  zlaczeWejscia: z.enum(ZLACZA).nullable().describe("Złącze wejścia PV stacji/regulatora"),
  maAdapter: z.boolean().describe("Czy user ma przejściówkę między złączami"),
})
export type LaczeniePaneliPrzenosnychToolInputT = z.infer<typeof LaczeniePaneliPrzenosnychToolInput>

export const LaczeniePaneliPrzenosnychToolOutput = z.object({
  status: z.enum(STATUSY),
  moznaLaczyc: z.boolean().describe("false = twardy stop, nie łączyć"),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type LaczeniePaneliPrzenosnychToolOutputT = z.infer<typeof LaczeniePaneliPrzenosnychToolOutput>

export const laczeniePaneliPrzenosnychTool: AiToolDefinition<
  LaczeniePaneliPrzenosnychToolInputT,
  LaczeniePaneliPrzenosnychToolOutputT
> = {
  name: "sprawdz_laczenie_paneli_przenosnych",
  description:
    "Sprawdza, czy panele przenośne (składane, maty, powerbanki solarne) można połączyć ze sobą i ze " +
    "stacją: typ panelu, zgodność złączy (MC4, XT60, Anderson, DC 5521, USB), adapter, takie same panele. " +
    "Użyj, gdy user pyta, czy może połączyć dwa panele turystyczne albo podłączyć panel z innym wtykiem. " +
    "Napięcie i prąd wobec wejścia stacji sprawdź potem narzędziem sprawdz_panel_do_stacji_zasilania.",
  inputSchema: LaczeniePaneliPrzenosnychToolInput,
  outputSchema: LaczeniePaneliPrzenosnychToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/laczenie-paneli-przenosnych",
  handler: async (input) => {
    const wynik = calculateLaczeniePaneliPrzenosnych(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
