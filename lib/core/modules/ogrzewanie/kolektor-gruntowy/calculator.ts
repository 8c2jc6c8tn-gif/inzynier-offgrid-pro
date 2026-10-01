import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { PIONOWY_GLEBOKOSC_M_ZRODLO, PIONOWY_W_NA_M_ZRODLO, POZIOMY_GLEBOKOSC_M_ZRODLO, POZIOMY_M2_NA_10KW_ZRODLO } from "./constants"
import type { KolektorGruntowyInput } from "./input"
import { validateInput } from "./validation"
import { brakPrzemarzania, glebokoscNietypowa, odwiertNietypowy, plycejNizPrzemarzanie, spiralnyBezWskaznika, wskaznikSpozaZrodla } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "A_{poz} = \\dfrac{P}{10} \\cdot a, \\quad L_{pion} = \\dfrac{P \\cdot 1000}{q}, \\quad n = \\left\\lceil \\dfrac{L_{pion}}{h_{odwiertu}} \\right\\rceil, \\quad h_{poz} > h_{przemarzania}"

export type Zakres = { min: number; max: number }

export type KolektorGruntowyResult = {
  /** Poziomy: powierzchnia kolektora dla wpisanego wskaźnika [m²]; null = inny typ. */
  powierzchniaM2: number | null
  /** Poziomy: widełki powierzchni dla zakresu źródła 60–120 m²/10 kW [m²]. */
  powierzchniaZakresM2: Zakres | null
  /** Pionowy: łączna długość odwiertów dla wpisanego wskaźnika [m]; null = inny typ. */
  dlugoscOdwiertowM: number | null
  /** Pionowy: widełki długości dla zakresu źródła 50–70 W/m [m]. */
  dlugoscZakresM: Zakres | null
  /** Pionowy: liczba odwiertów o wpisanej głębokości (zaokrąglona w górę). */
  liczbaOdwiertow: number | null
}

const PUSTY: KolektorGruntowyResult = {
  powierzchniaM2: null,
  powierzchniaZakresM2: null,
  dlugoscOdwiertowM: null,
  dlugoscZakresM: null,
  liczbaOdwiertow: null,
}

/** Rounding guard so 800/100 = 8 does not become 9 through floating-point noise. */
const ceil = (x: number) => Math.ceil(x - 1e-9)
const poza = (x: number, z: { min: number; max: number }) => x < z.min || x > z.max

/**
 * Moduł 6, ekran dodatkowy "Wymiarowanie kolektora gruntowego" (dawne 5.42, Biblia §6.27.16). Wzorzec A,
 * trzy typy. Poziomy: A = P/10 × wskaźnik [m²/10 kW]; pionowy: L = P / [W/m], liczba odwiertów = ⌈L / głębokość⌉.
 * Wskaźnik wpisuje użytkownik (zależy od gruntu — źródło podaje tylko widełki 60–120 m²/10 kW i 50–70 W/m,
 * bez przeliczenia na typ gruntu), widełki źródła pokazujemy obok. Spiralny: źródło nie daje wskaźnika —
 * tylko informacja (OUT_OF_SCOPE). Moc = moc pompy, 1:1 ze źródłem (wskaźniki źródła są „na moc pompy”, nie
 * na moc pobieraną z gruntu P·(1 − 1/COP)) — założenie widoczne w wyniku.
 *
 * 🔴 1:1 ze źródła: zbyt płytki kolektor poziomy zamarza — próg = głębokość przemarzania wpisana przez
 * użytkownika (ta sama reguła co M7/E22 `ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE`). 🟡 ✅🤖: głębokość ułożenia
 * spoza 1,2–1,8 m i odwiertu spoza 50–100 m (źródło podaje te widełki jako typowe, nie jako progi).
 *
 * Przykład źródła: „pompa 8 kW, glina wilgotna: 400 m² kolektora poziomego (4 pętle po 100 m) lub 1 odwiert
 * 100 m”. Z widełek tego samego źródła 8 kW daje 48–96 m² i 114–160 m odwiertu — 400 m² odpowiada
 * 500 m²/10 kW, a 100 m odpowiada 80 W/m; oba poza podanymi zakresami (Dyrektywa #5). „4 pętle po 100 m”
 * to długość rur, nie powierzchnia — rozstawu rur źródło nie podaje, więc długości rur nie liczymy.
 */
