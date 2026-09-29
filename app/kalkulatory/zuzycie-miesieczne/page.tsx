"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBilansMiesieczny } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  MIESIACE_KROTKO,
  POCZATKOWY_ZUZYCIA,
  PolaZuzycia,
  type StanZuzycia,
  kluczZuzycia,
  zuzycieZeSzkicu,
} from "@/components/siec/zuzycie-miesieczne"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

/** M14 — D3 „Moje zużycie miesięcznie” (pochodny, Wzorzec D). Owner of `siec-zuzycie-dom`. */
export default function ZuzycieMiesiecznePage() {
  const [stan, setStan] = usePersistedDraft<StanZuzycia>(kluczZuzycia("dom"), POCZATKOWY_ZUZYCIA)
  const zuzycie = zuzycieZeSzkicu(stan)
  // Echo of the balance without PV: shortfall = consumption, so the engine gives the sum, the winter part and the peak month.
  const result = useMemo(
    () =>
      zuzycie
        ? calculateBilansMiesieczny({
            tryb: "siec",
            zuzycieMiesieczneKwh: zuzycie,
            uzyskMiesiecznyKwhNaKwp: Array(12).fill(0),
            mocPvKwp: 0,
            autokonsumpcjaBezposrednia: null,
            pojemnoscMagazynuKwh: 0,
            sprawnoscMagazynu: null,
          })
        : null,
    [zuzycie],
  )
  const v = result?.value ?? null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zuzycie-miesieczne" />
      <NaglowekEkranu tytul="Moje zużycie miesięcznie" ekran="zuzycie-miesieczne">
        Zużycie z 12 kolejnych miesięcy — z faktur albo z portalu pomiarowego Twojego OSD. Z tych liczb korzysta rachunek,
        bilans PV i magazynu, zima bez sieci i porównanie scenariuszy. M14 „Dom – sieć”, ekran D3.
      </NaglowekEkranu>
      <PolaZuzycia stan={stan} onChange={setStan} />
      <p className="text-small text-muted-foreground">
        Faktura za 2 miesiące? Podziel ją według odczytów z portalu OSD, a nie po równo — zima i lato różnią się
        naprawdę. Masz pompę ciepła albo grzanie prądem? Wpisz rzeczywiste zimowe zużycie (Moduł 6).
      </p>
      {!v || !result ? (
        <StanPusty tytul="Wpisz wszystkie 12 miesięcy — aplikacja nie dopowiada brakujących." />
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Zużycie roczne">
          <WynikGlowny>{f0(v.zuzycieRokKwh)} kWh / rok</WynikGlowny>
          <p className="mt-1 text-small">
            Najwięcej w miesiącu: {v.najgorszyMiesiac === null ? "—" : MIESIACE_KROTKO[v.najgorszyMiesiac]}. Grudzień i
            styczeń razem: {f0(v.niedoborZimaKwh)} kWh ({Math.round((v.niedoborZimaKwh / v.zuzycieRokKwh) * 100)}% roku) —
            to te miesiące decydują o scenariuszu bez sieci.
          </p>
          <p className="mt-2 text-small">
            Dalej:{" "}
            <Link className="underline" href="/kalkulatory/rachunek-dom">
              Mój rachunek dziś
            </Link>{" "}
            ·{" "}
            <Link className="underline" href="/kalkulatory/pv-i-magazyn">
              Ile PV i magazynu
            </Link>
          </p>
        </WerdyktPanel>
      )}
    </main>
  )
}
