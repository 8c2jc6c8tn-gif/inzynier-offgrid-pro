import type { Warning } from "@/lib/core/calc-result"
import {
  AZYMUT_MAX_DEG,
  AZYMUT_MIN_DEG,
  DLUGOSC_MAX,
  DLUGOSC_MIN,
  MIN_WIERZCHOLKOW_OBRYSU,
  NACHYLENIE_MAX_DEG,
  NACHYLENIE_MIN_DEG,
  SZEROKOSC_MAX,
  SZEROKOSC_MIN,
} from "./constants"
import { bledyDanychGodzinowych } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/validation"
import type { AnalizaZacienieniaInput } from "./input"
import { punktWewnatrzPrzeszkody as punktWPrzeszkodzieGeom } from "./przeszkody"
import {
  outOfRange,
  prognozaNizszaNizObecna,
  przeszkodaNiepoprawna,
  punktWewnatrzPrzeszkody,
} from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

function zakres(
  errors: Warning[],
  field: string,
  label: string,
  value: number | undefined,
  min: number,
  max: number,
) {
  if (value === undefined) return
  if (!Number.isFinite(value) || value < min || value > max) errors.push(outOfRange(field, label, value, min, max))
}

export function validateInput(input: AnalizaZacienieniaInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  zakres(errors, "szerokoscGeograficzna", "szerokość geograficzna", input.szerokoscGeograficzna, SZEROKOSC_MIN, SZEROKOSC_MAX)
  zakres(errors, "dlugoscGeograficzna", "długość geograficzna", input.dlugoscGeograficzna, DLUGOSC_MIN, DLUGOSC_MAX)
  zakres(errors, "nachyleniePowierzchniDeg", "nachylenie powierzchni", input.nachyleniePowierzchniDeg, NACHYLENIE_MIN_DEG, NACHYLENIE_MAX_DEG)
  zakres(errors, "azymutPowierzchniDeg", "azymut powierzchni", input.azymutPowierzchniDeg, AZYMUT_MIN_DEG, AZYMUT_MAX_DEG)

  errors.push(...bledyDanychGodzinowych(input.daneGodzinowe))

  for (const p of input.przeszkody ?? []) {
    if (!(p.wysokoscM >= 0) || !Number.isFinite(p.wysokoscM)) {
      errors.push(przeszkodaNiepoprawna(p.nazwa, "wysokoscM < 0 lub nie jest liczbą"))
      continue
    }
    if (p.typ === "drzewo") {
      if (!(p.promienKoronyM > 0)) {
        errors.push(przeszkodaNiepoprawna(p.nazwa, "promienKoronyM <= 0"))
        continue
      }
      if (p.wysokoscPrognozowanaM !== undefined && p.wysokoscPrognozowanaM < p.wysokoscM) {
        warnings.push(prognozaNizszaNizObecna(p.nazwa))
      }
    } else if (p.obrys.length < MIN_WIERZCHOLKOW_OBRYSU) {
      errors.push(przeszkodaNiepoprawna(p.nazwa, `obrys ma < ${MIN_WIERZCHOLKOW_OBRYSU} wierzchołki`))
      continue
    }
    if (input.punkt && punktWPrzeszkodzieGeom(input.punkt, p)) {
      errors.push(punktWewnatrzPrzeszkody(p.nazwa))
    }
  }

  return { errors, warnings }
}
