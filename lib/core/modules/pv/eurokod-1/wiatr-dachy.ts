/**
 * PN-EN 1991-1-4:2008 — współczynniki ciśnienia zewnętrznego cpe dla dachów jednospadowych (Tablice 7.3a i 7.3b) i dwuspadowych (Tablice 7.4a
 * i 7.4b), użyte jako górne oszacowanie obciążenia wiatrem paneli położonych równolegle do połaci (decyzja właściciela 18.10.2026).
 * Skan przepisany i sprawdzony wizualnie z PDF 18.10.2026 (strony 39 i 41 normy; patrz `docs/zrodla/norma-PN-EN-1991-1-4/01-tresc-ocr.txt`).
 *
 * ⚠️ To NIE jest cp,net panelu: norma nie podaje współczynników dla elementów położonych nad połacią ze szczeliną. Bierzemy ciśnienie
 * zewnętrzne połaci, bez wyznaczania ciśnienia pod panelem. Dla panelu (pole około 2 m², element mocowany lokalnie) używamy wartości lokalnej cpe,1
 * (pole obciążane ≤ 1 m²), czyli większej co do modułu niż cpe,10. Dodatnie wartości w tablicach są jedną liczbą (komórka scalona).
 * Zakres tablic: α od 5° do 75° (poniżej 5° obowiązuje Tablica 7.2 dla dachów płaskich, której tu nie użyto). Kąty pośrednie: interpolacja
 * liniowa między wartościami tego samego znaku (Uwaga 2); wartość nieobecna w tablicy dla danego znaku = 0 (nie ma obciążenia tego znaku).
 * Wynik: docisk (+) i odrywanie (wartość bezwzględna), „środek” = największe pola połaci (H, I), „krawędź” = najgorsze ze wszystkich pól
 * (F, G, H, I, J i pola Fup/Flow) i ze wszystkich kierunków wiatru w tablicach.
 */
import type { CpNetWiaty } from "./wiatr"

export type TypDachu = "jednospadowy" | "dwuspadowy"
export const TYPY_DACHU: readonly TypDachu[] = ["jednospadowy", "dwuspadowy"]

/** Zakres kątów połaci objęty Tablicami 7.3 i 7.4 dla dachów o spadku dodatnim [°]. */
export const KAT_POLACI_MIN_DEG = 5
export const KAT_POLACI_MAX_DEG = 75

/** Jedno pole tablicy: `neg` = [cpe,10; cpe,1] (komórka scalona = dwa razy ta sama liczba), `pos` = wartość dodatnia. */
type Pole = { neg?: readonly [number, number]; pos?: number }
type Wiersz = { katDeg: number; pola: Record<string, Pole> }
type Tablica = { wiersze: readonly Wiersz[]; srodek: readonly string[] }

const z = (a: number, b: number): readonly [number, number] => [a, b]
const j = (a: number): readonly [number, number] => [a, a]

/** Tablica 7.3a: dach jednospadowy, wiatr θ = 0° (od niskiej krawędzi). */
const T73A_0: Tablica = {
  srodek: ["H"],
  wiersze: [
    { katDeg: 5, pola: { F: { neg: z(-1.7, -2.5), pos: 0 }, G: { neg: z(-1.2, -2.0), pos: 0 }, H: { neg: z(-0.6, -1.2), pos: 0 } } },
    { katDeg: 15, pola: { F: { neg: z(-0.9, -2.0), pos: 0.2 }, G: { neg: z(-0.8, -1.5), pos: 0.2 }, H: { neg: j(-0.3), pos: 0.2 } } },
    { katDeg: 30, pola: { F: { neg: z(-0.5, -1.5), pos: 0.7 }, G: { neg: z(-0.5, -1.5), pos: 0.7 }, H: { neg: j(-0.2), pos: 0.4 } } },
    { katDeg: 45, pola: { F: { neg: j(0), pos: 0.7 }, G: { neg: j(0), pos: 0.7 }, H: { neg: j(0), pos: 0.6 } } },
    { katDeg: 60, pola: { F: { pos: 0.7 }, G: { pos: 0.7 }, H: { pos: 0.7 } } },
    { katDeg: 75, pola: { F: { pos: 0.8 }, G: { pos: 0.8 }, H: { pos: 0.8 } } },
  ],
}

