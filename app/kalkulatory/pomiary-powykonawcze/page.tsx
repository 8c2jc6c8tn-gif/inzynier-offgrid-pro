"use client"

import { useMemo } from "react"
import { calculatePomiaryPowykonawcze } from "@/lib/core/modules/okablowanie/pomiary-powykonawcze/calculator"
import type { CelUziemienia } from "@/lib/core/modules/okablowanie/pomiary-powykonawcze/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { MAX_CZAS_ZADZIALANIA_RCD_S, MIN_REZYSTANCJA_IZOLACJI_MOHM } from "@/lib/core/modules/okablowanie/pomiary-powykonawcze/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  ciagloscPotwierdzona: boolean
  rezystancjaIzolacjiMohm: string
  celUziemienia: CelUziemienia
  rezystancjaUziemieniaOhm: string
  czasZadzialaniaRcdS: string
  testZwarciowyPotwierdzony: boolean
  termowizjaPotwierdzona: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  ciagloscPotwierdzona: false,
  rezystancjaIzolacjiMohm: "",
  celUziemienia: "ochronna",
  rezystancjaUziemieniaOhm: "",
  czasZadzialaniaRcdS: "",
  testZwarciowyPotwierdzony: false,
  termowizjaPotwierdzona: false,
}

export default function PomiaryPowykonawczePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pomiary-powykonawcze", STAN_POCZATKOWY)
  const {
    ciagloscPotwierdzona,
    rezystancjaIzolacjiMohm,
    celUziemienia,
    rezystancjaUziemieniaOhm,
    czasZadzialaniaRcdS,
    testZwarciowyPotwierdzony,
    termowizjaPotwierdzona,
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
  const setCiagloscPotwierdzona = (a: boolean | ((p: boolean) => boolean)) => setPole("ciagloscPotwierdzona", a)
  const setRezystancjaIzolacjiMohm = (a: string | ((p: string) => string)) => setPole("rezystancjaIzolacjiMohm", a)
  const setCelUziemienia = (a: CelUziemienia | ((p: CelUziemienia) => CelUziemienia)) => setPole("celUziemienia", a)
  const setRezystancjaUziemieniaOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaUziemieniaOhm", a)
  const setCzasZadzialaniaRcdS = (a: string | ((p: string) => string)) => setPole("czasZadzialaniaRcdS", a)
  const setTestZwarciowyPotwierdzony = (a: boolean | ((p: boolean) => boolean)) => setPole("testZwarciowyPotwierdzony", a)
  const setTermowizjaPotwierdzona = (a: boolean | ((p: boolean) => boolean)) => setPole("termowizjaPotwierdzona", a)

  const result = useMemo(
    () =>
      calculatePomiaryPowykonawcze({
        ciagloscPotwierdzona,
        rezystancjaIzolacjiMohm: rezystancjaIzolacjiMohm === "" ? 0 : Number(rezystancjaIzolacjiMohm),
        celUziemienia,
        rezystancjaUziemieniaOhm: rezystancjaUziemieniaOhm === "" ? 0 : Number(rezystancjaUziemieniaOhm),
        czasZadzialaniaRcdS: czasZadzialaniaRcdS === "" ? 0 : Number(czasZadzialaniaRcdS),
        testZwarciowyPotwierdzony,
        termowizjaPotwierdzona,
      }),
    [
      ciagloscPotwierdzona,
      rezystancjaIzolacjiMohm,
      celUziemienia,
      rezystancjaUziemieniaOhm,
      czasZadzialaniaRcdS,
      testZwarciowyPotwierdzony,
      termowizjaPotwierdzona,
    ],
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
    invalid: t("UI-POMPOW-POLICZYC"),
    incomplete: t("UI-POMPOW-WYPELNIJ-TESTY-POWYKONAWCZE"),
    red: t("UI-POMPOW-BRAK-FORMALNEGO-ODBIORU"),
    green: t("UI-POMPOW-WSZYSTKIE-TESTY-NORMIE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pomiary-powykonawcze" />
      <NaglowekEkranu
        tytul={t("UI-POMPOW-POMIARY-TESTY-POWYKONAWCZE")}
        ekran="pomiary-powykonawcze"
        wynik={result}
        parametry={{ minIzolacja: MIN_REZYSTANCJA_IZOLACJI_MOHM, maxRcd: MAX_CZAS_ZADZIALANIA_RCD_S }}
      >
        {t("UI-POMPOW-OSTATNI-KROK-PRZED")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="ciaglosc-potwierdzona"
          label={t("UI-POMPOW-CIAGLOSC-PRZEWODOW-OCHRONNYC")}
          checked={ciagloscPotwierdzona}
          onChange={(e) => setCiagloscPotwierdzona(e.target.checked)}
        />
        <Pole
          label={t("UI-POMPOW-REZYSTANCJA-IZOLACJI-WYMAGAN")}
          unit="MΩ"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaIzolacjiMohm}
          onChange={(e) => setRezystancjaIzolacjiMohm(e.target.value)}
          pomoc={<PomocPola ekran="pomiary-powykonawcze" pole="izolacja" params={{ minIzolacja: MIN_REZYSTANCJA_IZOLACJI_MOHM }} />}
        />
        <PoleSelect
          label={t("UI-POMPOW-CEL-UZIEMIENIA")}
          value={celUziemienia}
          onChange={(e) => setCelUziemienia(e.target.value as CelUziemienia)}
          pomoc={<PomocPola ekran="pomiary-powykonawcze" pole="celUziemienia" />}
        >
          <option value="odgromowa">{t("UI-POMPOW-ODGROMOWE-PROG")}</option>
          <option value="ochronna">{t("UI-POMPOW-OCHRONNE-PROG")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-POMPOW-REZYSTANCJA-UZIEMIENIA")}
          unit="Ω"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaUziemieniaOhm}
          onChange={(e) => setRezystancjaUziemieniaOhm(e.target.value)}
          pomoc={<PomocPola ekran="pomiary-powykonawcze" pole="uziemienie" />}
        />
        <Pole
          label={t("UI-POMPOW-CZAS-ZADZIALANIA-RCD")}
          unit="s"
          type="number"
          inputMode="decimal"
          min={0}
          value={czasZadzialaniaRcdS}
          onChange={(e) => setCzasZadzialaniaRcdS(e.target.value)}
          pomoc={<PomocPola ekran="pomiary-powykonawcze" pole="rcd" params={{ maxRcd: MAX_CZAS_ZADZIALANIA_RCD_S }} />}
        />
        <PoleCheckbox
          id="test-zwarciowy-potwierdzony"
          label={t("UI-POMPOW-TEST-ZWARCIOWY-PETLI")}
          checked={testZwarciowyPotwierdzony}
          onChange={(e) => setTestZwarciowyPotwierdzony(e.target.checked)}
        />
        <PoleCheckbox
          id="termowizja-potwierdzona"
          label={t("UI-POMPOW-TERMOWIZJA-POLACZEN-POTWIERD")}
          checked={termowizjaPotwierdzona}
          onChange={(e) => setTermowizjaPotwierdzona(e.target.checked)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>
            {t("UI-POMPOW-TESTOW-NORMIE", { testowPrzeszlo: result.value.testowPrzeszlo, testowLacznie: result.value.testowLacznie })}
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
      </WerdyktPanel>
    </main>
  )
}
