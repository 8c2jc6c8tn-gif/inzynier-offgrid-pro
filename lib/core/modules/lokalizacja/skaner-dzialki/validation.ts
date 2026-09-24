import type { Warning } from "@/lib/core/calc-result"
import {
  DLUGOSC_MAX,
  DLUGOSC_MIN,
  MIN_PUNKTOW_POLACI,
  MIN_PUNKTOW_WIELOKATA,
  SZEROKOSC_MAX,
  SZEROKOSC_MIN,
} from "./constants"
import type { PunktGps, SkanerDzialkiInput } from "./input"
import {
  kalibracjaNiepoprawna,
  polacBezWysokosci,
  przeszkodaNiepoprawna,
  przeszkodaObrysNiepoprawna,
  punktGpsPozaZakresem,
  zaMaloPunktow,
} from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

function poprawny(p: PunktGps): boolean {
  return (
    Number.isFinite(p.szerokosc) &&
    Number.isFinite(p.dlugosc) &&
    p.szerokosc >= SZEROKOSC_MIN &&
    p.szerokosc <= SZEROKOSC_MAX &&
    p.dlugosc >= DLUGOSC_MIN &&
    p.dlugosc <= DLUGOSC_MAX
  )
}

function sprawdzZbior(errors: Warning[], nazwa: string, punkty: PunktGps[] | undefined, min: number) {
  if (!punkty || punkty.length === 0) return
  if (punkty.length < min) errors.push(zaMaloPunktow(nazwa, min))
  punkty.forEach((p, i) => {
    if (!poprawny(p)) errors.push(punktGpsPozaZakresem(nazwa, i))
  })
}

export function validateInput(input: SkanerDzialkiInput): ValidationResult {
  const errors: Warning[] = []

  sprawdzZbior(errors, "punktyDzialki", input.punktyDzialki, MIN_PUNKTOW_WIELOKATA)
  sprawdzZbior(errors, "punktyBudynku", input.punktyBudynku, MIN_PUNKTOW_WIELOKATA)

  for (const polac of input.polacie ?? []) {
    sprawdzZbior(errors, `polacie:${polac.nazwa}`, polac.punkty, MIN_PUNKTOW_POLACI)
    if (polac.punkty.length === 0) errors.push(zaMaloPunktow(`polacie:${polac.nazwa}`, MIN_PUNKTOW_POLACI))
    if (polac.punkty.some((p) => p.wysokoscM === undefined || !Number.isFinite(p.wysokoscM))) {
      errors.push(polacBezWysokosci(polac.nazwa))
    }
  }

  for (const p of input.przeszkody ?? []) {
    if (p.typ === "obrys") {
      sprawdzZbior(errors, `przeszkody:${p.nazwa}`, p.obrys, MIN_PUNKTOW_WIELOKATA)
      if (p.obrys.length === 0) errors.push(zaMaloPunktow(`przeszkody:${p.nazwa}`, MIN_PUNKTOW_WIELOKATA))
      if (!(p.wysokoscM >= 0)) errors.push(przeszkodaObrysNiepoprawna(p.nazwa))
      continue
    }
    if (!poprawny(p.punkt)) errors.push(punktGpsPozaZakresem(`przeszkody:${p.nazwa}`, 0))
    if (!(p.wysokoscM >= 0) || !(p.promienM > 0)) errors.push(przeszkodaNiepoprawna(p.nazwa))
  }

  const k = input.kalibracja
  if (k) {
    const zbior = k.zbior === "dzialka" ? input.punktyDzialki : input.punktyBudynku
    if (!zbior || k.indeksA < 0 || k.indeksB < 0 || k.indeksA >= zbior.length || k.indeksB >= zbior.length) {
      errors.push(kalibracjaNiepoprawna("indeks punktu poza zbiorem"))
    } else if (k.indeksA === k.indeksB) {
      errors.push(kalibracjaNiepoprawna("indeksA = indeksB"))
    }
    if (!(k.znanaDlugoscM > 0)) errors.push(kalibracjaNiepoprawna("znanaDlugoscM <= 0"))
  }

  return { errors, warnings: [] }
}
