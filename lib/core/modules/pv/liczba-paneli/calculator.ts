import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { LICZBA_MIESIECY } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"
import { obliczProdukcjeKwh } from "../kat-i-azymut/calculator"
import { KAT_KROK_DEG } from "../kat-i-azymut/constants"
import { DNI_W_MIESIACU, type IdOkresu, OKRESY, WH_NA_KWH } from "./constants"
import type { LiczbaPaneliInput } from "./input"
import { validateInput } from "./validation"
import { deficytPozaOkresem, limitZaMalyNawetLato, okresBezProdukcji } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type WariantOkresu = {
  id: IdOkresu
  /** Liczba paneli pokrywająca każdy miesiąc okresu; `null` = któryś miesiąc bez produkcji. */
  liczbaPaneli: number | null
  /** Miesiąc, który wymusza tę liczbę (0 = styczeń). */
  miesiacDecydujacy: number | null
  mocKwp: number | null
  powierzchniaM2: number | null
  miesciSieWLimicie: boolean | null
}

export type LiczbaPaneliResult = {
  zapotrzebowanieMiesieczneKwh: number[]
  produkcjaPaneluMiesiecznaKwh: number[]
  /** Kąt użyty w każdym miesiącu [°] (stały albo optimum miesiąca). */
  katMiesiacaDeg: number[]
  warianty: WariantOkresu[]
  /** D25: najszerszy okres mieszczący się w limicie; `null` = bez limitu albo nawet lato się nie mieści. */
  rekomendacja: IdOkresu | null
  /** Deficyt [kWh] w każdym miesiącu przy liczbie paneli rekomendacji (albo limitu, gdy nic się nie mieści). */
  deficytMiesiecznyKwh: number[] | null
  liczbaPaneliDeficytu: number | null
}

const FORMULA =
  "E_{p,m} = \\frac{P_{Wp}}{1000} \\cdot \\frac{H_m}{1\\,\\text{kW/m}^2} \\cdot PR,\\quad " +
  "N_{okres} = \\left\\lceil \\max_{m \\in okres} \\frac{d_m (E_{dob} + E_{zima,m})}{E_{p,m}} \\right\\rceil"

/** Tolerancja zaokrąglenia w górę — iloraz 12,0000000001 z arytmetyki zmiennoprzecinkowej to 12, nie 13. */
const EPS = 1e-9

