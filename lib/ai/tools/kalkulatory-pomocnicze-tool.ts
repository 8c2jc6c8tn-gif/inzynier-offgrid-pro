/**
 * Jedyne dziś zarejestrowane narzędzie AI (9.3) — wywołuje istniejący kalkulator
 * `lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze` (moduł pilotażowy i18n, ten sam
 * moduł co `docs/standards/17-i18n.md`). `operationType: 'read'` — nic nie zapisuje, tylko liczy
 * i zwraca wynik. Pierwszy krok rozdziału 9 (docs/memory.md) — kolejne narzędzia/moduły dochodzą
 * moduł po module, tym samym rytmem co rollout i18n (17.9), nie naraz.
 *
 * Kształt wejścia spłaszczony (nie `z.discriminatedUnion`) celowo — jedna prosta struktura z
 * polami opcjonalnymi jest prostsza do wygenerowania przez model niż zagnieżdżona unia, a
 * walidacja kompletności per tryb i tak dzieje się w handlerze (4.5 — walidacja wielowarstwowa).
 */
import { z } from "zod"
import {
  calculateKalkulatoryPomocnicze,
  CALCULATOR_VERSION,
} from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/calculator"
import type { KalkulatoryPomocniczeInput } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/input"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const KalkulatoryPomocniczeToolInput = z.object({
  tryb: z
    .enum(["watt-to-amp", "ah-to-wh", "wh-to-ah", "runtime"])
    .describe(
      "Tryb obliczeń: watt-to-amp (moc→prąd), ah-to-wh (Ah→Wh), wh-to-ah (Wh→Ah), runtime (szacowany czas pracy z baterii)",
    ),
  mocW: z.number().optional().describe("Moc urządzenia w watach — wymagana dla watt-to-amp i runtime"),
  napiecieV: z.number().describe("Napięcie systemu w woltach (np. 12, 24, 48) — wymagane we wszystkich trybach"),
  pojemnoscAh: z.number().optional().describe("Pojemność akumulatora w amperogodzinach — wymagana dla ah-to-wh i runtime"),
  energiaWh: z.number().optional().describe("Energia w watogodzinach — wymagana dla wh-to-ah"),
  sprawnosc: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("Sprawność układu w przedziale (0,1] — opcjonalna, domyślnie 0,92, jeśli pominięta"),
})

export type KalkulatoryPomocniczeToolInputT = z.infer<typeof KalkulatoryPomocniczeToolInput>

export const KalkulatoryPomocniczeToolOutput = z.object({
  wartosc: z.number(),
  jednostka: z.string(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wzor: z.string(),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  /** 3.6 — audit trail, do pokazania jako źródło (9.9: "każda sugestia AI pokazuje źródło"). */
  wersjaKalkulatora: z.string(),
})

export type KalkulatoryPomocniczeToolOutputT = z.infer<typeof KalkulatoryPomocniczeToolOutput>

function mapujDoWejsciaKalkulatora(input: KalkulatoryPomocniczeToolInputT): KalkulatoryPomocniczeInput | { blad: string } {
  switch (input.tryb) {
    case "watt-to-amp":
      if (input.mocW === undefined) return { blad: "Brakuje mocy urządzenia (mocW) dla trybu watt-to-amp." }
      return { mode: "watt-to-amp", powerW: input.mocW, voltageV: input.napiecieV, efficiency: input.sprawnosc }
    case "ah-to-wh":
      if (input.pojemnoscAh === undefined) return { blad: "Brakuje pojemności (pojemnoscAh) dla trybu ah-to-wh." }
      return { mode: "ah-to-wh", capacityAh: input.pojemnoscAh, voltageV: input.napiecieV }
    case "wh-to-ah":
      if (input.energiaWh === undefined) return { blad: "Brakuje energii (energiaWh) dla trybu wh-to-ah." }
      return { mode: "wh-to-ah", energyWh: input.energiaWh, voltageV: input.napiecieV }
    case "runtime":
      if (input.pojemnoscAh === undefined || input.mocW === undefined) {
        return { blad: "Tryb runtime wymaga zarówno pojemnoscAh, jak i mocW." }
      }
      return {
        mode: "runtime",
        capacityAh: input.pojemnoscAh,
        voltageV: input.napiecieV,
        powerW: input.mocW,
        efficiency: input.sprawnosc,
      }
  }
}

export const kalkulatoryPomocniczeTool: AiToolDefinition<
  KalkulatoryPomocniczeToolInputT,
  KalkulatoryPomocniczeToolOutputT
> = {
  name: "policz_kalkulatory_pomocnicze",
  description:
    "Liczy przelicznik mocy/prądu/napięcia/pojemności baterii (moduł 'Kalkulatory pomocnicze'). " +
    "Zawsze używaj tego narzędzia do policzenia wartości — nigdy nie licz samodzielnie w odpowiedzi.",
  inputSchema: KalkulatoryPomocniczeToolInput,
  outputSchema: KalkulatoryPomocniczeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/kalkulatory-pomocnicze",
  handler: async (input) => {
    const zmapowane = mapujDoWejsciaKalkulatora(input)
    if ("blad" in zmapowane) {
      return {
        wartosc: 0,
        jednostka: "",
        status: "INVALID_INPUT",
        wzor: "",
        zalozenia: [],
        ostrzezenia: [zmapowane.blad],
        wersjaKalkulatora: CALCULATOR_VERSION,
      }
    }

    const wynik = calculateKalkulatoryPomocnicze(zmapowane)
    return {
      wartosc: wynik.value,
      jednostka: wynik.unit,
      status: wynik.status,
      wzor: wynik.formula,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
