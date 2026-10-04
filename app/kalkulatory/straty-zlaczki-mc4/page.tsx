"use client"

import { useMemo } from "react"
import { calculateStratyZlaczkiMc4 } from "@/lib/core/modules/pv/straty-zlaczki-mc4/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { MNOZNIK_ZLY_STYK, REZYSTANCJA_DOBRY_STAN_MAX_MOHM, REZYSTANCJA_DOBRY_STAN_MIN_MOHM } from "@/lib/core/modules/pv/straty-zlaczki-mc4/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  rezystancjaZlaczkiMOhm: string
  liczbaZlaczek: string
  pradA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  rezystancjaZlaczkiMOhm: "",
  liczbaZlaczek: "",
  pradA: "",
}

export default function StratyZlaczkiMc4Page() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("straty-zlaczki-mc4", STAN_POCZATKOWY)
  const { rezystancjaZlaczkiMOhm, liczbaZlaczek, pradA } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setRezystancjaZlaczkiMOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaZlaczkiMOhm", a)
  const setLiczbaZlaczek = (a: string | ((p: string) => string)) => setPole("liczbaZlaczek", a)
  const setPradA = (a: string | ((p: string) => string)) => setPole("pradA", a)

  const result = useMemo(
    () =>
      calculateStratyZlaczkiMc4({
        rezystancjaZlaczkiMOhm: rezystancjaZlaczkiMOhm === "" ? 0 : Number(rezystancjaZlaczkiMOhm),
        liczbaZlaczek: liczbaZlaczek === "" ? 0 : Number(liczbaZlaczek),
        pradA: pradA === "" ? 0 : Number(pradA),
      }),
    [rezystancjaZlaczkiMOhm, liczbaZlaczek, pradA],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/straty-zlaczki-mc4" />
      <NaglowekEkranu
        tytul={t("UI-STRZLAMC4-STRATY-ZLACZKACH-MC4")}
        ekran="straty-zlaczki-mc4"
        wynik={result}
        parametry={{ rMin: REZYSTANCJA_DOBRY_STAN_MIN_MOHM, rMax: REZYSTANCJA_DOBRY_STAN_MAX_MOHM, mnoznik: MNOZNIK_ZLY_STYK }}
      >
        {t("UI-STRZLAMC4-MALE-ZLACZKI-DUZE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-STRZLAMC4-REZYSTANCJA-JEDNEJ-ZLACZKI")}
          unit="mΩ"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          value={rezystancjaZlaczkiMOhm}
          onChange={(e) => setRezystancjaZlaczkiMOhm(e.target.value)}
          pomoc={<PomocPola ekran="straty-zlaczki-mc4" pole="rezystancja" params={{ rMin: REZYSTANCJA_DOBRY_STAN_MIN_MOHM, rMax: REZYSTANCJA_DOBRY_STAN_MAX_MOHM, mnoznik: MNOZNIK_ZLY_STYK }} />}
        />
        <Pole
          label={t("UI-STRZLAMC4-LICZBA-ZLACZEK")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaZlaczek}
          onChange={(e) => setLiczbaZlaczek(e.target.value)}
          pomoc={<PomocPola ekran="straty-zlaczki-mc4" pole="liczba" />}
        />
        <Pole
          label={t("UI-STRZLAMC4-PRAD")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
          pomoc={<PomocPola ekran="straty-zlaczki-mc4" pole="prad" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-STRZLAMC4-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-STRZLAMC4-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta={t("UI-STRZLAMC4-STRATA-CALKOWITA-ZLACZKACH")}>
          <WynikGlowny>{result.value.strataCalkowitaW.toFixed(1)} W</WynikGlowny>
          <p className="mt-2 text-small">{t("UI-STRZLAMC4-STRATA-JEDNA-ZLACZKE", { strataNaZlaczkeW: result.value.strataNaZlaczkeW.toFixed(2) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
