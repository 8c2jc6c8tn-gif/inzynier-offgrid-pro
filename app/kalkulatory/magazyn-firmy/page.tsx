"use client"

import Link from "next/link"
import { useMemo } from "react"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { isComputed } from "@/lib/core/calc-result"
import { calculateOplacalnoscMagazynu } from "@/lib/core/modules/baterie/oplacalnosc-magazynu/calculator"
import { calculateStrumienieBess, type IdStrumienia } from "@/lib/core/modules/siec/strumienie-bess/calculator"
import type { GrupaMocy } from "@/lib/core/modules/siec/strumienie-bess/input"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { StanLadowania } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, poziomWerdyktu, zl } from "@/components/siec/wspolne"

/** Draft of M4/E23 „Analiza opłacalności magazynu” — read-only echo (same field names). */
type StanE23 = { cenaBateriiZl: string; pojemnoscUzytecznaKwh: string; liczbaCykli: string; sprawnoscPct: string }

type Stan = {
  grupa: GrupaMocy
  autoKwh: string
  autoZysk: string
  arbKwh: string
  arbZysk: string
  mocowaKwh: string
  mocUmowna: string
}
const POCZATKOWY: Stan = { grupa: "C1x", autoKwh: "", autoZysk: "", arbKwh: "", arbZysk: "", mocowaKwh: "", mocUmowna: "" }

const NAZWA: Record<IdStrumienia, string> = {
  autokonsumpcja: "Autokonsumpcja nadwyżek PV",
  arbitraz: "Arbitraż cenowy",
  mocowa: "Opłata mocowa (poza 7:00–22:00)",
  mocUmowna: "Opłaty za moc umowną i przekroczenia",
}

/**
 * M14 — F7 „Magazyn (BESS) — strumienie korzyści” (echo M4/E23), Wzorzec D + G. The cost of one
 * cycled kWh comes from the E23 draft (user's price); every stream value is a user entry, except
 * the capacity charge ✅ from the data file. No BESS prices from the source material (🔎B).
 */
