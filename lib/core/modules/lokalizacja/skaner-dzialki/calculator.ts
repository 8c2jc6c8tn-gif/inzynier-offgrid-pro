import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { EPS_DLUGOSCI_M } from "./constants"
import {
  azymutWektora,
  normalnaNewella,
  obwod,
  orientacjaPlaszczyzny,
  poleZeZnakiem,
  rzutujNaUkladLokalny,
  type PunktLokalny,
} from "./geometria"
import type { PunktGps, SkanerDzialkiInput } from "./input"
import { validateInput } from "./validation"
import { brakWysokosciGruntu, kalibracjaNiepoprawna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "x = \\Delta\\lambda\\,N\\cos\\varphi_0,\\; y = \\Delta\\varphi\\,M;\\quad s = \\dfrac{L_{znana}}{L_{GPS}};\\quad \\beta = \\arccos n_z,\\; \\gamma = \\operatorname{atan2}(n_x, n_y)"

export type Sciana = {
  /** Indeksy narożników (0-based) w kolejności obchodzenia. */
  od: number
  do: number
  dlugoscM: number
  /** Kierunek, w który ściana "patrzy" (normalna zewnętrzna) [°]. */
  azymutDeg: number
}

export type WynikPolaci = {
  nazwa: string
  nachylenieDeg: number
  /** null — połać płaska (azymut nieokreślony). */
  azymutDeg: number | null
  /** Pole rzutu poziomego [m²]. */
  poleRzutuM2: number
  /** Pole rzeczywiste połaci (rzut / cos β) [m²]. */
  poleRzeczywisteM2: number
  /** Największa odległość punktu od dopasowanej płaszczyzny [m] — miara niepłaskości/błędu GPS. */
  odchylenieOdPlaszczyznyM: number
}

export type PrzeszkodaLokalna =
  | { typ: "walec"; nazwa: string; x: number; y: number; wysokoscM: number; promienM: number }
  | { typ: "obrys"; nazwa: string; obrys: { x: number; y: number }[]; wysokoscM: number }

export type SkanerDzialkiResult = {
  /** Punkt odniesienia układu lokalnego (x = 0, y = 0). */
  odniesienie: PunktGps | null
  skalaKalibracji: number | null
  dzialka: { punkty: PunktLokalny[]; powierzchniaM2: number; obwodM: number } | null
  budynek: { punkty: PunktLokalny[]; powierzchniaM2: number; sciany: Sciana[] } | null
  polacie: WynikPolaci[]
  /** Najwyższy punkt połaci ponad średnią wysokość narożników budynku przy gruncie [m]. */
  wysokoscKalenicyM: number | null
  przeszkody: PrzeszkodaLokalna[]
}

function skaluj(punkty: PunktLokalny[], s: number): PunktLokalny[] {
  return punkty.map((p) => ({ x: p.x * s, y: p.y * s, z: p.z }))
}

function sciany(punkty: PunktLokalny[]): Sciana[] {
  const ccw = poleZeZnakiem(punkty) > 0
  return punkty.map((a, i) => {
    const j = (i + 1) % punkty.length
    const b = punkty[j]!
    const ex = b.x - a.x
    const ey = b.y - a.y
    // Normalna zewnętrzna: po prawej stronie kierunku obchodzenia dla CCW, po lewej dla CW.
    const azymutDeg = ccw ? azymutWektora(ey, -ex) : azymutWektora(-ey, ex)
    return { od: i, do: j, dlugoscM: Math.hypot(ex, ey), azymutDeg }
  })
}

function polac(nazwa: string, punkty: { x: number; y: number; z: number }[]): WynikPolaci {
  const n = normalnaNewella(punkty)
  const { nachylenieDeg, azymutDeg } = orientacjaPlaszczyzny(n)
  const sx = punkty.reduce((a, p) => a + p.x, 0) / punkty.length
  const sy = punkty.reduce((a, p) => a + p.y, 0) / punkty.length
  const sz = punkty.reduce((a, p) => a + p.z, 0) / punkty.length
  const odchylenieOdPlaszczyznyM = Math.max(
    ...punkty.map((p) => Math.abs((p.x - sx) * n.nx + (p.y - sy) * n.ny + (p.z - sz) * n.nz)),
  )
  const poleRzutuM2 = Math.abs(poleZeZnakiem(punkty))
  return {
    nazwa,
    nachylenieDeg,
    azymutDeg,
    poleRzutuM2,
    poleRzeczywisteM2: n.nz > 0 ? poleRzutuM2 / n.nz : 0,
    odchylenieOdPlaszczyznyM,
  }
}

/**
 * Ekran 2, Moduł 1 — "Skaner działki" (dawne 0.2, Wzorzec A). Wynik wspólny obu trybów ze źródła:
 * "wyznacza azymut każdej ściany, kąt nachylenia połaci dachowych, wysokość kalenicy" + kalibracja
 * znanym wymiarem ("wpisanie znanego wymiaru (np. długość ściany 12 m), żeby skorygować błąd GPS").
 * Kalibracja skaluje wyłącznie wymiary poziome — błąd wysokości GPS nie jest nią korygowany
 * (założenie jawne). Wykrywanie przeszkód: przeszkody wskazane przez użytkownika na spacerze
 * (walec — drzewo; obrys wielokąta — sąsiedni budynek) są przenoszone do układu lokalnego, z tą samą
 * kalibracją poziomą, jako wejście Ekranu 3 (Analiza zacienienia).
 */
export function calculateSkanerDzialki(input: SkanerDzialkiInput): CalcResult<SkanerDzialkiResult> {
  const { errors } = validateInput(input)
  const dz = input.punktyDzialki ?? []
  const bud = input.punktyBudynku ?? []
  const inputs = {
    liczbaPunktowDzialki: dz.length,
    liczbaPunktowBudynku: bud.length,
    liczbaPolaci: input.polacie?.length ?? 0,
    liczbaPrzeszkod: input.przeszkody?.length ?? 0,
    znanaDlugoscM: input.kalibracja?.znanaDlugoscM ?? 0,
  }
  const pusty: SkanerDzialkiResult = {
    odniesienie: null,
    skalaKalibracji: null,
    dzialka: null,
    budynek: null,
    polacie: [],
    wysokoscKalenicyM: null,
    przeszkody: [],
  }
  const wynik = (
    status: CalcResult<SkanerDzialkiResult>["status"],
    value: SkanerDzialkiResult,
    warnings: Warning[],
    assumptions: Assumption[] = [],
  ): CalcResult<SkanerDzialkiResult> => ({
    value,
    unit: "m",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", pusty, errors)

  const odniesienie = dz[0] ?? bud[0]
  if (!odniesienie) return wynik("INCOMPLETE", pusty, [])

  const rzut = (punkty: PunktGps[]) => punkty.map((p) => rzutujNaUkladLokalny(p, odniesienie))
  let dzL = rzut(dz)
  let budL = rzut(bud)

  let skalaKalibracji: number | null = null
  const k = input.kalibracja
  if (k) {
    const zbior = k.zbior === "dzialka" ? dzL : budL
    const a = zbior[k.indeksA]!
    const b = zbior[k.indeksB]!
    const zmierzona = Math.hypot(b.x - a.x, b.y - a.y)
    if (zmierzona < EPS_DLUGOSCI_M) {
      return wynik("INVALID_INPUT", pusty, [kalibracjaNiepoprawna("punkty A i B w tym samym miejscu (długość GPS = 0)")])
    }
    skalaKalibracji = k.znanaDlugoscM / zmierzona
    dzL = skaluj(dzL, skalaKalibracji)
    budL = skaluj(budL, skalaKalibracji)
  }
  const s = skalaKalibracji ?? 1

  const polacieWynik = (input.polacie ?? []).map((pl) =>
    polac(
      pl.nazwa,
      rzut(pl.punkty).map((p) => ({ x: p.x * s, y: p.y * s, z: p.z! })),
    ),
  )

  const warnings: Warning[] = []
  let wysokoscKalenicyM: number | null = null
  const wysokosciGruntu = bud.map((p) => p.wysokoscM).filter((z): z is number => z !== undefined)
  const wysokosciDachu = (input.polacie ?? []).flatMap((pl) => pl.punkty.map((p) => p.wysokoscM!))
  if (wysokosciDachu.length > 0) {
    if (wysokosciGruntu.length === 0) warnings.push(brakWysokosciGruntu())
    else {
      const grunt = wysokosciGruntu.reduce((a, z) => a + z, 0) / wysokosciGruntu.length
      wysokoscKalenicyM = Math.max(...wysokosciDachu) - grunt
    }
  }

  const przeszkody = (input.przeszkody ?? []).map((p): PrzeszkodaLokalna => {
    if (p.typ === "obrys") {
      const obrys = rzut(p.obrys).map((l) => ({ x: l.x * s, y: l.y * s }))
      return { typ: "obrys", nazwa: p.nazwa, obrys, wysokoscM: p.wysokoscM }
    }
    const l = rzutujNaUkladLokalny(p.punkt, odniesienie)
    return { typ: "walec", nazwa: p.nazwa, x: l.x * s, y: l.y * s, wysokoscM: p.wysokoscM, promienM: p.promienM }
  })

  const assumptions: Assumption[] = [{ kod: "SKANER-ZALOZENIE-UKLAD-LOKALNY" }]
  if (skalaKalibracji !== null) assumptions.push({ kod: "SKANER-ZALOZENIE-KALIBRACJA-POZIOMA" })
  if (polacieWynik.length > 0) assumptions.push({ kod: "SKANER-ZALOZENIE-WYSOKOSC-GPS" })

  return wynik(
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    {
      odniesienie,
      skalaKalibracji,
      dzialka: dzL.length > 0 ? { punkty: dzL, powierzchniaM2: Math.abs(poleZeZnakiem(dzL)), obwodM: obwod(dzL) } : null,
      budynek: budL.length > 0 ? { punkty: budL, powierzchniaM2: Math.abs(poleZeZnakiem(budL)), sciany: sciany(budL) } : null,
      polacie: polacieWynik,
      wysokoscKalenicyM,
      przeszkody,
    },
    warnings,
    assumptions,
  )
}
