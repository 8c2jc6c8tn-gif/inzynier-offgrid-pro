import type { Warning } from "@/lib/core/calc-result"
import { nazwaElementu } from "@/lib/core/nazwa-elementu"
import type { KosztyOgrzewaniaInput, ZrodloCiepla } from "./input"
import { wartoscNiedodatnia, wartoscUjemna } from "./warnings"

const DODATNIE: ReadonlyArray<[keyof ZrodloCiepla, string]> = [
  ["wartoscOpalowaKwh", "POLE-KO-WARTOSC-OPALOWA"],
  ["sprawnoscPct", "POLE-KO-SPRAWNOSC"],
  ["mocGrzewczaKw", "POLE-KO-MOC-GRZEWCZA"],
  ["zuzyciePaliwaNaH", "POLE-KO-ZUZYCIE-PALIWA"],
  ["cop", "POLE-KO-COP"],
]
const NIEUJEMNE: ReadonlyArray<[keyof ZrodloCiepla, string]> = [
  ["cenaZl", "POLE-KO-CENA"],
  ["poborPraduW", "POLE-KO-POBOR-PRADU"],
  ["kosztInwestycjiZl", "POLE-KO-KOSZT-INWESTYCJI"],
  ["kosztSerwisuRocznyZl", "POLE-KO-KOSZT-SERWISU"],
]

const liczbaZle = (v: unknown, dodatnia: boolean) =>
  typeof v === "number" && !(Number.isFinite(v) && (dodatnia ? v > 0 : v >= 0))

export function validateInput(input: KosztyOgrzewaniaInput): Warning[] {
  const e: Warning[] = []
  const { zapotrzebowanieSezonKwh: q, liczbaLat: lata } = input
  if (liczbaZle(q, true)) e.push(wartoscNiedodatnia("zapotrzebowanieSezonKwh", "POLE-ZAPOTRZEBOWANIE-NA-CIEPLO", q!))
  if (liczbaZle(lata, true)) e.push(wartoscNiedodatnia("liczbaLat", "POLE-KO-OKRES-ANALIZY", lata!))
  input.zrodla.forEach((z, i) => {
    const zrodlo = nazwaElementu("zrodlo", z.nazwa, "NAZWA-ZRODLO-NR", i + 1)
    for (const [pole, labelKey] of DODATNIE) {
      if (liczbaZle(z[pole], true)) e.push(wartoscNiedodatnia(`${pole}-${i}`, labelKey, z[pole] as number, zrodlo))
    }
    for (const [pole, labelKey] of NIEUJEMNE) {
      if (liczbaZle(z[pole], false)) e.push(wartoscUjemna(`${pole}-${i}`, labelKey, z[pole] as number, zrodlo))
    }
  })
  return e
}
