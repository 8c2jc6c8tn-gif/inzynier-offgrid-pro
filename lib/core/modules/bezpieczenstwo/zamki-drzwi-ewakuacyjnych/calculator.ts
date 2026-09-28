import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { ZamkiDrzwiEwakuacyjnychInput } from "./input"
import {
  brakKontaktronu,
  brakPrzyciskuEwakuacyjnego,
  brakZwalnianiaPoAlarmie,
  zachowanieNieznane,
  zamekBlokujeBezZasilaniaAwaryjnego,
  zamekFailSecure,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "fail\\text{-}safe:\\; brak\\ zasilania \\Rightarrow drzwi\\ otwarte"

export type ZamkiDrzwiEwakuacyjnychResult = {
  /** true = przy zaniku zasilania drzwi się otwierają. null = brak danych. */
  failSafe: boolean | null
  /** Liczba braków (ostrzeżeń 🟡/🔴). */
  liczbaBrakow: number
}

/**
 * Ekran 3, Moduł 8 — "Siłowniki drzwi i zamki elektromagnetyczne" (dawne 11.51). Reguły 1:1 ze źródła:
 * 🔴 zamek bez zasilania awaryjnego, który nie jest fail-safe (sekcja C); zasada „brak prądu = drzwi
 * otwarte, nigdy odwrotnie” (sekcja D) — fail-secure z UPS tylko 🟡, bo 🔴 źródło wiąże z brakiem
 * zasilania awaryjnego. „Nie wiem” liczone jak fail-secure (strona bezpieczna). Zwolnienie po alarmie
 * albo przyciskiem i kontaktron — elementy logiki z sekcji B.
 */
export function calculateZamkiDrzwiEwakuacyjnych(
  input: ZamkiDrzwiEwakuacyjnychInput,
): CalcResult<ZamkiDrzwiEwakuacyjnychResult> {
  const inputs = {
    maZasilanieAwaryjne: input.maZasilanieAwaryjne ? 1 : 0,
    maPrzyciskEwakuacyjny: input.maPrzyciskEwakuacyjny ? 1 : 0,
    zwalnianiePoAlarmiePozarowym: input.zwalnianiePoAlarmiePozarowym ? 1 : 0,
    maKontaktron: input.maKontaktron ? 1 : 0,
  }
  const wynik = (status: Status, value: ZamkiDrzwiEwakuacyjnychResult, warnings: Warning[]) => ({
    value,
    unit: "",
    status,
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (input.typZamka === null || input.zachowaniePrzyZanikuZasilania === null) {
    return wynik("INCOMPLETE", { failSafe: null, liczbaBrakow: 0 }, [])
  }

  const failSafe = input.zachowaniePrzyZanikuZasilania === "otwiera"
  const warnings: Warning[] = []
  if (input.zachowaniePrzyZanikuZasilania === "nie-wiem") warnings.push(zachowanieNieznane())
  if (!failSafe) warnings.push(input.maZasilanieAwaryjne ? zamekFailSecure() : zamekBlokujeBezZasilaniaAwaryjnego())
  if (!input.zwalnianiePoAlarmiePozarowym) warnings.push(brakZwalnianiaPoAlarmie())
  if (!input.maPrzyciskEwakuacyjny) warnings.push(brakPrzyciskuEwakuacyjnego())
  if (!input.maKontaktron) warnings.push(brakKontaktronu())

  const liczbaBrakow = warnings.filter((w) => w.level !== "info").length
  return wynik(liczbaBrakow > 0 ? "VALID_WITH_WARNINGS" : "VALID", { failSafe, liczbaBrakow }, warnings)
}
