import type { Warning } from "@/lib/core/calc-result"
import { KAT_MAX_DEG, KAT_MIN_DEG, PR_MAX } from "../kat-i-azymut/constants"
import { prPozaZakresem } from "../kat-i-azymut/warnings"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "../zloty-srodek/warnings"
import type { LiczbaPaneliInput } from "./input"
import { miesiacPozaZakresem, sezonBezMiesiecy } from "./warnings"

const dodatnia = (v: number | null) => v === null || (Number.isFinite(v) && v > 0)

export function validateInput(input: LiczbaPaneliInput): Warning[] {
  const e: Warning[] = []
  const kat = input.nachylenieDeg
  if (kat !== null && !(Number.isFinite(kat) && kat >= KAT_MIN_DEG && kat <= KAT_MAX_DEG)) {
    e.push(wartoscPozaZakresem("nachylenieDeg", "POLE-KAT-POCHYLENIA", kat, KAT_MIN_DEG, KAT_MAX_DEG))
  }
  if (!dodatnia(input.mocPaneluWp)) e.push(wartoscNiedodatnia("mocPaneluWp", "POLE-MOC-PANELU", input.mocPaneluWp!))
  if (!dodatnia(input.powierzchniaPaneluM2)) e.push(wartoscNiedodatnia("powierzchniaPaneluM2", "POLE-POWIERZCHNIA-PANELU", input.powierzchniaPaneluM2!))
  const pr = input.wspolczynnikPr
  if (pr !== null && !(pr > 0 && pr <= PR_MAX)) e.push(prPozaZakresem(pr))
  if (!dodatnia(input.zapotrzebowanieDoboweKwh)) {
    e.push(wartoscNiedodatnia("zapotrzebowanieDoboweKwh", "POLE-ZAPOTRZEBOWANIE-DOBOWE", input.zapotrzebowanieDoboweKwh!))
  }
  const extra = input.dodatkoweZimaKwhDzien
  if (extra !== null && !(Number.isFinite(extra) && extra >= 0)) e.push(wartoscUjemna("dodatkoweZimaKwhDzien", "POLE-DODATKOWE-ZAPOTRZEBOWANIE-ZIMA", extra))
  for (const m of input.miesiaceGrzewcze) if (!(Number.isInteger(m) && m >= 0 && m <= 11)) e.push(miesiacPozaZakresem(m))
  if (extra !== null && extra > 0 && input.miesiaceGrzewcze.length === 0) e.push(sezonBezMiesiecy())
  const limit = input.limitMontazowy
  if (limit !== null && !(Number.isInteger(limit) && limit > 0)) e.push(wartoscNiedodatnia("limitMontazowy", "POLE-LIMIT-MONTAZOWY", limit))
  return e
}
