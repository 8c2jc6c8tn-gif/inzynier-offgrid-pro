"use client"

/**
 * The quiet save bar (owner decision 23.11.2026): shown only while the open screen has values that differ from the active
 * project (own field values and results offered by the screen). Nothing pops up and nothing has to be answered — the user may
 * keep calculating „what if” and ignore it; one click saves everything listed into the project. It can be collapsed to a small
 * button for the rest of the visit. Mounted once in the layout (`lib/projekt/pasek.ts` collects the entries).
 */
import { useState, useSyncExternalStore } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useFormatLiczby, useTranslate } from "@/lib/i18n/language-context"
import { subskrybujPasek, wpisyPaska, wpisyPaskaSerwer } from "@/lib/projekt/pasek"
import { useAktywnyProjekt, useListaProjektow } from "@/lib/projekt/use-projekt"
import { WIELKOSCI } from "@/lib/projekt/wielkosci"
import { nazwaProjektu } from "./nazwa-projektu"
import { useNazwaEkranu } from "./nazwa-ekranu"

export function PasekProjektu() {
  const t = useTranslate()
  const f = useFormatLiczby()
  const wpisy = useSyncExternalStore(subskrybujPasek, wpisyPaska, wpisyPaskaSerwer)
  const lista = useListaProjektow()
  const projekt = useAktywnyProjekt()
  const nazwaEkranu = useNazwaEkranu()
  const [rozwiniety, setRozwiniety] = useState(false)
  const [zwiniety, setZwiniety] = useState(false)
  const [zapisywanie, setZapisywanie] = useState(false)

  const kandydaci = wpisy.flatMap((w) => w.kandydaci.map((k) => ({ ...k, ekran: w.ekran })))
  if (kandydaci.length === 0 || !projekt || !lista) return null
  const liczba = (v: string, id: keyof typeof WIELKOSCI) => `${f(Number(v), { maximumFractionDigits: 6 })} ${WIELKOSCI[id].jednostka}`.trim()

  async function zapisz() {
    setZapisywanie(true)
    try {
      for (const w of wpisy) await w.zapisz()
      toast.success(t("UI-PRJ-PASEK-ZAPISANO"))
    } finally {
      setZapisywanie(false)
    }
  }

  if (zwiniety) {
    return (
      <button
        type="button"
        onClick={() => setZwiniety(false)}
        className="fixed bottom-4 left-4 z-40 min-h-11 rounded-full border bg-card px-4 text-small font-medium shadow-md hover:bg-muted"
      >
        {t("UI-PRJ-PASEK-ROZWIN", { n: kandydaci.length })}
      </button>
    )
  }

  return (
    <>
    {/* In-flow spacer: the fixed bar must not cover the end of the screen. */}
    <div aria-hidden="true" className={rozwiniety ? "h-48" : "h-24"} />
    <section
      aria-label={t("UI-PRJ-PASEK-ROZNICE", { nazwa: nazwaProjektu(projekt, lista, t), n: kandydaci.length })}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-2 pr-20">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-small">
            <span className="font-medium">{t("UI-PRJ-PASEK-ROZNICE", { nazwa: nazwaProjektu(projekt, lista, t), n: kandydaci.length })}</span>
            <span className="block text-caption text-muted-foreground">{t("UI-PRJ-PASEK-PODPIS")}</span>
          </p>
          <Button type="button" variant="ghost" className="min-h-11" onClick={() => setRozwiniety((x) => !x)} aria-expanded={rozwiniety}>
            {rozwiniety ? t("UI-PRJ-PASEK-UKRYJ") : t("UI-PRJ-PASEK-POKAZ")}
          </Button>
          <Button type="button" className="min-h-11" onClick={zapisz} disabled={zapisywanie}>
            {t("UI-PRJ-PASEK-ZAPISZ")}
          </Button>
          <Button type="button" variant="ghost" className="min-h-11" onClick={() => setZwiniety(true)} aria-label={t("UI-PRJ-PASEK-ZWIN")}>
            ▾
          </Button>
        </div>
        {rozwiniety && (
          <ul className="flex flex-col gap-1 pb-1 text-small">
            {kandydaci.map((k) => (
              <li key={`${k.ekran}-${k.wielkosc}`} className="flex flex-wrap gap-x-2">
                <span>{t(WIELKOSCI[k.wielkosc].etykieta)}:</span>
                <span className="font-medium">{liczba(k.wartosc, k.wielkosc)}</span>
                <span className="text-muted-foreground">
                  ({k.wProjekcie === null ? t("UI-PRJ-PASEK-NOWA") : t("UI-PRJ-PASEK-W-PROJEKCIE", { p: liczba(k.wProjekcie, k.wielkosc) })}
                  {wpisy.length > 1 ? ` · ${nazwaEkranu(k.ekran)}` : ""})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
    </>
  )
}
