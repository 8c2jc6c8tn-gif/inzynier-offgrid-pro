"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateRatowanieAkumulatoraMaly } from "@/lib/core/modules/kalkulator-mobilny/ratowanie-akumulatora-maly/calculator"
import type { ChemiaRatowania } from "@/lib/core/modules/kalkulator-mobilny/ratowanie-akumulatora-maly/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  chemia: ChemiaRatowania | ""
  napiecieSpoczynkoweV: string
}

const STAN_POCZATKOWY: FormularzStan = { chemia: "", napiecieSpoczynkoweV: "" }

const NAZWY_PROCEDUR: Record<string, string> = {
  "M11/A9": "Ratowanie głęboko rozładowanego ogniwa (LiFePO4)",
  "M11/B10": "Ocena zużycia — siarczanowanie",
  "M11/B11": "Ratowanie zasiarczonego akumulatora",
}

export default function RatowanieAkumulatoraMalyPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ratowanie-akumulatora-maly", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateRatowanieAkumulatoraMaly({
        chemia: stan.chemia === "" ? null : stan.chemia,
        napiecieSpoczynkoweV: stan.napiecieSpoczynkoweV === "" ? null : Number(stan.napiecieSpoczynkoweV),
      }),
    [stan],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ratowanie-akumulatora-maly" />
      <NaglowekEkranu tytul="Ratowanie rozładowanego akumulatora — mała instalacja">
        Wybierz typ akumulatora — poprowadzimy Cię do pełnej procedury ratowania w sekcji Montaż baterii. Moduł 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Typ akumulatora"
          value={stan.chemia}
          onChange={(e) => setStan((prev) => ({ ...prev, chemia: e.target.value as FormularzStan["chemia"] }))}
        >
          <option value="">— wybierz —</option>
          <option value="AGM">AGM</option>
          <option value="kwasowy">Kwasowy (zalewowy)</option>
          <option value="LiFePO4">LiFePO4</option>
        </PoleSelect>
        {stan.chemia !== "LiFePO4" && (
          <Pole
            label="Napięcie spoczynkowe (opcjonalnie)"
            unit="V"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.napiecieSpoczynkoweV}
            onChange={(e) => setStan((prev) => ({ ...prev, napiecieSpoczynkoweV: e.target.value }))}
            hint="Akumulator 12 V, zmierzony po kilku godzinach bez ładowania i obciążenia."
          />
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się ocenić — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz typ akumulatora.</p>
      ) : (
        <WerdyktPanel poziom={result.value.krytycznieRozladowany ? "uwaga" : "ok"} etykieta="Pełna procedura ratowania">
          <ol className="mt-1 list-decimal pl-5 text-small">
            {result.value.procedury.map((p) => (
              <li key={p.ekran}>
                <Link href={p.href} className="underline">
                  {NAZWY_PROCEDUR[p.ekran] ?? p.ekran}
                </Link>
              </li>
            ))}
          </ol>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
