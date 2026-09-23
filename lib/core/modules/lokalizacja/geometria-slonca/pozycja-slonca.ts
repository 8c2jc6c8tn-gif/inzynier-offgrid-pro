/**
 * Wspólna geometria słoneczna Modułu 1 (Ekrany 3 i 4) — czyste funkcje, bez CalcResult: to
 * prymityw obliczeniowy używany przez kalkulatory, nie samodzielny kalkulator (03-jadro, 3.2).
 * Źródła wzorów: patrz `constants.ts` (NOAA Solar Calculator / Meeus; Kasten–Young; Meinel).
 *
 * Konwencje: azymut w stopniach od północy zgodnie z ruchem wskazówek zegara (N=0, E=90, S=180,
 * W=270); wysokość słońca w stopniach nad horyzontem; czas zawsze UTC.
 */
import {
  ABERRACJA,
  C1_A,
  C1_B,
  C1_C,
  C2_A,
  C2_B,
  C3,
  DNI_W_STULECIU_JULIANSKIM,
  E_A,
  E_B,
  E_C,
  EPS0_B,
  EPS0_C,
  EPS0_D,
  EPS0_MINUTY,
  EPS0_SEKUNDY,
  EPS0_STOPNIE,
  EPS_KOREKTA,
  JD_EPOKA_UNIX,
  JD_J2000,
  KY_A,
  KY_B,
  KY_C,
  L0_A,
  L0_B,
  L0_C,
  M_A,
  M_B,
  M_C,
  MEINEL_I0_KW_M2,
  MEINEL_PODSTAWA,
  MEINEL_WYKLADNIK,
  MINUT_NA_DOBE,
  MINUT_NA_STOPIEN,
  MS_NA_DOBE,
  NUTACJA_AMPL,
  OMEGA_A,
  OMEGA_B,
  REFR_HORYZONT,
  REFR_PONIZEJ,
  REFR_PROG_BRAK_DEG,
  REFR_PROG_HORYZONT_DEG,
  REFR_PROG_WYSOKA_DEG,
  REFR_WYSOKA,
  SEKUND_NA_STOPIEN,
} from "./constants"

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

export function normalizujKat(stopnie: number): number {
  return ((stopnie % 360) + 360) % 360
}

export type PozycjaSlonca = {
  /** Wysokość pozorna nad horyzontem (z refrakcją) [°]. */
  wysokoscDeg: number
  /** Azymut od północy, zgodnie z ruchem wskazówek zegara [°]. */
  azymutDeg: number
  /** Deklinacja [°]. */
  deklinacjaDeg: number
  /** Równanie czasu [min]. */
  rownanieCzasuMin: number
}

export function dzienJulianski(czasUtcMs: number): number {
  return czasUtcMs / MS_NA_DOBE + JD_EPOKA_UNIX
}

/** Deklinacja [°] i równanie czasu [min] dla danego dnia juliańskiego (Meeus 22, 25, 28). */
export function deklinacjaIRownanieCzasu(jd: number): { deklinacjaDeg: number; rownanieCzasuMin: number } {
  const t = (jd - JD_J2000) / DNI_W_STULECIU_JULIANSKIM
  const l0 = normalizujKat(L0_A + t * (L0_B + t * L0_C))
  const m = M_A + t * (M_B - M_C * t)
  const e = E_A - t * (E_B + E_C * t)
  const c =
    Math.sin(m * RAD) * (C1_A - t * (C1_B + C1_C * t)) +
    Math.sin(2 * m * RAD) * (C2_A - C2_B * t) +
    Math.sin(3 * m * RAD) * C3
  const dlugoscPrawdziwa = l0 + c
  const omega = OMEGA_A - OMEGA_B * t
  const dlugoscPozorna = dlugoscPrawdziwa - ABERRACJA - NUTACJA_AMPL * Math.sin(omega * RAD)
  const eps0 = EPS0_STOPNIE + (EPS0_MINUTY + (EPS0_SEKUNDY - t * (EPS0_B + t * (EPS0_C - t * EPS0_D))) / 60) / 60
  const eps = eps0 + EPS_KOREKTA * Math.cos(omega * RAD)

  const deklinacjaDeg = Math.asin(Math.sin(eps * RAD) * Math.sin(dlugoscPozorna * RAD)) * DEG

  const y = Math.tan((eps / 2) * RAD) ** 2
  const rownanieRad =
    y * Math.sin(2 * l0 * RAD) -
    2 * e * Math.sin(m * RAD) +
    4 * e * y * Math.sin(m * RAD) * Math.cos(2 * l0 * RAD) -
    0.5 * y * y * Math.sin(4 * l0 * RAD) -
    1.25 * e * e * Math.sin(2 * m * RAD)
  const rownanieCzasuMin = MINUT_NA_STOPIEN * rownanieRad * DEG

  return { deklinacjaDeg, rownanieCzasuMin }
}

