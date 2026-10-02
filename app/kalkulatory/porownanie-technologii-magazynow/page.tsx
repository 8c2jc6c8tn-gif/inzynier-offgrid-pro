"use client"

import { useMemo } from "react"
import { calculatePorownanieTechnologii } from "@/lib/core/modules/baterie/porownanie-technologii/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type Tech = ReturnType<typeof calculatePorownanieTechnologii>["value"][number]

const kolumny = (t: (kod: string) => string): Kolumna<Tech>[] => [
  { naglowek: "UI-PORTECMAG-TECHNOLOGIA", render: (tech) => <span className="font-medium">{t(`UI-STALEBAT-TECH-${tech.id.toUpperCase()}`)}</span> },
  { naglowek: "UI-PORTECMAG-CENA-STARTOWA", render: (tech) => t(`UI-STALEBAT-CENA-${tech.cenaStartowa.toUpperCase()}`) },
  { naglowek: "UI-PORTECMAG-CYKLE-DOD", render: (tech) => (tech.id === "trakcyjna" ? t("UI-STALEBAT-TECH-TRAKCYJNA-CYKLE") : tech.cyklePrzyDodOpis) },
  { naglowek: "UI-PORTECMAG-SPRAWNOSC", render: (tech) => (tech.sprawnoscPct === null ? "—" : `${tech.sprawnoscPct}%`) },
  { naglowek: "UI-PORTECMAG-WAGA-KWH", render: (tech) => t(`UI-STALEBAT-TECH-${tech.id.toUpperCase()}-WAGA`) },
  { naglowek: "UI-PORTECMAG-OBSLUGA", render: (tech) => t(`UI-STALEBAT-TECH-${tech.id.toUpperCase()}-OBSLUGA`) },
  {
    naglowek: "UI-PORTECMAG-ENERGIA-CYKLU-ZYCIA",
    render: (tech) => `${tech.energiaCalkowitaKwh.toLocaleString("pl-PL")} kWh`,
    liczbowa: true,
  },
]

type FormularzStan = {
  pojemnoscKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscKwh: "",
}

export default function PorownanieTechnologiiMagazynowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("porownanie-technologii-magazynow", STAN_POCZATKOWY)
  const { pojemnoscKwh } = stan
  const setPojemnoscKwh = (a: string | ((p: string) => string)) =>
    setStan((prev) => ({ ...prev, pojemnoscKwh: typeof a === "function" ? a(prev.pojemnoscKwh) : a }))

  const result = useMemo(
    () =>
      calculatePorownanieTechnologii({
        pojemnoscKwh: pojemnoscKwh === "" ? undefined : Number(pojemnoscKwh),
      }),
    [pojemnoscKwh],
  )

  const isInvalid = result.status === "INVALID_INPUT"
  const blad = result.warnings[0]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/porownanie-technologii-magazynow" />
      <NaglowekEkranu
        tytul={t("UI-PORTECMAG-POROWNANIE-TECHNOLOGII-MAGAZ")}
        ekran="porownanie-technologii-magazynow"
        wynik={result}
      >
        {t("UI-PORTECMAG-CENA-ZAKUPU-SAMO")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-PORTECMAG-PLANOWANA-POJEMNOSC-MAGAZYNU")}
        unit="kWh"
        type="number"
        inputMode="decimal"
        className="max-w-xs"
        placeholder={t("UI-PORTECMAG-BEZ-WPISANIA-POROWNANIE")}
        value={pojemnoscKwh}
        onChange={(e) => setPojemnoscKwh(e.target.value)}
        pomoc={<PomocPola ekran="porownanie-technologii-magazynow" pole="pojemnosc" />}
      />

      {isInvalid ? (
        <WerdyktPanel poziom="blad" etykieta={blad && (blad.message ?? t(blad.i18nKey ?? blad.code, blad.params))} />
      ) : (
        <KartaPorownawcza kolumny={kolumny(t).map((k) => ({ ...k, naglowek: t(k.naglowek) }))} wiersze={result.value} minWidth={640} />
      )}

      {result.assumptions.length > 0 && (
        <ul className="text-small text-muted-foreground">
          {result.assumptions.map((a, i) => (
            <li key={typeof a === "string" ? a : a.kod + i}>{t("UI-PORTECMAG-ZALOZENIE")} {typeof a === "string" ? a : t(a.kod, a.params)}</li>
          ))}
        </ul>
      )}

      <p className="font-mono text-caption text-muted-foreground">{result.formula}</p>
    </main>
  )
}
