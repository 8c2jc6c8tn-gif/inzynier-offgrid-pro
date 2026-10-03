"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { importujCsv, type WynikImportu } from "@/lib/adapters/telemetria/import-csv"
import { IndexedDbMagazynProbek } from "@/lib/adapters/telemetria/magazyn-probek"
import { wczytajRejestr, zapiszRejestr } from "@/lib/adapters/telemetria/rejestr-zrodel"
import { pustyRejestr, usunProfil, usunZrodloZRejestru, zapiszProfil, zapiszZrodlo, type Rejestr } from "@/lib/core/telemetria/rejestr"
import type { ProfilCsv } from "@/lib/core/telemetria/csv"
import { profilDoFormularza, zbudujProfil, type FormularzProfilu } from "@/lib/core/telemetria/profil-formularza"
import { WIELKOSCI_LISTA } from "@/lib/core/telemetria/probka"
import { useTranslate } from "@/lib/i18n/language-context"

type TypNowego = "csv" | "symulator" | "http"

interface Szkic extends FormularzProfilu {
  nazwa: string
  typ: TypNowego
  url: string
  coS: string
  zrodloDocelowe: string
  krokS: string
  nazwaProfilu: string
  profilWybrany: string
}

const PUSTA_KOLUMNA = { kolumna: "", kanal: "", wielkosc: "napiecie", jednostka: "" }

const SZKIC_POCZATKOWY: Szkic = {
  nazwa: "",
  typ: "csv",
  url: "",
  coS: "5",
  zrodloDocelowe: "",
  krokS: "",
  nazwaProfilu: "",
  profilWybrany: "",
  bezNaglowka: false,
  kolumnaCzasu: "",
  formatCzasu: "iso",
  kolumnaGodziny: "",
  przesuniecieMin: "0",
  znaczniki: "",
  kolumny: [PUSTA_KOLUMNA],
}

const FORMATY: { id: FormularzProfilu["formatCzasu"]; klucz: string }[] = [
  { id: "iso", klucz: "UI-M13-TEL-FMT-ISO" },
  { id: "epoch-s", klucz: "UI-M13-TEL-FMT-EPOCH-S" },
  { id: "epoch-ms", klucz: "UI-M13-TEL-FMT-EPOCH-MS" },
  { id: "data-godzina", klucz: "UI-M13-TEL-FMT-DATA-GODZINA" },
  { id: "dmy", klucz: "UI-M13-TEL-FMT-DMY" },
]

const KLUCZE_BLEDOW = {
  "zla-liczba-kolumn": "UI-M13-TEL-BLAD-KOLUMNY",
  "zly-czas": "UI-M13-TEL-BLAD-CZAS",
  "zla-liczba": "UI-M13-TEL-BLAD-LICZBA",
} as const

