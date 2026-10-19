import { balastProjektowyEquKg } from "../eurokod-0/rownowaga"
import { CF_TABLICA_PIONOWA, cfOdrywaniaWiaty, silaWiatruN } from "../eurokod-1/wiatr"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"
import { KAT_MAX_DEG, KAT_NORMOWY_MAX_DEG } from "./constants"

/**
 * Siła wiatru na stelaż z panelami i balast przeciw oderwaniu dla DOWOLNEGO kąta — jedno źródło reguły dla wszystkich
 * kalkulatorów zmiany kąta (typ montażu, „Złoty środek”, wiatr powyżej 30°):
 *  - 0–30°: Tablica 7.6 Eurokodu (norma), balast z EQU (PN-EN 1990);
 *  - powyżej 30° do 90° (wyłącznie): SZACUNEK aplikacji — współczynnik siły z 30° zachowany (decyzja właściciela, D90/D95),
 *    balast z tego samego wzoru EQU; użytkownik zabezpiecza kąt na własną odpowiedzialność;
 *  - 90° (panel pionowy): norma 7.4.3, cf = 1,80 to siła POZIOMA — balast zależy od tarcia i przewracania, norma tego nie podaje,
 *    więc kg balastu nie liczymy.
 */
export type SilaIBalastWiatru = {
  /** |cf|: odrywanie (0–90° wyłącznie) albo siła pozioma (90°). */
  cf: number
  silaN: number
  /** Balast EQU [kg]; `null` dla 90° (siła pozioma). */
  balastKg: number | null
  /** `true` = współczynnik z szacunku aplikacji (powyżej 30° do 90° wyłącznie), nie z normy. */
  szacunek: boolean
}

/** Kąty, dla których współczynnik siły jest szacunkiem aplikacji: powyżej 30° i poniżej 90°. */
export function czySzacunekWiatru(katDeg: number): boolean {
  return katDeg > KAT_NORMOWY_MAX_DEG && katDeg < KAT_MAX_DEG
}

export function silaIBalastWiatru(katDeg: number, phi: number, qpPa: number, powierzchniaM2: number, masaWlasnaKg = 0): SilaIBalastWiatru | null {
  if (!Number.isFinite(katDeg) || katDeg < 0 || katDeg > KAT_MAX_DEG) return null
  if (katDeg === KAT_MAX_DEG) {
    return { cf: CF_TABLICA_PIONOWA, silaN: silaWiatruN(CSCD_STELAZ, CF_TABLICA_PIONOWA, qpPa, powierzchniaM2), balastKg: null, szacunek: false }
  }
  const szacunek = czySzacunekWiatru(katDeg)
  const cf = cfOdrywaniaWiaty(szacunek ? KAT_NORMOWY_MAX_DEG : katDeg, phi)
  if (cf === null) return null
  const silaN = silaWiatruN(CSCD_STELAZ, cf, qpPa, powierzchniaM2)
  return { cf, silaN, balastKg: balastProjektowyEquKg(silaN, PRZYSPIESZENIE_ZIEMSKIE_M_S2, masaWlasnaKg), szacunek }
}
