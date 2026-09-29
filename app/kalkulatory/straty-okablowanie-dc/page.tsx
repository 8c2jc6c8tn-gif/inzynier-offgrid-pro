"use client"

import { useMemo } from "react"
import { calculateStratyOkablowanieDc } from "@/lib/core/modules/pv/straty-okablowanie-dc/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { CEL_STRATY_MAX_PCT } from "@/lib/core/modules/pv/straty-okablowanie-dc/constants"

type FormularzStan = {
  dlugoscKablaM: string
  pradA: string
  napiecieV: string
  przekrojMm2: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dlugoscKablaM: "",
  pradA: "",
  napiecieV: "",
  przekrojMm2: "",
}

export default function StratyOkablowanieDcPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("straty-okablowanie-dc", STAN_POCZATKOWY)
  const { dlugoscKablaM, pradA, napiecieV, przekrojMm2 } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDlugoscKablaM = (a: string | ((p: string) => string)) => setPole("dlugoscKablaM", a)
  const setPradA = (a: string | ((p: string) => string)) => setPole("pradA", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)
  const setPrzekrojMm2 = (a: string | ((p: string) => string)) => setPole("przekrojMm2", a)

  const result = useMemo(
    () =>
      calculateStratyOkablowanieDc({
        dlugoscKablaM: dlugoscKablaM === "" ? 0 : Number(dlugoscKablaM),
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        przekrojMm2: przekrojMm2 === "" ? 0 : Number(przekrojMm2),
      }),
    [dlugoscKablaM, pradA, napiecieV, przekrojMm2],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/straty-okablowanie-dc" />
      <NaglowekEkranu
        tytul="Straty na okablowaniu DC"
        ekran="straty-okablowanie-dc"
        wzor={result.formula}
        parametry={{ cel: CEL_STRATY_MAX_PCT }}
      >
        Prąd płynący kablem zawsze trochę „grzeje” po drodze — to normalne, ale zbyt cienki kabel
        zamienia w ciepło więcej energii niż powinien. Moduł 3, Ekran 8.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Długość kabla panel→falownik (jedna strona)"
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={dlugoscKablaM}
          onChange={(e) => setDlugoscKablaM(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="dlugosc" />}
        />
        <Pole
          label="Prąd roboczy (Imp)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="prad" />}
        />
        <Pole
          label="Napięcie robocze (Vmp)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="napiecie" />}
        />
        <Pole
          label="Przekrój kabla"
          unit="mm²"
          type="number"
          inputMode="decimal"
          min={0}
          value={przekrojMm2}
          onChange={(e) => setPrzekrojMm2(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="przekroj" />}
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
          etykieta="Strata mocy na kablu"
        >
          <WynikGlowny>{result.value.strataProcentowa.toFixed(1)}%</WynikGlowny>
          <p className="mt-2 text-small">
            Spadek napięcia: {result.value.spadekNapieciaV.toFixed(2)} V · strata mocy:{" "}
            {result.value.strataMocyW.toFixed(1)} W.
          </p>
          <div className="mt-3 flex flex-col gap-1 text-small">
            <p className="font-medium">Porównanie przekrojów:</p>
            {result.value.porownaniePrzekrojow.map((p) => (
              <p key={p.przekrojMm2}>
                {p.przekrojMm2} mm² → {p.strataProcentowa.toFixed(1)}%
              </p>
            ))}
          </div>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
