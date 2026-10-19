import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../eurokod-0/rownowaga"
import { KAT_PIONOWY_DEG } from "../eurokod-1/wiatr"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"
import { zalozenieMasyWlasnej } from "../zloty-srodek/zalozenia"
import { balastProjektowyEqu, pionSilaPozioma } from "../zloty-srodek/warnings"
import { LICZBA_MIESIECY, PROG_SSANIA_OD_SPODU_DEG } from "./constants"
import type { RegulowanyInput } from "./input"
import { validateRegulowany } from "./validation"
import { KAT_NORMOWY_MAX_DEG } from "../wiatr-powyzej-30/constants"
import { miesiaceNaWlasnaOdpowiedzialnosc, statecznoscSzacunek } from "../wiatr-powyzej-30/warnings"
import { ssanieOdSpodu } from "./warnings"
import { katPosredniTablicy, podniesienieKrawedziM, statecznoscStelazaDlaKata, wiatrDlaKata, type WiatrDlaKata } from "./wiatr-stelaza"
import { fabrykaWyniku, statusZOstrzezen } from "./wynik"

export type MiesiacRegulowany = WiatrDlaKata & {
  /** 0 = styczeń. */
  miesiac: number
  /** Najlepszy kąt miesiąca w zakresie regulacji stelaża [°]. */
  katDeg: number
  napromieniowanieKwhM2: number
  /** h = L × sin(α) [m]. */
  podniesienieM: number
}

export type RegulowanyResult = {
  miesiace: MiesiacRegulowany[]
  /** Najlepszy stały kąt w tym samym zakresie regulacji — odniesienie zysku [°]. */
  katStalyDeg: number
  napromieniowanieStaleKwhM2: number
  napromieniowanieRegulowaneKwhM2: number
  zyskRegulacjiPct: number
  powierzchniaM2: number
  /** Największy balast spośród ustawień z danymi normowymi — stelaż stoi w każdym ustawieniu [kg]. */
  balastWymaganyKg: number | null
  /** Miesiące z kątem 31–89° — brak cf w Tablicy 7.6. */
  /** Liczba miesięcy z kątem powyżej 30° (do 89°): siła wiatru i balast to szacunek aplikacji, nie wynik normy. */
  liczbaMiesiecySzacunekWiatru: number
}

const FORMULA =
  "\\beta^*_m = \\arg\\max_{\\beta \\in [\\beta_{min}, \\beta_{max}]} H_m(\\beta),\\quad h_m = L \\sin\\beta^*_m,\\quad m_{bal} = \\max\\left(0,\\ \\frac{\\gamma_Q \\max_m F_w(\\beta^*_m)}{\\gamma_{G,inf}\\, g} - G\\right)"

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/**
 * Tryb "Stelaż regulowany (naziemny)" — D26, poza 5 trybami źródła. M3/E1 pokazuje najlepszy kąt
 * miesiąca; tu — konsekwencje konstrukcyjne w granicach mechanicznego zakresu stelaża: podniesienie
 * krawędzi i siła wiatru/balast dla każdego ustawienia. Balast wymagany = największy z ustawień, bo
 * stelaż musi przetrwać wiatr w każdym z nich. Ustawienia 31–89° — brak cf (Dyrektywa #1): balast
 * dla nich nieznany, ostrzeżenie zamiast interpolacji.
 */
