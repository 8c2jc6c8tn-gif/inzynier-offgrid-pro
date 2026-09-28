import type { Warning } from "@/lib/core/calc-result"
import type { SciezkaCenInput } from "./input"
import { HORYZONT_MAX_LAT, HORYZONT_MIN_LAT, SUWAK_WARTOSCI_PROCENT } from "./constants"
import { horyzontPozaZakresem, inflacjaNiepoprawna, kosztUjemny, suwakPozaLista } from "./warnings"

export function validateInput(input: SciezkaCenInput): Warning[] {
  const errors: Warning[] = []
  if (!Number.isInteger(input.horyzontLat) || input.horyzontLat < HORYZONT_MIN_LAT || input.horyzontLat > HORYZONT_MAX_LAT) {
    errors.push(horyzontPozaZakresem(input.horyzontLat, HORYZONT_MIN_LAT, HORYZONT_MAX_LAT))
  }
  if (input.kosztRocznyZl < 0) errors.push(kosztUjemny(input.kosztRocznyZl))
  if (input.tryb.rodzaj === "suwak" && !(SUWAK_WARTOSCI_PROCENT as readonly number[]).includes(input.tryb.gProcent)) {
    errors.push(suwakPozaLista(input.tryb.gProcent))
  }
  if (input.tryb.rodzaj === "ue-inflacja" && input.tryb.zrodloInflacji === "wlasna") {
    const v = input.tryb.wlasnaInflacjaProcent
    if (v === null || !Number.isFinite(v) || v <= -100) errors.push(inflacjaNiepoprawna(v))
  }
  return errors
}
