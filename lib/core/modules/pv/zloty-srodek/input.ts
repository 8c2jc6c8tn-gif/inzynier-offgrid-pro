/**
 * Ekran 9, Moduł 3 "Instalacja PV" — Optymalizator "Złotego Środka" (dawne 2.17,
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 9). Projekt ekranu: D27 (`rejestr-decyzji.md`),
 * stelaż = wiata jednospadowa: D26. Tor wiatru: PN-EN 1991-1-4 (`../eurokod-1/wiatr.ts`),
 * śnieg: PN-EN 1991-1-3 Tablica 5.2 (`../eurokod-1/snieg.ts`), produkcja: tabela M3/E1.
 */
import type { KategoriaTerenu, StrefaWiatrowa } from "../eurokod-1/wiatr"
import type { TabelaNapromieniowania } from "../kat-i-azymut/input"

export type ZlotySrodekInput = {
  /** Tabela napromieniowania kąt 0–90° × miesiąc (krok ciężki M3/E1). */
  tabela: TabelaNapromieniowania | null
  /** Strefa wiatrowa wg mapy Rysunek NA.1. */
  strefaWiatrowa: StrefaWiatrowa | null
  /** Wysokość terenu nad poziomem morza A [m] (Tablica NA.1). */
  wysokoscNpmM: number | null
  /** Kategoria terenu 0–IV (Tablica NA.3). */
  kategoriaTerenu: KategoriaTerenu | null
  /** Wysokość górnej krawędzi stelaża nad gruntem ze = h [m] (7.3 (8)). */
  wysokoscKonstrukcjiM: number | null
  /** Powierzchnia paneli na stelażu Aref [m²]. */
  powierzchniaPaneliM2: number | null
  /** Współczynnik ograniczenia przepływu pod stelażem φ ∈ [0, 1] (7.3 (2)): 0 = pusto pod spodem. */
  wspolczynnikPhi: number | null
  /**
   * Masa paneli i stelaża (bez balastu) [kg] — z karty katalogowej albo z wagi, nigdy domyślna (D29).
   * Siła utrzymująca z γG,inf = 0,90; balast i jego koszt liczone ponad tę masę. `null` = pominięta.
   */
  masaPaneliStelazaKg: number | null
  /**
   * Długość pola paneli wzdłuż spadku L [m] — opcjonalnie; razem ze współczynnikiem tarcia pozwala sprawdzić przesuw i przewracanie
   * (punkt przyłożenia siły = środek paneli: ze − L/2·sin α; podstawa: L·cos α albo podana głębokość).
   */
  dlugoscWzdluzSpaduM?: number | null
  /** Współczynnik tarcia stelaża/balastu o podłoże μ — opcjonalnie, bez wartości domyślnej. */
  wspolczynnikTarcia?: number | null
  /** Głębokość podstawy stelaża w kierunku wiatru [m] — opcjonalnie; puste = L·cos α; przy 90° konieczna. */
  glebokoscPodstawyM?: number | null
  /** Cena balastu [zł/kg] — podpowiedź 1 zł/kg (D27, wykonanie własne), użytkownik wpisuje swoją. */
  cenaBalastuZlKg: number | null
  /** Do wyceny energii (kryterium D27) — wszystkie cztery albo brak rekomendacji. */
  mocInstalacjiKwp: number | null
  wspolczynnikPr: number | null
  cenaEnergiiZlKwh: number | null
  liczbaLat: number | null
  /** Kąt do porównania (suwak) [°]. */
  nachylenieDeg: number | null
}
