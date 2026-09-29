/**
 * Narzędzie AI (9.3) — Wampiry energetyczne, podzakładka Symulacje i raporty (dawne 1.28 + 1.31 +
 * 1.42 + 1.43 + 1.45). `operationType: 'read'`. Echo trzech funkcji silnika
 * `zapotrzebowanie/wampiry-energetyczne/symulacje-i-raporty`, wybieranych polem `tryb`.
 *
 * Wejście spłaszczone (jak `kalkulatory-pomocnicze-tool.ts`): pola opcjonalne, kompletność per tryb
 * sprawdza handler. Cenę energii podaje user — źródło nie daje wartości domyślnej.
 */
import { z } from "zod"
import {
  CALCULATOR_VERSION,
  calculateAutonomiaStandby,
  calculateKosztRocznyStandby,
  calculateWplywNaDobor,
} from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/symulacje-i-raporty/calculator"
import type { CalcResult } from "@/lib/core/calc-result"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const WampirySymulacjeToolInput = z.object({
  tryb: z
    .enum(["autonomia", "koszt-roczny", "wplyw-na-dobor"])
    .describe(
      "autonomia — ile godzin bateria wytrzyma samo standby; koszt-roczny — kWh i zł rocznie za standby; " +
        "wplyw-na-dobor — o ile mniejsza może być bateria po eliminacji części standby",
    ),
  standbyW: z.number().optional().describe("Sumaryczny pobór standby [W] — wymagany dla autonomia i koszt-roczny"),
  standbyZredukowanyW: z
    .number()
    .optional()
    .describe("autonomia: pobór po wyłączeniu zbędnych urządzeń [W], do porównania; pominięte = bez porównania"),
  pojemnoscUzytecznaKwh: z.number().optional().describe("autonomia: pojemność baterii [kWh]"),
  dodPct: z.number().optional().describe("autonomia i wplyw-na-dobor: dopuszczalna głębokość rozładowania DoD [%]"),
  cenaEnergiiZlZaKwh: z.number().optional().describe("koszt-roczny: cena energii [zł/kWh] — od usera, nie zgaduj"),
  zapotrzebowanieCalkowiteRocznaKwh: z
    .number()
    .optional()
    .describe("koszt-roczny: całkowite roczne zużycie domu [kWh] do wyliczenia udziału standby; pominięte = bez udziału"),
  standbyDobowaKwh: z.number().optional().describe("wplyw-na-dobor: dobowa energia standby [kWh/dobę]"),
  eliminacjaPct: z.number().optional().describe("wplyw-na-dobor: ile % standby user planuje wyeliminować"),
  dniAutonomii: z.number().optional().describe("wplyw-na-dobor: dni autonomii projektu"),
  sprawnoscFalownikaPct: z.number().optional().describe("wplyw-na-dobor: sprawność falownika [%]"),
})
export type WampirySymulacjeToolInputT = z.infer<typeof WampirySymulacjeToolInput>

