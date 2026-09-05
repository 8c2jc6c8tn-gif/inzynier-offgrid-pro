import type { CalcResult } from "@/lib/core/calc-result"
import type { ProfilAstronomicznyInput } from "./input"
import { validateInput } from "./validation"
import { energiaNocna, nocPolarnaLubDzienPolarny } from "./warnings"
import { DEKLINACJA_AMPLITUDA_DEG, DEKLINACJA_PRZESUNIECIE_DNI, DNI_W_ROKU } from "./constants"

// 🔎 TD1 (dlug-techniczny.md): tylko część astronomiczna (Sekcja A/C). Profil godzinowych
// współczynników zapotrzebowania (Sekcja B źródła) nie zbudowany — przykładowe, nie uniwersalne wartości.
export const CALCULATOR_VERSION = "1.0.0"

export type ProfilAstronomicznyResult = {
  dlugoscDniaH: number
  dlugoscNocyH: number
  /** null = pominięto (moc odbiornika nie wpisana). */
  energiaNocnaKwh: number | null
}

const FORMULA =
  "\\delta = 23{,}45° \\sin\\!\\left(\\dfrac{360}{365}(284+n)\\right) \\;\\; ; \\;\\; N = \\dfrac{2}{15}\\arccos(-\\tan\\varphi\\tan\\delta)"

function obliczDlugoscDniaH(szerokoscGeograficznaDeg: number, dzienRoku: number): number {
  const deklinacjaDeg =
    DEKLINACJA_AMPLITUDA_DEG * Math.sin((2 * Math.PI * (DEKLINACJA_PRZESUNIECIE_DNI + dzienRoku)) / DNI_W_ROKU)
  const phiRad = (szerokoscGeograficznaDeg * Math.PI) / 180
  const deklinacjaRad = (deklinacjaDeg * Math.PI) / 180
  const cosWs = -Math.tan(phiRad) * Math.tan(deklinacjaRad)

  if (cosWs <= -1) return 24 // dzień polarny — Słońce nie zachodzi
  if (cosWs >= 1) return 0 // noc polarna — Słońce nie wschodzi

  const wsRad = Math.acos(cosWs)
  const wsDeg = (wsRad * 180) / Math.PI
  return (2 / 15) * wsDeg
}

/**
 * Ekran 5, Moduł 2 "Zapotrzebowanie energetyczne" — "Profil dobowy + astronomiczny dzień/noc"
 * (scala dawne 1.7, 1.16, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, Sekcja A/B/C).
 * Standardowe równanie długości dnia (przybliżenie deklinacji Coopera 1969 + równanie
 * wschodu/zachodu Słońca) — uniwersalna astronomia, nie dana specyficzna dla źródła. Zweryfikowane
 * niezależnie w Pythonie: dla Warszawy (φ≈52,2°) w grudniu (n≈355) daje ~7,5h dnia / ~16,5h nocy,
 * zgodne z przykładem źródła Sekcji C ("Grudzień: 8h dnia, 16h nocy").
 */
export function calculateProfilAstronomiczny(
  input: ProfilAstronomicznyInput,
): CalcResult<ProfilAstronomicznyResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ProfilAstronomicznyResult = { dlugoscDniaH: 0, dlugoscNocyH: 0, energiaNocnaKwh: null }
  const inputs = {
    szerokoscGeograficzna: input.szerokoscGeograficzna ?? 0,
    dzienRoku: input.dzienRoku,
    mocOdbiornikaNocnegoW: input.mocOdbiornikaNocnegoW,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "h",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.szerokoscGeograficzna === null || input.dzienRoku === 0) {
    return {
      value: pustyWynik,
      unit: "h",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const dlugoscDniaH = obliczDlugoscDniaH(input.szerokoscGeograficzna, input.dzienRoku)
  const dlugoscNocyH = 24 - dlugoscDniaH

  const energiaNocnaKwh =
    input.mocOdbiornikaNocnegoW > 0 ? (input.mocOdbiornikaNocnegoW * dlugoscNocyH) / 1000 : null

  const warnings = []
  if (dlugoscDniaH === 0 || dlugoscDniaH === 24) warnings.push(nocPolarnaLubDzienPolarny(dlugoscDniaH))
  if (energiaNocnaKwh !== null) warnings.push(energiaNocna(input.mocOdbiornikaNocnegoW, dlugoscNocyH, energiaNocnaKwh))

  return {
    value: { dlugoscDniaH, dlugoscNocyH, energiaNocnaKwh },
    unit: "h",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Przybliżenie deklinacji Słońca metodą Coopera (1969) — standardowa formuła inżynierii słonecznej, dokładność ±1° deklinacji.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
