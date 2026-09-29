"use client"

import { useMemo } from "react"
import { calculateColdCrankingAmps } from "@/lib/core/modules/baterie/cold-cranking-amps/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  napiecieOtwartegoObwoduV: string
  pradRozruchowyA: string
  rezystancjaWewnetrznaMOhm: string
  minimalneNapiecieFalownikaV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieOtwartegoObwoduV: "",
  pradRozruchowyA: "",
  rezystancjaWewnetrznaMOhm: "",
  minimalneNapiecieFalownikaV: "",
}

export default function ColdCrankingAmpsPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("cold-cranking-amps", STAN_POCZATKOWY)
  const { napiecieOtwartegoObwoduV, pradRozruchowyA, rezystancjaWewnetrznaMOhm, minimalneNapiecieFalownikaV } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setNapiecieOtwartegoObwoduV = (a: string | ((p: string) => string)) => setPole("napiecieOtwartegoObwoduV", a)
  const setPradRozruchowyA = (a: string | ((p: string) => string)) => setPole("pradRozruchowyA", a)
  const setRezystancjaWewnetrznaMOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaWewnetrznaMOhm", a)
  const setMinimalneNapiecieFalownikaV = (a: string | ((p: string) => string)) => setPole("minimalneNapiecieFalownikaV", a)

  const result = useMemo(
    () =>
      calculateColdCrankingAmps({
        napiecieOtwartegoObwoduV: napiecieOtwartegoObwoduV === "" ? 0 : Number(napiecieOtwartegoObwoduV),
        pradRozruchowyA: pradRozruchowyA === "" ? 0 : Number(pradRozruchowyA),
        rezystancjaWewnetrznaMOhm: rezystancjaWewnetrznaMOhm === "" ? 0 : Number(rezystancjaWewnetrznaMOhm),
        minimalneNapiecieFalownikaV: minimalneNapiecieFalownikaV === "" ? 0 : Number(minimalneNapiecieFalownikaV),
      }),
    [napiecieOtwartegoObwoduV, pradRozruchowyA, rezystancjaWewnetrznaMOhm, minimalneNapiecieFalownikaV],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : result.value.falownikWytrzyma
          ? "ok"
          : "uwaga"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/cold-cranking-amps" />
      <NaglowekEkranu
        tytul="Cold Cranking Amps — zimny start dużych odbiorników"
        ekran="cold-cranking-amps"
        wzor={result.formula}
      >
        Zimna bateria to leniwa chemia — reakcje chemiczne wewnątrz zwalniają, więc bateria
        chwilowo „nie nadąża” z dostarczeniem prądu rozruchowego, nawet jeśli ma dużo energii.
        Moduł 4, Ekran 15.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie pakietu bez obciążenia"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieOtwartegoObwoduV}
          onChange={(e) => setNapiecieOtwartegoObwoduV(e.target.value)}
          pomoc={<PomocPola ekran="cold-cranking-amps" pole="napiecie" />}
        />
        <Pole
          label="Prąd rozruchowy odbiornika"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradRozruchowyA}
          onChange={(e) => setPradRozruchowyA(e.target.value)}
          pomoc={<PomocPola ekran="cold-cranking-amps" pole="pradRozruchu" />}
        />
        <Pole
          label="Rezystancja wewnętrzna pakietu"
          unit="mΩ"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaWewnetrznaMOhm}
          onChange={(e) => setRezystancjaWewnetrznaMOhm(e.target.value)}
          pomoc={<PomocPola ekran="cold-cranking-amps" pole="rezystancja" />}
        />
        <Pole
          label="Minimalne napięcie pracy falownika"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={minimalneNapiecieFalownikaV}
          onChange={(e) => setMinimalneNapiecieFalownikaV(e.target.value)}
          pomoc={<PomocPola ekran="cold-cranking-amps" pole="minFalownika" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : poziom === null ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={poziom === "ok" ? "Falownik utrzyma napięcie pracy" : "Falownik się wyłączy"}
        >
          <WynikGlowny>{result.value.vSagV.toFixed(1)} V</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
