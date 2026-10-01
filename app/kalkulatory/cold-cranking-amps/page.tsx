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
import { useTranslate } from "@/lib/i18n/language-context"

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
  const t = useTranslate()
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
        tytul={t("UI-COLCRAAMP-COLD-CRANKING-AMPS")}
        ekran="cold-cranking-amps"
        wynik={result}
      >
        {t("UI-COLCRAAMP-ZIMNA-BATERIA-LENIWA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-COLCRAAMP-NAPIECIE-PAKIETU-BEZ")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieOtwartegoObwoduV}
          onChange={(e) => setNapiecieOtwartegoObwoduV(e.target.value)}
          pomoc={<PomocPola ekran="cold-cranking-amps" pole="napiecie" />}
        />
        <Pole
          label={t("UI-COLCRAAMP-PRAD-ROZRUCHOWY-ODBIORNIKA")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradRozruchowyA}
          onChange={(e) => setPradRozruchowyA(e.target.value)}
          pomoc={<PomocPola ekran="cold-cranking-amps" pole="pradRozruchu" />}
        />
        <Pole
          label={t("UI-COLCRAAMP-REZYSTANCJA-WEWNETRZNA-PAKIE")}
          unit="mΩ"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaWewnetrznaMOhm}
          onChange={(e) => setRezystancjaWewnetrznaMOhm(e.target.value)}
          pomoc={<PomocPola ekran="cold-cranking-amps" pole="rezystancja" />}
        />
        <Pole
          label={t("UI-COLCRAAMP-MINIMALNE-NAPIECIE-PRACY")}
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
        <WerdyktPanel poziom="blad" etykieta={t("UI-COLCRAAMP-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : poziom === null ? (
        <p className="text-small text-muted-foreground">{t("UI-COLCRAAMP-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={poziom === "ok" ? t("UI-COLCRAAMP-FALOWNIK-UTRZYMA-NAPIECIE") : t("UI-COLCRAAMP-FALOWNIK-WYLACZY")}
        >
          <WynikGlowny>{result.value.vSagV.toFixed(1)} V</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
