"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { CalcResult } from "@/lib/core/calc-result"
import type { OrientacjaPowierzchniResult } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import { calculatePowierzchnie } from "@/lib/core/modules/pv/typ-montazu/powierzchnie"
import { useTranslate } from "@/lib/i18n/language-context"
import { etykietaPowierzchni } from "@/lib/lokalizacja/nazwa-powierzchni"
import {
  horyzontyPolaci,
  kierunek,
  liczba,
  MODEL_PUSTY,
  powierzchnieDoOceny,
  powierzchnieZModelu,
  type KorektaSeed,
  type PowierzchniaRecznaSeed,
} from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useObliczeniaWTle } from "@/lib/lokalizacja/use-obliczenia-w-tle"
import { BledyDanych, f0, f1, n } from "./wspolne"

/** Seed M1/E4 — tylko odczyt (jeden właściciel zapisu: ekran "Bryła budynku i orientacja ścian"). */
type SeedM1E4 = { korekty: Record<string, KorektaSeed>; reczne: PowierzchniaRecznaSeed[]; albedo: string }

type Seed = { pr: string; moc: Record<string, string>; wybrane: string[] }
const PUSTY: Seed = { pr: "", moc: {}, wybrane: [] }

/**
 * Tryby "Dach skośny" (jedna połać z modelu budynku) i "Wielopołaciowy" (dowolne powierzchnie).
 * Powierzchnie i ich korekty — z Modułu 1 (Skaner + Ekran 4), ocena tym samym zadaniem Web Workera.
 */
