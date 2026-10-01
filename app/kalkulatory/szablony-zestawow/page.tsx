"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateSzablonyZestawow } from "@/lib/core/modules/kalkulator-mobilny/szablony-zestawow/calculator"
import { KOLEJNOSC_SZABLONOW, SZABLONY, type SzablonZestawu } from "@/lib/core/modules/kalkulator-mobilny/szablony-zestawow/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; mocW: string; godzinNaDobe: string; naOsobe: boolean }

type PolaLiczbowe = "dni" | "osoby" | "napiecieV" | "dodPct" | "godzinSlonca" | "sprawnoscToruPct"

type FormularzStan = Record<PolaLiczbowe, string> & { szablon: SzablonZestawu; urzadzenia: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = {
  szablon: "kamper",
  dni: "",
  osoby: "",
  napiecieV: "",
  dodPct: "",
  godzinSlonca: "",
  sprawnoscToruPct: "",
  urzadzenia: [],
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function SzablonyZestawowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("szablony-zestawow", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  const wczytaj = () =>
    setStan((prev) => ({
      ...prev,
      urzadzenia: SZABLONY[prev.szablon].map((p) => ({ id: crypto.randomUUID(), nazwa: t(p.nazwa), mocW: "", godzinNaDobe: "", naOsobe: p.naOsobe })),
    }))

  const result = useMemo(
    () =>
      calculateSzablonyZestawow({
        szablon: stan.szablon,
        dni: liczba(stan.dni),
        osoby: liczba(stan.osoby),
        urzadzenia: stan.urzadzenia.map((u) => ({ nazwa: u.nazwa, mocW: liczba(u.mocW), godzinNaDobe: liczba(u.godzinNaDobe), naOsobe: u.naOsobe })),
        napiecieV: liczba(stan.napiecieV),
        dodPct: liczba(stan.dodPct),
        godzinSlonca: liczba(stan.godzinSlonca),
        sprawnoscToruPct: liczba(stan.sprawnoscToruPct),
      }),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szablony-zestawow" />
      <NaglowekEkranu tytul={t("UI-M12-SZ-TYTUL")} ekran="szablony-zestawow" wynik={result}>
        {t("UI-M12-SZ-OPIS")}
      </NaglowekEkranu>

      <div role="tablist" aria-label={t("UI-M12-SZ-SZABLON")} className="flex flex-wrap gap-2">
        {KOLEJNOSC_SZABLONOW.map((s) => (
          <Button key={s} role="tab" aria-selected={s === stan.szablon} variant={s === stan.szablon ? "default" : "outline"} onClick={() => setStan((prev) => ({ ...prev, szablon: s }))}>
            {t(`UI-M12-SZ-S-${s.toUpperCase()}`)}
          </Button>
        ))}
      </div>
      <button type="button" onClick={wczytaj} className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted">
        {t("UI-M12-SZ-WCZYTAJ")}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M12-WK-DNI")} {...pole("dni")} pomoc={<PomocPola ekran="szablony-zestawow" pole="dni" />} />
        <Pole label={t("UI-M12-WK-OSOBY")} {...pole("osoby")} pomoc={<PomocPola ekran="szablony-zestawow" pole="osoby" />} />
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-SZ-URZADZENIA")}</legend>
        <ul className="flex flex-col gap-4">
          {stan.urzadzenia.map((u, i) => (
            <li key={u.id} className="flex flex-col gap-3 rounded-md border p-3">
              <Pole label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })} value={u.nazwa} onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })} pomoc={<PomocPola ekran="szablony-zestawow" pole="nazwa" />} />
              <div className="grid grid-cols-2 gap-3">
                <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={u.mocW} onChange={(e) => aktualizuj(u.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="szablony-zestawow" pole="moc" />} />
                <Pole label={t("UI-M12-WK-GODZINY")} unit={t("UI-M12-J-H-DOBE")} type="number" inputMode="decimal" min={0} max={24} value={u.godzinNaDobe} onChange={(e) => aktualizuj(u.id, { godzinNaDobe: e.target.value })} pomoc={<PomocPola ekran="szablony-zestawow" pole="godziny" />} />
              </div>
              <div className="flex items-center gap-2">
                <PoleCheckbox id={`${u.id}-na-osobe`} className="flex-1" label={t("UI-M12-WK-NA-OSOBE")} checked={u.naOsobe} onChange={(e) => aktualizuj(u.id, { naOsobe: e.target.checked })} />
                <PomocPola ekran="szablony-zestawow" pole="naOsobe" />
              </div>
              <button
                type="button"
                onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
                className="self-start text-caption text-muted-foreground underline"
                aria-label={t("UI-M12-MA-USUN-ETYKIETA", { n: i + 1 })}
              >
                {t("UI-M12-MA-USUN")}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setStan((prev) => ({ ...prev, urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", mocW: "", godzinNaDobe: "", naOsobe: false }] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-M12-MA-DODAJ")}
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-SZ-ZESTAW")}</legend>
        <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" {...pole("napiecieV")} pomoc={<PomocPola ekran="szablony-zestawow" pole="napiecie" />} />
        <Pole label={t("UI-M12-MA-DOD")} unit="%" max={100} {...pole("dodPct")} pomoc={<PomocPola ekran="szablony-zestawow" pole="dod" />} />
        <Pole label={t("UI-M12-WK-GODZIN-SLONCA")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinSlonca")} pomoc={<PomocPola ekran="szablony-zestawow" pole="godzinSlonca" />} />
        <Pole label={t("UI-M12-WK-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscToruPct")} pomoc={<PomocPola ekran="szablony-zestawow" pole="sprawnosc" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M12-SZ-W-OK")}>
          <WynikGlowny>{t("UI-M12-SZ-WYNIK", { doba: Math.round(v.zuzycieDobaWh), szczyt: Math.round(v.szczytW) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M12-SZ-AKUMULATOR", { pobyt: Math.ceil(v.minimalnyAhPobyt), doba: Math.ceil(v.minimalnyAhDoba) })}</p>
          {v.minimalnyPanelW > 0 && <p className="mt-1 text-small">{t("UI-M12-SZ-PANEL", { w: Math.ceil(v.minimalnyPanelW), a: r1(v.pradRegulatoraA) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/weekend" className="text-small underline">
          {t("UI-M12-SZ-LINK-WEEKEND")}
        </Link>
        <Link href="/kalkulatory/dobor-regulatora-pwm-mppt" className="text-small underline">
          {t("UI-M12-SZ-LINK-REGULATOR")}
        </Link>
      </div>
    </main>
  )
}
