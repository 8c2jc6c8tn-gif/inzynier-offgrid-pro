import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { GODZIN_NA_DOBE, KWH_NA_L_K } from "./constants"
import type { TaryfaNocnaPompyCieplaInput } from "./input"
import { validateInput } from "./validation"
import { bezBufora, brakOszczednosci, buforNiePokrywaDnia, copNocNiePodany, nocZAgregatu, nocZBaterii } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

const FORMULA =
  "Q_{noc} = Q\\,u_{noc},\\; u_{noc} = \\dfrac{t_n}{24}\\ \\vee\\ \\dfrac{\\sum_{h \\in noc} w_h}{\\sum_h w_h},\\; Q_{dz} = Q - Q_{noc},\\; Q_{bufor} = V\\,c_w\\,\\Delta T,\\; " +
  "Q_{przes} = \\min(Q_{bufor}, Q_{dz}),\\; K = \\dfrac{Q_{dz}}{COP_{dz}}\\,c_{dz} + \\dfrac{Q_{noc} + S}{COP_{noc}}\\,c_{noc}"

export type TaryfaNocnaPompyCieplaResult = {
  /** Heat the buffer can take over from the day zone [kWh thermal]. */
  pojemnoscBuforaKwh: number
  /** Heat actually moved from the day zone to the night zone per day [kWh thermal]. */
  przesunieteKwh: number
  /** Daily electricity cost without shifting (heat spread evenly over the day) [zł]. */
  kosztBezPrzesuniecaZl: number
  /** Daily electricity cost with the buffer charged at night [zł]. */
  kosztZPrzesunieciemZl: number
  /** Saving per day [zł] (negative = shifting costs more). */
  oszczednoscDobaZl: number
  /** Saving as a share of the cost without shifting [%]. */
  oszczednoscPct: number
  /** Share of the daily heat that falls in the night zone without shifting [%] (t_n/24, or from the hourly profile). */
  udzialNocyPct: number
  /** Buffer losses counted in the shifted variant [kWh thermal/day] (0 when nothing is shifted or not entered). */
  stratyBuforaKwh: number
  /** Electricity the pump draws in the night zone with shifting [kWh]. */
  pradNocKwh: number
  /** Average electric power of the pump over the night zone [kW] — check against the battery / generator / mains. */
  mocNocSredniaKw: number
}

const PUSTY: TaryfaNocnaPompyCieplaResult = {
  pojemnoscBuforaKwh: 0,
  przesunieteKwh: 0,
  udzialNocyPct: 0,
  stratyBuforaKwh: 0,
  kosztBezPrzesuniecaZl: 0,
  kosztZPrzesunieciemZl: 0,
  oszczednoscDobaZl: 0,
  oszczednoscPct: 0,
  pradNocKwh: 0,
  mocNocSredniaKw: 0,
}

/**
 * Moduł 6, Część 2C — pompa ciepła w taryfie nocnej (dawne 5.59, Biblia §6.27.33). The source logic: plan the pump to
 * run at night when energy is cheaper (grid tariff) or available (generator), let the night run charge the buffer, give
 * the heat away in the day, compute the saving, warn that night work from the off-grid battery is not the same as from
 * the grid. The model is the smallest one that holds those sentences: the daily heat Q spread evenly over 24 h, the
 * night zone of `godzinyNocH` hours, the buffer moves up to `V·c_w·ΔT` of the day-zone heat to the night zone, and the
 * cost is `Q/COP · price` per zone. Prices, zone length and COP are the user's (the tariff, the datasheet).
 *
 * Owner decisions 04.10.2026 (lista-do-zrobienia, entry 02.10 „taryfa nocna 5.59”): (1) without a profile the load is
 * even over the day (the source gives no hourly demand profile); with the user's own 24-hour profile and the cheap-zone
 * hours, the night share is the profile's share in those hours. (2) Buffer losses: the user's own kWh/day, added to the
 * night-zone heat in the shifted variant only (without shifting the buffer is not kept charged); 0 = not counted, stated
 * as an assumption. (3) Night COP empty = day COP, with an ℹ️ that the saving is then too high. COP is constant per
 * zone (the source gives no model). An hour-by-hour run schedule („Harmonogram pracy nocnej”) is not computed: the
 * result gives the night-zone energy and average power.
 *
 * Source example (Dyrektywa #5): „obniży koszt ogrzewania o 30%” is an illustration of the message, not a threshold —
 * the saving here follows from the entered prices and COP only. M14 rates (`lib/core/dane/rozliczenia-pl-2026`) hold
 * OSD network-fee components per zone, not the user's total energy price and no zone hours — not used here.
 */
