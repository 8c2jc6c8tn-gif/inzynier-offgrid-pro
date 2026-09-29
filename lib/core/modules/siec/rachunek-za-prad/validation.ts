import type { Warning } from "@/lib/core/calc-result"
import type { RachunekInput } from "./input"
import { STREFY_GRUPY, czyGrupaG, grupaDostepnaDlaMocy } from "./constants"
import {
  energiaMocowaPonadZuzycie,
  grupaNiezgodnaZMoca,
  grupaNiezgodnaZSegmentem,
  miesiaceNiepoprawne,
  strefaSpozaGrupy,
  wartoscUjemna,
} from "./warnings"

export function validateInput(input: RachunekInput): Warning[] {
  const errors: Warning[] = []
  const g = czyGrupaG(input.grupa)
  if (g !== (input.segment === "dom")) errors.push(grupaNiezgodnaZSegmentem(input.grupa, input.segment))
  if (input.mocUmownaKw < 0) errors.push(wartoscUjemna("mocUmownaKw", input.mocUmownaKw))
  if (!g && input.mocUmownaKw > 0 && !grupaDostepnaDlaMocy(input.grupa, input.mocUmownaKw)) {
    errors.push(grupaNiezgodnaZMoca(input.grupa, input.mocUmownaKw))
  }

  const strefy = STREFY_GRUPY[input.grupa]
  for (const [strefa, kwh] of Object.entries(input.zuzycieStrefKwh)) {
    if (kwh === undefined) continue
    if (!strefy.includes(strefa as never) && kwh !== 0) errors.push(strefaSpozaGrupy(strefa, input.grupa))
    if (kwh < 0) errors.push(wartoscUjemna(`zuzycieStrefKwh.${strefa}`, kwh))
  }
  for (const [strefa, c] of Object.entries(input.cenaEnergiiZlKwh)) {
    if (c !== undefined && c < 0) errors.push(wartoscUjemna(`cenaEnergiiZlKwh.${strefa}`, c))
  }
  if (input.oplataHandlowaZlMies !== null && input.oplataHandlowaZlMies < 0) {
    errors.push(wartoscUjemna("oplataHandlowaZlMies", input.oplataHandlowaZlMies))
  }
  const m = input.zuzycieMiesieczneKwh
  if (m !== null && (m.length !== 12 || m.some((v) => v < 0))) errors.push(miesiaceNiepoprawne(m.length))

  const suma = strefy.reduce((s, z) => s + (input.zuzycieStrefKwh[z] ?? 0), 0)
  if (input.energiaMocowaKwh !== null) {
    if (input.energiaMocowaKwh < 0) errors.push(wartoscUjemna("energiaMocowaKwh", input.energiaMocowaKwh))
    else if (suma > 0 && input.energiaMocowaKwh > suma) errors.push(energiaMocowaPonadZuzycie(input.energiaMocowaKwh, suma))
  }

  const w = input.stawkiWlasne
  const liczby: [string, number | undefined][] = [
    ["sieciowaStala", w.sieciowaStala],
    ["abonamentZlMies", w.abonamentZlMies],
    ["jakosciowaZlKwh", w.jakosciowaZlKwh],
    ["ozeZlKwh", w.ozeZlKwh],
    ["kogeneracyjnaZlKwh", w.kogeneracyjnaZlKwh],
    ["mocowaGZlMies", w.mocowaGZlMies],
    ["mocowaCZlKwh", w.mocowaCZlKwh],
    ...Object.entries(w.sieciowaZmienna ?? {}).map(([k, v]) => [`sieciowaZmienna.${k}`, v] as [string, number | undefined]),
  ]
  for (const [pole, v] of liczby) if (v !== undefined && v < 0) errors.push(wartoscUjemna(pole, v))
  return errors
}
