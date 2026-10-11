import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { dobowyDeficyt } from "../deficyty-miesieczne/historia"
import { GODZIN_NA_DOBE } from "./constants"
import type { ScenariuszMrozu, SymulacjaMrozuInput } from "./input"
import { validateInput } from "./validation"
import { bezOgrzewania } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const W_NA_KW = 1000
/** A day counts as a deficit day above this shortfall [kWh] — only to ignore floating-point dust. */
const PROG_DEFICYTU_KWH = 1e-9

export type DzienSymulacji = {
  /** 1-based day of the simulated month. */
  dzien: number
  produkcjaKwh: number
  zapotrzebowanieKwh: number
  /** Energy missing after the panels and the store [kWh]; to be covered by a generator or the grid. */
  deficytKwh: number
}

export type WynikScenariusza = {
  temperaturaC: number
  /** Heat the building needs per day at this temperature [kWh]; `null` without building data. */
  cieploDobaKwh: number | null
  /** Electric energy for heating per day [kWh]: heat ÷ COP; 0 for a fuel source, `null` when the heating is not simulated. */
  pradOgrzewaniaDobaKwh: number | null
  /** COP used (`null` when there is no electric heating). */
  copUzyty: number | null
  /** Whole daily electric demand: base + heating + extra [kWh]. */
  zapotrzebowanieDobaKwh: number
  /** Usable battery capacity at this temperature [kWh]. */
  pojemnoscEfektywnaKwh: number
  dni: DzienSymulacji[]
  produkcjaMiesiacaKwh: number
  zapotrzebowanieMiesiacaKwh: number
  deficytMiesiacaKwh: number
  dniZDeficytem: number
  /** The longest run of consecutive deficit days. */
  najdluzszaSeriaDni: number
  najwiekszyDeficytDobyKwh: number
  /** 1-based day of the first deficit, `null` when there is none. */
  pierwszyDzienZDeficytem: number | null
  /** Share of the monthly demand covered without a generator [%]. */
  pokrycieEnergetycznePct: number
}

export type SymulacjaMrozuResult = {
  liczbaDni: number
  /** Heating enters the demand (building data and an electric source). */
  ogrzewanieWPopycie: boolean
  scenariusze: WynikScenariusza[]
}

const FORMULA =
  "Q_{doba} = \\max(0,\\; H_{zewn}(\\theta_i - \\theta_e) + \\Phi_{st}) \\cdot 24\\,h,\\quad E_{el} = Q / COP,\\quad " +
  "D_{doba} = E_{baz} + E_{el} + E_{dod},\\quad C_{ef} = C (1 - s/100),\\quad \\text{deficyt dnia} = \\max(0, D - P_{PV} - \\text{magazyn})"

const PUSTY: SymulacjaMrozuResult = { liczbaDni: 0, ogrzewanieWPopycie: false, scenariusze: [] }

/**
 * Moduł 7, Ekran 1 "Symulacja przy −20°C i −30°C" (dawne 6.1). A day-by-day balance of one month at a constant outdoor
 * temperature of each scenario: PV of the days, demand = base + heating (rising with the frost) + extra consumption (BMS
 * heaters, defrost), battery capacity lowered by the user's own derating. The daily store balance is the one of
 * Screen 2 (`dobowyDeficyt`) — no second balance model. Nothing is assumed: heating, COP, derating, the share of the night
 * and the PV correction are the user's numbers or are off.
 */
