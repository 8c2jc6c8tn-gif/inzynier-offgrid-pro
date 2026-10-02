import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { TEMPERATURA_PARAFINIZACJI_ZRODLO_C } from "@/lib/core/modules/ogrzewanie/koszty-ogrzewania/constants"
import { COP_GRZANIA_OPOROWEGO, GODZIN_NA_DOBE } from "./constants"
import type { NagrzewnicaPowietrzaInput } from "./input"
import { validateInput } from "./validation"
import {
  brakCenyPradu,
  godzinyPonadDobe,
  nagrzewnicaSpalinyNp,
  olejGestniejeNp,
  poborPonadBaterie,
  pradTanszy,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "c_{Q,pal} = \\dfrac{c_{pal} \\cdot \\dot V}{P},\\quad c_{Q,nagrz} = c_{Q,pal} + c_{el} \\cdot \\dfrac{P_{el}}{1000\\,P},\\quad c_{Q,el} = \\dfrac{c_{el}}{COP},\\quad c_{el}^{*} = \\dfrac{c_{Q,pal}}{1/COP - P_{el}/(1000\\,P)}"

export type DobaNagrzewnicy = {
  zapotrzebowanieKwh: number
  /** Running hours at the entered output (continuous at that setting — assumption). */
  godzinyPracy: number
  paliwoL: number
  kosztPaliwaZl: number
  /** Own electricity: running draw × hours + starts × energy of a start [Wh]. */
  energiaPomocniczaWh: number
  /** null without an electricity price. */
  kosztPraduPomocniczegoZl: number | null
  kosztNagrzewnicaZl: number | null
  /** Electricity the electric alternative would need for the same heat [kWh]. */
  energiaElektrycznaKwh: number
  kosztElektrycznieZl: number | null
  /** Shares of the usable battery; null without a capacity. */
  procentBateriiNagrzewnica: number | null
  procentBateriiElektrycznie: number | null
}

export type NagrzewnicaPowietrzaResult = {
  paliwoNaKwhCieplaL: number
  kosztPaliwaNaKwhCieplaZl: number
  /** Own electricity per 1 kWh of heat while running [kWh]. */
  pradPomocniczyNaKwhCieplaKwh: number
  /** null without an electricity price. */
  kosztPraduPomocniczegoNaKwhZl: number | null
  kosztCieplaNagrzewnicaZlKwh: number
  kosztCieplaElektrycznegoZlKwh: number | null
  taniej: "nagrzewnica" | "elektryczne" | "rowno" | null
  /** Electric minus heater per kWh of heat [PLN]; positive = heater cheaper. */
  oszczednoscNaKwhZl: number | null
  /** Electricity price above which the heater is cheaper; null when never (own draw ≥ 1/COP) or no heater cost. */
  cenaPraduRownowagiZlKwh: number | null
  doba: DobaNagrzewnicy | null
  sezon: { dni: number; paliwoL: number; kosztNagrzewnicaZl: number | null; kosztElektrycznieZl: number | null; energiaPomocniczaKwh: number } | null
}

/**
 * Air heater (Webasto type) vs electric heating — owner idea of 25.09.2026 (D28) with the 02.10.2026 decision.
 * Heat cost per kWh from the datasheet (price × l/h ÷ kW, as in `koszty-ogrzewania`), plus the heater's own
 * electricity priced at the user's electricity price; electric heating = price ÷ COP (COP = 1 for resistive).
 * The break-even price shows when the heater wins. Per day (optional heat demand): running hours at the entered
 * output, litres, the heater's draw in Wh (running + starts) and as a share of the usable battery — next to the
 * electric alternative's draw. Nothing is assumed about any device: every figure is entered by the user.
 */
export function calculateNagrzewnicaPowietrza(input: NagrzewnicaPowietrzaInput): CalcResult<NagrzewnicaPowietrzaResult | null> {
  const { ...inputs } = input
  const baza = { unit: "zł/kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  const errors = validateInput(input)
  if (errors.length > 0) return { ...baza, value: null, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const { mocCieplnaKw: p, zuzyciePaliwaLH: v, cenaPaliwaZlL: cPal, poborPraduW: pEl, cenaPraduZlKwh: cEl } = input
  if (p === 0 || v === 0 || cPal === 0) return { ...baza, value: null, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const cop = input.copElektryczne > 0 ? input.copElektryczne : COP_GRZANIA_OPOROWEGO
  const paliwoNaKwhCieplaL = v / p
  const kosztPaliwaNaKwhCieplaZl = paliwoNaKwhCieplaL * cPal
  const pradPomocniczyNaKwhCieplaKwh = pEl / 1000 / p
  const maCenePradu = cEl > 0
  const kosztPraduPomocniczegoNaKwhZl = maCenePradu ? pradPomocniczyNaKwhCieplaKwh * cEl : null
  const kosztCieplaNagrzewnicaZlKwh = kosztPaliwaNaKwhCieplaZl + (kosztPraduPomocniczegoNaKwhZl ?? 0)
  const kosztCieplaElektrycznegoZlKwh = maCenePradu ? cEl / cop : null
  const roznica = kosztCieplaElektrycznegoZlKwh === null ? null : kosztCieplaElektrycznegoZlKwh - kosztCieplaNagrzewnicaZlKwh
  const EPS = 1e-12
  const taniej = roznica === null ? null : roznica > EPS ? "nagrzewnica" : roznica < -EPS ? "elektryczne" : "rowno"
  const mianownik = 1 / cop - pradPomocniczyNaKwhCieplaKwh
  const cenaPraduRownowagiZlKwh = mianownik > 0 ? kosztPaliwaNaKwhCieplaZl / mianownik : null

  const warnings: Warning[] = [nagrzewnicaSpalinyNp(), olejGestniejeNp(TEMPERATURA_PARAFINIZACJI_ZRODLO_C)]
  if (!maCenePradu) warnings.push(brakCenyPradu())

  let doba: DobaNagrzewnicy | null = null
  let sezon: NagrzewnicaPowietrzaResult["sezon"] = null
  const q = input.zapotrzebowanieCieplaDobaKwh
  if (q > 0) {
    const godzinyPracy = q / p
    const energiaPomocniczaWh = pEl * godzinyPracy + input.rozruchyNaDobe * input.energiaRozruchuWh
    const kosztPaliwaZl = godzinyPracy * v * cPal
    const kosztPraduPomocniczegoZl = maCenePradu ? (energiaPomocniczaWh / 1000) * cEl : null
    const energiaElektrycznaKwh = q / cop
    const bateriaKwh = input.pojemnoscBateriiKwh
    doba = {
      zapotrzebowanieKwh: q,
      godzinyPracy,
      paliwoL: godzinyPracy * v,
      kosztPaliwaZl,
      energiaPomocniczaWh,
      kosztPraduPomocniczegoZl,
      kosztNagrzewnicaZl: kosztPraduPomocniczegoZl === null ? kosztPaliwaZl : kosztPaliwaZl + kosztPraduPomocniczegoZl,
      energiaElektrycznaKwh,
      kosztElektrycznieZl: maCenePradu ? energiaElektrycznaKwh * cEl : null,
      procentBateriiNagrzewnica: bateriaKwh > 0 ? (energiaPomocniczaWh / 1000 / bateriaKwh) * 100 : null,
      procentBateriiElektrycznie: bateriaKwh > 0 ? (energiaElektrycznaKwh / bateriaKwh) * 100 : null,
    }
    if (godzinyPracy > GODZIN_NA_DOBE) warnings.push(godzinyPonadDobe(godzinyPracy))
    if (bateriaKwh > 0 && energiaPomocniczaWh / 1000 > bateriaKwh) warnings.push(poborPonadBaterie(energiaPomocniczaWh, bateriaKwh))
    if (input.dniOgrzewania > 0) {
      const dni = input.dniOgrzewania
      sezon = {
        dni,
        paliwoL: doba.paliwoL * dni,
        kosztNagrzewnicaZl: doba.kosztNagrzewnicaZl === null ? null : doba.kosztNagrzewnicaZl * dni,
        kosztElektrycznieZl: doba.kosztElektrycznieZl === null ? null : doba.kosztElektrycznieZl * dni,
        energiaPomocniczaKwh: (energiaPomocniczaWh / 1000) * dni,
      }
    }
  }
  // "Electricity is cheaper" is judged on the daily totals when they exist (they include the starts).
  const prad = doba?.kosztElektrycznieZl != null && doba.kosztNagrzewnicaZl !== null ? doba.kosztElektrycznieZl < doba.kosztNagrzewnicaZl : taniej === "elektryczne"
  if (maCenePradu && prad) warnings.push(pradTanszy())

  const assumptions: Assumption[] = [
    { kod: "NP-ZALOZENIE-WPIS-Z-KARTY" },
    { kod: "NP-ZALOZENIE-PRACA-CIAGLA" },
  ]
  if (input.copElektryczne === 0) assumptions.push({ kod: "NP-ZALOZENIE-COP-OPOROWE", params: { cop: COP_GRZANIA_OPOROWEGO } })

  return {
    ...baza,
    value: {
      paliwoNaKwhCieplaL,
      kosztPaliwaNaKwhCieplaZl,
      pradPomocniczyNaKwhCieplaKwh,
      kosztPraduPomocniczegoNaKwhZl,
      kosztCieplaNagrzewnicaZlKwh,
      kosztCieplaElektrycznegoZlKwh,
      taniej,
      oszczednoscNaKwhZl: roznica,
      cenaPraduRownowagiZlKwh,
      doba,
      sezon,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
