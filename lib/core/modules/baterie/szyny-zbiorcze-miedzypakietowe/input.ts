import type { Material } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"

/**
 * Ekran 25, Moduł 4 "Magazyn energii / baterie" — "Szyny zbiorcze i połączenia
 * międzypakietowe" (scala dawne 3.28, 3.38, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md).
 * Wzorzec D.
 *
 * Zakres świadomie ograniczony do topologii "gwiazda" (każda gałąź — ogniwo lub pakiet —
 * niezależnym odcinkiem do wspólnej szyny/węzła). NIE modeluje:
 * - połączenia kaskadowego (rezystancja sumuje się wzdłuż łańcucha — inna topologia obwodu,
 *   drugi przykład Sekcji C źródła, "4 baterie połączone kaskadowo"),
 * - asymetrii punktu zasilania wzdłuż JEDNEJ szyny zbiorczej (pierwszy przykład Sekcji C,
 *   "ogniwo #1 vs #8, przesuń kabel na środek szyny" — to rozłożona rezystancja wzdłuż szyny,
 *   inny model obwodu niż N niezależnych gałęzi).
 * Źródło nie podaje wzoru dla żadnej z tych dwóch topologii — tylko dla gwiazdy da się to
 * policzyć wprost prawem Ohma (reguła podziału prądu), bez zgadywania.
 */

export type GalazInput = {
  id: string
  /** Długość odcinka od gałęzi do wspólnej szyny/węzła [m]. 0 = jeszcze nie wpisano. */
  dlugoscM: number
  /** Przekrój przewodu tej gałęzi [mm²]. 0 = jeszcze nie wpisano. */
  przekrojMm2: number
}

export type SzynyZbiorczeMiedzypakietoweInput = {
  /** Całkowity prąd rozpływający się między gałęziami [A]. 0 = jeszcze nie wpisano. */
  pradCalkowityA: number
  material: Material
  galezie: GalazInput[]
}
