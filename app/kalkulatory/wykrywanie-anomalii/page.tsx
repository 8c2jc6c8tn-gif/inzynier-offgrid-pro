"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWykrywanieAnomalii } from "@/lib/core/modules/ai/wykrywanie-anomalii/calculator"
import {
  KASKADA_PV,
  PODSYSTEMY,
  type KrokKaskady,
  type Podsystem,
  type PrzyczynaSpadku,
} from "@/lib/core/modules/ai/wykrywanie-anomalii/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Odp = "" | "tak" | "nie"
type Stan = {
  podsystem: Podsystem
  oczekiwana: string
  zmierzona: string
  prog: string
  kaskada: Partial<Record<KrokKaskady, Odp>>
}
const STAN_POCZATKOWY: Stan = { podsystem: "pv", oczekiwana: "", zmierzona: "", prog: "", kaskada: {} }

const ETYKIETA_PODSYSTEMU: Record<Podsystem, string> = {
  pv: "UI-M10-AN-PODSYSTEM-PV",
  zuzycie: "UI-M10-AN-PODSYSTEM-ZUZYCIE",
}
const PYTANIE: Record<KrokKaskady, string> = {
  pogoda: "UI-M10-AN-KROK-POGODA",
  brud: "UI-M10-AN-KROK-BRUD",
  snieg: "UI-M10-AN-KROK-SNIEG",
  cien: "UI-M10-AN-KROK-CIEN",
}
const ETYKIETA_PRZYCZYNY: Record<PrzyczynaSpadku, string> = {
  pogoda: "UI-M10-AN-P-POGODA",
  brud: "UI-M10-AN-P-BRUD",
  snieg: "UI-M10-AN-P-SNIEG",
  cien: "UI-M10-AN-P-CIEN",
  uszkodzenie: "UI-M10-AN-P-USZKODZENIE",
}
const r1 = (x: number) => Math.round(x * 10) / 10
const naOdp = (o: Odp | undefined): boolean | null => (o === "tak" ? true : o === "nie" ? false : null)

/** Moduł 10, Ekran 7 — wykrywanie anomalii (dawne 12.13, 12.14, 12.17), Wzorzec C. */
export default function WykrywanieAnomaliiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("wykrywanie-anomalii", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateWykrywanieAnomalii({
        podsystem: stan.podsystem,
        oczekiwanaKwh: liczba(stan.oczekiwana) ?? 0,
        zmierzonaKwh: liczba(stan.zmierzona) ?? 0,
        progAlarmuPct: liczba(stan.prog) ?? null,
        kaskada: Object.fromEntries(KASKADA_PV.map((k) => [k, naOdp(stan.kaskada[k])])),
      }),
    [stan],
  )
  const v = result.value
  const pokazKaskade = stan.podsystem === "pv" && result.status !== "INCOMPLETE" && result.status !== "INVALID_INPUT" && v.odchylenieKwh < 0 && v.przekroczonyProg !== false

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wykrywanie-anomalii" />
      <NaglowekEkranu tytul={t("UI-M10-AN-TYTUL")} ekran="wykrywanie-anomalii" wynik={result}>
        {t("UI-M10-AN-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <PoleSelect
          label={t("UI-M10-AN-PODSYSTEM")}
          value={stan.podsystem}
          onChange={(e) => setStan((s) => ({ ...s, podsystem: e.target.value as Podsystem }))}
          pomoc={<PomocPola ekran="wykrywanie-anomalii" pole="podsystem" />}
        >
          {PODSYSTEMY.map((p) => (
            <option key={p} value={p}>
              {t(ETYKIETA_PODSYSTEMU[p])}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label={t("UI-M10-AN-OCZEKIWANA")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.oczekiwana}
          onChange={(e) => setStan((s) => ({ ...s, oczekiwana: e.target.value }))}
          pomoc={<PomocPola ekran="wykrywanie-anomalii" pole="oczekiwana" />}
        />
        <Pole
          label={t("UI-M10-AN-ZMIERZONA")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zmierzona}
          onChange={(e) => setStan((s) => ({ ...s, zmierzona: e.target.value }))}
          pomoc={<PomocPola ekran="wykrywanie-anomalii" pole="zmierzona" />}
        />
        <Pole
          label={t("UI-M10-AN-PROG")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.prog}
          onChange={(e) => setStan((s) => ({ ...s, prog: e.target.value }))}
          pomoc={<PomocPola ekran="wykrywanie-anomalii" pole="prog" />}
        />
      </section>

      {pokazKaskade && (
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">{t("UI-M10-AN-KASKADA")}</h2>
          {KASKADA_PV.map((k) => (
            <PoleSelect
              key={k}
              label={t(PYTANIE[k])}
              value={stan.kaskada[k] ?? ""}
              onChange={(e) => setStan((s) => ({ ...s, kaskada: { ...s.kaskada, [k]: e.target.value as Odp } }))}
              pomoc={<PomocPola ekran="wykrywanie-anomalii" pole={k} />}
            >
              <option value="">{t("UI-WYBIERZ")}</option>
              <option value="tak">{t("UI-TAK")}</option>
              <option value="nie">{t("UI-NIE")}</option>
            </PoleSelect>
          ))}
        </section>
      )}

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M10-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M10-AN-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziomZStatusu(result.status)} etykieta={t("UI-M10-AN-W-RAPORT")}>
          <WynikGlowny>{t("UI-M10-AN-WYNIK", { pct: r1(v.odchyleniePct), kwh: r1(v.odchylenieKwh) })}</WynikGlowny>
          {v.przyczyna && <p className="mt-2 text-small">{t("UI-M10-AN-PRZYCZYNA", { p: t(ETYKIETA_PRZYCZYNY[v.przyczyna]) })}</p>}
          {v.nastepnyKrok && <p className="mt-2 text-small">{t("UI-M10-AN-NASTEPNY", { k: t(PYTANIE[v.nastepnyKrok]) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/prognozy" className="text-small underline">
        {t("UI-M10-AN-LINK-PROGNOZY")}
      </Link>
      <Link href="/kalkulatory/czystosc-i-snieg" className="text-small underline">
        {t("UI-M10-AN-LINK-CZYSTOSC")}
      </Link>
      <Link href="/kalkulatory/analiza-zacienienia" className="text-small underline">
        {t("UI-M10-AN-LINK-ZACIENIENIE")}
      </Link>
      <Link href="/kalkulatory/awaria-stringa-zima" className="text-small underline">
        {t("UI-M10-AN-LINK-STRING")}
      </Link>
      <Link href="/kalkulatory/soh-per-ogniwo" className="text-small underline">
        {t("UI-M10-AN-LINK-SOH")}
      </Link>
    </main>
  )
}
