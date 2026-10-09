import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { ALBEDO_DOMYSLNE, KROK_GODZIN, W_NA_KW } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"
import { natezenieGodziny, plaszczyzna, przygotujGodziny, type Godzina } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"
import {
  KATY_TABELI_DEG,
  KROK_OKNA_MIN,
  MAKS_KROKOW_BISEKCJI,
  MIESIACE_ZIMOWE_ODRZ,
  PUNKTY_KRZYWEJ,
  TOLERANCJA_ODSTEPU_M,
} from "./constants"
import { cosKataPadania, czescZacieniona, odstepWymaganyM, probkiOkna, tangensProfilu, wspolczynnikCienia } from "./geometria"
import type { OdstepRzedowInput } from "./input"
import { validateInput } from "./validation"
import {
  czescOknaPoZachodzie,
  oknoBezSlonca,
  odstepMniejszyNizRzut,
  panelePoziome,
  sloncePoZaPanelami,
  strataDocelowaNieosiagalna,
  strataGeometryczna,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "P = L\\left(\\cos\\beta + \\sin\\beta \\cdot \\max_t \\frac{\\cos(\\gamma_s - \\gamma_p)}{\\tan\\alpha_s}\\right),\\quad \\mathrm{GCR} = \\frac{L}{P}"

/** Strata energii z cienia międzyrzędowego dla jednego odstępu i jednego kąta. */
export type StrataOdstepu = {
  /** Strata energii padającej na płaszczyznę zimą (XI–II) i w roku [%] — dla rzędu drugiego i kolejnych. */
  zimaPct: number
  rokPct: number
  /** Energia padająca na 1 m² panelu zimą po odjęciu cienia (rząd 2+) [kWh/m²], i bez cienia. */
  zimaBezCieniaKwhM2: number
  zimaPoCieniuKwhM2: number
}

export type WierszKata = {
  katDeg: number
  odstepWymaganyM: number
  przerwaWymaganaM: number
  /** Stosunek długości stołu do odstępu rzędów (pokrycie gruntu panelami). */
  wspolczynnikZabudowy: number
  /** Odstęp użyty do kolumn strat: podany przez użytkownika albo wymagany; `odstepZaMaly` = rzędy nachodziłyby na siebie. */
  odstepUzytyM: number
  odstepZaMaly: boolean
  /** Poniższe tylko z danymi godzinowymi i gdy odstęp nie jest za mały. */
  strata: StrataOdstepu | null
  /** Energia zimowa po cieniu na 1 m² gruntu rzędu [kWh/m²] (uwzględnia wagę rzędów zacienianych). */
  zimaNaM2GruntuKwh: number | null
}

export type PunktKrzywej = { przerwaM: number; odstepM: number; strata: StrataOdstepu }

export type OdstepRzedowResult = {
  rzutPoziomyM: number
  wysokoscGornejKrawedziM: number
  /** Odstęp rzędów, przy którym w całym oknie projektowym nie ma cienia, i przerwa w świetle. */
  odstepWymaganyM: number
  przerwaWymaganaM: number
  wspolczynnikZabudowy: number
  /** Współczynnik cienia F [-]: cień górnej krawędzi sięga F × wysokość za nią; z chwili `decydujaca`. */
  wspolczynnikCienia: number
  decydujaca: { czasSlonecznyH: number; wysokoscSloncaDeg: number; azymutSloncaDeg: number } | null
  /** Waga rzędów zacienianych: (n − 1)/n przy znanej liczbie rzędów, 1 gdy nieznana. */
  wagaRzedowZacienianych: number
  zadanyOdstep: {
    odstepM: number
    przerwaM: number
    wspolczynnikZabudowy: number
    /** Największa zacieniona część stołu w oknie projektowym (0…1) i godzina słoneczna, w której występuje. */
    maksCzescZacieniona: number
    czasMaksH: number | null
    bezCieniaWOknie: boolean
    strata: StrataOdstepu | null
    zimaNaM2GruntuKwh: number | null
  } | null
  krzywaStrat: PunktKrzywej[] | null
  odstepDlaStraty: { docelowaPct: number; odstepM: number; przerwaM: number; strata: StrataOdstepu } | null
  tabelaKatow: WierszKata[]
  /** Kąt z tabeli, przy którym zimowa energia na m² gruntu jest największa (tylko z danymi godzinowymi). */
  najlepszyKatNaGruncieDeg: number | null
}

const zaokragl = (x: number, n = 2) => Math.round(x * 10 ** n) / 10 ** n

/** Godzinowe dane niezależne od kąta: pozycje słońca i tangens kąta profilowego (dla zadanego azymutu paneli). */
type Godzinowe = { godziny: Godzina[]; tp: (number | null)[]; zima: Uint8Array; albedo: number; azymutDeg: number }

function przygotujGodzinowe(lat: number, lon: number, input: OdstepRzedowInput): Godzinowe | null {
  const dane = input.daneGodzinowe
  if (!dane?.length) return null
  const godziny = przygotujGodziny(lat, lon, dane)
  const az = input.azymutDeg!
  return {
    godziny,
    tp: godziny.map((g) => tangensProfilu(g.wysokoscDeg, g.azymutDeg, az)),
    zima: Uint8Array.from(godziny, (g) => (MIESIACE_ZIMOWE_ODRZ.includes(g.miesiac) ? 1 : 0)),
    albedo: input.albedo ?? ALBEDO_DOMYSLNE,
    azymutDeg: az,
  }
}

/** Dla jednego kąta: energia padająca na płaszczyznę w każdej godzinie i jej część bezpośrednia; `strata(P)` liczy cień. */
function kontekstKata(d: Godzinowe, katDeg: number, dlugoscM: number) {
  const pl = plaszczyzna(katDeg, d.azymutDeg, d.albedo)
  const n = d.godziny.length
  const gPoa = new Float64Array(n)
  const bezposrednie = new Float64Array(n)
  let zimaSuma = 0
  let rokSuma = 0
  d.godziny.forEach((g, i) => {
    gPoa[i] = natezenieGodziny(g, pl, false)
    if (g.sloncePonadHoryzontem) {
      const cosTheta = cosKataPadania(g.wysokoscDeg, g.azymutDeg, katDeg, d.azymutDeg)
      if (cosTheta > 0) bezposrednie[i] = g.dni * cosTheta
    }
    rokSuma += gPoa[i]!
    if (d.zima[i]) zimaSuma += gPoa[i]!
  })
  const kwh = (whM2: number) => (whM2 * KROK_GODZIN) / W_NA_KW
  return {
    strata(odstepM: number): StrataOdstepu {
      let zimaStrata = 0
      let rokStrata = 0
      for (let i = 0; i < n; i++) {
        const tp = d.tp[i]
        const b = bezposrednie[i]!
        if (tp === null || tp === undefined || b <= 0) continue
        const utracone = czescZacieniona(dlugoscM, katDeg, odstepM, tp) * b
        rokStrata += utracone
        if (d.zima[i]) zimaStrata += utracone
      }
      return {
        zimaPct: zimaSuma > 0 ? (100 * zimaStrata) / zimaSuma : 0,
        rokPct: rokSuma > 0 ? (100 * rokStrata) / rokSuma : 0,
        zimaBezCieniaKwhM2: kwh(zimaSuma),
        zimaPoCieniuKwhM2: kwh(zimaSuma - zimaStrata),
      }
    },
  }
}

/** Energia zimowa po cieniu na 1 m² gruntu rzędu: (bez cienia − strata × waga) × L / P [kWh/m²]. */
function zimaNaGruncie(s: StrataOdstepu, waga: number, dlugoscM: number, odstepM: number): number {
  const strataKwh = s.zimaBezCieniaKwhM2 - s.zimaPoCieniuKwhM2
  return ((s.zimaBezCieniaKwhM2 - strataKwh * waga) * dlugoscM) / odstepM
}

export function calculateOdstepRzedow(input: OdstepRzedowInput): CalcResult<OdstepRzedowResult | null> {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const baza = { unit: "m", formula: FORMULA, formulaKey: "UI-FORMULA-PV-ODSTEP-RZEDOW", inputs, calculatorVersion: CALCULATOR_VERSION }
  const wynik = (status: Status, value: OdstepRzedowResult | null, warnings: Warning[] = [], assumptions: Assumption[] = []): CalcResult<OdstepRzedowResult | null> => ({
    ...baza,
    value,
    status,
    assumptions,
    warnings,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)
  const { szerokoscGeograficzna: lat, dlugoscGeograficzna: lon, nachylenieDeg: beta, azymutDeg: az, dlugoscWzdluzSpaduM: L, oknoOdH: od, oknoDoH: doH } = input
  if (lat === null || lon === null || beta === null || az === null || L === null || od === null || doH === null) return wynik("INCOMPLETE", null)

  const rzut = L * Math.cos((beta * Math.PI) / 180)
  const wysokosc = L * Math.sin((beta * Math.PI) / 180)
  if (input.odstepM !== null && input.odstepM < rzut - 1e-9) return wynik("INVALID_INPUT", null, [odstepMniejszyNizRzut(input.odstepM, rzut)])

  const probki = probkiOkna(lat, lon, od, doH)
  const cien = wspolczynnikCienia(probki, az)
  if (cien === null) return wynik("INCOMPLETE", null, [oknoBezSlonca()])

  const warnings: Warning[] = []
  if (cien.nadHoryzontem < probki.length) warnings.push(czescOknaPoZachodzie())
  if (beta === 0) warnings.push(panelePoziome())
  else if (cien.f === 0) warnings.push(sloncePoZaPanelami())

  const pWym = odstepWymaganyM(L, beta, cien.f)
  const waga = input.liczbaRzedow !== null && input.liczbaRzedow >= 1 ? (input.liczbaRzedow - 1) / input.liczbaRzedow : 1
  const godzinowe = przygotujGodzinowe(lat, lon, input)
  const kontekst = godzinowe ? kontekstKata(godzinowe, beta, L) : null
  if (godzinowe) warnings.push(strataGeometryczna())

  // Given pitch: the shading actually present in the design window and (with weather data) the energy lost.
  let zadany: OdstepRzedowResult["zadanyOdstep"] = null
  if (input.odstepM !== null) {
    const p = input.odstepM
    let maks = 0
    let czasMaks: number | null = null
    for (const pr of probki) {
      const tp = tangensProfilu(pr.wysokoscDeg, pr.azymutDeg, az)
      if (tp === null) continue
      const c = czescZacieniona(L, beta, p, tp)
      if (c > maks) {
        maks = c
        czasMaks = pr.czasSlonecznyH
      }
    }
    const strata = kontekst ? kontekst.strata(p) : null
    zadany = {
      odstepM: p,
      przerwaM: p - rzut,
      wspolczynnikZabudowy: L / p,
      maksCzescZacieniona: maks,
      czasMaksH: czasMaks,
      bezCieniaWOknie: maks < 1e-9,
      strata,
      zimaNaM2GruntuKwh: strata ? zimaNaGruncie(strata, waga, L, p) : null,
    }
  }

  // Loss curve: pitch growing from a fraction of the required gap up to the full window rule.
  let krzywa: PunktKrzywej[] | null = null
  const przerwaWym = pWym - rzut
  if (kontekst && przerwaWym > 1e-9) {
    krzywa = Array.from({ length: PUNKTY_KRZYWEJ }, (_, k) => {
      const przerwa = (przerwaWym * (k + 1)) / PUNKTY_KRZYWEJ
      return { przerwaM: przerwa, odstepM: rzut + przerwa, strata: kontekst.strata(rzut + przerwa) }
    })
  }

  // Smallest pitch that keeps the winter loss within the target (the loss falls monotonically with the pitch).
  let dlaStraty: OdstepRzedowResult["odstepDlaStraty"] = null
  if (kontekst && input.docelowaStrataZimaPct !== null) {
    const cel = input.docelowaStrataZimaPct
    let lo = rzut
    let hi = Math.max(pWym, rzut + 0.01)
    let kroki = 0
    while (kontekst.strata(hi).zimaPct > cel && kroki < 60) {
      lo = hi
      hi *= 1.5
      kroki += 1
    }
    if (kontekst.strata(hi).zimaPct > cel) {
      warnings.push(strataDocelowaNieosiagalna(cel, zaokragl(kontekst.strata(hi).zimaPct)))
    } else if (kontekst.strata(lo).zimaPct <= cel) {
      dlaStraty = { docelowaPct: cel, odstepM: lo, przerwaM: lo - rzut, strata: kontekst.strata(lo) }
    } else {
      for (let i = 0; i < MAKS_KROKOW_BISEKCJI && hi - lo > TOLERANCJA_ODSTEPU_M; i++) {
        const mid = (lo + hi) / 2
        if (kontekst.strata(mid).zimaPct > cel) lo = mid
        else hi = mid
      }
      dlaStraty = { docelowaPct: cel, odstepM: hi, przerwaM: hi - rzut, strata: kontekst.strata(hi) }
    }
  }

  // Tilt table: the same window rule and the same table length for every tilt; losses at the given pitch (or at the required one).
  const katy = [...new Set([...KATY_TABELI_DEG, beta])].sort((a, b) => a - b)
  const tabela: WierszKata[] = katy.map((k) => {
    const rzutK = L * Math.cos((k * Math.PI) / 180)
    const wymK = odstepWymaganyM(L, k, cien.f)
    const uzyty = input.odstepM ?? wymK
    const zaMaly = uzyty < rzutK - 1e-9
    const strata = godzinowe && !zaMaly ? kontekstKata(godzinowe, k, L).strata(uzyty) : null
    return {
      katDeg: k,
      odstepWymaganyM: wymK,
      przerwaWymaganaM: wymK - rzutK,
      wspolczynnikZabudowy: L / wymK,
      odstepUzytyM: uzyty,
      odstepZaMaly: zaMaly,
      strata,
      zimaNaM2GruntuKwh: strata ? zimaNaGruncie(strata, waga, L, uzyty) : null,
    }
  })
  let najlepszy: WierszKata | null = null
  for (const w of tabela) if (w.zimaNaM2GruntuKwh !== null && (najlepszy === null || w.zimaNaM2GruntuKwh > najlepszy.zimaNaM2GruntuKwh!)) najlepszy = w

  const zalozenia: Assumption[] = [
    { kod: "ODRZ-ZAL-GEOMETRIA" },
    { kod: "ODRZ-ZAL-OKNO", params: { od: zaokragl(od, 2), do: zaokragl(doH, 2), krok: KROK_OKNA_MIN } },
  ]
  if (godzinowe) zalozenia.push({ kod: "ODRZ-ZAL-STRATA-BEZPOSREDNIA" }, { kod: "ODRZ-ZAL-NA-M2-GRUNTU" })
  zalozenia.push(input.liczbaRzedow !== null ? { kod: "ODRZ-ZAL-RZEDY", params: { n: input.liczbaRzedow } } : { kod: "ODRZ-ZAL-RZEDY-NIEZNANE" })

  const value: OdstepRzedowResult = {
    rzutPoziomyM: rzut,
    wysokoscGornejKrawedziM: wysokosc,
    odstepWymaganyM: pWym,
    przerwaWymaganaM: przerwaWym,
    wspolczynnikZabudowy: L / pWym,
    wspolczynnikCienia: cien.f,
    decydujaca: cien.probka ? { czasSlonecznyH: cien.probka.czasSlonecznyH, wysokoscSloncaDeg: cien.probka.wysokoscDeg, azymutSloncaDeg: cien.probka.azymutDeg } : null,
    wagaRzedowZacienianych: waga,
    zadanyOdstep: zadany,
    krzywaStrat: krzywa,
    odstepDlaStraty: dlaStraty,
    tabelaKatow: tabela,
    najlepszyKatNaGruncieDeg: najlepszy?.katDeg ?? null,
  }
  return wynik(warnings.some((w) => w.level === "warning" || w.level === "critical") ? "VALID_WITH_WARNINGS" : "VALID", value, warnings, zalozenia)
}
