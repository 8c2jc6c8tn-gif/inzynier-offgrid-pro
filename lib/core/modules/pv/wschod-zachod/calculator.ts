import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { ALBEDO_DOMYSLNE } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"
import {
  napromieniowanie,
  napromieniowanieDobowe,
  napromieniowanieMiesieczne,
  przygotujGodziny,
} from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"
import { KAT_KROK_DEG, KAT_MAX_DEG, KAT_MIN_DEG } from "@/lib/core/modules/pv/kat-i-azymut/constants"
import { POLUDNIE_SLONECZNE_H, TYPOWY_STOSUNEK_MAX_PCT, TYPOWY_STOSUNEK_MIN_PCT } from "./constants"
import type { DaneWschodZachod, DaneWschodZachodInput, WschodZachodInput } from "./input"
import { validateDane, validateInput } from "./validation"
import { pozaTypowymZakresem } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const AZYMUT_POLUDNIE_DEG = 180
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/**
 * Krok ciężki (Web Worker): nasłonecznienie miesięczne i rozkład dobowy obu połaci oraz południa
 * pod najlepszym kątem stałym (szukanym 0–90° co 1°, jak Ekran 1) — silnik Modułu 1, bez nowej fizyki.
 */
export function obliczDaneWschodZachod(input: DaneWschodZachodInput): CalcResult<DaneWschodZachod | null> {
  const errors = validateDane(input)
  const albedo = input.albedo ?? ALBEDO_DOMYSLNE
  const inputs = {
    wschodNachylenieDeg: input.wschod.nachylenieDeg,
    wschodAzymutDeg: input.wschod.azymutDeg,
    zachodNachylenieDeg: input.zachod.nachylenieDeg,
    zachodAzymutDeg: input.zachod.azymutDeg,
    albedo,
    liczbaRekordow: input.daneGodzinowe?.length ?? 0,
  }
  const wynik = (
    status: CalcResult<DaneWschodZachod | null>["status"],
    value: DaneWschodZachod | null,
    warnings = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<DaneWschodZachod | null> => ({
    value,
    unit: "kWh/m²",
    status,
    formula: "H_m = \\sum_{t \\in m} G_T(t, \\beta, \\gamma)\\,\\Delta t",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, daneGodzinowe } = input
  if (lat === undefined || lon === undefined || !daneGodzinowe?.length) return wynik("INCOMPLETE", null, [])

  const godziny = przygotujGodziny(lat, lon, daneGodzinowe)
  let najlepszyKat = KAT_MIN_DEG
  let najlepsze = -1
  for (let k = KAT_MIN_DEG; k <= KAT_MAX_DEG; k += KAT_KROK_DEG) {
    const h = napromieniowanie(godziny, k, AZYMUT_POLUDNIE_DEG, albedo)
    if (h > najlepsze) {
      najlepsze = h
      najlepszyKat = k
    }
  }
  const polac = (p: { nachylenieDeg: number; azymutDeg: number }) => ({
    ...p,
    miesiace: napromieniowanieMiesieczne(godziny, p.nachylenieDeg, p.azymutDeg, albedo),
    doba: napromieniowanieDobowe(godziny, lon, p.nachylenieDeg, p.azymutDeg, albedo),
  })
  return wynik(
    "VALID",
    {
      wschod: polac(input.wschod),
      zachod: polac(input.zachod),
      poludnie: polac({ nachylenieDeg: najlepszyKat, azymutDeg: AZYMUT_POLUDNIE_DEG }),
      albedo,
    },
    [],
    [{ kod: "ORIENTACJA-ZALOZENIE-MODEL-MUNEER" }, { kod: "ORIENTACJA-ZALOZENIE-ALBEDO", params: { albedo } }],
  )
}

export type WschodZachodResult = {
  /** Nasłonecznienie na 1 m² paneli, średnio ważone udziałem mocy [kWh/m²]. */
  miesiaceWz: number[]
  rocznieWz: number
  miesiacePoludnie: number[]
  rocznieP: number
  /** E-W względem południa pod najlepszym kątem [%] — rocznie i w każdym miesiącu. */
  stosunekRocznyPct: number
  stosunekMiesiecznyPct: number[]
  /** Rozkład dobowy (godziny słoneczne 0–23) jako udział sumy rocznej [%]. */
  dobaWzPct: number[]
  dobaPoludniePct: number[]
  /** Udział energii przed południem słonecznym [%]. */
  udzialRanoWzPct: number
  udzialRanoPoludniePct: number
  nachylenieOdniesieniaDeg: number
}

const FORMULA =
  "H_{WZ} = u_E H_E + (1 - u_E) H_W,\\quad \\frac{H_{WZ}}{H_S(\\beta^*)} \\times 100\\%"

/**
 * Krok lekki: łączy połacie wg udziału mocy (panele tej samej technologii — napromieniowanie
 * ważone mocą jest proporcjonalne do energii przy tym samym PR) i porównuje z południem. Brak udziału
 * → INCOMPLETE (nie domyślne "po połowie" — rozkład paneli to decyzja projektowa użytkownika).
 */
export function calculateWschodZachod(input: WschodZachodInput): CalcResult<WschodZachodResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  if (input.udzialWschodPct !== null) inputs.udzialWschodPct = input.udzialWschodPct
  const wynik = (
    status: CalcResult<WschodZachodResult | null>["status"],
    value: WschodZachodResult | null,
    warnings = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<WschodZachodResult | null> => ({
    value,
    unit: "%",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { dane } = input
  if (dane === null || input.udzialWschodPct === null) return wynik("INCOMPLETE", null, [])

  const u = input.udzialWschodPct / 100
  const miesiaceWz = dane.wschod.miesiace.map((h, m) => u * h + (1 - u) * dane.zachod.miesiace[m]!)
  const dobaWz = dane.wschod.doba.map((h, g) => u * h + (1 - u) * dane.zachod.doba[g]!)
  const rocznieWz = suma(miesiaceWz)
  const rocznieP = suma(dane.poludnie.miesiace)
  const stosunekRocznyPct = rocznieP > 0 ? (100 * rocznieWz) / rocznieP : 0
  const procentDoby = (doba: number[]) => {
    const s = suma(doba)
    return doba.map((h) => (s > 0 ? (100 * h) / s : 0))
  }
  const dobaWzPct = procentDoby(dobaWz)
  const dobaPoludniePct = procentDoby(dane.poludnie.doba)
  const rano = (pct: number[]) => suma(pct.slice(0, POLUDNIE_SLONECZNE_H))

  const warnings =
    stosunekRocznyPct < TYPOWY_STOSUNEK_MIN_PCT || stosunekRocznyPct > TYPOWY_STOSUNEK_MAX_PCT
      ? [pozaTypowymZakresem(stosunekRocznyPct, TYPOWY_STOSUNEK_MIN_PCT, TYPOWY_STOSUNEK_MAX_PCT)]
      : []

  return wynik(
    "VALID",
    {
      miesiaceWz,
      rocznieWz,
      miesiacePoludnie: dane.poludnie.miesiace,
      rocznieP,
      stosunekRocznyPct,
      stosunekMiesiecznyPct: miesiaceWz.map((h, m) => {
        const p = dane.poludnie.miesiace[m]!
        return p > 0 ? (100 * h) / p : 0
      }),
      dobaWzPct,
      dobaPoludniePct,
      udzialRanoWzPct: rano(dobaWzPct),
      udzialRanoPoludniePct: rano(dobaPoludniePct),
      nachylenieOdniesieniaDeg: dane.poludnie.nachylenieDeg,
    },
    warnings,
    [
      { kod: "WZ-ZALOZENIE-ODNIESIENIE", params: { kat: dane.poludnie.nachylenieDeg } },
      { kod: "WZ-ZALOZENIE-UDZIAL-MOCY", params: { wschod: input.udzialWschodPct, zachod: 100 - input.udzialWschodPct } },
    ],
  )
}
