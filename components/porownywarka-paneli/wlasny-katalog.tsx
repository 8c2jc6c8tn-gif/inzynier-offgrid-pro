"use client"

/**
 * Własny katalog paneli z pliku CSV (spec 42): cennik dostawcy albo własna tabela kart katalogowych. Wczytany plik najpierw pokazuje, które wiersze
 * przyjęto, a które odrzucono i dlaczego (walidacja silnika, nic nie jest dopełniane „typowymi” wartościami); dopiero przycisk zapisuje je w katalogu,
 * który zostaje tylko na tym urządzeniu. Z katalogu wybiera się panel do porównania tak samo jak z katalogu wbudowanego.
 */
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"
import {
  dolaczWpisy,
  importujKatalogCsv,
  MAKS_ROZMIAR_CSV_B,
  szablonCsv,
  type KomunikatImportu,
  type WlasnyKatalog,
  type WynikImportuCsv,
} from "@/lib/porownywarka-paneli/wlasny-katalog"
import { pobierzPlikTekstowy } from "@/lib/porownywarka-paneli/eksport-wynikow"

type Stan = { rodzaj: "brak" } | { rodzaj: "blad-rozmiaru" } | { rodzaj: "blad-odczytu" } | { rodzaj: "wynik"; plik: string; wynik: WynikImportuCsv }

