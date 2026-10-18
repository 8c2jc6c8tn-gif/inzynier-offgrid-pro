/**
 * Narzędzie AI (9.3) dla Ekranu 13, Moduł 3 "Instalacja PV" — "Symulacja zacienienia i wpływu na
 * diody bocznikujące". `operationType: 'read'`. Moc nominalna panelu, liczba zacienionych sekcji
 * (0-3) i liczba paneli w stringu MUSZĄ pochodzić od użytkownika — model nigdy ich nie zgaduje.
 * Liczy TYLKO stratę mocy panelu — strata na poziomie całego stringu NIE jest liczona liczbowo
 * (zależy od konfiguracji, źródło nie podaje wzoru).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateZacienienieDiodyBocznikujace } from "@/lib/core/modules/pv/zacienienie-diody-bocznikujace/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZacienienieDiodyBocznikujaceToolInput = z.object({
  mocPaneluNominalnaW: z.number().describe("Moc znamionowa panelu (STC) [W]"),
  liczbaZacienionychSekcji: z.number().min(0).max(3).describe("Liczba zacienionych sekcji panelu (0-3, jedna dioda bocznikująca na sekcję)"),
  liczbaPaneliWStringu: z
    .number()
    .describe("Liczba paneli połączonych szeregowo w stringu — kontekst do oceny skali problemu, nie do liczenia straty stringu"),
})
export type ZacienienieDiodyBocznikujaceToolInputT = z.infer<typeof ZacienienieDiodyBocznikujaceToolInput>

export const ZacienienieDiodyBocznikujaceToolOutput = z.object({
  status: z.enum(STATUSY),
  strataPaneluPct: z.number(),
  mocPaneluRzeczywistaW: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ZacienienieDiodyBocznikujaceToolOutputT = z.infer<typeof ZacienienieDiodyBocznikujaceToolOutput>

export const zacienienieDiodyBocznikujaceTool: AiToolDefinition<
  ZacienienieDiodyBocznikujaceToolInputT,
  ZacienienieDiodyBocznikujaceToolOutputT
> = {
  name: "policz_strate_zacienienia_diody_bocznikujacej",
  description:
    "Liczy stratę mocy panelu PV przy zacienieniu 0-3 sekcji (każda sekcja ma własną diodę bocznikującą) " +
    "(Moduł 3, Ekran 13). Liczy TYLKO poziom panelu — strata na poziomie całego stringu NIE jest liczona " +
    "liczbowo, bo zależy od konfiguracji (liczba paneli, topologia MPPT), a źródło nie podaje na to wzoru; " +
    "wynik zwraca tylko opisową uwagę o skali problemu na stringu. Użyj, gdy user pyta, ile mocy traci panel " +
    "przy zacienieniu części powierzchni.",
  inputSchema: ZacienienieDiodyBocznikujaceToolInput,
  outputSchema: ZacienienieDiodyBocznikujaceToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/zacienienie-diody-bocznikujace",
  handler: async (input) => {
    const wynik = calculateZacienienieDiodyBocznikujace(input)
    return {
      status: wynik.status,
      strataPaneluPct: wynik.value.strataPaneluPct,
      mocPaneluRzeczywistaW: wynik.value.mocPaneluRzeczywistaW,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
