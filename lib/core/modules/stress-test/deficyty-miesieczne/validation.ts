import type { Warning } from "@/lib/core/calc-result"
import { MAX_DNI } from "./constants"
import { walidujHistorie } from "./historia"
import type { DeficytyMiesieczneInput } from "./input"
import { wartoscUjemnaDef, zlaLiczbaMiesiecy } from "./warnings"
import { historiaPozaZakresem, poleHistoriiPozaZakresem } from "./warnings-historia"

export function validateInput(input: DeficytyMiesieczneInput): { errors: Warning[] } {
  const errors: Warning[] = []
  if (input.deficytyKwh.length !== 12) errors.push(zlaLiczbaMiesiecy(input.deficytyKwh.length))
  input.deficytyKwh.forEach((d, i) => {
    if (d < 0) errors.push(wartoscUjemnaDef(`deficytyKwh[${i}]`, d))
  })
  const pola = {
    mocAgregatuKw: input.mocAgregatuKw,
    zuzyciePaliwaLH: input.zuzyciePaliwaLH,
    cenaPaliwaZlL: input.cenaPaliwaZlL,
    kosztSerwisuZlH: input.kosztSerwisuZlH,
    zapasPaliwaL: input.zapasPaliwaL,
  }
  for (const [pole, v] of Object.entries(pola)) if (v < 0) errors.push(wartoscUjemnaDef(pole, v))

  const h = input.horyzont
  if (h?.rodzaj === "dni" && !(h.dni > 0 && h.dni <= MAX_DNI)) errors.push(poleHistoriiPozaZakresem("horyzont.dni", h.dni, `0 < dni <= ${MAX_DNI}`))

  const pop = input.zapotrzebowanieDobaKwh
  if (pop) {
    if (pop.length !== 12) errors.push(zlaLiczbaMiesiecy(pop.length))
    pop.forEach((d, i) => {
      if (d < 0) errors.push(wartoscUjemnaDef(`zapotrzebowanieDobaKwh[${i}]`, d))
    })
  }
  const a = input.analizaHistorii
  if (a) {
    if (!(a.oknoDni >= 0 && a.oknoDni <= MAX_DNI && Number.isInteger(a.oknoDni))) errors.push(poleHistoriiPozaZakresem("oknoDni", a.oknoDni, `0..${MAX_DNI}`))
    if (!(a.percentylPct >= 0 && a.percentylPct <= 100)) errors.push(poleHistoriiPozaZakresem("percentylPct", a.percentylPct, "0..100"))
    if (!(a.progSlabegoDniaPct >= 0 && a.progSlabegoDniaPct <= 100)) errors.push(poleHistoriiPozaZakresem("progSlabegoDniaPct", a.progSlabegoDniaPct, "0..100"))
    const nocy = a.udzialNocyPct
    if (nocy !== undefined && !(nocy >= 0 && nocy <= 100)) errors.push(poleHistoriiPozaZakresem("udzialNocyPct", nocy, "0..100"))
    const m = a.magazyn
    if (m) {
      if (!(Number.isFinite(m.pojemnoscUzytecznaKwh) && m.pojemnoscUzytecznaKwh >= 0)) {
        errors.push(poleHistoriiPozaZakresem("magazyn.pojemnoscUzytecznaKwh", m.pojemnoscUzytecznaKwh, ">= 0"))
      }
      if (!(m.sprawnoscPct >= 0 && m.sprawnoscPct <= 100)) errors.push(poleHistoriiPozaZakresem("magazyn.sprawnoscPct", m.sprawnoscPct, "0..100"))
      if (!(m.stanPoczatkowyPct >= 0 && m.stanPoczatkowyPct <= 100)) {
        errors.push(poleHistoriiPozaZakresem("magazyn.stanPoczatkowyPct", m.stanPoczatkowyPct, "0..100"))
      }
    }
  }
  if (input.historia) for (const powod of walidujHistorie(input.historia)) errors.push(historiaPozaZakresem(powod))
  return { errors }
}
