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
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
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

/** Catalog category (PL text from the engine constants) -> translation key suffix. */
const KATEGORIA_KLUCZ: Record<string, string> = {
  "Oświetlenie": "OSWIETLENIE",
  "Chłodzenie": "CHLODZENIE",
  Elektronika: "ELEKTRONIKA",
  "AGD (wysokie moce)": "AGD",
  "Ciepła woda": "CIEPLA-WODA",
  "Narzędzia": "NARZEDZIA",
  Klimatyzacja: "KLIMATYZACJA",
  Pompy: "POMPY",
  Ogrzewanie: "OGRZEWANIE",
}

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

// Every field of `ceny` is a component price in the display currency.
const PRZELICZ_CENY = przeliczPola<CenyStan>(
  "cenaOgniwaZl",
  "cenaBms4sZl",
  "cenaBms8sZl",
  "cenaBms16sZl",
  "cenaFalownika12vZl",
  "cenaFalownika24vZl",
  "cenaFalownika48vZl",
  "cenaPrzewodow12vZl",
  "cenaPrzewodow24vZl",
  "cenaPrzewodow48vZl",
  "cenaBezpiecznika12vZl",
  "cenaBezpiecznika24vZl",
  "cenaBezpiecznika48vZl",
  "cenaPrzetwornicyDcDcZl",
)
const PRZELICZ_KWOTY = (stan: FormularzStan, wspolczynnik: number): FormularzStan => ({
  ...stan,
  ceny: PRZELICZ_CENY(stan.ceny, wspolczynnik),
})

