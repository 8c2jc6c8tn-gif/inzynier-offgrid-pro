/**
 * Progi tabeli limitów C-rate. Zakaz ładowania poniżej 0 °C (decyzja właściciela 29.10.2026, jedna reguła w całej
 * aplikacji zgodna z Biblią §2.15 i ekranem okna słonecznego); wcześniejszy przedział −10…0 °C z 0,1 C został
 * usunięty. Pozostałe progi — dane 1:1 ze źródła.
 */
export const PROG_BLOKADY_C = 0
export const PROG_LUKI_GORNY_C = 5
export const PROG_PELNEGO_PRADU_C = 10

export const LIMIT_C_RATE_CHLODNO = 0.2
