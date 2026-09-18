"use client"

import { useMemo, useState } from "react"
import { calculateDetekcjaDoziemienia } from "@/lib/core/modules/baterie/detekcja-doziemienia/calculator"
import { PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function DetekcjaDoziemieniaPage() {
  const t = useTranslate()
  const [maMonitorIzolacji, setMaMonitorIzolacji] = useState(false)
  const [maRoznicowkeDc, setMaRoznicowkeDc] = useState(false)

  const result = useMemo(
    () => calculateDetekcjaDoziemienia({ maMonitorIzolacji, maRoznicowkeDc }),
    [maMonitorIzolacji, maRoznicowkeDc],
  )

  const poziom: WerdyktPoziom = result.value.zabezpieczony ? "ok" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/detekcja-doziemienia" />
      <NaglowekEkranu tytul="Detekcja doziemienia (Ground Fault & IMD)">
        Prąd stały (DC) trzyma ofiarę porażenia mocniej niż zmienny (AC) — mięśnie nie mogą się
        „puścić” tak jak przy AC. Dlatego detekcja doziemienia w DC jest tak krytyczna. Moduł 4,
        Ekran 29.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <PoleCheckbox
          id="ma-imd"
          checked={maMonitorIzolacji}
          onChange={(e) => setMaMonitorIzolacji(e.target.checked)}
          label="Zainstalowano monitor izolacji (IMD)"
        />
        <PoleCheckbox
          id="ma-roznicowke"
          checked={maRoznicowkeDc}
          onChange={(e) => setMaRoznicowkeDc(e.target.checked)}
          label="Zainstalowano różnicówkę DC"
        />
      </div>

      <WerdyktPanel poziom={poziom} etykieta={result.value.zabezpieczony ? "Zabezpieczone" : "Brak zabezpieczenia"}>
        {result.warnings.map((w) => (
          <p key={w.code} className="mt-1 text-small">
            {w.message ?? t(w.i18nKey ?? w.code, w.params)}
          </p>
        ))}
      </WerdyktPanel>
    </main>
  )
}
