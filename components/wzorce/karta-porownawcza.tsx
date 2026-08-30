import type { ReactNode } from "react"

export type Kolumna<T> = {
  naglowek: string
  render: (row: T) => ReactNode
  /** Dopasowuje szerokość kolumny liczbowej — wyrównanie do prawej dla czytelności wartości. */
  liczbowa?: boolean
}

/**
 * Wzorzec B (docs/brief-dla-v0.md) — porównanie kilku opcji w tabeli, przewijalnej w poziomie na
 * mobile (nie łamie się w kaszę). Używany przez porównanie technologii magazynów i prognozy
 * 24h; każdy inny ekran porównawczy dostaje ten sam nagłówek/obramowanie/zebra-rows za darmo.
 */
export function KartaPorownawcza<T extends { id: string | number }>({
  kolumny,
  wiersze,
  minWidth = 560,
}: {
  kolumny: Kolumna<T>[]
  wiersze: T[]
  minWidth?: number
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-small" style={{ minWidth }}>
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            {kolumny.map((k) => (
              <th key={k.naglowek} className={k.liczbowa ? "p-3 text-right font-medium" : "p-3 font-medium"}>
                {k.naglowek}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {wiersze.map((row) => (
            <tr key={row.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
              {kolumny.map((k) => (
                <td key={k.naglowek} className={k.liczbowa ? "p-3 text-right font-mono" : "p-3"}>
                  {k.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
