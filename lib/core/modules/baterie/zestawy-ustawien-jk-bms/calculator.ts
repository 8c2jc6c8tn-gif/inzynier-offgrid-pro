import type { CalcResult } from "@/lib/core/calc-result"
import {
  ODNIESIENIE,
  TOLERANCJA_NAPIECIA_V,
  type IdParametru,
  type ParametrZestawu,
  type TypParametru,
  type ZestawUstawien,
} from "./constants"
import type { ZestawyUstawienJkBmsInput } from "./input"
import { walidujWejscie, znajdzZestaw } from "./validation"
import {
  brakHisterezyTemperatury,
  kolejnoscProgow,
  kolejnoscProgowNiepewna,
  ovpPozaZakresem,
  parametryDoPotwierdzenia,
  pradLadowaniaPozaZakresem,
  startBalansuInny,
  uvpPozaZakresem,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

/** Comparison with the source: `brak-odniesienia` = the source gives no value for this parameter. */
export type Zgodnosc = "zgodne" | "poza-zakresem" | "brak-odniesienia" | "do-potwierdzenia"

export type WierszParametru = {
  id: IdParametru
  nazwaJk: string
  typ: TypParametru
  wartosc: number
  alternatywa: number | null
  doPotwierdzenia: boolean
  /** Pack voltage = cell voltage × cell count; null for non-voltage parameters. */
  pakietV: number | null
  pakietAlternatywaV: number | null
  /** Continuous current / capacity, 1/h (C); null for non-current parameters. */
  cRate: number | null
  zgodnosc: Zgodnosc
}

export type PochodneZestawu = {
  ovpPakietV: number | null
  uvpPakietV: number | null
  /** Cell OVP − Cell OVPR, V. */
  histerezaOvpV: number | null
  /** Cell UVPR − Cell UVP, V. */
  histerezaUvpV: number | null
}

export type ZestawyUstawienJkBmsResult = {
  zestawId: string
  autor: string
  bms: string
  zrodlo: string
  liczbaOgniw: number | null
  pojemnoscAh: number | null
  wiersze: WierszParametru[]
  pochodne: PochodneZestawu | null
}

const zaokr3 = (x: number) => Math.round(x * 1000) / 1000

const PUSTY: ZestawyUstawienJkBmsResult = {
  zestawId: "",
  autor: "",
  bms: "",
  zrodlo: "",
  liczbaOgniw: null,
  pojemnoscAh: null,
  wiersze: [],
  pochodne: null,
}

function wartosc(zestaw: ZestawUstawien, id: IdParametru): ParametrZestawu | undefined {
  return zestaw.parametry.find((p) => p.id === id)
}

function wRamach(v: number, zakres: { od: number; do: number }): boolean {
  return v >= zakres.od - TOLERANCJA_NAPIECIA_V && v <= zakres.do + TOLERANCJA_NAPIECIA_V
}

/**
 * Module 4 — "Zestawy ustawień JK BMS od autorów". Reads one author set and derives: pack voltages
 * (cell voltage × cell count), the C-rate of the continuous currents, the OVP/UVP hysteresis;
 * compares the parameters with the source ranges (Module 11, Step 3.3) and checks the threshold order.
 * The set stays the author's data — nothing is "corrected". Parameters with an unconfirmed meaning
 * are shown but never compared.
 */
export function calculateZestawyUstawienJkBms(
  input: ZestawyUstawienJkBmsInput,
): CalcResult<ZestawyUstawienJkBmsResult> {
  const baza = {
    unit: "",
    formula: "U_{pakiet} = U_{ogniwo} \\cdot n;\\quad C = I / Q",
    inputs: {},
    calculatorVersion: CALCULATOR_VERSION,
  }

  const bledy = walidujWejscie(input)
  if (bledy.length > 0) {
    return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: bledy }
  }
  const zestaw = znajdzZestaw(input.zestawId)
  if (!zestaw) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const n = wartosc(zestaw, "cellCount")?.wartosc ?? null
  const q = wartosc(zestaw, "batteryCapacity")?.wartosc ?? null
  const v = (id: IdParametru) => wartosc(zestaw, id)?.wartosc ?? null
  const warnings = []

  const wiersze: WierszParametru[] = zestaw.parametry.map((p) => {
    const jestNapiecie = p.typ === "napiecieOgniwaV"
    const jestPrad = p.typ === "pradCiagly"
    const cRate = jestPrad && q !== null && q > 0 ? zaokr3(p.wartosc / q) : null
    let zgodnosc: Zgodnosc = "brak-odniesienia"
    if (p.doPotwierdzenia) zgodnosc = "do-potwierdzenia"
    else if (p.id === "cellOvp") zgodnosc = wRamach(p.wartosc, ODNIESIENIE.ovpV) ? "zgodne" : "poza-zakresem"
    else if (p.id === "cellUvp") zgodnosc = wRamach(p.wartosc, ODNIESIENIE.uvpV) ? "zgodne" : "poza-zakresem"
    else if (p.id === "startBalanceVolt")
      zgodnosc = Math.abs(p.wartosc - ODNIESIENIE.startBalansuV) <= TOLERANCJA_NAPIECIA_V ? "zgodne" : "poza-zakresem"
    else if (p.id === "continuedCharge" && cRate !== null)
      zgodnosc = wRamach(cRate, ODNIESIENIE.pradLadowaniaC) ? "zgodne" : "poza-zakresem"
    return {
      id: p.id,
      nazwaJk: p.nazwaJk,
      typ: p.typ,
      wartosc: p.wartosc,
      alternatywa: p.alternatywa ?? null,
      doPotwierdzenia: p.doPotwierdzenia === true,
      pakietV: jestNapiecie && n !== null ? zaokr3(p.wartosc * n) : null,
      pakietAlternatywaV: jestNapiecie && n !== null && p.alternatywa !== undefined ? zaokr3(p.alternatywa * n) : null,
      cRate,
      zgodnosc,
    }
  })
  const wiersz = (id: IdParametru) => wiersze.find((w) => w.id === id)

  const ovp = wiersz("cellOvp")
  if (ovp?.zgodnosc === "poza-zakresem") warnings.push(ovpPozaZakresem(ovp.wartosc, ODNIESIENIE.ovpV.od, ODNIESIENIE.ovpV.do))
  const uvp = wiersz("cellUvp")
  if (uvp?.zgodnosc === "poza-zakresem") warnings.push(uvpPozaZakresem(uvp.wartosc, ODNIESIENIE.uvpV.od, ODNIESIENIE.uvpV.do))
  const ladowanie = wiersz("continuedCharge")
  if (ladowanie?.zgodnosc === "poza-zakresem" && ladowanie.cRate !== null)
    warnings.push(pradLadowaniaPozaZakresem(ladowanie.cRate, ODNIESIENIE.pradLadowaniaC.od, ODNIESIENIE.pradLadowaniaC.do))
  const balans = wiersz("startBalanceVolt")
  if (balans?.zgodnosc === "poza-zakresem") warnings.push(startBalansuInny(balans.wartosc, ODNIESIENIE.startBalansuV))

  // [lower, upper]: the first must stay strictly below the second.
  const pary: [IdParametru, IdParametru][] = [
    ["cellOvpr", "cellOvp"],
    ["cellUvp", "cellUvpr"],
    ["powerOff", "cellUvp"],
    ["cellRcv", "cellOvp"],
    ["cellRfv", "cellRcv"],
  ]
  for (const [a, b] of pary) {
    const wa = wiersz(a)
    const wb = wiersz(b)
    if (!wa || !wb || wa.wartosc < wb.wartosc) continue
    const f = wa.doPotwierdzenia || wb.doPotwierdzenia ? kolejnoscProgowNiepewna : kolejnoscProgow
    warnings.push(f(wa.nazwaJk, wb.nazwaJk, wa.wartosc, wb.wartosc))
  }

  const utpr = v("chargeUtpr")
  const utp = v("chargeUtp")
  if (utpr !== null && utp !== null && utpr <= utp) warnings.push(brakHisterezyTemperatury(utpr, utp))

  const niepewne = wiersze.filter((w) => w.doPotwierdzenia).length
  if (niepewne > 0) warnings.push(parametryDoPotwierdzenia(niepewne))

  const ovpr = v("cellOvpr")
  const uvpr = v("cellUvpr")
  const pochodne: PochodneZestawu = {
    ovpPakietV: ovp?.pakietV ?? null,
    uvpPakietV: uvp?.pakietV ?? null,
    histerezaOvpV: ovp && ovpr !== null ? zaokr3(ovp.wartosc - ovpr) : null,
    histerezaUvpV: uvp && uvpr !== null ? zaokr3(uvpr - uvp.wartosc) : null,
  }

  return {
    ...baza,
    value: {
      zestawId: zestaw.id,
      autor: zestaw.autor,
      bms: zestaw.bms,
      zrodlo: zestaw.zrodlo,
      liczbaOgniw: n,
      pojemnoscAh: q,
      wiersze,
      pochodne,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [],
    warnings,
  }
}
