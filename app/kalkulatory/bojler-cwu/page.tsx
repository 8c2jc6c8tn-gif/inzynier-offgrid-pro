"use client"

import { useMemo } from "react"
import { calculateBojlerCwu } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/calculator"
import {
  CIEPLO_WLASCIWE_WODY_J_KG_K,
  WSPOLCZYNNIK_KWH_NA_L_K,
} from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  wolumenCwuLDoba: string
  deltaTK: string
  mocGrzalkiKw: string
  pojemnoscBojleraL: string
}

const STAN_POCZATKOWY: FormularzStan = {
  wolumenCwuLDoba: "",
  deltaTK: "",
  mocGrzalkiKw: "",
  pojemnoscBojleraL: "",
}

export default function BojlerCwuPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bojler-cwu", STAN_POCZATKOWY)
  const { wolumenCwuLDoba, deltaTK, mocGrzalkiKw, pojemnoscBojleraL } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setWolumenCwuLDoba = (a: string | ((p: string) => string)) => setPole("wolumenCwuLDoba", a)
  const setDeltaTK = (a: string | ((p: string) => string)) => setPole("deltaTK", a)
  const setMocGrzalkiKw = (a: string | ((p: string) => string)) => setPole("mocGrzalkiKw", a)
  const setPojemnoscBojleraL = (a: string | ((p: string) => string)) => setPole("pojemnoscBojleraL", a)

  const result = useMemo(
    () =>
      calculateBojlerCwu({
        wolumenCwuLDoba: wolumenCwuLDoba === "" ? 0 : Number(wolumenCwuLDoba),
        deltaTK: deltaTK === "" ? 0 : Number(deltaTK),
        mocGrzalkiKw: mocGrzalkiKw === "" ? 0 : Number(mocGrzalkiKw),
        pojemnoscBojleraL: pojemnoscBojleraL === "" ? 0 : Number(pojemnoscBojleraL),
      }),
    [wolumenCwuLDoba, deltaTK, mocGrzalkiKw, pojemnoscBojleraL],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bojler-cwu" />
      <NaglowekEkranu
        tytul="Inteligentny bojler C.W.U."
        ekran="bojler-cwu"
        wynik={result}
        parametry={{ cWody: CIEPLO_WLASCIWE_WODY_J_KG_K, kwhNaLK: WSPOLCZYNNIK_KWH_NA_L_K.toFixed(6) }}
      >
        Bojler to jeden z największych „elastycznych” odbiorników w domu — dobowe zapotrzebowanie
        na energię i czas potrzebny na jego naładowanie, żeby zaplanować grzanie w oknie
        produkcji PV. Moduł 2, Ekran 2.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Dobowe zapotrzebowanie na C.W.U."
          unit="l/dobę"
          type="number"
          inputMode="decimal"
          min={0}
          value={wolumenCwuLDoba}
          onChange={(e) => setWolumenCwuLDoba(e.target.value)}
          pomoc={<PomocPola ekran="bojler-cwu" pole="wolumen" />}
        />
        <Pole
          label="Wzrost temperatury wody (zimna → C.W.U.)"
          unit="K"
          type="number"
          inputMode="decimal"
          min={0}
          value={deltaTK}
          onChange={(e) => setDeltaTK(e.target.value)}
          pomoc={<PomocPola ekran="bojler-cwu" pole="deltaT" />}
        />
        <Pole
          label="Moc grzałki"
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocGrzalkiKw}
          onChange={(e) => setMocGrzalkiKw(e.target.value)}
          pomoc={<PomocPola ekran="bojler-cwu" pole="mocGrzalki" />}
        />
        <Pole
          label="Pojemność zbiornika bojlera"
          unit="l"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscBojleraL}
          onChange={(e) => setPojemnoscBojleraL(e.target.value)}
          pomoc={<PomocPola ekran="bojler-cwu" pole="pojemnosc" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"}
          etykieta="Dobowe zapotrzebowanie na energię"
        >
          <WynikGlowny>{result.value.energiaDobowaKwh.toFixed(1)} kWh/dobę</WynikGlowny>
          <p className="mt-2 text-small">
            Czas ładowania przy tej mocy grzałki: ok. {result.value.czasLadowaniaH.toFixed(1)} h/dobę.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
