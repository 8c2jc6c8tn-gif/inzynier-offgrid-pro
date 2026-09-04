"use client"

import { useMemo, useState } from "react"
import { calculatePozycjonowanieOgniw } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/calculator"
import { DOCISK_MAX_KGF, DOCISK_MIN_KGF } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/constants"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"

export default function PozycjonowanieOgniwPage() {
  const [dociskKgf, setDociskKgf] = useState("")
  const [luzNaPeczenie, setLuzNaPeczenie] = useState(false)

  const result = useMemo(
    () =>
      calculatePozycjonowanieOgniw({
        dociskKgf: dociskKgf === "" ? 0 : Number(dociskKgf),
        luzNaPeczenie,
      }),
    [dociskKgf, luzNaPeczenie],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : hasCritical
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pozycjonowanie-ogniw" />
      <NaglowekEkranu tytul="Pozycjonowanie ogniw (kompresja/spuchnięcie)">
        Ogniwa lubią być trzymane stabilnie, ale nie jak w imadle — muszą mieć trochę przestrzeni
        na naturalne „oddychanie” podczas pracy. Moduł 4, Ekran 21.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zastosowany docisk na pakiet"
          unit="kgf"
          type="number"
          inputMode="decimal"
          value={dociskKgf}
          onChange={(e) => setDociskKgf(e.target.value)}
          hint={`Zalecany zakres dla ogniw pryzmatycznych: ${DOCISK_MIN_KGF}-${DOCISK_MAX_KGF} kgf.`}
        />
        <PoleCheckbox
          id="luz-peczenie"
          checked={luzNaPeczenie}
          onChange={(e) => setLuzNaPeczenie(e.target.checked)}
          label="Zostawiono min. 1 mm luzu na pęcznienie (ogniwa rosną 1-2% podczas ładowania)"
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wpisz zastosowany docisk, żeby zobaczyć ocenę.
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={
              result.status === "INVALID_INPUT"
                ? "Nie da się ocenić — sprawdź wpisane dane"
                : poziom === "ok"
                  ? "Docisk prawidłowy"
                  : hasCritical
                    ? "Docisk poza zakresem"
                    : "Brakuje potwierdzenia luzu"
            }
          >
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-1 text-small">
                {w.message}
              </p>
            ))}
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
