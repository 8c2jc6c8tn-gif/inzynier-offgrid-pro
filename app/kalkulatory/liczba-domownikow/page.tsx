"use client"

import { useMemo } from "react"
import { calculateLiczbaDomownikow } from "@/lib/core/modules/zapotrzebowanie/liczba-domownikow/calculator"
import { MAX_DOMOWNIKOW, MIN_DOMOWNIKOW } from "@/lib/core/modules/zapotrzebowanie/liczba-domownikow/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { CWU_MAX_L_NA_OSOBE, CWU_MIN_L_NA_OSOBE } from "@/lib/core/modules/zapotrzebowanie/liczba-domownikow/constants"

type FormularzStan = {
  liczbaDomownikow: string
}

const STAN_POCZATKOWY: FormularzStan = {
  liczbaDomownikow: "",
}

export default function LiczbaDomownikowPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("liczba-domownikow", STAN_POCZATKOWY)
  const { liczbaDomownikow } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setLiczbaDomownikow = (a: string | ((p: string) => string)) => setPole("liczbaDomownikow", a)

  const result = useMemo(
    () =>
      calculateLiczbaDomownikow({
        liczbaDomownikow: liczbaDomownikow === "" ? 0 : Number(liczbaDomownikow),
      }),
    [liczbaDomownikow],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/liczba-domownikow" />
      <NaglowekEkranu
        tytul="Liczba domowników"
        ekran="liczba-domownikow"
        parametry={{ cwuMin: CWU_MIN_L_NA_OSOBE, cwuMax: CWU_MAX_L_NA_OSOBE }}
      >
        To jest lista rzeczy, bez których dom przestaje być bezpieczny do mieszkania — zasila
        automatycznie zapotrzebowanie na C.W.U. i profil zużycia wody. Moduł 2, Ekran 4.
      </NaglowekEkranu>

      <Pole
        label="Liczba domowników"
        unit="os."
        type="number"
        inputMode="numeric"
        min={MIN_DOMOWNIKOW}
        max={MAX_DOMOWNIKOW}
        step="1"
        value={liczbaDomownikow}
        onChange={(e) => setLiczbaDomownikow(e.target.value)}
        pomoc={<PomocPola ekran="liczba-domownikow" pole="liczba" params={{ min: MIN_DOMOWNIKOW, max: MAX_DOMOWNIKOW }} />}
      />

      {result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">
          Liczba domowników musi być z zakresu {MIN_DOMOWNIKOW}–{MAX_DOMOWNIKOW}.
        </p>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz liczbę domowników, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Dobowe zapotrzebowanie na C.W.U.">
          <WynikGlowny>
            {result.value.cwuMinLDoba}–{result.value.cwuMaxLDoba} l/dobę
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
