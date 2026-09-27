"use client"

import type { Assumption, Warning } from "@/lib/core/calc-result"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * Trzy listy, które CalcResult niesie razem z wynikiem — założenia/ostrzeżenia/wzór — renderowane
 * identycznie wewnątrz WerdyktPanel na większości ekranów kalkulatorów (A, D i pomocnicze).
 * Wydzielone, żeby zmiana stylu (np. rozmiar czcionki wzoru) nie wymagała edycji dziesiątek plików.
 *
 * `assumptions`/`warnings` mogą pochodzić z modułu zmigrowanego do i18n (rozdz. 17) albo
 * niezmigrowanego (stan przejściowy, 17.9) — ten komponent rozwiązuje oba kształty jednym
 * miejscem, żeby żaden ekran nie musiał tego robić samodzielnie. `useTranslate()` (Client
 * Component) — wszyscy importerzy tego komponentu już są "use client".
 */
export function WynikSzczegoly({
  assumptions,
  warnings,
  formula,
}: {
  assumptions: Assumption[]
  warnings?: Warning[]
  formula?: string
}) {
  const t = useTranslate()

  function tekstZalozenia(a: Assumption): string {
    return typeof a === "string" ? a : t(a.kod, a.params)
  }

  function tekstOstrzezenia(w: Warning): string {
    return w.message ?? t(w.i18nKey ?? w.code, w.params)
  }

  return (
    <>
      {assumptions.length > 0 && (
        <ul className="mt-2 text-small opacity-90">
          {assumptions.map((a, i) => (
            <li key={typeof a === "string" ? a : a.kod + i}>Założenie: {tekstZalozenia(a)}</li>
          ))}
        </ul>
      )}

      {warnings && warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-small">
          {warnings.map((w, i) => (
            <li key={w.code + i}>{tekstOstrzezenia(w)}</li>
          ))}
        </ul>
      )}

      {formula && <p className="mt-3 font-mono text-caption opacity-70">{formula}</p>}
    </>
  )
}
