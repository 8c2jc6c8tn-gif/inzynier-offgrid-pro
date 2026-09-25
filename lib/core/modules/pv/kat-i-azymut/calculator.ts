import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { ALBEDO_DOMYSLNE } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"
import {
  LICZBA_MIESIECY,
  napromieniowanieMiesieczne,
  przygotujGodziny,
} from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"
import { KAT_KROK_DEG, KAT_MAX_DEG, KAT_MIN_DEG, NATEZENIE_ODNIESIENIA_KW_M2 } from "./constants"
import type { KatIAzymutInput, TabelaNapromieniowania, TabelaNapromieniowaniaInput } from "./input"
import { validateInput, validateTabela } from "./validation"
import { produkcjaWymagaMocyIPr } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/**
 * Krok ciężki (Web Worker): napromieniowanie płaszczyzny o azymucie `azymutDeg` dla każdego kąta
 * 0–90° (co 1°) i każdego miesiąca — silnik Modułu 1 (`napromieniowanieMiesieczne`, Muneer/PVGIS),
 * bez nowej fizyki. Wynik zasila Ekran 1 i — docelowo — Ekrany 4, 9, 20 (ta sama tabela).
 */
export function obliczTabeleNapromieniowania(input: TabelaNapromieniowaniaInput): CalcResult<TabelaNapromieniowania | null> {
  const errors = validateTabela(input)
  const albedo = input.albedo ?? ALBEDO_DOMYSLNE
  const inputs = {
    szerokoscGeograficzna: input.szerokoscGeograficzna ?? 0,
    dlugoscGeograficzna: input.dlugoscGeograficzna ?? 0,
    azymutDeg: input.azymutDeg,
    albedo,
    liczbaRekordow: input.daneGodzinowe?.length ?? 0,
  }
  const wynik = (
    status: CalcResult<TabelaNapromieniowania | null>["status"],
    value: TabelaNapromieniowania | null,
    warnings = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<TabelaNapromieniowania | null> => ({
    value,
    unit: "kWh/m²",
    status,
    formula: "H_m(\\beta) = \\sum_{t \\in m} G_T(t, \\beta, \\gamma)\\,\\Delta t",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, daneGodzinowe } = input
  if (lat === undefined || lon === undefined || !daneGodzinowe?.length) return wynik("INCOMPLETE", null, [])

  const godziny = przygotujGodziny(lat, lon, daneGodzinowe)
  const katyDeg: number[] = []
  for (let k = KAT_MIN_DEG; k <= KAT_MAX_DEG; k += KAT_KROK_DEG) katyDeg.push(k)
  const miesiace = katyDeg.map((k) => napromieniowanieMiesieczne(godziny, k, input.azymutDeg, albedo))

  return wynik("VALID", { azymutDeg: input.azymutDeg, albedo, katyDeg, miesiace }, [], [
    { kod: "ORIENTACJA-ZALOZENIE-MODEL-MUNEER" },
    { kod: "ORIENTACJA-ZALOZENIE-ALBEDO", params: { albedo } },
  ])
}

export type OptimumMiesiaca = { nachylenieDeg: number; napromieniowanieKwhM2: number }

export type KatIAzymutResult = {
  /** Kąt faktycznie użyty (najbliższy węzeł siatki 1°) [°]. */
  nachylenieDeg: number
  napromieniowanieMiesieczneKwhM2: number[]
  napromieniowanieRoczneKwhM2: number
  /** Suma roczna dla każdego kąta siatki — wykres "produkcja w funkcji kąta" (też Ekran 9). */
  napromieniowanieRoczneWgKataKwhM2: number[]
  /** Najlepszy STAŁY kąt przy tym azymucie. */
  optimumRoczne: { nachylenieDeg: number; napromieniowanieRoczneKwhM2: number }
  /** D26: najlepszy kąt w każdym miesiącu (stelaż regulowany). */
  optimumMiesieczne: OptimumMiesiaca[]
  /** Suma roczna przy przestawianiu kąta co miesiąc na optimum miesiąca [kWh/m²]. */
  napromieniowanieZRegulacjaKwhM2: number
  /** Zysk regulacji względem wybranego stałego kąta [%]. */
  zyskRegulacjiWzgledemWybranegoPct: number
  /** Zysk regulacji względem najlepszego stałego kąta [%]. */
  zyskRegulacjiWzgledemOptimumPct: number
  /** Produkcja [kWh] — tylko gdy podano moc i PR; inaczej null. */
  produkcjaMiesiecznaKwh: number[] | null
  produkcjaRocznaKwh: number | null
}

/** Energia z napromieniowania: E = P [kWp] × H / G_odn × PR (definicja uzysku odniesienia, IEC 61724). */
export function obliczProdukcjeKwh(napromieniowanieKwhM2: number, mocKwp: number, pr: number): number {
  return (mocKwp * napromieniowanieKwhM2 * pr) / NATEZENIE_ODNIESIENIA_KW_M2
}

const FORMULA =
  "E_m = P_{kWp} \\times \\frac{H_m(\\beta)}{1\\,\\text{kW/m}^2} \\times PR,\\quad \\beta^*_m = \\arg\\max_\\beta H_m(\\beta)"

/**
 * Krok lekki (suwak): rozkład miesięczny dla wybranego kąta, najlepszy kąt stały i najlepszy kąt
 * na każdy miesiąc (D26), zysk z ręcznej regulacji, opcjonalnie produkcja kWh. Źródło (Sekcja B)
 * mówi o "produkcji" — bez PR, którego źródło nie podaje, liczymy tylko napromieniowanie (Dyrektywa #1).
 */
export function calculateKatIAzymut(input: KatIAzymutInput): CalcResult<KatIAzymutResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = { mocInstalacjiKwp: input.mocInstalacjiKwp }
  if (input.nachylenieDeg !== null) inputs.nachylenieDeg = input.nachylenieDeg
  if (input.wspolczynnikPr !== null) inputs.wspolczynnikPr = input.wspolczynnikPr
  const wynik = (
    status: CalcResult<KatIAzymutResult | null>["status"],
    value: KatIAzymutResult | null,
    warnings = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<KatIAzymutResult | null> => ({
    value,
    unit: "kWh/m²",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { tabela } = input
  if (tabela === null || input.nachylenieDeg === null || tabela.katyDeg.length === 0) return wynik("INCOMPLETE", null, [])

  const indeks = Math.round((input.nachylenieDeg - tabela.katyDeg[0]!) / KAT_KROK_DEG)
  const nachylenieDeg = tabela.katyDeg[indeks]!
  const miesieczne = tabela.miesiace[indeks]!
  const roczne = suma(miesieczne)
  const roczneWgKata = tabela.miesiace.map(suma)

  const iOpt = roczneWgKata.indexOf(Math.max(...roczneWgKata))
  const optimumMiesieczne: OptimumMiesiaca[] = Array.from({ length: LICZBA_MIESIECY }, (_, m) => {
    let najlepszy = 0
    tabela.miesiace.forEach((wiersz, i) => {
      if (wiersz[m]! > tabela.miesiace[najlepszy]![m]!) najlepszy = i
    })
    return { nachylenieDeg: tabela.katyDeg[najlepszy]!, napromieniowanieKwhM2: tabela.miesiace[najlepszy]![m]! }
  })
  const zRegulacja = suma(optimumMiesieczne.map((o) => o.napromieniowanieKwhM2))
  const procent = (a: number, b: number) => (b > 0 ? (100 * (a - b)) / b : 0)

  const liczProdukcje = input.mocInstalacjiKwp > 0 && input.wspolczynnikPr !== null
  const produkcjaMiesiecznaKwh = liczProdukcje
    ? miesieczne.map((h) => obliczProdukcjeKwh(h, input.mocInstalacjiKwp, input.wspolczynnikPr!))
    : null

  const assumptions: Assumption[] = [{ kod: "KAT-ZALOZENIE-TABELA-PVGIS", params: { azymut: tabela.azymutDeg, albedo: tabela.albedo } }]
  if (nachylenieDeg !== input.nachylenieDeg) assumptions.push({ kod: "KAT-ZALOZENIE-ZAOKRAGLENIE", params: { kat: nachylenieDeg } })
  if (liczProdukcje) assumptions.push({ kod: "KAT-ZALOZENIE-PR-UZYTKOWNIKA", params: { pr: input.wspolczynnikPr! } })

  return wynik(
    "VALID",
    {
      nachylenieDeg,
      napromieniowanieMiesieczneKwhM2: miesieczne,
      napromieniowanieRoczneKwhM2: roczne,
      napromieniowanieRoczneWgKataKwhM2: roczneWgKata,
      optimumRoczne: { nachylenieDeg: tabela.katyDeg[iOpt]!, napromieniowanieRoczneKwhM2: roczneWgKata[iOpt]! },
      optimumMiesieczne,
      napromieniowanieZRegulacjaKwhM2: zRegulacja,
      zyskRegulacjiWzgledemWybranegoPct: procent(zRegulacja, roczne),
      zyskRegulacjiWzgledemOptimumPct: procent(zRegulacja, roczneWgKata[iOpt]!),
      produkcjaMiesiecznaKwh,
      produkcjaRocznaKwh: produkcjaMiesiecznaKwh ? suma(produkcjaMiesiecznaKwh) : null,
    },
    liczProdukcje ? [] : [produkcjaWymagaMocyIPr()],
    assumptions,
  )
}
