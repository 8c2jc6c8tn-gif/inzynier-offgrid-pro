"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateRegulowany, type MiesiacRegulowany } from "@/lib/core/modules/pv/typ-montazu/regulowany"
import {
  BledyDanych,
  f0,
  f1,
  f2,
  MIESIACE,
  n,
  PoleAzymutu,
  PolaStelaza,
  PolaWiatru,
  poziomZOstrzezen,
  STELAZ_PUSTY,
  stelazZSeeda,
  useTabelaNapromieniowania,
  WIATR_PUSTY,
  wiatrZSeeda,
  type StelazSeed,
  type WiatrSeed,
} from "./wspolne"

type Seed = { azymutDeg: string; katMinDeg: string; katMaxDeg: string; stelaz: StelazSeed; wiatr: WiatrSeed }
const PUSTY: Seed = { azymutDeg: "", katMinDeg: "", katMaxDeg: "", stelaz: STELAZ_PUSTY, wiatr: WIATR_PUSTY }

type Wiersz = MiesiacRegulowany & { id: number }
const KOLUMNY: Kolumna<Wiersz>[] = [
  { naglowek: "Miesiąc", render: (r) => MIESIACE[r.miesiac] },
  { naglowek: "Kąt", render: (r) => `${r.katDeg}°`, liczbowa: true },
  { naglowek: "Podniesienie", render: (r) => `${f2(r.podniesienieM)} m`, liczbowa: true },
  { naglowek: "Wiatr", render: (r) => (r.silaWiatruN === null ? "brak danych" : `${f0(r.silaWiatruN)} N`) },
  { naglowek: "Balast", render: (r) => (r.balastKg === null ? "—" : `${f0(r.balastKg)} kg`) },
]

export function TrybRegulowany() {
  const [s, setS] = usePersistedDraft<Seed>("typ-montazu-regulowany", PUSTY)
  const tab = useTabelaNapromieniowania(s.azymutDeg)
  const wynik = useMemo(
    () =>
      calculateRegulowany({
        tabela: tab.tabela,
        ...wiatrZSeeda(s.wiatr, tab.wysokoscPvgis),
        ...stelazZSeeda(s.stelaz),
        katMinDeg: n(s.katMinDeg),
        katMaxDeg: n(s.katMaxDeg),
      }),
    [tab.tabela, tab.wysokoscPvgis, s],
  )
  const v = wynik.value

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        Stelaż naziemny, któremu co jakiś czas ręcznie zmieniasz kąt — zimą stromiej, latem płasko. Aplikacja wybiera kąt na
        każdy miesiąc w granicach, na jakie pozwala Twój stelaż, i pokazuje, co to znaczy dla konstrukcji: jak wysoko
        podnosi się krawędź i ile balastu trzeba w najgorszym ustawieniu. Sam zysk energii bez konstrukcji pokazuje też{" "}
        <Link href="/kalkulatory/kat-i-azymut" className="underline">
          Ekran 1 (kąt i azymut)
        </Link>
        .
      </p>
      <PoleAzymutu wartosc={s.azymutDeg} ustaw={(x) => setS((p) => ({ ...p, azymutDeg: x }))} tab={tab} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Pole
          label="Najmniejszy kąt regulacji"
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={s.katMinDeg}
          onChange={(e) => setS((p) => ({ ...p, katMinDeg: e.target.value }))}
        />
        <Pole
          label="Największy kąt regulacji"
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={s.katMaxDeg}
          onChange={(e) => setS((p) => ({ ...p, katMaxDeg: e.target.value }))}
          hint="Do 30° norma podaje siłę wiatru — powyżej balastu nie policzymy."
        />
      </div>
      <PolaStelaza
        s={s.stelaz}
        ustaw={(pole, x) => setS((p) => ({ ...p, stelaz: { ...p.stelaz, [pole]: x } }))}
        podpowiedzKrawedzi="Stała przy każdym kącie — stelaż obraca się na dolnej krawędzi."
      />
      <PolaWiatru s={s.wiatr} ustaw={(pole, x) => setS((p) => ({ ...p, wiatr: { ...p.wiatr, [pole]: x } }))} wysokoscPvgis={tab.wysokoscPvgis} />

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">Policz nasłonecznienie i uzupełnij zakres regulacji, wymiary stelaża i dane wiatru.</p>}
      {v && (
        <WerdyktPanel poziom={poziomZOstrzezen(wynik.warnings)} etykieta={`Regulacja co miesiąc vs stały kąt ${v.katStalyDeg}°`}>
          <WynikGlowny>+{f1(v.zyskRegulacjiPct)}% nasłonecznienia</WynikGlowny>
          <ul className="mt-2 space-y-1 text-small">
            <li>
              Rocznie {f0(v.napromieniowanieRegulowaneKwhM2)} kWh/m² z regulacją, {f0(v.napromieniowanieStaleKwhM2)} kWh/m² przy stałym {v.katStalyDeg}°.
            </li>
            <li className="font-medium">
              {v.balastWymaganyKg === null
                ? "Balast: brak danych normowych dla żadnego z ustawień."
                : `Balast projektowy (PN-EN 1990, przeciw oderwaniu) dla najgorszego ustawienia${v.liczbaMiesiecyBezDanychWiatru > 0 ? " do 30°" : ""}: ${f0(v.balastWymaganyKg)} kg.`}
            </li>
          </ul>
          <div className="mt-3">
            <KartaPorownawcza kolumny={KOLUMNY} wiersze={v.miesiace.map((m) => ({ ...m, id: m.miesiac }))} minWidth={420} />
          </div>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
    </div>
  )
}
