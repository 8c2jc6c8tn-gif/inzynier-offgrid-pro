import type { Warning } from "@/lib/core/calc-result"
import { KAT_MAX_DEG, WYSOKOSC_KONSTRUKCJI_ZAKRES_M, WYSOKOSC_NPM_ZAKRES_M } from "./constants"
import type { WiatrPowyzej30Input } from "./input"
import { poza } from "./warnings"

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
  return { errors }
}
