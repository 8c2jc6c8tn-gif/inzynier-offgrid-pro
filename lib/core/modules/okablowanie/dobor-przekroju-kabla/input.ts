import type { Material, SposobUlozenia } from "./constants"

export type DoborPrzekrojuKablaInput = {
  /** Prąd roboczy obwodu (I) [A]. 0 = jeszcze nie wpisano. */
  pradA: number
  /** Napięcie systemowe (U) [V] — DC (12/24/48V) lub AC (230V). 0 = jeszcze nie wpisano. */
  napiecieV: number
  /** Długość trasy (L), jedna strona [m]. 0 = jeszcze nie wpisano. */
  dlugoscTrasyM: number
  material: Material
  sposobUlozenia: SposobUlozenia
  /** Temperatura otoczenia [°C]. null = jeszcze nie wpisano (0°C to legalna wartość). */
  temperaturaOtoczeniaC: number | null
  /** Liczba kabli w wiązce — tylko dla "w_peszlu"/"w_ziemi"/"w_wiazce". 0/1 = brak wiązki. */
  liczbaKabliWWiazce: number
  /** Dopuszczalny spadek napięcia [%] — domyślnie 2% AC / 3% DC w UI, edytowalny. 0 = jeszcze nie wpisano. */
  dopuszczalnySpadekNapieciaPct: number
  /** Opcja "sprawdź mój przekrój" — jeśli podane, silnik ocenia TEN przekrój zamiast dobierać
   *  najmniejszy pasujący. null = brak (silnik dobiera automatycznie). */
  sprawdzanyPrzekrojMm2: number | null
}
