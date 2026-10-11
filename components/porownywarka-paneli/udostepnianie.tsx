"use client"

/**
 * Udostępnianie porównania (spec 43): wysyłanie linkiem (`#udostepnij=…`) albo plikiem `.json` oraz odbiór — z linku otwartego w przeglądarce,
 * wklejonego kodu albo pliku. Odebrane dane są obce: logika sprawdzenia i przepisania pól jest w `lib/porownywarka-paneli/udostepnianie.ts`,
 * a odbiorca zawsze dostaje je jako NOWY zestaw w „Moich zestawach” po kliknięciu (nigdy w miejsce formularza, nad którym pracuje).
 */
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"
import { useDenominacja } from "@/lib/waluta/use-waluta"
import { pobierzPlikTekstowy } from "@/lib/porownywarka-paneli/eksport-wynikow"
import type { FormularzStan } from "@/lib/porownywarka-paneli/stan"
import {
  kodZTekstu,
  linkDoPorownania,
  MAKS_DLUGOSC_LINKU,
  odczytajPaczkeZJson,
  odkodujZLinku,
  paczkaDoJson,
  stanWWalucie,
  zakodujDoLinku,
  zbudujPaczke,
  type BladPaczki,
  type PaczkaPorownania,
  type WynikOdczytuPaczki,
} from "@/lib/porownywarka-paneli/udostepnianie"

const MAKS_PLIK_B = 200_000

type StanWysylki = { rodzaj: "brak" } | { rodzaj: "skopiowano" } | { rodzaj: "reczne"; link: string } | { rodzaj: "za-dlugi"; znaki: number }