export function calculateLiczbaPaneli(input: LiczbaPaneliInput): CalcResult<LiczbaPaneliResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const wynik = (
    status: CalcResult<LiczbaPaneliResult | null>["status"],
    value: LiczbaPaneliResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<LiczbaPaneliResult | null> => ({
    value,
    unit: "szt.",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { tabela, mocPaneluWp: wp, wspolczynnikPr: pr, zapotrzebowanieDoboweKwh: dob } = input
  if (
    tabela === null ||
    tabela.katyDeg.length === 0 ||
    wp === null ||
    pr === null ||
    dob === null ||
    input.dodatkoweZimaKwhDzien === null ||
    (!input.stelazRegulowany && input.nachylenieDeg === null)
  ) {
    return wynik("INCOMPLETE", null, [])
  }

  const extra = input.dodatkoweZimaKwhDzien
  const grzewcze = new Set(input.miesiaceGrzewcze)
  const iStaly = input.nachylenieDeg === null ? 0 : Math.round((input.nachylenieDeg - tabela.katyDeg[0]!) / KAT_KROK_DEG)
  const katMiesiacaDeg: number[] = []
  const hMies: number[] = []
  for (let m = 0; m < LICZBA_MIESIECY; m++) {
    let i = iStaly
    if (input.stelazRegulowany) tabela.miesiace.forEach((w, j) => { if (w[m]! > tabela.miesiace[i]![m]!) i = j })
    katMiesiacaDeg.push(tabela.katyDeg[i]!)
    hMies.push(tabela.miesiace[i]![m]!)
  }
  const produkcja = hMies.map((h) => obliczProdukcjeKwh(h, wp / WH_NA_KWH, pr))
  const zapotrzebowanie = DNI_W_MIESIACU.map((d, m) => d * (dob + (grzewcze.has(m) ? extra : 0)))

  const warnings: Warning[] = []
  const limit = input.limitMontazowy
  const warianty: WariantOkresu[] = OKRESY.map((o) => {
    if (o.miesiace.some((m) => produkcja[m]! <= 0)) {
      warnings.push(okresBezProdukcji(o.id, o.miesiace[0]! + 1, o.miesiace.at(-1)! + 1))
      return { id: o.id, liczbaPaneli: null, miesiacDecydujacy: null, mocKwp: null, powierzchniaM2: null, miesciSieWLimicie: null }
    }
    let decydujacy = o.miesiace[0]!
    for (const m of o.miesiace) {
      if (zapotrzebowanie[m]! / produkcja[m]! > zapotrzebowanie[decydujacy]! / produkcja[decydujacy]!) decydujacy = m
    }
    const n = Math.ceil(zapotrzebowanie[decydujacy]! / produkcja[decydujacy]! - EPS)
    return {
      id: o.id,
      liczbaPaneli: n,
      miesiacDecydujacy: decydujacy,
      mocKwp: (n * wp) / WH_NA_KWH,
      powierzchniaM2: input.powierzchniaPaneluM2 === null ? null : n * input.powierzchniaPaneluM2,
      miesciSieWLimicie: limit === null ? null : n <= limit,
    }
  })

  let rekomendacja: IdOkresu | null = null
  if (limit !== null) for (const w of warianty) if (w.miesciSieWLimicie) rekomendacja = w.id
  const lato = warianty[0]!
  if (limit !== null && lato.liczbaPaneli !== null && lato.liczbaPaneli > limit) warnings.push(limitZaMalyNawetLato(limit, lato.liczbaPaneli))

  // Deficyt: przy rekomendacji; gdy nic się nie mieści — przy pełnym limicie (tyle i tak zmieścisz).
  const nDeficytu = limit === null ? null : (rekomendacja ? warianty.find((w) => w.id === rekomendacja)!.liczbaPaneli : limit)
  const deficytMiesiecznyKwh = nDeficytu === null ? null : zapotrzebowanie.map((z, m) => Math.max(0, z - nDeficytu * produkcja[m]!))
  const sumaDeficytu = deficytMiesiecznyKwh?.reduce((a, b) => a + b, 0) ?? 0
  if (nDeficytu !== null && sumaDeficytu > 0) warnings.push(deficytPozaOkresem(sumaDeficytu, nDeficytu))

  const assumptions: Assumption[] = [
    { kod: "KAT-ZALOZENIE-TABELA-PVGIS", params: { azymut: tabela.azymutDeg, albedo: tabela.albedo } },
    { kod: "KAT-ZALOZENIE-PR-UZYTKOWNIKA", params: { pr } },
    { kod: "LP-ZALOZENIE-DNI-KALENDARZ" },
    { kod: input.stelazRegulowany ? "LP-ZALOZENIE-STELAZ-REGULOWANY" : "LP-ZALOZENIE-KAT-STALY", params: { kat: tabela.katyDeg[iStaly]! } },
  ]
  if (limit !== null) assumptions.push({ kod: "LP-ZALOZENIE-LIMIT", params: { limit } })

  const maOstrzezenia = warnings.some((w) => w.level !== "info")
  return wynik(
    maOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    {
      zapotrzebowanieMiesieczneKwh: zapotrzebowanie,
      produkcjaPaneluMiesiecznaKwh: produkcja,
      katMiesiacaDeg,
      warianty,
      rekomendacja,
      deficytMiesiecznyKwh,
      liczbaPaneliDeficytu: nDeficytu,
    },
    warnings,
    assumptions,
  )
}
