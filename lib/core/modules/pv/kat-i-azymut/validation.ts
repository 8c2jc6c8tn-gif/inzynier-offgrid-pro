import type { Warning } from "@/lib/core/calc-result"
import {
  ALBEDO_MAX,
  ALBEDO_MIN,
  AZYMUT_MAX_DEG,
  AZYMUT_MIN_DEG,
  DLUGOSC_MAX,
  DLUGOSC_MIN,
  SZEROKOSC_MAX,
  SZEROKOSC_MIN,
} from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"
import { bledyDanychGodzinowych } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/validation"
import { KAT_MAX_DEG, KAT_MIN_DEG, PR_MAX, PR_MIN_WYLACZNIE } from "./constants"
import type { KatIAzymutInput, TabelaNapromieniowaniaInput } from "./input"
import { prPozaZakresem, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

const wZakresie = (v: number, min: number, max: number) => Number.isFinite(v) && v >= min && v <= max

export function validateTabela(input: TabelaNapromieniowaniaInput): Warning[] {
  const errors: Warning[] = []
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, albedo } = input
  if (lat !== undefined && !wZakresie(lat, SZEROKOSC_MIN, SZEROKOSC_MAX)) {
    errors.push(wartoscPozaZakresem("szerokoscGeograficzna", "POLE-SZEROKOSC-GEOGRAFICZNA", lat, SZEROKOSC_MIN, SZEROKOSC_MAX))
  }
  if (lon !== undefined && !wZakresie(lon, DLUGOSC_MIN, DLUGOSC_MAX)) {
    errors.push(wartoscPozaZakresem("dlugoscGeograficzna", "POLE-DLUGOSC-GEOGRAFICZNA", lon, DLUGOSC_MIN, DLUGOSC_MAX))
  }
  if (!wZakresie(input.azymutDeg, AZYMUT_MIN_DEG, AZYMUT_MAX_DEG)) {
    errors.push(wartoscPozaZakresem("azymutDeg", "POLE-AZYMUT", input.azymutDeg, AZYMUT_MIN_DEG, AZYMUT_MAX_DEG))
  }
  if (albedo !== undefined && !wZakresie(albedo, ALBEDO_MIN, ALBEDO_MAX)) {
    errors.push(wartoscPozaZakresem("albedo", "POLE-ALBEDO", albedo, ALBEDO_MIN, ALBEDO_MAX))
  }
  errors.push(...bledyDanychGodzinowych(input.daneGodzinowe))
  return errors
}

export function validateInput(input: KatIAzymutInput): Warning[] {
  const errors: Warning[] = []
  if (input.nachylenieDeg !== null && !wZakresie(input.nachylenieDeg, KAT_MIN_DEG, KAT_MAX_DEG)) {
    errors.push(wartoscPozaZakresem("nachylenieDeg", "POLE-KAT-POCHYLENIA", input.nachylenieDeg, KAT_MIN_DEG, KAT_MAX_DEG))
  }
  if (input.mocInstalacjiKwp < 0) errors.push(wartoscUjemna("mocInstalacjiKwp", "POLE-MOC-INSTALACJI", input.mocInstalacjiKwp))
  if (input.wspolczynnikPr !== null && !(input.wspolczynnikPr > PR_MIN_WYLACZNIE && input.wspolczynnikPr <= PR_MAX)) {
    errors.push(prPozaZakresem(input.wspolczynnikPr))
  }
  return errors
}
