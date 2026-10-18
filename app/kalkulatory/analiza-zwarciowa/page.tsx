"use client"

import { useMemo } from "react"
import { calculateAnalizaZwarciowa } from "@/lib/core/modules/okablowanie/analiza-zwarciowa/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  napiecieBateriiV: string
  rezystancjaWewnetrznaBateriiOhm: string
  iscPanelaA: string
  liczbaStringowRownoleglych: string
  aicZabezpieczeniaA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  napiecieBateriiV: "",
  rezystancjaWewnetrznaBateriiOhm: "",
  iscPanelaA: "",
  liczbaStringowRownoleglych: "",
  aicZabezpieczeniaA: "",
}

export default function AnalizaZwarciowaPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("analiza-zwarciowa", STAN_POCZATKOWY)
  const { napiecieBateriiV, rezystancjaWewnetrznaBateriiOhm, iscPanelaA, liczbaStringowRownoleglych, aicZabezpieczeniaA } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setNapiecieBateriiV = (a: string | ((p: string) => string)) => setPole("napiecieBateriiV", a)
  const setRezystancjaWewnetrznaBateriiOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaWewnetrznaBateriiOhm", a)
  const setIscPanelaA = (a: string | ((p: string) => string)) => setPole("iscPanelaA", a)
  const setLiczbaStringowRownoleglych = (a: string | ((p: string) => string)) => setPole("liczbaStringowRownoleglych", a)
  const setAicZabezpieczeniaA = (a: string | ((p: string) => string)) => setPole("aicZabezpieczeniaA", a)

  const result = useMemo(
    () =>
      calculateAnalizaZwarciowa({
        napiecieBateriiV: napiecieBateriiV === "" ? 0 : Number(napiecieBateriiV),
        rezystancjaWewnetrznaBateriiOhm:
          rezystancjaWewnetrznaBateriiOhm === "" ? 0 : Number(rezystancjaWewnetrznaBateriiOhm),
        iscPanelaA: iscPanelaA === "" ? 0 : Number(iscPanelaA),
        liczbaStringowRownoleglych: liczbaStringowRownoleglych === "" ? 0 : Number(liczbaStringowRownoleglych),
        aicZabezpieczeniaA: aicZabezpieczeniaA === "" ? 0 : Number(aicZabezpieczeniaA),
      }),
    [napiecieBateriiV, rezystancjaWewnetrznaBateriiOhm, iscPanelaA, liczbaStringowRownoleglych, aicZabezpieczeniaA],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-ANAZWA-POLICZYC"),
    incomplete: t("UI-ANAZWA-WYPELNIJ-WSZYSTKIE-POLA"),
    red: t("UI-ANAZWA-ZABRONIONE-ZDOLNOSC-WYLACZAN"),
    green: t("UI-ANAZWA-PRAD-ZWARCIOWY-POLICZONY"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/analiza-zwarciowa" />
      <NaglowekEkranu tytul={t("UI-ANAZWA-ANALIZA-ZWARCIOWA")} ekran="analiza-zwarciowa" wynik={result}>
        {t("UI-ANAZWA-ZWARCIE-WYBUCH-TRZEBA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-ANAZWA-NAPIECIE-BATERII")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieBateriiV}
          onChange={(e) => setNapiecieBateriiV(e.target.value)}
          pomoc={<PomocPola ekran="analiza-zwarciowa" pole="napiecie" />}
        />
        <Pole
          label={t("UI-ANAZWA-REZYSTANCJA-WEWNETRZNA-PAKIE")}
          unit="Ω"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaWewnetrznaBateriiOhm}
          onChange={(e) => setRezystancjaWewnetrznaBateriiOhm(e.target.value)}
          pomoc={<PomocPola ekran="analiza-zwarciowa" pole="rezystancja" />}
        />
        <Pole
          label={t("UI-ANAZWA-PRAD-ZWARCIOWY-PANELU")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={iscPanelaA}
          onChange={(e) => setIscPanelaA(e.target.value)}
          pomoc={<PomocPola ekran="analiza-zwarciowa" pole="isc" />}
        />
        <Pole
          label={t("UI-ANAZWA-LICZBA-STRINGOW-ROWNOLEGLYCH")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaStringowRownoleglych}
          onChange={(e) => setLiczbaStringowRownoleglych(e.target.value)}
          pomoc={<PomocPola ekran="analiza-zwarciowa" pole="stringi" />}
        />
        <Pole
          label={t("UI-ANAZWA-AIC-SPRAWDZANEGO-ZABEZPIECZE")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={aicZabezpieczeniaA}
          onChange={(e) => setAicZabezpieczeniaA(e.target.value)}
          pomoc={<PomocPola ekran="analiza-zwarciowa" pole="aic" />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>
            {t("UI-ANAZWA-MAKS", { pradZwarciowyMaksymalnyA: formatLiczbe(result.value.pradZwarciowyMaksymalnyA) })}
          </WynikGlowny>
        )}
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <p className="mt-1 text-small text-muted-foreground">
            {t("UI-ANAZWA-BATERIA", { pradZwarciowyBateriaA: formatLiczbe(result.value.pradZwarciowyBateriaA), pradZwarciowyPvA: formatLiczbe(result.value.pradZwarciowyPvA) })}
          </p>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
      </WerdyktPanel>
    </main>
  )
}
