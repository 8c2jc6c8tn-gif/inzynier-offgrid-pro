"use client"

import Link from "next/link"
import { useMemo } from "react"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { isComputed } from "@/lib/core/calc-result"
import { calculateRachunek } from "@/lib/core/modules/siec/rachunek-za-prad/calculator"
import type { Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { calculateScenariuszePrzejscia } from "@/lib/core/modules/siec/scenariusze-przejscia/calculator"
import { OPIS_SCENARIUSZA, SCENARIUSZE } from "@/lib/core/modules/siec/scenariusze-przejscia/constants"
import type { IdScenariusza, ParametryScenariusza } from "@/lib/core/modules/siec/scenariusze-przejscia/input"
import { HORYZONT_DOMYSLNY_LAT } from "@/lib/core/modules/siec/sciezka-cen-energii/constants"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { type StanRachunku, kluczRachunku, wejscieRachunku } from "./formularz-rachunku"
import { POCZATKOWY_WZROSTU, PoleWzrostuCen, type StanWzrostuCen, trybZeStanu } from "./pole-wzrostu-cen"
import { type StanPvMagazynu, kluczPv } from "./pv-magazyn"
import { uzyskZeStanu } from "./uzysk-pv"
import { liczbaLubNull, poziomWerdyktu, zl } from "./wspolne"
import { useZuzycieMiesieczne } from "./zuzycie-miesieczne"

type StanScenariusza = { inwestycja: string; dotacja: string; moc: string; pojemnosc: string; kosztMagazynu: string; serwis: string }

type Stan = {
  horyzont: string
  wzrost: StanWzrostuCen
  stopa: string
  kosztStaly: string
  cenaZmienna: string
  wartoscNadwyzki: string
  zywotnosc: string
  agregatMoc: string
  agregatLH: string
  paliwo: string
  scen: Record<IdScenariusza, StanScenariusza>
  osobyZalezne: "" | "tak" | "nie"
  zapasRedundantny: boolean
  prog: string
  czasBezZasilania: string
  potwierdzamD: boolean
}

const PUSTY_SCEN: StanScenariusza = { inwestycja: "", dotacja: "", moc: "", pojemnosc: "", kosztMagazynu: "", serwis: "" }

const POCZATKOWY: Stan = {
  horyzont: String(HORYZONT_DOMYSLNY_LAT),
  wzrost: POCZATKOWY_WZROSTU,
  stopa: "0",
  kosztStaly: "",
  cenaZmienna: "",
  wartoscNadwyzki: "",
  zywotnosc: "",
  agregatMoc: "",
  agregatLH: "",
  paliwo: "",
  scen: { A: PUSTY_SCEN, B: PUSTY_SCEN, C: PUSTY_SCEN, D: PUSTY_SCEN },
  osobyZalezne: "",
  zapasRedundantny: false,
  prog: "",
  czasBezZasilania: "",
  potwierdzamD: false,
}

const NAZWA: Record<IdScenariusza, string> = {
  A: "A — sieć + PV",
  B: "B — sieć + PV + magazyn",
  C: "C — off-grid, sieć jako zapas",
  D: "D — pełne odłączenie",
}

const ROK_BAZOWY = Number(DANE_ROZLICZEN.stanNa.slice(0, 4))
const num = (s: string) => (s === "" ? 0 : Number(s))
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

/**
 * M14 — D7 „Porównanie scenariuszy A–D” (dom) / F8 (firma, with RF1), Wzorzec G. Echo of D1/F1
 * (grid costs), D3/F6 (12 months) and D4/F6 (PV yield, self-consumption, storage efficiency);
 * never writes their drafts. Always the full A–D table — never one „best” verdict.
 */
export function PorownanieScenariuszy({ segment }: { segment: Segment }) {
  const firma = segment === "firma"
  const [stan, setStan] = usePersistedDraft<Stan>(`siec-scenariusze-${segment}`, POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))
  const ustawScen = (id: IdScenariusza, z: Partial<StanScenariusza>) =>
    setStan((p) => ({ ...p, scen: { ...p.scen, [id]: { ...p.scen[id], ...z } } }))

  const { zuzycie, wczytano: w1 } = useZuzycieMiesieczne(segment)
  const { dane: pv, wczytano: w2 } = useOdczytDraftu<StanPvMagazynu>(kluczPv(segment))
  const { dane: rachunekStan, wczytano: w3 } = useOdczytDraftu<StanRachunku>(kluczRachunku(segment))

  // Echo D1/F1: fixed part = „cena trzymania sieci”, variable brutto per kWh = (brutto − fixed) / kWh.
  const echoRachunku = useMemo(() => {
    if (!rachunekStan) return null
    const r = calculateRachunek(wejscieRachunku(segment, rachunekStan, zuzycie))
    if (!isComputed(r.status) || r.value.zuzycieRoczneKwh <= 0) return null
    return {
      staly: r.value.cenaTrzymaniaSieciBruttoZl,
      zmienna: (r.value.bruttoZl - r.value.cenaTrzymaniaSieciBruttoZl) / r.value.zuzycieRoczneKwh,
    }
  }, [rachunekStan, segment, zuzycie])

  const uzysk = uzyskZeStanu(pv?.uzysk)
  const pvMoc = pv?.mocPvKwp ? Number(pv.mocPvKwp) : 0
  const pvPojemnosc = pv?.pojemnoscKwh ? Number(pv.pojemnoscKwh) : 0

  const result = useMemo(() => {
    const parametry = (id: IdScenariusza): ParametryScenariusza => {
      const s = stan.scen[id]
      return {
        inwestycjaZl: liczbaLubNull(s.inwestycja),
        dotacjaZl: num(s.dotacja),
        mocPvKwp: s.moc === "" ? pvMoc : Number(s.moc),
        pojemnoscMagazynuKwh: id === "A" ? 0 : s.pojemnosc === "" ? pvPojemnosc : Number(s.pojemnosc),
        kosztMagazynuZl: id === "A" ? 0 : num(s.kosztMagazynu),
        serwisRokZl: num(s.serwis),
      }
    }
    return calculateScenariuszePrzejscia({
      segment,
      rokBazowy: ROK_BAZOWY,
      horyzontLat: num(stan.horyzont),
      tryb: trybZeStanu(stan.wzrost),
      stopaDyskontowaProcent: num(stan.stopa),
      zuzycieMiesieczneKwh: zuzycie ?? [],
      uzyskMiesiecznyKwhNaKwp: uzysk ?? [],
      autokonsumpcjaBezposrednia: pv?.autokonsumpcjaProcent ? Number(pv.autokonsumpcjaProcent) / 100 : null,
      sprawnoscMagazynu: pv?.sprawnoscProcent ? Number(pv.sprawnoscProcent) / 100 : null,
      zywotnoscMagazynuLat: liczbaLubNull(stan.zywotnosc),
      siec: {
        kosztStalyRokBruttoZl: stan.kosztStaly !== "" ? Number(stan.kosztStaly) : (echoRachunku?.staly ?? null),
        cenaZmiennaKwhBruttoZl: stan.cenaZmienna !== "" ? Number(stan.cenaZmienna) : (echoRachunku?.zmienna ?? null),
        wartoscNadwyzkiKwhZl: liczbaLubNull(stan.wartoscNadwyzki),
      },
      agregat: { mocKw: num(stan.agregatMoc), zuzycieLH: liczbaLubNull(stan.agregatLH), cenaPaliwaZlL: liczbaLubNull(stan.paliwo) },
      scenariusze: { A: parametry("A"), B: parametry("B"), C: parametry("C"), D: parametry("D") },
      kontrola: {
        osobyZalezneOdZasilania: stan.osobyZalezne === "" ? null : stan.osobyZalezne === "tak",
        zapasRedundantny: stan.zapasRedundantny,
        progGodzinAgregatuMies: liczbaLubNull(stan.prog),
        dopuszczalnyCzasBezZasilaniaH: liczbaLubNull(stan.czasBezZasilania),
      },
    })
  }, [stan, segment, zuzycie, uzysk, pv, pvMoc, pvPojemnosc, echoRachunku])

  if (!w1 || !w2 || !w3) return <StanLadowania linie={8} />
  const brakZrodel = !zuzycie || !uzysk
  const v = result.value
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const inflacja = v?.inflacjaProcent != null

  return (
    <>
      {brakZrodel && (
        <StanPusty tytul="Najpierw zużycie z 12 miesięcy i uzysk PV">
          {firma ? (
            <Link className="underline" href="/kalkulatory/pv-w-firmie">
              PV w firmie i autokonsumpcja →
            </Link>
          ) : (
            <>
              <Link className="underline" href="/kalkulatory/zuzycie-miesieczne">
                Moje zużycie miesięcznie
              </Link>{" "}
              ·{" "}
              <Link className="underline" href="/kalkulatory/pv-i-magazyn">
                Ile PV i magazynu
              </Link>
            </>
          )}
        </StanPusty>
      )}

      <PoleWzrostuCen
        stan={stan.wzrost}
        onChange={(z) => ustaw({ wzrost: { ...stan.wzrost, ...z } })}
        rokBazowy={ROK_BAZOWY}
        horyzontLat={num(stan.horyzont)}
      />

      <SekcjaAkordeon tytul="Sieć i horyzont">
        <div className="grid grid-cols-2 gap-3">
          <Pole label="Horyzont N" unit="lat" type="number" inputMode="numeric" min={10} max={25} value={stan.horyzont} onChange={(e) => ustaw({ horyzont: e.target.value })} hint="10–25, domyślnie 15" />
          <Pole label="Stopa dyskontowa r" unit="%/rok" type="number" inputMode="decimal" value={stan.stopa} onChange={(e) => ustaw({ stopa: e.target.value })} hint="0 = tryb prosty" />
          <Pole
            label="„Cena trzymania sieci” brutto"
            unit="zł/rok"
            type="number"
            inputMode="decimal"
            value={stan.kosztStaly}
            placeholder={echoRachunku ? f0(echoRachunku.staly) : ""}
            onChange={(e) => ustaw({ kosztStaly: e.target.value })}
            hint={echoRachunku ? "Puste = z ekranu „Mój rachunek dziś”." : "Policz na ekranie „Mój rachunek dziś” albo wpisz."}
          />
          <Pole
            label="Koszt zmienny 1 kWh brutto"
            unit="zł/kWh"
            type="number"
            inputMode="decimal"
            value={stan.cenaZmienna}
            placeholder={echoRachunku ? echoRachunku.zmienna.toFixed(2) : ""}
            onChange={(e) => ustaw({ cenaZmienna: e.target.value })}
            hint={echoRachunku ? "Puste = z ekranu „Mój rachunek dziś”." : undefined}
          />
          <Pole
            label="Wartość 1 kWh oddanej"
            unit="zł/kWh"
            type="number"
            inputMode="decimal"
            value={stan.wartoscNadwyzki}
            onChange={(e) => ustaw({ wartoscNadwyzki: e.target.value })}
            hint="Z ekranu depozytu (cena × 1,23). 0, jeśli nic nie oddajesz."
          />
          <Pole label="Żywotność magazynu" unit="lat" type="number" inputMode="decimal" value={stan.zywotnosc} onChange={(e) => ustaw({ zywotnosc: e.target.value })} hint="Z karty katalogowej (cykle) — do wymian i wartości końcowej." />
        </div>
        <p className="text-small text-muted-foreground">
          Moc PV i magazyn domyślnie jak na ekranie „{firma ? "PV w firmie" : "Ile PV i magazynu"}” ({f0(pvMoc)} kWp,{" "}
          {f0(pvPojemnosc)} kWh). W scenariuszu możesz wpisać inne.
        </p>
      </SekcjaAkordeon>

      {SCENARIUSZE.map((id) => (
        <SekcjaAkordeon key={id} tytul={NAZWA[id]}>
          <div className="grid grid-cols-2 gap-3">
            <Pole label="Inwestycja" unit="zł" type="number" inputMode="decimal" value={stan.scen[id].inwestycja} onChange={(e) => ustawScen(id, { inwestycja: e.target.value })} hint="Puste = scenariusz pominięty. Twoje ceny." />
            <Pole label="Dotacja" unit="zł" type="number" inputMode="decimal" value={stan.scen[id].dotacja} onChange={(e) => ustawScen(id, { dotacja: e.target.value })} />
            <Pole label="Moc PV" unit="kWp" type="number" inputMode="decimal" value={stan.scen[id].moc} placeholder={String(pvMoc)} onChange={(e) => ustawScen(id, { moc: e.target.value })} />
            {id !== "A" && (
              <>
                <Pole label="Magazyn" unit="kWh" type="number" inputMode="decimal" value={stan.scen[id].pojemnosc} placeholder={String(pvPojemnosc)} onChange={(e) => ustawScen(id, { pojemnosc: e.target.value })} />
                <Pole label="W tym koszt magazynu" unit="zł" type="number" inputMode="decimal" value={stan.scen[id].kosztMagazynu} onChange={(e) => ustawScen(id, { kosztMagazynu: e.target.value })} hint="Do wymiany po żywotności." />
              </>
            )}
            <Pole label="Serwis" unit="zł/rok" type="number" inputMode="decimal" value={stan.scen[id].serwis} onChange={(e) => ustawScen(id, { serwis: e.target.value })} />
          </div>
          {id === "D" && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Pole label="Agregat — moc" unit="kW" type="number" inputMode="decimal" value={stan.agregatMoc} onChange={(e) => ustaw({ agregatMoc: e.target.value })} hint="0 = bez agregatu" />
              <Pole label="Zużycie paliwa" unit="l/h" type="number" inputMode="decimal" value={stan.agregatLH} onChange={(e) => ustaw({ agregatLH: e.target.value })} />
              <Pole label="Cena paliwa" unit="zł/l" type="number" inputMode="decimal" value={stan.paliwo} onChange={(e) => ustaw({ paliwo: e.target.value })} />
              <Pole label="Mój próg pracy agregatu" unit="h/mies." type="number" inputMode="decimal" value={stan.prog} onChange={(e) => ustaw({ prog: e.target.value })} hint="Powyżej — „D ryzykowne”." />
            </div>
          )}
          {OPIS_SCENARIUSZA[id].wyspa && id === "C" && (
            <p className="mt-2 text-small text-muted-foreground">Sieć zostaje jako zapas: płacisz opłaty stałe i to, co pobierzesz w złych miesiącach.</p>
          )}
        </SekcjaAkordeon>
      ))}

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Pytania kontrolne</h2>
        <PoleSelect label="Czy ktoś zależy od zasilanego sprzętu medycznego?" value={stan.osobyZalezne} onChange={(e) => ustaw({ osobyZalezne: e.target.value as Stan["osobyZalezne"] })} hint="Koncentrator tlenu, sprzęt medyczny, lodówka z lekami (R4).">
          <option value="">— wybierz —</option>
          <option value="nie">nie</option>
          <option value="tak">tak</option>
        </PoleSelect>
        <PoleCheckbox id={`siec-zapas-${segment}`} checked={stan.zapasRedundantny} onChange={(e) => ustaw({ zapasRedundantny: e.target.checked })} label="Mam redundantny zapas — drugie, niezależne źródło (np. agregat z osobnym torem ładowania)" />
        {firma && (
          <Pole label="Dopuszczalny czas bez zasilania" unit="h" type="number" inputMode="decimal" value={stan.czasBezZasilania} onChange={(e) => ustaw({ czasBezZasilania: e.target.value })} hint="Chłodnie, produkcja, serwery — ile godzin firma zniesie (RF1)." />
        )}
      </section>

      {result.status === "INCOMPLETE" ? (
        <WerdyktPanel poziom="uwaga" etykieta="Brakuje danych — nic nie zgadujemy">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INVALID_INPUT" || result.status === "OUT_OF_SCOPE" || !v ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziom ?? "ok"} etykieta={`Scenariusze na ${stan.horyzont} lat`}>
          <p className="text-small">
            <strong>Najtańszy:</strong> {v.najtanszy ? NAZWA[v.najtanszy] : "—"}. <strong>Najbardziej niezależny:</strong>{" "}
            {v.najbardziejNiezalezny ? NAZWA[v.najbardziejNiezalezny] : "—"}. To dwie różne odpowiedzi — aplikacja nie wybiera
            „najlepszego”.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-small tabular-nums">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 font-normal">Scen.</th>
                  <th className="py-1 text-right font-normal">I − dotacja</th>
                  <th className="py-1 text-right font-normal">Koszt roku 1</th>
                  <th className="py-1 text-right font-normal">TCO (dziś. zł)</th>
                  {inflacja && <th className="py-1 text-right font-normal">Zapłacisz łącznie</th>}
                  <th className="py-1 text-right font-normal">Zwrot vs A</th>
                  <th className="py-1 text-right font-normal">Własna energia</th>
                  <th className="py-1 text-right font-normal">Agregat</th>
                  <th className="py-1 pl-2 font-normal">Odwracalność</th>
                </tr>
              </thead>
              <tbody>
                {v.scenariusze.map((s) => {
                  const ukryj = s.id === "D" && !stan.potwierdzamD
                  return (
                    <tr key={s.id} className="border-t">
                      <td className="py-1 font-medium">{s.id}</td>
                      <td className="py-1 text-right">{zl(s.inwestycjaNettoZl)}</td>
                      <td className="py-1 text-right">{zl(s.kosztRok1Zl)}</td>
                      <td className="py-1 text-right">{ukryj ? "potwierdź ↓" : zl(s.tcoDzisiejszeZl)}</td>
                      {inflacja && <td className="py-1 text-right">{ukryj ? "—" : zl(s.tcoNominalneZl)}</td>}
                      <td className="py-1 text-right">{s.id === "A" ? "—" : s.okresZwrotuLat === null ? `> ${stan.horyzont} lat` : `${s.okresZwrotuLat} lat`}</td>
                      <td className="py-1 text-right">{Math.round(s.pokrycieWlasne * 100)}%</td>
                      <td className="py-1 text-right">{s.id === "D" ? `${f0(s.godzinyAgregatuRok)} h/rok (maks. ${f0(s.godzinyAgregatuMaxMies)} h/mies.)` : "—"}</td>
                      <td className="py-1 pl-2">{s.odwracalny ? "pełna" : "praktycznie nieodwracalne"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {v.scenariusze.some((s) => s.id === "D") && (
            <PoleCheckbox
              id={`siec-potwierdz-d-${segment}`}
              className="mt-3"
              checked={stan.potwierdzamD}
              onChange={(e) => ustaw({ potwierdzamD: e.target.checked })}
              label="Rozumiem, że pełne odłączenie (D) jest praktycznie nieodwracalne — powrót to nowe przyłączenie."
            />
          )}
          <p className="mt-2 text-small text-muted-foreground">
            Wymiany magazynu:{" "}
            {v.scenariusze
              .filter((s) => s.wymianyMagazynu.length > 0)
              .map((s) => `${s.id} w roku ${s.wymianyMagazynu.join(", ")}`)
              .join("; ") || "brak w horyzoncie"}
            . Dalej:{" "}
            <Link className="underline" href="/kalkulatory/ryzyka-odlaczenia">
              ryzyka odłączenia
            </Link>{" "}
            ·{" "}
            <Link className="underline" href="/kalkulatory/rezygnacja-z-przylacza">
              procedura
            </Link>
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </>
  )
}
