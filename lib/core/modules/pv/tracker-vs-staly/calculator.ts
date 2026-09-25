import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { TrackerVsStalyInput } from "./input"
import { validateInput } from "./validation"
import { naporWiatruTrackera, zeroDodatkowychPaneli } from "./warnings"
import { ZYSK_TRACKERA_MAX_PCT, ZYSK_TRACKERA_MIN_PCT } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

/** Który wariant daje więcej energii przy tych samych pieniądzach — w całym zakresie zysku trackera. */
export type WerdyktTrackera = "staly" | "tracker" | "zalezy"

export type TrackerVsStalyResult = {
  /** Ile paneli da się dokupić za cenę trackera (w dół — niepełny panel nie istnieje). */
  dodatkowePanele: number
  liczbaPaneliStaly: number
  /** Roczny uzysk wariantu stałego [kWh/rok]. */
  uzyskStalyKwh: number
  /** Roczny uzysk trackera przy dolnej / górnej granicy zakresu źródła [kWh/rok]. */
  uzyskTrackerMinKwh: number
  uzyskTrackerMaxKwh: number
  /** O ile % wariant stały daje więcej niż tracker — przy górnej / dolnej granicy zysku trackera (ujemne = tracker lepszy). */
  przewagaStalegoMinPct: number
  przewagaStalegoMaxPct: number
  werdykt: WerdyktTrackera
}

const FORMULA =
  `n_{dod} = \\lfloor K_{tr} / K_{p} \\rfloor;\; E_{st} = (n + n_{dod}) \\cdot E_p;\; ` +
  `E_{tr} = n \\cdot E_p \\cdot (1 + z),\; z \\in [${ZYSK_TRACKERA_MIN_PCT}\\%, ${ZYSK_TRACKERA_MAX_PCT}\\%]`

const PUSTY: TrackerVsStalyResult = {
  dodatkowePanele: 0,
  liczbaPaneliStaly: 0,
  uzyskStalyKwh: 0,
  uzyskTrackerMinKwh: 0,
  uzyskTrackerMaxKwh: 0,
  przewagaStalegoMinPct: 0,
  przewagaStalegoMaxPct: 0,
  werdykt: "zalezy",
}

/**
 * Ekran 3, Moduł 3 — "Tracker vs konstrukcja stała" (dawne 2.8). Za cenę trackera dokupujemy
 * panele na stały stelaż i porównujemy roczny uzysk obu wariantów. Zysk trackera to zakres
 * źródła 30–40% — liczone obie granice. Tabela źródła (9 vs 15 paneli, 5200 vs 6800 kWh,
 * 1800 vs 450 kg) to ilustracja, nie wartości do odtworzenia; napór wiatru nie jest liczony
 * (brak wzoru dla trackera — patrz `naporWiatruTrackera`).
 */
export function calculateTrackerVsStaly(input: TrackerVsStalyInput): CalcResult<TrackerVsStalyResult> {
  const { errors } = validateInput(input)
  const inputs = { ...input }
  const wspolne = { unit: "kWh/rok", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  if (errors.length > 0) {
    return { ...wspolne, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  }

  const { liczbaPaneliTracker: n, kosztTrackeraZl, kosztPaneluZl, uzyskPaneluKwh } = input
  if (n === 0 || kosztTrackeraZl === 0 || kosztPaneluZl === 0 || uzyskPaneluKwh === 0) {
    return { ...wspolne, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  // 1e-9 — ochrona przed błędem zmiennoprzecinkowym przy dzieleniu "równo" (np. 6000 / 1000).
  const dodatkowePanele = Math.floor(kosztTrackeraZl / kosztPaneluZl + 1e-9)
  const liczbaPaneliStaly = n + dodatkowePanele
  const uzyskStalyKwh = liczbaPaneliStaly * uzyskPaneluKwh
  const uzyskTrackerMinKwh = n * uzyskPaneluKwh * (1 + ZYSK_TRACKERA_MIN_PCT / 100)
  const uzyskTrackerMaxKwh = n * uzyskPaneluKwh * (1 + ZYSK_TRACKERA_MAX_PCT / 100)
  const przewagaStalegoMinPct = (uzyskStalyKwh / uzyskTrackerMaxKwh - 1) * 100
  const przewagaStalegoMaxPct = (uzyskStalyKwh / uzyskTrackerMinKwh - 1) * 100
  const werdykt: WerdyktTrackera =
    uzyskStalyKwh > uzyskTrackerMaxKwh ? "staly" : uzyskStalyKwh < uzyskTrackerMinKwh ? "tracker" : "zalezy"

  const warnings = [naporWiatruTrackera()]
  if (dodatkowePanele === 0) warnings.push(zeroDodatkowychPaneli())

  return {
    ...wspolne,
    value: {
      dodatkowePanele,
      liczbaPaneliStaly,
      uzyskStalyKwh,
      uzyskTrackerMinKwh,
      uzyskTrackerMaxKwh,
      przewagaStalegoMinPct,
      przewagaStalegoMaxPct,
      werdykt,
    },
    status: "VALID",
    assumptions: [
      { kod: "TVS-ZYSK-TRACKERA-ZAKRES", params: { min: ZYSK_TRACKERA_MIN_PCT, max: ZYSK_TRACKERA_MAX_PCT } },
      { kod: "TVS-DOKUPIENIE-W-DOL" },
      { kod: "TVS-UZYSK-PANELU-STALY" },
    ] satisfies Assumption[],
    warnings,
  }
}
