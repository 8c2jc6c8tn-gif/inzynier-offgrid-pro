"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculatePrzesuwanieZadan, godzinaTekst, type ZadanieZaplanowane } from "@/lib/core/modules/ai/przesuwanie-zadan/calculator"
import { KROK_PROBKOWANIA_H } from "@/lib/core/modules/ai/prognozy/calculator"
import { SAMPLE_PROGNOZA_24H } from "@/lib/core/modules/ai/prognozy/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type ZadanieStan = { id: string; nazwa: string; moc: string; czas: string; od: string; do: string }
type Stan = { produkcja: string[]; zuzycie: string[]; zadania: ZadanieStan[] }

const GODZINY = Array.from({ length: 24 / KROK_PROBKOWANIA_H }, (_, i) => i * KROK_PROBKOWANIA_H)
const STAN_POCZATKOWY: Stan = {
  produkcja: GODZINY.map(() => ""),
  zuzycie: GODZINY.map(() => ""),
  zadania: [{ id: "z1", nazwa: "", moc: "", czas: "", od: "", do: "" }],
}
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 10, Ekran 5 — dynamiczne przesuwanie zadań domowych (dawne 12.10). */
export default function PrzesuwanieZadanPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("przesuwanie-zadan", STAN_POCZATKOWY)

  const ustawPrognoze = (klucz: "produkcja" | "zuzycie", i: number, wartosc: string) =>
    setStan((s) => ({ ...s, [klucz]: s[klucz].map((x, j) => (j === i ? wartosc : x)) }))
  const ustawZadanie = (id: string, zmiana: Partial<ZadanieStan>) =>
    setStan((s) => ({ ...s, zadania: s.zadania.map((z) => (z.id === id ? { ...z, ...zmiana } : z)) }))
  const dodajZadanie = () =>
    setStan((s) => ({ ...s, zadania: [...s.zadania, { id: `z${Date.now()}`, nazwa: "", moc: "", czas: "", od: "", do: "" }] }))
  const usunZadanie = (id: string) => setStan((s) => ({ ...s, zadania: s.zadania.filter((z) => z.id !== id) }))
  const wstawPrzyklad = () =>
    setStan((s) => ({
      ...s,
      produkcja: GODZINY.map((g) => String(SAMPLE_PROGNOZA_24H.find((p) => p.godzina === g)?.produkcjaKw ?? 0)),
      zuzycie: GODZINY.map((g) => String(SAMPLE_PROGNOZA_24H.find((p) => p.godzina === g)?.zuzycieKw ?? 0)),
    }))

  const result = useMemo(
    () =>
      calculatePrzesuwanieZadan({
        prognoza: GODZINY.map((godzina, i) => ({
          godzina,
          produkcjaKw: liczba(stan.produkcja[i] ?? "") ?? 0,
          zuzycieKw: liczba(stan.zuzycie[i] ?? "") ?? 0,
        })),
        zadania: stan.zadania.map((z, i) => ({
          id: z.id,
          nazwa: z.nazwa.trim() || t("UI-M10-PRZ-ZADANIE-NR", { n: i + 1 }),
          mocKw: liczba(z.moc) ?? 0,
          czasTrwaniaH: liczba(z.czas) ?? 0,
          najwczesniejOdH: liczba(z.od) ?? 0,
          gotoweDoH: liczba(z.do) ?? 24,
        })),
      }),
    [stan, t],
  )
  const v = result.value

  const kolumny: Kolumna<ZadanieZaplanowane>[] = [
    { naglowek: t("UI-M10-PRZ-KOL-ZADANIE"), render: (r) => r.nazwa },
    {
      naglowek: t("UI-M10-PRZ-KOL-KIEDY"),
      render: (r) => (r.startH === null ? t("UI-M10-PRZ-NIE-MIESCI") : `${godzinaTekst(r.startH)}–${godzinaTekst(r.koniecH!)}`),
    },
    { naglowek: t("UI-M10-PRZ-KOL-Z-PV"), render: (r) => r2(r.zPvKwh), liczbowa: true },
    { naglowek: t("UI-M10-PRZ-KOL-Z-BATERII"), render: (r) => r2(r.zBateriiKwh), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przesuwanie-zadan" />
      <NaglowekEkranu tytul={t("UI-M10-PRZ-TYTUL")} ekran="przesuwanie-zadan" wynik={result}>
        {t("UI-M10-PRZ-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M10-PRZ-PROGNOZA")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-M10-PRZ-PROGNOZA-OPIS")}</p>
        <button type="button" onClick={wstawPrzyklad} className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted">
          {t("UI-M10-PRZ-WSTAW-PRZYKLAD")}
        </button>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GODZINY.map((g, i) => (
            <fieldset key={g} className="grid grid-cols-2 gap-2 rounded-md border p-2">
              <legend className="px-1 text-small font-medium">{`${godzinaTekst(g)}–${godzinaTekst(g + KROK_PROBKOWANIA_H)}`}</legend>
              <Pole
                id={`prz-prod-${i}`}
                label={t("UI-M10-PRZ-PRODUKCJA")}
                unit="kW"
                type="number"
                inputMode="decimal"
                min={0}
                value={stan.produkcja[i] ?? ""}
                onChange={(e) => ustawPrognoze("produkcja", i, e.target.value)}
                pomoc={<PomocPola ekran="przesuwanie-zadan" pole="produkcja" />}
              />
              <Pole
                id={`prz-zuz-${i}`}
                label={t("UI-M10-PRZ-ZUZYCIE")}
                unit="kW"
                type="number"
                inputMode="decimal"
                min={0}
                value={stan.zuzycie[i] ?? ""}
                onChange={(e) => ustawPrognoze("zuzycie", i, e.target.value)}
                pomoc={<PomocPola ekran="przesuwanie-zadan" pole="zuzycie" />}
              />
            </fieldset>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-M10-PRZ-ZADANIA")}</h2>
        <p className="text-small text-muted-foreground">{t("UI-M10-PRZ-ZADANIA-OPIS")}</p>
        {stan.zadania.map((z, i) => (
          <fieldset key={z.id} className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-3">
            <legend className="px-1 text-small font-medium">{z.nazwa.trim() || t("UI-M10-PRZ-ZADANIE-NR", { n: i + 1 })}</legend>
            <Pole
              id={`prz-nazwa-${z.id}`}
              label={t("UI-M10-PRZ-NAZWA")}
              type="text"
              value={z.nazwa}
              onChange={(e) => ustawZadanie(z.id, { nazwa: e.target.value })}
              pomoc={<PomocPola ekran="przesuwanie-zadan" pole="nazwa" />}
            />
            <Pole
              id={`prz-moc-${z.id}`}
              label={t("UI-M10-PRZ-MOC")}
              unit="kW"
              type="number"
              inputMode="decimal"
              min={0}
              value={z.moc}
              onChange={(e) => ustawZadanie(z.id, { moc: e.target.value })}
              pomoc={<PomocPola ekran="przesuwanie-zadan" pole="moc" />}
            />
            <Pole
              id={`prz-czas-${z.id}`}
              label={t("UI-M10-PRZ-CZAS")}
              unit="h"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              value={z.czas}
              onChange={(e) => ustawZadanie(z.id, { czas: e.target.value })}
              pomoc={<PomocPola ekran="przesuwanie-zadan" pole="czas" />}
            />
            <Pole
              id={`prz-od-${z.id}`}
              label={t("UI-M10-PRZ-OD")}
              unit="h"
              type="number"
              inputMode="decimal"
              min={0}
              max={24}
              step={0.5}
              placeholder="0"
              value={z.od}
              onChange={(e) => ustawZadanie(z.id, { od: e.target.value })}
              pomoc={<PomocPola ekran="przesuwanie-zadan" pole="od" />}
            />
            <Pole
              id={`prz-do-${z.id}`}
              label={t("UI-M10-PRZ-DO")}
              unit="h"
              type="number"
              inputMode="decimal"
              min={0}
              max={24}
              step={0.5}
              placeholder="24"
              value={z.do}
              onChange={(e) => ustawZadanie(z.id, { do: e.target.value })}
              pomoc={<PomocPola ekran="przesuwanie-zadan" pole="do" />}
            />
            <button
              type="button"
              onClick={() => usunZadanie(z.id)}
              className="self-end text-caption text-muted-foreground underline"
            >
              {t("UI-M10-PRZ-USUN")}
            </button>
          </fieldset>
        ))}
        <button type="button" onClick={dodajZadanie} className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted">
          {t("UI-M10-PRZ-DODAJ")}
        </button>
      </section>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M10-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M10-PRZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziomZStatusu(result.status)} etykieta={t("UI-M10-PRZ-W-PLAN")}>
          <WynikGlowny>{t("UI-M10-PRZ-WYNIK", { pv: r2(v.zPvRazemKwh), bateria: r2(v.zBateriiRazemKwh) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M10-PRZ-NADWYZKA-DOBY", { kwh: r2(v.nadwyzkaDobyKwh) })}</p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.zadania} minWidth={420} />
          </div>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/prognozy" className="text-small underline">
        {t("UI-M10-PRZ-LINK-PROGNOZY")}
      </Link>
    </main>
  )
}