export function UdostepnianiePorownania(p: {
  stan: FormularzStan
  /** Fragment of the page address when it carries a shared comparison (`udostepnij=…` already cut out), otherwise `null`. */
  kodZLinku: string | null
  onKodObsluzony: () => void
  /** Adds the received comparison as a new saved set and returns the name it got. */
  onDodaj: (stan: FormularzStan) => string
  /** `false` until the saved sets are read: adding earlier would be overwritten by that read. */
  gotowe: boolean
}) {
  const t = useTranslate()
  const denom = useDenominacja()
  const [wysylka, setWysylka] = useState<StanWysylki>({ rodzaj: "brak" })
  const [wklejony, setWklejony] = useState("")
  const [odebrane, setOdebrane] = useState<PaczkaPorownania | null>(null)
  const [blad, setBlad] = useState<BladPaczki | "odczytu" | null>(null)
  const [dodano, setDodano] = useState<string | null>(null)
  const wejscie = useRef<HTMLInputElement>(null)

  const przyjmij = (w: WynikOdczytuPaczki) => {
    setDodano(null)
    if (w.ok) {
      setOdebrane(w.paczka)
      setBlad(null)
    } else {
      setOdebrane(null)
      setBlad(w.blad)
    }
  }

  const kodLinku = p.kodZLinku
  const obsluzony = p.onKodObsluzony
  useEffect(() => {
    if (kodLinku === null) return
    let aktywny = true
    void odkodujZLinku(kodLinku).then((w) => {
      if (!aktywny) return
      setDodano(null)
      if (w.ok) {
        setOdebrane(w.paczka)
        setBlad(null)
      } else {
        setOdebrane(null)
        setBlad(w.blad)
      }
      obsluzony()
    })
    return () => {
      aktywny = false
    }
  }, [kodLinku, obsluzony])

  const paczka = () => zbudujPaczke(p.stan, { kod: denom.kod, kurs: denom.kurs })

  async function kopiujLink() {
    const kod = await zakodujDoLinku(paczka())
    const link = linkDoPorownania(window.location.href, kod)
    if (link.length > MAKS_DLUGOSC_LINKU) {
      setWysylka({ rodzaj: "za-dlugi", znaki: link.length })
      return
    }
    try {
      await navigator.clipboard.writeText(link)
      setWysylka({ rodzaj: "skopiowano" })
    } catch {
      setWysylka({ rodzaj: "reczne", link })
    }
  }

  async function wczytajPlik(plik: File | undefined) {
    if (!plik) return
    if (plik.size > MAKS_PLIK_B) {
      przyjmij({ ok: false, blad: "za-duzy" })
      return
    }
    try {
      przyjmij(odczytajPaczkeZJson(await plik.text()))
    } catch {
      setOdebrane(null)
      setBlad("odczytu")
    }
    if (wejscie.current) wejscie.current.value = ""
  }

  const dodaj = () => {
    if (!odebrane) return
    setDodano(p.onDodaj(stanWWalucie(odebrane, denom)))
    setOdebrane(null)
    setWklejony("")
  }

  return (
    <div className="flex flex-col gap-3 text-small">
      {odebrane && (
        <div role="region" aria-label={t("UI-PORP-UDO-NAGLOWEK-ODBIOR")} className="flex flex-col gap-2 rounded-md border border-primary p-3">
          <p className="font-medium">{t("UI-PORP-UDO-NAGLOWEK-ODBIOR")}</p>
          <p>{t("UI-PORP-UDO-PODSUMOWANIE", { panele: odebrane.stan.panele.length, miejsca: odebrane.stan.miejsca.length, waluta: odebrane.waluta.kod })}</p>
          <p className="text-caption text-muted-foreground">{t("UI-PORP-UDO-NIEZAUFANE")}</p>
          <div className="flex flex-wrap gap-2">
            <Button className="min-h-11" onClick={dodaj} disabled={!p.gotowe}>
              {t("UI-PORP-UDO-DODAJ")}
            </Button>
            <Button variant="outline" className="min-h-11" onClick={() => setOdebrane(null)}>
              {t("UI-PORP-UDO-ODRZUC")}
            </Button>
          </div>
        </div>
      )}
      {dodano && <p role="status">{t("UI-PORP-UDO-DODANO", { nazwa: dodano })}</p>}
      {blad && <p role="alert" className="text-destructive">{t(`UI-PORP-UDO-BLAD-${blad}`)}</p>}

      <details className="rounded-md border p-3">
        <summary className="cursor-pointer font-medium">{t("UI-PORP-UDO-TYTUL")}</summary>
        <div className="mt-3 flex flex-col gap-3">
          <p className="text-caption text-muted-foreground">{t("UI-PORP-UDO-OPIS")}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => void kopiujLink()}>
              {t("UI-PORP-UDO-KOPIUJ")}
            </Button>
            <Button variant="outline" className="min-h-11" onClick={() => pobierzPlikTekstowy("porownanie-paneli.json", paczkaDoJson(paczka()), "application/json;charset=utf-8")}>
              {t("UI-PORP-UDO-PLIK-POBIERZ")}
            </Button>
          </div>
          {wysylka.rodzaj === "skopiowano" && <p role="status">{t("UI-PORP-UDO-SKOPIOWANO")}</p>}
          {wysylka.rodzaj === "za-dlugi" && <p role="alert" className="text-destructive">{t("UI-PORP-UDO-ZA-DLUGI", { znaki: wysylka.znaki, maks: MAKS_DLUGOSC_LINKU })}</p>}
          {wysylka.rodzaj === "reczne" && (
            <div className="flex flex-col gap-1">
              <p role="status">{t("UI-PORP-UDO-BRAK-SCHOWKA")}</p>
              <input readOnly value={wysylka.link} onFocus={(e) => e.currentTarget.select()} aria-label={t("UI-PORP-UDO-KOPIUJ")} className="rounded-md border px-2 py-1 text-caption" />
            </div>
          )}
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-48 flex-1">
              <Pole
                label={t("UI-PORP-UDO-WKLEJ")}
                type="text"
                value={wklejony}
                onChange={(e) => setWklejony(e.target.value)}
                pomoc={<PomocPola ekran="porownywarka-paneli" pole="udostepnijKod" />}
              />
            </div>
            <Button
              variant="outline"
              className="min-h-11"
              onClick={() => {
                const kod = kodZTekstu(wklejony)
                void odkodujZLinku(kod).then(przyjmij)
              }}
            >
              {t("UI-PORP-UDO-WCZYTAJ-KOD")}
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="udostepnij-plik" className="font-medium">
                {t("UI-PORP-UDO-PLIK")}
              </label>
              <PomocPola ekran="porownywarka-paneli" pole="udostepnijPlik" />
            </div>
            <input ref={wejscie} id="udostepnij-plik" type="file" accept=".json,application/json" className="text-small" onChange={(e) => void wczytajPlik(e.target.files?.[0])} />
          </div>
        </div>
      </details>
    </div>
  )
}
