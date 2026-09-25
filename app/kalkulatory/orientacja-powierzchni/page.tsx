"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { CalcResult } from "@/lib/core/calc-result"
import type { OrientacjaPowierzchniResult } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import {
  horyzontyPolaci,
  kierunek,
  liczba,
  MODEL_PUSTY,
  powierzchnieDoOceny,
  powierzchnieZModelu,
  type KorektaSeed,
  type PowierzchniaRecznaSeed,
} from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"

type StanE4 = {
  korekty: Record<string, KorektaSeed>
  reczne: PowierzchniaRecznaSeed[]
  /** Puste — wartość domyślna kalkulatora (raportowana w założeniach). */
  albedo: string
}

const STAN_POCZATKOWY: StanE4 = { korekty: {}, reczne: [], albedo: "" }

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function OrientacjaPowierzchniPage() {
  const t = useTranslate()
  const { model, skaner, lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<StanE4>("orientacja-powierzchni", STAN_POCZATKOWY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [wynik, setWynik] = useState<{ klucz: string; r: CalcResult<OrientacjaPowierzchniResult> } | null>(null)

  const zModelu = useMemo(() => powierzchnieZModelu(skaner.value), [skaner.value])
  const powierzchnie = useMemo(() => powierzchnieDoOceny(zModelu, stan.korekty, stan.reczne), [zModelu, stan.korekty, stan.reczne])
  // Zacienienie przez przeszkody ze Skanera (TD15 punkt 2) — ten sam model geometrii co Ekran 3.
  const horyzonty = useMemo(() => horyzontyPolaci(model.dane ?? MODEL_PUSTY, skaner.value), [model.dane, skaner.value])

  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, powierzchnie, stan.albedo, model.dane])
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
        powierzchnie: powierzchnie.map(({ id, nazwa, nachylenieDeg, azymutDeg }) => ({
          nazwa,
          nachylenieDeg,
          azymutDeg,
          ...(horyzonty[id] ? { horyzontyDeg: horyzonty[id] } : {}),
        })),
      },
    })
    if (r) setWynik({ klucz, r: r.wynik })
  }

  const ustawKorekte = (id: string, z: Partial<KorektaSeed>) =>
    setStan((s) => ({ ...s, korekty: { ...s.korekty, [id]: { ...(s.korekty[id] ?? { nachylenieDeg: "", azymutDeg: "" }), ...z } } }))
  const ustawReczna = (i: number, z: Partial<PowierzchniaRecznaSeed>) =>
    setStan((s) => ({ ...s, reczne: s.reczne.map((r, j) => (j === i ? { ...r, ...z } : r)) }))

  if (!wczytano) return <StanLadowania linie={6} />

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

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

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
                  id={`korekta-${p.id}-nachylenie`}
                  label="Nachylenie"
                  unit="°"
                  inputMode="decimal"
                  placeholder={String(z.nachylenieDeg)}
                  value={k?.nachylenieDeg ?? ""}
                  onChange={(e) => ustawKorekte(p.id, { nachylenieDeg: e.target.value })}
                />
                <Pole
                  id={`korekta-${p.id}-azymut`}
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
            <Pole id={`reczna-${i}-nazwa`} className="col-span-2 sm:col-span-1" label="Nazwa" value={r.nazwa} onChange={(e) => ustawReczna(i, { nazwa: e.target.value })} placeholder={`Powierzchnia ${i + 1}`} />
            <Pole id={`reczna-${i}-nachylenie`} label="Nachylenie" unit="°" inputMode="decimal" value={r.nachylenieDeg} onChange={(e) => ustawReczna(i, { nachylenieDeg: e.target.value })} />
            <Pole id={`reczna-${i}-azymut`} label="Azymut" unit="°" inputMode="decimal" hint="S = 180" value={r.azymutDeg} onChange={(e) => ustawReczna(i, { azymutDeg: e.target.value })} />
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
                    {p.strataZacienieniaProcent === null
                      ? " · bez zacienienia"
                      : ` · zacienienie −${f1(p.strataZacienieniaProcent)}% (bez przeszkód ${f0((100 * p.napromieniowanieBezZacienieniaKwhM2) / r.value.optimum.napromieniowanieRoczneKwhM2)}%)`}
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
            <p className="text-muted-foreground">
              Połacie uwzględniają przeszkody ze Skanera (drzewa, sąsiednie budynki) — szczegóły miesiąc po miesiącu
              pokazuje Ekran 3. Elewacje i powierzchnie dopisane ręcznie — bez zacienienia (brak wysokości punktu).
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
