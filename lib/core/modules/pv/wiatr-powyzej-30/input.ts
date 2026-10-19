/**
 * Wiatr dla paneli na konstrukcji pod kątem powyżej 30° do 90° — Moduł 3 "Instalacja PV".
 *
 * Tablica 7.6 Eurokodu (PN-EN 1991-1-4, wiaty jednospadowe) kończy się na 30°; żadna norma ani dokument
 * nie podaje współczynników dla paneli na konstrukcji pod większym kątem. Decyzja właściciela (D90,
 * 18.10.2026): zachować wartości c_p,net z 30° dla kątów większych. Cały wynik tego kalkulatora jest
 * więc szacunkiem aplikacji (status `ESTIMATE`, standard 3.3), nigdy wynikiem normowym.
 */
import type { KategoriaTerenu, StrefaWiatrowa } from "../eurokod-1/wiatr"
import type { MetodaCf } from "./sila-i-balast"

export type WiatrPowyzej30Input = {
  /** Nachylenie paneli [°]. 0 = jeszcze nie wpisano. Zakres obsługiwany: powyżej 30° do 90°; do 30° jest norma (Tablica 7.6). */
  nachylenieDeg: number
  /** Strefa wiatrowa (Załącznik krajowy, Tablica NA.1); `null` = nie wybrano. */
  strefaWiatrowa: StrefaWiatrowa | null
  /** Wysokość miejsca nad poziomem morza [m]; `null` = nie wpisano. */
  wysokoscNpmM: number | null
  /** Kategoria terenu (Tablica NA.3); `null` = nie wybrano. */
  kategoriaTerenu: KategoriaTerenu | null
  /** Wysokość konstrukcji (środka paneli) nad terenem [m]; `null` = nie wpisano. */
  wysokoscKonstrukcjiM: number | null
  /** Powierzchnia grupy paneli na konstrukcji [m²] — opcjonalnie; razem ze współczynnikiem φ pozwala policzyć siłę wiatru na stelaż i balast. */
  powierzchniaM2?: number | null
  /** Współczynnik ograniczenia przepływu pod stelażem φ (0–1) — opcjonalnie, razem z powierzchnią. */
  wspolczynnikPhi?: number | null
  /** Masa paneli i stelaża dla tej powierzchni [kg], bez balastu (D29) — opcjonalnie; puste = pomijamy (bezpieczniej). */
  masaPaneliStelazaKg?: number | null
  /** Współczynnik tarcia stelaża/balastu o podłoże μ — opcjonalnie; razem z wysokością i podstawą pozwala sprawdzić przesuw i przewracanie. Bez wartości domyślnej. */
  wspolczynnikTarcia?: number | null
  /** Wysokość punktu przyłożenia siły wiatru nad terenem [m] — opcjonalnie (środek paneli). */
  wysokoscSrodkaParciaM?: number | null
  /** Szerokość podstawy stelaża w kierunku wiatru [m] — opcjonalnie (przewracanie wokół krawędzi zawietrznej). */
  szerokoscPodstawyM?: number | null
  /** Metoda szacunku cf dla kątów powyżej 30° do 89°: `liniowa` (domyślna, D97) albo `trend` (ostrożniejsza, D101). */
  metodaCf?: MetodaCf | null
}
