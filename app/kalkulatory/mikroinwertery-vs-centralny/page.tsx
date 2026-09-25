"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateMikroinwerteryVsCentralny } from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/calculator"
import {
  KRYTERIA_POROWNANIA,
  type KryteriumPorownania,
} from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { useTranslate } from "@/lib/i18n/language-context"

type Odpowiedz = "" | "tak" | "nie"
type FormularzStan = { regularneZacienienie: Odpowiedz }

const STAN_POCZATKOWY: FormularzStan = { regularneZacienienie: "" }

const KOLUMNY: Kolumna<KryteriumPorownania>[] = [
  { naglowek: "Kryterium", render: (r) => <span className="font-medium">{r.kryterium}</span> },
  { naglowek: "Mikroinwerter", render: (r) => r.mikroinwerter },
  { naglowek: "Inwerter centralny", render: (r) => r.centralny },
]

export default function MikroinwerteryVsCentralnyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("mikroinwertery-vs-centralny", STAN_POCZATKOWY)
  const { regularneZacienienie } = stan

  const result = useMemo(
    () =>
      calculateMikroinwerteryVsCentralny({
        regularneZacienienie: regularneZacienienie === "" ? null : regularneZacienienie === "tak",
      }),
    [regularneZacienienie],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "warning" || w.level === "critical")
    ? "uwaga"
    : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/mikroinwertery-vs-centralny" />
      <NaglowekEkranu tytul="Mikroinwertery vs inwerter centralny">
        Mikroinwerter to osobny falownik przy każdym panelu. Inwerter centralny obsługuje cały string naraz.
        Moduł 3, Ekran 21.
      </NaglowekEkranu>

      <KartaPorownawcza kolumny={KOLUMNY} wiersze={KRYTERIA_POROWNANIA} minWidth={320} />

      <PoleSelect
        label="Czy panele będą częściowo lub regularnie zacienione?"
        value={regularneZacienienie}
        onChange={(e) => setStan({ regularneZacienienie: e.target.value as Odpowiedz })}
        hint="Drzewa, komin, sąsiedni budynek, lukarna — cień, który co dzień pada na część paneli."
      >
        <option value="">— wybierz —</option>
        <option value="tak">Tak</option>
        <option value="nie">Nie</option>
      </PoleSelect>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Odpowiedz na pytanie o zacienienie, żeby zobaczyć rekomendację. Nie wiesz? Sprawdź w{" "}
          <Link href="/kalkulatory/analiza-zacienienia" className="underline">
            analizie zacienienia
          </Link>
          .
        </p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={result.value.rekomendacja === "mikroinwertery" ? "Rekomendacja: mikroinwertery" : "Rekomendacja: inwerter centralny"}
        >
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          {result.value.rekomendacja === "mikroinwertery" && (
            <p className="mt-2 text-small text-muted-foreground">
              Ile traci string przy zacienieniu, policzysz w ekranie{" "}
              <Link href="/kalkulatory/zacienienie-diody-bocznikujace" className="underline">
                Zacienienie i diody bocznikujące
              </Link>
              .
            </p>
          )}
        </WerdyktPanel>
      )}

      <MigawkaBox>
        „Cień to wróg klasycznej instalacji szeregowej. Mikroinwerter daje każdemu panelowi niezależność od
        sąsiadów.”
      </MigawkaBox>
    </main>
  )
}
