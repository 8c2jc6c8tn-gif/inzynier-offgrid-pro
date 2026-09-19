"use client"

import { useMemo, useState } from "react"
import { calculateSprawnoscInwertera } from "@/lib/core/modules/zapotrzebowanie/sprawnosc-inwertera-niskie-obciazenie/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

export default function SprawnoscInwerteraPage() {
  const t = useTranslate()
  const [zapotrzebowanieW, setZapotrzebowanieW] = useState("")
  const [mocFalownikaW, setMocFalownikaW] = useState("")
  const [sprawnoscPct, setSprawnoscPct] = useState("")

  const result = useMemo(
    () =>
      calculateSprawnoscInwertera({
        zapotrzebowanieW: zapotrzebowanieW === "" ? 0 : Number(zapotrzebowanieW),
        mocFalownikaW: mocFalownikaW === "" ? 0 : Number(mocFalownikaW),
        sprawnoscPct: sprawnoscPct === "" ? 0 : Number(sprawnoscPct),
      }),
    [zapotrzebowanieW, mocFalownikaW, sprawnoscPct],
  )

  const poziom = result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sprawnosc-inwertera-niskie-obciazenie" />
      <NaglowekEkranu tytul="Sprawność inwertera przy niskim obciążeniu">
        Za duży falownik względem realnego obciążenia to trochę jak jazda autem na najwyższym
        biegu w mieście — silnik pracuje, ale nieefektywnie. Moduł 2, Ekran 10.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Bieżące zapotrzebowanie"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieW}
          onChange={(e) => setZapotrzebowanieW(e.target.value)}
        />
        <Pole
          label="Znamionowa moc falownika"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocFalownikaW}
          onChange={(e) => setMocFalownikaW(e.target.value)}
        />
        <Pole
          label="Sprawność falownika przy tym obciążeniu"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscPct}
          onChange={(e) => setSprawnoscPct(e.target.value)}
          hint="Z karty katalogowej/krzywej producenta — typowo ~95% przy 40-80% obciążenia, spada do 70-80% poniżej 10%."
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta="Rzeczywiste zużycie z baterii">
          <WynikGlowny>{result.value.realneZuzycieW.toFixed(0)} W</WynikGlowny>
          <p className="mt-1 text-small text-muted-foreground">
            Obciążenie falownika: {result.value.obciazenieFalownikaPct.toFixed(1)}% · strata na
            sprawności: +{result.value.strataPct.toFixed(1)}%
          </p>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
