/**
 * PN-EN 1991-1-4:2008 + AC:2009 (Eurokod 1, oddziaływania wiatru) — wyłącznie wartości i wzory
 * potrzebne kalkulatorom Modułu 3. Źródło liczb: własna notatka robocza
 * `docs/zrodla/norma-PN-EN-1991-1-4/00-INDEKS.md` (w tym samym katalogu skan PDF i tekst OCR normy; zob. też `wiatr-dachy.ts`).
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

/**
 * Tablica 7.6 — wiaty jednospadowe, współczynniki ciśnienia netto cp,net (pola A, B, C — maksymalne ciśnienie lokalne ze wszystkich
 * kierunków wiatru, 7.3 (5): do elementów pokrycia i łączników). Skan zweryfikowany wizualnie (`01-tresc-ocr.txt`, strona 56).
 * ⚠️ Poprawka PN-EN 1991-1-4:2008/AC:2009: α = 10°, pole A, minimum φ = 1: −2,1 → **−1,6** (skan jej nie zawiera) — użyta wartość poprawiona.
 * Znak + = obciążenie netto ku dołowi (docisk), − = ku górze (odrywanie). Zakres normy: 0–30°, węzły co 5°.
 */
type CpNetPola = { A: number; B: number; C: number }
const CP_NET_WIATA_JEDNOSPADOWA: readonly { katDeg: number; maks: CpNetPola; minPhi0: CpNetPola; minPhi1: CpNetPola }[] = [
  { katDeg: 0, maks: { A: 0.5, B: 1.8, C: 1.1 }, minPhi0: { A: -0.6, B: -1.3, C: -1.4 }, minPhi1: { A: -1.5, B: -1.8, C: -2.2 } },
  { katDeg: 5, maks: { A: 0.8, B: 2.1, C: 1.3 }, minPhi0: { A: -1.1, B: -1.7, C: -1.8 }, minPhi1: { A: -1.6, B: -2.2, C: -2.5 } },
  { katDeg: 10, maks: { A: 1.2, B: 2.4, C: 1.6 }, minPhi0: { A: -1.5, B: -2.0, C: -2.1 }, minPhi1: { A: -1.6, B: -2.6, C: -2.7 } },
  { katDeg: 15, maks: { A: 1.4, B: 2.7, C: 1.8 }, minPhi0: { A: -1.8, B: -2.4, C: -2.5 }, minPhi1: { A: -1.6, B: -2.9, C: -3.0 } },
  { katDeg: 20, maks: { A: 1.7, B: 2.9, C: 2.1 }, minPhi0: { A: -2.2, B: -2.8, C: -2.9 }, minPhi1: { A: -1.6, B: -2.9, C: -3.0 } },
  { katDeg: 25, maks: { A: 2.0, B: 3.1, C: 2.3 }, minPhi0: { A: -2.6, B: -3.2, C: -3.2 }, minPhi1: { A: -1.5, B: -2.5, C: -2.8 } },
  { katDeg: 30, maks: { A: 2.2, B: 3.2, C: 2.4 }, minPhi0: { A: -3.0, B: -3.8, C: -3.6 }, minPhi1: { A: -1.5, B: -2.2, C: -2.7 } },
]

/** Współczynniki ciśnienia netto wiaty jednospadowej do oceny panelu: docisk (+) i odrywanie (wartość bezwzględna), pole środkowe A i krawędziowe B/C. */
export type CpNetWiaty = {
  dociskSrodek: number
  dociskKrawedz: number
  odrywanieSrodek: number
  odrywanieKrawedz: number
}

/**
 * cp,net wiaty jednospadowej dla kąta α, najbardziej niekorzystny z przypadków: (1) między węzłami tablicy — gorszy z dwóch sąsiednich węzłów
 * (jak `cfOdrywaniaWiaty`: norma nie mówi o interpolacji po α; zachowawczo); (2) współczynnik blokowania φ — gorszy z φ = 0 i φ = 1 (norma dopuszcza
 * wartości pośrednie, więc skrajne ograniczają; nie wiemy, co jest pod konstrukcją); (3) „krawędź” = gorsze z pól B i C. α poza 0–30° → `null` (norma nie podaje).
 */
export function cpNetWiatyJednospadowej(katDeg: number): CpNetWiaty | null {
  if (!Number.isFinite(katDeg) || katDeg < 0 || katDeg > CF_WIATA_MAX_KAT_DEG) return null
  const dolny = Math.floor(katDeg / CF_WIATA_KROK_DEG)
  const gorny = Math.ceil(katDeg / CF_WIATA_KROK_DEG)
  const wezly = [...new Set([dolny, gorny])].map((i) => CP_NET_WIATA_JEDNOSPADOWA[i]!)
  const maks = (f: (w: (typeof wezly)[number]) => number) => Math.max(...wezly.map(f))
  const odrywanie = (pole: keyof CpNetPola) => maks((w) => Math.max(Math.abs(w.minPhi0[pole]), Math.abs(w.minPhi1[pole])))
  return {
    dociskSrodek: maks((w) => w.maks.A),
    dociskKrawedz: maks((w) => Math.max(w.maks.B, w.maks.C)),
    odrywanieSrodek: odrywanie("A"),
    odrywanieKrawedz: Math.max(odrywanie("B"), odrywanie("C")),
  }
}
