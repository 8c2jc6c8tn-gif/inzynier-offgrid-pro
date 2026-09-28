/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 27 "Czy mogę podłączyć
 * urządzenie 12V bezpośrednio?". `operationType: 'read'`. Napięcie i tolerancja urządzenia MUSZĄ
 * pochodzić od usera (instrukcja/tabliczka) — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculateUrzadzenie12vBezposrednio } from "@/lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const Urzadzenie12vBezposrednioToolInput = z.object({
  napiecieSystemuV: z.union([z.literal(12), z.literal(24)]).describe("Napięcie znamionowe akumulatora/instalacji [V] — od usera"),
  napiecieUrzadzeniaV: z.number().describe("Napięcie znamionowe urządzenia [V] — od usera"),
  tolerancjaPct: z.number().describe("Tolerancja napięcia urządzenia [±%] z instrukcji — od usera, nie zgaduj"),
  maksNapiecieLadowaniaV: z
    .number()
    .describe(
      "Maks. napięcie ładowania całej instalacji [V] z ustawień regulatora/ładowarki (absorpcja, przy ołowiowym także " +
        "wyrównywanie) — od usera, nie zgaduj. Dla 12 V źródła podają 14,5–14,6 V; dla 24 V wartość całej instalacji.",
    ),
  przezStabilizator: z.boolean().describe("true = urządzenie zasilane przez stabilizator/przetwornicę DC-DC"),
})
export type Urzadzenie12vBezposrednioToolInputT = z.infer<typeof Urzadzenie12vBezposrednioToolInput>

export const Urzadzenie12vBezposrednioToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  urzadzenieMinV: z.number(),
  urzadzenieMaxV: z.number(),
  akuMinV: z.number().describe("Najniższe realne napięcie akumulatora [V]"),
  akuMaxV: z.number().describe("Najwyższe realne napięcie akumulatora (ładowanie) [V]"),
  zakresPokryty: z.boolean().describe("true = cały zakres akumulatora mieści się w zakresie urządzenia"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type Urzadzenie12vBezposrednioToolOutputT = z.infer<typeof Urzadzenie12vBezposrednioToolOutput>

export const urzadzenie12vBezposrednioTool: AiToolDefinition<
  Urzadzenie12vBezposrednioToolInputT,
  Urzadzenie12vBezposrednioToolOutputT
> = {
  name: "sprawdz_urzadzenie_12v_bezposrednio",
  description:
    "Sprawdza, czy urządzenie 12/24 V można zasilić wprost z akumulatora (Moduł 12). Realne napięcie akumulatora " +
    "to od 11 V na każde 12 V do maks. napięcia ładowania z regulatora usera, nie stałe 12 V. Twardy stop, gdy górna " +
    "granica tolerancji urządzenia jest niższa niż napięcie przy ładowaniu (np. 12,0 V ±5% → max 12,6 V). Użyj, gdy user pyta, czy może podłączyć urządzenie " +
    "bezpośrednio do akumulatora bez stabilizatora.",
  inputSchema: Urzadzenie12vBezposrednioToolInput,
  outputSchema: Urzadzenie12vBezposrednioToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/urzadzenie-12v-bezposrednio",
  handler: async (input) => {
    const wynik = calculateUrzadzenie12vBezposrednio(input)
    return {
      ...wynik.value,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
