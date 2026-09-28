import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../eurokod-0/rownowaga"
import { wspolczynnikKsztaltuMu1 } from "../eurokod-1/snieg"
import { KAT_PIONOWY_DEG } from "../eurokod-1/wiatr"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"
import { balastProjektowyEqu, pionSilaPozioma, wybranyKatBezDanychWiatru } from "../zloty-srodek/warnings"
import { PROG_SSANIA_OD_SPODU_DEG, PROG_ZALEGANIA_SNIEGU_DEG } from "./constants"
import type { DachPlaskiInput } from "./input"
import { validateDachPlaski } from "./validation"
import { dachPozaModelemWiaty, sniegZalegaPonizejProgu, ssanieOdSpodu } from "./warnings"
import { katPosredniTablicy, podniesienieKrawedziM, wiatrDlaKata, type WiatrDlaKata } from "./wiatr-stelaza"
import { fabrykaWyniku, statusZOstrzezen } from "./wynik"

export type DachPlaskiResult = WiatrDlaKata & {
  /** Podniesienie górnej krawędzi nad dolną h = L × sin(α) [m]. */
  podniesienieM: number
  powierzchniaM2: number
  /** PN-EN 1991-1-3, Tablica 5.2 — część obciążenia śniegiem gruntu, która zostaje na panelach. */
  mu1: number
}

const FORMULA =
  "h = L \\sin\\alpha,\\quad z_e = h_0 + h,\\quad F_w = c_sc_d \\cdot c_f(\\alpha,\\varphi) \\cdot c_e(z_e) \\cdot q_b \\cdot L \\cdot B,\\quad m = \\frac{\\gamma_Q F_w}{\\gamma_{G,inf}\\, g}"

/**
 * Tryb "Dach płaski / grunt" (dawne 2.5). Źródło (B): `h = L × sin(α)` 1:1; siła wiatru — pełny tor
 * PN-EN 1991-1-4 jak w M3/E9 (stelaż = wiata jednospadowa, D26); "ryzyko zalegania śniegu rośnie przy
 * kątach < 30°"; 🔴 "~45°: ssanie od spodu może zerwać panele". Przykład "35° → 1,2 m, 450 kg/moduł,
 * balast 80 kg" to ilustracja — źródło nie podaje L ani danych wiatru, a dla 35° norma nie ma cf.
 */
export function calculateDachPlaski(input: DachPlaskiInput): CalcResult<DachPlaskiResult | null> {
  const wynik = fabrykaWyniku<DachPlaskiResult>(input, FORMULA, "kg")
  const errors = validateDachPlaski(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)

  const { strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, wspolczynnikPhi, miejsce, nachylenieDeg: kat } = input
  const { dlugoscWzdluzSpaduM: L, szerokoscStelazaM: B, wysokoscDolnejKrawedziM: h0 } = input
  if (
    strefaWiatrowa === null ||
    wysokoscNpmM === null ||
    kategoriaTerenu === null ||
    wspolczynnikPhi === null ||
    miejsce === null ||
    kat === null ||
    L === null ||
    B === null ||
    h0 === null
  ) {
    return wynik("INCOMPLETE", null)
  }

  const podniesienieM = podniesienieKrawedziM(L, kat)
  const powierzchniaM2 = L * B
  const wiatr = wiatrDlaKata({ strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, wspolczynnikPhi }, kat, h0 + podniesienieM, powierzchniaM2)

  const warnings: Warning[] = []
  if (wiatr.balastKg !== null) warnings.push(balastProjektowyEqu())
  else if (kat === KAT_PIONOWY_DEG) warnings.push(pionSilaPozioma())
  else warnings.push(wybranyKatBezDanychWiatru(kat))
  if (kat >= PROG_SSANIA_OD_SPODU_DEG) warnings.push(ssanieOdSpodu(kat, PROG_SSANIA_OD_SPODU_DEG))
  if (kat < PROG_ZALEGANIA_SNIEGU_DEG) warnings.push(sniegZalegaPonizejProgu(kat, PROG_ZALEGANIA_SNIEGU_DEG))
  if (miejsce === "dach") warnings.push(dachPozaModelemWiaty())

  const assumptions: Assumption[] = [
    { kod: "ZS-ZALOZENIE-STELAZ-WIATA" },
    { kod: "TM-ZALOZENIE-ZE", params: { ze: Math.round(wiatr.zeM * 100) / 100 } },
    { kod: "ZS-ZALOZENIE-CSCD", params: { cscd: CSCD_STELAZ } },
    { kod: "ZS-ZALOZENIE-CDIR-CSEASON" },
  ]
  if (katPosredniTablicy(kat)) assumptions.push({ kod: "ZS-ZALOZENIE-KAT-POSREDNI" })
  if (wiatr.balastKg !== null) {
    assumptions.push({ kod: "ZS-ZALOZENIE-BALAST-PIONOWO", params: { g: PRZYSPIESZENIE_ZIEMSKIE_M_S2 } })
    assumptions.push({ kod: "ZS-ZALOZENIE-BALAST-EQU", params: { gammaQ: GAMMA_Q_EQU, gammaG: GAMMA_G_INF_EQU } })
  }
  assumptions.push({ kod: "ZS-ZALOZENIE-SNIEG-MU1" })
  if (kat >= PROG_SSANIA_OD_SPODU_DEG) assumptions.push({ kod: "TM-ZALOZENIE-PROG-SSANIA", params: { prog: PROG_SSANIA_OD_SPODU_DEG } })

  return wynik(
    statusZOstrzezen(warnings),
    { ...wiatr, podniesienieM, powierzchniaM2, mu1: wspolczynnikKsztaltuMu1(kat) },
    warnings,
    assumptions,
  )
}
