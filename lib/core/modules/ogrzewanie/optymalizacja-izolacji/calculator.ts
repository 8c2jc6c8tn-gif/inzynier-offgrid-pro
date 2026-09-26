import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DNI_MIESIECY, GODZIN_NA_DOBE, LAT_ANALIZY } from "./constants"
import type { OptymalizacjaIzolacjiInput } from "./input"
import { validateInput } from "./validation"
import { brakSezonuGrzewczego, gruboscNieZwracaSie, miesiaceZeSrednich } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const W_NA_KW = 1000
const CM_NA_M = 100

export type WynikWariantu = {
  nazwa: string
  gruboscCm: number
  lambdaWmK: number
  /** U after adding the layer [W/(m²·K)]. */
  uPoWM2K: number
  /** Heat saved per year [kWh]. */
  oszczednoscKwhRok: number
  kosztZl: number
  /** Cost of one saved kWh over LAT_ANALIZY years [zł/kWh]; `null` when nothing is saved. */
  kosztZaKwhZl: number | null
  /**
   * Same, for the step from the next thinner variant of the same material (or from no insulation for the
   * thinnest) — the cost of the "additional centimetres". `null` when the step saves nothing.
   */
  kosztKrancowyZaKwhZl: number | null
}

export type OptymalizacjaIzolacjiResult = {
  /** Σ max(0, θi − θm)·24·d [K·h] — the same monthly model as Ekran 1. */
  stopniogodzinyKh: number
  /** Heat lost through the element per year before insulating [kWh]. */
  strataRocznaPrzedKwh: number
  warianty: WynikWariantu[]
  /** Index of the variant with the lowest cost per saved kWh; `null` when none saves anything. */
  najtanszyIndex: number | null
}

const FORMULA =
  "U' = \\frac{1}{1/U + d/\\lambda},\\quad \\Delta Q = (U - U')\\,A \\sum_m \\max(0, \\theta_i - \\theta_m)\\,24\\,d_m,\\quad " +
  "k = \\frac{K}{10\\,\\Delta Q}"

/** Materials are compared within the same product: same name and λ. */
const kluczMaterialu = (nazwa: string, lambda: number) => `${nazwa.trim().toLowerCase()}|${lambda}`

/**
 * Moduł 6, Ekran 10 "Optymalizacja izolacji" (dawne 5.10). Source example (Sekcja C: "Wełna 20 cm: koszt 5000 zł,
 * oszczędność 300 kWh/rok ... koszt 1 zaoszczędzonej kWh to 0,20 zł") is an illustration and not self-consistent
 * (5000 zł / (300 kWh × 10 lat) = 1,67 zł/kWh) — not reproduced; the definition "koszt izolacji vs oszczędności w 10 lat"
 * is what is computed.
 */
