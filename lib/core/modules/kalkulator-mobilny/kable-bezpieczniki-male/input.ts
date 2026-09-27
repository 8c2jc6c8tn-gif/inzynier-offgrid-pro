import type { SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"

/**
 * Ekran 2 (dawne 8.2, 8.10) i Ekran 15 (dawne 8.13, 8.49), Moduł 12 "Szybki kalkulator / tryb mobilny"
 * — dobór przekroju i bezpiecznika dla małej instalacji 12/24 V (`Tresc_Modul_12`: „uproszczona wersja
 * silnika z Modułu 5, Ekran 1”). Ekran 15 = ta sama logika dla pojazdu/kampera.
 */

export type KableBezpiecznikiMaleInput = {
  /** Prąd obciążenia obwodu IB [A]. 0 = jeszcze nie wpisano. */
  pradA: number
  /** Napięcie instalacji [V]. 0 = jeszcze nie wybrano. */
  napiecieV: 0 | 12 | 24
  /** Długość trasy, jedna strona [m]. 0 = jeszcze nie wpisano. */
  dlugoscTrasyM: number
  sposobUlozenia: SposobUlozenia
  /** Temperatura otoczenia [°C]. null = jeszcze nie wpisano. */
  temperaturaOtoczeniaC: number | null
  /** Liczba kabli w wiązce. 0/1 = brak wiązki. */
  liczbaKabliWWiazce: number
  /** Dopuszczalny spadek napięcia [%]. 0 = jeszcze nie wpisano. */
  dopuszczalnySpadekNapieciaPct: number
  /** „Sprawdź mój przekrój” [mm²]. null = dobór automatyczny. */
  sprawdzanyPrzekrojMm2: number | null
  /** true = instalacja w pojeździe/kamperze (Ekran 15) — dodatkowe informacje o wibracjach i przewodach samochodowych. */
  pojazd: boolean
}
