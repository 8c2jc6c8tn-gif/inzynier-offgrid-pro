/**
 * Porównywarka paneli PV (spec 32): obciążenie panelu śniegiem i wiatrem wg Eurokodu (PN-EN 1991-1-3, 1991-1-4 z załącznikami krajowymi,
 * kombinacja STR wg PN-EN 1990) zestawione z nośnością z karty. Wzory i liczby nie są tu redefiniowane — wszystkie z istniejących plików
 * `eurokod-0/kombinacje.ts`, `eurokod-1/snieg.ts`, `eurokod-1/wiatr.ts` (to samo źródło co M3/E9, E6 i M7/E23).
 *
 * Zakres, świadomie wąski:
 *  - śnieg: dach/połać jednospadowa bez przeszkód blokujących zsuwanie (Tablica 5.2), składowa prostopadła do panelu s·cos²α;
 *  - wiatr: panele pochylone na konstrukcji (0–30°) jako wiata jednospadowa (Tablica 7.6, cp,net lokalne; założenie przyjęte przez
 *    właściciela 25.09.2026 dla stelaży). Panele równoległe do połaci (5–75°) z cpe połaci jednospadowej (7.3) albo dwuspadowej (7.4) jako górne
 *    oszacowanie (decyzja właściciela 18.10.2026; norma nie podaje cp,net takiego panelu). Panele na konstrukcji pod kątem 30–90°: WŁASNE oszacowanie
 *    aplikacji (wartości z 30° Tablicy 7.6 zachowane; żadna norma tego nie opisuje, ekran to mówi wprost). Ściany i połacie poniżej 5° — poza zakresem;
 *  - bez ciężaru stelaża i bez korzystnego ciężaru panelu przy odrywaniu (strona bezpieczna).
 */
import { GAMMA_G_SUP_STR, GAMMA_Q_STR, PSI0_WIATR, psi0Sniegu } from "@/lib/core/modules/pv/eurokod-0/kombinacje"
import { WSPOLCZYNNIK_EKSPOZYCJI_CE, WSPOLCZYNNIK_TERMICZNY_CT, obciazenieSniegiemGruntuSk, wspolczynnikKsztaltuMu1 } from "@/lib/core/modules/pv/eurokod-1/snieg"
import { cpeDachuDlaPaneluRownoleglego } from "@/lib/core/modules/pv/eurokod-1/wiatr-dachy"
import { calculateWiatrPowyzej30 } from "@/lib/core/modules/pv/wiatr-powyzej-30/calculator"
import { CF_WIATA_MAX_KAT_DEG, KAT_PIONOWY_DEG, bazoweCisnienieWiatruPa, cpNetWiatyJednospadowej, szczytoweCisnieniePa, wspolczynnikEkspozycji, type CpNetWiaty } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "@/lib/core/modules/pv/zloty-srodek/constants"
import type { DanePanelu, ObciazeniePaneluKarta, WarunkiObciazen } from "./input"

/** Obciążenie testowe z karty → obliczeniowe: dzielone przez ten współczynnik (IEC 61215; karta JA Solar JAM54D40 LR: 5400 → 3600 Pa). */
export const WSPOLCZYNNIK_TEST_DO_OBLICZENIOWEGO = 1.5

const PA_NA_KN_M2 = 1000
const MM2_NA_M2 = 1e6

export type SniegNaPanelu = {
  /** Wartość charakterystyczna obciążenia gruntu s_k [kN/m²]. */
  skKnM2: number
  mu1: number
  ce: number
  ct: number
  /** Obciążenie dachu s = μ1·Ce·Ct·s_k [kN/m²] na rzut poziomy. */
  sKnM2: number
  /** Składowa prostopadła do panelu na m² panelu: s·cos²α [Pa]. */
  sNormalnaPa: number
  /** ψ0 śniegu dla wysokości miejsca (Tablica A1.1). */
  psi0: number
}

export type WiatrNaPanelu = {
  /** Bazowe ciśnienie prędkości qb [Pa] (Tablica NA.1, cdir = cseason = 1). */
  qbPa: number
  /** Współczynnik ekspozycji ce(ze) (Tablica NA.3). */
  ceZ: number
  /** Szczytowe ciśnienie prędkości qp(ze) = ce·qb [Pa]. */
  qpPa: number
  /** Współczynniki ciśnienia dla kąta paneli (docisk +, odrywanie — wartości bezwzględne). */
  cp: CpNetWiaty
  /**
   * Skąd cp: `wiata` = cp,net Tablicy 7.6 (panele na konstrukcji, 0–30°); `polac` = cpe,1 połaci z Tablic 7.3/7.4 (panele równoległe, górne oszacowanie);
   * `wlasne` = własne oszacowanie aplikacji dla paneli na konstrukcji pod kątem 30–90°: żadna norma ani dokument nie podaje tam współczynników,
   * wartości z 30° (Tablica 7.6) zachowane dla większych kątów (decyzja właściciela 18.10.2026, D90).
   */
  zrodloCp: "wiata" | "polac" | "wlasne"
}

