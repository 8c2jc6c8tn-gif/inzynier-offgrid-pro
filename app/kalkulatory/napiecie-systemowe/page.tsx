"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { isComputed } from "@/lib/core/calc-result"
import { calculateNapiecieSystemowe } from "@/lib/core/modules/baterie/napiecie-systemowe/calculator"
import type { NapiecieSystemoweInput, OdbiornikWybor } from "@/lib/core/modules/baterie/napiecie-systemowe/input"
import {
  ZASTOSOWANIA,
  PRIORYTETY,
  KATALOG_ODBIORNIKOW,
  CENY_DOMYSLNE,
  CENA_OGNIWA_DOMYSLNA_ZL,
  FALOWNIKI_VEVOR,
  POROWNANIE_OSWIETLENIA_LED,
  ZALECENIE_OSWIETLENIA_LED,
  KATALOG_URZADZEN_DC,
  ZALETA_GNIAZD_DC,
  type Zastosowanie,
  type Priorytet,
  type FalownikVevorId,
} from "@/lib/core/modules/baterie/napiecie-systemowe/constants"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { Pole, PoleSelect, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, WerdyktBadge, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

const num = (s: string) => (s === "" ? 0 : Number(s))

type OdbiornikStan = { mocW: string; czasPracyMin: string; selected: boolean }

const ODBIORNIKI_POCZATKOWE: Record<string, OdbiornikStan> = Object.fromEntries(
  KATALOG_ODBIORNIKOW.map((o) => [o.id, { mocW: String(o.mocDomyslnaW), czasPracyMin: String(o.czasPracyDomyslnyMin), selected: false }]),
)

const SEKCJA_KLASY = "flex flex-col gap-4 rounded-lg border p-4"
const SEKCJA_TYTUL_KLASY = "text-small font-semibold uppercase tracking-wide text-muted-foreground"

export default function NapiecieSystemowePage() {
  // Rdzeń / pole ręczne (v1.0.0)
  const [mocSzczytowaW, setMocSzczytowaW] = useState("")

  // Etap A
  const [zastosowanie, setZastosowanie] = useState<Zastosowanie | "">("")
  const [priorytet, setPriorytet] = useState<Priorytet | "">("")
  const [ogrzewanieNieDotyczy, setOgrzewanieNieDotyczy] = useState(false)
  const [ogrzewanieMocW, setOgrzewanieMocW] = useState("")

  // Etap B
  const [odbiorniki, setOdbiorniki] = useState<Record<string, OdbiornikStan>>(ODBIORNIKI_POCZATKOWE)
  const [mocCiaglaFalownikaPlanowanaW, setMocCiaglaFalownikaPlanowanaW] = useState("")

  // Etap C
  const [dlugoscTrasyM, setDlugoscTrasyM] = useState("")
  const [material, setMaterial] = useState<Material>("Cu")
  const [sposobUlozenia, setSposobUlozenia] = useState<SposobUlozenia>("swobodnie")
  const [temperaturaOtoczeniaC, setTemperaturaOtoczeniaC] = useState("")
  const [liczbaKabliWWiazce, setLiczbaKabliWWiazce] = useState("1")
  const [dopuszczalnySpadekNapieciaPct, setDopuszczalnySpadekNapieciaPct] = useState("3")

  // Etap E
  const [docelowaPojemnoscKwh, setDocelowaPojemnoscKwh] = useState("")
  const [ceny, setCeny] = useState({
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
  })
  const [liczbaLiniiOswietlenia24v, setLiczbaLiniiOswietlenia24v] = useState("0")

  // Etap G
  const [falownikVevor, setFalownikVevor] = useState<FalownikVevorId | "">("")
  const [liczbaPaneliWStringu, setLiczbaPaneliWStringu] = useState("")
  const [tminC, setTminC] = useState("")

  // Etap H
  const [planowanaKonwersja24Do48, setPlanowanaKonwersja24Do48] = useState(false)

  function toggleOdbiornik(id: string) {
    setOdbiorniki((prev) => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }))
  }
  function aktualizujOdbiornik(id: string, pole: "mocW" | "czasPracyMin", wartosc: string) {
    setOdbiorniki((prev) => ({ ...prev, [id]: { ...prev[id], [pole]: wartosc } }))
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
        czasPracyMin: num(s.czasPracyMin),
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
      falownikVevor: falownikVevor === "" ? null : falownikVevor,
      liczbaPaneliWStringu: num(liczbaPaneliWStringu),
      tminC: tminC === "" ? null : num(tminC),
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
      falownikVevor,
      liczbaPaneliWStringu,
      tminC,
      planowanaKonwersja24Do48,
    ],
  )

  const result = useMemo(() => calculateNapiecieSystemowe(input), [input])

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT" ? "blad" : result.status === "INCOMPLETE" ? null : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"

  const falownikWybrany = FALOWNIKI_VEVOR.find((f) => f.id === falownikVevor)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/napiecie-systemowe" />
      <NaglowekEkranu tytul="Doradca doboru napięcia systemowego">
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
          <PoleSelect label="Gdzie będzie używany ten system?" value={zastosowanie} onChange={(e) => setZastosowanie(e.target.value as Zastosowanie | "")}>
            <option value="">— wybierz —</option>
            {ZASTOSOWANIA.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </PoleSelect>
          {zastosowanie !== "" && <p className="text-caption text-muted-foreground">{ZASTOSOWANIA.find((z) => z.id === zastosowanie)?.filozofia}</p>}

          <PoleSelect label="Co jest dla Ciebie ważniejsze?" value={priorytet} onChange={(e) => setPriorytet(e.target.value as Priorytet | "")}>
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
              hint="Pomiń, jeśli konkretne urządzenie grzewcze rozpiszesz osobno w kreatorze odbiorników (Etap B, kategoria „Ogrzewanie”) — nie dodawaj tej samej mocy dwa razy."
              type="number"
              inputMode="decimal"
              min={0}
              value={ogrzewanieMocW}
              onChange={(e) => setOgrzewanieMocW(e.target.value)}
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
                    <li key={o.id} className="flex flex-wrap items-center gap-2 rounded-md border p-2">
                      <input
                        type="checkbox"
                        id={`odb-${o.id}`}
                        className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
                        checked={stan.selected}
                        onChange={() => toggleOdbiornik(o.id)}
                      />
                      <label htmlFor={`odb-${o.id}`} className="min-w-[10rem] flex-1 text-small">
                        {o.label}
                        <span className="block text-caption text-muted-foreground">{o.uwagi}</span>
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        aria-label={`Moc — ${o.label}`}
                        className="w-20 min-h-9 rounded-md border border-input bg-background px-2 text-small"
                        value={stan.mocW}
                        disabled={!stan.selected}
                        onChange={(e) => aktualizujOdbiornik(o.id, "mocW", e.target.value)}
                      />
                      <span className="text-caption text-muted-foreground">W</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        aria-label={`Czas pracy jednorazowo — ${o.label}`}
                        className="w-16 min-h-9 rounded-md border border-input bg-background px-2 text-small"
                        value={stan.czasPracyMin}
                        disabled={!stan.selected}
                        onChange={(e) => aktualizujOdbiornik(o.id, "czasPracyMin", e.target.value)}
                      />
                      <span className="text-caption text-muted-foreground">min</span>
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
            />
            <Pole
              id="temperatura-otoczenia"
              label="Temperatura otoczenia"
              unit="°C"
              type="number"
              inputMode="decimal"
              value={temperaturaOtoczeniaC}
              onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
            />
            <PoleSelect label="Materiał" value={material} onChange={(e) => setMaterial(e.target.value as Material)}>
              <option value="Cu">Miedź (Cu)</option>
              <option value="Al">Aluminium (Al)</option>
            </PoleSelect>
            <PoleSelect label="Sposób ułożenia" value={sposobUlozenia} onChange={(e) => setSposobUlozenia(e.target.value as SposobUlozenia)}>
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
                      {k.replace("v", "")}V: {w.message}
                    </p>
                  )),
              )}
            </div>
          )}
        </div>
      </details>

      {/* Etap D — rekomendacja oświetlenia i odbiorników DC (czysto informacyjne) */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap D — rekomendacja oświetlenia i odbiorników DC</summary>
        <div className="mt-4 flex flex-col gap-5 text-small">
          <div>
            <p className="mb-2 font-medium">D.1 — Oświetlenie LED: 24V vs 230V vs 48V</p>
            <div className="overflow-x-auto">
              <table className="w-full text-small">
                <thead>
                  <tr className="text-left text-caption text-muted-foreground">
                    <th></th>
                    <th>LED 230V</th>
                    <th>LED 24V</th>
                    <th>LED 48V</th>
                  </tr>
                </thead>
                <tbody className="[&_td]:py-1 [&_td]:pr-3">
                  {POROWNANIE_OSWIETLENIA_LED.map((w) => (
                    <tr key={w.cecha}>
                      <td className="text-muted-foreground">{w.cecha}</td>
                      <td>{w.v230}</td>
                      <td>{w.v24}</td>
                      <td>{w.v48}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 rounded-md border p-3">{ZALECENIE_OSWIETLENIA_LED}</p>
          </div>

          <div>
            <p className="mb-2 font-medium">D.2 — Dedykowane gniazda DC dla elektroniki</p>
            <div className="overflow-x-auto">
              <table className="w-full text-small">
                <thead>
                  <tr className="text-left text-caption text-muted-foreground">
                    <th>Urządzenie</th>
                    <th>Napięcie zasilania</th>
                    <th>Zalecane rozwiązanie</th>
                  </tr>
                </thead>
                <tbody className="[&_td]:py-1 [&_td]:pr-3">
                  {KATALOG_URZADZEN_DC.map((u) => (
                    <tr key={u.urzadzenie}>
                      <td>{u.urzadzenie}</td>
                      <td>{u.napiecieZasilania}</td>
                      <td>{u.zalecaneRozwiazanie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-caption text-muted-foreground">{ZALETA_GNIAZD_DC}</p>
          </div>
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
          />
          <Pole
            label="Liczba linii oświetlenia 24V (tylko jeśli budujesz system 48V)"
            hint="każda dolicza przetwornicę DC-DC 48V→24V"
            type="number"
            inputMode="numeric"
            min={0}
            value={liczbaLiniiOswietlenia24v}
            onChange={(e) => setLiczbaLiniiOswietlenia24v(e.target.value)}
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

      {/* Etap F — łączenie pakietów */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap F — równoległe łączenie pakietów akumulatorów</summary>
        <div className="mt-4 flex flex-col gap-3 text-small">
          <p>
            Prąd zawsze płynie ścieżką o najmniejszym oporze — przy równoległym łączeniu pakietów nierówne długości/przekroje kabli dają nierówny rozpływ
            prądu, nawet gdy pakiety są identyczne. Akumulator najbliżej falownika pracuje najciężej, nagrzewa się i starzeje szybciej.
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Szyna zbiorcza (busbar)</strong> — każdy pakiet osobno do wspólnej szyny +/− — najlepsza metoda dla 3+ akumulatorów.
            </li>
            <li>
              <strong>Identyczne kable</strong> — ta sama długość, przekrój, typ złączek na każdej gałęzi.
            </li>
            <li>
              <strong>Unikaj łańcuszka (daisy-chain)</strong> — podłączenie falownika do pierwszego akumulatora w łańcuchu daje największe nierówności.
            </li>
            <li>Ładowanie wielu pakietów przez jeden falownik wymaga tego samego typu ogniw, tej samej pojemności i komunikujących się BMS (master-slave).</li>
          </ul>
          <p className="rounded-md border p-3">
            Żeby policzyć realny rozkład prądu między konkretnymi gałęziami (różne długości/przekroje), użyj{" "}
            <Link href="/kalkulatory/szyny-zbiorcze-miedzypakietowe" className="underline">
              kalkulatora rozpływu prądu w szynach zbiorczych
            </Link>{" "}
            (Moduł 4, Ekran 25) — liczy realną fizykę (dzielnik prądu wg rezystancji gałęzi), nie duplikowaną tutaj.
          </p>
        </div>
      </details>

      {/* Etap G — dobór PV */}
      <details className={SEKCJA_KLASY}>
        <summary className={`cursor-pointer ${SEKCJA_TYTUL_KLASY}`}>Etap G — dobór paneli PV do falownika</summary>
        <div className="mt-4 flex flex-col gap-4">
          <PoleSelect label="Model falownika VEVOR" value={falownikVevor} onChange={(e) => setFalownikVevor(e.target.value as FalownikVevorId | "")}>
            <option value="">— wybierz —</option>
            {FALOWNIKI_VEVOR.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </PoleSelect>

          {falownikWybrany && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Pole
                  label={`Liczba paneli w szeregu (rekomendowana: ${falownikWybrany.liczbaPaneliWSzereguRekomendowana})`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={liczbaPaneliWStringu}
                  onChange={(e) => setLiczbaPaneliWStringu(e.target.value)}
                />
                <Pole label="Minimalna temperatura w lokalizacji" unit="°C" type="number" inputMode="decimal" value={tminC} onChange={(e) => setTminC(e.target.value)} />
              </div>

              {!falownikWybrany.maMppt ? (
                <p className="rounded-md border p-3 text-small">
                  Ten falownik nie ma wbudowanego MPPT. Potrzebujesz zewnętrznego regulatora MPPT (40-60A, maks. napięcie PV 100-150V, ~400-500 zł). Maks. 2
                  panele w szeregu (Voc ~88V, poniżej 150V), 2-3 stringi równolegle — łącznie ok. 2000-3000W paneli JA Solar 500W.
                </p>
              ) : (
                result.value.pv && (
                  <div className="rounded-md border p-3 text-small">
                    <p>
                      {result.value.pv.liczbaPaneliWStringu} paneli × {result.value.pv.liczbaStringowRownoleglych} string(i) = {result.value.pv.mocPvCalkowitaWpW.toFixed(0)} Wp
                      łącznie · DC/AC = {result.value.pv.dcAcRatioCalkowity.toFixed(2)}
                    </p>
                    {result.value.pv.echo && isComputed(result.value.pv.status) && (
                      <p className="mt-1 text-caption text-muted-foreground">
                        Napięcie stringu w mrozie: {result.value.pv.echo.value.vStringColdV.toFixed(1)} V · napięcie robocze (STC):{" "}
                        {result.value.pv.echo.value.vStringStcV.toFixed(1)} V
                      </p>
                    )}
                    <ul className="mt-2 space-y-1">
                      {result.value.pv.warnings.map((w) => (
                        <li key={w.code}>{w.message}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </>
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
