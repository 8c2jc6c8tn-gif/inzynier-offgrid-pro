import type { Warning } from "@/lib/core/calc-result"
import { NG_SANITY_MAX, TD_SANITY_MAX } from "./constants"
import type { OcenaRyzykaCrlInput } from "./input"
import { wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: OcenaRyzykaCrlInput): Warning[] {
  const e: Warning[] = []
  const { gestoscWyladowanNg: ng, dniBurzoweTd: td, odlegloscDoSpdWSieciKm: dSpd } = input
  if (ng !== null && (ng <= 0 || ng > NG_SANITY_MAX)) e.push(wartoscPozaZakresem("gestoscWyladowanNg", "Gęstość wyładowań Ng", ng, 0, NG_SANITY_MAX))
  if (td !== null && (td <= 0 || td > TD_SANITY_MAX)) e.push(wartoscPozaZakresem("dniBurzoweTd", "Dni burzowe Td", td, 0, TD_SANITY_MAX))
  for (const [pole, etykieta] of [
    ["napowietrznaNnKm", "Linia napowietrzna nn"],
    ["kablowaNnKm", "Kabel nn"],
    ["napowietrznaSnKm", "Linia napowietrzna SN/WN"],
    ["kablowaSnKm", "Kabel SN/WN"],
  ] as const) {
    if (input[pole] < 0) e.push(wartoscUjemna(pole, etykieta, input[pole]))
  }
  if (dSpd !== null && dSpd < 0) e.push(wartoscUjemna("odlegloscDoSpdWSieciKm", "Odległość do SPD w sieci", dSpd))
  return e
}
