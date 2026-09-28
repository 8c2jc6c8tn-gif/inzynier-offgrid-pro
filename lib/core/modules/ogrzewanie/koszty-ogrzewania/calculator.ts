import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  COP_GRZANIA_OPOROWEGO,
  LICZBA_LAT_ZRODLO,
  PALIWA_OLEJOWE,
  PALIWA_STALE,
  SPOSOB_LICZENIA,
  TEMPERATURA_PARAFINIZACJI_ZRODLO_C,
} from "./constants"
import type { KosztyOgrzewaniaInput, SposobLiczenia, ZrodloCiepla } from "./input"
import { validateInput } from "./validation"
import {
  drewnoPraca,
  inwestycjaIPaliwo,
  nagrzewnicaSpaliny,
  olejGestnieje,
  paliwoStaleBezpieczenstwo,
  pradOffGrid,
  sprawnoscPowyzej100,
  zrodloNiekompletne,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type WynikZrodla = {
  indeks: number
  nazwa: string
  sposob: SposobLiczenia
  jednostka: string
  kosztKwhCieplaZl: number
  /** Paliwo na sezon [jednostka]; `null` dla prądu. */
  iloscPaliwaSezon: number | null
  /** Godziny pracy przy mocy nominalnej; `null` bez mocy. */
  godzinyPracy: number | null
  /** Prąd na sezon [kWh]: całość dla `prad`, pobór pomocniczy dla paliwowych (`null` bez mocy lub poboru). */
  energiaElektrycznaSezonKwh: number | null
  kosztSezonZl: number
  kosztRocznyZSerwisemZl: number
  kosztCalkowityZl: number
  /** Lata zwrotu względem źródła najtańszego w zakupie; `null` gdy się nie zwraca albo to samo źródło. */
  zwrotLat: number | null
}

export type KosztyOgrzewaniaResult = {
  /** Kompletne źródła, od najtańszego kosztu całkowitego w okresie analizy. */
  ranking: WynikZrodla[]
  /** Indeksy źródeł pominiętych z powodu braków. */
  niekompletne: number[]
  najtanszeWZakupie: number
}

const FORMULA =
  "c_Q = \\frac{c}{WO \\cdot \\eta} \\;|\\; \\frac{c \\cdot \\dot V}{P} \\;|\\; \\frac{c_{el}}{COP},\\quad K = I + n \\cdot (Q \\cdot c_Q + S)"

function kosztKwh(z: ZrodloCiepla, sposob: SposobLiczenia): number | null {
  const { cenaZl: c, wartoscOpalowaKwh: wo, sprawnoscPct: eta, mocGrzewczaKw: p, zuzyciePaliwaNaH: v } = z
  if (c === null) return null
  if (sposob === "paliwo") return wo === null || eta === null ? null : c / (wo * (eta / 100))
  if (sposob === "karta") return p === null || v === null ? null : (c * v) / p
  const cop = z.rodzaj === "pompa-ciepla" ? z.cop : COP_GRZANIA_OPOROWEGO
  return cop === null ? null : c / cop
}

/**
 * Porównanie kosztów ogrzewania (dawne 5.39, Biblia §6.27.13; rozszerzenie D28). Źródło (logika):
 * "oblicza koszt 1 kWh ciepła z każdego źródła", "uwzględnia koszty inwestycyjne i eksploatacyjne
 * (paliwo, serwis)", "ranking opłacalności w skali 10 lat". Stawki z przykładu źródła ("pompa 0,25,
 * kocioł elektryczny 0,80, drewno 0,15, pellet 0,35 zł/kWh") zależą od cen — to ilustracja; testy
 * odtwarzają je dla dobranych cen (założenie testu).
 *
 * Źródło niekompletne nie blokuje porównania pozostałych — jest pomijane z informacją, bez wartości
 * domyślnych. Ceny stałe w całym okresie (bez inflacji) — jawne założenie.
 */
export function calculateKosztyOgrzewania(input: KosztyOgrzewaniaInput): CalcResult<KosztyOgrzewaniaResult | null> {
  const inputs: Record<string, number> = {}
  if (input.zapotrzebowanieSezonKwh !== null) inputs.zapotrzebowanieSezonKwh = input.zapotrzebowanieSezonKwh
  if (input.liczbaLat !== null) inputs.liczbaLat = input.liczbaLat
  const wynik = (
    status: CalcResult<KosztyOgrzewaniaResult | null>["status"],
    value: KosztyOgrzewaniaResult | null,
    warnings: Warning[] = [],
    assumptions: Assumption[] = [],
  ): CalcResult<KosztyOgrzewaniaResult | null> => ({
    value,
    unit: "zł",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)
  const { zapotrzebowanieSezonKwh: q, liczbaLat: lata } = input
  if (q === null || lata === null || input.zrodla.length === 0) return wynik("INCOMPLETE", null)

  const warnings: Warning[] = [inwestycjaIPaliwo()]
  const niekompletne: number[] = []
  const policzone: Omit<WynikZrodla, "zwrotLat">[] = []
  let oporowe = false
  let godzinyNominalne = false

  input.zrodla.forEach((z, i) => {
    const sposob = SPOSOB_LICZENIA[z.rodzaj]
    const cQ = kosztKwh(z, sposob)
    if (cQ === null || z.kosztInwestycjiZl === null || z.kosztSerwisuRocznyZl === null) {
      niekompletne.push(i)
      warnings.push(zrodloNiekompletne(i, z.nazwa))
      return
    }
    const p = z.mocGrzewczaKw
    const godzinyPracy = sposob !== "prad" && p !== null ? q / p : null
    let energiaElektrycznaSezonKwh: number | null = null
    if (sposob === "prad") {
      const cop = z.rodzaj === "pompa-ciepla" ? z.cop! : COP_GRZANIA_OPOROWEGO
      if (z.rodzaj !== "pompa-ciepla") oporowe = true
      energiaElektrycznaSezonKwh = q / cop
    } else if (godzinyPracy !== null && z.poborPraduW !== null) {
      energiaElektrycznaSezonKwh = (z.poborPraduW * godzinyPracy) / 1000
      godzinyNominalne = true
    }
    const iloscPaliwaSezon =
      sposob === "paliwo" ? q / (z.wartoscOpalowaKwh! * (z.sprawnoscPct! / 100)) : sposob === "karta" ? godzinyPracy! * z.zuzyciePaliwaNaH! : null
    const kosztSezonZl = q * cQ
    const kosztRocznyZSerwisemZl = kosztSezonZl + z.kosztSerwisuRocznyZl
    policzone.push({
      indeks: i,
      nazwa: z.nazwa,
      sposob,
      jednostka: z.jednostka,
      kosztKwhCieplaZl: cQ,
      iloscPaliwaSezon,
      godzinyPracy,
      energiaElektrycznaSezonKwh,
      kosztSezonZl,
      kosztRocznyZSerwisemZl,
      kosztCalkowityZl: z.kosztInwestycjiZl + lata * kosztRocznyZSerwisemZl,
    })

    if (PALIWA_STALE.includes(z.rodzaj)) warnings.push(paliwoStaleBezpieczenstwo(i, z.nazwa))
    if (z.rodzaj === "drewno") warnings.push(drewnoPraca(i, z.nazwa))
    if (z.rodzaj === "nagrzewnica-paliwowa") warnings.push(nagrzewnicaSpaliny(i, z.nazwa))
    if (PALIWA_OLEJOWE.includes(z.rodzaj)) warnings.push(olejGestnieje(i, z.nazwa, TEMPERATURA_PARAFINIZACJI_ZRODLO_C))
    if (sposob === "prad") warnings.push(pradOffGrid(i, z.nazwa))
    if (sposob === "paliwo" && z.sprawnoscPct! > 100) warnings.push(sprawnoscPowyzej100(i, z.nazwa, z.sprawnoscPct!))
  })

  if (policzone.length === 0) return wynik("INCOMPLETE", null, warnings)

  const inwestycja = (w: { indeks: number }) => input.zrodla[w.indeks]!.kosztInwestycjiZl!
  const ref = policzone.reduce((a, b) => (inwestycja(b) < inwestycja(a) ? b : a))
  const ranking: WynikZrodla[] = policzone
    .map((w) => {
      const dI = inwestycja(w) - inwestycja(ref)
      const oszczednoscRoczna = ref.kosztRocznyZSerwisemZl - w.kosztRocznyZSerwisemZl
      return { ...w, zwrotLat: w.indeks !== ref.indeks && dI > 0 && oszczednoscRoczna > 0 ? dI / oszczednoscRoczna : null }
    })
    .sort((a, b) => a.kosztCalkowityZl - b.kosztCalkowityZl)

  const assumptions: Assumption[] = [
    { kod: "KO-ZALOZENIE-WPIS-UZYTKOWNIKA" },
    { kod: "KO-ZALOZENIE-OKRES", params: { lata, zrodlo: LICZBA_LAT_ZRODLO } },
    { kod: "KO-ZALOZENIE-CENY-STALE" },
    { kod: "KO-ZALOZENIE-ZWROT", params: { nazwa: ref.nazwa } },
  ]
  if (oporowe) assumptions.push({ kod: "KO-ZALOZENIE-COP-OPOROWE" })
  if (godzinyNominalne) assumptions.push({ kod: "KO-ZALOZENIE-GODZINY-NOMINALNE" })

  const status = warnings.some((w) => w.level === "warning" || w.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID"
  return wynik(status, { ranking, niekompletne, najtanszeWZakupie: ref.indeks }, warnings, assumptions)
}
