"use client"

import { useMemo } from "react"
import { calculateWeekend } from "@/lib/core/modules/kalkulator-mobilny/weekend/calculator"
import { DOD_LIFEPO4_TYPOWY_MAX_PCT, DOD_LIFEPO4_TYPOWY_MIN_PCT } from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; mocW: string; godzinNaDobe: string; naOsobe: boolean }

type PolaLiczbowe = "dni" | "osoby" | "pojemnoscAh" | "napiecieV" | "dodPct" | "mocPaneluW" | "godzinSlonca" | "sprawnoscToruPct"

type FormularzStan = Record<PolaLiczbowe, string> & { urzadzenia: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = {
  dni: "",
  osoby: "",
  pojemnoscAh: "",
  napiecieV: "",
  dodPct: "",
  mocPaneluW: "",
  godzinSlonca: "",
  sprawnoscToruPct: "",
  urzadzenia: [],
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function WeekendPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("weekend", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))

  const result = useMemo(
    () =>
      calculateWeekend({
        dni: liczba(stan.dni),
        osoby: liczba(stan.osoby),
        pojemnoscAh: liczba(stan.pojemnoscAh),
        napiecieV: liczba(stan.napiecieV),
        dodPct: liczba(stan.dodPct),
        mocPaneluW: liczba(stan.mocPaneluW),
        godzinSlonca: liczba(stan.godzinSlonca),
        sprawnoscToruPct: liczba(stan.sprawnoscToruPct),
        urzadzenia: stan.urzadzenia.map((u) => ({
          nazwa: u.nazwa,
          mocW: liczba(u.mocW),
          godzinNaDobe: liczba(u.godzinNaDobe),
          naOsobe: u.naOsobe,
        })),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/weekend" />
      <NaglowekEkranu tytul={t("UI-M12-WK-TYTUL")} ekran="weekend" wynik={result}>
        {t("UI-M12-WK-OPIS")}
      </NaglowekEkranu>

      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M12-WK-DNI")} {...pole("dni")} pomoc={<PomocPola ekran="weekend" pole="dni" />} />
        <Pole label={t("UI-M12-WK-OSOBY")} {...pole("osoby")} pomoc={<PomocPola ekran="weekend" pole="osoby" />} />
      </div>

      <ul className="flex flex-col gap-4">
        {stan.urzadzenia.map((u, i) => (
          <li key={u.id} className="flex flex-col gap-3 rounded-md border p-3">
            <Pole
              label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })}
              placeholder={t("UI-M12-MA-NAZWA-PRZYKLAD")}
              value={u.nazwa}
              onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
              pomoc={<PomocPola ekran="weekend" pole="nazwa" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={u.mocW} onChange={(e) => aktualizuj(u.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="weekend" pole="moc" />} />
              <Pole label={t("UI-M12-WK-GODZINY")} unit={t("UI-M12-J-H-DOBE")} type="number" inputMode="decimal" min={0} max={24} value={u.godzinNaDobe} onChange={(e) => aktualizuj(u.id, { godzinNaDobe: e.target.value })} pomoc={<PomocPola ekran="weekend" pole="godziny" />} />
            </div>
            <div className="flex items-center gap-2">
              <PoleCheckbox id={`${u.id}-na-osobe`} className="flex-1" label={t("UI-M12-WK-NA-OSOBE")} checked={u.naOsobe} onChange={(e) => aktualizuj(u.id, { naOsobe: e.target.checked })} />
              <PomocPola ekran="weekend" pole="naOsobe" />
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
        onClick={() =>
          setStan((prev) => ({
            ...prev,
            urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", mocW: "", godzinNaDobe: "", naOsobe: false }],
          }))
        }
        className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
      >
        {t("UI-M12-MA-DODAJ")}
      </button>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-WK-AKUMULATOR")}</legend>
        <Pole label={t("UI-M12-MA-POJEMNOSC")} unit="Ah" {...pole("pojemnoscAh")} pomoc={<PomocPola ekran="weekend" pole="pojemnosc" />} />
        <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" {...pole("napiecieV")} pomoc={<PomocPola ekran="weekend" pole="napiecie" />} />
        <Pole
          label={t("UI-M12-MA-DOD")}
          unit="%"
          max={100}
          {...pole("dodPct")}
          pomoc={<PomocPola ekran="weekend" pole="dod" params={{ min: DOD_LIFEPO4_TYPOWY_MIN_PCT, max: DOD_LIFEPO4_TYPOWY_MAX_PCT }} />}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-WK-PANEL")}</legend>
        <Pole label={t("UI-M12-WK-MOC-PANELU")} unit="W" {...pole("mocPaneluW")} pomoc={<PomocPola ekran="weekend" pole="mocPanelu" />} />
        <Pole label={t("UI-M12-WK-GODZIN-SLONCA")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinSlonca")} pomoc={<PomocPola ekran="weekend" pole="godzinSlonca" />} />
        <Pole label={t("UI-M12-WK-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscToruPct")} pomoc={<PomocPola ekran="weekend" pole="sprawnosc" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-WK-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-WK-W-UWAGA" : "UI-M12-WK-W-OK")}>
          <WynikGlowny>{t("UI-M12-WK-DOBA", { wh: Math.round(v.zuzycieDobaWh) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M12-WK-SZCZEGOLY", { pobyt: Math.round(v.zuzyciePobytWh), akum: Math.round(v.energiaAkumulatoraWh), dni: r1(v.dniBezSlonca) })}
          </p>
          {v.produkcjaPaneluDobaWh > 0 && (
            <p className="mt-1 text-small">{t("UI-M12-WK-PANEL-WYNIK", { wh: Math.round(v.produkcjaPaneluDobaWh), bilans: Math.round(v.bilansPobytuWh) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
