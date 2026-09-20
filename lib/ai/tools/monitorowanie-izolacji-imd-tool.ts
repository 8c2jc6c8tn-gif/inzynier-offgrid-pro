/**
 * Narzędzie AI (9.3) dla Ekranu 18, Moduł 5 — "Monitorowanie izolacji (IMD)". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateMonitorowanieIzolacjiImd } from "@/lib/core/modules/okablowanie/monitorowanie-izolacji-imd/calculator"
import type { AiToolDefinition } from "../types"

export const MonitorowanieIzolacjiImdToolInput = z.object({
  ukladIt: z.boolean().describe("Czy układ sieci jest typu IT (bez bezpośredniego uziemienia punktu neutralnego)"),
  maZainstalowanyImd: z.boolean().describe("Czy IMD jest już zainstalowany — istotne tylko, gdy ukladIt=true"),
  progAlarmuKOm: z
    .number()
    .describe("Próg alarmu IMD w kΩ — istotny tylko, gdy ukladIt=true i maZainstalowanyImd=true. 0 = jeszcze nie ustalony"),
})

export type MonitorowanieIzolacjiImdToolInputT = z.infer<typeof MonitorowanieIzolacjiImdToolInput>

export const MonitorowanieIzolacjiImdToolOutput = z.object({
  wymagany: z.boolean(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type MonitorowanieIzolacjiImdToolOutputT = z.infer<typeof MonitorowanieIzolacjiImdToolOutput>

export const monitorowanieIzolacjiImdTool: AiToolDefinition<
  MonitorowanieIzolacjiImdToolInputT,
  MonitorowanieIzolacjiImdToolOutputT
> = {
  name: "policz_monitorowanie_izolacji_imd",
  description:
    "Sprawdza, czy dla danego typu układu sieci (IT/TN/TT) wymagany jest monitor izolacji (IMD), " +
    "i czy jest poprawnie zainstalowany. Użyj, gdy user pyta o IMD, monitorowanie izolacji, albo " +
    "bezpieczeństwo doziemienia w układzie IT.",
  inputSchema: MonitorowanieIzolacjiImdToolInput,
  outputSchema: MonitorowanieIzolacjiImdToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/monitorowanie-izolacji-imd",
  handler: async (input) => {
    const wynik = calculateMonitorowanieIzolacjiImd(input)
    return {
      wymagany: wynik.value.wymagany,
      status: wynik.status,
      ostrzezenia: wynik.warnings.map((w) => w.technicalMessage),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