export function calculateKolektorGruntowy(input: KolektorGruntowyInput): CalcResult<KolektorGruntowyResult> {
  const { errors } = validateInput(input)
  const inputs = {
    mocPompyKw: input.mocPompyKw,
    m2Na10Kw: input.m2Na10Kw,
    glebokoscUlozeniaM: input.glebokoscUlozeniaM ?? 0,
    glebokoscPrzemarzaniaM: input.glebokoscPrzemarzaniaM ?? 0,
    wNaMetr: input.wNaMetr,
    glebokoscOdwiertuM: input.glebokoscOdwiertuM,
  }
  const baza = { unit: input.typ === "pionowy" ? "m" : "m²", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.typ === "spiralny") return { ...baza, value: PUSTY, status: "OUT_OF_SCOPE", assumptions: [], warnings: [spiralnyBezWskaznika()] }

  const P = input.mocPompyKw
  const warnings: Warning[] = []
  const value: KolektorGruntowyResult = { ...PUSTY }

  if (input.typ === "poziomy") {
    if (P === 0 || input.m2Na10Kw === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
    value.powierzchniaM2 = (P / 10) * input.m2Na10Kw
    value.powierzchniaZakresM2 = { min: (P / 10) * POZIOMY_M2_NA_10KW_ZRODLO.min, max: (P / 10) * POZIOMY_M2_NA_10KW_ZRODLO.max }
    const h = input.glebokoscUlozeniaM
    const hz = input.glebokoscPrzemarzaniaM
    if (h !== null && hz !== null && h <= hz) warnings.push(plycejNizPrzemarzanie(h, hz))
    if (h !== null && poza(h, POZIOMY_GLEBOKOSC_M_ZRODLO)) warnings.push(glebokoscNietypowa(h, POZIOMY_GLEBOKOSC_M_ZRODLO.min, POZIOMY_GLEBOKOSC_M_ZRODLO.max))
    if (h === null || hz === null) warnings.push(brakPrzemarzania())
    if (poza(input.m2Na10Kw, POZIOMY_M2_NA_10KW_ZRODLO)) {
      warnings.push(wskaznikSpozaZrodla("m2Na10Kw", input.m2Na10Kw, POZIOMY_M2_NA_10KW_ZRODLO.min, POZIOMY_M2_NA_10KW_ZRODLO.max))
    }
  } else if (input.typ === "pionowy") {
    if (P === 0 || input.wNaMetr === 0 || input.glebokoscOdwiertuM === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
    value.dlugoscOdwiertowM = (P * 1000) / input.wNaMetr
    value.dlugoscZakresM = { min: (P * 1000) / PIONOWY_W_NA_M_ZRODLO.max, max: (P * 1000) / PIONOWY_W_NA_M_ZRODLO.min }
    value.liczbaOdwiertow = ceil(value.dlugoscOdwiertowM / input.glebokoscOdwiertuM)
    if (poza(input.glebokoscOdwiertuM, PIONOWY_GLEBOKOSC_M_ZRODLO)) {
      warnings.push(odwiertNietypowy(input.glebokoscOdwiertuM, PIONOWY_GLEBOKOSC_M_ZRODLO.min, PIONOWY_GLEBOKOSC_M_ZRODLO.max))
    }
    if (poza(input.wNaMetr, PIONOWY_W_NA_M_ZRODLO)) {
      warnings.push(wskaznikSpozaZrodla("wNaMetr", input.wNaMetr, PIONOWY_W_NA_M_ZRODLO.min, PIONOWY_W_NA_M_ZRODLO.max))
    }
  } else {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const assumptions: Assumption[] = [{ kod: "KOL-ZALOZENIE-MOC-POMPY" }]
  return {
    ...baza,
    value,
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