export default function NapiecieSystemowePage() {
  const t = useTranslate()
  // Seed całego formularza — persystowany (IndexedDB) pod jednym kluczem, żeby przeładowanie
  // strony nie gubiło wpisanych danych (zgłoszenie użytkownika, 15.09.2026).
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("napiecie-systemowe", STAN_POCZATKOWY, PRZELICZ_KWOTY)
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
        tytul={t("UI-NAPSYS-DORADCA-DOBORU-NAPIECIA")}
        ekran="napiecie-systemowe"
        wynik={result}
        parametry={{ prog12: PROG_12V_MAX_W, prog48: PROG_48V_MIN_W }}
      >
        {t("UI-NAPSYS-WYBIERAMY-NAPIECIA-PODSTAWIE")}
      </NaglowekEkranu>

      <PrzeliczoneInfo info={info} />

      {/* Rdzeń — pole ręczne + wynik */}
      <div className={SEKCJA_KLASY}>
        <Pole
          label={t("UI-NAPSYS-OBCIAZENIE-SZCZYTOWE-OPCJONA")}
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
            {t("UI-NAPSYS-WPISZ-OBCIAZENIE-SZCZYTOWE")}
          </p>
        ) : (
          <WerdyktPanel poziom={poziom} etykieta={poziom === "blad" ? t("UI-NAPSYS-POLICZYC-SPRAWDZ-DANE") : t("UI-NAPSYS-REKOMENDOWANE-NAPIECIE-SYSTE")}>
            {poziom !== "blad" && (
              <>
                <WynikGlowny>{result.value.napiecieRekomendowaneV} V</WynikGlowny>
                <p className="mt-3 text-small">
                  {t("UI-NAPSYS-MOC-SZCZYTOWA-PRAD", { mocSzczytowaCalkowitaW: result.value.mocSzczytowaCalkowitaW.toFixed(0), pradPrzy12VA: result.value.pradPrzy12VA.toFixed(0), pradPrzy24VA: result.value.pradPrzy24VA.toFixed(0), pradPrzy48VA: result.value.pradPrzy48VA.toFixed(0) })}
                </p>
              </>
            )}
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          </WerdyktPanel>
        )}
      </div>

      {/* Etap A — kontekst */}
      <details className={SEKCJA_KLASY} open>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>{t("UI-NAPSYS-ETAP-KONTEKST-ZASTOSOWANIA")}</summary>
        <div className="mt-4 flex flex-col gap-4">
          <PoleSelect
            label={t("UI-NAPSYS-GDZIE-BEDZIE-UZYWANY")}
            value={zastosowanie}
            onChange={(e) => setZastosowanie(e.target.value as Zastosowanie | "")}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="zastosowanie" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            {ZASTOSOWANIA.map((z) => (
              <option key={z.id} value={z.id}>
                {t(`UI-STALEBAT-ZAST-${z.id.toUpperCase().replaceAll("_", "-")}`)}
              </option>
            ))}
          </PoleSelect>
          {zastosowanie !== "" && <p className="text-caption text-muted-foreground">{t(`UI-STALEBAT-ZAST-${zastosowanie.toUpperCase().replaceAll("_", "-")}-FIL`)}</p>}

          <PoleSelect
            label={t("UI-NAPSYS-CIEBIE-WAZNIEJSZE")}
            value={priorytet}
            onChange={(e) => setPriorytet(e.target.value as Priorytet | "")}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="priorytet" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            {PRIORYTETY.map((p) => (
              <option key={p.id} value={p.id}>
                {t(`UI-STALEBAT-PRIOR-${p.id.toUpperCase().replaceAll("_", "-")}`)}
              </option>
            ))}
          </PoleSelect>

          <PoleCheckbox
            id="ogrzewanie-nie-dotyczy"
            label={t("UI-NAPSYS-OGRZEWANIE-ELEKTRYCZNE-DOTYC")}
            hint={t("UI-NAPSYS-KAMPER-LODZ-DOMEK")}
            checked={ogrzewanieNieDotyczy}
            onChange={() => setOgrzewanieNieDotyczy((v) => !v)}
          />
          {!ogrzewanieNieDotyczy && (
            <Pole
              label={t("UI-NAPSYS-SZCZYTOWA-MOC-OGRZEWANIA")}
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
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>{t("UI-NAPSYS-ETAP-KREATOR-ODBIORNIKOW")}</summary>
        <div className="mt-4 flex flex-col gap-5">
          {kategorie.map(([kategoria, pozycje]) => (
            <div key={kategoria} className="flex flex-col gap-2">
              <p className="text-small font-medium">{t(`UI-STALEBAT-KAT-${KATEGORIA_KLUCZ[kategoria]}`)}</p>
              <ul className="flex flex-col gap-2">
                {pozycje.map((o) => {
                  const stan = odbiorniki[o.id]
                  const nazwaOdbiornika = t(`UI-STALEBAT-ODB-${o.id.toUpperCase()}`)
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
                          {nazwaOdbiornika}
                          <span className="block text-caption text-muted-foreground">{t(`UI-STALEBAT-ODB-${o.id.toUpperCase()}-UWAGI`)}</span>
                        </span>
                      </label>
                      <div className="flex flex-nowrap items-center gap-2">
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label={t("UI-NAPSYS-MOC", { label: nazwaOdbiornika })}
                          className="w-16 min-h-9 shrink-0 rounded-md border border-input bg-background px-2 text-small"
                          value={stan.mocW}
                          onChange={(e) => aktualizujOdbiornik(o.id, "mocW", e.target.value)}
                        />
                        <span className="shrink-0 text-caption text-muted-foreground">W</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label={t("UI-NAPSYS-CZAS-PRACY-JEDNORAZOWO", { label: nazwaOdbiornika })}
                          className="w-14 min-h-9 shrink-0 rounded-md border border-input bg-background px-2 text-small"
                          value={stan.czasWartosc}
                          onChange={(e) => aktualizujOdbiornik(o.id, "czasWartosc", e.target.value)}
                        />
                        <select
                          aria-label={t("UI-NAPSYS-JEDNOSTKA-CZASU", { label: nazwaOdbiornika })}
                          className="shrink-0 min-h-9 rounded-md border border-input bg-background px-1 text-caption"
                          value={stan.czasJednostka}
                          onChange={(e) => zmienJednostkeCzasu(o.id, e.target.value as JednostkaCzasu)}
                        >
                          <option value="min">min</option>
                          <option value="h">{t("UI-NAPSYS-GODZ")}</option>
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
            label={t("UI-NAPSYS-PLANOWANA-MOC-CIAGLA")}
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
                {t("UI-NAPSYS-SUMA-BAZOWA-CIAGLA", { sumaBazowaW: result.value.jednoczesnosc.sumaBazowaW.toFixed(0), sumaPrzelaczalneWorstCaseW: result.value.jednoczesnosc.sumaPrzelaczalneWorstCaseW.toFixed(0) })}
                <strong>{result.value.jednoczesnosc.sumaWorstCaseW.toFixed(0)} W</strong>
              </p>
              {result.value.jednoczesnosc.limitPodano && (
                <p className="mt-1">
                  {result.value.jednoczesnosc.konflikt ? (
                    <WerdyktBadge poziom={result.value.jednoczesnosc.wagaOstrzezenia === "critical" ? "blad" : "uwaga"} etykieta={t("UI-NAPSYS-KONFLIKT-JEDNOCZESNOSCI")} />
                  ) : (
                    <WerdyktBadge poziom="ok" etykieta={t("UI-NAPSYS-BEZ-KONFLIKTU-TYM")} />
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      </details>

      {/* Etap C — echo dobor-przekroju-kabla */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>{t("UI-NAPSYS-ETAP-POROWNANIE-PRZEKROJU")}</summary>
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Pole
              id="dlugosc-trasy"
              label={t("UI-NAPSYS-DLUGOSC-TRASY-JEDNA")}
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
              label={t("UI-NAPSYS-TEMPERATURA-OTOCZENIA")}
              unit="°C"
              type="number"
              inputMode="decimal"
              value={temperaturaOtoczeniaC}
              onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="temperatura" />}
            />
            <PoleSelect
              label={t("UI-NAPSYS-MATERIAL")}
              value={material}
              onChange={(e) => setMaterial(e.target.value as Material)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="material" />}
            >
              <option value="Cu">{t("UI-NAPSYS-MIEDZ")}</option>
              <option value="Al">{t("UI-NAPSYS-ALUMINIUM")}</option>
            </PoleSelect>
            <PoleSelect
              label={t("UI-NAPSYS-SPOSOB-ULOZENIA")}
              value={sposobUlozenia}
              onChange={(e) => setSposobUlozenia(e.target.value as SposobUlozenia)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="ulozenie" />}
            >
              <option value="swobodnie">{t("UI-NAPSYS-SWOBODNIE-SCIANIE")}</option>
              <option value="w_peszlu">{t("UI-NAPSYS-PESZLU-RURZE")}</option>
              <option value="w_ziemi">{t("UI-NAPSYS-ZIEMI")}</option>
              <option value="w_wiazce">{t("UI-NAPSYS-WIAZCE")}</option>
            </PoleSelect>
            <Pole
              id="liczba-kabli-wiazce"
              label={t("UI-NAPSYS-LICZBA-KABLI-WIAZCE")}
              type="number"
              inputMode="numeric"
              min={1}
              value={liczbaKabliWWiazce}
              onChange={(e) => setLiczbaKabliWWiazce(e.target.value)}
              pomoc={<PomocPola ekran="napiecie-systemowe" pole="wiazka" />}
            />
            <Pole
              id="dopuszczalny-spadek"
              label={t("UI-NAPSYS-DOPUSZCZALNY-SPADEK-NAPIECIA")}
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
                    <td className="text-muted-foreground">{t("UI-NAPSYS-PRZEKROJ")}</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kable![k].przekrojMm2 > 0 ? `${result.value.kable![k].przekrojMm2} mm²` : t("UI-NAPSYS-BRAK")}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">{t("UI-NAPSYS-SPADEK-NAPIECIA")}</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{result.value.kable![k].przekrojMm2 > 0 ? `${result.value.kable![k].spadekNapieciaPct.toFixed(2)}%` : "—"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">{t("UI-NAPSYS-STRATA-ROCZNA")}</td>
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
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>{t("UI-NAPSYS-ETAP-KOSZTORYSY-SAMA")}</summary>
        <div className="mt-4 flex flex-col gap-4">
          <Pole
            label={t("UI-NAPSYS-DOCELOWA-POJEMNOSC-ENERGETYC")}
            unit="kWh"
            type="number"
            inputMode="decimal"
            min={0}
            value={docelowaPojemnoscKwh}
            onChange={(e) => setDocelowaPojemnoscKwh(e.target.value)}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="pojemnoscBanku" />}
          />
          <Pole
            label={t("UI-NAPSYS-LICZBA-LINII-OSWIETLENIA")}
            type="number"
            inputMode="numeric"
            min={0}
            value={liczbaLiniiOswietlenia24v}
            onChange={(e) => setLiczbaLiniiOswietlenia24v(e.target.value)}
            pomoc={<PomocPola ekran="napiecie-systemowe" pole="linie24v" />}
          />

          <details>
            <summary className="cursor-pointer text-caption text-muted-foreground">{t("UI-NAPSYS-WLASNE-CENY-DOMYSLNE")}</summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  ["cenaOgniwaZl", "UI-NAPSYS-CENA-OGNIWA-EVE", ""],
                  ["cenaBms4sZl", "UI-NAPSYS-CENA-BMS", "4S"],
                  ["cenaBms8sZl", "UI-NAPSYS-CENA-BMS", "8S"],
                  ["cenaBms16sZl", "UI-NAPSYS-CENA-BMS", "16S"],
                  ["cenaFalownika12vZl", "UI-NAPSYS-CENA-FALOWNIK", "12V"],
                  ["cenaFalownika24vZl", "UI-NAPSYS-CENA-FALOWNIK", "24V"],
                  ["cenaFalownika48vZl", "UI-NAPSYS-CENA-FALOWNIK", "48V"],
                  ["cenaPrzewodow12vZl", "UI-NAPSYS-CENA-PRZEWODY", "12V"],
                  ["cenaPrzewodow24vZl", "UI-NAPSYS-CENA-PRZEWODY", "24V"],
                  ["cenaPrzewodow48vZl", "UI-NAPSYS-CENA-PRZEWODY", "48V"],
                  ["cenaBezpiecznika12vZl", "UI-NAPSYS-CENA-BEZPIECZNIK", "12V"],
                  ["cenaBezpiecznika24vZl", "UI-NAPSYS-CENA-BEZPIECZNIK", "24V"],
                  ["cenaBezpiecznika48vZl", "UI-NAPSYS-CENA-BEZPIECZNIK", "48V"],
                  ["cenaPrzetwornicyDcDcZl", "UI-NAPSYS-CENA-PRZETWORNICA", ""],
                ] as const
              ).map(([klucz, etykieta, u]) => (
                <Pole
                  key={klucz}
                  id={`cena-${klucz}`}
                  label={t(etykieta, { u })}
                  unit={t("UI-J-ZL")}
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
                    <td className="text-muted-foreground">{t("UI-NAPSYS-OGNIWA")}</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>
                        {t("UI-NAPSYS-SZT", { liczbaOgniwLacznie: result.value.kosztorysy![k].liczbaOgniwLacznie, kosztOgniwZl: result.value.kosztorysy![k].kosztOgniwZl.toFixed(0) })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">BMS</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{t("UI-NAPSYS-ZL", { kosztBmsZl: result.value.kosztorysy![k].kosztBmsZl.toFixed(0) })}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">{t("UI-NAPSYS-FALOWNIK")}</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{t("UI-NAPSYS-ZL-2", { kosztFalownikaZl: result.value.kosztorysy![k].kosztFalownikaZl.toFixed(0) })}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">{t("UI-NAPSYS-PRZEWODY")}</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{t("UI-NAPSYS-ZL-3", { kosztPrzewodowZl: result.value.kosztorysy![k].kosztPrzewodowZl.toFixed(0) })}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">{t("UI-NAPSYS-BEZPIECZNIKI")}</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{t("UI-NAPSYS-ZL-4", { kosztBezpiecznikowZl: result.value.kosztorysy![k].kosztBezpiecznikowZl.toFixed(0) })}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">{t("UI-NAPSYS-PRZETWORNICE")}</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{t("UI-NAPSYS-ZL-5", { kosztPrzetwornicZl: result.value.kosztorysy![k].kosztPrzetwornicZl.toFixed(0) })}</td>
                    ))}
                  </tr>
                  <tr className="font-semibold">
                    <td>RAZEM</td>
                    {(["v12", "v24", "v48"] as const).map((k) => (
                      <td key={k}>{t("UI-NAPSYS-ZL-6", { razemZl: result.value.kosztorysy![k].razemZl.toFixed(0) })}</td>
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
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>{t("UI-NAPSYS-ETAP-PULAPKA-KONWERSJI")}</summary>
        <div className="mt-4 flex flex-col gap-3 text-small">
          <p>
            {t("UI-NAPSYS-PROSTU-POLACZYC-DWOCH")}
          </p>
          <PoleCheckbox
            id="planowana-konwersja"
            label={t("UI-NAPSYS-PLANUJE-PRZEJSCIE-ISTNIEJACE")}
            checked={planowanaKonwersja24Do48}
            onChange={() => setPlanowanaKonwersja24Do48((v) => !v)}
          />
          {result.value.kosztKonwersji24Do48Zl !== null && (
            <p className="rounded-md border p-3">
              {t("UI-NAPSYS-SZACOWANY-KOSZT-PRZEJSCIA")} <strong>{t("UI-NAPSYS-ZL-7", { kosztKonwersji24Do48Zl: result.value.kosztKonwersji24Do48Zl.toFixed(0) })}</strong>{t("UI-NAPSYS-PLUS-ROBOCIZNA-OGNIWA")}
            </p>
          )}
        </div>
      </details>
    </main>
  )
}
