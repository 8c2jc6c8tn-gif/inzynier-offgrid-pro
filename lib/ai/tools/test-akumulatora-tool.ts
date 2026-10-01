/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 33 "Test: czy mój akumulator jest jeszcze dobry?" (dawne 8.60,
 * Biblia §12.48). `operationType: 'read'`. Pomiary i rezystancja z karty MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateTestAkumulatora } from "@/lib/core/modules/kalkulator-mobilny/test-akumulatora/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TestAkumulatoraToolInput = z.object({
  chemia: z.enum(["olow", "lifepo4"]).describe("olow = AGM / kwasowy / żelowy"),
  napiecieZnamionoweV: z.number().describe("Napięcie znamionowe akumulatora [V]"),
  napiecieSpoczynkoweV: z.number().describe("Napięcie spoczynkowe zmierzone po spoczynku [V]"),
  mocObciazeniaW: z.number().describe("Moc znanego obciążenia testowego [W]; 0 = bez testu obciążeniowego"),
  napiecieObciazenieV: z.number().describe("Napięcie na zaciskach pod tym obciążeniem [V]; 0 = bez testu"),
  rezystancjaKartaMOhm: z.number().describe("Rezystancja wewnętrzna z karty katalogowej [mΩ]; 0 = nie podano"),
})
export type TestAkumulatoraToolInputT = z.infer<typeof TestAkumulatoraToolInput>

export const TestAkumulatoraToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  stan: z.enum(["dobry", "do-wymiany", "uszkodzony", "niejasny"]),
  pradA: z.number(),
  spadekV: z.number(),
  rezystancjaMOhm: z.number().describe("Zmierzona rezystancja wewnętrzna z kablami i zaciskami [mΩ]"),
  wzrostPct: z.number().nullable().describe("Wzrost rezystancji względem karty [%]; null = brak odniesienia"),
  progWyrzuceniaV: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TestAkumulatoraToolOutputT = z.infer<typeof TestAkumulatoraToolOutput>

export const testAkumulatoraTool: AiToolDefinition<TestAkumulatoraToolInputT, TestAkumulatoraToolOutputT> = {
  name: "sprawdz_czy_akumulator_jest_dobry",
  description:
    "Prosty test stanu akumulatora małej instalacji: napięcie spoczynkowe i opcjonalny test znanym obciążeniem " +
    "→ rezystancja wewnętrzna porównana z kartą katalogową; ocena dobry / do wymiany / uszkodzony / niejasny. " +
    "Użyj, gdy user pyta, czy jego akumulator (AGM, kwasowy, LiFePO4) jeszcze się nadaje albo czy go wymienić, " +
    "i ma miernik oraz wynik pomiaru napięcia.",
  inputSchema: TestAkumulatoraToolInput,
  outputSchema: TestAkumulatoraToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/test-akumulatora",
  handler: async (input) => {
    const wynik = calculateTestAkumulatora(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
