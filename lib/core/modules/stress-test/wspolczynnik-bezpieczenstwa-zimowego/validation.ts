import type { Warning } from "@/lib/core/calc-result"
import { SKLADOWE, TOLERANCJA_SUMY_WAG_PKT } from "./constants"
import type { WspolczynnikInput } from "./input"
import { progPozaZakresem, spofPonadLiczbe, wagiNieSumujaSie, wartoscUjemnaWsp } from "./warnings"

export function validateInput(input: WspolczynnikInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const pola = {
    produkcjaNajgorszyMiesiacKwh: input.produkcjaNajgorszyMiesiacKwh,
    zapotrzebowanieNajgorszyMiesiacKwh: input.zapotrzebowanieNajgorszyMiesiacKwh,
    autonomiaDni: input.autonomiaDni,
    wymaganaAutonomiaDni: input.wymaganaAutonomiaDni,
    liczbaKomponentow: input.liczbaKomponentow,
    liczbaSpof: input.liczbaSpof,
    mocAgregatuKw: input.mocAgregatuKw,
    mocWymaganaAgregatuKw: input.mocWymaganaAgregatuKw,
    oknoReakcjiH: input.oknoReakcjiH,
    wymaganyCzasReakcjiH: input.wymaganyCzasReakcjiH,
  }
  for (const [pole, v] of Object.entries(pola)) if (v !== null && v < 0) errors.push(wartoscUjemnaWsp(pole, v))
  if (input.liczbaSpof !== null && input.liczbaKomponentow !== null && input.liczbaSpof > input.liczbaKomponentow) {
    errors.push(spofPonadLiczbe(input.liczbaSpof, input.liczbaKomponentow))
  }
  const prog = input.progSlabegoPunktuPct
  if (prog !== null && (prog < 0 || prog > 100)) errors.push(progPozaZakresem(prog))
  if (input.wagiWlasne !== null) {
    for (const id of SKLADOWE) if (input.wagiWlasne[id] < 0) errors.push(wartoscUjemnaWsp(`wagiWlasne.${id}`, input.wagiWlasne[id]))
    const suma = SKLADOWE.reduce((s, id) => s + input.wagiWlasne![id], 0)
    if (Math.abs(suma - 100) > TOLERANCJA_SUMY_WAG_PKT) errors.push(wagiNieSumujaSie(suma))
  }
  return { errors }
}
