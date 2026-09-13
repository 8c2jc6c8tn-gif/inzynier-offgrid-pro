"use client"

import { useMemo, useState } from "react"
import { calculateDoborIzolacjiKabla } from "@/lib/core/modules/okablowanie/dobor-izolacji-kabla/calculator"
import type { Izolacja, MiejsceTrasy } from "@/lib/core/modules/okablowanie/dobor-izolacji-kabla/input"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

const ETYKIETY_MIEJSC: Record<MiejsceTrasy, string> = {
  ziemia: "W ziemi",
  "zewnetrznie-blisko-paneli": "Zewnętrznie, blisko paneli",
  wewnatrz: "Wewnątrz budynku",
  napowietrznie: "Napowietrznie",
}

export default function DoborIzolacjiKablaPage() {
  const [miejsceTrasy, setMiejsceTrasy] = useState<MiejsceTrasy | "">("")
  const [izolacjaWybrana, setIzolacjaWybrana] = useState<Izolacja | "">("")
  const [temperaturaMaksymalnaC, setTemperaturaMaksymalnaC] = useState("")

  const result = useMemo(
    () =>
      calculateDoborIzolacjiKabla({
        miejsceTrasy: miejsceTrasy === "" ? null : miejsceTrasy,
        izolacjaWybrana: izolacjaWybrana === "" ? null : izolacjaWybrana,
        temperaturaMaksymalnaC: temperaturaMaksymalnaC === "" ? 0 : Number(temperaturaMaksymalnaC),
      }),
    [miejsceTrasy, izolacjaWybrana, temperaturaMaksymalnaC],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij wszystkie pola",
    red: "Zabronione — izolacja nie wytrzyma tej temperatury",
    green: "Izolacja wystarczająca",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-izolacji-kabla" />
      <NaglowekEkranu tytul="Dobór izolacji kabla do warunków montażu">
        Izolacja to skóra kabla — musi być dobrana do pogody i miejsca, inaczej pęka i puszcza
        wilgoć. Moduł 5, Ekran 28.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Miejsce trasy (informacyjnie)"
          value={miejsceTrasy}
          onChange={(e) => setMiejsceTrasy(e.target.value as MiejsceTrasy)}
        >
          <option value="">— wybierz —</option>
          {(Object.keys(ETYKIETY_MIEJSC) as MiejsceTrasy[]).map((m) => (
            <option key={m} value={m}>
              {ETYKIETY_MIEJSC[m]}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label="Rozważana izolacja kabla"
          value={izolacjaWybrana}
          onChange={(e) => setIzolacjaWybrana(e.target.value as Izolacja)}
        >
          <option value="">— wybierz —</option>
          <option value="PVC">PVC (YKY/YAKY) — do 70°C</option>
          <option value="XLPE">XLPE — do 90°C</option>
        </PoleSelect>
        <Pole
          label="Maksymalna spodziewana temperatura"
          unit="°C"
          type="number"
          inputMode="decimal"
          min={0}
          value={temperaturaMaksymalnaC}
          onChange={(e) => setTemperaturaMaksymalnaC(e.target.value)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>Izolacja wytrzymuje do {result.value.maksTemperaturaIzolacjiC}°C</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
