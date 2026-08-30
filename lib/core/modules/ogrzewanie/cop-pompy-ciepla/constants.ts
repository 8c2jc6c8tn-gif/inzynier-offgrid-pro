/**
 * Nazwane stałe — zakaz "magicznych liczb" (docs/standards/03-jadro-obliczeniowe.md, 3.2).
 * Zakres COP to sanity check fizycznej wiarygodności (typowe pompy powietrze-woda: 1,5–6),
 * nie norma — realny COP zależy od modelu i temperatury, nie zgadujemy go tutaj.
 */

export const COP_MIN = 0.5
export const COP_MAX = 8

export const MOC_CIEPLNA_KW_MAX = 100
