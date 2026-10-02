"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateOsadNaPv } from "@/lib/core/modules/stress-test/osad-na-pv/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola = "produkcja" | "dni" | "pozostala"
type FormularzStan = Record<Pola, string>

const STAN_POCZATKOWY: FormularzStan = { produkcja: "", dni: "", pozostala: "" }

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

/** Ekran 14, Moduł 7 — rime case of the shared deposit engine (Screen 7). */
export default function SzadzNaPvPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("szadz-na-pv", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateOsadNaPv({
        rodzaj: "szadz",
        katDeg: null,
        produkcjaDobaKwh: liczba(stan.produkcja),
        dniZalegania: liczba(stan.dni),
        pozostalaProdukcjaPct: liczba(stan.pozostala),
        nierownoStringi: false,
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szadz-na-pv" />
      <NaglowekEkranu tytul={t("UI-M7-SZADZ-TYTUL")} ekran="szadz-na-pv" wynik={result}>
        {t("UI-M7-SZADZ-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label={t("UI-M7-OSAD-PRODUKCJA")} unit="kWh" {...pole("produkcja")} pomoc={<PomocPola ekran="szadz-na-pv" pole="produkcja" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-OSAD-DNI")} {...pole("dni")} pomoc={<PomocPola ekran="szadz-na-pv" pole="dni" />} />
          <Pole label={t("UI-M7-OSAD-POZOSTALA")} unit="%" max={100} {...pole("pozostala")} pomoc={<PomocPola ekran="szadz-na-pv" pole="pozostala" />} />
        </div>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-OSAD-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-OSAD-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-M7-OSAD-W-UWAGA")}>
          <WynikGlowny>{t("UI-M7-OSAD-WYNIK", { kwh: r2(v.utrataKwh) })}</WynikGlowny>
          {v.produkcjaPodOsademKwh > 0 && <p className="mt-1 text-small">{t("UI-M7-OSAD-POD", { kwh: r2(v.produkcjaPodOsademKwh) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/snieg-na-pv" className="text-small underline">
          {t("UI-M7-OSAD-TYTUL")} →
        </Link>
        <Link href="/kalkulatory/blackout" className="text-small underline">
          {t("UI-M7-OSAD-LINK-BLACKOUT")}
        </Link>
      </div>
    </main>
  )
}