export function calculateSymulacjaMrozu(input: SymulacjaMrozuInput): CalcResult<SymulacjaMrozuResult> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = { liczbaDni: input.produkcjaDobowaKwh.length, korektaProdukcjiPct: input.korektaProdukcjiPct, dodatkoweZuzycieDobaKwh: input.dodatkoweZuzycieDobaKwh }
  if (input.zuzycieBazoweDobaKwh !== null) inputs.zuzycieBazoweDobaKwh = input.zuzycieBazoweDobaKwh
  if (input.cop !== null) inputs.cop = input.cop
  input.scenariusze.forEach((s, i) => {
    inputs[`scenariusz${i + 1}TemperaturaC`] = s.temperaturaC
  })
  const wynik = (status: CalcResult<SymulacjaMrozuResult>["status"], value: SymulacjaMrozuResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<SymulacjaMrozuResult> => ({
    value,
    unit: "kWh",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)
  if (input.produkcjaDobowaKwh.length === 0 || input.zuzycieBazoweDobaKwh === null || input.scenariusze.length === 0) return wynik("INCOMPLETE", PUSTY, [])

  const elektryczne = input.budynek !== null && input.zrodloCiepla !== "paliwo"
  // Electric heating needs a COP: the scenario's own or the general one — a missing COP would silently drop the heating.
  const kazdyMaCop = input.scenariusze.every((s) => (s.cop ?? input.cop) !== null)
  if (elektryczne && !kazdyMaCop) return wynik("INCOMPLETE", PUSTY, [])
  const ogrzewanieWPopycie = elektryczne
  const magazyn = input.magazyn && input.magazyn.pojemnoscUzytecznaKwh > 0 ? input.magazyn : null
  // A store without its efficiency would silently charge for free.
  if (magazyn && magazyn.sprawnoscPct === null) return wynik("INCOMPLETE", PUSTY, [])

  const scenariusz = (s: ScenariuszMrozu): WynikScenariusza => {
    const b = input.budynek
    const cieploDobaKwh = b ? (Math.max(0, b.wspolczynnikStratZewnetrznychWK * (b.temperaturaWewnetrznaC - s.temperaturaC) + b.stalyStrumienStratW) * GODZIN_NA_DOBE) / W_NA_KW : null
    const copUzyty = elektryczne ? (s.cop ?? input.cop) : null
    const pradOgrzewaniaDobaKwh = cieploDobaKwh === null ? null : elektryczne ? cieploDobaKwh / copUzyty! : 0
    const zapotrzebowanieDobaKwh = input.zuzycieBazoweDobaKwh! + (pradOgrzewaniaDobaKwh ?? 0) + input.dodatkoweZuzycieDobaKwh
    const spadek = s.spadekPojemnosciPct ?? 0
    const pojemnoscEfektywnaKwh = magazyn ? magazyn.pojemnoscUzytecznaKwh * (1 - spadek / 100) : 0
    const pv = input.produkcjaDobowaKwh.map((p) => p * (1 + input.korektaProdukcjiPct / 100))
    const deficyty = dobowyDeficyt(
      pv,
      () => zapotrzebowanieDobaKwh,
      magazyn ? { pojemnoscUzytecznaKwh: pojemnoscEfektywnaKwh, sprawnoscPct: magazyn.sprawnoscPct!, stanPoczatkowyPct: magazyn.stanPoczatkowyPct } : undefined,
      input.udzialNocyPct ?? 0,
    ) as number[]
    const dni: DzienSymulacji[] = pv.map((p, i) => ({ dzien: i + 1, produkcjaKwh: p, zapotrzebowanieKwh: zapotrzebowanieDobaKwh, deficytKwh: deficyty[i]! }))
    let seria = 0
    let najdluzsza = 0
    for (const d of dni) {
      seria = d.deficytKwh > PROG_DEFICYTU_KWH ? seria + 1 : 0
      najdluzsza = Math.max(najdluzsza, seria)
    }
    const deficytMiesiacaKwh = dni.reduce((a, d) => a + d.deficytKwh, 0)
    const zapotrzebowanieMiesiacaKwh = zapotrzebowanieDobaKwh * dni.length
    const pierwszy = dni.find((d) => d.deficytKwh > PROG_DEFICYTU_KWH)
    return {
      temperaturaC: s.temperaturaC,
      cieploDobaKwh,
      pradOgrzewaniaDobaKwh,
      copUzyty,
      zapotrzebowanieDobaKwh,
      pojemnoscEfektywnaKwh,
      dni,
      produkcjaMiesiacaKwh: pv.reduce((a, p) => a + p, 0),
      zapotrzebowanieMiesiacaKwh,
      deficytMiesiacaKwh,
      dniZDeficytem: dni.filter((d) => d.deficytKwh > PROG_DEFICYTU_KWH).length,
      najdluzszaSeriaDni: najdluzsza,
      najwiekszyDeficytDobyKwh: dni.reduce((a, d) => Math.max(a, d.deficytKwh), 0),
      pierwszyDzienZDeficytem: pierwszy ? pierwszy.dzien : null,
      pokrycieEnergetycznePct: zapotrzebowanieMiesiacaKwh > 0 ? Math.max(0, 100 * (1 - deficytMiesiacaKwh / zapotrzebowanieMiesiacaKwh)) : 100,
    }
  }

  const warnings: Warning[] = []
  if (input.budynek === null) warnings.push(bezOgrzewania("brak-budynku"))
  else if (input.zrodloCiepla === "paliwo") warnings.push(bezOgrzewania("paliwo"))

  const assumptions: Assumption[] = [
    { kod: "SYMMR-ZAL-TEMPERATURA-STALA" },
    { kod: input.udzialNocyPct === null ? "SYMMR-ZAL-DOBA-BEZ-NOCY" : "SYMMR-ZAL-DOBA-Z-NOCA", params: { noc: input.udzialNocyPct ?? 0 } },
    { kod: magazyn ? "SYMMR-ZAL-MAGAZYN" : "SYMMR-ZAL-BEZ-MAGAZYNU" },
  ]
  if (ogrzewanieWPopycie) assumptions.push({ kod: "SYMMR-ZAL-OGRZEWANIE" })
  if (ogrzewanieWPopycie && input.scenariusze.some((s) => s.cop === null)) assumptions.push({ kod: "SYMMR-ZAL-COP-STALY", params: { cop: input.cop ?? 0 } })
  if (input.scenariusze.some((s) => (s.spadekPojemnosciPct ?? 0) > 0) && magazyn) assumptions.push({ kod: "SYMMR-ZAL-SPADEK-POJEMNOSCI" })
  if (input.korektaProdukcjiPct !== 0) assumptions.push({ kod: "SYMMR-ZAL-KOREKTA-PRODUKCJI", params: { proc: input.korektaProdukcjiPct } })

  return wynik(
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    { liczbaDni: input.produkcjaDobowaKwh.length, ogrzewanieWPopycie, scenariusze: input.scenariusze.map(scenariusz) },
    warnings,
    assumptions,
  )
}
