"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateMikroinwerteryVsCentralny } from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/calculator"
import {
  KRYTERIA_POROWNANIA,
  type KryteriumPorownania,
} from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/constants"
import type { FalownikWyspowyAc } from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { useTranslate } from "@/lib/i18n/language-context"

type Odpowiedz = "" | "tak" | "nie"
type OdpowiedzFalownik = "" | FalownikWyspowyAc
type FormularzStan = { regularneZacienienie: Odpowiedz; falownikWyspowyAcCoupling?: OdpowiedzFalownik }

const STAN_POCZATKOWY: FormularzStan = { regularneZacienienie: "", falownikWyspowyAcCoupling: "" }

const KOLUMNY: Kolumna<KryteriumPorownania>[] = [
  { naglowek: "Kryterium", render: (r) => <span className="font-medium">{r.kryterium}</span> },
  { naglowek: "Mikroinwerter", render: (r) => r.mikroinwerter },
  { naglowek: "Inwerter centralny", render: (r) => r.centralny },
]

export default function MikroinwerteryVsCentralnyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("mikroinwertery-vs-centralny", STAN_POCZATKOWY)
  const { regularneZacienienie } = stan
  // Stary szkic sprzed 1.1.0 nie ma tego pola (usePersistedDraft nie scala z wartościami początkowymi).
  const falownikWyspowyAcCoupling = stan.falownikWyspowyAcCoupling ?? ""

  const result = useMemo(
    () =>
      calculateMikroinwerteryVsCentralny({
        regularneZacienienie: regularneZacienienie === "" ? null : regularneZacienienie === "tak",
        falownikWyspowyAcCoupling: falownikWyspowyAcCoupling === "" ? null : falownikWyspowyAcCoupling,
      }),
    [regularneZacienienie, falownikWyspowyAcCoupling],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical")
    ? "blad"
    : result.warnings.some((w) => w.level === "warning")
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
        onChange={(e) => setStan({ ...stan, regularneZacienienie: e.target.value as Odpowiedz })}
        hint="Drzewa, komin, sąsiedni budynek, lukarna — cień, który co dzień pada na część paneli."
      >
        <option value="">— wybierz —</option>
        <option value="tak">Tak</option>
        <option value="nie">Nie</option>
      </PoleSelect>

      {regularneZacienienie === "tak" && (
        <PoleSelect
          label="Czy masz falownik wyspowy obsługujący sprzężenie AC mikroinwerterów?"
          value={falownikWyspowyAcCoupling}
          onChange={(e) => setStan({ ...stan, falownikWyspowyAcCoupling: e.target.value as OdpowiedzFalownik })}
          pomoc={
            <>
              <strong>Falownik wyspowy z AC-coupling</strong> — falownik off-grid, który sam tworzy sieć 230 V/50 Hz
              i potrafi ograniczyć moc mikroinwerterów, gdy magazyn jest pełny (zwykle przesunięciem częstotliwości).
              Sprawdź w karcie katalogowej falownika hasło „AC coupling” i listę zgodnych mikroinwerterów.
            </>
          }
        >
          <option value="">— wybierz —</option>
          <option value="tak">Tak</option>
          <option value="nie">Nie</option>
          <option value="nie-wiem">Nie wiem</option>
        </PoleSelect>
      )}

      {result.value.rekomendacja === null ? (
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
          {result.status === "INCOMPLETE" && (
            <p className="mt-1 text-small text-muted-foreground">
              Odpowiedz na pytanie o falownik wyspowy — bez niego mikroinwertery w off-gridzie nie ruszą.
            </p>
          )}
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
