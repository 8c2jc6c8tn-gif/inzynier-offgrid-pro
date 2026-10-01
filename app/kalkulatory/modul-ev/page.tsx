"use client"

import { useMemo } from "react"
import { calculateModulEv } from "@/lib/core/modules/baterie/modul-ev/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  energiaDobowaEvKwh: string
  nadwyzkaPvLatemKwh: string
  nadwyzkaPvZimaKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  energiaDobowaEvKwh: "",
  nadwyzkaPvLatemKwh: "",
  nadwyzkaPvZimaKwh: "",
}

export default function ModulEvPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("modul-ev", STAN_POCZATKOWY)
  const { energiaDobowaEvKwh, nadwyzkaPvLatemKwh, nadwyzkaPvZimaKwh } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setEnergiaDobowaEvKwh = (a: string | ((p: string) => string)) => setPole("energiaDobowaEvKwh", a)
  const setNadwyzkaPvLatemKwh = (a: string | ((p: string) => string)) => setPole("nadwyzkaPvLatemKwh", a)
  const setNadwyzkaPvZimaKwh = (a: string | ((p: string) => string)) => setPole("nadwyzkaPvZimaKwh", a)

  const result = useMemo(
    () =>
      calculateModulEv({
        energiaDobowaEvKwh: energiaDobowaEvKwh === "" ? 0 : Number(energiaDobowaEvKwh),
        nadwyzkaPvLatemKwh: nadwyzkaPvLatemKwh === "" ? null : Number(nadwyzkaPvLatemKwh),
        nadwyzkaPvZimaKwh: nadwyzkaPvZimaKwh === "" ? null : Number(nadwyzkaPvZimaKwh),
      }),
    [energiaDobowaEvKwh, nadwyzkaPvLatemKwh, nadwyzkaPvZimaKwh],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/modul-ev" />
      <NaglowekEkranu tytul={t("UI-MODEV-MODUL-LADOWANIE-SAMOCHODU")} ekran="modul-ev">
        {t("UI-MODEV-DODATKOWY-ODBIORNIK-DUZYM")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-MODEV-DOBOWE-ZAPOTRZEBOWANIE-LADOW")}
          unit={t("UI-J-KWH-DOBA")}
          type="number"
          inputMode="decimal"
          min={0}
          value={energiaDobowaEvKwh}
          onChange={(e) => setEnergiaDobowaEvKwh(e.target.value)}
          pomoc={<PomocPola ekran="modul-ev" pole="zapotrzebowanieEv" />}
        />
        <Pole
          label={t("UI-MODEV-NADWYZKA-PRODUKCJI-LATEM")}
          unit={t("UI-J-KWH-DOBA")}
          type="number"
          inputMode="decimal"
          min={0}
          value={nadwyzkaPvLatemKwh}
          onChange={(e) => setNadwyzkaPvLatemKwh(e.target.value)}
          pomoc={<PomocPola ekran="modul-ev" pole="nadwyzkaLato" />}
        />
        <Pole
          label={t("UI-MODEV-NADWYZKA-PRODUKCJI-ZIMA")}
          unit={t("UI-J-KWH-DOBA")}
          type="number"
          inputMode="decimal"
          min={0}
          value={nadwyzkaPvZimaKwh}
          onChange={(e) => setNadwyzkaPvZimaKwh(e.target.value)}
          pomoc={<PomocPola ekran="modul-ev" pole="nadwyzkaZima" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-MODEV-SPRAWDZ-WPISANE-DANE")}</p>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-MODEV-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={result.value.pokryteLatem && result.value.pokryteZima ? "ok" : "uwaga"}
          etykieta={t("UI-MODEV-POKRYCIE-LADOWANIA-NADWYZKA")}
        >
          <WynikGlowny>
            {result.value.pokryteLatem ? t("UI-MODEV-LATEM-POKRYTE") : t("UI-MODEV-LATEM-BRAK-KWH", { brakLatemKwh: result.value.brakLatemKwh.toFixed(1) })}
          </WynikGlowny>
          <p className="mt-1 text-body">
            {result.value.pokryteZima ? t("UI-MODEV-ZIMA-POKRYTE") : t("UI-MODEV-ZIMA-BRAK-KWH", { brakZimaKwh: result.value.brakZimaKwh.toFixed(1) })}
          </p>
          {result.warnings.map((w, i) => (
            <p key={i} className="mt-2 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
