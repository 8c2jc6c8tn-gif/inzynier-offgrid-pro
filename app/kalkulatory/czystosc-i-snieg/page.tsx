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
        tytul="Czystość i śnieg na panelach"
        ekran="czystosc-i-snieg"
        parametry={{ katZaleganie: KAT_ZALEGANIE_MAX, katPrzejsciowy: KAT_PRZEJSCIOWY_MAX, katSplukiwanie: KAT_SPLUKIWANIE_MAX, progMycia: SPADEK_PROG_MYCIA_PCT }}
      >
        Zasypany panel to martwy panel, a wiatr rozkłada śnieg jak piasek na pustyni —
        nierównomiernie. Trzy tematy poniżej uzupełniają się nawzajem. Moduł 3, Ekran 24.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <SekcjaAkordeon tytul="Kąt a samooczyszczanie" domyslnieOtwarta>
          <div className="flex flex-col gap-3">
            <Pole
              label="Kąt pochylenia panelu"
              unit="°"
              type="number"
              inputMode="decimal"
              value={katStopni}
              onChange={(e) => setKatStopni(e.target.value)}
              pomoc={<PomocPola ekran="czystosc-i-snieg" pole="kat" />}
            />
            {katResult.status === "INVALID_INPUT" ? (
              <p className="text-small text-werdykt-blad">Kąt musi być z przedziału 0–90°.</p>
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

        <SekcjaAkordeon tytul="Śnieg i dostępność serwisowa">
          <p className="text-small">
            W strefach z częstymi opadami śniegu &gt;10 cm panele dachowe bywają nieproduktywne
            przez dłuższy czas, a odśnieżanie dachu jest trudne i niebezpieczne. Rozważ 2–3
            panele naziemne jako łatwo dostępną rezerwę do odśnieżania w sezonie zimowym.
          </p>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul="Harmonogram czyszczenia — live">
          <div className="flex flex-col gap-3">
            <Pole
              label="Spadek produkcji względem oczekiwanej"
              unit="%"
              type="number"
              inputMode="decimal"
              value={spadekProdukcjiPct}
              onChange={(e) => setSpadekProdukcjiPct(e.target.value)}
              pomoc={<PomocPola ekran="czystosc-i-snieg" pole="spadek" params={{ progMycia: SPADEK_PROG_MYCIA_PCT }} />}
            />
            <PoleCheckbox
              id="deszcz-prognozowany"
              label="Deszcz prognozowany w ciągu najbliższych kilku dni"
              checked={deszczWCiaguKilkuDni}
              onChange={(e) => setDeszczWCiaguKilkuDni(e.target.checked)}
            />

            {harmonogramResult.status === "INVALID_INPUT" ? (
              <p className="text-small text-werdykt-blad">Spadek musi być z przedziału 0–100%.</p>
            ) : (
              <WerdyktPanel
                poziom={harmonogramResult.value.rekomendacjaMycia ? "uwaga" : "ok"}
                etykieta={harmonogramResult.value.rekomendacjaMycia ? "Zalecane mycie paneli" : "Mycie niepotrzebne"}
                className="p-3 text-small"
              >
                <p className="mt-1">{harmonogramResult.value.powod}</p>
                {harmonogramResult.assumptions.map((a, i) => (
                  <p key={typeof a === "string" ? a : a.kod + i} className="mt-1 opacity-80">
                    Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}
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
