"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { CalcResult } from "@/lib/core/calc-result"
import type { OrientacjaPowierzchniResult } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"
import { etykietaPowierzchni } from "@/lib/lokalizacja/nazwa-powierzchni"
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
import { ALBEDO_DOMYSLNE, ALBEDO_MAX, ALBEDO_MIN } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/constants"

type StanE4 = {
  korekty: Record<string, KorektaSeed>
  reczne: PowierzchniaRecznaSeed[]
  /** Puste — wartość domyślna kalkulatora (raportowana w założeniach). */
  albedo: string
}

const STAN_POCZATKOWY: StanE4 = { korekty: {}, reczne: [], albedo: "" }

export default function OrientacjaPowierzchniPage() {
  const t = useTranslate()
  const { f0, f1 } = useFormaty()
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
      <NaglowekEkranu tytul={t("UI-ORIPOW-BRYLA-BUDYNKU-ORIENTACJA")} ekran="orientacja-powierzchni" wynik={r}>
        {t("UI-ORIPOW-KAZDA-SCIANA-POLAC")}
      </NaglowekEkranu>

      <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-ORIPOW-POWIERZCHNIE")}</h2>
        {zModelu.length === 0 && (
          <p className="text-small text-muted-foreground">
            {t("UI-ORIPOW-MODEL-DZIALKI-BUDYNKU")}
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
                    {etykietaPowierzchni(p.nazwa, t)}
                    {p.skorygowana && <span className="ml-1 text-muted-foreground">{t("UI-ORIPOW-KOREKTA-RECZNA")}</span>}
                  </p>
                  <p className="text-muted-foreground">
                    {t("UI-ORIPOW-SKANERA-AZYMUT", { nachylenieDeg: z.nachylenieDeg, azymutDeg: z.azymutDeg, azymutDeg2: kierunek(z.azymutDeg) })}{" "}
                    {p.zrodlo === "polac" ? `${f1(p.wymiar)} m²` : t("UI-ORIPOW-SCIAN", { wymiar: f1(p.wymiar) })}
                  </p>
                </div>
                <Pole
                  id={`korekta-${p.id}-nachylenie`}
                  label={t("UI-ORIPOW-NACHYLENIE")}
                  unit="°"
                  inputMode="decimal"
                  placeholder={String(z.nachylenieDeg)}
                  value={k?.nachylenieDeg ?? ""}
                  onChange={(e) => ustawKorekte(p.id, { nachylenieDeg: e.target.value })}
                  pomoc={<PomocPola ekran="orientacja-powierzchni" pole="nachylenie" />}
                />
                <Pole
                  id={`korekta-${p.id}-azymut`}
                  label={t("UI-ORIPOW-AZYMUT")}
                  unit="°"
                  inputMode="decimal"
                  placeholder={String(z.azymutDeg)}
                  value={k?.azymutDeg ?? ""}
                  onChange={(e) => ustawKorekte(p.id, { azymutDeg: e.target.value })}
                  pomoc={<PomocPola ekran="orientacja-powierzchni" pole="azymut" />}
                />
              </div>
            )
          })}
        {stan.reczne.map((r, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-[1fr_8rem_8rem_auto]">
            <Pole id={`reczna-${i}-nazwa`} className="col-span-2 sm:col-span-1" label={t("UI-ORIPOW-NAZWA")} value={r.nazwa} onChange={(e) => ustawReczna(i, { nazwa: e.target.value })} placeholder={t("UI-ORIPOW-POWIERZCHNIA", { p: i + 1 })} pomoc={<PomocPola ekran="orientacja-powierzchni" pole="nazwa" />} />
            <Pole id={`reczna-${i}-nachylenie`} label={t("UI-ORIPOW-NACHYLENIE")} unit="°" inputMode="decimal" value={r.nachylenieDeg} onChange={(e) => ustawReczna(i, { nachylenieDeg: e.target.value })} pomoc={<PomocPola ekran="orientacja-powierzchni" pole="nachylenieReczne" />} />
            <Pole id={`reczna-${i}-azymut`} label={t("UI-ORIPOW-AZYMUT")} unit="°" inputMode="decimal" value={r.azymutDeg} onChange={(e) => ustawReczna(i, { azymutDeg: e.target.value })} pomoc={<PomocPola ekran="orientacja-powierzchni" pole="azymutReczny" />} />
            <Button variant="ghost" className="mt-auto min-h-11" onClick={() => setStan((s) => ({ ...s, reczne: s.reczne.filter((_, j) => j !== i) }))}>
              {t("UI-ORIPOW-USUN")}
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setStan((s) => ({ ...s, reczne: [...s.reczne, { nazwa: "", nachylenieDeg: "", azymutDeg: "" }] }))}
        >
          {t("UI-ORIPOW-DODAJ-POWIERZCHNIE-RECZNIE")}
        </Button>
        <Pole
          label={t("UI-ORIPOW-ALBEDO-GRUNTU-OPCJONALNIE")}
          inputMode="decimal"
          value={stan.albedo}
          onChange={(e) => setStan((s) => ({ ...s, albedo: e.target.value }))}
          pomoc={<PomocPola ekran="orientacja-powierzchni" pole="albedo" params={{ albedo: ALBEDO_DOMYSLNE, aMin: ALBEDO_MIN, aMax: ALBEDO_MAX }} />}
        />
      </section>

      <Button className="min-h-11" disabled={obliczenia.liczy || !dane || powierzchnie.length === 0} onClick={ocen}>
        {obliczenia.liczy ? t("UI-ORIPOW-LICZE") : aktualny ? t("UI-ORIPOW-OCEN-PONOWNIE") : t("UI-ORIPOW-OCEN-POWIERZCHNIE")}
      </Button>
      {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
      {wynik && !aktualny && !obliczenia.liczy && <StanPusty tytul={t("UI-ORIPOW-DANE-ZMIENILY-OSTATNIEJ")} />}

      {r && (
        <WerdyktPanel
          poziom={poziomZStatusu(r.status)}
          etykieta={
            r.status === "INVALID_INPUT"
              ? t("UI-ORIPOW-SPRAWDZ-DANE")
              : t("UI-ORIPOW-OPTIMUM-TUTAJ-NACHYLENIE", { nachylenieDeg: r.value.optimum.nachylenieDeg, azymutDeg: r.value.optimum.azymutDeg, napromieniowanieRoczneKwhM2: f0(r.value.optimum.napromieniowanieRoczneKwhM2) })
          }
        >
          <div className="mt-2 flex flex-col gap-3 text-small">
            {ranking.length > 0 && (
              <p>{ranking.map((p) => `${etykietaPowierzchni(p.nazwa, t)}: ${f0(p.wskaznikProcent)}%`).join(". ")}.</p>
            )}
            <ol className="flex flex-col gap-2">
              {ranking.map((p, i) => (
                <li key={p.nazwa + i} className="flex flex-col gap-1">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{etykietaPowierzchni(p.nazwa, t)}</span>
                    <span className="tabular-nums">{f0(p.wskaznikProcent)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded bg-muted" aria-hidden="true">
                    <div className="h-full rounded bg-current opacity-70" style={{ width: `${Math.min(100, p.wskaznikProcent)}%` }} />
                  </div>
                  <span className="text-muted-foreground">
                    {t("UI-ORIPOW-AZYMUT-KWH-ROCZNIE", { nachylenieDeg: p.nachylenieDeg, azymutDeg: p.azymutDeg, azymutDeg2: kierunek(p.azymutDeg), napromieniowanieRoczneKwhM2: f0(p.napromieniowanieRoczneKwhM2) })}
                    {p.strataZacienieniaProcent === null
                      ? ` ${t("UI-ORIPOW-BEZ-ZACIENIENIA")}`
                      : ` ${t("UI-ORIPOW-ZACIENIENIE-BEZ-PRZESZKOD", { strataZacienieniaProcent: f1(p.strataZacienieniaProcent), p: f0((100 * p.napromieniowanieBezZacienieniaKwhM2) / r.value.optimum.napromieniowanieRoczneKwhM2) })}`}
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
              {t("UI-ORIPOW-POLACIE-UWZGLEDNIAJA-PRZESZK")}
            </p>
            <ZalozeniaLista assumptions={r.assumptions} />
          </div>
        </WerdyktPanel>
      )}

      <nav className="flex flex-wrap gap-2" aria-label={t("UI-ORIPOW-SASIEDNIE-EKRANY")}>
        <Link href="/kalkulatory/skaner-dzialki" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          {t("UI-ORIPOW-EKRAN-SKANER-DZIALKI")}
        </Link>
        <Link href="/kalkulatory/analiza-zacienienia" className="rounded-md border px-3 py-2 text-small hover:bg-muted">
          {t("UI-ORIPOW-EKRAN-ANALIZA-ZACIENIENIA")}
        </Link>
      </nav>
    </main>
  )
}
