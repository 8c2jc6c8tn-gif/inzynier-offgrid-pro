import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { BlackoutBalkonInput } from "./input"
import { validateInput } from "./validation"
import { bezKlimatyzacji, montazNaBalkonie, panelSieNieMiesci, zaMaloNaBlackout } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_d = \\sum P_i h_i, \\quad E_T = E_d \\tfrac{T}{24}, \\quad E_{mag} = C \\times u \\times \\eta_f, \\quad n = \\lfloor L / b \\rfloor, \\quad E_{PV,T} = n P h_{sł} \\eta \\tfrac{T}{24}"

/** Floor tolerance so 2.0 m / 1.0 m is never 1.999… panels. */
const TOLERANCJA = 1e-9

export type BlackoutBalkonResult = {
  zuzycieDobaWh: number
  energiaBlackoutWh: number
  /** Energia magazynu do wykorzystania po stronie odbiorników [Wh]. */
  energiaMagazynuWh: number
  /** Na ile godzin starczy sam magazyn (bez słońca). */
  magazynStarczyH: number
  liczbaPaneli: number
  mocPaneliW: number
  /** Energia z paneli na dobę [Wh]. */
  energiaPaneliDobaWh: number
  /** Magazyn + panele w czasie blackoutu − potrzeby [Wh]; ujemny = zabraknie. */
  bilansWh: number
}

const PUSTY_WYNIK: BlackoutBalkonResult = {
  zuzycieDobaWh: 0,
  energiaBlackoutWh: 0,
  energiaMagazynuWh: 0,
  magazynStarczyH: 0,
  liczbaPaneli: 0,
  mocPaneliW: 0,
  energiaPaneliDobaWh: 0,
  bilansWh: 0,
}

/**
 * Ekran 40, Moduł 12 — "Blackout w bloku — zestaw balkonowy" (dawne 8.68, Biblia §12.56). Odbiorniki krytyczne
 * mieszkania, stacja zasilania / akumulator (energia × część użyteczna × sprawność falownika) i panele na
 * balustradzie: liczba = ⌊długość balustrady / szerokość panelu⌋, energia z paneli w czasie blackoutu =
 * dobowa × T/24 (średnia, jawne założenie). Przykład Biblii ("400 W + 1000 Wh podtrzyma lodówkę i router
 * przez 6 h") nie podaje mocy odbiorników ani słońca — nieodtwarzalny 1:1. Blackout w domu z działką — E13.
 */
export function calculateBlackoutBalkon(input: BlackoutBalkonInput): CalcResult<BlackoutBalkonResult> {
  const { errors } = validateInput(input)
  const inputs = Object.fromEntries(Object.entries(input).filter(([, v]) => typeof v === "number")) as Record<string, number>
  const baza = { unit: "Wh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wpisane = input.odbiorniki.filter((o) => o.mocW > 0 && o.godzinNaDobe > 0)
  const zPanelem = input.dlugoscBalustradyM > 0
  if (
    wpisane.length === 0 ||
    input.czasBlackoutuH === 0 ||
    input.pojemnoscWh === 0 ||
    input.uzytecznaPct === 0 ||
    input.sprawnoscFalownikaPct === 0 ||
    (zPanelem &&
      (input.szerokoscPaneluM === 0 || input.mocPaneluW === 0 || input.godzinSlonca === 0 || input.sprawnoscToruPct === 0))
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zuzycieDobaWh = wpisane.reduce((s, o) => s + o.mocW * o.godzinNaDobe, 0)
  const energiaBlackoutWh = (zuzycieDobaWh * input.czasBlackoutuH) / 24
  const energiaMagazynuWh = input.pojemnoscWh * (input.uzytecznaPct / 100) * (input.sprawnoscFalownikaPct / 100)
  const magazynStarczyH = (energiaMagazynuWh / zuzycieDobaWh) * 24
  const liczbaPaneli = zPanelem ? Math.floor(input.dlugoscBalustradyM / input.szerokoscPaneluM + TOLERANCJA) : 0
  const mocPaneliW = liczbaPaneli * input.mocPaneluW
  const energiaPaneliDobaWh = mocPaneliW * input.godzinSlonca * (input.sprawnoscToruPct / 100)
  const bilansWh = energiaMagazynuWh + (energiaPaneliDobaWh * input.czasBlackoutuH) / 24 - energiaBlackoutWh

  const warnings: Warning[] = []
  if (zPanelem && liczbaPaneli === 0) warnings.push(panelSieNieMiesci())
  if (bilansWh < 0) warnings.push(zaMaloNaBlackout(-bilansWh, magazynStarczyH))
  warnings.push(bezKlimatyzacji())
  if (liczbaPaneli > 0) warnings.push(montazNaBalkonie())

  return {
    ...baza,
    value: { zuzycieDobaWh, energiaBlackoutWh, energiaMagazynuWh, magazynStarczyH, liczbaPaneli, mocPaneliW, energiaPaneliDobaWh, bilansWh },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "BB-ZALOZENIE-SREDNIE-SLONCE" }],
    warnings,
  }
}
