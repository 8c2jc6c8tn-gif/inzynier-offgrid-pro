"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateModelSezonowyPompy, type MiesiacPompy } from "@/lib/core/modules/ogrzewanie/model-sezonowy-pompy/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useWynikEkranu1 } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Stan = { cieplo: string[]; cop: string[]; scop: string }

const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-${i + 1}`)
const STAN_POCZATKOWY: Stan = { cieplo: Array(12).fill(""), cop: Array(12).fill(""), scop: "" }
const r0 = (x: number) => Math.round(x)
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2C — dawne 5.64 (model zużycia w sezonie) z realnym SCOP z dokładki 2B do Ekranu 5 (dawne 5.43). */
export default function ModelSezonowyPompyCieplaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("model-sezonowy-pompy-ciepla", STAN_POCZATKOWY)
  const e1 = useWynikEkranu1()
  const ustaw = (klucz: "cieplo" | "cop", i: number, wartosc: string) =>
    setStan((s) => ({ ...s, [klucz]: s[klucz].map((x, j) => (j === i ? wartosc : x)) }))

  // Empty heat field = the month from Screen 1 (source: „z zapotrzebowania na ciepło w sezonie (funkcja 5.2)”).
  const cieploE1 = useMemo(() => {
    const m: (number | null)[] = Array(12).fill(null)
    e1?.miesiace?.forEach((x) => (m[x.miesiac - 1] = r0(x.cieploKwh)))
    return m
  }, [e1])
  const result = useMemo(
    () =>
      calculateModelSezonowyPompy({
        cieploKwh: stan.cieplo.map((s, i) => liczba(s) ?? cieploE1[i] ?? null),
        cop: stan.cop.map((s) => liczba(s) ?? null),
        scopKatalogowy: liczba(stan.scop) ?? 0,
      }),
    [stan, cieploE1],
  )
  const v = result.value

  const kolumny: Kolumna<MiesiacPompy & { id: number }>[] = [
    { naglowek: t("UI-M6D-MSP-MIESIAC"), render: (r) => t(MIESIACE[r.miesiac - 1]!) },
    { naglowek: t("UI-M6D-MSP-CIEPLO-KWH"), render: (r) => r0(r.cieploKwh), liczbowa: true },
    { naglowek: "COP", render: (r) => r2(r.cop), liczbowa: true },
    { naglowek: t("UI-M6D-MSP-PRAD-KWH"), render: (r) => r0(r.energiaKwh), liczbowa: true },
    { naglowek: t("UI-M6D-MSP-PRAD-DOBA"), render: (r) => r1(r.energiaDobaKwh), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/model-sezonowy-pompy-ciepla" />
      <NaglowekEkranu tytul={t("UI-M6D-MSP-TYTUL")} ekran="model-sezonowy-pompy-ciepla" wynik={result}>
        {t("UI-M6D-MSP-OPIS")}
      </NaglowekEkranu>

      <p className="text-small text-muted-foreground">{e1?.miesiace ? t("UI-M6D-MSP-Z-EKRANU-1") : t("UI-M6D-MSP-BEZ-EKRANU-1")}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MIESIACE.map((m, i) => (
          <fieldset key={m} className="grid grid-cols-2 gap-2 rounded-md border p-2">
            <legend className="px-1 text-small font-medium">{t(m)}</legend>
            <Pole
              id={`msp-cieplo-${i}`}
              label={t("UI-M6D-MSP-CIEPLO")}
              unit="kWh"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder={cieploE1[i] !== null ? String(cieploE1[i]) : undefined}
              value={stan.cieplo[i] ?? ""}
              onChange={(e) => ustaw("cieplo", i, e.target.value)}
              pomoc={<PomocPola ekran="model-sezonowy-pompy-ciepla" pole="cieplo" />}
            />
            <Pole
              id={`msp-cop-${i}`}
              label="COP"
              type="number"
              inputMode="decimal"
              min={1}
              value={stan.cop[i] ?? ""}
              onChange={(e) => ustaw("cop", i, e.target.value)}
              pomoc={<PomocPola ekran="model-sezonowy-pompy-ciepla" pole="cop" />}
            />
          </fieldset>
        ))}
      </div>
      <Pole
        label={t("UI-M6D-MSP-SCOP-KAT")}
        type="number"
        inputMode="decimal"
        min={1}
        value={stan.scop}
        onChange={(e) => setStan((s) => ({ ...s, scop: e.target.value }))}
        pomoc={<PomocPola ekran="model-sezonowy-pompy-ciepla" pole="scop" />}
      />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-MSP-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6D-MSP-W-OK")}>
          <WynikGlowny>{t("UI-M6D-MSP-WYNIK", { kwh: r0(v.energiaSumaKwh), scop: r2(v.scopRealny) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M6D-MSP-NAJWIECEJ", { miesiac: t(MIESIACE[v.najwiekszyMiesiac - 1]!), kwh: r0(v.miesiace.find((m) => m.miesiac === v.najwiekszyMiesiac)!.energiaKwh) })}
          </p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.miesiace.map((m) => ({ ...m, id: m.miesiac }))} minWidth={360} />
          </div>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/cop-pompy-ciepla" className="text-small underline">
        {t("UI-M6D-MSP-LINK-E5")}
      </Link>
      <Link href="/kalkulatory/cykle-odszraniania" className="text-small underline">
        {t("UI-M6D-MSP-LINK-E6")}
      </Link>
    </main>
  )
}
