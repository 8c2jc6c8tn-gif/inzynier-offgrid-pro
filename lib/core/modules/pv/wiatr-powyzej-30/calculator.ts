import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  bazoweCisnienieWiatruPa,
  cpNetWiatyJednospadowej,
  szczytoweCisnieniePa,
  wspolczynnikEkspozycji,
  type CpNetWiaty,
} from "../eurokod-1/wiatr"
import { KAT_NORMOWY_MAX_DEG } from "./constants"
import type { WiatrPowyzej30Input } from "./input"
import { validateInput } from "./validation"
import { katObjetyNorma, szacunekPozaNorma } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "q_p = c_e(z) \\cdot q_b;\\quad p = q_p \\cdot c_{p,net}(30^\\circ)"
const FORMULA_KEY = "UI-FORMULA-PV-WIATR-POWYZEJ-30"

export type WiatrPowyzej30Result = {
  /** Bazowe ciśnienie prędkości q_b [Pa] (Tablica NA.1). */
  qbPa: number
  /** Współczynnik ekspozycji c_e(z) (Tablica NA.3). */
  ce: number
  /** Szczytowe ciśnienie prędkości q_p(z) = c_e·q_b [Pa]. */
  qpPa: number
  /** Współczynniki c_p,net z 30° Tablicy 7.6, zachowane dla większych kątów (D90). */
  cp: CpNetWiaty
  /** Ciśnienie netto na panel [Pa]: docisk i odrywanie, pole środkowe i krawędziowe. */
  dociskSrodekPa: number
  dociskKrawedzPa: number
  odrywanieSrodekPa: number
  odrywanieKrawedzPa: number
}

const CP_ZERO: CpNetWiaty = { dociskSrodek: 0, dociskKrawedz: 0, odrywanieSrodek: 0, odrywanieKrawedz: 0 }
const PUSTY: WiatrPowyzej30Result = {
  qbPa: 0,
  ce: 0,
  qpPa: 0,
  cp: CP_ZERO,
  dociskSrodekPa: 0,
  dociskKrawedzPa: 0,
  odrywanieSrodekPa: 0,
  odrywanieKrawedzPa: 0,
}

/**
 * Wiatr dla paneli na konstrukcji pod kątem powyżej 30° do 90° (Moduł 3). Cały wynik jest SZACUNKIEM aplikacji
 * (status `ESTIMATE`, standard 3.3): Tablica 7.6 Eurokodu kończy się na 30°, a dla większych kątów
 * zachowujemy jej współczynniki c_p,net (decyzja właściciela D90). Do 30° jest norma — kalkulator zwraca
 * wtedy `OUT_OF_SCOPE` i odsyła do wyniku normowego, nie liczy własnej wartości.
 */
export function calculateWiatrPowyzej30(input: WiatrPowyzej30Input): CalcResult<WiatrPowyzej30Result> {
  const { errors } = validateInput(input)
  const inputs: Record<string, number> = { nachylenieDeg: input.nachylenieDeg }
  if (input.wysokoscNpmM !== null) inputs.wysokoscNpmM = input.wysokoscNpmM
  if (input.wysokoscKonstrukcjiM !== null) inputs.wysokoscKonstrukcjiM = input.wysokoscKonstrukcjiM
  if (input.strefaWiatrowa !== null) inputs.strefaWiatrowa = input.strefaWiatrowa
  const baza = { unit: "Pa", formula: FORMULA, formulaKey: FORMULA_KEY, inputs, calculatorVersion: CALCULATOR_VERSION }

  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (input.nachylenieDeg === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  if (input.nachylenieDeg <= KAT_NORMOWY_MAX_DEG) {
    return { ...baza, value: PUSTY, status: "OUT_OF_SCOPE", assumptions: [], warnings: [katObjetyNorma(input.nachylenieDeg, KAT_NORMOWY_MAX_DEG)] }
  }

  const { strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, wysokoscKonstrukcjiM } = input
  if (strefaWiatrowa === null || wysokoscNpmM === null || kategoriaTerenu === null || wysokoscKonstrukcjiM === null) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const cp = cpNetWiatyJednospadowej(KAT_NORMOWY_MAX_DEG)
  if (cp === null) throw new Error("Tablica 7.6 musi podawać c_p,net dla granicznego kąta normy")
  const qbPa = bazoweCisnienieWiatruPa(strefaWiatrowa, wysokoscNpmM)
  const ce = wspolczynnikEkspozycji(kategoriaTerenu, wysokoscKonstrukcjiM)
  const qpPa = szczytoweCisnieniePa(qbPa, ce)

  const warnings: Warning[] = [szacunekPozaNorma(input.nachylenieDeg, KAT_NORMOWY_MAX_DEG)]
  const assumptions: Assumption[] = [
    { kod: "WP30-ZALOZENIE-CP-Z-30", params: { max: KAT_NORMOWY_MAX_DEG } },
    { kod: "WP30-ZALOZENIE-NAJGORSZY-PRZYPADEK" },
  ]

  return {
    ...baza,
    value: {
      qbPa,
      ce,
      qpPa,
      cp,
      dociskSrodekPa: qpPa * cp.dociskSrodek,
      dociskKrawedzPa: qpPa * cp.dociskKrawedz,
      odrywanieSrodekPa: qpPa * cp.odrywanieSrodek,
      odrywanieKrawedzPa: qpPa * cp.odrywanieKrawedz,
    },
    status: "ESTIMATE",
    assumptions,
    warnings,
  }
}
