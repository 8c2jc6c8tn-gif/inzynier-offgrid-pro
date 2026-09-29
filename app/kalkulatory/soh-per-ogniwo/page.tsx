"use client"

import { useMemo } from "react"
import { calculateSohPerOgniwo } from "@/lib/core/modules/baterie/soh-per-ogniwo/calculator"
import { PROG_KRYTYCZNY_WZROSTU_PCT } from "@/lib/core/modules/baterie/soh-per-ogniwo/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  rezystancjaFabrycznaMOhm: string
  rezystancjaAktualnaMOhm: string
}

const STAN_POCZATKOWY: FormularzStan = {
  rezystancjaFabrycznaMOhm: "",
  rezystancjaAktualnaMOhm: "",
}

export default function SohPerOgniwoPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("soh-per-ogniwo", STAN_POCZATKOWY)
  const { rezystancjaFabrycznaMOhm, rezystancjaAktualnaMOhm } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setRezystancjaFabrycznaMOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaFabrycznaMOhm", a)
  const setRezystancjaAktualnaMOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaAktualnaMOhm", a)

  const result = useMemo(
    () =>
      calculateSohPerOgniwo({
        rezystancjaFabrycznaMOhm: rezystancjaFabrycznaMOhm === "" ? 0 : Number(rezystancjaFabrycznaMOhm),
        rezystancjaAktualnaMOhm: rezystancjaAktualnaMOhm === "" ? 0 : Number(rezystancjaAktualnaMOhm),
      }),
    [rezystancjaFabrycznaMOhm, rezystancjaAktualnaMOhm],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.value.doWymiany
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/soh-per-ogniwo" />
      <NaglowekEkranu
        tytul="SoH — diagnostyka per ogniwo"
        ekran="soh-per-ogniwo"
        wynik={result}
        parametry={{ progWzrostu: PROG_KRYTYCZNY_WZROSTU_PCT }}
      >
        Rosnąca rezystancja jednego ogniwa to jak zatkane naczynie krwionośne — reszta układu
        musi pracować ciężej, żeby to skompensować. Moduł 4, Ekran 14.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Rezystancja wewnętrzna fabryczna (nowe ogniwo)"
          unit="mΩ"
          type="number"
          inputMode="decimal"
          value={rezystancjaFabrycznaMOhm}
          onChange={(e) => setRezystancjaFabrycznaMOhm(e.target.value)}
          pomoc={<PomocPola ekran="soh-per-ogniwo" pole="rFabryczna" />}
        />
        <Pole
          label="Rezystancja wewnętrzna aktualna"
          unit="mΩ"
          type="number"
          inputMode="decimal"
          value={rezystancjaAktualnaMOhm}
          onChange={(e) => setRezystancjaAktualnaMOhm(e.target.value)}
          pomoc={<PomocPola ekran="soh-per-ogniwo" pole="rAktualna" params={{ progWzrostu: PROG_KRYTYCZNY_WZROSTU_PCT }} />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć ocenę stanu ogniwa.
        </p>
      ) : (
        poziom !== null && (
          <WerdyktPanel poziom={poziom} etykieta={result.value.doWymiany ? "Ogniwo do wymiany" : "Ogniwo OK"}>
            <WynikGlowny>
              +{result.value.wzrostPct.toLocaleString("pl-PL", { maximumFractionDigits: 0 })}% względem fabrycznej
            </WynikGlowny>
            <p className="mt-1 text-small">Próg krytyczny: {PROG_KRYTYCZNY_WZROSTU_PCT}%.</p>
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-2 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
