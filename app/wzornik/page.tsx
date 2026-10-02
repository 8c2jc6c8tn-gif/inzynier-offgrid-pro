"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Chmurka, PomocPole } from "@/components/ui/chmurka"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { StanBledu, StanLadowania, StanPusty } from "@/components/ui/stany"
import { CzcionkaEdytor } from "@/components/czcionka-edytor"
import { KolorGrupaEdytor } from "@/components/kolor-grupa-edytor"
import { StylWygladuWybor } from "@/components/styl-wygladu-wybor"
import { ThemeToggle } from "@/components/theme-toggle"
import { WerdyktBadge, WerdyktPanel } from "@/components/werdykt"
import { KAFLE, USTAWIENIA_KAFEL } from "@/lib/pulpit/registry"
import { useTekstyRejestru } from "@/components/tekst-rejestru"
import { ustawKoloryGrupowo } from "@/lib/wyglad/storage"
import { useTranslate } from "@/lib/i18n/language-context"

/** Dwie propozycje akcentu (docs/brief-dla-v0.md, sekcja 3) — obie dobrane z dala od hue
 * werdyktów (152/70/27), żeby "wybrane/aktywne" nigdy nie wyglądało jak status. Domyślny w
 * app/globals.css to "Techniczny błękit"; przyciski poniżej robią żywy podgląd przez ten sam
 * mechanizm co edytor kolorów w Ustawieniach (lib/wyglad/storage.ts). Hexy przeliczone z tych
 * samych wartości oklch co w globals.css (scripts/audyt-kontrastu.mjs) — "Zastosuj" tutaj daje
 * identyczny odcień co domyślny motyw, nie przypadkowe zaokrąglenie. Oba warianty zweryfikowane
 * jako tekst linku na tle (≥4.5:1); primary-foreground na kafelku dobiera się automatycznie po
 * luminancji (lib/wyglad/storage.ts: zastosujWyglad). */
