"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateOsadNaPv } from "@/lib/core/modules/stress-test/osad-na-pv/calculator"
import type { RodzajOsadu } from "@/lib/core/modules/stress-test/osad-na-pv/input"
import { KAT_SPLUKIWANIE_MAX } from "@/lib/core/modules/pv/czystosc-i-snieg/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaProdukcjiIWlasne,
  SekcjaCoZTymZrobic,
  STAN_OSADU,
  TabelaCoJesli,
  wejscieOsaduZeStanu,
  type StanOsadu,
} from "@/components/wzorce/osad-na-pv"

type FormularzStan = StanOsadu & { rodzaj: RodzajOsadu | ""; kat: string; nierowno: boolean }

const STAN_POCZATKOWY: FormularzStan = { ...STAN_OSADU, rodzaj: "", kat: "", nierowno: false }

const RODZAJE: { v: RodzajOsadu; k: string }[] = [
  { v: "sypki", k: "UI-M7-OSAD-SYPKI" },
  { v: "mokry", k: "UI-M7-OSAD-MOKRY" },
  { v: "lod", k: "UI-M7-OSAD-LOD" },
  { v: "szadz", k: "UI-M7-OSAD-SZADZ" },
]

const r2 = (x: number) => Math.round(x * 100) / 100

export default function SniegNaPvPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("snieg-na-pv", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateOsadNaPv({
        ...wejscieOsaduZeStanu(stan),
        rodzaj: stan.rodzaj === "" ? null : stan.rodzaj,
        katDeg: stan.kat === "" ? null : Number(stan.kat),
        nierownoStringi: stan.nierowno,
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/snieg-na-pv" />
      <NaglowekEkranu tytul={t("UI-M7-OSAD-TYTUL")} ekran="snieg-na-pv" wynik={result} parametry={{ prog: KAT_SPLUKIWANIE_MAX }}>
        {t("UI-M7-OSAD-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-OSAD-PANELE")}</legend>
        <PoleSelect
          label={t("UI-M7-OSAD-RODZAJ")}
          value={stan.rodzaj}
          onChange={(e) => setStan((prev) => ({ ...prev, rodzaj: e.target.value as FormularzStan["rodzaj"] }))}
          pomoc={<PomocPola ekran="snieg-na-pv" pole="rodzaj" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {RODZAJE.map((r) => (
            <option key={r.v} value={r.v}>
              {t(r.k)}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label={t("UI-M7-OSAD-KAT")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={stan.kat}
          onChange={(e) => setStan((prev) => ({ ...prev, kat: e.target.value }))}
          pomoc={<PomocPola ekran="snieg-na-pv" pole="kat" params={{ prog: KAT_SPLUKIWANIE_MAX }} />}
        />
        <PolaProdukcjiIWlasne ekran="snieg-na-pv" stan={stan} setStan={setStan} />
        <div className="flex items-center gap-2">
          <PoleCheckbox
            id="snieg-na-pv-nierowno"
            className="flex-1"
            label={t("UI-M7-OSAD-NIEROWNO")}
            checked={stan.nierowno}
            onChange={(e) => setStan((prev) => ({ ...prev, nierowno: e.target.checked }))}
          />
          <PomocPola ekran="snieg-na-pv" pole="nierowno" />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-OSAD-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-OSAD-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M7-OSAD-W-UWAGA" : "UI-M7-OSAD-W-OK")}>
          <WynikGlowny>{t("UI-M7-OSAD-WYNIK", { kwh: r2(v.utrataNaDobeKwh) })}</WynikGlowny>
          <TabelaCoJesli wynik={result} szadz={stan.rodzaj === "szadz"} />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <SekcjaCoZTymZrobic ekran="snieg-na-pv" stan={stan} setStan={setStan} wynik={result} />

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/czystosc-i-snieg" className="text-small underline">
          {t("UI-M7-OSAD-LINK-SNIEG")}
        </Link>
        <Link href="/kalkulatory/blackout" className="text-small underline">
          {t("UI-M7-OSAD-LINK-BLACKOUT")}
        </Link>
      </div>
    </main>
  )
}
