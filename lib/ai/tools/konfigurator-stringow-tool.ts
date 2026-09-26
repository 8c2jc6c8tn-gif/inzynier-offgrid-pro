/**
 * Narzędzie AI (9.3) dla Ekranu 11, Moduł 3 "Instalacja PV" — "Konfigurator stringów: szereg /
 * równolegle / mieszany". `operationType: 'read'`. Vmp/Imp panelu MUSZĄ pochodzić z karty
 * katalogowej użytkownika — model nigdy ich nie zgaduje. Wynik podany dla warunków STC.
 */
import { z } from "zod"
import { calculateKonfiguratorStringow } from "@/lib/core/modules/pv/konfigurator-stringow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KonfiguratorStringowToolInput = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("szereg"),
    vmpV: z.number().describe("Vmp pojedynczego panelu [V], z karty katalogowej"),
    impA: z.number().describe("Imp pojedynczego panelu [A], z karty katalogowej"),
    liczbaPaneli: z.number(),
  }),
  z.object({
    mode: z.literal("rownolegle"),
    vmpV: z.number().describe("Vmp pojedynczego panelu [V], z karty katalogowej"),
    impA: z.number().describe("Imp pojedynczego panelu [A], z karty katalogowej"),
    liczbaPaneli: z.number(),
  }),
  z.object({
    mode: z.literal("mieszany"),
    vmpV: z.number().describe("Vmp pojedynczego panelu [V], z karty katalogowej"),
    impA: z.number().describe("Imp pojedynczego panelu [A], z karty katalogowej"),
    panelWGrupie: z.number().describe("Liczba paneli połączonych szeregowo w jednej grupie"),
    liczbaGrup: z.number().describe("Liczba takich grup połączonych równolegle"),
  }),
])
export type KonfiguratorStringowToolInputT = z.infer<typeof KonfiguratorStringowToolInput>

export const KonfiguratorStringowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  voltageV: z.number(),
  currentA: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type KonfiguratorStringowToolOutputT = z.infer<typeof KonfiguratorStringowToolOutput>

export const konfiguratorStringowTool: AiToolDefinition<
  KonfiguratorStringowToolInputT,
  KonfiguratorStringowToolOutputT
> = {
  name: "policz_konfiguracje_stringow",
  description:
    "Liczy napięcie i prąd wynikowy tablicy PV dla trzech sposobów łączenia paneli (Moduł 3, Ekran 11): " +
    "szereg (napięcia się sumują), równolegle (prądy się sumują) albo mieszany (grupy szeregowe połączone " +
    "równolegle). Vmp/Imp panelu podaje user z karty katalogowej — nie zgaduj. Wynik dla warunków STC. Użyj, " +
    "gdy user pyta, jakie napięcie/prąd da dana konfiguracja połączenia paneli.",
  inputSchema: KonfiguratorStringowToolInput,
  outputSchema: KonfiguratorStringowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/konfigurator-stringow",
  handler: async (input) => {
    const wynik = calculateKonfiguratorStringow(input)
    return {
      status: wynik.status,
      voltageV: wynik.value.voltageV,
      currentA: wynik.value.currentA,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
