import type { Warning } from "@/lib/core/calc-result"
import { godzinyPozaDoba, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { AlternatywneZrodlaCieplaInput } from "./input"

export function validateInput(input: AlternatywneZrodlaCieplaInput): { errors: Warning[] } {
  const ujemne = ujemneWartosci({
    zapotrzebowanieKw: input.zapotrzebowanieKw,
    kominekMocKw: input.kominekMocKw,
    irMocW: input.irMocW,
    matyMocWm2: input.matyMocWm2,
    matyPowierzchniaM2: input.matyPowierzchniaM2,
    pcmObjetoscL: input.pcmObjetoscL,
    pcmGestoscKgL: input.pcmGestoscKgL,
    pcmCieploTopnieniaKjKg: input.pcmCieploTopnieniaKjKg,
    buforDeltaTK: input.buforDeltaTK,
  })
  return {
    errors: [...ujemne, ...procentPozaZakresem("kominekDoWodyPct", input.kominekDoWodyPct), ...godzinyPozaDoba("irGodzinNaDobe", input.irGodzinNaDobe)],
  }
}
