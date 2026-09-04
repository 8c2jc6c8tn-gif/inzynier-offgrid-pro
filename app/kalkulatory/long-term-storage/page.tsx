"use client"

import { useMemo, useState } from "react"
import { calculateLongTermStorage } from "@/lib/core/modules/baterie/long-term-storage/calculator"
import {
  CHECKLIST_ITEMS,
  SOC_ZALECANY_MAX_PCT,
  SOC_ZALECANY_MIN_PCT,
  TEMPERATURA_MIN_BEZPIECZNA_C,
} from "@/lib/core/modules/baterie/long-term-storage/constants"
import { Pole } from "@/components/ui/pole"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function LongTermStoragePage() {
  const [socDocelowyPct, setSocDocelowyPct] = useState("")
  const [temperaturaMinC, setTemperaturaMinC] = useState("")
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () =>
      calculateLongTermStorage({
        socDocelowyPct: socDocelowyPct === "" ? 0 : Number(socDocelowyPct),
        temperaturaMinC: temperaturaMinC === "" ? null : Number(temperaturaMinC),
        potwierdzoneIds,
      }),
    [socDocelowyPct, temperaturaMinC, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/long-term-storage" />
      <NaglowekEkranu tytul="Tryb Long Term Storage (odstawienie na zimę)">
        Bateria odstawiona na dłużej nie lubi być ani przesuszona, ani przelana — a mróz poniżej
        pewnej granicy uszkadza ogniwa nawet bez ładowania. Moduł 4, Ekran 16.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Docelowy SoC przed odstawieniem"
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={socDocelowyPct}
          onChange={(e) => setSocDocelowyPct(e.target.value)}
          hint={`Zalecany zakres: ${SOC_ZALECANY_MIN_PCT}–${SOC_ZALECANY_MAX_PCT}%.`}
        />
        <Pole
          label="Najniższa spodziewana temperatura przechowywania"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaMinC}
          onChange={(e) => setTemperaturaMinC(e.target.value)}
          hint={`Bezpieczne minimum: ${TEMPERATURA_MIN_BEZPIECZNA_C}°C.`}
        />
      </div>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {result.status === "INCOMPLETE" && result.warnings.length === 0 && (
        <p className="text-small text-muted-foreground">
          {socDocelowyPct === "" || temperaturaMinC === ""
            ? "Wpisz SoC i temperaturę, żeby zobaczyć ocenę."
            : `Potwierdzono ${result.value.potwierdzoneCzynnosci} / ${result.value.razemCzynnosci} czynności.`}
        </p>
      )}

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się ocenić — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null &&
        poziom !== "blad" && (
          <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "Gotowe do odstawienia" : undefined}>
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
