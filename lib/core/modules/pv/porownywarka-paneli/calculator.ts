import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { calculateAgregatPaliwo } from "@/lib/core/modules/kalkulator-mobilny/agregat-paliwo/calculator"
import { HORYZONT_LAT, MIESIACE_ZIMOWE_POROWNYWARKI, type KryteriumId } from "./constants"
import type { DanePanelu, PorownywarkaInput, WycenaKwh } from "./input"
import { ocenKryteria, type KryteriumWynik } from "./kryteria"
import {
  maParametryTemperaturowe,
  miesiecznaEnergiaPanelu,
  profilNaslonecznienia,
  type ZakresModelu,
} from "./uzysk"
import { validateInput } from "./validation"
import { bifacjalnyPominietyPorp, brakCenyPorp, brakKryteriowPorp, brakTemperaturyGodzinowejPorp, modelUproszczonyPorp } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_m = N \\sum_{t \\in m} \\frac{P_{STC}\\,G_{POA}(t)}{1000}\\,[1 + \\gamma (T_c(t) - 25)]\\,\\eta_{rel}(G_{POA}),\\quad T_c = T_a + \\frac{NOCT - 20}{800}\\,G_{POA}"

export type WynikPanelu = {
  id: string
  nazwa: string
  /** Energia N paneli w miesiącach [kWh], styczeń pierwszy. */
  miesiaceKwh: number[]
  zimaKwh: number
  rokKwh: number
  /** Cena N paneli [zł]; `null` bez ceny. */
  cenaRazemZl: number | null
  cenaZaWpZl: number | null
  /** Wartość energii w zł (zima / rok) wg wyceny kWh; `null` bez ceny kWh. Tryb „suchy”: produkcja × stawka, bez oceny użyteczności. */
  wartoscZimaZl: number | null
  wartoscRokZl: number | null
  /** Koszt zimowej kWh w horyzoncie 25 lat [zł/kWh]; `null` bez ceny. */
  kosztZimowejKwhZl: number | null
  /** Prosty okres zwrotu [lata] = cena razem / wartość roczna; `null` bez ceny albo stawki. */
  okresZwrotuLat: number | null
  /** Moc po 25 latach wg degradacji z karty [% mocy początkowej] (górna granica); `null` bez obu liczb degradacji. */
  moc25LatPct: number | null
}

export type RoznicaZimowa = {
  liderId: string
  drugiId: string
  roznicaKwh: number
  /** Wartość różnicy w zł rocznie wg wyceny kWh; `null` bez stawki. */
  roznicaZl: number | null
}

export type PorownywarkaResult = {
  zakresModelu: ZakresModelu
  panele: WynikPanelu[]
  kryteria: KryteriumWynik[]
  /** Gwiazdki 0–10 per panel (kolejność wejścia); `null`, gdy mniej niż 2 panele albo żadne kryterium nie jest policzone. */
  gwiazdki: (number | null)[]
  roznicaZimowa: RoznicaZimowa | null
  /** Użyta stawka 1 kWh [zł]; `null` = tryb „suchy”. */
  stawkaZlKwh: number | null
}

const PUSTY: PorownywarkaResult = {
  zakresModelu: { temperatura: false, slabeSwiatlo: false },
  panele: [],
  kryteria: [],
  gwiazdki: [],
  roznicaZimowa: null,
  stawkaZlKwh: null,
}

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Stawka 1 kWh [zł]; agregat przez istniejący kalkulator „Agregat przenośny” (koszt kWh = koszt paliwa / energia). */
export function stawkaKwh(w: WycenaKwh | null): number | null {
  if (w === null) return null
  if (w.rodzaj !== "agregat") return w.zlKwh > 0 ? w.zlKwh : null
  const r = calculateAgregatPaliwo({
    mocAgregatuKw: w.mocKw,
    obciazeniePct: w.obciazeniePct,
    zuzycieLH: w.zuzycieLH,
    godzinNaDobe: 1,
    cenaZlL: w.cenaPaliwaZlL,
    kosztPorownawczyZlKwh: 0,
    miejsceAgregatu: null,
    podlaczenieAgregatu: null,
  })
  return r.status === "INVALID_INPUT" || r.status === "INCOMPLETE" ? null : r.value.kosztKwhZl
}

