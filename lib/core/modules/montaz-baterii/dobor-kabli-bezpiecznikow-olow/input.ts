import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"

/**
 * Ekran B5, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Dobór kabli,
 * bezpieczników i zabezpieczeń" (dawne 10.5,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md). Wzorzec D.
 */

export type DoborKabliBezpiecznikowOlowInput = {
  /** Prąd ładowania/rozładowania [A]. 0 = jeszcze nie wpisano. */
  pradA: number
  /** Napięcie systemu [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  /** Długość trasy kabla [m]. 0 = jeszcze nie wpisano. */
  dlugoscTrasyM: number
  material: Material
  sposobUlozenia: SposobUlozenia
  /** Temperatura otoczenia [°C]. null = jeszcze nie wpisano. */
  temperaturaOtoczeniaC: number | null
  /** Liczba kabli w wiązce. 0/1 = brak wiązki. */
  liczbaKabliWWiazce: number
  /** Dopuszczalny spadek napięcia [%]. 0 = jeszcze nie wpisano. */
  dopuszczalnySpadekNapieciaPct: number
  /** Opcja "sprawdź mój przekrój". null = silnik dobiera automatycznie. */
  sprawdzanyPrzekrojMm2: number | null
  /** Prąd zwarciowy zestawu kwasowego w tym punkcie [A]. 0 = jeszcze niesprawdzone. */
  pradZwarciowyA: number
  /** Zdolność wyłączania (AIC) wybranego bezpiecznika [A]. 0 = jeszcze niewybrany. */
  aicBezpiecznikaA: number
}
