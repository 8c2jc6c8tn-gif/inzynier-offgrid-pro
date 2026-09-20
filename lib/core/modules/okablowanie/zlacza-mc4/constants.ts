/**
 * Lista producentów/rodzin złączek MC4 do wyboru (Sekcja A źródła: "lista rozwijana z bazy
 * komponentów"). Ten projekt nie ma jeszcze pełnej bazy komponentów (§15.2 Zasad UX) — lista
 * ograniczona do rozpoznawalnych, powszechnie sprzedawanych rodzin złączek, plus jawna opcja
 * "nieznany/inny", żeby nie zmuszać użytkownika do zgadywania z zamkniętej listy.
 */
export const PRODUCENCI_MC4 = [
  "Stäubli (oryginalny MC4)",
  "Amphenol H4",
  "Multi-Contact",
  "Weidmüller",
  "Renhotec",
  "Inny / nieznany",
] as const

export type ProducentMc4 = (typeof PRODUCENCI_MC4)[number]
