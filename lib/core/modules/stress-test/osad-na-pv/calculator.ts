import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { KAT_SPLUKIWANIE_MAX } from "@/lib/core/modules/pv/czystosc-i-snieg/constants"
import {
  DNI_PRZYKLAD_SNIEG,
  DNI_PRZYKLAD_SZADZ,
  DNI_SCENARIUSZY,
  POZOSTALA_SNIEG_PCT,
  POZOSTALA_SZADZ_PCT,
} from "./constants"
import type { OsadNaPvInput } from "./input"
import { validateInput } from "./validation"
import {
  grzanieNieZwracaSie,
  gwarancjaProducenta,
  lodBlokuje,
  mokryPrzykleja,
  nierownoStringi,
  opcjaNiepelna,
  sniegMozeZsunac,
  snieNieZsunie,
  szadzNieZsuwa,
  type IdOpcjiAktywnej,
} from "./warnings"

export const CALCULATOR_VERSION = "2.0.0"

/** Floating-point tolerance when comparing energies [kWh] — exactly at the break-even the two are equal. */
const TOLERANCJA_KWH = 1e-9

const FORMULA = "E_{strata}(d) = E_{doba} \\cdot d \\cdot \\left(1 - \\dfrac{p}{100}\\right)"

/** One row of the „what if” table: the deposit stays `dni` days. */
export type ScenariuszOsadu = {
  dni: number
  utrataKwh: number
  produkcjaPodOsademKwh: number
  /** The days of a source example (−5 °C → 3 days; 48 h of fog → 2 days). */
  przykladZrodla: boolean
  /** The days the user entered as the optional override. */
  wlasny: boolean
}

/** Break-even of an active option for one scenario: energy recovered by the cleared panels vs. energy used. */
export type WierszOplacalnosci = { dni: number; odzyskKwh: number; oplaca: boolean }

export type OcenaOpcjiAktywnej = {
  id: IdOpcjiAktywnej
  /** Electric power of the option [W] (W/m² × area for the heating options). */
  mocW: number
  godziny: number
  /** Energy used to clear the panels once [kWh]. */
  energiaKwh: number
  wiersze: WierszOplacalnosci[]
  /** Days of cover from which the option recovers more than it uses; null = never (nothing left to recover). */
  progOplacalnosciDni: number | null
  /** Verdict at the reference scenario (`OsadNaPvResult.dniReferencji`). */
  oplacaWReferencji: boolean
}

export type OsadNaPvResult = {
  /** Production left under the deposit [% of normal] actually used. */
  pozostalaProdukcjaPct: number
  /** Whether that percentage is the source example or the user's override. */
  pozostalaZrodlo: "przyklad-zrodla" | "wlasna"
  /** Production lost per day of cover [kWh/day]. */
  utrataNaDobeKwh: number
  scenariusze: ScenariuszOsadu[]
  /** The scenario the active options are judged against: the user's days, else the source example. */
  dniReferencji: number
  /** Dry snow above the slide angle may slide off by itself; null = not applicable (other deposits / no tilt). */
  mozeZsunacSie: boolean | null
  /** Active options with complete data. */
  opcjeAktywne: OcenaOpcjiAktywnej[]
}

const PUSTY: OsadNaPvResult = {
  pozostalaProdukcjaPct: 0,
  pozostalaZrodlo: "przyklad-zrodla",
  utrataNaDobeKwh: 0,
  scenariusze: [],
  dniReferencji: 0,
  mozeZsunacSie: null,
  opcjeAktywne: [],
}

/**
 * Ekran 7 + Ekran 14, Moduł 7 — deposit on PV (dawne 6.7, 6.20, 6.18; Biblia §7.7, §7.18, §7.19). Energy lost =
 * daily production × days covered × (1 − production left under the deposit). 2.0.0: the days and the percentage are
 * not required — the table covers 1, 3, 5 and 7 days (the owner's horizons) plus the source examples (snow: 0% and
 * 3 days at −5 °C; rime: 5% after 48 h = 2 days); the user may enter own days / own %.
 * Qualitative rules 1:1 from the source: dry snow slides off above 30° (the same 30° as M3 „Czystość i śnieg”,
 * `KAT_SPLUKIWANIE_MAX`; at 30° and below 🟡 „nie zsunie się sam”), wet snow sticks (🟡), glaze/frost blocks the
 * light (🟡), rime does not slide (🟡), uneven cover between strings → 🟡 mismatch (cross-ref M3/E17).
 *
 * Active options (heating cable, heating film, automatic cleaning): BREAK-EVEN. Energy used = P × h; energy
 * recovered = daily loss × (days of cover − h/24) — the panels are clear after h hours and then give their normal
 * daily production (✅🤖, hours turned into a fraction of the day). 🟡 when an option uses more than it recovers in
 * the reference scenario. The power per m² comes from the datasheet entered by the user — never invented here.
 * The wind-driven snow distribution map (§7.19, 3D roof model) is not built — the user marks uneven cover.
 */