export function calculateRegulowany(input: RegulowanyInput): CalcResult<RegulowanyResult | null> {
  const wynik = fabrykaWyniku<RegulowanyResult>(input, FORMULA, "°")
  const errors = validateRegulowany(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", null, errors)

  const { tabela, strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, wspolczynnikPhi, katMinDeg, katMaxDeg } = input
  const { dlugoscWzdluzSpaduM: L, szerokoscStelazaM: B, wysokoscDolnejKrawedziM: h0 } = input
  if (
    tabela === null ||
    tabela.katyDeg.length === 0 ||
    strefaWiatrowa === null ||
    wysokoscNpmM === null ||
    kategoriaTerenu === null ||
    wspolczynnikPhi === null ||
    katMinDeg === null ||
    katMaxDeg === null ||
    L === null ||
    B === null ||
    h0 === null
  ) {
    return wynik("INCOMPLETE", null)
  }

  const indeksy = tabela.katyDeg.map((k, i) => (k >= katMinDeg && k <= katMaxDeg ? i : -1)).filter((i) => i >= 0)
  // Zakres węższy niż krok siatki (np. 30,2–30,6°) — brak węzła, nie zgadujemy.
  if (indeksy.length === 0) return wynik("INCOMPLETE", null)

  const powierzchniaM2 = L * B
  const daneWiatru = { strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, wspolczynnikPhi }
  const miesiace: MiesiacRegulowany[] = Array.from({ length: LICZBA_MIESIECY }, (_, m) => {
    const iNaj = indeksy.reduce((a, i) => (tabela.miesiace[i]![m]! > tabela.miesiace[a]![m]! ? i : a))
    const katDeg = tabela.katyDeg[iNaj]!
    const podniesienieM = podniesienieKrawedziM(L, katDeg)
    return {
      miesiac: m,
      katDeg,
      napromieniowanieKwhM2: tabela.miesiace[iNaj]![m]!,
      podniesienieM,
      ...wiatrDlaKata(daneWiatru, katDeg, h0 + podniesienieM, powierzchniaM2, input.masaPaneliStelazaKg ?? 0, statecznoscStelazaDlaKata(L, katDeg, h0, input.wspolczynnikTarcia, input.glebokoscPodstawyM)),
    }
  })
  const iStaly = indeksy.reduce((a, i) => (suma(tabela.miesiace[i]!) > suma(tabela.miesiace[a]!) ? i : a))
  const napromieniowanieStaleKwhM2 = suma(tabela.miesiace[iStaly]!)
  const napromieniowanieRegulowaneKwhM2 = suma(miesiace.map((x) => x.napromieniowanieKwhM2))

  const balasty = miesiace.map((x) => x.balastKg).filter((b): b is number => b !== null)
  const miesiaceSzacunek = miesiace.filter((x) => x.szacunek)
  const katMaksUzyty = Math.max(...miesiace.map((x) => x.katDeg))

  const warnings: Warning[] = []
  const miesiaceStatecznosc = miesiace.filter((x) => x.statecznosc)
  // Geometry of the month that needs the most ballast — the one the warning and the assumption describe.
  const najgorszyMiesiac = miesiaceStatecznosc.length > 0 ? miesiaceStatecznosc.reduce((a, x) => ((x.balastKg ?? 0) > (a.balastKg ?? 0) ? x : a)) : null
  const stateczneNajgorsze = najgorszyMiesiac && statecznoscStelazaDlaKata(L, najgorszyMiesiac.katDeg, h0, input.wspolczynnikTarcia, input.glebokoscPodstawyM)
  if (stateczneNajgorsze) warnings.push(statecznoscSzacunek(stateczneNajgorsze.wspolczynnikTarcia, stateczneNajgorsze.wysokoscSrodkaParciaM, stateczneNajgorsze.szerokoscPodstawyM))
  if (balasty.length > 0 && miesiaceStatecznosc.length === 0) warnings.push(balastProjektowyEqu())
  if (miesiaceSzacunek.length > 0) {
    warnings.push(miesiaceNaWlasnaOdpowiedzialnosc(miesiaceSzacunek.length, Math.max(...miesiaceSzacunek.map((x) => x.katDeg)), KAT_NORMOWY_MAX_DEG))
  }
  if (miesiace.some((x) => x.katDeg === KAT_PIONOWY_DEG && x.balastKg === null)) warnings.push(pionSilaPozioma())
  if (katMaksUzyty >= PROG_SSANIA_OD_SPODU_DEG) warnings.push(ssanieOdSpodu(katMaksUzyty, PROG_SSANIA_OD_SPODU_DEG))

  const assumptions: Assumption[] = [
    { kod: "KAT-ZALOZENIE-TABELA-PVGIS", params: { azymut: tabela.azymutDeg, albedo: tabela.albedo } },
    { kod: "TM-ZALOZENIE-REGULACJA-CO-MIESIAC", params: { min: katMinDeg, max: katMaxDeg } },
    { kod: "TM-ZALOZENIE-OS-NA-DOLNEJ-KRAWEDZI" },
    { kod: "ZS-ZALOZENIE-STELAZ-WIATA" },
    { kod: "ZS-ZALOZENIE-CSCD", params: { cscd: CSCD_STELAZ } },
    { kod: "ZS-ZALOZENIE-CDIR-CSEASON" },
  ]
  if (miesiace.some((x) => katPosredniTablicy(x.katDeg))) assumptions.push({ kod: "ZS-ZALOZENIE-KAT-POSREDNI" })
  if (miesiaceSzacunek.length > 0) assumptions.push({ kod: "WP30-ZALOZENIE-CF-Z-30", params: { max: KAT_NORMOWY_MAX_DEG } })
  if (balasty.length > 0) {
    assumptions.push({ kod: "ZS-ZALOZENIE-BALAST-PIONOWO", params: { g: PRZYSPIESZENIE_ZIEMSKIE_M_S2 } })
    assumptions.push({ kod: "ZS-ZALOZENIE-BALAST-EQU", params: { gammaQ: GAMMA_Q_EQU, gammaG: GAMMA_G_INF_EQU } })
    assumptions.push(zalozenieMasyWlasnej(input.masaPaneliStelazaKg))
  }
  if (stateczneNajgorsze !== null) {
    assumptions.push({ kod: "WP30-ZALOZENIE-STATECZNOSC", params: { mu: stateczneNajgorsze.wspolczynnikTarcia, h: Math.round(stateczneNajgorsze.wysokoscSrodkaParciaM * 100) / 100, b: Math.round(stateczneNajgorsze.szerokoscPodstawyM * 100) / 100 } })
  }
  if (katMaksUzyty >= PROG_SSANIA_OD_SPODU_DEG) assumptions.push({ kod: "TM-ZALOZENIE-PROG-SSANIA", params: { prog: PROG_SSANIA_OD_SPODU_DEG } })

  return wynik(
    statusZOstrzezen(warnings),
    {
      miesiace,
      katStalyDeg: tabela.katyDeg[iStaly]!,
      napromieniowanieStaleKwhM2,
      napromieniowanieRegulowaneKwhM2,
      zyskRegulacjiPct: napromieniowanieStaleKwhM2 > 0 ? (100 * (napromieniowanieRegulowaneKwhM2 - napromieniowanieStaleKwhM2)) / napromieniowanieStaleKwhM2 : 0,
      powierzchniaM2,
      balastWymaganyKg: balasty.length > 0 ? Math.max(...balasty) : null,
      liczbaMiesiecySzacunekWiatru: miesiaceSzacunek.length,
    },
    warnings,
    assumptions,
  )
}
