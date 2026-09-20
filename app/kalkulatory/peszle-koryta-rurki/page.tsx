"use client"

import { useMemo } from "react"
import { calculatePeszleKorytaRurki } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/calculator"
import { ETYKIETY_MIEJSC, OSLONY } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/constants"
import type { MiejsceMontazu } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"

type FormularzStan = {
  miejsceMontazu: MiejsceMontazu | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsceMontazu: "",
}

export default function PeszleKorytaRurkiPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("peszle-koryta-rurki", STAN_POCZATKOWY)
  const { miejsceMontazu } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMiejsceMontazu = (a: (MiejsceMontazu | "") | ((p: MiejsceMontazu | "") => MiejsceMontazu | "")) => setPole("miejsceMontazu", a)

  const result = useMemo(
    () => calculatePeszleKorytaRurki({ miejsceMontazu: miejsceMontazu === "" ? null : miejsceMontazu }),
    [miejsceMontazu],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/peszle-koryta-rurki" />
      <NaglowekEkranu tytul="Peszle, koryta, rurki">
        Osłona to ubranie dla kabla. Musi być dobrane do pogody i miejsca, inaczej kabel się
        zużyje przedwcześnie. Moduł 5, Ekran 24.
      </NaglowekEkranu>

      <PoleSelect label="Miejsce montażu" value={miejsceMontazu} onChange={(e) => setMiejsceMontazu(e.target.value as MiejsceMontazu)}>
        <option value="">— wybierz —</option>
        {(Object.keys(ETYKIETY_MIEJSC) as MiejsceMontazu[]).map((m) => (
          <option key={m} value={m}>
            {ETYKIETY_MIEJSC[m]}
          </option>
        ))}
      </PoleSelect>

      {result.status === "VALID" && result.value.zalecanaOslona && (
        <WerdyktPanel poziom="ok" etykieta="Zalecana osłona">
          <WynikGlowny>{result.value.zalecanaOslona.nazwa}</WynikGlowny>
          <p className="mt-1 text-small text-muted-foreground">{result.value.zalecanaOslona.opis}</p>
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-3">
        <div className="font-medium text-small">Wszystkie osłony</div>
        {OSLONY.map((o) => (
          <div key={o.id} className="rounded-md border p-3 text-small">
            <span className="block font-medium">{o.nazwa}</span>
            <span className="block text-muted-foreground">{o.opis}</span>
            <span className="block text-caption text-muted-foreground">Zalecane: {ETYKIETY_MIEJSC[o.zalecaneMiejsce]}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
