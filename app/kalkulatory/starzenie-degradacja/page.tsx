"use client"

import { useMemo } from "react"
import Link from "next/link"
import { calculateStarzenieDegradacja } from "@/lib/core/modules/baterie/starzenie-degradacja/calculator"
import type { HoryzontLata } from "@/lib/core/modules/baterie/starzenie-degradacja/input"
import {
  DEGRADACJA_TYPOWA_MAX_PCT,
  DEGRADACJA_TYPOWA_MIN_PCT,
} from "@/lib/core/modules/baterie/starzenie-degradacja/constants"
import { useWynikiDoProjektu } from "@/lib/projekt/use-wyniki-do-projektu"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscUzytecznaDzisKwh: string
  horyzontLata: HoryzontLata
  degradacjaRocznaPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscUzytecznaDzisKwh: "",
  horyzontLata: 10,
  degradacjaRocznaPct: "",
}

export default function StarzenieDegradacjaPage() {
  const t = useTranslate()
  const [stan, setStan, , , projekt] = usePersistedDraft<FormularzStan>("starzenie-degradacja", STAN_POCZATKOWY, {
    projekt: { pojemnoscUzytecznaDzisKwh: "pojemnoscUzytecznaKwh" },
  })
  const { pojemnoscUzytecznaDzisKwh, horyzontLata, degradacjaRocznaPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscUzytecznaDzisKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscUzytecznaDzisKwh", a)
  const setHoryzontLata = (a: HoryzontLata | ((p: HoryzontLata) => HoryzontLata)) => setPole("horyzontLata", a)
  const setDegradacjaRocznaPct = (a: string | ((p: string) => string)) => setPole("degradacjaRocznaPct", a)

  const result = useMemo(
    () =>
      calculateStarzenieDegradacja({
        pojemnoscUzytecznaDzisKwh: pojemnoscUzytecznaDzisKwh === "" ? 0 : Number(pojemnoscUzytecznaDzisKwh),
        horyzontLata,
        degradacjaRocznaPct: degradacjaRocznaPct === "" ? 0 : Number(degradacjaRocznaPct),
      }),
    [pojemnoscUzytecznaDzisKwh, horyzontLata, degradacjaRocznaPct],
  )

  // Project (owner decision 23.11.2026): the usable capacity comes from the project (saved from „Dobór pojemności”) and
  // follows it until the user types their own; the capacity with the ageing buffer is offered back from the quiet bar.
  useWynikiDoProjektu("starzenie-degradacja", { pojemnoscZBuforemKwh: result.status === "VALID" ? Number(result.value.pojemnoscPoczatkowaKwh.toFixed(2)) : null })

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/starzenie-degradacja" />
      <NaglowekEkranu tytul={t("UI-STADEG-STARZENIE-DEGRADACJA-OGNIW")} ekran="starzenie-degradacja" wynik={result}>
        {t("UI-STADEG-KUPUJESZ-BATERIE-DZIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-STADEG-POJEMNOSC-UZYTECZNA-POTRZEBN")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscUzytecznaDzisKwh}
          projekt={projekt.pole("pojemnoscUzytecznaDzisKwh")}
          onChange={(e) => setPojemnoscUzytecznaDzisKwh(e.target.value)}
          pomoc={<PomocPola ekran="starzenie-degradacja" pole="pojemnoscDzis" />}
        />

        <PoleSelect
          label={t("UI-STADEG-HORYZONT-PROJEKTOWY")}
          value={horyzontLata}
          onChange={(e) => setHoryzontLata(Number(e.target.value) as HoryzontLata)}
          pomoc={<PomocPola ekran="starzenie-degradacja" pole="horyzont" />}
        >
          <option value={5}>{t("UI-STADEG-LAT")}</option>
          <option value={10}>{t("UI-STADEG-LAT-2")}</option>
          <option value={15}>{t("UI-STADEG-LAT-3")}</option>
        </PoleSelect>

        <Pole
          label={t("UI-STADEG-ROCZNY-SPADEK-POJEMNOSCI")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={degradacjaRocznaPct}
          onChange={(e) => setDegradacjaRocznaPct(e.target.value)}
          pomoc={<PomocPola ekran="starzenie-degradacja" pole="degradacja" params={{ degMin: DEGRADACJA_TYPOWA_MIN_PCT, degMax: DEGRADACJA_TYPOWA_MAX_PCT }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-STADEG-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-STADEG-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-STADEG-WYMAGANA-POJEMNOSC-POCZATKOW")}>
          <WynikGlowny>{result.value.pojemnoscPoczatkowaKwh.toFixed(1)} kWh</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-STADEG-LATACH-ZOSTANIE-POJEMNOSCI", { horyzontLata, p: (result.value.ulamekPozostalyPoHoryzoncie * 100).toFixed(0) })}
          </p>
          <p className="mt-1 text-small text-muted-foreground">
            {t("UI-STADEG-TEN-WYNIK-TERAZ")}
            <Link href="/kalkulatory/dobor-pojemnosci-baterii" className="underline">
              {t("UI-STADEG-EKRANIE-DOBOR-POJEMNOSCI")}
            </Link>
            .
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
