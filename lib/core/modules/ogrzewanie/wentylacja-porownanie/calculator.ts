import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { obliczStrumienCieplaPowietrzaW } from "../wentylacja-odzysk-ciepla/calculator"
import type { WentylacjaPorownanieInput } from "./input"
import { validateInput } from "./validation"
import { bezCopWentylacja, mechanicznaNieOszczedza, naturalnaWSzczelnymDomu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "Q = \\dot V (1 - \\eta) \\rho c_p \\Delta T \\cdot 24, \\quad netto = \\dfrac{Q_{nat} - Q_{mech}}{COP} - P_{went} \\cdot 24, \\quad zwrot = \\dfrac{dopłata}{netto \\cdot dni \\cdot cena}"

export type WentylacjaPorownanieResult = {
  /** Straty ciepła wentylacji naturalnej [kWh/doba]. */
  stratyNaturalnaKwh: number
  /** Straty ciepła wentylacji mechanicznej z odzyskiem [kWh/doba]. */
  stratyMechanicznaKwh: number
  /** Prąd wentylatorów [kWh/doba]. */
  pradWentylatorowKwh: number
  /** Oszczędność ciepła [kWh/doba]. */
  oszczednoscCieplaKwh: number
  /** Bilans prądu: oszczędność prądu ogrzewania − wentylatory [kWh/doba]; null = ogrzewanie nieelektryczne. */
  oszczednoscNettoKwh: number | null
  /** Bilans w sezonie [kWh]; null = brak dni sezonu albo COP. */
  oszczednoscSezonKwh: number | null
  /** [zł/sezon]; null = brak ceny. */
  oszczednoscZl: number | null
  /** Prosty zwrot dopłaty [lata]; null = brak danych albo brak oszczędności. */
  zwrotLat: number | null
}

const PUSTY: WentylacjaPorownanieResult = {
  stratyNaturalnaKwh: 0,
  stratyMechanicznaKwh: 0,
  pradWentylatorowKwh: 0,
  oszczednoscCieplaKwh: 0,
  oszczednoscNettoKwh: null,
  oszczednoscSezonKwh: null,
  oszczednoscZl: null,
  zwrotLat: null,
}

const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Ekran 20, Moduł 6 — "Wentylacja naturalna vs mechaniczna" (dawne 5.26, Biblia §6.26). Wzorzec B: tabela
 * porównawcza źródła (straty ciepła, prąd wentylatorów, kontrola wilgotności, koszt instalacji) z liczbami
 * policzonymi tą samą fizyką co Ekrany 3 i 12 (echo `obliczStrumienCieplaPowietrzaW`): Q = V̇·(1 − η)·ρ·cp·ΔT.
 * Strumień wentylacji naturalnej wpisuje użytkownik (np. n × V z testu szczelności) — wzoru na ciąg
 * grawitacyjny źródło nie podaje (Ekran 9, nie zbudowany). Bilans prądu = oszczędność ciepła ÷ COP −
 * wentylatory; 🟡 gdy wentylatory zużywają więcej, niż oszczędzają (próg = bilans). 🟡 źródła „wentylacja
 * naturalna w nowym, szczelnym domu → pleśń” — flaga użytkownika (źródło nie daje progu n50).
 *
 * Przykład źródła: „straty 8 vs 3 kWh/dobę, wentylatory 0,5 → oszczędza 4,5 kWh/dobę, ok. 1600 kWh rocznie,
 * zwrot ok. 6 lat”. 8 − 3 − 0,5 = 4,5 odejmuje ciepło od prądu 1:1, czyli zakłada ogrzewanie elektryczne
 * bezpośrednie (COP = 1) — przy pompie ciepła oszczędność prądu jest COP razy mniejsza (Dyrektywa #5).
 * „1600 kWh rocznie” = 4,5 × 365 — mnoży zimową dobę przez cały rok; silnik mnoży przez wpisane dni sezonu
 * (bez domyślnej). Zwrot „6 lat” wymaga ceny i kosztu, których źródło nie podaje — odtworzony w teście dla
 * dobranych danych.
 */
export function calculateWentylacjaPorownanie(input: WentylacjaPorownanieInput): CalcResult<WentylacjaPorownanieResult> {
  const { errors } = validateInput(input)
  const inputs = {
    strumienNaturalnyM3H: input.strumienNaturalnyM3H,
    strumienMechanicznyM3H: input.strumienMechanicznyM3H,
    sprawnoscOdzyskuPct: input.sprawnoscOdzyskuPct,
    mocWentylatorowW: input.mocWentylatorowW,
    copOgrzewania: input.copOgrzewania,
    dniSezonu: input.dniSezonu,
    cenaPraduZlKwh: input.cenaPraduZlKwh,
    doplataZl: input.doplataZl,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-WENTYLACJA-POROWNANIE", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.tWewC === null || input.tZewnC === null || input.strumienNaturalnyM3H === 0 || input.strumienMechanicznyM3H === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const dT = Math.max(0, input.tWewC - input.tZewnC)
  const stratyNaturalnaKwh = (obliczStrumienCieplaPowietrzaW(input.strumienNaturalnyM3H, dT) * 24) / 1000
  const stratyMechanicznaKwh = (obliczStrumienCieplaPowietrzaW(input.strumienMechanicznyM3H, dT, 100 - input.sprawnoscOdzyskuPct) * 24) / 1000
  const pradWentylatorowKwh = (input.mocWentylatorowW * 24) / 1000
  const oszczednoscCieplaKwh = stratyNaturalnaKwh - stratyMechanicznaKwh

  const warnings: Warning[] = []
  if (input.szczelnyDom) warnings.push(naturalnaWSzczelnymDomu())
  const value: WentylacjaPorownanieResult = { ...PUSTY, stratyNaturalnaKwh, stratyMechanicznaKwh, pradWentylatorowKwh, oszczednoscCieplaKwh }
  if (input.copOgrzewania > 0) {
    const netto = oszczednoscCieplaKwh / input.copOgrzewania - pradWentylatorowKwh
    value.oszczednoscNettoKwh = netto
    if (netto <= 0) warnings.push(mechanicznaNieOszczedza(r2(netto)))
    if (input.dniSezonu > 0) {
      value.oszczednoscSezonKwh = netto * input.dniSezonu
      if (input.cenaPraduZlKwh > 0) {
        value.oszczednoscZl = value.oszczednoscSezonKwh * input.cenaPraduZlKwh
        if (input.doplataZl > 0 && value.oszczednoscZl > 0) value.zwrotLat = input.doplataZl / value.oszczednoscZl
      }
    }
  } else {
    warnings.push(bezCopWentylacja())
  }

  const assumptions: Assumption[] = [{ kod: "WPOR-ZALOZENIE-DOBA" }]
  return {
    ...baza,
    value,
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
