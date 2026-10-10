/**
 * Porównywarka paneli PV (D81, Etap A1) — typy wejścia. Dane panelu wyłącznie z karty katalogowej / naklejki / od
 * użytkownika: brak parametru = `null` (kryterium „nie do porównania”), nigdy „typowa” wartość technologii.
 * Zakres A1: parametry potrzebne silnikowi uzysku, wyceny i gwiazdek. Wymiary, masa i dane elektryczne dojdą w A2/A3.
 */
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import type { EkspozycjaTerenu, StrefaSniegowa } from "@/lib/core/modules/pv/eurokod-1/snieg"
import type { KategoriaTerenu, StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import type { KryteriumId } from "./constants"

/**
 * Dane elektryczne panelu w STC z tabeli karty (A3). Każde pole z karty; brak czytelnej wartości = `null` (bez „typowej” wartości).
 * Vmp w najgorętszych warunkach nie jest liczone: karty nie podają współczynnika temperaturowego Vmp.
 */
export type DaneElektryczne = {
  /** Napięcie jałowe w STC [V]. */
  vocV: number
  /** Napięcie w punkcie mocy maksymalnej w STC [V]. */
  vmpV: number
  /** Prąd zwarciowy w STC [A]. */
  iscA: number
  /** Prąd w punkcie mocy maksymalnej w STC [A]. */
  impA: number
  /** Współczynnik temperaturowy Voc β [%/°C] (ujemny). */
  betaVocPctNaC: number
  /** Maksymalne napięcie układu DC z karty [V]. */
  maxNapieciaSystemuV: number
  /** Maksymalny prąd bezpiecznika szeregowego z karty (I_MOD_MAX_OCPR) [A]; `null` = karta nie podaje. */
  maxBezpiecznikSzeregowyA: number | null
}

/**
 * Maksymalne obciążenie mechaniczne panelu z karty [Pa] (statyczne, prostopadle do powierzchni). `rodzaj`: „testowe” = wartość badana wg
 * IEC 61215 (obliczeniowa to 1/1,5 tej liczby — tak podaje karta JA Solar JAM54D40 LR: 3600/1600 Pa przy współczynniku bezpieczeństwa 1,5, czyli
 * 5400/2400 Pa testowe); „obliczeniowe” = karta podaje już wartość obliczeniową. Brak liczby na karcie = brak obiektu (`null`), nigdy „typowa” wartość.
 */
export type ObciazeniePaneluKarta = {
  /** Od strony przedniej (docisk: śnieg, nawietrzna strona wiatru) [Pa]. */
  przodPa: number
  /** Od strony tylnej (odrywanie: ssanie wiatru) [Pa]; `null` = karta nie podaje. */
  tylPa: number | null
  /** Gdy karta podaje osobno niższą wartość dla wiatru od przodu niż dla śniegu (Trina: śnieg 5400, wiatr 4000) [Pa]; brak = jak `przodPa`. */
  wiatrPrzodPa?: number | null
  rodzaj: "testowe" | "obliczeniowe"
}

/**
 * Warunki obciążenia śniegiem i wiatrem miejsca (Eurokod 1: PN-EN 1991-1-3 i 1991-1-4 z załącznikami krajowymi). Strefy i wysokość wpisuje użytkownik
 * (aplikacja nie wyznacza stref z mapy). `null` = nie wpisano; brak pola wyłącza tylko to, co od niego zależy (śnieg albo wiatr).
 */
export type WarunkiObciazen = {
  strefaSniegowa: StrefaSniegowa | null
  strefaWiatrowa: StrefaWiatrowa | null
  /** Wysokość miejsca nad poziomem morza [m] — dla stref obu norm i ψ0 śniegu. */
  wysokoscNpmM: number | null
  kategoriaTerenu: KategoriaTerenu | null
  /** Wysokość górnej krawędzi paneli nad gruntem [m] (wysokość odniesienia wiatru ze = h, 7.3 (8)). */
  wysokoscKonstrukcjiM: number | null
  ekspozycjaSniegu: EkspozycjaTerenu
  /** Wiatr wg Tablicy 7.6 (wiata jednospadowa) dotyczy tylko paneli pochylonych na konstrukcji; panele równoległe do połaci/ściany — poza zakresem. */
  montaz: "rownolegly" | "pochylony-na-konstrukcji"
}

export type DanePanelu = {
  id: string
  /** Producent i model jednym tekstem, tak jak na karcie (nazwa pokazywana na ekranie). */
  nazwa: string
  /** Moc maksymalna w STC [W]. */
  pmaxW: number
  /** Cena brutto za sztukę [zł] — pole wymagane do części „zł” (U6); `null` = nie wpisano. */
  cenaBruttoZl: number | null
  /** Współczynnik temperaturowy mocy γ [%/°C] (zwykle ujemny); `null` = karta nie podaje. */
  gammaPctNaC: number | null
  /** NOCT [°C]; `null` = karta nie podaje. */
  noctC: number | null
  /** Sprawność względna przy 200 W/m² [% sprawności w STC]; `null` = karta nie podaje. */
  sprawnoscWzglednaPrzy200WPct: number | null
  /** Degradacja w pierwszym roku [%] (z gwarancji — górna granica, nie oczekiwanie); `null` = brak. */
  degradacjaPierwszyRokPct: number | null
  /** Degradacja liniowa w kolejnych latach [%/rok] (z gwarancji — górna granica); `null` = brak. */
  degradacjaLiniowaPctNaRok: number | null
  /** Wymiary zewnętrzne z karty [mm] (dłuższy bok, krótszy bok); `null` = karta nie podaje → bez liczenia paneli z wymiarów miejsca. */
  dlugoscMm: number | null
  szerokoscMm: number | null
  /** Masa modułu z karty [kg]; `null` = karta nie podaje. */
  masaKg: number | null
  /** Panel dwustronny — A1 liczy tylko stronę przednią (jawne w założeniach). */
  bifacjalny: boolean
  /** Dane elektryczne w STC (A3); brak pola albo `null` = nie wpisano / karta nie podaje → bez oceny napięć i stringów. */
  elektryka?: DaneElektryczne | null
  /** Obciążenie mechaniczne z karty (spec 32); brak pola albo `null` = karta nie podaje → bez porównania z Eurokodem. */
  obciazenie?: ObciazeniePaneluKarta | null
}

export type MiejsceInput = {
  /** Nachylenie od poziomu [°]: 0 — płasko, 90 — pionowo. */
  nachylenieDeg: number
  /** Azymut [°]: N = 0, E = 90, S = 180, W = 270. */
  azymutDeg: number
  /** Albedo gruntu [-]; brak → wartość domyślna istniejącego silnika (`ALBEDO_DOMYSLNE`). */
  albedo?: number
}

/** Okno taniej strefy taryfy dwustrefowej w czasie urzędowym Polski [godziny 0–24]; `odH > doH` = okno przez północ (22–6). */
export type OknoStrefy = { odH: number; doH: number }

/** Skąd bierzemy wartość 1 kWh (U2, decyzja B: taryfa dzienna i nocna z godzinami stref wpisanymi przez użytkownika). */
export type WycenaKwh =
  | { rodzaj: "siec"; zlKwh: number }
  | { rodzaj: "dzienNoc"; zlKwhDzien: number; zlKwhNoc: number; oknaTanie: OknoStrefy[] }
  | { rodzaj: "reczna"; zlKwh: number }
  | { rodzaj: "agregat"; mocKw: number; obciazeniePct: number; zuzycieLH: number; cenaPaliwaZlL: number }

/**
 * Wymiary miejsca na panele równoległe do powierzchni (połać dachu, ściana, ogrodzenie) — z nich silnik liczy, ile sztuk każdego
 * panelu się mieści (A2). Marginesy brzegowe wpisuje użytkownik (bez wartości domyślnej); odstępów między panelami nie ma
 * (`TM-ZALOZENIE-BEZ-SZCZELIN` istniejącego silnika pakowania).
 */
export type WymiaryMiejsca = {
  /** Wymiary użytkowe powierzchni [m]; kolejność bez znaczenia (silnik próbuje obu orientacji panelu). */
  dlugoscM: number
  szerokoscM: number
  /** Margines od każdej krawędzi [m]; 0 = wpisano zero. */
  marginesM: number
  /**
   * `rownolegly` — panele leżą w płaszczyźnie powierzchni (nie zacieniają się rzędami). `pochylony-na-konstrukcji` — panele
   * pochylone na gruncie/płaskim dachu: rzędy stoją w odstępie bez cienia w oknie `oknoOdH…oknoDoH` (moduł „odstęp rzędów”).
   */
  montaz: "rownolegly" | "pochylony-na-konstrukcji"
  /**
   * Okno „bez cienia” 21 grudnia w czasie słonecznym [godz.] — tylko dla montażu pochylonego; brak = domyślne okno
   * modułu odstępu rzędów (praktyka projektowa, nie norma).
   */
  oknoOdH?: number
  oknoDoH?: number
}

export type KryteriaWybor = Record<KryteriumId, boolean>

/** Etap A5 (spec 34): bateria do bilansu godzinowego. Pojemność użyteczna z ekranu baterii albo wpisana (0 = bez baterii); sprawność cyklu [0–1], `null` = nie podano. */
export type BilansGodzinowyInput = {
  pojemnoscKwh: number
  sprawnoscCyklu: number | null
  /** Cel: jaką część zużycia zimowego (XI–II) mają pokryć panele [%, (0–100]]; `null`/brak = bez doboru liczby paneli. */
  celZimyPct?: number | null
}

export type PorownywarkaInput = {
  szerokoscGeograficzna?: number
  dlugoscGeograficzna?: number
  daneGodzinowe?: RekordGodzinowy[]
  miejsce: MiejsceInput | null
  /** Liczba paneli na miejscu, jeśli użytkownik ją zna — wtedy ta sama dla każdego modelu. `null` + `wymiaryMiejsca` = liczba z pakowania, osobno dla każdego panelu (A2). */
  liczbaPaneli: number | null
  wymiaryMiejsca?: WymiaryMiejsca | null
  /** Zapotrzebowanie na energię w miesiącach [kWh], styczeń pierwszy (z ekranu „Moje zużycie miesięcznie”); `null` = tryb „suchy” (7.2). */
  zapotrzebowanieMiesiaceKwh?: number[] | null
  panele: DanePanelu[]
  /** Najniższa temperatura powietrza w miejscu [°C] do napięcia stringów zimą (A3); wpisuje użytkownik (TMY nie jest temperaturą projektową); `null` = nie podano. */
  tminC?: number | null
  /** Warunki obciążenia śniegiem i wiatrem do porównania z nośnością paneli (spec 32); brak albo `null` = nie wpisano. */
  obciazenia?: WarunkiObciazen | null
  /** Bateria do bilansu godzinowego (A5); brak albo `null` = bilansu nie liczymy (wymaga też zapotrzebowania miesięcznego). */
  bilansGodzinowy?: BilansGodzinowyInput | null
  /** `null` = bez wyceny (tryb „suchy”: sama produkcja). */
  wycena: WycenaKwh | null
  kryteria: KryteriaWybor
}