export default function MagazynFirmyPage() {
  const [stan, setStan] = usePersistedDraft<Stan>("siec-magazyn-firmy", POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))
  const { dane: e23, wczytano } = useOdczytDraftu<StanE23>("oplacalnosc-magazynu")

  const echo = useMemo(() => {
    if (!e23) return null
    const r = calculateOplacalnoscMagazynu({
      cenaBateriiZl: liczba(e23.cenaBateriiZl),
      pojemnoscUzytecznaKwh: liczba(e23.pojemnoscUzytecznaKwh),
      liczbaCykli: liczba(e23.liczbaCykli),
      sprawnoscPct: liczba(e23.sprawnoscPct),
      kosztAlternatywyZlZaKwh: null,
    })
    return isComputed(r.status) ? { koszt: r.value.kosztZaKwh, cena: liczba(e23.cenaBateriiZl) } : null
  }, [e23])

  const result = useMemo(
    () =>
      calculateStrumienieBess({
        dataRozliczenia: DANE_ROZLICZEN.stanNa,
        grupa: stan.grupa,
        kosztCykluZlKwh: echo?.koszt ?? null,
        cenaMagazynuZl: echo?.cena ?? null,
        autokonsumpcjaKwhRok: liczba(stan.autoKwh),
        autokonsumpcjaZyskZlKwh: liczbaLubNull(stan.autoZysk),
        arbitrazKwhRok: liczba(stan.arbKwh),
        arbitrazZyskZlKwh: liczbaLubNull(stan.arbZysk),
        mocowaKwhRok: liczba(stan.mocowaKwh),
        mocUmownaZlRok: liczbaLubNull(stan.mocUmowna),
      }),
    [stan, echo],
  )
  if (!wczytano) return <StanLadowania linie={6} />
  const v = result.value

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/magazyn-firmy" />
      <NaglowekEkranu tytul="Magazyn energii (BESS) w firmie — strumienie korzyści">
        Magazyn zarabia na pięć sposobów, ale nie każdy jest dostępny dla Twojej firmy. Każdy strumień porównujemy z kosztem zużycia
        magazynu na 1 kWh z „Analizy opłacalności magazynu” (Moduł 4). M14 „Firma – sieć”, ekran F7.
      </NaglowekEkranu>

      <p className="text-small">
        Koszt 1 kWh z magazynu:{" "}
        {echo ? (
          <strong>{echo.koszt.toFixed(2)} zł/kWh</strong>
        ) : (
          <span className="text-muted-foreground">jeszcze nie policzony</span>
        )}{" "}
        —{" "}
        <Link className="underline" href="/kalkulatory/oplacalnosc-magazynu">
          {echo ? "zmień cenę, pojemność, cykle" : "policz go z cen ofert"} →
        </Link>
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">1. Autokonsumpcja nadwyżek PV</h2>
        <div className="grid grid-cols-2 gap-3">
          <Pole label="Energia przez magazyn" unit="kWh/rok" type="number" inputMode="decimal" value={stan.autoKwh} onChange={(e) => ustaw({ autoKwh: e.target.value })} />
          <Pole label="Zysk na 1 kWh" unit="zł/kWh" type="number" inputMode="decimal" value={stan.autoZysk} onChange={(e) => ustaw({ autoZysk: e.target.value })} hint="Cena zakupu − wartość oddanej kWh, bez opłaty mocowej." />
        </div>
        <Link className="text-small underline" href="/kalkulatory/pv-w-firmie">
          Ile nadwyżki masz — PV w firmie →
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Arbitraż cenowy</h2>
        <p className="text-small text-muted-foreground">Ładowanie z sieci w tanich godzinach i zużycie w drogich — ma sens przy cenie dynamicznej albo strefowej.</p>
        <div className="grid grid-cols-2 gap-3">
          <Pole label="Energia przez magazyn" unit="kWh/rok" type="number" inputMode="decimal" value={stan.arbKwh} onChange={(e) => ustaw({ arbKwh: e.target.value })} />
          <Pole label="Różnica cen" unit="zł/kWh" type="number" inputMode="decimal" value={stan.arbZysk} onChange={(e) => ustaw({ arbZysk: e.target.value })} hint="Drogie − tanie godziny, bez opłaty mocowej." />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">3. Opłata mocowa</h2>
        <Pole
          label="Z tego oddane w dni robocze 7:00–22:00"
          unit="kWh/rok"
          type="number"
          inputMode="decimal"
          value={stan.mocowaKwh}
          onChange={(e) => ustaw({ mocowaKwh: e.target.value })}
          hint="Energia z magazynu, której nie pobierzesz z sieci w godzinach opłaty mocowej."
        />
        <Link className="text-small underline" href="/kalkulatory/oplata-mocowa">
          Opłata mocowa — przesunięcie poboru →
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">4. Opłaty za moc umowną</h2>
        <PoleSelect label="Grupa taryfowa" value={stan.grupa} onChange={(e) => ustaw({ grupa: e.target.value as GrupaMocy })}>
          <option value="C1x">C11 / C12a / C12b (do 40 kW)</option>
          <option value="C2x">C21 / C22a / C22b (powyżej 40 kW)</option>
        </PoleSelect>
        <Pole label="Oszczędność na mocy umownej i przekroczeniach" unit="zł/rok" type="number" inputMode="decimal" value={stan.mocUmowna} onChange={(e) => ustaw({ mocUmowna: e.target.value })} hint="Z kalkulatora mocy umownej; puste = nie liczymy." />
        <Link className="text-small underline" href="/kalkulatory/moc-umowna">
          Moc umowna — przekroczenia →
        </Link>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="font-semibold">5. Usługi systemowe</h2>
        <p className="text-small text-muted-foreground">
          Rynek bilansujący i rynek mocy — dla małych magazynów praktycznie niedostępne bez agregatora. Tylko informacja, bez kwoty.
        </p>
      </section>

      {result.status === "INCOMPLETE" || result.status === "INVALID_INPUT" || !v ? (
        <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta="Uzupełnij dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"} etykieta="Bilans roczny magazynu">
          <WynikGlowny>
            {v.bilansRokZl >= 0 ? `+${zl(v.bilansRokZl)} rocznie` : `${zl(v.bilansRokZl)} rocznie — magazyn się nie zwraca`}
          </WynikGlowny>
          <table className="mt-2 w-full text-small tabular-nums">
            <tbody>
              {v.strumienie.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-1">{NAZWA[s.id]}</td>
                  <td className="py-1 text-right">{zl(s.korzyscRokZl)}</td>
                </tr>
              ))}
              <tr className="border-t">
                <td className="py-1">Zużycie magazynu</td>
                <td className="py-1 text-right">−{zl(v.kosztZuzyciaRokZl)}</td>
              </tr>
            </tbody>
          </table>
          {v.prostyZwrotLat !== null && (
            <p className="mt-2 text-small">Prosty zwrot ceny magazynu z korzyści: {v.prostyZwrotLat.toFixed(1)} roku (bez dyskonta i zmian cen).</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
