"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Chmurka, PomocPole } from "@/components/ui/chmurka"
import { CzcionkaEdytor } from "@/components/czcionka-edytor"
import { KolorGrupaEdytor } from "@/components/kolor-grupa-edytor"
import { ThemeToggle } from "@/components/theme-toggle"
import { WerdyktBadge, WerdyktPanel } from "@/components/werdykt"
import { KAFLE, USTAWIENIA_KAFEL } from "@/lib/pulpit/registry"

function Sekcja({ tytul, opis, children }: { tytul: string; opis?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t pt-6 first:border-t-0 first:pt-0">
      <div>
        <h2 className="text-lg font-semibold">{tytul}</h2>
        {opis && <p className="text-sm text-muted-foreground">{opis}</p>}
      </div>
      {children}
    </section>
  )
}

export default function WzornikPage() {
  const ikonyNawigacji = ["☰", "📍", "📡", "⚙️", "🔔", "☀️", "🌙", "🖥️"]
  const ikonyModulow = KAFLE.map((k) => ({ ikona: k.ikona, nazwa: k.nazwa }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
        <Link href="/" className="hover:underline">
          ← Pulpit
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Wzornik
        </span>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold">Wzornik</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Wszystkie ikony, werdykty, chmurki i komponenty z aplikacji na jednej stronie — do
            testowania spójności kolorów i czcionki. Zmiany poniżej działają od razu w całej apce
            (localStorage), bo każdy komponent czerpie kolory z tych samych tokenów CSS. Ta sama
            personalizacja jest też dostępna w{" "}
            <Link href={USTAWIENIA_KAFEL.href} className="underline">
              Ustawieniach
            </Link>
            .
          </p>
        </div>

        <Sekcja tytul="Personalizacja kolorów" opis="Pojedynczo albo grupowo (zaznacz kilka, zastosuj jeden kolor naraz).">
          <KolorGrupaEdytor />
        </Sekcja>

        <Sekcja tytul="Czcionka" opis="Cztery fonty z pełnym wsparciem polskich znaków diakrytycznych.">
          <CzcionkaEdytor />
        </Sekcja>

        <Sekcja tytul="Werdykty 🟢🟡🔴" opis="docs/standards/04-walidacja-i-twarde-stopy.md — zawsze z ikoną, nie tylko kolorem.">
          <div className="flex flex-col gap-3">
            <WerdyktPanel poziom="ok">
              <p className="mt-1 text-sm">Bezpiecznie, z marginesem. Przykładowa treść panelu.</p>
            </WerdyktPanel>
            <WerdyktPanel poziom="uwaga" etykieta="Dopuszczalne, ale blisko limitu">
              <p className="mt-1 text-sm">Uzasadnienie fizyczne w jednym zdaniu, bez straszenia.</p>
            </WerdyktPanel>
            <WerdyktPanel poziom="blad">
              <p className="mt-1 text-sm">Ryzyko uszkodzenia sprzętu, pożaru lub porażenia.</p>
            </WerdyktPanel>
          </div>
          <div className="flex flex-wrap gap-2">
            <WerdyktBadge poziom="ok" />
            <WerdyktBadge poziom="uwaga" />
            <WerdyktBadge poziom="blad" />
          </div>
        </Sekcja>

        <Sekcja tytul="Chmurki / wskazówki" opis="Dymek z wyjaśnieniem (docs/standards/08-ui-ux.md, 8.4).">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              Napięcie robocze <PomocPole tresc="Napięcie mierzone na zaciskach baterii pod obciążeniem. Typowy zakres: 44–58 V dla systemu 48 V." />
            </span>
            <Chmurka tresc="Migawka edukacyjna — krótkie 'o co chodzi' tłumaczenie zjawiska fizycznego, wzięte z pola formula/assumptions wyniku.">
              <span className="cursor-help rounded-md border border-dashed px-2 py-1">
                Najedź, by zobaczyć migawkę edukacyjną
              </span>
            </Chmurka>
          </div>
        </Sekcja>

        <Sekcja tytul="Styl komunikatów" opis="Konkretne, bez straszenia, bez udawania pewności (8.8).">
          <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
            „Brakuje informacji o klasie materiału. Wynik został policzony orientacyjnie dla
            wartości domyślnej i nie powinien być użyty jako projekt wykonawczy.”
          </div>
        </Sekcja>

        <Sekcja tytul="Przyciski" opis="Warianty i stany z components/ui/button.tsx.">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Domyślny</Button>
            <Button variant="outline">Obrys</Button>
            <Button variant="secondary">Drugorzędny</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destrukcyjny</Button>
            <Button variant="link">Link</Button>
            <Button variant="default" disabled>
              Wyłączony
            </Button>
          </div>
        </Sekcja>

        <Sekcja tytul="Typografia" opis="Skala nagłówków i tekstu, z polskim pangramem.">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Nagłówek H1 — Zażółć gęślą jaźń</h1>
            <h2 className="text-lg font-semibold">Nagłówek H2 — Zażółć gęślą jaźń</h2>
            <p className="text-sm font-medium">Etykieta — Zażółć gęślą jaźń</p>
            <p className="text-sm">Treść — Zażółć gęślą jaźń, ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ</p>
            <p className="text-xs text-muted-foreground">Podpis — Zażółć gęślą jaźń</p>
          </div>
        </Sekcja>

        <Sekcja tytul="Ikony nawigacji">
          <ul className="flex flex-wrap gap-3">
            {ikonyNawigacji.map((ikona) => (
              <li
                key={ikona}
                className="flex h-10 w-10 items-center justify-center rounded-md border text-lg"
              >
                {ikona}
              </li>
            ))}
          </ul>
        </Sekcja>

        <Sekcja tytul="Ikony modułów" opis="Emoji z lib/pulpit/registry.ts — jeden na kafel.">
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {ikonyModulow.map(({ ikona, nazwa }) => (
              <li
                key={nazwa}
                title={nazwa}
                className="flex h-12 w-12 items-center justify-center rounded-md border text-xl"
              >
                {ikona}
              </li>
            ))}
          </ul>
        </Sekcja>
      </main>
    </div>
  )
}
