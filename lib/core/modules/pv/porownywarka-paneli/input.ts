/**
 * Porównywarka paneli PV (D81, Etap A1) — typy wejścia. Dane panelu wyłącznie z karty katalogowej / naklejki / od
 * użytkownika: brak parametru = `null` (kryterium „nie do porównania”), nigdy „typowa” wartość technologii.
 * Zakres A1: parametry potrzebne silnikowi uzysku, wyceny i gwiazdek. Wymiary, masa i dane elektryczne dojdą w A2/A3.
 */
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import type { KryteriumId } from "./constants"

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
   * pochylone na gruncie/płaskim dachu: cień międzyrzędowy wymaga reguły odstępu, której nie mamy → wynik `INCOMPLETE`.
   */
  montaz: "rownolegly" | "pochylony-na-konstrukcji"
}

export type KryteriaWybor = Record<KryteriumId, boolean>

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
  /** `null` = bez wyceny (tryb „suchy”: sama produkcja). */
  wycena: WycenaKwh | null
  kryteria: KryteriaWybor
}
