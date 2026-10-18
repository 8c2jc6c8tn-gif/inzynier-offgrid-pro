/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 8 (podpunkt 1) "Moc pozorna / cos φ". `operationType:
 * 'read'`. Moc czynna i cos φ pochodzą WYŁĄCZNIE od usera (cos φ z karty katalogowej urządzenia
 * z silnikiem/sprężarką, źródło podaje ~0,7 jako typową wartość, ale to nie domyślna do zgadywania).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMocPozornaCosfi } from "@/lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MocPozornaCosfiToolInput = z.object({
  mocCzynnaW: z.number().describe("Moc czynna urządzenia z silnikiem/sprężarką [W] — od usera"),
  cosFi: z.number().describe("Współczynnik mocy (cos φ) z karty katalogowej urządzenia — od usera, nie zgaduj"),
})
export type MocPozornaCosfiToolInputT = z.infer<typeof MocPozornaCosfiToolInput>

export const MocPozornaCosfiToolOutput = z.object({
  status: z.enum(STATUSY),
  mocPozornaVA: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MocPozornaCosfiToolOutputT = z.infer<typeof MocPozornaCosfiToolOutput>

export const mocPozornaCosfiTool: AiToolDefinition<MocPozornaCosfiToolInputT, MocPozornaCosfiToolOutputT> = {
  name: "policz_moc_pozorna",
  description:
    "Liczy moc pozorną [VA] z mocy czynnej i cos φ (VA = P / cos φ) — Moduł 2, Ekran 8, podpunkt 'Moc pozorna/cos φ'. " +
    "Moc czynna i cos φ podaje user z karty katalogowej urządzenia — nie zgaduj cos φ. Nie liczy prądów " +
    "rozruchowych ani współczynnika jednoczesności (nie zbudowane). Użyj, gdy user pyta o dobór falownika/kabli " +
    "pod moc pozorną urządzenia z silnikiem.",
  inputSchema: MocPozornaCosfiToolInput,
  outputSchema: MocPozornaCosfiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/moc-pozorna-cosfi",
  handler: async (input) => {
    const wynik = calculateMocPozornaCosfi({ mocCzynnaW: input.mocCzynnaW, cosFi: input.cosFi })
    return {
      status: wynik.status,
      mocPozornaVA: wynik.value.mocPozornaVA,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
