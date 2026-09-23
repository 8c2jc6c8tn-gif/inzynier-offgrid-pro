"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { CalcResult } from "@/lib/core/calc-result"
import type { OrientacjaPowierzchniResult } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { zapisPasuje } from "@/lib/lokalizacja/dane-tmy"
import {
  KLUCZ_MODELU_DZIALKI,
  kierunek,
  liczba,
  MODEL_PUSTY,
  powierzchnieDoOceny,
  powierzchnieZModelu,
  wejscieSkanera,
  type KorektaSeed,
  type ModelDzialki,
  type PowierzchniaRecznaSeed,
} from "@/lib/lokalizacja/model-dzialki"
import { useDaneTmy } from "@/lib/lokalizacja/use-dane-tmy"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"
import { useOnline } from "@/lib/lokalizacja/use-online"

type StanE4 = {
  korekty: Record<string, KorektaSeed>
  reczne: PowierzchniaRecznaSeed[]
  /** Puste — wartość domyślna kalkulatora (raportowana w założeniach). */
  albedo: string
}

const STAN_POCZATKOWY: StanE4 = { korekty: {}, reczne: [], albedo: "" }

/** Draft Ekranu 1 — źródło współrzędnych, gdy nie ma jeszcze modelu działki. */
type DraftEkranu1 = { szerokosc: string; dlugosc: string }

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f3 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 3 })

