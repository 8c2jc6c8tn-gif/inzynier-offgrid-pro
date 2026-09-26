import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { balastProjektowyEquKg, GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../eurokod-0/rownowaga"
import { wspolczynnikKsztaltuMu1 } from "../eurokod-1/snieg"
import {
  bazoweCisnienieWiatruPa,
  CF_TABLICA_PIONOWA,
  CF_WIATA_MAX_KAT_DEG,
  cfOdrywaniaWiaty,
  KAT_PIONOWY_DEG,
  silaWiatruN,
  szczytoweCisnieniePa,
  wspolczynnikEkspozycji,
} from "../eurokod-1/wiatr"
import { obliczProdukcjeKwh } from "../kat-i-azymut/calculator"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "./constants"
import type { ZlotySrodekInput } from "./input"
import { validateInput } from "./validation"
import {
  balastProjektowyEqu,
  optimumPozaZakresemWiatru,
  pionSilaPozioma,
  rekomendacjaWymagaWyceny,
  wybranyKatBezDanychWiatru,
} from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

export type PunktKata = {
  nachylenieDeg: number
  napromieniowanieRoczneKwhM2: number
  /** PN-EN 1991-1-3, Tablica 5.2 — jaka część obciążenia śniegiem gruntu zostaje na panelu. */
  mu1: number
  /** |cf| — odrywanie (0–30°) albo siła pozioma (90°); `null` = brak danych normowych. */
  cf: number | null
  silaWiatruN: number | null
  /** Siła względem największej siły ze wszystkich kątów z danymi normowymi [%]. */
  procentSilyMaks: number | null
  /** Design ballast m = γQ·Fw/(γG,inf·g) [kg], PN-EN 1990 EQU — only 0–30° (uplift); 90° and 31–89° → `null`. */
  balastKg: number | null
  kosztBalastuZl: number | null
  produkcjaRocznaKwh: number | null
  wartoscEnergiiZl: number | null
  /** Wartość energii w okresie analizy minus koszt balastu [zł] (kryterium D27). */
  bilansZl: number | null
}

export type ZlotySrodekResult = {
  qbPa: number
  ce: number
  qpPa: number
  punkty: PunktKata[]
  optimumEnergiiDeg: number
  /** Kąt 0–30° z największym bilansem; `null` bez wyceny energii. */
  rekomendacjaDeg: number | null
  wybranyDeg: number | null
}

const FORMULA =
  "F_w = c_sc_d \\cdot c_f(\\alpha,\\varphi) \\cdot c_e(z_e) \\cdot q_b \\cdot A_{ref},\\quad " +
  "m = \\frac{\\gamma_Q F_w}{\\gamma_{G,inf}\\, g},\\quad " +
  "\\alpha^* = \\arg\\max_{\\alpha \\le 30^\\circ} \\left( E(\\alpha) \\cdot n \\cdot c_{kWh} - m(\\alpha) \\cdot c_{kg} \\right)"

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

export function calculateZlotySrodek(input: ZlotySrodekInput): CalcResult<ZlotySrodekResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const wynik = (
    status: CalcResult<ZlotySrodekResult | null>["status"],
    value: ZlotySrodekResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<ZlotySrodekResult | null> => ({
    value,
    unit: "°",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { tabela, strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, wysokoscKonstrukcjiM, powierzchniaPaneliM2, wspolczynnikPhi } = input
  const { cenaBalastuZlKg } = input
  if (
    tabela === null ||
    tabela.katyDeg.length === 0 ||
    strefaWiatrowa === null ||
    wysokoscNpmM === null ||
    kategoriaTerenu === null ||
    wysokoscKonstrukcjiM === null ||
    powierzchniaPaneliM2 === null ||
    wspolczynnikPhi === null ||
    cenaBalastuZlKg === null
  ) {
    return wynik("INCOMPLETE", null, [])
  }

  const qbPa = bazoweCisnienieWiatruPa(strefaWiatrowa, wysokoscNpmM)
  const ce = wspolczynnikEkspozycji(kategoriaTerenu, wysokoscKonstrukcjiM)
  const qpPa = szczytoweCisnieniePa(qbPa, ce)

  const { mocInstalacjiKwp: p, wspolczynnikPr: pr, cenaEnergiiZlKwh: cenaKwh, liczbaLat: lata } = input
  const zWycena = p !== null && pr !== null && cenaKwh !== null && lata !== null

  const surowe = tabela.katyDeg.map((kat, i) => {
    const h = suma(tabela.miesiace[i]!)
    const cf = kat === KAT_PIONOWY_DEG ? CF_TABLICA_PIONOWA : cfOdrywaniaWiaty(kat, wspolczynnikPhi)
    const sila = cf === null ? null : silaWiatruN(CSCD_STELAZ, cf, qpPa, powierzchniaPaneliM2)
    const odrywanie = sila !== null && kat <= CF_WIATA_MAX_KAT_DEG
    const balastKg = odrywanie ? balastProjektowyEquKg(sila, PRZYSPIESZENIE_ZIEMSKIE_M_S2) : null
    const kosztBalastuZl = balastKg === null ? null : balastKg * cenaBalastuZlKg
    const produkcjaRocznaKwh = zWycena ? obliczProdukcjeKwh(h, p, pr) : null
    const wartoscEnergiiZl = produkcjaRocznaKwh === null ? null : produkcjaRocznaKwh * lata! * cenaKwh!
    const bilansZl = wartoscEnergiiZl === null || kosztBalastuZl === null ? null : wartoscEnergiiZl - kosztBalastuZl
    return { kat, h, cf, sila, balastKg, kosztBalastuZl, produkcjaRocznaKwh, wartoscEnergiiZl, bilansZl }
  })
  const silaMaks = Math.max(...surowe.map((s) => s.sila ?? 0))
  const punkty: PunktKata[] = surowe.map((s) => ({
    nachylenieDeg: s.kat,
    napromieniowanieRoczneKwhM2: s.h,
    mu1: wspolczynnikKsztaltuMu1(s.kat),
    cf: s.cf,
    silaWiatruN: s.sila,
    procentSilyMaks: s.sila === null || silaMaks <= 0 ? null : (100 * s.sila) / silaMaks,
    balastKg: s.balastKg,
    kosztBalastuZl: s.kosztBalastuZl,
    produkcjaRocznaKwh: s.produkcjaRocznaKwh,
    wartoscEnergiiZl: s.wartoscEnergiiZl,
    bilansZl: s.bilansZl,
  }))

  const optimumEnergii = punkty.reduce((a, b) => (b.napromieniowanieRoczneKwhM2 > a.napromieniowanieRoczneKwhM2 ? b : a))
  // Remis → niższy kąt (mniej wiatru przy tej samej wartości) — pierwszy znaleziony przy ścisłym ">".
  const kandydaci = punkty.filter((q) => q.bilansZl !== null)
  const rekomendacja = kandydaci.length > 0 ? kandydaci.reduce((a, b) => (b.bilansZl! > a.bilansZl! ? b : a)) : null

  const wybranyDeg = input.nachylenieDeg === null ? null : Math.round(input.nachylenieDeg)
  const warnings: Warning[] = [balastProjektowyEqu()]
  if (!zWycena) warnings.push(rekomendacjaWymagaWyceny())
  if (optimumEnergii.nachylenieDeg > CF_WIATA_MAX_KAT_DEG) warnings.push(optimumPozaZakresemWiatru(optimumEnergii.nachylenieDeg))
  if (wybranyDeg !== null && wybranyDeg > CF_WIATA_MAX_KAT_DEG) {
    warnings.push(wybranyDeg === KAT_PIONOWY_DEG ? pionSilaPozioma() : wybranyKatBezDanychWiatru(wybranyDeg))
  }

  const assumptions: Assumption[] = [
    { kod: "ZS-ZALOZENIE-STELAZ-WIATA" },
    { kod: "ZS-ZALOZENIE-CSCD", params: { cscd: CSCD_STELAZ } },
    { kod: "ZS-ZALOZENIE-CDIR-CSEASON" },
    { kod: "ZS-ZALOZENIE-KAT-POSREDNI" },
    { kod: "ZS-ZALOZENIE-BALAST-PIONOWO", params: { g: PRZYSPIESZENIE_ZIEMSKIE_M_S2 } },
    { kod: "ZS-ZALOZENIE-BALAST-EQU", params: { gammaQ: GAMMA_Q_EQU, gammaG: GAMMA_G_INF_EQU } },
    { kod: "ZS-ZALOZENIE-CENA-BALASTU", params: { cena: cenaBalastuZlKg } },
    { kod: "ZS-ZALOZENIE-SNIEG-MU1" },
    { kod: "KAT-ZALOZENIE-TABELA-PVGIS", params: { azymut: tabela.azymutDeg, albedo: tabela.albedo } },
  ]
  if (zWycena) assumptions.push({ kod: "KAT-ZALOZENIE-PR-UZYTKOWNIKA", params: { pr: pr! } })

  return wynik(
    "VALID_WITH_WARNINGS",
    {
      qbPa,
      ce,
      qpPa,
      punkty,
      optimumEnergiiDeg: optimumEnergii.nachylenieDeg,
      rekomendacjaDeg: rekomendacja?.nachylenieDeg ?? null,
      wybranyDeg,
    },
    warnings,
    assumptions,
  )
}