export default function ZrodlaTelemetriiPage() {
  const t = useTranslate()
  // autosave: the form draft only; the registry itself is persisted on add/remove (own store, validated on read).
  const [zapisany, setSzkic] = usePersistedDraft<Szkic>("zrodla-telemetrii", SZKIC_POCZATKOWY)
  const szkic = useMemo<Szkic>(() => ({ ...SZKIC_POCZATKOWY, ...zapisany }), [zapisany])
  const ustaw = <K extends keyof Szkic>(pole: K, wartosc: Szkic[K]) => setSzkic((s) => ({ ...s, [pole]: wartosc }))

  const [rejestr, setRejestr] = useState<Rejestr>(pustyRejestr())
  const [uszkodzony, setUszkodzony] = useState(false)
  const [komunikatDodaj, setKomunikatDodaj] = useState<string | null>(null)
  const [plik, setPlik] = useState<{ nazwa: string; tekst: string } | null>(null)
  const [komunikatPliku, setKomunikatPliku] = useState<{ blad: boolean; tekst: string } | null>(null)
  const [trwa, setTrwa] = useState(false)
  const [wynik, setWynik] = useState<WynikImportu | null>(null)
  const [bladImportu, setBladImportu] = useState<string | null>(null)

  useEffect(() => {
    let aktywny = true
    wczytajRejestr(indexedDbStorageAdapter).then((w) => {
      if (!aktywny) return
      setRejestr(w.rejestr)
      setUszkodzony(w.uszkodzony)
    })
    return () => {
      aktywny = false
    }
  }, [])

  const zrodlaCsv = rejestr.zrodla.filter((z) => z.typ === "csv")
  const zrodloId = zrodlaCsv.some((z) => z.id === szkic.zrodloDocelowe) ? szkic.zrodloDocelowe : (zrodlaCsv[0]?.id ?? "")

  const zapiszZmiane = useCallback(async (nowy: Rejestr) => {
    setRejestr(nowy)
    await zapiszRejestr(indexedDbStorageAdapter, nowy)
  }, [])

  async function dodajZrodlo() {
    const nazwa = szkic.nazwa.trim()
    if (nazwa === "") return setKomunikatDodaj(t("UI-M13-TEL-DODAJ-BRAK-NAZWY"))
    if (szkic.typ === "http" && szkic.url.trim() === "") return setKomunikatDodaj(t("UI-M13-TEL-DODAJ-BRAK-URL"))
    const coMs = Math.max(1, Number(szkic.coS) || 5) * 1000
    await zapiszZmiane(
      zapiszZrodlo(rejestr, {
        id: crypto.randomUUID(),
        nazwa,
        typ: szkic.typ,
        ustawienia: szkic.typ === "http" ? { url: szkic.url.trim(), coMs } : {},
        demo: szkic.typ === "symulator",
      }),
    )
    setKomunikatDodaj(null)
    setSzkic((s) => ({ ...s, nazwa: "" }))
  }

  async function usunZrodlo(id: string, nazwa: string) {
    if (!window.confirm(t("UI-M13-TEL-USUN-POTWIERDZ", { nazwa }))) return
    await new IndexedDbMagazynProbek().usunZrodlo(id)
    await zapiszZmiane(usunZrodloZRejestru(rejestr, id))
  }

  async function wybierzPlik(plikWejsciowy: File | undefined) {
    setWynik(null)
    if (!plikWejsciowy) return setPlik(null)
    try {
      const tekst = await plikWejsciowy.text()
      setPlik({ nazwa: plikWejsciowy.name, tekst })
      setKomunikatPliku({ blad: false, tekst: t("UI-M13-TEL-PLIK-WCZYTANO", { znaki: tekst.length, nazwa: plikWejsciowy.name }) })
    } catch {
      setPlik(null)
      setKomunikatPliku({ blad: true, tekst: t("UI-M13-TEL-PLIK-BLAD") })
    }
  }

  async function importuj() {
    setWynik(null)
    setBladImportu(null)
    if (!plik) return setBladImportu(t("UI-M13-TEL-IMPORT-BRAK-PLIKU"))
    if (zrodloId === "") return setBladImportu(t("UI-M13-TEL-IMPORT-BRAK-ZRODLA"))
    const krokMs = Number(szkic.krokS) * 1000
    if (!(krokMs > 0)) return setBladImportu(t("UI-M13-TEL-IMPORT-KROK-BLAD"))
    const profil = zbudujProfil(szkic)
    if (!profil.ok) return setBladImportu(t("UI-M13-TEL-IMPORT-PROFIL-BLAD"))
    setTrwa(true)
    try {
      setWynik(await importujCsv(plik.tekst, profil.profil, zrodloId, krokMs, new IndexedDbMagazynProbek()))
    } catch (e) {
      setBladImportu(t("UI-M13-TEL-IMPORT-BLAD", { powod: e instanceof Error ? e.message : String(e) }))
    } finally {
      setTrwa(false)
    }
  }

  const [komunikatProfilu, setKomunikatProfilu] = useState<{ blad: boolean; tekst: string } | null>(null)

  async function zapiszProfilZFormularza() {
    const nazwa = szkic.nazwaProfilu.trim()
    if (nazwa === "") return setKomunikatProfilu({ blad: true, tekst: t("UI-M13-TEL-PROFIL-BRAK-NAZWY") })
    const profil = zbudujProfil(szkic)
    if (!profil.ok) return setKomunikatProfilu({ blad: true, tekst: t("UI-M13-TEL-IMPORT-PROFIL-BLAD") })
    // same name = overwrite the earlier profile (one profile per name), otherwise a new id
    const istniejacy = rejestr.profile.find((p) => p.nazwa === nazwa)
    const id = istniejacy?.id ?? crypto.randomUUID()
    await zapiszZmiane(zapiszProfil(rejestr, { id, nazwa, profil: profil.profil }))
    setSzkic((s) => ({ ...s, profilWybrany: id }))
    setKomunikatProfilu({ blad: false, tekst: t("UI-M13-TEL-PROFIL-ZAPISANO", { nazwa }) })
  }

  function wczytajProfil() {
    const wybrany = rejestr.profile.find((p) => p.id === szkic.profilWybrany)
    if (!wybrany) return setKomunikatProfilu({ blad: true, tekst: t("UI-M13-TEL-PROFIL-BRAK-WYBORU") })
    setSzkic((s) => ({ ...s, ...profilDoFormularza(wybrany.profil as ProfilCsv), nazwaProfilu: wybrany.nazwa }))
    setKomunikatProfilu({ blad: false, tekst: t("UI-M13-TEL-PROFIL-WCZYTANO", { nazwa: wybrany.nazwa }) })
  }

  async function usunWybranyProfil() {
    const wybrany = rejestr.profile.find((p) => p.id === szkic.profilWybrany)
    if (!wybrany) return setKomunikatProfilu({ blad: true, tekst: t("UI-M13-TEL-PROFIL-BRAK-WYBORU") })
    if (!window.confirm(t("UI-M13-TEL-PROFIL-USUN-POTWIERDZ", { nazwa: wybrany.nazwa }))) return
    await zapiszZmiane(usunProfil(rejestr, wybrany.id))
    setSzkic((s) => ({ ...s, profilWybrany: "" }))
    setKomunikatProfilu(null)
  }

  const ustawKolumne = (i: number, zmiana: Partial<Szkic["kolumny"][number]>) =>
    setSzkic((s) => ({ ...s, kolumny: s.kolumny.map((k, j) => (j === i ? { ...k, ...zmiana } : k)) }))

  const { jakosc } = wynik ?? {}

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zrodla-telemetrii" />
      <NaglowekEkranu tytul={t("UI-M13-TEL-TYTUL")} ekran="zrodla-telemetrii">
        {t("UI-M13-TEL-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3" aria-labelledby="tel-zrodla">
        <h2 id="tel-zrodla" className="text-base font-semibold">{t("UI-M13-TEL-ZRODLA")}</h2>
        {uszkodzony && <p role="alert" className="text-small">{t("UI-M13-TEL-REJESTR-USZKODZONY")}</p>}
        {rejestr.zrodla.length === 0 ? (
          <StanPusty tytul={t("UI-M13-TEL-ZRODLA")}>
            <p>{t("UI-M13-TEL-ZRODLA-PUSTO")}</p>
          </StanPusty>
        ) : (
          <ul className="flex flex-col gap-2">
            {rejestr.zrodla.map((z) => (
              <li key={z.id} className="flex items-center justify-between gap-2 rounded-md border p-3 text-small">
                <span className="flex flex-col">
                  <span className="font-medium">{z.nazwa}</span>
                  <span className="text-caption text-muted-foreground">
                    {t(z.typ === "csv" ? "UI-M13-TEL-TYP-CSV" : z.typ === "http" ? "UI-M13-TEL-TYP-HTTP" : "UI-M13-TEL-TYP-SYMULATOR")}
                    {z.demo ? ` · ${t("UI-M13-TEL-DEMO")}` : ""}
                  </span>
                </span>
                <Button type="button" variant="outline" onClick={() => usunZrodlo(z.id, z.nazwa)}>
                  {t("UI-M13-TEL-USUN")}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="tel-dodaj">
        <h2 id="tel-dodaj" className="text-base font-semibold">{t("UI-M13-TEL-DODAJ-TYTUL")}</h2>
        <Pole label={t("UI-M13-TEL-NAZWA")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="nazwa" />} value={szkic.nazwa} onChange={(e) => ustaw("nazwa", e.target.value)} />
        <PoleSelect label={t("UI-M13-TEL-TYP")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="typ" />} value={szkic.typ} onChange={(e) => ustaw("typ", e.target.value as TypNowego)}>
          <option value="csv">{t("UI-M13-TEL-TYP-CSV")}</option>
          <option value="symulator">{t("UI-M13-TEL-TYP-SYMULATOR")}</option>
          <option value="http">{t("UI-M13-TEL-TYP-HTTP")}</option>
        </PoleSelect>
        {szkic.typ === "http" && (
          <>
            <Pole label={t("UI-M13-TEL-URL")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="url" />} inputMode="url" value={szkic.url} onChange={(e) => ustaw("url", e.target.value)} />
            <Pole label={t("UI-M13-TEL-CO")} unit="s" pomoc={<PomocPola ekran="zrodla-telemetrii" pole="coS" />} inputMode="decimal" value={szkic.coS} onChange={(e) => ustaw("coS", e.target.value)} />
          </>
        )}
        {komunikatDodaj && <p role="alert" className="text-small text-werdykt-blad-foreground">{komunikatDodaj}</p>}
        <Button type="button" onClick={dodajZrodlo}>{t("UI-M13-TEL-DODAJ")}</Button>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="tel-import">
        <h2 id="tel-import" className="text-base font-semibold">{t("UI-M13-TEL-IMPORT-TYTUL")}</h2>
        {zrodlaCsv.length === 0 ? (
          <p className="text-small text-muted-foreground">{t("UI-M13-TEL-IMPORT-BRAK-ZRODLA")}</p>
        ) : (
          <>
            <PoleSelect label={t("UI-M13-TEL-IMPORT-ZRODLO")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="zrodloDocelowe" />} value={zrodloId} onChange={(e) => ustaw("zrodloDocelowe", e.target.value)}>
              {zrodlaCsv.map((z) => (
                <option key={z.id} value={z.id}>{z.nazwa}</option>
              ))}
            </PoleSelect>
            <label className="flex flex-col gap-1 text-small">
              <span className="font-medium">{t("UI-M13-TEL-PLIK")}</span>
              <input type="file" accept=".csv,.txt,text/csv,text/plain" onChange={(e) => wybierzPlik(e.target.files?.[0])} />
            </label>
            {komunikatPliku && (
              <p role={komunikatPliku.blad ? "alert" : "status"} className="text-caption text-muted-foreground">{komunikatPliku.tekst}</p>
            )}
            {rejestr.profile.length > 0 && (
              <div className="flex flex-col gap-2 rounded-md border p-3">
                <PoleSelect label={t("UI-M13-TEL-PROFIL-WYBOR")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="profilWybor" />} value={szkic.profilWybrany} onChange={(e) => ustaw("profilWybrany", e.target.value)}>
                  <option value="">{t("UI-M13-TEL-PROFIL-NIE-WYBRANO")}</option>
                  {rejestr.profile.map((p) => (
                    <option key={p.id} value={p.id}>{p.nazwa}</option>
                  ))}
                </PoleSelect>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={wczytajProfil}>{t("UI-M13-TEL-PROFIL-WCZYTAJ")}</Button>
                  <Button type="button" variant="outline" onClick={usunWybranyProfil}>{t("UI-M13-TEL-PROFIL-USUN")}</Button>
                </div>
              </div>
            )}
            <PoleCheckbox
              id="tel-bez-naglowka"
              label={
                <span className="flex items-center gap-1.5">
                  {t("UI-M13-TEL-BEZ-NAGLOWKA")}
                  <PomocPola ekran="zrodla-telemetrii" pole="bezNaglowka" />
                </span>
              }
              checked={szkic.bezNaglowka}
              onChange={(e) => ustaw("bezNaglowka", e.target.checked)}
            />
            <Pole label={t("UI-M13-TEL-KOL-CZASU")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="kolCzasu" />} value={szkic.kolumnaCzasu} onChange={(e) => ustaw("kolumnaCzasu", e.target.value)} />
            <PoleSelect label={t("UI-M13-TEL-FORMAT-CZASU")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="formatCzasu" />} value={szkic.formatCzasu} onChange={(e) => ustaw("formatCzasu", e.target.value as Szkic["formatCzasu"])}>
              {FORMATY.map((f) => (
                <option key={f.id} value={f.id}>{t(f.klucz)}</option>
              ))}
            </PoleSelect>
            {(szkic.formatCzasu === "data-godzina" || szkic.formatCzasu === "dmy") && (
              <Pole label={t("UI-M13-TEL-KOL-GODZINY")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="kolGodziny" />} value={szkic.kolumnaGodziny} onChange={(e) => ustaw("kolumnaGodziny", e.target.value)} />
            )}
            <Pole label={t("UI-M13-TEL-PRZESUNIECIE")} unit="min" pomoc={<PomocPola ekran="zrodla-telemetrii" pole="przesuniecie" />} inputMode="numeric" value={szkic.przesuniecieMin} onChange={(e) => ustaw("przesuniecieMin", e.target.value)} />
            <Pole label={t("UI-M13-TEL-KROK")} unit="s" pomoc={<PomocPola ekran="zrodla-telemetrii" pole="krok" />} inputMode="decimal" value={szkic.krokS} onChange={(e) => ustaw("krokS", e.target.value)} />
            <Pole label={t("UI-M13-TEL-ZNACZNIKI")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="znaczniki" />} value={szkic.znaczniki} onChange={(e) => ustaw("znaczniki", e.target.value)} />

            <h3 className="text-small font-semibold">{t("UI-M13-TEL-KOLUMNY")}</h3>
            {szkic.kolumny.map((k, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-md border p-3">
                <Pole label={t("UI-M13-TEL-KOL-NAZWA")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="kolNazwa" />} value={k.kolumna} onChange={(e) => ustawKolumne(i, { kolumna: e.target.value })} />
                <Pole label={t("UI-M13-TEL-KANAL")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="kanal" />} value={k.kanal} onChange={(e) => ustawKolumne(i, { kanal: e.target.value })} />
                <PoleSelect label={t("UI-M13-TEL-WIELKOSC")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="wielkosc" />} value={k.wielkosc} onChange={(e) => ustawKolumne(i, { wielkosc: e.target.value })}>
                  {WIELKOSCI_LISTA.map((w) => (
                    <option key={w} value={w}>{t(`UI-M13-TEL-W-${w.toUpperCase()}`)}</option>
                  ))}
                </PoleSelect>
                <Pole label={t("UI-M13-TEL-JEDNOSTKA")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="jednostka" />} value={k.jednostka} onChange={(e) => ustawKolumne(i, { jednostka: e.target.value })} />
                {szkic.kolumny.length > 1 && (
                  <Button type="button" variant="outline" onClick={() => setSzkic((s) => ({ ...s, kolumny: s.kolumny.filter((_, j) => j !== i) }))}>
                    {t("UI-M13-TEL-USUN-KOLUMNE")}
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => setSzkic((s) => ({ ...s, kolumny: [...s.kolumny, PUSTA_KOLUMNA] }))}>
              {t("UI-M13-TEL-DODAJ-KOLUMNE")}
            </Button>

            <div className="flex flex-col gap-2 rounded-md border p-3">
              <Pole label={t("UI-M13-TEL-PROFIL-NAZWA")} pomoc={<PomocPola ekran="zrodla-telemetrii" pole="profilNazwa" />} value={szkic.nazwaProfilu} onChange={(e) => ustaw("nazwaProfilu", e.target.value)} />
              <Button type="button" variant="outline" onClick={zapiszProfilZFormularza}>{t("UI-M13-TEL-PROFIL-ZAPISZ")}</Button>
              {komunikatProfilu && (
                <p role={komunikatProfilu.blad ? "alert" : "status"} className={komunikatProfilu.blad ? "text-small text-werdykt-blad-foreground" : "text-caption text-muted-foreground"}>{komunikatProfilu.tekst}</p>
              )}
            </div>

            {bladImportu && <p role="alert" className="text-small text-werdykt-blad-foreground">{bladImportu}</p>}
            <Button type="button" onClick={importuj} disabled={trwa}>
              {trwa ? t("UI-M13-TEL-IMPORT-TRWA") : t("UI-M13-TEL-IMPORTUJ")}
            </Button>
          </>
        )}

        {wynik && jakosc && (
          <section className="flex flex-col gap-2 rounded-md border p-3 text-small" aria-labelledby="tel-raport">
            <h3 id="tel-raport" className="font-semibold">{t("UI-M13-TEL-RAPORT-TYTUL")}</h3>
            <p>{t("UI-M13-TEL-RAPORT-ZAPISANE", { n: wynik.zapisane })}</p>
            {wynik.bledy.length > 0 && (
              <div>
                <p>{t("UI-M13-TEL-RAPORT-BLEDY", { n: wynik.bledy.length })}</p>
                <ul className="list-disc pl-5 text-caption text-muted-foreground">
                  {wynik.bledy.slice(0, 5).map((b, i) => (
                    <li key={i}>{t("UI-M13-TEL-RAPORT-BLEDY-PRZYKLAD", { wiersz: b.wiersz, powod: t(KLUCZE_BLEDOW[b.powod]) })}</li>
                  ))}
                </ul>
              </div>
            )}
            {jakosc.duplikaty > 0 && <p>{t("UI-M13-TEL-RAPORT-DUPLIKATY")}: {jakosc.duplikaty}</p>}
            {jakosc.pozaZakresem > 0 && <p>{t("UI-M13-TEL-RAPORT-POZA")}: {jakosc.pozaZakresem}</p>}
            {jakosc.brakWartosci > 0 && <p>{t("UI-M13-TEL-RAPORT-BRAK")}: {jakosc.brakWartosci}</p>}
            {jakosc.luki.length > 0 && (
              <div>
                <p>{t("UI-M13-TEL-RAPORT-LUKI", { n: jakosc.luki.length })}</p>
                <ul className="list-disc pl-5 text-caption text-muted-foreground">
                  {jakosc.luki.slice(0, 5).map((l, i) => (
                    <li key={i}>{t("UI-M13-TEL-RAPORT-LUKA", { seria: l.seria, od: new Date(l.od).toISOString(), do: new Date(l.do).toISOString() })}</li>
                  ))}
                </ul>
              </div>
            )}
            {jakosc.zamrozone.length > 0 && (
              <div>
                <p>{t("UI-M13-TEL-RAPORT-ZAMROZONE")}</p>
                <ul className="list-disc pl-5 text-caption text-muted-foreground">
                  {jakosc.zamrozone.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {wynik.bledy.length === 0 && jakosc.duplikaty + jakosc.pozaZakresem + jakosc.brakWartosci + jakosc.luki.length + jakosc.zamrozone.length === 0 && (
              <p>{t("UI-M13-TEL-RAPORT-CZYSTO")}</p>
            )}
          </section>
        )}
      </section>

      <Link href="/kalkulatory/tryb-live" className="text-small underline">{t("UI-M13-TEL-LINK-TRYB-LIVE")}</Link>
    </main>
  )
}