export function calculateOptymalizacjaIzolacji(input: OptymalizacjaIzolacjiInput): CalcResult<OptymalizacjaIzolacjiResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  const { powierzchniaM2: a, uWM2K: u } = input.przegroda
  if (a !== null) inputs.powierzchniaM2 = a
  if (u !== null) inputs.uWM2K = u
  if (input.temperaturaWewnetrznaC !== null) inputs.temperaturaWewnetrznaC = input.temperaturaWewnetrznaC
  if (input.cenaCieplaZlKwh !== null) inputs.cenaCieplaZlKwh = input.cenaCieplaZlKwh
  input.warianty.forEach((w, i) => {
    if (w.lambdaWmK !== null) inputs[`wariant${i + 1}Lambda`] = w.lambdaWmK
    if (w.gruboscCm !== null) inputs[`wariant${i + 1}GruboscCm`] = w.gruboscCm
    if (w.cenaZlM2 !== null) inputs[`wariant${i + 1}CenaZlM2`] = w.cenaZlM2
  })
  const wynik = (
    status: CalcResult<OptymalizacjaIzolacjiResult | null>["status"],
    value: OptymalizacjaIzolacjiResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<OptymalizacjaIzolacjiResult | null> => ({
    value,
    unit: "zł/kWh",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const ti = input.temperaturaWewnetrznaC
  const miesiace = input.srednieTemperaturyMiesieczneC
  // An annual saving from part of the year would be silently too low — wait for all 12 months.
  const kompletneMiesiace = miesiace.length === DNI_MIESIECY.length && miesiace.every((t) => t !== null)
  const kompletneWarianty =
    input.warianty.length > 0 && input.warianty.every((w) => w.lambdaWmK !== null && w.gruboscCm !== null && w.cenaZlM2 !== null)
  if (ti === null || a === null || u === null || !kompletneMiesiace || !kompletneWarianty) return wynik("INCOMPLETE", null, [])

  const stopniogodzinyKh = miesiace.reduce<number>((s, tm, i) => s + Math.max(0, ti - tm!) * GODZIN_NA_DOBE * DNI_MIESIECY[i]!, 0)
  const cieploRoczneKwh = (uWM2K: number) => (uWM2K * a * stopniogodzinyKh) / W_NA_KW

  const podstawowe = input.warianty.map((w, i) => {
    const uPoWM2K = 1 / (1 / u + w.gruboscCm! / CM_NA_M / w.lambdaWmK!)
    return {
      nazwa: w.nazwa.trim() || `Wariant ${i + 1}`,
      gruboscCm: w.gruboscCm!,
      lambdaWmK: w.lambdaWmK!,
      uPoWM2K,
      oszczednoscKwhRok: cieploRoczneKwh(u) - cieploRoczneKwh(uPoWM2K),
      kosztZl: w.cenaZlM2! * a,
    }
  })
  const kosztKwh = (koszt: number, oszczednosc: number) => (oszczednosc > 0 ? koszt / (oszczednosc * LAT_ANALIZY) : null)

  const warianty: WynikWariantu[] = podstawowe.map((w) => {
    const ciensze = podstawowe.filter(
      (x) => kluczMaterialu(x.nazwa, x.lambdaWmK) === kluczMaterialu(w.nazwa, w.lambdaWmK) && x.gruboscCm < w.gruboscCm,
    )
    const poprzedni = ciensze.reduce<(typeof podstawowe)[number] | null>((m, x) => (m === null || x.gruboscCm > m.gruboscCm ? x : m), null)
    return {
      ...w,
      kosztZaKwhZl: kosztKwh(w.kosztZl, w.oszczednoscKwhRok),
      kosztKrancowyZaKwhZl: kosztKwh(w.kosztZl - (poprzedni?.kosztZl ?? 0), w.oszczednoscKwhRok - (poprzedni?.oszczednoscKwhRok ?? 0)),
    }
  })

  let najtanszyIndex: number | null = null
  warianty.forEach((w, i) => {
    if (w.kosztZaKwhZl !== null && (najtanszyIndex === null || w.kosztZaKwhZl < warianty[najtanszyIndex]!.kosztZaKwhZl!)) najtanszyIndex = i
  })

  const warnings: Warning[] = [miesiaceZeSrednich()]
  if (stopniogodzinyKh === 0) warnings.push(brakSezonuGrzewczego())
  const cena = input.cenaCieplaZlKwh
  if (cena !== null) {
    warianty.forEach((w) => {
      const maCienszy = warianty.some((x) => kluczMaterialu(x.nazwa, x.lambdaWmK) === kluczMaterialu(w.nazwa, w.lambdaWmK) && x.gruboscCm < w.gruboscCm)
      if (maCienszy && w.kosztKrancowyZaKwhZl !== null && w.kosztKrancowyZaKwhZl > cena) {
        warnings.push(gruboscNieZwracaSie(w.nazwa, w.gruboscCm, w.kosztKrancowyZaKwhZl, cena))
      }
    })
  }
  const assumptions: Assumption[] = [
    { kod: "IZOL-ZALOZENIE-WARSTWA-SZEREGOWA" },
    { kod: "IZOL-ZALOZENIE-10-LAT", params: { lata: LAT_ANALIZY } },
    { kod: "IZOL-ZALOZENIE-CIEPLO-NIE-PRAD" },
  ]

  return wynik(
    warnings.some((w) => w.level === "warning") ? "VALID_WITH_WARNINGS" : "VALID",
    { stopniogodzinyKh, strataRocznaPrzedKwh: cieploRoczneKwh(u), warianty, najtanszyIndex },
    warnings,
    assumptions,
  )
}
