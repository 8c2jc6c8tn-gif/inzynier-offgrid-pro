"use client"

import { useMemo } from "react"
import { calculateAlternatorVsPanele } from "@/lib/core/modules/kalkulator-mobilny/alternator-vs-panele/calculator"
import type { TypAkumulatoraLadowanie } from "@/lib/core/modules/kalkulator-mobilny/alternator-vs-panele/constants"
import type { AlternatorVsPaneleInput } from "@/lib/core/modules/kalkulator-mobilny/alternator-vs-panele/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe = Exclude<keyof AlternatorVsPaneleInput, "typAkumulatora" | "maDcDc">

type FormularzStan = Record<PolaLiczbowe, string> & {
  typAkumulatora: TypAkumulatoraLadowanie | ""
  maDcDc: "" | "tak" | "nie"
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieV: "",
  godzinJazdy: "",
  pradLadowaniaA: "",
  mocPaneluW: "",
  godzinSlonca: "",
  sprawnoscToruPct: "",
  zapotrzebowanieWhDoba: "",
  typAkumulatora: "",
  maDcDc: "",
  napiecieLadowaniaV: "",
  pojemnoscAh: "",
  socStartPct: "",
}

const TYPY: { id: TypAkumulatoraLadowanie; label: string }[] = [
  { id: "lifepo4", label: "UI-M12-AL-TYP-LIFEPO4" },
  { id: "agm", label: "UI-M12-AL-TYP-AGM" },
  { id: "kwasowy", label: "UI-M12-AL-TYP-KWASOWY" },
]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function AlternatorVsPanelePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("alternator-vs-panele", STAN_POCZATKOWY)
  const ustaw = (klucz: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [klucz]: e.target.value }))
  const pole = (klucz: PolaLiczbowe) => ({ type: "number", inputMode: "decimal" as const, min: 0, value: stan[klucz], onChange: ustaw(klucz) })

  const result = useMemo(
    () =>
      calculateAlternatorVsPanele({
        napiecieV: liczba(stan.napiecieV),
        godzinJazdy: liczba(stan.godzinJazdy),
        pradLadowaniaA: liczba(stan.pradLadowaniaA),
        mocPaneluW: liczba(stan.mocPaneluW),
        godzinSlonca: liczba(stan.godzinSlonca),
        sprawnoscToruPct: liczba(stan.sprawnoscToruPct),
        zapotrzebowanieWhDoba: liczba(stan.zapotrzebowanieWhDoba),
        typAkumulatora: stan.typAkumulatora === "" ? null : stan.typAkumulatora,
        maDcDc: stan.maDcDc === "" ? null : stan.maDcDc === "tak",
        napiecieLadowaniaV: liczba(stan.napiecieLadowaniaV),
        pojemnoscAh: liczba(stan.pojemnoscAh),
        socStartPct: liczba(stan.socStartPct),
      }),
    [stan],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/alternator-vs-panele" />
      <NaglowekEkranu tytul={t("UI-M12-AL-TYTUL")} ekran="alternator-vs-panele" wynik={result}>
        {t("UI-M12-AL-OPIS")}
      </NaglowekEkranu>

      <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" {...pole("napiecieV")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="napiecie" />} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-AL-ALTERNATOR")}</legend>
        <Pole label={t("UI-M12-AL-GODZIN-JAZDY")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinJazdy")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="godzinJazdy" />} />
        <Pole label={t("UI-M12-AL-PRAD")} unit="A" {...pole("pradLadowaniaA")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="prad" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-AL-PANELE")}</legend>
        <Pole label={t("UI-M12-WK-MOC-PANELU")} unit="W" {...pole("mocPaneluW")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="mocPanelu" />} />
        <Pole label={t("UI-M12-WK-GODZIN-SLONCA")} unit={t("UI-M12-J-H-DOBE")} max={24} {...pole("godzinSlonca")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="godzinSlonca" />} />
        <Pole label={t("UI-M12-WK-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscToruPct")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="sprawnosc" />} />
      </fieldset>

      <Pole label={t("UI-M12-AL-ZAPOTRZEBOWANIE")} unit="Wh" {...pole("zapotrzebowanieWhDoba")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="zapotrzebowanie" />} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-AL-AKUMULATOR")}</legend>
        <PoleSelect label={t("UI-M12-AL-TYP")} value={stan.typAkumulatora} onChange={ustaw("typAkumulatora")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="typ" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {TYPY.map((o) => (
            <option key={o.id} value={o.id}>
              {t(o.label)}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect label={t("UI-M12-AL-DCDC")} value={stan.maDcDc} onChange={ustaw("maDcDc")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="dcdc" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="tak">{t("UI-TAK")}</option>
          <option value="nie">{t("UI-NIE")}</option>
        </PoleSelect>
        <Pole label={t("UI-M12-AL-NAPIECIE-LADOWANIA")} unit="V" {...pole("napiecieLadowaniaV")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="napiecieLadowania" />} />
        <Pole label={t("UI-M12-AL-POJEMNOSC")} unit="Ah" {...pole("pojemnoscAh")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="pojemnosc" />} />
        <Pole label={t("UI-M12-AL-SOC")} unit="%" max={100} {...pole("socStartPct")} pomoc={<PomocPola ekran="alternator-vs-panele" pole="soc" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={t(hasCritical ? "UI-M12-AL-W-STOP" : hasWarning ? "UI-M12-AL-W-UWAGA" : "UI-M12-AL-W-OK")}
        >
          <WynikGlowny>
            {t("UI-M12-AL-WYNIK", { alt: Math.round(v.energiaAlternatorWh), pv: Math.round(v.energiaPaneliWh), suma: Math.round(v.sumaWh) })}
          </WynikGlowny>
          {v.czasLadowaniaH > 0 && <p className="mt-1 text-small">{t("UI-M12-AL-CZAS", { h: r1(v.czasLadowaniaH) })}</p>}
          {v.oknoNapieciaV && <p className="mt-1 text-small">{t("UI-M12-AL-OKNO", { min: v.oknoNapieciaV.minV, max: v.oknoNapieciaV.maxV })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