/** Poprawka refrakcji atmosferycznej [°] dla wysokości geometrycznej [°] (NOAA). */
export function refrakcjaDeg(wysokoscGeometrycznaDeg: number): number {
  const h = wysokoscGeometrycznaDeg
  if (h > REFR_PROG_BRAK_DEG) return 0
  const tg = Math.tan(h * RAD)
  let sekundy: number
  if (h > REFR_PROG_WYSOKA_DEG) {
    sekundy = REFR_WYSOKA[0] / tg - REFR_WYSOKA[1] / tg ** 3 + REFR_WYSOKA[2] / tg ** 5
  } else if (h > REFR_PROG_HORYZONT_DEG) {
    const [a, b, c, d, f] = REFR_HORYZONT
    sekundy = a + h * (b + h * (c + h * (d + h * f)))
  } else {
    sekundy = -REFR_PONIZEJ / tg
  }
  return sekundy / SEKUND_NA_STOPIEN
}

/**
 * Pozycja słońca dla punktu (szerokość/długość geograficzna w stopniach, długość dodatnia na
 * wschód) w chwili `czasUtcMs` (milisekundy od epoki Unix, UTC).
 */
export function pozycjaSlonca(szerokoscDeg: number, dlugoscDeg: number, czasUtcMs: number): PozycjaSlonca {
  const jd = dzienJulianski(czasUtcMs)
  const { deklinacjaDeg, rownanieCzasuMin } = deklinacjaIRownanieCzasu(jd)

  const minutyUtc = (((czasUtcMs % MS_NA_DOBE) + MS_NA_DOBE) % MS_NA_DOBE) / 60_000
  const czasSlonecznyMin =
    (((minutyUtc + rownanieCzasuMin + MINUT_NA_STOPIEN * dlugoscDeg) % MINUT_NA_DOBE) + MINUT_NA_DOBE) %
    MINUT_NA_DOBE
  const katGodzinnyDeg = czasSlonecznyMin / MINUT_NA_STOPIEN - 180

  const fi = szerokoscDeg * RAD
  const delta = deklinacjaDeg * RAD
  const cosZenit = Math.min(
    1,
    Math.max(-1, Math.sin(fi) * Math.sin(delta) + Math.cos(fi) * Math.cos(delta) * Math.cos(katGodzinnyDeg * RAD)),
  )
  const zenitRad = Math.acos(cosZenit)
  const wysokoscGeom = 90 - zenitRad * DEG

  // Azymut: atan2 zamiast acos z NOAA — ten sam wynik, bez osobliwości przy zenicie/biegunie.
  const azymutDeg = normalizujKat(
    Math.atan2(
      Math.sin(katGodzinnyDeg * RAD),
      Math.cos(katGodzinnyDeg * RAD) * Math.sin(fi) - Math.tan(delta) * Math.cos(fi),
    ) *
      DEG +
      180,
  )

  return {
    wysokoscDeg: wysokoscGeom + refrakcjaDeg(wysokoscGeom),
    azymutDeg,
    deklinacjaDeg,
    rownanieCzasuMin,
  }
}

/**
 * Cosinus kąta padania promieni na płaszczyznę o nachyleniu β i azymucie γ (kierunek, w który
 * płaszczyzna "patrzy", od północy) — J. A. Duffie, W. A. Beckman, "Solar Engineering of Thermal
 * Processes", 4th ed., 2013, równ. 1.6.3: cos θ = cos θz·cos β + sin θz·sin β·cos(γs − γ).
 * Wartość ujemna = słońce za płaszczyzną.
 */
export function cosKataPadania(
  wysokoscSloncaDeg: number,
  azymutSloncaDeg: number,
  nachylenieDeg: number,
  azymutPowierzchniDeg: number,
): number {
  const zenit = (90 - wysokoscSloncaDeg) * RAD
  const beta = nachylenieDeg * RAD
  return (
    Math.cos(zenit) * Math.cos(beta) +
    Math.sin(zenit) * Math.sin(beta) * Math.cos((azymutSloncaDeg - azymutPowierzchniDeg) * RAD)
  )
}

/** Masa optyczna powietrza (Kasten–Young 1989). Dla słońca pod horyzontem — Infinity. */
export function masaPowietrza(wysokoscSloncaDeg: number): number {
  if (wysokoscSloncaDeg <= 0) return Number.POSITIVE_INFINITY
  const zenitDeg = 90 - wysokoscSloncaDeg
  return 1 / (Math.cos(zenitDeg * RAD) + KY_A * (KY_B - zenitDeg) ** -KY_C)
}

/** Promieniowanie bezpośrednie (normalne do promieni) przy bezchmurnym niebie [kW/m²] — Meinel 1976. */
export function promieniowanieBezposrednieCzysteNiebo(wysokoscSloncaDeg: number): number {
  const am = masaPowietrza(wysokoscSloncaDeg)
  if (!Number.isFinite(am)) return 0
  return MEINEL_I0_KW_M2 * MEINEL_PODSTAWA ** (am ** MEINEL_WYKLADNIK)
}
