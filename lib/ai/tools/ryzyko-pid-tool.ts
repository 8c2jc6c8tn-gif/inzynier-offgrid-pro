/**
 * Narzędzie AI (9.3) dla Modułu 3 "Instalacja PV" — "Zjawisko PID (degradacja indukowana
 * napięciem)". `operationType: 'read'`. Napięcie systemu DC (Voc × liczba paneli w stringu) i
 * informacja o wysokiej wilgotności w miejscu montażu MUSZĄ pochodzić od użytkownika — model
 * nigdy ich nie zgaduje. Bez symulacji tempa degradacji mocy — tylko próg ostrzegawczy ze źródła.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateRyzykoPid } from "@/lib/core/modules/pv/ryzyko-pid/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const RyzykoPidToolInput = z.object({
  napiecieDcV: z.number().describe("Napięcie systemu DC względem ziemi (Voc panelu × liczba paneli w stringu) [V]"),
  wilgotnoscWysoka: z.boolean().describe("Wysoka wilgotność w miejscu montażu — dana usera, nie zgaduj"),
})
export type RyzykoPidToolInputT = z.infer<typeof RyzykoPidToolInput>

export const RyzykoPidToolOutput = z.object({
  status: z.enum(STATUSY),
  ryzykoPid: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type RyzykoPidToolOutputT = z.infer<typeof RyzykoPidToolOutput>

export const ryzykoPidTool: AiToolDefinition<RyzykoPidToolInputT, RyzykoPidToolOutputT> = {
  name: "sprawdz_ryzyko_pid",
  description:
    "Sprawdza ryzyko zjawiska PID (degradacja indukowana napięciem) — ostrzeżenie, gdy napięcie systemu DC " +
    "przekracza próg ze źródła przy jednocześnie wysokiej wilgotności (Moduł 3). Bez wzoru na tempo utraty " +
    "mocy — tylko próg ostrzegawczy i rekomendacja (uziemienie konstrukcji, panele anty-PID). Napięcie DC i " +
    "wilgotność podaje user — nie zgaduj. Użyj, gdy user pyta o ryzyko PID w swojej instalacji.",
  inputSchema: RyzykoPidToolInput,
  outputSchema: RyzykoPidToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/ryzyko-pid",
  handler: async (input) => {
    const wynik = calculateRyzykoPid(input)
    return {
      status: wynik.status,
      ryzykoPid: wynik.value.ryzykoPid,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
