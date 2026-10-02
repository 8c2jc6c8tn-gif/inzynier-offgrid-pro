"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateCykleOdszraniania } from "@/lib/core/modules/ogrzewanie/cykle-odszraniania/calculator"
import { PROG_SZRONIENIA_GORNY_C } from "@/lib/core/modules/ogrzewanie/cykle-odszraniania/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaTemperatur = "tZewn" | "tMin"
type PolaLiczbowe = "wilgotnosc" | "odstep" | "czas" | "mocDefrostu" | "mocBazowa" | "godziny" | "cop"
type FormularzStan = Record<PolaTemperatur | PolaLiczbowe, string>

const STAN_POCZATKOWY: FormularzStan = {
  tZewn: "",
  wilgotnosc: "",
  odstep: "",
  czas: "",
  mocDefrostu: "",
  mocBazowa: "",
  godziny: "",
  cop: "",
  tMin: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temperatura = (s: string) => (s === "" ? null : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function CykleOdszranianiaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("cykle-odszraniania", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe | PolaTemperatur, bezMin = false) => ({
    type: "number",
    inputMode: "decimal" as const,
    ...(bezMin ? {} : { min: 0 }),
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateCykleOdszraniania({
        tZewnC: temperatura(stan.tZewn),
        wilgotnoscPct: liczba(stan.wilgotnosc),
        odstepMin: liczba(stan.odstep),
        czasDefrostuMin: liczba(stan.czas),
        mocDefrostuKw: liczba(stan.mocDefrostu),
        mocBazowaKw: liczba(stan.mocBazowa),
        godzinySzronieniaH: liczba(stan.godziny),
        copKatalogowy: liczba(stan.cop),
        tMinPracyC: temperatura(stan.tMin),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")
  const minuty = t("UI-M6-CYK-J-MIN")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/cykle-odszraniania" />
      <NaglowekEkranu
        tytul={t("UI-M6-CYK-TYTUL")}
        ekran="cykle-odszraniania"
        wynik={result}
        parametry={{ prog: PROG_SZRONIENIA_GORNY_C }}
      >
        {t("UI-M6-CYK-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-CYK-WARUNKI")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CYK-T-ZEWN")} unit="°C" {...pole("tZewn", true)} pomoc={<PomocPola ekran="cykle-odszraniania" pole="tZewn" />} />
          <Pole label={t("UI-M6-CYK-WILGOTNOSC")} unit="%" max={100} {...pole("wilgotnosc")} pomoc={<PomocPola ekran="cykle-odszraniania" pole="wilgotnosc" />} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-CYK-CYKL")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CYK-ODSTEP")} unit={minuty} {...pole("odstep")} pomoc={<PomocPola ekran="cykle-odszraniania" pole="odstep" />} />
          <Pole label={t("UI-M6-CYK-CZAS")} unit={minuty} {...pole("czas")} pomoc={<PomocPola ekran="cykle-odszraniania" pole="czas" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CYK-MOC-DEFROSTU")} unit="kW" {...pole("mocDefrostu")} pomoc={<PomocPola ekran="cykle-odszraniania" pole="mocDefrostu" />} />
          <Pole label={t("UI-M6-CYK-MOC-BAZOWA")} unit="kW" {...pole("mocBazowa")} pomoc={<PomocPola ekran="cykle-odszraniania" pole="mocBazowa" />} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-CYK-OPCJE")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CYK-GODZINY")} unit="h" max={24} {...pole("godziny")} pomoc={<PomocPola ekran="cykle-odszraniania" pole="godziny" />} />
          <Pole label={t("UI-M6-CYK-COP")} {...pole("cop")} pomoc={<PomocPola ekran="cykle-odszraniania" pole="cop" />} />
        </div>
        <Pole label={t("UI-M6-CYK-T-MIN")} unit="°C" {...pole("tMin", true)} pomoc={<PomocPola ekran="cykle-odszraniania" pole="tMin" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-CYK-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-CYK-W-UWAGA" : "UI-M6-CYK-W-OK")}>
          <WynikGlowny>{t("UI-M6-CYK-WYNIK", { narzut: r1(v.narzutPct) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M6-CYK-UDZIAL", { udzial: r1(v.udzialCzasuPct) })}</li>
            <li>{t("UI-M6-CYK-GODZINA", { kwh: r2(v.energiaNaGodzineKwh) })}</li>
            {v.energiaDobaKwh !== null && <li>{t("UI-M6-CYK-DOBA", { kwh: r2(v.energiaDobaKwh) })}</li>}
            {v.copEfektywny !== null && <li>{t("UI-M6-CYK-COP-EF", { cop: r2(v.copEfektywny), kat: stan.cop })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/cop-pompy-ciepla" className="text-small underline">
        {t("UI-M6-CYK-LINK-E5")}
      </Link>
    </main>
  )
}