/** Moc po `HORYZONT_LAT` latach [% początkowej]: 100 − d1 − (lata − 1)·d_lin; potrzebne obie liczby z karty. */
function moc25(p: DanePanelu): number | null {
  if (p.degradacjaPierwszyRokPct === null || p.degradacjaLiniowaPctNaRok === null) return null
  return Math.max(0, 100 - p.degradacjaPierwszyRokPct - (HORYZONT_LAT - 1) * p.degradacjaLiniowaPctNaRok)
}

/** Suma współczynników mocy w latach 1…HORYZONT_LAT (degradacja z karty; bez niej 1 na rok). */
function sumaWspolczynnikowLat(p: DanePanelu): number {
  let s = 0
  for (let rok = 1; rok <= HORYZONT_LAT; rok++) {
    const spadek =
      p.degradacjaPierwszyRokPct !== null && p.degradacjaLiniowaPctNaRok !== null
        ? p.degradacjaPierwszyRokPct + (rok - 1) * p.degradacjaLiniowaPctNaRok
        : 0
    s += Math.max(0, 1 - spadek / 100)
  }
  return s
}

/**
 * Porównywarka paneli PV (D81, Etap A1): uzysk miesięczny każdego panelu na jednym miejscu (G_poa z silnika Muneera,
 * temperatura ogniwa z NOCT i γ, sprawność przy słabym świetle), wycena kWh, koszt zimowej kWh i gwiazdki względne.
 * Nie zgaduje danych katalogowych: brak parametru wyłącza dane zjawisko dla WSZYSTKICH paneli (porównywalność), a nie
 * jest zastępowany „typową” wartością. Zima = XI–II (U1). Bez strat systemowych (te same dla wszystkich).
 */