export default function OrientacjaPowierzchniPage() {
  const t = useTranslate()
  const online = useOnline()
  const model = useOdczytDraftu<ModelDzialki>(KLUCZ_MODELU_DZIALKI)
  const ekran1 = useOdczytDraftu<DraftEkranu1>("lokalizacja-i-klimat")
  const [stan, setStan] = usePersistedDraft<StanE4>("orientacja-powierzchni", STAN_POCZATKOWY)
  const tmy = useDaneTmy()
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [wynik, setWynik] = useState<{ klucz: string; r: CalcResult<OrientacjaPowierzchniResult> } | null>(null)

  const skaner = useMemo(() => calculateSkanerDzialki(wejscieSkanera(model.dane ?? MODEL_PUSTY)), [model.dane])
  const odn = skaner.value.odniesienie
  const lat1 = liczba(ekran1.dane?.szerokosc ?? "")
  const lon1 = liczba(ekran1.dane?.dlugosc ?? "")
  const lokalizacja = odn
    ? { szerokosc: odn.szerokosc, dlugosc: odn.dlugosc, zrodlo: "model działki (Ekran 2)" }
    : lat1 !== undefined && lon1 !== undefined
      ? { szerokosc: lat1, dlugosc: lon1, zrodlo: "Ekran 1 (Lokalizacja i dane klimatyczne)" }
      : null

  const zModelu = useMemo(() => powierzchnieZModelu(skaner.value), [skaner.value])
  const powierzchnie = useMemo(() => powierzchnieDoOceny(zModelu, stan.korekty, stan.reczne), [zModelu, stan.korekty, stan.reczne])
  const dane = lokalizacja && zapisPasuje(tmy.zapis, lokalizacja.szerokosc, lokalizacja.dlugosc) ? tmy.zapis : null

  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, powierzchnie, stan.albedo])
  const aktualny = wynik !== null && wynik.klucz === klucz

  async function ocen() {
    if (!lokalizacja || !dane) return
    const r = await uruchom({
      typ: "orientacja",
      wejscie: {
        szerokoscGeograficzna: lokalizacja.szerokosc,
        dlugoscGeograficzna: lokalizacja.dlugosc,
        daneGodzinowe: dane.dane.rekordy,
        albedo: liczba(stan.albedo),
        powierzchnie: powierzchnie.map(({ nazwa, nachylenieDeg, azymutDeg }) => ({ nazwa, nachylenieDeg, azymutDeg })),
      },
    })
    if (r) setWynik({ klucz, r: r.wynik })
  }

  const ustawKorekte = (id: string, z: Partial<KorektaSeed>) =>
    setStan((s) => ({ ...s, korekty: { ...s.korekty, [id]: { ...(s.korekty[id] ?? { nachylenieDeg: "", azymutDeg: "" }), ...z } } }))
  const ustawReczna = (i: number, z: Partial<PowierzchniaRecznaSeed>) =>
    setStan((s) => ({ ...s, reczne: s.reczne.map((r, j) => (j === i ? { ...r, ...z } : r)) }))

  if (!model.wczytano || !ekran1.wczytano || !tmy.wczytano) return <StanLadowania linie={6} />

  const r = aktualny ? wynik.r : null
  const ranking = r ? [...r.value.powierzchnie].sort((a, b) => b.wskaznikProcent - a.wskaznikProcent) : []

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/orientacja-powierzchni" />
      <NaglowekEkranu tytul="Bryła budynku i orientacja ścian">
        Nie każda ściana i połać dachu są tak samo warte montażu paneli — ten wskaźnik pozwala od razu zobaczyć,
        gdzie inwestycja się najbardziej opłaci, zanim przejdziesz do szczegółowego projektowania w Module 3. Moduł 1,
        Ekran 4.
      </NaglowekEkranu>

      <section className="flex flex-col gap-2 rounded-lg border p-4">
        <h2 className="font-semibold">Dane nasłonecznienia</h2>
        {!lokalizacja ? (
          <StanPusty tytul="Brak lokalizacji — zbierz model działki (Ekran 2) albo wpisz współrzędne na Ekranie 1.">
            <div className="flex gap-3">
              <Link href="/kalkulatory/skaner-dzialki" className="underline">
                → Ekran 2
              </Link>
              <Link href="/kalkulatory/lokalizacja-i-klimat" className="underline">
                → Ekran 1
              </Link>
            </div>
          </StanPusty>
        ) : (
          <>
            <p className="text-small">
              Lokalizacja: {f3(lokalizacja.szerokosc)}°, {f3(lokalizacja.dlugosc)}° — z: {lokalizacja.zrodlo}
            </p>
            {dane ? (
              <p className="text-small text-muted-foreground">
                Typowy rok meteorologiczny PVGIS ({dane.dane.meta.bazaPromieniowania}, lata {dane.dane.meta.rokOd}–{dane.dane.meta.rokDo}),
                zapisany na urządzeniu {new Date(dane.pobrano).toLocaleDateString("pl-PL")} — działa offline.
              </p>
            ) : (
              <p className="text-small text-muted-foreground">
                Potrzebne godzinowe dane nasłonecznienia z PVGIS (Komisja Europejska) — pobierane raz, potem zapisane na
                urządzeniu.
              </p>
            )}
            <Button
              variant={dane ? "outline" : "default"}
              className="min-h-11"
              disabled={tmy.pobiera || !online}
              onClick={() => tmy.pobierz(lokalizacja.szerokosc, lokalizacja.dlugosc)}
            >
              {tmy.pobiera ? "Pobieram z PVGIS…" : dane ? "Pobierz ponownie" : "Pobierz dane nasłonecznienia (PVGIS)"}
            </Button>
            {!online && !dane && <p className="text-small">Brak połączenia — pobierz dane, gdy będziesz online.</p>}
            {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
          </>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Powierzchnie</h2>
        {zModelu.length === 0 && (
          <p className="text-small text-muted-foreground">
            Model działki nie ma budynku ani połaci — dopisz powierzchnie ręcznie albo zbierz je na Ekranie 2.
          </p>
        )}
        {powierzchnie
          .filter((p) => p.zrodlo !== "reczna")
          .map((p) => {
            const z = zModelu.find((m) => m.id === p.id)!
            const k = stan.korekty[p.id]
            return (
              <div key={p.id} className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-[1fr_8rem_8rem]">
                <div className="col-span-2 text-small sm:col-span-1">
                  <p className="font-medium">
                    {p.nazwa}
                    {p.skorygowana && <span className="ml-1 text-muted-foreground">(korekta ręczna)</span>}
                  </p>
                  <p className="text-muted-foreground">
                    Ze Skanera: {z.nachylenieDeg}°, azymut {z.azymutDeg}° ({kierunek(z.azymutDeg)}) ·{" "}
                    {p.zrodlo === "polac" ? `${f1(p.wymiar)} m²` : `${f1(p.wymiar)} m ścian`}
                  </p>
                </div>
                <Pole
                  label="Nachylenie"
                  unit="°"
                  inputMode="decimal"
                  placeholder={String(z.nachylenieDeg)}
                  value={k?.nachylenieDeg ?? ""}
                  onChange={(e) => ustawKorekte(p.id, { nachylenieDeg: e.target.value })}
                />
                <Pole
                  label="Azymut"
                  unit="°"
                  inputMode="decimal"
                  placeholder={String(z.azymutDeg)}
                  value={k?.azymutDeg ?? ""}
                  onChange={(e) => ustawKorekte(p.id, { azymutDeg: e.target.value })}
                />
              </div>
            )
          })}
        {stan.reczne.map((r, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-[1fr_8rem_8rem_auto]">
            <Pole className="col-span-2 sm:col-span-1" label="Nazwa" value={r.nazwa} onChange={(e) => ustawReczna(i, { nazwa: e.target.value })} placeholder={`Powierzchnia ${i + 1}`} />
            <Pole label="Nachylenie" unit="°" inputMode="decimal" value={r.nachylenieDeg} onChange={(e) => ustawReczna(i, { nachylenieDeg: e.target.value })} />
            <Pole label="Azymut" unit="°" inputMode="decimal" hint="S = 180" value={r.azymutDeg} onChange={(e) => ustawReczna(i, { azymutDeg: e.target.value })} />
            <Button variant="ghost" className="mt-auto min-h-11" onClick={() => setStan((s) => ({ ...s, reczne: s.reczne.filter((_, j) => j !== i) }))}>
              Usuń
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setStan((s) => ({ ...s, reczne: [...s.reczne, { nazwa: "", nachylenieDeg: "", azymutDeg: "" }] }))}
        >
          + Dodaj powierzchnię ręcznie
        </Button>
        <Pole
          label="Albedo gruntu (opcjonalnie)"
          hint="0–1; puste = wartość domyślna podana w założeniach"
          inputMode="decimal"
          value={stan.albedo}
          onChange={(e) => setStan((s) => ({ ...s, albedo: e.target.value }))}
        />
      </section>

      <Button className="min-h-11" disabled={obliczenia.liczy || !dane || powierzchnie.length === 0} onClick={ocen}>
        {obliczenia.liczy ? "Liczę (ok. 3 s)…" : aktualny ? "Oceń ponownie" : "Oceń powierzchnie"}
      </Button>
      {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
      {wynik && !aktualny && !obliczenia.liczy && <StanPusty tytul="Dane zmieniły się od ostatniej oceny — oceń ponownie." />}

      {r && (
        <WerdyktPanel
          poziom={poziomZStatusu(r.status)}
          etykieta={
            r.status === "INVALID_INPUT"
              ? "Sprawdź dane"
              : `Optimum tutaj: nachylenie ${r.value.optimum.nachylenieDeg}°, azymut ${r.value.optimum.azymutDeg}° — ${f0(r.value.optimum.napromieniowanieRoczneKwhM2)} kWh/m² rocznie`
          }
        >
          <div className="mt-2 flex flex-col gap-3 text-small">
            {ranking.length > 0 && (
              <p>{ranking.map((p) => `${p.nazwa}: ${f0(p.wskaznikProcent)}%`).join(". ")}.</p>
            )}
            <ol className="flex flex-col gap-2">
              {ranking.map((p, i) => (
                <li key={p.nazwa + i} className="flex flex-col gap-1">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{p.nazwa}</span>
                    <span className="tabular-nums">{f0(p.wskaznikProcent)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded bg-muted" aria-hidden="true">
                    <div className="h-full rounded bg-current opacity-70" style={{ width: `${Math.min(100, p.wskaznikProcent)}%` }} />
                  </div>
                  <span className="text-muted-foreground">
                    {p.nachylenieDeg}°, azymut {p.azymutDeg}° ({kierunek(p.azymutDeg)}) · {f0(p.napromieniowanieRoczneKwhM2)} kWh/m² rocznie
                  </span>
                </li>
              ))}
            </ol>
            {r.warnings.length > 0 && (
              <ul className="flex flex-col gap-1">
                {r.warnings.map((x, i) => (
                  <li key={x.code + i}>{x.message ?? t(x.i18nKey ?? x.code, x.params)}</li>
                ))}
              </ul>
            )}
            {/* 🔎 TD15 (2) — wskaźnik E4 bez zacienienia z E3 (dlug-techniczny.md) */}
            <p className="text-muted-foreground">
              Wskaźnik liczy tylko orientację — zacienienie przez drzewa i sąsiednie budynki pokazuje Ekran 3.
            </p>
            <ZalozeniaLista assumptions={r.assumptions} />
          </div>
        </WerdyktPanel>
      )}

      <nav className="flex flex-wrap gap-2" aria-label="Sąsiednie ekrany">
        <Link href="/kalkulatory/skaner-dzialki" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          ← Ekran 2: Skaner działki
        </Link>
        <Link href="/kalkulatory/analiza-zacienienia" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          ← Ekran 3: Analiza zacienienia
        </Link>
      </nav>
    </main>
  )
}
