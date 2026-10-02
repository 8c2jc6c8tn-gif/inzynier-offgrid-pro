/**
 * stale-rozne — screen text of engine constants whose Polish labels stay in the engine (domain does not import
 * from UI): UPS critical-device catalog, bifacial ground-surface types, IP-rating options of the small-installation
 * screens and the demontaż-pakietu equipment line (battery technologies: see stale-baterie.ts). Screens map the `id`
 * (or IP `kod`) of the constant to one of these keys.
 */
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

export const en: Record<keyof typeof pl, string> = {
  "UI-STALE-UPS-ESP32": "ESP32 (controller)",
  "UI-STALE-UPS-ROUTER": "Router",
  "UI-STALE-UPS-SILOWNIKI": "Door actuators / electromagnetic locks",
  "UI-STALE-UPS-CENTRALA-POZAROWA": "Fire alarm control panel",
  "UI-STALE-UPS-OSWIETLENIE-AWARYJNE": "Emergency lighting",

  "UI-STALE-BIFACJ-BIALA-MEMBRANA": "White membrane",
  "UI-STALE-BIFACJ-JASNY-BETON": "Light concrete",
  "UI-STALE-BIFACJ-PIASEK": "Sand",
  "UI-STALE-BIFACJ-TRAWA": "Grass",

  "UI-STALE-IP-20": "IP20 — basic, dry indoor",
  "UI-STALE-IP-54": "IP54 — limited dust, splashing water",
  "UI-STALE-IP-55": "IP55 — limited dust, water jets",
  "UI-STALE-IP-65": "IP65 — dust-tight, water jets",
  "UI-STALE-IP-66": "IP66 — dust-tight, powerful water jets",
  "UI-STALE-IP-67": "IP67 — dust-tight, temporary immersion",
  "UI-STALE-IP-68": "IP68 — dust-tight, continuous immersion",


  "UI-STALE-DEMPAK-WYPOSAZENIE": "Required: insulated tools, protective gloves, safety glasses, a non-conductive surface.",
}

export const ru: Record<keyof typeof pl, string> = {
  "UI-STALE-UPS-ESP32": "ESP32 (контроллер)",
  "UI-STALE-UPS-ROUTER": "Роутер",
  "UI-STALE-UPS-SILOWNIKI": "Приводы дверей / электромагнитные замки",
  "UI-STALE-UPS-CENTRALA-POZAROWA": "Пожарная приёмно-контрольная панель",
  "UI-STALE-UPS-OSWIETLENIE-AWARYJNE": "Аварийное освещение",

  "UI-STALE-BIFACJ-BIALA-MEMBRANA": "Белая мембрана",
  "UI-STALE-BIFACJ-JASNY-BETON": "Светлый бетон",
  "UI-STALE-BIFACJ-PIASEK": "Песок",
  "UI-STALE-BIFACJ-TRAWA": "Трава",

  "UI-STALE-IP-20": "IP20 — базовая, сухое помещение",
  "UI-STALE-IP-54": "IP54 — ограниченная пыль, брызги воды",
  "UI-STALE-IP-55": "IP55 — ограниченная пыль, струи воды",
  "UI-STALE-IP-65": "IP65 — пыленепроницаемая, струи воды",
  "UI-STALE-IP-66": "IP66 — пыленепроницаемая, сильные струи воды",
  "UI-STALE-IP-67": "IP67 — пыленепроницаемая, кратковременное погружение",
  "UI-STALE-IP-68": "IP68 — пыленепроницаемая, длительное погружение",


  "UI-STALE-DEMPAK-WYPOSAZENIE": "Требуется: изолированный инструмент, защитные перчатки, очки, непроводящее основание.",
}
