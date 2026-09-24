// 🔎 TD14 (dlug-techniczny.md): strata tylko promieniowania bezpośredniego przy bezchmurnym niebie;
// rozproszone, zachmurzenie (PVGIS TMY) i przezierność drzew liściastych zimą nie są modelowane.
import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import {
  cosKataPadania,
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import {
  DNI_W_ROKU_REFERENCYJNYM,
  KROK_MIN,
  MIESIECY,
  MS_NA_DOBE,
  MS_NA_MINUTE,
  ROK_REFERENCYJNY,
} from "./constants"
import type { AnalizaZacienieniaInput, Punkt3D, Przeszkoda } from "./input"
import { katPrzeszkodyDeg, profilHoryzontuDeg } from "./przeszkody"
import { validateInput } from "./validation"
import { powierzchniaNieoswietlona } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "S = \\dfrac{\\sum_t I_b(t)\\,\\cos\\theta(t)\\,[h_s(t) < h_p(\\gamma_s(t))]}{\\sum_t I_b(t)\\,\\cos\\theta(t)},\\quad h_p = \\arctan\\dfrac{H - z}{d}"

export type UdzialPrzeszkody = { nazwa: string; procent: number }

export type ScenariuszZacienienia = {
  /** Roczna strata promieniowania bezpośredniego na płaszczyźnie [%]. */
  strataRocznaProcent: number
  /** Strata w poszczególnych miesiącach (indeks 0 = styczeń) [%]. */
  strataMiesiecznaProcent: number[]
  /** Udział każdej przeszkody w rocznej stracie [punkty procentowe, suma = strataRocznaProcent]. */
  udzialPrzeszkod: UdzialPrzeszkody[]
  /** Kąt wzniesienia horyzontu przeszkód co KROK_PROFILU_HORYZONTU_DEG, od azymutu 0° [°]. */
  profilHoryzontuDeg: number[]
}

export type AnalizaZacienieniaResult = {
  obecnie: ScenariuszZacienienia
  /** Tylko gdy któreś drzewo ma `wysokoscPrognozowanaM`. */
  prognoza: ScenariuszZacienienia | null
}

type Probka = { miesiac: number; azymutDeg: number; wysokoscDeg: number; waga: number }

/** Pozycje słońca z niezerową wagą promieniowania bezpośredniego na płaszczyźnie, dla całego roku. */
function probkiRoku(lat: number, lon: number, nachylenie: number, azymutPow: number): Probka[] {
  const probki: Probka[] = []
  const start = Date.UTC(ROK_REFERENCYJNY, 0, 1)
  const krokowNaDobe = (24 * 60) / KROK_MIN
  for (let d = 0; d < DNI_W_ROKU_REFERENCYJNYM; d++) {
    const poczatekDnia = start + d * MS_NA_DOBE
    const miesiac = new Date(poczatekDnia).getUTCMonth()
    for (let k = 0; k < krokowNaDobe; k++) {
      const p = pozycjaSlonca(lat, lon, poczatekDnia + k * KROK_MIN * MS_NA_MINUTE)
      if (p.wysokoscDeg <= 0) continue
      const cosTheta = cosKataPadania(p.wysokoscDeg, p.azymutDeg, nachylenie, azymutPow)
      if (cosTheta <= 0) continue
      const waga = promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) * cosTheta
      if (waga > 0) probki.push({ miesiac, azymutDeg: p.azymutDeg, wysokoscDeg: p.wysokoscDeg, waga })
    }
  }
  return probki
}

function scenariusz(
  probki: Probka[],
  punkt: Punkt3D,
  przeszkody: Przeszkoda[],
  wysokosci: number[],
): ScenariuszZacienienia {
  const sumaMies = new Array<number>(MIESIECY).fill(0)
  const zablokMies = new Array<number>(MIESIECY).fill(0)
  const zablokPrzeszkod = new Array<number>(przeszkody.length).fill(0)
  let suma = 0

  for (const s of probki) {
    suma += s.waga
    sumaMies[s.miesiac]! += s.waga
    let najwyzszy = -1
    let najwyzszyKat = 0
    for (let i = 0; i < przeszkody.length; i++) {
      const kat = katPrzeszkodyDeg(punkt, s.azymutDeg, przeszkody[i]!, wysokosci[i]!)
      if (kat > najwyzszyKat) {
        najwyzszyKat = kat
        najwyzszy = i
      }
    }
    if (najwyzszy >= 0 && s.wysokoscDeg < najwyzszyKat) {
      zablokMies[s.miesiac]! += s.waga
      zablokPrzeszkod[najwyzszy]! += s.waga
    }
  }

  const procent = (czesc: number, calosc: number) => (calosc > 0 ? (100 * czesc) / calosc : 0)
  const zablokowane = zablokMies.reduce((a, b) => a + b, 0)

  return {
    strataRocznaProcent: procent(zablokowane, suma),
    strataMiesiecznaProcent: sumaMies.map((s, m) => procent(zablokMies[m]!, s)),
    udzialPrzeszkod: przeszkody.map((p, i) => ({ nazwa: p.nazwa, procent: procent(zablokPrzeszkod[i]!, suma) })),
    profilHoryzontuDeg: profilHoryzontuDeg(punkt, przeszkody, wysokosci),
  }
}

