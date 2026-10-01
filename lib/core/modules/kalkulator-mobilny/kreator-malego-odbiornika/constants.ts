/**
 * Scenarios of the small-load power wizard — Tresc E12 list, Biblia §12.24.1–8, §12.17–12.19, §12.21, §12.36,
 * §12.40, §12.41, §12.55. Each scenario carries only the NAMES of its typical components (as the Bible lists
 * them) and its own note; powers and hours are always entered by the user (Directive #1).
 */
export type ScenariuszOdbiornika =
  | "oswietlenie-awaryjne"
  | "telefony"
  | "alarm"
  | "brama-wjazdowa"
  | "ogrod"
  | "fontanna"
  | "wentylator"
  | "sterownik-co"
  | "pompka-wodna"
  | "elektronarzedzia"
  | "router-monitoring"
  | "bojler"
  | "praca-zdalna"
  | "lodowka"
  | "kociol-gazowy"
  | "brama-garazowa"

export type DefinicjaScenariusza = {
  id: ScenariuszOdbiornika
  /** i18n keys of typical component names (UI-M12-KZ-S-*). */
  skladniki: string[]
  /** Info-level note code shown with the result (KZ-UWAGA-*). */
  uwaga: string
}

export const SCENARIUSZE: DefinicjaScenariusza[] = [
  { id: "oswietlenie-awaryjne", skladniki: ["UI-M12-KZ-S-LAMPA-LED"], uwaga: "KZ-UWAGA-OSWIETLENIE" },
  { id: "telefony", skladniki: ["UI-M12-KZ-S-TELEFON"], uwaga: "KZ-UWAGA-TELEFONY" },
  { id: "alarm", skladniki: ["UI-M12-KZ-S-CENTRALA", "UI-M12-KZ-S-CZUJKI", "UI-M12-KZ-S-SYGNALIZATOR"], uwaga: "KZ-UWAGA-ALARM" },
  { id: "brama-wjazdowa", skladniki: ["UI-M12-KZ-S-NAPED-BRAMY"], uwaga: "KZ-UWAGA-ROZRUCH-SILNIKA" },
  { id: "ogrod", skladniki: ["UI-M12-KZ-S-LAMPA-OGRODOWA"], uwaga: "KZ-UWAGA-OGROD" },
  { id: "fontanna", skladniki: ["UI-M12-KZ-S-POMPA-FONTANNY"], uwaga: "KZ-UWAGA-FONTANNA" },
  { id: "wentylator", skladniki: ["UI-M12-KZ-S-WENTYLATOR"], uwaga: "KZ-UWAGA-WENTYLATOR" },
  { id: "sterownik-co", skladniki: ["UI-M12-KZ-S-STEROWNIK", "UI-M12-KZ-S-POMPA-OBIEGOWA", "UI-M12-KZ-S-ZAWORY"], uwaga: "KZ-UWAGA-OGRZEWANIE" },
  { id: "pompka-wodna", skladniki: ["UI-M12-KZ-S-POMPKA"], uwaga: "KZ-UWAGA-ROZRUCH-SILNIKA" },
  { id: "elektronarzedzia", skladniki: ["UI-M12-KZ-S-ELEKTRONARZEDZIE"], uwaga: "KZ-UWAGA-ELEKTRONARZEDZIA" },
  { id: "router-monitoring", skladniki: ["UI-M12-KZ-S-ROUTER", "UI-M12-KZ-S-KAMERA", "UI-M12-KZ-S-REJESTRATOR"], uwaga: "KZ-UWAGA-PRACA-CIAGLA" },
  { id: "bojler", skladniki: ["UI-M12-KZ-S-GRZALKA"], uwaga: "KZ-UWAGA-BOJLER" },
  { id: "praca-zdalna", skladniki: ["UI-M12-KZ-S-LAPTOP", "UI-M12-KZ-S-ROUTER"], uwaga: "KZ-UWAGA-PRACA-ZDALNA" },
  { id: "lodowka", skladniki: ["UI-M12-KZ-S-LODOWKA"], uwaga: "KZ-UWAGA-LODOWKA" },
  { id: "kociol-gazowy", skladniki: ["UI-M12-KZ-S-POMPA-OBIEGOWA", "UI-M12-KZ-S-STEROWNIK", "UI-M12-KZ-S-ZAWORY"], uwaga: "KZ-UWAGA-OGRZEWANIE" },
  { id: "brama-garazowa", skladniki: ["UI-M12-KZ-S-NAPED-BRAMY"], uwaga: "KZ-UWAGA-BRAMA-GARAZOWA" },
]
