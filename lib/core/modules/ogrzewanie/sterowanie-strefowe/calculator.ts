import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { StrefaGrzewcza, SterowanieStrefoweInput } from "./input"
import { validateInput } from "./validation"
import { bezCop, silownikiZjadajaZysk, stanUstalony } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "Q_{bez} = \\sum H (\\theta_k - \\theta_e) \\cdot 24, \\quad Q_{strefy} = \\sum H [(\\theta_k - \\theta_e)(24 - h) + (\\theta_o - \\theta_e) h], \\quad E_{ster} = n P_s h_s + P_{ster} \\cdot 24"

export type SterowanieStrefoweResult = {
  /** Ciepło bez sterowania strefowego — wszystkie strefy w komforcie całą dobę [kWh/doba]. */
  cieploBezStrefKwh: number
  /** Ciepło ze sterowaniem strefowym [kWh/doba]. */
  cieploZeStrefamiKwh: number
  oszczednoscCieplaKwh: number
  /** Oszczędność ciepła [%]. */
  oszczednoscPct: number
  /** Prąd siłowników i sterowników [kWh/doba]. */
  pradSterowaniaKwh: number
  /** Oszczędność prądu ogrzewania = ciepło ÷ COP [kWh/doba]; null = ogrzewanie nieelektryczne. */
  oszczednoscPraduKwh: number | null
  /** Bilans prądu: oszczędność − sterowanie [kWh/doba]; null = ogrzewanie nieelektryczne. */
  bilansPraduKwh: number | null
}

const PUSTY: SterowanieStrefoweResult = {
  cieploBezStrefKwh: 0,
  cieploZeStrefamiKwh: 0,
  oszczednoscCieplaKwh: 0,
  oszczednoscPct: 0,
  pradSterowaniaKwh: 0,
  oszczednoscPraduKwh: null,
  bilansPraduKwh: null,
}

const r2 = (x: number) => Math.round(x * 100) / 100

const strefaKompletna = (s: StrefaGrzewcza) => s.hWK > 0 && s.tKomfortC !== null && (s.godzinObnizenia === 0 || s.tObnizonaC !== null)

/**
 * Ekran 16, Moduł 6 — "Sterowanie strefowe" (dawne 5.16, Biblia §6.16). Źródło daje dwie rzeczy liczbowe:
 * zysk „grzania tylko tam, gdzie potrzeba” i pobór siłowników/sterowników (1–5 W każdy, dolicza się do
 * bilansu), plus 🟡 „zbilansuj zyski i koszt zasilania siłowników”. Wzoru na zysk źródło nie podaje
 * („18%” to przykład), więc ekran liczy go tą samą fizyką co Ekran 1: Q = H·ΔT·t per strefa, z obniżoną
 * temperaturą przez wpisane godziny. To stan ustalony — górne oszacowanie (masa budynku i ponowne
 * nagrzanie zmniejszają zysk, ciepło płynie też między strefami) — stała ℹ️ ✅🤖. H strefy, temperatury,
 * pobory i COP wpisuje użytkownik (Dyrektywa #1). 🟡 ze źródła, gdy prąd sterowania ≥ zaoszczędzony
 * prąd ogrzewania (próg = sam bilans, nie wymyślona liczba). Przykład „18%” odtworzony w teście dla
 * dobranych danych (H = 100 W/K, 20 → 14 °C przez 14,4 h przy 0 °C) — ilustracja, nie reguła.
 */
export function calculateSterowanieStrefowe(input: SterowanieStrefoweInput): CalcResult<SterowanieStrefoweResult> {
  const { errors } = validateInput(input)
  const inputs = {
    liczbaStref: input.strefy.length,
    tZewnC: input.tZewnC ?? Number.NaN,
    liczbaSilownikow: input.liczbaSilownikow,
    mocSilownikaW: input.mocSilownikaW,
    godzinPracySilownikow: input.godzinPracySilownikow,
    mocSterownikowW: input.mocSterownikowW,
    copOgrzewania: input.copOgrzewania,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.tZewnC === null || input.strefy.length === 0 || !input.strefy.every(strefaKompletna)) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const tE = input.tZewnC
  let bezWh = 0
  let zeWh = 0
  for (const s of input.strefy) {
    const dtKomfort = Math.max(0, (s.tKomfortC as number) - tE)
    const dtObnizona = s.godzinObnizenia > 0 ? Math.max(0, (s.tObnizonaC as number) - tE) : dtKomfort
    bezWh += s.hWK * dtKomfort * 24
    zeWh += s.hWK * (dtKomfort * (24 - s.godzinObnizenia) + dtObnizona * s.godzinObnizenia)
  }
  const cieploBezStrefKwh = bezWh / 1000
  const cieploZeStrefamiKwh = zeWh / 1000
  const oszczednoscCieplaKwh = cieploBezStrefKwh - cieploZeStrefamiKwh
  const oszczednoscPct = cieploBezStrefKwh > 0 ? (oszczednoscCieplaKwh / cieploBezStrefKwh) * 100 : 0
  const pradSterowaniaKwh =
    (input.liczbaSilownikow * input.mocSilownikaW * input.godzinPracySilownikow + input.mocSterownikowW * 24) / 1000

  const warnings: Warning[] = [stanUstalony()]
  let oszczednoscPraduKwh: number | null = null
  let bilansPraduKwh: number | null = null
  if (input.copOgrzewania > 0) {
    oszczednoscPraduKwh = oszczednoscCieplaKwh / input.copOgrzewania
    bilansPraduKwh = oszczednoscPraduKwh - pradSterowaniaKwh
    if (pradSterowaniaKwh > 0 && bilansPraduKwh <= 0) warnings.push(silownikiZjadajaZysk(r2(pradSterowaniaKwh), r2(oszczednoscPraduKwh)))
  } else {
    warnings.push(bezCop())
  }

  const assumptions: Assumption[] = [{ kod: "STREF-ZALOZENIE-H-STREFY" }]
  return {
    ...baza,
    value: { cieploBezStrefKwh, cieploZeStrefamiKwh, oszczednoscCieplaKwh, oszczednoscPct, pradSterowaniaKwh, oszczednoscPraduKwh, bilansPraduKwh },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
