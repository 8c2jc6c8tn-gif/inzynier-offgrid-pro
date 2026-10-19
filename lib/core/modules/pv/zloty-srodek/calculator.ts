import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../eurokod-0/rownowaga"
import { wspolczynnikKsztaltuMu1 } from "../eurokod-1/snieg"
import {
  bazoweCisnienieWiatruPa,
  CF_WIATA_MAX_KAT_DEG,
  KAT_PIONOWY_DEG,
  szczytoweCisnieniePa,
  wspolczynnikEkspozycji,
} from "../eurokod-1/wiatr"
import { obliczProdukcjeKwh } from "../kat-i-azymut/calculator"
import type { PodejscieEc7 } from "../eurokod-7/przesuw"
import { silaIBalastWiatru, statecznoscZGeometrii, type WarunekBalastu } from "../wiatr-powyzej-30/sila-i-balast"
import { katNaWlasnaOdpowiedzialnosc, statecznoscSzacunekKaty } from "../wiatr-powyzej-30/warnings"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "./constants"
import type { ZlotySrodekInput } from "./input"
import { validateInput } from "./validation"
import { zalozenieMasyWlasnej } from "./zalozenia"
import {
  balastProjektowyEqu,
  optimumPozaZakresemWiatru,
  pionSilaPozioma,
  rekomendacjaWymagaWyceny,
  szacunekLepszyBilans,
} from "./warnings"

export const CALCULATOR_VERSION = "1.5.0"

export type PunktKata = {
  nachylenieDeg: number
  napromieniowanieRoczneKwhM2: number
  /** PN-EN 1991-1-3, Tablica 5.2 — jaka część obciążenia śniegiem gruntu zostaje na panelu. */
  mu1: number
  /** |cf| — odrywanie (0–89°) albo siła pozioma (90°); `null` tylko poza zakresem 0–90°. */
  cf: number | null
  silaWiatruN: number | null
  /** Siła względem największej siły ze wszystkich kątów z danymi normowymi [%]. */
  procentSilyMaks: number | null
  /**
   * Design ballast m = max(0, γQ·Fw/(γG,inf·g) − G) [kg], PN-EN 1990 EQU — uplift: 0–30° from the standard, above 30° up to
   * 89° an ESTIMATE of the app (`szacunek`); 90° → `null` (horizontal force). G = panels + frame mass when entered (D29).
   */
  balastKg: number | null
  /** `true` = siła i balast tego kąta to szacunek aplikacji (powyżej 30° do 89°), nie wynik normy; kąt ustawia użytkownik na własną odpowiedzialność. */
  szacunek: boolean
  /** Składniki `balastKg` [kg]: oderwanie, przesuw, przewracanie; `null` = warunek niesprawdzony. */
  balastOderwanieKg: number | null
  balastPrzesuwKg: number | null
  balastPrzewracanieKg: number | null
  /** Który ze sprawdzonych warunków wyznacza `balastKg` (najcięższy). */
  warunekRozstrzygajacy: WarunekBalastu | null
  /** Podejście EC7 dające największy balast przesuwu (p. 6.5.3); `null` bez danych stateczności. */
  podejscieEc7Przesuw: PodejscieEc7 | null
  /** `true` = w `balastKg` sprawdzono też przesuw i przewracanie (dane użytkownika: tarcie, długość, podstawa) — to szacunek aplikacji także do 30°. */
  statecznosc: boolean
  kosztBalastuZl: number | null
  produkcjaRocznaKwh: number | null
  wartoscEnergiiZl: number | null
  /** Wartość energii w okresie analizy minus koszt balastu [zł] (kryterium D27). */
  bilansZl: number | null
}

export type ZlotySrodekResult = {
  qbPa: number
  ce: number
  qpPa: number
  punkty: PunktKata[]
  optimumEnergiiDeg: number
  /** Kąt 0–30° (zakres normy) z największym bilansem; `null` bez wyceny energii. */
  rekomendacjaDeg: number | null
  /** Kąt powyżej 30° (szacunek) z bilansem WYŻSZYM niż rekomendacja normowa; `null`, gdy taki nie istnieje albo brak wyceny. Informacja, nie rekomendacja. */
  szacunekLepszyDeg: number | null
  wybranyDeg: number | null
}

const FORMULA =
  "F_w = c_sc_d \\cdot c_f(\\alpha,\\varphi) \\cdot c_e(z_e) \\cdot q_b \\cdot A_{ref},\\quad " +
  "m = \\max\\left(0,\\ \\frac{\\gamma_Q F_w}{\\gamma_{G,inf}\\, g} - G\\right),\\quad " +
  "\\alpha^* = \\arg\\max_{\\alpha \\le 30^\\circ} \\left( E(\\alpha) \\cdot n \\cdot c_{kWh} - m(\\alpha) \\cdot c_{kg} \\right)"

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

