import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { KlapyPozaroweInput } from "./input"
import {
  brakOddymiania,
  brakSygnalizacjiKlap,
  brakWentylacjiMechanicznej,
  klapyNieZamykane,
  wentylacjaNieWylaczana,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "pozar \\Rightarrow klapy\\ zamkniete \\wedge rekuperacja\\ wylaczona"

export type KlapyPozaroweResult = {
  /** Liczba braków (ostrzeżeń 🟡). */
  liczbaBrakow: number
}

/**
 * Ekran 8, Moduł 8 — "Klapy pożarowe i wentylacja" (dawne 11.56 + 12.56). Źródło nie ma tu 🔴. Sekcja B.1: po wykryciu
 * pożaru zamknąć klapy i wyłączyć rekuperację („żeby nie tłoczyć dymu po domu”) — brak którejś reakcji 🟡; oddymianie
 * (sekcja A: „obecność” — opcjonalne) i sygnalizacja stanu klap (Biblia §8.8) — info.
 */
export function calculateKlapyPozarowe(input: KlapyPozaroweInput): CalcResult<KlapyPozaroweResult> {
  const inputs = {
    wentylacjaWylaczanaPrzyPozarze: input.wentylacjaWylaczanaPrzyPozarze ? 1 : 0,
    klapyZamykanePrzyPozarze: input.klapyZamykanePrzyPozarze ? 1 : 0,
    sygnalizacjaStanuKlap: input.sygnalizacjaStanuKlap ? 1 : 0,
    maOddymianie: input.maOddymianie ? 1 : 0,
  }
  const wynik = (status: Status, liczbaBrakow: number, warnings: Warning[]): CalcResult<KlapyPozaroweResult> => ({
    value: { liczbaBrakow },
    unit: "",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-BEZPIECZENSTWO-KLAPY-POZAROWE",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  if (input.wentylacja === null) return wynik("INCOMPLETE", 0, [])
  if (input.wentylacja === "brak") return wynik("VALID", 0, [brakWentylacjiMechanicznej()])

  const warnings: Warning[] = []
  if (!input.wentylacjaWylaczanaPrzyPozarze) warnings.push(wentylacjaNieWylaczana())
  if (!input.klapyZamykanePrzyPozarze) warnings.push(klapyNieZamykane())
  if (!input.sygnalizacjaStanuKlap) warnings.push(brakSygnalizacjiKlap())
  if (!input.maOddymianie) warnings.push(brakOddymiania())

  const liczbaBrakow = warnings.filter((w) => w.level !== "info").length
  return wynik(liczbaBrakow > 0 ? "VALID_WITH_WARNINGS" : "VALID", liczbaBrakow, warnings)
}
