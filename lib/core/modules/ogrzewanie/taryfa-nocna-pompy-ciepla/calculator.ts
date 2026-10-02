import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { GODZIN_NA_DOBE, KWH_NA_L_K } from "./constants"
import type { TaryfaNocnaPompyCieplaInput } from "./input"
import { validateInput } from "./validation"
import { bezBufora, brakOszczednosci, buforNiePokrywaDnia, nocZAgregatu, nocZBaterii } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "Q_{noc} = Q \\dfrac{t_n}{24},\\; Q_{dz} = Q - Q_{noc},\\; Q_{bufor} = V\\,c_w\\,\\Delta T,\\; Q_{przes} = \\min(Q_{bufor}, Q_{dz}),\\; " +
  "K = \\dfrac{Q_{dz}}{COP_{dz}}\\,c_{dz} + \\dfrac{Q_{noc}}{COP_{noc}}\\,c_{noc}"

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
  /** Electricity the pump draws in the night zone with shifting [kWh]. */
  pradNocKwh: number
  /** Average electric power of the pump over the night zone [kW] — check against the battery / generator / mains. */
  mocNocSredniaKw: number
}

const PUSTY: TaryfaNocnaPompyCieplaResult = {
  pojemnoscBuforaKwh: 0,
  przesunieteKwh: 0,
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
 * ✅🤖 Even load over the day (the source gives no hourly demand profile). The buffer's heat losses are not counted and
 * the COP is constant per zone (the source gives no model) — both flatter the saving, stated as assumptions. An
 * hour-by-hour schedule („Harmonogram pracy nocnej”) is not computed: the night window is the tariff zone entered by
 * the user, and the result gives its energy and average power.
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

  const copNoc = input.copNoc > 0 ? input.copNoc : input.copDzien
  const cieploNoc = (input.cieploDobaKwh * input.godzinyNocH) / GODZIN_NA_DOBE
  const cieploDzien = input.cieploDobaKwh - cieploNoc
  const pojemnoscBuforaKwh = input.pojemnoscBuforaL * KWH_NA_L_K * input.deltaTBuforaK
  const przesuniete = Math.min(pojemnoscBuforaKwh, cieploDzien)

  const koszt = (dzien: number, noc: number) =>
    (dzien / input.copDzien) * input.cenaDzienZlKwh + (noc / copNoc) * input.cenaNocZlKwh
  const kosztBez = koszt(cieploDzien, cieploNoc)
  const kosztZ = koszt(cieploDzien - przesuniete, cieploNoc + przesuniete)
  const oszczednosc = kosztBez - kosztZ
  const pradNoc = (cieploNoc + przesuniete) / copNoc
  const mocNoc = pradNoc / input.godzinyNocH

  const warnings: Warning[] = []
  if (pojemnoscBuforaKwh === 0) warnings.push(bezBufora())
  else if (pojemnoscBuforaKwh < cieploDzien) {
    warnings.push(buforNiePokrywaDnia(pojemnoscBuforaKwh, cieploDzien, (pojemnoscBuforaKwh / cieploDzien) * 100))
  }
  if (przesuniete > 0 && oszczednosc <= 0) warnings.push(brakOszczednosci(oszczednosc))
  if (input.zasilanieNocy === "bateria") warnings.push(nocZBaterii(pradNoc, mocNoc))
  if (input.zasilanieNocy === "agregat") warnings.push(nocZAgregatu())

  const assumptions: Assumption[] = [{ kod: "TAN-ZAL-CENY-OD-USERA" }, { kod: "TAN-ZAL-ROWNOMIERNE" }, { kod: "TAN-ZAL-BEZ-STRAT-BUFORA" }]
  if (input.copNoc === 0) assumptions.push({ kod: "TAN-ZAL-COP-NOC-ROWNY" })

  return {
    ...baza,
    value: {
      pojemnoscBuforaKwh,
      przesunieteKwh: przesuniete,
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
