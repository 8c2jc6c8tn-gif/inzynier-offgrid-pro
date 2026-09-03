"use client"

import { useMemo, useState } from "react"
import { calculateObwodPrecharge } from "@/lib/core/modules/baterie/obwod-precharge/calculator"
import {
  OSTRZEZENIE_BRAK_PRECHARGE,
  PRZYKLADOWA_REZYSTANCJA_OHM,
} from "@/lib/core/modules/baterie/obwod-precharge/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function ObwodPrechargePage() {
  const [pojemnoscFalownikaUf, setPojemnoscFalownikaUf] = useState("")
  const [rezystancjaPreChargeOhm, setRezystancjaPreChargeOhm] = useState(
    String(PRZYKLADOWA_REZYSTANCJA_OHM),
  )

  const result = useMemo(
    () =>
      calculateObwodPrecharge({
        pojemnoscFalownikaUf: pojemnoscFalownikaUf === "" ? 0 : Number(pojemnoscFalownikaUf),
        rezystancjaPreChargeOhm: rezystancjaPreChargeOhm === "" ? 0 : Number(rezystancjaPreChargeOhm),
      }),
    [pojemnoscFalownikaUf, rezystancjaPreChargeOhm],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/obwod-precharge" />
      <NaglowekEkranu tytul="Obwód Pre-Charge">
        Kondensatory falownika w pierwszej chwili zachowują się jak zwarcie — pre-charge to
        łagodne „obudzenie” ich prądem, zanim puścisz pełną moc. Moduł 4, Ekran 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność wejściowa DC falownika"
          unit="µF"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscFalownikaUf}
          onChange={(e) => setPojemnoscFalownikaUf(e.target.value)}
          hint="Z karty katalogowej falownika (baza komponentów)."
        />
        <Pole
          label="Rezystor wstępny (pre-charge)"
          unit="Ω"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaPreChargeOhm}
          onChange={(e) => setRezystancjaPreChargeOhm(e.target.value)}
          hint="Przykład ze źródła: 50 Ω / 50 W. Dobierz tak, by ograniczyć prąd uderzeniowy (np. do 5 A)."
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz oba pola, żeby zobaczyć czas pre-charge.</p>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta="Czas wstępnego ładowania">
          <WynikGlowny>{result.value.czasPreChargeS.toLocaleString("pl-PL")} s</WynikGlowny>
          <p className="mt-1 text-small">
            Poczekaj, aż zgaśnie dioda falownika, dopiero potem załącz główny bezpiecznik/stycznik.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      <p className="text-small text-werdykt-blad">🔴 {OSTRZEZENIE_BRAK_PRECHARGE}</p>
    </main>
  )
}
