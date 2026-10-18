/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 10 "Sprawność inwertera przy niskim obciążeniu".
 * `operationType: 'read'`. Zapotrzebowanie, moc falownika i sprawność przy danym obciążeniu
 * pochodzą WYŁĄCZNIE od usera (karta katalogowa/krzywa producenta) — kalkulator nie interpoluje
 * sprawności z krzywej, nigdy nie zgaduj.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateSprawnoscInwertera } from "@/lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const SprawnoscInwerteraToolInput = z.object({
  zapotrzebowanieW: z.number().describe("Bieżące zapotrzebowanie [W] — od usera"),
  mocFalownikaW: z.number().describe("Znamionowa moc falownika [W] — od usera"),
  sprawnoscPct: z
    .number()
    .describe("Sprawność falownika przy tym obciążeniu [%] z karty katalogowej/krzywej producenta — od usera, nie zgaduj"),
})
export type SprawnoscInwerteraToolInputT = z.infer<typeof SprawnoscInwerteraToolInput>

export const SprawnoscInwerteraToolOutput = z.object({
  status: z.enum(STATUSY),
  realneZuzycieW: z.number(),
  obciazenieFalownikaPct: z.number(),
  strataPct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type SprawnoscInwerteraToolOutputT = z.infer<typeof SprawnoscInwerteraToolOutput>

export const sprawnoscInwerteraTool: AiToolDefinition<SprawnoscInwerteraToolInputT, SprawnoscInwerteraToolOutputT> = {
  name: "policz_realne_zuzycie_przy_niskim_obciazeniu",
  description:
    "Liczy rzeczywiste zużycie energii [W] i stratę [%] wynikające z podanej sprawności falownika przy danym " +
    "obciążeniu, oraz procent obciążenia falownika — Moduł 2, Ekran 10. Sprawność podaje user z karty " +
    "katalogowej/krzywej producenta — nie interpoluj jej samodzielnie z krzywej. Użyj, gdy user pyta o wpływ " +
    "niskiego obciążenia falownika na realne zużycie energii.",
  inputSchema: SprawnoscInwerteraToolInput,
  outputSchema: SprawnoscInwerteraToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie",
  handler: async (input) => {
    const wynik = calculateSprawnoscInwertera({
      zapotrzebowanieW: input.zapotrzebowanieW,
      mocFalownikaW: input.mocFalownikaW,
      sprawnoscPct: input.sprawnoscPct,
    })
    return {
      status: wynik.status,
      realneZuzycieW: wynik.value.realneZuzycieW,
      obciazenieFalownikaPct: wynik.value.obciazenieFalownikaPct,
      strataPct: wynik.value.strataPct,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
