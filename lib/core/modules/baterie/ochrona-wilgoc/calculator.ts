import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { OchronaWilgocInput } from "./input"
import { validateInput } from "./validation"
import { bezpiecznyMargines, ipPonizejWymaganego, ryzykoKondensacji } from "./warnings"
import { MAGNUS_A, MAGNUS_B, MIN_IP_KOD_WILGOTNE } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type OchronaWilgocResult = {
  punktRosyC: number
  temperaturaObudowyC: number
  ryzykoKondensacji: boolean
  ipWystarczajace: boolean
}

const FORMULA = "T_d = \\frac{b \\cdot \\alpha}{a - \\alpha}, \\ \\alpha = \\frac{aT}{b+T} + \\ln(RH/100)"

/**
 * Dew point [°C] from air temperature and relative humidity — Magnus-Tetens (MAGNUS_A, MAGNUS_B). Shared with the M6
 * summer cooling screen (floor cooling below the dew point condenses).
 */
export function obliczPunktRosyC(temperaturaC: number, wilgotnoscPct: number): number {
  const alpha = (MAGNUS_A * temperaturaC) / (MAGNUS_B + temperaturaC) + Math.log(wilgotnoscPct / 100)
  return (MAGNUS_B * alpha) / (MAGNUS_A - alpha)
}

/**
 * Ekran 10, Moduł 4 "Magazyn energii / baterie" — "Ochrona przed wilgocią i kondensacją"
 * (dawne 3.11, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Punkt rosy liczony
 * standardowym wzorem Magnusa-Tetensa (a,b — patrz constants.ts), porównanie z temperaturą
 * obudowy 1:1 z logiki źródła, twardy stop IP<55 w środowisku wilgotnym 1:1 ze źródła.
 *
 * Uwaga o przykładzie źródła (Sekcja C): "-5°C/85% → punkt rosy -7°C, obudowa -6°C → kondensuje".
 * Wzór Magnusa daje punkt rosy -7,12°C (zgodne z zaokrągleniem źródła), ALE poprawna fizycznie
 * kondensacja wymaga temperatury powierzchni <= punktu rosy — obudowa -6°C jest CIEPLEJSZA niż
 * -7,12°C, więc wg poprawnej fizyki NIE powinna kondensować. To rozbieżność we własnym przykładzie
 * źródła (prawdopodobny błąd redakcyjny), nie w tej implementacji — silnik liczy poprawną
 * zależność fizyczną (ryzyko gdy T_obudowy <= T_rosy), przykładu źródła świadomie NIE odtworzono
 * dosłownie w teście, żeby nie utrwalać błędnej logiki.
 */
export function calculateOchronaWilgoc(input: OchronaWilgocInput): CalcResult<OchronaWilgocResult> {
  const { errors } = validateInput(input)
  const pustyWynik: OchronaWilgocResult = {
    punktRosyC: 0,
    temperaturaObudowyC: 0,
    ryzykoKondensacji: false,
    ipWystarczajace: false,
  }
  const inputs = {
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC ?? 0,
    wilgotnoscPct: input.wilgotnoscPct,
    temperaturaObudowyC: input.temperaturaObudowyC ?? 0,
    ipKod: input.ipKod,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (
    input.temperaturaOtoczeniaC === null ||
    input.wilgotnoscPct === 0 ||
    input.temperaturaObudowyC === null ||
    input.ipKod === 0
  ) {
    return {
      value: pustyWynik,
      unit: "°C",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const temperaturaOtoczeniaC = input.temperaturaOtoczeniaC
  const temperaturaObudowyC = input.temperaturaObudowyC
  const punktRosyC = obliczPunktRosyC(temperaturaOtoczeniaC, input.wilgotnoscPct)

  const kondensacja = temperaturaObudowyC <= punktRosyC
  const ipWystarczajace = !input.srodowiskoWilgotne || input.ipKod >= MIN_IP_KOD_WILGOTNE

  const warnings: Warning[] = [
    kondensacja ? ryzykoKondensacji(temperaturaObudowyC, punktRosyC) : bezpiecznyMargines(temperaturaObudowyC, punktRosyC),
  ]
  if (!ipWystarczajace) warnings.push(ipPonizejWymaganego(input.ipKod))

  const hasCritical = warnings.some((w) => w.level === "critical")

  return {
    value: { punktRosyC, temperaturaObudowyC, ryzykoKondensacji: kondensacja, ipWystarczajace },
    unit: "°C",
    status: hasCritical || kondensacja ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "PUNKT-ROSY-WZOR-MAGNUSA" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
