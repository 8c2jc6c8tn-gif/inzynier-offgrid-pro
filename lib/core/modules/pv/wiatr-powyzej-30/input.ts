/**
 * Wiatr dla paneli na konstrukcji pod kątem powyżej 30° do 90° — Moduł 3 "Instalacja PV".
 *
 * Tablica 7.6 Eurokodu (PN-EN 1991-1-4, wiaty jednospadowe) kończy się na 30°; żadna norma ani dokument
 * nie podaje współczynników dla paneli na konstrukcji pod większym kątem. Decyzja właściciela (D90,
 * 18.10.2026): zachować wartości c_p,net z 30° dla kątów większych. Cały wynik tego kalkulatora jest
 * więc szacunkiem aplikacji (status `ESTIMATE`, standard 3.3), nigdy wynikiem normowym.
 */
import type { KategoriaTerenu, StrefaWiatrowa } from "../eurokod-1/wiatr"

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
}
