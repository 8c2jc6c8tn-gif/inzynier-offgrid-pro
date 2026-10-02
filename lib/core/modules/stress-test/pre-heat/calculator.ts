import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/constants"
import type { PreHeatInput } from "./input"
import { brakNadwyzkiPv, copNiedodatni, grzanieNocaZBaterii, wartoscUjemna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.1"

const FORMULA =
  `Q_{dom} = C \\cdot \\Delta T,\\quad Q_{CWU} = V \\cdot \\Delta T_{CWU} \\cdot ${latexLiczba(WSPOLCZYNNIK_KWH_NA_L_K.toFixed(6))},\\quad E_{el} = \\frac{Q_{dom} + Q_{CWU}}{COP},\\quad t_{bufor} = \\frac{Q_{dom}}{P_{strat}}`

export type PreHeatResult = {
  /** Ciepło zmagazynowane w masie budynku [kWh]. */
  cieploDomuKwh: number | null
  /** Ciepło zmagazynowane w bojlerze [kWh]. */
  cieploBojleraKwh: number | null
  /** Energia elektryczna na przegrzanie [kWh]. */
  energiaElektrycznaKwh: number | null
  /** Ile godzin dodatkowe ciepło w masie budynku pokrywa straty [h]. */
  buforGodzin: number | null
}

const PUSTY: PreHeatResult = { cieploDomuKwh: null, cieploBojleraKwh: null, energiaElektrycznaKwh: null, buforGodzin: null }

/**
 * Ekran 18, Moduł 7 — "Pre-Heat Thermal Storage" (dawne 6.28). Fizyka magazynowania ciepła: Q = C·ΔT dla budynku
 * (C z M6/E8), dla bojlera ten sam współczynnik wody co M2/E2 (echo stałej). Bufor = Q_dom / straty — ile godzin
 * nadmiar ciepła pokrywa straty (straty przyjęte jako stałe). 🔴 grzanie nocą z baterii — 1:1 ze źródła; 🟡 gdy
 * energia przekracza wpisaną nadwyżkę PV. Wykrywanie frontu z prognozy (M1) — poza zakresem.
 */
export function calculatePreHeat(input: PreHeatInput): CalcResult<PreHeatResult> {
  const inputs: Record<string, number> = {
    pojemnoscCieplnaKwhK: input.pojemnoscCieplnaKwhK ?? 0,
    podniesienieTempDomuK: input.podniesienieTempDomuK ?? 0,
    stratyCieplaKw: input.stratyCieplaKw ?? 0,
    pojemnoscBojleraL: input.pojemnoscBojleraL ?? 0,
    podniesienieTempBojleraK: input.podniesienieTempBojleraK ?? 0,
    cop: input.cop ?? 0,
  }
  const wynik = (status: Status, value: PreHeatResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<PreHeatResult> => ({
    value,
    unit: "kWh",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const ETYKIETY = {
    pojemnoscCieplnaKwhK: "POLE-POJEMNOSC-CIEPLNA-BUDYNKU",
    podniesienieTempDomuK: "POLE-PODNIESIENIE-TEMPERATURY-W-DOMU",
    stratyCieplaKw: "POLE-STRATY-CIEPLA",
    pojemnoscBojleraL: "POLE-POJEMNOSC-BOJLERA",
    podniesienieTempBojleraK: "POLE-PODNIESIENIE-TEMPERATURY-BOJLERA",
    nadwyzkaPvKwh: "POLE-NADWYZKA-PV",
  } as const
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  if (input.cop !== null && input.cop <= 0) errors.push(copNiedodatni(input.cop))
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)

  const { pojemnoscCieplnaKwhK: C, podniesienieTempDomuK: dT, cop } = input
  if (C === null || C <= 0 || dT === null || dT <= 0 || cop === null || input.zrodloEnergii === null) return wynik("INCOMPLETE", PUSTY, [])

  const cieploDomuKwh = C * dT
  const cieploBojleraKwh =
    input.pojemnoscBojleraL !== null && input.podniesienieTempBojleraK !== null
      ? input.pojemnoscBojleraL * input.podniesienieTempBojleraK * WSPOLCZYNNIK_KWH_NA_L_K
      : null
  const energiaElektrycznaKwh = (cieploDomuKwh + (cieploBojleraKwh ?? 0)) / cop
  const straty = input.stratyCieplaKw
  const value: PreHeatResult = {
    cieploDomuKwh,
    cieploBojleraKwh,
    energiaElektrycznaKwh,
    buforGodzin: straty !== null && straty > 0 ? cieploDomuKwh / straty : null,
  }

  const warnings: Warning[] = []
  if (input.zrodloEnergii === "bateria-noc") warnings.push(grzanieNocaZBaterii())
  if (input.zrodloEnergii === "pv-dzien" && input.nadwyzkaPvKwh !== null && energiaElektrycznaKwh > input.nadwyzkaPvKwh) {
    warnings.push(brakNadwyzkiPv(energiaElektrycznaKwh, input.nadwyzkaPvKwh))
  }

  return wynik(warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID", value, warnings, [
    { kod: "PREHEAT-ZALOZENIE-STRATY-STALE" },
  ])
}
