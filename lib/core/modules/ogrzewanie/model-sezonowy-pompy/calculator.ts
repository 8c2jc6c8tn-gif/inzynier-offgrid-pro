import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DNI_MIESIECY } from "../obciazenie-cieplne/constants"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { ModelSezonowyPompyInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_m = Q_m / COP_m,\\quad E = \\sum E_m,\\quad SCOP_{real} = \\sum Q_m / \\sum E_m"

const r2 = (x: number) => Math.round(x * 100) / 100

export type MiesiacPompy = {
  /** 1–12. */
  miesiac: number
  cieploKwh: number
  cop: number
  energiaKwh: number
  /** Average electricity per day of that month [kWh/day]. */
  energiaDobaKwh: number
}

export type ModelSezonowyPompyResult = {
  miesiace: MiesiacPompy[]
  cieploSumaKwh: number
  energiaSumaKwh: number
  /** Seasonal COP of this building: Σ heat / Σ electricity. */
  scopRealny: number
  /** Month with the most electricity (1–12); 0 = none. */
  najwiekszyMiesiac: number
  /** Real versus catalogue SCOP [%] (negative = worse than the catalogue); null = no catalogue SCOP. */
  roznicaScopPct: number | null
}

const PUSTY: ModelSezonowyPompyResult = {
  miesiace: [],
  cieploSumaKwh: 0,
  energiaSumaKwh: 0,
  scopRealny: 0,
  najwiekszyMiesiac: 0,
  roznicaScopPct: null,
}

function zimaZapas(kwh: number, doba: number): Warning {
  return {
    code: "MSP-ZIMA-ZAPAS",
    level: "info",
    params: { kwh: r2(kwh), doba: r2(doba) },
    technicalMessage: `największy miesiąc ${kwh} kWh, ${doba} kWh/doba`,
  }
}

function scopNizszy(realny: number, kat: number, pct: number): Warning {
  return {
    code: "MSP-SCOP-NIZSZY",
    level: "info",
    params: { realny: r2(realny), kat: r2(kat), pct: r2(pct) },
    technicalMessage: `SCOP realny ${realny} < katalogowy ${kat}`,
    field: "scopKatalogowy",
  }
}

function scopWyzszy(realny: number, kat: number): Warning {
  return {
    code: "MSP-SCOP-WYZSZY",
    level: "info",
    params: { realny: r2(realny), kat: r2(kat) },
    technicalMessage: `SCOP realny ${realny} >= katalogowy ${kat}`,
    field: "scopKatalogowy",
  }
}

/**
 * Moduł 6, Część 2C — model zużycia energii pompy w sezonie (dawne 5.64, Biblia §6.27.38) + realny SCOP (dawne 5.43,
 * §6.27.17, dokładka 2B do Ekranu 5 — ten sam silnik, Dyrektywa #8). Per month E = Q / COP (Screen 5 formula), the season
 * sum and SCOP = ΣQ / ΣE (definition of the seasonal coefficient). Monthly heat: Screen 1 months or Screen 2. Monthly COP:
 * datasheet at the month's mean temperature; the defrost (5.43, 6.8) enters as the effective COP of Screen 6 typed by the
 * user. Not modelled (the source lists them without a model — Dyrektywa #1): part-load COP drop, starts from
 * oversizing, off-grid voltage swings — assumption shown.
 *
 * Source examples (Dyrektywa #5): 5.64 „3200 kWh w sezonie, styczeń 800 kWh” — no heat or COP behind it (illustration;
 * January = 25% of the season). 5.43 „katalogowy SCOP 4,5, realnie 3,1 przy grzejnikach 55°C; zasilanie 40°C podniesie
 * go do 3,8” — 3,1 → 3,8 for 15 K is +1,5%/K, below the source's own 5.69 rule of 2–3%/K (which gives 4,0–4,5); the
 * screen does not apply any such rule here, it takes the user's monthly COP.
 */
export function calculateModelSezonowyPompy(input: ModelSezonowyPompyInput): CalcResult<ModelSezonowyPompyResult> {
  const pola: Record<string, number> = { scopKatalogowy: input.scopKatalogowy }
  const errors: Warning[] = [...copPonizejJednosci("scopKatalogowy", input.scopKatalogowy)]
  for (let i = 0; i < 12; i++) {
    const q = input.cieploKwh[i] ?? null
    const c = input.cop[i] ?? null
    if (q !== null) {
      pola[`cieplo${i + 1}`] = q
      errors.push(...ujemneWartosci({ [`cieplo${i + 1}`]: q }))
    }
    if (c !== null) {
      pola[`cop${i + 1}`] = c
      errors.push(...copPonizejJednosci(`cop${i + 1}`, c))
    }
  }
  const baza = { unit: "kWh", formula: FORMULA, inputs: pola, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const miesiace: MiesiacPompy[] = []
  for (let i = 0; i < 12; i++) {
    const q = input.cieploKwh[i] ?? 0
    if (!q) continue
    const cop = input.cop[i] ?? 0
    // A heated month without its COP would silently drop out of the season sum — wait for complete data.
    if (!cop) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
    const energiaKwh = q / cop
    miesiace.push({ miesiac: i + 1, cieploKwh: q, cop, energiaKwh, energiaDobaKwh: energiaKwh / DNI_MIESIECY[i]! })
  }
  if (miesiace.length === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const cieploSumaKwh = miesiace.reduce((a, m) => a + m.cieploKwh, 0)
  const energiaSumaKwh = miesiace.reduce((a, m) => a + m.energiaKwh, 0)
  const scopRealny = cieploSumaKwh / energiaSumaKwh
  const max = miesiace.reduce((a, m) => (m.energiaKwh > a.energiaKwh ? m : a))
  const warnings: Warning[] = [zimaZapas(max.energiaKwh, max.energiaDobaKwh)]
  let roznicaScopPct: number | null = null
  if (input.scopKatalogowy > 0) {
    roznicaScopPct = (scopRealny / input.scopKatalogowy - 1) * 100
    warnings.push(
      scopRealny < input.scopKatalogowy
        ? scopNizszy(scopRealny, input.scopKatalogowy, -roznicaScopPct)
        : scopWyzszy(scopRealny, input.scopKatalogowy),
    )
  }
  const assumptions: Assumption[] = [{ kod: "MSP-ZAL-COP-MIESIACA" }, { kod: "MSP-ZAL-TYLKO-CO" }]
  return {
    ...baza,
    value: { miesiace, cieploSumaKwh, energiaSumaKwh, scopRealny, najwiekszyMiesiac: max.miesiac, roznicaScopPct },
    status: "VALID",
    assumptions,
    warnings,
  }
}
