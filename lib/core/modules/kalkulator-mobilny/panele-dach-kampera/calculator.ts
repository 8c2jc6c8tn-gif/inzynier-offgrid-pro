import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PaneleDachKamperaInput } from "./input"
import { validateInput } from "./validation"
import { panelSieNieMiesci, sprawdzMocowanie } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "n = \\left\\lfloor \\dfrac{L_{odc} - 2m + s}{a + s} \\right\\rfloor \\times \\left\\lfloor \\dfrac{W - 2m + s}{b + s} \\right\\rfloor \\ (\\text{lepsza z dwóch orientacji})"

export type UkladOdcinka = {
  /** Paneli wzdłuż dachu × w poprzek. */
  wzdluz: number
  wPoprzek: number
  /** true = dłuższy bok panelu wzdłuż dachu. */
  panelWzdluz: boolean
  paneli: number
}

export type PaneleDachKamperaResult = {
  odcinki: UkladOdcinka[]
  liczbaPaneli: number
  mocW: number
}

const PUSTY_WYNIK: PaneleDachKamperaResult = { odcinki: [], liczbaPaneli: 0, mocW: 0 }

/** How many panels of size a × b fit in a row of length `dostepne` with gaps `odstep`. */
function ileWRzedzie(dostepne: number, bok: number, odstep: number): number {
  if (dostepne < bok) return 0
  // Tolerance for floating-point error when panels fill the length exactly.
  return Math.floor((dostepne + odstep) / (bok + odstep) + 1e-9)
}

function uklad(dlugoscOdcinka: number, input: PaneleDachKamperaInput): UkladOdcinka {
  const dl = dlugoscOdcinka - 2 * input.marginesM
  const sz = input.szerokoscDachuM - 2 * input.marginesM
  const warianty = [true, false].map((panelWzdluz) => {
    const a = panelWzdluz ? input.panelDlugoscM : input.panelSzerokoscM
    const b = panelWzdluz ? input.panelSzerokoscM : input.panelDlugoscM
    const wzdluz = ileWRzedzie(dl, a, input.odstepM)
    const wPoprzek = ileWRzedzie(sz, b, input.odstepM)
    return { wzdluz, wPoprzek, panelWzdluz, paneli: wzdluz * wPoprzek }
  })
  return warianty[1].paneli > warianty[0].paneli ? warianty[1] : warianty[0]
}

/**
 * Ekran 19, Moduł 12 — "Ile paneli na dachu kampera" (dawne 8.39, Biblia §12.27). Siatka prostokątów
 * na każdym wolnym odcinku dachu (dach minus przeszkody), margines od krawędzi i przeszkód, odstęp
 * między panelami; na każdym odcinku lepsza z dwóch orientacji. Przykłady źródła (6 × 2 m → 3 panele
 * 100 W; 6 × 2,3 m minus klimatyzator i 2 świetliki → 3 × 175 W) nie podają wymiarów paneli ani przeszkód,
 * więc nie są odtwarzane 1:1.
 */
export function calculatePaneleDachKampera(input: PaneleDachKamperaInput): CalcResult<PaneleDachKamperaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    szerokoscDachuM: input.szerokoscDachuM,
    marginesM: input.marginesM,
    odstepM: input.odstepM,
    panelDlugoscM: input.panelDlugoscM,
    panelSzerokoscM: input.panelSzerokoscM,
    panelMocW: input.panelMocW,
  }
  const baza = { unit: "szt.", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wpisane = input.odcinki.filter((o) => o.dlugoscM > 0)
  if (
    wpisane.length === 0 ||
    input.szerokoscDachuM === 0 ||
    input.panelDlugoscM === 0 ||
    input.panelSzerokoscM === 0 ||
    input.panelMocW === 0
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const odcinki = wpisane.map((o) => uklad(o.dlugoscM, input))
  const liczbaPaneli = odcinki.reduce((s, o) => s + o.paneli, 0)
  const warnings: Warning[] = []
  if (liczbaPaneli === 0) warnings.push(panelSieNieMiesci())
  warnings.push(sprawdzMocowanie())

  return {
    ...baza,
    value: { odcinki, liczbaPaneli, mocW: liczbaPaneli * input.panelMocW },
    status: liczbaPaneli === 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "DK-ZALOZENIE-JEDEN-MODEL" }],
    warnings,
  }
}
