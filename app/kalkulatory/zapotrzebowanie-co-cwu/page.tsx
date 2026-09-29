"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { calculateZapotrzebowanieCoCwu, type MiesiacCoCwu } from "@/lib/core/modules/ogrzewanie/zapotrzebowanie-co-cwu/calculator"
import { CWU_L_NA_OSOBE_ZRODLO_M6 } from "@/lib/core/modules/ogrzewanie/zapotrzebowanie-co-cwu/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type SeedObciazenia } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

const MIESIACE = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]

type Seed = { liczbaOsob: string; litry: string; tZimna: string; tCwu: string; copCwu: string }
const STAN_POCZATKOWY: Seed = { liczbaOsob: "", litry: String(CWU_L_NA_OSOBE_ZRODLO_M6), tZimna: "", tCwu: "", copCwu: "" }

/** Draft of M2/E4 "Liczba domowników" — source A: "liczba domowników (auto z Modułu 2)". */
type DraftDomownikow = { liczbaDomownikow: string }

const n = (s: string) => liczba(s) ?? null
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function ZapotrzebowanieCoCwuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Seed>("zapotrzebowanie-co-cwu", STAN_POCZATKOWY)
  const ustaw = <K extends keyof Seed>(k: K, v: Seed[K]) => setStan((s) => ({ ...s, [k]: v }))
  const ekran1 = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)
  const modul2 = useOdczytDraftu<DraftDomownikow>("liczba-domownikow")

  const wynikE1 = useMemo(() => (ekran1.dane ? calculateObciazenieCieplne(wejscieObciazenia(ekran1.dane)) : null), [ekran1.dane])
  const miesiaceE1 = wynikE1?.value?.miesiace ?? null
  const copCo = wynikE1?.value && ekran1.dane ? n(ekran1.dane.cop) : null
  const osobyZModulu2 = n(modul2.dane?.liczbaDomownikow ?? "")
  const osoby = stan.liczbaOsob.trim() === "" ? osobyZModulu2 : n(stan.liczbaOsob)

  const wynik = useMemo(() => {
    const cieplo: (number | null)[] = Array(12).fill(null)
    for (const m of miesiaceE1 ?? []) cieplo[m.miesiac - 1] = m.cieploKwh
    return calculateZapotrzebowanieCoCwu({
      cieploCoMiesiaceKwh: cieplo,
      liczbaOsob: osoby,
      cwuLitrowNaOsobeDoba: n(stan.litry),
      temperaturaZimnejWodyC: n(stan.tZimna),
      temperaturaCwuC: n(stan.tCwu),
      copCo,
      copCwu: n(stan.copCwu),
    })
  }, [miesiaceE1, osoby, stan, copCo])
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : "uwaga"
  const najzimniejszy = v?.miesiace?.reduce((a, m) => (m.razemKwhDoba > a.razemKwhDoba ? m : a))

  const kolumny: Kolumna<MiesiacCoCwu & { id: number }>[] = [
    { naglowek: "Miesiąc", render: (r) => MIESIACE[r.miesiac - 1] },
    { naglowek: "C.O. [kWh/d]", render: (r) => f1(r.coKwhDoba), liczbowa: true },
    { naglowek: "C.W.U. [kWh/d]", render: (r) => f1(r.cwuKwhDoba), liczbowa: true },
    { naglowek: "Razem [kWh/d]", render: (r) => f1(r.razemKwhDoba), liczbowa: true },
    { naglowek: "Prąd [kWh/d]", render: (r) => (r.pradKwhDoba === null ? "—" : f1(r.pradKwhDoba)), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zapotrzebowanie-co-cwu" />
      <NaglowekEkranu tytul="Zapotrzebowanie na C.O. i C.W.U." ekran="zapotrzebowanie-co-cwu" wynik={wynik}>
        Ile ciepła dziennie potrzeba na ogrzewanie domu (C.O.) i na ciepłą wodę (C.W.U.) w każdym miesiącu. Ogrzewanie
        bierze straty ciepła z Ekranu 1, ciepła woda liczy się z liczby osób. Moduł 6, Ekran 2.
      </NaglowekEkranu>

      <section className="flex flex-col gap-2 rounded-lg border p-4">
        <h2 className="font-semibold">1. Ogrzewanie (C.O.) — z Ekranu 1</h2>
        {!ekran1.wczytano ? null : !wynikE1?.value ? (
          <p className="text-small text-muted-foreground">
            Najpierw policz{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              straty ciepła budynku
            </Link>{" "}
            (Ekran 1) — stąd bierze się ciepło na ogrzewanie.
          </p>
        ) : !miesiaceE1 ? (
          <p className="text-small text-muted-foreground">
            Straty ciepła są policzone ({f1(wynikE1.value.obciazenieW / 1000)} kW przy {wynikE1.value.temperaturaZewnetrznaC} °C), ale bez
            miesięcy — na{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              Ekranie 1
            </Link>{" "}
            wstaw temperatury z PVGIS albo wpisz je w sekcji „Miesiące”.
          </p>
        ) : (
          <p className="text-small">
            Z Ekranu 1: {f1(wynikE1.value.obciazenieW / 1000)} kW strat przy {wynikE1.value.temperaturaZewnetrznaC} °C, ciepło w{" "}
            {miesiaceE1.length} miesiącach{copCo !== null ? `, COP ogrzewania ${f1(copCo)}` : ""}.{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              Zmień na Ekranie 1
            </Link>
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">2. Ciepła woda (C.W.U.)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Pole
            label="Liczba osób"
            type="number"
            inputMode="numeric"
            min={1}
            value={stan.liczbaOsob}
            placeholder={osobyZModulu2 !== null ? String(osobyZModulu2) : undefined}
            onChange={(e) => ustaw("liczbaOsob", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="osoby" />}
          />
          <Pole
            label="Ciepła woda na osobę"
            unit="l/dobę"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.litry}
            onChange={(e) => ustaw("litry", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="litry" params={{ l: CWU_L_NA_OSOBE_ZRODLO_M6 }} />}
          />
          <Pole
            label="Temperatura zimnej wody"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.tZimna}
            onChange={(e) => ustaw("tZimna", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="tZimna" />}
          />
          <Pole
            label="Temperatura ciepłej wody"
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.tCwu}
            onChange={(e) => ustaw("tCwu", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="tCiepla" />}
          />
          <Pole
            label="COP podgrzewania wody (opcjonalnie)"
            type="number"
            inputMode="decimal"
            min={0}
            value={stan.copCwu}
            onChange={(e) => ustaw("copCwu", e.target.value)}
            pomoc={<PomocPola ekran="zapotrzebowanie-co-cwu" pole="cop" />}
          />
        </div>
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
      {wynik.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">Wpisz liczbę osób, litry na osobę oraz temperaturę zimnej i ciepłej wody.</p>
      )}
      {v && (
        <WerdyktPanel
          poziom={poziom}
          etykieta={najzimniejszy ? `Najwięcej ciepła: ${MIESIACE[najzimniejszy.miesiac - 1]}` : "Ciepła woda na dobę"}
        >
          <WynikGlowny>{f1(najzimniejszy ? najzimniejszy.razemKwhDoba : v.cwuKwhDoba)} kWh/dobę</WynikGlowny>
          <p className="mt-1 text-small">
            {najzimniejszy && (
              <>
                C.O. {f1(najzimniejszy.coKwhDoba)} kWh + C.W.U. {f1(najzimniejszy.cwuKwhDoba)} kWh na dobę
                {najzimniejszy.pradKwhDoba !== null && (
                  <>
                    {" "}— ok. <strong>{f1(najzimniejszy.pradKwhDoba)} kWh prądu</strong>
                  </>
                )}
                .{" "}
              </>
            )}
            Ciepła woda: {f0(v.cwuLitrowDoba)} l na dobę podgrzane o {f1(v.deltaTK)} K = {f1(v.cwuKwhDoba)} kWh ciepła każdego dnia
            {v.cwuPradKwhDoba !== null && <> (ok. {f1(v.cwuPradKwhDoba)} kWh prądu)</>}.
          </p>
          {v.miesiace && (
            <div className="mt-3">
              <p className="text-small font-medium">
                Razem w tych miesiącach: C.O. {f0(v.coSumaKwh!)} kWh, C.W.U. {f0(v.cwuSumaMiesiecyKwh!)} kWh
              </p>
              <KartaPorownawcza kolumny={kolumny} wiersze={v.miesiace.map((m) => ({ ...m, id: m.miesiac }))} minWidth={320} />
            </div>
          )}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} />
          <p className="mt-2 text-small">
            Dalej:{" "}
            <Link href="/kalkulatory/bojler-cwu" className="underline">
              bojler C.W.U. (czas grzania)
            </Link>
            ,{" "}
            <Link href="/kalkulatory/koszty-ogrzewania" className="underline">
              czym najtaniej grzać
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}

      
    </main>
  )
}
