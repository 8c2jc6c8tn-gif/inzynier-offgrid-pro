"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { calculateZapotrzebowanieCoCwu, type MiesiacCoCwu } from "@/lib/core/modules/ogrzewanie/zapotrzebowanie-co-cwu/calculator"
import { CWU_L_NA_OSOBE_ZRODLO_M6 } from "@/lib/core/modules/ogrzewanie/zapotrzebowanie-co-cwu/constants"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type SeedObciazenia } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

const MIESIACE = Array.from({ length: 12 }, (_, i) => `UI-MIESIAC-${i + 1}`)

type Seed = { liczbaOsob: string; litry: string; tZimna: string; tCwu: string; copCwu: string }
const STAN_POCZATKOWY: Seed = { liczbaOsob: "", litry: String(CWU_L_NA_OSOBE_ZRODLO_M6), tZimna: "", tCwu: "", copCwu: "" }

/** Draft of M2/E4 "Liczba domowników" — source A: "liczba domowników (auto z Modułu 2)". */
type DraftDomownikow = { liczbaDomownikow: string }

const n = (s: string) => liczba(s) ?? null

export default function ZapotrzebowanieCoCwuPage() {
  const t = useTranslate()
  const { f0, f1 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<Seed>("zapotrzebowanie-co-cwu", STAN_POCZATKOWY)
  const ustaw = <K extends keyof Seed>(k: K, v: Seed[K]) => setStan((s) => ({ ...s, [k]: v }))
  const ekran1 = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)
  const modul2 = useOdczytDraftu<DraftDomownikow>("liczba-domownikow")

  const wynikE1 = useMemo(() => (ekran1.dane ? calculateObciazenieCieplne(wejscieObciazenia(ekran1.dane)) : null), [ekran1.dane])
  const miesiaceE1 = wynikE1?.value?.miesiace ?? null
  const copCo = wynikE1?.value && ekran1.dane ? n(ekran1.dane.cop) : null
  const osobyZModulu2 = n(modul2.dane?.liczbaDomownikow ?? "")
  const osoby = stan.liczbaOsob.trim() === "" ? osobyZModulu2 : n(stan.liczbaOsob)

  const wynik = useMemo(() => {
    const cieplo: (number | null)[] = Array(12).fill(null)
    for (const m of miesiaceE1 ?? []) cieplo[m.miesiac - 1] = m.cieploKwh
    return calculateZapotrzebowanieCoCwu({
      cieploCoMiesiaceKwh: cieplo,
      liczbaOsob: osoby,
      cwuLitrowNaOsobeDoba: n(stan.litry),
      temperaturaZimnejWodyC: n(stan.tZimna),
      temperaturaCwuC: n(stan.tCwu),
      copCo,
      copCwu: n(stan.copCwu),
    })
  }, [miesiaceE1, osoby, stan, copCo])
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : "uwaga"
  const najzimniejszy = v?.miesiace?.reduce((a, m) => (m.razemKwhDoba > a.razemKwhDoba ? m : a))

  const kolumny: Kolumna<MiesiacCoCwu & { id: number }>[] = [
    { naglowek: t("UI-ZAPCOCWU-MIESIAC"), render: (r) => t(MIESIACE[r.miesiac - 1]) },
    { naglowek: "C.O. [kWh/d]", render: (r) => f1(r.coKwhDoba), liczbowa: true },
    { naglowek: "C.W.U. [kWh/d]", render: (r) => f1(r.cwuKwhDoba), liczbowa: true },
    { naglowek: t("UI-ZAPCOCWU-RAZEM-KWH"), render: (r) => f1(r.razemKwhDoba), liczbowa: true },
    { naglowek: t("UI-ZAPCOCWU-PRAD-KWH"), render: (r) => (r.pradKwhDoba === null ? "—" : f1(r.pradKwhDoba)), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zapotrzebowanie-co-cwu" />
      <NaglowekEkranu tytul={t("UI-ZAPCOCWU-ZAPOTRZEBOWANIE")} ekran="zapotrzebowanie-co-cwu" wynik={wynik}>
        {t("UI-ZAPCOCWU-ILE-CIEPLA-DZIENNIE")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-2 rounded-lg border p-4">
        <h2 className="font-semibold">{t("UI-ZAPCOCWU-OGRZEWANIE-EKRANU")}</h2>
        {!ekran1.wczytano ? null : !wynikE1?.value ? (
          <p className="text-small text-muted-foreground">
            {t("UI-ZAPCOCWU-NAJPIERW-POLICZ")}{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-ZAPCOCWU-STRATY-CIEPLA-BUDYNKU")}
            </Link>{" "}{t("UI-ZAPCOCWU-EKRAN-STAD-BIERZE")}
          </p>
        ) : !miesiaceE1 ? (
          <p className="text-small text-muted-foreground">
            {t("UI-ZAPCOCWU-STRATY-CIEPLA-POLICZONE", { p: f1(wynikE1.value.obciazenieW / 1000), temperaturaZewnetrznaC: wynikE1.value.temperaturaZewnetrznaC })}{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-ZAPCOCWU-EKRANIE")}
            </Link>{" "}{t("UI-ZAPCOCWU-WSTAW-TEMPERATURY-PVGIS")}
          </p>
        ) : (
          <p className="text-small">
            {t("UI-ZAPCOCWU-EKRANU-STRAT-CIEPLO", { p: f1(wynikE1.value.obciazenieW / 1000), temperaturaZewnetrznaC: wynikE1.value.temperaturaZewnetrznaC, length: miesiaceE1.length })}{copCo !== null ? t("UI-ZAPCOCWU-COP-OGRZEWANIA", { copCo: f1(copCo) }) : ""}.{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-ZAPCOCWU-ZMIEN-EKRANIE")}
            </Link>
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-ZAPCOCWU-CIEPLA-WODA")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label={t("UI-ZAPCOCWU-LICZBA-OSOB")}
            type="number"
            inputMode="numeric"
            min={1}
            value={stan.liczbaOsob}
            placeholder={osobyZModulu2 !== null ? String(osobyZModulu2) : undefined}
            onChange={(e) => ustaw("liczbaOsob", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="osoby" />}
          />
          <Pole
            label={t("UI-ZAPCOCWU-CIEPLA-WODA-OSOBE")}
            unit={t("UI-ZAPCOCWU-DOBE")}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.litry}
            onChange={(e) => ustaw("litry", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="litry" params={{ l: CWU_L_NA_OSOBE_ZRODLO_M6 }} />}
          />
          <Pole
            label={t("UI-ZAPCOCWU-TEMPERATURA-ZIMNEJ-WODY")}
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.tZimna}
            onChange={(e) => ustaw("tZimna", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="tZimna" />}
          />
          <Pole
            label={t("UI-ZAPCOCWU-TEMPERATURA-CIEPLEJ-WODY")}
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.tCwu}
            onChange={(e) => ustaw("tCwu", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="tCiepla" />}
          />
          <Pole
            label={t("UI-ZAPCOCWU-COP-PODGRZEWANIA-WODY")}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.copCwu}
            onChange={(e) => ustaw("copCwu", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="cop" />}
          />
        </div>
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-ZAPCOCWU-SPRAWDZ-DANE")}>
          <ul className="mt-2 space-y-1 text-small">
            {wynik.warnings.map((w, i) => (
              <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">{t("UI-ZAPCOCWU-WPISZ-LICZBE-OSOB")}</p>
      )}
      {v && (
        <WerdyktPanel
          poziom={poziom}
          etykieta={najzimniejszy ? t("UI-ZAPCOCWU-NAJWIECEJ-CIEPLA", { p: t(MIESIACE[najzimniejszy.miesiac - 1]) }) : t("UI-ZAPCOCWU-CIEPLA-WODA-DOBE-2")}
        >
          <WynikGlowny>{t("UI-ZAPCOCWU-KWH-DOBE", { p: f1(najzimniejszy ? najzimniejszy.razemKwhDoba : v.cwuKwhDoba) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {najzimniejszy && (
              <>
                {t("UI-ZAPCOCWU-KWH-KWH-DOBE", { coKwhDoba: f1(najzimniejszy.coKwhDoba), cwuKwhDoba: f1(najzimniejszy.cwuKwhDoba) })}
                {najzimniejszy.pradKwhDoba !== null && (
                  <>
                    {" "}{t("UI-ZAPCOCWU-OK")} <strong>{t("UI-ZAPCOCWU-KWH-PRADU", { pradKwhDoba: f1(najzimniejszy.pradKwhDoba) })}</strong>
                  </>
                )}
                .{" "}
              </>
            )}
            {t("UI-ZAPCOCWU-CIEPLA-WODA-DOBE", { cwuLitrowDoba: f0(v.cwuLitrowDoba), deltaTK: f1(v.deltaTK), cwuKwhDoba: f1(v.cwuKwhDoba) })}
            {v.cwuPradKwhDoba !== null && <> {t("UI-ZAPCOCWU-KWH-PRADU-2", { cwuPradKwhDoba: f1(v.cwuPradKwhDoba) })}</>}.
          </p>
          {v.miesiace && (
            <div className="mt-3">
              <p className="text-small font-medium">
                {t("UI-ZAPCOCWU-RAZEM-TYCH-MIESIACACH", { p: f0(v.coSumaKwh!), p2: f0(v.cwuSumaMiesiecyKwh!) })}
              </p>
              <KartaPorownawcza kolumny={kolumny} wiersze={v.miesiace.map((m) => ({ ...m, id: m.miesiac }))} minWidth={320} />
            </div>
          )}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} formulaKey={wynik.formulaKey} formulaParams={wynik.formulaParams} />
          <p className="mt-2 text-small">
            {t("UI-ZAPCOCWU-DALEJ")}{" "}
            <Link href="/kalkulatory/bojler-cwu" className="underline">
              {t("UI-ZAPCOCWU-BOJLER-CZAS-GRZANIA")}
            </Link>
            ,{" "}
            <Link href="/kalkulatory/koszty-ogrzewania" className="underline">
              {t("UI-ZAPCOCWU-CZYM-NAJTANIEJ-GRZAC")}
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}

      
    </main>
  )
}
