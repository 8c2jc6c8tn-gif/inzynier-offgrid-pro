import { POJEMNOSC_OGNIWA_WH } from "./constants"

/** Liczba ogniw szeregowo per "nazwa" napięcia systemowego — 1:1 ze źródła (4S/8S/16S). NIE
 *  V/3,2V dosłownie: pakiet "12V" LiFePO4 to nominalnie 4×3,2V=12,8V (etykieta handlowa), więc
 *  dzielenie napięcia nominalnego systemu przez napięcie ogniwa dałoby błędne 3,75. */
const LICZBA_OGNIW_SZEREGOWO: Record<12 | 24 | 48, number> = { 12: 4, 24: 8, 48: 16 }

export type CenyKosztorysu = {
  cenaOgniwaZl: number
  cenaBmsZl: number
  cenaFalownikaZl: number
  cenaPrzewodowZl: number
  cenaBezpiecznikaZl: number
  cenaPrzetwornicyDcDcZl: number
}

export type KosztorysWynik = {
  napiecieV: 12 | 24 | 48
  liczbaOgniwSzeregowo: number
  liczbaStringowRownoleglych: number
  liczbaOgniwLacznie: number
  pojemnoscFaktycznaKwh: number
  kosztOgniwZl: number
  kosztBmsZl: number
  kosztFalownikaZl: number
  kosztPrzewodowZl: number
  kosztBezpiecznikowZl: number
  kosztPrzetwornicZl: number
  razemZl: number
}

/**
 * Etap E (kosztorysy) — dla tej samej docelowej pojemności energetycznej u wszystkich trzech
 * napięć (tabela E.3 źródła — "poprawne porównanie", nie naiwna tabela E.2 z tą samą liczbą
 * ogniw, która sama siebie uniważnia w materiale: "to nie są systemy o tej samej pojemności").
 * Pakiet z N ogniw w szeregu (N=V/3,2, czyli 4S/8S/16S — 1:1 ze źródła) × P stringów równoległych,
 * P dobrane tak, by osiągnąć/przekroczyć docelową pojemność. Koszt BMS liczony jako JEDNA sztuka
 * (nie ×P) — zgodnie z literalnym zapisem źródła (tabele E.2/E.3 pokazują jedną pozycję BMS na
 * kolumnę niezależnie od liczby równoległych stringów).
 *
 * Zweryfikowane ręcznie względem przykładu źródła (E.3, 16 kWh): 12V→16 ogniw (4×4S),
 * 24V→16 ogniw (2×8S), 48V→16 ogniw (1×16S); RAZEM 6332 zł / 6582 zł / 7162 zł (bez przetwornic,
 * liczbaLiniiOswietlenia=0) — dokładna zgodność.
 */
export function obliczKosztorys(
  napiecieV: 12 | 24 | 48,
  docelowaPojemnoscWh: number,
  ceny: CenyKosztorysu,
  liczbaLiniiOswietlenia: number,
): KosztorysWynik {
  const liczbaOgniwSzeregowo = LICZBA_OGNIW_SZEREGOWO[napiecieV]
  const pojemnoscJednegoStringuWh = liczbaOgniwSzeregowo * POJEMNOSC_OGNIWA_WH
  const liczbaStringowRownoleglych = Math.max(1, Math.ceil(docelowaPojemnoscWh / pojemnoscJednegoStringuWh))
  const liczbaOgniwLacznie = liczbaOgniwSzeregowo * liczbaStringowRownoleglych
  const pojemnoscFaktycznaKwh = (liczbaOgniwLacznie * POJEMNOSC_OGNIWA_WH) / 1000

  const kosztOgniwZl = liczbaOgniwLacznie * ceny.cenaOgniwaZl
  const kosztBmsZl = ceny.cenaBmsZl
  const kosztFalownikaZl = ceny.cenaFalownikaZl
  const kosztPrzewodowZl = ceny.cenaPrzewodowZl
  const kosztBezpiecznikowZl = ceny.cenaBezpiecznikaZl
  const kosztPrzetwornicZl = napiecieV === 48 ? liczbaLiniiOswietlenia * ceny.cenaPrzetwornicyDcDcZl : 0

  const razemZl =
    kosztOgniwZl + kosztBmsZl + kosztFalownikaZl + kosztPrzewodowZl + kosztBezpiecznikowZl + kosztPrzetwornicZl

  return {
    napiecieV,
    liczbaOgniwSzeregowo,
    liczbaStringowRownoleglych,
    liczbaOgniwLacznie,
    pojemnoscFaktycznaKwh,
    kosztOgniwZl,
    kosztBmsZl,
    kosztFalownikaZl,
    kosztPrzewodowZl,
    kosztBezpiecznikowZl,
    kosztPrzetwornicZl,
    razemZl,
  }
}

/** Etap H.4 — koszt przejścia z 24V na 48V, reużywa cen Etapu E (BMS16S + falownik 48V +
 *  przewody 48V — te same pozycje co w kosztorysie 48V, bez ogniw ani bezpiecznika, których
 *  źródło nie liczy do kosztu przejścia poza wymianą bezpieczników — pominięte, źródło podaje
 *  tylko 3 pozycje w H.4). */
export function obliczKosztKonwersji24Do48(ceny: Pick<CenyKosztorysu, "cenaBmsZl" | "cenaFalownikaZl" | "cenaPrzewodowZl">): number {
  return ceny.cenaBmsZl + ceny.cenaFalownikaZl + ceny.cenaPrzewodowZl
}
