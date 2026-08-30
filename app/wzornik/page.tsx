"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Chmurka, PomocPole } from "@/components/ui/chmurka"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { StanBledu, StanLadowania, StanPusty } from "@/components/ui/stany"
import { CzcionkaEdytor } from "@/components/czcionka-edytor"
import { KolorGrupaEdytor } from "@/components/kolor-grupa-edytor"
import { ThemeToggle } from "@/components/theme-toggle"
import { WerdyktBadge, WerdyktPanel } from "@/components/werdykt"
import { KAFLE, USTAWIENIA_KAFEL } from "@/lib/pulpit/registry"
import { ustawKoloryGrupowo } from "@/lib/wyglad/storage"

/** Dwie propozycje akcentu (docs/brief-dla-v0.md, sekcja 3) — obie dobrane z dala od hue
 * werdyktów (152/70/27), żeby "wybrane/aktywne" nigdy nie wyglądało jak status. Domyślny w
 * app/globals.css to "Techniczny błękit"; przyciski poniżej robią żywy podgląd przez ten sam
 * mechanizm co edytor kolorów w Ustawieniach (lib/wyglad/storage.ts). Hexy przeliczone z tych
 * samych wartości oklch co w globals.css (scripts/audyt-kontrastu.mjs) — "Zastosuj" tutaj daje
 * identyczny odcień co domyślny motyw, nie przypadkowe zaokrąglenie. Oba warianty zweryfikowane
 * jako tekst linku na tle (≥4.5:1); primary-foreground na kafelku dobiera się automatycznie po
 * luminancji (lib/wyglad/storage.ts: zastosujWyglad). */
const PROPOZYCJE_AKCENTU = [
  { nazwa: "Techniczny błękit", opis: "oklch(0.52 0.18 245) — domyślny, 5.3:1 na tle", hex: "#006cc8" },
  { nazwa: "Energetyczny cyjan", opis: "oklch(0.46 0.13 205) — alternatywa, 6.3:1 na tle", hex: "#006a7a" },
] as const

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

        <Sekcja
          tytul="Kolor akcentu — propozycje"
          opis="Nieustalone w briefie (sekcja 3) — dwa warianty do porównania na żywo, z dala od hue werdyktów 🟢🟡🔴, żeby 'wybrane' nigdy nie wyglądało jak status."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PROPOZYCJE_AKCENTU.map((p) => (
              <button
                key={p.nazwa}
                type="button"
                onClick={() => ustawKoloryGrupowo(["akcent"], p.hex)}
                className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="h-9 w-9 shrink-0 rounded-full border"
                  style={{ backgroundColor: p.hex }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-medium">{p.nazwa}</span>
                  <span className="block text-caption text-muted-foreground">{p.opis}</span>
                </span>
                <span aria-hidden="true" className={buttonVariants({ size: "sm", variant: "outline" })}>
                  Zastosuj
                </span>
              </button>
            ))}
          </div>
          <p className="text-caption text-muted-foreground">
            Kliknięcie zapisuje wybór jako kolor grupy „akcent” — dokładnie ten sam mechanizm co
            edytor poniżej i w Ustawieniach. Można doprecyzować odcień ręcznie tam.
          </p>
        </Sekcja>

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

        <Sekcja
          tytul="Typografia — skala jako token"
          opis="app/globals.css: --text-display/h1/h2/h3/body/small/caption. Klasy text-display…text-caption, nie ad-hoc text-sm/text-lg."
        >
          <div className="flex flex-col gap-1.5">
            <p className="text-display font-semibold">Display — Zażółć gęślą jaźń</p>
            <p className="text-h1 font-semibold">Nagłówek H1 — Zażółć gęślą jaźń</p>
            <p className="text-h2 font-semibold">Nagłówek H2 — Zażółć gęślą jaźń</p>
            <p className="text-h3 font-medium">Nagłówek H3 — Zażółć gęślą jaźń</p>
            <p className="text-body">Treść (body) — Zażółć gęślą jaźń, ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ</p>
            <p className="text-small text-muted-foreground">Small — etykiety pól, opisy</p>
            <p className="text-caption text-muted-foreground">Caption — podpisy, jednostki, wersje</p>
          </div>
        </Sekcja>

        <Sekcja
          tytul="Stany: hover / focus-visible / disabled"
          opis="Każdy interaktywny element ma trzy stany zdefiniowane raz w components/ui/ — nie per ekran (8.1–8.3)."
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Domyślny</Button>
              <Button className="border-ring ring-3 ring-ring/50">Wygląda: focus-visible</Button>
              <Button className="hover:bg-primary/80 bg-primary/80">Wygląda: hover</Button>
              <Button disabled>Wygląda: disabled</Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Pole label="Domyślne pole" unit="V" defaultValue="48" />
              <Pole label="Pole z błędem" unit="A" defaultValue="—" error="Wartość poza zakresem 0–100." />
              <Pole label="Pole wyłączone" unit="Ω" defaultValue="0.01" disabled />
            </div>
          </div>
        </Sekcja>

        <Sekcja tytul="Pola formularza" opis="Pole / PoleSelect / PoleCheckbox — components/ui/pole.tsx, z opcjonalną chmurką pomocy.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Pole label="Napięcie robocze" unit="V" defaultValue="48" pomoc="Napięcie mierzone na zaciskach baterii pod obciążeniem." />
            <PoleSelect label="Tryb" defaultValue="szereg">
              <option value="szereg">Szereg</option>
              <option value="rownolegle">Równolegle</option>
            </PoleSelect>
          </div>
          <PoleCheckbox
            id="wzornik-checkbox-demo"
            label="Deszcz prognozowany w ciągu najbliższych kilku dni"
            hint="Wpływa na rekomendację mycia paneli."
          />
        </Sekcja>

        <Sekcja
          tytul="Stany pustki / błędu / ładowania"
          opis="components/ui/stany.tsx — StanPusty, StanBledu, StanLadowania (8.5–8.7)."
        >
          <div className="flex flex-col gap-3">
            <StanPusty tytul="Uzupełnij dane, by zobaczyć wynik.">
              <p>Normalny stan początkowy formularza — neutralny, nie ostrzegawczy.</p>
            </StanPusty>
            <StanBledu tytul="Nie da się policzyć — sprawdź dane wejściowe.">
              <p>Dane są, ale są niespójne albo poza zakresem fizycznym.</p>
            </StanBledu>
            <StanLadowania linie={2} />
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
