import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { calculateObciazenieCieplne, type ObciazenieCieplneResult } from "../obciazenie-cieplne/calculator"
import type { ObciazenieCieplneInput } from "../obciazenie-cieplne/input"
import type { MalyObiektCieplaInput } from "./input"
import { validateInput } from "./validation"
import { brakMiesiecyUzytkowaniaMo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type MalyObiektCieplaResult = {
  /** Geometry derived from the box: net walls (without openings), flat roof, floor, volume. */
  scianyNettoM2: number
  dachM2: number
  podlogaM2: number
  kubaturaM3: number
  /** The full result of the M6/E1 engine for these partitions (design load, per-partition losses, months, fuel stock). */
  obciazenie: ObciazenieCieplneResult
  /**
   * Electric energy for heating in the months the object is used [kWh], January first; months of non-use = 0.
   * `null` without a COP, without all 12 monthly temperatures, or without any month of use chosen.
   */
  energiaElektrycznaUzytkowanieKwh: number[] | null
  rokUzytkowaniaKwh: number | null
}

const FORMULA =
  "Q_m = \\left[ \\sum U A + H_V \\right]\\max(0, \\theta_i - \\theta_m)\\cdot 24 d_m,\\; A_{\\text{ścian}} = 2(L+W)H - A_{\\text{otw.}},\\; A_{\\text{dach}} = A_{\\text{podł.}} = L W"

/** Pure: the box → partitions of the M6/E1 input (walls without openings, flat roof, floor, openings against outdoor air). */
export function wejscieZMalegoObiektu(input: MalyObiektCieplaInput): ObciazenieCieplneInput | null {
  const { dlugoscM: l, szerokoscM: s, wysokoscM: h, otworyM2: o } = input
  if (l === null || s === null || h === null || o === null || input.podlogaNadPowietrzem === null) return null
  const przegroda = (nazwa: string, powierzchniaM2: number, uWM2K: number | null, zewnetrzna: boolean, temp: number | null) => ({
    nazwa,
    powierzchniaM2,
    uWM2K,
    zewnetrzna,
    temperaturaPoDrugiejStronieC: temp,
  })
  return {
    przegrody: [
      przegroda("sciany", 2 * (l + s) * h - o, input.uScianWM2K, true, null),
      przegroda("dach", l * s, input.uDachuWM2K, true, null),
      przegroda("podloga", l * s, input.uPodlogiWM2K, input.podlogaNadPowietrzem, input.podlogaNadPowietrzem ? null : input.temperaturaPodPodlogaC),
      przegroda("okna-drzwi", o, input.uOtworowWM2K, true, null),
    ],
    temperaturaWewnetrznaC: input.temperaturaWewnetrznaC,
    strefaKlimatyczna: input.strefaKlimatyczna,
    kubaturaM3: l * s * h,
    wymianyPowietrzaNaH: input.wymianyPowietrzaNaH,
    cop: input.paliwo ? null : input.cop,
    sprawnoscOdzyskuPct: input.sprawnoscOdzyskuPct,
    paliwo: input.paliwo,
    srednieTemperaturyMiesieczneC: input.srednieTemperaturyMiesieczneC,
  }
}

/**
 * Heat balance of a small object (camper, altana/ROD, garage; micro-installation mode): a rectangular box → partitions → the M6/E1 engine.
 * Roof and floor are treated as flat rectangles L × W, walls as 2(L+W)·H minus windows and doors. Thermal bridges, solar and internal gains
 * are not modelled (the M6/E1 warning about PN-EN 12831 comes through). The electric energy of heating is summed only for the months
 * of use from the object profile — outside them nobody heats.
 */
export function calculateMalyObiektCiepla(input: MalyObiektCieplaInput): CalcResult<MalyObiektCieplaResult | null> {
  const bledy = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const baza = { unit: "W", formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-MALY-OBIEKT", inputs, calculatorVersion: CALCULATOR_VERSION }
  const zalozenia: Assumption[] = [{ kod: "MOBIEKT-ZAL-PROSTOPADLOSCIAN" }, { kod: "MOBIEKT-ZAL-DACH-PLASKI" }, { kod: "MOBIEKT-ZAL-MIESIACE-UZYTKOWANIA" }]
  if (bledy.length > 0) return { ...baza, value: null, status: "INVALID_INPUT", assumptions: zalozenia, warnings: bledy }

  const wejscie = wejscieZMalegoObiektu(input)
  if (!wejscie) return { ...baza, value: null, status: "INCOMPLETE", assumptions: zalozenia, warnings: [] }
  const wewn = calculateObciazenieCieplne(wejscie)
  if (!wewn.value) return { ...baza, value: null, status: wewn.status, assumptions: [...zalozenia, ...wewn.assumptions], warnings: wewn.warnings }

  const l = input.dlugoscM!
  const s = input.szerokoscM!
  const h = input.wysokoscM!
  const ostrzezenia: Warning[] = [...wewn.warnings]
  let energia: number[] | null = null
  const uzywane = input.miesiaceUzytkowania.length === 12 && input.miesiaceUzytkowania.some(Boolean)
  if (wewn.value.miesiace && input.cop !== null && !input.paliwo) {
    if (uzywane) {
      const wMiesiacu = Array<number | null>(12).fill(null)
      for (const m of wewn.value.miesiace) wMiesiacu[m.miesiac - 1] = m.energiaElektrycznaKwh
      if (wMiesiacu.every((x) => x !== null)) energia = (wMiesiacu as number[]).map((x, i) => (input.miesiaceUzytkowania[i] ? x : 0))
    } else ostrzezenia.push(brakMiesiecyUzytkowaniaMo())
  }
  return {
    ...baza,
    value: {
      scianyNettoM2: 2 * (l + s) * h - input.otworyM2!,
      dachM2: l * s,
      podlogaM2: l * s,
      kubaturaM3: l * s * h,
      obciazenie: wewn.value,
      energiaElektrycznaUzytkowanieKwh: energia,
      rokUzytkowaniaKwh: energia ? energia.reduce((a, b) => a + b, 0) : null,
    },
    status: ostrzezenia.some((w) => w.level === "warning" || w.level === "critical") ? "VALID_WITH_WARNINGS" : wewn.status === "VALID" ? "VALID" : wewn.status,
    assumptions: [...zalozenia, ...wewn.assumptions],
    warnings: ostrzezenia,
  }
}
