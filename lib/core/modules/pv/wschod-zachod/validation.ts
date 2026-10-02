import type { Warning } from "@/lib/core/calc-result"
import {
  ALBEDO_MAX,
  ALBEDO_MIN,
  AZYMUT_MAX_DEG,
  AZYMUT_MIN_DEG,
  DLUGOSC_MAX,
  DLUGOSC_MIN,
  NACHYLENIE_MAX_DEG,
  NACHYLENIE_MIN_DEG,
  SZEROKOSC_MAX,
  SZEROKOSC_MIN,
} from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"
import { bledyDanychGodzinowych } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/validation"
import type { DaneWschodZachodInput, WschodZachodInput } from "./input"
import { wartoscPozaZakresem } from "./warnings"

const wZakresie = (v: number, min: number, max: number) => Number.isFinite(v) && v >= min && v <= max

export function validateDane(input: DaneWschodZachodInput): Warning[] {
  const errors: Warning[] = []
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, albedo } = input
  if (lat !== undefined && !wZakresie(lat, SZEROKOSC_MIN, SZEROKOSC_MAX)) {
    errors.push(wartoscPozaZakresem("szerokoscGeograficzna", "POLE-SZEROKOSC-GEOGRAFICZNA", lat, SZEROKOSC_MIN, SZEROKOSC_MAX))
  }
  if (lon !== undefined && !wZakresie(lon, DLUGOSC_MIN, DLUGOSC_MAX)) {
    errors.push(wartoscPozaZakresem("dlugoscGeograficzna", "POLE-DLUGOSC-GEOGRAFICZNA", lon, DLUGOSC_MIN, DLUGOSC_MAX))
  }
  if (albedo !== undefined && !wZakresie(albedo, ALBEDO_MIN, ALBEDO_MAX)) {
    errors.push(wartoscPozaZakresem("albedo", "POLE-ALBEDO", albedo, ALBEDO_MIN, ALBEDO_MAX))
  }
  for (const [nazwa, kluczNachylenia, kluczAzymutu, p] of [
    ["wschod", "POLE-WSCHOD-NACHYLENIE", "POLE-WSCHOD-AZYMUT", input.wschod],
    ["zachod", "POLE-ZACHOD-NACHYLENIE", "POLE-ZACHOD-AZYMUT", input.zachod],
  ] as const) {
    if (!wZakresie(p.nachylenieDeg, NACHYLENIE_MIN_DEG, NACHYLENIE_MAX_DEG)) {
      errors.push(wartoscPozaZakresem(`${nazwa}Nachylenie`, kluczNachylenia, p.nachylenieDeg, NACHYLENIE_MIN_DEG, NACHYLENIE_MAX_DEG))
    }
    if (!wZakresie(p.azymutDeg, AZYMUT_MIN_DEG, AZYMUT_MAX_DEG)) {
      errors.push(wartoscPozaZakresem(`${nazwa}Azymut`, kluczAzymutu, p.azymutDeg, AZYMUT_MIN_DEG, AZYMUT_MAX_DEG))
    }
  }
  errors.push(...bledyDanychGodzinowych(input.daneGodzinowe))
  return errors
}

export function validateInput(input: WschodZachodInput): Warning[] {
  if (input.udzialWschodPct !== null && !wZakresie(input.udzialWschodPct, 0, 100)) {
    return [wartoscPozaZakresem("udzialWschodPct", "POLE-UDZIAL-MOCY-WSCHOD", input.udzialWschodPct, 0, 100)]
  }
  return []
}
