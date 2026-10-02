"use client"

import { useMemo } from "react"
import { calculateOchronaStringow } from "@/lib/core/modules/pv/ochrona-stringow/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { K1_ISC_MAX, PROG_LICZBY_STRINGOW } from "@/lib/core/modules/pv/ochrona-stringow/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  iscStcA: string
  iModMaxOcprA: string
  liczbaStringowRownoleglych: string
  maZabezpieczeniaPerString: boolean
  sprawdzamWybrany: boolean
  wybranyBezpiecznikA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  iscStcA: "",
  iModMaxOcprA: "",
  liczbaStringowRownoleglych: "",
  maZabezpieczeniaPerString: false,
  sprawdzamWybrany: false,
  wybranyBezpiecznikA: "",
}

export default function OchronaStringowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-stringow", STAN_POCZATKOWY)
  const {
    iscStcA,
    iModMaxOcprA,
    liczbaStringowRownoleglych,
    maZabezpieczeniaPerString,
    sprawdzamWybrany,
    wybranyBezpiecznikA,
  } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setIscStcA = (a: string | ((p: string) => string)) => setPole("iscStcA", a)
  const setIModMaxOcprA = (a: string | ((p: string) => string)) => setPole("iModMaxOcprA", a)
  const setLiczbaStringowRownoleglych = (a: string | ((p: string) => string)) => setPole("liczbaStringowRownoleglych", a)
  const setMaZabezpieczeniaPerString = (a: boolean | ((p: boolean) => boolean)) => setPole("maZabezpieczeniaPerString", a)
  const setSprawdzamWybrany = (a: boolean | ((p: boolean) => boolean)) => setPole("sprawdzamWybrany", a)
  const setWybranyBezpiecznikA = (a: string | ((p: string) => string)) => setPole("wybranyBezpiecznikA", a)

  const result = useMemo(
    () =>
      calculateOchronaStringow({
        iscStcA: iscStcA === "" ? 0 : Number(iscStcA),
        iModMaxOcprA: iModMaxOcprA === "" ? 0 : Number(iModMaxOcprA),
        liczbaStringowRownoleglych:
          liczbaStringowRownoleglych === "" ? 0 : Number(liczbaStringowRownoleglych),
        maZabezpieczeniaPerString,
        wybranyBezpiecznikA:
          sprawdzamWybrany && wybranyBezpiecznikA !== "" ? Number(wybranyBezpiecznikA) : null,
      }),
    [iscStcA, iModMaxOcprA, liczbaStringowRownoleglych, maZabezpieczeniaPerString, sprawdzamWybrany, wybranyBezpiecznikA],
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
    invalid: t("UI-OCHSTR-POLICZYC"),
    incomplete: t("UI-OCHSTR-WYPELNIJ-WSZYSTKIE-POLA"),
    red: t("UI-OCHSTR-ZABRONIONE-NORMA-60364"),
    green: t("UI-OCHSTR-ZGODNE-NORMA-60364"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-stringow" />
      <NaglowekEkranu
        tytul={t("UI-OCHSTR-OCHRONA-STRINGOW")}
        ekran="ochrona-stringow"
        wynik={result}
        parametry={{ progStringow: PROG_LICZBY_STRINGOW, k1: K1_ISC_MAX }}
      >
        {t("UI-OCHSTR-CHRON-KAZDY-STRING")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-OCHSTR-PRAD-ZWARCIOWY-PANELU")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={iscStcA}
          onChange={(e) => setIscStcA(e.target.value)}
          pomoc={<PomocPola ekran="ochrona-stringow" pole="isc" />}
        />
        <Pole
          label={t("UI-OCHSTR-MAKS-PRAD-ZABEZPIECZENIA")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={iModMaxOcprA}
          onChange={(e) => setIModMaxOcprA(e.target.value)}
          pomoc={<PomocPola ekran="ochrona-stringow" pole="ocpr" />}
        />
        <Pole
          label={t("UI-OCHSTR-LICZBA-STRINGOW-ROWNOLEGLYCH")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaStringowRownoleglych}
          onChange={(e) => setLiczbaStringowRownoleglych(e.target.value)}
          pomoc={<PomocPola ekran="ochrona-stringow" pole="stringi" params={{ progStringow: PROG_LICZBY_STRINGOW }} />}
        />
        <PoleCheckbox
          id="ma-zabezpieczenia"
          label={t("UI-OCHSTR-ZAINSTALOWANE-ZABEZPIECZENIE")}
          checked={maZabezpieczeniaPerString}
          onChange={(e) => setMaZabezpieczeniaPerString(e.target.checked)}
        />
        <PoleCheckbox
          id="sprawdzam-wybrany"
          label={t("UI-OCHSTR-SPRAWDZAM-JUZ-WYBRANY")}
          checked={sprawdzamWybrany}
          onChange={(e) => setSprawdzamWybrany(e.target.checked)}
        />
        {sprawdzamWybrany && (
          <Pole
            label={t("UI-OCHSTR-PRAD-ZNAMIONOWY-WYBRANEGO")}
            unit="A"
            type="number"
            inputMode="decimal"
            min={0}
            value={wybranyBezpiecznikA}
            onChange={(e) => setWybranyBezpiecznikA(e.target.value)}
            pomoc={<PomocPola ekran="ochrona-stringow" pole="bezpiecznik" />}
          />
        )}
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>
            {result.value.inMinA.toFixed(2)}–{result.value.inMaxA.toFixed(2)} A
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
