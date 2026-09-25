import type { Warning } from "@/lib/core/calc-result"
import type { KosztyOgrzewaniaInput, ZrodloCiepla } from "./input"
import { wartoscNiedodatnia, wartoscUjemna } from "./warnings"

const DODATNIE: ReadonlyArray<[keyof ZrodloCiepla, string]> = [
  ["wartoscOpalowaKwh", "Wartość opałowa"],
  ["sprawnoscPct", "Sprawność"],
  ["mocGrzewczaKw", "Moc grzewcza"],
  ["zuzyciePaliwaNaH", "Zużycie paliwa"],
  ["cop", "COP"],
]
const NIEUJEMNE: ReadonlyArray<[keyof ZrodloCiepla, string]> = [
  ["cenaZl", "Cena"],
  ["poborPraduW", "Pobór prądu"],
  ["kosztInwestycjiZl", "Koszt inwestycji"],
  ["kosztSerwisuRocznyZl", "Koszt serwisu"],
]

const liczbaZle = (v: unknown, dodatnia: boolean) =>
  typeof v === "number" && !(Number.isFinite(v) && (dodatnia ? v > 0 : v >= 0))

export function validateInput(input: KosztyOgrzewaniaInput): Warning[] {
  const e: Warning[] = []
  const { zapotrzebowanieSezonKwh: q, liczbaLat: lata } = input
  if (liczbaZle(q, true)) e.push(wartoscNiedodatnia("zapotrzebowanieSezonKwh", "Zapotrzebowanie na ciepło", q!))
  if (liczbaZle(lata, true)) e.push(wartoscNiedodatnia("liczbaLat", "Okres analizy", lata!))
  input.zrodla.forEach((z, i) => {
    for (const [pole, etykieta] of DODATNIE) {
      if (liczbaZle(z[pole], true)) e.push(wartoscNiedodatnia(`${pole}-${i}`, `${etykieta} (${z.nazwa})`, z[pole] as number))
    }
    for (const [pole, etykieta] of NIEUJEMNE) {
      if (liczbaZle(z[pole], false)) e.push(wartoscUjemna(`${pole}-${i}`, `${etykieta} (${z.nazwa})`, z[pole] as number))
    }
  })
  return e
}
