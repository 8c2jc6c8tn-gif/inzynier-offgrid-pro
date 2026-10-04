import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { SecondLifeInput } from "./input"
import { validateInput } from "./validation"
import { drozszaNizNowa, tanszaNizNowa } from "./warnings"
import { DEGRADACJA_NA_10000KM_PCT, DEGRADACJA_ROCZNA_PCT } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type SecondLifeResult = {
  sohSzacowanyPct: number
  pojemnoscUzytecznaKwh: number
  kosztZaKwh: number
  tansza: boolean | null
}

const FORMULA = "SoH = 100\\% - degradacja; C_{uzyteczna} = C_{deklarowana} \\times SoH; koszt_{kWh} = cena / C_{uzyteczna}"

/**
 * Ekran 17, Moduł 4 "Magazyn energii / baterie" — "Analiza Second-Life (baterie z EV)" (dawne
 * 3.19, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Przykład źródła (10 kWh, SoH
 * 72% → 7,2 kWh, 6000 zł → 833 zł/kWh) zweryfikowany niezależnie w Pythonie — źródło nie podaje
 * dokładnego wieku/przebiegu użytego w tym przykładzie, więc nie odtwarzany dosłownie w teście,
 * tylko sama arytmetyka SoH→pojemność→koszt.
 */
export function calculateSecondLife(input: SecondLifeInput): CalcResult<SecondLifeResult> {
  const { errors } = validateInput(input)
  const pustyWynik: SecondLifeResult = { sohSzacowanyPct: 0, pojemnoscUzytecznaKwh: 0, kosztZaKwh: 0, tansza: null }
  const inputs = {
    pojemnoscDeklarowanaKwh: input.pojemnoscDeklarowanaKwh,
    cenaZakupuZl: input.cenaZakupuZl,
    wiekLata: input.wiekLata,
    przebiegKm: input.przebiegKm,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "zł/kWh",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-SECOND-LIFE",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const brakDanychMetody =
    input.metodaSzacunku === "" ||
    (input.metodaSzacunku === "wiek" && input.wiekLata === 0) ||
    (input.metodaSzacunku === "przebieg" && input.przebiegKm === 0)

  if (input.pojemnoscDeklarowanaKwh === 0 || input.cenaZakupuZl === 0 || brakDanychMetody) {
    return {
      value: pustyWynik,
      unit: "zł/kWh",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-SECOND-LIFE",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const degradacjaPct =
    input.metodaSzacunku === "wiek"
      ? input.wiekLata * DEGRADACJA_ROCZNA_PCT
      : (input.przebiegKm / 10000) * DEGRADACJA_NA_10000KM_PCT

  const sohSzacowanyPct = Math.max(0, 100 - degradacjaPct)
  const pojemnoscUzytecznaKwh = input.pojemnoscDeklarowanaKwh * (sohSzacowanyPct / 100)

  const assumptions: Assumption[] = [
    input.metodaSzacunku === "wiek"
      ? { kod: "SOH-SZACUNEK-Z-WIEKU", params: { rate: DEGRADACJA_ROCZNA_PCT } }
      : { kod: "SOH-SZACUNEK-Z-PRZEBIEGU", params: { rate: DEGRADACJA_NA_10000KM_PCT } },
  ]

  if (sohSzacowanyPct === 0) {
    return {
      value: { sohSzacowanyPct: 0, pojemnoscUzytecznaKwh: 0, kosztZaKwh: 0, tansza: null },
      unit: "zł/kWh",
      status: "VALID_WITH_WARNINGS",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-SECOND-LIFE",
      inputs,
      assumptions,
      warnings: [
        {
          code: "SOH-ZEROWY",
          level: "critical",
          i18nKey: "SOH-ZEROWY",
          technicalMessage: `sohSzacowanyPct = 0`,
        },
      ],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const kosztZaKwh = input.cenaZakupuZl / pojemnoscUzytecznaKwh

  const warnings: Warning[] = []
  let tansza: boolean | null = null
  if (input.cenaNowejLiFePO4ZlZaKwh !== null) {
    tansza = kosztZaKwh < input.cenaNowejLiFePO4ZlZaKwh
    warnings.push(
      tansza
        ? tanszaNizNowa(kosztZaKwh, input.cenaNowejLiFePO4ZlZaKwh)
        : drozszaNizNowa(kosztZaKwh, input.cenaNowejLiFePO4ZlZaKwh),
    )
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { sohSzacowanyPct, pojemnoscUzytecznaKwh, kosztZaKwh, tansza },
    unit: "zł/kWh",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-SECOND-LIFE",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
