"use client"

import { useMemo, useState } from "react"
import { calculatePodlaczenieBms } from "@/lib/core/modules/montaz-baterii/podlaczenie-bms/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE, PRZYKLADOWA_REZYSTANCJA_OHM } from "@/lib/core/modules/montaz-baterii/podlaczenie-bms/constants"
import { Pole } from "@/components/ui/pole"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function PodlaczenieBmsPage() {
  const [pojemnoscFalownikaUf, setPojemnoscFalownikaUf] = useState("2200")
  const [rezystancjaPreChargeOhm, setRezystancjaPreChargeOhm] = useState(String(PRZYKLADOWA_REZYSTANCJA_OHM))
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () =>
      calculatePodlaczenieBms({
        pojemnoscFalownikaUf: Number(pojemnoscFalownikaUf),
        rezystancjaPreChargeOhm: Number(rezystancjaPreChargeOhm),
        potwierdzoneIds,
      }),
    [pojemnoscFalownikaUf, rezystancjaPreChargeOhm, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/podlaczenie-bms" />
      <NaglowekEkranu tytul="Podłączenie BMS">
        Zanim główny bezpiecznik/stycznik pójdzie w górę, kondensatory wejściowe falownika muszą
        się najpierw naładować przez rezystor — inaczej zaiskrzy. Moduł 11, Ekran A4.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność wejściowa DC falownika"
          unit="µF"
          type="number"
          inputMode="decimal"
          value={pojemnoscFalownikaUf}
          onChange={(e) => setPojemnoscFalownikaUf(e.target.value)}
          hint="Z karty katalogowej falownika."
        />
        <Pole
          label="Rezystor wstępny (pre-charge)"
          unit="Ω"
          type="number"
          inputMode="decimal"
          value={rezystancjaPreChargeOhm}
          onChange={(e) => setRezystancjaPreChargeOhm(e.target.value)}
          hint="Przykład ze źródła: 50 Ω / 50 W."
        />
      </div>

      {result.status !== "INVALID_INPUT" && (
        <WerdyktPanel poziom="uwaga" etykieta="Czas pre-charge">
          <WynikGlowny>{result.value.czasPreChargeS.toLocaleString("pl-PL")} s</WynikGlowny>
          <p className="mt-1 text-small">
            Trzymaj rezystor podłączony co najmniej tyle — dopiero potem załącz główny bezpiecznik.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        numerowana
        renderLabel={(item, index) => (
          <>
            <span className="font-medium">Krok {index + 1}. </span>
            {item.krok}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>🔴 {w}</li>
        ))}
      </ul>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : poziom !== null && poziom !== "blad" ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "BMS podłączony poprawnie" : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <p className="text-small text-muted-foreground">
          Potwierdzono {result.value.potwierdzoneWKolejnosci} / {result.value.razem} kroków po kolei.
        </p>
      )}
    </main>
  )
}
