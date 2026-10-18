"use client"

import { useMemo } from "react"
import { calculatePanelDoStacjiZasilania } from "@/lib/core/modules/kalkulator-mobilny/panel-do-stacji-zasilania/calculator"
import {
  BETA_TYPOWA_MAX_PCT_NA_C,
  BETA_TYPOWA_MIN_PCT_NA_C,
  TEMPERATURA_REFERENCYJNA_STC_C,
} from "@/lib/core/modules/pv/stress-test-mppt/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  vocStcV: string
  betaPctNaC: string
  tminC: string
  liczbaSzeregowo: string
  maxNapiecieWejsciaV: string
  iscA: string
  liczbaRownolegle: string
  maxPradWejsciaA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  vocStcV: "",
  betaPctNaC: "",
  tminC: "",
  liczbaSzeregowo: "",
  maxNapiecieWejsciaV: "",
  iscA: "",
  liczbaRownolegle: "",
  maxPradWejsciaA: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))

export default function PanelDoStacjiZasilaniaPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const f1 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("panel-do-stacji-zasilania", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculatePanelDoStacjiZasilania({
        vocStcV: liczba(stan.vocStcV),
        betaPctNaC: liczba(stan.betaPctNaC),
        tminC: stan.tminC === "" ? null : Number(stan.tminC),
        liczbaSzeregowo: liczba(stan.liczbaSzeregowo),
        maxNapiecieWejsciaV: liczba(stan.maxNapiecieWejsciaV),
        iscA: liczba(stan.iscA),
        liczbaRownolegle: liczba(stan.liczbaRownolegle),
        maxPradWejsciaA: liczba(stan.maxPradWejsciaA),
      }),
    [stan],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical")
    ? "blad"
    : result.warnings.some((w) => w.level === "warning")
      ? "uwaga"
      : "ok"
  const etykieta = { blad: t("UI-PANDOSTAZAS-PRZEKROCZONY-LIMIT-WEJSCIA"), uwaga: t("UI-PANDOSTAZAS-GRANICY-SPRAWDZ"), ok: t("UI-PANDOSTAZAS-MOZNA-PODLACZYC") }[poziom]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/panel-do-stacji-zasilania" />
      <NaglowekEkranu
        tytul={t("UI-PANDOSTAZAS-LACZENIE-PANELI-STACJA")}
        ekran="panel-do-stacji-zasilania"
        wynik={result}
        parametry={{ tStc: TEMPERATURA_REFERENCYJNA_STC_C }}
      >
        {t("UI-PANDOSTAZAS-STACJE-ZASILANIA-MAJA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label={t("UI-PANDOSTAZAS-VOC-PANELU-STC")} unit="V" type="number" inputMode="decimal" min={0} value={stan.vocStcV} onChange={ustaw("vocStcV")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="voc" />} />
        <Pole
          label={t("UI-PANDOSTAZAS-WSPOLCZYNNIK-TEMPERATUROWY-V")}
          unit="%/°C"
          type="number"
          inputMode="decimal"
          value={stan.betaPctNaC}
          onChange={ustaw("betaPctNaC")}
          pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="beta" params={{ betaMin: BETA_TYPOWA_MIN_PCT_NA_C, betaMax: BETA_TYPOWA_MAX_PCT_NA_C }} />}
        />
        <Pole label={t("UI-PANDOSTAZAS-NAJNIZSZA-TEMPERATURA-PRACY")} unit="°C" type="number" inputMode="decimal" value={stan.tminC} onChange={ustaw("tminC")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="tmin" />} />
        <Pole label={t("UI-PANDOSTAZAS-PANELI-POLACZONYCH-SZEREGOWO")} type="number" inputMode="numeric" min={0} value={stan.liczbaSzeregowo} onChange={ustaw("liczbaSzeregowo")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="szeregowo" />} />
        <Pole label={t("UI-PANDOSTAZAS-MAX-NAPIECIE-WEJSCIA")} unit="V" type="number" inputMode="decimal" min={0} value={stan.maxNapiecieWejsciaV} onChange={ustaw("maxNapiecieWejsciaV")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="limitNapiecia" />} />
        <p className="text-small text-muted-foreground">{t("UI-PANDOSTAZAS-OPCJONALNIE-SPRAWDZENIE-PRAD")}</p>
        <Pole label={t("UI-PANDOSTAZAS-PRAD-ZWARCIOWY-PANELU")} unit="A" type="number" inputMode="decimal" min={0} value={stan.iscA} onChange={ustaw("iscA")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="isc" />} />
        <Pole label={t("UI-PANDOSTAZAS-GALEZI-ROWNOLEGLYCH")} type="number" inputMode="numeric" min={0} value={stan.liczbaRownolegle} onChange={ustaw("liczbaRownolegle")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="rownolegle" />} />
        <Pole label={t("UI-PANDOSTAZAS-MAX-PRAD-WEJSCIA")} unit="A" type="number" inputMode="decimal" min={0} value={stan.maxPradWejsciaA} onChange={ustaw("maxPradWejsciaA")} pomoc={<PomocPola ekran="panel-do-stacji-zasilania" pole="limitPradu" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PANDOSTAZAS-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-PANDOSTAZAS-WYPELNIJ-PIEC-PIERWSZYCH")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>{f1(result.value.vocZimoweV)} V</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-PANDOSTAZAS-LIMITU-WEJSCIA", { udzialLimituPct: f0(result.value.udzialLimituPct) })}
            {result.value.pradZwarciowyA !== null && ` ${t("UI-PANDOSTAZAS-PRAD-ZWARCIOWY", { pradZwarciowyA: f1(result.value.pradZwarciowyA) })}`}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
