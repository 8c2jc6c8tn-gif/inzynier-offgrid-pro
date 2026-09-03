"use client"

import { useMemo, useState } from "react"
import { calculatePolaczeniaElektryczne } from "@/lib/core/modules/montaz-baterii/polaczenia-elektryczne/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/montaz-baterii/polaczenia-elektryczne/constants"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

/** Schemat: kolejność łączenia ogniw w szereg (przykład 4S — minus jednego do plusa następnego). */
function PolaczeniaSzeregoweIlustracja() {
  const cellXs = [55, 150, 245, 340]
  const cellW = 65
  const cellY = 44
  const cellH = 56
  const midY = cellY + cellH / 2

  return (
    <svg
      viewBox="0 0 440 160"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label="Schemat kolejności łączenia czterech ogniw w szereg, minus jednego do plusa następnego"
    >
      {cellXs.map((x, i) => (
        <g key={x}>
          <rect x={x} y={cellY} width={cellW} height={cellH} rx="4" className="fill-indigo-400/60 stroke-current" />
          <text x={x + 13} y={midY - 10} textAnchor="middle" className="fill-current text-[11px] font-semibold">
            +
          </text>
          <text x={x + cellW - 13} y={midY - 10} textAnchor="middle" className="fill-current text-[11px] font-semibold">
            −
          </text>
          <text x={x + cellW / 2} y={midY + 20} textAnchor="middle" className="fill-current text-[9px]">
            Ogniwo {i + 1}
          </text>
        </g>
      ))}

      {/* Wewnętrzne połączenia szeregowe, ponumerowane wg kolejności łączenia. */}
      {[0, 1, 2].map((i) => {
        const x1 = cellXs[i] + cellW
        const x2 = cellXs[i + 1]
        const xm = (x1 + x2) / 2
        return (
          <g key={i}>
            <line x1={x1} y1={midY} x2={x2} y2={midY} className="stroke-red-500" strokeWidth="3" />
            <circle cx={xm} cy={midY - 20} r="9" className="fill-red-500" />
            <text x={xm} y={midY - 16} textAnchor="middle" className="fill-white text-[10px] font-bold">
              {i + 1}
            </text>
          </g>
        )
      })}

      {/* Główne terminale pakietu. */}
      <line x1="6" y1={midY} x2={cellXs[0]} y2={midY} className="stroke-current" strokeWidth="3" />
      <text x="6" y={midY - 22} textAnchor="start" className="fill-current text-[8px] font-medium">
        Pakiet
      </text>
      <text x="6" y={midY - 12} textAnchor="start" className="fill-current text-[8px] font-medium">
        (+)
      </text>
      <line
        x1={cellXs[3] + cellW}
        y1={midY}
        x2="434"
        y2={midY}
        className="stroke-current"
        strokeWidth="3"
      />
      <text x="434" y={midY - 22} textAnchor="end" className="fill-current text-[8px] font-medium">
        Do BMS
      </text>
      <text x="434" y={midY - 12} textAnchor="end" className="fill-current text-[8px] font-medium">
        (−)
      </text>

      <text x="220" y="128" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Kolejność 1→2→3: minus ogniwa do plusa następnego.
      </text>
      <text x="220" y="142" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Szyny zbiorcze — dopiero potem.
      </text>
    </svg>
  )
}

export default function PolaczeniaElektrycznePage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () => calculatePolaczeniaElektryczne({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/polaczenia-elektryczne" />
      <NaglowekEkranu tytul="Połączenia elektryczne i kolejność łączenia">
        Kolejność łączenia ma znaczenie — przypadkowe zwarcie podczas montażu szeregu ogniw to
        najczęstsza przyczyna wypadków przy budowie własnego pakietu. Moduł 11, Ekran A3.
      </NaglowekEkranu>

      <PolaczeniaSzeregoweIlustracja />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        numerowana
        renderLabel={(item, index) => (
          <>
            <span className="font-medium">Krok {index + 1}. </span>
            {item.krok}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>🔴 {w}</li>
        ))}
      </ul>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "Połączenia zgodne z kolejnością" : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <StanPusty
          tytul={`Potwierdzono ${result.value.potwierdzoneWKolejnosci} / ${result.value.razem} kroków po kolei`}
        />
      )}
    </main>
  )
}
