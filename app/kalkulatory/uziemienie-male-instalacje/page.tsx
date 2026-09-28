"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateUziemienieMaleInstalacje } from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/calculator"
import type {
  MiejsceUziemienia,
  OdpowiedzKontrolna,
  RodzajMalejInstalacji,
} from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

/**
 * Schemat ze źródła (Biblia §12.53, "Efekt na ekranie"): "Falownik 230V musi mieć uziemioną obudowę. Gniazda 230V
 * podłącz do uziemienia pojazdu lub uziomu." Tylko to, co mówi źródło — bez szczegółów okablowania spoza niego.
 */
function SchematUziemienia() {
  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label="Schemat: obudowa falownika 230 V i styk ochronny gniazd 230 V połączone z uziemieniem pojazdu lub uziomem"
    >
      <rect x="30" y="20" width="130" height="56" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="95" y="44" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        Falownik 230 V
      </text>
      <text x="95" y="60" textAnchor="middle" className="fill-current text-[9px]">
        zacisk PE obudowy
      </text>

      <rect x="240" y="20" width="130" height="56" rx="4" className="fill-amber-400/70 stroke-current" />
      <text x="305" y="44" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        Gniazda 230 V
      </text>
      <text x="305" y="60" textAnchor="middle" className="fill-current text-[9px]">
        styk ochronny (bolec)
      </text>

      {/* przewody ochronne PE (zielono-żółte) */}
      {[95, 305].map((x) => (
        <g key={x}>
          <line x1={x} y1="76" x2={x} y2="130" className="stroke-green-600" strokeWidth="4" />
          <line x1={x} y1="76" x2={x} y2="130" className="stroke-yellow-400" strokeWidth="4" strokeDasharray="6 6" />
        </g>
      ))}

      <rect x="30" y="130" width="340" height="24" rx="4" className="fill-green-600/30 stroke-current" />
      <text x="200" y="146" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        Uziemienie pojazdu (masa) lub uziom
      </text>

      <text x="200" y="176" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Obudowa falownika i styk ochronny każdego gniazda 230 V —
      </text>
      <text x="200" y="190" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        do tego samego uziemienia. Bez niego prąd zwarcia płynie przez Ciebie.
      </text>
    </svg>
  )
}

type FormularzStan = {
  rodzaj: RodzajMalejInstalacji | ""
  miejsce: MiejsceUziemienia | ""
  obudowa: OdpowiedzKontrolna | ""
  gniazda: OdpowiedzKontrolna | ""
}

const STAN_POCZATKOWY: FormularzStan = { rodzaj: "", miejsce: "", obudowa: "", gniazda: "" }

const MIEJSCA: { id: MiejsceUziemienia; label: string }[] = [
  { id: "garaz", label: "Garaż" },
  { id: "kamper", label: "Kamper / przyczepa" },
  { id: "jacht", label: "Jacht / łódź" },
  { id: "zewnatrz", label: "Na zewnątrz" },
]

const ODPOWIEDZI: { id: OdpowiedzKontrolna; label: string }[] = [
  { id: "tak", label: "Tak" },
  { id: "nie", label: "Nie" },
  { id: "nie-wiem", label: "Nie wiem" },
]

const doOdpowiedzi = (v: OdpowiedzKontrolna | "") => (v === "" ? null : v)

export default function UziemienieMaleInstalacjePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("uziemienie-male-instalacje", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateUziemienieMaleInstalacje({
        rodzaj: stan.rodzaj === "" ? null : stan.rodzaj,
        miejsce: stan.miejsce === "" ? null : stan.miejsce,
        obudowaFalownikaUziemiona: doOdpowiedzi(stan.obudowa),
        gniazdaZeStykiemOchronnym: doOdpowiedzi(stan.gniazda),
      }),
    [stan],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const { wymaganeUziemienieOchronne, zalecaneZeWzgleduNaWilgoc } = result.value
  const ac230 = stan.rodzaj === "ac230"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/uziemienie-male-instalacje" />
      <NaglowekEkranu tytul="Uziemienie małej instalacji">
        Kamper, jacht, garaż albo zestaw na zewnątrz: sprawdza, czy instalacja wymaga uziemienia ochronnego i czy falownik
        oraz gniazda 230 V są poprawnie podłączone. Moduł 12, Ekran 38 (uproszczona wersja Modułu 5, Ekrany 9 i 11).
      </NaglowekEkranu>
      <MigawkaBox>
        O co chodzi? Uziemienie to droga ucieczki dla prądu. Jak jej nie ma, prąd ucieka przez Ciebie.
      </MigawkaBox>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Rodzaj instalacji"
          value={stan.rodzaj}
          onChange={(e) => setStan((prev) => ({ ...prev, rodzaj: e.target.value as FormularzStan["rodzaj"] }))}
          pomoc={
            <>
              <strong>Rodzaj instalacji</strong> — czy w instalacji jest tylko niskie napięcie stałe z akumulatora (12 V albo
              24 V DC), czy także falownik (przetwornica), który robi z niego 230 V AC do zwykłych gniazdek. Od tego zależy,
              czy uziemienie ochronne jest wymagane: sama instalacja 12/24 V DC zwykle go nie wymaga, instalacja 230 V z
              falownika — tak. Jeśli masz choćby jedno gniazdko 230 V zasilane z falownika, wybierz „230 V z falownika”.
            </>
          }
        >
          <option value="">— wybierz —</option>
          <option value="dc">Tylko 12/24 V DC</option>
          <option value="ac230">230 V z falownika</option>
        </PoleSelect>
        <PoleSelect
          label="Gdzie jest instalacja"
          value={stan.miejsce}
          onChange={(e) => setStan((prev) => ({ ...prev, miejsce: e.target.value as FormularzStan["miejsce"] }))}
          pomoc={
            <>
              <strong>Miejsce instalacji</strong> — gdzie pracuje zestaw. Ten ekran jest dla instalacji tymczasowych i
              mobilnych, w których pełne uziemienie budynkowe nie ma zastosowania. Na jachcie i na zewnątrz jest wilgotno —
              tam uziemienie jest zalecane także przy samym 12/24 V DC. Dla domu z uziomem w ziemi użyj pełnego projektu
              uziemienia w Module 5.
            </>
          }
        >
          <option value="">— wybierz —</option>
          {MIEJSCA.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </PoleSelect>
        {ac230 && (
          <>
            <PoleSelect
              label="Czy obudowa falownika jest uziemiona?"
              value={stan.obudowa}
              onChange={(e) => setStan((prev) => ({ ...prev, obudowa: e.target.value as FormularzStan["obudowa"] }))}
              pomoc={
                <>
                  <strong>Uziemienie obudowy falownika</strong> — przewód ochronny (zielono-żółty) z zacisku uziemienia
                  falownika, oznaczonego PE albo symbolem uziemienia, do uziemienia pojazdu (masy) lub uziomu. Zacisk
                  znajdziesz na obudowie albo w instrukcji falownika. Gdy dojdzie do zwarcia wewnątrz, ten przewód odprowadza
                  prąd — bez niego obudowa jest pod napięciem. Nie wiesz? Wybierz „Nie wiem” — aplikacja przyjmie stronę
                  bezpieczną (jak „nie”).
                </>
              }
            >
              <option value="">— wybierz —</option>
              {ODPOWIEDZI.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </PoleSelect>
            <PoleSelect
              label="Czy gniazda 230 V mają podłączony styk ochronny?"
              value={stan.gniazda}
              onChange={(e) => setStan((prev) => ({ ...prev, gniazda: e.target.value as FormularzStan["gniazda"] }))}
              pomoc={
                <>
                  <strong>Styk ochronny gniazda</strong> — bolec albo boczne styki w gnieździe 230 V, do których dochodzi
                  przewód ochronny (zielono-żółty) połączony z uziemieniem pojazdu lub uziomem. Samo gniazdo z bolcem nie
                  wystarczy — przewód musi być podłączony. Sprawdź puszkę gniazda albo schemat instalacji. Nie wiesz? Wybierz
                  „Nie wiem” — aplikacja przyjmie stronę bezpieczną (jak „nie”).
                </>
              }
            >
              <option value="">— wybierz —</option>
              {ODPOWIEDZI.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </PoleSelect>
          </>
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wybierz rodzaj instalacji i miejsce{ac230 ? ", a potem odpowiedz na oba pytania o falownik i gniazda" : ""}.
        </p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : "ok"}
          etykieta={
            hasCritical
              ? "Brak uziemienia — ryzyko porażenia"
              : wymaganeUziemienieOchronne
                ? "Uziemienie wymagane i podłączone"
                : zalecaneZeWzgleduNaWilgoc
                  ? "Uziemienie niewymagane — zalecane przy wilgoci"
                  : "Uziemienie ochronne zwykle niewymagane"
          }
        >
          <WynikGlowny>
            {wymaganeUziemienieOchronne ? "uziemienie ochronne wymagane" : "uziemienie ochronne zwykle niewymagane"}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      {ac230 && <SchematUziemienia />}

      <p className="text-small text-muted-foreground">
        Uziemienie w domu, z uziomem w ziemi i pomiarem rezystancji — pełne kalkulatory:{" "}
        <Link href="/kalkulatory/projekt-uziemienia" className="underline">
          Moduł 5 — Projekt uziemienia
        </Link>{" "}
        oraz{" "}
        <Link href="/kalkulatory/uziemienie-funkcjonalne-ochronne" className="underline">
          Moduł 5 — Uziemienie funkcjonalne vs ochronne
        </Link>
        .
      </p>
    </main>
  )
}
