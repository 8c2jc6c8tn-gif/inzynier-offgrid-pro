"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateLadowanieZAgregatu } from "@/lib/core/modules/stress-test/ladowanie-z-agregatu/calculator"
import type { LadowanieZAgregatuInput } from "@/lib/core/modules/stress-test/ladowanie-z-agregatu/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = Record<keyof LadowanieZAgregatuInput, string>

// Every field empty — all values come from the user's devices (Directive #1).
const STAN_POCZATKOWY: FormularzStan = {
  mocAgregatuKw: "",
  mocLadowarkiKw: "",
  mocOdbiornikowKw: "",
  pojemnoscKwh: "",
  socStartPct: "",
  socStopPct: "",
  sprawnoscLadowaniaPct: "",
  zuzyciePaliwaLH: "",
  cenaPaliwaZlL: "",
}

const POLA: { pole: keyof LadowanieZAgregatuInput; label: string; unit: string }[] = [
  { pole: "mocAgregatuKw", label: "UI-M7-LADAG-AGREGAT", unit: "kW" },
  { pole: "mocLadowarkiKw", label: "UI-M7-LADAG-LADOWARKA", unit: "kW" },
  { pole: "mocOdbiornikowKw", label: "UI-M7-LADAG-ODBIORNIKI", unit: "kW" },
  { pole: "pojemnoscKwh", label: "UI-M7-LADAG-POJEMNOSC", unit: "kWh" },
  { pole: "socStartPct", label: "UI-M7-LADAG-SOC-START", unit: "%" },
  { pole: "socStopPct", label: "UI-M7-LADAG-SOC-STOP", unit: "%" },
  { pole: "sprawnoscLadowaniaPct", label: "UI-M7-LADAG-SPRAWNOSC", unit: "%" },
  { pole: "zuzyciePaliwaLH", label: "UI-M7-LADAG-ZUZYCIE", unit: "l/h" },
  { pole: "cenaPaliwaZlL", label: "UI-M7-LADAG-CENA", unit: "UI-J-ZL-L" },
]

const KWOTY = przeliczPola<FormularzStan>("cenaPaliwaZlL")

const liczba = (v: string) => (v === "" ? null : Number(v))
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function LadowanieZAgregatuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ladowanie-z-agregatu", STAN_POCZATKOWY, KWOTY)
  const result = useMemo(
    () =>
      calculateLadowanieZAgregatu(
        Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as LadowanieZAgregatuInput,
      ),
    [stan],
  )
  const v = result.value
  const krytyczne = result.warnings.some((w) => w.level === "critical")
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ladowanie-z-agregatu" />
      <NaglowekEkranu tytul={t("UI-M7-LADAG-TYTUL")} ekran="ladowanie-z-agregatu" wynik={result}>
        {t("UI-M7-LADAG-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={t(label)}
            unit={unit.startsWith("UI-") ? t(unit) : unit}
            type="number"
            inputMode="decimal"
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="ladowanie-z-agregatu" pole={pole} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-LADAG-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-LADAG-WPISZ")}</p>
      ) : krytyczne ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-LADAG-BRAK-ZAPASU")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={uwaga ? t("UI-M7-LADAG-WYNIK-UWAGA") : t("UI-M7-LADAG-WYNIK-OK")}>
          {v.czasPracyH !== null && <WynikGlowny>{t("UI-M7-LADAG-CZAS", { czas: f2(v.czasPracyH) })}</WynikGlowny>}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {v.mocLadowaniaKw !== null && <li>{t("UI-M7-LADAG-MOC", { moc: f2(v.mocLadowaniaKw) })}</li>}
            {v.obciazeniePct !== null && <li>{t("UI-M7-LADAG-OBCIAZENIE", { procent: f0(v.obciazeniePct) })}</li>}
            {v.energiaDoMagazynuKwh !== null && <li>{t("UI-M7-LADAG-ENERGIA", { energia: f2(v.energiaDoMagazynuKwh) })}</li>}
            {v.energiaLadowaniaAcKwh !== null && <li>{t("UI-M7-LADAG-ENERGIA-AC", { energia: f2(v.energiaLadowaniaAcKwh) })}</li>}
            {v.energiaAgregatuKwh !== null && <li>{t("UI-M7-LADAG-ENERGIA-AGREGATU", { energia: f2(v.energiaAgregatuKwh) })}</li>}
            {v.paliwoL !== null && <li>{t("UI-M7-LADAG-PALIWO", { paliwo: f2(v.paliwoL) })}</li>}
            {v.litryNaKwh !== null && <li>{t("UI-M7-LADAG-LITRY-KWH", { wartosc: f2(v.litryNaKwh) })}</li>}
            {v.litryNaKwhMagazynu !== null && <li>{t("UI-M7-LADAG-LITRY-KWH-MAG", { wartosc: f2(v.litryNaKwhMagazynu) })}</li>}
            {v.kosztZl !== null && <li>{t("UI-M7-LADAG-KOSZT", { koszt: f2(v.kosztZl) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/deficyty-miesieczne" className="text-small underline">
        {t("UI-M7-LADAG-LINK-E2")}
      </Link>
    </main>
  )
}
