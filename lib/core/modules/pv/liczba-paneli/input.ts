/**
 * Ekran 4, Moduł 3 "Instalacja PV" — Symulacja liczby paneli (dawne 2.10,
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 4). Zamiast 3 wariantów źródła — drabinka okresów
 * pokrycia + limit montażowy + deficyt zimowy (D25, `rejestr-decyzji.md`). Pole dodatkowego
 * zapotrzebowania w sezonie grzewczym — odpowiedź właściciela projektu 25.09.2026 ("tak ma być").
 */
import type { TabelaNapromieniowania } from "../kat-i-azymut/input"

export type LiczbaPaneliInput = {
  /** Tabela napromieniowania kąt × miesiąc (krok ciężki M3/E1). */
  tabela: TabelaNapromieniowania | null
  /** Kąt stały [°]; ignorowany, gdy `stelazRegulowany` (wtedy optimum każdego miesiąca, D26). */
  nachylenieDeg: number | null
  stelazRegulowany: boolean
  /** Moc jednego panelu [Wp] (STC). */
  mocPaneluWp: number | null
  /** Powierzchnia jednego panelu [m²] — opcjonalnie, tylko do podania zajmowanej powierzchni. */
  powierzchniaPaneluM2: number | null
  /** PR (0; 1] — wpis użytkownika (źródło nie podaje, Dyrektywa #1). */
  wspolczynnikPr: number | null
  /** Całkowite zapotrzebowanie dobowe [kWh/dzień] (docelowo z Modułu 2). */
  zapotrzebowanieDoboweKwh: number | null
  /** Dodatkowe zapotrzebowanie w sezonie grzewczym [kWh/dzień]; 0 = brak. */
  dodatkoweZimaKwhDzien: number | null
  /** Miesiące sezonu grzewczego (0 = styczeń) — wybiera użytkownik, bez domyślnych. */
  miesiaceGrzewcze: number[]
  /** Ile paneli realnie zmieścisz/zamontujesz [szt.] — podpowiedź 30 (D25, wartość właściciela). */
  limitMontazowy: number | null
}
