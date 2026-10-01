"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateAlternatywneZrodlaCiepla } from "@/lib/core/modules/ogrzewanie/alternatywne-zrodla-ciepla/calculator"
import type { ZrodloAlternatywne } from "@/lib/core/modules/ogrzewanie/alternatywne-zrodla-ciepla/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import type { PolePomocy } from "@/lib/i18n/pomoc"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe =
  | "zapotrzebowanieKw"
  | "kominekMocKw"
  | "kominekDoWodyPct"
  | "irMocW"
  | "irGodzinNaDobe"
  | "matyMocWm2"
  | "matyPowierzchniaM2"
  | "pcmObjetoscL"
  | "pcmGestoscKgL"
  | "pcmCieploTopnieniaKjKg"
  | "buforDeltaTK"
type Flagi = "kominekZabezpieczenieBezPradu" | "irJakoPodstawowe" | "matyStropNieizolowany"

type FormularzStan = Record<PolaLiczbowe, string> & Record<Flagi, boolean> & { zrodlo: ZrodloAlternatywne | null }

const STAN_POCZATKOWY: FormularzStan = {
  zrodlo: null,
  zapotrzebowanieKw: "",
  kominekMocKw: "",
  kominekDoWodyPct: "",
  kominekZabezpieczenieBezPradu: false,
  irMocW: "",
  irGodzinNaDobe: "",
  irJakoPodstawowe: false,
  matyMocWm2: "",
  matyPowierzchniaM2: "",
  matyStropNieizolowany: false,
  pcmObjetoscL: "",
  pcmGestoscKgL: "",
  pcmCieploTopnieniaKjKg: "",
  buforDeltaTK: "",
}

