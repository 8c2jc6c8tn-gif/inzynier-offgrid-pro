/**
 * Ekran 1, Moduł 3 "Instalacja PV" — "Kąt pochylenia i azymut" (dawne 2.3, §3.3
 * `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 1281–1297;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 1). Wzorzec D z suwakami. Rozszerzenie D26
 * (`rejestr-decyzji.md`): optymalny kąt dla każdego miesiąca — stelaż z ręczną regulacją kąta.
 *
 * Dwa kroki: ciężka tabela napromieniowania (kąt 0–90° × 12 miesięcy, raz na lokalizację/azymut,
 * w Web Workerze) i lekki kalkulator (suwak kąta, moc, PR — natychmiast, z tabeli).
 */
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

export type TabelaNapromieniowaniaInput = {
  szerokoscGeograficzna?: number
  dlugoscGeograficzna?: number
  /** Godzinowe dane PVGIS TMY (jak Moduł 1, Ekran 4). */
  daneGodzinowe?: RekordGodzinowy[]
  /** Kierunek, w który patrzą panele: N=0, E=90, S=180, W=270 [°]. */
  azymutDeg: number
  /** Albedo gruntu [-]; brak → wartość domyślna Modułu 1 (raportowana w założeniach). */
  albedo?: number
}

/** Wynik kroku ciężkiego — przechowywany przez UI, wejście kroku lekkiego. */
export type TabelaNapromieniowania = {
  azymutDeg: number
  albedo: number
  /** Kąty pochylenia siatki [°] — 0…90 co 1°. */
  katyDeg: number[]
  /** `miesiace[i][m]` — napromieniowanie płaszczyzny o kącie `katyDeg[i]` w miesiącu m (0 = styczeń) [kWh/m²]. */
  miesiace: number[][]
}

export type KatIAzymutInput = {
  tabela: TabelaNapromieniowania | null
  /** Wybrany kąt pochylenia [°]. `null` = nie wybrano. */
  nachylenieDeg: number | null
  /** Moc instalacji [kWp]. 0 = nie wpisano — wtedy tylko napromieniowanie, bez produkcji. */
  mocInstalacjiKwp: number
  /**
   * Współczynnik wydajności instalacji PR [-] (0–1] — wszystkie straty między nasłonecznieniem a
   * energią (temperatura, okablowanie, falownik, zabrudzenie). Źródło go nie podaje — tylko wpis
   * użytkownika (Dyrektywa #1). `null` = nie wpisano.
   */
  wspolczynnikPr: number | null
}
