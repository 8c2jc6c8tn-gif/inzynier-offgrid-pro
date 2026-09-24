/**
 * Ekran 3, Moduł 1 "Lokalizacja i teren" — "Analiza zacienienia (horyzont cieni)" (dawne 0.3,
 * Wzorzec D, docs/zrodla/Tresc_Modul_1_Lokalizacja_Ekrany.md). Architektura: rejestr-decyzji.md D22.
 *
 * Układ współrzędnych lokalny, metryczny (jak wynik Skanera działki, Ekran 2): x — wschód,
 * y — północ, z — w górę, [m]. Wysokości przeszkód liczone od tego samego poziomu odniesienia co
 * `punkt.z` (np. poziom gruntu przy budynku).
 */

import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

export type Punkt3D = { x: number; y: number; z: number }
export type Punkt2D = { x: number; y: number }

/**
 * Drzewo — model: walec o promieniu korony, nieprzezroczysty przez cały rok (założenie
 * konserwatywne, patrz calculator.ts). Źródło: "prognozowana przyszła wysokość rosnących drzew
 * (wprowadzana ręcznie przez użytkownika)" — dlatego prognoza to jedna, ręcznie podana wysokość,
 * nie krzywa wzrostu wymyślona przez aplikację.
 */
export type PrzeszkodaDrzewo = {
  typ: "drzewo"
  nazwa: string
  srodek: Punkt2D
  promienKoronyM: number
  wysokoscM: number
  /** Wysokość prognozowana przez użytkownika za `latPrognozy` lat (opcjonalna). */
  wysokoscPrognozowanaM?: number
}

/** Bryła (sąsiedni budynek, ściana, skarpa) — graniastosłup o obrysie wielokąta i stałej wysokości. */
export type PrzeszkodaBryla = {
  typ: "bryla"
  nazwa: string
  obrys: Punkt2D[]
  wysokoscM: number
}

export type Przeszkoda = PrzeszkodaDrzewo | PrzeszkodaBryla

export type AnalizaZacienieniaInput = {
  szerokoscGeograficzna?: number
  dlugoscGeograficzna?: number
  /** Punkt analizy (np. środek pola paneli), w tym jego wysokość nad poziomem odniesienia. */
  punkt?: Punkt3D
  /** Płaszczyzna paneli: nachylenie od poziomu [°]. */
  nachyleniePowierzchniDeg?: number
  /** Płaszczyzna paneli: azymut, w który "patrzy" (N=0, E=90, S=180, W=270) [°]. */
  azymutPowierzchniDeg?: number
  przeszkody?: Przeszkoda[]
  /** Horyzont prognozy wzrostu drzew [lata] — tylko etykieta scenariusza, nie parametr modelu. */
  latPrognozy?: number
  /**
   * Godzinowe dane PVGIS TMY (te same co Ekran 4). Podane → strata CAŁKOWITEGO napromieniowania
   * (model Muneera, rzeczywiste zachmurzenie); brak → wariant zapasowy offline: strata promieniowania
   * bezpośredniego przy bezchmurnym niebie (TD14, decyzja właściciela 24.09.2026).
   */
  daneGodzinowe?: RekordGodzinowy[]
}
