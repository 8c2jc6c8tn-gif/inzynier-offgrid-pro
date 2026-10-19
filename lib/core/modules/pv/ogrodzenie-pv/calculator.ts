import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { GAMMA_Q_STR } from "../eurokod-0/kombinacje"
import { bazoweCisnienieWiatruPa, CF_TABLICA_PIONOWA, szczytoweCisnieniePa, wspolczynnikEkspozycji } from "../eurokod-1/wiatr"
import { gestoscObjetosciowaGruntu, katTarciaPhiU } from "../eurokod-7/grunty-pn-b-03020"
import type { PodejscieEc7 } from "../eurokod-7/przesuw"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"
import {
  CP_NET_SCIANA_POLE_A,
  GAMMA_M0,
  GESTOSC_WODY_KG_M3,
  GRANICA_PLASTYCZNOSCI_MPA,
  KROK_GLEBOKOSCI_MM,
  MIN_PRZESWIT_MM,
  SREDNICE_FUNDAMENTU_MM,
  SZYNY_NA_RZAD,
  type ProfilRurki,
} from "./constants"
import { zaglebienieEc7 } from "./fundament"
import type { MetodaOporuGruntu, OgrodzeniePvInput } from "./input"
import { katalogWgMasy, nosnoscZginaniaNmm, ugiecieBelkiMm, ugiecieKonsoliMm } from "./profile"
import { validateInput } from "./validation"
import {
  brakMiejscaNaPanel,
  brakProfiluRygla,
  brakProfiluSlupka,
  licowanie,
  przemarzanieDecyduje,
  przeswitZaMaly,
  scianaWolnostojaca,
  wysokoscPrzekroczona,
  zrodlaDoPotwierdzenia,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "q_p = c_e(z_e)\\, q_b;\\quad F = c_f\\, q_p\\, s\\, h;\\quad M_{Ed} = \\gamma_Q F z_c \\le \\frac{W_{el} f_y}{\\gamma_{M0}};\\quad " +
  "H_u = c\\,\\frac{\\gamma D K_p L^3}{e + L} \\ge \\gamma_Q F,\\ K_p = \\tan^2\\left(45^\\circ + \\frac{\\varphi'_d}{2}\\right)"

export type WynikProfilu = {
  profil: ProfilRurki
  /** Utilisation M_Ed/M_Rd (≤ 1). */
  wykorzystanie: number
  /** Unfactored deflection [mm]: post at the load height, rail at mid-span. */
  ugiecieMm: number
}

export type WynikFundamentu = {
  /** Pier diameter [mm]. */
  srednicaMm: number
  /** Embedment [m] for each method (the heaviest design approach), before the frost-depth minimum. */
  zaglebienieZachowawczaM: number
  zaglebienieBromsM: number
  /** Embedment [m] for the chosen method. */
  zaglebienieWybraneM: number
  /** Final embedment [mm]: max(chosen method, frost depth), rounded up. */
  zaglebienieKoncoweMm: number
  podejscieEc7: PodejscieEc7
  zaglebienieWgPodejsc: Record<PodejscieEc7, number>
  przemarzanieDecyduje: boolean
}

export type OgrodzeniePvResult = {
  rzedy: number
  /** Height of the panel zone, total fence height, and the post spacing [mm]. */
  wysokoscPaneliMm: number
  wysokoscCalkowitaMm: number
  rozstawSlupkowMm: number
  /** Number of posts and panels per row for the entered fence length; `null` = length not entered. */
  liczbaSlupkow: number | null
  liczbaPaneliWRzedzie: number | null
  /** Wind: peak pressure [Pa], force coefficient, reference height [m], and the force on one post [N]. */
  qpPa: number
  cf: number
  zeM: number
  silaNaSlupekN: number
  momentProjektowyNm: number
  slupek: WynikProfilu | null
  rygiel: WynikProfilu | null
  /** Flush-face offset [mm] = post depth − (rail depth + panel thickness); `null` without the panel thickness. */
  przesuniecieLicowaniaMm: number | null
  katTarciaDeg: number
  gestoscGruntuKgM3: number
  fundament: WynikFundamentu | null
  /** Embedment for every diameter tried (chosen method, with the frost minimum) [mm], keyed by diameter [mm]. */
  zaglebienieWgSrednicy: Record<number, number>
}

const PUSTY: OgrodzeniePvResult = {
  rzedy: 0,
  wysokoscPaneliMm: 0,
  wysokoscCalkowitaMm: 0,
  rozstawSlupkowMm: 0,
  liczbaSlupkow: null,
  liczbaPaneliWRzedzie: null,
  qpPa: 0,
  cf: 0,
  zeM: 0,
  silaNaSlupekN: 0,
  momentProjektowyNm: 0,
  slupek: null,
  rygiel: null,
  przesuniecieLicowaniaMm: null,
  katTarciaDeg: 0,
  gestoscGruntuKgM3: 0,
  fundament: null,
  zaglebienieWgSrednicy: {},
}

const zaokraglWGore = (mm: number) => Math.ceil(mm / KROK_GLEBOKOSCI_MM - 1e-9) * KROK_GLEBOKOSCI_MM

/**
 * Fence made of PV panels: layout, wind (PN-EN 1991-1-4 7.4.3 signboard, cf = 1,80), posts and rails from the RHS catalogue
 * (elastic bending, S235/S355) and the cast-in-place pier (rigid short pier in non-cohesive soil, EN 1997 design-approach
 * envelope). The whole result is an ESTIMATE (standard 3.3) — steel and the Broms formula are not sourced in the repo.
 */
export function calculateOgrodzeniePv(input: OgrodzeniePvInput): CalcResult<OgrodzeniePvResult> {
  const { errors } = validateInput(input)
  const inputs: Record<string, number> = {
    dlugoscPanelaMm: input.dlugoscPanelaMm,
    wysokoscPanelaMm: input.wysokoscPanelaMm,
    przeswitMm: input.przeswitMm,
    stopienZageszczeniaId: input.stopienZageszczeniaId,
    glebokoscPrzemarzaniaM: input.glebokoscPrzemarzaniaM,
  }
  const baza = { unit: "mm", formula: FORMULA, formulaKey: "UI-FORMULA-PV-OGRODZENIE", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const { strefaWiatrowa, wysokoscNpmM, kategoriaTerenu, grupaGruntu, wilgotnoscGruntu, gatunekStali, metodaOporuGruntu } = input
  if (
    input.dlugoscPanelaMm === 0 ||
    input.wysokoscPanelaMm === 0 ||
    input.przeswitMm === 0 ||
    input.stopienZageszczeniaId === 0 ||
    input.glebokoscPrzemarzaniaM === 0 ||
    (input.liczbaRzedow === null && input.maxWysokoscMm === null) ||
    strefaWiatrowa === null ||
    wysokoscNpmM === null ||
    kategoriaTerenu === null ||
    grupaGruntu === null ||
    wilgotnoscGruntu === null ||
    gatunekStali === null ||
    metodaOporuGruntu === null
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const gx = input.szczelinaPoziomaMm ?? 0
  const gy = input.szczelinaPionowaMm ?? 0
  const h = input.wysokoscPanelaMm

  // --- layout ---
  if (input.przeswitMm < MIN_PRZESWIT_MM) warnings.push(przeswitZaMaly(input.przeswitMm, MIN_PRZESWIT_MM))
  let rzedy = input.liczbaRzedow
  if (rzedy === null) {
    rzedy = Math.floor(((input.maxWysokoscMm as number) - input.przeswitMm + gy) / (h + gy))
    if (rzedy < 1) {
      return {
        ...baza,
        value: PUSTY,
        status: "INVALID_INPUT",
        assumptions: [],
        warnings: [brakMiejscaNaPanel(input.maxWysokoscMm as number, input.przeswitMm + h)],
      }
    }
  }
  if (rzedy < 1) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  const wysokoscPaneliMm = rzedy * h + (rzedy - 1) * gy
  const wysokoscCalkowitaMm = input.przeswitMm + wysokoscPaneliMm
  if (input.maxWysokoscMm !== null && wysokoscCalkowitaMm > input.maxWysokoscMm) {
    warnings.push(wysokoscPrzekroczona(wysokoscCalkowitaMm, input.maxWysokoscMm))
  }

  // --- wind: PN-EN 1991-1-4 7.4.3 ---
  const hp = wysokoscPaneliMm / 1000
  const zg = input.przeswitMm / 1000
  const kolizjaZTerenem = zg < hp / 4 // z_g ≤ h/4 handled as <, equal is the signboard side (7.4.3 (1) says "greater than")
  const rozstawBazowyMm = input.dlugoscPanelaMm + 2 * gx
  const sciana = kolizjaZTerenem && rozstawBazowyMm / wysokoscPaneliMm > 1
  const cf = sciana ? CP_NET_SCIANA_POLE_A : CF_TABLICA_PIONOWA
  const zeM = sciana ? wysokoscCalkowitaMm / 1000 : zg + hp / 2
  if (sciana) warnings.push(scianaWolnostojaca(CP_NET_SCIANA_POLE_A))
  const qbPa = bazoweCisnienieWiatruPa(strefaWiatrowa, wysokoscNpmM)
  const qpPa = szczytoweCisnieniePa(qbPa, wspolczynnikEkspozycji(kategoriaTerenu, zeM))
  const zcMm = input.przeswitMm + wysokoscPaneliMm / 2
  const fy = GRANICA_PLASTYCZNOSCI_MPA[gatunekStali]
  const katalog = katalogWgMasy(gatunekStali)

  // --- post: lightest profile that carries the base moment (spacing depends on the post width) ---
  let slupek: WynikProfilu | null = null
  let rozstawMm = rozstawBazowyMm
  let silaN = 0
  let momentNmm = 0
  for (const w of katalog) {
    if (!w.klasaNieWiekszaNiz3 || w.profil.glebokoscMm < w.profil.szerokoscMm) continue
    const s = rozstawBazowyMm + w.profil.szerokoscMm
    const f = (cf * qpPa * (s / 1000) * hp) // N
    const m = GAMMA_Q_STR * f * zcMm // N·mm
    const mRd = nosnoscZginaniaNmm(w, gatunekStali)
    if (m <= mRd) {
      slupek = { profil: w.profil, wykorzystanie: m / mRd, ugiecieMm: ugiecieKonsoliMm(f, zcMm, w) }
      rozstawMm = s
      silaN = f
      momentNmm = m
      break
    }
  }
  if (slupek === null) {
    warnings.push(brakProfiluSlupka())
    const s = rozstawBazowyMm
    silaN = cf * qpPa * (s / 1000) * hp
    momentNmm = GAMMA_Q_STR * silaN * zcMm
    rozstawMm = s
  }

  // --- rail: lightest profile for the clear span, two rails per row ---
  let rygiel: WynikProfilu | null = null
  const rozpietoscMm = rozstawMm - (slupek?.profil.szerokoscMm ?? 0)
  const obciazenieRyglaNMm = (cf * qpPa * (h / 1000)) / SZYNY_NA_RZAD / 1000 // N/mm: pressure × tributary height / rails
  const mEdRygla = (GAMMA_Q_STR * obciazenieRyglaNMm * rozpietoscMm ** 2) / 8
  for (const w of katalog) {
    if (!w.klasaNieWiekszaNiz3) continue
    const mRd = nosnoscZginaniaNmm(w, gatunekStali)
    const ugiecie = ugiecieBelkiMm(obciazenieRyglaNMm, rozpietoscMm, w)
    if (mEdRygla > mRd) continue
    if (input.ugiecieDopuszczalneMm !== null && input.ugiecieDopuszczalneMm > 0 && ugiecie > input.ugiecieDopuszczalneMm) continue
    rygiel = { profil: w.profil, wykorzystanie: mEdRygla / mRd, ugiecieMm: ugiecie }
    break
  }
  if (rygiel === null) warnings.push(brakProfiluRygla())

  const przesuniecieLicowaniaMm =
    slupek !== null && rygiel !== null && input.grubDoscPanelaMm !== null
      ? slupek.profil.glebokoscMm - (rygiel.profil.glebokoscMm + input.grubDoscPanelaMm)
      : null
  if (przesuniecieLicowaniaMm !== null) warnings.push(licowanie(przesuniecieLicowaniaMm))

  // --- soil and pier ---
  const phi = katTarciaPhiU(grupaGruntu, input.stopienZageszczeniaId) as number // validated against the chart range
  const rho = gestoscObjetosciowaGruntu(grupaGruntu, input.stopienZageszczeniaId, wilgotnoscGruntu) as number
  const gestoscKgM3 = rho * 1000 - (input.gruntPodWoda ? GESTOSC_WODY_KG_M3 : 0)
  const ciezarNm3 = gestoscKgM3 * PRZYSPIESZENIE_ZIEMSKIE_M_S2

  let fundament: WynikFundamentu | null = null
  const zaglebienieWgSrednicy: Record<number, number> = {}
  if (slupek !== null) {
    const przekatna = Math.hypot(slupek.profil.glebokoscMm, slupek.profil.szerokoscMm)
    const srednice = SREDNICE_FUNDAMENTU_MM.filter((d) => d >= przekatna)
    const ramieM = zcMm / 1000
    const liczDla = (srednicaMm: number, metoda: MetodaOporuGruntu) =>
      zaglebienieEc7(silaN, ramieM, srednicaMm / 1000, ciezarNm3, phi, metoda)
    for (const d of srednice) {
      zaglebienieWgSrednicy[d] = zaokraglWGore(Math.max(liczDla(d, metodaOporuGruntu).glebokoscM * 1000, input.glebokoscPrzemarzaniaM * 1000))
    }
    const d = srednice[0]
    if (d !== undefined) {
      const wybrana = liczDla(d, metodaOporuGruntu)
      const przemarzanie = input.glebokoscPrzemarzaniaM * 1000 > wybrana.glebokoscM * 1000
      fundament = {
        srednicaMm: d,
        zaglebienieZachowawczaM: liczDla(d, "zachowawcza").glebokoscM,
        zaglebienieBromsM: liczDla(d, "broms").glebokoscM,
        zaglebienieWybraneM: wybrana.glebokoscM,
        zaglebienieKoncoweMm: zaglebienieWgSrednicy[d] as number,
        podejscieEc7: wybrana.podejscie,
        zaglebienieWgPodejsc: wybrana.wgPodejsc,
        przemarzanieDecyduje: przemarzanie,
      }
      if (przemarzanie) warnings.push(przemarzanieDecyduje(input.glebokoscPrzemarzaniaM, wybrana.glebokoscM))
    }
  }
  warnings.push(zrodlaDoPotwierdzenia())

  const liczbaPaneliWRzedzie = input.dlugoscOgrodzeniaM !== null && input.dlugoscOgrodzeniaM > 0 ? Math.ceil((input.dlugoscOgrodzeniaM * 1000) / rozstawMm) : null

  const assumptions: Assumption[] = [
    { kod: "OG-Z-WIATR", params: { cf, ze: zeM.toFixed(2) } },
    { kod: "OG-Z-MIMOSROD" },
    { kod: "OG-Z-STAL", params: { stal: gatunekStali, fy, gammaM0: GAMMA_M0 } },
    { kod: "OG-Z-PRZEKROJ" },
    { kod: "OG-Z-RYGLE", params: { n: SZYNY_NA_RZAD } },
    { kod: "OG-Z-GRUNT", params: { phi: phi.toFixed(1) } },
    { kod: "OG-Z-EC7" },
    { kod: "OG-Z-SZTYWNY" },
  ]
  if (input.szczelinaPoziomaMm === null || input.szczelinaPionowaMm === null) assumptions.push({ kod: "OG-Z-SZCZELINY" })

  return {
    ...baza,
    value: {
      rzedy,
      wysokoscPaneliMm,
      wysokoscCalkowitaMm,
      rozstawSlupkowMm: rozstawMm,
      liczbaSlupkow: liczbaPaneliWRzedzie === null ? null : liczbaPaneliWRzedzie + 1,
      liczbaPaneliWRzedzie,
      qpPa,
      cf,
      zeM,
      silaNaSlupekN: silaN,
      momentProjektowyNm: momentNmm / 1000,
      slupek,
      rygiel,
      przesuniecieLicowaniaMm,
      katTarciaDeg: phi,
      gestoscGruntuKgM3: gestoscKgM3,
      fundament,
      zaglebienieWgSrednicy,
    },
    status: "ESTIMATE",
    assumptions,
    warnings,
  }
}

