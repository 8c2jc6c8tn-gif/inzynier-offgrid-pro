/**
 * Narzędzie AI (9.3) dla Ekranu 9, Moduł 5 — "Projekt uziemienia". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateProjektUziemienia } from "@/lib/core/modules/okablowanie/projekt-uziemienia/calculator"
import type { AiToolDefinition } from "../types"

export const ProjektUziemieniaToolInput = z.object({
  rezystywnoscGruntuOmM: z.number().describe("Rezystywność gruntu w Ω·m (pomiar albo wartość orientacyjna dla typu gruntu)"),
  dlugoscPretaM: z.number().describe("Długość pojedynczego pręta uziomowego w metrach"),
  srednicaPretaMm: z.number().describe("Średnica pręta uziomowego w milimetrach"),
  celUziemienia: z
    .enum(["odgromowa", "przeciwporazeniowa", "czula-elektronika"])
    .describe(
      "Cel uziemienia — determinuje docelową rezystancję: odgromowa (<10Ω), przeciwporazeniowa (<30Ω), czula-elektronika (<5Ω)",
    ),
})

export type ProjektUziemieniaToolInputT = z.infer<typeof ProjektUziemieniaToolInput>

export const ProjektUziemieniaToolOutput = z.object({
  rezystancjaJednegoPretaOm: z.number(),
  liczbaPretowSzacowana: z.number(),
  docelowaRezystancjaOm: z.number(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type ProjektUziemieniaToolOutputT = z.infer<typeof ProjektUziemieniaToolOutput>

export const projektUziemieniaTool: AiToolDefinition<ProjektUziemieniaToolInputT, ProjektUziemieniaToolOutputT> = {
  name: "policz_projekt_uziemienia",
  description:
    "Liczy szacowaną liczbę prętów uziomowych (i rezystancję pojedynczego pręta wzorem Dwighta) " +
    "potrzebnych do osiągnięcia docelowej rezystancji uziemienia. Użyj, gdy user pyta o liczbę/rozstaw " +
    "prętów uziomu, rezystancję uziemienia, albo projekt instalacji odgromowej/przeciwporażeniowej. " +
    "Wynik to uproszczony szacunek (model równoległy 1/n bez korekty wzajemnego oddziaływania prętów) " +
    "— zawsze wspomnij, że po wykonaniu uziomu wymagany jest realny pomiar.",
  inputSchema: ProjektUziemieniaToolInput,
  outputSchema: ProjektUziemieniaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "okablowanie/projekt-uziemienia",
  handler: async (input) => {
    const wynik = calculateProjektUziemienia(input)
    return {
      rezystancjaJednegoPretaOm: wynik.value.rezystancjaJednegoPretaOm,
      liczbaPretowSzacowana: wynik.value.liczbaPretowSzacowana,
      docelowaRezystancjaOm: wynik.value.docelowaRezystancjaOm,
      status: wynik.status,
      zalozenia: wynik.assumptions.map((a) => (typeof a === "string" ? a : JSON.stringify(a))),
      ostrzezenia: wynik.warnings.map((w) => w.technicalMessage),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
