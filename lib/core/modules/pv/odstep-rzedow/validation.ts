import type { Warning } from "@/lib/core/calc-result"
import { DLUGOSC_MAKS_M } from "./constants"
import type { OdstepRzedowInput } from "./input"
import { odrzPozaZakresem } from "./warnings"

const skonczona = (v: number | null): v is number => v !== null && Number.isFinite(v)

export function validateInput(input: OdstepRzedowInput): { errors: Warning[] } {
  const e: Warning[] = []
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, nachylenieDeg: b, azymutDeg: az, dlugoscWzdluzSpaduM: l } = input
  if (lat !== null && !(skonczona(lat) && lat >= -90 && lat <= 90)) e.push(odrzPozaZakresem("ODRZ-SZEROKOSC-POZA-ZAKRESEM", "szerokoscGeograficzna", lat, "−90…90°"))
  if (lon !== null && !(skonczona(lon) && lon >= -180 && lon <= 180)) e.push(odrzPozaZakresem("ODRZ-DLUGOSC-GEO-POZA-ZAKRESEM", "dlugoscGeograficzna", lon, "−180…180°"))
  if (b !== null && !(skonczona(b) && b >= 0 && b <= 90)) e.push(odrzPozaZakresem("ODRZ-NACHYLENIE-POZA-ZAKRESEM", "nachylenieDeg", b, "0–90°"))
  if (az !== null && !(skonczona(az) && az >= 0 && az <= 360)) e.push(odrzPozaZakresem("ODRZ-AZYMUT-POZA-ZAKRESEM", "azymutDeg", az, "0–360°"))
  if (l !== null && !(skonczona(l) && l > 0 && l <= DLUGOSC_MAKS_M)) e.push(odrzPozaZakresem("ODRZ-DLUGOSC-STOLU-POZA-ZAKRESEM", "dlugoscWzdluzSpaduM", l, `0–${DLUGOSC_MAKS_M} m`))
  const { oknoOdH: od, oknoDoH: doH } = input
  if (od !== null && doH !== null && !(skonczona(od) && skonczona(doH) && od >= 0 && doH <= 24 && od < doH)) {
    e.push(odrzPozaZakresem("ODRZ-OKNO-POZA-ZAKRESEM", "oknoOdH", od, "0 ≤ od < do ≤ 24 godz."))
  }
  if (input.odstepM !== null && !(skonczona(input.odstepM) && input.odstepM > 0)) e.push(odrzPozaZakresem("ODRZ-ODSTEP-POZA-ZAKRESEM", "odstepM", input.odstepM, "> 0 m"))
  const s = input.docelowaStrataZimaPct
  if (s !== null && !(skonczona(s) && s > 0 && s < 100)) e.push(odrzPozaZakresem("ODRZ-STRATA-DOCELOWA-POZA-ZAKRESEM", "docelowaStrataZimaPct", s, "0–100%"))
  const n = input.liczbaRzedow
  if (n !== null && !(Number.isInteger(n) && n >= 1)) e.push(odrzPozaZakresem("ODRZ-LICZBA-RZEDOW-POZA-ZAKRESEM", "liczbaRzedow", n, "całkowita >= 1"))
  if (input.albedo !== undefined && !(Number.isFinite(input.albedo) && input.albedo >= 0 && input.albedo <= 1)) {
    e.push(odrzPozaZakresem("ODRZ-ALBEDO-POZA-ZAKRESEM", "albedo", input.albedo, "0–1"))
  }
  return { errors: e }
}
