/**
 * Geometria cienia międzyrzędowego (D81). Przekrój prostopadły do rzędów, rzędy nieskończone, grunt płaski i poziomy:
 * - stół o długości L wzdłuż spadu, nachylenie β: rzut poziomy d = L·cosβ, wysokość górnej krawędzi h = L·sinβ;
 * - słońce o wysokości α i azymucie γs, panele o azymucie γp, Δ = γs − γp: w przekroju widać je pod kątem profilowym
 *   tanα' = tanα / cosΔ (słońce przed panelami: cosΔ > 0);
 * - cień górnej krawędzi rzędu k sięga w głąb rzędu k+1 na wysokość u (liczoną po stole od dolnej krawędzi):
 *   u = [h − (P − d)·tanα'] / (sinβ + cosβ·tanα'), gdzie P to odstęp rzędów (dolna krawędź do dolnej krawędzi).
 * Zacieniony ułamek stołu = u / L w granicach 0…1. Rząd k+1 jest zasłaniany tylko przez rząd k (górne krawędzie leżą na
 * jednej linii, a promień ku słońcu rośnie w stronę słońca).
 */
import { cosKataPadania, pozycjaSlonca } from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import { DZIEN_PROJEKTOWY, KROK_OKNA_MIN } from "./constants"

const RAD = Math.PI / 180

/** Tangens kąta profilowego słońca w przekroju prostopadłym do rzędów; `null` = słońce pod horyzontem albo za panelami. */
export function tangensProfilu(wysokoscSloncaDeg: number, azymutSloncaDeg: number, azymutPanelowDeg: number): number | null {
  if (wysokoscSloncaDeg <= 0) return null
  const cosDelta = Math.cos((azymutSloncaDeg - azymutPanelowDeg) * RAD)
  if (cosDelta <= 1e-9) return null
  return Math.tan(wysokoscSloncaDeg * RAD) / cosDelta
}

/** Ułamek długości stołu (od dolnej krawędzi), który zasłania rząd przed nim, 0…1. */
export function czescZacieniona(dlugoscM: number, nachylenieDeg: number, odstepM: number, tanProfilu: number): number {
  const b = nachylenieDeg * RAD
  const d = dlugoscM * Math.cos(b)
  const h = dlugoscM * Math.sin(b)
  const u = (h - (odstepM - d) * tanProfilu) / (Math.sin(b) + Math.cos(b) * tanProfilu)
  return Math.min(1, Math.max(0, u / dlugoscM))
}

/** Chwila próbkowania okna projektowego: godzina słoneczna i pozycja słońca. */
export type ProbkaOkna = { czasSlonecznyH: number; wysokoscDeg: number; azymutDeg: number }

/**
 * Pozycje słońca 21 grudnia w oknie `odH…doH` czasu słonecznego (próbki co `KROK_OKNA_MIN`, oba końce włącznie).
 * Czas słoneczny → chwila UTC: UTC = czas słoneczny − równanie czasu − 4 min × długość geograficzna (równanie czasu z tej samej doby).
 */
export function probkiOkna(szerokoscDeg: number, dlugoscDeg: number, odH: number, doH: number): ProbkaOkna[] {
  const poczatekDobyMs = Date.UTC(DZIEN_PROJEKTOWY.rok, DZIEN_PROJEKTOWY.miesiac, DZIEN_PROJEKTOWY.dzien)
  const rownanieCzasu = pozycjaSlonca(szerokoscDeg, dlugoscDeg, poczatekDobyMs + 12 * 3_600_000).rownanieCzasuMin
  const wynik: ProbkaOkna[] = []
  const odMin = Math.round(odH * 60)
  const doMin = Math.round(doH * 60)
  for (let minuta = odMin; minuta <= doMin; minuta += KROK_OKNA_MIN) {
    const utcMs = poczatekDobyMs + (minuta - rownanieCzasu - 4 * dlugoscDeg) * 60_000
    const p = pozycjaSlonca(szerokoscDeg, dlugoscDeg, utcMs)
    wynik.push({ czasSlonecznyH: minuta / 60, wysokoscDeg: p.wysokoscDeg, azymutDeg: p.azymutDeg })
  }
  return wynik
}

/**
 * Współczynnik cienia F = max(cosΔ / tanα) po próbkach okna [-]: cień górnej krawędzi sięga F·h za nią. `null` = żadna próbka
 * nie ma słońca nad horyzontem; `0` = słońce w całym oknie za panelami albo pod horyzontem tylko częściowo, ale nigdy z przodu.
 */
export function wspolczynnikCienia(probki: ProbkaOkna[], azymutPanelowDeg: number): { f: number; probka: ProbkaOkna | null; nadHoryzontem: number } | null {
  let f = 0
  let decydujaca: ProbkaOkna | null = null
  let nad = 0
  for (const p of probki) {
    if (p.wysokoscDeg <= 0) continue
    nad += 1
    const tp = tangensProfilu(p.wysokoscDeg, p.azymutDeg, azymutPanelowDeg)
    if (tp === null) continue
    const wartosc = 1 / tp
    if (wartosc > f) {
      f = wartosc
      decydujaca = p
    }
  }
  return nad === 0 ? null : { f, probka: decydujaca, nadHoryzontem: nad }
}

/** Odstęp rzędów bez cienia w oknie: P = L·(cosβ + sinβ·F). */
export function odstepWymaganyM(dlugoscM: number, nachylenieDeg: number, f: number): number {
  const b = nachylenieDeg * RAD
  return dlugoscM * (Math.cos(b) + Math.sin(b) * f)
}

export { cosKataPadania }
