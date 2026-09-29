"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculatePrzelacznik } from "@/lib/core/modules/siec/przelacznik-siec-wyspa/calculator"
import type { RodzajPrzelacznika, TrybPracy } from "@/lib/core/modules/siec/przelacznik-siec-wyspa/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import {
  type BezpieczenstwoAgregatuStan,
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { KrokZMedia } from "@/components/wzorce/krok-z-media"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { poziomWerdyktu } from "@/components/siec/wspolne"

type Stan = BezpieczenstwoAgregatuStan & {
  trybPracy: TrybPracy | ""
  przelacznik: RodzajPrzelacznika | ""
  przelaczaN: "" | "tak" | "nie"
  zgloszenieOsd: "" | "tak" | "nie"
  maAgregat: boolean
}

const POCZATKOWY: Stan = {
  trybPracy: "",
  przelacznik: "",
  przelaczaN: "",
  zgloszenieOsd: "",
  maAgregat: false,
  miejsceAgregatu: "",
  podlaczenieAgregatu: "",
}

const takNie = (s: "" | "tak" | "nie") => (s === "" ? null : s === "tak")

/**
 * M14 — D11 „Przełącznik sieć/wyspa i bezpieczeństwo” (shared), Wzorzec F + E. `03_M14` §6 (D47:
 * the switch detail lives here, M8 links to it; HD 60364-5-551 🔎). Hard stops 1–3 via
 * `siec/przelacznik-siec-wyspa` (generator block = M2/E17, D48).
 */
export default function PrzelacznikSiecWyspaPage() {
  const [stan, setStan] = usePersistedDraft<Stan>("siec-przelacznik", POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))
  const result = useMemo(
    () =>
      calculatePrzelacznik({
        trybPracy: stan.trybPracy || null,
        przelacznik: stan.przelacznik || null,
        przelaczaN: takNie(stan.przelaczaN),
        zgloszenieOsd: takNie(stan.zgloszenieOsd),
        maAgregat: stan.maAgregat,
        ...naWejscieBezpieczenstwa(stan),
      }),
    [stan],
  )

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przelacznik-siec-wyspa" />
      <NaglowekEkranu tytul="Przełącznik sieć/wyspa i bezpieczeństwo">
        Instalacja wyspowa ani agregat nie mogą nigdy podać napięcia do sieci — monter na „wyłączonej” linii może zginąć. Tu
        sprawdzisz, czy styk z siecią jest bezpieczny. M14, ekran D11 (wspólny dla domu i firmy).
      </NaglowekEkranu>

      <ol className="flex flex-col gap-3">
        <KrokZMedia numer={1} tytul="Przełącznik z pozycją 0">
          Sieć – 0 – wyspa z blokadą mechaniczną albo stycznikowy układ SZR z blokadą elektryczną i mechaniczną. Pozycja 0 rozłącza
          oba źródła, zanim połączy drugie.
        </KrokZMedia>
        <KrokZMedia numer={2} tytul="Przełączane fazy i przewód neutralny N">
          Zgodnie z układem sieci w budynku. Szczegół normowy (HD 60364-5-551) jest do doprecyzowania — ustal go z elektrykiem z
          uprawnieniami.
        </KrokZMedia>
        <KrokZMedia numer={3} tytul="Agregat zawsze przez przełącznik">
          Nigdy „przez gniazdko” ani wtyczką z dwoma bolcami — to podaje napięcie na bolce wtyczki i do sieci. Agregat spalinowy tylko
          na zewnątrz albo w wydzielonym, wentylowanym miejscu (czad).
        </KrokZMedia>
        <KrokZMedia numer={4} tytul="Praca równoległa to co innego">
          Falownik pracujący równolegle z siecią (scenariusze A i B, także „zero oddawania”) to źródło przyłączone do sieci — wymaga
          zgłoszenia mikroinstalacji do OSD i certyfikatu NC RfG. Instalacja wyłącznie przełączana zwykle nie jest pracą równoległą
          (zależy od konfiguracji falownika).
        </KrokZMedia>
      </ol>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Sprawdź swoją instalację</h2>
        <PoleSelect label="Jak instalacja styka się z siecią" value={stan.trybPracy} onChange={(e) => ustaw({ trybPracy: e.target.value as Stan["trybPracy"] })}>
          <option value="">— wybierz —</option>
          <option value="przelaczany">Przełączana: sieć albo wyspa (bez synchronizacji)</option>
          <option value="rownolegle">Równolegle z siecią (falownik hybrydowy / sieciowy)</option>
          <option value="bez-sieci">Bez sieci (pełne odłączenie)</option>
        </PoleSelect>
        {stan.trybPracy === "przelaczany" && (
          <>
            <PoleSelect label="Przełącznik" value={stan.przelacznik} onChange={(e) => ustaw({ przelacznik: e.target.value as Stan["przelacznik"] })}>
              <option value="">— wybierz —</option>
              <option value="reczny-z-zerem-blokada">Ręczny sieć – 0 – wyspa z blokadą mechaniczną</option>
              <option value="szr-blokada-el-mech">SZR z blokadą elektryczną i mechaniczną</option>
              <option value="brak-lub-bez-blokady">Brak, zwykły wyłącznik albo bez blokady</option>
            </PoleSelect>
            <PoleSelect label="Czy przełączany jest też przewód N?" value={stan.przelaczaN} onChange={(e) => ustaw({ przelaczaN: e.target.value as Stan["przelaczaN"] })}>
              <option value="">nie wiem</option>
              <option value="tak">tak, fazy i N</option>
              <option value="nie">nie, tylko fazy</option>
            </PoleSelect>
          </>
        )}
        {stan.trybPracy === "rownolegle" && (
          <PoleSelect label="Mikroinstalacja zgłoszona do OSD?" value={stan.zgloszenieOsd} onChange={(e) => ustaw({ zgloszenieOsd: e.target.value as Stan["zgloszenieOsd"] })}>
            <option value="">— wybierz —</option>
            <option value="tak">tak</option>
            <option value="nie">nie</option>
          </PoleSelect>
        )}
        <PoleCheckbox id="siec-przelacznik-agregat" checked={stan.maAgregat} onChange={(e) => ustaw({ maAgregat: e.target.checked })} label="Agregat zasila instalację budynku" />
        {stan.maAgregat && (
          <PolaBezpieczenstwaAgregatu
            miejsceAgregatu={stan.miejsceAgregatu}
            podlaczenieAgregatu={stan.podlaczenieAgregatu}
            onChange={(z) => ustaw(z)}
          />
        )}
      </section>

      {result.status === "INCOMPLETE" ? (
        <WerdyktPanel poziom="uwaga" etykieta="Odpowiedz na pytania powyżej">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel
          poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"}
          etykieta={result.value.twardeStopy > 0 ? `STOP — ${result.value.twardeStopy} zagrożenie(a) życia` : "Styk z siecią bez twardych stopów"}
        >
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      <p className="text-small text-muted-foreground">
        Powiązane:{" "}
        <Link className="underline" href="/kalkulatory/agregat-pradotworczy">
          agregat prądotwórczy (Moduł 2)
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/kalkulatory/rezygnacja-z-przylacza">
          procedura rezygnacji
        </Link>
      </p>
    </main>
  )
}
