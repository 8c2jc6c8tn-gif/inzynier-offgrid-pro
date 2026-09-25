/**
 * Godzinowy model napromieniowania płaszczyzny — model anizotropowy Muneera (1990) w postaci PVGIS
 * (EUR 26075, równ. 28–31; stałe w constants.ts). Wspólny dla Ekranu 4 (orientacja powierzchni)
 * i Ekranu 3 (strata całkowitego napromieniowania przez przeszkody, TD14) — jedna fizyka, dwa ekrany.
 */
import { masaPowietrza, pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import {
  DNI_ROKU,
  KROK_GODZIN,
  MIMOSROD_AMPL,
  MUNEER_N_A,
  MUNEER_N_B,
  MUNEER_N_C,
  MUNEER_N_ZACIENIONA,
  MUNEER_NISKIE_SLONCE_B,
  MUNEER_PROG_NISKIE_SLONCE_RAD,
  AZYMUT_MAX_DEG,
  PEREZ_KT_A,
  PEREZ_KT_B,
  PEREZ_KT_C,
  PEREZ_KT_D,
  PEREZ_KT_E,
  PROG_ZACHMURZENIA_KT,
  STALA_SLONECZNA_W_M2,
  W_NA_KW,
} from "./constants"
import type { RekordGodzinowy } from "./input"

const RAD = Math.PI / 180

/** Wielkości zależne tylko od słońca, liczone raz na rekord (nie raz na orientację). */
export type Godzina = {
  cosZ: number
  sinZ: number
  cosAz: number
  sinAz: number
  sloncePonadHoryzontem: boolean
  /** Azymut i wysokość słońca [°] — porównanie z profilem horyzontu przeszkód. */
  azymutDeg: number
  wysokoscDeg: number
  /** Wysokość słońca [rad] — dla korekty niskiego słońca (równ. 30). */
  wysokoscRad: number
  /** Wskaźnik anizotropii Kb = G_b,h / G_0,h (promieniowanie bezpośrednie poziome / pozaziemskie poziome). */
  kb: number
  /** Niebo zachmurzone wg kt' < 0,3 (równ. 31) — wtedy równ. 28 niezależnie od nasłonecznienia. */
  zachmurzone: boolean
  /** Rzeczywista chwila rekordu (miesiąc wyniku Ekranu 3). */
  czasUtcMs: number
  /** Miesiąc UTC chwili rekordu (0 = styczeń) — liczony raz tutaj, nie w pętlach po orientacjach. */
  miesiac: number
  dni: number
  dhi: number
  ghi: number
}

/** Dzień roku 1…365/366 (UTC). */
function dzienRoku(czasUtcMs: number): number {
  const d = new Date(czasUtcMs)
  return Math.floor((czasUtcMs - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86_400_000) + 1
}

export function przygotujGodziny(lat: number, lon: number, dane: RekordGodzinowy[]): Godzina[] {
  return dane.map((r) => {
    const p = pozycjaSlonca(lat, lon, r.czasUtcMs)
    const z = (90 - p.wysokoscDeg) * RAD
    const nad = p.wysokoscDeg > 0
    const sinH = Math.sin(p.wysokoscDeg * RAD)
    // Promieniowanie pozaziemskie na płaszczyznę poziomą (Duffie–Beckman 1.4.1a × sin h).
    const g0h = nad
      ? STALA_SLONECZNA_W_M2 * (1 + MIMOSROD_AMPL * Math.cos((2 * Math.PI * dzienRoku(r.czasUtcMs)) / DNI_ROKU)) * sinH
      : 0
    const kb = g0h > 0 ? Math.min(1, (r.dni * sinH) / g0h) : 0
    const kt = g0h > 0 ? r.ghi / g0h : 0
    const am = masaPowietrza(p.wysokoscDeg)
    const ktPrim = Number.isFinite(am)
      ? kt / (PEREZ_KT_A + PEREZ_KT_B * Math.exp(-PEREZ_KT_C / (PEREZ_KT_D + PEREZ_KT_E / am)))
      : 0
    return {
      cosZ: Math.cos(z),
      sinZ: Math.sin(z),
      cosAz: Math.cos(p.azymutDeg * RAD),
      sinAz: Math.sin(p.azymutDeg * RAD),
      sloncePonadHoryzontem: nad,
      azymutDeg: p.azymutDeg,
      wysokoscDeg: p.wysokoscDeg,
      wysokoscRad: p.wysokoscDeg * RAD,
      kb,
      zachmurzone: ktPrim < PROG_ZACHMURZENIA_KT,
      czasUtcMs: r.czasUtcMs,
      miesiac: new Date(r.czasUtcMs).getUTCMonth(),
      dni: r.dni,
      dhi: r.dhi,
      ghi: r.ghi,
    }
  })
}

/** F(β) = (1 + cos β)/2 + N·(sin β − β·cos β − π·sin²(β/2)) — Muneer, EUR 26075 równ. 28–29. */
export function fMuneera(nachylenieDeg: number, n: number): number {
  const beta = nachylenieDeg * RAD
  return (1 + Math.cos(beta)) / 2 + n * (Math.sin(beta) - beta * Math.cos(beta) - Math.PI * Math.sin(beta / 2) ** 2)
}

/** Kąt horyzontu przeszkód w azymucie `azymutDeg` — interpolacja liniowa między próbkami profilu (równe kroki od 0°). */
export function katHoryzontuDeg(profil: number[], azymutDeg: number): number {
  const krok = AZYMUT_MAX_DEG / profil.length
  const pozycja = ((((azymutDeg % AZYMUT_MAX_DEG) + AZYMUT_MAX_DEG) % AZYMUT_MAX_DEG) / krok) % profil.length
  const i = Math.floor(pozycja)
  const a = profil[i]!
  const b = profil[(i + 1) % profil.length]!
  return a + (b - a) * (pozycja - i)
}

/** Wielkości zależne tylko od płaszczyzny, liczone raz na orientację. */
export type Plaszczyzna = {
  nachylenieDeg: number
  cosB: number
  sinB: number
  cosG: number
  sinG: number
  /** F(β) dla powierzchni zacienionej / nieba zachmurzonego (równ. 28). */
  fZacieniona: number
  /** ρ·(1 − cos β)/2 — udział odbitego od gruntu. */
  wspOdbic: number
}

export function plaszczyzna(nachylenieDeg: number, azymutDeg: number, albedo: number): Plaszczyzna {
  const cosB = Math.cos(nachylenieDeg * RAD)
  return {
    nachylenieDeg,
    cosB,
    sinB: Math.sin(nachylenieDeg * RAD),
    cosG: Math.cos(azymutDeg * RAD),
    sinG: Math.sin(azymutDeg * RAD),
    fZacieniona: fMuneera(nachylenieDeg, MUNEER_N_ZACIENIONA),
    wspOdbic: (albedo * (1 - cosB)) / 2,
  }
}

/**
 * Natężenie na płaszczyźnie w jednej godzinie [W/m²]: bezpośrednie G_b,n·cos θ + rozproszone wg
 * modelu anizotropowego T. Muneera (1990) w postaci PVGIS (EUR 26075, równ. 28–31) + odbite od
 * gruntu ρ·G_h·(1 − cos β)/2.
 *
 * F(β) = (1 + cos β)/2 + N·(sin β − β·cos β − π·sin²(β/2)):
 * - zacieniona (cos θ ≤ 0) albo niebo zachmurzone: G_dT = G_d·F(β) z N = 0,25227 (równ. 28),
 * - nasłoneczniona: G_dT = G_d·[F(β)·(1 − Kb) + Kb·cos θ / sin h], N = 0,00263 − 0,712·Kb − 0,6883·Kb²
 *   (równ. 29); przy h < 0,1 rad człon Kb·sin β·cos(γs − γ) / (0,1 − 0,008·h) (równ. 30).
 * Zastąpił model izotropowy Liu–Jordana (Ekran 4 v1.0.0) — decyzja właściciela 24.09.2026 (TD16, wariant a).
 *
 * `zaPrzeszkoda` (TD15 punkt 2, TD14): słońce niżej niż przeszkoda w swoim azymucie — powierzchnia
 * zacieniona w sensie EUR 26075: bez bezpośredniego, rozproszone wg równ. 28 (jak przy cos θ ≤ 0).
 * Przesłonięcie części nieboskłonu przez przeszkody (rozproszone izotropowe) nie jest modelowane — 🔎 TD18.
 */
export function natezenieGodziny(g: Godzina, pl: Plaszczyzna, zaPrzeszkoda: boolean): number {
  let bezp = 0
  let rozpr = g.dhi * pl.fZacieniona
  if (g.sloncePonadHoryzontem && !zaPrzeszkoda) {
    // cos(γs − γ) rozpisane na iloczyny; cos θ = cos z·cos β + sin z·sin β·cos(γs − γ).
    const cosRoznicyAz = g.cosAz * pl.cosG + g.sinAz * pl.sinG
    const cosTheta = g.cosZ * pl.cosB + g.sinZ * pl.sinB * cosRoznicyAz
    if (cosTheta > 0) {
      bezp = g.dni * cosTheta
      if (!g.zachmurzone) {
        const n = MUNEER_N_A + MUNEER_N_B * g.kb + MUNEER_N_C * g.kb * g.kb
        const f = fMuneera(pl.nachylenieDeg, n)
        const okoloSloneczny =
          g.wysokoscRad >= MUNEER_PROG_NISKIE_SLONCE_RAD
            ? cosTheta / g.cosZ
            : (pl.sinB * cosRoznicyAz) / (MUNEER_PROG_NISKIE_SLONCE_RAD - MUNEER_NISKIE_SLONCE_B * g.wysokoscRad)
        rozpr = g.dhi * (f * (1 - g.kb) + g.kb * okoloSloneczny)
      }
    }
  }
  return bezp + rozpr + g.ghi * pl.wspOdbic
}

/** Czy słońce jest za przeszkodą wg profilu horyzontu (brak profilu → nie). */
export function zaHoryzontem(g: Godzina, horyzont?: number[]): boolean {
  return horyzont !== undefined && g.sloncePonadHoryzontem && g.wysokoscDeg < katHoryzontuDeg(horyzont, g.azymutDeg)
}

/** Liczba miesięcy — indeks wyniku `napromieniowanieMiesieczne` = miesiąc UTC rekordu (0 = styczeń). */
export const LICZBA_MIESIECY = 12

/**
 * Napromieniowanie płaszczyzny w każdym miesiącu [kWh/m²], opcjonalnie z profilem horyzontu
 * przeszkód. Miesiąc = miesiąc UTC chwili rekordu (dla Polski różnica względem czasu lokalnego to
 * godziny wokół północy, bez słońca — bez wpływu na sumy). Moduł 3 (Ekran 1 — rozkład
 * miesięczny, optymalny kąt per miesiąc, D26). Ta sama funkcja natężenia co `napromieniowanie`
 * niżej (suma roczna = suma miesięcy — test w Module 3); osobna pętla roczna zostaje, bo jest
 * wywoływana tysiące razy przy przeszukiwaniu orientacji w Ekranie 4 M1.
 */
export function napromieniowanieMiesieczne(
  godziny: Godzina[],
  nachylenieDeg: number,
  azymutDeg: number,
  albedo: number,
  horyzont?: number[],
): number[] {
  const pl = plaszczyzna(nachylenieDeg, azymutDeg, albedo)
  const sumyWh = new Array<number>(LICZBA_MIESIECY).fill(0)
  for (const g of godziny) sumyWh[g.miesiac]! += natezenieGodziny(g, pl, zaHoryzontem(g, horyzont)) * KROK_GODZIN
  return sumyWh.map((wh) => wh / W_NA_KW)
}

/** Roczne napromieniowanie płaszczyzny [kWh/m²], opcjonalnie z profilem horyzontu przeszkód. */
export function napromieniowanie(
  godziny: Godzina[],
  nachylenieDeg: number,
  azymutDeg: number,
  albedo: number,
  horyzont?: number[],
): number {
  const pl = plaszczyzna(nachylenieDeg, azymutDeg, albedo)
  let sumaWh = 0
  for (const g of godziny) sumaWh += natezenieGodziny(g, pl, zaHoryzontem(g, horyzont)) * KROK_GODZIN
  return sumaWh / W_NA_KW
}

/** Liczba godzin doby — indeks wyniku `napromieniowanieDobowe`. */
export const GODZIN_DOBY = 24

/**
 * Napromieniowanie płaszczyzny zsumowane po godzinach doby w SŁONECZNYM czasie lokalnym (UTC +
 * długość/15) [kWh/m² za rok w danej godzinie] — rozkład dobowy dla Modułu 3, Ekran 20
 * (wschód-zachód: "produkcja rozłożona bardziej równomiernie w ciągu dnia"). Godzina rekordu z
 * arytmetyki na `czasUtcMs` (bez `Date` w pętli). Założenie: natężenie stałe w obrębie godziny rekordu.
 */
export function napromieniowanieDobowe(
  godziny: Godzina[],
  dlugoscDeg: number,
  nachylenieDeg: number,
  azymutDeg: number,
  albedo: number,
): number[] {
  const pl = plaszczyzna(nachylenieDeg, azymutDeg, albedo)
  const sumyWh = new Array<number>(GODZIN_DOBY).fill(0)
  const przesuniecieH = dlugoscDeg / 15
  for (const g of godziny) {
    // Rekord reprezentuje godzinę [s − ½, s + ½] wokół chwili s (czas słoneczny) — energia dzielona
    // między dwie godziny zegarowe proporcjonalnie do nakładania się (inaczej rekord z 11:50 trafiałby
    // w całości "przed południe", zawyżając udział poranka o kilka punktów procentowych).
    const poczatek = g.czasUtcMs / 3_600_000 + przesuniecieH - KROK_GODZIN / 2
    const pelna = Math.floor(poczatek)
    const udzialPierwszej = 1 - (poczatek - pelna)
    const i = ((pelna % GODZIN_DOBY) + GODZIN_DOBY) % GODZIN_DOBY
    const wh = natezenieGodziny(g, pl, false) * KROK_GODZIN
    sumyWh[i]! += wh * udzialPierwszej
    sumyWh[(i + 1) % GODZIN_DOBY]! += wh * (1 - udzialPierwszej)
  }
  return sumyWh.map((wh) => wh / W_NA_KW)
}
