"use client"

import { useMemo } from "react"
import { calculatePoborWlasnyFalownika } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/calculator"
import { DOMYSLNY_POBOR_JALOWY_W } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = { poborJalowyW: string }
const STAN_POCZATKOWY: FormularzStan = { poborJalowyW: "" }

export default function PoborWlasnyFalownikaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pobor-wlasny-falownika", STAN_POCZATKOWY)
  const { poborJalowyW } = stan
  const setPoborJalowyW = (a: string | ((p: string) => string)) =>
    setStan((prev) => ({
      ...prev,
      poborJalowyW: typeof a === "function" ? (a as (p: string) => string)(prev.poborJalowyW) : a,
    }))

  const result = useMemo(
    () => calculatePoborWlasnyFalownika({ poborJalowyW: poborJalowyW === "" ? 0 : Number(poborJalowyW) }),
    [poborJalowyW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pobor-wlasny-falownika" />
      <NaglowekEkranu tytul="Pobór własny falownika" ekran="pobor-wlasny-falownika" wynik={result}>
        Falownik sam w sobie coś zużywa, tylko żeby być gotowym do pracy — to niewidoczny, ale
        realny koszt stały, o którym łatwo zapomnieć przy liczeniu bilansu. Moduł 2, Ekran 9.
      </NaglowekEkranu>

      <Pole
        label="Pobór w stanie jałowym"
        unit="W"
        type="number"
        inputMode="decimal"
        value={poborJalowyW}
        onChange={(e) => setPoborJalowyW(e.target.value)}
        pomoc={<PomocPola ekran="pobor-wlasny-falownika" pole="pobor" params={{ domyslny: DOMYSLNY_POBOR_JALOWY_W }} />}
      />

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wpisz pobór jałowy, żeby zobaczyć stały koszt bilansu.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">Pobór nie może być ujemny.</p>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta="Stały koszt bilansu dobowego">
          <WynikGlowny>
            {result.value.strataDobowaKwh.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} kWh/dobę
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
