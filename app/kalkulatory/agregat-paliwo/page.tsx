"use client"

import { useMemo } from "react"
import { calculateAgregatPaliwo } from "@/lib/core/modules/kalkulator-mobilny/agregat-paliwo/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
  type BezpieczenstwoAgregatuStan,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"

type FormularzStan = BezpieczenstwoAgregatuStan & {
  mocAgregatuKw: string
  obciazeniePct: string
  zuzycieLH: string
  godzinNaDobe: string
  cenaZlL: string
  kosztPorownawczyZlKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocAgregatuKw: "",
  obciazeniePct: "",
  zuzycieLH: "",
  godzinNaDobe: "",
  cenaZlL: "",
  kosztPorownawczyZlKwh: "",
  miejsceAgregatu: "",
  podlaczenieAgregatu: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function AgregatPaliwoPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("agregat-paliwo", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateAgregatPaliwo({
        mocAgregatuKw: liczba(stan.mocAgregatuKw),
        obciazeniePct: liczba(stan.obciazeniePct),
        zuzycieLH: liczba(stan.zuzycieLH),
        godzinNaDobe: liczba(stan.godzinNaDobe),
        cenaZlL: liczba(stan.cenaZlL),
        kosztPorownawczyZlKwh: liczba(stan.kosztPorownawczyZlKwh),
        ...naWejscieBezpieczenstwa(stan),
      }),
    [stan],
  )
  // Directive #4 / D48: a critical safety answer turns the verdict red, even while the numbers are incomplete.
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/agregat-paliwo" />
      <NaglowekEkranu tytul={t("UI-M12-AP-TYTUL")} ekran="agregat-paliwo" wynik={result}>
        {t("UI-M12-AP-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label={t("UI-M12-AP-MOC")} unit="kW" type="number" inputMode="decimal" min={0} value={stan.mocAgregatuKw} onChange={ustaw("mocAgregatuKw")} pomoc={<PomocPola ekran="agregat-paliwo" pole="moc" />} />
        <Pole label={t("UI-M12-AP-OBCIAZENIE")} unit="%" type="number" inputMode="decimal" min={0} max={100} value={stan.obciazeniePct} onChange={ustaw("obciazeniePct")} pomoc={<PomocPola ekran="agregat-paliwo" pole="obciazenie" />} />
        <Pole label={t("UI-M12-AP-ZUZYCIE")} unit="l/h" type="number" inputMode="decimal" min={0} value={stan.zuzycieLH} onChange={ustaw("zuzycieLH")} pomoc={<PomocPola ekran="agregat-paliwo" pole="zuzycie" />} />
        <Pole label={t("UI-M12-AP-GODZINY")} unit="h" type="number" inputMode="decimal" min={0} max={24} value={stan.godzinNaDobe} onChange={ustaw("godzinNaDobe")} pomoc={<PomocPola ekran="agregat-paliwo" pole="godziny" />} />
        <Pole label={t("UI-M12-AP-CENA")} unit={t("UI-M12-J-ZL-L")} type="number" inputMode="decimal" min={0} value={stan.cenaZlL} onChange={ustaw("cenaZlL")} pomoc={<PomocPola ekran="agregat-paliwo" pole="cena" />} />
        <Pole label={t("UI-M12-AP-POROWNANIE")} unit={t("UI-M12-J-ZL-KWH")} type="number" inputMode="decimal" min={0} value={stan.kosztPorownawczyZlKwh} onChange={ustaw("kosztPorownawczyZlKwh")} pomoc={<PomocPola ekran="agregat-paliwo" pole="porownanie" />} />
      </div>

      <PolaBezpieczenstwaAgregatu
        miejsceAgregatu={stan.miejsceAgregatu}
        podlaczenieAgregatu={stan.podlaczenieAgregatu}
        onChange={(zmiana) => setStan((prev) => ({ ...prev, ...zmiana }))}
      />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        hasCritical ? (
          <WerdyktPanel poziom="blad" etykieta={t("UI-M12-AP-W-STOP")}>
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        ) : (
          <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
        )
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={t(hasCritical ? "UI-M12-AP-W-STOP" : "UI-M12-AP-W-OK")}>
          <WynikGlowny>{t("UI-M12-AP-LITRY", { l: r2(result.value.litrowNaDobe) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M12-AP-SZCZEGOLY", {
              koszt: r2(result.value.kosztNaDobeZl),
              kwh: r1(result.value.energiaNaDobeKwh),
              zlkwh: r2(result.value.kosztKwhZl),
            })}
          </p>
          {result.value.krotnoscPorownania > 0 && (
            <p className="mt-1 text-small">{t("UI-M12-AP-KROTNOSC", { x: r1(result.value.krotnoscPorownania) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
