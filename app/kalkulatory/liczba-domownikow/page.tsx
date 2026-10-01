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
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  liczbaDomownikow: string
}

const STAN_POCZATKOWY: FormularzStan = {
  liczbaDomownikow: "",
}

export default function LiczbaDomownikowPage() {
  const t = useTranslate()
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
        tytul={t("UI-LICDOM-LICZBA-DOMOWNIKOW")}
        ekran="liczba-domownikow" wynik={result}
        parametry={{ cwuMin: CWU_MIN_L_NA_OSOBE, cwuMax: CWU_MAX_L_NA_OSOBE }}
      >
        {t("UI-LICDOM-LISTA-RZECZY-BEZ")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-LICDOM-LICZBA-DOMOWNIKOW")}
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
          {t("UI-LICDOM-LICZBA-DOMOWNIKOW-MUSI", { MIN_DOMOWNIKOW, MAX_DOMOWNIKOW })}
        </p>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-LICDOM-WYBIERZ-LICZBE-DOMOWNIKOW")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-LICDOM-DOBOWE-ZAPOTRZEBOWANIE")}>
          <WynikGlowny>
            {t("UI-LICDOM-DOBE", { cwuMinLDoba: result.value.cwuMinLDoba, cwuMaxLDoba: result.value.cwuMaxLDoba })}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
