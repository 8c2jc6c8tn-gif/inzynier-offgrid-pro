import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { obliczProdukcjeKwh } from "../kat-i-azymut/calculator"
import type { PowierzchniaOceniona, PowierzchnieInput } from "./input"
import { validatePowierzchnie } from "./validation"
import { powierzchniaNieznana } from "./warnings"
import { fabrykaWyniku } from "./wynik"

export type UzyskPowierzchni = PowierzchniaOceniona & { mocKwp: number; uzyskRocznyKwh: number }

export type PowierzchnieResult = {
  pozycje: UzyskPowierzchni[]
  sumaMocyKwp: number
  sumaUzyskuKwh: number
}

const FORMULA = "E_i = P_i \\times \\frac{H_i}{1\\,\\text{kW/m}^2} \\times PR,\\quad E = \\sum_i E_i"

/**
 * Tryby "Dach skośny" (dawne 2.6 — jedna połać z modelu budynku) i "Wielopołaciowy" (dawne 2.7 —
 * dowolne powierzchnie z checkboxami, suma na żywo). Napromieniowanie i wskaźnik % każdej powierzchni —
 * z M1/E4 (orientacja powierzchni: PVGIS TMY, Muneer, zacienienie ze Skanera), bez liczenia od nowa.
 * Uzysk = moc × H × PR (definicja uzysku odniesienia, jak M3/E1). PR i moc — tylko wpis użytkownika.
 */
export function calculatePowierzchnie(input: PowierzchnieInput): CalcResult<PowierzchnieResult | null> {
  const wynik = fabrykaWyniku<PowierzchnieResult>({ wspolczynnikPr: input.wspolczynnikPr }, FORMULA, "kWh")
  const errors: Warning[] = validatePowierzchnie(input)
  if (input.oceny !== null) {
    for (const w of input.wybrane) if (!input.oceny.some((o) => o.nazwa === w.nazwa)) errors.push(powierzchniaNieznana(w.nazwa))
  }
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)

  const { oceny, wybrane, wspolczynnikPr: pr } = input
  if (oceny === null || wybrane.length === 0 || pr === null || wybrane.some((w) => w.mocKwp === null)) return wynik("INCOMPLETE", null)

  const pozycje: UzyskPowierzchni[] = wybrane.map((w) => {
    const o = oceny.find((x) => x.nazwa === w.nazwa)!
    return { ...o, mocKwp: w.mocKwp!, uzyskRocznyKwh: obliczProdukcjeKwh(o.napromieniowanieRoczneKwhM2, w.mocKwp!, pr) }
  })
  const assumptions: Assumption[] = [{ kod: "TM-ZALOZENIE-OCENA-M1" }, { kod: "KAT-ZALOZENIE-PR-UZYTKOWNIKA", params: { pr } }]

  return wynik(
    "VALID",
    {
      pozycje,
      sumaMocyKwp: pozycje.reduce((a, p) => a + p.mocKwp, 0),
      sumaUzyskuKwh: pozycje.reduce((a, p) => a + p.uzyskRocznyKwh, 0),
    },
    [],
    assumptions,
  )
}
