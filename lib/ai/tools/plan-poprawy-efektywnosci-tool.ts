/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2C — rekomendacje poprawy efektywności cieplnej posortowane po zwrocie
 * (dawne 5.68, Wzorzec G). `operationType: 'read'`. Oszczędności działań — z ekranu „Wpływ czynnika”; koszty — oferty.
 */
import { z } from "zod"
import { calculatePlanPoprawy } from "@/lib/core/modules/ogrzewanie/plan-poprawy-efektywnosci/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PlanPoprawyToolInput = z.object({
  dzialania: z
    .array(
      z.object({
        nazwa: z.string().describe("Nazwa działania, np. „Izolacja dachu”"),
        oszczednoscCieplaKwh: z.number().describe("Oszczędność ciepła w roku [kWh]"),
        kosztZl: z.number().describe("Koszt działania [zł]; 0 = nie podano"),
      }),
    )
    .describe("Lista działań poprawy (izolacja, okna, wentylacja, pompa…)"),
  cop: z.number().describe("COP źródła ciepła (grzałka = 1)"),
  cenaZlKwh: z.number().describe("Cena prądu [zł/kWh]; 0 = bez złotówek i zwrotu"),
})
export type PlanPoprawyToolInputT = z.infer<typeof PlanPoprawyToolInput>

export const PlanPoprawyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  plan: z.array(
    z.object({
      indeks: z.number(),
      nazwa: z.string(),
      oszczednoscCieplaKwh: z.number(),
      oszczednoscPraduKwh: z.number(),
      oszczednoscZlRok: z.number().nullable(),
      zwrotLat: z.number().nullable(),
    }),
  ),
  sumaPraduKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PlanPoprawyToolOutputT = z.infer<typeof PlanPoprawyToolOutput>

export const planPoprawyTool: AiToolDefinition<PlanPoprawyToolInputT, PlanPoprawyToolOutputT> = {
  name: "uloz_plan_poprawy_efektywnosci_budynku",
  description:
    "Układa działania poprawy efektywności cieplnej (izolacja, okna, wentylacja, pompa) od najszybszego zwrotu: prąd " +
    "Q/COP, zł/rok i prosty okres zwrotu koszt/oszczędność. Użyj, gdy user pyta, od czego zacząć modernizację domu, " +
    "co się szybciej zwróci albo jak uszeregować kilka pomysłów na oszczędzanie ciepła.",
  inputSchema: PlanPoprawyToolInput,
  outputSchema: PlanPoprawyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/plan-poprawy-efektywnosci",
  handler: async (input) => {
    const wynik = calculatePlanPoprawy(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
