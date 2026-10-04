import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { EPS_PODZIALU, WIATA_KAT_SAMOOCZYSZCZANIA_MAX_DEG, WIATA_KAT_SAMOOCZYSZCZANIA_MIN_DEG } from "./constants"
import type { WiataInput } from "./input"
import { validateWiata } from "./validation"
import { wiataKatPonizejSamooczyszczania, wiataKatWZakresie, wiataPanelSieNieMiesci } from "./warnings"
import { fabrykaWyniku, statusZOstrzezen } from "./wynik"

/** Dłuższy bok panelu biegnie wzdłuż długości albo szerokości wiaty. */
export type OrientacjaPanelu = "wzdluzDlugosci" | "wzdluzSzerokosci"

/** Prostokątny blok paneli w jednej orientacji: `kolumny` wzdłuż długości wiaty, `rzedy` wzdłuż szerokości. */
export type BlokPaneli = { orientacja: OrientacjaPanelu; kolumny: number; rzedy: number }

/**
 * Jak leżą dwa bloki: `obokWzdluzDlugosci` — jeden za drugim wzdłuż długości wiaty (każdy na całą
 * szerokość); `obokWzdluzSzerokosci` — jeden za drugim wzdłuż szerokości; `brak` — jeden blok.
 */
export type Podzial = "brak" | "obokWzdluzDlugosci" | "obokWzdluzSzerokosci"

export type Ulozenie = { liczbaPaneli: number; bloki: BlokPaneli[]; podzial: Podzial }

export type WiataResult = Ulozenie & {
  mocKwp: number
  /** Część połaci pokryta panelami [%]. */
  pokryciePct: number
}

const FORMULA =
  "n = \\max_{\\text{układy}} \\sum_{\\text{bloki}} \\left\\lfloor \\frac{L_b}{a} \\right\\rfloor \\left\\lfloor \\frac{W_b}{b} \\right\\rfloor,\\quad P = n \\cdot P_{panel}"

const ile = (dlugosc: number, bok: number) => Math.max(0, Math.floor(dlugosc / bok + EPS_PODZIALU))

function blok(orientacja: OrientacjaPanelu, dlWzdluzL: number, dlWzdluzW: number, L: number, W: number): BlokPaneli {
  return { orientacja, kolumny: ile(L, dlWzdluzL), rzedy: ile(W, dlWzdluzW) }
}

const liczba = (bloki: BlokPaneli[]) => bloki.reduce((a, b) => a + b.kolumny * b.rzedy, 0)

/**
 * Najlepsze ułożenie identycznych prostokątów na prostokącie L × W spośród układów "gilotynowych"
 * z najwyżej dwoma blokami: cała połać w jednej orientacji albo połać przecięta raz (wzdłuż długości
 * lub szerokości) i każda część w innej orientacji. Przy remisie wygrywa prostszy układ (jeden blok).
 * To nie jest dowód optimum dla każdych wymiarów — jawne w `assumptions`.
 */
export function ulozPanele(L: number, W: number, dlPanelu: number, szPanelu: number): Ulozenie {
  const orient: [OrientacjaPanelu, number, number][] = [
    ["wzdluzDlugosci", dlPanelu, szPanelu],
    ["wzdluzSzerokosci", szPanelu, dlPanelu],
  ]
  const kandydaci: { bloki: BlokPaneli[]; podzial: Podzial }[] = orient.map(([o, a, b]) => ({ bloki: [blok(o, a, b, L, W)], podzial: "brak" }))
  for (const [o1, a1, b1] of orient) {
    const [o2, a2, b2] = orient.find(([o]) => o !== o1)!
    // Cięcie w poprzek długości: i kolumn w orientacji 1, reszta długości w orientacji 2.
    for (let i = 1; i <= ile(L, a1); i++) {
      kandydaci.push({ bloki: [blok(o1, a1, b1, i * a1, W), blok(o2, a2, b2, L - i * a1, W)], podzial: "obokWzdluzDlugosci" })
    }
    // Cięcie w poprzek szerokości: j rzędów w orientacji 1, reszta szerokości w orientacji 2.
    for (let j = 1; j <= ile(W, b1); j++) {
      kandydaci.push({ bloki: [blok(o1, a1, b1, L, j * b1), blok(o2, a2, b2, L, W - j * b1)], podzial: "obokWzdluzSzerokosci" })
    }
  }
  let najlepszy = kandydaci[0]!
  for (const k of kandydaci) if (liczba(k.bloki) > liczba(najlepszy.bloki)) najlepszy = k
  const bloki = najlepszy.bloki.filter((b) => b.kolumny * b.rzedy > 0)
  return { liczbaPaneli: liczba(bloki), bloki, podzial: bloki.length === 2 ? najlepszy.podzial : "brak" }
}

/**
 * Tryb "Wiata/carport" (dawne 2.9). Źródło (B): "algorytm optymalnego pakowania paneli na powierzchni
 * (bin packing); minimalny kąt 5-10° dla samooczyszczania". Zakres 5–10° pokazany jako zakres — źródło
 * nie mówi, który koniec wystarcza (Dyrektywa #1). Przykład "6×4 m → 8 paneli (4×2), 3,2 kWp" nie podaje
 * wymiarów panelu — test odtwarza go dla panelu 1,5 × 2,0 m / 400 Wp (założenie testu, nie źródła).
 */
export function calculateWiata(input: WiataInput): CalcResult<WiataResult | null> {
  const wynik = fabrykaWyniku<WiataResult>(input, FORMULA, "szt.", "UI-FORMULA-PV-TYP-MONTAZU-WIATA")
  const errors = validateWiata(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)

  const { dlugoscM: L, szerokoscM: W, dlugoscPaneluM, szerokoscPaneluM, mocPaneluW, nachylenieDeg: kat } = input
  if (L === null || W === null || dlugoscPaneluM === null || szerokoscPaneluM === null || mocPaneluW === null || kat === null) {
    return wynik("INCOMPLETE", null)
  }

  const ulozenie = ulozPanele(L, W, Math.max(dlugoscPaneluM, szerokoscPaneluM), Math.min(dlugoscPaneluM, szerokoscPaneluM))
  const warnings: Warning[] = []
  if (ulozenie.liczbaPaneli === 0) warnings.push(wiataPanelSieNieMiesci())
  const [min, max] = [WIATA_KAT_SAMOOCZYSZCZANIA_MIN_DEG, WIATA_KAT_SAMOOCZYSZCZANIA_MAX_DEG]
  if (kat < min) warnings.push(wiataKatPonizejSamooczyszczania(kat, min, max))
  else if (kat < max) warnings.push(wiataKatWZakresie(kat, min, max))

  const assumptions: Assumption[] = [
    { kod: "TM-ZALOZENIE-WYMIARY-POLACI" },
    { kod: "TM-ZALOZENIE-UKLAD-DWUBLOKOWY" },
    { kod: "TM-ZALOZENIE-BEZ-SZCZELIN" },
  ]

  return wynik(
    statusZOstrzezen(warnings),
    {
      ...ulozenie,
      mocKwp: (ulozenie.liczbaPaneli * mocPaneluW) / 1000,
      pokryciePct: (100 * ulozenie.liczbaPaneli * dlugoscPaneluM * szerokoscPaneluM) / (L * W),
    },
    warnings,
    assumptions,
  )
}
