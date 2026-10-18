"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateKosztyOgrzewania, type WynikZrodla } from "@/lib/core/modules/ogrzewanie/koszty-ogrzewania/calculator"
import { LICZBA_LAT_ZRODLO, SPOSOB_LICZENIA } from "@/lib/core/modules/ogrzewanie/koszty-ogrzewania/constants"
import type { RodzajZrodla, ZrodloCiepla } from "@/lib/core/modules/ogrzewanie/koszty-ogrzewania/input"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"

const RODZAJE: { id: RodzajZrodla; label: string; jednostka: string }[] = [
  { id: "drewno", label: "UI-KOSOGR-DREWNO-KOMINEK-PIEC", jednostka: "mp" },
  { id: "wegiel", label: "UI-KOSOGR-WEGIEL", jednostka: "kg" },
  { id: "pellet", label: "UI-KOSOGR-PELLET", jednostka: "kg" },
  { id: "gaz", label: "UI-KOSOGR-GAZ-ZIEMNY-LPG", jednostka: "m³" },
  { id: "olej", label: "UI-KOSOGR-OLEJ-OPALOWY-NAPEDOWY", jednostka: "l" },
  { id: "inne-paliwo", label: "UI-KOSOGR-INNE-PALIWO", jednostka: "kg" },
  { id: "nagrzewnica-paliwowa", label: "UI-KOSOGR-NAGRZEWNICA-PALIWOWA-TYPU", jednostka: "l" },
  { id: "kociol-elektryczny", label: "UI-KOSOGR-KOCIOL-ELEKTRYCZNY-GRZALKA", jednostka: "kWh" },
  { id: "grzejniki-ir", label: "UI-KOSOGR-PROMIENNIKI-PODCZERWIENI", jednostka: "kWh" },
  { id: "pompa-ciepla", label: "UI-KOSOGR-POMPA-CIEPLA", jednostka: "kWh" },
]
const JEDNOSTKI = ["kg", "t", "mp", "m³", "l"]

type ZrodloSeed = {
  nazwa: string
  rodzaj: RodzajZrodla
  jednostka: string
  cenaZl: string
  wartoscOpalowaKwh: string
  sprawnoscPct: string
  mocGrzewczaKw: string
  zuzyciePaliwaNaH: string
  cop: string
  poborPraduW: string
  kosztInwestycjiZl: string
  kosztSerwisuRocznyZl: string
}
type Seed = { zapotrzebowanieSezonKwh: string; liczbaLat: string; zrodla: ZrodloSeed[] }

const noweZrodlo = (rodzaj: RodzajZrodla): ZrodloSeed => ({
  nazwa: "",
  rodzaj,
  jednostka: RODZAJE.find((r) => r.id === rodzaj)!.jednostka,
  cenaZl: "",
  wartoscOpalowaKwh: "",
  sprawnoscPct: "",
  mocGrzewczaKw: "",
  zuzyciePaliwaNaH: "",
  cop: "",
  poborPraduW: "",
  kosztInwestycjiZl: "",
  kosztSerwisuRocznyZl: "",
})

// Okres 10 lat — wartość ze źródła ("ranking opłacalności w skali 10 lat"), edytowalna (D28).
const STAN_POCZATKOWY: Seed = { zapotrzebowanieSezonKwh: "", liczbaLat: String(LICZBA_LAT_ZRODLO), zrodla: [] }

// Money fields of every heat source (price per unit, purchase + installation, yearly service).
const PRZELICZ_ZRODLO = przeliczPola<ZrodloSeed>("cenaZl", "kosztInwestycjiZl", "kosztSerwisuRocznyZl")
const PRZELICZ_KWOTY = (stan: Seed, wspolczynnik: number): Seed => ({
  ...stan,
  zrodla: stan.zrodla.map((z) => PRZELICZ_ZRODLO(z, wspolczynnik)),
})

const n = (s: string) => liczba(s) ?? null
const nazwaZrodla = (z: ZrodloSeed, i: number, t: (k: string) => string) =>
  z.nazwa.trim() || `${t(RODZAJE.find((r) => r.id === z.rodzaj)!.label)} (${i + 1})`

function doWejscia(z: ZrodloSeed, i: number, t: (k: string) => string): ZrodloCiepla {
  return {
    nazwa: nazwaZrodla(z, i, t),
    rodzaj: z.rodzaj,
    jednostka: z.jednostka,
    cenaZl: n(z.cenaZl),
    wartoscOpalowaKwh: n(z.wartoscOpalowaKwh),
    sprawnoscPct: n(z.sprawnoscPct),
    mocGrzewczaKw: n(z.mocGrzewczaKw),
    zuzyciePaliwaNaH: n(z.zuzyciePaliwaNaH),
    cop: n(z.cop),
    poborPraduW: n(z.poborPraduW),
    kosztInwestycjiZl: n(z.kosztInwestycjiZl),
    kosztSerwisuRocznyZl: n(z.kosztSerwisuRocznyZl),
  }
}

