"use client"

import Link from "next/link"
import { useMemo } from "react"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateTrybOgraniczonegoZuzycia } from "@/lib/core/modules/zapotrzebowanie/tryb-ograniczonego-zuzycia/calculator"
import type { TrybOgraniczony } from "@/lib/core/modules/zapotrzebowanie/tryb-ograniczonego-zuzycia/input"
import { useTranslate } from "@/lib/i18n/language-context"
import { KLUCZ_PROFILU_OBIEKTU, type ProfilObiektu } from "@/lib/obiekt/profil-obiektu"
import { KLUCZ_DRAFTU_TRYB_OGRANICZONY, odbiornikiDoTrybu, PUSTY_SEED_TRYBU, wejscieTrybu, type SeedTrybuOgraniczonego } from "@/lib/obiekt/tryb-ograniczony-draft"
import type { DraftOdbiornikow } from "@/lib/obiekt/zuzycie-z-odbiornikow"

const KLUCZ_DRAFTU_ODBIORNIKOW = "zuzycie-per-urzadzenie"
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

export default function TrybOgraniczonegoZuzyciaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<SeedTrybuOgraniczonego>(KLUCZ_DRAFTU_TRYB_OGRANICZONY, PUSTY_SEED_TRYBU)
  const profil = useOdczytDraftu<ProfilObiektu>(KLUCZ_PROFILU_OBIEKTU).dane
  const { dane: lista } = useOdczytDraftu<DraftOdbiornikow>(KLUCZ_DRAFTU_ODBIORNIKOW)
  const odbiorniki = useMemo(() => odbiornikiDoTrybu(lista, profil?.rodzaj ?? "", stan.zostaja), [lista, profil, stan.zostaja])
  const wynik = useMemo(() => calculateTrybOgraniczonegoZuzycia(wejscieTrybu(stan, odbiorniki)), [stan, odbiorniki])
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : wynik.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"
  const lista2 = (xs: string[]) => (xs.length > 0 ? xs.join(", ") : t("UI-TOGR-BRAK"))

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/tryb-ograniczonego-zuzycia" />
      <NaglowekEkranu tytul={t("UI-TOGR-TYTUL")} ekran="tryb-ograniczonego-zuzycia" wynik={wynik}>
        {t("UI-TOGR-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <PoleSelect id="togr-tryb" label={t("UI-TOGR-TRYB")} value={stan.tryb} onChange={(e) => setStan((s) => ({ ...s, tryb: e.target.value as TrybOgraniczony }))} pomoc={<PomocPola ekran="tryb-ograniczonego-zuzycia" pole="tryb" />}>
          <option value="wyjazd">{t("UI-TOGR-TRYB-WYJAZD")}</option>
          <option value="noc">{t("UI-TOGR-TRYB-NOC")}</option>
        </PoleSelect>
        {stan.tryb === "wyjazd" ? (
          <Pole id="togr-dni" label={t("UI-TOGR-DNI")} type="number" inputMode="decimal" min={0} value={stan.dni} onChange={(e) => setStan((s) => ({ ...s, dni: e.target.value }))} pomoc={<PomocPola ekran="tryb-ograniczonego-zuzycia" pole="dni" />} />
        ) : (
          <Pole id="togr-godziny" label={t("UI-TOGR-GODZINY")} unit="h" type="number" inputMode="decimal" min={0} max={24} value={stan.godzinNocy} onChange={(e) => setStan((s) => ({ ...s, godzinNocy: e.target.value }))} pomoc={<PomocPola ekran="tryb-ograniczonego-zuzycia" pole="godziny" />} />
        )}
        <Pole id="togr-pojemnosc" label={t("UI-TOGR-POJEMNOSC")} unit="kWh" type="number" inputMode="decimal" min={0} value={stan.pojemnoscKwh} onChange={(e) => setStan((s) => ({ ...s, pojemnoscKwh: e.target.value }))} pomoc={<PomocPola ekran="tryb-ograniczonego-zuzycia" pole="pojemnosc" />} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">{t("UI-TOGR-ODBIORNIKI")}</h2>
        {odbiorniki.length === 0 ? (
          <p className="text-small text-muted-foreground">
            {t("UI-TOGR-PUSTA-LISTA")}{" "}
            <Link href="/kalkulatory/zuzycie-per-urzadzenie" className="underline">
              {t("UI-TOGR-PUSTA-LISTA-LINK")}
            </Link>
          </p>
        ) : (
          odbiorniki.map((o) => (
            <div key={o.id} className="flex items-start gap-2">
              <div className="flex-1">
                <PoleCheckbox
                  id={`togr-${o.id}`}
                  label={`${o.nazwa} — ${t("UI-TOGR-ZOSTAJE")}`}
                  hint={t("UI-TOGR-DOBA-WH", { wh: f0(o.zuzycieDobaWh) })}
                  checked={o.zostaje}
                  onChange={(e) => setStan((s) => ({ ...s, zostaja: { ...s.zostaja, [o.id]: e.target.checked } }))}
                />
              </div>
              <PomocPola ekran="tryb-ograniczonego-zuzycia" pole="zostaje" />
            </div>
          ))
        )}
      </section>

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-TOGR-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
      {v && odbiorniki.length > 0 && (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-TOGR-WERDYKT")}>
          <WynikGlowny>{f2(v.ograniczoneDobaKwh)} kWh/{t("UI-TOGR-DOBA-JEDN")}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-TOGR-DOBA", { ogr: f2(v.ograniczoneDobaKwh), norm: f2(v.normalnieDobaKwh), opt: f2(v.oszczednoscDobaKwh), pct: f0(v.oszczednoscPct) })}</p>
          {stan.tryb === "wyjazd" &&
            (v.okresOgraniczoneKwh !== null ? (
              <p className="text-small">{t("UI-TOGR-OKRES", { dni: stan.dni, ogr: f1(v.okresOgraniczoneKwh), norm: f1(v.okresNormalnieKwh!) })}</p>
            ) : (
              <p className="text-small text-muted-foreground">{t("UI-TOGR-UZUPELNIJ-WYJAZD")}</p>
            ))}
          {stan.tryb === "noc" &&
            (v.nocOgraniczoneKwh !== null ? (
              <p className="text-small">{t("UI-TOGR-NOC", { h: stan.godzinNocy, ogr: f2(v.nocOgraniczoneKwh), norm: f2(v.nocNormalnieKwh!) })}</p>
            ) : (
              <p className="text-small text-muted-foreground">{t("UI-TOGR-UZUPELNIJ-NOC")}</p>
            ))}
          {v.bateriaWystarczaOgraniczone !== null && v.bateriaWystarczaNormalnie !== null && (
            <p className="text-small">
              {t(stan.tryb === "wyjazd" ? "UI-TOGR-BATERIA-WYJAZD" : "UI-TOGR-BATERIA-NOC", { ogr: f1(v.bateriaWystarczaOgraniczone), norm: f1(v.bateriaWystarczaNormalnie) })}
            </p>
          )}
          <p className="mt-2 text-small">{t("UI-TOGR-ZOSTAJA", { lista: lista2(v.zostaja) })}</p>
          <p className="text-small">{t("UI-TOGR-WYLACZONE", { lista: lista2(v.wylaczone) })}</p>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} formulaKey={wynik.formulaKey} formulaParams={wynik.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
