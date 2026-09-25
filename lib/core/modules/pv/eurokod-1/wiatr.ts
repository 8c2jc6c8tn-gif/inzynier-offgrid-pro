/**
 * PN-EN 1991-1-4:2008 + AC:2009 (Eurokod 1, oddziaływania wiatru) — wyłącznie wartości i wzory
 * potrzebne kalkulatorom Modułu 3. Źródło liczb: własna notatka robocza
 * `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md` (oryginał normy poza repo — licencja PKN, plan B).
 * Czyste funkcje bez CalcResult — wspólne dla M3/E9 (D27), docelowo M3/E6 i M3/E2 (echo D12).
 */

export type StrefaWiatrowa = 1 | 2 | 3
export const STREFY_WIATROWE: readonly StrefaWiatrowa[] = [1, 2, 3]

export type KategoriaTerenu = "0" | "I" | "II" | "III" | "IV"
export const KATEGORIE_TERENU: readonly KategoriaTerenu[] = ["0", "I", "II", "III", "IV"]

/** Wysokość n.p.m., powyżej której Tablica NA.1 podaje wzór zależny od A [m]. */
export const WYSOKOSC_PROGOWA_NA1_M = 300
/** Współczynnik we wzorach Tablicy NA.1: [1 + 0,0006·(A − 300)]. */
const WSP_WYSOKOSCI_NA1 = 0.0006
/** Stała wzoru strefy 3 dla A > 300 m: (20000 − A)/(20000 + A), Tablica NA.1. */
export const STALA_STREFY_3_NA1_M = 20000

/** qb,0 dla A ≤ 300 m [kN/m²] — Tablica NA.1. */
const QB0_KN_M2: Record<StrefaWiatrowa, number> = { 1: 0.3, 2: 0.42, 3: 0.3 }
const PA_NA_KN_M2 = 1000

/**
 * Wartość podstawowa bazowego ciśnienia prędkości wiatru qb,0 [Pa] — Tablica NA.1.
 * Przy cdir = cseason = 1,0 (NA.4; cdir najbardziej niekorzystny z Tablicy NA.2) qb = qb,0.
 */
export function bazoweCisnienieWiatruPa(strefa: StrefaWiatrowa, wysokoscNpmM: number): number {
  const q0 = QB0_KN_M2[strefa] * PA_NA_KN_M2
  if (strefa === 2 || wysokoscNpmM <= WYSOKOSC_PROGOWA_NA1_M) return q0
  const k = (1 + WSP_WYSOKOSCI_NA1 * (wysokoscNpmM - WYSOKOSC_PROGOWA_NA1_M)) ** 2
  if (strefa === 1) return q0 * k
  return (q0 * k * (STALA_STREFY_3_NA1_M - wysokoscNpmM)) / (STALA_STREFY_3_NA1_M + wysokoscNpmM)
}

/** Tablica NA.3: ce(z) = a·(z/10)^w, z ograniczone do [zmin, zmax] (4.3.2, wzór 4.4). */
export const EKSPOZYCJA_NA3: Record<KategoriaTerenu, { a: number; wykladnik: number; zMinM: number; zMaxM: number }> = {
  "0": { a: 3.0, wykladnik: 0.17, zMinM: 1, zMaxM: 200 },
  I: { a: 2.8, wykladnik: 0.19, zMinM: 1, zMaxM: 200 },
  II: { a: 2.3, wykladnik: 0.24, zMinM: 2, zMaxM: 300 },
  III: { a: 1.9, wykladnik: 0.26, zMinM: 5, zMaxM: 400 },
  IV: { a: 1.5, wykladnik: 0.29, zMinM: 10, zMaxM: 500 },
}
/** Wysokość odniesienia we wzorach Tablicy NA.3 [m]. */
const Z_ODNIESIENIA_NA3_M = 10

export function wspolczynnikEkspozycji(kategoria: KategoriaTerenu, wysokoscM: number): number {
  const e = EKSPOZYCJA_NA3[kategoria]
  const z = Math.min(Math.max(wysokoscM, e.zMinM), e.zMaxM)
  return e.a * (z / Z_ODNIESIENIA_NA3_M) ** e.wykladnik
}

/** Szczytowe ciśnienie prędkości qp(z) = ce(z)·qb [Pa] — wzór (4.8), NA.8. */
export function szczytoweCisnieniePa(qbPa: number, ce: number): number {
  return ce * qbPa
}

/**
 * Tablica 7.6 — wiaty jednospadowe, globalny współczynnik siły cf (kolumny: maks. dla wszystkich φ;
 * min. dla φ = 0; min. dla φ = 1). Zakres normy: 0–30°, węzły co 5°.
 */
export const CF_WIATA_JEDNOSPADOWA: readonly { katDeg: number; max: number; minPhi0: number; minPhi1: number }[] = [
  { katDeg: 0, max: 0.2, minPhi0: -0.5, minPhi1: -1.3 },
  { katDeg: 5, max: 0.4, minPhi0: -0.7, minPhi1: -1.4 },
  { katDeg: 10, max: 0.5, minPhi0: -0.9, minPhi1: -1.4 },
  { katDeg: 15, max: 0.7, minPhi0: -1.1, minPhi1: -1.4 },
  { katDeg: 20, max: 0.8, minPhi0: -1.3, minPhi1: -1.4 },
  { katDeg: 25, max: 1.0, minPhi0: -1.6, minPhi1: -1.4 },
  { katDeg: 30, max: 1.2, minPhi0: -1.8, minPhi1: -1.4 },
]
export const CF_WIATA_KROK_DEG = 5
export const CF_WIATA_MAX_KAT_DEG = 30
/** 7.4.3, wzór (7.7): tablica/płyta pionowa wolno stojąca — cf = 1,80 (siła pozioma). */
export const CF_TABLICA_PIONOWA = 1.8
export const KAT_PIONOWY_DEG = 90

/**
 * Wartość bezwzględna cf,min (odrywanie) wiaty jednospadowej dla kąta α i współczynnika ograniczenia
 * przepływu φ ∈ [0, 1]. Po φ — interpolacja liniowa (7.3 (3)). Kąt między węzłami tablicy: brak
 * jednoznacznego zapisu o interpolacji po α dla wiat — bierzemy wartość bardziej niekorzystnego
 * z dwóch sąsiednich węzłów (zachowawczo, jawne założenie). α > 30° → `null` (poza normą, Dyrektywa #1).
 */
export function cfOdrywaniaWiaty(katDeg: number, phi: number): number | null {
  if (katDeg < 0 || katDeg > CF_WIATA_MAX_KAT_DEG) return null
  const wezel = (i: number) => {
    const w = CF_WIATA_JEDNOSPADOWA[i]!
    return Math.abs(w.minPhi0 + phi * (w.minPhi1 - w.minPhi0))
  }
  const dolny = Math.floor(katDeg / CF_WIATA_KROK_DEG)
  const gorny = Math.ceil(katDeg / CF_WIATA_KROK_DEG)
  return Math.max(wezel(dolny), wezel(gorny))
}

/** Siła wiatru Fw = cscd·cf·qp(ze)·Aref [N] — wzór (5.3). */
export function silaWiatruN(cscd: number, cf: number, qpPa: number, powierzchniaM2: number): number {
  return cscd * cf * qpPa * powierzchniaM2
}
