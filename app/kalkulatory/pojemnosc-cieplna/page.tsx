"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Button } from "@/components/ui/button"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateObciazenieCieplne } from "@/lib/core/modules/ogrzewanie/obciazenie-cieplne/calculator"
import { calculatePojemnoscCieplna, type UdzialWarstwy } from "@/lib/core/modules/ogrzewanie/pojemnosc-cieplna/calculator"
import type { StronaWarstwy } from "@/lib/core/modules/ogrzewanie/pojemnosc-cieplna/input"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { KLUCZ_DRAFTU_OBCIAZENIA, wejscieObciazenia, type SeedObciazenia } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"

/** `strona`/`gruboscElementu` since 27.09.2026 (EN ISO 13786 Zał. A) — optional, older drafts lack them. */
type WarstwaSeed = { nazwa: string; powierzchnia: string; grubosc: string; gestosc: string; cieplo: string; strona?: StronaWarstwy; gruboscElementu?: string }
type Seed = { warstwy: WarstwaSeed[]; temperaturaStartowa: string; temperaturaZewnetrzna: string; temperaturaGraniczna: string }

const nowaWarstwa = (nazwa: string, strona: StronaWarstwy = "jedna"): WarstwaSeed => ({
  nazwa,
  powierzchnia: "",
  grubosc: "",
  gestosc: "",
  cieplo: "",
  strona,
  gruboscElementu: "",
})
const stanPoczatkowy = (t: (k: string) => string): Seed => ({
  warstwy: [nowaWarstwa(t("UI-POJCIE-SCIANY-ZEWNETRZNE")), nowaWarstwa(t("UI-POJCIE-STROPY")), nowaWarstwa(t("UI-POJCIE-SCIANKI-DZIALOWE"), "obie")],
  temperaturaStartowa: "",
  temperaturaZewnetrzna: "",
  temperaturaGraniczna: "",
})

const n = (s: string) => liczba(s) ?? null
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

function KartaWarstwy({ w, i, ustaw, usun }: { w: WarstwaSeed; i: number; ustaw: (z: Partial<WarstwaSeed>) => void; usun: () => void }) {
  const t = useTranslate()
  const pole = (klucz: "powierzchnia" | "grubosc" | "gestosc" | "cieplo" | "gruboscElementu", label: string, unit: string) => (
    <Pole
      id={`warstwa-${i}-${klucz}`}
      label={label}
      unit={unit}
      type="number"
      inputMode="decimal"
      min={0}
      value={w[klucz] ?? ""}
      onChange={(e) => ustaw({ [klucz]: e.target.value })}
      pomoc={<PomocPola ekran="pojemnosc-cieplna" pole={klucz} />}
    />
  )
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Pole id={`warstwa-${i}-nazwa`} label={t("UI-POJCIE-WARSTWA-MATERIAL")} value={w.nazwa} onChange={(e) => ustaw({ nazwa: e.target.value })} pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="nazwa" />} />
      <div className="grid gap-3 sm:grid-cols-2">
        {pole("powierzchnia", "Powierzchnia", "m²")}
        {pole("grubosc", t("UI-POJCIE-GRUBOSC"), "cm")}
        {pole("gestosc", t("UI-POJCIE-GESTOSC"), "kg/m³")}
        {pole("cieplo", t("UI-POJCIE-CIEPLO-WLASCIWE"), "J/(kg·K)")}
        <PoleSelect
          id={`warstwa-${i}-strona`}
          label={t("UI-POJCIE-POLOZENIE")}
          value={w.strona ?? "jedna"}
          onChange={(e) => ustaw({ strona: e.target.value as StronaWarstwy })}
          pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="polozenie" />}
        >
          <option value="jedna">{t("UI-POJCIE-JEDNA-STRONA-WNETRZA")}</option>
          <option value="obie">{t("UI-POJCIE-CALA-WEWNATRZ-DOMU")}</option>
          <option value="za-izolacja">{t("UI-POJCIE-IZOLACJA-ZEWNETRZNA-WARSTWA")}</option>
        </PoleSelect>
        {pole("gruboscElementu", t("UI-POJCIE-GRUBOSC-CALEJ-PRZEGRODY"), "cm")}
      </div>
      <Button variant="ghost" className="min-h-11 w-fit" onClick={usun}>
        {t("UI-POJCIE-USUN-WARSTWE")}
      </Button>
    </div>
  )
}

