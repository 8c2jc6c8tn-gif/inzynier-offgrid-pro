"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWplywCzynnika, paramsDoWyswietlenia } from "@/lib/core/modules/ogrzewanie/wplyw-czynnika/calculator"
import { CZYNNIKI, NUMERY_ZRODLA, POLA_CZYNNIKA } from "@/lib/core/modules/ogrzewanie/wplyw-czynnika/constants"
import type { Czynnik, KluczPola } from "@/lib/core/modules/ogrzewanie/wplyw-czynnika/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = { czynnik: Czynnik | ""; pola: Partial<Record<KluczPola, string>> }

const STAN_POCZATKOWY: FormularzStan = { czynnik: "", pola: {} }

/** Units shown next to the fields; `UI-` entries are translated (they contain words, not symbols). */
const JEDNOSTKI: Record<KluczPola, string> = {
  dTK: "K",
  zapotrzebowanieKw: "kW",
  mocPompyKw: "kW",
  powierzchniaM2: "m²",
  uPrzed: "W/(m²·K)",
  uPo: "W/(m²·K)",
  gruboscCm: "cm",
  lambda: "W/(m·K)",
  dTGruntK: "K",
  hMostkowPrzedWK: "W/K",
  hMostkowPoWK: "W/K",
  kubaturaM3: "m³",
  nPrzed: "1/h",
  nPo: "1/h",
  strumienM3H: "m³/h",
  etaPrzedPct: "%",
  etaPoPct: "%",
  wentylatoryKwhDoba: "kWh",
  powierzchniaPodlogiM2: "m²",
  obwodM: "m",
  uScian: "W/(m²·K)",
  hPrzedM: "m",
  hPoM: "m",
  dlugoscRurM: "m",
  psiPrzed: "W/(m·K)",
  psiPo: "W/(m·K)",
  tWodyC: "°C",
  tOtoczeniaC: "°C",
  godzinyH: "h",
  powierzchniaOkienM2: "m²",
  g: "",
  napromieniowanieKwhM2: "kWh/m²",
  zacienieniePrzedPct: "%",
  zacieniePoPct: "%",
  godzinySezonuH: "h",
  zyskiKwhDoba: "kWh",
  dniSezonu: "UI-M6-WPC-J-DNI",
  tPrzedC: "°C",
  tPoC: "°C",
  copPrzed: "",
  copPo: "",
  cieploSezonKwh: "kWh",
  defrostKwhDoba: "kWh",
  dniSzronienia: "UI-M6-WPC-J-DNI",
  zuzyciePompySezonKwh: "kWh",
  ograniczeniePct: "%",
  copOgraniczony: "",
  mocFalownikaKw: "kW",
  dTObieguK: "K",
  liczbaA: "",
  glebokoscAM: "m",
  liczbaB: "",
  glebokoscBM: "m",
  cenaZlM: "UI-M6-WPC-J-ZL-M",
  wNaM: "W/m",
  obciazenieKw: "kW",
  wodaInstalacjiL: "l",
  buforL: "l",
  histerezaK: "K",
}

/** Moduł 6, Część 2D — one screen for the "wpływ czynnika X" family (dawne 5.69, 5.73–5.100). */
export default function WplywCzynnikaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wplyw-czynnika", STAN_POCZATKOWY)
  const czynnik = stan.czynnik === "" ? null : stan.czynnik
  const definicje = czynnik ? POLA_CZYNNIKA[czynnik] : []

  const result = useMemo(() => {
    const pola: Partial<Record<KluczPola, number>> = {}
    for (const [k, s] of Object.entries(stan.pola) as [KluczPola, string | undefined][]) {
      if (s !== undefined && s !== "") pola[k] = Number(s)
    }
    return calculateWplywCzynnika({ czynnik: stan.czynnik === "" ? null : stan.czynnik, pola })
  }, [stan])
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level !== "info")
  const jednostka = (k: KluczPola) => (JEDNOSTKI[k].startsWith("UI-") ? t(JEDNOSTKI[k]) : JEDNOSTKI[k])

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wplyw-czynnika" />
      <NaglowekEkranu tytul={t("UI-M6-WPC-TYTUL")} ekran="wplyw-czynnika" wynik={result}>
        {t("UI-M6-WPC-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-M6-WPC-CZYNNIK")}
          value={stan.czynnik}
          onChange={(e) => setStan((prev) => ({ ...prev, czynnik: e.target.value as FormularzStan["czynnik"] }))}
          pomoc={<PomocPola ekran="wplyw-czynnika" pole="czynnik" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {CZYNNIKI.map((c) => (
            <option key={c} value={c}>
              {t(`UI-M6-WPC-C-${c}`)}
            </option>
          ))}
        </PoleSelect>
        {czynnik && (
          <p className="text-small text-muted-foreground">
            {t(`UI-M6-WPC-M-${czynnik}`)} · {t("UI-M6-WPC-ZRODLO", { nr: NUMERY_ZRODLA[czynnik] })}
          </p>
        )}
        {definicje.map((d) => (
          <Pole
            key={d.klucz}
            label={t(`UI-M6-WPC-P-${d.klucz}`)}
            unit={jednostka(d.klucz)}
            type="number"
            inputMode="decimal"
            min={d.rodzaj === "temperatura" ? undefined : 0}
            max={d.rodzaj === "procent" ? 100 : d.rodzaj === "ulamek" ? 1 : d.rodzaj === "godziny" ? 24 : undefined}
            value={stan.pola[d.klucz] ?? ""}
            onChange={(e) => setStan((prev) => ({ ...prev, pola: { ...prev.pola, [d.klucz]: e.target.value } }))}
            pomoc={<PomocPola ekran="wplyw-czynnika" pole={d.klucz} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-WPC-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" || v.glowny === null ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-WPC-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-WPC-W-UWAGA" : "UI-M6-WPC-W-OK")}>
          <WynikGlowny>{t(v.glowny.klucz, paramsDoWyswietlenia(v.glowny.params))}</WynikGlowny>
          {v.wiersze.map((w) => (
            <p key={w.klucz} className="mt-1 text-small">
              {t(w.klucz, paramsDoWyswietlenia(w.params))}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <p className="text-small text-muted-foreground">{t("UI-M6-WPC-NIEBUDOWANE")}</p>
      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/obciazenie-cieplne" className="text-small underline">
          {t("UI-M6-WPC-LINK-OBCIAZENIE")}
        </Link>
        <Link href="/kalkulatory/cop-pompy-ciepla" className="text-small underline">
          {t("UI-M6-WPC-LINK-COP")}
        </Link>
      </div>
    </main>
  )
}
