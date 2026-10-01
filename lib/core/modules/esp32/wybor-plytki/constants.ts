import type { PotrzebaPlytki, ZasilaniePlytki } from "./input"

/** Cecha płytki — 1:1 z opisu wariantu w źródle (Tresc_Modul_9, Ekran 1, B; Biblia §9.1). */
export type CechaPlytki = PotrzebaPlytki | "maleZuzycie" | "zasilaniePoe"

export type PlytkaEsp32 = { id: string; cechy: readonly CechaPlytki[] }

/**
 * Warianty ze źródła: DevKit V1 (klasyczny, dużo GPIO), WROOM-32U (lepsze Wi-Fi, gniazdo U.FL na antenę zewnętrzną),
 * S3 (więcej mocy, szybsze ADC), C3 (małe zużycie, RISC-V), POE (zasilanie przez Ethernet). Bez cech spoza źródła.
 */
export const PLYTKI_ESP32: readonly PlytkaEsp32[] = [
  { id: "devkit-v1", cechy: ["duzoGpio"] },
  { id: "wroom-32u", cechy: ["antenaZewnetrzna"] },
  { id: "s3", cechy: ["mocObliczeniowa", "szybkieAdc"] },
  { id: "c3", cechy: ["maleZuzycie"] },
  { id: "poe", cechy: ["zasilaniePoe"] },
]

export const POTRZEBY_PLYTKI: readonly PotrzebaPlytki[] = ["duzoGpio", "antenaZewnetrzna", "mocObliczeniowa", "szybkieAdc"]

/** Zasilanie → cecha płytki: bateria wymaga małego zużycia (C3), POE — zasilania przez Ethernet; stałe — nic. */
export const CECHA_ZASILANIA: Record<ZasilaniePlytki, CechaPlytki | null> = {
  stale: null,
  bateria: "maleZuzycie",
  poe: "zasilaniePoe",
}
