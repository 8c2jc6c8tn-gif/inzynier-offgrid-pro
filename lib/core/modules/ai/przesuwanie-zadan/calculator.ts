import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { KROK_PROBKOWANIA_H } from "../prognozy/calculator"
import { HORYZONT_H, KROK_PLANU_H, godzinaTekst } from "./constants"

export { godzinaTekst }
import type { PrzesuwanieZadanInput } from "./input"
import { validateInput } from "./validation"
import { zadanieBezNadwyzki, zadaniePozaOknem } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "N(t) = \\max(0,\\, P_{PV}(t) - P_{baza}(t)),\\quad E_{PV} = \\sum_{t \\in [s,\\, s+d)} \\min(P_z,\\, N(t)) \\cdot \\Delta t,\\quad s^* = \\arg\\max_{s:\\; od \\le s,\\; s+d \\le do} E_{PV}"

export type ZadanieZaplanowane = {
  id: string
  nazwa: string
  /** null = the task does not fit its window (start/deadline/run time). */
  startH: number | null
  koniecH: number | null
  energiaKwh: number
  /** Part of the task's energy covered by the forecast PV surplus [kWh]. */
  zPvKwh: number
  /** The rest — from the battery (or another source) [kWh]. */
  zBateriiKwh: number
  /** Share covered by PV surplus [%]. */
  pokryciePvPct: number
}

export type PrzesuwanieZadanResult = {
  zadania: ZadanieZaplanowane[]
  /** Surplus of the whole day before the tasks [kWh]. */
  nadwyzkaDobyKwh: number
  /** Sum over scheduled tasks. */
  zPvRazemKwh: number
  zBateriiRazemKwh: number
}

const PUSTY: PrzesuwanieZadanResult = { zadania: [], nadwyzkaDobyKwh: 0, zPvRazemKwh: 0, zBateriiRazemKwh: 0 }

/** Surplus per planning slot [kW]: the forecast point covering the slot (average over its 3 h window). */
function nadwyzkaSlotow(input: PrzesuwanieZadanInput): number[] {
  const n = Math.round(HORYZONT_H / KROK_PLANU_H)
  const sloty = Array<number>(n).fill(0)
  for (const p of input.prognoza) {
    const od = Math.round(p.godzina / KROK_PLANU_H)
    const ile = Math.round(KROK_PROBKOWANIA_H / KROK_PLANU_H)
    for (let i = od; i < od + ile && i < n; i++) sloty[i] = Math.max(0, p.produkcjaKw - p.zuzycieKw)
  }
  return sloty
}

function pvWOknie(sloty: number[], start: number, ile: number, mocKw: number): number {
  let e = 0
  for (let i = start; i < start + ile; i++) e += Math.min(mocKw, sloty[i]!) * KROK_PLANU_H
  return e
}

/**
 * Moduł 10, Ekran 5 — „Dynamiczne przesuwanie zadań domowych” (dawne 12.10, Biblia §12.10). Source Sekcja B:
 * „AI ustala kolejność i czas wykonania zadań, biorąc pod uwagę zarówno dostępność energii, jak i ograniczenia
 * czasowe użytkownika — nie przesuwa zadania poza akceptowalne okno, nawet jeśli energetycznie byłoby to optymalne.”
 *
 * Deterministic planner, not a learned model: the forecast of Screen 1 (8 points × 3 h, average power — the same
 * contract as `prognozy`, Dyrektywa #8) gives the PV surplus N(t) = max(0, production − base consumption) in 30-min
 * slots. Tasks are placed one by one in list order (an earlier task takes the surplus first); each gets the start
 * with the most PV energy inside [earliest, deadline − run time]; on a tie the earliest start. Never outside the
 * window — a task that does not fit is reported, not moved. The rest of each task's energy comes from the battery.
 * Choices without a source (✅🤖, `docs/lista-do-zrobienia.md` ⚠️ 02.10.2026): 30-min grid, list order as
 * priority, earliest start on a tie, one-day horizon, tasks may overlap (combined power not checked here).
 */
