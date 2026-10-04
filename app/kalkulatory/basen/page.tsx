"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBasen } from "@/lib/core/modules/ogrzewanie/basen/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola = "objetosc" | "przyrost" | "moc" | "cop" | "spadek"
type FormularzStan = Record<Pola, string>

const STAN_POCZATKOWY: FormularzStan = { objetosc: "", przyrost: "", moc: "", cop: "", spadek: "" }

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2C — dawne 5.48: heat pump pool heating. */
export default function BasenPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("basen", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateBasen({
        objetoscM3: liczba(stan.objetosc),
        przyrostK: liczba(stan.przyrost),
        mocPompyKw: liczba(stan.moc),
        cop: liczba(stan.cop),
        spadekNocK: liczba(stan.spadek),
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/basen" />
      <NaglowekEkranu tytul={t("UI-M6-BAS-TYTUL")} ekran="basen" wynik={result}>
        {t("UI-M6-BAS-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-BAS-OBJETOSC")} unit="m³" {...pole("objetosc")} pomoc={<PomocPola ekran="basen" pole="objetosc" />} />
          <Pole label={t("UI-M6-BAS-PRZYROST")} unit="K" {...pole("przyrost")} pomoc={<PomocPola ekran="basen" pole="przyrost" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-BAS-MOC")} unit="kW" {...pole("moc")} pomoc={<PomocPola ekran="basen" pole="moc" />} />
          <Pole label={t("UI-M6-BAS-COP")} {...pole("cop")} pomoc={<PomocPola ekran="basen" pole="cop" />} />
        </div>
        <Pole label={t("UI-M6-BAS-SPADEK")} unit="K" {...pole("spadek")} pomoc={<PomocPola ekran="basen" pole="spadek" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BAS-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-BAS-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6-BAS-W-OK")}>
          <WynikGlowny>{t("UI-M6-BAS-WYNIK", { kwh: r2(v.cieploKwh), h: r2(v.czasH) })}</WynikGlowny>
          {v.pradKwh !== null && <p className="mt-1 text-small">{t("UI-M6-BAS-PRAD", { kwh: r2(v.pradKwh), grzalka: r2(v.cieploKwh) })}</p>}
          {v.cieploNocKwh !== null && (
            <p className="mt-1 text-small">
              {v.pradNocKwh === null
                ? t("UI-M6-BAS-NOC", { cieplo: r2(v.cieploNocKwh) })
                : t("UI-M6-BAS-NOC-PRAD", { cieplo: r2(v.cieploNocKwh), prad: r2(v.pradNocKwh) })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/cop-pompy-ciepla" className="text-small underline">
        {t("UI-M6-BAS-LINK-COP")}
      </Link>
    </main>
  )
}
