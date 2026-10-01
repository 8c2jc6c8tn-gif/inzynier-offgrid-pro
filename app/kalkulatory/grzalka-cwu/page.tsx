"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateGrzalkaCwu } from "@/lib/core/modules/ogrzewanie/grzalka-cwu/calculator"
import type { SterowanieGrzalki } from "@/lib/core/modules/ogrzewanie/grzalka-cwu/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = "pojemnoscL" | "mocGrzalkiKw" | "mocPvKw" | "mocFalownikaKw"
type PolaTemperatur = "tStartC" | "tKoniecC"

type FormularzStan = Record<PolaLiczbowe | PolaTemperatur, string> & { sterowanie: SterowanieGrzalki | null }

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscL: "",
  tStartC: "",
  tKoniecC: "",
  mocGrzalkiKw: "",
  mocPvKw: "",
  sterowanie: null,
  mocFalownikaKw: "",
}

const STEROWANIA: SterowanieGrzalki[] = ["stala", "regulator-pv"]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temperatura = (s: string) => (s === "" ? null : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

export default function GrzalkaCwuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("grzalka-cwu", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const poleT = (klucz: PolaTemperatur) => ({
    type: "number",
    inputMode: "decimal" as const,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateGrzalkaCwu({
        pojemnoscL: liczba(stan.pojemnoscL),
        tStartC: temperatura(stan.tStartC),
        tKoniecC: temperatura(stan.tKoniecC),
        mocGrzalkiKw: liczba(stan.mocGrzalkiKw),
        mocPvKw: liczba(stan.mocPvKw),
        sterowanie: stan.sterowanie,
        mocFalownikaKw: liczba(stan.mocFalownikaKw),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/grzalka-cwu" />
      <NaglowekEkranu tytul={t("UI-M6-GRZ-TYTUL")} ekran="grzalka-cwu" wynik={result}>
        {t("UI-M6-GRZ-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <Pole label={t("UI-M6-GRZ-POJEMNOSC")} unit="l" {...pole("pojemnoscL")} pomoc={<PomocPola ekran="grzalka-cwu" pole="pojemnosc" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-GRZ-T-START")} unit="°C" {...poleT("tStartC")} pomoc={<PomocPola ekran="grzalka-cwu" pole="tStart" />} />
          <Pole label={t("UI-M6-GRZ-T-KONIEC")} unit="°C" {...poleT("tKoniecC")} pomoc={<PomocPola ekran="grzalka-cwu" pole="tKoniec" />} />
        </div>
        <Pole label={t("UI-M6-GRZ-MOC")} unit="kW" {...pole("mocGrzalkiKw")} pomoc={<PomocPola ekran="grzalka-cwu" pole="moc" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-GRZ-PV")}</legend>
        <Pole label={t("UI-M6-GRZ-MOC-PV")} unit="kW" {...pole("mocPvKw")} pomoc={<PomocPola ekran="grzalka-cwu" pole="mocPv" />} />
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-small font-medium">
            {t("UI-M6-GRZ-STEROWANIE")} <PomocPola ekran="grzalka-cwu" pole="sterowanie" />
          </span>
          <div role="tablist" aria-label={t("UI-M6-GRZ-STEROWANIE")} className="flex flex-wrap gap-2">
            {STEROWANIA.map((s) => (
              <Button key={s} role="tab" aria-selected={s === stan.sterowanie} variant={s === stan.sterowanie ? "default" : "outline"} onClick={() => setStan((prev) => ({ ...prev, sterowanie: s }))}>
                {t(`UI-M6-GRZ-S-${s.toUpperCase()}`)}
              </Button>
            ))}
          </div>
        </div>
        <Pole label={t("UI-M6-GRZ-FALOWNIK")} unit="kW" {...pole("mocFalownikaKw")} pomoc={<PomocPola ekran="grzalka-cwu" pole="falownik" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-GRZ-W-UWAGA" : "UI-M6-GRZ-W-OK")}>
          <WynikGlowny>{t("UI-M6-GRZ-WYNIK", { h: r2(v.czasH), kwh: r2(v.cieploKwh) })}</WynikGlowny>
          {v.energiaZPvKwh !== null && v.energiaZBateriiKwh !== null && (
            <p className="mt-1 text-small">{t("UI-M6-GRZ-ZRODLA", { pv: r2(v.energiaZPvKwh), bat: r2(v.energiaZBateriiKwh) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/zasobnik-cwu" className="text-small underline">
          {t("UI-M6-GRZ-LINK-E17")}
        </Link>
        <Link href="/kalkulatory/dobor-mocy-falownika" className="text-small underline">
          {t("UI-M6-GRZ-LINK-FALOWNIK")}
        </Link>
      </div>
    </main>
  )
}
