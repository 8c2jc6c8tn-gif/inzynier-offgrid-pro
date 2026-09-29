"use client"

import { useMemo } from "react"
import { calculateNapiecieSystemowe } from "@/lib/core/modules/baterie/napiecie-systemowe/calculator"
import type { NapiecieSystemoweInput, OdbiornikWybor } from "@/lib/core/modules/baterie/napiecie-systemowe/input"
import {
  ZASTOSOWANIA,
  PRIORYTETY,
  KATALOG_ODBIORNIKOW,
  CENY_DOMYSLNE,
  CENA_OGNIWA_DOMYSLNA_ZL,
  type Zastosowanie,
  type Priorytet,
} from "@/lib/core/modules/baterie/napiecie-systemowe/constants"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, WerdyktBadge, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"
import { PROG_12V_MAX_W, PROG_48V_MIN_W } from "@/lib/core/modules/baterie/napiecie-systemowe/constants"
import { DOMYSLNY_SPADEK_DC_PCT } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"

const num = (s: string) => (s === "" ? 0 : Number(s))

type JednostkaCzasu = "min" | "h"

type OdbiornikStan = { mocW: string; czasWartosc: string; czasJednostka: JednostkaCzasu; selected: boolean }

/** Domyślna jednostka: godziny, gdy domyślny czas to pełne godziny ≥60 min — nikt nie chce
 *  przeliczać "16 godzin" na "960 minut" (zgłoszenie użytkownika, 14.09.2026). */
function domyslnyCzasStan(czasPracyDomyslnyMin: number): { czasWartosc: string; czasJednostka: JednostkaCzasu } {
  if (czasPracyDomyslnyMin >= 60 && czasPracyDomyslnyMin % 60 === 0) {
    return { czasWartosc: String(czasPracyDomyslnyMin / 60), czasJednostka: "h" }
  }
  return { czasWartosc: String(czasPracyDomyslnyMin), czasJednostka: "min" }
}

const ODBIORNIKI_POCZATKOWE: Record<string, OdbiornikStan> = Object.fromEntries(
  KATALOG_ODBIORNIKOW.map((o) => [o.id, { mocW: String(o.mocDomyslnaW), ...domyslnyCzasStan(o.czasPracyDomyslnyMin), selected: false }]),
)

type CenyStan = {
  cenaOgniwaZl: string
  cenaBms4sZl: string
  cenaBms8sZl: string
  cenaBms16sZl: string
  cenaFalownika12vZl: string
  cenaFalownika24vZl: string
  cenaFalownika48vZl: string
  cenaPrzewodow12vZl: string
  cenaPrzewodow24vZl: string
  cenaPrzewodow48vZl: string
  cenaBezpiecznika12vZl: string
  cenaBezpiecznika24vZl: string
  cenaBezpiecznika48vZl: string
  cenaPrzetwornicyDcDcZl: string
}

/** Seed tego ekranu (docs/standards/05-baza-danych-offline.md, 5.1) — jedyny obiekt persystowany
 *  przez `usePersistedDraft`, żeby przeładowanie strony nie gubiło wpisanych danych. */
