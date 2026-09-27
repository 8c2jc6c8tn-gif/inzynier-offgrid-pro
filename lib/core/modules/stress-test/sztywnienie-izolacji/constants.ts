import type { MaterialMrozu } from "./input"

/**
 * Najniższa temperatura, jaką materiał znosi bez sztywnienia i pękania [°C] — 1:1 ze źródła
 * (Tresc_Modul_7, Ekran 13, sekcja B): „PVC sztywnieje i pęka poniżej −10°C; XLPE wytrzymuje do
 * −40°C”. Guma: źródło mówi tylko „zachowuje elastyczność”, aluminium: „kurczy się i może poluzować
 * połączenia” — bez liczby, więc null (Dyrektywa #1).
 */
export const MIN_TEMPERATURA_MATERIALU_C: Record<MaterialMrozu, number | null> = {
  PVC: -10,
  XLPE: -40,
  guma: null,
  aluminium: null,
}
