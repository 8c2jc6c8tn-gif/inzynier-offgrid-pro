import type { Warning } from "@/lib/core/calc-result"
import { LICZBA_OKIEN, MAKS_HORYZONT_H, type PrognozaSocInput } from "./input"
import { minNieMniejszeOdMax, wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(i: PrognozaSocInput): Warning[] {
  const e: Warning[] = []
  const nieujemne: [string, number | null][] = [
    ["maksMocLadowaniaKw", i.maksMocLadowaniaKw],
    ["maksMocRozladowaniaKw", i.maksMocRozladowaniaKw],
  ]
  i.produkcjaKw.forEach((v, k) => nieujemne.push([`produkcjaKw[${k}]`, v]))
  i.zuzycieKw.forEach((v, k) => nieujemne.push([`zuzycieKw[${k}]`, v]))
  i.wspolczynnikDniPct.forEach((v, k) => nieujemne.push([`wspolczynnikDniPct[${k}]`, v]))
  for (const [pole, v] of nieujemne) if (v !== null && (!Number.isFinite(v) || v < 0)) e.push(wartoscUjemna(pole, v))
  if (i.pojemnoscUzytecznaKwh !== null) {
    const c = i.pojemnoscUzytecznaKwh
    if (!Number.isFinite(c) || c < 0) e.push(wartoscUjemna("pojemnoscUzytecznaKwh", c))
    else if (c === 0) e.push(wartoscNiedodatnia("pojemnoscUzytecznaKwh", c))
  }
  const procenty: [string, number | null][] = [
    ["socStartPct", i.socStartPct],
    ["socMinPct", i.socMinPct],
    ["socMaksPct", i.socMaksPct],
  ]
  for (const [pole, v] of procenty) if (v !== null && (!Number.isFinite(v) || v < 0 || v > 100)) e.push(wartoscPozaZakresem(pole, v, 0, 100))
  for (const [pole, v] of [["sprawnoscLadowaniaPct", i.sprawnoscLadowaniaPct], ["sprawnoscRozladowaniaPct", i.sprawnoscRozladowaniaPct]] as const) {
    if (v === null) continue
    if (!Number.isFinite(v) || v > 100) e.push(wartoscPozaZakresem(pole, v, 0, 100))
    else if (v <= 0) e.push(wartoscNiedodatnia(pole, v))
  }
  const min = i.socMinPct
  const max = i.socMaksPct ?? 100
  if (min !== null && Number.isFinite(min) && Number.isFinite(max) && min >= max && min >= 0 && max <= 100) e.push(minNieMniejszeOdMax(min, max))
  if (i.godzinaStartu !== null && (!Number.isInteger(i.godzinaStartu) || i.godzinaStartu < 0 || i.godzinaStartu > 23)) e.push(wartoscPozaZakresem("godzinaStartu", i.godzinaStartu, 0, 23))
  if (i.horyzontH !== null && (!Number.isInteger(i.horyzontH) || i.horyzontH < 1 || i.horyzontH > MAKS_HORYZONT_H)) e.push(wartoscPozaZakresem("horyzontH", i.horyzontH, 1, MAKS_HORYZONT_H))
  if (i.produkcjaKw.length !== LICZBA_OKIEN || i.zuzycieKw.length !== LICZBA_OKIEN) e.push(wartoscPozaZakresem("profil", i.produkcjaKw.length, LICZBA_OKIEN, LICZBA_OKIEN))
  return e
}