export function TrybPowierzchnie({ tylkoJednaPolac }: { tylkoJednaPolac: boolean }) {
  const t = useTranslate()
  const { model, skaner, lokalizacja, dane } = useLokalizacjaProjektu()
  const m1 = useOdczytDraftu<SeedM1E4>("orientacja-powierzchni")
  const [s, setS] = usePersistedDraft<Seed>(tylkoJednaPolac ? "typ-montazu-dach-skosny" : "typ-montazu-wielopolaciowy", PUSTY)
  const { uruchom, stan: obliczenia } = useObliczeniaWTle()
  const [ocena, setOcena] = useState<{ klucz: string; r: CalcResult<OrientacjaPowierzchniResult> } | null>(null)

  const zModelu = useMemo(() => powierzchnieZModelu(skaner.value), [skaner.value])
  const wszystkie = useMemo(
    () => powierzchnieDoOceny(zModelu, m1.dane?.korekty ?? {}, m1.dane?.reczne ?? []),
    [zModelu, m1.dane],
  )
  const powierzchnie = tylkoJednaPolac ? wszystkie.filter((p) => p.zrodlo === "polac") : wszystkie
  const horyzonty = useMemo(() => horyzontyPolaci(model.dane ?? MODEL_PUSTY, skaner.value), [model.dane, skaner.value])
  const klucz = JSON.stringify([lokalizacja?.szerokosc, lokalizacja?.dlugosc, dane?.pobrano, powierzchnie, m1.dane?.albedo, model.dane])
  const aktualna = ocena !== null && ocena.klucz === klucz ? ocena.r : null

  async function ocen() {
    if (!lokalizacja || !dane) return
    const r = await uruchom({
      typ: "orientacja",
      wejscie: {
        szerokoscGeograficzna: lokalizacja.szerokosc,
        dlugoscGeograficzna: lokalizacja.dlugosc,
        daneGodzinowe: dane.dane.rekordy,
        albedo: liczba(m1.dane?.albedo ?? ""),
        powierzchnie: powierzchnie.map(({ id, nazwa, nachylenieDeg, azymutDeg }) => ({
          nazwa,
          nachylenieDeg,
          azymutDeg,
          ...(horyzonty[id] ? { horyzontyDeg: horyzonty[id] } : {}),
        })),
      },
    })
    if (r) setOcena({ klucz, r: r.wynik })
  }

  const oceny = aktualna && aktualna.status !== "INVALID_INPUT" ? aktualna.value.powierzchnie : null
  const wybrane = useMemo(() => (tylkoJednaPolac ? s.wybrane.slice(0, 1) : s.wybrane), [tylkoJednaPolac, s.wybrane])
  // Wybór sprzed zmiany powierzchni w Module 1 — pomijany, zanim trafi do kalkulatora.
  const wybraneIstniejace = useMemo(() => (oceny ? wybrane.filter((w) => oceny.some((o) => o.nazwa === w)) : wybrane), [oceny, wybrane])
  const wynik = useMemo(
    () =>
      calculatePowierzchnie({
        oceny,
        wybrane: wybraneIstniejace.map((nazwa) => ({ nazwa, mocKwp: n(s.moc[nazwa] ?? "") })),
        wspolczynnikPr: n(s.pr),
      }),
    [oceny, wybraneIstniejace, s.moc, s.pr],
  )
  const v = wynik.value

  const przelacz = (nazwa: string) =>
    setS((p) => ({
      ...p,
      wybrane: tylkoJednaPolac ? [nazwa] : p.wybrane.includes(nazwa) ? p.wybrane.filter((x) => x !== nazwa) : [...p.wybrane, nazwa],
    }))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        {tylkoJednaPolac
          ? t("UI-TYPMON-COMTRYPOW-WYBIERZ-POLAC-DACHU")
          : t("UI-TYPMON-COMTRYPOW-ZAZNACZ-WSZYSTKIE-POWIERZCHN")}{" "}{t("UI-TYPMON-COMTRYPOW-POWIERZCHNIE-ZMIENISZ")}{" "}
        <Link href="/kalkulatory/orientacja-powierzchni" className="underline">
          {t("UI-TYPMON-COMTRYPOW-MODULE-EKRAN")}
        </Link>
        .
      </p>

      {powierzchnie.length === 0 ? (
        <StanPusty tytul={tylkoJednaPolac ? t("UI-TYPMON-COMTRYPOW-MODEL-BUDYNKU-JESZCZE") : t("UI-TYPMON-COMTRYPOW-BRAK-POWIERZCHNI-OCENY")}>
          <p className="text-small">
            {t("UI-TYPMON-COMTRYPOW-ZBIERZ-BUDYNEK")}{" "}
            <Link href="/kalkulatory/skaner-dzialki" className="underline">
              {t("UI-TYPMON-COMTRYPOW-SKANERZE-DZIALKI")}
            </Link>
            {tylkoJednaPolac ? "." : ` ${t("UI-TYPMON-COMTRYPOW-ALBO-DOPISZ-POWIERZCHNIE")}`}
          </p>
        </StanPusty>
      ) : (
        <Button className="min-h-11" disabled={obliczenia.liczy || !dane} onClick={ocen}>
          {obliczenia.liczy ? t("UI-TYPMON-COMTRYPOW-LICZE") : aktualna ? t("UI-TYPMON-COMTRYPOW-OCEN-PONOWNIE") : t("UI-TYPMON-COMTRYPOW-OCEN-POWIERZCHNIE")}
        </Button>
      )}
      {!dane && <p className="text-small text-muted-foreground">{t("UI-TYPMON-COMTRYPOW-NAJPIERW-POBIERZ-DANE")}</p>}
      {obliczenia.blad && <p className="text-small text-werdykt-blad-foreground">{obliczenia.blad}</p>}
      {ocena && !aktualna && !obliczenia.liczy && <StanPusty tytul={t("UI-TYPMON-COMTRYPOW-DANE-ZMIENILY-OSTATNIEJ")} />}
      {aktualna?.status === "INVALID_INPUT" && <BledyDanych warnings={aktualna.warnings} />}

      {oceny && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-semibold">{tylkoJednaPolac ? t("UI-TYPMON-COMTRYPOW-POLAC") : t("UI-TYPMON-COMTRYPOW-POWIERZCHNIE")}</legend>
          {oceny.map((o, idx) => {
            const zaznaczona = wybrane.includes(o.nazwa)
            return (
              <div key={o.nazwa} className="flex flex-col gap-2 rounded-md border p-3">
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type={tylkoJednaPolac ? "radio" : "checkbox"}
                    name={tylkoJednaPolac ? "polac" : undefined}
                    checked={zaznaczona}
                    onChange={() => przelacz(o.nazwa)}
                    className="size-5"
                  />
                  <span className="flex flex-col text-small">
                    <span className="font-medium">
                      {etykietaPowierzchni(o.nazwa, t)} — {f0(o.wskaznikProcent)}%
                    </span>
                    <span className="text-muted-foreground">
                      {t("UI-TYPMON-COMTRYPOW-AZYMUT-KWH", { nachylenieDeg: o.nachylenieDeg, azymutDeg: o.azymutDeg, azymutDeg2: kierunek(o.azymutDeg), napromieniowanieRoczneKwhM2: f0(o.napromieniowanieRoczneKwhM2) })}
                    </span>
                  </span>
                </label>
                {zaznaczona && (
                  <Pole
                    id={`moc-powierzchni-${idx}`}
                    label={t("UI-TYPMON-COMTRYPOW-MOC-PANELI-TEJ")}
                    unit="kWp"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={s.moc[o.nazwa] ?? ""}
                    onChange={(e) => setS((p) => ({ ...p, moc: { ...p.moc, [o.nazwa]: e.target.value } }))}
                    pomoc={<PomocPola ekran="typ-montazu-pola" pole="mocPowierzchni" />}
                  />
                )}
              </div>
            )
          })}
          <Pole
            label={t("UI-TYPMON-COMTRYPOW-WSPOLCZYNNIK-WYDAJNOSCI")}
            type="number"
            inputMode="decimal"
            min={0}
            max={1}
            step={0.01}
            value={s.pr}
            onChange={(e) => setS((p) => ({ ...p, pr: e.target.value }))}
            pomoc={<PomocPola ekran="typ-montazu-pola" pole="pr" />}
          />
          {aktualna && aktualna.warnings.length > 0 && (
            <ul className="text-small text-muted-foreground">
              {aktualna.warnings.map((w, i) => (
                <li key={w.code + i}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
              ))}
            </ul>
          )}
        </fieldset>
      )}

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {oceny && wynik.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">
          {tylkoJednaPolac ? t("UI-TYPMON-COMTRYPOW-WYBIERZ-POLAC") : t("UI-TYPMON-COMTRYPOW-ZAZNACZ-POWIERZCHNIE")}{t("UI-TYPMON-COMTRYPOW-WPISZ-MOC-PANELI")}
        </p>
      )}
      {v && (
        <WerdyktPanel poziom="ok" etykieta={tylkoJednaPolac ? t("UI-TYPMON-COMTRYPOW-ROCZNY-UZYSK-POLACI") : t("UI-TYPMON-COMTRYPOW-SUMA-POWIERZCHNI-KWP", { length: v.pozycje.length, sumaMocyKwp: f1(v.sumaMocyKwp) })}>
          <WynikGlowny>{t("UI-TYPMON-COMTRYPOW-KWH-ROK", { sumaUzyskuKwh: f0(v.sumaUzyskuKwh) })}</WynikGlowny>
          <ul className="mt-2 space-y-1 text-small">
            {v.pozycje.map((p) => (
              <li key={p.nazwa}>
                {t("UI-TYPMON-COMTRYPOW-KWH-AZYMUT", { nazwa: etykietaPowierzchni(p.nazwa, t), uzyskRocznyKwh: f0(p.uzyskRocznyKwh), wskaznikProcent: f0(p.wskaznikProcent), nachylenieDeg: p.nachylenieDeg, azymutDeg: p.azymutDeg })}
              </li>
            ))}
          </ul>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
    </div>
  )
}
