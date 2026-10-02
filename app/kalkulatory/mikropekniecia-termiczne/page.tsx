"use client"

import { useMemo } from "react"
import { calculateMikropeknieciaTermiczne } from "@/lib/core/modules/pv/mikropekniecia-termiczne/calculator"
import {
  CZAS_DO_MIKROPEKNIEC_LATA,
  ODSTEP_DYLATACYJNY_MIN_MM,
  SCHLODZENIE_PRZY_DESZCZU_C,
  TEMPERATURA_PANELU_MAX_C,
  TEMPERATURA_PANELU_MIN_C,
} from "@/lib/core/modules/pv/mikropekniecia-termiczne/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  odstepDylatacyjnyMm: string
  podkladkiEpdm: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  odstepDylatacyjnyMm: "",
  podkladkiEpdm: false,
}

export default function MikropeknieciaTermicznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("mikropekniecia-termiczne", STAN_POCZATKOWY)
  const { odstepDylatacyjnyMm, podkladkiEpdm } = stan

  const result = useMemo(
    () =>
      calculateMikropeknieciaTermiczne({
        odstepDylatacyjnyMm: odstepDylatacyjnyMm === "" ? null : Number(odstepDylatacyjnyMm),
        podkladkiEpdm,
      }),
    [odstepDylatacyjnyMm, podkladkiEpdm],
  )

  const poziom: WerdyktPoziom = result.value.montazSztywny ? "uwaga" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/mikropekniecia-termiczne" />
      <NaglowekEkranu
        tytul={t("UI-MIKTER-MIKROPEKNIECIA-TERMICZNE")}
        ekran="mikropekniecia-termiczne"
        wynik={result}
        parametry={{ tMin: TEMPERATURA_PANELU_MIN_C, tMax: TEMPERATURA_PANELU_MAX_C, schlodzenie: SCHLODZENIE_PRZY_DESZCZU_C, odstepMin: ODSTEP_DYLATACYJNY_MIN_MM, lata: CZAS_DO_MIKROPEKNIEC_LATA }}
      >
        {t("UI-MIKTER-PANELE-NAGRZEWAJA-SLONCU", { TEMPERATURA_PANELU_MIN_C, TEMPERATURA_PANELU_MAX_C, SCHLODZENIE_PRZY_DESZCZU_C, CZAS_DO_MIKROPEKNIEC_LATA })}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <Pole
          label={t("UI-MIKTER-ODSTEP-DYLATACYJNY-MIEDZY")}
          unit="mm"
          type="number"
          inputMode="decimal"
          min={0}
          value={odstepDylatacyjnyMm}
          onChange={(e) => setStan((prev) => ({ ...prev, odstepDylatacyjnyMm: e.target.value }))}
          pomoc={<PomocPola ekran="mikropekniecia-termiczne" pole="odstep" params={{ odstepMin: ODSTEP_DYLATACYJNY_MIN_MM }} />}
        />
        <PoleCheckbox
          id="podkladki-epdm"
          checked={podkladkiEpdm}
          onChange={(e) => setStan((prev) => ({ ...prev, podkladkiEpdm: e.target.checked }))}
          label={t("UI-MIKTER-PODKLADKI-EPDM-GUMOWE")}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-MIKTER-OCENIC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-MIKTER-WPISZ-ODSTEP-DYLATACYJNY")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={result.value.montazSztywny ? t("UI-MIKTER-MONTAZ-SZTYWNY") : t("UI-MIKTER-MONTAZ-ELASTYCZNY")}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          {result.value.montazSztywny && (
            <p className="mt-2 text-small text-muted-foreground">
              {t("UI-MIKTER-ZALECANE-PODKLADKI-EPDM", { ODSTEP_DYLATACYJNY_MIN_MM })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