/** Dlaczego wiatru nie porównano: `brak-danych` = nie wpisano strefy/terenu/wysokości; `brak-typu-dachu` = panele równoległe bez wybranej połaci; `kat-poza-zakresem` = poza tablicami. */
export type PowodBrakuWiatru = "brak-danych" | "brak-typu-dachu" | "kat-poza-zakresem"

export type ObciazeniaMiejsca = {
  nachylenieDeg: number
  snieg: SniegNaPanelu | null
  wiatr: WiatrNaPanelu | null
  /** `null`, gdy wiatr policzono. */
  powodBrakuWiatru: PowodBrakuWiatru | null
}

export type SytuacjaObciazenia = "docisk" | "docisk-srodek" | "docisk-krawedz" | "odrywanie-srodek" | "odrywanie-krawedz"

export type OcenaObciazenia = {
  sytuacja: SytuacjaObciazenia
  /** Wartość obliczeniowa oddziaływania na panel (Ed) [Pa]. */
  edPa: number
  /** Nośność obliczeniowa panelu (Rd) [Pa]; `null` = karta nie podaje wartości dla tego kierunku. */
  rdPa: number | null
  /** Ed/Rd [%]; `null` bez Rd. */
  wykorzystaniePct: number | null
  /** Ed > Rd; `null` bez Rd. */
  przekroczone: boolean | null
}

export type ObciazeniaPanelu = {
  /** Ciężar własny panelu prostopadle do jego powierzchni [Pa]; `null` bez masy albo wymiarów z karty (wtedy nie jest uwzględniony). */
  ciezarWlasnyPa: number | null
  oceny: OcenaObciazenia[]
  /** Nośność mechaniczna z karty (albo wpisana ręcznie); `null` = brak (oceny tylko z Ed). */
  karta: ObciazeniePaneluKarta | null
  /** Co najmniej jedna ocena ma nośność. */
  maNosnosc: boolean
}

/** Obciążenie śniegiem i wiatrem miejsca; `null`, gdy nie ma kąta paneli albo nic nie da się policzyć. */
export function obciazeniaMiejsca(w: WarunkiObciazen, nachylenieDeg: number): ObciazeniaMiejsca | null {
  const snieg =
    w.strefaSniegowa !== null && w.wysokoscNpmM !== null
      ? (() => {
          const skKnM2 = obciazenieSniegiemGruntuSk(w.strefaSniegowa, w.wysokoscNpmM)
          const mu1 = wspolczynnikKsztaltuMu1(nachylenieDeg)
          const ce = WSPOLCZYNNIK_EKSPOZYCJI_CE[w.ekspozycjaSniegu]
          const ct = WSPOLCZYNNIK_TERMICZNY_CT
          const sKnM2 = mu1 * ce * ct * skKnM2
          const cosA = Math.cos((nachylenieDeg * Math.PI) / 180)
          return { skKnM2, mu1, ce, ct, sKnM2, sNormalnaPa: sKnM2 * PA_NA_KN_M2 * cosA * cosA, psi0: psi0Sniegu(w.wysokoscNpmM) }
        })()
      : null
  let wiatr: WiatrNaPanelu | null = null
  let powodBrakuWiatru: PowodBrakuWiatru | null = null
  const rownolegly = w.montaz === "rownolegly"
  const wlasne = !rownolegly && nachylenieDeg > CF_WIATA_MAX_KAT_DEG && nachylenieDeg <= KAT_PIONOWY_DEG
  const cp = rownolegly
    ? w.typDachu
      ? cpeDachuDlaPaneluRownoleglego(w.typDachu, nachylenieDeg)
      : null
    : cpNetWiatyJednospadowej(wlasne ? CF_WIATA_MAX_KAT_DEG : nachylenieDeg)
  if (rownolegly && !w.typDachu) powodBrakuWiatru = "brak-typu-dachu"
  else if (cp === null) powodBrakuWiatru = "kat-poza-zakresem"
  else if (w.strefaWiatrowa === null || w.wysokoscNpmM === null || w.kategoriaTerenu === null || w.wysokoscKonstrukcjiM === null) powodBrakuWiatru = "brak-danych"
  else if (wlasne) {
    // Panels on a structure above 30°: the estimate lives in its own calculator (status ESTIMATE); here only its pressures are reused.
    const r = calculateWiatrPowyzej30({
      nachylenieDeg,
      strefaWiatrowa: w.strefaWiatrowa,
      wysokoscNpmM: w.wysokoscNpmM,
      kategoriaTerenu: w.kategoriaTerenu,
      wysokoscKonstrukcjiM: w.wysokoscKonstrukcjiM,
    })
    if (r.status === "ESTIMATE") wiatr = { qbPa: r.value.qbPa, ceZ: r.value.ce, qpPa: r.value.qpPa, cp: r.value.cp, zrodloCp: "wlasne" }
    else powodBrakuWiatru = "brak-danych"
  } else {
    const qbPa = bazoweCisnienieWiatruPa(w.strefaWiatrowa, w.wysokoscNpmM)
    const ceZ = wspolczynnikEkspozycji(w.kategoriaTerenu, w.wysokoscKonstrukcjiM)
    wiatr = { qbPa, ceZ, qpPa: szczytoweCisnieniePa(qbPa, ceZ), cp, zrodloCp: rownolegly ? "polac" : "wiata" }
  }
  if (snieg === null && wiatr === null) return null
  return { nachylenieDeg, snieg, wiatr, powodBrakuWiatru }
}