const PROPOZYCJE_AKCENTU = [
  { nazwa: "UI-WZO-TECHNICZNY-BLEKIT", opis: "UI-WZO-OKLCH-245-DOMYSLNY", hex: "#006cc8" },
  { nazwa: "UI-WZO-ENERGETYCZNY-CYJAN", opis: "UI-WZO-OKLCH-205-ALTERNATYWA", hex: "#006a7a" },
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
  const t = useTranslate()
  const { nazwaKafla } = useTekstyRejestru()
  const ikonyNawigacji = ["☰", "📍", "📡", "⚙️", "🔔", "☀️", "🌙", "🖥️"]
  const ikonyModulow = KAFLE.map((k) => ({ ikona: k.ikona, nazwa: nazwaKafla(k) }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
        <Link href="/" className="hover:underline">
          {t("UI-WZO-PULPIT")}
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {t("UI-WZO-WZORNIK")}
        </span>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold">{t("UI-WZO-WZORNIK")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("UI-WZO-WSZYSTKIE-IKONY-WERDYKTY")}{" "}
            <Link href={USTAWIENIA_KAFEL.href} className="underline">
              {t("UI-WZO-USTAWIENIACH")}
            </Link>
            .
          </p>
        </div>

        <Sekcja
          tytul={t("UI-WZO-KOLOR-AKCENTU-PROPOZYCJE")}
          opis={t("UI-WZO-NIEUSTALONE-BRIEFIE-SEKCJA")}
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
                  <span className="block text-small font-medium">{t(p.nazwa)}</span>
                  <span className="block text-caption text-muted-foreground">{t(p.opis)}</span>
                </span>
                <span aria-hidden="true" className={buttonVariants({ size: "sm", variant: "outline" })}>
                  {t("UI-WZO-ZASTOSUJ")}
                </span>
              </button>
            ))}
          </div>
          <p className="text-caption text-muted-foreground">
            {t("UI-WZO-KLIKNIECIE-ZAPISUJE-WYBOR")}
          </p>
        </Sekcja>

        {/* Appearance style (D67): the same picker as in the settings, to preview every element in a style. */}
        <section className="flex flex-col gap-3 border-t pt-6">
          <StylWygladuWybor />
        </section>

        <Sekcja tytul={t("UI-WZO-PERSONALIZACJA-KOLOROW")} opis={t("UI-WZO-POJEDYNCZO-ALBO-GRUPOWO")}>
          <KolorGrupaEdytor />
        </Sekcja>

        <Sekcja tytul={t("UI-WZO-CZCIONKA")} opis={t("UI-WZO-CZTERY-FONTY-PELNYM")}>
          <CzcionkaEdytor />
        </Sekcja>

        <Sekcja tytul={t("UI-WZO-WERDYKTY")} opis={t("UI-WZO-DOCS-STANDARDS-WALIDACJA")}>
          <div className="flex flex-col gap-3">
            <WerdyktPanel poziom="ok">
              <p className="mt-1 text-sm">{t("UI-WZO-BEZPIECZNIE-MARGINESEM-PRZYK")}</p>
            </WerdyktPanel>
            <WerdyktPanel poziom="uwaga" etykieta={t("UI-WZO-DOPUSZCZALNE-BLISKO-LIMITU")}>
              <p className="mt-1 text-sm">{t("UI-WZO-UZASADNIENIE-FIZYCZNE-JEDNYM")}</p>
            </WerdyktPanel>
            <WerdyktPanel poziom="blad">
              <p className="mt-1 text-sm">{t("UI-WZO-RYZYKO-USZKODZENIA-SPRZETU")}</p>
            </WerdyktPanel>
          </div>
          <div className="flex flex-wrap gap-2">
            <WerdyktBadge poziom="ok" />
            <WerdyktBadge poziom="uwaga" />
            <WerdyktBadge poziom="blad" />
          </div>
        </Sekcja>

        <Sekcja tytul={t("UI-WZO-CHMURKI-WSKAZOWKI")} opis={t("UI-WZO-DYMEK-WYJASNIENIEM-DOCS")}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              {t("UI-WZO-NAPIECIE-ROBOCZE")} <PomocPole tresc={t("UI-WZO-NAPIECIE-MIERZONE-ZACISKACH")} />
            </span>
            <Chmurka tresc={t("UI-WZO-MIGAWKA-EDUKACYJNA-KROTKIE")}>
              <span className="cursor-help rounded-md border border-dashed px-2 py-1">
                {t("UI-WZO-NAJEDZ-ZOBACZYC-MIGAWKE")}
              </span>
            </Chmurka>
          </div>
        </Sekcja>

        <Sekcja tytul={t("UI-WZO-STYL-KOMUNIKATOW")} opis={t("UI-WZO-KONKRETNE-BEZ-STRASZENIA")}>
          <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
            {t("UI-WZO-BRAKUJE-INFORMACJI-KLASIE")}
          </div>
        </Sekcja>

        <Sekcja tytul={t("UI-WZO-PRZYCISKI")} opis={t("UI-WZO-WARIANTY-STANY-COMPONENTS")}>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">{t("UI-WZO-DOMYSLNY")}</Button>
            <Button variant="outline">{t("UI-WZO-OBRYS")}</Button>
            <Button variant="secondary">{t("UI-WZO-DRUGORZEDNY")}</Button>
            <Button variant="ghost">{t("UI-WZO-GHOST")}</Button>
            <Button variant="destructive">{t("UI-WZO-DESTRUKCYJNY")}</Button>
            <Button variant="link">{t("UI-WZO-LINK")}</Button>
            <Button variant="default" disabled>
              {t("UI-WZO-WYLACZONY")}
            </Button>
          </div>
        </Sekcja>

        <Sekcja
          tytul={t("UI-WZO-TYPOGRAFIA-SKALA-JAKO")}
          opis={t("UI-WZO-APP-GLOBALS-CSS")}
        >
          <div className="flex flex-col gap-1.5">
            <p className="text-display font-semibold">{t("UI-WZO-DISPLAY-ZAZOLC-GESLA")}</p>
            <p className="text-h1 font-semibold">{t("UI-WZO-NAGLOWEK-ZAZOLC-GESLA")}</p>
            <p className="text-h2 font-semibold">{t("UI-WZO-NAGLOWEK-ZAZOLC-GESLA-2")}</p>
            <p className="text-h3 font-medium">{t("UI-WZO-NAGLOWEK-ZAZOLC-GESLA-3")}</p>
            <p className="text-body">{t("UI-WZO-TRESC-BODY-ZAZOLC")}</p>
            <p className="text-small text-muted-foreground">{t("UI-WZO-SMALL-ETYKIETY-POL")}</p>
            <p className="text-caption text-muted-foreground">{t("UI-WZO-CAPTION-PODPISY-JEDNOSTKI")}</p>
          </div>
        </Sekcja>

        <Sekcja
          tytul={t("UI-WZO-STANY-HOVER-FOCUS")}
          opis={t("UI-WZO-KAZDY-INTERAKTYWNY-ELEMENT")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button>{t("UI-WZO-DOMYSLNY")}</Button>
              <Button className="border-ring ring-3 ring-ring/50">{t("UI-WZO-WYGLADA-FOCUS-VISIBLE")}</Button>
              <Button className="hover:bg-primary/80 bg-primary/80">{t("UI-WZO-WYGLADA-HOVER")}</Button>
              <Button disabled>{t("UI-WZO-WYGLADA-DISABLED")}</Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Pole label={t("UI-WZO-DOMYSLNE-POLE")} unit="V" defaultValue="48" />
              <Pole label={t("UI-WZO-POLE-BLEDEM")} unit="A" defaultValue="—" error={t("UI-WZO-WARTOSC-POZA-ZAKRESEM")} />
              <Pole label={t("UI-WZO-POLE-WYLACZONE")} unit="Ω" defaultValue="0.01" disabled />
            </div>
          </div>
        </Sekcja>

        <Sekcja tytul={t("UI-WZO-POLA-FORMULARZA")} opis={t("UI-WZO-POLE-POLESELECT-POLECHECKBOX")}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Pole label={t("UI-WZO-NAPIECIE-ROBOCZE")} unit="V" defaultValue="48" pomoc={t("UI-WZO-NAPIECIE-MIERZONE-ZACISKACH-2")} />
            <PoleSelect label={t("UI-WZO-TRYB")} defaultValue="szereg">
              <option value="szereg">{t("UI-WZO-SZEREG")}</option>
              <option value="rownolegle">{t("UI-WZO-ROWNOLEGLE")}</option>
            </PoleSelect>
          </div>
          <PoleCheckbox
            id="wzornik-checkbox-demo"
            label={t("UI-WZO-DESZCZ-PROGNOZOWANY-CIAGU")}
            hint={t("UI-WZO-WPLYWA-REKOMENDACJE-MYCIA")}
          />
        </Sekcja>

        <Sekcja
          tytul={t("UI-WZO-STANY-PUSTKI-BLEDU")}
          opis={t("UI-WZO-COMPONENTS-STANY-TSX")}
        >
          <div className="flex flex-col gap-3">
            <StanPusty tytul={t("UI-WZO-UZUPELNIJ-DANE-ZOBACZYC")}>
              <p>{t("UI-WZO-NORMALNY-STAN-POCZATKOWY")}</p>
            </StanPusty>
            <StanBledu tytul={t("UI-WZO-POLICZYC-SPRAWDZ-DANE")}>
              <p>{t("UI-WZO-DANE-NIESPOJNE-ALBO")}</p>
            </StanBledu>
            <StanLadowania linie={2} />
          </div>
        </Sekcja>

        <Sekcja tytul={t("UI-WZO-IKONY-NAWIGACJI")}>
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

        <Sekcja tytul={t("UI-WZO-IKONY-MODULOW")} opis={t("UI-WZO-EMOJI-LIB-PULPIT")}>
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
