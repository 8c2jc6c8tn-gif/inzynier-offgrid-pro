"use client"

import { useMemo, useState } from "react"
import { calculateKategorieSpecjalne } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/calculator"
import { KATEGORIE, PRZYKLADOWE_URZADZENIA_WARSZTAT } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/constants"
import type { Kategoria, PozycjaKategorii } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/input"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

export default function KategorieSpecjalnePage() {
  const t = useTranslate()
  const [kategoria, setKategoria] = useState<Kategoria>("warsztat")
  const [pozycje, setPozycje] = useState<PozycjaKategorii[]>([])

  const result = useMemo(() => calculateKategorieSpecjalne({ kategoria, pozycje }), [kategoria, pozycje])

  function dodajPozycje(nazwa = "") {
    setPozycje((prev) => [...prev, { id: crypto.randomUUID(), nazwa, mocW: 0, czasMin: 0 }])
  }

  function usunPozycje(id: string) {
    setPozycje((prev) => prev.filter((p) => p.id !== id))
  }

  function aktualizuj(id: string, patch: Partial<PozycjaKategorii>) {
    setPozycje((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kategorie-specjalne" />
      <NaglowekEkranu tytul="Kategorie specjalne">
        Zamiast zaczynać od pustej listy, wybierasz swój profil i dostajesz gotowy punkt startowy
        dopasowany do typowych urządzeń w tej kategorii. Moduł 2, Ekran 15.
      </NaglowekEkranu>

      <PoleSelect label="Kategoria" value={kategoria} onChange={(e) => setKategoria(e.target.value as Kategoria)}>
        {KATEGORIE.map((k) => (
          <option key={k.id} value={k.id}>
            {k.label}
          </option>
        ))}
      </PoleSelect>

      {kategoria === "warsztat" && pozycje.length === 0 && (
        <div className="rounded-md border border-dashed p-3 text-small text-muted-foreground">
          Typowe urządzenia w tej kategorii:{" "}
          {PRZYKLADOWE_URZADZENIA_WARSZTAT.map((nazwa) => (
            <button
              key={nazwa}
              type="button"
              onClick={() => dodajPozycje(nazwa)}
              className="mr-2 mt-1 inline-block rounded-full border px-3 py-1 hover:bg-muted"
            >
              + {nazwa}
            </button>
          ))}
          <p className="mt-2 text-caption">Moc nie jest podana w źródle — wpisz ją ręcznie po dodaniu.</p>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {pozycje.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-md border p-3 text-small">
            <input
              type="text"
              placeholder="Nazwa urządzenia"
              value={p.nazwa}
              onChange={(e) => aktualizuj(p.id, { nazwa: e.target.value })}
              className="min-h-10 flex-1 min-w-24 rounded-md border border-input bg-background px-2"
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="W"
              value={p.mocW || ""}
              onChange={(e) => aktualizuj(p.id, { mocW: Number(e.target.value) })}
              className="min-h-10 w-20 rounded-md border border-input bg-background px-2"
              aria-label={`Moc — ${p.nazwa || "urządzenie"}`}
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="min"
              value={p.czasMin || ""}
              onChange={(e) => aktualizuj(p.id, { czasMin: Number(e.target.value) })}
              className="min-h-10 w-20 rounded-md border border-input bg-background px-2"
              aria-label={`Czas pracy — ${p.nazwa || "urządzenie"}`}
            />
            <button
              type="button"
              onClick={() => usunPozycje(p.id)}
              className="text-caption text-muted-foreground underline"
              aria-label={`Usuń ${p.nazwa || "pozycję"}`}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => dodajPozycje()}
        className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
      >
        + Dodaj urządzenie
      </button>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Dodaj przynajmniej jedno urządzenie.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Zapotrzebowanie dobowe tej kategorii">
          <WynikGlowny>{(result.value.energiaWh / 1000).toFixed(2)} kWh</WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
