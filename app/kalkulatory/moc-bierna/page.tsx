"use client"

import { useMemo } from "react"
import { calculateMocBierna } from "@/lib/core/modules/siec/moc-bierna/calculator"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, poziomWerdyktu, zl } from "@/components/siec/wspolne"

type Stan = {
  tgFi: string
  tgFi0: string
  energiaCzynna: string
  cRk: string
  pojemnosciowa: string
  moc: string
  tgFiCel: string
  koszt: string
}

const TG_FI0 = String(DANE_ROZLICZEN.mocBierna.tgFi0Domyslny.okresy[0].wartosc)

export default function MocBiernaPage() {
  const [stan, setStan] = usePersistedDraft<Stan>("siec-moc-bierna", {
    tgFi: "",
    tgFi0: TG_FI0,
    energiaCzynna: "",
    cRk: "",
    pojemnosciowa: "",
    moc: "",
    tgFiCel: "",
    koszt: "",
  })
  const ustaw = <K extends keyof Stan>(pole: K, v: string) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateMocBierna({
        tgFi: liczbaLubNull(stan.tgFi),
        tgFi0: liczba(stan.tgFi0),
        energiaCzynnaKwh: liczba(stan.energiaCzynna),
        cRkZlKwh: liczbaLubNull(stan.cRk),
        energiaPojemnosciowaKvarh: liczba(stan.pojemnosciowa),
        mocCzynnaSredniaKw: liczba(stan.moc),
        tgFiCel: liczbaLubNull(stan.tgFiCel),
        kosztBateriiZl: liczba(stan.koszt),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/moc-bierna" />
      <NaglowekEkranu tytul="Moc bierna — opłata i kompensacja">
        Ile firma płaci za energię bierną ponad dopuszczalny tgφ₀ i czy opłaca się bateria kondensatorów. Wzór jak w
        taryfach OSD 2026 (z pierwiastkiem — wersja bez niego zawyża opłatę ok. dwukrotnie). M14 „Firma – sieć”, ekran F3.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small text-muted-foreground">
          Najpierw sprawdź, czy na fakturze masz pozycję za energię bierną. Na niskim napięciu dotyczy to tylko odbiorców, u
          których przewiduje to umowa.
        </p>
        <Pole label="Zmierzony tgφ (średni)" type="number" inputMode="decimal" value={stan.tgFi} onChange={(e) => ustaw("tgFi", e.target.value)} />
        <Pole
          label="tgφ₀ z umowy"
          type="number"
          inputMode="decimal"
          value={stan.tgFi0}
          onChange={(e) => ustaw("tgFi0", e.target.value)}
          hint="Zwykle 0,4, chyba że umowa mówi inaczej — nigdy mniej niż 0,2."
        />
        <Pole
          label="Energia czynna pobrana"
          unit="kWh/rok"
          type="number"
          inputMode="decimal"
          value={stan.energiaCzynna}
          onChange={(e) => ustaw("energiaCzynna", e.target.value)}
        />
        <Pole
          label="Cena C_rk"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          value={stan.cRk}
          onChange={(e) => ustaw("cRk", e.target.value)}
          hint="Cena ogłaszana przez Prezesa URE, z faktury za energię bierną — nie cena Twojej energii. Bez niej pokażemy tylko czynnik nadwyżki."
        />
        <Pole
          label="Energia bierna pojemnościowa (opcjonalnie)"
          unit="kvarh/rok"
          type="number"
          inputMode="decimal"
          value={stan.pojemnosciowa}
          onChange={(e) => ustaw("pojemnosciowa", e.target.value)}
        />
        <h2 className="text-base font-medium">Kompensacja (opcjonalnie)</h2>
        <Pole
          label="Średnia moc czynna w czasie pracy"
          unit="kW"
          type="number"
          inputMode="decimal"
          value={stan.moc}
          onChange={(e) => ustaw("moc", e.target.value)}
        />
        <Pole
          label="Docelowy tgφ"
          type="number"
          inputMode="decimal"
          value={stan.tgFiCel}
          onChange={(e) => ustaw("tgFiCel", e.target.value)}
          hint="Twój wybór — z zapasem poniżej tgφ₀."
        />
        <Pole
          label="Koszt baterii kondensatorów"
          unit="zł"
          type="number"
          inputMode="decimal"
          value={stan.koszt}
          onChange={(e) => ustaw("koszt", e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : stan.tgFi === "" ? (
        <p className="text-small text-muted-foreground">Wpisz tgφ, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta="Opłata za energię bierną">
          <WynikGlowny>
            {v.oplataRazemZl !== null ? `${zl(v.oplataRazemZl)} netto / rok` : `czynnik ${v.czynnik.toLocaleString("pl-PL", { maximumFractionDigits: 4 })}`}
          </WynikGlowny>
          <p className="mt-1 text-small">
            Czynnik nadwyżki: {v.czynnik.toLocaleString("pl-PL", { maximumFractionDigits: 4 })}
            {v.oplataIndukcyjnaZl !== null && <> · indukcyjna {zl(v.oplataIndukcyjnaZl)} · pojemnościowa {zl(v.oplataPojemnosciowaZl ?? 0)}</>}
          </p>
          {v.mocKompensacjiKvar !== null && (
            <p className="mt-1 text-small">
              Potrzebna moc kompensacji: {v.mocKompensacjiKvar.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} kvar
              {v.zwrotLat !== null && <>, zwrot baterii po ok. {v.zwrotLat.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} lat</>}.
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
