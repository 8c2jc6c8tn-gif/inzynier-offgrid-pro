/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 25 "Deep Winter Energy Budget" (dawne 6.39→7.37).
 * `operationType: 'read'`. Plan miesiąca, zużycie narastające i cele MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateDeepWinterBudget } from "@/lib/core/modules/stress-test/deep-winter-budget/calculator"
import { CELE_BUDZETU } from "@/lib/core/modules/stress-test/deep-winter-budget/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DeepWinterBudgetToolInput = z.object({
  dniMiesiaca: z.number().describe("Liczba dni miesiąca (28..31)"),
  biezacyDzien: z.number().describe("Bieżący dzień miesiąca (1..N); zużycie liczone od dnia 1 włącznie z tym dniem"),
  planPvKwh: z.number().describe("Planowana energia z PV w miesiącu [kWh]"),
  planAgregatKwh: z.number().describe("Planowana energia z agregatu w miesiącu [kWh]; 0 = brak"),
  planMagazynKwh: z.number().describe("Zaplanowana rezerwa użyteczna magazynu [kWh]; 0 = brak"),
  zuzycieNarastajaceKwh: z.number().describe("Zużycie od dnia 1 do dziś [kWh] z licznika"),
  cele: z
    .array(
      z.object({
        cel: z.enum(CELE_BUDZETU as unknown as [string, ...string[]]).describe("ogrzewanie, cwu, pompy, oswietlenie lub inne"),
        udzialPlanuPct: z.number().describe("Udział kategorii w planie [%]"),
        zuzycieKwh: z.number().describe("Zużycie kategorii od dnia 1 [kWh]"),
      }),
    )
    .describe("Opcjonalny podział planu na kategorie; pusta lista = bez podziału"),
  udzialOgrzewaniaPct: z.number().describe("Opcjonalnie: udział ogrzewania w zużyciu [%]; 0 = brak"),
  roznicaTemperaturK: z.number().describe("Opcjonalnie: średnia różnica temperatur wewnątrz–na zewnątrz [K]; 0 = brak"),
})
export type DeepWinterBudgetToolInputT = z.infer<typeof DeepWinterBudgetToolInput>

export const DeepWinterBudgetToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  planKwh: z.number(),
  budzetNarastajacyKwh: z.number(),
  odchyleniePct: z.number(),
  zostaloKwh: z.number(),
  tempoBiezaceKwhDzien: z.number(),
  tempoDopuszczalneKwhDzien: z.number().nullable(),
  prognozaKoniecMiesiacaKwh: z.number(),
  dzienWyczerpaniaPlanu: z.number().nullable(),
  wymaganeOgraniczeniePct: z.number().nullable(),
  potrzebneObnizenieK: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DeepWinterBudgetToolOutputT = z.infer<typeof DeepWinterBudgetToolOutput>

export const deepWinterBudgetTool: AiToolDefinition<DeepWinterBudgetToolInputT, DeepWinterBudgetToolOutputT> = {
  name: "sprawdz_budzet_energii_zimowego_miesiaca",
  description:
    "Budżet energii jednego zimowego miesiąca sprawdzany w dniu d: ile zostało z planu (PV + agregat + magazyn), " +
    "tempo bieżące a dopuszczalne na pozostałe dni, prognoza na koniec miesiąca, dzień wyczerpania planu, " +
    "wymagane ograniczenie zużycia w % i o ile kelwinów obniżyć temperaturę w domu. Użyj, gdy user pyta, czy " +
    "starczy mu energii do końca miesiąca, czy zużywa za dużo jak na plan, ile musi oszczędzać albo o ile stopni " +
    "obniżyć ogrzewanie, żeby dociągnąć do końca zimowego miesiąca.",
  inputSchema: DeepWinterBudgetToolInput,
  outputSchema: DeepWinterBudgetToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/deep-winter-budget",
  handler: async (input) => {
    const wynik = calculateDeepWinterBudget({ ...input, cele: input.cele as never })
    const v = wynik.value
    return {
      status: wynik.status,
      planKwh: v.planKwh,
      budzetNarastajacyKwh: v.budzetNarastajacyKwh,
      odchyleniePct: v.odchyleniePct,
      zostaloKwh: v.zostaloKwh,
      tempoBiezaceKwhDzien: v.tempoBiezaceKwhDzien,
      tempoDopuszczalneKwhDzien: v.tempoDopuszczalneKwhDzien,
      prognozaKoniecMiesiacaKwh: v.prognozaKoniecMiesiacaKwh,
      dzienWyczerpaniaPlanu: v.dzienWyczerpaniaPlanu,
      wymaganeOgraniczeniePct: v.wymaganeOgraniczeniePct,
      potrzebneObnizenieK: v.potrzebneObnizenieK,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
