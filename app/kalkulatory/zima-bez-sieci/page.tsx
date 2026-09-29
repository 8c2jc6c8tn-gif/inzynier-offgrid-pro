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

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

/**
 * M14 — D5 „Zima bez sieci” (pochodny, Wzorzec G). Echo: the D4 installation in island mode
 * (`bilans-miesieczny`, tryb „wyspa”) + links to the M7 stress test, which is the necessary
 * condition of scenario D (`03_M14` §4). The monthly balance is not a substitute for M7.
 */
export default function ZimaBezSieciPage() {
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
      <NaglowekEkranu tytul="Zima bez sieci" ekran="zima-bez-sieci" wzor={result?.formula}>
        Ta sama instalacja co na ekranie „Ile PV i magazynu”, ale bez sieci: czego zabraknie w grudniu i styczniu i kto to
        pokryje. M14 „Dom – sieć”, ekran D5.
      </NaglowekEkranu>

      {!result ? (
        <StanPusty tytul="Najpierw wpisz zużycie i instalację">
          <Link className="underline" href="/kalkulatory/zuzycie-miesieczne">
            Moje zużycie miesięcznie
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/kalkulatory/pv-i-magazyn">
            Ile PV i magazynu
          </Link>
        </StanPusty>
      ) : !v ? (
        <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta="Nie da się policzyć — uzupełnij dane na ekranie „Ile PV i magazynu”">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"} etykieta="Bilans bez sieci">
          <WynikGlowny>
            {v.niedoborZimaKwh > 0.5 ? `Grudzień + styczeń: brakuje ${f0(v.niedoborZimaKwh)} kWh` : "Grudzień i styczeń bez niedoboru"}
          </WynikGlowny>
          <p className="mt-1 text-small">
            Cały rok bez sieci brakuje {f0(v.niedoborRokKwh)} kWh, a {f0(v.nadwyzkaRokKwh)} kWh produkcji się marnuje (nie ma
            gdzie jej oddać).
          </p>
          <TabelaBilansu wynik={v} tryb="wyspa" />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <section className="flex flex-col gap-2 text-small">
        <h2 className="text-base font-medium">Warunek konieczny przed odłączeniem — stress-test zimowy (Moduł 7)</h2>
        <p>
          Bilans miesięczny zakłada, że magazyn codziennie się napełnia. Zimą bywa inaczej — kilka pochmurnych dni pod
          rząd, niska temperatura magazynu, pompa ciepła pracująca dłużej. Sprawdź to przed decyzją:
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            <Link className="underline" href="/kalkulatory/symulacja-miesiaca-zachmurzenia">
              Symulacja miesiąca zachmurzenia
            </Link>{" "}
            i{" "}
            <Link className="underline" href="/kalkulatory/dni-bez-slonca">
              dni bez słońca
            </Link>
          </li>
          <li>
            <Link className="underline" href="/kalkulatory/dni-autonomii">
              Dni autonomii
            </Link>{" "}
            (Moduł 2) i{" "}
            <Link className="underline" href="/kalkulatory/wplyw-temperatury">
              wpływ temperatury na magazyn
            </Link>{" "}
            (Moduł 4)
          </li>
          <li>
            <Link className="underline" href="/kalkulatory/cop-pompy-ciepla">
              Zimowe zużycie pompy ciepła
            </Link>{" "}
            (Moduł 6)
          </li>
          <li>
            Niedobór pokryje agregat:{" "}
            <Link className="underline" href="/kalkulatory/agregat-jako-zapas">
              Agregat jako zapas
            </Link>
          </li>
        </ul>
      </section>
    </main>
  )
}
