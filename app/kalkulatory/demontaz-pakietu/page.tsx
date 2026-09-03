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
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
