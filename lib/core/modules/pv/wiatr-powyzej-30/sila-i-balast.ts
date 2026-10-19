import { balastPrzewracaniaEquKg, balastProjektowyEquKg, type StatecznoscStelaza } from "../eurokod-0/rownowaga"
import { przesuwEc7, type PodejscieEc7 } from "../eurokod-7/przesuw"
import { CF_TABLICA_PIONOWA, CF_WIATA_KROK_DEG, cfOdrywaniaWiaty, silaWiatruN } from "../eurokod-1/wiatr"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"
import { KAT_MAX_DEG, KAT_NORMOWY_MAX_DEG } from "./constants"

/**
 * Siła wiatru na stelaż z panelami i balast przeciw oderwaniu dla DOWOLNEGO kąta — jedno źródło reguły dla wszystkich
 * kalkulatorów zmiany kąta (typ montażu, „Złoty środek”, wiatr powyżej 30°):
 *  - 0–30°: Tablica 7.6 Eurokodu (norma), balast z EQU (PN-EN 1990);
 *  - powyżej 30° do 90° (wyłącznie): SZACUNEK aplikacji — współczynnik siły policzony dla KAŻDEGO kąta liniową interpolacją
 *    między dwiema wartościami z naszych danych: cf(30°, φ) z Tablicy 7.6 i cf(90°) = 1,80 z 7.4.3 (D97, polecenie właściciela:
 *    „przeliczone na bazie naszych danych”; zastępuje „zachowaj wartość z 30°” z D90/D95), balast z tego samego wzoru EQU;
 *    użytkownik zabezpiecza kąt na własną odpowiedzialność;
 *  - 90° (panel pionowy): norma 7.4.3, cf = 1,80 to siła POZIOMA — balast zależy od tarcia i przewracania, norma tego nie podaje,
 *    więc bez danych użytkownika kg balastu nie liczymy (`null`);
 *  - z `stateczność` (tarcie, wysokość punktu przyłożenia siły, podstawa — dane użytkownika, bez wartości domyślnych) dla KAŻDEGO
 *    kąta sprawdzamy też przesuw i przewracanie (D96). Przewracanie jak oderwanie: EQU, Tablica A.1 (γQ 1,5, γG,stb 0,9). Przesuw wg
 *    PN-EN 1997-1 p. 6.5.3 (D98): obwiednia czterech kombinacji podejść obliczeniowych z Załącznika A. To nadal szacunek aplikacji,
 *    także dla kątów normowych: norma nie podaje punktu przyłożenia siły ani tarcia dla konkretnej pary materiałów. Balast = największy
 *    ze sprawdzonych warunków.
 */
/** Warunek stateczności, który wyznacza balast (najcięższy z sprawdzonych). */
export type WarunekBalastu = "oderwanie" | "przesuw" | "przewracanie"

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
  /** Podejście obliczeniowe EC7 (PO1-K1, PO1-K2, PO2, PO3), które daje największy balast przesuwu; `null` bez danych stateczności. */
  podejscieEc7Przesuw: PodejscieEc7 | null
  /** Który ze sprawdzonych warunków daje największy balast (przy remisie: oderwanie, potem przesuw); `null` = nic nie sprawdzono. */
  warunekRozstrzygajacy: WarunekBalastu | null
  /** `true` = sprawdzono przesuw i przewracanie — to SZACUNEK aplikacji (norma nie daje tarcia ani punktu przyłożenia siły). */
  statecznosc: boolean
  /** `true` = współczynnik z szacunku aplikacji (powyżej 30° do 90° wyłącznie), nie z normy. */
  szacunek: boolean
}

/**
 * Metoda szacunku współczynnika siły dla kąta powyżej 30° do 90° (wyłącznie) — wybór użytkownika (D101):
 *  - `liniowa`: prosta między cf(30°, φ) z Tablicy 7.6 a cf(90°) = 1,80 z 7.4.3 (D97);
 *  - `trend`: kontynuacja przyrostu z ostatniego kroku Tablicy 7.6 (25°→30°, na stopień) do limitu 1,80, nie mniej niż `liniowa`
 *    (ostrożniejsza; bez ograniczenia „nie mniej niż liniowa” przy φ = 1 trend jest płaski, a przy 90° norma daje 1,80 — skok).
 * Obie to szacunki aplikacji; limit 1,80 to założenie (najwyższa wartość cf w naszych danych), nie wynik normy.
 */
export type MetodaCf = "liniowa" | "trend"
export const METODY_CF: readonly MetodaCf[] = ["liniowa", "trend"]

/** Kod założenia opisującego wybraną metodę (słownik silnika). */
export const kodZalozeniaCf = (metoda: MetodaCf) => (metoda === "trend" ? "WP30-ZALOZENIE-CF-TREND" : "WP30-ZALOZENIE-CF-INTERPOLACJA")

/** Przyrost |cf| na stopień w ostatnim kroku Tablicy 7.6 (25°→30°) dla danego φ; nie ujemny. */
export function przyrostCfTablicyNaStopien(phi: number): number | null {
  const k = KAT_NORMOWY_MAX_DEG
  const dolny = cfOdrywaniaWiaty(k - CF_WIATA_KROK_DEG, phi)
  const gorny = cfOdrywaniaWiaty(k, phi)
  if (dolny === null || gorny === null) return null
  return Math.max(0, (gorny - dolny) / CF_WIATA_KROK_DEG)
}

