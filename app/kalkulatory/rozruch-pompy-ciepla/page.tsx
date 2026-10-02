"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateRozruchPompyCiepla } from "@/lib/core/modules/ogrzewanie/rozruch-pompy-ciepla/calculator"
import type { ZrodloZasilania } from "@/lib/core/modules/ogrzewanie/rozruch-pompy-ciepla/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola = "napiecie" | "prad" | "softstart" | "pobor" | "inne" | "ciagla" | "szczytowa"
type FormularzStan = Record<Pola, string> & { zrodlo: ZrodloZasilania | ""; fazy: "1" | "3" }

const STAN_POCZATKOWY: FormularzStan = {
  zrodlo: "",
  fazy: "1",
  napiecie: "",
  prad: "",
  softstart: "",
  pobor: "",
  inne: "",
  ciagla: "",
  szczytowa: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2C — dawne 5.52, 5.61, 5.66: can the inverter or generator carry the heat pump start and run. */
export default function RozruchPompyCieplaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("rozruch-pompy-ciepla", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateRozruchPompyCiepla({
        zrodlo: stan.zrodlo === "" ? null : stan.zrodlo,
        fazy: stan.fazy === "3" ? 3 : 1,
        napiecieV: liczba(stan.napiecie),
        pradRozruchuA: liczba(stan.prad),
        pradSoftstartA: liczba(stan.softstart),
        poborPracyKw: liczba(stan.pobor),
        inneObciazenieKw: liczba(stan.inne),
        mocCiaglaKw: liczba(stan.ciagla),
        mocSzczytowaKw: liczba(stan.szczytowa),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level !== "info")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/rozruch-pompy-ciepla" />
      <NaglowekEkranu tytul={t("UI-M6-ROZ-TYTUL")} ekran="rozruch-pompy-ciepla" wynik={result}>
        {t("UI-M6-ROZ-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <PoleSelect
            label={t("UI-M6-ROZ-ZRODLO")}
            value={stan.zrodlo}
            onChange={(e) => setStan((prev) => ({ ...prev, zrodlo: e.target.value as FormularzStan["zrodlo"] }))}
            pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="zrodlo" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            <option value="falownik">{t("UI-M6-ROZ-FALOWNIK")}</option>
            <option value="agregat">{t("UI-M6-ROZ-AGREGAT")}</option>
          </PoleSelect>
          <PoleSelect
            label={t("UI-M6-ROZ-FAZY")}
            value={stan.fazy}
            onChange={(e) => setStan((prev) => ({ ...prev, fazy: e.target.value === "3" ? "3" : "1" }))}
            pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="fazy" />}
          >
            <option value="1">{t("UI-M6-ROZ-1F")}</option>
            <option value="3">{t("UI-M6-ROZ-3F")}</option>
          </PoleSelect>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-ROZ-NAPIECIE")} unit="V" {...pole("napiecie")} pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="napiecie" />} />
          <Pole label={t("UI-M6-ROZ-PRAD")} unit="A" {...pole("prad")} pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="prad" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-ROZ-SOFTSTART")} unit="A" {...pole("softstart")} pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="softstart" />} />
          <Pole label={t("UI-M6-ROZ-POBOR")} unit="kW" {...pole("pobor")} pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="pobor" />} />
        </div>
        <Pole label={t("UI-M6-ROZ-INNE")} unit="kW" {...pole("inne")} pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="inne" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-ROZ-CIAGLA")} unit="kW" {...pole("ciagla")} pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="ciagla" />} />
          <Pole label={t("UI-M6-ROZ-SZCZYT")} unit="kW" {...pole("szczytowa")} pomoc={<PomocPola ekran="rozruch-pompy-ciepla" pole="szczytowa" />} />
        </div>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-ROZ-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-ROZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-ROZ-W-UWAGA" : "UI-M6-ROZ-W-OK")}>
          <WynikGlowny>{t("UI-M6-ROZ-WYNIK", { start: r2(v.startKva) })}</WynikGlowny>
          {v.softstartKva !== null && <p className="mt-1 text-small">{t("UI-M6-ROZ-WYNIK-SOFT", { soft: r2(v.softstartKva) })}</p>}
          <p className="mt-1 text-small">{t("UI-M6-ROZ-WYNIK-SZCZYT", { kva: r2(v.szczytWymaganyKva) })}</p>
          <p className="mt-1 text-small">{t("UI-M6-ROZ-WYNIK-PRACA", { kw: r2(v.pracaKw) })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/dobor-mocy-falownika" className="text-small underline">
          {t("UI-M6-ROZ-LINK-FALOWNIK")}
        </Link>
        <Link href="/kalkulatory/agregat-pradotworczy" className="text-small underline">
          {t("UI-M6-ROZ-LINK-AGREGAT")}
        </Link>
      </div>
    </main>
  )
}
