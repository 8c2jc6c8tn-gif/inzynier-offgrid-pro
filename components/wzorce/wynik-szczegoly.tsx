"use client"

import type { Assumption, Warning } from "@/lib/core/calc-result"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
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
  formulaKey,
  formulaParams,
}: {
  assumptions: Assumption[]
  warnings?: Warning[]
  formula?: string
  formulaKey?: string
  formulaParams?: Record<string, string | number>
}) {
  const t = useTranslate()

  function tekstOstrzezenia(w: Warning): string {
    return w.message ?? t(w.i18nKey ?? w.code, w.params)
  }

  return (
    <>
      {assumptions.length > 0 && <ZalozeniaLista assumptions={assumptions} className="mt-2 text-small text-inherit opacity-90" />}

      {warnings && warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-small">
          {warnings.map((w, i) => (
            <li key={w.code + i}>{tekstOstrzezenia(w)}</li>
          ))}
        </ul>
      )}

      {formula && <p className="mt-3 font-mono text-caption opacity-70">{formulaKey ? t(formulaKey, formulaParams) : formula}</p>}
    </>
  )
}
