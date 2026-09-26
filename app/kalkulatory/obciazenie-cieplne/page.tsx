"use client"

import Link from "next/link"
import { useMemo } from "react"
import { TemperaturyZPvgis } from "@/components/lokalizacja/temperatury-z-pvgis"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne, type MiesiacCiepla, type StrataPrzegrody } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import {
  STREFY_KLIMATYCZNE,
  TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C,
  type StrefaKlimatyczna,
} from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type PrzegrodaSeed, type SeedObciazenia as Seed } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

const RZYMSKIE: Record<StrefaKlimatyczna, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" }
const MIESIACE = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]

const nowaPrzegroda = (nazwa: string): PrzegrodaSeed => ({ nazwa, powierzchniaM2: "", uWM2K: "", zewnetrzna: true, temperaturaPoDrugiejStronieC: "" })

const STAN_POCZATKOWY: Seed = {
  przegrody: [nowaPrzegroda("Ściany zewnętrzne"), nowaPrzegroda("Okna i drzwi"), nowaPrzegroda("Dach / strop")],
  temperaturaWewnetrznaC: "",
  strefa: "",
  kubaturaM3: "",
  wymianyPowietrzaNaH: "",
  cop: "",
  miesiace: Array(12).fill(""),
}

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

function KartaPrzegrody({ p, i, ustaw, usun }: { p: PrzegrodaSeed; i: number; ustaw: (z: Partial<PrzegrodaSeed>) => void; usun: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Pole id={`przegroda-${i}-nazwa`} label="Nazwa" value={p.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Pole
          id={`przegroda-${i}-powierzchnia`}
          label="Powierzchnia"
          unit="m²"
          type="number"
          inputMode="decimal"
          min={0}
          value={p.powierzchniaM2}
          onChange={(e) => ustaw({ powierzchniaM2: e.target.value })}
          hint="Ściany — bez okien i drzwi (te wpisz osobno)."
        />
        <Pole
          id={`przegroda-${i}-u`}
          label="Współczynnik U"
          unit="W/(m²·K)"
          type="number"
          inputMode="decimal"
          min={0}
          value={p.uWM2K}
          onChange={(e) => ustaw({ uWM2K: e.target.value })}
          hint="Z projektu, świadectwa energetycznego albo karty okna."
        />
        <PoleSelect
          id={`przegroda-${i}-strona`}
          label="Po drugiej stronie"
          value={p.zewnetrzna ? "zewnatrz" : "inna"}
          onChange={(e) => ustaw({ zewnetrzna: e.target.value === "zewnatrz" })}
        >
          <option value="zewnatrz">Powietrze zewnętrzne</option>
          <option value="inna">Grunt / nieogrzewane pomieszczenie</option>
        </PoleSelect>
        {!p.zewnetrzna && (
          <Pole
            id={`przegroda-${i}-temp`}
            label="Temperatura po drugiej stronie"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={p.temperaturaPoDrugiejStronieC}
            onChange={(e) => ustaw({ temperaturaPoDrugiejStronieC: e.target.value })}
            hint="Np. grunt pod podłogą, nieogrzewany strych lub garaż — Twoja ocena albo z projektu."
          />
        )}
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        Usuń przegrodę
      </Button>
    </div>
  )
}

export default function ObciazenieCieplnePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Seed>(KLUCZ_DRAFTU_OBCIAZENIA, STAN_POCZATKOWY)
  const ustaw = <K extends keyof Seed>(k: K, v: Seed[K]) => setStan((s) => ({ ...s, [k]: v }))
  const ustawPrzegrode = (i: number, z: Partial<PrzegrodaSeed>) => setStan((s) => ({ ...s, przegrody: s.przegrody.map((p, j) => (j === i ? { ...p, ...z } : p)) }))

  const wynik = useMemo(() => calculateObciazenieCieplne(wejscieObciazenia(stan)), [stan])
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : "uwaga"

  const kolumnyPrzegrod: Kolumna<StrataPrzegrody & { id: number }>[] = [
    { naglowek: "Przegroda", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "U·A [W/K]", render: (r) => f1(r.htWK), liczbowa: true },
    { naglowek: "Po drugiej stronie", render: (r) => `${f1(r.temperaturaPoDrugiejStronieC)} °C`, liczbowa: true },
    { naglowek: "Strata [W]", render: (r) => f0(r.strataW), liczbowa: true },
    { naglowek: "Udział", render: (r) => `${f0(r.udzialPct)}%`, liczbowa: true },
  ]
  const kolumnyMiesiecy: Kolumna<MiesiacCiepla & { id: number }>[] = [
    { naglowek: "Miesiąc", render: (r) => MIESIACE[r.miesiac - 1] },
    { naglowek: "Średnia temp.", render: (r) => `${f1(r.temperaturaSredniaC)} °C`, liczbowa: true },
    { naglowek: "Ciepło [kWh]", render: (r) => f0(r.cieploKwh), liczbowa: true },
    { naglowek: "Prąd [kWh]", render: (r) => (r.energiaElektrycznaKwh === null ? "—" : f0(r.energiaElektrycznaKwh)), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/obciazenie-cieplne" />
      <NaglowekEkranu tytul="Straty ciepła budynku">
        Ile ciepła ucieka przez ściany, okna, dach i podłogę oraz z wymienianym powietrzem w najzimniejszy dzień — to moc,
        którą musi dać ogrzewanie. W off-gridzie od tej liczby zależy, ile prądu albo paliwa potrzebujesz zimą. Moduł 6,
        Ekran 1.
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">1. Temperatury i powietrze</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PoleSelect label="Strefa klimatyczna" value={stan.strefa} onChange={(e) => ustaw("strefa", e.target.value)} hint="Z mapy stref klimatycznych Polski (PN-82/B-02403 / PN-EN 12831).">
            <option value="">— wybierz —</option>
            {STREFY_KLIMATYCZNE.map((s) => (
              <option key={s} value={s}>
                Strefa {RZYMSKIE[s]} ({TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C[s]} °C)
              </option>
            ))}
          </PoleSelect>
          <Pole
            label="Temperatura w domu"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaWewnetrznaC}
            onChange={(e) => ustaw("temperaturaWewnetrznaC", e.target.value)}
            hint="Jaką chcesz utrzymać zimą."
          />
          <Pole
            label="Kubatura ogrzewana"
            unit="m³"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.kubaturaM3}
            onChange={(e) => ustaw("kubaturaM3", e.target.value)}
            hint="Powierzchnia × wysokość pomieszczeń."
          />
          <Pole
            label="Wymiany powietrza"
            unit="1/h"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.wymianyPowietrzaNaH}
            onChange={(e) => ustaw("wymianyPowietrzaNaH", e.target.value)}
            hint="Nieszczelności + wentylacja bez odzysku. Wynik testu szczelności albo od projektanta."
          />
          <Pole
            label="COP ogrzewania (opcjonalnie)"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.cop}
            onChange={(e) => ustaw("cop", e.target.value)}
            hint="Grzałka, kocioł elektryczny: 1. Pompa ciepła: z karty albo z ekranu „COP pompy ciepła”."
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Przegrody</h2>
        {stan.przegrody.map((p, i) => (
          <KartaPrzegrody key={i} p={p} i={i} ustaw={(z) => ustawPrzegrode(i, z)} usun={() => setStan((s) => ({ ...s, przegrody: s.przegrody.filter((_, j) => j !== i) }))} />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, przegrody: [...s.przegrody, nowaPrzegroda("")] }))}>
          + Dodaj przegrodę
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">3. Miesiące (opcjonalnie)</h2>
        <p className="text-small text-muted-foreground">
          Średnia temperatura miesięcy, dla których chcesz znać ilość ciepła — wstaw z danych PVGIS albo wpisz sam. Puste
          miesiące są pomijane.
        </p>
        <TemperaturyZPvgis onWstaw={(temperatury) => ustaw("miesiace", temperatury.map((t) => t.toFixed(1)))} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MIESIACE.map((m, i) => (
            <Pole
              key={m}
              id={`miesiac-${i}`}
              label={m}
              unit="°C"
              type="number"
              inputMode="decimal"
              value={stan.miesiace[i] ?? ""}
              onChange={(e) => ustaw("miesiace", stan.miesiace.map((x, j) => (j === i ? e.target.value : x)))}
            />
          ))}
        </div>
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
          Wybierz strefę, wpisz temperaturę w domu, kubaturę, wymiany powietrza oraz powierzchnię i U każdej przegrody (a dla
          przegród przy gruncie lub nieogrzewanym pomieszczeniu — temperaturę po drugiej stronie).
        </p>
      )}
      {v && (
        <WerdyktPanel poziom={poziom} etykieta={`Straty ciepła przy ${v.temperaturaZewnetrznaC} °C`}>
          <WynikGlowny>{f1(v.obciazenieW / 1000)} kW</WynikGlowny>
          <p className="mt-1 text-small">
            Przez przegrody {f0(v.strataPrzenikanieW)} W, z wymienianym powietrzem {f0(v.strataWentylacjaW)} W. W najzimniejszą
            dobę to <strong>{f0(v.cieploDobaObliczeniowaKwh)} kWh ciepła</strong>
            {v.energiaElektrycznaDobaKwh !== null && (
              <>
                {" "}— przy COP {stan.cop} ok. <strong>{f0(v.energiaElektrycznaDobaKwh)} kWh prądu</strong>
              </>
            )}
            .
          </p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumnyPrzegrod} wiersze={v.przegrody.map((p, i) => ({ ...p, id: i }))} minWidth={480} />
          </div>
          {v.miesiace && (
            <div className="mt-3">
              <p className="text-small font-medium">Ciepło w miesiącach: razem {f0(v.cieploSumaMiesiecyKwh!)} kWh</p>
              <KartaPorownawcza kolumny={kolumnyMiesiecy} wiersze={v.miesiace.map((m) => ({ ...m, id: m.miesiac }))} minWidth={320} />
            </div>
          )}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} />
          <p className="mt-2 text-small">
            Dalej:{" "}
            <Link href="/kalkulatory/zapotrzebowanie-co-cwu" className="underline">
              ciepło na dobę z C.W.U.
            </Link>
            ,{" "}
            <Link href="/kalkulatory/koszty-ogrzewania" className="underline">
              czym najtaniej grzać
            </Link>
            ,{" "}
            <Link href="/kalkulatory/liczba-paneli" className="underline">
              ile paneli na zimę
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}

      <MigawkaBox>„O co chodzi? Dom zimą to wiadro z dziurami — ogrzewanie musi dolewać tyle, ile wycieka.”</MigawkaBox>
    </main>
  )
}
