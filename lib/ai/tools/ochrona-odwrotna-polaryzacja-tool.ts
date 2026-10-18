/**
 * Narzędzie AI (9.3) dla Ekranu 15, Moduł 5 — "Ochrona przed odwrotną polaryzacją".
 * `operationType: 'read'`. Zastosowany typ ochrony MUSI pochodzić od użytkownika (rzeczywisty
 * projekt/instalacja) — model nigdy go nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateOchronaOdwrotnaPolaryzacja } from "@/lib/core/modules/okablowanie/ochrona-odwrotna-polaryzacja/calculator"
import type { MiejsceObwodu, TypOchrony } from "@/lib/core/modules/okablowanie/ochrona-odwrotna-polaryzacja/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const MIEJSCA = ["bateria", "panele", "falownik"] as [MiejsceObwodu, ...MiejsceObwodu[]]
const TYPY_OCHRONY = ["brak", "dioda-blokujaca", "wylacznik-blokada-mechaniczna"] as [TypOchrony, ...TypOchrony[]]

export const OchronaOdwrotnaPolaryzacjaToolInput = z.object({
  miejsceObwodu: z.enum(MIEJSCA).nullable().describe("Miejsce obwodu — informacyjnie, źródło nie wiąże z nim werdyktu"),
  typOchrony: z.enum(TYPY_OCHRONY).nullable().describe("Zastosowany typ ochrony przed odwrotną polaryzacją. null = jeszcze nie wybrano"),
})

export type OchronaOdwrotnaPolaryzacjaToolInputT = z.infer<typeof OchronaOdwrotnaPolaryzacjaToolInput>

export const OchronaOdwrotnaPolaryzacjaToolOutput = z.object({
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type OchronaOdwrotnaPolaryzacjaToolOutputT = z.infer<typeof OchronaOdwrotnaPolaryzacjaToolOutput>

export const ochronaOdwrotnaPolaryzacjaTool: AiToolDefinition<
  OchronaOdwrotnaPolaryzacjaToolInputT,
  OchronaOdwrotnaPolaryzacjaToolOutputT
> = {
  name: "policz_ochrone_odwrotna_polaryzacje",
  description:
    "Sprawdza, czy obwód ma zastosowaną ochronę przed odwrotną polaryzacją (dioda blokująca lub " +
    "wyłącznik z blokadą mechaniczną) — twardy stop, gdy ochrona brakuje. Nie rekomenduje typu ochrony " +
    "per miejsce obwodu — źródło nie podaje takiej reguły. Użyj, gdy user pyta o ochronę przed odwrotną " +
    "polaryzacją w instalacji off-grid.",
  inputSchema: OchronaOdwrotnaPolaryzacjaToolInput,
  outputSchema: OchronaOdwrotnaPolaryzacjaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/ochrona-odwrotna-polaryzacja",
  handler: async (input) => {
    const wynik = calculateOchronaOdwrotnaPolaryzacja(input)
    return {
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
