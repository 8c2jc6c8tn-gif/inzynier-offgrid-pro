/**
 * Ile sztuk panelu mieści się w miejscu o danych wymiarach (spec 6.3). Silnik pakowania jest ISTNIEJĄCY
 * (`typ-montazu/wiata.ts`, `ulozPanele`) — tu tylko marginesy i konwersja jednostek.
 */
import { DLUGOSC_MAKS_M, OKNO_PROJEKTOWE_DOMYSLNE } from "@/lib/core/modules/pv/odstep-rzedow/constants"
import { odstepWymaganyM, probkiOkna, wspolczynnikCienia } from "@/lib/core/modules/pv/odstep-rzedow/geometria"
import { ulozPanele, type Ulozenie } from "@/lib/core/modules/pv/typ-montazu/wiata"
import { PANELI_NAD_SOBA_MAKS } from "./constants"
import type { DanePanelu, WymiaryMiejsca } from "./input"

/** Układ paneli pochylonych na konstrukcji: rzędy w odstępie bez cienia w oknie projektowym. */
export type RozmieszczeniePochylone = {
  rzedy: number
  /** Ile paneli stoi nad sobą w jednym stole (wzdłuż spadu). */
  panelowNaStole: number
  /** Ile stołów mieści się w jednym rzędzie (wzdłuż rzędu). */
  stolowWRzedzie: number
  /** Długość stołu wzdłuż spadu [m]. */
  stolM: number
  /** Odstęp rzędów: dolna krawędź do dolnej krawędzi, poziomo [m]. */
  odstepM: number
}

export type Pojemnosc = { liczba: number; ulozenie: Ulozenie | null; pochylone: RozmieszczeniePochylone | null }

/** Okno projektowe miejsca [godz. czasu słonecznego]: wpisane przez użytkownika albo domyślne modułu odstępu rzędów. */
export function oknoMiejsca(w: WymiaryMiejsca): { odH: number; doH: number; domyslne: boolean } {
  const domyslne = w.oknoOdH === undefined || w.oknoDoH === undefined
  return { odH: w.oknoOdH ?? OKNO_PROJEKTOWE_DOMYSLNE.odH, doH: w.oknoDoH ?? OKNO_PROJEKTOWE_DOMYSLNE.doH, domyslne }
}

/**
 * Współczynnik cienia F okna projektowego miejsca (zależy od położenia, azymutu i okna, nie od panelu); `null`, gdy słońce
 * w całym oknie jest pod horyzontem (okno trzeba przesunąć).
 */
export function wspolczynnikOknaMiejsca(w: WymiaryMiejsca, szerokoscDeg: number, dlugoscDeg: number, azymutDeg: number): number | null {
  const okno = oknoMiejsca(w)
  return wspolczynnikCienia(probkiOkna(szerokoscDeg, dlugoscDeg, okno.odH, okno.doH), azymutDeg)?.f ?? null
}

/** Wymiary użytkowe po odjęciu marginesu z obu stron [m]; `null`, gdy margines zjada całą powierzchnię. */
export function wymiaryUzytkowe(w: WymiaryMiejsca): { dlugoscM: number; szerokoscM: number } | null {
  const dlugoscM = w.dlugoscM - 2 * w.marginesM
  const szerokoscM = w.szerokoscM - 2 * w.marginesM
  return dlugoscM > 0 && szerokoscM > 0 ? { dlugoscM, szerokoscM } : null
}

/**
 * Liczba paneli w miejscu; `null`, gdy karta nie podaje wymiarów panelu (nie zgadujemy). Margines większy niż połowa
 * powierzchni daje 0 sztuk, a nie błąd — użytkownik widzi, że nic się nie mieści.
 */
export function pojemnoscMiejsca(w: WymiaryMiejsca, p: DanePanelu): Pojemnosc | null {
  if (p.dlugoscMm === null || p.szerokoscMm === null) return null
  const uzyt = wymiaryUzytkowe(w)
  if (uzyt === null) return { liczba: 0, ulozenie: { liczbaPaneli: 0, bloki: [], podzial: "brak" }, pochylone: null }
  const ulozenie = ulozPanele(uzyt.dlugoscM, uzyt.szerokoscM, p.dlugoscMm / 1000, p.szerokoscMm / 1000)
  return { liczba: ulozenie.liczbaPaneli, ulozenie, pochylone: null }
}

/**
 * Liczba paneli pochylonych na konstrukcji w miejscu (rzędy w odstępie P = L·(cosβ + sinβ·F) z modułu odstępu rzędów).
 * Próbuję obu kierunków rzędów względem boków miejsca, obu orientacji panelu i stołów z 1…`PANELI_NAD_SOBA_MAKS` paneli
 * nad sobą i biorę układ z największą liczbą sztuk. Kierunek, w który patrzą panele, zostaje azymutem z projektu (położenie
 * boków miejsca względem stron świata nie jest znane). Pierwszy rząd stoi na brzegu miejsca (nie zasłania go nic przed nim).
 * `null`, gdy karta nie podaje wymiarów panelu.
 */
export function pojemnoscPochylona(w: WymiaryMiejsca, p: DanePanelu, nachylenieDeg: number, f: number): Pojemnosc | null {
  if (p.dlugoscMm === null || p.szerokoscMm === null) return null
  const uzyt = wymiaryUzytkowe(w)
  const zero: Pojemnosc = { liczba: 0, ulozenie: null, pochylone: null }
  if (uzyt === null) return zero
  const bok = [p.dlugoscMm / 1000, p.szerokoscMm / 1000]
  const cosB = Math.cos((nachylenieDeg * Math.PI) / 180)
  let najlepsze: Pojemnosc = zero
  for (const [wzdluzRzedu, wglab] of [[uzyt.dlugoscM, uzyt.szerokoscM], [uzyt.szerokoscM, uzyt.dlugoscM]] as const) {
    for (const [poRzedzie, wzdluzSpadu] of [[bok[1]!, bok[0]!], [bok[0]!, bok[1]!]] as const) {
      for (let k = 1; k <= PANELI_NAD_SOBA_MAKS; k++) {
        const stolM = k * wzdluzSpadu
        if (stolM > DLUGOSC_MAKS_M) continue
        const rzut = stolM * cosB
        if (wglab < rzut - 1e-9) continue
        const odstepM = odstepWymaganyM(stolM, nachylenieDeg, f)
        // Vertical panels with the sun never in front give P = 0: no spacing rule, so count one row only (conservative).
        const rzedy = odstepM < 1e-6 ? 1 : Math.floor((wglab - rzut) / odstepM + 1e-9) + 1
        const stolow = Math.floor(wzdluzRzedu / poRzedzie + 1e-9)
        const liczba = rzedy * k * stolow
        if (liczba > najlepsze.liczba) {
          najlepsze = { liczba, ulozenie: null, pochylone: { rzedy, panelowNaStole: k, stolowWRzedzie: stolow, stolM, odstepM } }
        }
      }
    }
  }
  return najlepsze
}
