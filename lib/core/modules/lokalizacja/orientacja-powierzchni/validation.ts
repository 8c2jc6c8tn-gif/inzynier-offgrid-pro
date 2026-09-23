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
  NACHYLENIE_MAX_DEG,
  NACHYLENIE_MIN_DEG,
  SZEROKOSC_MAX,
  SZEROKOSC_MIN,
} from "./constants"
import type { OrientacjaPowierzchniInput } from "./input"
import { daneNiepelnyRok, daneUjemne, outOfRange, powierzchniaNiepoprawna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

function wZakresie(v: number, min: number, max: number): boolean {
  return Number.isFinite(v) && v >= min && v <= max
}

export function validateInput(input: OrientacjaPowierzchniInput): ValidationResult {
  const errors: Warning[] = []
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, albedo, daneGodzinowe } = input

  if (lat !== undefined && !wZakresie(lat, SZEROKOSC_MIN, SZEROKOSC_MAX)) {
    errors.push(outOfRange("szerokoscGeograficzna", "szerokość geograficzna", lat, SZEROKOSC_MIN, SZEROKOSC_MAX))
  }
  if (lon !== undefined && !wZakresie(lon, DLUGOSC_MIN, DLUGOSC_MAX)) {
    errors.push(outOfRange("dlugoscGeograficzna", "długość geograficzna", lon, DLUGOSC_MIN, DLUGOSC_MAX))
  }
  if (albedo !== undefined && !wZakresie(albedo, ALBEDO_MIN, ALBEDO_MAX)) {
    errors.push(outOfRange("albedo", "albedo", albedo, ALBEDO_MIN, ALBEDO_MAX))
  }

  if (daneGodzinowe && daneGodzinowe.length > 0) {
    if (daneGodzinowe.length !== GODZIN_W_ROKU && daneGodzinowe.length !== GODZIN_W_ROKU_PRZESTEPNYM) {
      errors.push(daneNiepelnyRok(daneGodzinowe.length))
    }
    const zly = daneGodzinowe.findIndex((r) => !(r.ghi >= 0 && r.dni >= 0 && r.dhi >= 0 && Number.isFinite(r.czasUtcMs)))
    if (zly >= 0) errors.push(daneUjemne(zly))
  }

  for (const p of input.powierzchnie ?? []) {
    if (!wZakresie(p.nachylenieDeg, NACHYLENIE_MIN_DEG, NACHYLENIE_MAX_DEG) || !wZakresie(p.azymutDeg, AZYMUT_MIN_DEG, AZYMUT_MAX_DEG)) {
      errors.push(powierzchniaNiepoprawna(p.nazwa))
    }
  }

  return { errors, warnings: [] }
}
