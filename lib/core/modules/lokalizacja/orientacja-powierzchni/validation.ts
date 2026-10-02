import type { Warning } from "@/lib/core/calc-result"
import {
  ALBEDO_MAX,
  ALBEDO_MIN,
  AZYMUT_MAX_DEG,
  AZYMUT_MIN_DEG,
  DLUGOSC_MAX,
  DLUGOSC_MIN,
  GODZIN_W_ROKU,
  GODZIN_W_ROKU_PRZESTEPNYM,
  HORYZONT_MAX_DEG,
  HORYZONT_MIN_DEG,
  NACHYLENIE_MAX_DEG,
  NACHYLENIE_MIN_DEG,
  SZEROKOSC_MAX,
  SZEROKOSC_MIN,
} from "./constants"
import type { OrientacjaPowierzchniInput, RekordGodzinowy } from "./input"
import { daneNiepelnyRok, daneUjemne, horyzontNiepoprawny, outOfRange, powierzchniaNiepoprawna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

function wZakresie(v: number, min: number, max: number): boolean {
  return Number.isFinite(v) && v >= min && v <= max
}

/** Pełny rok godzinowy, promieniowanie ≥ 0 — wspólne dla Ekranów 3 i 4 (te same dane PVGIS TMY). */
export function bledyDanychGodzinowych(dane: RekordGodzinowy[] | undefined): Warning[] {
  const errors: Warning[] = []
  if (!dane || dane.length === 0) return errors
  if (dane.length !== GODZIN_W_ROKU && dane.length !== GODZIN_W_ROKU_PRZESTEPNYM) errors.push(daneNiepelnyRok(dane.length))
  const zly = dane.findIndex((r) => !(r.ghi >= 0 && r.dni >= 0 && r.dhi >= 0 && Number.isFinite(r.czasUtcMs)))
  if (zly >= 0) errors.push(daneUjemne(zly))
  return errors
}

export function validateInput(input: OrientacjaPowierzchniInput): ValidationResult {
  const errors: Warning[] = []
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, albedo, daneGodzinowe } = input

  if (lat !== undefined && !wZakresie(lat, SZEROKOSC_MIN, SZEROKOSC_MAX)) {
    errors.push(outOfRange("szerokoscGeograficzna", "POLE-SZEROKOSC-GEOGRAFICZNA", lat, SZEROKOSC_MIN, SZEROKOSC_MAX))
  }
  if (lon !== undefined && !wZakresie(lon, DLUGOSC_MIN, DLUGOSC_MAX)) {
    errors.push(outOfRange("dlugoscGeograficzna", "POLE-DLUGOSC-GEOGRAFICZNA", lon, DLUGOSC_MIN, DLUGOSC_MAX))
  }
  if (albedo !== undefined && !wZakresie(albedo, ALBEDO_MIN, ALBEDO_MAX)) {
    errors.push(outOfRange("albedo", "POLE-ALBEDO", albedo, ALBEDO_MIN, ALBEDO_MAX))
  }

  errors.push(...bledyDanychGodzinowych(daneGodzinowe))

  for (const p of input.powierzchnie ?? []) {
    if (!wZakresie(p.nachylenieDeg, NACHYLENIE_MIN_DEG, NACHYLENIE_MAX_DEG) || !wZakresie(p.azymutDeg, AZYMUT_MIN_DEG, AZYMUT_MAX_DEG)) {
      errors.push(powierzchniaNiepoprawna(p.nazwa))
    }
    if (p.horyzontyDeg?.some((h) => h.length === 0 || h.some((k) => !wZakresie(k, HORYZONT_MIN_DEG, HORYZONT_MAX_DEG)))) {
      errors.push(horyzontNiepoprawny(p.nazwa))
    }
  }

  return { errors, warnings: [] }
}