/** Nośność obliczeniowa [Pa] z liczby na karcie: testowa dzielona przez 1,5, obliczeniowa bez zmian. */
export function nosnoscObliczeniowaPa(kartaPa: number, rodzaj: ObciazeniePaneluKarta["rodzaj"]): number {
  return rodzaj === "testowe" ? kartaPa / WSPOLCZYNNIK_TEST_DO_OBLICZENIOWEGO : kartaPa
}

function ocena(sytuacja: SytuacjaObciazenia, edPa: number, rdPa: number | null): OcenaObciazenia {
  return { sytuacja, edPa, rdPa, wykorzystaniePct: rdPa === null ? null : (edPa / rdPa) * 100, przekroczone: rdPa === null ? null : edPa > rdPa }
}

/**
 * Ocena jednego panelu: docisk (śnieg z ciężarem własnym; z wiatrem w polu środkowym i krawędziowym) i odrywanie (wiatr, pola jak wyżej).
 * Kombinacja STR (6.10), dwa przypadki wiodące: śnieg wiodący z ψ0 wiatru albo wiatr wiodący z ψ0 śniegu — bierze się większe.
 */
export function ocenPanelObciazenia(panel: DanePanelu, m: ObciazeniaMiejsca): ObciazeniaPanelu {
  const karta = panel.obciazenie ?? null
  const cosA = Math.cos((m.nachylenieDeg * Math.PI) / 180)
  const ciezarWlasnyPa =
    panel.masaKg === null || panel.dlugoscMm === null || panel.szerokoscMm === null
      ? null
      : ((panel.masaKg * PRZYSPIESZENIE_ZIEMSKIE_M_S2) / ((panel.dlugoscMm * panel.szerokoscMm) / MM2_NA_M2)) * cosA
  const g = GAMMA_G_SUP_STR * (ciezarWlasnyPa ?? 0)
  const s = m.snieg?.sNormalnaPa ?? 0
  const psi0s = m.snieg?.psi0 ?? 0
  const rd = (kartaPa: number | null | undefined) => (karta === null || kartaPa === null || kartaPa === undefined ? null : nosnoscObliczeniowaPa(kartaPa, karta.rodzaj))
  const oceny: OcenaObciazenia[] = []
  if (m.wiatr === null) {
    if (m.snieg !== null) oceny.push(ocena("docisk", g + GAMMA_Q_STR * s, rd(karta?.przodPa)))
  } else {
    const { qpPa, cp } = m.wiatr
    // With wind the front rating is the lower of the snow figure and the wind figure given on the card (Trina: 5400 snow, 4000 wind).
    const rdDocisk = karta === null ? null : rd(Math.min(karta.przodPa, karta.wiatrPrzodPa ?? karta.przodPa))
    const docisk = (cpNet: number) => {
      const w = cpNet * qpPa
      return g + GAMMA_Q_STR * Math.max(s + PSI0_WIATR * w, w + psi0s * s)
    }
    oceny.push(ocena("docisk-srodek", docisk(cp.dociskSrodek), rdDocisk), ocena("docisk-krawedz", docisk(cp.dociskKrawedz), rdDocisk))
    oceny.push(ocena("odrywanie-srodek", GAMMA_Q_STR * cp.odrywanieSrodek * qpPa, rd(karta?.tylPa)), ocena("odrywanie-krawedz", GAMMA_Q_STR * cp.odrywanieKrawedz * qpPa, rd(karta?.tylPa)))
  }
  return { ciezarWlasnyPa, oceny, karta, maNosnosc: oceny.some((o) => o.rdPa !== null) }
}

/** Największe wykorzystanie nośności wśród ocen z nośnością [%]; `null` bez żadnej. */
export function najwyzszeWykorzystaniePct(o: ObciazeniaPanelu): number | null {
  const w = o.oceny.flatMap((x) => (x.wykorzystaniePct === null ? [] : [x.wykorzystaniePct]))
  return w.length === 0 ? null : Math.max(...w)
}