/**
 * Ekran 3, Moduł 1 — "Analiza zacienienia (horyzont cieni)" (dawne 0.3, Wzorzec D).
 *
 * Źródło (B): "algorytm dla każdej godziny dnia, w każdym miesiącu, sprawdza czy promień słońca
 * jest zasłaniany przez przeszkodę; uwzględnia wzrost drzew w perspektywie lat; sumuje roczną
 * stratę energii". Realizacja: pozycja słońca co KROK_MIN minut przez cały rok (NOAA/Meeus),
 * promień zasłonięty, gdy wysokość słońca < kąt wzniesienia przeszkody w jego azymucie; strata
 * ważona promieniowaniem bezpośrednim padającym na płaszczyznę (Meinel·cos θ).
 *
 * Uczciwy zakres wyniku (patrz założenia): to strata promieniowania BEZPOŚREDNIEGO przy
 * bezchmurnym niebie — nie całkowitej energii. Rozproszone i zachmurzenie wymagają danych
 * godzinowych (PVGIS TMY, D22) — dług TD w dlug-techniczny.md. Przykład "12%" ze źródła jest
 * ilustracją, nie wartością do odtworzenia.
 */
export function calculateAnalizaZacienienia(
  input: AnalizaZacienieniaInput,
): CalcResult<AnalizaZacienieniaResult> {
  const { errors, warnings } = validateInput(input)
  const przeszkody = input.przeszkody ?? []
  const inputs = {
    szerokoscGeograficzna: input.szerokoscGeograficzna ?? 0,
    dlugoscGeograficzna: input.dlugoscGeograficzna ?? 0,
    nachyleniePowierzchniDeg: input.nachyleniePowierzchniDeg ?? 0,
    azymutPowierzchniDeg: input.azymutPowierzchniDeg ?? 0,
    wysokoscPunktuM: input.punkt?.z ?? 0,
    liczbaPrzeszkod: przeszkody.length,
  }
  const pusty: AnalizaZacienieniaResult = {
    obecnie: { strataRocznaProcent: 0, strataMiesiecznaProcent: [], udzialPrzeszkod: [], profilHoryzontuDeg: [] },
    prognoza: null,
  }
  const wynik = (
    status: CalcResult<AnalizaZacienieniaResult>["status"],
    value: AnalizaZacienieniaResult,
    w: CalcResult<AnalizaZacienieniaResult>["warnings"],
    assumptions: Assumption[] = [],
  ): CalcResult<AnalizaZacienieniaResult> => ({
    value,
    unit: "%",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings: w,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", pusty, errors)

  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, punkt } = input
  const nachylenie = input.nachyleniePowierzchniDeg
  const azymutPow = input.azymutPowierzchniDeg
  if (lat === undefined || lon === undefined || !punkt || nachylenie === undefined || azymutPow === undefined) {
    return wynik("INCOMPLETE", pusty, warnings)
  }

  const probki = probkiRoku(lat, lon, nachylenie, azymutPow)
  if (probki.length === 0) {
    return wynik("VALID_WITH_WARNINGS", pusty, [...warnings, powierzchniaNieoswietlona()])
  }

  const obecnie = scenariusz(
    probki,
    punkt,
    przeszkody,
    przeszkody.map((p) => p.wysokoscM),
  )
  const maPrognoze = przeszkody.some((p) => p.typ === "drzewo" && p.wysokoscPrognozowanaM !== undefined)
  const prognoza = maPrognoze
    ? scenariusz(
        probki,
        punkt,
        przeszkody,
        przeszkody.map((p) => (p.typ === "drzewo" ? (p.wysokoscPrognozowanaM ?? p.wysokoscM) : p.wysokoscM)),
      )
    : null

  const assumptions: Assumption[] = [
    { kod: "ZACIENIENIE-ZALOZENIE-BEZPOSREDNIE-CZYSTE-NIEBO" },
    { kod: "ZACIENIENIE-ZALOZENIE-JEDEN-PUNKT" },
  ]
  if (przeszkody.some((p) => p.typ === "drzewo")) assumptions.push({ kod: "ZACIENIENIE-ZALOZENIE-DRZEWA-NIEPRZEZROCZYSTE" })
  if (prognoza) assumptions.push({ kod: "ZACIENIENIE-ZALOZENIE-PROGNOZA", params: { lata: input.latPrognozy ?? "?" } })

  return wynik(warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID", { obecnie, prognoza }, warnings, assumptions)
}
