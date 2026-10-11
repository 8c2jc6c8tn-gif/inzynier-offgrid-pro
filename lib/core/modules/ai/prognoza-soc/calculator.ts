import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DLUGOSC_OKNA_H, LICZBA_OKIEN, type PrognozaSocInput } from "./input"
import { validateInput } from "./validation"
import { bateriaOsiagnieMinimum, brakSprawnosci, brakWspolczynnikow, nadwyzkaPonadBateria, niedobor, startPonizejMinimum } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_{t+1} = E_t + \\eta_c \\cdot (P_{PV} - P_{obc}) \\cdot \\Delta t \\quad (P_{PV} > P_{obc}),\\qquad E_{t+1} = E_t - \\dfrac{(P_{obc} - P_{PV}) \\cdot \\Delta t}{\\eta_d}\\ \\text{w granicach}\\ E_{min} \\ldots E_{max}"
const EPS = 1e-9

export type TypSegmentu = "ladowanie" | "nadwyzka" | "rozladowanie" | "brak"

/** A stretch of consecutive hours with the same battery behaviour; `doT` is exclusive. */
export type Segment = { typ: TypSegmentu; odT: number; doT: number }

export type GodzinaSymulacji = {
  /** Hours since the start of the forecast (0-based; the hour t..t+1). */
  t: number
  produkcjaKw: number
  zuzycieKw: number
  /** State of charge at the END of this hour [%]. */
  socPct: number
}

export type PrognozaSocResult = {
  godziny: GodzinaSymulacji[]
  /** SoC at t = 0 … horizon [%] (length horizon + 1). */
  socSeriaPct: number[]
  socKoncowePct: number
  minSocPct: number
  /** Hours from the start at which the lowest SoC is first reached. */
  minSocT: number
  maksSocPct: number
  maksSocT: number
  /** Hours from the start at which the battery first reaches the lowest allowed charge; `null` = never within the horizon. */
  pierwszeMinimumT: number | null
  pierwszeMaksimumT: number | null
  niedoborKwh: number
  godzinyBezZasilania: number
  nadmiarKwh: number
  produkcjaLacznaKwh: number
  zuzycieLaczneKwh: number
  segmenty: Segment[]
  szczytProdukcjiT: number
  szczytZuzyciaT: number
}

const PUSTY: PrognozaSocResult = {
  godziny: [],
  socSeriaPct: [],
  socKoncowePct: 0,
  minSocPct: 0,
  minSocT: 0,
  maksSocPct: 0,
  maksSocT: 0,
  pierwszeMinimumT: null,
  pierwszeMaksimumT: null,
  niedoborKwh: 0,
  godzinyBezZasilania: 0,
  nadmiarKwh: 0,
  produkcjaLacznaKwh: 0,
  zuzycieLaczneKwh: 0,
  segmenty: [],
  szczytProdukcjiT: 0,
  szczytZuzyciaT: 0,
}

/**
 * Battery state-of-charge forecast on 24–72 h (module 10, 12.4) and the timeline built from it (12.43), hour by hour, from the user's
 * own daily profile (average kW in eight 3-hour windows). Energy bookkeeping only: charge efficiency and power limits are the user's
 * numbers from the datasheet; the engine knows nothing of weather or temperature — a cold battery is modelled only through the
 * lowered charge power the user enters.
 */
