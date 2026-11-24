"use client"

/**
 * Projects (owner decision 23.11.2026): the list of installation projects, the active one, new / copy / rename / delete, the
 * numbers saved in the open project and a side-by-side comparison of projects (data and results saved into them).
 * autosave: nie dotyczy — every action writes at once (`lib/projekt/operacje.ts`, `magazyn-wartosci.ts`); the name field saves
 * on every change through `zmienNazwe`.
 */
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { useNazwaEkranu } from "@/components/projekt/nazwa-ekranu"
import { nazwaProjektu } from "@/components/projekt/nazwa-projektu"
import { useFormatLiczby, useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { formatujDate } from "@/lib/i18n/liczby"
import { utworzProjekt, ustawAktywny, usunProjekt, zmienNazwe } from "@/lib/projekt/operacje"
import { zapiszWartosci } from "@/lib/projekt/magazyn-wartosci"
import { useListaProjektow, useWartosciProjektu, useWartosciWieluProjektow } from "@/lib/projekt/use-projekt"
import { GRUPY_WIELKOSCI, ID_WIELKOSCI, takaSamaLiczba, WIELKOSCI, type WartosciProjektu, type WielkoscId } from "@/lib/projekt/wielkosci"
import type { Projekt } from "@/lib/projekt/projekty"

const KLUCZ_GRUPY: Record<(typeof GRUPY_WIELKOSCI)[number], string> = {
  lokalizacja: "UI-PRJ-G-LOKALIZACJA",
  zapotrzebowanie: "UI-PRJ-G-ZAPOTRZEBOWANIE",
  magazyn: "UI-PRJ-G-MAGAZYN",
  pv: "UI-PRJ-G-PV",
  falownik: "UI-PRJ-G-FALOWNIK",
  okablowanie: "UI-PRJ-G-OKABLOWANIE",
  agregat: "UI-PRJ-G-AGREGAT",
  cieplo: "UI-PRJ-G-CIEPLO",
}

function useLiczba() {
  const f = useFormatLiczby()
  return (v: string | undefined, id: WielkoscId) => (v === undefined ? "—" : `${f(Number(v), { maximumFractionDigits: 6 })} ${WIELKOSCI[id].jednostka}`.trim())
}

function useData() {
  const jezyk = useLanguage()
  return (iso: string) => (iso ? formatujDate(new Date(iso), jezyk) : "")
}

export default function ProjektyPage() {
  const t = useTranslate()
  const lista = useListaProjektow()
  const liczba = useLiczba()
  const data = useData()
  const nazwaEkranu = useNazwaEkranu()
  const [doUsuniecia, setDoUsuniecia] = useState<string | null>(null)
  const [porownywane, setPorownywane] = useState<string[]>([])
  const [zajety, setZajety] = useState(false)
  const aktywneWartosci = useWartosciProjektu(lista?.aktywnyId ?? null)
  const wartosciKolumn = useWartosciWieluProjektow(porownywane)

  if (!lista) return <main className="mx-auto max-w-3xl p-6" />
  const aktywny = lista.projekty.find((p) => p.id === lista.aktywnyId)!
  const nazwa = (p: Projekt) => nazwaProjektu(p, lista, t)

  async function nowy(kopia: boolean) {
    setZajety(true)
    try {
      await utworzProjekt(kopia ? t("UI-PRJ-KOPIA-NAZWA", { nazwa: nazwa(aktywny) }) : "", kopia ? aktywny.id : null)
    } finally {
      setZajety(false)
    }
  }

  async function usun(id: string) {
    if (doUsuniecia !== id) {
      setDoUsuniecia(id)
      return
    }
    setDoUsuniecia(null)
    setPorownywane((p) => p.filter((x) => x !== id))
    await usunProjekt(id)
  }

  const zapisane = ID_WIELKOSCI.filter((id) => aktywneWartosci?.[id] !== undefined)
  const kolumny = lista.projekty.filter((p) => porownywane.includes(p.id))

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div>
        <Link href="/" className="rounded-md text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none">
          {t("UI-MOD-PULPIT")}
        </Link>
        <h1 className="mt-2 text-h1 font-semibold">{t("UI-PRJ-TYTUL")}</h1>
        <p className="mt-1 text-small text-muted-foreground">{t("UI-PRJ-OPIS")}</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-h3 font-semibold">{t("UI-PRJ-LISTA")}</h2>
        <ul className="flex flex-col gap-3">
          {lista.projekty.map((p) => {
            const otwarty = p.id === lista.aktywnyId
            return (
              <li key={p.id} data-karta className={`flex flex-col gap-2 rounded-lg border p-4 ${otwarty ? "border-primary" : ""}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-auto font-medium">
                    {nazwa(p)}
                    {otwarty && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-caption text-primary-foreground">{t("UI-PRJ-AKTYWNY")}</span>}
                  </span>
                  {!otwarty && (
                    <Button type="button" className="min-h-11" onClick={() => ustawAktywny(p.id)}>
                      {t("UI-PRJ-OTWORZ")}
                    </Button>
                  )}
                  {lista.projekty.length > 1 && (
                    <Button type="button" variant="ghost" className="min-h-11" onClick={() => usun(p.id)}>
                      {doUsuniecia === p.id ? t("UI-PRJ-USUN-POTWIERDZ") : t("UI-PRJ-USUN")}
                    </Button>
                  )}
                </div>
                <Pole label={t("UI-PRJ-NAZWA")} id={`nazwa-${p.id}`} value={p.nazwa} placeholder={nazwa(p)} onChange={(e) => zmienNazwe(p.id, e.target.value)} />
                <div className="flex flex-wrap items-center gap-3 text-caption text-muted-foreground">
                  {p.utworzonoIso && <span>{t("UI-PRJ-UTWORZONO", { data: data(p.utworzonoIso) })}</span>}
                  {lista.projekty.length > 1 && (
                    <PoleCheckbox
                      id={`porownaj-${p.id}`}
                      label={t("UI-PRJ-POROWNANIE-ZAZNACZ")}
                      checked={porownywane.includes(p.id)}
                      onChange={(e) => setPorownywane((x) => (e.target.checked ? [...x, p.id] : x.filter((y) => y !== p.id)))}
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="min-h-11" disabled={zajety} onClick={() => nowy(false)}>
            {t("UI-PRJ-NOWY")}
          </Button>
          <Button type="button" variant="outline" className="min-h-11" disabled={zajety} onClick={() => nowy(true)}>
            {t("UI-PRJ-KOPIA")}
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-h3 font-semibold">{t("UI-PRJ-WARTOSCI")}</h2>
        {zapisane.length === 0 ? (
          <p className="text-small text-muted-foreground">{t("UI-PRJ-WARTOSCI-BRAK")}</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-lg border">
            {zapisane.map((id) => {
              const w = aktywneWartosci![id]!
              return (
                <li key={id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-small">
                  <span className="mr-auto">
                    {t(WIELKOSCI[id].etykieta)}: <strong className="font-semibold">{liczba(w.v, id)}</strong>
                    <span className="block text-caption text-muted-foreground">{t("UI-PRJ-ZRODLO", { ekran: nazwaEkranu(w.zrodlo), data: data(w.iso) })}</span>
                  </span>
                  <Button type="button" variant="ghost" className="min-h-11" onClick={() => zapiszWartosci(lista.aktywnyId, { [id]: null }, "projekty")}>
                    {t("UI-PRJ-USUN-WARTOSC")}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {lista.projekty.length > 1 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-semibold">{t("UI-PRJ-POROWNANIE")}</h2>
          <p className="text-small text-muted-foreground">{t("UI-PRJ-POROWNANIE-OPIS")}</p>
          {kolumny.length >= 2 && <TabelaPorownania kolumny={kolumny} wartosci={wartosciKolumn} nazwa={nazwa} liczba={liczba} />}
        </section>
      )}
    </main>
  )
}

function TabelaPorownania({
  kolumny,
  wartosci,
  nazwa,
  liczba,
}: {
  kolumny: Projekt[]
  wartosci: Record<string, WartosciProjektu | null>
  nazwa: (p: Projekt) => string
  liczba: (v: string | undefined, id: WielkoscId) => string
}) {
  const t = useTranslate()
  const wiersze = ID_WIELKOSCI.filter((id) => kolumny.some((p) => wartosci[p.id]?.[id] !== undefined))
  if (wiersze.length === 0) return <p className="text-small text-muted-foreground">{t("UI-PRJ-POROWNANIE-BRAK")}</p>
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-small">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th scope="col" className="px-3 py-2 font-medium">{t("UI-PRJ-WIELKOSC")}</th>
            {kolumny.map((p) => (
              <th key={p.id} scope="col" className="px-3 py-2 font-medium">{nazwa(p)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GRUPY_WIELKOSCI.flatMap((g) => {
            const wGrupie = wiersze.filter((id) => WIELKOSCI[id].grupa === g)
            if (wGrupie.length === 0) return []
            return [
              <tr key={g} className="border-b bg-muted/20">
                <th colSpan={kolumny.length + 1} scope="colgroup" className="px-3 py-1.5 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  {t(KLUCZ_GRUPY[g])}
                </th>
              </tr>,
              ...wGrupie.map((id) => {
                const v = kolumny.map((p) => wartosci[p.id]?.[id]?.v)
                const rozne = v.some((x) => x === undefined || !takaSamaLiczba(x, v[0] ?? ""))
                return (
                  <tr key={id} className={`border-b last:border-0 ${rozne ? "bg-werdykt-uwaga/10" : ""}`}>
                    <th scope="row" className="px-3 py-2 text-left font-normal">
                      {t(WIELKOSCI[id].etykieta)}
                      {rozne && <span className="ml-1 text-caption text-muted-foreground">({t("UI-PRJ-ROZNI-SIE")})</span>}
                    </th>
                    {v.map((x, i) => (
                      <td key={kolumny[i]!.id} className="px-3 py-2 tabular-nums">{liczba(x, id)}</td>
                    ))}
                  </tr>
                )
              }),
            ]
          })}
        </tbody>
      </table>
    </div>
  )
}