export function calculateTaryfaNocnaPompyCiepla(input: TaryfaNocnaPompyCieplaInput): CalcResult<TaryfaNocnaPompyCieplaResult> {
  const errors = validateInput(input)
  const inputs = {
    cieploDobaKwh: input.cieploDobaKwh,
    godzinyNocH: input.godzinyNocH,
    cenaDzienZlKwh: input.cenaDzienZlKwh,
    cenaNocZlKwh: input.cenaNocZlKwh,
    copDzien: input.copDzien,
    copNoc: input.copNoc,
    pojemnoscBuforaL: input.pojemnoscBuforaL,
    deltaTBuforaK: input.deltaTBuforaK,
    stratyBuforaKwhDoba: input.stratyBuforaKwhDoba,
    profilGodzinowyLiczbaGodzin: input.profilGodzinowy.length,
  }
  const baza = { unit: "zł/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    input.cieploDobaKwh === 0 ||
    input.godzinyNocH === 0 ||
    input.cenaDzienZlKwh === 0 ||
    input.cenaNocZlKwh === 0 ||
    input.copDzien === 0
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zProfilem = input.profilGodzinowy.length > 0
  const copNoc = input.copNoc > 0 ? input.copNoc : input.copDzien
  const udzialNocy = zProfilem ? udzialStrefyWProfilu(input.profilGodzinowy, input.godzinyStrefyNocnej) : input.godzinyNocH / GODZIN_NA_DOBE
  const cieploNoc = input.cieploDobaKwh * udzialNocy
  const cieploDzien = input.cieploDobaKwh - cieploNoc
  const pojemnoscBuforaKwh = input.pojemnoscBuforaL * KWH_NA_L_K * input.deltaTBuforaK
  const przesuniete = Math.min(pojemnoscBuforaKwh, cieploDzien)
  const straty = przesuniete > 0 ? input.stratyBuforaKwhDoba : 0

  const koszt = (dzien: number, noc: number) =>
    (dzien / input.copDzien) * input.cenaDzienZlKwh + (noc / copNoc) * input.cenaNocZlKwh
  const kosztBez = koszt(cieploDzien, cieploNoc)
  const kosztZ = koszt(cieploDzien - przesuniete, cieploNoc + przesuniete + straty)
  const oszczednosc = kosztBez - kosztZ
  const pradNoc = (cieploNoc + przesuniete + straty) / copNoc
  const mocNoc = pradNoc / input.godzinyNocH

  const warnings: Warning[] = []
  if (pojemnoscBuforaKwh === 0) warnings.push(bezBufora())
  else if (pojemnoscBuforaKwh < cieploDzien) {
    warnings.push(buforNiePokrywaDnia(pojemnoscBuforaKwh, cieploDzien, (pojemnoscBuforaKwh / cieploDzien) * 100))
  }
  if (przesuniete > 0 && oszczednosc <= 0) warnings.push(brakOszczednosci(oszczednosc))
  if (input.zasilanieNocy === "bateria") warnings.push(nocZBaterii(pradNoc, mocNoc))
  if (input.zasilanieNocy === "agregat") warnings.push(nocZAgregatu())
  if (input.copNoc === 0) warnings.push(copNocNiePodany())

  const assumptions: Assumption[] = [
    { kod: "TAN-ZAL-CENY-OD-USERA" },
    { kod: zProfilem ? "TAN-ZAL-PROFIL-USERA" : "TAN-ZAL-ROWNOMIERNE" },
    { kod: input.stratyBuforaKwhDoba > 0 ? "TAN-ZAL-STRATY-BUFORA" : "TAN-ZAL-BEZ-STRAT-BUFORA" },
  ]
  if (input.copNoc === 0) assumptions.push({ kod: "TAN-ZAL-COP-NOC-ROWNY" })

  return {
    ...baza,
    value: {
      pojemnoscBuforaKwh,
      przesunieteKwh: przesuniete,
      udzialNocyPct: udzialNocy * 100,
      stratyBuforaKwh: straty,
      kosztBezPrzesuniecaZl: kosztBez,
      kosztZPrzesunieciemZl: kosztZ,
      oszczednoscDobaZl: oszczednosc,
      oszczednoscPct: kosztBez > 0 ? (oszczednosc / kosztBez) * 100 : 0,
      pradNocKwh: pradNoc,
      mocNocSredniaKw: mocNoc,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}

/** Share of the profile's total weight that falls in the given hours (validated: 24 weights, sum > 0, unique hours). */
export function udzialStrefyWProfilu(profil: number[], godzinyStrefy: number[]): number {
  const suma = profil.reduce((a, b) => a + b, 0)
  return godzinyStrefy.reduce((a, h) => a + (profil[h] ?? 0), 0) / suma
}
