"use client"

import { useMemo } from "react"
import { calculateMonitorowanieIzolacjiImd } from "@/lib/core/modules/okablowanie/monitorowanie-izolacji-imd/calculator"
import { PRZYKLADOWY_PROG_ALARMU_KOM } from "@/lib/core/modules/okablowanie/monitorowanie-izolacji-imd/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  ukladIt: boolean
  maZainstalowanyImd: boolean
  progAlarmuKOm: string
}

const STAN_POCZATKOWY: FormularzStan = { ukladIt: false, maZainstalowanyImd: false, progAlarmuKOm: "" }

export default function MonitorowanieIzolacjiImdPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("monitorowanie-izolacji-imd", STAN_POCZATKOWY)
  const { ukladIt, maZainstalowanyImd, progAlarmuKOm } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const result = useMemo(
    () =>
      calculateMonitorowanieIzolacjiImd({
        ukladIt,
        maZainstalowanyImd,
        progAlarmuKOm: progAlarmuKOm === "" ? 0 : Number(progAlarmuKOm),
      }),
    [ukladIt, maZainstalowanyImd, progAlarmuKOm],
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
    invalid: t("UI-MONIZOIMD-POLICZYC"),
    incomplete: t("UI-MONIZOIMD-WPISZ-PROG-ALARMU"),
    red: t("UI-MONIZOIMD-ZABRONIONE-UKLAD-BEZ"),
    green: ukladIt ? t("UI-MONIZOIMD-IMD-ZAINSTALOWANY-POPRAWNIE") : t("UI-MONIZOIMD-IMD-WYMAGANY-TYM"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/monitorowanie-izolacji-imd" />
      <NaglowekEkranu
        tytul={t("UI-MONIZOIMD-MONITOROWANIE-IZOLACJI-IMD")}
        ekran="monitorowanie-izolacji-imd"
        wynik={result}
        parametry={{ progPrzyklad: PRZYKLADOWY_PROG_ALARMU_KOM }}
      >
        {t("UI-MONIZOIMD-UKLADZIE-BEZPOSREDNIEGO-UZIE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="uklad-it"
          label={t("UI-MONIZOIMD-UKLAD-SIECI-TYPU")}
          checked={ukladIt}
          onChange={(e) => setPole("ukladIt", e.target.checked)}
        />
        {ukladIt && (
          <>
            <PoleCheckbox
              id="ma-imd"
              label={t("UI-MONIZOIMD-IMD-JUZ-ZAINSTALOWANY")}
              checked={maZainstalowanyImd}
              onChange={(e) => setPole("maZainstalowanyImd", e.target.checked)}
            />
            {maZainstalowanyImd && (
              <Pole
                label={t("UI-MONIZOIMD-PROG-ALARMU-IMD")}
                unit="kΩ"
                type="number"
                inputMode="decimal"
                min={0}
                value={progAlarmuKOm}
                onChange={(e) => setPole("progAlarmuKOm", e.target.value)}
                pomoc={<PomocPola ekran="monitorowanie-izolacji-imd" pole="prog" params={{ progPrzyklad: PRZYKLADOWY_PROG_ALARMU_KOM }} />}
              />
            )}
          </>
        )}
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
