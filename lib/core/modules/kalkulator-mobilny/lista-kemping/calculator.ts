import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import { ID_GASNICA, ID_MIERNIK, POZYCJE_KEMPINGU, type KategoriaPozycji } from "./constants"
import type { ListaKempingInput } from "./input"
import { brakGasnicyLubMiernika } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type PozycjaListy = { id: string; kategoria: KategoriaPozycji; ilosc: number | null; link: string | null }

export type ListaKempingResult = {
  pozycje: PozycjaListy[]
  konieczneZaznaczone: number
  konieczneRazem: number
}

const PUSTY_WYNIK: ListaKempingResult = { pozycje: [], konieczneZaznaczone: 0, konieczneRazem: 0 }

/**
 * Ekran 24, Moduł 12 — "Lista kontrolna na kemping" (dawne 8.47, Biblia §12.35). Lista zależna od osób,
 * sezonu i profilu (telefony, lodówka, oświetlenie, radio, urządzenia 230 V, panel); podział konieczne /
 * opcjonalne. Wynik VALID, gdy odhaczone są wszystkie konieczne; brak gaśnicy lub miernika → 🟡 (Biblia).
 * Pojemność akumulatora i moc panelu na liczbę dni — E5 "na weekend" (odsyłacz, bez duplikatu).
 */
export function calculateListaKemping(input: ListaKempingInput): CalcResult<ListaKempingResult> {
  const errors = ujemneWartosci({ osoby: input.osoby, telefony: input.telefony })
  const baza = { unit: "pozycji", formula: "", inputs: { osoby: input.osoby, telefony: input.telefony }, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.osoby === 0 || input.sezon === null) return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const pozycje: PozycjaListy[] = POZYCJE_KEMPINGU.filter((p) => p.dotyczy(input)).map((p) => ({
    id: p.id,
    kategoria: p.kategoria,
    ilosc: p.ilosc ? p.ilosc(input) : null,
    link: p.link ?? null,
  }))
  const zaznaczone = new Set(input.zaznaczoneIds)
  const konieczne = pozycje.filter((p) => p.kategoria === "konieczne")
  const konieczneZaznaczone = konieczne.filter((p) => zaznaczone.has(p.id)).length

  const warnings: Warning[] = []
  if (!zaznaczone.has(ID_GASNICA) || !zaznaczone.has(ID_MIERNIK)) warnings.push(brakGasnicyLubMiernika())

  return {
    ...baza,
    value: { pozycje, konieczneZaznaczone, konieczneRazem: konieczne.length },
    status: konieczneZaznaczone < konieczne.length || warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "LKK-ZALOZENIE-WIELKOSCI-Z-KALKULATOROW" }],
    warnings,
  }
}
