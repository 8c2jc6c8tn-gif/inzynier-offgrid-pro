import type { Warning } from "@/lib/core/calc-result"
import {
  FOV_MAX_DEG,
  FOV_MIN_DEG,
  NACHYLENIE_KAMERY_MAX_DEG,
  NACHYLENIE_KAMERY_MIN_DEG,
  OGNISKOWA_35MM_MAX_MM,
  OGNISKOWA_35MM_MIN_MM,
  PELNY_KAT_DEG,
  ROZMIAR_ZDJECIA_MAX_PX,
  ROZMIAR_ZDJECIA_MIN_PX,
} from "./constants"
import type { HoryzontZeZdjeciaInput } from "./input"
import { horzPozaZakresem, sloncePozaKadrem } from "./warnings"

const skonczona = (v: number | null): v is number => v !== null && Number.isFinite(v)

export function validateInput(input: HoryzontZeZdjeciaInput): { errors: Warning[] } {
  const e: Warning[] = []
  const { szerokoscPx: w, wysokoscPx: h, hfovDeg, ogniskowa35mmMm: f35, szerokoscGeograficzna: lat, dlugoscGeograficzna: lon } = input
  const rozmiarPoprawny = (v: number) => Number.isFinite(v) && v >= ROZMIAR_ZDJECIA_MIN_PX && v <= ROZMIAR_ZDJECIA_MAX_PX
  const zakresRozmiaru = `${ROZMIAR_ZDJECIA_MIN_PX}–${ROZMIAR_ZDJECIA_MAX_PX} px`
  if (w !== null && !rozmiarPoprawny(w)) e.push(horzPozaZakresem("HORZ-ROZMIAR-POZA-ZAKRESEM", "szerokoscPx", w, zakresRozmiaru))
  if (h !== null && !rozmiarPoprawny(h)) e.push(horzPozaZakresem("HORZ-ROZMIAR-POZA-ZAKRESEM", "wysokoscPx", h, zakresRozmiaru))
  if (hfovDeg !== null && !(skonczona(hfovDeg) && hfovDeg >= FOV_MIN_DEG && hfovDeg <= FOV_MAX_DEG)) {
    e.push(horzPozaZakresem("HORZ-FOV-POZA-ZAKRESEM", "hfovDeg", hfovDeg, `${FOV_MIN_DEG}–${FOV_MAX_DEG}°`))
  }
  if (f35 !== null && !(skonczona(f35) && f35 >= OGNISKOWA_35MM_MIN_MM && f35 <= OGNISKOWA_35MM_MAX_MM)) {
    e.push(horzPozaZakresem("HORZ-OGNISKOWA-POZA-ZAKRESEM", "ogniskowa35mmMm", f35, `${OGNISKOWA_35MM_MIN_MM}–${OGNISKOWA_35MM_MAX_MM} mm`))
  }
  if (lat !== null && !(skonczona(lat) && lat >= -90 && lat <= 90)) e.push(horzPozaZakresem("HORZ-SZEROKOSC-POZA-ZAKRESEM", "szerokoscGeograficzna", lat, "−90…90°"))
  if (lon !== null && !(skonczona(lon) && lon >= -180 && lon <= 180)) e.push(horzPozaZakresem("HORZ-DLUGOSC-POZA-ZAKRESEM", "dlugoscGeograficzna", lon, "−180…180°"))
  const o = input.orientacjaReczna
  if (o) {
    if (!(skonczona(o.azymutSrodkaDeg) && o.azymutSrodkaDeg >= 0 && o.azymutSrodkaDeg <= PELNY_KAT_DEG)) {
      e.push(horzPozaZakresem("HORZ-AZYMUT-POZA-ZAKRESEM", "azymutSrodkaDeg", o.azymutSrodkaDeg, `0–${PELNY_KAT_DEG}°`))
    }
    if (!(skonczona(o.nachylenieKameryDeg) && o.nachylenieKameryDeg >= NACHYLENIE_KAMERY_MIN_DEG && o.nachylenieKameryDeg <= NACHYLENIE_KAMERY_MAX_DEG)) {
      e.push(horzPozaZakresem("HORZ-NACHYLENIE-POZA-ZAKRESEM", "nachylenieKameryDeg", o.nachylenieKameryDeg, `${NACHYLENIE_KAMERY_MIN_DEG}…${NACHYLENIE_KAMERY_MAX_DEG}°`))
    }
  }
  const s = input.slonce
  if (s && w !== null && h !== null && !(s.x >= 0 && s.x <= w && s.y >= 0 && s.y <= h)) e.push(sloncePozaKadrem())
  return { errors: e }
}
