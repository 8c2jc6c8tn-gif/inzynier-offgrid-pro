"use client"

import { useMemo } from "react"
import {
  classifyKatSamooczyszczania,
  ocenHarmonogramCzyszczenia,
} from "@/lib/core/modules/pv/czystosc-i-snieg/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { cn } from "@/lib/utils"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { KAT_PRZEJSCIOWY_MAX, KAT_SPLUKIWANIE_MAX, KAT_ZALEGANIE_MAX, SPADEK_PROG_MYCIA_PCT } from "@/lib/core/modules/pv/czystosc-i-snieg/constants"

type FormularzStan = {
  katStopni: string
  spadekProdukcjiPct: string
  deszczWCiaguKilkuDni: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  katStopni: "20",
  spadekProdukcjiPct: "3",
  deszczWCiaguKilkuDni: false,
}

export default function CzystoscISniegPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("czystosc-i-snieg", STAN_POCZATKOWY)
  const { katStopni, spadekProdukcjiPct, deszczWCiaguKilkuDni } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setKatStopni = (a: string | ((p: string) => string)) => setPole("katStopni", a)
  const setSpadekProdukcjiPct = (a: string | ((p: string) => string)) => setPole("spadekProdukcjiPct", a)
  const setDeszczWCiaguKilkuDni = (a: boolean | ((p: boolean) => boolean)) => setPole("deszczWCiaguKilkuDni", a)

  const katResult = useMemo(
    () => classifyKatSamooczyszczania({ katStopni: Number(katStopni) }),
    [katStopni],
  )

  const harmonogramResult = useMemo(
    () =>
      ocenHarmonogramCzyszczenia({
        spadekProdukcjiPct: Number(spadekProdukcjiPct),
        deszczWCiaguKilkuDni,
      }),
    [spadekProdukcjiPct, deszczWCiaguKilkuDni],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/czystosc-i-snieg" />
      <NaglowekEkranu
        tytul={t("UI-CZYISNI-CZYSTOSC-SNIEG-PANELACH")}
        ekran="czystosc-i-snieg" wynik={harmonogramResult}
        parametry={{ katZaleganie: KAT_ZALEGANIE_MAX, katPrzejsciowy: KAT_PRZEJSCIOWY_MAX, katSplukiwanie: KAT_SPLUKIWANIE_MAX, progMycia: SPADEK_PROG_MYCIA_PCT }}
      >
        {t("UI-CZYISNI-ZASYPANY-PANEL-MARTWY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <SekcjaAkordeon tytul={t("UI-CZYISNI-KAT-SAMOOCZYSZCZANIE")} domyslnieOtwarta>
          <div className="flex flex-col gap-3">
            <Pole
              label={t("UI-CZYISNI-KAT-POCHYLENIA-PANELU")}
              unit="°"
              type="number"
              inputMode="decimal"
              value={katStopni}
              onChange={(e) => setKatStopni(e.target.value)}
              pomoc={<PomocPola ekran="czystosc-i-snieg" pole="kat" />}
            />
            {katResult.status === "INVALID_INPUT" ? (
              <p className="text-small text-werdykt-blad">{t("UI-CZYISNI-KAT-MUSI-BYC")}</p>
            ) : (
              <p
                className={cn(
                  "text-small",
                  katResult.status === "VALID_WITH_WARNINGS" && "text-werdykt-uwaga",
                )}
              >
                {katResult.value.opis}
              </p>
            )}
          </div>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul={t("UI-CZYISNI-SNIEG-DOSTEPNOSC-SERWISOWA")}>
          <p className="text-small">
            {t("UI-CZYISNI-STREFACH-CZESTYMI-OPADAMI")}
          </p>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul={t("UI-CZYISNI-HARMONOGRAM-CZYSZCZENIA-LIVE")}>
          <div className="flex flex-col gap-3">
            <Pole
              label={t("UI-CZYISNI-SPADEK-PRODUKCJI-WZGLEDEM")}
              unit="%"
              type="number"
              inputMode="decimal"
              value={spadekProdukcjiPct}
              onChange={(e) => setSpadekProdukcjiPct(e.target.value)}
              pomoc={<PomocPola ekran="czystosc-i-snieg" pole="spadek" params={{ progMycia: SPADEK_PROG_MYCIA_PCT }} />}
            />
            <PoleCheckbox
              id="deszcz-prognozowany"
              label={t("UI-CZYISNI-DESZCZ-PROGNOZOWANY-CIAGU")}
              checked={deszczWCiaguKilkuDni}
              onChange={(e) => setDeszczWCiaguKilkuDni(e.target.checked)}
            />

            {harmonogramResult.status === "INVALID_INPUT" ? (
              <p className="text-small text-werdykt-blad">{t("UI-CZYISNI-SPADEK-MUSI-BYC")}</p>
            ) : (
              <WerdyktPanel
                poziom={harmonogramResult.value.rekomendacjaMycia ? "uwaga" : "ok"}
                etykieta={harmonogramResult.value.rekomendacjaMycia ? t("UI-CZYISNI-ZALECANE-MYCIE-PANELI") : t("UI-CZYISNI-MYCIE-NIEPOTRZEBNE")}
                className="p-3 text-small"
              >
                <p className="mt-1">{harmonogramResult.value.powod}</p>
                {harmonogramResult.assumptions.map((a, i) => (
                  <p key={typeof a === "string" ? a : a.kod + i} className="mt-1 opacity-80">
                    {t("UI-CZYISNI-ZALOZENIE")} {typeof a === "string" ? a : t(a.kod, a.params)}
                  </p>
                ))}
              </WerdyktPanel>
            )}
          </div>
        </SekcjaAkordeon>
      </div>
    </main>
  )
}
