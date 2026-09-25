/**
 * Ekran 20, Moduł 3 "Instalacja PV" — "Orientacja wschód-zachód" (dawne 2.35, §3.35
 * `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 2049–2071;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 20). Wzorzec D. Krok ciężki (Web Worker) liczy
 * nasłonecznienie obu połaci i południa pod najlepszym kątem; krok lekki łączy je wg udziału mocy.
 */
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

export type Polac = { nachylenieDeg: number; azymutDeg: number }

export type DaneWschodZachodInput = {
  szerokoscGeograficzna?: number
  dlugoscGeograficzna?: number
  daneGodzinowe?: RekordGodzinowy[]
  wschod: Polac
  zachod: Polac
  albedo?: number
}

/** Wynik kroku ciężkiego [kWh/m²]. */
export type DaneWschodZachod = {
  wschod: Polac & { miesiace: number[]; doba: number[] }
  zachod: Polac & { miesiace: number[]; doba: number[] }
  /** Odniesienie: południe (180°) pod najlepszym kątem stałym dla tej lokalizacji. */
  poludnie: Polac & { miesiace: number[]; doba: number[] }
  albedo: number
}

export type WschodZachodInput = {
  dane: DaneWschodZachod | null
  /** Udział mocy paneli na połaci wschodniej [%]; reszta na zachodniej. `null` = nie wpisano. */
  udzialWschodPct: number | null
}
