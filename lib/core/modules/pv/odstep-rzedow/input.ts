import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

/**
 * Wejście kalkulatora odstępu rzędów. `null` = pole niewypełnione (bez wartości domyślnych): wymagane są współrzędne,
 * nachylenie, azymut, długość stołu wzdłuż spadu i okno projektowe; reszta rozszerza wynik.
 */
export type OdstepRzedowInput = {
  szerokoscGeograficzna: number | null
  dlugoscGeograficzna: number | null
  /** Nachylenie paneli od poziomu [°]. */
  nachylenieDeg: number | null
  /** Azymut, w który patrzą panele [°]: N = 0, E = 90, S = 180, W = 270. */
  azymutDeg: number | null
  /** Długość stołu wzdłuż spadu [m] = wymiar panelu (długi albo krótki bok) × liczba paneli jeden nad drugim. */
  dlugoscWzdluzSpaduM: number | null
  /** Okno „bez cienia” w czasie słonecznym 21 grudnia [godz., ułamki dozwolone], np. 9 do 15. */
  oknoOdH: number | null
  oknoDoH: number | null
  /** Odstęp rzędów, który użytkownik już ma albo planuje [m] (od dolnej krawędzi jednego rzędu do dolnej krawędzi następnego, poziomo). */
  odstepM: number | null
  /** Największa dopuszczalna strata energii zimą [% energii padającej na płaszczyznę]; wynik: najmniejszy odstęp, który ją mieści. */
  docelowaStrataZimaPct: number | null
  /** Liczba rzędów w tablicy; pierwszy (południowy) rząd nie jest zacieniany, więc średnia strata tablicy = strata × (n − 1)/n. */
  liczbaRzedow: number | null
  /** Albedo gruntu 0–1; brak = wartość domyślna silnika nasłonecznienia. */
  albedo?: number
  /** Godzinowy typowy rok meteorologiczny (TMY) — bez niego liczymy tylko geometrię, bez strat energii. */
  daneGodzinowe?: RekordGodzinowy[]
}
