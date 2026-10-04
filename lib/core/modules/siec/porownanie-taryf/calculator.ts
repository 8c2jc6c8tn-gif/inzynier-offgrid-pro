import { isComputed, type CalcResult, type Warning } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN, stawkiOsd, type Grupa, type Rozliczenia } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { PorownanieTaryfInput } from "./input"
import { validateInput } from "./validation"
import { brakWariantow, roznieZuzycie } from "./warnings"
import { TOLERANCJA_ROZNICY_ZUZYCIA } from "./constants"
import { calculateRachunek, type RachunekResult } from "../rachunek-za-prad/calculator"
import { STREFY_GRUPY, czyGrupaG, grupaDostepnaDlaMocy } from "../rachunek-za-prad/constants"

export const CALCULATOR_VERSION = "1.0.0"

/**
 * Why a group is not in the ranking. "moc" — not available for the contracted power (✏️ K8:
 * excluded, not "worse"); "segment" — G for firma or C for dom; "brak-stawek" — no ✅ data for
 * this OSD and group; "niekompletne" / "blad" — the bill of this variant could not be computed.
 */
export type PowodWylaczenia = "moc" | "segment" | "brak-stawek" | "niekompletne" | "blad"

export type PozycjaPorownania = {
  grupa: Grupa
  wylaczona: PowodWylaczenia | null
  rachunek: RachunekResult | null
  /** Warnings of this variant's bill (codes for the UI). */
  ostrzezenia: Warning[]
}

export type PorownanieTaryfResult = {
  /** Computed groups sorted by gross annual cost (cheapest first), then excluded ones. */
  pozycje: PozycjaPorownania[]
  najtanszaGrupa: Grupa | null
}

const FORMULA = "K_T = rachunek(T) \\text{ dla każdej dostępnej grupy T}; \\ ranking \\uparrow K_{T,brutto}"

export function calculatePorownanieTaryf(
  input: PorownanieTaryfInput,
  dane: Rozliczenia = DANE_ROZLICZEN,
): CalcResult<PorownanieTaryfResult> {
  const inputs = { liczbaWariantow: input.warianty.length, mocUmownaKw: input.mocUmownaKw }
  const base = { unit: "zł", formula: FORMULA, formulaKey: "UI-FORMULA-SIEC-POROWNANIE-TARYF", inputs, calculatorVersion: CALCULATOR_VERSION }
  const pusty: PorownanieTaryfResult = { pozycje: [], najtanszaGrupa: null }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.warianty.length === 0) {
    return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [brakWariantow()] }
  }

  const { warianty, ...wspolne } = input
  const pozycje: PozycjaPorownania[] = warianty.map((w) => {
    const pozycja = (wylaczona: PowodWylaczenia | null, rachunek: RachunekResult | null, ostrzezenia: Warning[]) => ({
      grupa: w.grupa,
      wylaczona,
      rachunek,
      ostrzezenia,
    })
    if (czyGrupaG(w.grupa) !== (input.segment === "dom")) return pozycja("segment", null, [])
    if (!czyGrupaG(w.grupa) && input.mocUmownaKw > 0 && !grupaDostepnaDlaMocy(w.grupa, input.mocUmownaKw)) {
      return pozycja("moc", null, [])
    }
    if (stawkiOsd(input.osd, w.grupa, input.dataRozliczenia, dane) === null) return pozycja("brak-stawek", null, [])
    const r = calculateRachunek({ ...wspolne, ...w, stawkiWlasne: {} }, dane)
    if (isComputed(r.status)) return pozycja(null, r.value, r.warnings)
    return pozycja(r.status === "INCOMPLETE" ? "niekompletne" : "blad", null, r.warnings)
  })

  const policzone = pozycje.filter((p) => p.rachunek !== null).sort((a, b) => a.rachunek!.bruttoZl - b.rachunek!.bruttoZl)
  const wylaczone = pozycje.filter((p) => p.rachunek === null)

  const warnings: Warning[] = []
  const zuzycia = warianty.map((w) => STREFY_GRUPY[w.grupa].reduce((s, z) => s + (w.zuzycieStrefKwh[z] ?? 0), 0))
  const min = Math.min(...zuzycia)
  const max = Math.max(...zuzycia)
  if (min > 0 && (max - min) / max > TOLERANCJA_ROZNICY_ZUZYCIA) warnings.push(roznieZuzycie(min, max))

  const najtansza = policzone[0]?.grupa ?? null
  return {
    ...base,
    value: { pozycje: [...policzone, ...wylaczone], najtanszaGrupa: najtansza },
    status: najtansza === null ? "INCOMPLETE" : warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [
      { kod: "SIEC-ZALOZENIE-POROWNANIE-TYLKO-TARYFA" },
      { kod: "SIEC-ZALOZENIE-ZRODLO-DANYCH", params: { stanNa: dane.stanNa, waznoscDo: dane.waznoscDo } },
    ],
    warnings,
  }
}
