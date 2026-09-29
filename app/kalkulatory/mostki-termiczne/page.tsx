"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateMostkiTermiczne, type StrataMostka } from "@/lib/core/modules/ogrzewanie/mostki-termiczne/calculator"
import { KATALOG_PSI_14683, pozycjaKatalogu, type KategoriaMostka, type SystemWymiarow } from "@/lib/core/modules/ogrzewanie/mostki-termiczne/katalog-psi"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type SeedObciazenia } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

/** `kod`/`kodPo`: PN-EN ISO 14683 Tablica A.2 detail ("" = own Ψ); optional — drafts saved before 27.09.2026 lack them. */
type MostekSeed = { nazwa: string; dlugoscM: string; psi: string; psiPo: string; nadprozeBezIzolacji: boolean; kod?: string; kodPo?: string }
type Seed = { mostki: MostekSeed[]; system?: SystemWymiarow | "" }

const nowyMostek = (nazwa: string): MostekSeed => ({ nazwa, dlugoscM: "", psi: "", psiPo: "", nadprozeBezIzolacji: false, kod: "", kodPo: "" })
/** Examples named by the source: corners, roof–wall junction, balcony slabs, window reveals. */
const STAN_POCZATKOWY: Seed = {
  mostki: [nowyMostek("Narożniki ścian"), nowyMostek("Styk dachu ze ścianą"), nowyMostek("Płyty balkonowe"), nowyMostek("Ościeża i nadproża okien")],
}

const n = (s: string) => liczba(s) ?? null
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const KATEGORIE: { kategoria: KategoriaMostka; nazwa: string }[] = [
  { kategoria: "narozniki", nazwa: "Narożniki ścian" },
  { kategoria: "dach", nazwa: "Styk ściany z dachem" },
  { kategoria: "balkon", nazwa: "Płyty balkonowe" },
  { kategoria: "strop", nazwa: "Stropy pośrednie" },
  { kategoria: "sciana-wewnetrzna", nazwa: "Ściany wewnętrzne przy zewnętrznych" },
  { kategoria: "podloga-grunt", nazwa: "Podłoga na gruncie" },
  { kategoria: "podloga-podwieszona", nazwa: "Podłoga podwieszona" },
  { kategoria: "slup", nazwa: "Słupy w ścianie" },
  { kategoria: "otwor", nazwa: "Okna i drzwi (nadproże, ościeże, podokiennik)" },
]
const SYSTEMY: { system: SystemWymiarow; nazwa: string }[] = [
  { system: "e", nazwa: "Zewnętrzne (po obrysie budynku) — Ψe" },
  { system: "oi", nazwa: "Całkowite wewnętrzne (wnętrze ścian zewnętrznych) — Ψoi" },
  { system: "i", nazwa: "Wewnętrzne (każde pomieszczenie osobno) — Ψi" },
]

function WyborDetalu({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (kod: string) => void }) {
  return (
    <PoleSelect id={id} label={label} value={value} onChange={(e) => onChange(e.target.value)} pomoc={<PomocPola ekran="mostki-termiczne" pole="detal" />}>
      <option value="">— własna wartość Ψ —</option>
      {KATEGORIE.map((k) => (
        <optgroup key={k.kategoria} label={k.nazwa}>
          {KATALOG_PSI_14683.filter((x) => x.kategoria === k.kategoria).map((x) => (
            <option key={x.kod} value={x.kod}>
              {x.kod} — {x.opis}
            </option>
          ))}
        </optgroup>
      ))}
    </PoleSelect>
  )
}

/** Ψ of the chosen table detail for the chosen system — display only, the core does the calculation. */
function PsiZTablicy({ kod, system }: { kod: string; system: SystemWymiarow | "" }) {
  const poz = pozycjaKatalogu(kod)
  if (!poz) return null
  return (
    <p className="text-small text-muted-foreground">
      {system === "" ? (
        <>
          Ψ z tablicy zależy od systemu wymiarów (wybierz wyżej): Ψe {f2(poz.psi.e)} · Ψoi {f2(poz.psi.oi)} · Ψi {f2(poz.psi.i)} W/(m·K).
        </>
      ) : (
        <>
          Ψ{system} = <strong>{f2(poz.psi[system])} W/(m·K)</strong> (PN-EN ISO 14683, Tablica A.2, {poz.kod}).
        </>
      )}
    </p>
  )
}