/**
 * Współczynnik siły dla kąta powyżej 30° do 90° (wyłącznie) wg wybranej metody (domyślnie liniowa, D97). Obie wartości graniczne
 * (cf(30°, φ) z Tablicy 7.6 i cf(90°) = 1,80 z 7.4.3) to nasze dane; sam przebieg pomiędzy jest szacunkiem aplikacji, bo norma nie podaje nic
 * pomiędzy (i dla siły prostopadłej do paneli, i dla siły poziomej na pionowej tablicy to różne wielkości — traktujemy je jako moduł siły netto).
 */
export function cfSzacunekPozaNorma(katDeg: number, phi: number, metoda: MetodaCf = "liniowa"): number | null {
  const cf30 = cfOdrywaniaWiaty(KAT_NORMOWY_MAX_DEG, phi)
  if (cf30 === null) return null
  const liniowa = cf30 + ((CF_TABLICA_PIONOWA - cf30) * (katDeg - KAT_NORMOWY_MAX_DEG)) / (KAT_MAX_DEG - KAT_NORMOWY_MAX_DEG)
  if (metoda === "liniowa") return liniowa
  const przyrost = przyrostCfTablicyNaStopien(phi)
  if (przyrost === null) return null
  return Math.max(liniowa, Math.min(CF_TABLICA_PIONOWA, cf30 + przyrost * (katDeg - KAT_NORMOWY_MAX_DEG)))
}

/** Kąty, dla których współczynnik siły jest szacunkiem aplikacji: powyżej 30° i poniżej 90°. */
export function czySzacunekWiatru(katDeg: number): boolean {
  return katDeg > KAT_NORMOWY_MAX_DEG && katDeg < KAT_MAX_DEG
}

/** Najcięższy ze sprawdzonych warunków (kolejność = priorytet przy remisie). */
export function warunekRozstrzygajacy(oderwanieKg: number | null, przesuwKg: number | null, przewracanieKg: number | null): WarunekBalastu | null {
  const kandydaci = (
    [
      ["oderwanie", oderwanieKg],
      ["przesuw", przesuwKg],
      ["przewracanie", przewracanieKg],
    ] as const
  ).filter((k): k is readonly [WarunekBalastu, number] => k[1] !== null)
  if (kandydaci.length === 0) return null
  return kandydaci.reduce((a, b) => (b[1] > a[1] ? b : a))[0]
}

export function silaIBalastWiatru(
  katDeg: number,
  phi: number,
  qpPa: number,
  powierzchniaM2: number,
  masaWlasnaKg = 0,
  statecznosc: StatecznoscStelaza | null = null,
  metodaCf: MetodaCf = "liniowa",
): SilaIBalastWiatru | null {
  if (!Number.isFinite(katDeg) || katDeg < 0 || katDeg > KAT_MAX_DEG) return null
  const pion = katDeg === KAT_MAX_DEG
  const szacunek = czySzacunekWiatru(katDeg)
  const cf = pion ? CF_TABLICA_PIONOWA : szacunek ? cfSzacunekPozaNorma(katDeg, phi, metodaCf) : cfOdrywaniaWiaty(katDeg, phi)
  if (cf === null) return null
  const silaN = silaWiatruN(CSCD_STELAZ, cf, qpPa, powierzchniaM2)
  // Siła prostopadła do panelu; przy 90° cała jest pozioma (7.4.3), przy mniejszych kątach rozkład na składowe.
  const rad = (katDeg * Math.PI) / 180
  const silaPoziomaN = pion ? silaN : silaN * Math.sin(rad)
  const silaPionowaN = pion ? 0 : silaN * Math.cos(rad)
  const balastOderwanieKg = pion ? null : balastProjektowyEquKg(silaN, PRZYSPIESZENIE_ZIEMSKIE_M_S2, masaWlasnaKg)
  // Przesuw to stan GEO wg PN-EN 1997-1 p. 6.5.3 (nie EQU): obwiednia czterech kombinacji z Załącznika A, bo brak Załącznika krajowego.
  const przesuw = statecznosc ? przesuwEc7(silaPoziomaN, silaPionowaN, statecznosc.wspolczynnikTarcia, PRZYSPIESZENIE_ZIEMSKIE_M_S2, masaWlasnaKg) : null
  const balastPrzesuwKg = przesuw?.balastKg ?? null
  const balastPrzewracanieKg = statecznosc
    ? balastPrzewracaniaEquKg(silaPoziomaN, silaPionowaN, statecznosc.wysokoscSrodkaParciaM, statecznosc.szerokoscPodstawyM, PRZYSPIESZENIE_ZIEMSKIE_M_S2, masaWlasnaKg)
    : null
  const sprawdzone = [balastOderwanieKg, balastPrzesuwKg, balastPrzewracanieKg].filter((x): x is number => x !== null)
  return {
    cf,
    silaN,
    balastKg: sprawdzone.length > 0 ? Math.max(...sprawdzone) : null,
    warunekRozstrzygajacy: warunekRozstrzygajacy(balastOderwanieKg, balastPrzesuwKg, balastPrzewracanieKg),
    balastOderwanieKg,
    balastPrzesuwKg,
    balastPrzewracanieKg,
    podejscieEc7Przesuw: przesuw?.podejscie ?? null,
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
