import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { ArchitekturaKomunikacjiInput, PolaczenieEsp32 } from "./input"
import { adresNiepoprawny, canBezTransceivera, konfliktAdresu, roznePredkosci, rs485BezTransceivera } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "GPIO \\rightarrow transceiver \\rightarrow magistrala"

export type ArchitekturaKomunikacjiResult = {
  liczbaPolaczen: number
  liczbaProblemow: number
}

const nazwaLubNumer = (p: PolaczenieEsp32, i: number) => p.nazwa.trim() || `#${i + 1}`

/**
 * Ekran 4, Moduł 9 — "Architektura komunikacji" (dawne 11.4). 🔴 RS485 bez transceivera (źródło); CAN bez transceivera
 * 🟡 (sekcja B/D wymaga adaptera, 🔴 źródło daje tylko dla RS485 — ✅🤖). Biblia §9.4: konflikty adresów i prędkości —
 * powtórzony adres na RS485 i różne prędkości na tej samej magistrali 🟡. Założenie: wszystkie urządzenia RS485 na jednej
 * magistrali, CAN na jednej magistrali.
 */
export function calculateArchitekturaKomunikacji(input: ArchitekturaKomunikacjiInput): CalcResult<ArchitekturaKomunikacjiResult> {
  const value: ArchitekturaKomunikacjiResult = { liczbaPolaczen: input.polaczenia.length, liczbaProblemow: 0 }
  const wynik = (status: Status, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<ArchitekturaKomunikacjiResult> => ({
    value,
    unit: "",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-ESP32-ARCHITEKTURA-KOMUNIKACJI",
    inputs: { liczbaPolaczen: value.liczbaPolaczen },
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors = input.polaczenia.flatMap((p, i) =>
    p.adres !== null && (!Number.isInteger(p.adres) || p.adres < 1) ? [adresNiepoprawny(i, p.adres)] : [],
  )
  if (errors.length > 0) return wynik("INVALID_INPUT", errors)
  if (input.polaczenia.length === 0) return wynik("INCOMPLETE", [])

  const warnings: Warning[] = []
  input.polaczenia.forEach((p, i) => {
    if (p.maTransceiver) return
    if (p.protokol === "rs485") warnings.push(rs485BezTransceivera(nazwaLubNumer(p, i), i))
    if (p.protokol === "can") warnings.push(canBezTransceivera(nazwaLubNumer(p, i), i))
  })

  const rs485 = input.polaczenia.map((p, i) => ({ p, i })).filter(({ p }) => p.protokol === "rs485")
  const poAdresie = new Map<number, string[]>()
  for (const { p, i } of rs485) {
    if (p.adres === null) continue
    poAdresie.set(p.adres, [...(poAdresie.get(p.adres) ?? []), nazwaLubNumer(p, i)])
  }
  for (const [adres, nazwy] of poAdresie) if (nazwy.length > 1) warnings.push(konfliktAdresu(adres, nazwy.join(", ")))

  for (const protokol of ["rs485", "can"] as const) {
    const predkosci = [...new Set(input.polaczenia.filter((p) => p.protokol === protokol && p.predkoscBps !== null).map((p) => p.predkoscBps!))]
    if (predkosci.length > 1) warnings.push(roznePredkosci(protokol.toUpperCase(), predkosci.join(" / ")))
  }

  value.liczbaProblemow = warnings.length
  return wynik(warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID", warnings, [{ kod: "KOM-ZALOZENIE-JEDNA-MAGISTRALA" }])
}
