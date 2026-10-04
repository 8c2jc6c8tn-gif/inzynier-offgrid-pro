"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateTaryfaNocnaPompyCiepla } from "@/lib/core/modules/ogrzewanie/taryfa-nocna-pompy-ciepla/calculator"
import type { ZasilanieNocy } from "@/lib/core/modules/ogrzewanie/taryfa-nocna-pompy-ciepla/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola = "cieplo" | "godziny" | "cenaDzien" | "cenaNoc" | "copDzien" | "copNoc" | "buforL" | "buforDT"
type FormularzStan = Record<Pola, string> & { zasilanie: ZasilanieNocy }

const STAN_POCZATKOWY: FormularzStan = {
  cieplo: "",
  godziny: "",
  cenaDzien: "",
  cenaNoc: "",
  copDzien: "",
  copNoc: "",
  buforL: "",
  buforDT: "",
  zasilanie: "siec",
}

/** Money fields converted when the display currency changes. */
const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("cenaDzien", "cenaNoc")

const ZASILANIA: ZasilanieNocy[] = ["siec", "agregat", "bateria"]
const KLUCZ_ZASILANIA: Record<ZasilanieNocy, string> = {
  siec: "UI-M6-TAN-ZAS-SIEC",
  agregat: "UI-M6-TAN-ZAS-AGREGAT",
  bateria: "UI-M6-TAN-ZAS-BATERIA",
}

const SEKCJA_KLASY = "flex flex-col gap-4 rounded-lg border p-4"
const SEKCJA_TYTUL_KLASY = "text-small font-semibold uppercase tracking-wide text-muted-foreground"

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2C — dawne 5.59: heat pump on a night tariff (grid, generator or battery), buffer shifts the heat. */
export default function TaryfaNocnaPompyCieplaPage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("taryfa-nocna-pompy-ciepla", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateTaryfaNocnaPompyCiepla({
        cieploDobaKwh: liczba(stan.cieplo),
        godzinyNocH: liczba(stan.godziny),
        cenaDzienZlKwh: liczba(stan.cenaDzien),
        cenaNocZlKwh: liczba(stan.cenaNoc),
        copDzien: liczba(stan.copDzien),
        copNoc: liczba(stan.copNoc),
        pojemnoscBuforaL: liczba(stan.buforL),
        deltaTBuforaK: liczba(stan.buforDT),
        zasilanieNocy: stan.zasilanie,
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.status === "VALID_WITH_WARNINGS"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/taryfa-nocna-pompy-ciepla" />
      <NaglowekEkranu tytul={t("UI-M6-TAN-TYTUL")} ekran="taryfa-nocna-pompy-ciepla" wynik={result}>
        {t("UI-M6-TAN-OPIS")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <section className={SEKCJA_KLASY}>
        <h2 className={SEKCJA_TYTUL_KLASY}>{t("UI-M6-TAN-SEKCJA-TARYFA")}</h2>
        <PoleSelect
          label={t("UI-M6-TAN-ZASILANIE")}
          value={stan.zasilanie}
          onChange={(e) => setStan((prev) => ({ ...prev, zasilanie: e.target.value as ZasilanieNocy }))}
          pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="zasilanie" />}
        >
          {ZASILANIA.map((z) => (
            <option key={z} value={z}>
              {t(KLUCZ_ZASILANIA[z])}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label={t("UI-M6-TAN-GODZINY-NOCY")}
          unit="h"
          max={24}
          {...pole("godziny")}
          pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="godzinyNocy" />}
        />
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-M6-TAN-CENA-DZIEN")}
            unit={t("UI-J-ZL-KWH")}
            {...pole("cenaDzien")}
            pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="cenaDzien" />}
          />
          <Pole
            label={t("UI-M6-TAN-CENA-NOC")}
            unit={t("UI-J-ZL-KWH")}
            {...pole("cenaNoc")}
            pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="cenaNoc" />}
          />
        </div>
      </section>

      <section className={SEKCJA_KLASY}>
        <h2 className={SEKCJA_TYTUL_KLASY}>{t("UI-M6-TAN-SEKCJA-POMPA")}</h2>
        <Pole
          label={t("UI-M6-TAN-CIEPLO")}
          unit={t("UI-J-KWH-DOBA")}
          {...pole("cieplo")}
          pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="cieplo" />}
        />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-TAN-COP-DZIEN")} {...pole("copDzien")} pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="copDzien" />} />
          <Pole label={t("UI-M6-TAN-COP-NOC")} {...pole("copNoc")} pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="copNoc" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-TAN-BUFOR-L")} unit="l" {...pole("buforL")} pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="buforL" />} />
          <Pole label={t("UI-M6-TAN-BUFOR-DT")} unit="K" {...pole("buforDT")} pomoc={<PomocPola ekran="taryfa-nocna-pompy-ciepla" pole="buforDT" />} />
        </div>
      </section>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-TAN-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-TAN-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-TAN-W-UWAGA" : "UI-M6-TAN-W-OK")}>
          <WynikGlowny>{t("UI-M6-TAN-WYNIK", { zl: r2(v.oszczednoscDobaZl), pct: r1(v.oszczednoscPct) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M6-TAN-KOSZTY", { bez: r2(v.kosztBezPrzesuniecaZl), z: r2(v.kosztZPrzesunieciemZl) })}</p>
          <p className="mt-1 text-small">{t("UI-M6-TAN-PRZESUNIETE", { kwh: r2(v.przesunieteKwh), bufor: r2(v.pojemnoscBuforaKwh) })}</p>
          <p className="mt-1 text-small">{t("UI-M6-TAN-NOC", { kwh: r2(v.pradNocKwh), kw: r2(v.mocNocSredniaKw) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/bufor-ciepla" className="text-small underline">
        {t("UI-M6-TAN-LINK-BUFOR")}
      </Link>
    </main>
  )
}
