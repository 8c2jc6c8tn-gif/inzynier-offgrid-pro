import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { wspolczynnikStratWentylacyjnychWK } from "../infiltracja-powietrza/calculator"
import { DNI_MIESIECY, GODZIN_NA_DOBE, TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C } from "./constants"
import type { ObciazenieCieplneInput } from "./input"
import { uZWarstw } from "./u-z-warstw"
import { validateInput } from "./validation"
import { bezMostkowIZyskow, miesiaceZeSrednich, temperaturaWewnetrznaNieWyzsza } from "./warnings"

export const CALCULATOR_VERSION = "1.3.0"

/** U of a partition: the entered value, otherwise from layers (needs a flow direction); `null` = not known yet. */
export function uPrzegrody(p: ObciazenieCieplneInput["przegrody"][number]): { u: number | null; zWarstw: boolean } {
  if (p.uWM2K !== null) return { u: p.uWM2K, zWarstw: false }
  if (p.warstwy && p.warstwy.length > 0 && p.kierunekStrumienia) return { u: uZWarstw(p.warstwy, p.kierunekStrumienia)?.uWM2K ?? null, zWarstw: true }
  return { u: null, zWarstw: false }
}

export type StrataPrzegrody = {
  nazwa: string
  /** U·A [W/K]. */
  htWK: number
  /** Temperature on the cold side used at design conditions [°C]. */
  temperaturaPoDrugiejStronieC: number
  strataW: number
  udzialPct: number
}

export type MiesiacCiepla = {
  /** 1–12. */
  miesiac: number
  temperaturaSredniaC: number
  cieploKwh: number
  energiaElektrycznaKwh: number | null
}

/** How long a fuel stock lasts against the computed heat demand (user's own calorific value, efficiency and stock). */
export type ZapasPaliwa = {
  jednostka: string
  /** Usable heat in the stock: zapas · WO · η [kWh]. */
  zapasCieplaKwh: number
  /** Fuel burnt on the design day [units/day]. */
  zuzycieDobaObliczeniowaJedn: number
  /** Days the stock lasts when every day is like the design day (θe of the climate zone) — the cautious lower bound. */
  dniPrzyTemperaturzeObliczeniowej: number
  /** Fuel for the whole year from the monthly heat [units]; `null` without monthly temperatures. */
  zuzycieRokJedn: number | null
  /** Share of the yearly heat the stock covers [%], at most 100; `null` without monthly temperatures. */
  pokrycieRokuPct: number | null
  /** Fuel missing for the year [units], 0 when the stock is enough; `null` without monthly temperatures. */
  brakJedn: number | null
}

export type ObciazenieCieplneResult = {
  temperaturaZewnetrznaC: number
  przegrody: StrataPrzegrody[]
  strataPrzenikanieW: number
  /** H_V = n·V·ρ·cp/3600 [W/K], after the heat recovery when one is entered. */
  hvWK: number
  /** Heat recovery of the ventilation taken into H_V [%]; 0 = none. */
  odzyskWentylacjiPct: number
  strataWentylacjaW: number
  /** Σ U·A of partitions against outdoor air + H_V [W/K]: the heat loss per kelvin of indoor–outdoor difference (for M7 Screen 1). */
  hZewnetrznyWK: number
  /** Heat flow through partitions to spaces of a fixed temperature (ground, attic) at θi [W]; negative = gain. */
  strataStalaW: number
  /** Φ = Φ_T + Φ_V at θe [W]. */
  obciazenieW: number
  /** Heat for one day at design temperature: Φ × 24 h [kWh]. */
  cieploDobaObliczeniowaKwh: number
  /** Electric energy for that day: heat / COP [kWh]; `null` without COP. */
  energiaElektrycznaDobaKwh: number | null
  /** `null` when no monthly temperature was entered. */
  miesiace: MiesiacCiepla[] | null
  cieploSumaMiesiecyKwh: number | null
  /** `null` when no fuel source was entered or its numbers are not complete. */
  paliwo: ZapasPaliwa | null
}

