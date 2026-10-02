import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { energiaDefrostuNaGodzineKwh } from "../cykle-odszraniania/calculator"
import { defrostDluzszyNizOdstep } from "../cykle-odszraniania/warnings"
import { godzinyPozaDoba, ujemneWartosci } from "../wspolne/walidacja"
import type { DefrostSezonInput, ScenariuszDefrostu } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_{doba,i} = P_{def} \\dfrac{t_{def,i}}{T_i} h_i, \\quad E_{sezon} = \\sum_i E_{doba,i}\\, d_i, \\quad udział = \\dfrac{E_{sezon}}{E_{pompy}}"

export type WynikScenariusza = {
  /** Udział czasu defrostu [%] = t_def / T. */
  udzialCzasuPct: number
  /** Liczba defrostów na dobę w tej pogodzie. */
  defrostowDoba: number
  /** Energia defrostu na dobę [kWh/doba]. */
  energiaDobaKwh: number
  /** Energia defrostu w sezonie w tej pogodzie [kWh]. */
  energiaSezonKwh: number
}

export type DefrostSezonResult = {
  /** Wynik każdego scenariusza (null = scenariusz pusty), w kolejności wejścia. */
  scenariusze: (WynikScenariusza | null)[]
  /** Energia defrostu w całym sezonie [kWh]. */
  sumaKwh: number
  /** Udział defrostu w zużyciu pompy [%]; null = zużycie nie wpisane. */
  udzialPct: number | null
}

const PUSTY: DefrostSezonResult = { scenariusze: [], sumaKwh: 0, udzialPct: null }

const r1 = (x: number) => Math.round(x * 10) / 10
const pusty = (s: ScenariuszDefrostu) => s.odstepMin === 0 && s.czasDefrostuMin === 0 && s.godzinyDobaH === 0 && s.dni === 0
const pelny = (s: ScenariuszDefrostu) => s.odstepMin > 0 && s.czasDefrostuMin > 0 && s.godzinyDobaH > 0 && s.dni > 0

function walidacja(input: DefrostSezonInput): Warning[] {
  const errors = ujemneWartosci({ mocDefrostuKw: input.mocDefrostuKw, zuzyciePompySezonKwh: input.zuzyciePompySezonKwh })
  input.scenariusze.forEach((s, i) => {
    errors.push(
      ...ujemneWartosci({
        [`scenariusze[${i}].odstepMin`]: s.odstepMin,
        [`scenariusze[${i}].czasDefrostuMin`]: s.czasDefrostuMin,
        [`scenariusze[${i}].dni`]: s.dni,
      }),
      ...godzinyPozaDoba(`scenariusze[${i}].godzinyDobaH`, s.godzinyDobaH),
    )
    if (s.odstepMin > 0 && s.czasDefrostuMin >= s.odstepMin) errors.push(defrostDluzszyNizOdstep(s.czasDefrostuMin, s.odstepMin))
  })
  return errors
}

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 6: defrost w sezonie w kilku scenariuszach pogody (dawne 5.56). Źródło:
 * „przy lekkim mrozie i dużej wilgotności defrost jest częstszy”, „oblicza zużycie energii na defrost w różnych
 * scenariuszach” — bez modelu pogoda → częstość, więc cykl każdego scenariusza (odstęp, czas) wpisuje user, a
 * ekran liczy koszt tym samym wzorem co Ekran 6 (`energiaDefrostuNaGodzineKwh`, defrost doliczany ponad normalne
 * grzanie) i sumuje po dniach. Planowanie przerw pod komfort (źródło) nie jest liczone — brak modelu.
 *
 * Przykład źródła (Dyrektywa #5): „przy mgle i –2 °C co 35 min na 4 min, 0,3 kWh/dobę” — 4/35 = 11,4% czasu;
 * 0,3 kWh/dobę przez całą dobę oznaczałoby moc defrostu 0,11 kW (nierealnie mało dla pompy), a przy 2 kW — ok.
 * 1,3 h mgły na dobę. Źródło nie podaje mocy ani godzin, więc przykład nie jest odtwarzalny wprost (test pokazuje
 * spójny zestaw). „Złe ustawienia mogą pochłonąć 10% energii pompy” — liczba przykładowa, bez progu: ℹ️ z udziałem.
 */
export function calculateDefrostSezon(input: DefrostSezonInput): CalcResult<DefrostSezonResult> {
  const errors = walidacja(input)
  const inputs = { mocDefrostuKw: input.mocDefrostuKw, zuzyciePompySezonKwh: input.zuzyciePompySezonKwh, scenariusze: input.scenariusze.length }
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const wypelnione = input.scenariusze.filter((s) => !pusty(s))
  if (input.mocDefrostuKw === 0 || wypelnione.length === 0 || !wypelnione.every(pelny)) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const scenariusze = input.scenariusze.map((s): WynikScenariusza | null => {
    if (pusty(s)) return null
    const energiaDobaKwh = energiaDefrostuNaGodzineKwh(input.mocDefrostuKw, s.czasDefrostuMin, s.odstepMin) * s.godzinyDobaH
    return {
      udzialCzasuPct: (s.czasDefrostuMin / s.odstepMin) * 100,
      defrostowDoba: (s.godzinyDobaH * 60) / s.odstepMin,
      energiaDobaKwh,
      energiaSezonKwh: energiaDobaKwh * s.dni,
    }
  })
  const sumaKwh = scenariusze.reduce((suma, s) => suma + (s?.energiaSezonKwh ?? 0), 0)
  const udzialPct = input.zuzyciePompySezonKwh > 0 ? (sumaKwh / input.zuzyciePompySezonKwh) * 100 : null
  const warnings: Warning[] =
    udzialPct === null
      ? []
      : [
          {
            code: "DSZ-UDZIAL-USTAWIENIA",
            level: "info",
            i18nKey: "DSZ-UDZIAL-USTAWIENIA",
            params: { pct: r1(udzialPct) },
            technicalMessage: `udzialPct = ${udzialPct}`,
            field: "zuzyciePompySezonKwh",
          },
        ]
  const assumptions: Assumption[] = [{ kod: "CYK-ZALOZENIE-DOLICZONY" }, { kod: "DSZ-ZAL-BEZ-HARMONOGRAMU" }]
  return { ...baza, value: { scenariusze, sumaKwh, udzialPct }, status: "VALID", assumptions, warnings }
}