export function WlasnyKatalogPaneli(p: { katalog: WlasnyKatalog; onKatalog: (k: WlasnyKatalog) => void }) {
  const t = useTranslate()
  const [stan, setStan] = useState<Stan>({ rodzaj: "brak" })
  const wejscie = useRef<HTMLInputElement>(null)
  const komunikat = (k: KomunikatImportu) => t(k.kod, k.params)
  const powod = (k: KomunikatImportu) => (k.pole ? `${k.pole}: ${komunikat(k)}` : komunikat(k))

  async function wczytaj(plik: File | undefined) {
    if (!plik) return
    if (plik.size > MAKS_ROZMIAR_CSV_B) {
      setStan({ rodzaj: "blad-rozmiaru" })
      return
    }
    try {
      setStan({ rodzaj: "wynik", plik: plik.name, wynik: importujKatalogCsv(await plik.text()) })
    } catch {
      setStan({ rodzaj: "blad-odczytu" })
    }
  }

  function zapisz(zastap: boolean) {
    if (stan.rodzaj !== "wynik") return
    p.onKatalog({ wpisy: dolaczWpisy(zastap ? [] : p.katalog.wpisy, stan.wynik.wpisy) })
    setStan({ rodzaj: "brak" })
    // The same file can then be chosen again after a correction.
    if (wejscie.current) wejscie.current.value = ""
  }

  const wynik = stan.rodzaj === "wynik" ? stan.wynik : null
  return (
    <details className="rounded-lg border p-3">
      <summary className="cursor-pointer text-small font-medium">{t("UI-PORP-CSV-TYTUL")}</summary>
      <div className="mt-3 flex flex-col gap-3 text-small">
        <p className="text-caption text-muted-foreground">{t("UI-PORP-CSV-OPIS")}</p>
        <div>
          <Button variant="outline" className="min-h-11" onClick={() => pobierzPlikTekstowy("wlasny-katalog-paneli-szablon.csv", szablonCsv())}>
            {t("UI-PORP-CSV-SZABLON")}
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label htmlFor="csv-katalog-plik" className="font-medium">
              {t("UI-PORP-CSV-PLIK")}
            </label>
            <PomocPola ekran="porownywarka-paneli" pole="csvPlik" />
          </div>
          <input
            ref={wejscie}
            id="csv-katalog-plik"
            type="file"
            accept=".csv,text/csv,text/plain"
            className="text-small"
            onChange={(e) => void wczytaj(e.target.files?.[0])}
          />
        </div>
        {stan.rodzaj === "blad-rozmiaru" && <p role="alert" className="text-destructive">{t("UI-PORP-CSV-ZA-DUZY", { mb: MAKS_ROZMIAR_CSV_B / 1_000_000 })}</p>}
        {stan.rodzaj === "blad-odczytu" && <p role="alert" className="text-destructive">{t("UI-PORP-CSV-BLAD-ODCZYTU")}</p>}
        {wynik?.bladPliku && <p role="alert" className="text-destructive">{komunikat(wynik.bladPliku)}</p>}
        {wynik && !wynik.bladPliku && stan.rodzaj === "wynik" && (
          <div className="flex flex-col gap-2 rounded-md border p-3">
            <p className="font-medium">{t("UI-PORP-CSV-PODSUMOWANIE", { plik: stan.plik, przyjete: wynik.wpisy.length, odrzucone: wynik.odrzucone.length })}</p>
            {wynik.pominieteKolumny.length > 0 && (
              <p className="text-muted-foreground">{t("UI-PORP-CSV-POMINIETE", { kolumny: wynik.pominieteKolumny.join(", ") })}</p>
            )}
            {wynik.uwagi.length > 0 && (
              <ul className="list-disc pl-5 text-muted-foreground">
                {wynik.uwagi.map((u) => (
                  <li key={u.wiersz}>{t("UI-PORP-CSV-WIERSZ", { n: u.wiersz })}: {komunikat(u.komunikat)}</li>
                ))}
              </ul>
            )}
            {wynik.odrzucone.length > 0 && (
              <ul className="list-disc pl-5" aria-label={t("UI-PORP-CSV-ODRZUCONE")}>
                {wynik.odrzucone.map((o) => (
                  <li key={o.wiersz}>
                    {t("UI-PORP-CSV-WIERSZ", { n: o.wiersz })}: {o.powody.map(powod).join("; ")}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              <Button className="min-h-11" disabled={wynik.wpisy.length === 0} onClick={() => zapisz(false)}>
                {t("UI-PORP-CSV-DOLACZ", { n: wynik.wpisy.length })}
              </Button>
              <Button variant="outline" className="min-h-11" disabled={wynik.wpisy.length === 0} onClick={() => zapisz(true)}>
                {t("UI-PORP-CSV-ZASTAP")}
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="font-medium">{t("UI-PORP-CSV-W-KATALOGU", { n: p.katalog.wpisy.length })}</p>
          {p.katalog.wpisy.length > 0 && (
            <>
              <ul className="flex flex-col gap-1">
                {p.katalog.wpisy.map((w) => (
                  <li key={w.wlId} className="flex items-center gap-2">
                    <span className="flex-1">{t("UI-PORP-CSV-POZYCJA", { nazwa: w.nazwa, moc: w.moc })}</span>
                    <Button variant="outline" className="min-h-11" onClick={() => p.onKatalog({ wpisy: p.katalog.wpisy.filter((x) => x.wlId !== w.wlId) })}>
                      {t("UI-PORP-CSV-USUN")}
                    </Button>
                  </li>
                ))}
              </ul>
              <div>
                <Button variant="outline" className="min-h-11" onClick={() => p.onKatalog({ wpisy: [] })}>
                  {t("UI-PORP-CSV-WYCZYSC")}
                </Button>
              </div>
            </>
          )}
        </div>
        <p className="text-caption text-muted-foreground">{t("UI-PORP-CSV-LOKALNIE")}</p>
      </div>
    </details>
  )
}

/** Wybór panelu z własnego katalogu do jednego panelu porównania; ukryty, gdy katalog jest pusty. */
export function WyborZWlasnegoKatalogu(p: { katalog: WlasnyKatalog; onWybierz: (wlId: string) => void }) {
  const t = useTranslate()
  if (p.katalog.wpisy.length === 0) return null
  return (
    <PoleSelect
      label={t("UI-PORP-CSV-WYBOR")}
      value=""
      onChange={(e) => e.target.value !== "" && p.onWybierz(e.target.value)}
      pomoc={<PomocPola ekran="porownywarka-paneli" pole="csvWybor" />}
    >
      <option value="">{t("UI-PORP-KATALOG-WYBIERZ")}</option>
      {p.katalog.wpisy.map((w) => (
        <option key={w.wlId} value={w.wlId}>
          {t("UI-PORP-CSV-POZYCJA", { nazwa: w.nazwa, moc: w.moc })}
        </option>
      ))}
    </PoleSelect>
  )
}
