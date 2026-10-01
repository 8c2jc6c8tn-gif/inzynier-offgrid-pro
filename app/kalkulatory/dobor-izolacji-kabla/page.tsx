"use client"

import { useMemo } from "react"
import { calculateDoborIzolacjiKabla } from "@/lib/core/modules/okablowanie/dobor-izolacji-kabla/calculator"
import type { Izolacja, MiejsceTrasy } from "@/lib/core/modules/okablowanie/dobor-izolacji-kabla/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const ETYKIETY_MIEJSC: Record<MiejsceTrasy, string> = {
  ziemia: "UI-DOBIZOKAB-ZIEMI",
  "zewnetrznie-blisko-paneli": "UI-DOBIZOKAB-ZEWNETRZNIE-BLISKO-PANELI",
  wewnatrz: "UI-DOBIZOKAB-WEWNATRZ-BUDYNKU",
  napowietrznie: "UI-DOBIZOKAB-NAPOWIETRZNIE",
}

type FormularzStan = {
  miejsceTrasy: MiejsceTrasy | ""
  izolacjaWybrana: Izolacja | ""
  temperaturaMaksymalnaC: string
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsceTrasy: "",
  izolacjaWybrana: "",
  temperaturaMaksymalnaC: "",
}

export default function DoborIzolacjiKablaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-izolacji-kabla", STAN_POCZATKOWY)
  const { miejsceTrasy, izolacjaWybrana, temperaturaMaksymalnaC } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMiejsceTrasy = (a: (MiejsceTrasy | "") | ((p: MiejsceTrasy | "") => MiejsceTrasy | "")) => setPole("miejsceTrasy", a)
  const setIzolacjaWybrana = (a: (Izolacja | "") | ((p: Izolacja | "") => Izolacja | "")) => setPole("izolacjaWybrana", a)
  const setTemperaturaMaksymalnaC = (a: string | ((p: string) => string)) => setPole("temperaturaMaksymalnaC", a)

  const result = useMemo(
    () =>
      calculateDoborIzolacjiKabla({
        miejsceTrasy: miejsceTrasy === "" ? null : miejsceTrasy,
        izolacjaWybrana: izolacjaWybrana === "" ? null : izolacjaWybrana,
        temperaturaMaksymalnaC: temperaturaMaksymalnaC === "" ? 0 : Number(temperaturaMaksymalnaC),
      }),
    [miejsceTrasy, izolacjaWybrana, temperaturaMaksymalnaC],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-DOBIZOKAB-POLICZYC"),
    incomplete: t("UI-DOBIZOKAB-WYPELNIJ-WSZYSTKIE-POLA"),
    red: t("UI-DOBIZOKAB-ZABRONIONE-IZOLACJA-WYTRZYMA"),
    green: t("UI-DOBIZOKAB-IZOLACJA-WYSTARCZAJACA"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-izolacji-kabla" />
      <NaglowekEkranu
        tytul={t("UI-DOBIZOKAB-DOBOR-IZOLACJI-KABLA")}
        ekran="dobor-izolacji-kabla"
        wynik={result}
      >
        {t("UI-DOBIZOKAB-IZOLACJA-SKORA-KABLA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-DOBIZOKAB-MIEJSCE-TRASY-INFORMACYJNIE")}
          value={miejsceTrasy}
          onChange={(e) => setMiejsceTrasy(e.target.value as MiejsceTrasy)}
          pomoc={<PomocPola ekran="dobor-izolacji-kabla" pole="miejsce" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {(Object.keys(ETYKIETY_MIEJSC) as MiejsceTrasy[]).map((m) => (
            <option key={m} value={m}>
              {t(ETYKIETY_MIEJSC[m])}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-DOBIZOKAB-ROZWAZANA-IZOLACJA-KABLA")}
          value={izolacjaWybrana}
          onChange={(e) => setIzolacjaWybrana(e.target.value as Izolacja)}
          pomoc={<PomocPola ekran="dobor-izolacji-kabla" pole="izolacja" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="PVC">{t("UI-DOBIZOKAB-PVC-DO-70")}</option>
          <option value="XLPE">{t("UI-DOBIZOKAB-XLPE-DO-90")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-DOBIZOKAB-MAKSYMALNA-SPODZIEWANA-TEMPE")}
          unit="°C"
          type="number"
          inputMode="decimal"
          min={0}
          value={temperaturaMaksymalnaC}
          onChange={(e) => setTemperaturaMaksymalnaC(e.target.value)}
          pomoc={<PomocPola ekran="dobor-izolacji-kabla" pole="temperatura" />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>{t("UI-DOBIZOKAB-IZOLACJA-WYTRZYMUJE", { maksTemperaturaIzolacjiC: result.value.maksTemperaturaIzolacjiC })}</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
