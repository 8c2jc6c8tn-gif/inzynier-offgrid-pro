"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateKosztPowrotu } from "@/lib/core/modules/siec/koszt-powrotu/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleSelect } from "@/components/ui/pole"
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
  zl,
} from "@/components/siec/wspolne"

type Stan = { stawka: string; moc: string; odleglosc: "" | "tak" | "nie" }
const POCZATKOWY: Stan = { stawka: "", moc: "", odleglosc: "" }

/**
 * M14 — D10 „Jak zrezygnować z przyłącza” (shared; F10 for firma with the B2B control step),
 * Wzorzec F. `03_M14` §5, opracowanie §5.2–5.3: seven steps (1–4 reversible) and the cost of coming
 * back (`siec/koszt-powrotu`). The connection rate is always a user entry from the DSO tariff.
 */
export default function RezygnacjaZPrzylaczaPage() {
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
      <NaglowekEkranu tytul="Jak zrezygnować z przyłącza">
        Siedem kroków w kolejności, która ma znaczenie. Kroki 1–4 możesz cofnąć, 5–7 już nie. Na dole — ile kosztowałby powrót do
        sieci. M14, ekran D10 / F10.
      </NaglowekEkranu>
      <PrzelacznikSegmentu value={segment} onChange={(s) => setSegment({ segment: s })} />

      <ol className="flex flex-col gap-3">
        {PROCEDURA.map((k, i) => (
          <KrokZMedia
            key={k.id}
            numer={i + 1}
            tytul={
              <>
                {k.tytul}{" "}
                <span className={k.odwracalny ? "text-caption text-muted-foreground" : "text-caption font-semibold text-destructive"}>
                  {k.odwracalny ? "(odwracalne)" : "(nieodwracalne)"}
                </span>
              </>
            }
          >
            <p>{k.opis}</p>
            {segment === "firma" && k.firma && <p className="mt-1 font-medium">Firma: {k.firma}</p>}
          </KrokZMedia>
        ))}
      </ol>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Koszt powrotu do sieci</h2>
        <p className="text-small text-muted-foreground">
          K ≈ stawka opłaty przyłączeniowej OSD [zł/kW] × moc przyłączeniowa — grupy IV–VI, odległość standardowa. Stawkę znajdziesz
          w taryfie swojego OSD (rozdział o opłatach za przyłączenie); aplikacja jeszcze jej nie ma.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Pole label="Stawka opłaty przyłączeniowej" unit="zł/kW" type="number" inputMode="decimal" value={stan.stawka} onChange={(e) => ustaw({ stawka: e.target.value })} hint="Netto, z taryfy OSD (kablowe albo napowietrzne)." />
          <Pole label="Moc przyłączeniowa" unit="kW" type="number" inputMode="decimal" value={stan.moc} onChange={(e) => ustaw({ moc: e.target.value })} hint="Z umowy albo warunków przyłączenia." />
        </div>
        <PoleSelect label="Odległość od sieci" value={stan.odleglosc} onChange={(e) => ustaw({ odleglosc: e.target.value as Stan["odleglosc"] })}>
          <option value="">— wybierz —</option>
          <option value="tak">W standardowej odległości z taryfy OSD</option>
          <option value="nie">Dalej niż standardowa odległość</option>
        </PoleSelect>
        {result.status === "INCOMPLETE" || result.status === "INVALID_INPUT" ? (
          <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta="Uzupełnij dane">
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : (
          <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "uwaga"} etykieta="Powrót do sieci">
            <WynikGlowny>{v.kosztNettoZl === null ? "Wycena indywidualna OSD" : `ok. ${zl(v.kosztNettoZl)} netto`}</WynikGlowny>
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
          </WerdyktPanel>
        )}
        <p className="text-small text-muted-foreground">
          Przed krokiem 5:{" "}
          <Link className="underline" href="/kalkulatory/ryzyka-odlaczenia">
            ryzyka odłączenia
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/kalkulatory/przelacznik-siec-wyspa">
            przełącznik sieć/wyspa
          </Link>
        </p>
      </section>
    </main>
  )
}
