"use client"

import { useMemo } from "react"
import { calculateSecondLife } from "@/lib/core/modules/baterie/second-life/calculator"
import type { MetodaSzacunkuSoh } from "@/lib/core/modules/baterie/second-life/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"
import { DEGRADACJA_NA_10000KM_PCT, DEGRADACJA_ROCZNA_PCT } from "@/lib/core/modules/baterie/second-life/constants"

type FormularzStan = {
  pojemnoscDeklarowanaKwh: string
  cenaZakupuZl: string
  metodaSzacunku: MetodaSzacunkuSoh
  wiekLata: string
  przebiegKm: string
  cenaNowejLiFePO4ZlZaKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscDeklarowanaKwh: "",
  cenaZakupuZl: "",
  metodaSzacunku: "",
  wiekLata: "",
  przebiegKm: "",
  cenaNowejLiFePO4ZlZaKwh: "",
}

/** Money fields converted when the display currency changes. */
const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("cenaZakupuZl", "cenaNowejLiFePO4ZlZaKwh")

export default function SecondLifePage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("second-life", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const { pojemnoscDeklarowanaKwh, cenaZakupuZl, metodaSzacunku, wiekLata, przebiegKm, cenaNowejLiFePO4ZlZaKwh } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscDeklarowanaKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscDeklarowanaKwh", a)
  const setCenaZakupuZl = (a: string | ((p: string) => string)) => setPole("cenaZakupuZl", a)
  const setMetodaSzacunku = (a: MetodaSzacunkuSoh | ((p: MetodaSzacunkuSoh) => MetodaSzacunkuSoh)) => setPole("metodaSzacunku", a)
  const setWiekLata = (a: string | ((p: string) => string)) => setPole("wiekLata", a)
  const setPrzebiegKm = (a: string | ((p: string) => string)) => setPole("przebiegKm", a)
  const setCenaNowejLiFePO4ZlZaKwh = (a: string | ((p: string) => string)) => setPole("cenaNowejLiFePO4ZlZaKwh", a)

  const result = useMemo(
    () =>
      calculateSecondLife({
        pojemnoscDeklarowanaKwh: pojemnoscDeklarowanaKwh === "" ? 0 : Number(pojemnoscDeklarowanaKwh),
        cenaZakupuZl: cenaZakupuZl === "" ? 0 : Number(cenaZakupuZl),
        metodaSzacunku,
        wiekLata: wiekLata === "" ? 0 : Number(wiekLata),
        przebiegKm: przebiegKm === "" ? 0 : Number(przebiegKm),
        cenaNowejLiFePO4ZlZaKwh: cenaNowejLiFePO4ZlZaKwh === "" ? null : Number(cenaNowejLiFePO4ZlZaKwh),
      }),
    [pojemnoscDeklarowanaKwh, cenaZakupuZl, metodaSzacunku, wiekLata, przebiegKm, cenaNowejLiFePO4ZlZaKwh],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : hasCritical
        ? "blad"
        : result.status === "VALID"
          ? "ok"
          : result.status === "VALID_WITH_WARNINGS"
            ? "uwaga"
            : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/second-life" />
      <NaglowekEkranu
        tytul={t("UI-SECLIF-ANALIZA-SECOND-LIFE")}
        ekran="second-life"
        wynik={result}
        parametry={{ degRok: DEGRADACJA_ROCZNA_PCT, degKm: DEGRADACJA_NA_10000KM_PCT }}
      >
        {t("UI-SECLIF-KUPUJESZ-KOTA-WORKU")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-SECLIF-DEKLAROWANA-POJEMNOSC")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={pojemnoscDeklarowanaKwh}
          onChange={(e) => setPojemnoscDeklarowanaKwh(e.target.value)}
          pomoc={<PomocPola ekran="second-life" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-SECLIF-CENA-ZAKUPU")}
          unit={t("UI-J-ZL")}
          type="number"
          inputMode="decimal"
          value={cenaZakupuZl}
          onChange={(e) => setCenaZakupuZl(e.target.value)}
          pomoc={<PomocPola ekran="second-life" pole="cena" />}
        />
        <PoleSelect
          label={t("UI-SECLIF-METODA-SZACUNKU-SOH")}
          value={metodaSzacunku}
          onChange={(e) => setMetodaSzacunku(e.target.value as MetodaSzacunkuSoh)}
          pomoc={<PomocPola ekran="second-life" pole="metoda" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="wiek">{t("UI-SECLIF-WIEKU-BATERII")}</option>
          <option value="przebieg">{t("UI-SECLIF-PRZEBIEGU-POJAZDU")}</option>
        </PoleSelect>
        {metodaSzacunku === "wiek" && (
          <Pole
            label={t("UI-SECLIF-WIEK-BATERII")}
            unit={t("UI-SECLIF-LATA")}
            type="number"
            inputMode="numeric"
            value={wiekLata}
            onChange={(e) => setWiekLata(e.target.value)}
            pomoc={<PomocPola ekran="second-life" pole="wiek" params={{ degRok: DEGRADACJA_ROCZNA_PCT, degKm: DEGRADACJA_NA_10000KM_PCT }} />}
          />
        )}
        {metodaSzacunku === "przebieg" && (
          <Pole
            label={t("UI-SECLIF-PRZEBIEG-POJAZDU")}
            unit="km"
            type="number"
            inputMode="numeric"
            value={przebiegKm}
            onChange={(e) => setPrzebiegKm(e.target.value)}
            pomoc={<PomocPola ekran="second-life" pole="przebieg" params={{ degRok: DEGRADACJA_ROCZNA_PCT, degKm: DEGRADACJA_NA_10000KM_PCT }} />}
          />
        )}
        <Pole
          label={t("UI-SECLIF-CENA-NOWEJ-BATERII")}
          unit={t("UI-J-ZL-KWH")}
          type="number"
          inputMode="decimal"
          value={cenaNowejLiFePO4ZlZaKwh}
          onChange={(e) => setCenaNowejLiFePO4ZlZaKwh(e.target.value)}
          pomoc={<PomocPola ekran="second-life" pole="cenaNowej" />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-SECLIF-WYPELNIJ-DANE-ZEBY")}
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-SECLIF-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null &&
        poziom !== "blad" && (
          <WerdyktPanel poziom={poziom} etykieta={t("UI-SECLIF-SZACOWANY-SOH", { sohSzacowanyPct: result.value.sohSzacowanyPct.toFixed(0) })}>
            <WynikGlowny>
              {t("UI-SECLIF-KWH", { kosztZaKwh: formatLiczbe(result.value.kosztZaKwh, { maximumFractionDigits: 0 }) })}
            </WynikGlowny>
            <p className="mt-1 text-small">
              {t("UI-SECLIF-POJEMNOSC-UZYTECZNA-KWH", { pojemnoscUzytecznaKwh: formatLiczbe(result.value.pojemnoscUzytecznaKwh, { maximumFractionDigits: 1 }) })}
            </p>
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-2 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
