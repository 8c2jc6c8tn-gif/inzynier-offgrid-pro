"use client"

import { useMemo } from "react"
import { calculateDoborMocyFalownika } from "@/lib/core/modules/okablowanie/dobor-mocy-falownika/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { DOMYSLNY_WSPOLCZYNNIK_JEDNOCZESNOSCI } from "@/lib/core/modules/okablowanie/dobor-mocy-falownika/constants"

type FormularzStan = {
  mocSzczytowaW: string
  mocPozornaVa: string
  wspolczynnikJednoczesnosci: string
  mocFalownikaWybranaW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocSzczytowaW: "",
  mocPozornaVa: "",
  wspolczynnikJednoczesnosci: "0.7",
  mocFalownikaWybranaW: "",
}

export default function DoborMocyFalownikaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-mocy-falownika", STAN_POCZATKOWY)
  const { mocSzczytowaW, mocPozornaVa, wspolczynnikJednoczesnosci, mocFalownikaWybranaW } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocSzczytowaW = (a: string | ((p: string) => string)) => setPole("mocSzczytowaW", a)
  const setMocPozornaVa = (a: string | ((p: string) => string)) => setPole("mocPozornaVa", a)
  const setWspolczynnikJednoczesnosci = (a: string | ((p: string) => string)) => setPole("wspolczynnikJednoczesnosci", a)
  const setMocFalownikaWybranaW = (a: string | ((p: string) => string)) => setPole("mocFalownikaWybranaW", a)

  const result = useMemo(
    () =>
      calculateDoborMocyFalownika({
        mocSzczytowaW: mocSzczytowaW === "" ? 0 : Number(mocSzczytowaW),
        mocPozornaVa: mocPozornaVa === "" ? 0 : Number(mocPozornaVa),
        wspolczynnikJednoczesnosci: wspolczynnikJednoczesnosci === "" ? 0 : Number(wspolczynnikJednoczesnosci),
        mocFalownikaWybranaW: mocFalownikaWybranaW === "" ? 0 : Number(mocFalownikaWybranaW),
      }),
    [mocSzczytowaW, mocPozornaVa, wspolczynnikJednoczesnosci, mocFalownikaWybranaW],
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
    incomplete: "Wypełnij moc szczytową i współczynnik jednoczesności",
    red: "Falownik za słaby — ryzyko wyłączeń przy rozruchach",
    green: "Moc falownika dobrana poprawnie",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-mocy-falownika" />
      <NaglowekEkranu
        tytul="Dobór mocy falownika"
        ekran="dobor-mocy-falownika"
        wzor={result.formula}
        parametry={{ wspJednoczesnosci: DOMYSLNY_WSPOLCZYNNIK_JEDNOCZESNOSCI }}
      >
        Falownik musi wytrzymać nie tylko normalną pracę, ale ten ułamek sekundy, gdy silnik
        lodówki czy pompy rusza z miejsca — wtedy pobiera nawet 5-7× więcej prądu niż normalnie.
        Moduł 5, Ekran 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc szczytowa odbiorników"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocSzczytowaW}
          onChange={(e) => setMocSzczytowaW(e.target.value)}
          pomoc={<PomocPola ekran="dobor-mocy-falownika" pole="mocSzczytowa" />}
        />
        <Pole
          label="Moc pozorna odbiorników (opcjonalnie)"
          unit="VA"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPozornaVa}
          onChange={(e) => setMocPozornaVa(e.target.value)}
          pomoc={<PomocPola ekran="dobor-mocy-falownika" pole="mocPozorna" />}
        />
        <Pole
          label="Współczynnik jednoczesności"
          unit=""
          type="number"
          inputMode="decimal"
          min={0}
          step={0.05}
          value={wspolczynnikJednoczesnosci}
          onChange={(e) => setWspolczynnikJednoczesnosci(e.target.value)}
          pomoc={<PomocPola ekran="dobor-mocy-falownika" pole="wspolczynnik" params={{ wspJednoczesnosci: DOMYSLNY_WSPOLCZYNNIK_JEDNOCZESNOSCI }} />}
        />
        <Pole
          label="Moc rozważanego falownika (opcjonalnie, do sprawdzenia)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocFalownikaWybranaW}
          onChange={(e) => setMocFalownikaWybranaW(e.target.value)}
          pomoc={<PomocPola ekran="dobor-mocy-falownika" pole="mocFalownika" />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>Zalecana moc falownika: {Math.round(result.value.mocFalownikaZalecanaW)} W</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
