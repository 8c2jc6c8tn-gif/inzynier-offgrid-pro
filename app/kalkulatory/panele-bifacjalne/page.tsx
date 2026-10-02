"use client"

import { useMemo } from "react"
import { calculatePaneleBifacjalne } from "@/lib/core/modules/pv/panele-bifacjalne/calculator"
import { ZAKRESY_UZYSKU_PCT } from "@/lib/core/modules/pv/panele-bifacjalne/constants"
import type { TypPowierzchniPodSpodem } from "@/lib/core/modules/pv/panele-bifacjalne/input"
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
  mocRocznaBazowaKwh: string
  typPowierzchni: TypPowierzchniPodSpodem | ""
  dodatkowyUzyskPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocRocznaBazowaKwh: "",
  typPowierzchni: "",
  dodatkowyUzyskPct: "",
}

export default function PaneleBifacjalnePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("panele-bifacjalne", STAN_POCZATKOWY)
  const { mocRocznaBazowaKwh, typPowierzchni, dodatkowyUzyskPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocRocznaBazowaKwh = (a: string | ((p: string) => string)) => setPole("mocRocznaBazowaKwh", a)
  const setTypPowierzchni = (a: (TypPowierzchniPodSpodem | "") | ((p: TypPowierzchniPodSpodem | "") => TypPowierzchniPodSpodem | "")) =>
    setPole("typPowierzchni", a)
  const setDodatkowyUzyskPct = (a: string | ((p: string) => string)) => setPole("dodatkowyUzyskPct", a)

  const result = useMemo(
    () =>
      calculatePaneleBifacjalne({
        mocRocznaBazowaKwh: mocRocznaBazowaKwh === "" ? 0 : Number(mocRocznaBazowaKwh),
        typPowierzchni: typPowierzchni === "" ? null : typPowierzchni,
        dodatkowyUzyskPct: dodatkowyUzyskPct === "" ? 0 : Number(dodatkowyUzyskPct),
      }),
    [mocRocznaBazowaKwh, typPowierzchni, dodatkowyUzyskPct],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const zakres = typPowierzchni ? ZAKRESY_UZYSKU_PCT[typPowierzchni] : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/panele-bifacjalne" />
      <NaglowekEkranu tytul={t("UI-PANBIF-PANELE-BIFACJALNE")} ekran="panele-bifacjalne" wynik={result}>
        {t("UI-PANBIF-PANELE-BIFACJALNE-ZBIERAJA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-PANBIF-ROCZNY-UZYSK-PRZEDNIEJ")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocRocznaBazowaKwh}
          onChange={(e) => setMocRocznaBazowaKwh(e.target.value)}
          pomoc={<PomocPola ekran="panele-bifacjalne" pole="uzyskPrzod" />}
        />
        <PoleSelect
          label={t("UI-PANBIF-TYP-POWIERZCHNI-POD")}
          value={typPowierzchni}
          onChange={(e) => setTypPowierzchni(e.target.value as TypPowierzchniPodSpodem)}
          pomoc={<PomocPola ekran="panele-bifacjalne" pole="powierzchnia" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {(Object.entries(ZAKRESY_UZYSKU_PCT) as [TypPowierzchniPodSpodem, (typeof ZAKRESY_UZYSKU_PCT)[TypPowierzchniPodSpodem]][]).map(
            ([klucz, opcja]) => (
              <option key={klucz} value={klucz}>
                {opcja.label} ({opcja.minPct}-{opcja.maxPct}%)
              </option>
            ),
          )}
        </PoleSelect>
        <Pole
          label={t("UI-PANBIF-DODATKOWY-UZYSK-TYLNEJ-2")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          value={dodatkowyUzyskPct}
          onChange={(e) => setDodatkowyUzyskPct(e.target.value)}
          pomoc={<PomocPola ekran="panele-bifacjalne" pole="uzyskTyl" />}
        />
        {zakres && (
          <p className="text-small text-muted-foreground">
            {t("UI-PANBIF-TYPOWY-ZAKRES", { label: zakres.label, minPct: zakres.minPct, maxPct: zakres.maxPct })}
          </p>
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PANBIF-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-PANBIF-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta={t("UI-PANBIF-CALKOWITY-ROCZNY-UZYSK")}>
          <WynikGlowny>{result.value.calkowityUzyskKwh.toFixed(0)} kWh</WynikGlowny>
          <p className="mt-2 text-small">{t("UI-PANBIF-DODATKOWY-UZYSK-TYLNEJ", { dodatkowyUzyskKwh: result.value.dodatkowyUzyskKwh.toFixed(0) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
