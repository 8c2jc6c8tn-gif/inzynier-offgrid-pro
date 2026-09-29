"use client"

import { useMemo } from "react"
import { calculateMocUmowna } from "@/lib/core/modules/siec/moc-umowna/calculator"
import type { WariantPomiaru } from "@/lib/core/modules/siec/moc-umowna/input"
import type { Grupa, OsdId } from "@/lib/core/dane/rozliczenia-pl-2026"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { GRUPY_FIRMA, PoleOsd, liczba, nadpisanie, poziomWerdyktu, zl } from "@/components/siec/wspolne"

const MIESIACE = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]

type Stan = {
  osd: OsdId
  grupa: Grupa
  moc: string
  stala: string
  wariant: WariantPomiaru
  maksy: string[]
}

export default function MocUmownaPage() {
  const [stan, setStan] = usePersistedDraft<Stan>("siec-moc-umowna", {
    osd: "tauron",
    grupa: "C21",
    moc: "",
    stala: "",
    wariant: "suma10",
    maksy: Array(12).fill(""),
  })
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateMocUmowna({
        osd: stan.osd,
        grupa: stan.grupa,
        dataRozliczenia: "2026-12-31",
        mocUmownaKw: liczba(stan.moc),
        stalaZlKwMiesWlasna: nadpisanie(stan.stala),
        wariantPomiaru: stan.wariant,
        // 🔎 TD22: no fields for the 10 largest values yet — variant "suma10" gives an upper estimate.
        miesiace: stan.maksy.map((m) => ({ maksKw: m === "" ? null : Number(m), dziesiecNajwiekszychKw: null })),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/moc-umowna" />
      <NaglowekEkranu tytul="Moc umowna — przekroczenia i optymalny poziom">
        Ile kosztują przekroczenia mocy umownej i przy jakiej mocy umownej suma opłaty stałej i przekroczeń jest najniższa.
        Zasady opłaty jak w taryfach OSD 2026. M14 „Firma – sieć”, ekran F4.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleOsd value={stan.osd} onChange={(osd) => ustaw("osd", osd)} />
        <PoleSelect label="Grupa taryfowa" value={stan.grupa} onChange={(e) => ustaw("grupa", e.target.value as Grupa)}>
          {GRUPY_FIRMA.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </PoleSelect>
        <Pole label="Obecna moc umowna" unit="kW" type="number" inputMode="decimal" value={stan.moc} onChange={(e) => ustaw("moc", e.target.value)} />
        <Pole
          label="Składnik stały stawki sieciowej (opcjonalnie, z faktury)"
          unit="zł/kW/mies."
          type="number"
          inputMode="decimal"
          value={stan.stala}
          onChange={(e) => ustaw("stala", e.target.value)}
          hint="Puste pole = stawka z taryfy 2026 wybranego OSD."
        />
        <PoleSelect
          label="Jak licznik mierzy przekroczenia"
          value={stan.wariant}
          onChange={(e) => ustaw("wariant", e.target.value as WariantPomiaru)}
          hint="Sprawdź na fakturze albo zapytaj OSD. Przy „10 największych” bez tych 10 wartości liczymy górne oszacowanie."
        >
          <option value="suma10">suma 10 największych nadwyżek (pomiar 15-minutowy)</option>
          <option value="10xmax">10 × największa nadwyżka</option>
        </PoleSelect>
        <fieldset className="grid grid-cols-3 gap-3 rounded-md border p-3">
          <legend className="px-1 text-small font-medium">Maksymalna moc w miesiącu [kW] (z faktur)</legend>
          {MIESIACE.map((m, i) => (
            <Pole
              key={m}
              label={m}
              type="number"
              inputMode="decimal"
              value={stan.maksy[i] ?? ""}
              onChange={(e) => ustaw("maksy", stan.maksy.map((x, j) => (j === i ? e.target.value : x)))}
            />
          ))}
        </fieldset>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        result.warnings.length > 0 ? (
          <WerdyktPanel poziom="uwaga" etykieta="Brakuje danych">
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : (
          <p className="text-small text-muted-foreground">Wpisz moc umowną i maksima z miesięcy.</p>
        )
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta="Koszt mocy umownej w roku">
          <WynikGlowny>{zl(v.kosztRazemRokZl)} netto / rok</WynikGlowny>
          <p className="mt-1 text-small">
            Opłata stała {zl(v.kosztStalyRokZl)} + przekroczenia {zl(v.oplataPrzekroczenRokZl)}.
          </p>
          <p className="mt-1 text-small font-medium">
            Najniższy koszt przy {v.optymalnaMocKw} kW: {zl(v.kosztOptymalnyRokZl)} / rok
            {v.kosztOptymalnyRokZl < v.kosztRazemRokZl && <> (mniej o {zl(v.kosztRazemRokZl - v.kosztOptymalnyRokZl)})</>}.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
