"use client"

import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

/**
 * Lista punktów jednego zbioru Skanera (działka / budynek / połać): numer (ten sam co znacznik
 * na mapie i w kalibracji), współrzędne, wysokość do ręcznej korekty, usuwanie. Wysokość jako pole
 * niekontrolowane zatwierdzane przy opuszczeniu — liczba w modelu nie "skacze" w trakcie pisania.
 */
export function ListaPunktow({
  punkty,
  pokazWysokosc,
  onZmien,
}: {
  punkty: PunktGps[]
  pokazWysokosc: boolean
  onZmien: (punkty: PunktGps[]) => void
}) {
  if (punkty.length === 0) return <p className="text-small text-muted-foreground">Brak punktów.</p>
  // Długie obrysy (np. 70 wierzchołków budynku z ULDK) — lista zwinięta, geometria i tak jest na mapie.
  const zwin = punkty.length > 12
  const tresc = (
    <ol className="flex flex-col gap-1 text-small">
      {punkty.map((p, i) => (
        <li key={`${i}-${p.szerokosc}-${p.dlugosc}`} className="flex flex-wrap items-center gap-2">
          <span className="w-6 text-right font-semibold">{i + 1}.</span>
          <span className="tabular-nums text-muted-foreground">
            {p.szerokosc.toFixed(6)}, {p.dlugosc.toFixed(6)}
          </span>
          {pokazWysokosc && (
            <label className="flex items-center gap-1">
              <span className="sr-only">Wysokość punktu {i + 1}</span>
              <input
                type="text"
                inputMode="decimal"
                defaultValue={p.wysokoscM === undefined ? "" : String(Math.round(p.wysokoscM * 100) / 100)}
                placeholder="wys."
                className="w-20 rounded border border-input bg-background px-1 py-0.5"
                onBlur={(e) => {
                  const z = liczba(e.target.value)
                  onZmien(punkty.map((q, j) => (j === i ? { szerokosc: q.szerokosc, dlugosc: q.dlugosc, ...(z !== undefined ? { wysokoscM: z } : {}) } : q)))
                }}
              />
              <span className="text-muted-foreground">m</span>
            </label>
          )}
          <button
            type="button"
            className="ml-auto rounded px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Usuń punkt ${i + 1}`}
            onClick={() => onZmien(punkty.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </li>
      ))}
    </ol>
  )
  return zwin ? (
    <details>
      <summary className="cursor-pointer text-small">{punkty.length} punktów — pokaż listę</summary>
      <div className="mt-2">{tresc}</div>
    </details>
  ) : (
    tresc
  )
}
