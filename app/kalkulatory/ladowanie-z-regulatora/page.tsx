"use client"

import { useMemo } from "react"
import { calculateLadowanieZRegulatora, type Ograniczenie } from "@/lib/core/modules/kalkulator-mobilny/ladowanie-z-regulatora/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { WyborUrzadzeniaPv } from "@/components/urzadzenia-pv/wybor-urzadzenia"
import { znajdzUrzadzeniePv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { limityZUrzadzenia } from "@/lib/core/modules/pv/porownywarka-paneli/dopasowanie-urzadzenia"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  urzadzenieId: string
  mocPaneliW: string
  napiecieAkumulatoraV: string
  pojemnoscAh: string
  maksPradAkumulatoraA: string
  regulatorPradMaxA: string
  regulatorMocPvMaxW: string
  sprawnoscPct: string
  socOdPct: string
  socDoPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  urzadzenieId: "",
  mocPaneliW: "",
  napiecieAkumulatoraV: "",
  pojemnoscAh: "",
  maksPradAkumulatoraA: "",
  regulatorPradMaxA: "",
  regulatorMocPvMaxW: "",
  sprawnoscPct: "",
  socOdPct: "",
  socDoPct: "",
}

// Empty field = no data (never a default): the engine treats `null` as "limit unknown".
const liczba = (s: string): number | null => (s.trim() === "" ? null : Number(s))
const tekst = (x: number | null) => (x === null ? "" : String(x))

const KLUCZ_OGRANICZENIA: Record<Ograniczenie, string> = {
  panele: "UI-LADREG-OGRANICZA-PANELE",
  regulator: "UI-LADREG-OGRANICZA-REGULATOR",
  akumulator: "UI-LADREG-OGRANICZA-AKUMULATOR",
}

export default function LadowanieZRegulatoraPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const f2 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const f0 = (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 })
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ladowanie-z-regulatora", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  function wybierzUrzadzenie(id: string) {
    const u = znajdzUrzadzeniePv(id)
    if (!u) return
    // Fields the card does not state are cleared, so limits of the previously chosen device never stay behind.
    setStan((prev) => {
      const wpisane = liczba(prev.napiecieAkumulatoraV)
      const napiecie = wpisane ?? (u.napieciaAkumulatoraV?.length === 1 ? u.napieciaAkumulatoraV[0]! : null)
      return {
        ...prev,
        urzadzenieId: id,
        napiecieAkumulatoraV: tekst(napiecie),
        regulatorPradMaxA: tekst(u.pradLadowaniaMaxA),
        regulatorMocPvMaxW: tekst(limityZUrzadzenia(u, napiecie).mocLimitW),
      }
    })
  }

  const result = useMemo(
    () =>
      calculateLadowanieZRegulatora({
        mocPaneliW: liczba(stan.mocPaneliW),
        napiecieAkumulatoraV: liczba(stan.napiecieAkumulatoraV),
        pojemnoscAh: liczba(stan.pojemnoscAh),
        maksPradLadowaniaAkumulatoraA: liczba(stan.maksPradAkumulatoraA),
        regulatorPradMaxA: liczba(stan.regulatorPradMaxA),
        regulatorMocPvMaxW: liczba(stan.regulatorMocPvMaxW),
        sprawnoscRegulatoraPct: liczba(stan.sprawnoscPct),
        socOdPct: liczba(stan.socOdPct),
        socDoPct: liczba(stan.socDoPct),
      }),
    [stan],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical") ? "blad" : result.warnings.some((w) => w.level === "warning") ? "uwaga" : "ok"
  const etykieta = { blad: t("UI-LADREG-BLAD"), uwaga: t("UI-LADREG-W-UWAGA"), ok: t("UI-LADREG-W-OK") }[poziom]
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ladowanie-z-regulatora" />
      <NaglowekEkranu tytul={t("UI-LADREG-TYTUL")} ekran="ladowanie-z-regulatora" wynik={result}>
        {t("UI-LADREG-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium text-muted-foreground">{t("UI-LADREG-PANELE")}</p>
        <Pole label={t("UI-LADREG-MOC-PANELI")} unit="W" type="number" inputMode="decimal" min={0} value={stan.mocPaneliW} onChange={ustaw("mocPaneliW")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="mocPaneli" />} />

        <p className="text-small font-medium text-muted-foreground">{t("UI-LADREG-REGULATOR")}</p>
        <p className="text-small text-muted-foreground">{t("UI-LADREG-KATALOG-INFO")}</p>
        <WyborUrzadzeniaPv urzadzenieId={stan.urzadzenieId} onWybierz={wybierzUrzadzenie} rodzaje={["regulator-mppt", "falownik-hybrydowy"]} />
        <Pole label={t("UI-LADREG-PRAD-REGULATORA")} unit="A" type="number" inputMode="decimal" min={0} value={stan.regulatorPradMaxA} onChange={ustaw("regulatorPradMaxA")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="pradRegulatora" />} />
        <Pole label={t("UI-LADREG-MOC-REGULATORA")} unit="W" type="number" inputMode="decimal" min={0} value={stan.regulatorMocPvMaxW} onChange={ustaw("regulatorMocPvMaxW")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="mocRegulatora" />} />
        <Pole label={t("UI-LADREG-SPRAWNOSC")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.sprawnoscPct} onChange={ustaw("sprawnoscPct")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="sprawnosc" />} />

        <p className="text-small font-medium text-muted-foreground">{t("UI-LADREG-AKUMULATOR")}</p>
        <Pole label={t("UI-LADREG-NAPIECIE")} unit="V" type="number" inputMode="decimal" min={0} value={stan.napiecieAkumulatoraV} onChange={ustaw("napiecieAkumulatoraV")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="napiecie" />} />
        <NapiecieZProfilu aktualne={stan.napiecieAkumulatoraV} onUzyj={(v) => setStan((prev) => ({ ...prev, napiecieAkumulatoraV: v }))} />
        <Pole label={t("UI-LADREG-LIMIT-AKUMULATORA")} unit="A" type="number" inputMode="decimal" min={0} value={stan.maksPradAkumulatoraA} onChange={ustaw("maksPradAkumulatoraA")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="limitAkumulatora" />} />
        <Pole label={t("UI-LADREG-POJEMNOSC")} unit="Ah" type="number" inputMode="decimal" min={0} value={stan.pojemnoscAh} onChange={ustaw("pojemnoscAh")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="pojemnosc" />} />

        <p className="text-small font-medium text-muted-foreground">{t("UI-LADREG-ZAKRES")}</p>
        <Pole label={t("UI-LADREG-SOC-OD")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.socOdPct} onChange={ustaw("socOdPct")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="socOd" />} />
        <Pole label={t("UI-LADREG-SOC-DO")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.socDoPct} onChange={ustaw("socDoPct")} pomoc={<PomocPola ekran="ladowanie-z-regulatora" pole="socDo" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-LADREG-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-LADREG-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikGlowny>{f1(v.pradLadowaniaA)} A</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-LADREG-WYNIK", { moc: f0(v.mocLadowaniaW) })}</p>
          <p className="text-small">{t(KLUCZ_OGRANICZENIA[v.ograniczenie])}</p>
          {v.nadmiarMocyW > 0 && <p className="text-small">{t("UI-LADREG-NADMIAR", { przyjeta: f0(v.mocPrzyjetaW), nadmiar: f0(v.nadmiarMocyW) })}</p>}
          {v.cRate !== null && <p className="text-small">{t("UI-LADREG-C-RATE", { c: f2(v.cRate) })}</p>}
          {v.czasLadowaniaH !== null && v.energiaDoAkumulatoraWh !== null ? (
            <p className="text-small">{t("UI-LADREG-CZAS", { odPct: stan.socOdPct, doPct: stan.socDoPct, h: f1(v.czasLadowaniaH), wh: f0(v.energiaDoAkumulatoraWh) })}</p>
          ) : (
            <p className="text-small text-muted-foreground">{t("UI-LADREG-CZAS-BRAK")}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
