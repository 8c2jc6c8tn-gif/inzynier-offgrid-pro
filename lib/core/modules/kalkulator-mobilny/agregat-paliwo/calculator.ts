import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import {
  maOdpowiedzBezpieczenstwa,
  ocenBezpieczenstwoAgregatu,
} from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo"
import type { AgregatPaliwoInput } from "./input"
import { validateInput } from "./validation"
import { drogiePaliwo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "V = z_{l/h} \\times t_{h/d}, \\quad K = V \\times c_{zł/l}, \\quad E = P \\times obc \\times t_{h/d}, \\quad k = K / E"

export type AgregatPaliwoResult = {
  /** Paliwo na dobę [l]. */
  litrowNaDobe: number
  /** Koszt paliwa na dobę [zł]. */
  kosztNaDobeZl: number
  /** Energia oddana przez agregat na dobę [kWh]. */
  energiaNaDobeKwh: number
  /** Koszt 1 kWh z agregatu [zł/kWh]. */
  kosztKwhZl: number
  /** Ile razy drożej niż źródło porównawcze; 0 = bez porównania. */
  krotnoscPorownania: number
}

const PUSTY_WYNIK: AgregatPaliwoResult = {
  litrowNaDobe: 0,
  kosztNaDobeZl: 0,
  energiaNaDobeKwh: 0,
  kosztKwhZl: 0,
  krotnoscPorownania: 0,
}

/**
 * Ekran 35, Moduł 12 — "Agregat przenośny — ile paliwa na dobę" (dawne 8.62, Biblia §12.50).
 * Paliwo = zużycie [l/h] × godziny pracy na dobę; koszt = paliwo × cena; energia = moc × obciążenie ×
 * godziny; koszt kWh = koszt / energia. Przykład Biblii: 2 kW przy 50%, 0,5 l/h, 3 h/dobę → 1,5 l
 * (ok. 10 zł). Zużycie l/h zawsze z karty agregatu przy danym obciążeniu — nie ma w repo krzywej
 * zużycia w funkcji obciążenia (Dyrektywa #1). Blok bezpieczeństwa D48 wspólny z M2/E17 i M7/E8;
 * odpowiedzi bezpieczeństwa dają ostrzeżenia także przy niepełnych liczbach (stop nie chowa się za INCOMPLETE).
 */
export function calculateAgregatPaliwo(input: AgregatPaliwoInput): CalcResult<AgregatPaliwoResult> {
  const { errors } = validateInput(input)
  const inputs = {
    mocAgregatuKw: input.mocAgregatuKw,
    obciazeniePct: input.obciazeniePct,
    zuzycieLH: input.zuzycieLH,
    godzinNaDobe: input.godzinNaDobe,
    cenaZlL: input.cenaZlL,
    kosztPorownawczyZlKwh: input.kosztPorownawczyZlKwh,
  }
  const baza = { unit: "l", formula: FORMULA, formulaKey: "UI-FORMULA-KALKULATOR-MOBILNY-AGREGAT-PALIWO", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (
    input.mocAgregatuKw === 0 ||
    input.obciazeniePct === 0 ||
    input.zuzycieLH === 0 ||
    input.godzinNaDobe === 0 ||
    input.cenaZlL === 0
  ) {
    return {
      ...baza,
      value: PUSTY_WYNIK,
      status: "INCOMPLETE",
      assumptions: [],
      warnings: maOdpowiedzBezpieczenstwa(input) ? ocenBezpieczenstwoAgregatu(input) : [],
    }
  }

  const litrowNaDobe = input.zuzycieLH * input.godzinNaDobe
  const kosztNaDobeZl = litrowNaDobe * input.cenaZlL
  const energiaNaDobeKwh = input.mocAgregatuKw * (input.obciazeniePct / 100) * input.godzinNaDobe
  const kosztKwhZl = kosztNaDobeZl / energiaNaDobeKwh
  const krotnoscPorownania = input.kosztPorownawczyZlKwh > 0 ? kosztKwhZl / input.kosztPorownawczyZlKwh : 0

  const warnings = [drogiePaliwo(), ...ocenBezpieczenstwoAgregatu(input)]
  const assumptions: Assumption[] = [{ kod: "AP-ZALOZENIE-STALE-OBCIAZENIE" }]
  return {
    ...baza,
    value: { litrowNaDobe, kosztNaDobeZl, energiaNaDobeKwh, kosztKwhZl, krotnoscPorownania },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
