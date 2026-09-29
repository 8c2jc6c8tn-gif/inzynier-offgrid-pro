"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBilansMiesieczny } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import { calculateAgregatPradotworczy } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
  type BezpieczenstwoAgregatuStan,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"
import { liczba, poziomWerdyktu, zl } from "@/components/siec/wspolne"
import { useDaneBilansu, wejscieBilansu } from "@/components/siec/pv-magazyn"
import { MIESIACE_KROTKO } from "@/components/siec/zuzycie-miesieczne"

type Stan = BezpieczenstwoAgregatuStan & { moc: string; zuzycieLH: string; cena: string; bms: boolean }

const POCZATKOWY: Stan = { moc: "", zuzycieLH: "", cena: "", bms: false, miejsceAgregatu: "", podlaczenieAgregatu: "" }
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/**
 * M14 — D6 „Agregat jako zapas” (pochodny, Wzorzec D). Echo of M2/E17 „Agregat prądotwórczy”
 * (the same engine and the same D48 safety block) fed with the worst-month shortfall of the
 * island balance (D4 installation without the grid) — no second generator model.
 */
export default function AgregatJakoZapasPage() {
  const { zuzycie, pv, wczytano } = useDaneBilansu("dom")
  const [stan, setStan] = usePersistedDraft<Stan>("siec-agregat-dom", POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))

  const bilans = useMemo(() => {
    const w = wejscieBilansu(pv, zuzycie, "wyspa")
    return w ? calculateBilansMiesieczny(w).value : null
  }, [pv, zuzycie])
  const m = bilans?.najgorszyMiesiac ?? null
  const deficyt = m === null || !bilans ? 0 : bilans.miesiace[m].niedoborKwh

  const result = useMemo(
    () =>
      calculateAgregatPradotworczy({
        deficytKwh: deficyt,
        mocAgregatuKw: liczba(stan.moc),
        sredniZuzycieLH: liczba(stan.zuzycieLH),
        cenaZaLitrZl: liczba(stan.cena),
        maWyjscieSterujaceBms: stan.bms,
        ...naWejscieBezpieczenstwa(stan),
      }),
    [deficyt, stan],
  )
  if (!wczytano) return <StanLadowania linie={6} />
  const poziom = poziomWerdyktu(result.status, result.warnings)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/agregat-jako-zapas" />
      <NaglowekEkranu tytul="Agregat jako zapas" ekran="agregat-jako-zapas" wzor={result.formula}>
        Ile godzin i paliwa potrzeba, żeby agregat pokrył niedobór najgorszego miesiąca bez sieci — i jak go bezpiecznie
        podłączyć. Ten sam silnik co ekran „Agregat prądotwórczy” (Moduł 2). M14 „Dom – sieć”, ekran D6.
      </NaglowekEkranu>

      {!bilans ? (
        <StanPusty tytul="Najpierw policz zimę bez sieci">
          <Link className="underline" href="/kalkulatory/zima-bez-sieci">
            Zima bez sieci →
          </Link>
        </StanPusty>
      ) : m === null ? (
        <WerdyktPanel poziom="ok" etykieta="Bez niedoboru">
          <p className="text-small">W bilansie miesięcznym nie brakuje energii w żadnym miesiącu. Seria pochmurnych dni i tak może wymagać zapasu — sprawdź stress-test zimowy (Moduł 7).</p>
        </WerdyktPanel>
      ) : (
        <p className="text-small">
          Najgorszy miesiąc bez sieci: <strong>{MIESIACE_KROTKO[m]}</strong>, brakuje {f1(deficyt)} kWh.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc agregatu"
          unit="kW"
          type="number"
          inputMode="decimal"
          value={stan.moc}
          onChange={(e) => ustaw({ moc: e.target.value })}
          pomoc={<PomocPola ekran="agregat-jako-zapas" pole="moc" />}
        />
        <Pole
          label="Zużycie paliwa przy obciążeniu 80%"
          unit="l/h"
          type="number"
          inputMode="decimal"
          value={stan.zuzycieLH}
          onChange={(e) => ustaw({ zuzycieLH: e.target.value })}
          pomoc={<PomocPola ekran="agregat-jako-zapas" pole="paliwo" />}
        />
        <Pole
          label="Cena paliwa"
          unit="zł/l"
          type="number"
          inputMode="decimal"
          value={stan.cena}
          onChange={(e) => ustaw({ cena: e.target.value })}
          pomoc={<PomocPola ekran="agregat-jako-zapas" pole="cenaPaliwa" />}
        />
        <PoleCheckbox id="siec-agregat-bms" checked={stan.bms} onChange={(e) => ustaw({ bms: e.target.checked })} label="BMS / falownik ma wyjście do automatycznego startu agregatu" />
        <PolaBezpieczenstwaAgregatu miejsceAgregatu={stan.miejsceAgregatu} podlaczenieAgregatu={stan.podlaczenieAgregatu} onChange={ustaw} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        result.warnings.length > 0 && (
          <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta="Bezpieczeństwo agregatu">
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        )
      ) : (
        <WerdyktPanel poziom={poziom ?? "ok"} etykieta={`Agregat w miesiącu ${m === null ? "" : MIESIACE_KROTKO[m]}`}>
          <WynikGlowny>{f1(result.value.godzinyPracy)} h pracy</WynikGlowny>
          <p className="mt-1 text-small">
            Paliwo {f1(result.value.zuzyciePaliwaLitry)} l, koszt {zl(result.value.kosztZl)}. Przełącznik sieć/wyspa i
            agregat:{" "}
            <Link className="underline" href="/kalkulatory/przelacznik-siec-wyspa">
              bezpieczeństwo styku →
            </Link>
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
