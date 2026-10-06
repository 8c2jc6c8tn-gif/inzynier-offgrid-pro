import type { Warning } from "@/lib/core/calc-result"
import { NG_SANITY_MAX, TD_SANITY_MAX } from "./constants"
import type { OcenaRyzykaCrlInput } from "./input"
import { wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: OcenaRyzykaCrlInput): Warning[] {
  const e: Warning[] = []
  const { gestoscWyladowanNg: ng, dniBurzoweTd: td, odlegloscDoSpdWSieciKm: dSpd } = input
  if (ng !== null && (ng <= 0 || ng > NG_SANITY_MAX)) e.push(wartoscPozaZakresem("gestoscWyladowanNg", "POLE-GESTOSC-WYLADOWAN-NG", ng, 0, NG_SANITY_MAX))
  if (td !== null && (td <= 0 || td > TD_SANITY_MAX)) e.push(wartoscPozaZakresem("dniBurzoweTd", "POLE-DNI-BURZOWE-TD", td, 0, TD_SANITY_MAX))
  for (const [pole, labelKey] of [
    ["napowietrznaNnKm", "POLE-LINIA-NAPOWIETRZNA-NN"],
    ["kablowaNnKm", "POLE-KABEL-NN"],
    ["napowietrznaSnKm", "POLE-LINIA-NAPOWIETRZNA-SN"],
    ["kablowaSnKm", "POLE-KABEL-SN"],
  ] as const) {
    if (input[pole] < 0) e.push(wartoscUjemna(pole, labelKey, input[pole]))
  }
  if (dSpd !== null && dSpd < 0) e.push(wartoscUjemna("odlegloscDoSpdWSieciKm", "POLE-ODLEGLOSC-DO-SPD", dSpd))
  return e
}
