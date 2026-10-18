/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 39 "Łączenie paneli z
 * powerbankiem/stacją zasilania". `operationType: 'read'`. Dane panelu (Voc, β, Isc) i stacji (max
 * napięcie/prąd wejścia) MUSZĄ pochodzić od usera z kart katalogowych — model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePanelDoStacjiZasilania } from "@/lib/core/modules/kalkulator-mobilny/panel-do-stacji-zasilania/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PanelDoStacjiZasilaniaToolInput = z.object({
  vocStcV: z.number().describe("Voc panelu w STC [V] — z karty panelu"),
  betaPctNaC: z.number().describe("Współczynnik temperaturowy Voc β [%/°C], ujemny — z karty panelu, nie zgaduj"),
  tminC: z.number().describe("Najniższa temperatura pracy [°C] — od usera"),
  liczbaSzeregowo: z.number().describe("Liczba paneli połączonych szeregowo"),
  maxNapiecieWejsciaV: z.number().describe("Max napięcie wejścia solarnego stacji [V] — z karty stacji"),
  iscA: z.number().optional().describe("Prąd zwarciowy Isc panelu [A] — opcjonalnie"),
  liczbaRownolegle: z.number().optional().describe("Liczba gałęzi równoległych — opcjonalnie"),
  maxPradWejsciaA: z.number().optional().describe("Max prąd wejścia solarnego stacji [A] — opcjonalnie"),
})
export type PanelDoStacjiZasilaniaToolInputT = z.infer<typeof PanelDoStacjiZasilaniaToolInput>

export const PanelDoStacjiZasilaniaToolOutput = z.object({
  status: z.enum(STATUSY),
  vocZimoweV: z.number().describe("Napięcie jałowe łańcucha w najniższej temperaturze [V]"),
  udzialLimituPct: z.number().describe("Udział limitu napięcia wejścia stacji [%]"),
  pradZwarciowyA: z.number().nullable().describe("Suma prądów zwarciowych gałęzi [A]; null = nie podano Isc"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PanelDoStacjiZasilaniaToolOutputT = z.infer<typeof PanelDoStacjiZasilaniaToolOutput>

export const panelDoStacjiZasilaniaTool: AiToolDefinition<
  PanelDoStacjiZasilaniaToolInputT,
  PanelDoStacjiZasilaniaToolOutputT
> = {
  name: "sprawdz_panel_do_stacji_zasilania",
  description:
    "Sprawdza, czy panele można podłączyć do przenośnej stacji zasilania/powerbanka (Moduł 12): Voc łańcucha w mrozie " +
    "(ten sam wzór co zimowy stress-test MPPT) vs max napięcie wejścia solarnego stacji. Twardy stop przy przekroczeniu, " +
    "ostrzeżenie powyżej 95% limitu. Opcjonalnie porównuje prąd zwarciowy z max prądem wejścia. Użyj, gdy user pyta, " +
    "czy jego panel/panele nie uszkodzą stacji typu EcoFlow/Bluetti.",
  inputSchema: PanelDoStacjiZasilaniaToolInput,
  outputSchema: PanelDoStacjiZasilaniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/panel-do-stacji-zasilania",
  handler: async (input) => {
    const wynik = calculatePanelDoStacjiZasilania({
      ...input,
      iscA: input.iscA ?? 0,
      liczbaRownolegle: input.liczbaRownolegle ?? 0,
      maxPradWejsciaA: input.maxPradWejsciaA ?? 0,
    })
    return {
      ...wynik.value,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
