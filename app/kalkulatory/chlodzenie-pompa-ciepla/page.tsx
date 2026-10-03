"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateChlodzeniePompaCiepla } from "@/lib/core/modules/ogrzewanie/chlodzenie-pompa-ciepla/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola =
  | "chlod"
  | "eerPompy"
  | "eerKlima"
  | "obiegowa"
  | "godziny"
  | "tZasilania"
  | "tPomieszczenia"
  | "wilgotnosc"
  | "cieplo"
  | "copPompy"
  | "copKlima"
type FormularzStan = Record<Pola, string>

const STAN_POCZATKOWY: FormularzStan = {
  chlod: "",
  eerPompy: "",
  eerKlima: "",
  obiegowa: "",
  godziny: "",
  tZasilania: "",
  tPomieszczenia: "",
  wilgotnosc: "",
  cieplo: "",
  copPompy: "",
  copKlima: "",
}

const SEKCJA_KLASY = "flex flex-col gap-4 rounded-lg border p-4"
const SEKCJA_TYTUL_KLASY = "text-small font-semibold uppercase tracking-wide text-muted-foreground"

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temp = (s: string) => (s === "" ? null : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2C — dawne 5.29 + 5.47 + 5.51 + energia z 5.53: summer cooling with a heat pump. */
export default function ChlodzeniePompaCieplaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("chlodzenie-pompa-ciepla", STAN_POCZATKOWY)
  const pole = (klucz: Pola, min: number | undefined = 0) => ({
    type: "number",
    inputMode: "decimal" as const,
    min,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateChlodzeniePompaCiepla({
        chlodDobaKwh: liczba(stan.chlod),
        eerPompy: liczba(stan.eerPompy),
        eerKlimatyzatora: liczba(stan.eerKlima),
        mocObiegowejW: liczba(stan.obiegowa),
        godzinyFreeCoolingH: liczba(stan.godziny),
        tZasilaniaC: temp(stan.tZasilania),
        tPomieszczeniaC: temp(stan.tPomieszczenia),
        wilgotnoscPct: liczba(stan.wilgotnosc),
        cieploSezonKwh: liczba(stan.cieplo),
        copPompy: liczba(stan.copPompy),
        copKlimatyzatora: liczba(stan.copKlima),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.status === "VALID_WITH_WARNINGS"
  const stop = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/chlodzenie-pompa-ciepla" />
      <NaglowekEkranu tytul={t("UI-M6-CHL-TYTUL")} ekran="chlodzenie-pompa-ciepla" wynik={result}>
        {t("UI-M6-CHL-OPIS")}
      </NaglowekEkranu>

      <section className={SEKCJA_KLASY}>
        <h2 className={SEKCJA_TYTUL_KLASY}>{t("UI-M6-CHL-SEKCJA-CHLOD")}</h2>
        <Pole label={t("UI-M6-CHL-CHLOD")} unit="kWh" {...pole("chlod")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="chlod" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CHL-EER-POMPY")} {...pole("eerPompy")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="eerPompy" />} />
          <Pole label={t("UI-M6-CHL-EER-KLIMA")} {...pole("eerKlima")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="eerKlima" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CHL-OBIEGOWA")} unit="W" {...pole("obiegowa")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="obiegowa" />} />
          <Pole label={t("UI-M6-CHL-GODZINY")} unit="h" max={24} {...pole("godziny")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="godziny" />} />
        </div>
      </section>

      <section className={SEKCJA_KLASY}>
        <h2 className={SEKCJA_TYTUL_KLASY}>{t("UI-M6-CHL-SEKCJA-ROSA")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CHL-TZASILANIA")} unit="°C" {...pole("tZasilania", undefined)} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="tZasilania" />} />
          <Pole label={t("UI-M6-CHL-TPOMIESZCZENIA")} unit="°C" {...pole("tPomieszczenia", undefined)} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="tPomieszczenia" />} />
        </div>
        <Pole label={t("UI-M6-CHL-WILGOTNOSC")} unit="%" max={100} {...pole("wilgotnosc")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="wilgotnosc" />} />
      </section>

      <section className={SEKCJA_KLASY}>
        <h2 className={SEKCJA_TYTUL_KLASY}>{t("UI-M6-CHL-SEKCJA-GRZANIE")}</h2>
        <Pole label={t("UI-M6-CHL-CIEPLO")} unit="kWh" {...pole("cieplo")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="cieplo" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-CHL-COP-POMPY")} {...pole("copPompy")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="copPompy" />} />
          <Pole label={t("UI-M6-CHL-COP-KLIMA")} {...pole("copKlima")} pomoc={<PomocPola ekran="chlodzenie-pompa-ciepla" pole="copKlima" />} />
        </div>
      </section>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-CHL-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-CHL-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={stop ? "blad" : uwaga ? "uwaga" : "ok"}
          etykieta={t(stop ? "UI-M6-CHL-W-STOP" : uwaga ? "UI-M6-CHL-W-UWAGA" : "UI-M6-CHL-W-OK")}
        >
          <WynikGlowny>{t("UI-M6-CHL-WYNIK", { kwh: r2(v.pradPompyKwh) })}</WynikGlowny>
          {v.pradKlimatyzatoraKwh !== null && <p className="mt-1 text-small">{t("UI-M6-CHL-KLIMA", { kwh: r2(v.pradKlimatyzatoraKwh) })}</p>}
          {v.pradFreeCoolingKwh !== null && <p className="mt-1 text-small">{t("UI-M6-CHL-FREE", { kwh: r2(v.pradFreeCoolingKwh) })}</p>}
          {v.punktRosyC !== null && <p className="mt-1 text-small">{t("UI-M6-CHL-ROSA", { rosa: r2(v.punktRosyC) })}</p>}
          {v.grzaniePompaKwh !== null && v.grzanieKlimatyzatorKwh !== null && v.grzanieOszczednoscPct !== null && (
            <p className="mt-1 text-small">
              {t("UI-M6-CHL-GRZANIE", {
                pompa: r2(v.grzaniePompaKwh),
                klima: r2(v.grzanieKlimatyzatorKwh),
                pct: r2(v.grzanieOszczednoscPct),
              })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/kolektor-gruntowy" className="text-small underline">
        {t("UI-M6-CHL-LINK-KOLEKTOR")}
      </Link>
    </main>
  )
}
