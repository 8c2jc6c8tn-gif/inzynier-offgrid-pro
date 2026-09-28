/**
 * Próg „długiego postoju” [dni]. Źródło: Tresc_Modul_7, Ekran 8, sekcja B.3 — „ryzyko po 2+
 * tygodniach bezczynności w mrozie”.
 */
export const DLUGI_POSTOJ_DNI = 14

/** Mróz = temperatura poniżej 0°C (definicja, nie współczynnik). */
export const PROG_MROZU_C = 0

/**
 * Progi rozruchu zwykłego oleju napędowego [°C] — nie z normy ani ze źródła: praktyka właściciela
 * projektu (28.09.2026, `rejestr-decyzji.md` D32), rozstrzyga konflikt źródła (B: −20°C, C: −15°C).
 * Zwykły diesel: 🟡 już od +10°C, 🔴 poniżej +5°C — najprawdopodobniej parafinuje się i nie odpali
 * (doprecyzowanie właściciela 28.09.2026, realia paliwa w Polsce; wcześniej +5°C / 0°C). Zalecenie:
 * paliwo zimowe od +5°C, arktyczne poniżej −10°C. Temperatura to ta w miejscu agregatu i zbiornika —
 * na zewnątrz albo w budynku.
 */
export const DIESEL_ZWYKLY_RYZYKO_C = 10
/** 🔴 when strictly below this value. */
export const DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C = 5

/** Od −10°C każdy diesel potrzebuje naładowanego akumulatora i sprawnych świec żarowych (D32). */
export const DIESEL_ROZRUCH_MROZ_C = -10
