"use client"

import { useMemo } from "react"
import { calculateMocPozornaCosfi } from "@/lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi/calculator"
import { DOMYSLNY_COS_FI } from "@/lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  mocCzynnaW: string
  cosFi: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocCzynnaW: "",
  cosFi: String(DOMYSLNY_COS_FI),
}

export default function MocPozornaCosfiPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("moc-pozorna-cosfi", STAN_POCZATKOWY)
  const { mocCzynnaW, cosFi } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocCzynnaW = (a: string | ((p: string) => string)) => setPole("mocCzynnaW", a)
  const setCosFi = (a: string | ((p: string) => string)) => setPole("cosFi", a)

  const result = useMemo(
    () =>
      calculateMocPozornaCosfi({
        mocCzynnaW: mocCzynnaW === "" ? 0 : Number(mocCzynnaW),
        cosFi: cosFi === "" ? 0 : Number(cosFi),
      }),
    [mocCzynnaW, cosFi],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/moc-pozorna-cosfi" />
      <NaglowekEkranu tytul={t("UI-MOCPOZCOS-MOC-POZORNA-COS")} ekran="moc-pozorna-cosfi">
        {t("UI-MOCPOZCOS-WATY-TABLICZCE-ZNAMIONOWEJ")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-MOCPOZCOS-MOC-CZYNNA-URZADZENIA")}
          unit="W"
          type="number"
          inputMode="decimal"
          value={mocCzynnaW}
          onChange={(e) => setMocCzynnaW(e.target.value)}
          pomoc={<PomocPola ekran="moc-pozorna-cosfi" pole="moc" />}
        />
        <Pole
          label={t("UI-MOCPOZCOS-WSPOLCZYNNIK-MOCY-COS")}
          type="number"
          inputMode="decimal"
          min={0}
          max={1}
          value={cosFi}
          onChange={(e) => setCosFi(e.target.value)}
          pomoc={<PomocPola ekran="moc-pozorna-cosfi" pole="cosFi" params={{ cosFi: DOMYSLNY_COS_FI }} />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-MOCPOZCOS-WYPELNIJ-DANE-ZEBY")}
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-MOCPOZCOS-SPRAWDZ-WPISANE-DANE")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-MOCPOZCOS-MOC-POZORNA")}>
          <WynikGlowny>
            {formatLiczbe(result.value.mocPozornaVA, { maximumFractionDigits: 0 })} VA
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
