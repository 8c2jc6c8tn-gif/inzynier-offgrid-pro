/**
 * Stałe Ekranu 2 (Typ montażu). Progi kątowe — 1:1 ze źródła
 * (`docs/zrodla/Tresc_Modul_3_PV_Ekrany.md`, Ekran 2), nie współczynniki projektowe.
 */

/** Tryb "Dach płaski / grunt": "Ryzyko zalegania śniegu rośnie przy kątach <30°". */
export const PROG_ZALEGANIA_SNIEGU_DEG = 30

/**
 * Tryb "Dach płaski / grunt": 🔴 "przy kącie ~45° na gruncie: siła ssania od spodu może zerwać
 * panele". Źródło pisze "~45°" — przyjmujemy 45° jako próg (jawne w `assumptions`).
 */
export const PROG_SSANIA_OD_SPODU_DEG = 45

/** Tryb "Wiata/carport": "minimalny kąt 5-10° dla samooczyszczania" — zakres, nie jedna liczba. */
export const WIATA_KAT_SAMOOCZYSZCZANIA_MIN_DEG = 5
export const WIATA_KAT_SAMOOCZYSZCZANIA_MAX_DEG = 10

/** Kąt pionowy — tryb "Pionowy" porównuje wiersz 90° tabeli napromieniowania. */
export const KAT_PIONU_DEG = 90

/** Tolerancja zaokrąglenia przy podziale długości (0,3/0,1 w liczbach zmiennoprzecinkowych ≠ 3). */
export const EPS_PODZIALU = 1e-9

export const LICZBA_MIESIECY = 12
