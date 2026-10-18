/**
 * Narzędzie AI (9.3) dla Ekranu 16, Moduł 5 — "Wyłączniki RCD". `operationType: 'read'`.
 * Zainstalowany typ RCD, prąd różnicowy, obecność falownika hybrydowego/odbiorników z silnikami i
 * cel ochrony MUSZĄ pochodzić od użytkownika (karta katalogowa, rzeczywista instalacja) — model
 * nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWylaczniki } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/calculator"
import type { CelOchrony, TypRcd } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const TYPY_RCD = ["AC", "A", "B"] as [TypRcd, ...TypRcd[]]
const CELE_OCHRONY = ["osob", "pozarowa"] as [CelOchrony, ...CelOchrony[]]

export const WylacznikiRcdToolInput = z.object({
  falownikHybrydowy: z.boolean().describe("Czy falownik generuje składową stałą (typowe dla hybrydowych) — wymaga RCD typu B"),
  odbiornikiZSilnikami: z.boolean().describe("Czy w obwodzie są odbiorniki z silnikami — wymaga minimum RCD typu A"),
  zainstalowanyTyp: z.enum(TYPY_RCD).nullable().describe("Zainstalowany typ RCD (AC/A/B). null = jeszcze nie wybrano"),
  celOchrony: z.enum(CELE_OCHRONY).describe("Cel ochrony tego obwodu — reguluje próg (30mA osoby / 300mA przeciwpożarowo)"),
  progMa: z.number().describe("Prąd różnicowy zainstalowanego RCD [mA]. 0 = jeszcze nie podano"),
})

export type WylacznikiRcdToolInputT = z.infer<typeof WylacznikiRcdToolInput>

export const WylacznikiRcdToolOutput = z.object({
  progWymaganyMa: z.number(),
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type WylacznikiRcdToolOutputT = z.infer<typeof WylacznikiRcdToolOutput>

export const wylacznikiRcdTool: AiToolDefinition<WylacznikiRcdToolInputT, WylacznikiRcdToolOutputT> = {
  name: "policz_wylaczniki_rcd",
  description:
    "Sprawdza dobór wyłącznika różnicowoprądowego (RCD) wg trzech niezależnych reguł: falownik " +
    "hybrydowy wymaga typu B, odbiorniki z silnikami wymagają minimum typu A, oraz próg różnicowy " +
    "wynika z celu ochrony (≤30mA osoby / ≤300mA przeciwpożarowo). Nie zgaduje minimalnego typu, gdy " +
    "żadna z reguł nie ma zastosowania. Użyj, gdy user pyta o dobór RCD w instalacji off-grid.",
  inputSchema: WylacznikiRcdToolInput,
  outputSchema: WylacznikiRcdToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/wylaczniki-rcd",
  handler: async (input) => {
    const wynik = calculateWylaczniki(input)
    return {
      progWymaganyMa: wynik.value.progWymaganyMa,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
