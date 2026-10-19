import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  bazoweCisnienieWiatruPa,
  cpNetWiatyJednospadowej,
  szczytoweCisnieniePa,
  wspolczynnikEkspozycji,
  type CpNetWiaty,
} from "../eurokod-1/wiatr"
import { GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../eurokod-0/rownowaga"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"
import { balastProjektowyEqu, pionSilaPozioma } from "../zloty-srodek/warnings"
import { zalozenieMasyWlasnej } from "../zloty-srodek/zalozenia"
import { KAT_NORMOWY_MAX_DEG } from "./constants"
import { silaIBalastWiatru, skladStatecznosc } from "./sila-i-balast"
import type { WiatrPowyzej30Input } from "./input"
import { validateInput } from "./validation"
import { katNaWlasnaOdpowiedzialnosc, katObjetyNorma, statecznoscNiekompletna, statecznoscSzacunek, szacunekPozaNorma } from "./warnings"

export const CALCULATOR_VERSION = "1.2.0"

const FORMULA =
  "q_p = c_e(z) \\cdot q_b;\\quad p = q_p \\cdot c_{p,net}(30^\\circ);\\quad " +
  "F_w = c_sc_d \\cdot c_f(30^\\circ,\\varphi) \\cdot q_p \\cdot A_{ref};\\quad m = \\max\\left(0,\\ \\frac{\\gamma_Q F_w}{\\gamma_{G,inf}\\, g} - G\\right);\\quad m_{sl} = \\max\\left(0,\\ \\frac{\\gamma_Q (F_h/\\mu + F_v)}{\\gamma_{G,inf}\\, g} - G\\right);\\quad m_{ov} = \\max\\left(0,\\ \\frac{\\gamma_Q (F_v + 2 F_h h / b)}{\\gamma_{G,inf}\\, g} - G\\right)"

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
  /** Współczynnik siły |c_f| i siła wiatru na stelaż z panelami [N] — tylko gdy wpisano powierzchnię i φ; powyżej 30° do 89° szacunek, 90° siła pozioma. */
  cf: number | null
  silaWiatruN: number | null
  /** Balast projektowy wg PN-EN 1990 (EQU) [kg] = największy ze sprawdzonych warunków; `null` bez powierzchni i φ albo dla 90° bez danych stateczności. */
  balastProjektowyKg: number | null
  /** Składniki balastu [kg]: oderwanie, przesuw, przewracanie; `null` = warunek niesprawdzony. Przesuw i przewracanie wymagają μ, wysokości i podstawy. */
  balastOderwanieKg: number | null
  balastPrzesuwKg: number | null
  balastPrzewracanieKg: number | null
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
  cf: null,
  silaWiatruN: null,
  balastProjektowyKg: null,
  balastOderwanieKg: null,
  balastPrzesuwKg: null,
  balastPrzewracanieKg: null,
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
  const baza = { unit: "Pa", formula: FORMULA, formulaKey: "UI-FORMULA-PV-WIATR-POWYZEJ-30", inputs, calculatorVersion: CALCULATOR_VERSION }

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

  // Siła na stelaż i balast: tylko gdy wpisano powierzchnię i φ. Ta sama reguła co w kalkulatorach zmiany kąta (`silaIBalastWiatru`).
  const { powierzchniaM2 = null, wspolczynnikPhi = null, masaPaneliStelazaKg = null } = input
  if (powierzchniaM2 !== null) inputs.powierzchniaM2 = powierzchniaM2
  if (wspolczynnikPhi !== null) inputs.wspolczynnikPhi = wspolczynnikPhi
  if (masaPaneliStelazaKg !== null) inputs.masaPaneliStelazaKg = masaPaneliStelazaKg
  const { statecznosc, niekompletna } = skladStatecznosc(input.wspolczynnikTarcia, input.wysokoscSrodkaParciaM, input.szerokoscPodstawyM)
  if (input.wspolczynnikTarcia != null) inputs.wspolczynnikTarcia = input.wspolczynnikTarcia
  if (input.wysokoscSrodkaParciaM != null) inputs.wysokoscSrodkaParciaM = input.wysokoscSrodkaParciaM
  if (input.szerokoscPodstawyM != null) inputs.szerokoscPodstawyM = input.szerokoscPodstawyM
  const sila =
    powierzchniaM2 !== null && wspolczynnikPhi !== null
      ? silaIBalastWiatru(input.nachylenieDeg, wspolczynnikPhi, qpPa, powierzchniaM2, masaPaneliStelazaKg ?? 0, statecznosc)
      : null
  if (sila !== null) {
    if (sila.statecznosc && statecznosc !== null) {
      warnings.push(statecznoscSzacunek(statecznosc.wspolczynnikTarcia, statecznosc.wysokoscSrodkaParciaM, statecznosc.szerokoscPodstawyM))
    } else {
      warnings.push(sila.balastKg === null ? pionSilaPozioma() : balastProjektowyEqu())
      if (niekompletna) warnings.push(statecznoscNiekompletna())
    }
    warnings.push(katNaWlasnaOdpowiedzialnosc(input.nachylenieDeg, KAT_NORMOWY_MAX_DEG))
    assumptions.push({ kod: "WP30-ZALOZENIE-CF-Z-30", params: { max: KAT_NORMOWY_MAX_DEG } })
    assumptions.push({ kod: "ZS-ZALOZENIE-CSCD", params: { cscd: CSCD_STELAZ } })
    if (sila.balastKg !== null) {
      assumptions.push({ kod: "ZS-ZALOZENIE-BALAST-PIONOWO", params: { g: PRZYSPIESZENIE_ZIEMSKIE_M_S2 } })
      assumptions.push({ kod: "ZS-ZALOZENIE-BALAST-EQU", params: { gammaQ: GAMMA_Q_EQU, gammaG: GAMMA_G_INF_EQU } })
      assumptions.push(zalozenieMasyWlasnej(masaPaneliStelazaKg))
    }
    if (sila.statecznosc && statecznosc !== null) {
      assumptions.push({ kod: "WP30-ZALOZENIE-STATECZNOSC", params: { mu: statecznosc.wspolczynnikTarcia, h: statecznosc.wysokoscSrodkaParciaM, b: statecznosc.szerokoscPodstawyM } })
    }
  }

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
      cf: sila?.cf ?? null,
      silaWiatruN: sila?.silaN ?? null,
      balastProjektowyKg: sila?.balastKg ?? null,
      balastOderwanieKg: sila?.balastOderwanieKg ?? null,
      balastPrzesuwKg: sila?.balastPrzesuwKg ?? null,
      balastPrzewracanieKg: sila?.balastPrzewracanieKg ?? null,
    },
    status: "ESTIMATE",
    assumptions,
    warnings,
  }
}