function KartaMostka({
  m,
  i,
  system,
  ustaw,
  usun,
}: {
  m: MostekSeed
  i: number
  system: SystemWymiarow | ""
  ustaw: (z: Partial<MostekSeed>) => void
  usun: () => void
}) {
  const kod = m.kod ?? ""
  const kodPo = m.kodPo ?? ""
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Pole id={`mostek-${i}-nazwa`} label="Nazwa" value={m.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="mostki-termiczne" pole="nazwa" />} />
      <WyborDetalu id={`mostek-${i}-kod`} label="Detal z PN-EN ISO 14683 (opcjonalnie)" value={kod} onChange={(k) => ustaw({ kod: k })} />
      <PsiZTablicy kod={kod} system={system} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Pole
          id={`mostek-${i}-dlugosc`}
          label="Długość"
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={m.dlugoscM}
          onChange={(e) => ustaw({ dlugoscM: e.target.value })}
          pomoc={<PomocPola ekran="mostki-termiczne" pole="dlugosc" />}
        />
        {kod === "" && (
          <Pole
            id={`mostek-${i}-psi`}
            label="Ψ"
            unit="W/(m·K)"
            type="number"
            inputMode="decimal"
            value={m.psi}
            onChange={(e) => ustaw({ psi: e.target.value })}
            pomoc={<PomocPola ekran="mostki-termiczne" pole="psi" />}
          />
        )}
        {kodPo === "" && (
          <Pole
            id={`mostek-${i}-psi-po`}
            label="Ψ po poprawie (opcjonalnie)"
            unit="W/(m·K)"
            type="number"
            inputMode="decimal"
            value={m.psiPo}
            onChange={(e) => ustaw({ psiPo: e.target.value })}
            pomoc={<PomocPola ekran="mostki-termiczne" pole="psiPo" />}
          />
        )}
      </div>
      <WyborDetalu id={`mostek-${i}-kod-po`} label="Detal po poprawie (opcjonalnie)" value={kodPo} onChange={(k) => ustaw({ kodPo: k })} />
      <PsiZTablicy kod={kodPo} system={system} />
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={`mostek-${i}-nadproze`}
          className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
          checked={m.nadprozeBezIzolacji}
          onChange={(e) => ustaw({ nadprozeBezIzolacji: e.target.checked })}
        />
        <label htmlFor={`mostek-${i}-nadproze`} className="text-small">
          To nadproże nad oknem bez izolacji
        </label>
        <PomocPola ekran="mostki-termiczne" pole="nadproze" />
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        Usuń mostek
      </Button>
    </div>
  )
}

