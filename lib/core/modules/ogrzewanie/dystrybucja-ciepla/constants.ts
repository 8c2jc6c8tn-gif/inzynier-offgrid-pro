/**
 * Design temperature sets quoted by the source (Tresc_Modul_6, Ekran 13, tryb „Grzejniki
 * niskotemperaturowe”; Biblia §6.18): zasilanie/powrót/pomieszczenie [°C]. Shown in messages only —
 * the engine never derives a radiator size from them (that needs the radiator exponent from
 * PN-EN 442, which is not in the repo — see the calculator comment).
 */
export const PARAMETRY_GRZEJNIKOW_STANDARDOWYCH = "75/65/20"
export const PARAMETRY_GRZEJNIKOW_NISKOTEMPERATUROWYCH = "45/35/20"

/** Floor heating supply temperature range quoted by the source (Ekran 13: „30-35°C”; Biblia §6.13: „30–40°C”). */
export const ZASILANIE_PODLOGOWKI_C = "30–35"
