"use client"

import { useMemo } from "react"
import { calculatePuszkiPolaczeniowe } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/calculator"
import { ETYKIETY_MIEJSC } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/constants"
import type { MiejsceMontazu } from "@/lib/core/modules/okablowanie/puszki-polaczeniowe/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  miejsceMontazu: MiejsceMontazu | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsceMontazu: "",
}

export default function PuszkiPolaczenioweePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("puszki-polaczeniowe", STAN_POCZATKOWY)
  const { miejsceMontazu } = stan
  const setMiejsceMontazu = (a: (MiejsceMontazu | "") | ((p: MiejsceMontazu | "") => MiejsceMontazu | "")) =>
    setStan((prev) => ({ ...prev, miejsceMontazu: typeof a === "function" ? a(prev.miejsceMontazu) : a }))

  const result = useMemo(
    () => calculatePuszkiPolaczeniowe({ miejsceMontazu: miejsceMontazu === "" ? null : miejsceMontazu }),
    [miejsceMontazu],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/puszki-polaczeniowe" />
      <NaglowekEkranu tytul="Puszki połączeniowe" ekran="puszki-polaczeniowe" wynik={result}>
        Każde połączenie to potencjalny przeciek. Trzeba je zamknąć w szczelnej puszce, żeby woda
        nie zrobiła zwarcia. Moduł 5, Ekran 27.
      </NaglowekEkranu>

      <PoleSelect
        label="Miejsce montażu"
        value={miejsceMontazu}
        onChange={(e) => setMiejsceMontazu(e.target.value as MiejsceMontazu)}
        pomoc={<PomocPola ekran="puszki-polaczeniowe" pole="miejsce" />}
      >
        <option value="">— wybierz —</option>
        {(Object.keys(ETYKIETY_MIEJSC) as MiejsceMontazu[]).map((m) => (
          <option key={m} value={m}>
            {ETYKIETY_MIEJSC[m]}
          </option>
        ))}
      </PoleSelect>

      {result.status === "VALID" && result.value.wymaganyTyp && (
        <WerdyktPanel poziom="ok" etykieta="Wymagany typ puszki">
          <WynikGlowny>{result.value.wymaganyTyp}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
