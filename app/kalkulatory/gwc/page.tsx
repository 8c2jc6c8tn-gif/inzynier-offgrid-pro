"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateGwc } from "@/lib/core/modules/ogrzewanie/gwc/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { SekcjaGwcPompaCiepla } from "./sekcja-pompa-ciepla"

type Pola = "strumien" | "przyrost" | "godziny" | "rekuperator" | "zapotrzebowanie" | "cop"
type FormularzStan = Record<Pola, string>

const STAN_POCZATKOWY: FormularzStan = { strumien: "", przyrost: "", godziny: "", rekuperator: "", zapotrzebowanie: "", cop: "" }

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function GwcPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("gwc", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateGwc({
        strumienM3H: liczba(stan.strumien),
        przyrostTempK: liczba(stan.przyrost),
        godzinyPracyH: liczba(stan.godziny),
        sprawnoscRekuperatoraPct: liczba(stan.rekuperator),
        zapotrzebowanieDobaKwh: liczba(stan.zapotrzebowanie),
        cop: liczba(stan.cop),
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/gwc" />
      <NaglowekEkranu tytul={t("UI-M6-GWC-TYTUL")} ekran="gwc" wynik={result}>
        {t("UI-M6-GWC-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-GWC-WYMIENNIK")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-GWC-STRUMIEN")} unit="m³/h" {...pole("strumien")} pomoc={<PomocPola ekran="gwc" pole="strumien" />} />
          <Pole label={t("UI-M6-GWC-PRZYROST")} unit="K" {...pole("przyrost")} pomoc={<PomocPola ekran="gwc" pole="przyrost" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-GWC-GODZINY")} unit="h" max={24} {...pole("godziny")} pomoc={<PomocPola ekran="gwc" pole="godziny" />} />
          <Pole label={t("UI-M6-GWC-REKUPERATOR")} unit="%" max={100} {...pole("rekuperator")} pomoc={<PomocPola ekran="gwc" pole="rekuperator" />} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-GWC-OPCJE")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-GWC-ZAPOTRZEBOWANIE")} unit="kWh" {...pole("zapotrzebowanie")} pomoc={<PomocPola ekran="gwc" pole="zapotrzebowanie" />} />
          <Pole label={t("UI-M6-GWC-COP")} {...pole("cop")} pomoc={<PomocPola ekran="gwc" pole="cop" />} />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-GWC-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6-GWC-W-OK")}>
          <WynikGlowny>{t("UI-M6-GWC-WYNIK", { kwh: r2(v.oszczednoscDobaKwh) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M6-GWC-MOC", { w: Math.round(v.mocCieplnaW) })}</li>
            {v.udzialPct !== null && <li>{t("UI-M6-GWC-UDZIAL", { pct: r1(v.udzialPct) })}</li>}
            {v.oszczednoscPraduKwh !== null && <li>{t("UI-M6-GWC-PRAD", { kwh: r2(v.oszczednoscPraduKwh) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <SekcjaGwcPompaCiepla strumienM3H={liczba(stan.strumien)} przyrostK={liczba(stan.przyrost)} />

      <Link href="/kalkulatory/wentylacja-odzysk-ciepla" className="text-small underline">
        {t("UI-M6-GWC-LINK-E3")}
      </Link>
    </main>
  )
}
