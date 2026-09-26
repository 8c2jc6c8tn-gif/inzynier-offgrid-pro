"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { calculatePojemnoscCieplna } from "@/lib/core/modules/ogrzewanie/pojemnosc-cieplna/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type SeedObciazenia } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

type WarstwaSeed = { nazwa: string; powierzchnia: string; grubosc: string; gestosc: string; cieplo: string }
type Seed = { warstwy: WarstwaSeed[]; temperaturaStartowa: string; temperaturaZewnetrzna: string; temperaturaGraniczna: string }

const nowaWarstwa = (nazwa: string): WarstwaSeed => ({ nazwa, powierzchnia: "", grubosc: "", gestosc: "", cieplo: "" })
const STAN_POCZATKOWY: Seed = {
  warstwy: [nowaWarstwa("Ściany zewnętrzne"), nowaWarstwa("Stropy"), nowaWarstwa("Ścianki działowe")],
  temperaturaStartowa: "",
  temperaturaZewnetrzna: "",
  temperaturaGraniczna: "",
}

const n = (s: string) => liczba(s) ?? null
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

function KartaWarstwy({ w, i, ustaw, usun }: { w: WarstwaSeed; i: number; ustaw: (z: Partial<WarstwaSeed>) => void; usun: () => void }) {
  const pole = (klucz: keyof Omit<WarstwaSeed, "nazwa">, label: string, unit: string, hint?: string) => (
    <Pole
      id={`warstwa-${i}-${klucz}`}
      label={label}
      unit={unit}
      type="number"
      inputMode="decimal"
      min={0}
      value={w[klucz]}
      onChange={(e) => ustaw({ [klucz]: e.target.value })}
      hint={hint}
    />
  )
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Pole id={`warstwa-${i}-nazwa`} label="Warstwa / materiał" value={w.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} />
      <div className="grid gap-3 sm:grid-cols-2">
        {pole("powierzchnia", "Powierzchnia", "m²")}
        {pole("grubosc", "Grubość", "cm")}
        {pole("gestosc", "Gęstość ρ", "kg/m³", "Z karty materiału.")}
        {pole("cieplo", "Ciepło właściwe c", "J/(kg·K)", "Z karty materiału — w J, nie kJ.")}
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        Usuń warstwę
      </Button>
    </div>
  )
}

