import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { obliczDniAutonomiiZPojemnosci, obliczPojemnoscUzytecznaKwh } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import type { BlackoutInput } from "./input"
import { validateInput } from "./validation"
import { systemPadnie, systemPrzetrwa } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "d = \\frac{C \\cdot \\eta \\cdot (SoC_0 - SoC_{min})}{E - E_{agr}};\\; \\Delta C = \\frac{N (E - E_{agr}) - E_{dost}}{\\eta \\cdot (SoC_0 - SoC_{min})}"

export type BlackoutResult = {
  /** Energia dostępna z baterii do krytycznego minimum, po stronie odbiorników [kWh]. */
  energiaDostepnaKwh: number | null
  /** Deficyt dobowy po odjęciu agregatu [kWh/dobę]. ≤ 0 = agregat pokrywa zużycie. */
  deficytDobowyKwh: number | null
  /** Dni do krytycznego minimum. null = deficyt ≤ 0 (bez końca w tym modelu). */
  dniPrzetrwania: number | null
  /** Numer dnia scenariusza, w którym SoC osiągnie minimum. null = przetrwa. */
  dzienAwarii: number | null
  /** Brakująca pojemność znamionowa, żeby przetrwać N dni [kWh]. 0 = wystarcza. */
  dodatkowaPojemnoscKwh: number | null
  /** O ile ograniczyć zużycie dobowe, żeby przetrwać N dni [%]. 0 = wystarcza. */
  redukcjaZuzyciaPct: number | null
}

const PUSTY: BlackoutResult = {
  energiaDostepnaKwh: null,
  deficytDobowyKwh: null,
  dniPrzetrwania: null,
  dzienAwarii: null,
  dodatkowaPojemnoscKwh: null,
  redukcjaZuzyciaPct: null,
}

/**
 * Ekran 4, Moduł 7 — "Blackout" (dawne 6.4). Sekcja B: N dni bez produkcji PV, bateria do krytycznego minimum.
 * Echo M4/E1: dni = `obliczDniAutonomiiZPojemnosci` z DoD = SoC₀ − SoC_min i deficytem po agregacie; brakująca
 * pojemność = `obliczPojemnoscUzytecznaKwh` z brakującą energią (1 „dzień”). Redukcja zużycia E′ = E_dost/N + E_agr.
 * Model dobowy — godzina awarii („o 3:00 w nocy” z przykładu C) wymaga profilu godzinowego, nieliczona.
 */
export function calculateBlackout(input: BlackoutInput): CalcResult<BlackoutResult> {
  const inputs: Record<string, number> = {
    pojemnoscKwh: input.pojemnoscKwh ?? 0,
    socStartPct: input.socStartPct ?? 0,
    socMinPct: input.socMinPct ?? 0,
    sprawnoscFalownikaPct: input.sprawnoscFalownikaPct ?? 0,
    zuzycieDoboweKwh: input.zuzycieDoboweKwh ?? 0,
    dniScenariusza: input.dniScenariusza ?? 0,
    agregatKwhDoba: input.agregatKwhDoba ?? 0,
  }
  const wynik = (status: Status, value: BlackoutResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<BlackoutResult> => ({
    value,
    unit: "dni",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)
  const { pojemnoscKwh: C, socStartPct: s0, socMinPct: sMin, sprawnoscFalownikaPct: eta, zuzycieDoboweKwh: E, dniScenariusza: N } = input
  if (C === null || C <= 0 || s0 === null || sMin === null || eta === null || E === null || E <= 0 || N === null || N <= 0) {
    return wynik("INCOMPLETE", PUSTY, [])
  }

  const dodPct = s0 - sMin
  const agr = input.agregatKwhDoba ?? 0
  const energiaDostepnaKwh = (C * (eta / 100) * dodPct) / 100
  const deficytDobowyKwh = E - agr
  const assumptions: Assumption[] = [{ kod: "BLACKOUT-ZALOZENIE-PV-ZERO" }, { kod: "BLACKOUT-ZALOZENIE-ZUZYCIE-STALE" }]

  if (deficytDobowyKwh <= 0) {
    const value = { ...PUSTY, energiaDostepnaKwh, deficytDobowyKwh, dodatkowaPojemnoscKwh: 0, redukcjaZuzyciaPct: 0 }
    return wynik("VALID", value, [systemPrzetrwa(N)], assumptions)
  }

  const dniPrzetrwania = obliczDniAutonomiiZPojemnosci(C, deficytDobowyKwh, eta, dodPct)
  const brakKwh = Math.max(0, N * deficytDobowyKwh - energiaDostepnaKwh)
  const dodatkowaPojemnoscKwh = brakKwh > 0 ? obliczPojemnoscUzytecznaKwh(brakKwh, 1, eta, dodPct) : 0
  const redukcjaZuzyciaPct = Math.max(0, (1 - (energiaDostepnaKwh / N + agr) / E) * 100)
  const przetrwa = dniPrzetrwania >= N
  const dzienAwarii = przetrwa ? null : Math.floor(dniPrzetrwania) + 1

  const value: BlackoutResult = {
    energiaDostepnaKwh,
    deficytDobowyKwh,
    dniPrzetrwania,
    dzienAwarii,
    dodatkowaPojemnoscKwh,
    redukcjaZuzyciaPct,
  }
  const warnings = przetrwa ? [systemPrzetrwa(N)] : [systemPadnie(dzienAwarii!, N, dodatkowaPojemnoscKwh, redukcjaZuzyciaPct)]
  return wynik(przetrwa ? "VALID" : "VALID_WITH_WARNINGS", value, warnings, assumptions)
}
