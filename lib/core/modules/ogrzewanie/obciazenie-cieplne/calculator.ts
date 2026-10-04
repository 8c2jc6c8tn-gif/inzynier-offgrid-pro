import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { wspolczynnikStratWentylacyjnychWK } from "../infiltracja-powietrza/calculator"
import { DNI_MIESIECY, GODZIN_NA_DOBE, TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C } from "./constants"
import type { ObciazenieCieplneInput } from "./input"
import { validateInput } from "./validation"
import { bezMostkowIZyskow, miesiaceZeSrednich, temperaturaWewnetrznaNieWyzsza } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

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

export type ObciazenieCieplneResult = {
  temperaturaZewnetrznaC: number
  przegrody: StrataPrzegrody[]
  strataPrzenikanieW: number
  /** H_V = n·V·ρ·cp/3600 [W/K]. */
  hvWK: number
  strataWentylacjaW: number
  /** Φ = Φ_T + Φ_V at θe [W]. */
  obciazenieW: number
  /** Heat for one day at design temperature: Φ × 24 h [kWh]. */
  cieploDobaObliczeniowaKwh: number
  /** Electric energy for that day: heat / COP [kWh]; `null` without COP. */
  energiaElektrycznaDobaKwh: number | null
  /** `null` when no monthly temperature was entered. */
  miesiace: MiesiacCiepla[] | null
  cieploSumaMiesiecyKwh: number | null
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
    if (p.uWM2K !== null) inputs[`przegroda${i + 1}U`] = p.uWM2K
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
    (p) => p.powierzchniaM2 !== null && p.uWM2K !== null && (p.zewnetrzna || p.temperaturaPoDrugiejStronieC !== null),
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
    const htWK = p.uWM2K! * p.powierzchniaM2!
    const tDruga = p.zewnetrzna ? te : p.temperaturaPoDrugiejStronieC!
    return { nazwa: p.nazwa || `Przegroda ${i + 1}`, htWK, tDruga, zewnetrzna: p.zewnetrzna, strataW: htWK * (ti - tDruga) }
  })
  const strataPrzenikanieW = surowe.reduce((a, p) => a + p.strataW, 0)
  const hvWK = wspolczynnikStratWentylacyjnychWK(wymianyPowietrzaNaH, kubaturaM3)
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

  const warnings: Warning[] = [bezMostkowIZyskow()]
  if (miesiace.length > 0) warnings.push(miesiaceZeSrednich())

  const assumptions: Assumption[] = [
    { kod: "OC-ZALOZENIE-TEMP-STREFY", params: { strefa: strefaKlimatyczna, te } },
    { kod: "STALE-FIZYCZNE-POWIETRZA-INFILTRACJA" },
    { kod: "OC-ZALOZENIE-DOBA-PRZY-TE" },
  ]
  if (surowe.some((p) => !p.zewnetrzna)) assumptions.push({ kod: "OC-ZALOZENIE-STALA-TEMP-PRZYLEGLYCH" })
  if (cop !== null) assumptions.push({ kod: "OC-ZALOZENIE-COP", params: { cop } })

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
      strataWentylacjaW,
      obciazenieW,
      cieploDobaObliczeniowaKwh,
      energiaElektrycznaDobaKwh: cop === null ? null : cieploDobaObliczeniowaKwh / cop,
      miesiace: miesiace.length > 0 ? miesiace : null,
      cieploSumaMiesiecyKwh: miesiace.length > 0 ? miesiace.reduce((a, m) => a + m.cieploKwh, 0) : null,
    },
    warnings,
    assumptions,
  )
}