export function calculateZlotySrodek(input: ZlotySrodekInput): CalcResult<ZlotySrodekResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number") inputs[k] = v
  const wynik = (
    status: CalcResult<ZlotySrodekResult | null>["status"],
    value: ZlotySrodekResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<ZlotySrodekResult | null> => ({
    value,
    unit: "°",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { tabela, strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, wysokoscKonstrukcjiM, powierzchniaPaneliM2, wspolczynnikPhi } = input
  const { cenaBalastuZlKg } = input
  if (
    tabela === null ||
    tabela.katyDeg.length === 0 ||
    strefaWiatrowa === null ||
    wysokoscNpmM === null ||
    kategoriaTerenu === null ||
    wysokoscKonstrukcjiM === null ||
    powierzchniaPaneliM2 === null ||
    wspolczynnikPhi === null ||
    cenaBalastuZlKg === null
  ) {
    return wynik("INCOMPLETE", null, [])
  }

  const qbPa = bazoweCisnienieWiatruPa(strefaWiatrowa, wysokoscNpmM)
  const ce = wspolczynnikEkspozycji(kategoriaTerenu, wysokoscKonstrukcjiM)
  const qpPa = szczytoweCisnieniePa(qbPa, ce)

  const { mocInstalacjiKwp: p, wspolczynnikPr: pr, cenaEnergiiZlKwh: cenaKwh, liczbaLat: lata } = input
  const zWycena = p !== null && pr !== null && cenaKwh !== null && lata !== null

  const surowe = tabela.katyDeg.map((kat, i) => {
    const h = suma(tabela.miesiace[i]!)
    const { dlugoscWzdluzSpaduM: dl, wspolczynnikTarcia: mu, glebokoscPodstawyM: gl } = input
    // Force acts at the panel centre: top edge height minus half of the vertical extent of the slope length.
    const stateczn = dl == null ? null : statecznoscZGeometrii(kat, dl, wysokoscKonstrukcjiM - (dl / 2) * Math.sin((kat * Math.PI) / 180), mu, gl)
    const w = silaIBalastWiatru(kat, wspolczynnikPhi, qpPa, powierzchniaPaneliM2, input.masaPaneliStelazaKg ?? 0, stateczn)
    const cf = w?.cf ?? null
    const sila = w?.silaN ?? null
    const balastKg = w?.balastKg ?? null
    const szacunek = w?.szacunek ?? false
    const statecznosc = w?.statecznosc ?? false
    const skladniki = { balastOderwanieKg: w?.balastOderwanieKg ?? null, balastPrzesuwKg: w?.balastPrzesuwKg ?? null, balastPrzewracanieKg: w?.balastPrzewracanieKg ?? null, warunekRozstrzygajacy: w?.warunekRozstrzygajacy ?? null, podejscieEc7Przesuw: w?.podejscieEc7Przesuw ?? null }
    const kosztBalastuZl = balastKg === null ? null : balastKg * cenaBalastuZlKg
    const produkcjaRocznaKwh = zWycena ? obliczProdukcjeKwh(h, p, pr) : null
    const wartoscEnergiiZl = produkcjaRocznaKwh === null ? null : produkcjaRocznaKwh * lata! * cenaKwh!
    const bilansZl = wartoscEnergiiZl === null || kosztBalastuZl === null ? null : wartoscEnergiiZl - kosztBalastuZl
    return { kat, h, cf, sila, balastKg, szacunek, statecznosc, ...skladniki, kosztBalastuZl, produkcjaRocznaKwh, wartoscEnergiiZl, bilansZl }
  })
  const silaMaks = Math.max(...surowe.map((s) => s.sila ?? 0))
  const punkty: PunktKata[] = surowe.map((s) => ({
    nachylenieDeg: s.kat,
    napromieniowanieRoczneKwhM2: s.h,
    mu1: wspolczynnikKsztaltuMu1(s.kat),
    cf: s.cf,
    silaWiatruN: s.sila,
    procentSilyMaks: s.sila === null || silaMaks <= 0 ? null : (100 * s.sila) / silaMaks,
    balastKg: s.balastKg,
    szacunek: s.szacunek,
    statecznosc: s.statecznosc,
    balastOderwanieKg: s.balastOderwanieKg,
    balastPrzesuwKg: s.balastPrzesuwKg,
    balastPrzewracanieKg: s.balastPrzewracanieKg,
    warunekRozstrzygajacy: s.warunekRozstrzygajacy,
    podejscieEc7Przesuw: s.podejscieEc7Przesuw,
    kosztBalastuZl: s.kosztBalastuZl,
    produkcjaRocznaKwh: s.produkcjaRocznaKwh,
    wartoscEnergiiZl: s.wartoscEnergiiZl,
    bilansZl: s.bilansZl,
  }))

  const optimumEnergii = punkty.reduce((a, b) => (b.napromieniowanieRoczneKwhM2 > a.napromieniowanieRoczneKwhM2 ? b : a))
  // Remis → niższy kąt (mniej wiatru przy tej samej wartości) — pierwszy znaleziony przy ścisłym ">".
  // Rekomendacja tylko spośród kątów normowych; kąty powyżej 30° (szacunek) pokazujemy, ale nie rekomendujemy na ich podstawie.
  const kandydaci = punkty.filter((q) => q.bilansZl !== null && !q.szacunek)
  const rekomendacja = kandydaci.length > 0 ? kandydaci.reduce((a, b) => (b.bilansZl! > a.bilansZl! ? b : a)) : null
  const kandydaciSzacunek = punkty.filter((q) => q.bilansZl !== null && q.szacunek)
  const najlepszySzacunek = kandydaciSzacunek.length > 0 ? kandydaciSzacunek.reduce((a, b) => (b.bilansZl! > a.bilansZl! ? b : a)) : null
  const szacunekLepszy = rekomendacja !== null && najlepszySzacunek !== null && najlepszySzacunek.bilansZl! > rekomendacja.bilansZl! ? najlepszySzacunek : null

  const wybranyDeg = input.nachylenieDeg === null ? null : Math.round(input.nachylenieDeg)
  const stateczne = punkty.filter((q) => q.statecznosc)
  const warnings: Warning[] = [stateczne.length > 0 ? statecznoscSzacunekKaty(input.wspolczynnikTarcia!, input.dlugoscWzdluzSpaduM!) : balastProjektowyEqu()]
  if (!zWycena) warnings.push(rekomendacjaWymagaWyceny())
  if (optimumEnergii.nachylenieDeg > CF_WIATA_MAX_KAT_DEG) warnings.push(optimumPozaZakresemWiatru(optimumEnergii.nachylenieDeg))
  if (szacunekLepszy !== null && rekomendacja !== null) {
    warnings.push(szacunekLepszyBilans(szacunekLepszy.nachylenieDeg, szacunekLepszy.bilansZl! - rekomendacja.bilansZl!, szacunekLepszy.balastKg!))
  }
  if (wybranyDeg !== null && wybranyDeg > CF_WIATA_MAX_KAT_DEG) {
    const wybrany = punkty.find((q) => q.nachylenieDeg === wybranyDeg)
    warnings.push(wybranyDeg === KAT_PIONOWY_DEG && wybrany?.balastKg == null ? pionSilaPozioma() : katNaWlasnaOdpowiedzialnosc(wybranyDeg, CF_WIATA_MAX_KAT_DEG))
  }

  const assumptions: Assumption[] = [
    { kod: "ZS-ZALOZENIE-STELAZ-WIATA" },
    { kod: "ZS-ZALOZENIE-CSCD", params: { cscd: CSCD_STELAZ } },
    { kod: "ZS-ZALOZENIE-CDIR-CSEASON" },
    { kod: "ZS-ZALOZENIE-KAT-POSREDNI" },
    ...(punkty.some((q) => q.szacunek) ? [{ kod: "WP30-ZALOZENIE-CF-INTERPOLACJA", params: { max: CF_WIATA_MAX_KAT_DEG } }] : []),
    { kod: "ZS-ZALOZENIE-BALAST-PIONOWO", params: { g: PRZYSPIESZENIE_ZIEMSKIE_M_S2 } },
    { kod: "ZS-ZALOZENIE-BALAST-EQU", params: { gammaQ: GAMMA_Q_EQU, gammaG: GAMMA_G_INF_EQU } },
    ...(stateczne.length > 0 ? [{ kod: "WP30-ZALOZENIE-STATECZNOSC-KATY", params: { mu: input.wspolczynnikTarcia!, dlugosc: input.dlugoscWzdluzSpaduM! } }] : []),
    zalozenieMasyWlasnej(input.masaPaneliStelazaKg),
    { kod: "ZS-ZALOZENIE-CENA-BALASTU", params: { cena: cenaBalastuZlKg } },
    { kod: "ZS-ZALOZENIE-SNIEG-MU1" },
    { kod: "KAT-ZALOZENIE-TABELA-PVGIS", params: { azymut: tabela.azymutDeg, albedo: tabela.albedo } },
  ]
  if (zWycena) assumptions.push({ kod: "KAT-ZALOZENIE-PR-UZYTKOWNIKA", params: { pr: pr! } })

  return wynik(
    "VALID_WITH_WARNINGS",
    {
      qbPa,
      ce,
      qpPa,
      punkty,
      optimumEnergiiDeg: optimumEnergii.nachylenieDeg,
      rekomendacjaDeg: rekomendacja?.nachylenieDeg ?? null,
      szacunekLepszyDeg: szacunekLepszy?.nachylenieDeg ?? null,
      wybranyDeg,
    },
    warnings,
    assumptions,
  )
}
