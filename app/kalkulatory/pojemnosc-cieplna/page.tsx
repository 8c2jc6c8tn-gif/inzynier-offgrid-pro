"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { calculatePojemnoscCieplna, type UdzialWarstwy } from "@/lib/core/modules/ogrzewanie/pojemnosc-cieplna/calculator"
import type { StronaWarstwy } from "@/lib/core/modules/ogrzewanie/pojemnosc-cieplna/input"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type SeedObciazenia } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

/** `strona`/`gruboscElementu` since 27.09.2026 (EN ISO 13786 Zał. A) — optional, older drafts lack them. */
type WarstwaSeed = { nazwa: string; powierzchnia: string; grubosc: string; gestosc: string; cieplo: string; strona?: StronaWarstwy; gruboscElementu?: string }
type Seed = { warstwy: WarstwaSeed[]; temperaturaStartowa: string; temperaturaZewnetrzna: string; temperaturaGraniczna: string }

const nowaWarstwa = (nazwa: string, strona: StronaWarstwy = "jedna"): WarstwaSeed => ({
  nazwa,
  powierzchnia: "",
  grubosc: "",
  gestosc: "",
  cieplo: "",
  strona,
  gruboscElementu: "",
})
const STAN_POCZATKOWY: Seed = {
  warstwy: [nowaWarstwa("Ściany zewnętrzne"), nowaWarstwa("Stropy"), nowaWarstwa("Ścianki działowe", "obie")],
  temperaturaStartowa: "",
  temperaturaZewnetrzna: "",
  temperaturaGraniczna: "",
}

const n = (s: string) => liczba(s) ?? null
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

function KartaWarstwy({ w, i, ustaw, usun }: { w: WarstwaSeed; i: number; ustaw: (z: Partial<WarstwaSeed>) => void; usun: () => void }) {
  const pole = (klucz: "powierzchnia" | "grubosc" | "gestosc" | "cieplo" | "gruboscElementu", label: string, unit: string) => (
    <Pole
      id={`warstwa-${i}-${klucz}`}
      label={label}
      unit={unit}
      type="number"
      inputMode="decimal"
      min={0}
      value={w[klucz] ?? ""}
      onChange={(e) => ustaw({ [klucz]: e.target.value })}
      pomoc={<PomocPola ekran="pojemnosc-cieplna" pole={klucz} />}
    />
  )
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Pole id={`warstwa-${i}-nazwa`} label="Warstwa / materiał" value={w.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="nazwa" />} />
      <div className="grid gap-3 sm:grid-cols-2">
        {pole("powierzchnia", "Powierzchnia", "m²")}
        {pole("grubosc", "Grubość", "cm")}
        {pole("gestosc", "Gęstość ρ", "kg/m³")}
        {pole("cieplo", "Ciepło właściwe c", "J/(kg·K)")}
        <PoleSelect
          id={`warstwa-${i}-strona`}
          label="Położenie"
          value={w.strona ?? "jedna"}
          onChange={(e) => ustaw({ strona: e.target.value as StronaWarstwy })}
          pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="polozenie" />}
        >
          <option value="jedna">Jedną stroną do wnętrza (ściana zewnętrzna, strop nad piwnicą)</option>
          <option value="obie">Cała wewnątrz domu (ścianka działowa, strop między piętrami)</option>
          <option value="za-izolacja">Za izolacją (np. zewnętrzna warstwa muru trójwarstwowego)</option>
        </PoleSelect>
        {pole("gruboscElementu", "Grubość całej przegrody (opcjonalnie)", "cm")}
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
          strona: w.strona ?? "jedna",
          gruboscElementuCm: n(w.gruboscElementu ?? ""),
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

  const kolumny: Kolumna<UdzialWarstwy & { id: number }>[] = [
    { naglowek: "Warstwa", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "Czynna [cm]", render: (r) => (r.liczbaStron === 2 ? `2 × ${f1(r.gruboscCzynnaCm)}` : f1(r.gruboscCzynnaCm)), liczbowa: true },
    { naglowek: "C [kWh/K]", render: (r) => f2(r.pojemnoscKwhK), liczbowa: true },
    { naglowek: "Udział [%]", render: (r) => f0(r.udzialPct), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pojemnosc-cieplna" />
      <NaglowekEkranu tytul="Pojemność cieplna budynku" ekran="pojemnosc-cieplna" wynik={wynik}>
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
            pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="tempDom" />}
          />
          <Pole
            label="Temperatura na zewnątrz"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaZewnetrzna}
            placeholder={e1 ? String(e1.te) : undefined}
            onChange={(e) => ustaw({ temperaturaZewnetrzna: e.target.value })}
            pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="tempZew" />}
          />
          <Pole
            label="Nie niżej niż (opcjonalnie)"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaGraniczna}
            onChange={(e) => ustaw({ temperaturaGraniczna: e.target.value })}
            pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="prog" />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Masa budynku</h2>
        <p className="text-small text-muted-foreground">
          Wpisz warstwy, które magazynują ciepło: ciężkie (beton, cegła) akumulują dużo, lekkie (drewno, gips) mało. Gęstość i
          ciepło właściwe weź z karty materiału — aplikacja nie ma ich tabeli. W ciągu doby ciepło oddaje tylko ok. 10 cm przy
          powierzchni (EN ISO 13786) — dlatego ważne, czy przegroda ma izolację i czy stoi w środku domu.
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
        <WerdyktPanel poziom="uwaga" etykieta="Przybliżenie (EN ISO 13786, Załącznik A)">
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
          <p className="mt-2 text-small">{t("POJC-ZALACZNIK-A-PRZYBLIZENIE")}</p>
          <p className="mt-1 text-small text-muted-foreground">
            Cała masa przegród: {f1(v.pojemnoscCalkowitaKwhK)} kWh/K — oddaje ciepło dopiero przy wychładzaniu trwającym wiele dni.
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 text-center text-small">
            {v.przebieg.map((p) => (
              <li key={p.godzina} className="rounded-md border p-2">
                <div className="text-muted-foreground">{p.godzina} h</div>
                <div className="font-medium">{f1(p.temperaturaC)} °C</div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.warstwy.map((w, i) => ({ ...w, id: i }))} minWidth={340} />
          </div>
          {v.pojemnoscPowietrzaKwhK > 0 && <p className="mt-2 text-small text-muted-foreground">Powietrze: {f2(v.pojemnoscPowietrzaKwhK)} kWh/K.</p>}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
