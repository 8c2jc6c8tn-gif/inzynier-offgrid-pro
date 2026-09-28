/**
 * Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — Ekran 4 "Moduł gaśniczy / elektrozawór gazu — sprzęt
 * i logika AI" (scala dawne 11.52 + 12.51; docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Biblia
 * v2.0 §8.4, §8.9). Wzorzec D. Sprawdzenie konfiguracji — nie sterowanie (warstwa ESP32/M9).
 */

/** Środki z sekcji A (gaz obojętny, mgła wodna, aerozol) + wymienione w przypomnieniu z Modułu 4. */
export type SrodekGasniczy = "gaz-obojetny" | "mgla-wodna" | "aerozol" | "proszek" | "co2" | "specjalny-magazyn-energii"

/** Czy strefa gaśnicza obejmuje magazyn energii — i jakiej chemii. */
export type MagazynWStrefie = "brak" | "lifepo4" | "inna"

export type StanModuluGasniczego = "sprawny" | "rozladowany"

export type ModulGasniczyInput = {
  srodek: SrodekGasniczy | null
  magazynWStrefie: MagazynWStrefie | null
  /** Liczba niezależnych czujników potwierdzających alarm przed uruchomieniem gaszenia. null = nie wpisano. */
  liczbaCzujnikowPotwierdzenia: number | null
  /** Odcięcie wentylacji i zamknięcie klap razem z gaszeniem. Domyślnie false — nigdy ukryty "tak". */
  odcinaWentylacjeIKlapy: boolean
  stanModulu: StanModuluGasniczego | null
}
