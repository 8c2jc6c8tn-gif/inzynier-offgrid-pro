/**
 * Ostrzeżenia i założenia modułu zmigrowanego do i18n (17.2: `{kod, params}`) → tekst PL dla
 * modelu językowego. Narzędzie AI jest dla modelu warstwą prezentacji: surowy kod
 * ("SKANER-ZALOZENIE-UKLAD-LOKALNY") nic mu nie mówi, a model nie może zgadywać jego treści.
 * Język PL — system prompt asystenta (pytaj-asystenta.ts) jest po polsku.
 */
import type { Assumption, Warning } from "@/lib/core/calc-result"
import { t } from "@/lib/i18n/t"

export function tekstyOstrzezen(warnings: Warning[]): string[] {
  return warnings.map((w) => (w.message ?? t("pl", w.i18nKey ?? w.code, w.params)))
}

export function tekstyZalozen(assumptions: Assumption[]): string[] {
  return assumptions.map((a) => (typeof a === "string" ? a : t("pl", a.kod, a.params)))
}
