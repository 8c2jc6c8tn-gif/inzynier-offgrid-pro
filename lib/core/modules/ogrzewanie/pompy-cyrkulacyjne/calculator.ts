import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { PompyCyrkulacyjneInput } from "./input"
import { validateInput } from "./validation"
import { oszczednoscInfo, nowaPompaNieOszczedza } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

export type PompyCyrkulacyjneResult = {
  energiaObecnaKwh: number
  energiaNowaKwh: number
  oszczednoscKwh: number
  oszczednoscPct: number
  /** Sezon (dokładka 2B, dawne 5.72): energia obecnej pompy [kWh/sezon]; null = brak dni sezonu. */
  energiaSezonObecnaKwh: number | null
  /** Energia nowej pompy [kWh/sezon]; null = brak dni sezonu. */
  energiaSezonNowaKwh: number | null
  /** Oszczędność w sezonie [kWh]; null = brak dni sezonu. */
  oszczednoscSezonKwh: number | null
  /** Oszczędność w sezonie [zł]; null = brak dni albo ceny. */
  oszczednoscSezonZl: number | null
}

const FORMULA =
  "E = \\frac{P \\times h}{1000} \\;\\; ; \\;\\; oszczędność = E_{obecna} - E_{nowa} \\;\\; ; \\;\\; E_{sezon} = E \\times d"

/**
 * Ekran 15, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Pompy cyrkulacyjne — dobór"
 * (dawne 5.15, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Sekcja B). Energia = moc × czas
 * (definicja jednostki, nie wymyślony współczynnik). Godziny pracy dobowo to pole ręcznego
 * wpisu (D16) — źródło opisuje profil "ciągły/sterowany" bez wzoru przeliczającego "sterowany"
 * na konkretną liczbę godzin.
 *
 * Przykład źródła (pompa 45W, praca 24/7 → 1,08 kWh/dobę; pompa elektroniczna 8W → 0,19 kWh/dobę)
 * odtworzony DOKŁADNIE przy godzinyPracyDobowoH=24, zweryfikowany niezależnie w Pythonie.
 *
 * 1.1.0 — dokładka 2B (dawne 5.72, Biblia §6.27.46): energia w sezonie = energia dobowa × dni sezonu, kwota = kWh × cena
 * (opcjonalne pola; wyniki dobowe bez zmian). Przykład źródła „stara 75 W → 180 kWh w sezonie, nowa 15 W → 36 kWh,
 * oszczędzasz 144 kWh” jest spójny: obie liczby dają 2400 h pracy (np. 100 dni × 24 h) — test.
 */
export function calculatePompyCyrkulacyjne(
  input: PompyCyrkulacyjneInput,
): CalcResult<PompyCyrkulacyjneResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PompyCyrkulacyjneResult = {
    energiaObecnaKwh: 0,
    energiaNowaKwh: 0,
    oszczednoscKwh: 0,
    oszczednoscPct: 0,
    energiaSezonObecnaKwh: null,
    energiaSezonNowaKwh: null,
    oszczednoscSezonKwh: null,
    oszczednoscSezonZl: null,
  }
  const dni = input.dniSezonu ?? 0
  const cena = input.cenaZlKwh ?? 0
  const inputs = {
    mocObecnejPompyW: input.mocObecnejPompyW,
    mocNowejPompyW: input.mocNowejPompyW,
    godzinyPracyDobowoH: input.godzinyPracyDobowoH,
    dniSezonu: dni,
    cenaZlKwh: cena,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-POMPY-CYRKULACYJNE",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.mocObecnejPompyW === 0 || input.mocNowejPompyW === 0 || input.godzinyPracyDobowoH === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-POMPY-CYRKULACYJNE",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaObecnaKwh = (input.mocObecnejPompyW * input.godzinyPracyDobowoH) / 1000
  const energiaNowaKwh = (input.mocNowejPompyW * input.godzinyPracyDobowoH) / 1000
  const oszczednoscKwh = energiaObecnaKwh - energiaNowaKwh
  const oszczednoscPct = (oszczednoscKwh / energiaObecnaKwh) * 100
  const sezon = dni > 0
  const oszczednoscSezonKwh = sezon ? oszczednoscKwh * dni : null

  const warnings =
    input.mocNowejPompyW >= input.mocObecnejPompyW
      ? [nowaPompaNieOszczedza()]
      : [oszczednoscInfo(oszczednoscKwh, oszczednoscPct)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: {
      energiaObecnaKwh,
      energiaNowaKwh,
      oszczednoscKwh,
      oszczednoscPct,
      energiaSezonObecnaKwh: sezon ? energiaObecnaKwh * dni : null,
      energiaSezonNowaKwh: sezon ? energiaNowaKwh * dni : null,
      oszczednoscSezonKwh,
      oszczednoscSezonZl: oszczednoscSezonKwh !== null && cena > 0 ? oszczednoscSezonKwh * cena : null,
    },
    unit: "kWh/dobę",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-POMPY-CYRKULACYJNE",
    inputs,
    assumptions: [{ kod: "GODZINY-PRACY-WPISANE-RECZNIE" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
