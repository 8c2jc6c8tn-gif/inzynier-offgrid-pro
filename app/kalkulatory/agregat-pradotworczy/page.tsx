"use client"

import { useMemo } from "react"
import { calculateAgregatPradotworczy } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
  type BezpieczenstwoAgregatuStan,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"
import { OPTYMALNE_OBCIAZENIE_PCT } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = BezpieczenstwoAgregatuStan & {
  deficytKwh: string
  mocAgregatuKw: string
  sredniZuzycieLH: string
  cenaZaLitrZl: string
  maWyjscieSterujaceBms: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  deficytKwh: "",
  mocAgregatuKw: "",
  sredniZuzycieLH: "",
  cenaZaLitrZl: "",
  maWyjscieSterujaceBms: false,
  miejsceAgregatu: "",
  podlaczenieAgregatu: "",
}

export default function AgregatPradotworczyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("agregat-pradotworczy", STAN_POCZATKOWY)
  const { deficytKwh, mocAgregatuKw, sredniZuzycieLH, cenaZaLitrZl, maWyjscieSterujaceBms, miejsceAgregatu, podlaczenieAgregatu } =
    stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDeficytKwh = (a: string | ((p: string) => string)) => setPole("deficytKwh", a)
  const setMocAgregatuKw = (a: string | ((p: string) => string)) => setPole("mocAgregatuKw", a)
  const setSredniZuzycieLH = (a: string | ((p: string) => string)) => setPole("sredniZuzycieLH", a)
  const setCenaZaLitrZl = (a: string | ((p: string) => string)) => setPole("cenaZaLitrZl", a)
  const setMaWyjscieSterujaceBms = (a: boolean | ((p: boolean) => boolean)) => setPole("maWyjscieSterujaceBms", a)

  const result = useMemo(
    () =>
      calculateAgregatPradotworczy({
        deficytKwh: deficytKwh === "" ? 0 : Number(deficytKwh),
        mocAgregatuKw: mocAgregatuKw === "" ? 0 : Number(mocAgregatuKw),
        sredniZuzycieLH: sredniZuzycieLH === "" ? 0 : Number(sredniZuzycieLH),
        cenaZaLitrZl: cenaZaLitrZl === "" ? 0 : Number(cenaZaLitrZl),
        maWyjscieSterujaceBms,
        ...naWejscieBezpieczenstwa({ miejsceAgregatu, podlaczenieAgregatu }),
      }),
    [deficytKwh, mocAgregatuKw, sredniZuzycieLH, cenaZaLitrZl, maWyjscieSterujaceBms, miejsceAgregatu, podlaczenieAgregatu],
  )

  // 1.1.0 (D48): a critical safety warning (CO, no changeover switch) turns the verdict red.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" || hasCritical
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/agregat-pradotworczy" />
      <NaglowekEkranu
        tytul={t("UI-AGRPRA-AGREGAT-PRADOTWORCZY-DEFINIC")}
        ekran="agregat-pradotworczy"
        wynik={result}
        parametry={{ obciazenie: OPTYMALNE_OBCIAZENIE_PCT }}
      >
        {t("UI-AGRPRA-SYSTEM-POROWNUJE-PRODUKCJE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-AGRPRA-DEFICYT-ENERGETYCZNY-NAJGORS")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={deficytKwh}
          onChange={(e) => setDeficytKwh(e.target.value)}
          pomoc={<PomocPola ekran="agregat-pradotworczy" pole="deficyt" />}
        />
        <Pole
          label={t("UI-AGRPRA-MOC-ZNAMIONOWA-AGREGATU")}
          unit="kW"
          type="number"
          inputMode="decimal"
          value={mocAgregatuKw}
          onChange={(e) => setMocAgregatuKw(e.target.value)}
          pomoc={<PomocPola ekran="agregat-pradotworczy" pole="moc" />}
        />
        <Pole
          label={t("UI-AGRPRA-SREDNIE-ZUZYCIE-PALIWA")}
          unit="l/h"
          type="number"
          inputMode="decimal"
          value={sredniZuzycieLH}
          onChange={(e) => setSredniZuzycieLH(e.target.value)}
          pomoc={<PomocPola ekran="agregat-pradotworczy" pole="zuzycie" />}
        />
        <Pole
          label={t("UI-AGRPRA-CENA-PALIWA")}
          unit={t("UI-J-ZL-L")}
          type="number"
          inputMode="decimal"
          value={cenaZaLitrZl}
          onChange={(e) => setCenaZaLitrZl(e.target.value)}
          pomoc={<PomocPola ekran="agregat-pradotworczy" pole="cena" />}
        />
        <PoleCheckbox
          id="ma-wyjscie-sterujace"
          checked={maWyjscieSterujaceBms}
          onChange={(e) => setMaWyjscieSterujaceBms(e.target.checked)}
          label={t("UI-AGRPRA-BMS-WYJSCIE-STERUJACE")}
        />
      </div>

      <PolaBezpieczenstwaAgregatu
        miejsceAgregatu={miejsceAgregatu}
        podlaczenieAgregatu={podlaczenieAgregatu}
        onChange={(zmiana) => setStan((prev) => ({ ...prev, ...zmiana }))}
      />

      {result.status === "INCOMPLETE" ? (
        <>
          <p className="text-small text-muted-foreground">
            {t("UI-AGRPRA-WYPELNIJ-DANE-ZEBY")}
          </p>
          {hasCritical && (
            <WerdyktPanel poziom="blad" etykieta={t("UI-AGRPRA-ZAGROZENIE-ZYCIA-AGREGAT")}>
              <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
            </WerdyktPanel>
          )}
        </>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-AGRPRA-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null && (
          <WerdyktPanel
            poziom={poziom}
            etykieta={hasCritical ? t("UI-AGRPRA-RAPORT-PRACY-AGREGATU") : t("UI-AGRPRA-RAPORT-PRACY-AGREGATU-2")}
          >
            <WynikGlowny>
              {result.value.godzinyPracy.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} h
            </WynikGlowny>
            <p className="mt-1 text-small">
              {t("UI-AGRPRA-ZUZYCIE-PALIWA-KOSZT", { zuzyciePaliwaLitry: result.value.zuzyciePaliwaLitry.toLocaleString("pl-PL", { maximumFractionDigits: 1 }), kosztZl: result.value.kosztZl.toLocaleString("pl-PL", { maximumFractionDigits: 0 }) })}
            </p>
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