export function calculatePorownywarkaPaneli(input: PorownywarkaInput): CalcResult<PorownywarkaResult> {
  const { errors } = validateInput(input)
  const inputs: Record<string, number> = { liczbaPanelowPorownywanych: input.panele.length }
  if (input.liczbaPaneli !== null) inputs.liczbaPaneli = input.liczbaPaneli
  if (input.miejsce) {
    inputs.nachylenieDeg = input.miejsce.nachylenieDeg
    inputs.azymutDeg = input.miejsce.azymutDeg
  }
  const baza = { unit: "kWh", formula: FORMULA, formulaKey: "UI-FORMULA-PV-POROWNYWARKA-PANELI", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, daneGodzinowe, miejsce, liczbaPaneli } = input
  if (lat === undefined || lon === undefined || !daneGodzinowe?.length || miejsce === null || liczbaPaneli === null || input.panele.length === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const profil = profilNaslonecznienia(lat, lon, daneGodzinowe, miejsce)
  const brakTemperatury = profil.tempC === null
  const bezTemperatury = input.panele.filter((p) => !maParametryTemperaturowe(p))
  const zakresModelu: ZakresModelu = {
    temperatura: !brakTemperatury && bezTemperatury.length === 0,
    slabeSwiatlo: input.panele.every((p) => p.sprawnoscWzglednaPrzy200WPct !== null),
  }
  if (brakTemperatury) warnings.push(brakTemperaturyGodzinowejPorp())
  if (bezTemperatury.length > 0) warnings.push(modelUproszczonyPorp(bezTemperatury.map((p) => p.nazwa).join(", ")))
  for (const p of input.panele) if (p.bifacjalny) warnings.push(bifacjalnyPominietyPorp(p.nazwa))

  const stawka = stawkaKwh(input.wycena)
  const panele: WynikPanelu[] = input.panele.map((p) => {
    const miesiaceKwh = miesiecznaEnergiaPanelu(p, profil, zakresModelu).map((e) => e * liczbaPaneli)
    const zimaKwh = suma(MIESIACE_ZIMOWE_POROWNYWARKI.map((m) => miesiaceKwh[m]!))
    const rokKwh = suma(miesiaceKwh)
    const cenaRazemZl = p.cenaBruttoZl === null ? null : p.cenaBruttoZl * liczbaPaneli
    if (p.cenaBruttoZl === null) warnings.push(brakCenyPorp(p.nazwa))
    const wartoscRokZl = stawka === null ? null : rokKwh * stawka
    return {
      id: p.id,
      nazwa: p.nazwa,
      miesiaceKwh,
      zimaKwh,
      rokKwh,
      cenaRazemZl,
      cenaZaWpZl: p.cenaBruttoZl === null ? null : p.cenaBruttoZl / p.pmaxW,
      wartoscZimaZl: stawka === null ? null : zimaKwh * stawka,
      wartoscRokZl,
      kosztZimowejKwhZl:
        cenaRazemZl === null || zimaKwh <= 0 ? null : cenaRazemZl / (zimaKwh * sumaWspolczynnikowLat(p)),
      okresZwrotuLat: cenaRazemZl === null || wartoscRokZl === null || wartoscRokZl <= 0 ? null : cenaRazemZl / wartoscRokZl,
      moc25LatPct: moc25(p),
    }
  })

  const wart: Partial<Record<KryteriumId, (number | null)[]>> = {
    uzyskZimowy: panele.map((p) => p.zimaKwh),
    uzyskRoczny: panele.map((p) => p.rokKwh),
    kosztZimowejKwh: panele.map((p) => p.kosztZimowejKwhZl),
    cenaZaWp: panele.map((p) => p.cenaZaWpZl),
    degradacjaGwarancja: panele.map((p) => p.moc25LatPct),
    slabeSwiatlo: input.panele.map((p) => p.sprawnoscWzglednaPrzy200WPct),
    temperatura: input.panele.map((p) => (p.gammaPctNaC === null ? null : Math.abs(p.gammaPctNaC))),
  }
  const { kryteria, gwiazdki } = ocenKryteria(
    input.panele.map((p) => p.nazwa),
    wart,
    input.kryteria,
  )
  if (input.panele.length >= 2 && gwiazdki.every((g) => g === null)) warnings.push(brakKryteriowPorp())

  const posortowane = [...panele].sort((a, b) => b.zimaKwh - a.zimaKwh)
  const roznicaZimowa: RoznicaZimowa | null =
    posortowane.length >= 2
      ? {
          liderId: posortowane[0]!.id,
          drugiId: posortowane[1]!.id,
          roznicaKwh: posortowane[0]!.zimaKwh - posortowane[1]!.zimaKwh,
          roznicaZl: stawka === null ? null : (posortowane[0]!.zimaKwh - posortowane[1]!.zimaKwh) * stawka,
        }
      : null

  const assumptions: Assumption[] = [
    { kod: "PORP-ZAL-MODEL-NASLONECZNIENIA" },
    { kod: "PORP-ZAL-ZIMA-XI-II" },
    { kod: "PORP-ZAL-BEZ-STRAT-SYSTEMOWYCH" },
    { kod: "PORP-ZAL-TA-SAMA-LICZBA-PANELI", params: { n: liczbaPaneli } },
    { kod: "PORP-ZAL-SKALA-WZGLEDNA" },
    { kod: "PORP-ZAL-BEZ-BOS" },
    { kod: "PORP-ZAL-HORYZONT-LAT", params: { lata: HORYZONT_LAT } },
  ]
  if (zakresModelu.temperatura) assumptions.push({ kod: "PORP-ZAL-TEMPERATURA-OGNIWA" })
  if (zakresModelu.slabeSwiatlo) assumptions.push({ kod: "PORP-ZAL-SWIATLO-INTERPOLACJA" })
  if (input.panele.some((p) => p.degradacjaPierwszyRokPct !== null && p.degradacjaLiniowaPctNaRok !== null)) {
    assumptions.push({ kod: "PORP-ZAL-DEGRADACJA-GWARANCYJNA" })
  }
  if (stawka !== null) assumptions.push({ kod: "PORP-ZAL-WYCENA-BEZ-UZYTECZNOSCI" })
  if (miejsce.albedo === undefined) assumptions.push({ kod: "PORP-ZAL-ALBEDO-DOMYSLNE" })

  return {
    ...baza,
    value: { zakresModelu, panele, kryteria, gwiazdki, roznicaZimowa, stawkaZlKwh: stawka },
    status: warnings.some((w) => w.level === "warning" || w.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
