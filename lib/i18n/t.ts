/**
 * Rozwiązywanie klucza tłumaczenia na tekst dla użytkownika — docs/standards/17-i18n.md, 17.2.
 * Wyłącznie warstwa prezentacji wywołuje tę funkcję; jądro logiki domenowej (lib/core) nigdy
 * nie generuje gotowego tekstu, tylko klucz + parametry (Warning.i18nKey/params,
 * CalcResult.Assumption jako `{kod, params}`).
 */
import { dictionaryPl } from "./dictionary-pl"
import { consoleReporter } from "@/lib/core/reporter"

export function t(kod: string, params?: Record<string, string | number>): string {
  const szablon = (dictionaryPl as Record<string, string>)[kod]
  if (szablon === undefined) {
    consoleReporter.reportError({
      userMessage: "Brak tłumaczenia dla części komunikatu.",
      technicalDetails: `Brak klucza "${kod}" w dictionaryPl — sprawdź, czy moduł został poprawnie zmigrowany (docs/standards/17-i18n.md, 17.1: brakujący klucz nigdy nie jest cichym fallbackiem).`,
      source: "lib/i18n/t",
    })
    return `⚠ [${kod}]`
  }
  if (!params) return szablon
  return szablon.replace(/\{(\w+)\}/g, (dopasowanie, nazwa: string) => (nazwa in params ? String(params[nazwa]) : dopasowanie))
}
