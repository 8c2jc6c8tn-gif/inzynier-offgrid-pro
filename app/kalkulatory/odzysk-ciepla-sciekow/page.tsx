"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateOdzyskCieplaSciekow } from "@/lib/core/modules/ogrzewanie/odzysk-ciepla-sciekow/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola = "litry" | "tSciekow" | "tZimnej" | "sprawnosc" | "dni" | "cwu" | "cop"
type FormularzStan = Record<Pola, string>

const STAN_POCZATKOWY: FormularzStan = { litry: "", tSciekow: "", tZimnej: "", sprawnosc: "", dni: "", cwu: "", cop: "" }

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temp = (s: string) => (s === "" ? null : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2C — dawne 5.41: drain water heat recovery. */
export default function OdzyskCieplaSciekowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("odzysk-ciepla-sciekow", STAN_POCZATKOWY)
  const pole = (klucz: Pola, min: number | undefined = 0) => ({
    type: "number",
    inputMode: "decimal" as const,
    min,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateOdzyskCieplaSciekow({
        litryDoba: liczba(stan.litry),
        tSciekowC: temp(stan.tSciekow),
        tZimnejC: temp(stan.tZimnej),
        sprawnoscPct: liczba(stan.sprawnosc),
        dniRok: liczba(stan.dni),
        cwuKwhRok: liczba(stan.cwu),
        copPodgrzewacza: liczba(stan.cop),
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/odzysk-ciepla-sciekow" />
      <NaglowekEkranu tytul={t("UI-M6-DWHR-TYTUL")} ekran="odzysk-ciepla-sciekow" wynik={result}>
        {t("UI-M6-DWHR-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label={t("UI-M6-DWHR-LITRY")} unit="l" {...pole("litry")} pomoc={<PomocPola ekran="odzysk-ciepla-sciekow" pole="litry" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-DWHR-TSCIEKOW")} unit="°C" {...pole("tSciekow", undefined)} pomoc={<PomocPola ekran="odzysk-ciepla-sciekow" pole="tSciekow" />} />
          <Pole label={t("UI-M6-DWHR-TZIMNEJ")} unit="°C" {...pole("tZimnej", undefined)} pomoc={<PomocPola ekran="odzysk-ciepla-sciekow" pole="tZimnej" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-DWHR-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnosc")} pomoc={<PomocPola ekran="odzysk-ciepla-sciekow" pole="sprawnosc" />} />
          <Pole label={t("UI-M6-DWHR-DNI")} unit={t("UI-M6-DWHR-J-DNI")} {...pole("dni")} pomoc={<PomocPola ekran="odzysk-ciepla-sciekow" pole="dni" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-DWHR-CWU")} unit="kWh" {...pole("cwu")} pomoc={<PomocPola ekran="odzysk-ciepla-sciekow" pole="cwu" />} />
          <Pole label={t("UI-M6-DWHR-COP")} {...pole("cop")} pomoc={<PomocPola ekran="odzysk-ciepla-sciekow" pole="cop" />} />
        </div>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-DWHR-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-DWHR-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6-DWHR-W-OK")}>
          <WynikGlowny>{t("UI-M6-DWHR-WYNIK", { kwh: r2(v.cieploDobaKwh) })}</WynikGlowny>
          {v.cieploRokKwh !== null && <p className="mt-1 text-small">{t("UI-M6-DWHR-ROK", { kwh: r2(v.cieploRokKwh) })}</p>}
          {v.udzialCwuPct !== null && <p className="mt-1 text-small">{t("UI-M6-DWHR-UDZIAL", { pct: r2(v.udzialCwuPct) })}</p>}
          {v.pradDobaKwh !== null && <p className="mt-1 text-small">{t("UI-M6-DWHR-PRAD", { kwh: r2(v.pradDobaKwh) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/zasobnik-cwu" className="text-small underline">
        {t("UI-M6-DWHR-LINK-CWU")}
      </Link>
    </main>
  )
}
