"use client"

import { useMemo } from "react"
import { calculateMontazObudowa } from "@/lib/core/modules/esp32/montaz-obudowa/calculator"
import { MIN_ODSTEP_OD_SZYN_CM } from "@/lib/core/modules/esp32/montaz-obudowa/constants"
import type { MiejsceMontazuEsp32, SposobMontazuEsp32 } from "@/lib/core/modules/esp32/montaz-obudowa/input"
import { OPCJE_IP_MALE_INSTALACJE } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type TakNie = "tak" | "nie" | ""

type FormularzStan = {
  miejsce: MiejsceMontazuEsp32 | ""
  ipKod: string
  montaz: SposobMontazuEsp32 | ""
  odstepOdSzynCm: string
  wentylacja: TakNie
  izolacja: TakNie
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsce: "",
  ipKod: "",
  montaz: "",
  odstepOdSzynCm: "",
  wentylacja: "",
  izolacja: "",
}

const doLiczby = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")))
const doTakNie = (v: TakNie) => (v === "" ? null : v === "tak")
const PARAMETRY = { odstep: MIN_ODSTEP_OD_SZYN_CM }

export default function MontazObudowaEsp32Page() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("montaz-obudowa-esp32", STAN_POCZATKOWY)
  const result = useMemo(
    () =>
      calculateMontazObudowa({
        miejsce: stan.miejsce === "" ? null : stan.miejsce,
        ipKod: doLiczby(stan.ipKod),
        montaz: stan.montaz === "" ? null : stan.montaz,
        odstepOdSzynCm: doLiczby(stan.odstepOdSzynCm),
        wentylacja: doTakNie(stan.wentylacja),
        izolacjaOdCzesciPodNapieciem: doTakNie(stan.izolacja),
      }),
    [stan],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const ustaw = <K extends keyof FormularzStan>(pole: K, v: FormularzStan[K]) => setStan((prev) => ({ ...prev, [pole]: v }))

  const takNie = (pole: "wentylacja" | "izolacja", klucz: string) => (
    <PoleSelect
      label={t(klucz)}
      value={stan[pole]}
      onChange={(e) => ustaw(pole, e.target.value as TakNie)}
      pomoc={<PomocPola ekran="montaz-obudowa-esp32" pole={pole} />}
    >
      <option value="">{t("UI-WYBIERZ")}</option>
      <option value="tak">{t("UI-TAK-DUZE")}</option>
      <option value="nie">{t("UI-NIE-DUZE")}</option>
    </PoleSelect>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/montaz-obudowa-esp32" />
      <NaglowekEkranu tytul={t("UI-M9-E3-TYTUL")} ekran="montaz-obudowa-esp32" wynik={result} parametry={PARAMETRY}>
        {t("UI-M9-E3-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-2">
        <h2 className="text-small font-semibold">{t("UI-M9-E3-KROKI-H")}</h2>
        <ol className="list-decimal pl-5 text-small text-muted-foreground">
          {[1, 2, 3, 4, 5].map((n) => (
            <li key={n}>{t(`UI-M9-E3-KROK-${n}`, PARAMETRY)}</li>
          ))}
        </ol>
        <p className="text-caption text-muted-foreground">{t("UI-M9-E3-PRZYKLAD", PARAMETRY)}</p>
      </section>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-M9-E3-MIEJSCE")}
          value={stan.miejsce}
          onChange={(e) => ustaw("miejsce", e.target.value as FormularzStan["miejsce"])}
          pomoc={<PomocPola ekran="montaz-obudowa-esp32" pole="miejsce" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="suche">{t("UI-M9-E3-M-SUCHE")}</option>
          <option value="wilgotne">{t("UI-M9-E3-M-WILGOTNE")}</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-M9-E3-IP")}
          value={stan.ipKod}
          onChange={(e) => ustaw("ipKod", e.target.value)}
          pomoc={<PomocPola ekran="montaz-obudowa-esp32" pole="ipKod" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {OPCJE_IP_MALE_INSTALACJE.map((o) => (
            <option key={o.kod} value={String(o.kod)}>
              {`IP${o.kod}`}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-M9-E3-MONTAZ")}
          value={stan.montaz}
          onChange={(e) => ustaw("montaz", e.target.value as FormularzStan["montaz"])}
          pomoc={<PomocPola ekran="montaz-obudowa-esp32" pole="montaz" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="din">{t("UI-M9-E3-DIN")}</option>
          <option value="plyta">{t("UI-M9-E3-PLYTA")}</option>
          <option value="inny">{t("UI-M9-E3-INNY")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-M9-E3-ODSTEP")}
          unit={t("UI-M9-J-CM")}
          inputMode="decimal"
          value={stan.odstepOdSzynCm}
          onChange={(e) => ustaw("odstepOdSzynCm", e.target.value)}
          pomoc={<PomocPola ekran="montaz-obudowa-esp32" pole="odstepOdSzynCm" params={PARAMETRY} />}
        />
        {takNie("wentylacja", "UI-M9-E3-WENTYLACJA")}
        {takNie("izolacja", "UI-M9-E3-IZOLACJA")}
      </div>

      {result.status === "INCOMPLETE" && !hasCritical && !hasWarning ? (
        <p className="text-small text-muted-foreground">{t("UI-M9-E3-WYBIERZ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={t(hasCritical ? "UI-M9-E3-W-BLAD" : hasWarning ? "UI-M9-E3-W-UWAGA" : "UI-M9-E3-W-OK")}
        >
          {result.value.zalecaneIp !== null && (
            <WynikGlowny>{t("UI-M9-E3-ZALECANA", { ip: result.value.zalecaneIp })}</WynikGlowny>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
