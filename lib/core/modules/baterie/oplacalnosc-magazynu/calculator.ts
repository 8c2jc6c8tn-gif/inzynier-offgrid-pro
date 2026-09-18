import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { OplacalnoscMagazynuInput } from "./input"
import { validateInput } from "./validation"
import { drozszeNizAlternatywa, tanszeNizAlternatywa } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type OplacalnoscMagazynuResult = {
  energiaCalkowitaZyciaKwh: number
  kosztZaKwh: number
  tansze: boolean | null
}

const FORMULA = "koszt_{kWh} = cena / (pojemność \\times cykle \\times \\eta)"

/**
 * Ekran 23, Moduł 4 "Magazyn energii / baterie" — "Analiza opłacalności magazynu (True Cost of
 * Storage)" (dawne 3.25, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzory 1:1 ze
 * źródła: `energia_całkowita_życia = pojemność × liczba_cykli × sprawność`,
 * `koszt_za_kWh = cena_baterii / energia_całkowita_życia`. Porównanie z kosztem alternatywy
 * (agregat/sieć) — pole opcjonalne, prosta różnica kosztu za kWh, bez dodatkowych założeń o
 * tempie zwrotu (źródło nie podaje wzoru na "liczbę cykli do zwrotu", przykład Sekcji C jest
 * ilustracyjny).
 */
export function obliczKosztZaKwh(
  cenaZl: number,
  pojemnoscKwh: number,
  liczbaCykli: number,
  sprawnoscPct: number,
): { energiaCalkowitaZyciaKwh: number; kosztZaKwh: number } {
  const energiaCalkowitaZyciaKwh = pojemnoscKwh * liczbaCykli * (sprawnoscPct / 100)
  const kosztZaKwh = cenaZl / energiaCalkowitaZyciaKwh
  return { energiaCalkowitaZyciaKwh, kosztZaKwh }
}

export function calculateOplacalnoscMagazynu(
  input: OplacalnoscMagazynuInput,
): CalcResult<OplacalnoscMagazynuResult> {
  const { errors } = validateInput(input)
  const pustyWynik: OplacalnoscMagazynuResult = { energiaCalkowitaZyciaKwh: 0, kosztZaKwh: 0, tansze: null }
  const inputs = {
    cenaBateriiZl: input.cenaBateriiZl,
    pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
    liczbaCykli: input.liczbaCykli,
    sprawnoscPct: input.sprawnoscPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "zł/kWh",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.cenaBateriiZl === 0 ||
    input.pojemnoscUzytecznaKwh === 0 ||
    input.liczbaCykli === 0 ||
    input.sprawnoscPct === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "zł/kWh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const { energiaCalkowitaZyciaKwh, kosztZaKwh } = obliczKosztZaKwh(
    input.cenaBateriiZl,
    input.pojemnoscUzytecznaKwh,
    input.liczbaCykli,
    input.sprawnoscPct,
  )

  const warnings: Warning[] = []
  let tansze: boolean | null = null
  if (input.kosztAlternatywyZlZaKwh !== null) {
    tansze = kosztZaKwh < input.kosztAlternatywyZlZaKwh
    warnings.push(
      tansze
        ? tanszeNizAlternatywa(kosztZaKwh, input.kosztAlternatywyZlZaKwh)
        : drozszeNizAlternatywa(kosztZaKwh, input.kosztAlternatywyZlZaKwh),
    )
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { energiaCalkowitaZyciaKwh, kosztZaKwh, tansze },
    unit: "zł/kWh",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "LICZBA-CYKLI-SPRAWNOSC-OD-UZYTKOWNIKA" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
