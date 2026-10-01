/**
 * Moduł 9 "Elektronika / ESP32 / sensoryka" — Ekran 1 "Wybór płytki ESP32" (dawne 11.1;
 * docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md, Biblia v2.0 §9.1). Wzorzec D.
 */

/** Warunki montażu ze źródła (A: "bateria vs zasilanie stałe") plus wariant POE z listy płytek (B). */
export type ZasilaniePlytki = "stale" | "bateria" | "poe"

/** Potrzeby, które wyróżniają płytkę — każda odpowiada cesze z opisu wariantu w źródle (B). */
export type PotrzebaPlytki = "duzoGpio" | "antenaZewnetrzna" | "mocObliczeniowa" | "szybkieAdc"

export type WyborPlytkiInput = Record<PotrzebaPlytki, boolean> & {
  zasilanie: ZasilaniePlytki | null
}
