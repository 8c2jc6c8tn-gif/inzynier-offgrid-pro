/**
 * Rozwiązywanie klucza tłumaczenia na tekst dla użytkownika — docs/standards/17-i18n.md, 17.2.
 * Wyłącznie warstwa prezentacji wywołuje tę funkcję; jądro logiki domenowej (lib/core) nigdy
 * nie generuje gotowego tekstu, tylko klucz + parametry (Warning.i18nKey/params,
 * CalcResult.Assumption jako `{kod, params}`).
 *
 * Język jako jawny parametr (nie ukryty moduł-globalny) — apka ma SSR, moduł-globalna zmienna
 * "aktualny język" na serwerze przeciekałaby między równoległymi żądaniami różnych użytkowników.
 * Komponenty kliencie: `useTranslate()` z `./language-context` (wiąże język z kontekstu).
 * Komponenty serwerowe: `getServerLanguage()` z `./server-language` + wywołanie `t()` wprost.
 */
import { dictionaries } from "./dictionaries"
import { consoleReporter } from "@/lib/core/reporter"
import type { Language } from "./language"

export function t(language: Language, kod: string, params?: Record<string, string | number>): string {
  const szablon = dictionaries[language][kod]
  if (szablon === undefined) {
    consoleReporter.reportError({
      userMessage: "Brak tłumaczenia dla części komunikatu.",
      technicalDetails: `Brak klucza "${kod}" w słowniku "${language}" — sprawdź, czy moduł został poprawnie zmigrowany (docs/standards/17-i18n.md, 17.1: brakujący klucz nigdy nie jest cichym fallbackiem).`,
      source: "lib/i18n/t",
    })
    return `⚠ [${kod}]`
  }
  if (!params) return szablon
  return szablon.replace(/\{(\w+)\}/g, (dopasowanie, nazwa: string) => (nazwa in params ? String(params[nazwa]) : dopasowanie))
}
