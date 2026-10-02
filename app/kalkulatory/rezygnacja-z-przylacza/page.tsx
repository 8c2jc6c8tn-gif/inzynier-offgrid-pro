"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateKosztPowrotu } from "@/lib/core/modules/siec/koszt-powrotu/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { KrokZMedia } from "@/components/wzorce/krok-z-media"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { PROCEDURA } from "@/components/siec/tresci-przejscia"
import {
  KLUCZ_SEGMENTU_PRZEJSCIA,
  POCZATKOWY_SEGMENTU,
  PrzelacznikSegmentu,
  liczba,
  liczbaLubNull,
  poziomWerdyktu,
  } from "@/components/siec/wspolne"
import { useZl } from "@/lib/waluta/use-waluta"
import { useTranslate } from "@/lib/i18n/language-context"

type Stan = { stawka: string; moc: string; odleglosc: "" | "tak" | "nie" }
const POCZATKOWY: Stan = { stawka: "", moc: "", odleglosc: "" }

/**
 * M14 — D10 „Jak zrezygnować z przyłącza” (shared; F10 for firma with the B2B control step),
 * Wzorzec F. `03_M14` §5, opracowanie §5.2–5.3: seven steps (1–4 reversible) and the cost of coming
 * back (`siec/koszt-powrotu`). The connection rate is always a user entry from the DSO tariff.
 */
export default function RezygnacjaZPrzylaczaPage() {
  const t = useTranslate()
  const zl = useZl()
  const [{ segment }, setSegment] = usePersistedDraft(KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU)
  const [stan, setStan] = usePersistedDraft<Stan>("siec-koszt-powrotu", POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))
  const result = useMemo(
    () =>
      calculateKosztPowrotu({
        stawkaZlKw: liczbaLubNull(stan.stawka),
        mocPrzylaczeniowaKw: liczba(stan.moc),
        odlegloscStandardowa: stan.odleglosc === "" ? null : stan.odleglosc === "tak",
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/rezygnacja-z-przylacza" />
      <NaglowekEkranu tytul={t("UI-REZ-TYTUL")} ekran="rezygnacja-z-przylacza" wynik={result}>
        {t("UI-REZ-OPIS")}
      </NaglowekEkranu>
      <PrzelacznikSegmentu value={segment} onChange={(s) => setSegment({ segment: s })} />

      <ol className="flex flex-col gap-3">
        {PROCEDURA.map((k, i) => (
          <KrokZMedia
            key={k.id}
            numer={i + 1}
            tytul={
              <>
                {t(k.tytul)}{" "}
                <span className={k.odwracalny ? "text-caption text-muted-foreground" : "text-caption font-semibold text-destructive"}>
                  {k.odwracalny ? t("UI-REZ-ODWRACALNE") : t("UI-REZ-NIEODWRACALNE")}
                </span>
              </>
            }
          >
            <p>{t(k.opis)}</p>
            {segment === "firma" && k.firma && <p className="mt-1 font-medium">{t("UI-REZ-FIRMA", { tekst: t(k.firma) })}</p>}
          </KrokZMedia>
        ))}
      </ol>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-REZ-KOSZT-POWROTU")}</h2>
        <p className="text-small text-muted-foreground">
          {t("UI-REZ-KOSZT-OPIS")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-REZ-STAWKA")}
            unit={t("UI-REZ-J-ZL-KW")}
            type="number"
            inputMode="decimal"
            value={stan.stawka}
            onChange={(e) => ustaw({ stawka: e.target.value })}
            pomoc={<PomocPola ekran="rezygnacja-z-przylacza" pole="stawka" />}
          />
          <Pole
            label={t("UI-REZ-MOC")}
            unit="kW"
            type="number"
            inputMode="decimal"
            value={stan.moc}
            onChange={(e) => ustaw({ moc: e.target.value })}
            pomoc={<PomocPola ekran="rezygnacja-z-przylacza" pole="moc" />}
          />
        </div>
        <PoleSelect
          label={t("UI-REZ-ODLEGLOSC")}
          value={stan.odleglosc}
          onChange={(e) => ustaw({ odleglosc: e.target.value as Stan["odleglosc"] })}
          pomoc={<PomocPola ekran="rezygnacja-z-przylacza" pole="odleglosc" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="tak">{t("UI-REZ-ODL-TAK")}</option>
          <option value="nie">{t("UI-REZ-ODL-NIE")}</option>
        </PoleSelect>
        {result.status === "INCOMPLETE" || result.status === "INVALID_INPUT" ? (
          <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta={t("UI-REZ-UZUPELNIJ")}>
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : (
          <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "uwaga"} etykieta={t("UI-REZ-POWROT")}>
            <WynikGlowny>{v.kosztNettoZl === null ? t("UI-REZ-WYCENA-INDYW") : t("UI-REZ-OK-NETTO", { kwota: zl(v.kosztNettoZl) })}</WynikGlowny>
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
          </WerdyktPanel>
        )}
        <p className="text-small text-muted-foreground">
          {t("UI-REZ-PRZED-KROKIEM-5")}{" "}
          <Link className="underline" href="/kalkulatory/ryzyka-odlaczenia">
            {t("UI-REZ-LINK-RYZYKA")}
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/kalkulatory/przelacznik-siec-wyspa">
            {t("UI-REZ-LINK-PRZELACZNIK")}
          </Link>
        </p>
      </section>
    </main>
  )
}
