import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { ProjektUziemieniaInput } from "./input"
import { validateInput } from "./validation"
import { geometriaNiefizyczna, uziomZaprojektowany, zaDuzoPretow } from "./warnings"
import { DOCELOWA_REZYSTANCJA_OM, MAX_SENSOWNA_LICZBA_PRETOW } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type ProjektUziemieniaResult = {
  rezystancjaJednegoPretaOm: number
  liczbaPretowSzacowana: number
  docelowaRezystancjaOm: number
}

/**
 * Wzór Dwighta dla pojedynczego pionowego pręta uziomowego — standardowy wzór inżynierski
 * (IEEE Std 142, tzw. "Green Book"), nie norma domenowa wymagająca zakupu — sprawdzony niezależnie
 * przed implementacją (Python) na przykładzie ze źródła (ρ=100 Ω·m glina, pręt 3m×16mm → R≈29,8 Ω;
 * 3 takie pręty, proste łączenie równoległe 1/n → ≈9,9 Ω, zgodne z przykładem źródła "<10 Ω").
 */
const FORMULA = "R = \\frac{\\rho}{2\\pi L}\\left(\\ln\\frac{4L}{d} - 1\\right)"

function pusty(): ProjektUziemieniaResult {
  return { rezystancjaJednegoPretaOm: 0, liczbaPretowSzacowana: 0, docelowaRezystancjaOm: 0 }
}

/**
 * Ekran 9, Moduł 5 "Okablowanie i zabezpieczenia" — "Projekt uziemienia" (dawne 4.8,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Źródło opisuje silnik słownie ("dobiera liczbę/
 * rozstaw prętów dla osiągnięcia progu"), bez podania samego wzoru — użyto standardowego wzoru
 * Dwighta (fizyka/inżynieria, nie wymyślony współczynnik) + uproszczonego łączenia równoległego
 * 1/n (bez korekty na wzajemne oddziaływanie prętów — jawnie oznaczone w `assumptions`, realna
 * wartość po instalacji może wymagać jednego pręta więcej niż to uproszczenie sugeruje).
 */
export function calculateProjektUziemienia(input: ProjektUziemieniaInput): CalcResult<ProjektUziemieniaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    rezystywnoscGruntuOmM: input.rezystywnoscGruntuOmM,
    dlugoscPretaM: input.dlugoscPretaM,
    srednicaPretaMm: input.srednicaPretaMm,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "Ω",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const { celUziemienia } = input

  if (input.rezystywnoscGruntuOmM === 0 || input.dlugoscPretaM === 0 || input.srednicaPretaMm === 0 || celUziemienia === null) {
    return {
      value: pusty(),
      unit: "Ω",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const srednicaPretaM = input.srednicaPretaMm / 1000
  const stosunek = (4 * input.dlugoscPretaM) / srednicaPretaM

  if (stosunek <= Math.E) {
    return {
      value: pusty(),
      unit: "Ω",
      status: "OUT_OF_SCOPE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [geometriaNiefizyczna()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const rezystancjaJednegoPretaOm = (input.rezystywnoscGruntuOmM / (2 * Math.PI * input.dlugoscPretaM)) * (Math.log(stosunek) - 1)
  const docelowaRezystancjaOm = DOCELOWA_REZYSTANCJA_OM[celUziemienia]
  const liczbaPretowSzacowana = Math.max(1, Math.ceil(rezystancjaJednegoPretaOm / docelowaRezystancjaOm))

  const warnings: Warning[] = []
  const assumptions: Assumption[] = [
    { kod: "UZIOM-MODEL-N-PRETOW-UPROSZCZONY" },
    { kod: "UZIOM-MATERIAL-PATRZ-LACZENIE-CU-AL" },
  ]

  if (liczbaPretowSzacowana > MAX_SENSOWNA_LICZBA_PRETOW) {
    warnings.push(zaDuzoPretow(liczbaPretowSzacowana, MAX_SENSOWNA_LICZBA_PRETOW))
  } else {
    warnings.push(uziomZaprojektowany(liczbaPretowSzacowana, rezystancjaJednegoPretaOm))
  }

  const maNieinformacyjne = warnings.some((w) => w.level !== "info")

  return {
    value: { rezystancjaJednegoPretaOm, liczbaPretowSzacowana, docelowaRezystancjaOm },
    unit: "Ω",
    status: maNieinformacyjne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
