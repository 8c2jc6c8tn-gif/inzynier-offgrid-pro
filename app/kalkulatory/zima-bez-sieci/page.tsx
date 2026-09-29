"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBilansMiesieczny } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { poziomWerdyktu } from "@/components/siec/wspolne"
import { TabelaBilansu, useDaneBilansu, wejscieBilansu } from "@/components/siec/pv-magazyn"
import { useTranslate } from "@/lib/i18n/language-context"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

/**
 * M14 — D5 „Zima bez sieci” (pochodny, Wzorzec G). Echo: the D4 installation in island mode
 * (`bilans-miesieczny`, tryb „wyspa”) + links to the M7 stress test, which is the necessary
 * condition of scenario D (`03_M14` §4). The monthly balance is not a substitute for M7.
 */
export default function ZimaBezSieciPage() {
  const t = useTranslate()
  const { zuzycie, pv, wczytano } = useDaneBilansu("dom")
  const result = useMemo(() => {
    const w = wejscieBilansu(pv, zuzycie, "wyspa")
    return w ? calculateBilansMiesieczny(w) : null
  }, [pv, zuzycie])
  if (!wczytano) return <StanLadowania linie={6} />
  const v = result?.value ?? null

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zima-bez-sieci" />
      <NaglowekEkranu tytul={t("UI-ZIMA-TYTUL")} ekran="zima-bez-sieci" wzor={result?.formula}>
        {t("UI-ZIMA-OPIS")}
      </NaglowekEkranu>

      {!result ? (
        <StanPusty tytul={t("UI-ZIMA-NAJPIERW")}>
          <Link className="underline" href="/kalkulatory/zuzycie-miesieczne">
            {t("UI-SIEC-LINK-ZUZYCIE")}
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/kalkulatory/pv-i-magazyn">
            {t("UI-SIEC-LINK-PV-DOM")}
          </Link>
        </StanPusty>
      ) : !v ? (
        <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta={t("UI-ZIMA-NIE-DA-SIE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"} etykieta={t("UI-ZIMA-BILANS")}>
          <WynikGlowny>
            {v.niedoborZimaKwh > 0.5 ? t("UI-ZIMA-BRAKUJE", { kwh: f0(v.niedoborZimaKwh) }) : t("UI-ZIMA-BEZ-NIEDOBORU")}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-ZIMA-ROK", { brak: f0(v.niedoborRokKwh), nadwyzka: f0(v.nadwyzkaRokKwh) })}
          </p>
          <TabelaBilansu wynik={v} tryb="wyspa" />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <section className="flex flex-col gap-2 text-small">
        <h2 className="text-base font-medium">{t("UI-ZIMA-WARUNEK")}</h2>
        <p>
          {t("UI-ZIMA-WARUNEK-OPIS")}
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            <Link className="underline" href="/kalkulatory/symulacja-miesiaca-zachmurzenia">
              {t("UI-ZIMA-L-ZACHMURZENIE")}
            </Link>
            {t("UI-ZIMA-I")}
            <Link className="underline" href="/kalkulatory/dni-bez-slonca">
              {t("UI-ZIMA-L-DNI-BEZ-SLONCA")}
            </Link>
          </li>
          <li>
            <Link className="underline" href="/kalkulatory/dni-autonomii">
              {t("UI-ZIMA-L-DNI-AUTONOMII")}
            </Link>
            {t("UI-ZIMA-MODUL-2-I")}
            <Link className="underline" href="/kalkulatory/wplyw-temperatury">
              {t("UI-ZIMA-L-TEMPERATURA")}
            </Link>
            {t("UI-ZIMA-MODUL-4")}
          </li>
          <li>
            <Link className="underline" href="/kalkulatory/cop-pompy-ciepla">
              {t("UI-ZIMA-L-POMPA")}
            </Link>
            {t("UI-ZIMA-MODUL-6")}
          </li>
          <li>
            {t("UI-ZIMA-NIEDOBOR-AGREGAT")}{" "}
            <Link className="underline" href="/kalkulatory/agregat-jako-zapas">
              {t("UI-ZIMA-L-AGREGAT")}
            </Link>
          </li>
        </ul>
      </section>
    </main>
  )
}
