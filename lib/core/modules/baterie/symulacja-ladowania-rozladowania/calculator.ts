import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { SymulacjaLadowaniaInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type SymulacjaLadowaniaResult = {
  godzinDoPelna: number
  zdazyNaladowacPrzedZachodem: boolean
  socOZachodzieSlonca: number
  godzinDoProguWNocy: number
  przetrwaCalaNoc: boolean
}

const FORMULA =
  "t_{pelna} = \\dfrac{C \\times (100-SoC_{start})/100}{P_{ladowania}}; \\quad " +
  "t_{prog} = \\dfrac{C \\times (SoC_{wieczor}-SoC_{prog})/100}{P_{rozladowania}}"

const PUSTY_WYNIK: SymulacjaLadowaniaResult = {
  godzinDoPelna: 0,
  zdazyNaladowacPrzedZachodem: false,
  socOZachodzieSlonca: 0,
  godzinDoProguWNocy: 0,
  przetrwaCalaNoc: false,
}

/**
 * Ekran 3, Moduł 4 — "Symulacja czasu ładowania/rozładowania" (dawne 3.3,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Źródło opisuje tylko narrację ("system
 * liczy, o której godzinie bateria osiągnie 100% i kiedy zacznie się rozładowywać w nocy"), bez
 * jawnego wzoru ani liczbowego przykładu do odtworzenia — wzór wyżej to bilans energii
 * (moc × czas = energia) zbudowany z tej narracji, udokumentowany tu jawnie jako decyzja
 * projektowa, nie zmyślona dana wejściowa (docs/standards/00-filozofia.md, zakaz zmyślania
 * dotyczy norm/współczynników, nie kształtu wzoru wynikającego wprost z fizyki bilansu energii).
 *
 * Uproszczenie: średnia moc ładowania/rozładowania przez całe okno, nie pełny profil godzinowy
 * (ten sam wzorzec co Ekran 1 dla "auto z Modułu 2/3" — te moduły źródłowe jeszcze nie istnieją).
 */
function symuluj(input: SymulacjaLadowaniaInput): SymulacjaLadowaniaResult {
  const energiaDoPelnaKwh = (input.pojemnoscUzytecznaKwh * (100 - input.socStartPct)) / 100
  const godzinDoPelna = input.mocLadowaniaKw > 0 ? energiaDoPelnaKwh / input.mocLadowaniaKw : Number.POSITIVE_INFINITY
  const zdazyNaladowacPrzedZachodem = godzinDoPelna <= input.dlugoscDniaGodz

  let socOZachodzieSlonca: number
  if (zdazyNaladowacPrzedZachodem) {
    socOZachodzieSlonca = 100
  } else {
    const przyrostSocPct =
      input.mocLadowaniaKw > 0 && input.pojemnoscUzytecznaKwh > 0
        ? ((input.mocLadowaniaKw * input.dlugoscDniaGodz) / input.pojemnoscUzytecznaKwh) * 100
        : 0
    socOZachodzieSlonca = Math.min(100, input.socStartPct + przyrostSocPct)
  }

  const energiaDoProguKwh =
    (input.pojemnoscUzytecznaKwh * Math.max(0, socOZachodzieSlonca - input.socProgPct)) / 100
  const godzinDoProguWNocy = energiaDoProguKwh / input.mocRozladowaniaKw
  const dlugoscNocyGodz = 24 - input.dlugoscDniaGodz
  const przetrwaCalaNoc = godzinDoProguWNocy >= dlugoscNocyGodz

  return {
    godzinDoPelna,
    zdazyNaladowacPrzedZachodem,
    socOZachodzieSlonca,
    godzinDoProguWNocy,
    przetrwaCalaNoc,
  }
}

export function calculateSymulacjaLadowania(
  input: SymulacjaLadowaniaInput,
): CalcResult<SymulacjaLadowaniaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscUzytecznaKwh: input.pojemnoscUzytecznaKwh,
    socStartPct: input.socStartPct,
    mocLadowaniaKw: input.mocLadowaniaKw,
    mocRozladowaniaKw: input.mocRozladowaniaKw,
    dlugoscDniaGodz: input.dlugoscDniaGodz,
    socProgPct: input.socProgPct,
  }

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "godz.",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.pojemnoscUzytecznaKwh === 0 || input.dlugoscDniaGodz === 0 || input.mocRozladowaniaKw === 0

  if (niekompletne) {
    return {
      value: PUSTY_WYNIK,
      unit: "godz.",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const value = symuluj(input)
  const assumptions: Assumption[] = [{ kod: "SYMULACJA-SREDNIA-MOC-NIE-PROFIL-GODZINOWY" }]
  const warnings = value.przetrwaCalaNoc
    ? []
    : [
        {
          code: "NIE-PRZETRWA-NOCY",
          level: "warning" as const,
          i18nKey: "NIE-PRZETRWA-NOCY",
          technicalMessage: `godzinDoProguWNocy=${value.godzinDoProguWNocy.toFixed(2)} < dlugoscNocyGodz=${24 - input.dlugoscDniaGodz}`,
        },
      ]

  return {
    value,
    unit: "godz.",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