/** Tablica 7.3a: dach jednospadowy, wiatr θ = 180° (od wysokiej krawędzi). */
const T73A_180: Tablica = {
  srodek: ["H"],
  wiersze: [
    { katDeg: 5, pola: { F: { neg: z(-2.3, -2.5) }, G: { neg: z(-1.3, -2.0) }, H: { neg: z(-0.8, -1.2) } } },
    { katDeg: 15, pola: { F: { neg: z(-2.5, -2.8) }, G: { neg: z(-1.3, -2.0) }, H: { neg: z(-0.9, -1.2) } } },
    { katDeg: 30, pola: { F: { neg: z(-1.1, -2.3) }, G: { neg: z(-0.8, -1.5) }, H: { neg: j(-0.8) } } },
    { katDeg: 45, pola: { F: { neg: z(-0.6, -1.3) }, G: { neg: j(-0.5) }, H: { neg: j(-0.7) } } },
    { katDeg: 60, pola: { F: { neg: z(-0.5, -1.0) }, G: { neg: j(-0.5) }, H: { neg: j(-0.5) } } },
    { katDeg: 75, pola: { F: { neg: z(-0.5, -1.0) }, G: { neg: j(-0.5) }, H: { neg: j(-0.5) } } },
  ],
}

/** Tablica 7.3b: dach jednospadowy, wiatr θ = 90°. */
const T73B_90: Tablica = {
  srodek: ["H", "I"],
  wiersze: [
    { katDeg: 5, pola: { Fup: { neg: z(-2.1, -2.6) }, Flow: { neg: z(-2.1, -2.4) }, G: { neg: z(-1.8, -2.0) }, H: { neg: z(-0.6, -1.2) }, I: { neg: j(-0.5) } } },
    { katDeg: 15, pola: { Fup: { neg: z(-2.4, -2.9) }, Flow: { neg: z(-1.6, -2.4) }, G: { neg: z(-1.9, -2.5) }, H: { neg: z(-0.8, -1.2) }, I: { neg: z(-0.7, -1.2) } } },
    { katDeg: 30, pola: { Fup: { neg: z(-2.1, -2.9) }, Flow: { neg: z(-1.3, -2.0) }, G: { neg: z(-1.5, -2.0) }, H: { neg: z(-1.0, -1.3) }, I: { neg: z(-0.8, -1.2) } } },
    { katDeg: 45, pola: { Fup: { neg: z(-1.5, -2.4) }, Flow: { neg: z(-1.3, -2.0) }, G: { neg: z(-1.4, -2.0) }, H: { neg: z(-1.0, -1.3) }, I: { neg: z(-0.9, -1.2) } } },
    { katDeg: 60, pola: { Fup: { neg: z(-1.2, -2.0) }, Flow: { neg: z(-1.2, -2.0) }, G: { neg: z(-1.2, -2.0) }, H: { neg: z(-1.0, -1.3) }, I: { neg: z(-0.7, -1.2) } } },
    { katDeg: 75, pola: { Fup: { neg: z(-1.2, -2.0) }, Flow: { neg: z(-1.2, -2.0) }, G: { neg: z(-1.2, -2.0) }, H: { neg: z(-1.0, -1.3) }, I: { neg: j(-0.5) } } },
  ],
}

/** Tablica 7.4a: dach dwuspadowy, wiatr θ = 0° (tylko wiersze o spadku dodatnim; J = pas przy kalenicy po stronie zawietrznej). */
const T74A_0: Tablica = {
  srodek: ["H", "I"],
  wiersze: [
    { katDeg: 5, pola: { F: { neg: z(-1.7, -2.5), pos: 0 }, G: { neg: z(-1.2, -2.0), pos: 0 }, H: { neg: z(-0.6, -1.2), pos: 0 }, I: { neg: j(-0.6) }, J: { neg: j(-0.6), pos: 0.2 } } },
    { katDeg: 15, pola: { F: { neg: z(-0.9, -2.0), pos: 0.2 }, G: { neg: z(-0.8, -1.5), pos: 0.2 }, H: { neg: j(-0.3), pos: 0.2 }, I: { neg: j(-0.4), pos: 0 }, J: { neg: z(-1.0, -1.5), pos: 0 } } },
    { katDeg: 30, pola: { F: { neg: z(-0.5, -1.5), pos: 0.7 }, G: { neg: z(-0.5, -1.5), pos: 0.7 }, H: { neg: j(-0.2), pos: 0.4 }, I: { neg: j(-0.4), pos: 0 }, J: { neg: j(-0.5), pos: 0 } } },
    { katDeg: 45, pola: { F: { neg: j(0), pos: 0.7 }, G: { neg: j(0), pos: 0.7 }, H: { neg: j(0), pos: 0.6 }, I: { neg: j(-0.2), pos: 0 }, J: { neg: j(-0.3), pos: 0 } } },
    { katDeg: 60, pola: { F: { pos: 0.7 }, G: { pos: 0.7 }, H: { pos: 0.7 }, I: { neg: j(-0.2) }, J: { neg: j(-0.3) } } },
    { katDeg: 75, pola: { F: { pos: 0.8 }, G: { pos: 0.8 }, H: { pos: 0.8 }, I: { neg: j(-0.2) }, J: { neg: j(-0.3) } } },
  ],
}

