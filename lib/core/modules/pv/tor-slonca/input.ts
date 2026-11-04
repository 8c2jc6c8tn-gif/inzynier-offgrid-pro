import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

/**
 * Wejście ekranu „Tor słońca”. `null` = pole niewypełnione (bez wartości domyślnych, Dyrektywa #1): do toru wystarczą
 * współrzędne i miesiąc; energia PV wymaga dodatkowo nachylenia, azymutu, mocy i PR.
 */
export type TorSloncaInput = {
  szerokoscGeograficzna: number | null
  dlugoscGeograficzna: number | null
  /** Miesiąc 1–12, którego dzień (połowa miesiąca) jest rysowany jako „wybrany” i dla którego liczona jest doba energii. */
  miesiac: number | null
  /** Nachylenie paneli od poziomu [°]. */
  nachylenieDeg: number | null
  /** Azymut, w który patrzą panele [°]: N = 0, E = 90, S = 180, W = 270. */
  azymutDeg: number | null
  /** Moc zainstalowana [kWp] = liczba paneli × moc panelu. */
  mocKwp: number | null
  /** Współczynnik sprawności instalacji PR [-] wpisany przez użytkownika (brak wartości domyślnej). */
  pr: number | null
  /** Albedo gruntu 0–1; brak = wartość domyślna silnika nasłonecznienia. */
  albedo?: number
  /** Godzinowy typowy rok meteorologiczny (TMY) — bez niego pokazujemy tylko energię przy czystym niebie. */
  daneGodzinowe?: RekordGodzinowy[]
}
