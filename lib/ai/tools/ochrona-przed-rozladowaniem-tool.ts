/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 9 "Ochrona przed
 * rozładowaniem akumulatora" (dozownik napięcia, LVD). `operationType: 'read'`. Chemia, napięcie i
 * informacja o istniejącej ochronie MUSZĄ pochodzić od usera — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculateOchronaPrzedRozladowaniem } from "@/lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OchronaPrzedRozladowaniemToolInput = z.object({
  chemia: z.enum(["AGM", "kwasowy", "LiFePO4"]).describe("Chemia akumulatora — od usera"),
  napiecieZnamionoweV: z.union([z.literal(12), z.literal(24), z.literal(48)]).describe("Napięcie znamionowe [V] — od usera"),
  maDozownik: z.boolean().describe("Czy w instalacji jest dozownik napięcia (LVD) — od usera"),
  odbiornikMaWlasneZabezpieczenie: z
    .boolean()
    .describe("Czy odbiornik sam odcina się przy niskim napięciu (np. lodówka z ochroną akumulatora) — od usera"),
})
export type OchronaPrzedRozladowaniemToolInputT = z.infer<typeof OchronaPrzedRozladowaniemToolInput>

export const OchronaPrzedRozladowaniemToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  progOdcieciaV: z.number().nullable().describe("Próg odcięcia dozownika [V]; null = źródło nie podaje dla tej chemii"),
  progNaOgniwoV: z.number().nullable().describe("Ten sam próg na ogniwo [V]"),
  liczbaOgniw: z.number().describe("Liczba ogniw w szeregu"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OchronaPrzedRozladowaniemToolOutputT = z.infer<typeof OchronaPrzedRozladowaniemToolOutput>

export const ochronaPrzedRozladowaniemTool: AiToolDefinition<
  OchronaPrzedRozladowaniemToolInputT,
  OchronaPrzedRozladowaniemToolOutputT
> = {
  name: "dobierz_prog_dozownika_lvd",
  description:
    "Podaje próg odcięcia dozownika napięcia (LVD) dla małego akumulatora (Moduł 12): AGM 12 V → 11,5 V, " +
    "LiFePO4 12 V → 11,0 V (ze źródła), 24/48 V przeliczone szeregowo. Dla kwasowego zalewowego progu nie podaje " +
    "(odsyła do karty producenta). Twardy stop: akumulator kwasowy/AGM bez dozownika, gdy odbiornik nie ma własnego " +
    "zabezpieczenia. Użyj, gdy user pyta, jak chronić akumulator przed głębokim rozładowaniem.",
  inputSchema: OchronaPrzedRozladowaniemToolInput,
  outputSchema: OchronaPrzedRozladowaniemToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/ochrona-przed-rozladowaniem",
  handler: async (input) => {
    const wynik = calculateOchronaPrzedRozladowaniem(input)
    return {
      status: wynik.status,
      progOdcieciaV: wynik.value.progOdcieciaV,
      progNaOgniwoV: wynik.value.progNaOgniwoV,
      liczbaOgniw: wynik.value.liczbaOgniw,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
