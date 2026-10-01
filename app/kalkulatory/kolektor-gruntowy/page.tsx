"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateKolektorGruntowy } from "@/lib/core/modules/ogrzewanie/kolektor-gruntowy/calculator"
import type { TypKolektora } from "@/lib/core/modules/ogrzewanie/kolektor-gruntowy/input"
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

type PolaLiczbowe = "mocPompyKw" | "m2Na10Kw" | "glebokoscUlozeniaM" | "glebokoscPrzemarzaniaM" | "wNaMetr" | "glebokoscOdwiertuM"

type FormularzStan = Record<PolaLiczbowe, string> & { typ: TypKolektora | null }

const STAN_POCZATKOWY: FormularzStan = {
  typ: null,
  mocPompyKw: "",
  m2Na10Kw: "",
  glebokoscUlozeniaM: "",
  glebokoscPrzemarzaniaM: "",
  wNaMetr: "",
  glebokoscOdwiertuM: "",
}

const TYPY: TypKolektora[] = ["poziomy", "pionowy", "spiralny"]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const opcjonalna = (s: string) => (s === "" ? null : Number(s))

export default function KolektorGruntowyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("kolektor-gruntowy", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateKolektorGruntowy({
        typ: stan.typ,
        mocPompyKw: liczba(stan.mocPompyKw),
        m2Na10Kw: liczba(stan.m2Na10Kw),
        glebokoscUlozeniaM: opcjonalna(stan.glebokoscUlozeniaM),
        glebokoscPrzemarzaniaM: opcjonalna(stan.glebokoscPrzemarzaniaM),
        wNaMetr: liczba(stan.wNaMetr),
        glebokoscOdwiertuM: liczba(stan.glebokoscOdwiertuM),
      }),
    [stan],
  )
  const v = result.value
  const stop = result.warnings.some((w) => w.level === "critical")
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kolektor-gruntowy" />
      <NaglowekEkranu tytul={t("UI-M6-KOL-TYTUL")} ekran="kolektor-gruntowy" wynik={result}>
        {t("UI-M6-KOL-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex items-center gap-1.5 text-small font-medium">
          {t("UI-M6-KOL-TYP")} <PomocPola ekran="kolektor-gruntowy" pole="typ" />
        </legend>
        <div role="tablist" aria-label={t("UI-M6-KOL-TYP")} className="flex flex-wrap gap-2">
          {TYPY.map((typ) => (
            <Button key={typ} role="tab" aria-selected={typ === stan.typ} variant={typ === stan.typ ? "default" : "outline"} onClick={() => setStan((prev) => ({ ...prev, typ }))}>
              {t(`UI-M6-KOL-T-${typ.toUpperCase()}`)}
            </Button>
          ))}
        </div>
      </fieldset>

      {stan.typ !== null && stan.typ !== "spiralny" && (
        <Pole label={t("UI-M6-KOL-MOC")} unit="kW" {...pole("mocPompyKw")} pomoc={<PomocPola ekran="kolektor-gruntowy" pole="moc" />} />
      )}

      {stan.typ === "poziomy" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="sr-only">{t("UI-M6-KOL-T-POZIOMY")}</legend>
          <Pole label={t("UI-M6-KOL-M2")} unit={t("UI-M6-KOL-J-M2-10KW")} {...pole("m2Na10Kw")} pomoc={<PomocPola ekran="kolektor-gruntowy" pole="m2Na10Kw" />} />
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6-KOL-GLEBOKOSC")} unit="m" {...pole("glebokoscUlozeniaM")} pomoc={<PomocPola ekran="kolektor-gruntowy" pole="glebokosc" />} />
            <Pole label={t("UI-M6-KOL-PRZEMARZANIE")} unit="m" {...pole("glebokoscPrzemarzaniaM")} pomoc={<PomocPola ekran="kolektor-gruntowy" pole="przemarzanie" />} />
          </div>
        </fieldset>
      )}

      {stan.typ === "pionowy" && (
        <fieldset className="grid grid-cols-2 gap-3">
          <legend className="sr-only">{t("UI-M6-KOL-T-PIONOWY")}</legend>
          <Pole label={t("UI-M6-KOL-W-NA-M")} unit="W/m" {...pole("wNaMetr")} pomoc={<PomocPola ekran="kolektor-gruntowy" pole="wNaMetr" />} />
          <Pole label={t("UI-M6-KOL-ODWIERT")} unit="m" {...pole("glebokoscOdwiertuM")} pomoc={<PomocPola ekran="kolektor-gruntowy" pole="odwiert" />} />
        </fieldset>
      )}

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-M6-KOL-W-SPIRALNY")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={stop ? "blad" : uwaga ? "uwaga" : "ok"} etykieta={t(stop ? "UI-M6-KOL-W-STOP" : uwaga ? "UI-M6-KOL-W-UWAGA" : "UI-M6-KOL-W-OK")}>
          {v.powierzchniaM2 !== null && <WynikGlowny>{t("UI-M6-KOL-WYNIK-POZ", { m2: Math.round(v.powierzchniaM2) })}</WynikGlowny>}
          {v.powierzchniaZakresM2 !== null && (
            <p className="mt-1 text-small">{t("UI-M6-KOL-ZAKRES-POZ", { min: Math.round(v.powierzchniaZakresM2.min), max: Math.round(v.powierzchniaZakresM2.max) })}</p>
          )}
          {v.dlugoscOdwiertowM !== null && v.liczbaOdwiertow !== null && (
            <WynikGlowny>{t("UI-M6-KOL-WYNIK-PION", { n: v.liczbaOdwiertow, h: liczba(stan.glebokoscOdwiertuM), l: Math.round(v.dlugoscOdwiertowM) })}</WynikGlowny>
          )}
          {v.dlugoscZakresM !== null && (
            <p className="mt-1 text-small">{t("UI-M6-KOL-ZAKRES-PION", { min: Math.round(v.dlugoscZakresM.min), max: Math.round(v.dlugoscZakresM.max) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/ryzyko-zamarzniecia-dolnego-zrodla" className="text-small underline">
          {t("UI-M6-KOL-LINK-ZAMARZ")}
        </Link>
        <Link href="/kalkulatory/zapotrzebowanie-co-cwu" className="text-small underline">
          {t("UI-M6-KOL-LINK-MOC")}
        </Link>
      </div>
    </main>
  )
}
