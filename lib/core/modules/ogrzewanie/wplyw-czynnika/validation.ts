import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, godzinyPozaDoba, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import { POLA_CZYNNIKA } from "./constants"
import type { WplywCzynnikaInput } from "./input"

/** Fraction field (e.g. window g-value) outside [0, 1]. */
function ulamekPozaZakresem(pole: string, wartosc: number): Warning[] {
  if (wartosc >= 0 && wartosc <= 1) return []
  return [
    {
      code: "WPC-ULAMEK-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "WPC-ULAMEK-POZA-ZAKRESEM",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano [0, 1]`,
      field: pole,
    },
  ]
}

/** Form validation of the selected factor's fields only — the other factors' fields may hold anything. */
export function validateInput(input: WplywCzynnikaInput): { errors: Warning[] } {
  if (input.czynnik === null) return { errors: [] }
  const errors: Warning[] = []
  for (const pole of POLA_CZYNNIKA[input.czynnik]) {
    const v = input.pola[pole.klucz]
    if (v === undefined) continue
    if (!Number.isFinite(v)) {
      errors.push(...ujemneWartosci({ [pole.klucz]: -1 }).map((w) => ({ ...w, technicalMessage: `${pole.klucz} nie jest liczbą` })))
      continue
    }
    switch (pole.rodzaj) {
      case "dodatnia":
        errors.push(...ujemneWartosci({ [pole.klucz]: v }))
        break
      case "procent":
        errors.push(...procentPozaZakresem(pole.klucz, v))
        break
      case "ulamek":
        errors.push(...ulamekPozaZakresem(pole.klucz, v))
        break
      case "cop":
        errors.push(...ujemneWartosci({ [pole.klucz]: v }), ...(v >= 0 ? copPonizejJednosci(pole.klucz, v) : []))
        break
      case "godziny":
        errors.push(...godzinyPozaDoba(pole.klucz, v))
        break
      case "temperatura":
        break
    }
  }
  return { errors }
}
