"use client"

import { useMemo, useState } from "react"
import { calculateTestLicznika } from "@/lib/core/modules/siec/test-licznika/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { Button } from "@/components/ui/button"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, poziomWerdyktu } from "@/components/siec/wspolne"
import { useLanguage, useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type Pomiar = { impulsy: string; czas: string; stala: string; odbiornik: string }

type Pismo = {
  nadawca: string
  adres: string
  nip: string
  numerKlienta: string
  ppe: string
  faktura: string
  opis: string
  zadanie: string | null
  miejscowoscData: string
}

/**
 * Elements of the complaint letter — material „Przedsiębiorcy…” §7.2 (✅ list of elements). The letter
 * text follows the UI language (owner decision 02.10.2026); user-typed fields are copied as entered.
 * `zadanie` is null until the user edits it, so the default wording follows the language.
 */
type Tlumacz = (kod: string, params?: Record<string, string | number>) => string

function trescPisma(t: Tlumacz, p: Pismo, mocKw: number | null, jezyk: string): string {
  const linie = [
    p.miejscowoscData,
    "",
    p.nadawca,
    p.adres,
    p.nip ? t("UI-TESLIC-PISMO-NIP", { v: p.nip }) : "",
    t("UI-TESLIC-PISMO-NUMER-KLIENTA", { v: p.numerKlienta }),
    t("UI-TESLIC-PISMO-PPE", { v: p.ppe }),
    "",
    t("UI-TESLIC-PISMO-REKLAMACJA"),
    "",
    t("UI-TESLIC-PISMO-FAKTURA", { v: p.faktura }),
    "",
    p.opis,
    mocKw !== null
      ? t("UI-TESLIC-PISMO-MOC", { moc: mocKw.toLocaleString(jezyk, { maximumFractionDigits: 3 }) })
      : "",
    "",
    p.zadanie ?? t("UI-TESLIC-PISMO-ZADANIE-DOMYSLNE"),
    "",
    t("UI-TESLIC-PISMO-PODPIS"),
  ]
  return linie.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n")
}

export default function TestLicznikaPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const jezyk = useLanguage()
  const [pomiar, setPomiar] = usePersistedDraft<Pomiar>("siec-test-licznika", { impulsy: "", czas: "", stala: "", odbiornik: "" })
  // Letter data (personal) is kept only in memory, not in the saved draft.
  const [pismo, setPismo] = useState<Pismo>({
    nadawca: "",
    adres: "",
    nip: "",
    numerKlienta: "",
    ppe: "",
    faktura: "",
    opis: "",
    zadanie: null,
    miejscowoscData: "",
  })
  const [skopiowano, setSkopiowano] = useState(false)
  const ustawP = <K extends keyof Pomiar>(pole: K, v: string) => setPomiar((p) => ({ ...p, [pole]: v }))
  const ustawL = <K extends keyof Pismo>(pole: K, v: string) => setPismo((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateTestLicznika({
        liczbaImpulsow: liczba(pomiar.impulsy),
        czasS: liczba(pomiar.czas),
        stalaImpKwh: liczba(pomiar.stala),
        mocOdbiornikaW: liczbaLubNull(pomiar.odbiornik),
      }),
    [pomiar],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const tekst = trescPisma(t, pismo, result.status === "VALID" ? result.value.mocZLicznikaKw : null, jezyk)

  async function kopiuj() {
    try {
      await navigator.clipboard.writeText(tekst)
      setSkopiowano(true)
    } catch {
      setSkopiowano(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/test-licznika" />
      <NaglowekEkranu tytul={t("UI-TESLIC-TEST-LICZNIKA-REKLAMACJA")} ekran="test-licznika" wynik={result}>
        {t("UI-TESLIC-SPRAWDZ-ILE-MOCY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small text-muted-foreground">
          {t("UI-TESLIC-WYLACZ-WSZYSTKO-POZA")}
        </p>
        <Pole
          label={t("UI-TESLIC-LICZBA-IMPULSOW")}
          type="number"
          inputMode="numeric"
          value={pomiar.impulsy}
          onChange={(e) => ustawP("impulsy", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="impulsy" />}
        />
        <Pole
          label={t("UI-TESLIC-CZAS-TYCH-IMPULSOW")}
          unit="s"
          type="number"
          inputMode="decimal"
          value={pomiar.czas}
          onChange={(e) => ustawP("czas", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="czas" />}
        />
        <Pole
          label={t("UI-TESLIC-STALA-LICZNIKA")}
          unit={t("UI-TESLIC-IMP-KWH")}
          type="number"
          inputMode="numeric"
          value={pomiar.stala}
          onChange={(e) => ustawP("stala", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="stala" />}
        />
        <Pole
          label={t("UI-TESLIC-MOC-WLACZONEGO-ODBIORNIKA")}
          unit="W"
          type="number"
          inputMode="decimal"
          value={pomiar.odbiornik}
          onChange={(e) => ustawP("odbiornik", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="mocOdbiornika" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-TESLIC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "VALID" && poziom !== null ? (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-TESLIC-MOC-ZAREJESTROWANA-LICZNIK")}>
          <WynikGlowny>{formatLiczbe(result.value.mocZLicznikaKw, { maximumFractionDigits: 3 })} kW</WynikGlowny>
          {result.value.roznicaProcent !== null && (
            <p className="mt-1 text-small">
              {t("UI-TESLIC-ROZNICA-WZGLEDEM-ODBIORNIKA", { p: result.value.roznicaProcent > 0 ? "+" : "", roznicaProcent: formatLiczbe(result.value.roznicaProcent, { maximumFractionDigits: 1 }) })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      ) : (
        <p className="text-small text-muted-foreground">{t("UI-TESLIC-WPISZ-IMPULSY-CZAS")}</p>
      )}

      <SekcjaAkordeon tytul={t("UI-TESLIC-REKLAMACJA-BADANIE-LICZNIKA")}>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-small">
          <li>
            {t("UI-TESLIC-DNI-TERMIN")} <strong>{t("UI-TESLIC-ODPOWIEDZI")}</strong> {t("UI-TESLIC-PRZEDSIEBIORSTWA-REKLAMACJE-")}
          </li>
          <li>{t("UI-TESLIC-JESLI-REKLAMACJA-POMOZE")}</li>
          <li>
            {t("UI-TESLIC-KOSZT-BADANIA-POKRYWASZ")} <strong>{t("UI-TESLIC-CHYBA")}</strong> {t("UI-TESLIC-WYKAZE-ONO-NIEPRAWIDLOWOSCI")}
          </li>
        </ul>
      </SekcjaAkordeon>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium">{t("UI-TESLIC-PISMO-REKLAMACYJNE")}</h2>
        <Pole
          label={t("UI-TESLIC-IMIE-NAZWISKO-ALBO")}
          value={pismo.nadawca}
          onChange={(e) => ustawL("nadawca", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="nadawca" />}
        />
        <Pole
          label={t("UI-TESLIC-ADRES")}
          value={pismo.adres}
          onChange={(e) => ustawL("adres", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="adres" />}
        />
        <Pole
          label={t("UI-TESLIC-NIP-TYLKO-FIRMA")}
          value={pismo.nip}
          onChange={(e) => ustawL("nip", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="nip" />}
        />
        <Pole
          label={t("UI-TESLIC-NUMER-KLIENTA")}
          value={pismo.numerKlienta}
          onChange={(e) => ustawL("numerKlienta", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="numerKlienta" />}
        />
        <Pole
          label={t("UI-TESLIC-NUMER-PPE")}
          value={pismo.ppe}
          onChange={(e) => ustawL("ppe", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="ppe" />}
        />
        <Pole
          label={t("UI-TESLIC-NUMER-DATA-FAKTURY")}
          value={pismo.faktura}
          onChange={(e) => ustawL("faktura", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="faktura" />}
        />
        <Pole
          label={t("UI-TESLIC-OPIS-PROBLEMU")}
          value={pismo.opis}
          onChange={(e) => ustawL("opis", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="opis" />}
        />
        <Pole
          label={t("UI-TESLIC-ZADANIE")}
          value={pismo.zadanie ?? t("UI-TESLIC-PISMO-ZADANIE-DOMYSLNE")}
          onChange={(e) => ustawL("zadanie", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="zadanie" />}
        />
        <Pole
          label={t("UI-TESLIC-MIEJSCOWOSC-DATA")}
          value={pismo.miejscowoscData}
          onChange={(e) => ustawL("miejscowoscData", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="miejscowosc" />}
        />
        <pre className="whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-small">{tekst}</pre>
        <Button type="button" onClick={kopiuj}>
          {skopiowano ? t("UI-TESLIC-SKOPIOWANO") : t("UI-TESLIC-KOPIUJ-TRESC-PISMA")}
        </Button>
        <p className="text-small text-muted-foreground">{t("UI-TESLIC-DANE-PISMA-ZAPISYWANE")}</p>
      </div>
    </main>
  )
}
