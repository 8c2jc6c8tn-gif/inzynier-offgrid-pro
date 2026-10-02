import type { Warning } from "@/lib/core/calc-result"
import { STALA_STREFY_3_NA1_M } from "../eurokod-1/wiatr"
import { KAT_MAX_DEG, KAT_MIN_DEG, PR_MAX } from "../kat-i-azymut/constants"
import { prPozaZakresem } from "../kat-i-azymut/warnings"
import { PHI_MAX, PHI_MIN } from "./constants"
import type { ZlotySrodekInput } from "./input"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna, wysokoscPozaWzoremStrefy3 } from "./warnings"

const dodatnia = (v: number | null) => v === null || (Number.isFinite(v) && v > 0)
const nieujemna = (v: number | null) => v === null || (Number.isFinite(v) && v >= 0)

export function validateInput(input: ZlotySrodekInput): Warning[] {
  const e: Warning[] = []
  const { wysokoscNpmM: a, wspolczynnikPhi: phi, nachylenieDeg: kat, wspolczynnikPr: pr } = input
  if (a !== null && input.strefaWiatrowa === 3 && a >= STALA_STREFY_3_NA1_M) e.push(wysokoscPozaWzoremStrefy3(a))
  if (!dodatnia(input.wysokoscKonstrukcjiM)) e.push(wartoscNiedodatnia("wysokoscKonstrukcjiM", "POLE-WYSOKOSC-STELAZA", input.wysokoscKonstrukcjiM!))
  if (!dodatnia(input.powierzchniaPaneliM2)) e.push(wartoscNiedodatnia("powierzchniaPaneliM2", "POLE-POWIERZCHNIA-PANELI", input.powierzchniaPaneliM2!))
  if (phi !== null && !(Number.isFinite(phi) && phi >= PHI_MIN && phi <= PHI_MAX)) {
    e.push(wartoscPozaZakresem("wspolczynnikPhi", "POLE-ZABUDOWA-PHI", phi, PHI_MIN, PHI_MAX))
  }
  if (!nieujemna(input.masaPaneliStelazaKg)) e.push(wartoscUjemna("masaPaneliStelazaKg", "POLE-MASA-PANELI-STELAZA", input.masaPaneliStelazaKg!))
  if (!nieujemna(input.cenaBalastuZlKg)) e.push(wartoscUjemna("cenaBalastuZlKg", "POLE-CENA-BALASTU", input.cenaBalastuZlKg!))
  if (!dodatnia(input.mocInstalacjiKwp)) e.push(wartoscNiedodatnia("mocInstalacjiKwp", "POLE-MOC-INSTALACJI", input.mocInstalacjiKwp!))
  if (pr !== null && !(pr > 0 && pr <= PR_MAX)) e.push(prPozaZakresem(pr))
  if (!nieujemna(input.cenaEnergiiZlKwh)) e.push(wartoscUjemna("cenaEnergiiZlKwh", "POLE-CENA-ENERGII", input.cenaEnergiiZlKwh!))
  if (!dodatnia(input.liczbaLat)) e.push(wartoscNiedodatnia("liczbaLat", "POLE-LICZBA-LAT", input.liczbaLat!))
  if (kat !== null && !(Number.isFinite(kat) && kat >= KAT_MIN_DEG && kat <= KAT_MAX_DEG)) {
    e.push(wartoscPozaZakresem("nachylenieDeg", "POLE-KAT-POCHYLENIA", kat, KAT_MIN_DEG, KAT_MAX_DEG))
  }
  return e
}
