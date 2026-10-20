import type { Warning } from "@/lib/core/calc-result"
import { WYKRES_PHI_U } from "../eurokod-7/grunty-pn-b-03020"
import type { OgrodzeniePvInput } from "./input"
import { wartoscUjemna, zakresId } from "./warnings"

export function validateInput(input: OgrodzeniePvInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const pola: [string, number | null][] = [
    ["dlugoscPanelaMm", input.dlugoscPanelaMm],
    ["wysokoscPanelaMm", input.wysokoscPanelaMm],
    ["grubDoscPanelaMm", input.grubDoscPanelaMm],
    ["szczelinaPionowaMm", input.szczelinaPionowaMm],
    ["szczelinaPoziomaMm", input.szczelinaPoziomaMm],
    ["przeswitMm", input.przeswitMm],
    ["liczbaRzedow", input.liczbaRzedow],
    ["maxWysokoscMm", input.maxWysokoscMm],
    ["dlugoscOgrodzeniaM", input.dlugoscOgrodzeniaM],
    ["wysokoscNpmM", input.wysokoscNpmM],
    ["stopienZageszczeniaId", input.stopienZageszczeniaId],
    ["glebokoscPrzemarzaniaM", input.glebokoscPrzemarzaniaM],
    ["ugiecieDopuszczalneMm", input.ugiecieDopuszczalneMm],
  ]
  for (const [pole, wartosc] of pola) {
    if (wartosc !== null && wartosc < 0) errors.push(wartoscUjemna(pole, wartosc))
  }
  if (input.liczbaRzedow !== null && !Number.isInteger(input.liczbaRzedow)) errors.push(wartoscUjemna("liczbaRzedow", input.liczbaRzedow))
  const id = input.stopienZageszczeniaId
  const grupa = input.grupaGruntu
  if (id > 0 && grupa !== null) {
    const w = WYKRES_PHI_U[grupa]
    if (id < w.idOd || id > w.idDo) errors.push(zakresId(id, w.idOd, w.idDo))
  }
  return { errors }
}