export function calculatePrzesuwanieZadan(input: PrzesuwanieZadanInput): CalcResult<PrzesuwanieZadanResult> {
  const inputs: Record<string, number> = { liczbaZadan: input.zadania.length, liczbaPunktow: input.prognoza.length }
  input.zadania.forEach((z, i) => {
    inputs[`moc${i + 1}`] = z.mocKw
    inputs[`czas${i + 1}`] = z.czasTrwaniaH
    inputs[`od${i + 1}`] = z.najwczesniejOdH
    inputs[`do${i + 1}`] = z.gotoweDoH
  })
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const brakDanych =
    input.prognoza.length === 0 ||
    input.prognoza.every((p) => p.produkcjaKw === 0) ||
    input.zadania.length === 0 ||
    input.zadania.some((z) => z.mocKw === 0 || z.czasTrwaniaH === 0)
  if (brakDanych) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const sloty = nadwyzkaSlotow(input)
  const nadwyzkaDobyKwh = sloty.reduce((a, s) => a + s * KROK_PLANU_H, 0)
  const warnings: Warning[] = []
  const zadania: ZadanieZaplanowane[] = []

  for (const z of input.zadania) {
    const energiaKwh = z.mocKw * z.czasTrwaniaH
    const ile = Math.round(z.czasTrwaniaH / KROK_PLANU_H)
    const pierwszy = Math.round(z.najwczesniejOdH / KROK_PLANU_H)
    const ostatni = Math.round(z.gotoweDoH / KROK_PLANU_H) - ile
    if (ostatni < pierwszy) {
      warnings.push(zadaniePozaOknem(z.nazwa, z.czasTrwaniaH, godzinaTekst(z.najwczesniejOdH), godzinaTekst(z.gotoweDoH)))
      zadania.push({ id: z.id, nazwa: z.nazwa, startH: null, koniecH: null, energiaKwh, zPvKwh: 0, zBateriiKwh: energiaKwh, pokryciePvPct: 0 })
      continue
    }
    let najlepszy = pierwszy
    let najlepszeE = -1
    for (let s = pierwszy; s <= ostatni; s++) {
      const e = pvWOknie(sloty, s, ile, z.mocKw)
      if (e > najlepszeE + 1e-12) {
        najlepszeE = e
        najlepszy = s
      }
    }
    for (let i = najlepszy; i < najlepszy + ile; i++) sloty[i] = sloty[i]! - Math.min(z.mocKw, sloty[i]!)
    const startH = najlepszy * KROK_PLANU_H
    if (najlepszeE <= 0) warnings.push(zadanieBezNadwyzki(z.nazwa, godzinaTekst(startH)))
    zadania.push({
      id: z.id,
      nazwa: z.nazwa,
      startH,
      koniecH: startH + z.czasTrwaniaH,
      energiaKwh,
      zPvKwh: najlepszeE,
      zBateriiKwh: energiaKwh - najlepszeE,
      pokryciePvPct: (najlepszeE / energiaKwh) * 100,
    })
  }

  const zaplanowane = zadania.filter((z) => z.startH !== null)
  const assumptions: Assumption[] = [
    { kod: "PRZES-ZAL-PROGNOZA", params: { krok: KROK_PROBKOWANIA_H } },
    { kod: "PRZES-ZAL-KOLEJNOSC" },
    { kod: "PRZES-ZAL-BATERIA" },
  ]
  return {
    ...baza,
    value: {
      zadania,
      nadwyzkaDobyKwh,
      zPvRazemKwh: zaplanowane.reduce((a, z) => a + z.zPvKwh, 0),
      zBateriiRazemKwh: zaplanowane.reduce((a, z) => a + z.zBateriiKwh, 0),
    },
    status: warnings.some((w) => w.level === "warning") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
