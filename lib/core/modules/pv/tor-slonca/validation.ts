import type { Warning } from "@/lib/core/calc-result"
import { MOC_KWP_MAKS, MIESIECY, PR_MAKS } from "./constants"
import type { TorSloncaInput } from "./input"
import { torsPozaZakresem } from "./warnings"

const skonczona = (v: number | null): v is number => v !== null && Number.isFinite(v)

export function validateInput(input: TorSloncaInput): { errors: Warning[] } {
  const e: Warning[] = []
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, miesiac, nachylenieDeg: b, azymutDeg: az, mocKwp: p, pr } = input
  if (lat !== null && !(skonczona(lat) && lat >= -90 && lat <= 90)) e.push(torsPozaZakresem("TORS-SZEROKOSC-POZA-ZAKRESEM", "szerokoscGeograficzna", lat, "−90…90°"))
  if (lon !== null && !(skonczona(lon) && lon >= -180 && lon <= 180)) e.push(torsPozaZakresem("TORS-DLUGOSC-POZA-ZAKRESEM", "dlugoscGeograficzna", lon, "−180…180°"))
  if (miesiac !== null && !(Number.isInteger(miesiac) && miesiac >= 1 && miesiac <= MIESIECY)) e.push(torsPozaZakresem("TORS-MIESIAC-POZA-ZAKRESEM", "miesiac", miesiac, "1–12"))
  if (b !== null && !(skonczona(b) && b >= 0 && b <= 90)) e.push(torsPozaZakresem("TORS-NACHYLENIE-POZA-ZAKRESEM", "nachylenieDeg", b, "0–90°"))
  if (az !== null && !(skonczona(az) && az >= 0 && az <= 360)) e.push(torsPozaZakresem("TORS-AZYMUT-POZA-ZAKRESEM", "azymutDeg", az, "0–360°"))
  if (p !== null && !(skonczona(p) && p > 0 && p <= MOC_KWP_MAKS)) e.push(torsPozaZakresem("TORS-MOC-POZA-ZAKRESEM", "mocKwp", p, `0–${MOC_KWP_MAKS} kWp`))
  if (pr !== null && !(skonczona(pr) && pr > 0 && pr <= PR_MAKS)) e.push(torsPozaZakresem("TORS-PR-POZA-ZAKRESEM", "pr", pr, `0–${PR_MAKS}`))
  if (input.albedo !== undefined && !(Number.isFinite(input.albedo) && input.albedo >= 0 && input.albedo <= 1)) {
    e.push(torsPozaZakresem("TORS-ALBEDO-POZA-ZAKRESEM", "albedo", input.albedo, "0–1"))
  }
  return { errors: e }
}
