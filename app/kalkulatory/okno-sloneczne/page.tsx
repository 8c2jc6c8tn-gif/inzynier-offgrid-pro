"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateOknoSloneczne } from "@/lib/core/modules/stress-test/okno-sloneczne/calculator"
import { PROG_SOC_BOJLER_PCT } from "@/lib/core/modules/stress-test/okno-sloneczne/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola = "produkcja" | "zuzycie" | "pojemnosc" | "soc" | "grzalki" | "bojlerL" | "tStart" | "tCel"
type FormularzStan = Record<Pola, string>

const STAN_POCZATKOWY: FormularzStan = {
  produkcja: "",
  zuzycie: "",
  pojemnosc: "",
  soc: "",
  grzalki: "",
  bojlerL: "",
  tStart: "",
  tCel: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const albo = (s: string) => (s === "" ? null : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function OknoSlonecznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("okno-sloneczne", STAN_POCZATKOWY)
  const pole = (klucz: Pola, bezMin = false) => ({
    type: "number",
    inputMode: "decimal" as const,
    ...(bezMin ? {} : { min: 0 }),
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateOknoSloneczne({
        energiaOknaKwh: liczba(stan.produkcja),
        zuzycieWOknieKwh: liczba(stan.zuzycie),
        pojemnoscBateriiKwh: liczba(stan.pojemnosc),
        socStartPct: albo(stan.soc),
        grzalkiBmsKwh: liczba(stan.grzalki),
        bojlerL: liczba(stan.bojlerL),
        bojlerTStartC: albo(stan.tStart),
        bojlerTCelC: albo(stan.tCel),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/okno-sloneczne" />
      <NaglowekEkranu tytul={t("UI-M7-OKNO-TYTUL")} ekran="okno-sloneczne" wynik={result} parametry={{ prog: PROG_SOC_BOJLER_PCT }}>
        {t("UI-M7-OKNO-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-OKNO-ENERGIA")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-OKNO-PRODUKCJA")} unit="kWh" {...pole("produkcja")} pomoc={<PomocPola ekran="okno-sloneczne" pole="produkcja" />} />
          <Pole label={t("UI-M7-OKNO-ZUZYCIE")} unit="kWh" {...pole("zuzycie")} pomoc={<PomocPola ekran="okno-sloneczne" pole="zuzycie" />} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-OKNO-BATERIA")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-OKNO-POJEMNOSC")} unit="kWh" {...pole("pojemnosc")} pomoc={<PomocPola ekran="okno-sloneczne" pole="pojemnosc" />} />
          <Pole label={t("UI-M7-OKNO-SOC")} unit="%" max={100} {...pole("soc")} pomoc={<PomocPola ekran="okno-sloneczne" pole="soc" />} />
        </div>
        <Pole label={t("UI-M7-OKNO-GRZALKI")} unit="kWh" {...pole("grzalki")} pomoc={<PomocPola ekran="okno-sloneczne" pole="grzalki" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-OKNO-BOJLER")}</legend>
        <Pole label={t("UI-M7-OKNO-BOJLER-L")} unit="l" {...pole("bojlerL")} pomoc={<PomocPola ekran="okno-sloneczne" pole="bojlerL" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-OKNO-T-START")} unit="°C" {...pole("tStart", true)} pomoc={<PomocPola ekran="okno-sloneczne" pole="tStart" />} />
          <Pole label={t("UI-M7-OKNO-T-CEL")} unit="°C" {...pole("tCel", true)} pomoc={<PomocPola ekran="okno-sloneczne" pole="tCel" />} />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-OKNO-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-OKNO-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M7-OKNO-W-UWAGA" : "UI-M7-OKNO-W-OK")}>
          <WynikGlowny>{t("UI-M7-OKNO-WYNIK", { soc: r1(v.socKoniecPct) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {v.naGrzalkiBmsKwh > 0 && <li>{t("UI-M7-OKNO-L-GRZALKI", { kwh: r2(v.naGrzalkiBmsKwh) })}</li>}
            <li>{t("UI-M7-OKNO-L-BATERIA", { kwh: r2(v.naBaterieKwh) })}</li>
            {v.bojlerTKoniecC !== null && <li>{t("UI-M7-OKNO-L-BOJLER", { kwh: r2(v.naBojlerKwh), t: r1(v.bojlerTKoniecC) })}</li>}
            <li>{t("UI-M7-OKNO-L-NADWYZKA", { kwh: r2(v.nadwyzkaKwh) })}</li>
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/pre-heat" className="text-small underline">
        {t("UI-M7-OKNO-LINK-E18")}
      </Link>
    </main>
  )
}
