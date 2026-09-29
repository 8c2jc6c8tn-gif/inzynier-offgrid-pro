"use client"

import { useMemo } from "react"
import { calculateOplataMocowa } from "@/lib/core/modules/siec/oplata-mocowa/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, nadpisanie, poziomWerdyktu, zl } from "@/components/siec/wspolne"

type Stan = { roczna: string; wGodzinach: string; przesuniecie: string; stawka: string }

export default function OplataMocowaPage() {
  const [stan, setStan] = usePersistedDraft<Stan>("siec-oplata-mocowa", { roczna: "", wGodzinach: "", przesuniecie: "0", stawka: "" })
  const ustaw = <K extends keyof Stan>(pole: K, v: string) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateOplataMocowa({
        dataRozliczenia: "2026-12-31",
        energiaRocznaKwh: liczba(stan.roczna),
        energiaWGodzinachKwh: liczbaLubNull(stan.wGodzinach),
        przesuniecieProcent: liczba(stan.przesuniecie),
        stawkaWlasnaZlKwh: nadpisanie(stan.stawka),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oplata-mocowa" />
      <NaglowekEkranu tytul="Opłata mocowa — przesunięcie poboru" ekran="oplata-mocowa" wynik={result}>
        W firmie opłata mocowa to 0,2194 zł/kWh netto za energię pobraną w dni robocze 7:00–22:00 (2026). Zobacz, ile
        daje przesunięcie części poboru poza te godziny — produkcja, ładowanie aut, pompa ciepła z buforem, magazyn. M14
        „Firma – sieć”, ekran F5.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Energia pobrana w roku"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={stan.roczna}
          onChange={(e) => ustaw("roczna", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="energiaRok" />}
        />
        <Pole
          label="W tym w dni robocze 7:00–22:00"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={stan.wGodzinach}
          onChange={(e) => ustaw("wGodzinach", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="energiaSzczyt" />}
        />
        <Pole
          label="Ile z tego przesuniesz poza te godziny"
          unit="%"
          type="number"
          inputMode="decimal"
          value={stan.przesuniecie}
          onChange={(e) => ustaw("przesuniecie", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="przesuniecie" />}
        />
        <Pole
          label="Stawka z faktury (opcjonalnie)"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          value={stan.stawka}
          onChange={(e) => ustaw("stawka", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="stawka" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz energię roczną i energię w godzinach 7–22.</p>
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta="Opłata mocowa w roku">
          <WynikGlowny>{zl(v.oplataRokZl)} netto / rok</WynikGlowny>
          <p className="mt-1 text-small">
            {v.udzialProcent.toLocaleString("pl-PL", { maximumFractionDigits: 1 })}% energii pobierasz w godzinach opłaty
            mocowej. Po przesunięciu: {zl(v.oplataPoPrzesunieciuZl)} / rok, oszczędność {zl(v.oszczednoscRokZl)}.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