type FormularzStan = {
  mocSzczytowaW: string
  zastosowanie: Zastosowanie | ""
  priorytet: Priorytet | ""
  ogrzewanieNieDotyczy: boolean
  ogrzewanieMocW: string
  odbiorniki: Record<string, OdbiornikStan>
  mocCiaglaFalownikaPlanowanaW: string
  dlugoscTrasyM: string
  material: Material
  sposobUlozenia: SposobUlozenia
  temperaturaOtoczeniaC: string
  liczbaKabliWWiazce: string
  dopuszczalnySpadekNapieciaPct: string
  docelowaPojemnoscKwh: string
  ceny: CenyStan
  liczbaLiniiOswietlenia24v: string
  planowanaKonwersja24Do48: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  mocSzczytowaW: "",
  zastosowanie: "",
  priorytet: "",
  ogrzewanieNieDotyczy: false,
  ogrzewanieMocW: "",
  odbiorniki: ODBIORNIKI_POCZATKOWE,
  mocCiaglaFalownikaPlanowanaW: "",
  dlugoscTrasyM: "",
  material: "Cu",
  sposobUlozenia: "swobodnie",
  temperaturaOtoczeniaC: "",
  liczbaKabliWWiazce: "1",
  dopuszczalnySpadekNapieciaPct: "3",
  docelowaPojemnoscKwh: "",
  ceny: {
    cenaOgniwaZl: String(CENA_OGNIWA_DOMYSLNA_ZL),
    cenaBms4sZl: String(CENY_DOMYSLNE.bms4sZl),
    cenaBms8sZl: String(CENY_DOMYSLNE.bms8sZl),
    cenaBms16sZl: String(CENY_DOMYSLNE.bms16sZl),
    cenaFalownika12vZl: String(CENY_DOMYSLNE.falownik12vZl),
    cenaFalownika24vZl: String(CENY_DOMYSLNE.falownik24vZl),
    cenaFalownika48vZl: String(CENY_DOMYSLNE.falownik48vZl),
    cenaPrzewodow12vZl: String(CENY_DOMYSLNE.przewody12vZl),
    cenaPrzewodow24vZl: String(CENY_DOMYSLNE.przewody24vZl),
    cenaPrzewodow48vZl: String(CENY_DOMYSLNE.przewody48vZl),
    cenaBezpiecznika12vZl: String(CENY_DOMYSLNE.bezpiecznik12vZl),
    cenaBezpiecznika24vZl: String(CENY_DOMYSLNE.bezpiecznik24vZl),
    cenaBezpiecznika48vZl: String(CENY_DOMYSLNE.bezpiecznik48vZl),
    cenaPrzetwornicyDcDcZl: String(CENY_DOMYSLNE.przetwornicaDcDcZl),
  },
  liczbaLiniiOswietlenia24v: "0",
  planowanaKonwersja24Do48: false,
}

const SEKCJA_KLASY = "flex flex-col gap-4 rounded-lg border p-4"
const SEKCJA_TYTUL_KLASY = "text-small font-semibold uppercase tracking-wide text-muted-foreground"

