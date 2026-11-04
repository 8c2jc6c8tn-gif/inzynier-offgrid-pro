// Russian texts of ./stale-rozne.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./stale-rozne"

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
