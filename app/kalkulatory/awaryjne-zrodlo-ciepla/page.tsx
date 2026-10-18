"use client"

import { useMemo } from "react"
import { calculateAwaryjneZrodloCiepla } from "@/lib/core/modules/bezpieczenstwo/awaryjne-zrodlo-ciepla/calculator"
import type { AwaryjneZrodloCieplaInput, TypZrodlaCiepla } from "@/lib/core/modules/bezpieczenstwo/awaryjne-zrodlo-ciepla/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type PoleLiczbowe = Exclude<keyof AwaryjneZrodloCieplaInput, "typZrodla" | "plaszczWodny">
type FormularzStan = { typZrodla: TypZrodlaCiepla | ""; plaszczWodny: boolean } & Record<PoleLiczbowe, string>

const STAN_POCZATKOWY: FormularzStan = {
  typZrodla: "",
  plaszczWodny: false,
  mocKw: "",
  mocDoWodyKw: "",
  godzinyPaleniaNaDobe: "",
  zapotrzebowanieCieplaKwhDoba: "",
  sprawnoscProc: "",
  wartoscOpalowaKwhKg: "",
}

const liczba = (v: string) => (v === "" ? null : Number(v))

export default function AwaryjneZrodloCieplaPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("awaryjne-zrodlo-ciepla", STAN_POCZATKOWY)
  const ustaw = (pole: PoleLiczbowe) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateAwaryjneZrodloCiepla({
        typZrodla: stan.typZrodla === "" ? null : stan.typZrodla,
        plaszczWodny: stan.plaszczWodny,
        mocKw: liczba(stan.mocKw),
        mocDoWodyKw: liczba(stan.mocDoWodyKw),
        godzinyPaleniaNaDobe: liczba(stan.godzinyPaleniaNaDobe),
        zapotrzebowanieCieplaKwhDoba: liczba(stan.zapotrzebowanieCieplaKwhDoba),
        sprawnoscProc: liczba(stan.sprawnoscProc),
        wartoscOpalowaKwhKg: liczba(stan.wartoscOpalowaKwhKg),
      }),
    [stan],
  )
  const { cieploDobaKwh, cieploDoInstalacjiKwh, pokrycieProc, paliwoKgDoba } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/awaryjne-zrodlo-ciepla" />
      <NaglowekEkranu tytul={t("UI-AWAZROCIE-AWARYJNE-ZRODLO-CIEPLA")} ekran="awaryjne-zrodlo-ciepla" wynik={result}>
        {t("UI-AWAZROCIE-OGIEN-NAJSTARSZE-ZRODLO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-AWAZROCIE-TYP-ZRODLA")}
          value={stan.typZrodla}
          onChange={(e) => setStan((prev) => ({ ...prev, typZrodla: e.target.value as FormularzStan["typZrodla"] }))}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="typ" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="kominek">{t("UI-AWAZROCIE-KOMINEK")}</option>
          <option value="koza">{t("UI-AWAZROCIE-KOZA")}</option>
          <option value="piec">{t("UI-AWAZROCIE-PIEC-DREWNO")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-AWAZROCIE-MOC-CIEPLNA-KARTY")}
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocKw}
          onChange={ustaw("mocKw")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="moc" />}
        />
        <Pole
          label={t("UI-AWAZROCIE-CZAS-PALENIA-DOBIE")}
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={stan.godzinyPaleniaNaDobe}
          onChange={ustaw("godzinyPaleniaNaDobe")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="czas" />}
        />
        <PoleCheckbox
          id="zrodlo-plaszcz-wodny"
          label={t("UI-AWAZROCIE-PLASZCZ-WODNY-PODLACZONY")}
          checked={stan.plaszczWodny}
          onChange={(e) => setStan((prev) => ({ ...prev, plaszczWodny: e.target.checked }))}
        />
        {stan.plaszczWodny && (
          <>
            <Pole
              label={t("UI-AWAZROCIE-MOC-WODY-KARTY")}
              unit="kW"
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.mocDoWodyKw}
              onChange={ustaw("mocDoWodyKw")}
              pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="mocWoda" />}
            />
            <Pole
              label={t("UI-AWAZROCIE-ZAPOTRZEBOWANIE-CIEPLO-MROZN")}
              unit={t("UI-J-KWH-DOBA")}
              type="number"
              inputMode="decimal"
              min={0}
              value={stan.zapotrzebowanieCieplaKwhDoba}
              onChange={ustaw("zapotrzebowanieCieplaKwhDoba")}
              pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="zapotrzebowanie" />}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium">{t("UI-AWAZROCIE-PALIWO-OPCJONALNIE")}</p>
        <Pole
          label={t("UI-AWAZROCIE-SPRAWNOSC-URZADZENIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.sprawnoscProc}
          onChange={ustaw("sprawnoscProc")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="sprawnosc" />}
        />
        <Pole
          label={t("UI-AWAZROCIE-WARTOSC-OPALOWA-PALIWA")}
          unit="kWh/kg"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.wartoscOpalowaKwhKg}
          onChange={ustaw("wartoscOpalowaKwhKg")}
          pomoc={<PomocPola ekran="awaryjne-zrodlo-ciepla" pole="wartoscOpalowa" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-AWAZROCIE-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-AWAZROCIE-WYBIERZ-TYP-ZRODLA")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-AWAZROCIE-AWARYJNE-ZRODLO-CIEPLA")}>
          {pokrycieProc !== null ? (
            <WynikGlowny>{t("UI-AWAZROCIE-ZAPOTRZEBOWANIA", { pokrycieProc: f0(pokrycieProc) })}</WynikGlowny>
          ) : (
            cieploDobaKwh !== null && <WynikGlowny>{t("UI-AWAZROCIE-KWH-CIEPLA-DOBE", { cieploDobaKwh: f1(cieploDobaKwh) })}</WynikGlowny>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {cieploDobaKwh !== null && <li>{t("UI-AWAZROCIE-CIEPLO-URZADZENIA-KWH", { cieploDobaKwh: f1(cieploDobaKwh) })}</li>}
            {cieploDoInstalacjiKwh !== null && <li>{t("UI-AWAZROCIE-INSTALACJI-PLASZCZ-KWH", { cieploDoInstalacjiKwh: f1(cieploDoInstalacjiKwh) })}</li>}
            {paliwoKgDoba !== null && (
              <li>
                {t("UI-AWAZROCIE-PALIWO-DOBE-TYDZIEN", { paliwoKgDoba: f1(paliwoKgDoba), p: f0(paliwoKgDoba * 7) })}
              </li>
            )}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