export default function PojemnoscCieplnaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Seed>("pojemnosc-cieplna", stanPoczatkowy(t))
  const ustaw = (z: Partial<Seed>) => setStan((s) => ({ ...s, ...z }))
  const ustawWarstwe = (i: number, z: Partial<WarstwaSeed>) =>
    setStan((s) => ({ ...s, warstwy: s.warstwy.map((w, j) => (j === i ? { ...w, ...z } : w)) }))
  const ekran1 = useOdczytDraftu<SeedObciazenia>(KLUCZ_DRAFTU_OBCIAZENIA)

  // H and design temperatures from Ekran 1 — only when its result is complete and valid.
  const e1 = useMemo(() => {
    if (!ekran1.dane) return null
    const wejscie = wejscieObciazenia(ekran1.dane)
    const w = calculateObciazenieCieplne(wejscie)
    if (!w.value) return null
    const zewn = wejscie.przegrody.filter((p) => p.zewnetrzna)
    const inne = wejscie.przegrody.filter((p) => !p.zewnetrzna)
    return {
      hZewnetrzneWK: zewn.reduce((s, p) => s + p.uWM2K! * p.powierzchniaM2!, 0) + w.value.hvWK,
      stratyDoInnychStref: inne.map((p) => ({ hWK: p.uWM2K! * p.powierzchniaM2!, temperaturaC: p.temperaturaPoDrugiejStronieC! })),
      kubaturaM3: wejscie.kubaturaM3,
      ti: wejscie.temperaturaWewnetrznaC!,
      te: w.value.temperaturaZewnetrznaC,
    }
  }, [ekran1.dane])

  const tStart = n(stan.temperaturaStartowa) ?? e1?.ti ?? null
  const tZewn = n(stan.temperaturaZewnetrzna) ?? e1?.te ?? null
  const wynik = useMemo(
    () =>
      calculatePojemnoscCieplna({
        warstwy: stan.warstwy.map((w) => ({
          nazwa: w.nazwa.trim(),
          powierzchniaM2: n(w.powierzchnia),
          gruboscCm: n(w.grubosc),
          gestoscKgM3: n(w.gestosc),
          cieploWlasciweJKgK: n(w.cieplo),
          strona: w.strona ?? "jedna",
          gruboscElementuCm: n(w.gruboscElementu ?? ""),
        })),
        kubaturaM3: e1?.kubaturaM3 ?? null,
        hZewnetrzneWK: e1?.hZewnetrzneWK ?? null,
        stratyDoInnychStref: e1?.stratyDoInnychStref ?? [],
        temperaturaPoczatkowaC: tStart,
        temperaturaZewnetrznaC: tZewn,
        temperaturaGranicznaC: n(stan.temperaturaGraniczna),
      }),
    [stan, e1, tStart, tZewn],
  )
  const v = wynik.value
  const tg = n(stan.temperaturaGraniczna)

  const kolumny: Kolumna<UdzialWarstwy & { id: number }>[] = [
    { naglowek: t("UI-POJCIE-WARSTWA"), render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: t("UI-POJCIE-CZYNNA"), render: (r) => (r.liczbaStron === 2 ? `2 × ${f1(r.gruboscCzynnaCm)}` : f1(r.gruboscCzynnaCm)), liczbowa: true },
    { naglowek: "C [kWh/K]", render: (r) => f2(r.pojemnoscKwhK), liczbowa: true },
    { naglowek: t("UI-POJCIE-UDZIAL"), render: (r) => f0(r.udzialPct), liczbowa: true },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pojemnosc-cieplna" />
      <NaglowekEkranu tytul={t("UI-POJCIE-POJEMNOSC-CIEPLNA-BUDYNKU")} ekran="pojemnosc-cieplna" wynik={wynik}>
        {t("UI-POJCIE-ILE-CIEPLA-MAGAZYNUJA")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="font-semibold">{t("UI-POJCIE-STRATY-CIEPLA-EKRANU")}</h2>
        {!ekran1.wczytano ? null : e1 === null ? (
          <p className="text-small text-muted-foreground">
            {t("UI-POJCIE-UZUPELNIJ")}{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-POJCIE-EKRAN-STRATY-CIEPLA")}
            </Link>{" "}{t("UI-POJCIE-NIEGO-BIERZE-WSPOLCZYNNIK")}
          </p>
        ) : (
          <p className="text-small">
            {t("UI-POJCIE-PRZEGRODY-WENTYLACJA", { p: f0(e1.hZewnetrzneWK + e1.stratyDoInnychStref.reduce((s, x) => s + x.hWK, 0)) })}
            {e1.kubaturaM3 !== null ? t("UI-POJCIE-POWIETRZE", { kubaturaM3: f0(e1.kubaturaM3) }) : ""}).{" "}
            <Link href="/kalkulatory/obciazenie-cieplne" className="underline">
              {t("UI-POJCIE-ZMIEN-EKRANIE")}
            </Link>
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <Pole
            label={t("UI-POJCIE-TEMPERATURA-DOMU")}
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaStartowa}
            placeholder={e1 ? String(e1.ti) : undefined}
            onChange={(e) => ustaw({ temperaturaStartowa: e.target.value })}
            pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="tempDom" />}
          />
          <Pole
            label={t("UI-POJCIE-TEMPERATURA-ZEWNATRZ")}
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaZewnetrzna}
            placeholder={e1 ? String(e1.te) : undefined}
            onChange={(e) => ustaw({ temperaturaZewnetrzna: e.target.value })}
            pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="tempZew" />}
          />
          <Pole
            label={t("UI-POJCIE-NIZEJ-NIZ-OPCJONALNIE")}
            unit="°C"
            type="number"
            inputMode="decimal"
            value={stan.temperaturaGraniczna}
            onChange={(e) => ustaw({ temperaturaGraniczna: e.target.value })}
            pomoc={<PomocPola ekran="pojemnosc-cieplna" pole="prog" />}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-POJCIE-MASA-BUDYNKU")}</h2>
        <p className="text-small text-muted-foreground">
          {t("UI-POJCIE-WPISZ-WARSTWY-KTORE")}
        </p>
        {stan.warstwy.map((w, i) => (
          <KartaWarstwy
            key={i}
            w={w}
            i={i}
            ustaw={(z) => ustawWarstwe(i, z)}
            usun={() => setStan((s) => ({ ...s, warstwy: s.warstwy.filter((_, j) => j !== i) }))}
          />
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, warstwy: [...s.warstwy, nowaWarstwa("")] }))}>
          {t("UI-POJCIE-DODAJ-WARSTWE")}
        </Button>
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-POJCIE-SPRAWDZ-DANE")}>
          <ul className="mt-2 space-y-1 text-small">
            {wynik.warnings.map((w, i) => (
              <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && e1 !== null && (
        <p className="text-small text-muted-foreground">
          {t("UI-POJCIE-WPISZ-POWIERZCHNIE-GRUBOSC")}
        </p>
      )}
      {v && (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-POJCIE-PRZYBLIZENIE-ISO-13786")}>
          <WynikGlowny>{f1(v.pojemnoscKwhK)} kWh/K</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-POJCIE-STALA-CZASOWA-BEZ", { stalaCzasowaH: f0(v.stalaCzasowaH), temperaturaRownowagiC: f1(v.temperaturaRownowagiC) })}
            {v.czasPierwszegoStopniaH !== null && <> {t("UI-POJCIE-PIERWSZY-SPADKU", { czasPierwszegoStopniaH: f1(v.czasPierwszegoStopniaH) })}</>}
            {tg !== null && v.czasDoGranicyH !== null && (
              <>
                {" "}
                {t("UI-POJCIE-DO-PO", { tg })} <strong>{f1(v.czasDoGranicyH)} h</strong> {t("UI-POJCIE-REALNIE-MOZE-BYC")}
              </>
            )}
          </p>
          <p className="mt-2 text-small">{t("POJC-ZALACZNIK-A-PRZYBLIZENIE")}</p>
          <p className="mt-1 text-small text-muted-foreground">
            {t("UI-POJCIE-CALA-MASA-PRZEGROD", { pojemnoscCalkowitaKwhK: f1(v.pojemnoscCalkowitaKwhK) })}
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 text-center text-small">
            {v.przebieg.map((p) => (
              <li key={p.godzina} className="rounded-md border p-2">
                <div className="text-muted-foreground">{p.godzina} h</div>
                <div className="font-medium">{f1(p.temperaturaC)} °C</div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <KartaPorownawcza kolumny={kolumny} wiersze={v.warstwy.map((w, i) => ({ ...w, id: i }))} minWidth={340} />
          </div>
          {v.pojemnoscPowietrzaKwhK > 0 && <p className="mt-2 text-small text-muted-foreground">{t("UI-POJCIE-POWIETRZE-KWH", { pojemnoscPowietrzaKwhK: f2(v.pojemnoscPowietrzaKwhK) })}</p>}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
