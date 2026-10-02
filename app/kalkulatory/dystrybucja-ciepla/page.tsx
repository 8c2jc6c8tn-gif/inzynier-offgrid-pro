"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateDystrybucjaCiepla } from "@/lib/core/modules/ogrzewanie/dystrybucja-ciepla/calculator"
import type { SystemDystrybucji, ZrodloCiepla } from "@/lib/core/modules/ogrzewanie/dystrybucja-ciepla/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = "cieploRocznieKwh" | "copSystemu" | "copOdniesienia" | "doplataZl" | "cenaPraduZlKwh"

type FormularzStan = Record<PolaLiczbowe, string> & { zrodloCiepla: ZrodloCiepla | null; system: SystemDystrybucji | null }

const STAN_POCZATKOWY: FormularzStan = {
  zrodloCiepla: null,
  system: null,
  cieploRocznieKwh: "",
  copSystemu: "",
  copOdniesienia: "",
  doplataZl: "",
  cenaPraduZlKwh: "",
}

const KWOTY = przeliczPola<FormularzStan>("doplataZl", "cenaPraduZlKwh")

const ZRODLA: ZrodloCiepla[] = ["pompa-ciepla", "inne"]
const SYSTEMY: SystemDystrybucji[] = ["podlogowe", "grzejniki-niskotemperaturowe", "grzejniki-standardowe"]
const POZIOM = { dobre: "ok", zle: "blad", "inne-zrodlo": "ok" } as const

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function DystrybucjaCieplaPage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("dystrybucja-ciepla", STAN_POCZATKOWY, KWOTY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateDystrybucjaCiepla({
        zrodloCiepla: stan.zrodloCiepla,
        system: stan.system,
        cieploRocznieKwh: liczba(stan.cieploRocznieKwh),
        copSystemu: liczba(stan.copSystemu),
        copOdniesienia: liczba(stan.copOdniesienia),
        doplataZl: liczba(stan.doplataZl),
        cenaPraduZlKwh: liczba(stan.cenaPraduZlKwh),
      }),
    [stan],
  )
  const v = result.value
  const pompaNiskotemp = stan.zrodloCiepla === "pompa-ciepla" && stan.system !== null && stan.system !== "grzejniki-standardowe"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dystrybucja-ciepla" />
      <NaglowekEkranu tytul={t("UI-M6-DYS-TYTUL")} ekran="dystrybucja-ciepla" wynik={result}>
        {t("UI-M6-DYS-OPIS")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex items-center gap-1.5 text-small font-medium">
          {t("UI-M6-DYS-ZRODLO")} <PomocPola ekran="dystrybucja-ciepla" pole="zrodlo" />
        </legend>
        <div role="tablist" aria-label={t("UI-M6-DYS-ZRODLO")} className="flex flex-wrap gap-2">
          {ZRODLA.map((z) => (
            <Button key={z} role="tab" aria-selected={z === stan.zrodloCiepla} variant={z === stan.zrodloCiepla ? "default" : "outline"} onClick={() => setStan((prev) => ({ ...prev, zrodloCiepla: z }))}>
              {t(`UI-M6-DYS-Z-${z.toUpperCase()}`)}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex items-center gap-1.5 text-small font-medium">
          {t("UI-M6-DYS-SYSTEM")} <PomocPola ekran="dystrybucja-ciepla" pole="system" />
        </legend>
        <div role="tablist" aria-label={t("UI-M6-DYS-SYSTEM")} className="flex flex-wrap gap-2">
          {SYSTEMY.map((s) => (
            <Button key={s} role="tab" aria-selected={s === stan.system} variant={s === stan.system ? "default" : "outline"} onClick={() => setStan((prev) => ({ ...prev, system: s }))}>
              {t(`UI-M6-DYS-S-${s.toUpperCase()}`)}
            </Button>
          ))}
        </div>
      </fieldset>

      {pompaNiskotemp && (
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-small font-medium">{t("UI-M6-DYS-POROWNANIE")}</legend>
          <Pole label={t("UI-M6-DYS-COP-SYSTEMU")} {...pole("copSystemu")} pomoc={<PomocPola ekran="dystrybucja-ciepla" pole="copSystemu" />} />
          <Pole label={t("UI-M6-DYS-COP-ODNIESIENIA")} {...pole("copOdniesienia")} pomoc={<PomocPola ekran="dystrybucja-ciepla" pole="copOdniesienia" />} />
          <Pole label={t("UI-M6-DYS-CIEPLO")} unit={t("UI-J-KWH-ROK")} {...pole("cieploRocznieKwh")} pomoc={<PomocPola ekran="dystrybucja-ciepla" pole="cieplo" />} />
          <Pole label={t("UI-M6-DYS-CENA")} unit={t("UI-J-ZL-KWH")} {...pole("cenaPraduZlKwh")} pomoc={<PomocPola ekran="dystrybucja-ciepla" pole="cena" />} />
          <Pole label={t("UI-M6-DYS-DOPLATA")} unit={t("UI-J-ZL")} {...pole("doplataZl")} pomoc={<PomocPola ekran="dystrybucja-ciepla" pole="doplata" />} />
        </fieldset>
      )}

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={POZIOM[v.dopasowanie]} etykieta={t(`UI-M6-DYS-W-${v.dopasowanie.toUpperCase()}`)}>
          {v.oszczednoscPct !== null && <WynikGlowny>{t("UI-M6-DYS-WYNIK-PCT", { pct: Math.round(v.oszczednoscPct) })}</WynikGlowny>}
          {v.oszczednoscKwh !== 0 && (
            <p className="mt-1 text-small">
              {t("UI-M6-DYS-WYNIK-KWH", { sys: Math.round(v.energiaSystemuKwh), odn: Math.round(v.energiaOdniesieniaKwh), kwh: Math.round(v.oszczednoscKwh) })}
            </p>
          )}
          {v.oszczednoscZlRok !== null && <p className="mt-1 text-small">{t("UI-M6-DYS-WYNIK-ZL", { zl: Math.round(v.oszczednoscZlRok) })}</p>}
          {v.zwrotLat !== null && <p className="mt-1 text-small">{t("UI-M6-DYS-WYNIK-ZWROT", { lat: r1(v.zwrotLat) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/cop-pompy-ciepla" className="text-small underline">
          {t("UI-M6-DYS-LINK-COP")}
        </Link>
        <Link href="/kalkulatory/zapotrzebowanie-co-cwu" className="text-small underline">
          {t("UI-M6-DYS-LINK-ZAPOTRZEBOWANIE")}
        </Link>
        <Link href="/kalkulatory/pojemnosc-cieplna" className="text-small underline">
          {t("UI-M6-DYS-LINK-BEZWLADNOSC")}
        </Link>
      </div>
    </main>
  )
}
