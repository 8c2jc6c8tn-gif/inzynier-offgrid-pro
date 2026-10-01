"use client"

import { useMemo } from "react"
import { calculateNapiecieOdciecia } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/calculator"
import { LICZBA_OGNIW_SUGEROWANA } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KALIBRACJA_NAPIECIE_OGNIWO_MAX_V, KALIBRACJA_NAPIECIE_OGNIWO_MIN_V } from "@/lib/core/modules/baterie/napiecie-odciecia-a-zywotnosc/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  napiecieOdcieciaV: string
  liczbaOgniwSzeregowo: string
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieOdcieciaV: "",
  liczbaOgniwSzeregowo: String(LICZBA_OGNIW_SUGEROWANA),
}

export default function NapiecieOdcieciaAZywotnoscPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("napiecie-odciecia-a-zywotnosc", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: string) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const { napiecieOdcieciaV, liczbaOgniwSzeregowo } = stan

  const result = useMemo(
    () =>
      calculateNapiecieOdciecia({
        napiecieOdcieciaV: napiecieOdcieciaV === "" ? 0 : Number(napiecieOdcieciaV),
        liczbaOgniwSzeregowo: liczbaOgniwSzeregowo === "" ? 0 : Number(liczbaOgniwSzeregowo),
      }),
    [napiecieOdcieciaV, liczbaOgniwSzeregowo],
  )

  const poziom = result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/napiecie-odciecia-a-zywotnosc" />
      <NaglowekEkranu
        tytul={t("UI-NAPODCAZYW-NAPIECIE-ODCIECIA-ZYWOTNOSC")}
        ekran="napiecie-odciecia-a-zywotnosc"
        wynik={result}
        parametry={{ vMin: KALIBRACJA_NAPIECIE_OGNIWO_MIN_V, vMax: KALIBRACJA_NAPIECIE_OGNIWO_MAX_V }}
      >
        {t("UI-NAPODCAZYW-WYCISKAJ-BATERII-OSTATNIEJ")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-NAPODCAZYW-NAPIECIE-ODCIECIA-USTAWIONE")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.napiecieOdcieciaV}
          onChange={(e) => setPole("napiecieOdcieciaV", e.target.value)}
          pomoc={<PomocPola ekran="napiecie-odciecia-a-zywotnosc" pole="napiecie" />}
        />
        <Pole
          label={t("UI-NAPODCAZYW-LICZBA-OGNIW-POLACZONYCH")}
          unit=""
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={stan.liczbaOgniwSzeregowo}
          onChange={(e) => setPole("liczbaOgniwSzeregowo", e.target.value)}
          pomoc={<PomocPola ekran="napiecie-odciecia-a-zywotnosc" pole="ogniwa" params={{ ogniwa: LICZBA_OGNIW_SUGEROWANA }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-NAPODCAZYW-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-NAPODCAZYW-WYPELNIJ-OBA-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-NAPODCAZYW-DOD", { dodPct: result.value.dodPct.toFixed(0) })}>
          <WynikGlowny>{t("UI-NAPODCAZYW-CYKLI", { cykleZycia: result.value.cykleZycia.toLocaleString("pl-PL") })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-NAPODCAZYW-OGNIWO", { napiecieOgniwaV: result.value.napiecieOgniwaV.toFixed(3), liczbaOgniwSzeregowo: stan.liczbaOgniwSzeregowo })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