export default function MostkiTermicznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Seed>("mostki-termiczne", STAN_POCZATKOWY)
  const ustawMostek = (i: number, z: Partial<MostekSeed>) => setStan((s) => ({ ...s, mostki: s.mostki.map((m, j) => (j === i ? { ...m, ...z } : m)) }))
  const ekran1 = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)

  const wejscieE1 = useMemo(() => (ekran1.dane ? wejscieObciazenia(ekran1.dane) : null), [ekran1.dane])
  const wynikE1 = useMemo(() => (wejscieE1 ? calculateObciazenieCieplne(wejscieE1) : null), [wejscieE1])
  const ti = wejscieE1?.temperaturaWewnetrznaC ?? null
  const te = wejscieE1?.strefaKlimatyczna ? TEMPERATURA_OBLICZENIOWA_ZEWNETRZNA_C[wejscieE1.strefaKlimatyczna] : null
  const obciazenieE1 = wynikE1?.value?.obciazenieW ?? null

  const wynik = useMemo(
    () =>
      calculateMostkiTermiczne({
        mostki: stan.mostki.map((m) => ({
          nazwa: m.nazwa.trim(),
          dlugoscM: n(m.dlugoscM),
          psiWmK: n(m.psi),
          psiPoPoprawieWmK: n(m.psiPo),
          nadprozeBezIzolacji: m.nadprozeBezIzolacji,
          kodKatalogu: m.kod || null,
          kodKataloguPoPoprawie: m.kodPo || null,
        })),
        systemWymiarow: stan.system || null,
        temperaturaWewnetrznaC: ti,
        temperaturaZewnetrznaC: te,
        obciazenieBezMostkowW: obciazenieE1,
      }),
    [stan, ti, te, obciazenieE1],
  )
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : "uwaga"

  const kolumny: Kolumna<StrataMostka & { id: number }>[] = [
    { naglowek: "Mostek", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "Ψ·l [W/K]", render: (r) => f1(r.hWK), liczbowa: true },
    { naglowek: "Strata [W]", render: (r) => f0(r.strataW), liczbowa: true },
    { naglowek: "Po poprawie [W]", render: (r) => (r.strataPoPoprawieW === null ? "—" : f0(r.strataPoPoprawieW)), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/mostki-termiczne" />
      <NaglowekEkranu tytul="Mostki termiczne" ekran="mostki-termiczne" wynik={wynik}>
        Miejsca, gdzie izolacja jest przerwana — narożniki, styk dachu ze ścianą, płyty balkonowe, ościeża okien. Każdy metr
        takiego połączenia traci ciepło ponad to, co liczą same przegrody na Ekranie 1. Moduł 6, Ekran 7.
      </NaglowekEkranu>

      <section className="flex flex-col gap-2 rounded-lg border p-4">
        <h2 className="font-semibold">1. Temperatury i straty — z Ekranu 1</h2>
        {!ekran1.wczytano ? null : ti === null || te === null ? (
          <p className="text-small text-muted-foreground">
            Na{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              Ekranie 1 „Straty ciepła budynku”
            </Link>{" "}
            wybierz strefę klimatyczną i temperaturę w domu — stąd bierze się różnica temperatur dla mostków.
          </p>
        ) : (
          <p className="text-small">
            Wewnątrz {f1(ti)} °C, na zewnątrz {te} °C
            {obciazenieE1 !== null
              ? `, straty przegród i powietrza ${f1(obciazenieE1 / 1000)} kW (bez mostków).`
              : " — straty z Ekranu 1 jeszcze niepełne, więc bez udziału mostków w całości."}{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              Zmień na Ekranie 1
            </Link>
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Mostki</h2>
        <p className="text-small text-muted-foreground">
          Wpisz długość każdego rodzaju połączenia i jego Ψ — własne (z katalogu producenta albo od projektanta) albo wybierz
          najbliższy detal z tablicy wartości orientacyjnych PN-EN ISO 14683. Tablica celowo zawyża (najgorszy przypadek), więc
          detal z projektu jest dokładniejszy. Rodzaj, którego nie ma w domu, usuń.
        </p>
        <PoleSelect
          label="Jak mierzone są powierzchnie na Ekranie 1"
          value={stan.system ?? ""}
          onChange={(e) => setStan((s) => ({ ...s, system: e.target.value as SystemWymiarow | "" }))}
          pomoc={<PomocPola ekran="mostki-termiczne" pole="system" />}
        >
          <option value="">— wybierz —</option>
          {SYSTEMY.map((x) => (
            <option key={x.system} value={x.system}>
              {x.nazwa}
            </option>
          ))}
        </PoleSelect>
        {stan.mostki.map((m, i) => (
          <KartaMostka key={i} m={m} i={i} system={stan.system ?? ""} ustaw={(z) => ustawMostek(i, z)} usun={() => setStan((s) => ({ ...s, mostki: s.mostki.filter((_, j) => j !== i) }))} />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, mostki: [...s.mostki, nowyMostek("")] }))}>
          + Dodaj mostek
        </Button>
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta="Sprawdź dane">
          <ul className="mt-2 space-y-1 text-small">
            {wynik.warnings.map((w, i) => (
              <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && ti !== null && te !== null && (
        <p className="text-small text-muted-foreground">
          Wpisz długość i Ψ każdego mostka (albo usuń te, których nie ma). Dla detali z tablicy wybierz system wymiarów.
        </p>
      )}
      {v && (
        <WerdyktPanel poziom={poziom} etykieta={`Straty przez mostki przy ${te} °C`}>
          <WynikGlowny>{f0(v.strataMostkowW)} W</WynikGlowny>
          <p className="mt-1 text-small">
            {v.udzialMostkowPct !== null && v.obciazenieZMostkamiW !== null ? (
              <>
                To <strong>{f0(v.udzialMostkowPct)}% całkowitych strat ciepła</strong> — razem z Ekranem 1 dom traci{" "}
                {f1(v.obciazenieZMostkamiW / 1000)} kW.{" "}
              </>
            ) : null}
            {v.strataMostkowPoPoprawieW !== null && (
              <>
                Po poprawie: {f0(v.strataMostkowPoPoprawieW)} W
                {v.udzialMostkowPoPoprawiePct !== null && <> ({f0(v.udzialMostkowPoPoprawiePct)}% strat)</>}.
              </>
            )}
          </p>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.mostki.map((m, i) => ({ ...m, id: i }))} minWidth={320} />
          </div>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
