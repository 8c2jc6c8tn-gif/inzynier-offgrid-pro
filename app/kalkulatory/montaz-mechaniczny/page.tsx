"use client"

import { useMemo, useState } from "react"
import { calculateMontazMechaniczny } from "@/lib/core/modules/montaz-baterii/montaz-mechaniczny/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/montaz-mechaniczny/constants"
import { Pole } from "@/components/ui/pole"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function MontazMechanicznyPage() {
  const [dociskKgf, setDociskKgf] = useState(0)
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () => calculateMontazMechaniczny({ dociskKgf, potwierdzoneIds }),
    [dociskKgf, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? "Nie da się policzyć — sprawdź wpisany docisk"
      : result.status === "VALID_WITH_WARNINGS"
        ? "Docisk poza zalecanym zakresem — sprawdź ostrzeżenia"
        : "Gotowe do montażu elektrycznego (Ekran A3)"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/montaz-mechaniczny" />
      <NaglowekEkranu tytul="Montaż mechaniczny i separacja ogniw">
        Zanim ogniwa zostaną połączone elektrycznie — sprawdź docisk i separację. Docisk poza
        zakresem to ryzyko utraty kontaktu wewnętrznego albo uszkodzenia mechanicznego ogniw, ten
        sam próg co Moduł 4/Ekran 21. Moduł 11, Ekran A2 (ścieżka LiFePO4).
      </NaglowekEkranu>

      <Pole
        label="Docisk ogniw pryzmatycznych"
        unit="kgf"
        type="number"
        inputMode="decimal"
        min={0}
        value={dociskKgf || ""}
        onChange={(e) => setDociskKgf(Number(e.target.value))}
        hint="Zalecany zakres: 300-400 kgf (Moduł 4/Ekran 21)."
      />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz zmierzony docisk, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