export function calculatePrognozaSoc(input: PrognozaSocInput): CalcResult<PrognozaSocResult> {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number" && Number.isFinite(v)) inputs[k] = v
  const wynik = (status: CalcResult<PrognozaSocResult>["status"], value: PrognozaSocResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<PrognozaSocResult> => ({
    value,
    unit: "%",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)
  const { pojemnoscUzytecznaKwh: cap, socStartPct, socMinPct, godzinaStartu, horyzontH } = input
  const profilKompletny = Array.from({ length: LICZBA_OKIEN }, (_, k) => input.produkcjaKw[k] != null && input.zuzycieKw[k] != null).every(Boolean)
  if (cap === null || socStartPct === null || socMinPct === null || godzinaStartu === null || horyzontH === null || !profilKompletny) return wynik("INCOMPLETE", PUSTY, [])

  const etaC = (input.sprawnoscLadowaniaPct ?? 100) / 100
  const etaD = (input.sprawnoscRozladowaniaPct ?? 100) / 100
  const maksLad = input.maksMocLadowaniaKw ?? Infinity
  const maksRozl = input.maksMocRozladowaniaKw ?? Infinity
  const socMaks = input.socMaksPct ?? 100
  const eMin = (cap * socMinPct) / 100
  const eMaks = (cap * socMaks) / 100
  const pct = (e: number) => (e / cap) * 100

  let e = (cap * socStartPct) / 100
  const seria = [pct(e)]
  const godziny: GodzinaSymulacji[] = []
  const typy: (TypSegmentu | null)[] = []
  let niedoborKwh = 0
  let godzinyBezZasilania = 0
  let nadmiarKwh = 0
  let produkcjaLacznaKwh = 0
  let zuzycieLaczneKwh = 0
  let szczytProdukcjiT = 0
  let szczytZuzyciaT = 0
  let maxP = -Infinity
  let maxC = -Infinity
  let pierwszeMinimumT: number | null = socStartPct <= socMinPct + EPS ? 0 : null
  let pierwszeMaksimumT: number | null = socStartPct >= socMaks - EPS ? 0 : null
  let minSocPct = seria[0]!
  let minSocT = 0
  let maksSocPct = seria[0]!
  let maksSocT = 0

  for (let t = 0; t < horyzontH; t++) {
    const zegar = (godzinaStartu + t) % 24
    const okno = Math.floor(zegar / DLUGOSC_OKNA_H)
    const doba = Math.floor(t / 24)
    const wsp = (input.wspolczynnikDniPct[doba] ?? 100) / 100
    const p = (input.produkcjaKw[okno] ?? 0) * wsp
    const c = input.zuzycieKw[okno] ?? 0
    produkcjaLacznaKwh += p
    zuzycieLaczneKwh += c
    if (p > maxP + EPS) { maxP = p; szczytProdukcjiT = t }
    if (c > maxC + EPS) { maxC = c; szczytZuzyciaT = t }

    const net = p - c
    let typ: TypSegmentu | null = null
    if (net > EPS) {
      const wejscie = Math.min(net, maksLad)
      const miejsce = Math.max(0, eMaks - e)
      const zmagazynowane = Math.min(wejscie * etaC, miejsce)
      e += zmagazynowane
      const stracone = net - zmagazynowane / etaC
      nadmiarKwh += stracone
      typ = stracone > EPS ? "nadwyzka" : "ladowanie"
    } else if (net < -EPS) {
      const potrzeba = -net
      const dostepne = Math.max(0, e - eMin) * etaD
      const dostarczone = Math.min(potrzeba, maksRozl, dostepne)
      e -= dostarczone / etaD
      const brak = potrzeba - dostarczone
      if (brak > EPS) {
        niedoborKwh += brak
        godzinyBezZasilania += 1
        typ = "brak"
      } else typ = "rozladowanie"
    }
    typy.push(typ)
    const soc = pct(e)
    seria.push(soc)
    godziny.push({ t, produkcjaKw: p, zuzycieKw: c, socPct: soc })
    if (pierwszeMinimumT === null && e <= eMin + EPS) pierwszeMinimumT = t + 1
    if (pierwszeMaksimumT === null && e >= eMaks - EPS) pierwszeMaksimumT = t + 1
    if (soc < minSocPct - EPS) { minSocPct = soc; minSocT = t + 1 }
    if (soc > maksSocPct + EPS) { maksSocPct = soc; maksSocT = t + 1 }
  }

  const segmenty: Segment[] = []
  for (let t = 0; t < typy.length; t++) {
    const typ = typy[t]
    if (typ === null) continue
    const ostatni = segmenty[segmenty.length - 1]
    if (ostatni && ostatni.typ === typ && ostatni.doT === t) ostatni.doT = t + 1
    else segmenty.push({ typ: typ as TypSegmentu, odT: t, doT: t + 1 })
  }

  const warnings: Warning[] = []
  if (socStartPct < socMinPct - EPS) warnings.push(startPonizejMinimum(socStartPct, socMinPct))
  if (pierwszeMinimumT !== null) warnings.push(bateriaOsiagnieMinimum(pierwszeMinimumT, socMinPct))
  if (niedoborKwh > EPS) warnings.push(niedobor(niedoborKwh, godzinyBezZasilania))
  if (nadmiarKwh > EPS) warnings.push(nadwyzkaPonadBateria(nadmiarKwh))
  if (input.sprawnoscLadowaniaPct === null || input.sprawnoscRozladowaniaPct === null) warnings.push(brakSprawnosci())
  if (Math.ceil(horyzontH / 24) > 1 && input.wspolczynnikDniPct.slice(0, Math.ceil(horyzontH / 24)).every((v) => v == null)) warnings.push(brakWspolczynnikow())

  const assumptions: Assumption[] = [{ kod: "PROGSOC-ZAL-PROFIL" }, { kod: "PROGSOC-ZAL-BEZ-POGODY" }, { kod: "PROGSOC-ZAL-POJEMNOSC-UZYTECZNA" }]
  if (input.maksMocLadowaniaKw === null || input.maksMocRozladowaniaKw === null) assumptions.push({ kod: "PROGSOC-ZAL-BEZ-LIMITU-MOCY" })

  return wynik(
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    {
      godziny,
      socSeriaPct: seria,
      socKoncowePct: seria[seria.length - 1]!,
      minSocPct,
      minSocT,
      maksSocPct,
      maksSocT,
      pierwszeMinimumT,
      pierwszeMaksimumT,
      niedoborKwh,
      godzinyBezZasilania,
      nadmiarKwh,
      produkcjaLacznaKwh,
      zuzycieLaczneKwh,
      segmenty,
      szczytProdukcjiT,
      szczytZuzyciaT,
    },
    warnings,
    assumptions,
  )
}