export const WampirySymulacjeToolOutput = z.object({
  tryb: z.string(),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  godzinyDoWyczerpania: z.number().nullable(),
  godzinyDoWyczerpaniaZredukowany: z.number().nullable(),
  energiaRocznaKwh: z.number().nullable(),
  kosztRocznyZl: z.number().nullable(),
  udzialProcentowy: z.number().nullable(),
  redukcjaDobowaKwh: z.number().nullable(),
  redukcjaPojemnosciKwh: z.number().nullable(),
  wzor: z.string(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type WampirySymulacjeToolOutputT = z.infer<typeof WampirySymulacjeToolOutput>

const PUSTE = {
  godzinyDoWyczerpania: null,
  godzinyDoWyczerpaniaZredukowany: null,
  energiaRocznaKwh: null,
  kosztRocznyZl: null,
  udzialProcentowy: null,
  redukcjaDobowaKwh: null,
  redukcjaPojemnosciKwh: null,
}

function brakPol(input: WampirySymulacjeToolInputT, pola: (keyof WampirySymulacjeToolInputT)[]): string[] {
  return pola.filter((p) => input[p] === undefined)
}

function wymagane(tryb: WampirySymulacjeToolInputT["tryb"]): (keyof WampirySymulacjeToolInputT)[] {
  if (tryb === "autonomia") return ["standbyW", "pojemnoscUzytecznaKwh", "dodPct"]
  if (tryb === "koszt-roczny") return ["standbyW", "cenaEnergiiZlZaKwh"]
  return ["standbyDobowaKwh", "eliminacjaPct", "dniAutonomii", "sprawnoscFalownikaPct", "dodPct"]
}

function wynikNarzedzia(
  tryb: string,
  wynik: CalcResult<object>,
): WampirySymulacjeToolOutputT {
  return {
    tryb,
    status: wynik.status,
    ...PUSTE,
    ...wynik.value,
    wzor: wynik.formula,
    ostrzezenia: tekstyOstrzezen(wynik.warnings),
    zalozenia: tekstyZalozen(wynik.assumptions),
    wersjaKalkulatora: wynik.calculatorVersion,
  }
}

export const wampirySymulacjeTool: AiToolDefinition<WampirySymulacjeToolInputT, WampirySymulacjeToolOutputT> = {
  name: "symuluj_standby_bateria_koszt",
  description:
    "Trzy obliczenia wpływu standby (moduł Wampiry energetyczne, Symulacje i raporty): autonomia — ile godzin " +
    "bateria wytrzyma samo czuwanie (t = C·1000·DoD / P, np. 45 W → 26 h, 15 W → 78 h przy 1,17 kWh); koszt-roczny — " +
    "kWh i zł na rok za standby oraz jego udział w zużyciu domu; wplyw-na-dobor — o ile kWh mniejsza może być " +
    "bateria po eliminacji części standby. Cenę energii podaje user. Użyj, gdy user pyta, jak długo bateria " +
    "wytrzyma same urządzenia w czuwaniu, ile rocznie kosztują wampiry energetyczne albo czy ich wyłączenie " +
    "pozwoli kupić mniejszy magazyn.",
  inputSchema: WampirySymulacjeToolInput,
  outputSchema: WampirySymulacjeToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/wampiry-energetyczne/symulacje-i-raporty",
  handler: async (input) => {
    const braki = brakPol(input, wymagane(input.tryb))
    if (braki.length > 0) {
      return {
        tryb: input.tryb,
        status: "INCOMPLETE",
        ...PUSTE,
        wzor: "",
        ostrzezenia: [`Tryb ${input.tryb} wymaga pól: ${braki.join(", ")}.`],
        zalozenia: [],
        wersjaKalkulatora: CALCULATOR_VERSION,
      }
    }
    // Required fields checked above — the `!` below cannot be undefined.
    if (input.tryb === "autonomia") {
      return wynikNarzedzia(
        input.tryb,
        calculateAutonomiaStandby({
          standbyW: input.standbyW!,
          standbyZredukowanyW: input.standbyZredukowanyW ?? 0,
          pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh!,
          dodPct: input.dodPct!,
        }),
      )
    }
    if (input.tryb === "koszt-roczny") {
      return wynikNarzedzia(
        input.tryb,
        calculateKosztRocznyStandby({
          standbyW: input.standbyW!,
          cenaEnergiiZlZaKwh: input.cenaEnergiiZlZaKwh!,
          zapotrzebowanieCalkowiteRocznaKwh: input.zapotrzebowanieCalkowiteRocznaKwh ?? 0,
        }),
      )
    }
    return wynikNarzedzia(
      input.tryb,
      calculateWplywNaDobor({
        standbyDobowaKwh: input.standbyDobowaKwh!,
        eliminacjaPct: input.eliminacjaPct!,
        dniAutonomii: input.dniAutonomii!,
        sprawnoscFalownikaPct: input.sprawnoscFalownikaPct!,
        dodPct: input.dodPct!,
      }),
    )
  },
}
