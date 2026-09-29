import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN, stawkiOsd, type Rozliczenia } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { MiesiacMocy, MocUmownaInput, WariantPomiaru } from "./input"
import { validateInput } from "./validation"
import { brakStalej, gorneOszacowanie, niepelnyRok, optimumWGrupie } from "./warnings"
import { KROK_OPTYMALIZACJI_KW, LICZBA_NADWYZEK } from "./constants"
import { GRANICA_C1X_C2X_KW, czyGrupaC2x } from "../rachunek-za-prad/constants"

export const CALCULATOR_VERSION = "1.0.0"

export type MocUmownaResult = {
  stalaZlKwMies: number
  /** Surplus fee per month [zł] at the current P_u (0 for months not entered). */
  oplatyMiesieczneZl: number[]
  oplataPrzekroczenRokZl: number
  kosztStalyRokZl: number
  kosztRazemRokZl: number
  /** P_u with the lowest fixed + surplus cost within the current group range [kW]. */
  optymalnaMocKw: number
  kosztOptymalnyRokZl: number
}

const FORMULA =
  "O_{prz,m} = c_{st} \\cdot \\sum_{i=1}^{10} \\max(0, P_i - P_u)\\ \\text{albo}\\ c_{st} \\cdot 10 \\cdot \\max(0, P_{max} - P_u); \\ " +
  "K(P_u) = 12 \\cdot c_{st} \\cdot P_u + \\sum_m O_{prz,m}; \\ P_u^* = \\arg\\min K"

/** Surplus fee of one month [zł] (✅ taryfy OSD 2026, ✏️ K12). `gorne` = variant (a) bounded by (b). */
export function oplataPrzekroczeniaMiesiaca(
  m: MiesiacMocy,
  mocUmownaKw: number,
  stalaZlKwMies: number,
  wariant: WariantPomiaru,
): { oplataZl: number; gorne: boolean } {
  if (m.maksKw === null) return { oplataZl: 0, gorne: false }
  const nadwyzkaMax = Math.max(0, m.maksKw - mocUmownaKw)
  if (wariant === "suma10" && m.dziesiecNajwiekszychKw && m.dziesiecNajwiekszychKw.length > 0) {
    const suma = [...m.dziesiecNajwiekszychKw]
      .sort((a, b) => b - a)
      .slice(0, LICZBA_NADWYZEK)
      .reduce((s, p) => s + Math.max(0, p - mocUmownaKw), 0)
    return { oplataZl: stalaZlKwMies * suma, gorne: false }
  }
  return { oplataZl: stalaZlKwMies * LICZBA_NADWYZEK * nadwyzkaMax, gorne: wariant === "suma10" && nadwyzkaMax > 0 }
}

function kosztRoczny(input: MocUmownaInput, pu: number, stala: number) {
  const miesieczne = input.miesiace.map((m) => oplataPrzekroczeniaMiesiaca(m, pu, stala, input.wariantPomiaru))
  const przekroczenia = miesieczne.reduce((s, x) => s + x.oplataZl, 0)
  return { miesieczne, przekroczenia, staly: 12 * stala * pu }
}

export function calculateMocUmowna(input: MocUmownaInput, dane: Rozliczenia = DANE_ROZLICZEN): CalcResult<MocUmownaResult> {
  const pusty: MocUmownaResult = {
    stalaZlKwMies: 0,
    oplatyMiesieczneZl: [],
    oplataPrzekroczenRokZl: 0,
    kosztStalyRokZl: 0,
    kosztRazemRokZl: 0,
    optymalnaMocKw: 0,
    kosztOptymalnyRokZl: 0,
  }
  const inputs = { mocUmownaKw: input.mocUmownaKw }
  const base = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const stala = input.stalaZlKwMiesWlasna ?? stawkiOsd(input.osd, input.grupa, input.dataRozliczenia, dane)?.stalaCZlKw
  const wpisane = input.miesiace.filter((m) => m.maksKw !== null)
  if (stala === undefined) {
    return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [brakStalej()] }
  }
  if (input.mocUmownaKw === 0 || wpisane.length === 0) {
    return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const biezacy = kosztRoczny(input, input.mocUmownaKw, stala)
  const warnings: Warning[] = []
  const gorneMiesiace = biezacy.miesieczne.map((x, i) => (x.gorne ? i + 1 : 0)).filter((i) => i > 0)
  if (gorneMiesiace.length > 0) warnings.push(gorneOszacowanie(gorneMiesiace.join(", ")))
  if (wpisane.length < 12) warnings.push(niepelnyRok(wpisane.length))

  // Search whole kW within the current group range; the fixed rate differs between C1x and C2x.
  const c2x = czyGrupaC2x(input.grupa)
  const maks = Math.ceil(Math.max(...wpisane.map((m) => m.maksKw as number), input.mocUmownaKw))
  const od = c2x ? GRANICA_C1X_C2X_KW + KROK_OPTYMALIZACJI_KW : KROK_OPTYMALIZACJI_KW
  const doKw = c2x ? Math.max(maks, od) : Math.min(maks, GRANICA_C1X_C2X_KW)
  let optymalnaMocKw = input.mocUmownaKw
  let kosztOptymalnyRokZl = biezacy.staly + biezacy.przekroczenia
  for (let pu = od; pu <= doKw; pu += KROK_OPTYMALIZACJI_KW) {
    const k = kosztRoczny(input, pu, stala)
    const suma = k.staly + k.przekroczenia
    if (suma < kosztOptymalnyRokZl - 1e-9) {
      kosztOptymalnyRokZl = suma
      optymalnaMocKw = pu
    }
  }
  warnings.push(optimumWGrupie())

  const assumptions: Assumption[] = [
    {
      kod: input.stalaZlKwMiesWlasna === undefined ? "SIEC-MOC-UMOWNA-STALA-TARYFA" : "SIEC-MOC-UMOWNA-STALA-FAKTURA",
      params: { stala: stala.toFixed(2) },
    },
    { kod: input.wariantPomiaru === "suma10" ? "SIEC-MOC-UMOWNA-WARIANT-SUMA10" : "SIEC-MOC-UMOWNA-WARIANT-10XMAX" },
    { kod: "SIEC-ZALOZENIE-NETTO" },
  ]
  return {
    ...base,
    value: {
      stalaZlKwMies: stala,
      oplatyMiesieczneZl: biezacy.miesieczne.map((x) => x.oplataZl),
      oplataPrzekroczenRokZl: biezacy.przekroczenia,
      kosztStalyRokZl: biezacy.staly,
      kosztRazemRokZl: biezacy.staly + biezacy.przekroczenia,
      optymalnaMocKw,
      kosztOptymalnyRokZl,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
