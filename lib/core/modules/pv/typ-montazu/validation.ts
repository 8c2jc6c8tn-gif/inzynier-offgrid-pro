import type { Warning } from "@/lib/core/calc-result"
import { STALA_STREFY_3_NA1_M } from "../eurokod-1/wiatr"
import { KAT_MAX_DEG, KAT_MIN_DEG, PR_MAX } from "../kat-i-azymut/constants"
import { prPozaZakresem } from "../kat-i-azymut/warnings"
import { PHI_MAX, PHI_MIN } from "../zloty-srodek/constants"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna, wysokoscPozaWzoremStrefy3 } from "../zloty-srodek/warnings"
import type { DaneWiatruInput, GeometriaStelazaInput, PionowyInput, PowierzchnieInput, WiataInput } from "./input"
import { zakresRegulacjiOdwrocony } from "./warnings"

const dodatnia = (v: number | null) => v === null || (Number.isFinite(v) && v > 0)
const nieujemna = (v: number | null) => v === null || (Number.isFinite(v) && v >= 0)
const katOk = (v: number | null) => v === null || (Number.isFinite(v) && v >= KAT_MIN_DEG && v <= KAT_MAX_DEG)

function sprawdzKat(e: Warning[], field: string, labelKey: string, v: number | null) {
  if (!katOk(v)) e.push(wartoscPozaZakresem(field, labelKey, v!, KAT_MIN_DEG, KAT_MAX_DEG))
}

export function validatePionowy(input: PionowyInput): Warning[] {
  const e: Warning[] = []
  if (!nieujemna(input.wysokoscDolnejKrawedziM)) e.push(wartoscUjemna("wysokoscDolnejKrawedziM", "POLE-WYSOKOSC-DOLNEJ-KRAWEDZI", input.wysokoscDolnejKrawedziM!))
  if (!nieujemna(input.wysokoscTrawySnieguCm)) e.push(wartoscUjemna("wysokoscTrawySnieguCm", "POLE-WYSOKOSC-TRAWY-ZASP", input.wysokoscTrawySnieguCm!))
  return e
}

export function validateWiatr(input: DaneWiatruInput & GeometriaStelazaInput): Warning[] {
  const e: Warning[] = []
  const { wysokoscNpmM: a, wspolczynnikPhi: phi } = input
  if (a !== null && input.strefaWiatrowa === 3 && a >= STALA_STREFY_3_NA1_M) e.push(wysokoscPozaWzoremStrefy3(a))
  if (phi !== null && !(Number.isFinite(phi) && phi >= PHI_MIN && phi <= PHI_MAX)) {
    e.push(wartoscPozaZakresem("wspolczynnikPhi", "POLE-ZABUDOWA-PHI", phi, PHI_MIN, PHI_MAX))
  }
  if (!dodatnia(input.dlugoscWzdluzSpaduM)) e.push(wartoscNiedodatnia("dlugoscWzdluzSpaduM", "POLE-DLUGOSC-WZDLUZ-SPADKU", input.dlugoscWzdluzSpaduM!))
  if (!dodatnia(input.szerokoscStelazaM)) e.push(wartoscNiedodatnia("szerokoscStelazaM", "POLE-SZEROKOSC-STELAZA", input.szerokoscStelazaM!))
  if (!nieujemna(input.wysokoscDolnejKrawedziM)) e.push(wartoscUjemna("wysokoscDolnejKrawedziM", "POLE-WYSOKOSC-DOLNEJ-KRAWEDZI", input.wysokoscDolnejKrawedziM!))
  if (!nieujemna(input.masaPaneliStelazaKg)) e.push(wartoscUjemna("masaPaneliStelazaKg", "POLE-MASA-PANELI-STELAZA", input.masaPaneliStelazaKg!))
  return e
}

export function validateDachPlaski(input: DaneWiatruInput & GeometriaStelazaInput & { nachylenieDeg: number | null }): Warning[] {
  const e = validateWiatr(input)
  sprawdzKat(e, "nachylenieDeg", "POLE-KAT-NACHYLENIA-STELAZA", input.nachylenieDeg)
  return e
}

export function validateRegulowany(input: DaneWiatruInput & GeometriaStelazaInput & { katMinDeg: number | null; katMaxDeg: number | null }): Warning[] {
  const e = validateWiatr(input)
  sprawdzKat(e, "katMinDeg", "POLE-NAJMNIEJSZY-KAT-REGULACJI", input.katMinDeg)
  sprawdzKat(e, "katMaxDeg", "POLE-NAJWIEKSZY-KAT-REGULACJI", input.katMaxDeg)
  const { katMinDeg: min, katMaxDeg: max } = input
  if (min !== null && max !== null && katOk(min) && katOk(max) && min > max) e.push(zakresRegulacjiOdwrocony(min, max))
  return e
}

export function validatePowierzchnie(input: PowierzchnieInput): Warning[] {
  const e: Warning[] = []
  const pr = input.wspolczynnikPr
  if (pr !== null && !(pr > 0 && pr <= PR_MAX)) e.push(prPozaZakresem(pr))
  for (const w of input.wybrane) {
    if (!dodatnia(w.mocKwp)) e.push(wartoscNiedodatnia("mocKwp", "POLE-MOC-PANELI-POWIERZCHNI", w.mocKwp!, w.nazwa))
  }
  return e
}

export function validateWiata(input: WiataInput): Warning[] {
  const e: Warning[] = []
  const pola: [keyof WiataInput, string][] = [
    ["dlugoscM", "POLE-DLUGOSC-WIATY"],
    ["szerokoscM", "POLE-SZEROKOSC-WIATY"],
    ["dlugoscPaneluM", "POLE-DLUGOSC-PANELU"],
    ["szerokoscPaneluM", "POLE-SZEROKOSC-PANELU"],
    ["mocPaneluW", "POLE-MOC-PANELU"],
  ]
  for (const [pole, labelKey] of pola) if (!dodatnia(input[pole])) e.push(wartoscNiedodatnia(pole, labelKey, input[pole]!))
  sprawdzKat(e, "nachylenieDeg", "POLE-KAT-NACHYLENIA-WIATY", input.nachylenieDeg)
  return e
}
