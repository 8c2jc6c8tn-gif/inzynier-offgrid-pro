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
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

const RODZAJE: { id: RodzajZrodla; label: string; jednostka: string }[] = [
  { id: "drewno", label: "Drewno (kominek, piec)", jednostka: "mp" },
  { id: "wegiel", label: "Węgiel", jednostka: "kg" },
  { id: "pellet", label: "Pellet", jednostka: "kg" },
  { id: "gaz", label: "Gaz (ziemny, LPG)", jednostka: "m³" },
  { id: "olej", label: "Olej opałowy / napędowy (kocioł)", jednostka: "l" },
  { id: "inne-paliwo", label: "Inne paliwo", jednostka: "kg" },
  { id: "nagrzewnica-paliwowa", label: "Nagrzewnica paliwowa (typu webasto)", jednostka: "l" },
  { id: "kociol-elektryczny", label: "Kocioł elektryczny / grzałka", jednostka: "kWh" },
  { id: "grzejniki-ir", label: "Promienniki podczerwieni (IR)", jednostka: "kWh" },
  { id: "pompa-ciepla", label: "Pompa ciepła", jednostka: "kWh" },
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

const n = (s: string) => liczba(s) ?? null
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const nazwaZrodla = (z: ZrodloSeed, i: number) => z.nazwa.trim() || `${RODZAJE.find((r) => r.id === z.rodzaj)!.label} (${i + 1})`

function doWejscia(z: ZrodloSeed, i: number): ZrodloCiepla {
  return {
    nazwa: nazwaZrodla(z, i),
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
        <PoleSelect id={`zrodlo-${i}-rodzaj`} label="Rodzaj" value={z.rodzaj} onChange={(e) => ustaw({ rodzaj: e.target.value as RodzajZrodla, jednostka: RODZAJE.find((r) => r.id === e.target.value)!.jednostka })} pomoc={<PomocPola ekran="koszty-ogrzewania" pole="rodzaj" />}>
          {RODZAJE.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </PoleSelect>
        <Pole id={`zrodlo-${i}-nazwa`} label="Nazwa (opcjonalnie)" value={z.nazwa} placeholder={nazwaZrodla({ ...z, nazwa: "" }, i)} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="koszty-ogrzewania" pole="nazwa" />} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sposob !== "prad" && (
          <PoleSelect id={`zrodlo-${i}-jednostka`} label="Jednostka paliwa" value={z.jednostka} onChange={(e) => ustaw({ jednostka: e.target.value })} pomoc={<PomocPola ekran="koszty-ogrzewania" pole="jednostka" />}>
            {JEDNOSTKI.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </PoleSelect>
        )}
        {pole("cenaZl", "Cena", sposob === "prad" ? "zł/kWh" : `zł/${z.jednostka}`)}
        {sposob === "paliwo" && pole("wartoscOpalowaKwh", "Wartość opałowa", `kWh/${z.jednostka}`)}
        {sposob === "paliwo" && pole("sprawnoscPct", "Sprawność urządzenia", "%")}
        {sposob === "karta" && pole("mocGrzewczaKw", "Moc grzewcza", "kW")}
        {sposob === "karta" && pole("zuzyciePaliwaNaH", "Zużycie paliwa przy tej mocy", `${z.jednostka}/h`)}
        {z.rodzaj === "pompa-ciepla" && pole("cop", "COP (średni w sezonie)")}
        {sposob === "paliwo" && pole("mocGrzewczaKw", "Moc grzewcza (opcjonalnie)", "kW")}
        {sposob !== "prad" && pole("poborPraduW", "Pobór prądu w pracy (opcjonalnie)", "W")}
        {pole("kosztInwestycjiZl", "Koszt zakupu i montażu", "zł")}
        {pole("kosztSerwisuRocznyZl", "Serwis i przeglądy rocznie", "zł")}
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        Usuń źródło
      </Button>
    </div>
  )
}

export default function KosztyOgrzewaniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Seed>("koszty-ogrzewania", STAN_POCZATKOWY)
  const ustawZrodlo = (i: number, p: Partial<ZrodloSeed>) => setStan((s) => ({ ...s, zrodla: s.zrodla.map((z, j) => (j === i ? { ...z, ...p } : z)) }))

  const wynik = useMemo(
    () =>
      calculateKosztyOgrzewania({
        zapotrzebowanieSezonKwh: n(stan.zapotrzebowanieSezonKwh),
        liczbaLat: n(stan.liczbaLat),
        zrodla: stan.zrodla.map(doWejscia),
      }),
    [stan],
  )
  const v = wynik.value
  const lata = n(stan.liczbaLat) ?? 0
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : wynik.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"

  const kolumny: Kolumna<WynikZrodla & { id: number }>[] = [
    { naglowek: "Źródło", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "zł/kWh ciepła", render: (r) => f2(r.kosztKwhCieplaZl), liczbowa: true },
    {
      naglowek: "Paliwo na sezon",
      render: (r) => (r.iloscPaliwaSezon === null ? "—" : `${f1(r.iloscPaliwaSezon)} ${r.jednostka}`),
      liczbowa: true,
    },
    {
      naglowek: "Prąd na sezon",
      render: (r) => (r.energiaElektrycznaSezonKwh === null ? "nie policzono" : `${f0(r.energiaElektrycznaSezonKwh)} kWh`),
      liczbowa: true,
    },
    { naglowek: "Sezon (z serwisem)", render: (r) => `${f0(r.kosztRocznyZSerwisemZl)} zł`, liczbowa: true },
    { naglowek: `Razem w ${f0(lata)} lat`, render: (r) => `${f0(r.kosztCalkowityZl)} zł`, liczbowa: true },
    { naglowek: "Zwrot", render: (r) => (r.zwrotLat === null ? "—" : `${f1(r.zwrotLat)} lat`), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/koszty-ogrzewania" />
      <NaglowekEkranu tytul="Porównanie kosztów ogrzewania" ekran="koszty-ogrzewania" wzor={wynik.formula} parametry={{ lata: LICZBA_LAT_ZRODLO }}>
        Drewno, węgiel, pellet, gaz, olej, nagrzewnica paliwowa, prąd czy pompa ciepła — ile naprawdę kosztuje 1 kWh ciepła z
        każdego źródła i które wychodzi najtaniej razem z zakupem i serwisem. W off-gridzie liczy się też, ile prądu
        potrzebuje dane źródło zimą. Moduł 6.
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label="Ciepło potrzebne w sezonie"
            unit="kWh"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.zapotrzebowanieSezonKwh}
            onChange={(e) => setStan((s) => ({ ...s, zapotrzebowanieSezonKwh: e.target.value }))}
            pomoc={<PomocPola ekran="koszty-ogrzewania" pole="zapotrzebowanie" />}
          />
          <Pole
            label="Okres analizy"
            unit="lat"
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
        <h2 className="font-semibold">Źródła ciepła do porównania</h2>
        {stan.zrodla.length === 0 && <p className="text-small text-muted-foreground">Dodaj co najmniej jedno źródło.</p>}
        {stan.zrodla.map((z, i) => (
          <KartaZrodla key={i} z={z} i={i} ustaw={(p) => ustawZrodlo(i, p)} usun={() => setStan((s) => ({ ...s, zrodla: s.zrodla.filter((_, j) => j !== i) }))} />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, zrodla: [...s.zrodla, noweZrodlo("drewno")] }))}>
          + Dodaj źródło ciepła
        </Button>
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta="Sprawdź dane">
          <ul className="mt-2 space-y-1 text-small">
            {wynik.warnings.map((w, i) => (
              <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">
          Wpisz ciepło potrzebne w sezonie, okres analizy i uzupełnij dane co najmniej jednego źródła.
        </p>
      )}
      {v && (
        <WerdyktPanel poziom={poziom} etykieta={`Najtaniej w ${f0(lata)} lat`}>
          <WynikGlowny>{v.ranking[0]!.nazwa}</WynikGlowny>
          <p className="mt-1 text-small">
            {f0(v.ranking[0]!.kosztCalkowityZl)} zł razem, {f2(v.ranking[0]!.kosztKwhCieplaZl)} zł za 1 kWh ciepła.
          </p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.ranking.map((r) => ({ ...r, id: r.indeks }))} minWidth={720} />
          </div>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
          <p className="mt-2 text-small">
            Tylko prąd: porównanie kotła z pompą ciepła —{" "}
            <Link href="/kalkulatory/kociol-elektryczny" className="underline">
              Kocioł elektryczny vs pompa ciepła
            </Link>
            . Paliwo stałe:{" "}
            <Link href="/kalkulatory/dogrzewanie-paliwem-stalym" className="underline">
              bezpieczeństwo pożarowe
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}

      
    </main>
  )
}