export function calculateOsadNaPv(input: OsadNaPvInput): CalcResult<OsadNaPvResult> {
  const { errors } = validateInput(input)
  const inputs = {
    katDeg: input.katDeg ?? 0,
    produkcjaDobaKwh: input.produkcjaDobaKwh,
    dniWlasne: input.dniWlasne ?? 0,
    pozostalaWlasnaPct: input.pozostalaWlasnaPct ?? 0,
    powierzchniaM2: input.powierzchniaM2,
  }
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.rodzaj === null || input.produkcjaDobaKwh === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const szadz = input.rodzaj === "szadz"
  const dniPrzykladu = szadz ? DNI_PRZYKLAD_SZADZ : DNI_PRZYKLAD_SNIEG
  const pozostala =
    input.pozostalaWlasnaPct ?? (szadz ? POZOSTALA_SZADZ_PCT : POZOSTALA_SNIEG_PCT)
  const dniWlasne = input.dniWlasne !== null && input.dniWlasne > 0 ? input.dniWlasne : null
  const utrataNaDobeKwh = (input.produkcjaDobaKwh * (100 - pozostala)) / 100

  const dni = [...new Set<number>([...DNI_SCENARIUSZY, dniPrzykladu, ...(dniWlasne !== null ? [dniWlasne] : [])])].sort((a, b) => a - b)
  const scenariusze: ScenariuszOsadu[] = dni.map((d) => ({
    dni: d,
    utrataKwh: utrataNaDobeKwh * d,
    produkcjaPodOsademKwh: input.produkcjaDobaKwh * d - utrataNaDobeKwh * d,
    przykladZrodla: d === dniPrzykladu,
    wlasny: d === dniWlasne,
  }))
  const dniReferencji = dniWlasne ?? dniPrzykladu

  const warnings: Warning[] = []
  let mozeZsunacSie: boolean | null = null
  if (input.rodzaj === "sypki" && input.katDeg !== null) {
    mozeZsunacSie = input.katDeg > KAT_SPLUKIWANIE_MAX
    warnings.push(
      mozeZsunacSie ? sniegMozeZsunac(input.katDeg, KAT_SPLUKIWANIE_MAX) : snieNieZsunie(input.katDeg, KAT_SPLUKIWANIE_MAX),
    )
  }
  if (input.rodzaj === "mokry") warnings.push(mokryPrzykleja())
  if (input.rodzaj === "lod") warnings.push(lodBlokuje())
  if (szadz) warnings.push(szadzNieZsuwa())
  if (input.nierownoStringi) warnings.push(nierownoStringi())

  // Active options: the power of the heating options is W/m² × area; the automatic system gives its total power.
  const kandydaci: { id: IdOpcjiAktywnej; wpisano: boolean; mocW: number; godziny: number; kompletna: boolean }[] = [
    {
      id: "kabel",
      wpisano: input.kabel.mocWNaM2 > 0 || input.kabel.godziny > 0,
      mocW: input.kabel.mocWNaM2 * input.powierzchniaM2,
      godziny: input.kabel.godziny,
      kompletna: input.kabel.mocWNaM2 > 0 && input.kabel.godziny > 0 && input.powierzchniaM2 > 0,
    },
    {
      id: "folia",
      wpisano: input.folia.mocWNaM2 > 0 || input.folia.godziny > 0,
      mocW: input.folia.mocWNaM2 * input.powierzchniaM2,
      godziny: input.folia.godziny,
      kompletna: input.folia.mocWNaM2 > 0 && input.folia.godziny > 0 && input.powierzchniaM2 > 0,
    },
    {
      id: "automat",
      wpisano: input.automat.mocW > 0 || input.automat.godziny > 0,
      mocW: input.automat.mocW,
      godziny: input.automat.godziny,
      kompletna: input.automat.mocW > 0 && input.automat.godziny > 0,
    },
  ]
  const opcjeAktywne: OcenaOpcjiAktywnej[] = []
  for (const o of kandydaci) {
    if (!o.wpisano) continue
    if (!o.kompletna) {
      warnings.push(opcjaNiepelna(o.id))
      continue
    }
    const energiaKwh = (o.mocW * o.godziny) / 1000
    const odzyskDlaDni = (d: number) => utrataNaDobeKwh * Math.max(0, d - o.godziny / 24)
    const wiersze = dni.map((d) => ({ dni: d, odzyskKwh: odzyskDlaDni(d), oplaca: odzyskDlaDni(d) >= energiaKwh - TOLERANCJA_KWH }))
    const odzyskRef = odzyskDlaDni(dniReferencji)
    const oplacaWReferencji = odzyskRef >= energiaKwh - TOLERANCJA_KWH
    opcjeAktywne.push({
      id: o.id,
      mocW: o.mocW,
      godziny: o.godziny,
      energiaKwh,
      wiersze,
      progOplacalnosciDni: utrataNaDobeKwh > 0 ? o.godziny / 24 + energiaKwh / utrataNaDobeKwh : null,
      oplacaWReferencji,
    })
    if (!oplacaWReferencji) warnings.push(grzanieNieZwracaSie(o.id, energiaKwh, odzyskRef, dniReferencji))
  }
  if (opcjeAktywne.length > 0) warnings.push(gwarancjaProducenta())

  const assumptions: Assumption[] = [{ kod: "OSAD-ZALOZENIE-DNI-I-PROCENT" }]
  if (opcjeAktywne.length > 0) assumptions.push({ kod: "OSAD-ZALOZENIE-ODZYSK" })
  return {
    ...baza,
    value: {
      pozostalaProdukcjaPct: pozostala,
      pozostalaZrodlo: input.pozostalaWlasnaPct === null ? "przyklad-zrodla" : "wlasna",
      utrataNaDobeKwh,
      scenariusze,
      dniReferencji,
      mozeZsunacSie,
      opcjeAktywne,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
