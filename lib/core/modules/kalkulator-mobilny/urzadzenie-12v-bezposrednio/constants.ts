/**
 * Dolna granica realnego napięcia akumulatora 12 V wg `Tresc_Modul_12` (Ekran 27, Sekcja A/B): 11 V (rozładowany).
 */
export const NAPIECIE_AKU_12V_MIN_V = 11

/**
 * Górna granica przy ładowaniu dla 12 V wg źródeł — tylko jako podpowiedź w UI, nie wartość obliczeniowa:
 * `Tresc_Modul_12` (Ekran 27) 14,5 V, Biblia §12.42 14,6 V. Rozbieżność rozstrzygnięta 28.09.2026 (decyzja
 * właściciela): górna granica to wpis użytkownika z ustawień jego regulatora (`maksNapiecieLadowaniaV`).
 */
export const NAPIECIE_LADOWANIA_12V_TRESC_V = 14.5
export const NAPIECIE_LADOWANIA_12V_BIBLIA_V = 14.6
