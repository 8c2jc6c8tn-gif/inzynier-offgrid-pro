import type { AuditKategoria } from "./input"

/**
 * Categories of checked elements, 1:1 with the source (docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md,
 * Ekran 11): smoke detectors, presence and condition of extinguishers, clear escape routes, correct
 * response of fire dampers, history of tests and inspections. The list of items itself is the user's
 * (entered after their own inspection) until Modules 8/9/13 feed it live — no sample data here
 * (owner decision 06.10.2026, docs/memory.md).
 */
export const AUDIT_KATEGORIE: { id: AuditKategoria; labelKey: string }[] = [
  { id: "czujniki-dymu", labelKey: "AUDYT-KAT-CZUJNIKI-DYMU" },
  { id: "gasnice", labelKey: "AUDYT-KAT-GASNICE" },
  { id: "drogi-ewakuacyjne", labelKey: "AUDYT-KAT-DROGI-EWAKUACYJNE" },
  { id: "klapy-pozarowe", labelKey: "AUDYT-KAT-KLAPY-POZAROWE" },
  { id: "przeglady", labelKey: "AUDYT-KAT-PRZEGLADY" },
]

export function kategoriaKey(kategoria: AuditKategoria): string {
  return AUDIT_KATEGORIE.find((k) => k.id === kategoria)!.labelKey
}