/** Tablica 7.4b: dach dwuspadowy, wiatr θ = 90° (tylko wiersze o spadku dodatnim). */
const T74B_90: Tablica = {
  srodek: ["H", "I"],
  wiersze: [
    { katDeg: 5, pola: { F: { neg: z(-1.6, -2.2) }, G: { neg: z(-1.3, -2.0) }, H: { neg: z(-0.7, -1.2) }, I: { neg: j(-0.6) } } },
    { katDeg: 15, pola: { F: { neg: z(-1.3, -2.0) }, G: { neg: z(-1.3, -2.0) }, H: { neg: z(-0.6, -1.2) }, I: { neg: j(-0.5) } } },
    { katDeg: 30, pola: { F: { neg: z(-1.1, -1.5) }, G: { neg: z(-1.4, -2.0) }, H: { neg: z(-0.8, -1.2) }, I: { neg: j(-0.5) } } },
    { katDeg: 45, pola: { F: { neg: z(-1.1, -1.5) }, G: { neg: z(-1.4, -2.0) }, H: { neg: z(-0.9, -1.2) }, I: { neg: j(-0.5) } } },
    { katDeg: 60, pola: { F: { neg: z(-1.1, -1.5) }, G: { neg: z(-1.2, -2.0) }, H: { neg: z(-0.8, -1.0) }, I: { neg: j(-0.5) } } },
    { katDeg: 75, pola: { F: { neg: z(-1.1, -1.5) }, G: { neg: z(-1.2, -2.0) }, H: { neg: z(-0.8, -1.0) }, I: { neg: j(-0.5) } } },
  ],
}

const TABLICE: Record<TypDachu, readonly Tablica[]> = {
  jednospadowy: [T73A_0, T73A_180, T73B_90],
  dwuspadowy: [T74A_0, T74B_90],
}

/** Wartość pola dla kąta: liniowo między sąsiednimi wierszami (Uwaga 2). `znak`: docisk (`pos`) albo odrywanie (moduł `neg` cpe,1). */
function wartoscPola(wiersze: readonly Wiersz[], katDeg: number, pole: string, znak: "docisk" | "odrywanie"): number {
  const pobierz = (w: Wiersz): number => {
    const p = w.pola[pole]
    if (!p) return 0
    return znak === "docisk" ? (p.pos ?? 0) : Math.abs(p.neg?.[1] ?? 0)
  }
  const gorny = wiersze.findIndex((w) => w.katDeg >= katDeg)
  const g = wiersze[gorny]!
  if (g.katDeg === katDeg || gorny === 0) return pobierz(g)
  const d = wiersze[gorny - 1]!
  const t = (katDeg - d.katDeg) / (g.katDeg - d.katDeg)
  return pobierz(d) + t * (pobierz(g) - pobierz(d))
}

/**
 * Górne oszacowanie ciśnienia zewnętrznego na panel równoległy do połaci o spadku `katDeg` (5–75°); `null` poza zakresem tablic.
 * Zob. ostrzeżenie w nagłówku pliku: to cpe połaci, nie cp,net panelu.
 */
export function cpeDachuDlaPaneluRownoleglego(typ: TypDachu, katDeg: number): CpNetWiaty | null {
  if (!Number.isFinite(katDeg) || katDeg < KAT_POLACI_MIN_DEG || katDeg > KAT_POLACI_MAX_DEG) return null
  let dociskSrodek = 0
  let dociskKrawedz = 0
  let odrywanieSrodek = 0
  let odrywanieKrawedz = 0
  for (const tablica of TABLICE[typ]) {
    for (const pole of Object.keys(tablica.wiersze[0]!.pola)) {
      const docisk = wartoscPola(tablica.wiersze, katDeg, pole, "docisk")
      const odrywanie = wartoscPola(tablica.wiersze, katDeg, pole, "odrywanie")
      dociskKrawedz = Math.max(dociskKrawedz, docisk)
      odrywanieKrawedz = Math.max(odrywanieKrawedz, odrywanie)
      if (tablica.srodek.includes(pole)) {
        dociskSrodek = Math.max(dociskSrodek, docisk)
        odrywanieSrodek = Math.max(odrywanieSrodek, odrywanie)
      }
    }
  }
  return { dociskSrodek, dociskKrawedz, odrywanieSrodek, odrywanieKrawedz }
}
