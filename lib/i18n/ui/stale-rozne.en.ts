// English texts of ./stale-rozne.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./stale-rozne"

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
