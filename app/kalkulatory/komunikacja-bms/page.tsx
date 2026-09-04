"use client"

import { useMemo, useState } from "react"
import { calculateKomunikacjaBms } from "@/lib/core/modules/baterie/komunikacja-bms/calculator"
import { PROTOKOLY } from "@/lib/core/modules/baterie/komunikacja-bms/constants"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"

export default function KomunikacjaBmsPage() {
  const [protokolBms, setProtokolBms] = useState("")
  const [protokolFalownika, setProtokolFalownika] = useState("")

  const result = useMemo(
    () => calculateKomunikacjaBms({ protokolBms, protokolFalownika }),
    [protokolBms, protokolFalownika],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "VALID"
      ? "ok"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : result.status === "OUT_OF_SCOPE"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/komunikacja-bms" />
      <NaglowekEkranu tytul="Komunikacja BMS — CAN/RS485/Modbus">
        BMS i falownik muszą „mówić tym samym językiem” — bez tego falownik nie wie, ile realnie
        ma baterii, i musi zgadywać. Moduł 4, Ekran 20.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect label="Protokół BMS" value={protokolBms} onChange={(e) => setProtokolBms(e.target.value)}>
          <option value="">— wybierz —</option>
          {PROTOKOLY.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label="Protokół falownika/ładowarki"
          value={protokolFalownika}
          onChange={(e) => setProtokolFalownika(e.target.value)}
        >
          <option value="">— wybierz —</option>
          {PROTOKOLY.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </PoleSelect>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wybierz protokół obu urządzeń, żeby sprawdzić zgodność.
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={
              result.status === "OUT_OF_SCOPE"
                ? "Nie da się ocenić automatycznie"
                : result.value.zgodne
                  ? "Zgodne — komunikacja bezpośrednia"
                  : "Potrzebny konwerter protokołu"
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
