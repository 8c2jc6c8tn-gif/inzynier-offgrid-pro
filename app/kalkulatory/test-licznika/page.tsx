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

type Pomiar = { impulsy: string; czas: string; stala: string; odbiornik: string }

type Pismo = {
  nadawca: string
  adres: string
  nip: string
  numerKlienta: string
  ppe: string
  faktura: string
  opis: string
  zadanie: string
  miejscowoscData: string
}

/** Elements of the complaint letter — material „Przedsiębiorcy…” §7.2 (✅ list of elements). */
const ZADANIE_DOMYSLNE = "Wnoszę o weryfikację poprawności działania układu pomiarowego oraz korektę faktury."

function trescPisma(p: Pismo, mocKw: number | null): string {
  const linie = [
    p.miejscowoscData,
    "",
    p.nadawca,
    p.adres,
    p.nip ? `NIP: ${p.nip}` : "",
    `Numer klienta: ${p.numerKlienta}`,
    `Numer punktu poboru energii (PPE): ${p.ppe}`,
    "",
    "REKLAMACJA",
    "",
    `Dotyczy faktury: ${p.faktura}`,
    "",
    p.opis,
    mocKw !== null
      ? `Przy teście diody licznika zarejestrowana moc wyniosła ${mocKw.toLocaleString("pl-PL", { maximumFractionDigits: 3 })} kW.`
      : "",
    "",
    p.zadanie,
    "",
    "Podpis: ____________________",
  ]
  return linie.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n")
}

export default function TestLicznikaPage() {
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
    zadanie: ZADANIE_DOMYSLNE,
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
  const tekst = trescPisma(pismo, result.status === "VALID" ? result.value.mocZLicznikaKw : null)

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
      <NaglowekEkranu tytul="Test licznika i reklamacja" ekran="test-licznika" wzor={result.formula}>
        Sprawdź, ile mocy rejestruje licznik (dioda migająca przy każdej porcji energii), a przy wątpliwościach przygotuj
        pismo reklamacyjne. Ekran wspólny dla domu (D12) i firmy (F11), M14.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small text-muted-foreground">
          Wyłącz wszystko poza jednym odbiornikiem o znanej mocy (np. czajnik), policz impulsy diody i zmierz ich czas.
          Stałą licznika (imp/kWh) znajdziesz na tabliczce.
        </p>
        <Pole
          label="Liczba impulsów"
          type="number"
          inputMode="numeric"
          value={pomiar.impulsy}
          onChange={(e) => ustawP("impulsy", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="impulsy" />}
        />
        <Pole
          label="Czas tych impulsów"
          unit="s"
          type="number"
          inputMode="decimal"
          value={pomiar.czas}
          onChange={(e) => ustawP("czas", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="czas" />}
        />
        <Pole
          label="Stała licznika"
          unit="imp/kWh"
          type="number"
          inputMode="numeric"
          value={pomiar.stala}
          onChange={(e) => ustawP("stala", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="stala" />}
        />
        <Pole
          label="Moc włączonego odbiornika (opcjonalnie)"
          unit="W"
          type="number"
          inputMode="decimal"
          value={pomiar.odbiornik}
          onChange={(e) => ustawP("odbiornik", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="mocOdbiornika" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "VALID" && poziom !== null ? (
        <WerdyktPanel poziom={poziom} etykieta="Moc zarejestrowana przez licznik">
          <WynikGlowny>{result.value.mocZLicznikaKw.toLocaleString("pl-PL", { maximumFractionDigits: 3 })} kW</WynikGlowny>
          {result.value.roznicaProcent !== null && (
            <p className="mt-1 text-small">
              Różnica względem odbiornika: {result.value.roznicaProcent > 0 ? "+" : ""}
              {result.value.roznicaProcent.toLocaleString("pl-PL", { maximumFractionDigits: 1 })}%.
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      ) : (
        <p className="text-small text-muted-foreground">Wpisz impulsy, czas i stałą licznika.</p>
      )}

      <SekcjaAkordeon tytul="Reklamacja i badanie licznika — terminy">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-small">
          <li>
            14 dni to termin <strong>odpowiedzi</strong> przedsiębiorstwa na reklamację (zgodne źródła wtórne) — termin jej
            złożenia wynika z umowy lub ogólnych warunków.
          </li>
          <li>Jeśli reklamacja nie pomoże, możesz zażądać laboratoryjnego badania układu pomiarowego (14 dni na badanie).</li>
          <li>
            Koszt badania pokrywasz Ty, <strong>chyba że</strong> wykaże ono nieprawidłowości — wtedy płaci przedsiębiorstwo.
            Kwoty badania różnią się między OSD — sprawdź aktualny cennik swojego operatora.
          </li>
        </ul>
      </SekcjaAkordeon>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium">Pismo reklamacyjne</h2>
        <Pole
          label="Imię i nazwisko albo nazwa firmy"
          value={pismo.nadawca}
          onChange={(e) => ustawL("nadawca", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="nadawca" />}
        />
        <Pole
          label="Adres"
          value={pismo.adres}
          onChange={(e) => ustawL("adres", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="adres" />}
        />
        <Pole
          label="NIP (tylko firma)"
          value={pismo.nip}
          onChange={(e) => ustawL("nip", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="nip" />}
        />
        <Pole
          label="Numer klienta"
          value={pismo.numerKlienta}
          onChange={(e) => ustawL("numerKlienta", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="numerKlienta" />}
        />
        <Pole
          label="Numer PPE"
          value={pismo.ppe}
          onChange={(e) => ustawL("ppe", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="ppe" />}
        />
        <Pole
          label="Numer i data faktury"
          value={pismo.faktura}
          onChange={(e) => ustawL("faktura", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="faktura" />}
        />
        <Pole
          label="Opis problemu"
          value={pismo.opis}
          onChange={(e) => ustawL("opis", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="opis" />}
        />
        <Pole
          label="Żądanie"
          value={pismo.zadanie}
          onChange={(e) => ustawL("zadanie", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="zadanie" />}
        />
        <Pole
          label="Miejscowość i data"
          value={pismo.miejscowoscData}
          onChange={(e) => ustawL("miejscowoscData", e.target.value)}
          pomoc={<PomocPola ekran="test-licznika" pole="miejscowosc" />}
        />
        <pre className="whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-small">{tekst}</pre>
        <Button type="button" onClick={kopiuj}>
          {skopiowano ? "Skopiowano" : "Kopiuj treść pisma"}
        </Button>
        <p className="text-small text-muted-foreground">Dane pisma nie są zapisywane w aplikacji.</p>
      </div>
    </main>
  )
}
