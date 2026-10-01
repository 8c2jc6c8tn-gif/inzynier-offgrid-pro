"use client"

import Link from "next/link"
import { useState, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { KontoSekcja } from "@/components/konto-sekcja"
import { JezykWybor } from "@/components/jezyk-wybor"
import { CzcionkaEdytor } from "@/components/czcionka-edytor"
import { KolorGrupaEdytor } from "@/components/kolor-grupa-edytor"
import { StylWygladuWybor } from "@/components/styl-wygladu-wybor"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslate } from "@/lib/i18n/language-context"
import { PRESETY, stanZPresetow } from "@/lib/pulpit/presety"
import { USTAWIENIA_KAFEL, znajdzKafel } from "@/lib/pulpit/registry"
import {
  domyslnyStan,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  zapiszStanPulpitu,
  type PulpitState,
} from "@/lib/pulpit/storage"
import { cn } from "@/lib/utils"

export default function UstawieniaPage() {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const tr = useTranslate()
  const [wybranePresety, setWybranePresety] = useState<string[]>([])
  const [presetZastosowany, setPresetZastosowany] = useState(false)

  function zapisz(nowyStan: PulpitState) {
    zapiszStanPulpitu(nowyStan)
  }

  function przelaczWidocznosc(id: number) {
    const hiddenIds = stan.hiddenIds.includes(id)
      ? stan.hiddenIds.filter((x) => x !== id)
      : [...stan.hiddenIds, id]
    zapisz({ ...stan, hiddenIds })
  }

  function przesun(id: number, kierunek: -1 | 1) {
    const index = stan.order.indexOf(id)
    const nowyIndex = index + kierunek
    if (nowyIndex < 0 || nowyIndex >= stan.order.length) return

    const order = [...stan.order]
    ;[order[index], order[nowyIndex]] = [order[nowyIndex], order[index]]
    zapisz({ ...stan, order })
  }

  function przelaczPreset(id: string) {
    setPresetZastosowany(false)
    setWybranePresety((obecne) => (obecne.includes(id) ? obecne.filter((x) => x !== id) : [...obecne, id]))
  }

  function zastosujPresety() {
    zapisz(stanZPresetow(wybranePresety))
    setPresetZastosowany(true)
  }

  function przywrocDomyslne() {
    zapisz(domyslnyStan())
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <Link
          href="/"
          className="rounded-md text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          ← Pulpit
        </Link>
        <h1 className="mt-2 text-h1 font-semibold">
          <span aria-hidden="true">⚙️</span> Ustawienia — Skonfiguruj pulpit
        </h1>
        <p className="mt-1 text-small text-muted-foreground">
          Pokaż/ukryj moduł, zmień kolejność (↑/↓). Ukrycie nie usuwa modułu — zawsze możesz go
          przywrócić. Zmiany zapisują się automatycznie w tej przeglądarce.
        </p>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="presety-tytul">
        <div>
          <h2 id="presety-tytul" className="text-h2 font-semibold">
            {tr("UI-PULPIT-PRESETY-TYTUL")}
          </h2>
          <p className="mt-1 text-small text-muted-foreground">{tr("UI-PULPIT-PRESETY-OPIS")}</p>
        </div>
        <ul className="flex flex-col gap-2">
          {PRESETY.map((preset) => (
            <li key={preset.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-[:checked]:border-foreground/40 has-[:checked]:bg-muted">
                <input
                  type="checkbox"
                  className="mt-1 size-4"
                  checked={wybranePresety.includes(preset.id)}
                  onChange={() => przelaczPreset(preset.id)}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-small font-medium">
                    <span aria-hidden="true">{preset.ikona}</span> {tr(preset.nazwaKlucz)}
                  </span>
                  <span className="text-caption text-muted-foreground">{tr(preset.opisKlucz)}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          onClick={zastosujPresety}
          disabled={wybranePresety.length === 0}
          className="min-h-11"
        >
          {tr("UI-PULPIT-PRESETY-ZASTOSUJ")}
        </Button>
        <p role="status" className="text-small text-muted-foreground">
          {presetZastosowany ? tr("UI-PULPIT-PRESETY-ZASTOSOWANO") : null}
        </p>
      </section>

      <ul className="flex flex-col gap-2">
        {stan.order.map((id, index) => {
          const kafel = znajdzKafel(id)
          if (!kafel) return null
          const ukryty = stan.hiddenIds.includes(id)

          return (
            <li
              key={id}
              className={cn(
                "flex items-center gap-3 rounded-md border p-3 transition-opacity",
                ukryty && "opacity-50",
              )}
            >
              <span className="text-xl" aria-hidden="true">
                {kafel.ikona}
              </span>
              <span className="flex-1 text-small font-medium">
                {/* M14 tiles (15/16) are named, never numbered — "Kafel 14" is the settings (D39). */}
                {kafel.id < USTAWIENIA_KAFEL.id ? `${kafel.id}. ` : null}
                {kafel.nazwa}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => przesun(id, -1)}
                  disabled={index === 0}
                  aria-label="Przenieś wyżej"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => przesun(id, 1)}
                  disabled={index === stan.order.length - 1}
                  aria-label="Przenieś niżej"
                >
                  ↓
                </Button>
                <Button type="button" variant="outline" size="sm" className="ml-1" onClick={() => przelaczWidocznosc(id)}>
                  {ukryty ? "Pokaż" : "Ukryj"}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>

      <Button type="button" variant="outline" onClick={przywrocDomyslne} className="min-h-11">
        Przywróć domyślne
      </Button>

      <div className="flex flex-col gap-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h2 font-semibold">Personalizacja wyglądu</h2>
            <p className="text-small text-muted-foreground">
              Motyw, kolory i czcionka. Podgląd wszystkich elementów naraz:{" "}
              <Link href="/wzornik" className="underline">
                /wzornik
              </Link>
              .
            </p>
          </div>
          <ThemeToggle />
        </div>

        <StylWygladuWybor />

        <div>
          <h3 className="mb-2 text-small font-semibold">Kolory</h3>
          <KolorGrupaEdytor />
        </div>

        <div>
          <h3 className="mb-2 text-small font-semibold">Czcionka</h3>
          <CzcionkaEdytor />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t pt-6">
        <h2 className="text-h2 font-semibold">Język</h2>
        <p className="text-small text-muted-foreground">
          Dotyczy komunikatów, które mają dziś tłumaczenie (rozdz. 17 standardu — migracja trwa
          moduł po module). Pozostałe teksty wciąż pokazują się po polsku.
        </p>
        <JezykWybor />
      </div>

      <KontoSekcja />
    </main>
  )
}
