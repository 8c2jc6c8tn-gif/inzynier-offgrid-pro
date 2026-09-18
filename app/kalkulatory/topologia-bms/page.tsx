"use client"

import { useMemo, useState } from "react"
import { calculateTopologiaBms } from "@/lib/core/modules/baterie/topologia-bms/calculator"
import { TOPOLOGIE } from "@/lib/core/modules/baterie/topologia-bms/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function TopologiaBmsPage() {
  const t = useTranslate()
  const [bmsCommonPortA, setBmsCommonPortA] = useState("")
  const [falownikPradRozruchuA, setFalownikPradRozruchuA] = useState("")

  const result = useMemo(
    () =>
      calculateTopologiaBms({
        bmsCommonPortA: bmsCommonPortA === "" ? 0 : Number(bmsCommonPortA),
        falownikPradRozruchuA: falownikPradRozruchuA === "" ? 0 : Number(falownikPradRozruchuA),
      }),
    [bmsCommonPortA, falownikPradRozruchuA],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "blad"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/topologia-bms" />
      <NaglowekEkranu tytul="Topologia BMS (Common Port vs Separate Port)">
        Jak masz jedną rurę do wody i ścieków, to w końcu się zapcha — czasem lepiej rozdzielić
        drogi ładowania i rozładowania. Moduł 4, Ekran 26.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        {TOPOLOGIE.map((t) => (
          <div key={t.id} className="rounded-lg border p-4">
            <p className="text-small font-medium">{t.nazwa}</p>
            <p className="mt-1 text-small text-muted-foreground">{t.opis}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Pole
          label="Prąd znamionowy Common Port wybranego BMS"
          unit="A"
          type="number"
          inputMode="decimal"
          value={bmsCommonPortA}
          onChange={(e) => setBmsCommonPortA(e.target.value)}
        />
        <Pole
          label="Szczytowy prąd rozruchu falownika"
          unit="A"
          type="number"
          inputMode="decimal"
          value={falownikPradRozruchuA}
          onChange={(e) => setFalownikPradRozruchuA(e.target.value)}
          hint="Z karty katalogowej falownika — prąd rozruchowy bywa znacznie wyższy niż nominalny."
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij oba pola, żeby sprawdzić, czy Common Port wystarczy.
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={result.value.commonPortWystarcza ? "Common Port wystarczy" : "Wybierz Separate Port"}
          >
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-1 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
