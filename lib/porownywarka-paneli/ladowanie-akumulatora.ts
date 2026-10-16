/**
 * Charging of a battery by the chosen MPPT regulator / hybrid inverter for each panel set in the comparison (micro-installation mode, O2 —
 * the board "1–4 panels with a regulator"). Reuses the engine of the screen "Ładowanie akumulatora z regulatora": the panel power is the
 * STC power of the set, the regulator limits come from the device card (a limit the card does not give stays unknown, never guessed), the
 * battery's own limit and capacity are the user's. When a set needs several devices (A4), they are assumed to charge the same battery in
 * parallel, so their current and PV-input power limits add up.
 */
import type { UrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { calculateLadowanieZRegulatora, type LadowanieZRegulatoraResult } from "@/lib/core/modules/kalkulator-mobilny/ladowanie-z-regulatora/calculator"
import type { LimityWejsciaPv } from "@/lib/core/modules/pv/porownywarka-paneli/dopasowanie-urzadzenia"

export type PanelDoLadowania = {
  id: string
  nazwa: string
  liczbaPaneli: number
  /** Power of the whole set [kWp] (STC). */
  mocKwp: number
  /** Number of devices of the proposed layout (A4); `null` = no layout fits the device's limits. */
  liczbaUrzadzen: number | null
}

export type WierszLadowania = { panel: PanelDoLadowania; wynik: LadowanieZRegulatoraResult }

export type LadowanieAkumulatoraPaneli = { napiecieV: number; wiersze: WierszLadowania[] }

/**
 * `null` = nothing to show: no device, a micro-inverter (it does not charge a battery), a device without PV input, or no battery
 * voltage (a device with several battery voltages needs one chosen).
 */
export function ladowanieAkumulatoraPaneli(a: {
  urzadzenie: UrzadzeniePv | undefined
  limity: LimityWejsciaPv | null
  akumV: number | null
  pojemnoscAh: number | null
  maksPradAkumulatoraA: number | null
  panele: PanelDoLadowania[]
}): LadowanieAkumulatoraPaneli | null {
  const { urzadzenie, limity } = a
  if (!urzadzenie || !limity || urzadzenie.rodzaj === "mikroinwerter-sieciowy" || !limity.maWejsciePv) return null
  const napiecieV = a.akumV ?? (urzadzenie.napieciaAkumulatoraV?.length === 1 ? urzadzenie.napieciaAkumulatoraV[0]! : null)
  if (napiecieV === null) return null
  const wiersze: WierszLadowania[] = []
  for (const panel of a.panele) {
    if (panel.liczbaUrzadzen === null || panel.liczbaUrzadzen < 1) continue
    const k = panel.liczbaUrzadzen
    const w = calculateLadowanieZRegulatora({
      mocPaneliW: panel.mocKwp * 1000,
      napiecieAkumulatoraV: napiecieV,
      pojemnoscAh: a.pojemnoscAh,
      maksPradLadowaniaAkumulatoraA: a.maksPradAkumulatoraA,
      regulatorPradMaxA: urzadzenie.pradLadowaniaMaxA === null ? null : urzadzenie.pradLadowaniaMaxA * k,
      regulatorMocPvMaxW: limity.mocLimitW === null ? null : limity.mocLimitW * k,
      sprawnoscRegulatoraPct: null,
      socOdPct: null,
      socDoPct: null,
    })
    if (w.status === "INVALID_INPUT" || w.status === "INCOMPLETE" || !w.value) continue
    wiersze.push({ panel, wynik: w.value })
  }
  return wiersze.length > 0 ? { napiecieV, wiersze } : null
}
