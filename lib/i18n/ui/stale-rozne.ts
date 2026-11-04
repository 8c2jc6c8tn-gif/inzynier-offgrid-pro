/**
 * stale-rozne — screen text of engine constants whose Polish labels stay in the engine (domain does not import
 * from UI): UPS critical-device catalog, bifacial ground-surface types, IP-rating options of the small-installation
 * screens and the demontaż-pakietu equipment line (battery technologies: see stale-baterie.ts). Screens map the `id`
 * (or IP `kod`) of the constant to one of these keys.
 */
// English: ./stale-rozne.en.ts, Russian: ./stale-rozne.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-STALE-UPS-ESP32": "ESP32 (kontroler)",
  "UI-STALE-UPS-ROUTER": "Router",
  "UI-STALE-UPS-SILOWNIKI": "Siłowniki drzwi/zamki elektromagnetyczne",
  "UI-STALE-UPS-CENTRALA-POZAROWA": "Centrala sygnalizacji pożaru",
  "UI-STALE-UPS-OSWIETLENIE-AWARYJNE": "Oświetlenie awaryjne",

  "UI-STALE-BIFACJ-BIALA-MEMBRANA": "Biała membrana",
  "UI-STALE-BIFACJ-JASNY-BETON": "Jasny beton",
  "UI-STALE-BIFACJ-PIASEK": "Piasek",
  "UI-STALE-BIFACJ-TRAWA": "Trawa",

  "UI-STALE-IP-20": "IP20 — podstawowa, wnętrze suche",
  "UI-STALE-IP-54": "IP54 — pył ograniczony, bryzgi wody",
  "UI-STALE-IP-55": "IP55 — pył ograniczony, strugi wody",
  "UI-STALE-IP-65": "IP65 — pyłoszczelna, strugi wody",
  "UI-STALE-IP-66": "IP66 — pyłoszczelna, silne strugi wody",
  "UI-STALE-IP-67": "IP67 — pyłoszczelna, czasowe zanurzenie",
  "UI-STALE-IP-68": "IP68 — pyłoszczelna, ciągłe zanurzenie",


  "UI-STALE-DEMPAK-WYPOSAZENIE": "Wymagane: izolowane narzędzia, rękawice ochronne, okulary, nieprzewodzące podłoże.",
}
