import type { Warning } from "@/lib/core/calc-result"
import { PHI_MAX, PHI_MIN } from "../zloty-srodek/constants"
import { KAT_MAX_DEG, WYSOKOSC_KONSTRUKCJI_ZAKRES_M, WYSOKOSC_NPM_ZAKRES_M } from "./constants"
import type { WiatrPowyzej30Input } from "./input"
import { niedodatnia, poza, ujemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

const wZakresie = (v: number, [min, max]: readonly [number, number]) => Number.isFinite(v) && v >= min && v <= max

export function validateInput(input: WiatrPowyzej30Input): ValidationResult {
  const errors: Warning[] = []
  if (!Number.isFinite(input.nachylenieDeg) || input.nachylenieDeg < 0 || input.nachylenieDeg > KAT_MAX_DEG) {
    errors.push(poza("nachylenieDeg", "POLE-WP30-NACHYLENIE", input.nachylenieDeg, 0, KAT_MAX_DEG))
  }
  if (input.wysokoscNpmM !== null && !wZakresie(input.wysokoscNpmM, WYSOKOSC_NPM_ZAKRES_M)) {
    errors.push(poza("wysokoscNpmM", "POLE-WP30-WYSOKOSC-NPM", input.wysokoscNpmM, ...WYSOKOSC_NPM_ZAKRES_M))
  }
  if (input.wysokoscKonstrukcjiM !== null && !wZakresie(input.wysokoscKonstrukcjiM, WYSOKOSC_KONSTRUKCJI_ZAKRES_M)) {
    errors.push(poza("wysokoscKonstrukcjiM", "POLE-WP30-WYSOKOSC-KONSTRUKCJI", input.wysokoscKonstrukcjiM, ...WYSOKOSC_KONSTRUKCJI_ZAKRES_M))
  }
  if (input.powierzchniaM2 != null && !(Number.isFinite(input.powierzchniaM2) && input.powierzchniaM2 > 0)) {
    errors.push(niedodatnia("powierzchniaM2", "POLE-WP30-POWIERZCHNIA", input.powierzchniaM2))
  }
  if (input.wspolczynnikPhi != null && !(Number.isFinite(input.wspolczynnikPhi) && input.wspolczynnikPhi >= PHI_MIN && input.wspolczynnikPhi <= PHI_MAX)) {
    errors.push(poza("wspolczynnikPhi", "POLE-WP30-PHI", input.wspolczynnikPhi, PHI_MIN, PHI_MAX))
  }
  if (input.masaPaneliStelazaKg != null && !(Number.isFinite(input.masaPaneliStelazaKg) && input.masaPaneliStelazaKg >= 0)) {
    errors.push(ujemna("masaPaneliStelazaKg", input.masaPaneliStelazaKg))
  }
  for (const [pole, klucz, wartosc] of [
    ["wspolczynnikTarcia", "POLE-WP30-TARCIE", input.wspolczynnikTarcia],
    ["wysokoscSrodkaParciaM", "POLE-WP30-WYSOKOSC-PARCIA", input.wysokoscSrodkaParciaM],
    ["szerokoscPodstawyM", "POLE-WP30-SZEROKOSC-PODSTAWY", input.szerokoscPodstawyM],
  ] as const) {
    if (wartosc != null && !(Number.isFinite(wartosc) && wartosc > 0)) errors.push(niedodatnia(pole, klucz, wartosc))
  }
  return { errors }
}
