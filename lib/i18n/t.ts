/**
 * Rozwiązywanie klucza tłumaczenia na tekst dla użytkownika — docs/standards/17-i18n.md, 17.2.
 * Wyłącznie warstwa prezentacji wywołuje tę funkcję; jądro logiki domenowej (lib/core) nigdy
 * nie generuje gotowego tekstu, tylko klucz + parametry (Warning.i18nKey/params,
 * CalcResult.Assumption jako `{kod, params}`).
 *
 * Język jako jawny parametr (nie ukryty moduł-globalny) — moduł-globalna zmienna "aktualny
 * język" przeciekałaby między niezależnymi wywołaniami. Komponenty kliencie: `useTranslate()`
 * z `./language-context` (wiąże język z kontekstu, docs/standards/17-i18n.md 17.4 — korekta
 * offline-first: kontekst czyta `localStorage` przez `./storage`, zero cookie/serwera). Server
 * Components nie renderują dziś tłumaczonego tekstu wprost (jedyny taki przypadek,
 * app/kalkulatory/prognozy/page.tsx, został wydzielony do Client Component, docs/memory.md).
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
  return podstaw(language, szablon, rozwinKlucze(language, params))
}

/**
 * Konwencja `*Key` (docs/standards/17-i18n.md): parametr `xKey` niesie KLUCZ tłumaczenia, nie
 * gotowy tekst — silnik podaje np. `labelKey: "POLE-ALBEDO"`, szablon używa `{label}`. Klucz jest
 * rozwiązywany w języku UI tutaj, więc domena nigdy nie osadza polskiej etykiety w `params`.
 */
function rozwinKlucze(language: Language, params?: Record<string, string | number>) {
  if (!params) return params
  const jestKluczem = (n: string) => n.length > 3 && n.endsWith("Key")
  const zwykle = Object.fromEntries(Object.entries(params).filter(([n]) => !jestKluczem(n)))
  const szablony = Object.entries(params)
    .filter((e): e is [string, string] => jestKluczem(e[0]) && typeof e[1] === "string")
    .map(([nazwa, kod]) => [nazwa.slice(0, -3), t(language, kod)] as const)
  // Pass 1: sibling params fill each label's own placeholders (e.g. „Powierzchnia ({przegroda})”, „przegroda {nr}”).
  const pierwsze = Object.fromEntries(szablony.map(([cel, szablon]) => [cel, podstaw(language, szablon, zwykle)]))
  // Pass 2: one level of nesting — a label may reference another resolved key, e.g. `labelKey` „Powierzchnia
  // ({przegroda})” + `przegrodaKey` „przegroda {nr}” for an element the user left unnamed.
  const kontekst = { ...zwykle, ...pierwsze }
  const wynik: Record<string, string | number> = { ...params }
  for (const [cel, szablon] of szablony) wynik[cel] = podstaw(language, szablon, kontekst)
  return wynik
}

/** Fills `{name}` placeholders (`{waluta}` defaults to „zł” — Polish-market texts; generic screens pass the chosen currency symbol) — shared by `t()` and the help content (`components/ui/pomoc.tsx`). */
export function podstaw(language: Language, szablon: string, params?: Record<string, string | number>): string {
  const wszystkie: Record<string, string | number> = { waluta: "zł", ...params }
  return szablon.replace(/\{(\w+)\}/g, (dopasowanie, nazwa: string) =>
    nazwa in wszystkie ? formatujParametr(language, wszystkie[nazwa]!) : dopasowanie,
  )
}

/** Separator dziesiętny wg języka UI — PL i RU piszą „1,5”, EN „1.5”. */
const SEPARATOR_DZIESIETNY: Record<Language, string> = { pl: ",", en: ".", ru: "," }

/**
 * Domena przekazuje liczby jako `number` albo gotowy tekst z `toFixed()` („1.50”) — obie formy
 * dostają separator języka. Tylko sam separator: bez grupowania tysięcy i bez zaokrąglania
 * (precyzję wybiera domena). Tekst, który nie jest w całości liczbą dziesiętną (nazwy, listy
 * „1, 2, 12”), zostaje bez zmian.
 */
function formatujParametr(language: Language, wartosc: string | number): string {
  const tekst = String(wartosc)
  if (typeof wartosc === "number" || /^-?\d+\.\d+$/.test(tekst)) {
    return tekst.replace(".", SEPARATOR_DZIESIETNY[language])
  }
  return tekst
}