const FORMULA =
  "\\Phi = \\sum_i U_i A_i (\\theta_i - \\theta_{e,i}) + \\frac{n V \\rho c_p}{3600} (\\theta_i - \\theta_e),\\quad " +
  "Q_{doba} = \\Phi \\cdot 24\\,h,\\quad E_{el} = Q / COP,\\quad " +
  "Q_m = \\left[ \\sum_{zewn} U A + H_V \\right] \\max(0, \\theta_i - \\theta_m) \\cdot 24 d_m + \\sum_{inne} U A (\\theta_i - \\theta_{j}) \\cdot 24 d_m\\;\\text{(gdy } \\theta_m < \\theta_i)"

const W_NA_KW = 1000

/**
 * Moduł 6, Ekran 1 "Charakterystyka termiczna budynku" (dawne 5.1). Heat loss by transmission and
 * ventilation at the design outdoor temperature of the climate zone, per partition, plus optional
 * monthly heat from monthly mean temperatures (the source asks "dla każdego miesiąca osobno").
 *
 * Source example (Sekcja C): "8 kW przy −20°C → 192 kWh/dobę, pompa ciepła (COP=3) → 60 kWh".
 * 8 kW × 24 h = 192 kWh reproduces exactly; 192 / 3 = 64 kWh, not 60 — rounding or an error in the
 * source example (Directive #5), the formula is implemented as is, tests use 64.
 */
