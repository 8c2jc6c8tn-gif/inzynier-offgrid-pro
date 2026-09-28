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

function sprawdzKat(e: Warning[], field: string, label: string, v: number | null) {
  if (!katOk(v)) e.push(wartoscPozaZakresem(field, label, v!, KAT_MIN_DEG, KAT_MAX_DEG))
}

export function validatePionowy(input: PionowyInput): Warning[] {
  const e: Warning[] = []
  if (!nieujemna(input.wysokoscDolnejKrawedziM)) e.push(wartoscUjemna("wysokoscDolnejKrawedziM", "Wysokość dolnej krawędzi", input.wysokoscDolnejKrawedziM!))
  if (!nieujemna(input.wysokoscTrawySnieguCm)) e.push(wartoscUjemna("wysokoscTrawySnieguCm", "Wysokość trawy/zasp", input.wysokoscTrawySnieguCm!))
  return e
}

export function validateWiatr(input: DaneWiatruInput & GeometriaStelazaInput): Warning[] {
  const e: Warning[] = []
  const { wysokoscNpmM: a, wspolczynnikPhi: phi } = input
  if (a !== null && input.strefaWiatrowa === 3 && a >= STALA_STREFY_3_NA1_M) e.push(wysokoscPozaWzoremStrefy3(a))
  if (phi !== null && !(Number.isFinite(phi) && phi >= PHI_MIN && phi <= PHI_MAX)) {
    e.push(wartoscPozaZakresem("wspolczynnikPhi", "zabudowa pod stelażem φ", phi, PHI_MIN, PHI_MAX))
  }
  if (!dodatnia(input.dlugoscWzdluzSpaduM)) e.push(wartoscNiedodatnia("dlugoscWzdluzSpaduM", "długość wzdłuż spadku", input.dlugoscWzdluzSpaduM!))
  if (!dodatnia(input.szerokoscStelazaM)) e.push(wartoscNiedodatnia("szerokoscStelazaM", "szerokość stelaża", input.szerokoscStelazaM!))
  if (!nieujemna(input.wysokoscDolnejKrawedziM)) e.push(wartoscUjemna("wysokoscDolnejKrawedziM", "Wysokość dolnej krawędzi", input.wysokoscDolnejKrawedziM!))
  if (!nieujemna(input.masaPaneliStelazaKg)) e.push(wartoscUjemna("masaPaneliStelazaKg", "Masa paneli i stelaża", input.masaPaneliStelazaKg!))
  return e
}

export function validateDachPlaski(input: DaneWiatruInput & GeometriaStelazaInput & { nachylenieDeg: number | null }): Warning[] {
  const e = validateWiatr(input)
  sprawdzKat(e, "nachylenieDeg", "kąt nachylenia stelaża", input.nachylenieDeg)
  return e
}

export function validateRegulowany(input: DaneWiatruInput & GeometriaStelazaInput & { katMinDeg: number | null; katMaxDeg: number | null }): Warning[] {
  const e = validateWiatr(input)
  sprawdzKat(e, "katMinDeg", "najmniejszy kąt regulacji", input.katMinDeg)
  sprawdzKat(e, "katMaxDeg", "największy kąt regulacji", input.katMaxDeg)
  const { katMinDeg: min, katMaxDeg: max } = input
  if (min !== null && max !== null && katOk(min) && katOk(max) && min > max) e.push(zakresRegulacjiOdwrocony(min, max))
  return e
}

export function validatePowierzchnie(input: PowierzchnieInput): Warning[] {
  const e: Warning[] = []
  const pr = input.wspolczynnikPr
  if (pr !== null && !(pr > 0 && pr <= PR_MAX)) e.push(prPozaZakresem(pr))
  for (const w of input.wybrane) {
    if (!dodatnia(w.mocKwp)) e.push(wartoscNiedodatnia("mocKwp", `moc paneli (${w.nazwa})`, w.mocKwp!))
  }
  return e
}

export function validateWiata(input: WiataInput): Warning[] {
  const e: Warning[] = []
  const pola: [keyof WiataInput, string][] = [
    ["dlugoscM", "długość wiaty"],
    ["szerokoscM", "szerokość wiaty"],
    ["dlugoscPaneluM", "długość panelu"],
    ["szerokoscPaneluM", "szerokość panelu"],
    ["mocPaneluW", "moc panelu"],
  ]
  for (const [pole, etykieta] of pola) if (!dodatnia(input[pole])) e.push(wartoscNiedodatnia(pole, etykieta, input[pole]!))
  sprawdzKat(e, "nachylenieDeg", "kąt nachylenia wiaty", input.nachylenieDeg)
  return e
}
