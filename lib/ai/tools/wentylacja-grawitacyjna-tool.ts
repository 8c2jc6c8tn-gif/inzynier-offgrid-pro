/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 9 "Straty przez wentylację grawitacyjną" (dawne 5.9).
 * `operationType: 'read'`. Kubatura, liczba wymian i temperatury MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateWentylacjaGrawitacyjna } from "@/lib/core/modules/ogrzewanie/wentylacja-grawitacyjna/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WentylacjaGrawitacyjnaToolInput = z.object({
  kubaturaM3: z.number().describe("Kubatura ogrzewana [m³]"),
  wymianyNaDobe: z.number().describe("Liczba wymian powietrza na dobę [1/doba] (test szczelności × 24 albo pomiar)"),
  tWewC: z.number().describe("Temperatura wewnątrz [°C]"),
  tZewnC: z.number().describe("Średnia temperatura zewnętrzna doby [°C]"),
  stratyPozostaleW: z.number().describe("Pozostałe straty ciepła budynku przy tych temperaturach [W]; 0 = bez udziału %"),
  sprawnoscOdzyskuPct: z.number().describe("Sprawność rekuperatora do porównania [%]; 0 = bez porównania"),
  dni: z.number().describe("Liczba dni do sumy okresu; 0 = tylko doba"),
  szczelnyDom: z.boolean().describe("Nowy, szczelny dom bez wentylacji mechanicznej"),
})
export type WentylacjaGrawitacyjnaToolInputT = z.infer<typeof WentylacjaGrawitacyjnaToolInput>

export const WentylacjaGrawitacyjnaToolOutput = z.object({
  status: z.enum(STATUSY),
  strumienM3H: z.number(),
  wymianyNaGodzine: z.number(),
  stratyW: z.number(),
  stratyDobaKwh: z.number(),
  stratyOkresKwh: z.number().nullable(),
  udzialPct: z.number().nullable(),
  stratyRekuperacjaDobaKwh: z.number().nullable(),
  udzialRekuperacjaPct: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WentylacjaGrawitacyjnaToolOutputT = z.infer<typeof WentylacjaGrawitacyjnaToolOutput>

export const wentylacjaGrawitacyjnaTool: AiToolDefinition<WentylacjaGrawitacyjnaToolInputT, WentylacjaGrawitacyjnaToolOutputT> = {
  name: "policz_straty_wentylacji_grawitacyjnej",
  description:
    "Straty ciepła przez wentylację grawitacyjną (kominy, nieszczelności) z kubatury i liczby wymian na dobę: " +
    "strumień powietrza, strata w W i kWh/dobę, suma okresu, udział w całkowitych stratach i ile zostałoby z " +
    "rekuperacją przy tym samym strumieniu. Użyj, gdy user pyta, ile ciepła ucieka kominem albo przez wentylację " +
    "grawitacyjną, jaki to procent strat domu, czy rekuperacja się opłaca w starym domu albo czy szczelny dom może " +
    "zostać bez wentylacji mechanicznej.",
  inputSchema: WentylacjaGrawitacyjnaToolInput,
  outputSchema: WentylacjaGrawitacyjnaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/wentylacja-grawitacyjna",
  handler: async (input) => {
    const wynik = calculateWentylacjaGrawitacyjna(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
