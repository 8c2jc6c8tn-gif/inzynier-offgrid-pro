/**
 * Realny zakres napięcia akumulatora 12 V wg `Tresc_Modul_12` (Ekran 27, Sekcja A/B): 11 V
 * (rozładowany) – 14,5 V (ładowanie). ✏️ Biblia §12.42 podaje górną granicę 14,6 V — rozbieżność
 * odnotowana w docs/memory.md (27.09.2026), wartość z pliku ekranów, do decyzji właściciela.
 */
export const NAPIECIE_AKU_12V_MIN_V = 11
export const NAPIECIE_AKU_12V_MAX_V = 14.5