function KartaZrodla({ z, i, ustaw, usun }: { z: ZrodloSeed; i: number; ustaw: (p: Partial<ZrodloSeed>) => void; usun: () => void }) {
  const t = useTranslate()
  const sposob = SPOSOB_LICZENIA[z.rodzaj]
  const pole = (klucz: keyof ZrodloSeed, label: string, unit?: string) => (
    <Pole
      id={`zrodlo-${i}-${klucz}`}
      label={label}
      unit={unit}
      type="number"
      inputMode="decimal"
      min={0}
      value={z[klucz] as string}
      onChange={(e) => ustaw({ [klucz]: e.target.value })}
      pomoc={<PomocPola ekran="koszty-ogrzewania" pole={klucz} />}
    />
  )
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <PoleSelect id={`zrodlo-${i}-rodzaj`} label={t("UI-KOSOGR-RODZAJ")} value={z.rodzaj} onChange={(e) => ustaw({ rodzaj: e.target.value as RodzajZrodla, jednostka: RODZAJE.find((r) => r.id === e.target.value)!.jednostka })} pomoc={<PomocPola ekran="koszty-ogrzewania" pole="rodzaj" />}>
          {RODZAJE.map((r) => (
            <option key={r.id} value={r.id}>
              {t(r.label)}
            </option>
          ))}
        </PoleSelect>
        <Pole id={`zrodlo-${i}-nazwa`} label={t("UI-KOSOGR-NAZWA-OPCJONALNIE")} value={z.nazwa} placeholder={nazwaZrodla({ ...z, nazwa: "" }, i, t)} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="koszty-ogrzewania" pole="nazwa" />} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sposob !== "prad" && (
          <PoleSelect id={`zrodlo-${i}-jednostka`} label={t("UI-KOSOGR-JEDNOSTKA-PALIWA")} value={z.jednostka} onChange={(e) => ustaw({ jednostka: e.target.value })} pomoc={<PomocPola ekran="koszty-ogrzewania" pole="jednostka" />}>
            {JEDNOSTKI.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </PoleSelect>
        )}
        {pole("cenaZl", "Cena", sposob === "prad" ? t("UI-J-ZL-KWH") : t("UI-KOSOGR-ZL", { jednostka: z.jednostka }))}
        {sposob === "paliwo" && pole("wartoscOpalowaKwh", t("UI-KOSOGR-WARTOSC-OPALOWA"), `kWh/${z.jednostka}`)}
        {sposob === "paliwo" && pole("sprawnoscPct", t("UI-KOSOGR-SPRAWNOSC-URZADZENIA"), "%")}
        {sposob === "karta" && pole("mocGrzewczaKw", t("UI-KOSOGR-MOC-GRZEWCZA"), "kW")}
        {sposob === "karta" && pole("zuzyciePaliwaNaH", t("UI-KOSOGR-ZUZYCIE-PALIWA-TEJ"), `${z.jednostka}/h`)}
        {z.rodzaj === "pompa-ciepla" && pole("cop", t("UI-KOSOGR-COP-SREDNI-SEZONIE"))}
        {sposob === "paliwo" && pole("mocGrzewczaKw", t("UI-KOSOGR-MOC-GRZEWCZA-OPCJONALNIE"), "kW")}
        {sposob !== "prad" && pole("poborPraduW", t("UI-KOSOGR-POBOR-PRADU-PRACY"), "W")}
        {pole("kosztInwestycjiZl", t("UI-KOSOGR-KOSZT-ZAKUPU-MONTAZU"), t("UI-J-ZL"))}
        {pole("kosztSerwisuRocznyZl", t("UI-KOSOGR-SERWIS-PRZEGLADY-ROCZNIE"), t("UI-J-ZL"))}
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        {t("UI-KOSOGR-USUN-ZRODLO")}
      </Button>
    </div>
  )
}

export default function KosztyOgrzewaniaPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const f1 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 })
  const f2 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const [stan, setStan, info] = usePersistedDraft<Seed>("koszty-ogrzewania", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const ustawZrodlo = (i: number, p: Partial<ZrodloSeed>) => setStan((s) => ({ ...s, zrodla: s.zrodla.map((z, j) => (j === i ? { ...z, ...p } : z)) }))

  const wynik = useMemo(
    () =>
      calculateKosztyOgrzewania({
        zapotrzebowanieSezonKwh: n(stan.zapotrzebowanieSezonKwh),
        liczbaLat: n(stan.liczbaLat),
        zrodla: stan.zrodla.map((z, i) => doWejscia(z, i, t)),
      }),
    [stan, t],
  )
  const v = wynik.value
  const lata = n(stan.liczbaLat) ?? 0
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : wynik.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"

  const kolumny: Kolumna<WynikZrodla & { id: number }>[] = [
    { naglowek: t("UI-KOSOGR-ZRODLO"), render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: t("UI-KOSOGR-KWH-CIEPLA"), render: (r) => f2(r.kosztKwhCieplaZl), liczbowa: true },
    {
      naglowek: t("UI-KOSOGR-PALIWO-SEZON"),
      render: (r) => (r.iloscPaliwaSezon === null ? "—" : `${f1(r.iloscPaliwaSezon)} ${r.jednostka}`),
      liczbowa: true,
    },
    {
      naglowek: t("UI-KOSOGR-PRAD-SEZON"),
      render: (r) => (r.energiaElektrycznaSezonKwh === null ? t("UI-KOSOGR-NIE-POLICZONO") : `${f0(r.energiaElektrycznaSezonKwh)} kWh`),
      liczbowa: true,
    },
    { naglowek: t("UI-KOSOGR-SEZON-SERWISEM"), render: (r) => t("UI-KOSOGR-ZL-2", { kosztRocznyZSerwisemZl: f0(r.kosztRocznyZSerwisemZl) }), liczbowa: true },
    { naglowek: t("UI-KOSOGR-RAZEM-LAT", { lata: f0(lata) }), render: (r) => t("UI-KOSOGR-ZL-3", { kosztCalkowityZl: f0(r.kosztCalkowityZl) }), liczbowa: true },
    { naglowek: t("UI-KOSOGR-ZWROT"), render: (r) => (r.zwrotLat === null ? "—" : `${f1(r.zwrotLat)} lat`), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/koszty-ogrzewania" />
      <NaglowekEkranu tytul={t("UI-KOSOGR-POROWNANIE-KOSZTOW-OGRZEWANI")} ekran="koszty-ogrzewania" wynik={wynik} parametry={{ lata: LICZBA_LAT_ZRODLO }}>
        {t("UI-KOSOGR-DREWNO-WEGIEL-PELLET")}
      </NaglowekEkranu>

      <PrzeliczoneInfo info={info} />

      <section className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label={t("UI-KOSOGR-CIEPLO-POTRZEBNE-SEZONIE")}
            unit="kWh"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.zapotrzebowanieSezonKwh}
            onChange={(e) => setStan((s) => ({ ...s, zapotrzebowanieSezonKwh: e.target.value }))}
            pomoc={<PomocPola ekran="koszty-ogrzewania" pole="zapotrzebowanie" />}
          />
          <Pole
            label={t("UI-KOSOGR-OKRES-ANALIZY")}
            unit={t("UI-J-LAT")}
            type="number"
            inputMode="decimal"
            min={1}
            value={stan.liczbaLat}
            onChange={(e) => setStan((s) => ({ ...s, liczbaLat: e.target.value }))}
            pomoc={<PomocPola ekran="koszty-ogrzewania" pole="liczbaLat" params={{ lata: LICZBA_LAT_ZRODLO }} />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-KOSOGR-ZRODLA-CIEPLA-POROWNANIA")}</h2>
        {stan.zrodla.length === 0 && <p className="text-small text-muted-foreground">{t("UI-KOSOGR-DODAJ-NAJMNIEJ-JEDNO")}</p>}
        {stan.zrodla.map((z, i) => (
          <KartaZrodla key={i} z={z} i={i} ustaw={(p) => ustawZrodlo(i, p)} usun={() => setStan((s) => ({ ...s, zrodla: s.zrodla.filter((_, j) => j !== i) }))} />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, zrodla: [...s.zrodla, noweZrodlo("drewno")] }))}>
          {t("UI-KOSOGR-DODAJ-ZRODLO-CIEPLA")}
        </Button>
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-KOSOGR-SPRAWDZ-DANE")}>
          <ul className="mt-2 space-y-1 text-small">
            {wynik.warnings.map((w, i) => (
              <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">
          {t("UI-KOSOGR-WPISZ-CIEPLO-POTRZEBNE")}
        </p>
      )}
      {v && (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-KOSOGR-NAJTANIEJ-LAT", { lata: f0(lata) })}>
          <WynikGlowny>{v.ranking[0]!.nazwa}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-KOSOGR-RAZEM-KWH-CIEPLA", { kosztCalkowityZl: f0(v.ranking[0]!.kosztCalkowityZl), kosztKwhCieplaZl: f2(v.ranking[0]!.kosztKwhCieplaZl) })}
          </p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.ranking.map((r) => ({ ...r, id: r.indeks }))} minWidth={720} />
          </div>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
          <p className="mt-2 text-small">
            {t("UI-KOSOGR-TYLKO-PRAD-POROWNANIE")}{" "}
            <Link href="/kalkulatory/kociol-elektryczny" className="underline">
              {t("UI-KOSOGR-KOCIOL-ELEKTRYCZNY-POMPA")}
            </Link>
            {t("UI-KOSOGR-PALIWO-STALE")}{" "}
            <Link href="/kalkulatory/dogrzewanie-paliwem-stalym" className="underline">
              {t("UI-KOSOGR-BEZPIECZENSTWO-POZAROWE")}
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}

      
    </main>
  )
}
