"use client"

import { useMemo } from "react"
import { calculateOchronaOdwrotnaPolaryzacja } from "@/lib/core/modules/okablowanie/ochrona-odwrotna-polaryzacja/calculator"
import { OPISY_OCHRONY } from "@/lib/core/modules/okablowanie/ochrona-odwrotna-polaryzacja/constants"
import type { MiejsceObwodu, TypOchrony } from "@/lib/core/modules/okablowanie/ochrona-odwrotna-polaryzacja/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  miejsceObwodu: MiejsceObwodu | ""
  typOchrony: TypOchrony | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsceObwodu: "",
  typOchrony: "",
}

export default function OchronaOdwrotnaPolaryzacjaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-odwrotna-polaryzacja", STAN_POCZATKOWY)
  const { miejsceObwodu, typOchrony } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMiejsceObwodu = (a: (MiejsceObwodu | "") | ((p: MiejsceObwodu | "") => MiejsceObwodu | "")) => setPole("miejsceObwodu", a)
  const setTypOchrony = (a: (TypOchrony | "") | ((p: TypOchrony | "") => TypOchrony | "")) => setPole("typOchrony", a)

  const result = useMemo(
    () =>
      calculateOchronaOdwrotnaPolaryzacja({
        miejsceObwodu: miejsceObwodu === "" ? null : miejsceObwodu,
        typOchrony: typOchrony === "" ? null : typOchrony,
      }),
    [miejsceObwodu, typOchrony],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict = result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = { incomplete: "ok", red: "blad", green: "ok" }
  const verdictLabel: Record<typeof verdict, string> = {
    incomplete: "Wybierz typ ochrony",
    red: "Zabronione — brak ochrony przed odwrotną polaryzacją",
    green: "Ochrona zastosowana",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-odwrotna-polaryzacja" />
      <NaglowekEkranu tytul="Ochrona przed odwrotną polaryzacją">
        Plus z minusem to jak ogień z benzyną. Zabezpieczenie to blokada, która nie pozwala na
        pomyłkę. Moduł 5, Ekran 15.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect label="Miejsce obwodu" value={miejsceObwodu} onChange={(e) => setMiejsceObwodu(e.target.value as MiejsceObwodu)}>
          <option value="">— wybierz —</option>
          <option value="bateria">Bateria</option>
          <option value="panele">Panele / string PV</option>
          <option value="falownik">Falownik</option>
        </PoleSelect>
        <PoleSelect label="Zastosowana ochrona" value={typOchrony} onChange={(e) => setTypOchrony(e.target.value as TypOchrony)}>
          <option value="">— wybierz —</option>
          <option value="brak">Brak</option>
          <option value="dioda-blokujaca">Dioda blokująca</option>
          <option value="wylacznik-blokada-mechaniczna">Wyłącznik z blokadą mechaniczną</option>
        </PoleSelect>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
        {(Object.keys(OPISY_OCHRONY) as (keyof typeof OPISY_OCHRONY)[]).map((key) => (
          <div key={key}>
            <div className="font-medium">{OPISY_OCHRONY[key].etykieta}</div>
            <div className="text-muted-foreground">{OPISY_OCHRONY[key].opis}</div>
          </div>
        ))}
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
