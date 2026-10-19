import { balastPrzesuwuEquKg, balastPrzewracaniaEquKg, balastProjektowyEquKg, type StatecznoscStelaza } from "../eurokod-0/rownowaga"
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
 *    więc bez danych użytkownika kg balastu nie liczymy (`null`);
 *  - z `stateczność` (tarcie, wysokość punktu przyłożenia siły, podstawa — dane użytkownika, bez wartości domyślnych) dla KAŻDEGO
 *    kąta sprawdzamy też przesuw i przewracanie tymi samymi współczynnikami częściowymi (D96). To szacunek aplikacji,
 *    także dla kątów normowych: norma nie podaje ani tarcia, ani punktu przyłożenia siły. Balast = największy ze sprawdzonych warunków.
 */
export type SilaIBalastWiatru = {
  /** |cf|: odrywanie (0–90° wyłącznie) albo siła pozioma (90°). */
  cf: number
  silaN: number
  /**
   * Balast [kg] = największy z sprawdzonych warunków. Bez `stateczność`: tylko oderwanie (EQU), a dla 90° `null`
   * (siła pozioma, norma nie podaje balastu). Z `stateczność`: oderwanie, przesuw i przewracanie.
   */
  balastKg: number | null
  /** Składniki `balastKg` [kg]; `null` = warunek niesprawdzony (brak danych albo nie dotyczy). */
  balastOderwanieKg: number | null
  balastPrzesuwKg: number | null
  balastPrzewracanieKg: number | null
  /** `true` = sprawdzono przesuw i przewracanie — to SZACUNEK aplikacji (norma nie daje tarcia ani punktu przyłożenia siły). */
  statecznosc: boolean
  /** `true` = współczynnik z szacunku aplikacji (powyżej 30° do 90° wyłącznie), nie z normy. */
  szacunek: boolean
}

/** Kąty, dla których współczynnik siły jest szacunkiem aplikacji: powyżej 30° i poniżej 90°. */
export function czySzacunekWiatru(katDeg: number): boolean {
  return katDeg > KAT_NORMOWY_MAX_DEG && katDeg < KAT_MAX_DEG
}

const maksimum = (xs: (number | null)[]): number | null => {
  const liczby = xs.filter((x): x is number => x !== null)
  return liczby.length > 0 ? Math.max(...liczby) : null
}

export function silaIBalastWiatru(
  katDeg: number,
  phi: number,
  qpPa: number,
  powierzchniaM2: number,
  masaWlasnaKg = 0,
  statecznosc: StatecznoscStelaza | null = null,
): SilaIBalastWiatru | null {
  if (!Number.isFinite(katDeg) || katDeg < 0 || katDeg > KAT_MAX_DEG) return null
  const pion = katDeg === KAT_MAX_DEG
  const szacunek = czySzacunekWiatru(katDeg)
  const cf = pion ? CF_TABLICA_PIONOWA : cfOdrywaniaWiaty(szacunek ? KAT_NORMOWY_MAX_DEG : katDeg, phi)
  if (cf === null) return null
  const silaN = silaWiatruN(CSCD_STELAZ, cf, qpPa, powierzchniaM2)
  // Siła prostopadła do panelu; przy 90° cała jest pozioma (7.4.3), przy mniejszych kątach rozkład na składowe.
  const rad = (katDeg * Math.PI) / 180
  const silaPoziomaN = pion ? silaN : silaN * Math.sin(rad)
  const silaPionowaN = pion ? 0 : silaN * Math.cos(rad)
  const balastOderwanieKg = pion ? null : balastProjektowyEquKg(silaN, PRZYSPIESZENIE_ZIEMSKIE_M_S2, masaWlasnaKg)
  const balastPrzesuwKg = statecznosc
    ? balastPrzesuwuEquKg(silaPoziomaN, silaPionowaN, statecznosc.wspolczynnikTarcia, PRZYSPIESZENIE_ZIEMSKIE_M_S2, masaWlasnaKg)
    : null
  const balastPrzewracanieKg = statecznosc
    ? balastPrzewracaniaEquKg(silaPoziomaN, silaPionowaN, statecznosc.wysokoscSrodkaParciaM, statecznosc.szerokoscPodstawyM, PRZYSPIESZENIE_ZIEMSKIE_M_S2, masaWlasnaKg)
    : null
  return {
    cf,
    silaN,
    balastKg: maksimum([balastOderwanieKg, balastPrzesuwKg, balastPrzewracanieKg]),
    balastOderwanieKg,
    balastPrzesuwKg,
    balastPrzewracanieKg,
    statecznosc: statecznosc !== null,
    szacunek,
  }
}

/**
 * Składa dane stateczności z trzech pól wejścia. Komplet (wszystkie trzy dodatnie) → `stateczność`; część → `niekompletna`;
 * żadne → oba puste (liczymy wyłącznie oderwanie).
 */
export function skladStatecznosc(
  mu: number | null | undefined,
  wysokoscSrodkaParciaM: number | null | undefined,
  szerokoscPodstawyM: number | null | undefined,
): { statecznosc: StatecznoscStelaza | null; niekompletna: boolean } {
  const [m, h, b] = [mu ?? null, wysokoscSrodkaParciaM ?? null, szerokoscPodstawyM ?? null]
  if (m !== null && h !== null && b !== null) return { statecznosc: { wspolczynnikTarcia: m, wysokoscSrodkaParciaM: h, szerokoscPodstawyM: b }, niekompletna: false }
  return { statecznosc: null, niekompletna: m !== null || h !== null || b !== null }
}

/**
 * Dane stateczności stelaża z jego geometrii. Podstawa w kierunku wiatru = podana głębokość albo L·cos α (rzut paneli na
 * poziom); wysokość punktu przyłożenia siły podaje wywołujący (środek paneli — inaczej mierzony w każdym kalkulatorze).
 * `null` bez współczynnika tarcia albo gdy podstawa lub wysokość wychodzą niedodatnie (np. 90° bez podanej głębokości) —
 * wtedy przewracanie nie ma sensu fizycznego i nie zgadujemy.
 */
export function statecznoscZGeometrii(
  katDeg: number,
  dlugoscWzdluzSpaduM: number,
  wysokoscSrodkaParciaM: number,
  wspolczynnikTarcia: number | null | undefined,
  glebokoscPodstawyM: number | null | undefined,
): StatecznoscStelaza | null {
  if (wspolczynnikTarcia == null) return null
  const szerokoscPodstawyM = glebokoscPodstawyM ?? dlugoscWzdluzSpaduM * Math.cos((katDeg * Math.PI) / 180)
  if (!(szerokoscPodstawyM > 1e-9) || !(wysokoscSrodkaParciaM > 0)) return null
  return { wspolczynnikTarcia, wysokoscSrodkaParciaM, szerokoscPodstawyM }
}
