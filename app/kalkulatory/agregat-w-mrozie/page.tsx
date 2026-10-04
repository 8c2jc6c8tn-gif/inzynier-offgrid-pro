"use client"

import { useMemo } from "react"
import { calculateAgregatWMrozie } from "@/lib/core/modules/stress-test/agregat-w-mrozie/calculator"
import type { AgregatWMrozieInput, PaliwoAgregatu } from "@/lib/core/modules/stress-test/agregat-w-mrozie/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
  type BezpieczenstwoAgregatuStan,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"
import { DIESEL_ROZRUCH_MROZ_C, DIESEL_ZWYKLY_RYZYKO_C, DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C, DLUGI_POSTOJ_DNI } from "@/lib/core/modules/stress-test/agregat-w-mrozie/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type PoleLiczbowe = Exclude<keyof AgregatWMrozieInput, "paliwo" | keyof BezpieczenstwoAgregatuStan>
type FormularzStan = { paliwo: PaliwoAgregatu | "" } & BezpieczenstwoAgregatuStan & Record<PoleLiczbowe, string>

const STAN_POCZATKOWY: FormularzStan = {
  paliwo: "",
  temperaturaMiejscaC: "",
  wymaganyCzasPracyH: "",
  maxPracaCiaglaH: "",
  przerwaH: "",
  zuzyciePaliwaLH: "",
  interwalWymianyOlejuH: "",
  dniPostoju: "",
  miejsceAgregatu: "",
  podlaczenieAgregatu: "",
}

const liczba = (v: string) => (v === "" ? null : Number(v))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function AgregatWMroziePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("agregat-w-mrozie", STAN_POCZATKOWY)
  const ustaw = (pole: PoleLiczbowe) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateAgregatWMrozie({
        paliwo: stan.paliwo === "" ? null : stan.paliwo,
        temperaturaMiejscaC: liczba(stan.temperaturaMiejscaC),
        wymaganyCzasPracyH: liczba(stan.wymaganyCzasPracyH),
        maxPracaCiaglaH: liczba(stan.maxPracaCiaglaH),
        przerwaH: liczba(stan.przerwaH),
        zuzyciePaliwaLH: liczba(stan.zuzyciePaliwaLH),
        interwalWymianyOlejuH: liczba(stan.interwalWymianyOlejuH),
        dniPostoju: liczba(stan.dniPostoju),
        ...naWejscieBezpieczenstwa(stan),
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const { paliwoL, wymianyOleju, liczbaPrzerw, czasKalendarzowyH } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/agregat-w-mrozie" />
      <NaglowekEkranu
        tytul={t("UI-AGRWMRO-AGREGAT-MROZIE")}
        ekran="agregat-w-mrozie"
        wynik={result}
        parametry={{ postoj: DLUGI_POSTOJ_DNI }}
      >
        {t("UI-AGRWMRO-ROZRUCH-ZIMNO-DLUGA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-AGRWMRO-PALIWO")}
          value={stan.paliwo}
          onChange={(e) => setStan((prev) => ({ ...prev, paliwo: e.target.value as FormularzStan["paliwo"] }))}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="paliwo" params={{ ryzyko: DIESEL_ZWYKLY_RYZYKO_C, wysokie: DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C, rozruch: DIESEL_ROZRUCH_MROZ_C }} />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="diesel-zwykly">{t("UI-AGRWMRO-OLEJ-NAPEDOWY-ZWYKLY")}</option>
          <option value="diesel-arktyczny">{t("UI-AGRWMRO-OLEJ-NAPEDOWY-ARKTYCZNY")}</option>
          <option value="benzyna">{t("UI-AGRWMRO-BENZYNA")}</option>
          <option value="inne">{t("UI-AGRWMRO-INNE-LPG-GAZ")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-AGRWMRO-NAJNIZSZA-TEMPERATURA-AGREGA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={stan.temperaturaMiejscaC}
          onChange={ustaw("temperaturaMiejscaC")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="temp" />}
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium">{t("UI-AGRWMRO-PRACA-SCENARIUSZU-TYDZIEN")}</p>
        <Pole
          label={t("UI-AGRWMRO-LACZNY-CZAS-PRACY")}
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.wymaganyCzasPracyH}
          onChange={ustaw("wymaganyCzasPracyH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="czasPracy" />}
        />
        <Pole
          label={t("UI-AGRWMRO-MAKS-PRACA-CIAGLA")}
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.maxPracaCiaglaH}
          onChange={ustaw("maxPracaCiaglaH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="maxCiagla" />}
        />
        <Pole
          label={t("UI-AGRWMRO-WYMAGANA-PRZERWA")}
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.przerwaH}
          onChange={ustaw("przerwaH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="przerwa" />}
        />
        <Pole
          label={t("UI-AGRWMRO-ZUZYCIE-PALIWA")}
          unit="l/h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zuzyciePaliwaLH}
          onChange={ustaw("zuzyciePaliwaLH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="zuzycie" />}
        />
        <Pole
          label={t("UI-AGRWMRO-WYMIANA-OLEJU")}
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.interwalWymianyOlejuH}
          onChange={ustaw("interwalWymianyOlejuH")}
          pomoc={<PomocPola ekran="agregat-w-mrozie" pole="olej" />}
        />
      </div>

      <Pole
        label={t("UI-AGRWMRO-DNI-POSTOJU-BEZ")}
        unit={t("UI-J-DNI")}
        type="number"
        inputMode="numeric"
        min={0}
        value={stan.dniPostoju}
        onChange={ustaw("dniPostoju")}
        pomoc={<PomocPola ekran="agregat-w-mrozie" pole="dniPostoju" params={{ postoj: DLUGI_POSTOJ_DNI }} />}
      />

      <PolaBezpieczenstwaAgregatu
        miejsceAgregatu={stan.miejsceAgregatu}
        podlaczenieAgregatu={stan.podlaczenieAgregatu}
        onChange={(zmiana) => setStan((prev) => ({ ...prev, ...zmiana }))}
      />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-AGRWMRO-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-AGRWMRO-WPISZ-CZAS-PRACY")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={
            hasCritical
              ? t("UI-AGRWMRO-POWAZNE-ZAGROZENIE-SPRAWDZ")
              : hasWarning
                ? t("UI-AGRWMRO-AGREGAT-MOZE-WYSTARTOWAC")
                : t("UI-AGRWMRO-AGREGAT-SCENARIUSZU-ZIMOWYM")
          }
        >
          {paliwoL !== null && <WynikGlowny>{t("UI-AGRWMRO-PALIWA", { paliwoL: f0(paliwoL) })}</WynikGlowny>}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {wymianyOleju !== null && <li>{t("UI-AGRWMRO-WYMIANY-OLEJU", { wymianyOleju })}</li>}
            {liczbaPrzerw !== null && <li>{t("UI-AGRWMRO-PRZERWY", { liczbaPrzerw })}</li>}
            {czasKalendarzowyH !== null && <li>{t("UI-AGRWMRO-PRACA-PRZERWAMI", { czasKalendarzowyH: f0(czasKalendarzowyH) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
