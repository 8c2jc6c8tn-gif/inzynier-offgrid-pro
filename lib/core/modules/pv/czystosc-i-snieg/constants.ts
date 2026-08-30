/**
 * Nazwane stałe — zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 * Progi kątowe wg źródła: <10° zaleganie, 15-30° spłukiwanie deszczem, >30° zsuwanie się
 * śniegu/liści. Źródło nie definiuje jawnie zakresu 10-15° — traktowany jako przejściowy,
 * nieopisany wprost (patrz warnings.ts, komunikat o luce źródłowej — nie zgadujemy).
 */

export const KAT_ZALEGANIE_MAX = 10
export const KAT_PRZEJSCIOWY_MAX = 15
export const KAT_SPLUKIWANIE_MAX = 30

export const KAT_MIN = 0
export const KAT_MAX = 90

/**
 * Próg rekomendacji mycia paneli — źródło podaje przedział "strata >5-10%", tu użyty jest
 * środek przedziału jako wartość reprezentatywna (jawnie oznaczona w assumptions wyniku).
 */
export const SPADEK_PROG_MYCIA_PCT = 7.5

export const SPADEK_PCT_MIN = 0
export const SPADEK_PCT_MAX = 100
