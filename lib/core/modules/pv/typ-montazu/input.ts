/**
 * Ekran 2, Moduł 3 "Instalacja PV" — "Typ montażu" (scala dawne 2.4, 2.5, 2.6, 2.7, 2.9;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 2, Wzorzec A z przełącznikiem trybu). Szósty tryb
 * "stelaż regulowany (naziemny)" — świadome rozszerzenie źródła, decyzja D26 (`rejestr-decyzji.md`).
 *
 * Każdy tryb ma osobne wejście i osobny kalkulator. `null` = pole nie wypełnione (brak wartości
 * domyślnych, Dyrektywa #1).
 */
import type { KategoriaTerenu, StrefaWiatrowa } from "../eurokod-1/wiatr"
import type { TabelaNapromieniowania } from "../kat-i-azymut/input"

/** Tryb "Pionowy" (dawne 2.4). */
export type PionowyInput = {
  /** Tabela napromieniowania kąt 0–90° × miesiąc dla azymutu paneli (krok ciężki M3/E1). */
  tabela: TabelaNapromieniowania | null
  /** Wysokość dolnej krawędzi paneli nad gruntem [m]. */
  wysokoscDolnejKrawedziM: number | null
  /** Wysokość trawy lub zasp śniegu w okolicy [cm]. */
  wysokoscTrawySnieguCm: number | null
}

/** Dane wiatru w miejscu montażu — tor PN-EN 1991-1-4 jak w M3/E9 (`../eurokod-1/wiatr.ts`). */
export type DaneWiatruInput = {
  strefaWiatrowa: StrefaWiatrowa | null
  /** Wysokość terenu nad poziomem morza A [m] (Tablica NA.1). */
  wysokoscNpmM: number | null
  kategoriaTerenu: KategoriaTerenu | null
  /** Współczynnik ograniczenia przepływu pod stelażem φ ∈ [0, 1] (7.3 (2)). */
  wspolczynnikPhi: number | null
}

/** Geometria jednego stelaża. */
export type GeometriaStelazaInput = {
  /** Długość pola paneli wzdłuż spadku L [m] — od dolnej do górnej krawędzi. */
  dlugoscWzdluzSpaduM: number | null
  /** Szerokość pola paneli (w poprzek spadku) [m]. Aref = L × szerokość. */
  szerokoscStelazaM: number | null
  /** Wysokość dolnej krawędzi paneli nad terenem [m] (dla dachu — razem z wysokością budynku). */
  wysokoscDolnejKrawedziM: number | null
  /**
   * Masa paneli i stelaża (jednego stelaża, bez balastu) [kg] — z karty katalogowej albo z wagi, nigdy
   * domyślna (D29). Liczona jako siła utrzymująca z γG,inf = 0,90; `null` = pominięta (po stronie bezpiecznej).
   */
  masaPaneliStelazaKg: number | null
}

export type MiejsceMontazu = "grunt" | "dach"

/** Tryb "Dach płaski / grunt" (dawne 2.5). */
export type DachPlaskiInput = DaneWiatruInput &
  GeometriaStelazaInput & {
    miejsce: MiejsceMontazu | null
    /** Kąt nachylenia stelaża α [°]. */
    nachylenieDeg: number | null
  }

/** Jedna powierzchnia oceniona w M1/E4 (orientacja powierzchni) — wejście trybów "Dach skośny"/"Wielopołaciowy". */
export type PowierzchniaOceniona = {
  nazwa: string
  nachylenieDeg: number
  azymutDeg: number
  /** Roczne napromieniowanie płaszczyzny (z zacienieniem, gdy M1 zna horyzont) [kWh/m²]. */
  napromieniowanieRoczneKwhM2: number
  /** Wskaźnik względem optimum lokalizacji [%]. */
  wskaznikProcent: number
}

/** Tryby "Dach skośny" (dawne 2.6, jedna połać) i "Wielopołaciowy" (dawne 2.7, wiele powierzchni). */
export type PowierzchnieInput = {
  /** Wynik M1/E4; `null` = jeszcze nie oceniono. */
  oceny: PowierzchniaOceniona[] | null
  /** Zaznaczone powierzchnie z mocą paneli, które na nich staną [kWp]. */
  wybrane: { nazwa: string; mocKwp: number | null }[]
  wspolczynnikPr: number | null
}

/** Tryb "Wiata/carport" (dawne 2.9). */
export type WiataInput = {
  /** Wymiary prostokątnej połaci wiaty (w płaszczyźnie dachu) [m]. */
  dlugoscM: number | null
  szerokoscM: number | null
  /** Wymiary panelu (dłuższy i krótszy bok) [m]. */
  dlugoscPaneluM: number | null
  szerokoscPaneluM: number | null
  /** Moc jednego panelu [Wp]. */
  mocPaneluW: number | null
  /** Kąt nachylenia dachu wiaty [°]. */
  nachylenieDeg: number | null
}

/** Tryb "Stelaż regulowany (naziemny)" — D26. */
export type RegulowanyInput = DaneWiatruInput &
  GeometriaStelazaInput & {
    tabela: TabelaNapromieniowania | null
    /** Zakres regulacji stelaża [°] — mechaniczne ograniczenie konstrukcji. */
    katMinDeg: number | null
    katMaxDeg: number | null
  }
