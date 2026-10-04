import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { OcenaUrzadzenia } from "./constants"
import type { UrzadzeniaZabronioneInput } from "./input"
import { urzadzenieRyzykowne, urzadzenieZabronione } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "OK: P k \\le P_{ciągła}; \\quad ryzykowne: P \\le P_{ciągła},\\ P k \\le P_{szczyt}; \\quad zabronione: P > P_{ciągła} \\lor P k > P_{szczyt}"

export type OcenaWiersza = {
  nazwa: string
  ocena: OcenaUrzadzenia
  /** Moc przy rozruchu P × k [W] (k = 1, gdy nieznana). */
  rozruchW: number
}

export type UrzadzeniaZabronioneResult = {
  oceny: OcenaWiersza[]
  /** Falownik, który udźwignie wszystkie urządzenia osobno: moc ciągła = max P, szczytowa = max P × k [W]. */
  potrzebnaMocCiaglaW: number
  potrzebnaMocSzczytowaW: number
}

const PUSTY_WYNIK: UrzadzeniaZabronioneResult = { oceny: [], potrzebnaMocCiaglaW: 0, potrzebnaMocSzczytowaW: 0 }

/**
 * Ekran 37, Moduł 12 — "Urządzenia zabronione dla małych falowników" (dawne 8.64, Biblia §12.52). Każde
 * urządzenie oceniane osobno wobec mocy ciągłej i szczytowej falownika z karty:
 * - OK — także rozruch mieści się w mocy ciągłej;
 * - ryzykowne 🟡 — praca mieści się, a rozruch tylko dzięki przeciążalności (albo krotność nieznana);
 * - zabronione 🔴 — moc pracy ponad moc ciągłą albo rozruch ponad szczytową.
 * Praca kilku urządzeń naraz (suma) — E8 "Przetwornice". Przykład Biblii (suszarka 1800 W na 1000 W →
 * zabronione) odtworzony w teście; "zastosuj falownik 3000 W" nie wynika z podanych liczb (bez krotności).
 */
export function calculateUrzadzeniaZabronione(input: UrzadzeniaZabronioneInput): CalcResult<UrzadzeniaZabronioneResult> {
  const liczby: Record<string, number> = { mocFalownikaW: input.mocFalownikaW, mocSzczytowaW: input.mocSzczytowaW }
  input.urzadzenia.forEach((u, i) => {
    liczby[`urzadzenia[${i}].mocW`] = u.mocW
    liczby[`urzadzenia[${i}].krotnoscRozruchu`] = u.krotnoscRozruchu
  })
  const errors = ujemneWartosci(liczby)
  const baza = { unit: "W", formula: FORMULA, formulaKey: "UI-FORMULA-KALKULATOR-MOBILNY-URZADZENIA-ZABRONIONE-FALOWNIK", inputs: liczby, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const wpisane = input.urzadzenia.filter((u) => u.mocW > 0)
  if (input.mocFalownikaW === 0 || input.mocSzczytowaW === 0 || wpisane.length === 0) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const oceny: OcenaWiersza[] = wpisane.map((u) => {
    const rozruchW = u.mocW * Math.max(u.krotnoscRozruchu, 1)
    const nazwa = u.nazwa.trim() === "" ? "—" : u.nazwa
    if (u.mocW > input.mocFalownikaW || rozruchW > input.mocSzczytowaW) {
      warnings.push(urzadzenieZabronione(nazwa, u.mocW, rozruchW, input.mocFalownikaW, input.mocSzczytowaW))
      return { nazwa, ocena: "zabronione", rozruchW }
    }
    if (u.krotnoscRozruchu === 0 || rozruchW > input.mocFalownikaW) {
      warnings.push(urzadzenieRyzykowne(nazwa, u.krotnoscRozruchu === 0))
      return { nazwa, ocena: "ryzykowne", rozruchW }
    }
    return { nazwa, ocena: "ok", rozruchW }
  })

  return {
    ...baza,
    value: {
      oceny,
      potrzebnaMocCiaglaW: Math.max(...wpisane.map((u) => u.mocW)),
      potrzebnaMocSzczytowaW: Math.max(...oceny.map((o) => o.rozruchW)),
    },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "UZF-ZALOZENIE-KAZDE-OSOBNO" }],
    warnings,
  }
}
