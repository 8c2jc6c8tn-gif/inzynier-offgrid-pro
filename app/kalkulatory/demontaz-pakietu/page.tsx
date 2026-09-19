"use client"

import { useMemo, useState } from "react"
import { calculateDemontazPakietu } from "@/lib/core/modules/montaz-baterii/demontaz-pakietu/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE, WYMAGANE_WYPOSAZENIE } from "@/lib/core/modules/montaz-baterii/demontaz-pakietu/constants"
import { OCZEKIWANA_LICZBA_OGNIW } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/constants"
import type { NapiecieSystemu } from "@/lib/core/modules/montaz-baterii/weryfikacja-ogniw/input"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

/** Schemat: ten sam szereg co przy montażu, rozpinany od końca o najwyższym potencjale. */
function DemontazIlustracja() {
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
      aria-label="Schemat demontażu: rozpinanie szeregu ogniw zaczyna się od końca pakietu o najwyższym potencjale"
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

      {[0, 1, 2].map((i) => {
        const x1 = cellXs[i] + cellW
        const x2 = cellXs[i + 1]
        return <line key={i} x1={x1} y1={midY} x2={x2} y2={midY} className="stroke-red-500" strokeWidth="3" />
      })}

      <line x1="6" y1={midY} x2={cellXs[0]} y2={midY} className="stroke-current" strokeWidth="3" />
      <line
        x1={cellXs[3] + cellW}
        y1={midY}
        x2="434"
        y2={midY}
        className="stroke-current"
        strokeWidth="3"
      />
      <text x="434" y={midY - 12} textAnchor="end" className="fill-current text-[8px] font-medium">
        Do BMS (−)
      </text>

      {/* Znacznik startu demontażu — koniec o najwyższym potencjale. */}
      <circle cx="6" cy={midY} r="10" className="fill-red-500" />
      <text x="6" y={midY + 3} textAnchor="middle" className="fill-white text-[9px] font-bold">
        1
      </text>
      <text x="6" y={midY - 24} textAnchor="start" className="fill-red-500 text-[8px] font-semibold">
        Zacznij tu
      </text>
      <text x="6" y={midY - 14} textAnchor="start" className="fill-red-500 text-[8px] font-semibold">
        (Pakiet +)
      </text>

      <text x="220" y="128" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Rozpinanie zaczyna się od końca o najwyższym potencjale (Pakiet +),
      </text>
      <text x="220" y="142" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        dokładna odwrotność kolejności montażu.
      </text>
    </svg>
  )
}

export default function DemontazPakietuPage() {
  const [napiecieSystemu, setNapiecieSystemu] = useState<NapiecieSystemu>(48)
  const [napieciePakietuV, setNapieciePakietuV] = useState("49.6")
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () =>
      calculateDemontazPakietu({
        napiecieSystemu,
        napieciePakietuV: Number(napieciePakietuV),
        potwierdzoneIds,
      }),
    [napiecieSystemu, napieciePakietuV, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasWarning
          ? "uwaga"
          : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/demontaz-pakietu" />
      <NaglowekEkranu tytul="Demontaż pakietu">
        Ta kolejność nie jest sugestią — to dokładna odwrotność kolejności montażu, i każde
        odstępstwo zwiększa ryzyko zwarcia w rękach. {WYMAGANE_WYPOSAZENIE} Moduł 11, Ekran A6.
      </NaglowekEkranu>

      <DemontazIlustracja />

      <PoleSelect
        label="Napięcie systemu"
        value={napiecieSystemu}
        onChange={(e) => setNapiecieSystemu(Number(e.target.value) as NapiecieSystemu)}
      >
        <option value={12}>12 V (4S)</option>
        <option value={24}>24 V (8S)</option>
        <option value={48}>48 V (16S)</option>
      </PoleSelect>

      <Pole
        label="Zmierzone napięcie pakietu"
        unit="V"
        type="number"
        inputMode="decimal"
        value={napieciePakietuV}
        onChange={(e) => setNapieciePakietuV(e.target.value)}
        hint={`Zalecane przed demontażem: 3,0–3,2 V/ogniwo (dla ${OCZEKIWANA_LICZBA_OGNIW[napiecieSystemu]}S: ok. ${(3 * OCZEKIWANA_LICZBA_OGNIW[napiecieSystemu]).toFixed(0)}–${(3.2 * OCZEKIWANA_LICZBA_OGNIW[napiecieSystemu]).toFixed(0)} V).`}
      />

      {result.status !== "INVALID_INPUT" && (
        <p className="text-small text-muted-foreground">
          Napięcie na ogniwo: <span className="font-medium text-foreground">{result.value.napiecieOgniwaV.toFixed(2)} V</span>
        </p>
      )}

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

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź napięcie pakietu">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : poziom === null ? (
        <p className="text-small text-muted-foreground">
          Potwierdzono {result.value.potwierdzoneWKolejnosci} / {result.value.razem} kroków po kolei.
        </p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            hasCritical
              ? "Zabronione — pakiet wciąż naładowany"
              : poziom === "ok"
                ? "Bezpieczny do demontażu"
                : undefined
          }
        >
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