export function calculateObciazenieCieplne(input: ObciazenieCieplneInput): CalcResult<ObciazenieCieplneResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  input.przegrody.forEach((p, i) => {
    if (p.powierzchniaM2 !== null) inputs[`przegroda${i + 1}PowierzchniaM2`] = p.powierzchniaM2
    const u = uPrzegrody(p).u
    if (u !== null) inputs[`przegroda${i + 1}U`] = u
  })
  const wynik = (
    status: CalcResult<ObciazenieCieplneResult | null>["status"],
    value: ObciazenieCieplneResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<ObciazenieCieplneResult | null> => ({
    value,
    unit: "W",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-OBCIAZENIE-CIEPLNE",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { temperaturaWewnetrznaC: ti, strefaKlimatyczna, kubaturaM3, wymianyPowietrzaNaH, cop } = input
  // A missing partition would silently lower the load — the whole result waits for complete data.
  const przegrodyKompletne = input.przegrody.every(
    (p) => p.powierzchniaM2 !== null && uPrzegrody(p).u !== null && (p.zewnetrzna || p.temperaturaPoDrugiejStronieC !== null),
  )
  if (
    ti === null ||
    strefaKlimatyczna === null ||
    kubaturaM3 === null ||
    wymianyPowietrzaNaH === null ||
    input.przegrody.length === 0 ||
    !przegrodyKompletne
  ) {
    return wynik("INCOMPLETE", null, [])
  }

  const te = TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C[strefaKlimatyczna]
  if (ti <= te) return wynik("INVALID_INPUT", null, [temperaturaWewnetrznaNieWyzsza(ti, te)])

  const surowe = input.przegrody.map((p, i) => {
    const htWK = uPrzegrody(p).u! * p.powierzchniaM2!
    const tDruga = p.zewnetrzna ? te : p.temperaturaPoDrugiejStronieC!
    return { nazwa: p.nazwa || `Przegroda ${i + 1}`, htWK, tDruga, zewnetrzna: p.zewnetrzna, strataW: htWK * (ti - tDruga) }
  })
  const strataPrzenikanieW = surowe.reduce((a, p) => a + p.strataW, 0)
  const odzyskPct = input.sprawnoscOdzyskuPct ?? 0
  const hvWK = wspolczynnikStratWentylacyjnychWK(wymianyPowietrzaNaH, kubaturaM3) * (1 - odzyskPct / 100)
  const strataWentylacjaW = hvWK * (ti - te)
  const obciazenieW = strataPrzenikanieW + strataWentylacjaW
  const cieploDobaObliczeniowaKwh = (obciazenieW * GODZIN_NA_DOBE) / W_NA_KW

  const hZewnWK = surowe.filter((p) => p.zewnetrzna).reduce((a, p) => a + p.htWK, 0) + hvWK
  // Warmer neighbouring space gives heat (negative loss) — same sign convention as at design conditions.
  const strataInnychW = surowe.filter((p) => !p.zewnetrzna).reduce((a, p) => a + p.htWK * (ti - p.tDruga), 0)
  const miesiace: MiesiacCiepla[] = []
  input.srednieTemperaturyMiesieczneC.forEach((tm, i) => {
    if (tm === null || i >= DNI_MIESIECY.length) return
    // No heating in a month whose mean is at or above θi — partitions to fixed-temperature spaces too.
    const mocW = tm < ti ? Math.max(0, hZewnWK * (ti - tm) + strataInnychW) : 0
    const cieploKwh = (mocW * GODZIN_NA_DOBE * DNI_MIESIECY[i]!) / W_NA_KW
    miesiace.push({ miesiac: i + 1, temperaturaSredniaC: tm, cieploKwh, energiaElektrycznaKwh: cop === null ? null : cieploKwh / cop })
  })

  const cieploSumaMiesiecyKwh = miesiace.length > 0 ? miesiace.reduce((a, m) => a + m.cieploKwh, 0) : null
  const pal = input.paliwo
  let paliwo: ZapasPaliwa | null = null
  if (pal && pal.wartoscOpalowaKwh !== null && pal.sprawnoscPct !== null && pal.zapas !== null) {
    const cieploNaJednostke = pal.wartoscOpalowaKwh * (pal.sprawnoscPct / 100)
    const zapasCieplaKwh = pal.zapas * cieploNaJednostke
    const zuzycieRokJedn = cieploSumaMiesiecyKwh === null ? null : cieploSumaMiesiecyKwh / cieploNaJednostke
    paliwo = {
      jednostka: pal.jednostka,
      zapasCieplaKwh,
      zuzycieDobaObliczeniowaJedn: cieploDobaObliczeniowaKwh / cieploNaJednostke,
      dniPrzyTemperaturzeObliczeniowej: zapasCieplaKwh / cieploDobaObliczeniowaKwh,
      zuzycieRokJedn,
      pokrycieRokuPct: cieploSumaMiesiecyKwh === null || cieploSumaMiesiecyKwh === 0 ? null : Math.min(100, (100 * zapasCieplaKwh) / cieploSumaMiesiecyKwh),
      brakJedn: zuzycieRokJedn === null ? null : Math.max(0, zuzycieRokJedn - pal.zapas),
    }
  }

  const warnings: Warning[] = [bezMostkowIZyskow()]
  if (miesiace.length > 0) warnings.push(miesiaceZeSrednich())

  const assumptions: Assumption[] = [
    { kod: "OC-ZALOZENIE-TEMP-STREFY", params: { strefa: strefaKlimatyczna, te } },
    { kod: "STALE-FIZYCZNE-POWIETRZA-INFILTRACJA" },
    { kod: "OC-ZALOZENIE-DOBA-PRZY-TE" },
  ]
  if (surowe.some((p) => !p.zewnetrzna)) assumptions.push({ kod: "OC-ZALOZENIE-STALA-TEMP-PRZYLEGLYCH" })
  if (input.przegrody.some((p) => uPrzegrody(p).zWarstw)) assumptions.push({ kod: "OC-ZALOZENIE-U-Z-WARSTW" })
  if (cop !== null) assumptions.push({ kod: "OC-ZALOZENIE-COP", params: { cop } })
  if (odzyskPct > 0) assumptions.push({ kod: "OC-ZALOZENIE-ODZYSK-WENTYLACJI", params: { eta: odzyskPct } })
  if (paliwo) assumptions.push({ kod: "OC-ZALOZENIE-PALIWO-ZAPAS", params: { wo: pal!.wartoscOpalowaKwh!, eta: pal!.sprawnoscPct! } })

  return wynik(
    "VALID_WITH_WARNINGS",
    {
      temperaturaZewnetrznaC: te,
      przegrody: surowe.map((p) => ({
        nazwa: p.nazwa,
        htWK: p.htWK,
        temperaturaPoDrugiejStronieC: p.tDruga,
        strataW: p.strataW,
        udzialPct: obciazenieW > 0 ? (100 * p.strataW) / obciazenieW : 0,
      })),
      strataPrzenikanieW,
      hvWK,
      odzyskWentylacjiPct: odzyskPct,
      strataWentylacjaW,
      hZewnetrznyWK: hZewnWK,
      strataStalaW: strataInnychW,
      obciazenieW,
      cieploDobaObliczeniowaKwh,
      energiaElektrycznaDobaKwh: cop === null ? null : cieploDobaObliczeniowaKwh / cop,
      miesiace: miesiace.length > 0 ? miesiace : null,
      cieploSumaMiesiecyKwh,
      paliwo,
    },
    warnings,
    assumptions,
  )
}