export default function PojemnoscCieplnaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Seed>("pojemnosc-cieplna", STAN_POCZATKOWY)
  const ustaw = (z: Partial<Seed>) => setStan((s) => ({ ...s, ...z }))
  const ustawWarstwe = (i: number, z: Partial<WarstwaSeed>) =>
    setStan((s) => ({ ...s, warstwy: s.warstwy.map((w, j) => (j === i ? { ...w, ...z } : w)) }))
  const ekran1 = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)

  // H and design temperatures from Ekran 1 — only when its result is complete and valid.
  const e1 = useMemo(() => {
    if (!ekran1.dane) return null
    const wejscie = wejscieObciazenia(ekran1.dane)
    const w = calculateObciazenieCieplne(wejscie)
    if (!w.value) return null
    const zewn = wejscie.przegrody.filter((p) => p.zewnetrzna)
    const inne = wejscie.przegrody.filter((p) => !p.zewnetrzna)
    return {
      hZewnetrzneWK: zewn.reduce((s, p) => s + p.uWM2K! * p.powierzchniaM2!, 0) + w.value.hvWK,
      stratyDoInnychStref: inne.map((p) => ({ hWK: p.uWM2K! * p.powierzchniaM2!, temperaturaC: p.temperaturaPoDrugiejStronieC! })),
      kubaturaM3: wejscie.kubaturaM3,
      ti: wejscie.temperaturaWewnetrznaC!,
      te: w.value.temperaturaZewnetrznaC,
    }
  }, [ekran1.dane])

  const tStart = n(stan.temperaturaStartowa) ?? e1?.ti ?? null
  const tZewn = n(stan.temperaturaZewnetrzna) ?? e1?.te ?? null
  const wynik = useMemo(
    () =>
      calculatePojemnoscCieplna({
        warstwy: stan.warstwy.map((w) => ({
          nazwa: w.nazwa.trim(),
          powierzchniaM2: n(w.powierzchnia),
          gruboscCm: n(w.grubosc),
          gestoscKgM3: n(w.gestosc),
          cieploWlasciweJKgK: n(w.cieplo),
        })),
        kubaturaM3: e1?.kubaturaM3 ?? null,
        hZewnetrzneWK: e1?.hZewnetrzneWK ?? null,
        stratyDoInnychStref: e1?.stratyDoInnychStref ?? [],
        temperaturaPoczatkowaC: tStart,
        temperaturaZewnetrznaC: tZewn,
        temperaturaGranicznaC: n(stan.temperaturaGraniczna),
      }),
    [stan, e1, tStart, tZewn],
  )
  const v = wynik.value
  const tg = n(stan.temperaturaGraniczna)

  const kolumny: Kolumna<{ id: number; nazwa: string; pojemnoscKwhK: number; udzialPct: number }>[] = [
    { naglowek: "Warstwa", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "C [kWh/K]", render: (r) => f2(r.pojemnoscKwhK), liczbowa: true },
    { naglowek: "Udział [%]", render: (r) => f0(r.udzialPct), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pojemnosc-cieplna" />
      <NaglowekEkranu tytul="Pojemność cieplna budynku">
        Ile ciepła magazynują ściany i stropy i jak szybko dom wychładza się po awarii ogrzewania — w tym ile czasu zostaje do
        zamarznięcia instalacji. Moduł 6, Ekran 8.
      </NaglowekEkranu>

      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="font-semibold">1. Straty ciepła — z Ekranu 1</h2>
        {!ekran1.wczytano ? null : e1 === null ? (
          <p className="text-small text-muted-foreground">
            Uzupełnij{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              Ekran 1 „Straty ciepła budynku”
            </Link>{" "}
            — z niego bierze się współczynnik strat H, kubatura i temperatury.
          </p>
        ) : (
          <p className="text-small">
            H = {f0(e1.hZewnetrzneWK + e1.stratyDoInnychStref.reduce((s, x) => s + x.hWK, 0))} W/K (przegrody + wentylacja
            {e1.kubaturaM3 !== null ? `, powietrze ${f0(e1.kubaturaM3)} m³` : ""}).{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              Zmień na Ekranie 1
            </Link>
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <Pole
            label="Temperatura w domu"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaStartowa}
            placeholder={e1 ? String(e1.ti) : undefined}
            onChange={(e) => ustaw({ temperaturaStartowa: e.target.value })}
            hint="W chwili awarii. Puste = z Ekranu 1."
          />
          <Pole
            label="Temperatura na zewnątrz"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaZewnetrzna}
            placeholder={e1 ? String(e1.te) : undefined}
            onChange={(e) => ustaw({ temperaturaZewnetrzna: e.target.value })}
            hint="Podczas awarii. Puste = obliczeniowa dla strefy z Ekranu 1."
          />
          <Pole
            label="Nie niżej niż (opcjonalnie)"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaGraniczna}
            onChange={(e) => ustaw({ temperaturaGraniczna: e.target.value })}
            hint="Twój próg ochrony, np. rur z wodą."
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Masa budynku</h2>
        <p className="text-small text-muted-foreground">
          Wpisz warstwy, które magazynują ciepło: ciężkie (beton, cegła) akumulują dużo, lekkie (drewno, gips) mało. Gęstość i
          ciepło właściwe weź z karty materiału — aplikacja nie ma ich tabeli.
        </p>
        {stan.warstwy.map((w, i) => (
          <KartaWarstwy
            key={i}
            w={w}
            i={i}
            ustaw={(z) => ustawWarstwe(i, z)}
            usun={() => setStan((s) => ({ ...s, warstwy: s.warstwy.filter((_, j) => j !== i) }))}
          />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, warstwy: [...s.warstwy, nowaWarstwa("")] }))}>
          + Dodaj warstwę
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
      {wynik.status === "INCOMPLETE" && e1 !== null && (
        <p className="text-small text-muted-foreground">
          Wpisz powierzchnię, grubość, gęstość i ciepło właściwe każdej warstwy (albo usuń te, których nie liczysz).
        </p>
      )}
      {v && (
        <WerdyktPanel poziom="uwaga" etykieta="Wynik zawyżony — patrz ostrzeżenie">
          <WynikGlowny>{f1(v.pojemnoscKwhK)} kWh/K</WynikGlowny>
          <p className="mt-1 text-small">
            Stała czasowa τ = {f0(v.stalaCzasowaH)} h. Bez ogrzewania dom dąży do {f1(v.temperaturaRownowagiC)} °C.
            {v.czasPierwszegoStopniaH !== null && <> Pierwszy 1 °C spadku po {f1(v.czasPierwszegoStopniaH)} h.</>}
            {tg !== null && v.czasDoGranicyH !== null && (
              <>
                {" "}
                Do {tg} °C po <strong>{f1(v.czasDoGranicyH)} h</strong> — realnie może to być krócej.
              </>
            )}
          </p>
          <p className="mt-2 text-small">{t("POJC-CALA-MASA-ZAWYZA")}</p>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 text-center text-small">
            {v.przebieg.map((p) => (
              <li key={p.godzina} className="rounded-md border p-2">
                <div className="text-muted-foreground">{p.godzina} h</div>
                <div className="font-medium">{f1(p.temperaturaC)} °C</div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.warstwy.map((w, i) => ({ ...w, id: i }))} minWidth={280} />
          </div>
          {v.pojemnoscPowietrzaKwhK > 0 && <p className="mt-2 text-small text-muted-foreground">Powietrze: {f2(v.pojemnoscPowietrzaKwhK)} kWh/K.</p>}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} />
        </WerdyktPanel>
      )}

      <MigawkaBox>
        „Ciężki dom to jak piec kaflowy — długo się nagrzewa, ale długo trzyma ciepło. To ta sama liczba, która mówi, ile czasu
        masz w razie awarii ogrzewania, zanim zacznie robić się naprawdę zimno.”
      </MigawkaBox>
    </main>
  )
}