export default function NapiecieSystemowePage() {
  const t = useTranslate()
  // Seed całego formularza — persystowany (IndexedDB) pod jednym kluczem, żeby przeładowanie
  // strony nie gubiło wpisanych danych (zgłoszenie użytkownika, 15.09.2026).
  const [stan, setStan] = usePersistedDraft<FormularzStan>("napiecie-systemowe", STAN_POCZATKOWY)
  const {
    mocSzczytowaW,
    zastosowanie,
    priorytet,
    ogrzewanieNieDotyczy,
    ogrzewanieMocW,
    odbiorniki,
    mocCiaglaFalownikaPlanowanaW,
    dlugoscTrasyM,
    material,
    sposobUlozenia,
    temperaturaOtoczeniaC,
    liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct,
    docelowaPojemnoscKwh,
    ceny,
    liczbaLiniiOswietlenia24v,
    planowanaKonwersja24Do48,
  } = stan

  /** Aktualizuje jedno pole Seed-u, zachowując resztę — akceptuje wartość albo funkcję
   *  aktualizującą, tak jak `useState`, żeby wywołania niżej (`setX((prev) => ...)`) działały bez zmian. */
  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }

  // Rdzeń / pole ręczne (v1.0.0)
  const setMocSzczytowaW = (a: string | ((p: string) => string)) => setPole("mocSzczytowaW", a)

  // Etap A
  const setZastosowanie = (a: (Zastosowanie | "") | ((p: Zastosowanie | "") => Zastosowanie | "")) => setPole("zastosowanie", a)
  const setPriorytet = (a: (Priorytet | "") | ((p: Priorytet | "") => Priorytet | "")) => setPole("priorytet", a)
  const setOgrzewanieNieDotyczy = (a: boolean | ((p: boolean) => boolean)) => setPole("ogrzewanieNieDotyczy", a)
  const setOgrzewanieMocW = (a: string | ((p: string) => string)) => setPole("ogrzewanieMocW", a)

  // Etap B
  const setOdbiorniki = (a: Record<string, OdbiornikStan> | ((p: Record<string, OdbiornikStan>) => Record<string, OdbiornikStan>)) =>
    setPole("odbiorniki", a)
  const setMocCiaglaFalownikaPlanowanaW = (a: string | ((p: string) => string)) => setPole("mocCiaglaFalownikaPlanowanaW", a)

  // Etap C
  const setDlugoscTrasyM = (a: string | ((p: string) => string)) => setPole("dlugoscTrasyM", a)
  const setMaterial = (a: Material | ((p: Material) => Material)) => setPole("material", a)
  const setSposobUlozenia = (a: SposobUlozenia | ((p: SposobUlozenia) => SposobUlozenia)) => setPole("sposobUlozenia", a)
  const setTemperaturaOtoczeniaC = (a: string | ((p: string) => string)) => setPole("temperaturaOtoczeniaC", a)
  const setLiczbaKabliWWiazce = (a: string | ((p: string) => string)) => setPole("liczbaKabliWWiazce", a)
  const setDopuszczalnySpadekNapieciaPct = (a: string | ((p: string) => string)) => setPole("dopuszczalnySpadekNapieciaPct", a)

  // Etap E
  const setDocelowaPojemnoscKwh = (a: string | ((p: string) => string)) => setPole("docelowaPojemnoscKwh", a)
  const setCeny = (a: CenyStan | ((p: CenyStan) => CenyStan)) => setPole("ceny", a)
  const setLiczbaLiniiOswietlenia24v = (a: string | ((p: string) => string)) => setPole("liczbaLiniiOswietlenia24v", a)

  // Etap H
  const setPlanowanaKonwersja24Do48 = (a: boolean | ((p: boolean) => boolean)) => setPole("planowanaKonwersja24Do48", a)

  function toggleOdbiornik(id: string) {
    setOdbiorniki((prev) => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }))
  }
  function aktualizujOdbiornik(id: string, pole: "mocW" | "czasWartosc", wartosc: string) {
    setOdbiorniki((prev) => ({ ...prev, [id]: { ...prev[id], [pole]: wartosc } }))
  }
  /** Przelicza wpisaną wartość na nową jednostkę, żeby przełączenie min↔h nie gubiło danych. */
  function zmienJednostkeCzasu(id: string, nowaJednostka: JednostkaCzasu) {
    setOdbiorniki((prev) => {
      const stan = prev[id]
      if (stan.czasJednostka === nowaJednostka) return prev
      const wartoscMin = stan.czasJednostka === "h" ? num(stan.czasWartosc) * 60 : num(stan.czasWartosc)
      const nowaWartosc = nowaJednostka === "h" ? wartoscMin / 60 : wartoscMin
      return { ...prev, [id]: { ...stan, czasJednostka: nowaJednostka, czasWartosc: nowaWartosc === 0 ? "" : String(nowaWartosc) } }
    })
  }

  const kategorie = useMemo(() => {
    const map = new Map<string, typeof KATALOG_ODBIORNIKOW>()
    for (const o of KATALOG_ODBIORNIKOW) {
      if (!map.has(o.kategoria)) map.set(o.kategoria, [])
      map.get(o.kategoria)!.push(o)
    }
    return Array.from(map.entries())
  }, [])

  const odbiornikiInput: OdbiornikWybor[] = useMemo(
    () =>
      Object.entries(odbiorniki).map(([id, s]) => ({
        id,
        mocW: num(s.mocW),
        czasPracyMin: s.czasJednostka === "h" ? num(s.czasWartosc) * 60 : num(s.czasWartosc),
        selected: s.selected,
      })),
    [odbiorniki],
  )

  const input: NapiecieSystemoweInput = useMemo(
    () => ({
      mocSzczytowaW: num(mocSzczytowaW),
      zastosowanie: zastosowanie === "" ? null : zastosowanie,
      priorytet: priorytet === "" ? null : priorytet,
      ogrzewanieNieDotyczy,
      ogrzewanieMocW: num(ogrzewanieMocW),
      odbiorniki: odbiornikiInput,
      mocCiaglaFalownikaPlanowanaW: num(mocCiaglaFalownikaPlanowanaW),
      dlugoscTrasyM: num(dlugoscTrasyM),
      material,
      sposobUlozenia,
      temperaturaOtoczeniaC: temperaturaOtoczeniaC === "" ? null : num(temperaturaOtoczeniaC),
      liczbaKabliWWiazce: num(liczbaKabliWWiazce),
      dopuszczalnySpadekNapieciaPct: num(dopuszczalnySpadekNapieciaPct),
      docelowaPojemnoscKwh: num(docelowaPojemnoscKwh),
      cenaOgniwaZl: num(ceny.cenaOgniwaZl),
      cenaBms4sZl: num(ceny.cenaBms4sZl),
      cenaBms8sZl: num(ceny.cenaBms8sZl),
      cenaBms16sZl: num(ceny.cenaBms16sZl),
      cenaFalownika12vZl: num(ceny.cenaFalownika12vZl),
      cenaFalownika24vZl: num(ceny.cenaFalownika24vZl),
      cenaFalownika48vZl: num(ceny.cenaFalownika48vZl),
      cenaPrzewodow12vZl: num(ceny.cenaPrzewodow12vZl),
      cenaPrzewodow24vZl: num(ceny.cenaPrzewodow24vZl),
      cenaPrzewodow48vZl: num(ceny.cenaPrzewodow48vZl),
      cenaBezpiecznika12vZl: num(ceny.cenaBezpiecznika12vZl),
      cenaBezpiecznika24vZl: num(ceny.cenaBezpiecznika24vZl),
      cenaBezpiecznika48vZl: num(ceny.cenaBezpiecznika48vZl),
      liczbaLiniiOswietlenia24vPrzySystemie48v: num(liczbaLiniiOswietlenia24v),
      cenaPrzetwornicyDcDcZl: num(ceny.cenaPrzetwornicyDcDcZl),
      planowanaKonwersja24Do48,
    }),
    [
      mocSzczytowaW,
      zastosowanie,
      priorytet,
      ogrzewanieNieDotyczy,
      ogrzewanieMocW,
      odbiornikiInput,
      mocCiaglaFalownikaPlanowanaW,
      dlugoscTrasyM,
      material,
      sposobUlozenia,
      temperaturaOtoczeniaC,
      liczbaKabliWWiazce,
      dopuszczalnySpadekNapieciaPct,
      docelowaPojemnoscKwh,
      ceny,
      liczbaLiniiOswietlenia24v,
      planowanaKonwersja24Do48,
    ],
  )

  const result = useMemo(() => calculateNapiecieSystemowe(input), [input])

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" ? "blad" : result.status === "INCOMPLETE" ? null : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/napiecie-systemowe" />
      <NaglowekEkranu
        tytul="Doradca doboru napięcia systemowego"
        ekran="napiecie-systemowe"
        wzor={result.formula}
        parametry={{ prog12: PROG_12V_MAX_W, prog48: PROG_48V_MIN_W }}
      >
        Nie wybieramy napięcia na podstawie ceny BMS-a — wybieramy je na podstawie maksymalnego
        jednorazowego poboru mocy, dziennego zużycia energii i kontekstu zastosowania. Wyższe
        napięcie = mniejszy prąd przy tej samej mocy = cieńsze, tańsze i bezpieczniejsze kable.
        Moduł 4, Ekran 2.
      </NaglowekEkranu>

      {/* Rdzeń — pole ręczne + wynik */}
      <div className={SEKCJA_KLASY}>
        <Pole
          label="Obciążenie szczytowe (opcjonalnie — nadpisuje sumę z kreatora niżej)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocSzczytowaW}
          onChange={(e) => setMocSzczytowaW(e.target.value)}
          pomoc={<PomocPola ekran="napiecie-systemowe" pole="obciazenie" params={{ prog12: PROG_12V_MAX_W, prog48: PROG_48V_MIN_W }} />}
        />

        {poziom === null ? (
          <p className="text-small text-muted-foreground">
            Wpisz obciążenie szczytowe albo zaznacz odbiorniki w Etapie B, żeby zobaczyć rekomendację.
          </p>
        ) : (
          <WerdyktPanel poziom={poziom} etykieta={poziom === "blad" ? "Nie da się policzyć — sprawdź dane" : "Rekomendowane napięcie systemowe"}>
            {poziom !== "blad" && (
              <>
                <WynikGlowny>{result.value.napiecieRekomendowaneV} V</WynikGlowny>
                <p className="mt-3 text-small">
                  Moc szczytowa: {result.value.mocSzczytowaCalkowitaW.toFixed(0)} W → prąd:{" "}
                  {result.value.pradPrzy12VA.toFixed(0)} A @12V · {result.value.pradPrzy24VA.toFixed(0)} A @24V ·{" "}
                  {result.value.pradPrzy48VA.toFixed(0)} A @48V.
                </p>
              </>
            )}
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
          </WerdyktPanel>
        )}
      </div>

      {/* Etap A — kontekst */}
      <details className={SEKCJA_KLASY} open>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap A — kontekst zastosowania</summary>
        <div className="mt-4 flex flex-col gap-4">
          <PoleSelect
            label="Gdzie będzie używany ten system?"
            value={zastosowanie}
            onChange={(e) => setZastosowanie(e.target.value as Zastosowanie | "")}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="zastosowanie" />}
          >
            <option value="">— wybierz —</option>
            {ZASTOSOWANIA.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </PoleSelect>
          {zastosowanie !== "" && <p className="text-caption text-muted-foreground">{ZASTOSOWANIA.find((z) => z.id === zastosowanie)?.filozofia}</p>}

          <PoleSelect
            label="Co jest dla Ciebie ważniejsze?"
            value={priorytet}
            onChange={(e) => setPriorytet(e.target.value as Priorytet | "")}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="priorytet" />}
          >
            <option value="">— wybierz —</option>
            {PRIORYTETY.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </PoleSelect>

          <PoleCheckbox
            id="ogrzewanie-nie-dotyczy"
            label="Ogrzewanie elektryczne nie dotyczy tego systemu"
            hint="np. kamper, łódź, domek sezonowy, ogrzewanie na paliwo stałe/gaz"
            checked={ogrzewanieNieDotyczy}
            onChange={() => setOgrzewanieNieDotyczy((v) => !v)}
          />
          {!ogrzewanieNieDotyczy && (
            <Pole
              label="Szczytowa moc ogrzewania elektrycznego"
              unit="W"
              type="number"
              inputMode="decimal"
              min={0}
              value={ogrzewanieMocW}
              onChange={(e) => setOgrzewanieMocW(e.target.value)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="ogrzewanie" />}
            />
          )}
        </div>
      </details>

      {/* Etap B — kreator odbiorników */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap B — kreator odbiorników i analiza jednoczesności</summary>
        <div className="mt-4 flex flex-col gap-5">
          {kategorie.map(([kategoria, pozycje]) => (
            <div key={kategoria} className="flex flex-col gap-2">
              <p className="text-small font-medium">{kategoria}</p>
              <ul className="flex flex-col gap-2">
                {pozycje.map((o) => {
                  const stan = odbiorniki[o.id]
                  return (
                    <li key={o.id} className="flex flex-col gap-2 rounded-md border p-2">
                      <label htmlFor={`odb-${o.id}`} className="flex items-start gap-2 text-small cursor-pointer">
                        <input
                          type="checkbox"
                          id={`odb-${o.id}`}
                          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-primary"
                          checked={stan.selected}
                          onChange={() => toggleOdbiornik(o.id)}
                        />
                        <span>
                          {o.label}
                          <span className="block text-caption text-muted-foreground">{o.uwagi}</span>
                        </span>
                      </label>
                      <div className="flex flex-nowrap items-center gap-2">
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label={`Moc — ${o.label}`}
                          className="w-16 min-h-9 shrink-0 rounded-md border border-input bg-background px-2 text-small"
                          value={stan.mocW}
                          onChange={(e) => aktualizujOdbiornik(o.id, "mocW", e.target.value)}
                        />
                        <span className="shrink-0 text-caption text-muted-foreground">W</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label={`Czas pracy jednorazowo — ${o.label}`}
                          className="w-14 min-h-9 shrink-0 rounded-md border border-input bg-background px-2 text-small"
                          value={stan.czasWartosc}
                          onChange={(e) => aktualizujOdbiornik(o.id, "czasWartosc", e.target.value)}
                        />
                        <select
                          aria-label={`Jednostka czasu — ${o.label}`}
                          className="shrink-0 min-h-9 rounded-md border border-input bg-background px-1 text-caption"
                          value={stan.czasJednostka}
                          onChange={(e) => zmienJednostkeCzasu(o.id, e.target.value as JednostkaCzasu)}
                        >
                          <option value="min">min</option>
                          <option value="h">godz.</option>
                        </select>
                        <PomocPola ekran="napiecie-systemowe" pole="wierszOdbiornika" />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          <Pole
            label="Planowana moc ciągła falownika (opcjonalnie — do sprawdzenia konfliktu jednoczesności)"
            unit="W"
            type="number"
            inputMode="decimal"
            min={0}
            value={mocCiaglaFalownikaPlanowanaW}
            onChange={(e) => setMocCiaglaFalownikaPlanowanaW(e.target.value)}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="mocFalownika" />}
          />

          {result.value.jednoczesnosc && (
            <div className="rounded-md border p-3 text-small">
              <p>
                Suma bazowa (ciągła): {result.value.jednoczesnosc.sumaBazowaW.toFixed(0)} W · suma przełączalnych (worst case):{" "}
                {result.value.jednoczesnosc.sumaPrzelaczalneWorstCaseW.toFixed(0)} W · razem:{" "}
                <strong>{result.value.jednoczesnosc.sumaWorstCaseW.toFixed(0)} W</strong>
              </p>
              {result.value.jednoczesnosc.limitPodano && (
                <p className="mt-1">
                  {result.value.jednoczesnosc.konflikt ? (
                    <WerdyktBadge poziom={result.value.jednoczesnosc.wagaOstrzezenia === "critical" ? "blad" : "uwaga"} etykieta="Konflikt jednoczesności" />
                  ) : (
                    <WerdyktBadge poziom="ok" etykieta="Bez konfliktu przy tym limicie" />
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      </details>

      {/* Etap C — echo dobor-przekroju-kabla */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap C — porównanie przekroju kabla i strat (12V / 24V / 48V)</summary>
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Pole
              id="dlugosc-trasy"
              label="Długość trasy (w jedną stronę)"
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              value={dlugoscTrasyM}
              onChange={(e) => setDlugoscTrasyM(e.target.value)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="dlugosc" />}
            />
            <Pole
              id="temperatura-otoczenia"
              label="Temperatura otoczenia"
              unit="°C"
              type="number"
              inputMode="decimal"
              value={temperaturaOtoczeniaC}
              onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="temperatura" />}
            />
            <PoleSelect
              label="Materiał"
              value={material}
              onChange={(e) => setMaterial(e.target.value as Material)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="material" />}
            >
              <option value="Cu">Miedź (Cu)</option>
              <option value="Al">Aluminium (Al)</option>
            </PoleSelect>
            <PoleSelect
              label="Sposób ułożenia"
              value={sposobUlozenia}
              onChange={(e) => setSposobUlozenia(e.target.value as SposobUlozenia)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="ulozenie" />}
            >
              <option value="swobodnie">Swobodnie / na ścianie</option>
              <option value="w_peszlu">W peszlu / rurze</option>
              <option value="w_ziemi">W ziemi</option>
              <option value="w_wiazce">W wiązce</option>
            </PoleSelect>
            <Pole
              id="liczba-kabli-wiazce"
              label="Liczba kabli w wiązce"
              type="number"
              inputMode="numeric"
              min={1}
              value={liczbaKabliWWiazce}
              onChange={(e) => setLiczbaKabliWWiazce(e.target.value)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="wiazka" />}
            />
            <Pole
              id="dopuszczalny-spadek"
              label="Dopuszczalny spadek napięcia"
              unit="%"
              type="number"
              inputMode="decimal"
              min={0}
              value={dopuszczalnySpadekNapieciaPct}
              onChange={(e) => setDopuszczalnySpadekNapieciaPct(e.target.value)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="spadek" params={{ spadekDc: DOMYSLNY_SPADEK_DC_PCT }} />}
            />
          </div>

          {result.value.kable && (
            <div className="overflow-x-auto">
              <table className="w-full text-small">
                <thead>
                  <tr className="text-left text-caption text-muted-foreground">
                    <th></th>
                    <th>12V</th>
                    <th>24V</th>
                    <th>48V</th>
                  </tr>
                </thead>
                <tbody className="[&_td]:py-1">
                  {(["v12", "v24", "v48"] as const).map(() => null)}
                  <tr>
                    <td className="text-muted-foreground">Przekrój</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kable![k].przekrojMm2 > 0 ? `${result.value.kable![k].przekrojMm2} mm²` : "brak"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">Spadek napięcia</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kable![k].przekrojMm2 > 0 ? `${result.value.kable![k].spadekNapieciaPct.toFixed(2)}%` : "—"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">Strata roczna</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kable![k].przekrojMm2 > 0 ? `${result.value.kable![k].strataRocznaKwh.toFixed(1)} kWh` : "—"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              {(["v12", "v24", "v48"] as const).map((k) =>
                result.value.kable![k].warnings
                  .filter((w) => w.level !== "info")
                  .map((w) => (
                    <p key={`${k}-${w.code}`} className="mt-2 text-caption">
                      {k.replace("v", "")}V: {w.message ?? t(w.i18nKey ?? w.code, w.params)}
                    </p>
                  )),
              )}
            </div>
          )}
        </div>
      </details>

      {/* Etap E — kosztorysy */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap E — kosztorysy (ta sama docelowa pojemność, ceny edytowalne)</summary>
        <div className="mt-4 flex flex-col gap-4">
          <Pole
            label="Docelowa pojemność energetyczna banku"
            unit="kWh"
            type="number"
            inputMode="decimal"
            min={0}
            value={docelowaPojemnoscKwh}
            onChange={(e) => setDocelowaPojemnoscKwh(e.target.value)}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="pojemnoscBanku" />}
          />
          <Pole
            label="Liczba linii oświetlenia 24V (tylko jeśli budujesz system 48V)"
            type="number"
            inputMode="numeric"
            min={0}
            value={liczbaLiniiOswietlenia24v}
            onChange={(e) => setLiczbaLiniiOswietlenia24v(e.target.value)}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="linie24v" />}
          />

          <details>
            <summary className="cursor-pointer text-caption text-muted-foreground">Własne ceny (domyślne z materiału źródłowego, edytowalne)</summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  ["cenaOgniwaZl", "Cena ogniwa EVE 314Ah"],
                  ["cenaBms4sZl", "BMS 4S 200A"],
                  ["cenaBms8sZl", "BMS 8S 200A"],
                  ["cenaBms16sZl", "BMS 16S 200A"],
                  ["cenaFalownika12vZl", "Falownik 12V"],
                  ["cenaFalownika24vZl", "Falownik 24V"],
                  ["cenaFalownika48vZl", "Falownik 48V"],
                  ["cenaPrzewodow12vZl", "Przewody 12V"],
                  ["cenaPrzewodow24vZl", "Przewody 24V"],
                  ["cenaPrzewodow48vZl", "Przewody 48V"],
                  ["cenaBezpiecznika12vZl", "Bezpiecznik 12V"],
                  ["cenaBezpiecznika24vZl", "Bezpiecznik 24V"],
                  ["cenaBezpiecznika48vZl", "Bezpiecznik 48V"],
                  ["cenaPrzetwornicyDcDcZl", "Przetwornica DC-DC 48V→24V"],
                ] as const
              ).map(([klucz, etykieta]) => (
                <Pole
                  key={klucz}
                  id={`cena-${klucz}`}
                  label={etykieta}
                  unit="zł"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={ceny[klucz]}
                  onChange={(e) => setCeny((prev) => ({ ...prev, [klucz]: e.target.value }))}
                  pomoc={<PomocPola ekran="napiecie-systemowe" pole="cenaSkladnika" />}
                />
              ))}
            </div>
          </details>

          {result.value.kosztorysy && (
            <div className="overflow-x-auto">
              <table className="w-full text-small">
                <thead>
                  <tr className="text-left text-caption text-muted-foreground">
                    <th></th>
                    <th>12V</th>
                    <th>24V</th>
                    <th>48V</th>
                  </tr>
                </thead>
                <tbody className="[&_td]:py-1">
                  <tr>
                    <td className="text-muted-foreground">Ogniwa</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>
                        {result.value.kosztorysy![k].liczbaOgniwLacznie} szt. ({result.value.kosztorysy![k].kosztOgniwZl.toFixed(0)} zł)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">BMS</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kosztorysy![k].kosztBmsZl.toFixed(0)} zł</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">Falownik</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kosztorysy![k].kosztFalownikaZl.toFixed(0)} zł</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">Przewody</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kosztorysy![k].kosztPrzewodowZl.toFixed(0)} zł</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">Bezpieczniki</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kosztorysy![k].kosztBezpiecznikowZl.toFixed(0)} zł</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">Przetwornice DC-DC</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kosztorysy![k].kosztPrzetwornicZl.toFixed(0)} zł</td>
                    ))}
                  </tr>
                  <tr className="font-semibold">
                    <td>RAZEM</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kosztorysy![k].razemZl.toFixed(0)} zł</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>

      {/* Etap H — pułapka konwersji */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap H — pułapka konwersji 24V → 48V</summary>
        <div className="mt-4 flex flex-col gap-3 text-small">
          <p>
            Nie da się „po prostu” połączyć dwóch gotowych pakietów 24V szeregowo, żeby uzyskać 48V. Każdy pakiet ma własny BMS, który nie komunikuje się z
            drugim — różnice napięć/rezystancji między pakietami powodują przepływ wyrównawczy, nierówne obciążenie i przedwczesne zużycie. Prawidłowe
            rozwiązanie: zbuduj pakiet 48V od podstaw (16 ogniw, jeden BMS 16S).
          </p>
          <PoleCheckbox
            id="planowana-konwersja"
            label="Planuję przejście z istniejącego systemu 24V na 48V"
            checked={planowanaKonwersja24Do48}
            onChange={() => setPlanowanaKonwersja24Do48((v) => !v)}
          />
          {result.value.kosztKonwersji24Do48Zl !== null && (
            <p className="rounded-md border p-3">
              Szacowany koszt przejścia (BMS 16S + falownik 48V + przewody, z cen w Etapie E): <strong>{result.value.kosztKonwersji24Do48Zl.toFixed(0)} zł</strong>{" "}
              (plus robocizna). Ogniwa możesz użyć ponownie — po rozbalansowaniu i przełożeniu do nowej konfiguracji 16S.
            </p>
          )}
        </div>
      </details>
    </main>
  )
}
