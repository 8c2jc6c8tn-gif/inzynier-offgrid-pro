"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateOslonyPrzeciwsloneczne } from "@/lib/core/modules/ogrzewanie/oslony-przeciwsloneczne/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = "wysiegM" | "odstepM" | "wysokoscOknaM"

type FormularzStan = Record<PolaLiczbowe, string> & { szerokoscDeg: string }

const STAN_POCZATKOWY: FormularzStan = { szerokoscDeg: "", wysiegM: "", odstepM: "", wysokoscOknaM: "" }

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function OslonyPrzeciwslonecznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("oslony-przeciwsloneczne", STAN_POCZATKOWY)
  const { lokalizacja } = useLokalizacjaProjektu()
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    step: 0.05,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const szerokosc = stan.szerokoscDeg !== "" ? Number(stan.szerokoscDeg) : (lokalizacja?.szerokosc ?? null)

  const result = useMemo(
    () =>
      calculateOslonyPrzeciwsloneczne({
        szerokoscDeg: szerokosc,
        wysiegM: liczba(stan.wysiegM),
        odstepM: liczba(stan.odstepM),
        wysokoscOknaM: liczba(stan.wysokoscOknaM),
      }),
    [stan, szerokosc],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oslony-przeciwsloneczne" />
      <NaglowekEkranu tytul={t("UI-M6-OSL-TYTUL")} ekran="oslony-przeciwsloneczne" wynik={result}>
        {t("UI-M6-OSL-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <Pole
          label={t("UI-M6-OSL-SZEROKOSC")}
          unit="°N"
          type="number"
          inputMode="decimal"
          value={stan.szerokoscDeg}
          onChange={(e) => setStan((prev) => ({ ...prev, szerokoscDeg: e.target.value }))}
          pomoc={<PomocPola ekran="oslony-przeciwsloneczne" pole="szerokosc" />}
        />
        {stan.szerokoscDeg === "" && lokalizacja && <p className="text-caption text-muted-foreground">{t("UI-M6-OSL-Z-PROJEKTU", { lat: r2(lokalizacja.szerokosc) })}</p>}
        <Pole label={t("UI-M6-OSL-WYSIEG")} unit="m" {...pole("wysiegM")} pomoc={<PomocPola ekran="oslony-przeciwsloneczne" pole="wysieg" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-OSL-ODSTEP")} unit="m" {...pole("odstepM")} pomoc={<PomocPola ekran="oslony-przeciwsloneczne" pole="odstep" />} />
          <Pole label={t("UI-M6-OSL-WYSOKOSC")} unit="m" {...pole("wysokoscOknaM")} pomoc={<PomocPola ekran="oslony-przeciwsloneczne" pole="wysokosc" />} />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-M6-OSL-W-POZA")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-OSL-W-UWAGA" : "UI-M6-OSL-W-OK")}>
          <WynikGlowny>{t("UI-M6-OSL-WYNIK", { lato: Math.round(v.zacienienieLatoPct), zima: Math.round(v.zacienienieZimaPct) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M6-OSL-SLONCE", { lato: r1(v.wysokoscLatoDeg), zima: r1(v.wysokoscZimaDeg) })}</p>
          <p className="mt-1 text-small">{t("UI-M6-OSL-WYSIEGI", { pelny: r2(v.wysiegPelnyCienLatoM), max: r2(v.wysiegMaxBezCieniaZimaM) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/lokalizacja-i-klimat" className="text-small underline">
        {t("UI-M6-OSL-LINK-E1")}
      </Link>
    </main>
  )
}
