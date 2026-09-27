import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  CIEZAR_OBJETOSCIOWY_SNIEGU,
  MU_MIN_Z_BARIERKAMI,
  NAWISY_STREFA,
  NAWISY_WYSOKOSC_PROG_M,
  WSPOLCZYNNIK_EKSPOZYCJI_CE,
  WSPOLCZYNNIK_TERMICZNY_CT,
  obciazenieSniegiemGruntuSk,
  wspolczynnikKsztaltuMu1,
} from "@/lib/core/modules/pv/eurokod-1/snieg"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "@/lib/core/modules/pv/zloty-srodek/constants"
import type { ObciazenieDachuSniegiemInput } from "./input"
import { validateInput } from "./validation"
import {
  aktualnePrzekraczaNosnosc,
  brakNosnosci,
  nawisySniezne,
  normowePrzekraczaNosnosc,
  pomiarBezRodzaju,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "s = \\mu_1 \\cdot C_e \\cdot C_t \\cdot s_k;\\; q = \\gamma \\cdot h"

export type ObciazenieDachuSniegiemResult = {
  /** Wartość charakterystyczna obciążenia śniegiem gruntu [kN/m²] (Tablica NB.1). */
  skKnM2: number
  /** Współczynnik kształtu dachu użyty w obliczeniu (Tablica 5.2, z minimum 0,8 przy barierkach/attyce). */
  mu: number
  ce: number
  ct: number
  /** Obciążenie śniegiem dachu, wartość charakterystyczna [kN/m²] — wzór 5.1. */
  sKnM2: number
  /** To samo w kg/m² (÷ g) — jednostka, w której źródło podaje przykład. */
  sKgM2: number
  /** s / nośność × 100 [%]. null = nośność nie podana. */
  wykorzystanieNormowePct: number | null
  /** Obciążenie zmierzonej warstwy γ·h [kN/m²], dla γ min i max z Tablicy E.1. null = brak pomiaru. */
  aktualneMinKnM2: number | null
  aktualneMaxKnM2: number | null
  /** Górna wartość obciążenia zmierzonej warstwy w kg/m². null = brak pomiaru. */
  aktualneMaxKgM2: number | null
  /** Górne γ·h / nośność × 100 [%]. null = brak pomiaru albo nośności. */
  wykorzystanieAktualnePct: number | null
}

const PUSTY_WYNIK: ObciazenieDachuSniegiemResult = {
  skKnM2: 0,
  mu: 0,
  ce: 0,
  ct: 0,
  sKnM2: 0,
  sKgM2: 0,
  wykorzystanieNormowePct: null,
  aktualneMinKnM2: null,
  aktualneMaxKnM2: null,
  aktualneMaxKgM2: null,
  wykorzystanieAktualnePct: null,
}

/** Tolerancja porównania z nośnością [kN/m²] — 0,8 × 0,9 daje w IEEE-754 0,7200000000000001. */
const EPS_KN_M2 = 1e-9

const naKg = (kNm2: number) => (kNm2 * 1000) / PRZYSPIESZENIE_ZIEMSKIE_M_S2

/**
 * Ekran 23, Moduł 7 — "Obciążenie dachu lodem i śniegiem" (dawne 6.34→7.32). Źródło podaje tylko
 * opis i przykład; liczby wyłącznie z PN-EN 1991-1-3:2005 + Załącznik krajowy NB
 * (`docs/zrodla/norma-PN-EN-1991-1-3/`): s_k z Tablicy NB.1, μ1 z Tablicy 5.2 (ta sama funkcja co
 * M3 złoty środek i typ montażu), C_e z Tablicy 5.1, C_t = 1,0 (5.2(8)), γ śniegu z Tablicy E.1.
 *
 * Twardy stop 🔴 ze źródła: obciążenie przekraczające nośność konstrukcji — osobno dla wartości
 * normowej i dla zmierzonej warstwy. Wariant „zbliżające się do nośności” NIE jest liczony — źródło
 * nie podaje progu (Dyrektywa #1); ekran pokazuje wykorzystanie w %.
 */
export function calculateObciazenieDachuSniegiem(
  input: ObciazenieDachuSniegiemInput,
): CalcResult<ObciazenieDachuSniegiemResult> {
  const inputs: Record<string, number> = {
    strefa: input.strefa ?? 0,
    wysokoscNpmM: input.wysokoscNpmM ?? 0,
    katDachuDeg: input.katDachuDeg ?? 0,
    barierkiLubAttyka: input.barierkiLubAttyka ? 1 : 0,
    nosnoscDachuKnM2: input.nosnoscDachuKnM2,
    gruboscWarstwyCm: input.gruboscWarstwyCm,
  }
  const wynik = (status: CalcResult<unknown>["status"], warnings: Warning[]) => ({
    value: PUSTY_WYNIK,
    unit: "kN/m²",
    status,
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", errors)
  if (input.strefa === null || input.wysokoscNpmM === null || input.katDachuDeg === null) {
    return wynik("INCOMPLETE", [])
  }

  const { strefa, wysokoscNpmM, katDachuDeg, nosnoscDachuKnM2 } = input
  const skKnM2 = obciazenieSniegiemGruntuSk(strefa, wysokoscNpmM)
  const mu1 = wspolczynnikKsztaltuMu1(katDachuDeg)
  const mu = input.barierkiLubAttyka ? Math.max(mu1, MU_MIN_Z_BARIERKAMI) : mu1
  const ce = WSPOLCZYNNIK_EKSPOZYCJI_CE[input.ekspozycja]
  const ct = WSPOLCZYNNIK_TERMICZNY_CT
  const sKnM2 = mu * ce * ct * skKnM2
  const maNosnosc = nosnoscDachuKnM2 > 0

  const warnings: Warning[] = []
  const assumptions: Assumption[] = [
    { kod: "SNIEG-ZALOZENIE-WARTOSC-CHARAKTERYSTYCZNA" },
    { kod: "SNIEG-ZALOZENIE-DACH-JEDNO-DWUPOLACIOWY" },
    { kod: "SNIEG-ZALOZENIE-CT", params: { ct } },
    { kod: "SNIEG-ZALOZENIE-GRANICA-STREF" },
  ]
  if (mu > mu1) assumptions.push({ kod: "SNIEG-ZALOZENIE-MU-MIN-BARIERKI", params: { mu: MU_MIN_Z_BARIERKAMI } })

  if (maNosnosc && sKnM2 > nosnoscDachuKnM2 + EPS_KN_M2) warnings.push(normowePrzekraczaNosnosc(sKnM2, nosnoscDachuKnM2))

  let aktualneMinKnM2: number | null = null
  let aktualneMaxKnM2: number | null = null
  if (input.gruboscWarstwyCm > 0) {
    if (input.rodzajSniegu === null) {
      warnings.push(pomiarBezRodzaju())
    } else {
      const gamma = CIEZAR_OBJETOSCIOWY_SNIEGU[input.rodzajSniegu]
      const hM = input.gruboscWarstwyCm / 100
      aktualneMinKnM2 = gamma.min * hM
      aktualneMaxKnM2 = gamma.max * hM
      assumptions.push({ kod: "SNIEG-ZALOZENIE-POMIAR-NA-DACHU" })
      if (gamma.min !== gamma.max) {
        assumptions.push({ kod: "SNIEG-ZALOZENIE-GAMMA-GORNA", params: { min: gamma.min, max: gamma.max } })
      }
      if (maNosnosc && aktualneMaxKnM2 > nosnoscDachuKnM2 + EPS_KN_M2) {
        warnings.push(aktualnePrzekraczaNosnosc(aktualneMaxKnM2, nosnoscDachuKnM2))
      }
    }
  }

  if (!maNosnosc) warnings.push(brakNosnosci())
  if (wysokoscNpmM > NAWISY_WYSOKOSC_PROG_M || strefa === NAWISY_STREFA) warnings.push(nawisySniezne())

  const maKrytyczne = warnings.some((w) => w.level === "critical")

  return {
    value: {
      skKnM2,
      mu,
      ce,
      ct,
      sKnM2,
      sKgM2: naKg(sKnM2),
      wykorzystanieNormowePct: maNosnosc ? (sKnM2 / nosnoscDachuKnM2) * 100 : null,
      aktualneMinKnM2,
      aktualneMaxKnM2,
      aktualneMaxKgM2: aktualneMaxKnM2 === null ? null : naKg(aktualneMaxKnM2),
      wykorzystanieAktualnePct:
        aktualneMaxKnM2 !== null && maNosnosc ? (aktualneMaxKnM2 / nosnoscDachuKnM2) * 100 : null,
    },
    unit: "kN/m²",
    status: maKrytyczne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
