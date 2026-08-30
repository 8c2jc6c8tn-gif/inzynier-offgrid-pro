import type { Warning } from "@/lib/core/calc-result"

/**
 * Trzy listy, które CalcResult niesie razem z wynikiem — założenia/ostrzeżenia/wzór — renderowane
 * identycznie wewnątrz WerdyktPanel na większości ekranów kalkulatorów (A, D i pomocnicze).
 * Wydzielone, żeby zmiana stylu (np. rozmiar czcionki wzoru) nie wymagała edycji 7+ plików.
 */
export function WynikSzczegoly({
  assumptions,
  warnings,
  formula,
}: {
  assumptions: string[]
  warnings?: Warning[]
  formula?: string
}) {
  return (
    <>
      {assumptions.length > 0 && (
        <ul className="mt-2 text-small opacity-90">
          {assumptions.map((a) => (
            <li key={a}>Założenie: {a}</li>
          ))}
        </ul>
      )}

      {warnings && warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-small">
          {warnings.map((w) => (
            <li key={w.code}>{w.message}</li>
          ))}
        </ul>
      )}

      {formula && <p className="mt-3 font-mono text-caption opacity-70">{formula}</p>}
    </>
  )
}
