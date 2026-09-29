"use client"

import { useMemo } from "react"
import { calculateKlapyPozarowe } from "@/lib/core/modules/bezpieczenstwo/klapy-pozarowe/calculator"
import type { WentylacjaBudynku } from "@/lib/core/modules/bezpieczenstwo/klapy-pozarowe/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Flagi = "wentylacjaWylaczanaPrzyPozarze" | "klapyZamykanePrzyPozarze" | "sygnalizacjaStanuKlap" | "maOddymianie"
type FormularzStan = { wentylacja: WentylacjaBudynku | "" } & Record<Flagi, boolean>

const STAN_POCZATKOWY: FormularzStan = {
  wentylacja: "",
  wentylacjaWylaczanaPrzyPozarze: false,
  klapyZamykanePrzyPozarze: false,
  sygnalizacjaStanuKlap: false,
  maOddymianie: false,
}

const FLAGI: { pole: Flagi; label: string }[] = [
  { pole: "wentylacjaWylaczanaPrzyPozarze", label: "Rekuperacja/wentylacja wyłącza się przy pożarze" },
  { pole: "klapyZamykanePrzyPozarze", label: "Klapy w kanałach zamykają się po wykryciu pożaru" },
  { pole: "sygnalizacjaStanuKlap", label: "Stan klap jest sygnalizowany (otwarte/zamknięte)" },
  { pole: "maOddymianie", label: "Jest wentylacja oddymiająca" },
]

export default function KlapyPozarowePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("klapy-pozarowe", STAN_POCZATKOWY)

  const result = useMemo(
    () => calculateKlapyPozarowe({ ...stan, wentylacja: stan.wentylacja === "" ? null : stan.wentylacja }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/klapy-pozarowe" />
      <NaglowekEkranu tytul="Klapy pożarowe i wentylacja" ekran="klapy-pozarowe" wzor={result.formula}>
        Dym zabija szybciej niż ogień — trzeba go zatrzymać, żeby się nie rozprzestrzenił, a potem sprawnie usunąć. Moduł 8,
        Ekran 8.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Wentylacja w budynku"
          value={stan.wentylacja}
          onChange={(e) => setStan((prev) => ({ ...prev, wentylacja: e.target.value as FormularzStan["wentylacja"] }))}
          pomoc={<PomocPola ekran="klapy-pozarowe" pole="wentylacja" />}
        >
          <option value="">— wybierz —</option>
          <option value="mechaniczna">Mechaniczna / rekuperacja z kanałami</option>
          <option value="brak">Tylko grawitacyjna / brak</option>
        </PoleSelect>
        {stan.wentylacja === "mechaniczna" &&
          FLAGI.map(({ pole, label }) => (
            <PoleCheckbox
              key={pole}
              id={`klapy-${pole}`}
              label={label}
              checked={stan[pole]}
              onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
            />
          ))}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz rodzaj wentylacji.</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={hasWarning ? "Dym może rozejść się po domu" : "Reakcja wentylacji na pożar"}>
          <WynikGlowny>Braki: {result.value.liczbaBrakow}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