const ZRODLA: ZrodloAlternatywne[] = ["kominek", "kociol-elektryczny", "ir", "maty", "pcm"]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function AlternatywneZrodlaCieplaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("alternatywne-zrodla-ciepla", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const flaga = (klucz: Flagi, etykieta: string, pomoc: PolePomocy<"alternatywne-zrodla-ciepla">) => (
    <div className="flex items-center gap-2">
      <PoleCheckbox
        id={`alternatywne-zrodla-ciepla-${klucz}`}
        className="flex-1"
        label={t(etykieta)}
        checked={stan[klucz]}
        onChange={(e) => setStan((prev) => ({ ...prev, [klucz]: e.target.checked }))}
      />
      <PomocPola ekran="alternatywne-zrodla-ciepla" pole={pomoc} />
    </div>
  )

  const result = useMemo(
    () =>
      calculateAlternatywneZrodlaCiepla({
        zrodlo: stan.zrodlo,
        zapotrzebowanieKw: liczba(stan.zapotrzebowanieKw),
        kominekMocKw: liczba(stan.kominekMocKw),
        kominekDoWodyPct: liczba(stan.kominekDoWodyPct),
        kominekZabezpieczenieBezPradu: stan.kominekZabezpieczenieBezPradu,
        irMocW: liczba(stan.irMocW),
        irGodzinNaDobe: liczba(stan.irGodzinNaDobe),
        irJakoPodstawowe: stan.irJakoPodstawowe,
        matyMocWm2: liczba(stan.matyMocWm2),
        matyPowierzchniaM2: liczba(stan.matyPowierzchniaM2),
        matyStropNieizolowany: stan.matyStropNieizolowany,
        pcmObjetoscL: liczba(stan.pcmObjetoscL),
        pcmGestoscKgL: liczba(stan.pcmGestoscKgL),
        pcmCieploTopnieniaKjKg: liczba(stan.pcmCieploTopnieniaKjKg),
        buforDeltaTK: liczba(stan.buforDeltaTK),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")
  const zapotrzebowanie = <Pole label={t("UI-M6-ALT-ZAPOTRZEBOWANIE")} unit="kW" {...pole("zapotrzebowanieKw")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="zapotrzebowanie" />} />

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/alternatywne-zrodla-ciepla" />
      <NaglowekEkranu tytul={t("UI-M6-ALT-TYTUL")} ekran="alternatywne-zrodla-ciepla" wynik={result}>
        {t("UI-M6-ALT-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex items-center gap-1.5 text-small font-medium">
          {t("UI-M6-ALT-ZRODLO")} <PomocPola ekran="alternatywne-zrodla-ciepla" pole="zrodlo" />
        </legend>
        <div role="tablist" aria-label={t("UI-M6-ALT-ZRODLO")} className="flex flex-wrap gap-2">
          {ZRODLA.map((z) => (
            <Button key={z} role="tab" aria-selected={z === stan.zrodlo} variant={z === stan.zrodlo ? "default" : "outline"} onClick={() => setStan((prev) => ({ ...prev, zrodlo: z }))}>
              {t(`UI-M6-ALT-Z-${z.toUpperCase()}`)}
            </Button>
          ))}
        </div>
        {stan.zrodlo !== null && <p className="mt-2 text-small text-muted-foreground">{t(`UI-M6-ALT-K-${stan.zrodlo.toUpperCase()}`)}</p>}
      </fieldset>

      {stan.zrodlo === "kominek" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="sr-only">{t("UI-M6-ALT-Z-KOMINEK")}</legend>
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6-ALT-KOMINEK-MOC")} unit="kW" {...pole("kominekMocKw")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="kominekMoc" />} />
            <Pole label={t("UI-M6-ALT-KOMINEK-UDZIAL")} unit="%" max={100} {...pole("kominekDoWodyPct")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="kominekUdzial" />} />
          </div>
          {zapotrzebowanie}
          {flaga("kominekZabezpieczenieBezPradu", "UI-M6-ALT-KOMINEK-ZABEZP", "kominekZabezp")}
        </fieldset>
      )}

      {stan.zrodlo === "ir" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="sr-only">{t("UI-M6-ALT-Z-IR")}</legend>
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6-ALT-IR-MOC")} unit="W" {...pole("irMocW")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="irMoc" />} />
            <Pole label={t("UI-M6-ALT-IR-GODZIN")} unit={t("UI-M6-J-H-DOBE")} max={24} {...pole("irGodzinNaDobe")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="irGodzin" />} />
          </div>
          {flaga("irJakoPodstawowe", "UI-M6-ALT-IR-PODSTAWOWE", "irPodstawowe")}
        </fieldset>
      )}

      {stan.zrodlo === "maty" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="sr-only">{t("UI-M6-ALT-Z-MATY")}</legend>
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6-ALT-MATY-Q")} unit="W/m²" {...pole("matyMocWm2")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="matyQ" />} />
            <Pole label={t("UI-M6-ALT-MATY-A")} unit="m²" {...pole("matyPowierzchniaM2")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="matyA" />} />
          </div>
          {zapotrzebowanie}
          {flaga("matyStropNieizolowany", "UI-M6-ALT-MATY-STROP", "matyStrop")}
        </fieldset>
      )}

      {stan.zrodlo === "pcm" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="sr-only">{t("UI-M6-ALT-Z-PCM")}</legend>
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6-ALT-PCM-V")} unit="l" {...pole("pcmObjetoscL")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="pcmV" />} />
            <Pole label={t("UI-M6-ALT-PCM-GESTOSC")} unit="kg/l" {...pole("pcmGestoscKgL")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="pcmGestosc" />} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6-ALT-PCM-L")} unit="kJ/kg" {...pole("pcmCieploTopnieniaKjKg")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="pcmL" />} />
            <Pole label={t("UI-M6-ALT-PCM-DT")} unit="K" {...pole("buforDeltaTK")} pomoc={<PomocPola ekran="alternatywne-zrodla-ciepla" pole="pcmDt" />} />
          </div>
        </fieldset>
      )}

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6-ALT-W-KOCIOL")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-ALT-W-UWAGA" : "UI-M6-ALT-W-OK")}>
          {v.kominekDoWodyKw !== null && v.kominekDoPowietrzaKw !== null && (
            <WynikGlowny>{t("UI-M6-ALT-KOMINEK-WYNIK", { woda: r2(v.kominekDoWodyKw), powietrze: r2(v.kominekDoPowietrzaKw) })}</WynikGlowny>
          )}
          {v.irEnergiaKwhDoba !== null && <WynikGlowny>{t("UI-M6-ALT-IR-WYNIK", { kwh: r2(v.irEnergiaKwhDoba) })}</WynikGlowny>}
          {v.matyMocKw !== null && <WynikGlowny>{t("UI-M6-ALT-MATY-WYNIK", { kw: r2(v.matyMocKw) })}</WynikGlowny>}
          {v.pcmEnergiaKwh !== null && <WynikGlowny>{t("UI-M6-ALT-PCM-WYNIK", { kwh: r2(v.pcmEnergiaKwh) })}</WynikGlowny>}
          {v.pokrycieZapotrzebowaniaPct !== null && <p className="mt-1 text-small">{t("UI-M6-ALT-POKRYCIE", { pct: Math.round(v.pokrycieZapotrzebowaniaPct) })}</p>}
          {v.kominekPokrycieRazemPct !== null && <p className="mt-1 text-small">{t("UI-M6-ALT-POKRYCIE-RAZEM", { pct: Math.round(v.kominekPokrycieRazemPct) })}</p>}
          {v.rownowaznikWodyL !== null && <p className="mt-1 text-small">{t("UI-M6-ALT-PCM-WODA", { l: Math.round(v.rownowaznikWodyL), dt: r1(liczba(stan.buforDeltaTK)) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/kociol-elektryczny" className="text-small underline">
          {t("UI-M6-ALT-LINK-KOCIOL")}
        </Link>
        <Link href="/kalkulatory/bufor-ciepla" className="text-small underline">
          {t("UI-M6-ALT-LINK-BUFOR")}
        </Link>
        <Link href="/kalkulatory/awaryjne-zrodlo-ciepla" className="text-small underline">
          {t("UI-M6-ALT-LINK-AWARYJNE")}
        </Link>
        <Link href="/kalkulatory/dystrybucja-ciepla" className="text-small underline">
          {t("UI-M6-ALT-LINK-DYSTRYBUCJA")}
        </Link>
      </div>
    </main>
  )
}
